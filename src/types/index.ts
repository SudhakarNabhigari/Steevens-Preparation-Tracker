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
  isoDate: string; // IST calendar date, YYYY-MM-DD
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
  isoDate: string; // IST calendar date, YYYY-MM-DD
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

export type AssessmentDomain = 'python' | 'genai' | 'ml' | 'rag' | 'azure' | 'dsa';
export type QuestionEvaluationMode = 'auto_mcq' | 'self_reported_coding' | 'rubric_review';
export type WrittenReviewStatus = 'pending' | 'needs_revision' | 'partial' | 'full';

export interface Question {
  id: string;
  type: 'mcq' | 'short_answer' | 'debugging' | 'architecture' | 'coding';
  domain?: AssessmentDomain;
  evaluationMode?: QuestionEvaluationMode;
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer?: string | number; // index or text
  rubricExplanation: string;
  points: number;
}

export interface LeetCodeProblem {
  id: string;
  weekNumber: number;
  frontendId: string;
  title: string;
  slug: string;
  url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dsaTopic: string;
}

export interface Assessment {
  weekNumber: number;
  title: string;
  moduleTitle: string;
  scheduledDayNumber: number; // Saturday day number (or Day 180 for Week 26)
  scheduledDate: string;
  unlockIsoIst: string; // Explicit Asia/Kolkata ISO timestamp e.g. 2026-11-21T00:00:00+05:30
  studyWindow: string;
  durationMinutes: number; // 180 (3 hours)
  topicsCovered: string[];
  dsaTopics: string[];
  azureTopics: string[];
  questions: Question[];
  leetcodeProblems: LeetCodeProblem[];
  totalPoints: number;
  passThreshold: number; // 70%
}

export interface AssessmentMetadataSummary {
  weekNumber: number;
  title: string;
  moduleTitle: string;
  scheduledDayNumber: number;
  scheduledDate: string;
  unlockIsoIst: string;
  studyWindow: string;
  durationMinutes: number;
  topicsCovered: string[];
  dsaTopics: string[];
  azureTopics: string[];
  totalPoints: number;
  passThreshold: number;
  questionBreakdown: {
    mcqCount: number;
    codingCount: number;
    writtenCount: number;
    leetcodeCount: number;
  };
}

export interface WeeklyReviewNotes {
  strengths: string;
  weakTopics: string;
  mistakes: string;
  revisionActions: string;
  nextWeekRecommendations: string;
}

export interface AssessmentSnapshot {
  title: string;
  moduleTitle: string;
  scheduledDate: string;
  questions: Question[];
  leetcodeProblems: LeetCodeProblem[];
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
  mcqScore?: number;
  mcqMaxScore?: number;
  writtenReviewScore?: number;
  writtenMaxScore?: number;
  writtenSelfReviews?: Record<string, WrittenReviewStatus>;
  reviewNotes?: WeeklyReviewNotes;
  snapshot?: AssessmentSnapshot;
}

export interface LeetCodeProgressEntry {
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

export interface ActiveAssessmentAttempt {
  weekNumber: number;
  startedAt: string;
  lastUpdatedAt: string;
  answers: Record<string, string | number>;
  elapsedSeconds: number;
  snapshot: AssessmentSnapshot;
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

export interface SharedAppSettings {
  preparationTitle: string;
  timezoneLabel: string;
  studyScheduleBannerNote: string;
  preferredTrackOrder: TrackId[];
  showWeekendRevisionGuidance: boolean;
  defaultDailyGoalHours: number;
  resourceLibraryNotice: string;
  updatedAt: string;
}

export interface SharedOwnerContent {
  uploadedPdfs: RoadmapPdfRecord[];
  activePdfId: string;
  resources: ResourceItem[];
  sharedSettings: SharedAppSettings;
  updatedAt: string;
}

export interface UserState {
  username: string;
  passwordHash: string; // Always scrubbed to '' before persistence; never save passwords in browser storage
  authVerifier?: string; // One-way SHA-256 verifier for pre-Supabase local transition only
  cloudSyncMeta?: {
    lastSyncedAt?: string;
    ownerUserId?: string;
  };
  preparationCycleId?: string;
  preparationCycleStartIsoIst?: string;
  preparationCycleHistory?: Array<{
    cycleId: string;
    archivedAt: string;
    startDateIsoIst: string;
    main: {
      completedTasks: Record<string, boolean>;
      completedDays: Record<number, boolean>;
      dayNotes: Record<number, string>;
      studyTimeSeconds: Record<number, number>;
      assessmentSubmissions: Record<number, AssessmentSubmission>;
      leetcodeProgress: Record<string, LeetCodeProgressEntry>;
      activeAssessmentAttempt?: ActiveAssessmentAttempt | null;
    };
    dsa: TrackProgressState;
    azure: TrackProgressState;
    studyLogs: StudySessionLog[];
    timerState?: TimerState;
    trackTimerSnapshots?: Partial<Record<TrackId, TimerState>>;
    dailyAiResourceCompletions?: Record<string, boolean>;
  }>;
  role: UserRole; // 'owner' (Steeven) or 'guest' (Guest)
  isAuthenticated: boolean;
  completedTasks: Record<string, boolean>; // key: `${dayNumber}_${taskId}` -> boolean (Main 180-day plan)
  completedDays: Record<number, boolean>; // dayNumber -> true if all tasks done (Main 180-day plan)
  dayNotes: Record<number, string>; // dayNumber -> personal study notes (Main 180-day plan)
  studyTimeSeconds: Record<number, number>; // dayNumber -> seconds studied (Main 180-day plan)
  assessmentSubmissions: Record<number, AssessmentSubmission>; // weekNumber -> submission (Main 180-day plan)
  leetcodeProgress: Record<string, LeetCodeProgressEntry>; // problemId -> user-confirmed completion
  activeAssessmentAttempt?: ActiveAssessmentAttempt | null;
  studyLogs: StudySessionLog[];
  timerState: TimerState;
  trackTimerSnapshots?: Partial<Record<TrackId, TimerState>>;
  dsaProgress: TrackProgressState;
  azureProgress: TrackProgressState;
  simulationDate: string | null; // e.g. "2026-11-23T10:00:00.000Z" when testing fast-forward
  simulationEnabled: boolean;
  uploadedPdfs: RoadmapPdfRecord[];
  activePdfId: string;
  lastActiveDayNumber: number; // The day where user stopped in Main plan, for resume
  lastSavedTimestamp?: string;
  resources: ResourceItem[];
  doubtEntries: DoubtEntry[];
  sharedSettings: SharedAppSettings;
  dailyAiResourceCompletions?: Record<string, boolean>;
  guestSandboxInitialized?: boolean;
  guestSharedSettingsCustomized?: boolean;
  guestDeletedSharedPdfIds?: string[];
  guestDeletedSharedResourceIds?: string[];
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

export type DailyResourceStatus =
  | 'loading'
  | 'updated'
  | 'partially_updated'
  | 'cached'
  | 'failed'
  | 'unavailable';

export interface DailyYouTubeResource {
  id: string;
  title: string;
  channelName: string;
  url: string;
  videoId?: string;
  channelId?: string;
  thumbnailUrl?: string;
  topicCovered: string;
  explanation: string;
  whyUseful: string;
  duration?: string;
  language?: string;
  isVerifiedVideo: boolean;
  linkKind: 'verified_video' | 'youtube_search_fallback';
}

export interface DailyLeetCodeQuestion {
  slot: 1 | 2 | 3;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  available: boolean;
  problemNumber?: string;
  title?: string;
  slug?: string;
  url?: string;
  shortExplanation: string;
  whyMatchesTopic: string;
  whyUnavailable?: string;
  isVerified: boolean;
}

export interface DailyReferenceLink {
  id: string;
  resourceType: 'official_documentation' | 'practical_exercise' | 'reference';
  title: string;
  url?: string;
  description: string;
  sourceLabel: string;
  isVerifiedUrl: boolean;
}

export interface DailyTimetableSlot {
  duration: string;
  activity: string;
}

export interface TrackDailyAiResources {
  trackId: TrackId;
  trackLabel: string;
  planDay: number;
  planDate: string;
  dateLabel: string;
  dayOfWeek?: string;
  topicTitle: string;
  phaseOrModule: string;
  scheduleTarget?: string;
  studyTimetable?: DailyTimetableSlot[];
  learningObjectives: string[];
  topicExplanation: string;
  practicalExamples?: string[];
  revisionNotes?: string[];
  commonMistakes?: string[];
  suggestedLearningOrder: string[];
  dailyGuidance: string;
  practicalExerciseSummary: string;
  youtubeTutorials: DailyYouTubeResource[];
  leetcodeQuestions: DailyLeetCodeQuestion[];
  officialDocs: DailyReferenceLink[];
  practicalExercises: DailyReferenceLink[];
  status: DailyResourceStatus;
  statusMessage: string;
  aiProviderStatus:
    | 'gemini_generated'
    | 'quota_exhausted_cached'
    | 'missing_api_key'
    | 'invalid_api_key'
    | 'unavailable';
  youtubeProviderStatus: 'youtube_api_verified' | 'search_fallback_no_key' | 'search_fallback_quota' | 'unavailable';
  modelUsed?: string;
  generatedAt: string;
  updatedAt: string;
}

export interface DailyAutomationStatus {
  scheduleLabel: string;
  timezone: string;
  recipientEmail: string;
  lastRunDate: string | null;
  lastRunAt: string | null;
  overallStatus: 'success' | 'partial' | 'failed' | 'not_run_yet';
  emailStatus: 'sent' | 'failed' | 'awaiting_credentials' | 'awaiting_sender_verification' | 'not_sent';
  emailProviderId?: string | null;
  emailError?: string | null;
  missingSecrets: string[];
  geminiConfigured: boolean;
  youtubeConfigured: boolean;
  resendConfigured: boolean;
  resendSenderConfigured: boolean;
  supabaseServerConfigured: boolean;
}

export interface DailyResourcesDashboardPayload {
  istDate: string;
  istDateLabel: string;
  isPreparationStarted: boolean;
  unlockedDays: {
    main: number;
    dsa: number;
    azure: number;
  };
  tracks: {
    main: TrackDailyAiResources | null;
    dsa: TrackDailyAiResources | null;
    azure: TrackDailyAiResources | null;
  };
  automation: DailyAutomationStatus;
  actionPlan: {
    studyFirst: string;
    tutorialsToWatch: string;
    leetcodeFirst: string;
    practicalExercise: string;
    sequence: string[];
  };
}
