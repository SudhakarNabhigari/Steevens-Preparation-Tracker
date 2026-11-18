import type { DailyYouTubeResource } from '../src/types/index.ts';
import type { CurriculumDayContext } from '../src/data/dailyLearningCatalog.ts';
import {
  buildSearchFallbackTutorials as canonicalBuildSearchFallback,
  discoverYouTubeTutorials as canonicalDiscoverYouTubeTutorials,
  type YouTubeDiscoveryResult
} from '../supabase/functions/daily-learning-resources/pipeline.ts';

export type { YouTubeDiscoveryResult };

export function buildSearchFallbackTutorials(ctx: CurriculumDayContext): DailyYouTubeResource[] {
  return canonicalBuildSearchFallback(ctx) as DailyYouTubeResource[];
}

export async function discoverYouTubeTutorials(
  ctx: CurriculumDayContext
): Promise<YouTubeDiscoveryResult> {
  return canonicalDiscoverYouTubeTutorials(ctx, process.env.YOUTUBE_API_KEY);
}
