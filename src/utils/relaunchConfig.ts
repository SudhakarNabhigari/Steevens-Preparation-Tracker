// Shared launch constants kept dependency-free so serverless status routes do
// not load browser storage or the daily-resource pipeline merely to report time.
export const OWNER_RELAUNCH_CYCLE_ID = 'owner-cycle-2026-11-23';
export const OWNER_RELAUNCH_START_ISO_IST = '2026-11-23T00:00:00+05:30';
export const OWNER_RELAUNCH_START_MS = Date.parse(OWNER_RELAUNCH_START_ISO_IST);
export const OWNER_RESTART_EMAIL_EARLIEST_ISO_IST = '2026-11-21T10:00:00+05:30';
export const OWNER_RESTART_EMAIL_EARLIEST_MS = Date.parse(OWNER_RESTART_EMAIL_EARLIEST_ISO_IST);

export interface OfficialRelaunchStatus {
  serverNow: number;
  launchAt: number;
  launchAtIso: string;
  unlocked: boolean;
}

export function isOfficialRelaunchStatus(value: unknown): value is OfficialRelaunchStatus {
  if (!value || typeof value !== 'object') return false;
  const status = value as Partial<OfficialRelaunchStatus>;
  return Number.isFinite(status.serverNow) &&
    status.launchAt === OWNER_RELAUNCH_START_MS &&
    status.launchAtIso === OWNER_RELAUNCH_START_ISO_IST &&
    typeof status.unlocked === 'boolean' &&
    status.unlocked === (Number(status.serverNow) >= OWNER_RELAUNCH_START_MS);
}
