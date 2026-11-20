# Root Cause Analysis — `partially_updated`

## Symptom

The reported daily run records marked Main, DSA, and Azure as `partially_updated` even though the supplied audit says the run persisted 21 resource rows and all rows were marked verified. The prior run history and exact provider-status rows were not queried during this local-only audit, so the relationship to each historical run cannot be conclusively reconstructed.

## Confirmed source cause

In `supabase/functions/daily-learning-resources/pipeline.ts`, the previous rule was:

```ts
aiStatus === 'gemini_generated' &&
ytResult.providerStatus === 'youtube_api_verified'
```

Any false result forced the track status to `partially_updated`. This included a Gemini outage or missing Gemini key, despite the code building a grounded curriculum fallback. Downstream aggregators in `server/dailyResourcesService.ts`, `server.ts`, `api/daily-resources/index.ts`, and the Supabase Edge Function correctly treated any track status other than `updated` as an overall partial run. The aggregator propagated the upstream status; it did not create the track-level failure.

## Fix applied locally

The pipeline now has `hasCompleteRequiredTrackResources()`. A refreshed track is `updated` only when the required content exists, official docs and practical exercises are marked verified, at least one direct verified YouTube video was accepted by the existing discovery/revalidation flow, and DSA has all three available, verified slots. Gemini is enrichment: its provider status and a specific fallback/error message remain in the result. Thus a Gemini error is not concealed and does not invalidate an otherwise complete, verified resource set. A missing video, invalid document/exercise, or incomplete DSA set remains partial.

The automation aggregators were not changed. They continue to mark the overall run partial if a track is actually incomplete or a required email send fails.

The new completeness gate is applied only to the Owner refresh path. The Guest branch retains the previous AI-plus-YouTube status rule and message behavior; Guest state, schedule, access and resource discovery are unchanged.

## Regression evidence

- An integration test generates an Azure resource with mocked verified Microsoft Azure video metadata while Gemini reports a simulated outage; it asserts `status === 'updated'`, `aiProviderStatus === 'unavailable'`, verified YouTube status, and a visible Gemini warning.
- A focused status-gate test confirms missing/unverified videos, docs, or DSA slots remain incomplete.
- Existing test coverage asserts Guest API behavior, the six coding-channel allowlist, non-coding Telugu/English preference, Azure channel preference, and cached video revalidation.

## Historical uncertainty

The code defect is confirmed and reproduces locally. The exact combination of statuses and rows for the Nov 18–20 production runs is not confirmed here because production access was explicitly prohibited. If those runs had an additional missing/unverified required resource or failed email, they would correctly remain partial after this fix. Re-run the automation after deployment and inspect the resulting track/provider statuses before treating the historical diagnosis as a complete explanation.
