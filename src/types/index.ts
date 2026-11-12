export type DayStatus = 'locked' | 'not-started' | 'in-progress' | 'completed' | 'incomplete';
export type UserRole = 'owner' | 'guest';
export type TrackId = 'main' | 'dsa' | 'azure';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  category: 'concept' | 'implementation' | 'testing' | 'deliverable' | 'revision';
}

export interface DaySchedule {
  dayNumber: number; // 1 to 180
  dateString: string; // e.g. "16 Nov 2026"
  isoDate: string; // "2026-11-16"
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  weekNumber: number; // 1 to 26
  targetHours: number; // 4 for Mon-Fri, 3 for Sat & Sun
  moduleNumber: number; // 1 to 12, or 13 for final days
  moduleTitle: string;
  focusType: string; // e.g. "Learn concepts and make notes", "Guided implementation"
  topic: string;
  subtopics: string[];
  output: string;
  deliverable: string;
  practicalTask: string;
  expectedOutcome: string;
  revisionTasks: string[];
  pdfPage: number;
  pdfSection: string;
}

export interface TrackChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'objective' | 'work' | 'milestone' | 'scope';
}

export interface TrackDaySchedule {
  trackId: 'dsa' | 'azure';
  dayNumber: number; // 1 to 100
  dateString: string; // e.g. "16 Nov 2026"
  isoDate: string; // "2026-11-16"
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  weekNumber: number; // 1 to 15
  targetMinutes: number; // DSA: 90 Mon-Fri, 120 Sat-Sun | Azure: 60 all days
  scheduleLabel: string; // e.g. "90 minutes preparation" / "2 hours revision" / "1 hour preparation"
  phaseTitle: string;
  topic: string;
  classFocus: string;
  objective: string;
  studentWork: string;
  milestoneOutput: string;
  dailyScope: string;
  isWeekendRevision: boolean;
  pdfPage: number;
  checklist: TrackChecklistItem[];
}

export interface TrackRevisionRecord {
  weekNumber: number;
  score?: number;
  maxScore?: number;
  notes: string;
  passed: boolean;
  completedAt: string;
}

export interface TrackProgressState {
  completedTasks: Record<string, boolean>; // key: `${dayNumber}_${taskId}`
  completedDays: Record<number, boolean>;
  dayNotes: Record<number, string>;
  studyTimeSeconds: Record<number, number>;
  revisionRecords: Record<number, TrackRevisionRecord>;
  lastActiveDayNumber: number;
}

export interface Question {
  id: string;
  type: 'mcq' | 'short_answer' | 'debugging' | 'architecture';
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer?: string | number; // index or text
  rubricExplanation: string;
  points: number;
}

export interface Assessment {
  weekNumber: number;
  title: string;
  moduleTitle: string;
  scheduledDayNumber: number; // Saturday day number
  scheduledDate: string;
  durationMinutes: number; // 180 (3 hours)
  topicsCovered: string[];
  questions: Question[];
  totalPoints: number;
  passThreshold: number; // 70%
}

export interface AssessmentSubmission {
  weekNumber: number;
  answers: Record<string, string | number>;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
  timeSpentSeconds: number;
  feedback?: string;
}

export interface StudySessionLog {
  id: string;
  trackId?: TrackId;
  dayNumber: number;
  date: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  type: 'daily_preparation' | 'weekly_assessment';
  completedTasksCount: number;
  notes?: string;
}

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  trackId?: TrackId;
  dayNumber: number;
  targetSeconds: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  startedAtTimestamp?: number; // Real epoch ms for drift-free timer
  pausedAtTimestamp?: number;
  type: 'daily' | 'assessment';
}

export interface RoadmapPdfRecord {
  id: string;
  filename: string;
  fileSize: number;
  fileSizeBytesFormatted: string;
  uploadTimestamp: string;
  ownerId: string;
  storagePath: string;
  fileUrl: string;
  version: number;
  isActiveRoadmap: boolean;
  isDefaultSourcePdf?: boolean;
  extractedSummary?: {
    pages: number;
    topicsCount: number;
    coveragePct: number;
  };
}

export interface UserState {
  username: string;
  passwordHash: string; // Stored securely
  role: UserRole; // 'owner' (Steeven) or 'guest' (Guest)
  isAuthenticated: boolean;
  completedTasks: Record<string, boolean>; // key: `${dayNumber}_${taskId}` -> boolean (Main 180-day plan)
  completedDays: Record<number, boolean>; // dayNumber -> true if all tasks done (Main 180-day plan)
  dayNotes: Record<number, string>; // dayNumber -> personal study notes (Main 180-day plan)
  studyTimeSeconds: Record<number, number>; // dayNumber -> seconds studied (Main 180-day plan)
  assessmentSubmissions: Record<number, AssessmentSubmission>; // weekNumber -> submission (Main 180-day plan)
  studyLogs: StudySessionLog[];
  timerState: TimerState;
  trackTimerSnapshots?: Partial<Record<TrackId, TimerState>>;
  dsaProgress: TrackProgressState;
  azureProgress: TrackProgressState;
  simulationDate: string | null; // e.g. "2026-11-16T10:00:00.000Z" when testing fast-forward
  simulationEnabled: boolean;
  uploadedPdfs: RoadmapPdfRecord[];
  activePdfId: string;
  lastActiveDayNumber: number; // The day where user stopped in Main plan, for resume
  lastSavedTimestamp?: string;
  resources: ResourceItem[];
  doubtEntries: DoubtEntry[];
}

export type SaveStatus = 'saved' | 'saving' | 'error';

export interface ContentAudit {
  totalPages: number;
  extractedItemsCount: number;
  assignedDaysCount: number;
  retainedReferenceItemsCount: number;
  unassignedItemsCount: number;
  coveragePercentage: number;
}

export type ResourceCategory =
  | 'Official Documentation'
  | 'Research Papers'
  | 'YouTube Videos'
  | 'Tutorials'
  | 'Learning Websites'
  | 'Technical Blogs'
  | 'Personal Notes'
  | 'Other Resources';

export interface ResourceItem {
  id: string;
  title: string;
  url: string;
  category: ResourceCategory;
  relatedDay: number; // 1 to 180
  relatedWeek: number; // 1 to 26
  relatedTopic: string;
  shortDescription: string;
  personalNotes: string;
  tags: string[];
  dateAdded: string;
  isImportant: boolean;
  isCompleted: boolean;
}

export type ProblemType =
  | 'Coding Error'
  | 'Python Error'
  | 'SQL Error'
  | 'ML/Deep Learning Doubt'
  | 'RAG/LLM Doubt'
  | 'API/Backend Error'
  | 'Deployment Error'
  | 'Conceptual Doubt'
  | 'Other';

export type DoubtStatus = 'unresolved' | 'in_progress' | 'solved';

export interface DoubtEntry {
  id: string;
  title: string;
  problemType: ProblemType;
  technology: string;
  errorMessage: string;
  codeSnippet?: string;
  explanation: string;
  rootCause: string;
  solution: string;
  relatedDay: number; // 1 to 180
  relatedTopic: string;
  tags: string[];
  dateCreated: string;
  status: DoubtStatus;
  needsRevision: boolean;
  additionalNotes: string;
}

