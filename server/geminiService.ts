import { GoogleGenAI, Type } from '@google/genai';
import type {
  DailyLeetCodeQuestion,
  DailyReferenceLink,
  DailyYouTubeResource
} from '../src/types/index.ts';
import type { CurriculumDayContext } from '../src/data/dailyLearningCatalog.ts';
import {
  buildTrackMentorSystemInstruction,
  FREE_TIER_GEMINI_MODEL,
  isInvalidOrDisabledApiKeyStatusOrMsg,
  isQuotaOrRateLimitStatusOrMsg,
  type GeminiEnrichmentOutput,
  type GeminiGenerationResult
} from '../supabase/functions/daily-learning-resources/pipeline.ts';

export { FREE_TIER_GEMINI_MODEL, type GeminiEnrichmentOutput, type GeminiGenerationResult };

export interface GeminiClientLike {
  models: {
    generateContent: (params: {
      model: string;
      contents: string;
      config?: Record<string, unknown>;
    }) => Promise<{ text?: string }>;
  };
}

export function createServerGeminiClient(apiKey: string): GeminiClientLike {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  }) as unknown as GeminiClientLike;
}

function extractErrorDetails(err: unknown): { status: number; message: string } {
  if (!err || typeof err !== 'object') {
    return { status: 0, message: typeof err === 'string' ? err : 'Gemini API call failed.' };
  }
  const obj = err as Record<string, unknown>;
  const rawStatus =
    typeof obj.status === 'number'
      ? obj.status
      : typeof obj.statusCode === 'number'
      ? obj.statusCode
      : typeof obj.code === 'number'
      ? obj.code
      : 0;
  const message =
    typeof obj.message === 'string'
      ? obj.message
      : (() => {
          try {
            return JSON.stringify(obj);
          } catch {
            return 'Gemini API error';
          }
        })();
  return { status: rawStatus, message };
}

function isTransientServerError(status: number, message: string): boolean {
  if (status >= 500 && status < 600) return true;
  const lower = message.toLowerCase();
  return (
    lower.includes('timeout') ||
    lower.includes('econnreset') ||
    lower.includes('unavailable') ||
    lower.includes('503') ||
    lower.includes('502')
  );
}

export async function generateGroundedDailyBrief(
  ctx: CurriculumDayContext,
  tutorials: DailyYouTubeResource[],
  docs: DailyReferenceLink[],
  leetcodeQuestions: DailyLeetCodeQuestion[],
  geminiApiKey?: string,
  clientOverride?: GeminiClientLike
): Promise<GeminiGenerationResult> {
  const apiKey = (geminiApiKey ?? process.env.PREPARATION_GEMINI_KEY ?? '').trim();
  if (!apiKey && !clientOverride) {
    return {
      success: false,
      aiProviderStatus: 'missing_api_key',
      errorMessage: 'PREPARATION_GEMINI_KEY is not configured in server environment secrets.'
    };
  }

  const ai = clientOverride || createServerGeminiClient(apiKey);

  const promptPayload = {
    track: ctx.trackLabel,
    dayNumber: ctx.dayNumber,
    date: ctx.dateLabel,
    dayOfWeek: ctx.dayOfWeek,
    phaseOrModule: ctx.phaseOrModule,
    topic: ctx.topic,
    curriculumObjectives: ctx.objectives,
    practicalWork: ctx.practicalWork,
    expectedOutcome: ctx.expectedOutcome,
    deliverable: ctx.deliverable,
    youtubeTutorials: tutorials.map((t) => ({
      id: t.id,
      title: t.title,
      channelName: t.channelName,
      isVerifiedVideo: t.isVerifiedVideo,
      currentSummary: t.explanation
    })),
    officialDocs: docs.map((d) => ({ title: d.title, source: d.sourceLabel })),
    leetcodeQuestions: leetcodeQuestions.map((q) => ({
      difficulty: q.difficulty,
      available: q.available,
      title: q.title || 'Unavailable'
    }))
  };

  const requestParams = {
    model: FREE_TIER_GEMINI_MODEL,
    contents:
      'Generate structured, concise, grounded daily study guidance for this exact preparation curriculum day:\n' +
      JSON.stringify(promptPayload, null, 2),
    config: {
      systemInstruction: buildTrackMentorSystemInstruction(ctx.trackId),
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topicExplanation: { type: Type.STRING },
          learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
          practicalExamples: { type: Type.ARRAY, items: { type: Type.STRING } },
          revisionNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedLearningOrder: { type: Type.ARRAY, items: { type: Type.STRING } },
          dailyGuidance: { type: Type.STRING },
          practicalExerciseSummary: { type: Type.STRING },
          youtubeAnnotations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                topicCovered: { type: Type.STRING },
                explanation: { type: Type.STRING },
                whyUseful: { type: Type.STRING }
              },
              required: ['id', 'topicCovered', 'explanation', 'whyUseful']
            }
          }
        },
        required: [
          'topicExplanation',
          'learningObjectives',
          'practicalExamples',
          'revisionNotes',
          'commonMistakes',
          'suggestedLearningOrder',
          'dailyGuidance',
          'practicalExerciseSummary',
          'youtubeAnnotations'
        ]
      }
    }
  };

  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    try {
      const response = await Promise.race([
        ai.models.generateContent(requestParams),
        new Promise<never>((_, reject) => {
          timeoutHandle = setTimeout(() => {
            reject(new Error('Gemini API request timeout after 20000ms.'));
          }, 20000);
        })
      ]);
      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        return {
          success: false,
          aiProviderStatus: 'unavailable',
          errorMessage: 'Gemini returned an empty response.'
        };
      }

      const parsed = JSON.parse(rawText) as GeminiEnrichmentOutput;
      return {
        success: true,
        aiProviderStatus: 'gemini_generated',
        modelUsed: FREE_TIER_GEMINI_MODEL,
        data: parsed
      };
    } catch (err) {
      const { status, message } = extractErrorDetails(err);
      const quotaHit = isQuotaOrRateLimitStatusOrMsg(status, message);
      const invalidKey = !quotaHit && isInvalidOrDisabledApiKeyStatusOrMsg(status, message);

      if (!quotaHit && !invalidKey && attempt < maxAttempts && isTransientServerError(status, message)) {
        await new Promise((r) => setTimeout(r, 350));
        continue;
      }

      return {
        success: false,
        aiProviderStatus: quotaHit
          ? 'quota_exhausted_cached'
          : invalidKey
          ? 'invalid_api_key'
          : 'unavailable',
        errorMessage: quotaHit
          ? `Gemini quota exceeded or rate-limited (${status || '429'}).`
          : invalidKey
          ? 'PREPARATION_GEMINI_KEY is invalid, disabled, or denied permission. Check Settings > Secrets.'
          : `Gemini generation unavailable: ${message}`
      };
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    }
  }

  return {
    success: false,
    aiProviderStatus: 'unavailable',
    errorMessage: 'Gemini generation failed after retry.'
  };
}

