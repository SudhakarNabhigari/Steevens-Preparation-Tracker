import {
  OWNER_RELAUNCH_START_ISO_IST,
  OWNER_RELAUNCH_START_MS
} from '../src/utils/relaunchConfig.ts';

export interface RelaunchStatus {
  serverNow: number;
  launchAt: number;
  launchAtIso: string;
  unlocked: boolean;
}

/** Pure server-clock status; deliberately has no storage, auth, or provider imports. */
export function getRelaunchStatus(nowMs = Date.now()): RelaunchStatus {
  return {
    serverNow: nowMs,
    launchAt: OWNER_RELAUNCH_START_MS,
    launchAtIso: OWNER_RELAUNCH_START_ISO_IST,
    unlocked: nowMs >= OWNER_RELAUNCH_START_MS
  };
}
