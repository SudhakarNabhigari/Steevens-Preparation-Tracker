import { supabase } from '../lib/supabase';
import { hydrateUserState } from './storage';
import type { UserState } from '../types';

export const OWNER_AUTH_EMAIL = 'sudhakarnabhigari4@gmail.com';

function getSafeCloudState(state: UserState) {
  const { passwordHash: _passwordHash, ...safeState } = state;

  return {
    ...safeState,
    role: 'owner' as const,
    isAuthenticated: false,
    lastSavedTimestamp: new Date().toISOString(),
  };
}

export async function loadOrMigrateOwnerProgress(
  userId: string,
  localState: UserState
): Promise<UserState> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('state')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  // Existing cloud progress takes priority.
  if (data?.state) {
    return hydrateUserState(
      data.state as unknown as Partial<UserState>,
      'owner'
    );
  }

  // First login: migrate existing local progress to Supabase.
  const cloudState = getSafeCloudState(localState);

  const { error: insertError } = await supabase
    .from('user_progress')
    .insert({
      user_id: userId,
      state: cloudState,
      updated_at: new Date().toISOString(),
    });

  if (insertError) {
    throw insertError;
  }

  return hydrateUserState(cloudState, 'owner');
}

export async function saveOwnerProgressToCloud(
  userId: string,
  state: UserState
): Promise<void> {
  const cloudState = getSafeCloudState(state);

  const { error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        state: cloudState,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (error) {
    throw error;
  }
}
