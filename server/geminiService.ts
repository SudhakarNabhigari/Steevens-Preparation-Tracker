import type {
  DailyLeetCodeQuestion,
  DailyReferenceLink,
  DailyYouTubeResource
} from '../src/types/index.ts';
import type { CurriculumDayContext } from '../src/data/dailyLearningCatalog.ts';
import {
  FREE_TIER_GEMINI_MODEL,
  generateGroundedDailyBrief as canonicalGenerateGroundedDailyBrief,
  type GeminiEnrichmentOutput,
  type GeminiGenerationResult
} from '../supabase/functions/daily-learning-resources/pipeline.ts';

export { FREE_TIER_GEMINI_MODEL, type GeminiEnrichmentOutput, type GeminiGenerationResult };

export async function generateGroundedDailyBrief(
  ctx: CurriculumDayContext,
  tutorials: DailyYouTubeResource[],
  docs: DailyReferenceLink[],
  leetcodeQuestions: DailyLeetCodeQuestion[]
): Promise<GeminiGenerationResult> {
  return canonicalGenerateGroundedDailyBrief(
    ctx,
    tutorials,
    docs,
    leetcodeQuestions,
    process.env.GEMINI_API_KEY
  );
}
