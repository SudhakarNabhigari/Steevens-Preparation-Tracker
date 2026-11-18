import type { DailyResourcesDashboardPayload } from '../src/types/index.ts';
import {
  buildDailyEmailContent as canonicalBuildDailyEmailContent,
  DEFAULT_APP_URL,
  DEFAULT_DAILY_RECIPIENT,
  sendDailyEmailViaResend as canonicalSendDailyEmailViaResend,
  type EmailDeliveryResult
} from '../supabase/functions/daily-learning-resources/pipeline.ts';

export { DEFAULT_APP_URL, DEFAULT_DAILY_RECIPIENT, type EmailDeliveryResult };

export function buildDailyEmailContent(payload: DailyResourcesDashboardPayload) {
  return canonicalBuildDailyEmailContent(payload, process.env.APP_URL);
}

export async function sendDailyEmailViaResend(
  payload: DailyResourcesDashboardPayload,
  options?: { idempotencySuffix?: string }
): Promise<EmailDeliveryResult> {
  return canonicalSendDailyEmailViaResend(
    payload,
    {
      resendApiKey: process.env.RESEND_API_KEY,
      resendFromEmail: process.env.RESEND_FROM_EMAIL,
      dailyRecipientEmail: process.env.DAILY_REPORT_RECIPIENT_EMAIL,
      appUrl: process.env.APP_URL
    },
    options
  );
}
