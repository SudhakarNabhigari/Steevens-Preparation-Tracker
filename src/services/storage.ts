import { UserState, RoadmapPdfRecord } from '../types';

export const OWNER_STORAGE_KEY = 'steeven_180day_prep_owner_permanent_v3';
export const GUEST_STORAGE_KEY = 'steeven_180day_prep_guest_sandbox_v3';

export const DEFAULT_AUTHORITATIVE_PDF: RoadmapPdfRecord = {
  id: 'authoritative_roadmap_rag_180',
  filename: 'FINAL_RAG_180_DAY_COMPLETE_LEARNING_SYLLABUS.pdf',
  fileSize: 468492,
  fileSizeBytesFormatted: '457.5 KB',
  uploadTimestamp: '2026-11-12T00:00:00.000Z',
  ownerId: 'steeven_owner',
  storagePath: '/assets/aistudio/FINAL_RAG_180_DAY_COMPLETE_LEARNING_SYLLABUS__1__3a24eef8.pdf',
  fileUrl: '/assets/aistudio/FINAL_RAG_180_DAY_COMPLETE_LEARNING_SYLLABUS__1__3a24eef8.pdf',
  version: 1,
  isActiveRoadmap: true,
  isDefaultSourcePdf: true,
  extractedSummary: {
    pages: 20,
    topicsCount: 180,
    coveragePct: 100.0
  }
};

// Initial state for Steeven (Owner) — STRICTLY ZERO FAKE PROGRESS
export const DEFAULT_OWNER_STATE: UserState = {
  username: 'Steeven',
  passwordHash: 'Nani@011',
  role: 'owner',
  isAuthenticated: false,
  completedTasks: {}, // Strictly empty initially
  completedDays: {},  // Strictly empty initially
  dayNotes: {},
  studyTimeSeconds: {},
  assessmentSubmissions: {},
  studyLogs: [],
  lastActiveDayNumber: 1,
  lastSavedTimestamp: new Date().toISOString(),
  timerState: {
    isActive: false,
    isPaused: false,
    dayNumber: 1,
    targetSeconds: 4 * 3600,
    elapsedSeconds: 0,
    remainingSeconds: 4 * 3600,
    type: 'daily'
  },
  simulationDate: null,
  simulationEnabled: false,
  uploadedPdfs: [DEFAULT_AUTHORITATIVE_PDF],
  activePdfId: 'authoritative_roadmap_rag_180',
  resources: [],
  doubtEntries: []
};

// Initial state for Guest Sandbox
export const DEFAULT_GUEST_STATE: UserState = {
  username: 'Guest',
  passwordHash: 'Guest@0111',
  role: 'guest',
  isAuthenticated: false,
  completedTasks: {},
  completedDays: {},
  dayNotes: {},
  studyTimeSeconds: {},
  assessmentSubmissions: {},
  studyLogs: [],
  lastActiveDayNumber: 1,
  lastSavedTimestamp: new Date().toISOString(),
  timerState: {
    isActive: false,
    isPaused: false,
    dayNumber: 1,
    targetSeconds: 4 * 3600,
    elapsedSeconds: 0,
    remainingSeconds: 4 * 3600,
    type: 'daily'
  },
  simulationDate: null,
  simulationEnabled: true,
  uploadedPdfs: [DEFAULT_AUTHORITATIVE_PDF],
  activePdfId: 'authoritative_roadmap_rag_180',
  resources: [],
  doubtEntries: []
};

// ==========================================
// INDEXEDDB PERMANENT STORAGE ENGINE
// ==========================================
const DB_NAME = 'SteevenPrepPermanentDB';
const DB_VERSION = 1;
const STORE_NAME = 'user_prep_records';

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB open error, falling back to LocalStorage');
        resolve(null);
      };
    } catch (e) {
      console.warn('IndexedDB not supported or accessible:', e);
      resolve(null);
    }
  });
}

export async function saveToIndexedDB(key: string, data: any): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ key, data, updatedAt: Date.now() });

      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export async function loadFromIndexedDB(key: string): Promise<any | null> {
  const db = await openDatabase();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);

      req.onsuccess = () => {
        if (req.result && req.result.data) {
          resolve(req.result.data);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// Synchronous fast load from localStorage cache
export function loadRoleStateSync(role: 'owner' | 'guest'): UserState {
  const key = role === 'owner' ? OWNER_STORAGE_KEY : GUEST_STORAGE_KEY;
  const defaultState = role === 'owner' ? DEFAULT_OWNER_STATE : DEFAULT_GUEST_STATE;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      role,
      lastActiveDayNumber: parsed.lastActiveDayNumber || defaultState.lastActiveDayNumber || 1,
      timerState: {
        ...defaultState.timerState,
        ...(parsed.timerState || {})
      },
      uploadedPdfs: (parsed.uploadedPdfs && parsed.uploadedPdfs.length > 0)
        ? parsed.uploadedPdfs
        : [DEFAULT_AUTHORITATIVE_PDF],
      resources: Array.isArray(parsed.resources) ? parsed.resources : [],
      doubtEntries: Array.isArray(parsed.doubtEntries) ? parsed.doubtEntries : []
    };
  } catch (err) {
    console.error(`Failed to load ${role} storage:`, err);
    return defaultState;
  }
}

// Save immediately to LocalStorage and asynchronously replicate to IndexedDB
export async function saveRoleStatePermanent(state: UserState): Promise<boolean> {
  const key = state.role === 'owner' ? OWNER_STORAGE_KEY : GUEST_STORAGE_KEY;
  state.lastSavedTimestamp = new Date().toISOString();

  let localStorageOk = false;
  try {
    localStorage.setItem(key, JSON.stringify(state));
    localStorageOk = true;
  } catch (err) {
    console.error('LocalStorage write failed:', err);
  }

  // Replicate to IndexedDB
  const idbOk = await saveToIndexedDB(key, state);

  return localStorageOk || idbOk;
}

// Backup Export
export function exportBackupJson(state: UserState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `steeven_180day_prep_backup_${timestamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Backup Import
export function importBackupJson(jsonString: string): UserState | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && typeof parsed === 'object') {
      const merged: UserState = {
        ...DEFAULT_OWNER_STATE,
        ...parsed,
        role: 'owner',
        isAuthenticated: true,
        lastActiveDayNumber: parsed.lastActiveDayNumber || 1
      };
      saveRoleStatePermanent(merged);
      return merged;
    }
    return null;
  } catch (err) {
    console.error('Invalid backup JSON:', err);
    return null;
  }
}
