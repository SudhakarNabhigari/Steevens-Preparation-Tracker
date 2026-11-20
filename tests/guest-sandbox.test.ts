import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_GUEST_STATE,
  DEFAULT_OWNER_STATE,
  GUEST_STORAGE_KEY,
  OWNER_STORAGE_KEY,
  SHARED_CONTENT_STORAGE_KEY,
  applySharedContentToGuestState,
  loadRoleStateSync,
  mergeSharedContentIntoGuestState,
  resetGuestPreviewState,
  saveRoleStatePermanent
} from '../src/services/storage.ts';
import type { SharedOwnerContent, UserState } from '../src/types/index.ts';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

function withStorage(run: () => Promise<void>) {
  const previous = globalThis.localStorage;
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: new MemoryStorage() });
  return run().finally(() => {
    if (previous) Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: previous });
    else delete (globalThis as { localStorage?: Storage }).localStorage;
  });
}

const sharedContent = (): SharedOwnerContent => ({
  uploadedPdfs: [],
  activePdfId: '',
  resources: [],
  sharedSettings: clone(DEFAULT_GUEST_STATE.sharedSettings),
  updatedAt: new Date().toISOString()
});

test('Guest save and reset use only Guest storage and preserve the Owner record', async () => withStorage(async () => {
  const owner = clone(DEFAULT_OWNER_STATE);
  owner.isAuthenticated = true;
  owner.completedTasks = { '9_1': true };
  await saveRoleStatePermanent(owner);
  const ownerBefore = localStorage.getItem(OWNER_STORAGE_KEY);
  const sharedBefore = localStorage.getItem(SHARED_CONTENT_STORAGE_KEY);

  const guest = clone(DEFAULT_GUEST_STATE);
  guest.isAuthenticated = true;
  guest.completedTasks = { '1_1': true };
  guest.assessmentSubmissions = { 1: { weekNumber: 1 } as never };
  guest.resources = [{ id: 'guest_res_1', title: 'Guest note' } as never];
  guest.uploadedPdfs = [{ id: 'guest_pdf_1', filename: 'temporary.pdf' } as never];
  guest.authVerifier = 'private';
  guest.preparationCycleHistory = [{ cycleId: 'owner-private', archivedAt: '', startDateIsoIst: '', main: {} as never, dsa: {} as never, azure: {} as never, studyLogs: [] }];
  assert.equal(await saveRoleStatePermanent(guest), true);

  const stored = JSON.parse(localStorage.getItem(GUEST_STORAGE_KEY) || '{}') as UserState;
  assert.equal(stored.role, 'guest');
  assert.equal(stored.authVerifier, undefined);
  assert.equal(stored.preparationCycleHistory, undefined);
  assert.equal(stored.resources[0]?.id, 'guest_res_1');
  assert.equal(stored.uploadedPdfs[0]?.id, 'guest_pdf_1');
  assert.equal(localStorage.getItem(OWNER_STORAGE_KEY), ownerBefore);
  assert.equal(localStorage.getItem(SHARED_CONTENT_STORAGE_KEY), sharedBefore);

  let idbGuest: UserState | undefined;
  const reset = await resetGuestPreviewState(async state => {
    await saveRoleStatePermanent(state);
    idbGuest = clone(state);
    return true;
  });
  assert.equal(idbGuest?.lastSavedTimestamp, reset.lastSavedTimestamp);
  assert.deepEqual(reset.completedTasks, {});
  assert.deepEqual(reset.assessmentSubmissions, {});
  assert.deepEqual(reset.resources, []);
  assert.ok(!reset.uploadedPdfs.some(pdf => pdf.id === 'guest_pdf_1'));
  assert.deepEqual(loadRoleStateSync('guest').completedTasks, {});
  assert.equal(localStorage.getItem(OWNER_STORAGE_KEY), ownerBefore);
  assert.equal(localStorage.getItem(SHARED_CONTENT_STORAGE_KEY), sharedBefore);
}));

test('Guest shared-content refresh preserves local edits and remembers local deletions', async () => withStorage(async () => {
  const base = applySharedContentToGuestState(clone(DEFAULT_GUEST_STATE), sharedContent());
  const ownerContent = sharedContent();
  ownerContent.resources = [
    { id: 'shared_res', title: 'Owner resource', url: 'https://example.com', category: 'Other Resources', relatedDay: 1, relatedWeek: 1, relatedTopic: '', shortDescription: '', personalNotes: '', tags: [], dateAdded: '', isImportant: false, isCompleted: false }
  ];
  ownerContent.uploadedPdfs = [{ ...DEFAULT_GUEST_STATE.uploadedPdfs[0], id: 'shared_pdf' }];
  const initial = mergeSharedContentIntoGuestState(base, ownerContent);
  const changed: UserState = {
    ...initial,
    resources: [{ ...ownerContent.resources[0], title: 'Guest edit' }],
    uploadedPdfs: [],
    guestDeletedSharedPdfIds: ['shared_pdf'],
    guestDeletedSharedResourceIds: ['shared_res']
  };
  const refreshed = mergeSharedContentIntoGuestState(changed, ownerContent);
  assert.equal(refreshed.resources[0]?.title, 'Guest edit');
  assert.deepEqual(refreshed.uploadedPdfs, []);
  assert.deepEqual(refreshed.guestDeletedSharedPdfIds, ['shared_pdf']);
}));

test('Guest feature navigation remains complete and shared-content mutators are role-local', async () => {
  const fs = await import('node:fs/promises');
  const [navigation, context, library, pdfs, settings] = await Promise.all([
    fs.readFile(new URL('../src/components/Navigation.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/context/AppContext.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/ResourceLibraryPage.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/RoadmapPdfPage.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/SettingsPage.tsx', import.meta.url), 'utf8')
  ]);
  for (const page of ['home_dashboard', 'today_work', 'dsa_track', 'azure_track', 'preparation_calendar', 'all_days', 'weekly_assessments', 'weekly_progress', 'daily_ai_resources', 'resource_library', 'doubt_notebook', 'roadmap_pdf', 'original_roadmap', 'study_history', 'settings']) {
    assert.ok(navigation.includes(`'${page}'`), `missing Guest navigation target ${page}`);
  }
  assert.ok(context.includes("prev.role !== state.role"));
  assert.ok(context.includes('guest_pdf_'));
  assert.ok(context.includes("state.role === 'guest' ? 'guest_res' : 'res'"));
  assert.ok(library.includes('Guest Resource Library (Temporary Sandbox)'));
  assert.ok(pdfs.includes('Guest uploads remain local to this temporary preview.'));
  assert.ok(settings.includes('Guest preferences saved locally.'));
});
