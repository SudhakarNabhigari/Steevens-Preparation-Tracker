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
import { ALL_180_DAYS } from '../src/data/syllabus.ts';
import { DSA_100_DAYS } from '../src/data/dsaSyllabus.ts';
import { AZURE_100_DAYS } from '../src/data/azureSyllabus.ts';
import { OWNER_RELAUNCH_START_ISO_IST } from '../src/utils/relaunchConfig.ts';
import { DAILY_PREPARATION_START_ISO_IST, getDayUnlockIsoIst, getUnlockedDayCountByIstClock, isDayUnlockedByIstClock } from '../src/utils/dailyLock.ts';

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
  guest.completedDays = { 1: true };
  guest.dayNotes = { 1: 'temporary note' };
  guest.studyTimeSeconds = { 1: 900 };
  guest.assessmentSubmissions = { 1: { weekNumber: 1 } as never };
  guest.activeAssessmentAttempt = { weekNumber: 1 } as never;
  guest.leetcodeProgress = { w1_test: { completed: true } };
  guest.studyLogs = [{ id: 'guest-log' } as never];
  guest.dailyAiResourceCompletions = { 'main:1:1': true };
  guest.dsaProgress.completedTasks = { '1_task': true };
  guest.dsaProgress.completedDays = { 1: true };
  guest.dsaProgress.dayNotes = { 1: 'temporary DSA note' };
  guest.dsaProgress.studyTimeSeconds = { 1: 120 };
  guest.dsaProgress.revisionRecords = { 1: { weekNumber: 1 } as never };
  guest.azureProgress.completedTasks = { '1_task': true };
  guest.azureProgress.completedDays = { 1: true };
  guest.azureProgress.dayNotes = { 1: 'temporary Azure note' };
  guest.azureProgress.studyTimeSeconds = { 1: 120 };
  guest.azureProgress.revisionRecords = { 1: { weekNumber: 1 } as never };
  guest.doubtEntries = [{ id: 'guest-doubt' } as never];
  guest.timerState.elapsedSeconds = 500;
  guest.trackTimerSnapshots = { dsa: { ...guest.timerState, elapsedSeconds: 500 } };
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
  assert.deepEqual(reset.completedDays, {});
  assert.deepEqual(reset.dayNotes, {});
  assert.deepEqual(reset.studyTimeSeconds, {});
  assert.deepEqual(reset.assessmentSubmissions, {});
  assert.equal(reset.activeAssessmentAttempt, null);
  assert.deepEqual(reset.leetcodeProgress, {});
  assert.deepEqual(reset.studyLogs, []);
  assert.equal(reset.dailyAiResourceCompletions, undefined);
  assert.deepEqual(reset.dsaProgress.completedTasks, {});
  assert.deepEqual(reset.dsaProgress.completedDays, {});
  assert.deepEqual(reset.dsaProgress.dayNotes, {});
  assert.deepEqual(reset.dsaProgress.studyTimeSeconds, {});
  assert.deepEqual(reset.dsaProgress.revisionRecords, {});
  assert.deepEqual(reset.azureProgress.completedTasks, {});
  assert.deepEqual(reset.azureProgress.completedDays, {});
  assert.deepEqual(reset.azureProgress.dayNotes, {});
  assert.deepEqual(reset.azureProgress.studyTimeSeconds, {});
  assert.deepEqual(reset.azureProgress.revisionRecords, {});
  assert.equal(reset.timerState.elapsedSeconds, 0);
  assert.equal(reset.timerState.isActive, false);
  assert.deepEqual(reset.trackTimerSnapshots, {});
  assert.deepEqual(reset.resources, []);
  assert.deepEqual(reset.doubtEntries, []);
  assert.ok(!reset.uploadedPdfs.some(pdf => pdf.id === 'guest_pdf_1'));
  const freshSession = loadRoleStateSync('guest');
  assert.deepEqual(freshSession.completedTasks, {});
  assert.deepEqual(freshSession.completedDays, {});
  assert.deepEqual(freshSession.dsaProgress.completedTasks, {});
  assert.deepEqual(freshSession.azureProgress.completedTasks, {});
  assert.equal(localStorage.getItem(OWNER_STORAGE_KEY), ownerBefore);
  assert.equal(localStorage.getItem(SHARED_CONTENT_STORAGE_KEY), sharedBefore);
}));

test('Reset Guest dashboard boxes are locked before the revised Day 1, not falsely overdue', async () => withStorage(async () => {
  const oldStart = '2026-11-16T00:00:00+05:30';
  const nov21 = new Date('2026-11-21T12:00:00+05:30').getTime();
  const cleanGuest = await resetGuestPreviewState(async () => true);
  const oldUnlockedCount = getUnlockedDayCountByIstClock(nov21, 180, oldStart);
  assert.equal(oldUnlockedCount, 6);
  assert.deepEqual([1, 2, 3, 4, 5].map(day => day < oldUnlockedCount ? 'incomplete' : 'not-started'), [
    'incomplete', 'incomplete', 'incomplete', 'incomplete', 'incomplete'
  ]);

  assert.equal(DAILY_PREPARATION_START_ISO_IST, '2026-11-23T00:00:00+05:30');
  assert.equal(OWNER_RELAUNCH_START_ISO_IST, '2026-11-23T00:00:00+05:30');
  assert.equal(getDayUnlockIsoIst(1), '2026-11-23T00:00:00+05:30');
  assert.equal(getDayUnlockIsoIst(180), '2027-05-21T00:00:00+05:30');
  const freshSession = loadRoleStateSync('guest');
  assert.deepEqual(cleanGuest.completedTasks, {});
  assert.deepEqual(freshSession.completedTasks, {});
  assert.deepEqual([1, 2, 3, 4, 5].map(day =>
    isDayUnlockedByIstClock(day, nov21) ? 'overdue-red' : 'locked-grey'
  ), ['locked-grey', 'locked-grey', 'locked-grey', 'locked-grey', 'locked-grey']);

  assert.equal(ALL_180_DAYS[0].isoDate, '2026-11-23');
  assert.equal(ALL_180_DAYS[179].isoDate, '2027-05-21');
  assert.equal(DSA_100_DAYS[0].isoDate, '2026-11-23');
  assert.equal(DSA_100_DAYS[99].isoDate, '2027-03-02');
  assert.equal(AZURE_100_DAYS[0].isoDate, '2026-11-23');
  assert.equal(AZURE_100_DAYS[99].isoDate, '2027-03-02');
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
  const [navigation, context, library, pdfs, settings, login, dashboard, calendar, progress, preparation] = await Promise.all([
    fs.readFile(new URL('../src/components/Navigation.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/context/AppContext.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/ResourceLibraryPage.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/RoadmapPdfPage.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/SettingsPage.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/LoginScreen.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/HomeDashboard.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/PreparationCalendarPage.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/WeeklyProgressPage.tsx', import.meta.url), 'utf8'),
    fs.readFile(new URL('../src/components/TodayWorkPage.tsx', import.meta.url), 'utf8')
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
  assert.ok(context.includes('await resetGuestPreviewState()'));
  assert.ok(context.includes('window.confirm('));
  assert.ok(login.includes('23 Nov 2026 - 21 May 2027'));
  assert.ok(dashboard.includes('23 Nov 2026 – 21 May 2027'));
  assert.ok(!dashboard.includes('shiftScheduleDate'));
  assert.ok(calendar.includes('Visual calendar from 23 November 2026 to 21 May 2027'));
  assert.ok(!progress.includes('shiftScheduleDate'));
  assert.ok(!preparation.includes('shiftScheduleDate'));
});
