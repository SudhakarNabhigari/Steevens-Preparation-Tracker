import { configuredOwnerEmail, requireSupabaseClient } from '../lib/supabase';
import { hydrateUserState, mergeOwnerStatesSafely } from './storage';
import type { RoadmapPdfRecord, UserState } from '../types';

export function getConfiguredOwnerAuthEmail(): string {
  return configuredOwnerEmail;
}

function sanitizePdfForCloudJson(pdf: RoadmapPdfRecord): RoadmapPdfRecord {
  // Never store large inline base64 PDF payloads inside user_progress JSONB.
  if (pdf.fileUrl?.startsWith('data:')) {
    return {
      ...pdf,
      fileUrl: ''
    };
  }
  return pdf;
}

export function getSafeCloudState(state: UserState) {
  if (state.role !== 'owner') {
    throw new Error('Guest isolation policy: Guest state cannot be serialized for Owner cloud storage.');
  }

  const { passwordHash: _passwordHash, authVerifier: _authVerifier, ...safeState } = state;

  return {
    ...safeState,
    role: 'owner' as const,
    isAuthenticated: false,
    uploadedPdfs: (state.uploadedPdfs || []).map(sanitizePdfForCloudJson),
    lastSavedTimestamp: state.lastSavedTimestamp || new Date().toISOString()
  };
}

export async function loadOrMigrateOwnerProgress(
  userId: string,
  localState: UserState
): Promise<{
  state: UserState;
  resolution: 'migrated_initial' | 'local_newer' | 'cloud_newer' | 'merged_equal';
  conflictDetected: boolean;
}> {
  if (localState.role !== 'owner') {
    throw new Error('Guest isolation policy: Guest cannot read or migrate Owner cloud progress.');
  }

  const supabase = requireSupabaseClient();
  const { data, error } = await supabase
    .from('user_progress')
    .select('state, updated_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  // Cloud row exists -> timestamp-aware non-destructive merge so newer local progress is never lost.
  if (data?.state) {
    const cloudPartial = {
      ...(data.state as unknown as Partial<UserState>),
      lastSavedTimestamp:
        (data.state as Partial<UserState>)?.lastSavedTimestamp ||
        (typeof data.updated_at === 'string' ? data.updated_at : undefined)
    };
    const mergeResult = mergeOwnerStatesSafely(localState, cloudPartial);

    if (mergeResult.shouldPushMergedToCloud) {
      await saveOwnerProgressToCloud(userId, mergeResult.merged);
    }

    return {
      state: mergeResult.merged,
      resolution: mergeResult.resolution,
      conflictDetected: mergeResult.conflictDetected
    };
  }

  // First cloud migration: preserve local state cleanly without inline PDF base64 bloat.
  const cloudState = getSafeCloudState(localState);

  const { error: insertError } = await supabase.from('user_progress').insert({
    user_id: userId,
    state: cloudState,
    updated_at: new Date().toISOString()
  });

  if (insertError) {
    throw insertError;
  }

  return {
    state: hydrateUserState(
      {
        ...localState,
        cloudSyncMeta: {
          lastSyncedAt: new Date().toISOString(),
          ownerUserId: userId
        }
      },
      'owner'
    ),
    resolution: 'migrated_initial',
    conflictDetected: false
  };
}

export async function saveOwnerProgressToCloud(
  userId: string,
  state: UserState
): Promise<void> {
  if (state.role !== 'owner') {
    throw new Error('Guest isolation policy: Guest cannot write to Owner cloud progress.');
  }

  const supabase = requireSupabaseClient();
  const cloudState = getSafeCloudState(state);

  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        state: cloudState,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    throw error;
  }
}
