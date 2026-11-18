// Auto-generated canonical curriculum & resource catalog synced with src/data/*
// Pure standard TypeScript — zero Node or Deno runtime dependencies so Express, Vercel, and Supabase Edge share 100% identical data.

export type SharedTrackId = 'main' | 'dsa' | 'azure';

export interface SharedCurriculumDayContext {
  trackId: SharedTrackId;
  trackLabel: string;
  dayNumber: number;
  isoDate: string;
  dateLabel: string;
  dayOfWeek: string;
  weekNumber: number;
  phaseOrModule: string;
  topic: string;
  objectives: string[];
  practicalWork: string;
  expectedOutcome: string;
  deliverable: string;
  isDsaRelated: boolean;
}

export interface SharedDailyLeetCodeQuestion {
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

export interface SharedDailyReferenceLink {
  id: string;
  resourceType: 'official_documentation' | 'practical_exercise' | 'reference';
  title: string;
  url?: string;
  description: string;
  sourceLabel: string;
  isVerifiedUrl: boolean;
}

export const MAIN_CURRICULUM_CONTEXTS: SharedCurriculumDayContext[] = [
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 1,
    "isoDate": "2026-11-16",
    "dateLabel": "16 Nov 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 1,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Product framing",
    "objectives": [
      "Product requirements",
      "Target users",
      "Business problem",
      "User journeys",
      "User actions",
      "Acceptance criteria"
    ],
    "practicalWork": "Define user persona sheet for enterprise employees querying technical SOPs and product manuals.",
    "expectedOutcome": "Clear understanding of user trust boundaries and business value of RAG over pure LLM chatbots.",
    "deliverable": "docs/product_requirements_v1.md with target user personas and 5 primary acceptance criteria.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 2,
    "isoDate": "2026-11-17",
    "dateLabel": "17 Nov 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 1,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Architecture and data flow",
    "objectives": [
      "Browser-to-API-to-response lifecycle",
      "Ingestion pipeline",
      "Question-answering pipeline",
      "Trust boundaries"
    ],
    "practicalWork": "Diagram the two separate pipelines: document ingestion vs question answering with server security boundaries.",
    "expectedOutcome": "Knowledge that frontend never communicates with vector DB or LLM provider directly.",
    "deliverable": "docs/architecture_dataflow_v1.png / markdown specification.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 3,
    "isoDate": "2026-11-18",
    "dateLabel": "18 Nov 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 1,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Python refresh",
    "objectives": [
      "Python modules",
      "Imports",
      "Package structure",
      "Functions",
      "Classes",
      "Typing",
      "Readable code"
    ],
    "practicalWork": "Build modular Python package layout with strict typing (Pydantic / dataclasses) and PEP-8 readability.",
    "expectedOutcome": "Clean typing structure ensuring runtime validation and reliable type hinting.",
    "deliverable": "src/core/base_models.py with generic Result and Config classes.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 4,
    "isoDate": "2026-11-19",
    "dateLabel": "19 Nov 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 1,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Python environments and failures",
    "objectives": [
      "Virtual environments",
      "Dependency installation",
      "Exceptions",
      "Structured error handling",
      "Configuration"
    ],
    "practicalWork": "Set up poetry / venv, create custom exception hierarchy (e.g. IngestionError, AuthError, ModelTimeout).",
    "expectedOutcome": "Zero unhandled exceptions; standard error response dictionary mapping.",
    "deliverable": "src/core/exceptions.py with AppBaseException and HTTP status code mappings.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 5,
    "isoDate": "2026-11-20",
    "dateLabel": "20 Nov 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 1,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Python runtime foundations",
    "objectives": [
      "Logging",
      "Asynchronous basics",
      "Async/await concepts",
      "Blocking versus non-blocking work"
    ],
    "practicalWork": "Implement structured JSON logger and async worker test harness to verify non-blocking event loop.",
    "expectedOutcome": "Understand when thread pool executors (run_in_threadpool) are needed for CPU/disk-bound PDF parsing.",
    "deliverable": "src/core/logger.py and benchmark script comparing async vs sync throughput.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 6,
    "isoDate": "2026-11-21",
    "dateLabel": "21 Nov 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 1,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "HTTP foundations",
    "objectives": [
      "HTTP methods",
      "Request/response lifecycle",
      "Headers",
      "Body",
      "Status codes",
      "JSON serialization"
    ],
    "practicalWork": "Construct raw HTTP request test table mapping CRUD actions to semantic status codes (200, 201, 202, 400, 401, 403, 404, 422, 500).",
    "expectedOutcome": "Strict mastery of idempotent vs non-idempotent methods and headers for auth/caching.",
    "deliverable": "docs/http_status_contract.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 7,
    "isoDate": "2026-11-22",
    "dateLabel": "22 Nov 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 1,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "REST and API interaction",
    "objectives": [
      "REST resource thinking",
      "Endpoint conventions",
      "Request validation",
      "Response structure",
      "Browser developer tools"
    ],
    "practicalWork": "Inspect browser network tab during multipart form uploads and SSE streaming responses.",
    "expectedOutcome": "Ability to debug payloads, Content-Type headers, and chunked transfer encoding.",
    "deliverable": "Interactive API sandbox or curl collection.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 8,
    "isoDate": "2026-11-23",
    "dateLabel": "23 Nov 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 2,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Git and collaboration",
    "objectives": [
      "Git status/add/commit",
      "Branches",
      "Merge/pull requests",
      "Conflict awareness",
      "GitHub repository workflow"
    ],
    "practicalWork": "Initialize clean monorepo with branch protection, PR templates, and semantic git commit history.",
    "expectedOutcome": "Professional git discipline avoiding committed secrets or untracked test files.",
    "deliverable": "GitHub repository with initial README.md, .gitignore, and .env.example.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 9,
    "isoDate": "2026-11-24",
    "dateLabel": "24 Nov 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 2,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Project setup",
    "objectives": [
      "Repository layout",
      "Frontend/backend/workers/rag/evaluation/infra/tests/docs folders",
      "README",
      "Local setup guide"
    ],
    "practicalWork": "Scaffold full multi-directory project architecture conforming to source Page 1 requirements.",
    "expectedOutcome": "Reproducible local dev bootup within 5 minutes on clean environment.",
    "deliverable": "Directory structure with frontend/, backend/, workers/, rag/, evaluation/, infra/, tests/, docs/.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 10,
    "isoDate": "2026-11-25",
    "dateLabel": "25 Nov 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 2,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Configuration and health",
    "objectives": [
      "Environment configuration",
      "Secret separation",
      "FastAPI application startup",
      "/health endpoint"
    ],
    "practicalWork": "Implement Pydantic BaseSettings loading from .env with strict validation; expose GET /health with DB readiness check.",
    "expectedOutcome": "Zero secrets committed to git; health check reports DB, storage, and worker status.",
    "deliverable": "src/api/routes/health.py and tests/test_health.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 11,
    "isoDate": "2026-11-26",
    "dateLabel": "26 Nov 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 2,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Architecture walkthrough",
    "objectives": [
      "Trace browser → authenticated backend → service → response",
      "Explain why frontend does not call providers or vector DB"
    ],
    "practicalWork": "Document trust boundaries and write security defense argument for server-side key encapsulation.",
    "expectedOutcome": "Full clarity on why API keys and vector credentials must never be in frontend client code.",
    "deliverable": "docs/architecture_walkthrough_and_threat_model.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 12,
    "isoDate": "2026-11-27",
    "dateLabel": "27 Nov 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 2,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Build milestone",
    "objectives": [
      "Create repository",
      "Basic web shell",
      "FastAPI health endpoint",
      "Architecture v1",
      "Local run instructions"
    ],
    "practicalWork": "Connect basic frontend shell to FastAPI backend; verify browser displays server health and version.",
    "expectedOutcome": "First working integration milestone demonstrating end-to-end client-server connectivity.",
    "deliverable": "Live web shell calling backend /health successfully.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 13,
    "isoDate": "2026-11-28",
    "dateLabel": "28 Nov 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 2,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Testing and debugging",
    "objectives": [
      "Run locally",
      "Inspect requests",
      "Handle startup/configuration errors",
      "Verify health check",
      "Write a small test"
    ],
    "practicalWork": "Write pytest suite covering config failures, invalid env variables, and health checks.",
    "expectedOutcome": "Automated test suite execution with 100% pass rate.",
    "deliverable": "pytest suite with test_config.py and test_health.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 14,
    "isoDate": "2026-11-29",
    "dateLabel": "29 Nov 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 2,
    "phaseOrModule": "Module 1: Product, Python and web foundations",
    "topic": "Review and consolidation",
    "objectives": [
      "Explain product flow",
      "Demo repository and health check",
      "Revise notes",
      "Record unresolved questions"
    ],
    "practicalWork": "Record 5-minute video walkthrough or write detailed audit log of Module 1 deliverables.",
    "expectedOutcome": "Demonstrate readiness for Saturday assessment and next module.",
    "deliverable": "Module 1 handover summary and Week 1 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 15,
    "isoDate": "2026-11-30",
    "dateLabel": "30 Nov 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 3,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "React and TypeScript foundations",
    "objectives": [
      "React application structure",
      "TypeScript types",
      "Component boundaries",
      "Typed props"
    ],
    "practicalWork": "Define TypeScript interface contracts for documents, workspaces, chat messages, and user session.",
    "expectedOutcome": "Type safety between backend OpenAPI schema and frontend UI components.",
    "deliverable": "src/types/api_contracts.ts.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 16,
    "isoDate": "2026-12-01",
    "dateLabel": "01 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 3,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "Components and reusable UI",
    "objectives": [
      "Components",
      "Props",
      "Composition",
      "Reusable layout",
      "Navigation"
    ],
    "practicalWork": "Build reusable UI primitive components: Button, Modal, Card, Input, Badge, Table, and Notification toast.",
    "expectedOutcome": "Consistent design system matching enterprise SaaS specifications.",
    "deliverable": "src/components/ui library with zero accessibility errors.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 17,
    "isoDate": "2026-12-02",
    "dateLabel": "02 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 3,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "State and forms",
    "objectives": [
      "State",
      "Controlled inputs",
      "Form submission",
      "Client-side validation",
      "Form feedback"
    ],
    "practicalWork": "Build login and document upload forms with instant client-side validation and visual feedback.",
    "expectedOutcome": "Prevent empty or malformed submissions before touching network layer.",
    "deliverable": "Working LoginForm and UploadForm components.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 18,
    "isoDate": "2026-12-03",
    "dateLabel": "03 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 3,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "Routing and page structure",
    "objectives": [
      "Routing",
      "Protected-page concept",
      "Login, workspace, document and chat page structure"
    ],
    "practicalWork": "Implement client router with protected route guards redirecting unauthenticated users to /login.",
    "expectedOutcome": "Seamless navigation between Login, Dashboard, Workspaces, Documents, Chat, and Admin.",
    "deliverable": "Router setup with 6 defined routes and AuthGuard wrapper.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 19,
    "isoDate": "2026-12-04",
    "dateLabel": "04 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 3,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "UI states",
    "objectives": [
      "Loading",
      "Empty",
      "Success",
      "Error states",
      "Responsive UI shell",
      "Accessible feedback"
    ],
    "practicalWork": "Design dedicated empty states (\"No documents uploaded yet\"), skeleton loaders, and error banners.",
    "expectedOutcome": "Zero layout shift or unhandled loading states during async network calls.",
    "deliverable": "EmptyState, SkeletonLoader, and ErrorBanner components.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 20,
    "isoDate": "2026-12-05",
    "dateLabel": "05 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 3,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "API client patterns",
    "objectives": [
      "Central API client",
      "Base URL/configuration",
      "Typed request and response handling",
      "Error normalization"
    ],
    "practicalWork": "Create centralized fetch wrapper with automatic Bearer token injection and error normalization.",
    "expectedOutcome": "Unified handling of 401 token refresh, 403 forbidden, and 500 server errors.",
    "deliverable": "src/services/apiClient.ts.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 21,
    "isoDate": "2026-12-06",
    "dateLabel": "06 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 3,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "FastAPI routers",
    "objectives": [
      "Application structure",
      "Routers",
      "Route grouping",
      "Endpoint responsibilities"
    ],
    "practicalWork": "Structure FastAPI with APIRouter into /auth, /workspaces, /documents, /chat, /usage, and /admin.",
    "expectedOutcome": "Clean modular backend routing matching the core API contract from source Page 6.",
    "deliverable": "src/api/routers/ with modular router files.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 22,
    "isoDate": "2026-12-07",
    "dateLabel": "07 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 4,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "Pydantic schemas",
    "objectives": [
      "Request schemas",
      "Response schemas",
      "Field types",
      "Validation",
      "Useful validation errors"
    ],
    "practicalWork": "Define Pydantic v2 schemas with Field constraints, email regex, and custom validators.",
    "expectedOutcome": "Automatic Swagger/OpenAPI documentation generation and structured 422 error responses.",
    "deliverable": "src/schemas/ with UserSchema, WorkspaceSchema, ChatSchema.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 23,
    "isoDate": "2026-12-08",
    "dateLabel": "08 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 4,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "Dependency injection",
    "objectives": [
      "FastAPI dependencies",
      "Shared services",
      "Request-scoped dependencies",
      "Validation flow"
    ],
    "practicalWork": "Implement get_current_user, get_db_session, and get_workspace_permission dependencies using FastAPI Depends.",
    "expectedOutcome": "Decoupled business logic from HTTP handlers and simple mock injection for testing.",
    "deliverable": "src/api/dependencies.py with unit tests.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 24,
    "isoDate": "2026-12-09",
    "dateLabel": "09 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 4,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "Frontend-backend connection",
    "objectives": [
      "Connect forms and pages to API endpoints",
      "Submit data",
      "Render returned data"
    ],
    "practicalWork": "Wire React document list and workspace creator to FastAPI backend endpoints.",
    "expectedOutcome": "Live end-to-end data flow: user creates workspace in UI, stored in backend, listed in table.",
    "deliverable": "Working WorkspaceManager view connected to live API.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 25,
    "isoDate": "2026-12-10",
    "dateLabel": "10 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 4,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "CORS and browser security",
    "objectives": [
      "CORS purpose",
      "Local development configuration",
      "Allowed origins",
      "Avoid frontend secrets"
    ],
    "practicalWork": "Configure CORSMiddleware with explicit allowed origins; test preflight OPTIONS requests.",
    "expectedOutcome": "Secure cross-origin policy preventing unauthorized third-party site requests.",
    "deliverable": "FastAPI CORS configuration with environment-specific allowed origins.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 26,
    "isoDate": "2026-12-11",
    "dateLabel": "11 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 4,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "Error handling end-to-end",
    "objectives": [
      "API validation errors",
      "Network failures",
      "Loading reset",
      "Empty and retry states"
    ],
    "practicalWork": "Implement global React ErrorBoundary and Axios/Fetch interceptor showing user-friendly toast alerts.",
    "expectedOutcome": "App never crashes to white screen; provides clear actionable retry button on network glitch.",
    "deliverable": "src/components/ErrorBoundary.tsx and toast notification handler.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 27,
    "isoDate": "2026-12-12",
    "dateLabel": "12 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 4,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "Build milestone",
    "objectives": [
      "Responsive React + TypeScript UI shell connected to FastAPI",
      "Navigation and endpoint calls work"
    ],
    "practicalWork": "Deploy and test full UI shell with navigation, responsive mobile drawer, and functional CRUD calls.",
    "expectedOutcome": "Responsive UI operating smoothly on desktop and mobile viewports.",
    "deliverable": "Module 2 demo checkpoint verification.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 28,
    "isoDate": "2026-12-13",
    "dateLabel": "13 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 4,
    "phaseOrModule": "Module 2: Frontend UI and backend API",
    "topic": "Review and consolidation",
    "objectives": [
      "Test form submission",
      "Inspect network tab",
      "Confirm validation/API errors are clear",
      "Demo"
    ],
    "practicalWork": "Perform complete browser network inspection of all 6 core route groups.",
    "expectedOutcome": "Confirm all HTTP response codes, latency, and error states behave predictably.",
    "deliverable": "Module 2 review document and Week 2 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 29,
    "isoDate": "2026-12-14",
    "dateLabel": "14 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 5,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Relational database foundations",
    "objectives": [
      "Relational tables",
      "Rows",
      "Primary keys",
      "Foreign keys",
      "Relationships",
      "Basic SQL"
    ],
    "practicalWork": "Write relational schema DDL creating users, tenants, memberships, workspaces, documents, messages.",
    "expectedOutcome": "Solid understanding of 1:1, 1:N, and N:M relational integrity and cascade rules.",
    "deliverable": "sql/init_schema.sql.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 30,
    "isoDate": "2026-12-15",
    "dateLabel": "15 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 5,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "SQL practice",
    "objectives": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE",
      "Filtering",
      "Joins",
      "Grouping relevant to app entities"
    ],
    "practicalWork": "Execute complex multi-table SQL queries joining users, memberships, and workspaces with role filters.",
    "expectedOutcome": "Mastery of SQL joins (INNER, LEFT OUTER) and aggregate functions for usage metrics.",
    "deliverable": "sql/sample_queries.sql with explain analyze output.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 31,
    "isoDate": "2026-12-16",
    "dateLabel": "16 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 5,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "PostgreSQL schema design",
    "objectives": [
      "Users",
      "Organizations/tenants",
      "Memberships",
      "Workspaces",
      "Documents",
      "Conversations",
      "Messages",
      "Usage"
    ],
    "practicalWork": "Implement SQLAlchemy / SQLModel models for all 10 core entities from source Page 16.",
    "expectedOutcome": "Complete entity mapping with UUID primary keys and timestamp tracking.",
    "deliverable": "src/db/models.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 32,
    "isoDate": "2026-12-17",
    "dateLabel": "17 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 5,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Migrations and constraints",
    "objectives": [
      "Schema migrations",
      "Indexes",
      "Uniqueness",
      "Not-null constraints",
      "Foreign-key constraints"
    ],
    "practicalWork": "Configure Alembic migrations; add composite unique index on (tenant_id, email) and foreign keys.",
    "expectedOutcome": "Repeatable, version-controlled database migrations with rollback capability.",
    "deliverable": "alembic/versions/ migration scripts.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 33,
    "isoDate": "2026-12-18",
    "dateLabel": "18 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 5,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Transactions",
    "objectives": [
      "Transaction boundaries",
      "Commit/rollback",
      "Consistency for multi-step writes"
    ],
    "practicalWork": "Wrap workspace creation and admin membership initialization in an ACID database transaction.",
    "expectedOutcome": "Zero orphaned records if secondary insert fails; atomic rollback tested.",
    "deliverable": "src/db/transactions.py with test_transaction_rollback test.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 34,
    "isoDate": "2026-12-19",
    "dateLabel": "19 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 5,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Authentication concepts",
    "objectives": [
      "Registration",
      "Login",
      "Identity",
      "Authentication versus authorization"
    ],
    "practicalWork": "Document authentication vs authorization differences; map session token lifecycle.",
    "expectedOutcome": "Clarity on who the user is (authn) vs what they can access (authz).",
    "deliverable": "docs/auth_flow_diagram.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 35,
    "isoDate": "2026-12-20",
    "dateLabel": "20 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 5,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Password and token handling",
    "objectives": [
      "Password hashing",
      "Access tokens",
      "Refresh/session strategy",
      "Expiration and logout"
    ],
    "practicalWork": "Implement bcrypt / argon2 password hashing and JWT access token issuance (30-day expiration for prototype).",
    "expectedOutcome": "Secure password hashing with salt; JWT verification with secret signature.",
    "deliverable": "src/services/security.py with hash_password and verify_token functions.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 36,
    "isoDate": "2026-12-21",
    "dateLabel": "21 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 6,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Membership and roles",
    "objectives": [
      "Tenant/workspace membership",
      "Owner, admin and member roles",
      "Role-based permission checks"
    ],
    "practicalWork": "Implement RBAC hierarchy: Owner (full + billing), Admin (workspace/user manage), Member (read/chat).",
    "expectedOutcome": "Granular permission matrix enforced before mutation operations.",
    "deliverable": "src/services/rbac.py with require_role decorator.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 37,
    "isoDate": "2026-12-22",
    "dateLabel": "22 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 6,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Server-side authorization",
    "objectives": [
      "Authorize every protected document and chat endpoint",
      "Do not trust client-supplied tenant IDs"
    ],
    "practicalWork": "Enforce tenant_id lookup from JWT payload rather than trusting path/body parameter from client.",
    "expectedOutcome": "Prevent IDOR (Insecure Direct Object Reference) attacks on document and conversation records.",
    "deliverable": "src/api/guards.py with strict tenant authorization.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 38,
    "isoDate": "2026-12-23",
    "dateLabel": "23 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 6,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Data ownership",
    "objectives": [
      "Associate records with users, tenants and workspaces",
      "Prevent cross-tenant access"
    ],
    "practicalWork": "Add tenant_id, workspace_id, created_by to all document and message queries automatically.",
    "expectedOutcome": "Architectural guarantee of multi-tenant data segregation.",
    "deliverable": "src/db/tenant_filters.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 39,
    "isoDate": "2026-12-24",
    "dateLabel": "24 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 6,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Database integration",
    "objectives": [
      "Persist users, workspaces and app records",
      "Handle database errors safely"
    ],
    "practicalWork": "Integrate async database session pool with connection pooling and retry on disconnect.",
    "expectedOutcome": "Robust DB connection handling with graceful timeout and health recovery.",
    "deliverable": "src/db/session.py with async connection pool.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 40,
    "isoDate": "2026-12-25",
    "dateLabel": "25 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 6,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Negative security tests",
    "objectives": [
      "User A versus User B",
      "Unauthorized workspace/document access",
      "Role boundary tests"
    ],
    "practicalWork": "Write automated pytest suite verifying User A cannot read, edit, or delete User B documents (HTTP 403/404).",
    "expectedOutcome": "Zero cross-tenant leakage proven by automated test logs.",
    "deliverable": "tests/test_tenant_isolation.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 41,
    "isoDate": "2026-12-26",
    "dateLabel": "26 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 6,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Build milestone",
    "objectives": [
      "Authenticated application with PostgreSQL persistence and workspace-scoped data"
    ],
    "practicalWork": "Deploy complete auth + DB milestone: register, login, create workspace, verify DB rows.",
    "expectedOutcome": "Fully persistent authentication and tenant-scoped workspace management.",
    "deliverable": "Module 3 acceptance test pass report.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 42,
    "isoDate": "2026-12-27",
    "dateLabel": "27 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 6,
    "phaseOrModule": "Module 3: Authentication, database and tenant model",
    "topic": "Review and consolidation",
    "objectives": [
      "Demonstrate sign-in and isolation",
      "Automated tests prove user A cannot read user B records"
    ],
    "practicalWork": "Run full security audit checklist and record test coverage report.",
    "expectedOutcome": "Readiness for Module 4 and Saturday assessment.",
    "deliverable": "Module 3 documentation and Week 3 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 43,
    "isoDate": "2026-12-28",
    "dateLabel": "28 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 7,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Upload UI",
    "objectives": [
      "Drag-and-drop",
      "File picker",
      "File list",
      "Progress display",
      "Processing status"
    ],
    "practicalWork": "Build responsive drag-and-drop file upload zone with file size check and real-time upload progress.",
    "expectedOutcome": "Intuitive file upload interface displaying queued, processing, and finished states.",
    "deliverable": "src/components/FileUploadZone.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 44,
    "isoDate": "2026-12-29",
    "dateLabel": "29 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 7,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "File validation",
    "objectives": [
      "Extension",
      "MIME type",
      "File size",
      "Safe filenames",
      "Reject unsupported or suspicious inputs"
    ],
    "practicalWork": "Validate file headers (magic bytes) to prevent renamed executables; enforce 50MB file size limit.",
    "expectedOutcome": "Server rejects malicious files before writing to object storage.",
    "deliverable": "src/services/file_validator.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 45,
    "isoDate": "2026-12-30",
    "dateLabel": "30 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 7,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Safe file handling",
    "objectives": [
      "Path traversal prevention",
      "Content validation",
      "Safe storage names",
      "Scanning where infrastructure permits"
    ],
    "practicalWork": "Generate UUID-based storage keys (e.g. s3://bucket/tenants/{tid}/docs/{uuid}.pdf); sanitize filenames.",
    "expectedOutcome": "Zero directory traversal vulnerability (../../etc/passwd).",
    "deliverable": "src/services/storage_key_generator.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 46,
    "isoDate": "2026-12-31",
    "dateLabel": "31 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 7,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Object storage",
    "objectives": [
      "Store originals",
      "Local S3-compatible storage in development",
      "Cloud object storage later"
    ],
    "practicalWork": "Implement S3/MinIO client interface with put_object, get_object, and delete_object methods.",
    "expectedOutcome": "Raw document bytes stored safely in object storage, separate from relational metadata.",
    "deliverable": "src/services/s3_storage.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 47,
    "isoDate": "2027-01-01",
    "dateLabel": "01 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 7,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Document formats",
    "objectives": [
      "PDF",
      "DOCX",
      "TXT",
      "HTML",
      "CSV",
      "Format-specific extraction considerations"
    ],
    "practicalWork": "Create parser factory routing files based on MIME type to specialized extractors.",
    "expectedOutcome": "Modular parser architecture supporting heterogeneous enterprise document formats.",
    "deliverable": "src/parsers/parser_factory.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 48,
    "isoDate": "2027-01-02",
    "dateLabel": "02 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 7,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Text extraction",
    "objectives": [
      "Extract text",
      "Handle empty/malformed files",
      "Preserve document boundaries and metadata"
    ],
    "practicalWork": "Extract raw text using PyMuPDF (fitz) preserving page numbers, headers, and section breaks.",
    "expectedOutcome": "High-fidelity text extraction with clean handling of zero-byte or corrupt PDFs.",
    "deliverable": "src/parsers/pdf_parser.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 49,
    "isoDate": "2027-01-03",
    "dateLabel": "03 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 7,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "OCR",
    "objectives": [
      "OCR path for scanned PDFs/images",
      "When OCR is required",
      "Extraction metadata"
    ],
    "practicalWork": "Implement fallback OCR pipeline (Tesseract / EasyOCR) triggered when extracted text length < 50 chars per page.",
    "expectedOutcome": "Scanned image PDFs converted to searchable text with confidence scores.",
    "deliverable": "src/parsers/ocr_extractor.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 50,
    "isoDate": "2027-01-04",
    "dateLabel": "04 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 8,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Source location metadata",
    "objectives": [
      "Page numbers",
      "Section metadata",
      "Source identity",
      "Extraction provenance"
    ],
    "practicalWork": "Attach page_number, start_char, end_char, and doc_id to each extracted section.",
    "expectedOutcome": "Source provenance recorded for later citation mapping and snippet preview.",
    "deliverable": "src/parsers/metadata_attacher.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 51,
    "isoDate": "2027-01-05",
    "dateLabel": "05 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 8,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Background jobs",
    "objectives": [
      "Queue concept",
      "Asynchronous processing",
      "Why large documents should not process inside upload request"
    ],
    "practicalWork": "Set up Celery / RQ background worker with Redis broker; return 202 Accepted with job_id immediately.",
    "expectedOutcome": "Upload requests return in <200ms; heavy PDF parsing happens asynchronously in background worker.",
    "deliverable": "src/workers/ingestion_worker.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 52,
    "isoDate": "2027-01-06",
    "dateLabel": "06 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 8,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Job lifecycle",
    "objectives": [
      "Persist queued/running/succeeded/failed state",
      "Progress",
      "Failure reason",
      "Inspect status"
    ],
    "practicalWork": "Store job state transitions (QUEUED → PROCESSING → COMPLETED / FAILED) in ingestion_jobs table.",
    "expectedOutcome": "Frontend can poll GET /documents/{id} to display live percentage progress bar.",
    "deliverable": "src/workers/job_tracker.py and status polling hook.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 53,
    "isoDate": "2027-01-07",
    "dateLabel": "07 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 8,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Retries and recovery",
    "objectives": [
      "Retry policy",
      "Recoverable failures",
      "Retry visibility",
      "Avoid duplicate side effects"
    ],
    "practicalWork": "Configure exponential backoff retries with max 3 attempts; log exact failure reason on dead-letter.",
    "expectedOutcome": "Transient network drops retry cleanly without creating duplicate chunk records.",
    "deliverable": "src/workers/retry_policy.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 54,
    "isoDate": "2027-01-08",
    "dateLabel": "08 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 8,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Ingestion pipeline",
    "objectives": [
      "Upload → validation → object storage → background job → extraction/OCR → cleaning → chunking handoff"
    ],
    "practicalWork": "Wire the full ingestion pipeline end-to-end from browser drop to parsed text handoff.",
    "expectedOutcome": "Verified pipeline taking sample 20-page PDF from browser to cleaned text blocks.",
    "deliverable": "Complete ingestion pipeline integration test.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 55,
    "isoDate": "2027-01-09",
    "dateLabel": "09 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 8,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Build milestone",
    "objectives": [
      "Reliable ingestion v1",
      "Upload, status inspection, visible errors and retry"
    ],
    "practicalWork": "Verify document manager UI shows uploaded docs, live status spinner, error badges, and retry button.",
    "expectedOutcome": "Ingestion milestone passes all format, size, and corruption tests.",
    "deliverable": "Module 4 milestone verification demo.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 56,
    "isoDate": "2027-01-10",
    "dateLabel": "10 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 8,
    "phaseOrModule": "Module 4: File upload and document ingestion",
    "topic": "Review and consolidation",
    "objectives": [
      "Test supported formats, empty/corrupt files and failed jobs",
      "Confirm asynchronous recovery"
    ],
    "practicalWork": "Run chaos test: upload corrupt PDF, cut Redis connection, verify graceful error and recovery.",
    "expectedOutcome": "Zero server hangs or zombie worker processes.",
    "deliverable": "Module 4 consolidation report and Week 4 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 57,
    "isoDate": "2027-01-11",
    "dateLabel": "11 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 9,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Chunking purpose",
    "objectives": [
      "Why documents are split",
      "Retrieval granularity",
      "Context limits",
      "Trade-offs"
    ],
    "practicalWork": "Analyze chunking trade-offs: small chunks (precise retrieval, loss of context) vs large chunks (high context, dilution).",
    "expectedOutcome": "Knowledge of why chunking strategy determines RAG retrieval precision.",
    "deliverable": "docs/chunking_tradeoff_matrix.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 58,
    "isoDate": "2027-01-12",
    "dateLabel": "12 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 9,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Fixed-size chunking",
    "objectives": [
      "Chunk size",
      "Overlap",
      "Boundary effects",
      "Strengths and limitations"
    ],
    "practicalWork": "Implement token-based chunker with chunk_size=512, overlap=64 tokens using tiktoken / HuggingFace tokenizer.",
    "expectedOutcome": "Overlap preserves semantic continuity across arbitrary sentence boundaries.",
    "deliverable": "src/rag/chunkers/fixed_chunker.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 59,
    "isoDate": "2027-01-13",
    "dateLabel": "13 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 9,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Recursive chunking",
    "objectives": [
      "Recursive splitting",
      "Separators",
      "Preserving paragraphs/sections"
    ],
    "practicalWork": "Implement recursive character splitter splitting on [\"\\n\\n\", \"\\n\", \". \", \" \"].",
    "expectedOutcome": "Preserves coherent paragraphs and natural sentence boundaries wherever possible.",
    "deliverable": "src/rag/chunkers/recursive_chunker.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 60,
    "isoDate": "2027-01-14",
    "dateLabel": "14 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 9,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Semantic chunking",
    "objectives": [
      "Meaning-aware boundaries",
      "When semantic splitting may help",
      "Cost/complexity trade-offs"
    ],
    "practicalWork": "Build semantic chunker calculating cosine similarity between adjacent sentences to detect topic shifts.",
    "expectedOutcome": "Understand when semantic chunking improves quality vs when cost is prohibitive.",
    "deliverable": "src/rag/chunkers/semantic_chunker.py with benchmark.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 61,
    "isoDate": "2027-01-15",
    "dateLabel": "15 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 9,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Parent-child chunking",
    "objectives": [
      "Small retrieval child",
      "Larger parent context",
      "Mapping child to parent"
    ],
    "practicalWork": "Create small 128-token child chunks for dense vector search linked to 1024-token parent section for LLM context.",
    "expectedOutcome": "High retrieval precision without starving the generator model of surrounding narrative.",
    "deliverable": "src/rag/chunkers/parent_child_chunker.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 62,
    "isoDate": "2027-01-16",
    "dateLabel": "16 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 9,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Chunk metadata",
    "objectives": [
      "tenant_id",
      "workspace_id",
      "document_id",
      "page",
      "section",
      "chunk_index",
      "source",
      "permissions"
    ],
    "practicalWork": "Attach structured metadata payload to every chunk: tenant_id, workspace_id, doc_id, page_num, section_title.",
    "expectedOutcome": "Mandatory metadata fields present for security filtering during vector queries.",
    "deliverable": "src/rag/models/chunk_payload.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 63,
    "isoDate": "2027-01-17",
    "dateLabel": "17 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 9,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Embedding fundamentals",
    "objectives": [
      "Embedding model",
      "Vector representation",
      "Semantic similarity",
      "Model selection"
    ],
    "practicalWork": "Compare embedding models (text-embedding-3-small, BGE, Gemini text-embedding-004) on semantic similarity tasks.",
    "expectedOutcome": "Understand vector dimensionality, cosine similarity vs dot product.",
    "deliverable": "notebooks/embedding_model_comparison.ipynb.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 64,
    "isoDate": "2027-01-18",
    "dateLabel": "18 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 10,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Embedding properties",
    "objectives": [
      "Dimensions",
      "Normalization",
      "Input limits",
      "Token limits",
      "Cost",
      "Consistency of model/version"
    ],
    "practicalWork": "Implement batch embedding service with token counting, rate-limiting, and vector unit-length normalization.",
    "expectedOutcome": "Consistency of embedding model version across ingestion and retrieval.",
    "deliverable": "src/rag/embeddings/embedding_service.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 65,
    "isoDate": "2027-01-19",
    "dateLabel": "19 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 10,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Vector storage choices",
    "objectives": [
      "Qdrant or PostgreSQL with pgvector",
      "Compare fit and operational trade-offs"
    ],
    "practicalWork": "Benchmark Qdrant vs pgvector (HNSW index) for multi-tenant filtering speed and operational overhead.",
    "expectedOutcome": "Understand HNSW indexing parameters (m, ef_construction, ef_search) and metadata indexing.",
    "deliverable": "docs/vector_store_tradeoffs.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 66,
    "isoDate": "2027-01-20",
    "dateLabel": "20 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 10,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Vector records",
    "objectives": [
      "Stable IDs",
      "Vector payload",
      "Metadata filters",
      "Relational metadata linkage"
    ],
    "practicalWork": "Store vector embeddings with deterministic UUIDs linking chunk records in Postgres to vector points in Qdrant/pgvector.",
    "expectedOutcome": "Seamless foreign key linkage between vector store and relational metadata.",
    "deliverable": "src/rag/vector_store/qdrant_adapter.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 67,
    "isoDate": "2027-01-21",
    "dateLabel": "21 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 10,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Indexing and retrieval basics",
    "objectives": [
      "Persist vectors",
      "Similarity search",
      "Top-k",
      "Metadata filtering"
    ],
    "practicalWork": "Execute top-k similarity search with hard metadata filter: tenant_id == X AND workspace_id == Y.",
    "expectedOutcome": "Guaranteed tenant isolation in vector index before distance calculation.",
    "deliverable": "src/rag/retrieval/vector_searcher.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 68,
    "isoDate": "2027-01-22",
    "dateLabel": "22 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 10,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Idempotent ingestion",
    "objectives": [
      "Stable IDs",
      "Re-ingestion",
      "Duplicate prevention",
      "Document deletion",
      "Vector cleanup"
    ],
    "practicalWork": "Implement document re-index and deletion: delete existing vectors for doc_id before inserting new version.",
    "expectedOutcome": "Zero duplicate chunks when user re-uploads or updates an existing document.",
    "deliverable": "src/rag/vector_store/idempotent_indexer.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 69,
    "isoDate": "2027-01-23",
    "dateLabel": "23 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 10,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Retrieval test surface",
    "objectives": [
      "Internal retrieval endpoint or developer screen",
      "Inspect returned chunks and metadata"
    ],
    "practicalWork": "Build developer inspection screen showing query, top-k chunks, cosine scores, and metadata tags.",
    "expectedOutcome": "Visual debug UI for verifying vector retrieval quality without calling LLM.",
    "deliverable": "src/components/RetrievalInspector.tsx and GET /api/v1/dev/retrieval endpoint.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 70,
    "isoDate": "2027-01-24",
    "dateLabel": "24 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 10,
    "phaseOrModule": "Module 5: Chunking, embeddings and vector storage",
    "topic": "Build milestone",
    "objectives": [
      "Persistent vector index",
      "Uploaded documents become searchable",
      "Indexed status visible"
    ],
    "practicalWork": "Run end-to-end verification: upload PDF → chunk → embed → search via inspector.",
    "expectedOutcome": "Persistent vector storage milestone complete and verified.",
    "deliverable": "Module 5 completion report and Week 5 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 71,
    "isoDate": "2027-01-25",
    "dateLabel": "25 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 11,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Chat interface",
    "objectives": [
      "Conversation list",
      "Message bubbles",
      "Input",
      "Send/stop controls",
      "Streaming display"
    ],
    "practicalWork": "Build responsive chat UI with conversation sidebar, message bubbles, markdown rendering, and abort button.",
    "expectedOutcome": "Modern chat interface ready for streaming tokens and citation badges.",
    "deliverable": "src/components/chat/ChatWorkspace.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 72,
    "isoDate": "2027-01-26",
    "dateLabel": "26 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 11,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Query embedding",
    "objectives": [
      "Embed user query using compatible embedding model",
      "Query/vector compatibility"
    ],
    "practicalWork": "Implement query embedder using identical model and dimension configuration as document chunks.",
    "expectedOutcome": "Zero dimension mismatch errors; query normalized for cosine search.",
    "deliverable": "src/rag/retrieval/query_embedder.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 73,
    "isoDate": "2027-01-27",
    "dateLabel": "27 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 11,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Top-k retrieval",
    "objectives": [
      "Vector search",
      "Top-k selection",
      "Tenant/workspace filters applied to retrieval"
    ],
    "practicalWork": "Execute top-k search (k=5) enforcing mandatory workspace and ACL filters.",
    "expectedOutcome": "Retrieve relevant chunks scoped strictly to the current user workspace.",
    "deliverable": "src/rag/retrieval/top_k_retriever.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 74,
    "isoDate": "2027-01-28",
    "dateLabel": "28 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 11,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Prompt construction",
    "objectives": [
      "System instructions",
      "Supplied context",
      "Question",
      "Explicit evidence-only behavior"
    ],
    "practicalWork": "Construct strict evidence-based system prompt instructing LLM to answer ONLY from context with [Source X] tags.",
    "expectedOutcome": "Drastic reduction in model hallucinations; strictly grounded generation.",
    "deliverable": "src/rag/prompts/grounded_rag_prompt.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 75,
    "isoDate": "2027-01-29",
    "dateLabel": "29 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 11,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Abstention behavior",
    "objectives": [
      "Admit insufficient evidence",
      "Handle unanswerable questions",
      "Avoid unsupported claims"
    ],
    "practicalWork": "Evaluate abstention prompts with unanswerable questions; verify model replies \"I cannot find this in the documents\".",
    "expectedOutcome": "Model refuses to invent facts when context is missing.",
    "deliverable": "tests/test_abstention.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 76,
    "isoDate": "2027-01-30",
    "dateLabel": "30 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 11,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "LLM provider adapter",
    "objectives": [
      "Server-side provider adapter",
      "Provider abstraction",
      "Configuration",
      "Keep provider keys server-side"
    ],
    "practicalWork": "Create unified LLMProvider interface with Gemini, OpenAI, and Anthropic adapter implementations.",
    "expectedOutcome": "Vendor abstraction layer allowing zero-code provider swaps; keys never leave backend.",
    "deliverable": "src/rag/providers/llm_adapter.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 77,
    "isoDate": "2027-01-31",
    "dateLabel": "31 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 11,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Generation controls",
    "objectives": [
      "Timeouts",
      "Token limits",
      "Safe defaults",
      "Provider errors"
    ],
    "practicalWork": "Set strict generation timeout (30s), max_tokens=1024, temperature=0.1 for deterministic fact extraction.",
    "expectedOutcome": "Prevent runaway requests, infinite loops, and provider billing spikes.",
    "deliverable": "src/rag/providers/generation_config.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 78,
    "isoDate": "2027-02-01",
    "dateLabel": "01 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 12,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Context assembly",
    "objectives": [
      "Select retrieved chunks",
      "Order context",
      "Manage context budget",
      "Avoid irrelevant passages"
    ],
    "practicalWork": "Build context assembler fitting chunks into token budget (e.g. 4000 tokens) sorted by relevance score.",
    "expectedOutcome": "Optimal context packing without truncation of high-relevance passages.",
    "deliverable": "src/rag/context/context_assembler.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 79,
    "isoDate": "2027-02-02",
    "dateLabel": "02 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 12,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Citation mapping",
    "objectives": [
      "Map generated claims/answers to retrieved chunks",
      "Source filename",
      "Page/section references"
    ],
    "practicalWork": "Parse [Source 1], [Source 2] references in model output and map to source filename and page numbers.",
    "expectedOutcome": "Every factual claim in model answer linked to concrete evidence chunks.",
    "deliverable": "src/rag/citations/citation_mapper.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 80,
    "isoDate": "2027-02-03",
    "dateLabel": "03 Feb 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 12,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Citation UI",
    "objectives": [
      "Show citations",
      "Source preview",
      "Source snippets",
      "Link answer to evidence"
    ],
    "practicalWork": "Build interactive citation pill badges in chat bubble; clicking opens drawer with excerpt and PDF page.",
    "expectedOutcome": "User can instantly verify the source sentence supporting the AI answer.",
    "deliverable": "src/components/chat/CitationDrawer.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 81,
    "isoDate": "2027-02-04",
    "dateLabel": "04 Feb 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 12,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Streaming",
    "objectives": [
      "Stream answer to browser",
      "Partial output handling",
      "Stop generation"
    ],
    "practicalWork": "Implement Server-Sent Events (SSE) endpoint streaming tokens to browser in real-time with AbortController support.",
    "expectedOutcome": "Sub-second Time-to-First-Token (TTFT) and smooth typewriter rendering.",
    "deliverable": "src/api/routes/chat_stream.py and useStreamingChat hook.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 82,
    "isoDate": "2027-02-05",
    "dateLabel": "05 Feb 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 12,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Conversation persistence",
    "objectives": [
      "Store conversation/message history",
      "Retrieved context",
      "Model metadata for traceability"
    ],
    "practicalWork": "Persist chat sessions, user questions, assistant responses, citation arrays, and token usage to database.",
    "expectedOutcome": "Conversations reload on refresh; complete audit trail preserved.",
    "deliverable": "src/db/repositories/chat_repository.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 83,
    "isoDate": "2027-02-06",
    "dateLabel": "06 Feb 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 12,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Guardrails and trace",
    "objectives": [
      "Citation/guardrail checks",
      "Trace and usage record",
      "Safe fallback"
    ],
    "practicalWork": "Implement post-generation guardrail checking for ungrounded assertions; log trace ID for every question.",
    "expectedOutcome": "Safe fallback response if guardrail detects hallucinations.",
    "deliverable": "src/rag/guardrails/fact_checker.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 84,
    "isoDate": "2027-02-07",
    "dateLabel": "07 Feb 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 12,
    "phaseOrModule": "Module 6: Basic RAG chat and citations",
    "topic": "Build milestone",
    "objectives": [
      "End-to-end RAG MVP: streamed, cited answer grounded in retrieved sources"
    ],
    "practicalWork": "Demonstrate full RAG chat: ask question against uploaded PDF → get streamed, cited response with citations.",
    "expectedOutcome": "RAG MVP working cleanly from start to finish.",
    "deliverable": "Module 6 completion milestone demo and Week 6 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 85,
    "isoDate": "2027-02-08",
    "dateLabel": "08 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 13,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Lexical search",
    "objectives": [
      "BM25",
      "Term matching",
      "Strengths for exact names, identifiers and keywords"
    ],
    "practicalWork": "Implement BM25 search index using rank_bm25 / Elasticsearch / Postgres pg_trgm for exact code/SKU search.",
    "expectedOutcome": "Find exact acronyms, error codes, and technical names that vector embeddings often miss.",
    "deliverable": "src/rag/retrieval/bm25_searcher.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 86,
    "isoDate": "2027-02-09",
    "dateLabel": "09 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 13,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Dense versus lexical",
    "objectives": [
      "Compare dense-only retrieval with lexical search",
      "Understand complementary signals"
    ],
    "practicalWork": "Run side-by-side retrieval comparison on technical queries (\"ERR_CONN_REFUSED\", \"ISO-27001 section 4.2\").",
    "expectedOutcome": "Demonstrate where dense search fails on exact keywords and lexical fails on conceptual synonyms.",
    "deliverable": "docs/dense_vs_lexical_comparison.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 87,
    "isoDate": "2027-02-10",
    "dateLabel": "10 Feb 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 13,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Hybrid retrieval",
    "objectives": [
      "Combine lexical and dense results",
      "Fusion approach",
      "Compare retrieval quality"
    ],
    "practicalWork": "Implement Reciprocal Rank Fusion (RRF) algorithm: RRF_score = sum(1 / (k + rank)).",
    "expectedOutcome": "Robust hybrid retrieval combining semantic understanding with exact keyword precision.",
    "deliverable": "src/rag/retrieval/hybrid_rrf.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 88,
    "isoDate": "2027-02-11",
    "dateLabel": "11 Feb 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 13,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Metadata filters",
    "objectives": [
      "Tenant/workspace/document filters",
      "Filtering before results reach the model"
    ],
    "practicalWork": "Combine pre-filtering on tenant/workspace with post-filtering on document date or tag filters.",
    "expectedOutcome": "Narrow search space to relevant document subset with zero performance penalty.",
    "deliverable": "src/rag/retrieval/filtered_retriever.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 89,
    "isoDate": "2027-02-12",
    "dateLabel": "12 Feb 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 13,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Query normalization",
    "objectives": [
      "Normalize user query",
      "Handle wording variation and noisy input"
    ],
    "practicalWork": "Clean user query: strip punctuation, resolve common typos, normalize whitespace and case.",
    "expectedOutcome": "Prevent retrieval failures caused by minor typographical noise.",
    "deliverable": "src/rag/query/query_normalizer.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 90,
    "isoDate": "2027-02-13",
    "dateLabel": "13 Feb 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 13,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Query rewriting",
    "objectives": [
      "Rewrite ambiguous or conversational questions while preserving intent"
    ],
    "practicalWork": "Use fast LLM prompt to rewrite conversational follow-ups (\"What about its security?\") into standalone queries.",
    "expectedOutcome": "Multi-turn chat queries become self-contained search queries containing full context.",
    "deliverable": "src/rag/query/query_rewriter.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 91,
    "isoDate": "2027-02-14",
    "dateLabel": "14 Feb 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 13,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Multi-query retrieval",
    "objectives": [
      "Generate alternate queries",
      "Retrieve candidates",
      "Combine results",
      "Avoid unnecessary expansion"
    ],
    "practicalWork": "Generate 3 perspective variants of query, execute parallel retrieval, and merge candidate pool.",
    "expectedOutcome": "Overcome single-query phrasing bias on complex conceptual topics.",
    "deliverable": "src/rag/query/multi_query_expander.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 92,
    "isoDate": "2027-02-15",
    "dateLabel": "15 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 14,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Reranking",
    "objectives": [
      "Cross-encoder or hosted reranking model",
      "Candidate ranking",
      "Latency/cost trade-off"
    ],
    "practicalWork": "Integrate Cross-Encoder (e.g. bge-reranker-large or Cohere rerank) on top-20 retrieved chunks to pick top-5.",
    "expectedOutcome": "Significant jump in MRR and Precision@5 by scoring deep query-passage interactions.",
    "deliverable": "src/rag/rerank/cross_encoder_reranker.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 93,
    "isoDate": "2027-02-16",
    "dateLabel": "16 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 14,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Contextual compression",
    "objectives": [
      "Optional contextual compression",
      "Reduce irrelevant context while preserving evidence"
    ],
    "practicalWork": "Extract only relevant sentence spans from 1000-character chunks before sending to prompt.",
    "expectedOutcome": "Higher prompt signal-to-noise ratio and reduced token costs.",
    "deliverable": "src/rag/context/context_compressor.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 94,
    "isoDate": "2027-02-17",
    "dateLabel": "17 Feb 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 14,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "MMR",
    "objectives": [
      "Maximal Marginal Relevance",
      "Relevance/diversity trade-off",
      "Use only where useful"
    ],
    "practicalWork": "Implement Maximal Marginal Relevance to penalize redundant chunks covering identical paragraphs.",
    "expectedOutcome": "Diverse information representation across multiple document sections.",
    "deliverable": "src/rag/retrieval/mmr_reranker.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 95,
    "isoDate": "2027-02-18",
    "dateLabel": "18 Feb 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 14,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Parent-child retrieval",
    "objectives": [
      "Retrieve child chunks",
      "Expand to parent context",
      "Compare evidence completeness"
    ],
    "practicalWork": "Implement automatic context expansion: child chunk match fetches parent section and sibling chunks.",
    "expectedOutcome": "Model receives complete technical explanation without broken table rows or orphan clauses.",
    "deliverable": "src/rag/retrieval/parent_context_expander.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 96,
    "isoDate": "2027-02-19",
    "dateLabel": "19 Feb 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 14,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Retrieval tuning",
    "objectives": [
      "Tune chunk size, overlap, top-k and reranker depth using a fixed test set"
    ],
    "practicalWork": "Run hyperparameter grid search across chunk sizes [256, 512, 1024] and reranker depths [10, 20, 30].",
    "expectedOutcome": "Empirically backed configuration delivering maximum HitRate@5 on benchmark corpus.",
    "deliverable": "evaluation/retrieval_tuning_results.csv.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 97,
    "isoDate": "2027-02-20",
    "dateLabel": "20 Feb 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 14,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Relevance feedback",
    "objectives": [
      "Show source snippets",
      "Collect optional relevance feedback",
      "Use feedback as evaluation evidence"
    ],
    "practicalWork": "Add thumbs up/down and relevance star rating to citations in UI, logging feedback to database.",
    "expectedOutcome": "Continuous collection of user relevance judgments for offline evaluation.",
    "deliverable": "src/components/chat/RelevanceFeedbackWidget.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 98,
    "isoDate": "2027-02-21",
    "dateLabel": "21 Feb 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 14,
    "phaseOrModule": "Module 7: Advanced retrieval quality",
    "topic": "Build milestone",
    "objectives": [
      "Hybrid retrieval + reranking with a documented comparison report"
    ],
    "practicalWork": "Draft benchmark evaluation report comparing Dense-only vs Hybrid vs Hybrid+Reranker.",
    "expectedOutcome": "Demonstrable improvement in retrieval metrics (Recall@5 and MRR).",
    "deliverable": "docs/hybrid_reranking_benchmark_report.pdf and Week 7 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 99,
    "isoDate": "2027-02-22",
    "dateLabel": "22 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 15,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Evaluation dataset",
    "objectives": [
      "Representative questions",
      "Expected facts",
      "Relevant source IDs",
      "Unanswerable questions"
    ],
    "practicalWork": "Author 50 question-answer pairs with verified chunk IDs and 10 intentionally unanswerable trap questions.",
    "expectedOutcome": "Golden benchmark dataset representing real enterprise queries.",
    "deliverable": "evaluation/datasets/golden_eval_v1.json.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 100,
    "isoDate": "2027-02-23",
    "dateLabel": "23 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 15,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Dataset quality",
    "objectives": [
      "Coverage",
      "Realistic user questions",
      "Positive and negative examples",
      "Version the dataset"
    ],
    "practicalWork": "Review dataset distribution: short vs long queries, keyword vs natural language, single-doc vs multi-doc.",
    "expectedOutcome": "High-diversity evaluation corpus without synthetic shortcut bias.",
    "deliverable": "evaluation/datasets/dataset_schema.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 101,
    "isoDate": "2027-02-24",
    "dateLabel": "24 Feb 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 15,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Recall@K",
    "objectives": [
      "Relevant items retrieved within top K",
      "Calculate and interpret"
    ],
    "practicalWork": "Write script calculating Recall@1, Recall@3, Recall@5, and Recall@10 across test queries.",
    "expectedOutcome": "Mathematical formula implementation: (Relevant_Retrieved_in_K) / (Total_Relevant).",
    "deliverable": "src/evaluation/metrics/recall_at_k.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 102,
    "isoDate": "2027-02-25",
    "dateLabel": "25 Feb 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 15,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Precision@K",
    "objectives": [
      "Share of top-K results that are relevant",
      "Calculate and interpret"
    ],
    "practicalWork": "Implement Precision@K metric: (Relevant_Retrieved_in_K) / K.",
    "expectedOutcome": "Measure how much noise or irrelevant context is pushed into the LLM context window.",
    "deliverable": "src/evaluation/metrics/precision_at_k.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 103,
    "isoDate": "2027-02-26",
    "dateLabel": "26 Feb 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 15,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "MRR",
    "objectives": [
      "Reciprocal rank of first relevant result",
      "Compare systems"
    ],
    "practicalWork": "Calculate Mean Reciprocal Rank (MRR): (1/|Q|) * sum(1 / rank_i).",
    "expectedOutcome": "Quantify how high the first correct citation appears in the ranked results.",
    "deliverable": "src/evaluation/metrics/mrr.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 104,
    "isoDate": "2027-02-27",
    "dateLabel": "27 Feb 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 15,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "nDCG",
    "objectives": [
      "Rank-sensitive relevance metric",
      "Graded relevance",
      "Compare ranked lists"
    ],
    "practicalWork": "Implement normalized Discounted Cumulative Gain (nDCG@K) supporting graded relevance (0=irrelevant, 1=partial, 2=exact).",
    "expectedOutcome": "Gold standard ranking quality metric with logarithmic position discounting.",
    "deliverable": "src/evaluation/metrics/ndcg.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 105,
    "isoDate": "2027-02-28",
    "dateLabel": "28 Feb 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 15,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Generation evaluation",
    "objectives": [
      "Faithfulness",
      "Answer relevance",
      "Context precision",
      "Context recall"
    ],
    "practicalWork": "Implement Faithfulness check: decompose answer into claims and verify each claim is entailed by context.",
    "expectedOutcome": "Automated hallucination detection rate calculated per generation run.",
    "deliverable": "src/evaluation/metrics/faithfulness.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 106,
    "isoDate": "2027-03-01",
    "dateLabel": "01 Mar 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 16,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Evaluation tooling",
    "objectives": [
      "Ragas or equivalent",
      "Metric inputs",
      "Limitations",
      "Reproducible runs"
    ],
    "practicalWork": "Integrate Ragas framework pipeline executing batch evaluation over golden dataset.",
    "expectedOutcome": "Reproducible CI/CD evaluation run generating metrics report JSON and markdown summary.",
    "deliverable": "evaluation/run_ragas_eval.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 107,
    "isoDate": "2027-03-02",
    "dateLabel": "02 Mar 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 16,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Unit testing",
    "objectives": [
      "Chunking",
      "Metadata",
      "Prompt construction",
      "Citation mapping"
    ],
    "practicalWork": "Write isolated unit tests for text splitting, citation regex parsing, and token budget calculation.",
    "expectedOutcome": "Fast unit test suite executing in under 5 seconds with zero external dependencies.",
    "deliverable": "tests/unit/test_chunking.py and test_citations.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 108,
    "isoDate": "2027-03-03",
    "dateLabel": "03 Mar 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 16,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Integration testing",
    "objectives": [
      "Upload → index → retrieve → answer",
      "Verify full flow"
    ],
    "practicalWork": "Build end-to-end integration test creating a temporary workspace, ingesting test doc, asking question, asserting answer.",
    "expectedOutcome": "Automated verification that all pipeline components function synchronously.",
    "deliverable": "tests/integration/test_rag_pipeline.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 109,
    "isoDate": "2027-03-04",
    "dateLabel": "04 Mar 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 16,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "API testing",
    "objectives": [
      "Request validation",
      "Auth",
      "Permissions",
      "Success/error status codes"
    ],
    "practicalWork": "Write TestClient tests covering all 14 core API endpoints with valid, expired, and missing tokens.",
    "expectedOutcome": "Complete API contract compliance verified automatically.",
    "deliverable": "tests/api/test_endpoints.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 110,
    "isoDate": "2027-03-05",
    "dateLabel": "05 Mar 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 16,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Regression evaluation",
    "objectives": [
      "Compare prompt/model/chunking changes against fixed dataset",
      "Track regressions"
    ],
    "practicalWork": "Implement regression gate: fail build if Faithfulness drops >2% or Recall@5 drops >3% vs baseline.",
    "expectedOutcome": "Prevent silent quality degradations when updating system prompts or chunk sizes.",
    "deliverable": "evaluation/quality_gate_check.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 111,
    "isoDate": "2027-03-06",
    "dateLabel": "06 Mar 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 16,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Failure analysis",
    "objectives": [
      "Separate parsing, retrieval, reranking and generation failures"
    ],
    "practicalWork": "Build failure diagnostic report classifying errors into: OCR failed, Wrong chunks retrieved, Model hallucinated, or Incomplete answer.",
    "expectedOutcome": "Clear root-cause analysis distinguishing retrieval failures from generation failures.",
    "deliverable": "evaluation/failure_taxonomy_report.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 112,
    "isoDate": "2027-03-07",
    "dateLabel": "07 Mar 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 16,
    "phaseOrModule": "Module 8: Evaluation, testing and quality gates",
    "topic": "Build milestone",
    "objectives": [
      "Repeatable evaluation suite",
      "Baseline report",
      "Admin/developer quality view"
    ],
    "practicalWork": "Deploy evaluation dashboard in admin console showing latest Ragas metrics and trend graph.",
    "expectedOutcome": "Evaluation suite operating reliably on scheduled cadence.",
    "deliverable": "Module 8 evaluation milestone and Week 8 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 113,
    "isoDate": "2027-03-08",
    "dateLabel": "08 Mar 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 17,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Tenant isolation",
    "objectives": [
      "Tenant isolation in every retrieval path",
      "Enforce server-side boundaries"
    ],
    "practicalWork": "Audit all SQL queries, vector filters, and cache keys to ensure tenant_id is strictly parameterized.",
    "expectedOutcome": "Zero chance of multi-tenant cross-contamination.",
    "deliverable": "security/tenant_isolation_audit.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 114,
    "isoDate": "2027-03-09",
    "dateLabel": "09 Mar 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 17,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Document ACL",
    "objectives": [
      "Document-level access control",
      "Permission metadata",
      "Authorize before retrieval results reach model"
    ],
    "practicalWork": "Implement document-level access permissions (PUBLIC, WORKSPACE, CONFIDENTIAL); filter chunks during vector retrieval.",
    "expectedOutcome": "User only sees answers generated from documents they have explicit permission to read.",
    "deliverable": "src/rag/security/acl_filter.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 115,
    "isoDate": "2027-03-10",
    "dateLabel": "10 Mar 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 17,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Prompt injection",
    "objectives": [
      "User-question injection",
      "Untrusted document content",
      "Retrieved text is data, not instructions"
    ],
    "practicalWork": "Implement delimiter tagging and system prompt hardening: wrap context in <untrusted_document_context> XML tags.",
    "expectedOutcome": "Defense against indirect prompt injection embedded inside malicious uploaded PDFs.",
    "deliverable": "src/rag/security/injection_defense.py and penetration test suite.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 116,
    "isoDate": "2027-03-11",
    "dateLabel": "11 Mar 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 17,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Secrets management",
    "objectives": [
      "Environment variables",
      "Secret manager",
      "Least-privilege credentials",
      "Never commit secrets"
    ],
    "practicalWork": "Integrate AWS Secrets Manager / GCP Secret Manager / Vault; scan repo with git-secrets / TruffleHog.",
    "expectedOutcome": "Zero credentials or keys in git; dynamic secret rotation supported.",
    "deliverable": "scripts/verify_no_secrets.sh.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 117,
    "isoDate": "2027-03-12",
    "dateLabel": "12 Mar 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 17,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Transport and identity security",
    "objectives": [
      "HTTPS/TLS",
      "Protected endpoints",
      "Safe service identity"
    ],
    "practicalWork": "Enforce HTTPS redirect, HSTS headers, secure HTTP-only cookies, and internal service-to-service mTLS.",
    "expectedOutcome": "Encrypted communication in transit; credentials protected from man-in-the-middle attacks.",
    "deliverable": "src/api/middleware/security_headers.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 118,
    "isoDate": "2027-03-13",
    "dateLabel": "13 Mar 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 17,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Rate limiting and quotas",
    "objectives": [
      "Rate limits",
      "Upload quotas",
      "Request-size limits",
      "Expensive-operation controls"
    ],
    "practicalWork": "Implement Redis token bucket rate limiter: 60 requests/minute for chat, 10 uploads/hour per user.",
    "expectedOutcome": "Protection against DoS attacks, API exhaustion, and budget overruns.",
    "deliverable": "src/api/middleware/rate_limiter.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 119,
    "isoDate": "2027-03-14",
    "dateLabel": "14 Mar 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 17,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Timeouts and retries",
    "objectives": [
      "Timeouts",
      "Retries with backoff",
      "Provider failure handling",
      "Avoid retry storms"
    ],
    "practicalWork": "Implement circuit breaker pattern for LLM API calls with exponential backoff and jitter.",
    "expectedOutcome": "Prevent cascading system crashes when external LLM provider experiences 503 or latency spikes.",
    "deliverable": "src/core/resilience/circuit_breaker.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 120,
    "isoDate": "2027-03-15",
    "dateLabel": "15 Mar 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 18,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Caching safely",
    "objectives": [
      "Cache only safe data",
      "Avoid cross-user and permission-sensitive leakage"
    ],
    "practicalWork": "Implement semantic cache with composite key: hash(tenant_id + user_permissions_hash + normalized_query).",
    "expectedOutcome": "Sub-millisecond responses for repeated queries without leaking confidential answers across users.",
    "deliverable": "src/rag/cache/semantic_cache.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 121,
    "isoDate": "2027-03-16",
    "dateLabel": "16 Mar 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 18,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Upload security",
    "objectives": [
      "Validate file size/type/content",
      "Safe filenames",
      "Path traversal defense"
    ],
    "practicalWork": "Implement PDF zip bomb defense, sanitize file extensions, and disallow executable or macro-enabled documents.",
    "expectedOutcome": "Zero file upload attack vectors.",
    "deliverable": "src/services/upload_security.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 122,
    "isoDate": "2027-03-17",
    "dateLabel": "17 Mar 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 18,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Reliability scenarios",
    "objectives": [
      "Provider outage",
      "Invalid upload",
      "Queue failure",
      "Job retry",
      "Idempotency"
    ],
    "practicalWork": "Execute chaos engineering drill: inject 50% simulated LLM timeouts and verify queue gracefully handles retries.",
    "expectedOutcome": "Documented disaster recovery procedure and verified automated healing.",
    "deliverable": "docs/chaos_test_reliability_report.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 123,
    "isoDate": "2027-03-18",
    "dateLabel": "18 Mar 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 18,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Performance scenarios",
    "objectives": [
      "Concurrency",
      "Large files",
      "Long answers",
      "Provider rate limits"
    ],
    "practicalWork": "Profile slow queries with pg_stat_statements; optimize vector index HNSW ef_search for <50ms retrieval.",
    "expectedOutcome": "High throughput and predictable latency under concurrent multi-user load.",
    "deliverable": "performance/db_query_optimization.sql.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 124,
    "isoDate": "2027-03-19",
    "dateLabel": "19 Mar 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 18,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Load testing",
    "objectives": [
      "Representative API/retrieval traffic",
      "Workload assumptions",
      "Throughput",
      "Latency",
      "Bottlenecks"
    ],
    "practicalWork": "Run Locust / k6 load test simulating 50 concurrent active users asking questions and downloading citations.",
    "expectedOutcome": "Identify system p95 and p99 latency thresholds and system breaking point.",
    "deliverable": "performance/locustfile.py and load_test_report.pdf.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 125,
    "isoDate": "2027-03-20",
    "dateLabel": "20 Mar 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 18,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Operational limitations",
    "objectives": [
      "Document known limitations",
      "Stable errors",
      "Access-denied states"
    ],
    "practicalWork": "Document system capacity boundaries: max document size 50MB, max workspace docs 10,000, max tokens/query 4000.",
    "expectedOutcome": "Honest, transparent operational bounds preventing unexpected production degradation.",
    "deliverable": "docs/operational_limits_and_slas.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 126,
    "isoDate": "2027-03-21",
    "dateLabel": "21 Mar 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 18,
    "phaseOrModule": "Module 9: Security, reliability and performance",
    "topic": "Build milestone",
    "objectives": [
      "Security/reliability hardening report",
      "Automated access-control tests pass"
    ],
    "practicalWork": "Execute full security penetration test suite and generate compliance signoff report.",
    "expectedOutcome": "Pass all security acceptance targets defined on source Page 8.",
    "deliverable": "Module 9 signoff report and Week 9 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 127,
    "isoDate": "2027-03-22",
    "dateLabel": "22 Mar 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 19,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Structured logging",
    "objectives": [
      "Request logs",
      "Useful event fields",
      "Safe logging",
      "Avoid sensitive content leakage"
    ],
    "practicalWork": "Implement JSON structured logging with timestamp, trace_id, user_id, tenant_id, path, and duration_ms.",
    "expectedOutcome": "Zero PII, passwords, or raw document content leaked into application logs.",
    "deliverable": "src/core/logging/json_logger.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 128,
    "isoDate": "2027-03-23",
    "dateLabel": "23 Mar 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 19,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Traceability",
    "objectives": [
      "Trace IDs",
      "Trace a browser request through API, worker, retrieval and model"
    ],
    "practicalWork": "Implement distributed trace ID middleware (X-Trace-Id) propagating from React client to API, Redis worker, and vector store.",
    "expectedOutcome": "Trace any user question end-to-end to inspect exact chunks retrieved and model parameters.",
    "deliverable": "src/core/telemetry/tracer.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 129,
    "isoDate": "2027-03-24",
    "dateLabel": "24 Mar 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 19,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Operational metrics",
    "objectives": [
      "API errors",
      "Queue backlog",
      "Latency",
      "Provider failures"
    ],
    "practicalWork": "Export Prometheus metrics: http_requests_total, rag_query_duration_seconds, celery_queue_length, llm_token_count.",
    "expectedOutcome": "Real-time operational observability for operations and engineering teams.",
    "deliverable": "src/core/telemetry/prometheus_exporter.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 130,
    "isoDate": "2027-03-25",
    "dateLabel": "25 Mar 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 19,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Dashboards",
    "objectives": [
      "Operational dashboard",
      "Ingestion health",
      "Request and provider status"
    ],
    "practicalWork": "Build Grafana / in-app admin dashboard displaying system health, throughput, latency percentiles, and error rate.",
    "expectedOutcome": "Single-pane-of-glass operational visibility.",
    "deliverable": "src/components/admin/OperationalDashboard.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 131,
    "isoDate": "2027-03-26",
    "dateLabel": "26 Mar 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 19,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Alerts",
    "objectives": [
      "Alert conditions for errors, backlog, latency and provider failures"
    ],
    "practicalWork": "Configure alert rules: Trigger warning if error rate >2% for 5 mins, or queue backlog >100 items.",
    "expectedOutcome": "Actionable alerts alerting on-call engineers before user impact occurs.",
    "deliverable": "infra/alerting_rules.yml.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 132,
    "isoDate": "2027-03-27",
    "dateLabel": "27 Mar 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 19,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Usage accounting",
    "objectives": [
      "LLM input/output tokens",
      "Embedding usage",
      "Usage per tenant"
    ],
    "practicalWork": "Record every token used: input_tokens, output_tokens, embedding_tokens attributed to tenant_id and user_id.",
    "expectedOutcome": "Accurate multi-tenant billing and internal usage accounting.",
    "deliverable": "src/services/usage_accounting.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 133,
    "isoDate": "2027-03-28",
    "dateLabel": "28 Mar 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 19,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Cost estimation",
    "objectives": [
      "Cost per question",
      "Embedding cost",
      "Storage and compute",
      "Cost per tenant"
    ],
    "practicalWork": "Build cost calculator: compute exact dollar cost per query based on token pricing and vector compute.",
    "expectedOutcome": "Understand economics of RAG: cost per query typically $0.002 - $0.015.",
    "deliverable": "src/services/cost_calculator.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 134,
    "isoDate": "2027-03-29",
    "dateLabel": "29 Mar 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 20,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Budget controls",
    "objectives": [
      "Usage quotas",
      "Cost visibility",
      "Identify expensive workflows"
    ],
    "practicalWork": "Enforce tenant monthly dollar budget limit; reject non-essential requests once 95% quota reached.",
    "expectedOutcome": "Prevent unexpected cloud billing disasters.",
    "deliverable": "src/services/budget_guard.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 135,
    "isoDate": "2027-03-30",
    "dateLabel": "30 Mar 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 20,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Latency measures",
    "objectives": [
      "API latency",
      "Retrieval latency",
      "Time-to-first-token",
      "Total answer time"
    ],
    "practicalWork": "Measure and record latency waterfall: parsing (500ms) → embedding (80ms) → vector search (45ms) → TTFT (300ms) → total stream (2.1s).",
    "expectedOutcome": "Clear understanding of latency bottlenecks across the RAG lifecycle.",
    "deliverable": "docs/rag_latency_waterfall.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 136,
    "isoDate": "2027-03-31",
    "dateLabel": "31 Mar 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 20,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Queue operations",
    "objectives": [
      "Queue health",
      "Failed jobs",
      "Retry and recovery visibility"
    ],
    "practicalWork": "Build dead-letter queue management screen allowing admin to inspect failed jobs and trigger manual retry.",
    "expectedOutcome": "Zero lost ingestion jobs during worker crashes.",
    "deliverable": "src/components/admin/QueueManager.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 137,
    "isoDate": "2027-04-01",
    "dateLabel": "01 Apr 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 20,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Backup strategy",
    "objectives": [
      "Relational database backups",
      "Object storage backups",
      "Vector index rebuild strategy"
    ],
    "practicalWork": "Define automated backup plan: daily Postgres pg_dump, S3 versioning, and cold vector index rebuild script.",
    "expectedOutcome": "Disaster recovery plan with Recovery Point Objective (RPO) < 24h and Recovery Time Objective (RTO) < 2h.",
    "deliverable": "scripts/backup_postgres.sh.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 138,
    "isoDate": "2027-04-02",
    "dateLabel": "02 Apr 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 20,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Restore and recovery",
    "objectives": [
      "Restore drill",
      "Rebuild vector index",
      "Validate recovered application"
    ],
    "practicalWork": "Execute full disaster recovery drill: wipe local database, restore from backup, re-index vector store, run smoke test.",
    "expectedOutcome": "Proven recovery procedure tested in practice, not just theoretical documentation.",
    "deliverable": "docs/disaster_recovery_drill_evidence.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 139,
    "isoDate": "2027-04-03",
    "dateLabel": "03 Apr 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 20,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Runbooks",
    "objectives": [
      "Operational procedures",
      "Incident diagnosis",
      "Provider outage and queue recovery"
    ],
    "practicalWork": "Write clear standard operating procedure (SOP) runbooks for: High Error Rate, Queue Jam, Vector Search Failure, LLM Outage.",
    "expectedOutcome": "Operational clarity for on-call personnel during incidents.",
    "deliverable": "docs/runbooks/ directory with 4 operational SOPs.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 140,
    "isoDate": "2027-04-04",
    "dateLabel": "04 Apr 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 20,
    "phaseOrModule": "Module 10: Observability, cost and operational controls",
    "topic": "Build milestone",
    "objectives": [
      "Operational dashboard",
      "Traceable requests",
      "Usage and cost report"
    ],
    "practicalWork": "Verify in-app admin screen displays real token counts, estimated dollar costs, and trace IDs.",
    "expectedOutcome": "Observability and operational control milestone complete.",
    "deliverable": "Module 10 signoff and Week 10 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 141,
    "isoDate": "2027-04-05",
    "dateLabel": "05 Apr 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 21,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Deployment architecture",
    "objectives": [
      "Frontend, backend, worker, database, object storage and vector store deployment boundaries"
    ],
    "practicalWork": "Draw production deployment topology diagram: Cloud Run / ECS / K8s, RDS Postgres, Qdrant Cloud, S3.",
    "expectedOutcome": "Clear isolation of stateless web/API nodes from stateful databases and asynchronous background workers.",
    "deliverable": "docs/production_deployment_topology.png.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 142,
    "isoDate": "2027-04-06",
    "dateLabel": "06 Apr 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 21,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Containerization",
    "objectives": [
      "Docker basics for app services",
      "Reproducible runtime configuration"
    ],
    "practicalWork": "Write multi-stage Dockerfiles for React frontend (nginx) and Python FastAPI backend (uvicorn non-root user).",
    "expectedOutcome": "Minimal container image sizes (<150MB) and non-root security compliance.",
    "deliverable": "Dockerfile.backend and Dockerfile.frontend.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 143,
    "isoDate": "2027-04-07",
    "dateLabel": "07 Apr 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 21,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Environment separation",
    "objectives": [
      "Development/staging/production configuration",
      "Secrets per environment"
    ],
    "practicalWork": "Configure distinct dev, staging, and prod environment profiles with dedicated databases and isolated storage buckets.",
    "expectedOutcome": "Zero risk of staging tests affecting production customer data.",
    "deliverable": "infra/environments/ directory with terraform/compose files.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 144,
    "isoDate": "2027-04-08",
    "dateLabel": "08 Apr 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 21,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Database deployment",
    "objectives": [
      "Production PostgreSQL",
      "Migrations",
      "Connectivity and backups"
    ],
    "practicalWork": "Set up managed PostgreSQL with connection pooler (PgBouncer), automated backups, and SSL encryption enforced.",
    "expectedOutcome": "High-availability database configuration with automated point-in-time recovery.",
    "deliverable": "infra/postgres_config.sql.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 145,
    "isoDate": "2027-04-09",
    "dateLabel": "09 Apr 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 21,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Storage and worker deployment",
    "objectives": [
      "Object storage configuration",
      "Background worker process",
      "Queue connectivity"
    ],
    "practicalWork": "Deploy Celery workers as dedicated auto-scaling container services connected to managed Redis.",
    "expectedOutcome": "Worker instances scale dynamically based on ingestion queue length.",
    "deliverable": "docker-compose.prod.yml with worker service.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 146,
    "isoDate": "2027-04-10",
    "dateLabel": "10 Apr 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 21,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Vector service deployment",
    "objectives": [
      "Qdrant or pgvector deployment",
      "Persistence",
      "Connectivity",
      "Backup/rebuild plan"
    ],
    "practicalWork": "Deploy persistent vector database with snapshot volume backups and health probes.",
    "expectedOutcome": "Vector search uptime decoupled from API restarts; snapshot persistence verified.",
    "deliverable": "infra/qdrant_service.yml.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 147,
    "isoDate": "2027-04-11",
    "dateLabel": "11 Apr 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 21,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "CI workflow",
    "objectives": [
      "Automated checks",
      "Lint/test/build",
      "Pull-request validation"
    ],
    "practicalWork": "Set up GitHub Actions CI workflow executing ruff, mypy, tsc, pytest, and docker build on every pull request.",
    "expectedOutcome": "Automated quality gate blocking broken code from merging to main branch.",
    "deliverable": ".github/workflows/ci.yml.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 148,
    "isoDate": "2027-04-12",
    "dateLabel": "12 Apr 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 22,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "CD workflow",
    "objectives": [
      "Controlled deployment",
      "Environment configuration",
      "Release process"
    ],
    "practicalWork": "Configure CD pipeline: automatically deploy passing main branch to staging, manual approval for production.",
    "expectedOutcome": "Repeatable, zero-downtime deployment process with blue/green or rolling updates.",
    "deliverable": ".github/workflows/cd.yml.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 149,
    "isoDate": "2027-04-13",
    "dateLabel": "13 Apr 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 22,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "HTTPS and domain",
    "objectives": [
      "Public HTTPS URL",
      "TLS",
      "Domain and allowed-origin configuration"
    ],
    "practicalWork": "Provision TLS certificate via Let’s Encrypt / Cloudflare; configure custom domain with strict A+ SSL rating.",
    "expectedOutcome": "Secure public HTTPS URL with automated TLS renewal.",
    "deliverable": "infra/caddy_or_nginx.conf with TLS certificate rules.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 150,
    "isoDate": "2027-04-14",
    "dateLabel": "14 Apr 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 22,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Health checks",
    "objectives": [
      "Health endpoint",
      "Service readiness",
      "Dependency checks"
    ],
    "practicalWork": "Implement liveness (/healthz) and readiness (/readyz) probes checking database, Redis, and vector store.",
    "expectedOutcome": "Orchestrator routes traffic only to healthy instances; restarts deadlocked workers.",
    "deliverable": "src/api/routes/probes.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 151,
    "isoDate": "2027-04-15",
    "dateLabel": "15 Apr 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 22,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Monitoring after release",
    "objectives": [
      "Logs",
      "Metrics",
      "Alerts",
      "Provider/queue failure observation"
    ],
    "practicalWork": "Verify cloud logging and alerting in production environment; trigger synthetic test probe every 60 seconds.",
    "expectedOutcome": "Immediate notification via Slack / Email if API endpoint fails.",
    "deliverable": "infra/monitoring_synthetic_prober.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 152,
    "isoDate": "2027-04-16",
    "dateLabel": "16 Apr 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 22,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Rollback",
    "objectives": [
      "Release rollback",
      "Database migration caution",
      "Recovery plan"
    ],
    "practicalWork": "Execute rollback test: revert deployment to previous container digest within 60 seconds; handle DB backward compatibility.",
    "expectedOutcome": "Documented rollback procedure avoiding catastrophic data loss during faulty releases.",
    "deliverable": "docs/release_rollback_procedure.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 153,
    "isoDate": "2027-04-17",
    "dateLabel": "17 Apr 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 22,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Clean environment test",
    "objectives": [
      "Bring up application from documented steps",
      "Verify secrets/configuration and setup"
    ],
    "practicalWork": "Clone repository onto clean VM/machine; execute setup guide word-for-word; verify full bootup.",
    "expectedOutcome": "Documentation is completely self-sufficient; zero missing environment variables.",
    "deliverable": "docs/clean_install_verification_log.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 154,
    "isoDate": "2027-04-18",
    "dateLabel": "18 Apr 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 22,
    "phaseOrModule": "Module 11: Deployment and CI/CD",
    "topic": "Build milestone",
    "objectives": [
      "Public HTTPS deployment with real login, upload and chat workflows"
    ],
    "practicalWork": "Verify live public URL with working login, file upload, indexing, and chat streaming.",
    "expectedOutcome": "Deployed production product fully verified on public web.",
    "deliverable": "Module 11 deployment signoff and Week 11 assessment submission.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 155,
    "isoDate": "2027-04-19",
    "dateLabel": "19 Apr 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 23,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Capstone scope",
    "objectives": [
      "Enterprise AI Knowledge Assistant",
      "Internal policies, product manuals, technical documentation and process guides"
    ],
    "practicalWork": "Finalize enterprise scenario: multi-department employee knowledge portal covering HR, Engineering, and Compliance.",
    "expectedOutcome": "Comprehensive scope definition matching enterprise production standards.",
    "deliverable": "docs/capstone_specification.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 156,
    "isoDate": "2027-04-20",
    "dateLabel": "20 Apr 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 23,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Login/registration screen",
    "objectives": [
      "Sign in",
      "Validation",
      "Logout",
      "Protected-route behavior"
    ],
    "practicalWork": "Polish authentication screen: password show/hide, remember me, error handling, clean branding.",
    "expectedOutcome": "Production-grade login UX with zero visual defects.",
    "deliverable": "src/components/auth/AuthScreen.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 157,
    "isoDate": "2027-04-21",
    "dateLabel": "21 Apr 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 23,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Workspace dashboard",
    "objectives": [
      "Create/select workspace",
      "Document totals",
      "Ingestion health"
    ],
    "practicalWork": "Build workspace switcher with document count cards, total indexed tokens, and ingestion health widget.",
    "expectedOutcome": "Intuitive multi-workspace navigation for different departments.",
    "deliverable": "src/components/workspace/WorkspaceDashboard.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 158,
    "isoDate": "2027-04-22",
    "dateLabel": "22 Apr 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 23,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Document manager",
    "objectives": [
      "Upload",
      "List",
      "Filter",
      "Inspect status",
      "Retry",
      "Delete",
      "Supported formats"
    ],
    "practicalWork": "Polish document manager: multi-file upload, search filter, status badges, chunk inspection modal, delete confirmation.",
    "expectedOutcome": "Robust document management with immediate UI responsiveness.",
    "deliverable": "src/components/documents/DocumentManager.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 159,
    "isoDate": "2027-04-23",
    "dateLabel": "23 Apr 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 23,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Chat workspace",
    "objectives": [
      "Ask questions",
      "Stream responses",
      "Stop generation",
      "Citations",
      "Source snippets"
    ],
    "practicalWork": "Polish chat screen: real-time streaming tokens, markdown table support, copy-to-clipboard, citation preview popover.",
    "expectedOutcome": "Executive-level chat experience matching ChatGPT / Claude interface fidelity.",
    "deliverable": "src/components/chat/ProductionChat.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 160,
    "isoDate": "2027-04-24",
    "dateLabel": "24 Apr 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 23,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Conversation history",
    "objectives": [
      "List",
      "Reopen",
      "Rename",
      "Delete sessions"
    ],
    "practicalWork": "Implement session management: list historical chats by date, inline rename title, delete chat session.",
    "expectedOutcome": "Full chat history continuity across browser sessions.",
    "deliverable": "src/components/chat/ConversationHistorySidebar.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 161,
    "isoDate": "2027-04-25",
    "dateLabel": "25 Apr 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 23,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Admin/usage screen",
    "objectives": [
      "User/tenant usage",
      "Token counts",
      "Estimated cost",
      "System status",
      "Role protection"
    ],
    "practicalWork": "Build admin console with role protection: show user breakdown, tokens consumed, estimated cost, system health indicators.",
    "expectedOutcome": "Enterprise administrative governance and cost visibility.",
    "deliverable": "src/components/admin/AdminUsageConsole.tsx.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 162,
    "isoDate": "2027-04-26",
    "dateLabel": "26 Apr 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 24,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "End-to-end journey",
    "objectives": [
      "Sign in → workspace → upload → processing → ask → cited answer → history"
    ],
    "practicalWork": "Walk through complete user journey with demo persona; verify zero glitches or latency hiccups.",
    "expectedOutcome": "Flawless execution of all 6 user journeys specified in capstone requirements.",
    "deliverable": "docs/e2e_user_journey_test_recording.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 163,
    "isoDate": "2027-04-27",
    "dateLabel": "27 Apr 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 24,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Load-test report",
    "objectives": [
      "Representative workload",
      "Throughput",
      "Latency",
      "Bottlenecks",
      "Assumptions"
    ],
    "practicalWork": "Execute final load test: document throughput (docs/min), chat response p95 latency under 100 RPS.",
    "expectedOutcome": "Comprehensive load test report with clear bottleneck identification.",
    "deliverable": "docs/final_load_test_report.pdf.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 164,
    "isoDate": "2027-04-28",
    "dateLabel": "28 Apr 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 24,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Evaluation evidence",
    "objectives": [
      "Dataset",
      "Metrics",
      "Baseline",
      "Improvement",
      "Failure analysis"
    ],
    "practicalWork": "Compile final evaluation evidence pack: Ragas metrics table, baseline vs final comparisons, failure taxonomy.",
    "expectedOutcome": "Quantitative proof of high retrieval quality (MRR > 0.85, Faithfulness > 0.90).",
    "deliverable": "evaluation/final_evaluation_evidence_pack.pdf.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 165,
    "isoDate": "2027-04-29",
    "dateLabel": "29 Apr 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 24,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Security evidence",
    "objectives": [
      "Negative access tests",
      "Injection tests",
      "Upload validation",
      "Secret handling"
    ],
    "practicalWork": "Assemble security test evidence: automated test run logs proving zero cross-tenant leakage and injection resistance.",
    "expectedOutcome": "Complete security signoff audit trail.",
    "deliverable": "security/final_security_audit_evidence.pdf.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 166,
    "isoDate": "2027-04-30",
    "dateLabel": "30 Apr 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 24,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Documentation",
    "objectives": [
      "Architecture diagram requirement",
      "ER diagram requirement",
      "OpenAPI/Swagger",
      "Endpoint notes",
      "Setup guide",
      "Runbooks"
    ],
    "practicalWork": "Compile all architecture diagrams, ER diagrams, OpenAPI specs, and setup instructions into clean docs portal.",
    "expectedOutcome": "Comprehensive engineering documentation for seamless handover.",
    "deliverable": "docs/complete_system_documentation.pdf.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 167,
    "isoDate": "2027-05-01",
    "dateLabel": "01 May 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 24,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Demo and handover",
    "objectives": [
      "Live URL",
      "Demo account with non-sensitive sample data",
      "Recorded demo/live walkthrough"
    ],
    "practicalWork": "Prepare live URL with demo credentials, populate with sample company policy PDFs, record 10-minute demo walkthrough.",
    "expectedOutcome": "Professional executive presentation demonstrating full capstone functionality.",
    "deliverable": "demo/recorded_walkthrough_link.txt and demo_credentials.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 168,
    "isoDate": "2027-05-02",
    "dateLabel": "02 May 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 24,
    "phaseOrModule": "Module 12: Capstone, load testing and handover",
    "topic": "Build milestone",
    "objectives": [
      "Complete deployed product demonstrated from sign-in to cited answer",
      "Final handover pack"
    ],
    "practicalWork": "Package complete final submission pack conforming to source Page 9 specifications.",
    "expectedOutcome": "Full capstone project milestone completed and verified.",
    "deliverable": "Module 12 final capstone submission and Week 12 assessment.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 169,
    "isoDate": "2027-05-03",
    "dateLabel": "03 May 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 25,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "API contract — endpoint inventory",
    "objectives": [
      "Read every endpoint group in the source API contract",
      "Identify method, path, auth requirement, request/response responsibility and error behavior",
      "Reproduce the source endpoint list exactly in your API notes"
    ],
    "practicalWork": "Verify exact compliance with all 14 endpoints listed in source Page 16 contract.",
    "expectedOutcome": "100% API contract compliance with zero missing endpoints.",
    "deliverable": "docs/audit/api_endpoint_inventory_audit.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 170,
    "isoDate": "2027-05-04",
    "dateLabel": "04 May 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 25,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "API implementation and documentation",
    "objectives": [
      "Implement the source endpoint contract in FastAPI",
      "Validate request/response schemas",
      "Expose OpenAPI/Swagger",
      "Write concise endpoint notes",
      "Test protected and invalid requests"
    ],
    "practicalWork": "Audit OpenAPI/Swagger documentation schema descriptions and error response structures.",
    "expectedOutcome": "Fully validated API documentation matching enterprise standards.",
    "deliverable": "openapi.json specification and interactive Swagger UI.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 171,
    "isoDate": "2027-05-05",
    "dateLabel": "05 May 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 25,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "Database entities and relationships",
    "objectives": [
      "Study every source-listed entity and field",
      "Map primary/foreign keys, tenant/workspace ownership, document/message relationships and usage records",
      "Validate migrations and indexes"
    ],
    "practicalWork": "Audit all 10 core entities from source Page 16 in Postgres database and verify relational constraints.",
    "expectedOutcome": "Zero missing fields or orphaned foreign keys across the schema.",
    "deliverable": "docs/audit/database_entity_schema_verification.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 172,
    "isoDate": "2027-05-06",
    "dateLabel": "06 May 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 25,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "Vector payload and metadata integrity",
    "objectives": [
      "Verify tenant_id, workspace_id, document_id, page, section, chunk_index, source and permissions are attached and filtered correctly",
      "Test re-ingestion and deletion"
    ],
    "practicalWork": "Inspect raw vector store payloads to confirm every chunk contains all 8 mandatory metadata attributes.",
    "expectedOutcome": "Vector payload metadata completeness verified.",
    "deliverable": "scripts/verify_vector_payloads.py.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 173,
    "isoDate": "2027-05-07",
    "dateLabel": "07 May 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 25,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "Recommended stack audit",
    "objectives": [
      "Review the source’s recommended stack by layer",
      "Record selected option, reason, cost/operational trade-off and what is deliberately not being adopted"
    ],
    "practicalWork": "Audit architecture stack against source Page 16-17; document rationale for each technology choice.",
    "expectedOutcome": "Rigorous engineering justification for frontend, backend, vector store, and queue tools.",
    "deliverable": "docs/audit/recommended_stack_audit.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 174,
    "isoDate": "2027-05-08",
    "dateLabel": "08 May 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 25,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "Evaluation evidence audit",
    "objectives": [
      "Verify ingestion, retrieval, generation, security, reliability, performance, cost and operations evidence",
      "Run the fixed dataset and retain results"
    ],
    "practicalWork": "Execute full evaluation harness against test corpus; audit results against source Page 17 evaluation dimensions.",
    "expectedOutcome": "Retain versioned evaluation results proving quantitative system performance.",
    "deliverable": "docs/audit/evaluation_evidence_signoff.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 175,
    "isoDate": "2027-05-09",
    "dateLabel": "09 May 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 25,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "Security and acceptance audit",
    "objectives": [
      "Test every minimum security requirement and each suggested acceptance target",
      "Retain negative tests, citation checks, abstention tests, recovery tests and clean deployment evidence"
    ],
    "practicalWork": "Run all 8 minimum security requirement checks and 6 suggested acceptance targets from source Page 17-18.",
    "expectedOutcome": "100% compliance with security and acceptance targets.",
    "deliverable": "docs/audit/security_acceptance_audit.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 176,
    "isoDate": "2027-05-10",
    "dateLabel": "10 May 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 26,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "Capstone screens — first half",
    "objectives": [
      "Complete login/registration, workspace dashboard and document manager",
      "Verify every required action and role boundary"
    ],
    "practicalWork": "Verify all actions on screens 1, 2, and 3 from source Page 18: login, workspace selection, document upload/retry/delete.",
    "expectedOutcome": "First three capstone screens pass comprehensive QA checklist.",
    "deliverable": "docs/audit/capstone_screens_part1_qa.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 177,
    "isoDate": "2027-05-11",
    "dateLabel": "11 May 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 26,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "Capstone screens — second half",
    "objectives": [
      "Complete chat workspace, conversation history and admin/usage screens",
      "Verify streaming, citations, source snippets, history actions and role protection"
    ],
    "practicalWork": "Verify all actions on screens 4, 5, and 6 from source Page 18: streaming chat, citation drawer, session history, admin metrics.",
    "expectedOutcome": "Final three capstone screens pass comprehensive QA checklist.",
    "deliverable": "docs/audit/capstone_screens_part2_qa.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 178,
    "isoDate": "2027-05-12",
    "dateLabel": "12 May 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 26,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "Final submission pack",
    "objectives": [
      "Prepare live URL, non-sensitive demo account, clean GitHub repository, README, .env.example, setup guide, architecture and ER diagrams, API docs, evaluation report, security evidence, runbook and demo"
    ],
    "practicalWork": "Audit all 7 mandatory items of the Final Submission Pack from source Page 18.",
    "expectedOutcome": "Complete, polished delivery pack ready for mentor and stakeholder review.",
    "deliverable": "docs/FINAL_SUBMISSION_PACK.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 179,
    "isoDate": "2027-05-13",
    "dateLabel": "13 May 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 26,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "Grading rubric and mentor viva",
    "objectives": [
      "Review every grading category and weight from the source",
      "Answer mentor questions: explain feature, trace request, identify failures, prove isolation, justify chunking/retrieval/model/database choices, deploy cleanly and diagnose logs"
    ],
    "practicalWork": "Simulate defense against all 6 mentor checkpoint questions and evaluate against the 6 rubric categories (100% total).",
    "expectedOutcome": "Mastery of technical explanation, architecture trade-offs, and failure mode analysis.",
    "deliverable": "docs/mentor_viva_defense_transcript.md.",
    "isDsaRelated": false
  },
  {
    "trackId": "main",
    "trackLabel": "Main Plan — 180 Days",
    "dayNumber": 180,
    "isoDate": "2027-05-14",
    "dateLabel": "14 May 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 26,
    "phaseOrModule": "Module 13: Source-Requirements, Integration and Handover",
    "topic": "Final end-to-end release rehearsal",
    "objectives": [
      "From a clean environment: sign in → create/select workspace → upload → inspect processing → ask question → verify cited answer → inspect history/admin usage → demonstrate logs/traces → explain limitations and recovery"
    ],
    "practicalWork": "Perform complete end-to-end dry run from scratch; celebrate completion of the 180-day preparation journey!",
    "expectedOutcome": "Flawless execution of complete production RAG system.",
    "deliverable": "docs/FINAL_COMPLETION_CERTIFICATE_AND_SIGNOFF.md.",
    "isDsaRelated": false
  }
];

export const DSA_CURRICULUM_CONTEXTS: SharedCurriculumDayContext[] = [
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 1,
    "isoDate": "2026-11-16",
    "dateLabel": "16 Nov 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 1,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "C++ setup and first program",
    "objectives": [
      "Understand compiler, source file, compile/run cycle and basic program structure.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Set up or verify a C++17 compiler. Write Hello World, add comments, compile, run, deliberately introduce one syntax error and fix it.",
    "expectedOutcome": "C++ setup and first program. Understand compiler, source file, compile/run cycle and basic program structure.",
    "deliverable": "A working hello.cpp and a short note on compile errors.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 2,
    "isoDate": "2026-11-17",
    "dateLabel": "17 Nov 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 1,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Variables and data types",
    "objectives": [
      "Learn int, long long, float, double, char, bool, constants and type conversion.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Write a program that stores name/age/marks, prints values and converts between integer and floating-point values. Test boundary values.",
    "expectedOutcome": "Variables and data types. Learn int, long long, float, double, char, bool, constants and type conversion.",
    "deliverable": "One program using at least five data types.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 3,
    "isoDate": "2026-11-18",
    "dateLabel": "18 Nov 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 1,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Operators and expressions",
    "objectives": [
      "Understand arithmetic, relational, logical, assignment operators, precedence and integer division.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Build a two-number calculator. Test division, remainder, comparison and logical conditions. Predict outputs before running.",
    "expectedOutcome": "Operators and expressions. Understand arithmetic, relational, logical, assignment operators, precedence and integer division.",
    "deliverable": "Calculator program plus five expression dry-runs.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 4,
    "isoDate": "2026-11-19",
    "dateLabel": "19 Nov 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 1,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Conditionals",
    "objectives": [
      "Learn if, else-if, nested if and switch-case.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Write programs for even/odd, largest of three numbers, grade calculator and simple menu-driven calculator.",
    "expectedOutcome": "Conditionals. Learn if, else-if, nested if and switch-case.",
    "deliverable": "Four small conditional programs.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 5,
    "isoDate": "2026-11-20",
    "dateLabel": "20 Nov 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 1,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Loops",
    "objectives": [
      "Understand for, while, do-while, counters and accumulators.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Print 1–100, multiplication table, sum of first N numbers and factorial using loops.",
    "expectedOutcome": "Loops. Understand for, while, do-while, counters and accumulators.",
    "deliverable": "Four loop exercises with dry-run notes.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 6,
    "isoDate": "2026-11-21",
    "dateLabel": "21 Nov 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 1,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 7,
    "isoDate": "2026-11-22",
    "dateLabel": "22 Nov 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 1,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 8,
    "isoDate": "2026-11-23",
    "dateLabel": "23 Nov 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 2,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Nested loops and debugging",
    "objectives": [
      "Learn nested loops, break, continue and off-by-one errors.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Print a rectangle, right triangle and number pattern. Trace loop variables on paper and fix one intentional bug.",
    "expectedOutcome": "Nested loops and debugging. Learn nested loops, break, continue and off-by-one errors.",
    "deliverable": "Three pattern programs and a debugging note.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 9,
    "isoDate": "2026-11-24",
    "dateLabel": "24 Nov 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 2,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Functions",
    "objectives": [
      "Understand function declaration, definition, parameters, return values and scope.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Create functions for add, maximum, prime check and factorial. Call them from main and test multiple inputs.",
    "expectedOutcome": "Functions. Understand function declaration, definition, parameters, return values and scope.",
    "deliverable": "Four reusable functions in one program.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 10,
    "isoDate": "2026-11-25",
    "dateLabel": "25 Nov 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 2,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "References and function overloading",
    "objectives": [
      "Understand pass-by-value, pass-by-reference, const reference and overload resolution.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Write swap-by-value and swap-by-reference programs. Create overloaded area functions for circle and rectangle.",
    "expectedOutcome": "References and function overloading. Understand pass-by-value, pass-by-reference, const reference and overload resolution.",
    "deliverable": "Reference demo and overloaded functions.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 11,
    "isoDate": "2026-11-26",
    "dateLabel": "26 Nov 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 2,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Arrays",
    "objectives": [
      "Learn declaration, indexing, traversal and update operations.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Read N numbers into an array/vector. Calculate sum, average, minimum, maximum and reverse order.",
    "expectedOutcome": "Arrays. Learn declaration, indexing, traversal and update operations.",
    "deliverable": "Array program with five operations.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 12,
    "isoDate": "2026-11-27",
    "dateLabel": "27 Nov 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 2,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Strings",
    "objectives": [
      "Learn std::string, length, indexing, compare, substr and find.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Write programs for palindrome check, vowel count, word count, reverse string and character frequency.",
    "expectedOutcome": "Strings. Learn std::string, length, indexing, compare, substr and find.",
    "deliverable": "Five string exercises.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 13,
    "isoDate": "2026-11-28",
    "dateLabel": "28 Nov 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 2,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 14,
    "isoDate": "2026-11-29",
    "dateLabel": "29 Nov 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 2,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 15,
    "isoDate": "2026-11-30",
    "dateLabel": "30 Nov 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 3,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Two-dimensional arrays",
    "objectives": [
      "Understand rows, columns and matrix traversal.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Implement matrix addition, transpose, diagonal sum and row/column sum for small matrices.",
    "expectedOutcome": "Two-dimensional arrays. Understand rows, columns and matrix traversal.",
    "deliverable": "Matrix program with sample test cases.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 16,
    "isoDate": "2026-12-01",
    "dateLabel": "01 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 3,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Pointers and references",
    "objectives": [
      "Understand addresses, dereferencing, nullptr and pointer/reference distinction.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Print variable addresses, access values through pointers, modify a value through a pointer and explain why nullptr checks matter.",
    "expectedOutcome": "Pointers and references. Understand addresses, dereferencing, nullptr and pointer/reference distinction.",
    "deliverable": "Pointer demonstration with annotated output.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 17,
    "isoDate": "2026-12-02",
    "dateLabel": "02 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 3,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Structs and classes",
    "objectives": [
      "Learn struct, class, public/private, constructors and member functions.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Create a Student class with name, roll number, marks, constructor and display method. Add validation for marks.",
    "expectedOutcome": "Structs and classes. Learn struct, class, public/private, constructors and member functions.",
    "deliverable": "Student class program.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 18,
    "isoDate": "2026-12-03",
    "dateLabel": "03 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 3,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Object-oriented programming basics",
    "objectives": [
      "Understand encapsulation, inheritance, polymorphism and abstraction at introductory level.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Create a base Shape class and derived Circle/Rectangle classes. Demonstrate overridden area methods.",
    "expectedOutcome": "Object-oriented programming basics. Understand encapsulation, inheritance, polymorphism and abstraction at introductory level.",
    "deliverable": "Small OOP example and four concept definitions.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 19,
    "isoDate": "2026-12-04",
    "dateLabel": "04 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 3,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Recursion foundations",
    "objectives": [
      "Understand base case, recursive case and call stack.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Implement factorial, sum 1..N and power recursively. Draw call traces for small inputs.",
    "expectedOutcome": "Recursion foundations. Understand base case, recursive case and call stack.",
    "deliverable": "Three recursive functions and call-stack diagrams.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 20,
    "isoDate": "2026-12-05",
    "dateLabel": "05 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 3,
    "phaseOrModule": "C++ programming foundations (Days 1–20)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 21,
    "isoDate": "2026-12-06",
    "dateLabel": "06 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 3,
    "phaseOrModule": "Complexity and STL (Days 21–30)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 22,
    "isoDate": "2026-12-07",
    "dateLabel": "07 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 4,
    "phaseOrModule": "Complexity and STL (Days 21–30)",
    "topic": "Recursion on arrays and strings",
    "objectives": [
      "Apply recursion to traversal, reverse and search.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Implement recursive array sum, recursive maximum, string reverse and palindrome check. Compare one iterative solution.",
    "expectedOutcome": "Recursion on arrays and strings. Apply recursion to traversal, reverse and search.",
    "deliverable": "Four recursive exercises.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 23,
    "isoDate": "2026-12-08",
    "dateLabel": "08 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 4,
    "phaseOrModule": "Complexity and STL (Days 21–30)",
    "topic": "Time complexity I",
    "objectives": [
      "Understand input size and O(1), O(log n), O(n), O(n log n), O(n²).",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Classify simple code snippets. Count loop iterations for single and nested loops. Explain why input size matters.",
    "expectedOutcome": "Time complexity I. Understand input size and O(1), O(log n), O(n), O(n log n), O(n²).",
    "deliverable": "Complexity worksheet with 10 examples.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 24,
    "isoDate": "2026-12-09",
    "dateLabel": "09 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 4,
    "phaseOrModule": "Complexity and STL (Days 21–30)",
    "topic": "Time complexity II",
    "objectives": [
      "Understand sequential loops, nested loops, best/average/worst cases and space complexity.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Analyze five short programs. Estimate time and auxiliary space; compare two approaches to the same task.",
    "expectedOutcome": "Time complexity II. Understand sequential loops, nested loops, best/average/worst cases and space complexity.",
    "deliverable": "Five annotated complexity analyses.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 25,
    "isoDate": "2026-12-10",
    "dateLabel": "10 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 4,
    "phaseOrModule": "Complexity and STL (Days 21–30)",
    "topic": "STL vector and pair",
    "objectives": [
      "Learn vector creation, push_back, pop_back, size, indexing, iteration and pair.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Rewrite two array exercises using vector. Store coordinate pairs and iterate through them.",
    "expectedOutcome": "STL vector and pair. Learn vector creation, push_back, pop_back, size, indexing, iteration and pair.",
    "deliverable": "Vector/pair practice file.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 26,
    "isoDate": "2026-12-11",
    "dateLabel": "11 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 4,
    "phaseOrModule": "Complexity and STL (Days 21–30)",
    "topic": "STL algorithms",
    "objectives": [
      "Learn sort, reverse, min/max, binary_search and comparator basics.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Sort integers ascending/descending, sort pairs by second value and use binary_search on sorted data.",
    "expectedOutcome": "STL algorithms. Learn sort, reverse, min/max, binary_search and comparator basics.",
    "deliverable": "Three STL algorithm exercises.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 27,
    "isoDate": "2026-12-12",
    "dateLabel": "12 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 4,
    "phaseOrModule": "Complexity and STL (Days 21–30)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 28,
    "isoDate": "2026-12-13",
    "dateLabel": "13 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 4,
    "phaseOrModule": "Complexity and STL (Days 21–30)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 29,
    "isoDate": "2026-12-14",
    "dateLabel": "14 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 5,
    "phaseOrModule": "Complexity and STL (Days 21–30)",
    "topic": "STL stack and queue",
    "objectives": [
      "Understand LIFO/FIFO and stack, queue, deque operations.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Use stack to reverse input and queue to simulate a simple service line. Implement balanced parentheses check.",
    "expectedOutcome": "STL stack and queue. Understand LIFO/FIFO and stack, queue, deque operations.",
    "deliverable": "Stack and queue programs.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 30,
    "isoDate": "2026-12-15",
    "dateLabel": "15 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 5,
    "phaseOrModule": "Complexity and STL (Days 21–30)",
    "topic": "STL set and map",
    "objectives": [
      "Understand uniqueness, ordered lookup and key-value mapping.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Count word/number frequencies with map or unordered_map. Remove duplicates using set. Compare outputs.",
    "expectedOutcome": "STL set and map. Understand uniqueness, ordered lookup and key-value mapping.",
    "deliverable": "Frequency counter and duplicate-removal program.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 31,
    "isoDate": "2026-12-16",
    "dateLabel": "16 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 5,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "STL priority_queue",
    "objectives": [
      "Understand max heap, min heap and push/pop/top.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Create max-heap and min-heap; solve kth-largest in a small list and explain heap ordering.",
    "expectedOutcome": "STL priority_queue. Understand max heap, min heap and push/pop/top.",
    "deliverable": "Two heap demos and kth-largest solution.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 32,
    "isoDate": "2026-12-17",
    "dateLabel": "17 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 5,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Iterators and custom sorting",
    "objectives": [
      "Learn begin/end, range loops and custom comparator.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Sort student records by marks and then name. Use iterators to traverse and erase selected elements safely.",
    "expectedOutcome": "Iterators and custom sorting. Learn begin/end, range loops and custom comparator.",
    "deliverable": "Custom sorting program.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 33,
    "isoDate": "2026-12-18",
    "dateLabel": "18 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 5,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Linear and binary search",
    "objectives": [
      "Understand linear search and binary search preconditions/invariants.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Implement both searches. Find a target in sorted data and record comparisons for different input sizes.",
    "expectedOutcome": "Linear and binary search. Understand linear search and binary search preconditions/invariants.",
    "deliverable": "Two search implementations and comparison table.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 34,
    "isoDate": "2026-12-19",
    "dateLabel": "19 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 5,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 35,
    "isoDate": "2026-12-20",
    "dateLabel": "20 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 5,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 36,
    "isoDate": "2026-12-21",
    "dateLabel": "21 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 6,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Binary search patterns",
    "objectives": [
      "Learn lower_bound, upper_bound and first/last occurrence.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Use STL bounds to count occurrences in a sorted array. Implement first and last occurrence manually.",
    "expectedOutcome": "Binary search patterns. Learn lower_bound, upper_bound and first/last occurrence.",
    "deliverable": "Occurrence-count solution and dry run.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 37,
    "isoDate": "2026-12-22",
    "dateLabel": "22 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 6,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Basic sorting algorithms",
    "objectives": [
      "Understand selection, bubble and insertion sort; stability and in-place idea.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Implement all three sorts. Trace one sample array and compare operation counts informally.",
    "expectedOutcome": "Basic sorting algorithms. Understand selection, bubble and insertion sort; stability and in-place idea.",
    "deliverable": "Three sorting implementations.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 38,
    "isoDate": "2026-12-23",
    "dateLabel": "23 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 6,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Efficient sorting",
    "objectives": [
      "Understand merge sort, quicksort, partitioning and complexity caveats.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Implement merge sort; implement or trace quicksort partition. Test sorted, reverse and duplicate-heavy inputs.",
    "expectedOutcome": "Efficient sorting. Understand merge sort, quicksort, partitioning and complexity caveats.",
    "deliverable": "Sorting implementations and test results.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 39,
    "isoDate": "2026-12-24",
    "dateLabel": "24 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 6,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Hashing patterns",
    "objectives": [
      "Understand hash sets/maps and average lookup intuition.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Solve duplicate detection, two-sum and first non-repeating element using hashing.",
    "expectedOutcome": "Hashing patterns. Understand hash sets/maps and average lookup intuition.",
    "deliverable": "Three hashing problems with complexity notes.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 40,
    "isoDate": "2026-12-25",
    "dateLabel": "25 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 6,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Two pointers and sliding window",
    "objectives": [
      "Understand opposite-direction pointers and fixed/variable windows.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Solve pair sum in sorted array, remove duplicates in-place and maximum sum of fixed-size window.",
    "expectedOutcome": "Two pointers and sliding window. Understand opposite-direction pointers and fixed/variable windows.",
    "deliverable": "Three pattern problems.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 41,
    "isoDate": "2026-12-26",
    "dateLabel": "26 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 6,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 42,
    "isoDate": "2026-12-27",
    "dateLabel": "27 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 6,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 43,
    "isoDate": "2026-12-28",
    "dateLabel": "28 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 7,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Prefix sums",
    "objectives": [
      "Understand prefix arrays and range-sum queries.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Build prefix sums, answer multiple range-sum queries and solve a simple subarray-sum task.",
    "expectedOutcome": "Prefix sums. Understand prefix arrays and range-sum queries.",
    "deliverable": "Prefix-sum program and explanation.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 44,
    "isoDate": "2026-12-29",
    "dateLabel": "29 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 7,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Linked list foundations",
    "objectives": [
      "Understand node, head, tail, traversal and insertion/deletion.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Define a singly linked-list node. Implement create, display, insert-at-front/end and delete-by-value.",
    "expectedOutcome": "Linked list foundations. Understand node, head, tail, traversal and insertion/deletion.",
    "deliverable": "Singly linked-list implementation.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 45,
    "isoDate": "2026-12-30",
    "dateLabel": "30 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 7,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Linked list patterns",
    "objectives": [
      "Learn reverse, middle node, cycle detection and merge sorted lists.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Implement reverse iterative, find middle with slow/fast pointers and detect a cycle conceptually or in code.",
    "expectedOutcome": "Linked list patterns. Learn reverse, middle node, cycle detection and merge sorted lists.",
    "deliverable": "Three linked-list pattern solutions.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 46,
    "isoDate": "2026-12-31",
    "dateLabel": "31 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 7,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Stack applications",
    "objectives": [
      "Apply stack to parsing and monotonic patterns.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Solve valid parentheses and next greater element. Explain why a stack is suitable.",
    "expectedOutcome": "Stack applications. Apply stack to parsing and monotonic patterns.",
    "deliverable": "Two stack problems with dry runs.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 47,
    "isoDate": "2027-01-01",
    "dateLabel": "01 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 7,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Queue and deque applications",
    "objectives": [
      "Understand circular queue concept, deque and BFS queue use.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Implement queue operations and solve a basic sliding-window maximum or first-negative-in-window exercise.",
    "expectedOutcome": "Queue and deque applications. Understand circular queue concept, deque and BFS queue use.",
    "deliverable": "Queue/deque implementation and one problem.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 48,
    "isoDate": "2027-01-02",
    "dateLabel": "02 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 7,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 49,
    "isoDate": "2027-01-03",
    "dateLabel": "03 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 7,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 50,
    "isoDate": "2027-01-04",
    "dateLabel": "04 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 8,
    "phaseOrModule": "Core problem-solving patterns (Days 31–50)",
    "topic": "Binary tree foundations",
    "objectives": [
      "Understand root, child, leaf, height and recursive traversals.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Define a binary tree node. Build a small tree and implement preorder, inorder and postorder traversals.",
    "expectedOutcome": "Binary tree foundations. Understand root, child, leaf, height and recursive traversals.",
    "deliverable": "Tree traversal program.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 51,
    "isoDate": "2027-01-05",
    "dateLabel": "05 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 8,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Tree traversal and properties",
    "objectives": [
      "Learn level-order BFS, depth, height and node count.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Implement level-order traversal using queue; calculate height and count leaf nodes.",
    "expectedOutcome": "Tree traversal and properties. Learn level-order BFS, depth, height and node count.",
    "deliverable": "Tree properties program.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 52,
    "isoDate": "2027-01-06",
    "dateLabel": "06 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 8,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Binary search trees",
    "objectives": [
      "Understand BST ordering and search/insert/delete concepts.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Implement BST insertion, search and inorder traversal. Validate whether a sample tree is a BST.",
    "expectedOutcome": "Binary search trees. Understand BST ordering and search/insert/delete concepts.",
    "deliverable": "BST implementation and test cases.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 53,
    "isoDate": "2027-01-07",
    "dateLabel": "07 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 8,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Heaps",
    "objectives": [
      "Understand heap properties, heapify idea and priority queues.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Use priority_queue for kth largest and merge two sorted sequences. Explain min-heap vs max-heap.",
    "expectedOutcome": "Heaps. Understand heap properties, heapify idea and priority queues.",
    "deliverable": "Two heap exercises.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 54,
    "isoDate": "2027-01-08",
    "dateLabel": "08 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 8,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Greedy algorithms",
    "objectives": [
      "Understand local choice and need for correctness reasoning.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Solve activity/interval selection after sorting by finish time. Explain the greedy choice in your own words.",
    "expectedOutcome": "Greedy algorithms. Understand local choice and need for correctness reasoning.",
    "deliverable": "Greedy solution with reasoning.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 55,
    "isoDate": "2027-01-09",
    "dateLabel": "09 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 8,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 56,
    "isoDate": "2027-01-10",
    "dateLabel": "10 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 8,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 57,
    "isoDate": "2027-01-11",
    "dateLabel": "11 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 9,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Backtracking",
    "objectives": [
      "Understand choose-explore-unchoose and pruning.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Generate subsets and permutations for small inputs. Trace recursion and avoid duplicate outputs where appropriate.",
    "expectedOutcome": "Backtracking. Understand choose-explore-unchoose and pruning.",
    "deliverable": "Subset and permutation programs.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 58,
    "isoDate": "2027-01-12",
    "dateLabel": "12 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 9,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Dynamic programming foundations",
    "objectives": [
      "Understand overlapping subproblems and optimal substructure.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Convert Fibonacci from naive recursion to memoization and tabulation. Write state and transition explicitly.",
    "expectedOutcome": "Dynamic programming foundations. Understand overlapping subproblems and optimal substructure.",
    "deliverable": "Three Fibonacci versions and DP notes.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 59,
    "isoDate": "2027-01-13",
    "dateLabel": "13 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 9,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "1D dynamic programming",
    "objectives": [
      "Learn state definition and transitions for simple sequences.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Solve climbing stairs and house robber. For each, write recurrence before coding.",
    "expectedOutcome": "1D dynamic programming. Learn state definition and transitions for simple sequences.",
    "deliverable": "Two DP solutions with state definitions.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 60,
    "isoDate": "2027-01-14",
    "dateLabel": "14 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 9,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "2D dynamic programming",
    "objectives": [
      "Understand grid states and 2D DP table.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Solve unique paths in a grid; trace a small table. Study 0/1 knapsack and LCS recurrence conceptually.",
    "expectedOutcome": "2D dynamic programming. Understand grid states and 2D DP table.",
    "deliverable": "Grid-path solution and two recurrence notes.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 61,
    "isoDate": "2027-01-15",
    "dateLabel": "15 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 9,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Graph foundations",
    "objectives": [
      "Understand vertices, edges, directed/undirected and weighted graphs.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Represent one graph using adjacency list and matrix. Add edges and print neighbours.",
    "expectedOutcome": "Graph foundations. Understand vertices, edges, directed/undirected and weighted graphs.",
    "deliverable": "Graph representation program.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 62,
    "isoDate": "2027-01-16",
    "dateLabel": "16 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 9,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 63,
    "isoDate": "2027-01-17",
    "dateLabel": "17 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 9,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 64,
    "isoDate": "2027-01-18",
    "dateLabel": "18 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 10,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "BFS and DFS",
    "objectives": [
      "Understand visited arrays, traversal order and connected components.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Implement BFS and DFS on a sample graph. Apply traversal to a small grid.",
    "expectedOutcome": "BFS and DFS. Understand visited arrays, traversal order and connected components.",
    "deliverable": "BFS/DFS implementations and trace.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 65,
    "isoDate": "2027-01-19",
    "dateLabel": "19 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 10,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Shortest paths and topological ordering",
    "objectives": [
      "Understand Dijkstra's non-negative-weight condition and DAG ordering.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Trace Dijkstra on a small weighted graph. Implement topological sort using indegree or DFS.",
    "expectedOutcome": "Shortest paths and topological ordering. Understand Dijkstra's non-negative-weight condition and DAG ordering.",
    "deliverable": "Algorithm notes and one topological-sort implementation.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 66,
    "isoDate": "2027-01-20",
    "dateLabel": "20 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 10,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "DSU and spanning trees",
    "objectives": [
      "Understand find/union, path compression and minimum spanning tree idea.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Implement Disjoint Set Union and use it to explain cycle detection/Kruskal steps.",
    "expectedOutcome": "DSU and spanning trees. Understand find/union, path compression and minimum spanning tree idea.",
    "deliverable": "DSU implementation and worked MST example.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 67,
    "isoDate": "2027-01-21",
    "dateLabel": "21 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 10,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Bit manipulation",
    "objectives": [
      "Understand AND, OR, XOR, shifts and bit masks.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Write helpers to check/set/clear/toggle a bit. Solve parity and single-number exercises.",
    "expectedOutcome": "Bit manipulation. Understand AND, OR, XOR, shifts and bit masks.",
    "deliverable": "Bit utility program and three exercises.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 68,
    "isoDate": "2027-01-22",
    "dateLabel": "22 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 10,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Mixed arrays and strings interview practice",
    "objectives": [
      "Combine arrays, strings, hashing and complexity reasoning.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Attempt three unseen easy problems under time limits. Explain brute force first, then optimize.",
    "expectedOutcome": "Mixed arrays and strings interview practice. Combine arrays, strings, hashing and complexity reasoning.",
    "deliverable": "Three solutions and self-review notes.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 69,
    "isoDate": "2027-01-23",
    "dateLabel": "23 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 10,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 70,
    "isoDate": "2027-01-24",
    "dateLabel": "24 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 10,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 71,
    "isoDate": "2027-01-25",
    "dateLabel": "25 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 11,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Mixed data-structure interview practice",
    "objectives": [
      "Combine linked lists, stacks, queues, trees and heaps.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Attempt two unseen problems and one tree traversal problem. Test edge cases.",
    "expectedOutcome": "Mixed data-structure interview practice. Combine linked lists, stacks, queues, trees and heaps.",
    "deliverable": "Three solutions with complexity analysis.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 72,
    "isoDate": "2027-01-26",
    "dateLabel": "26 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 11,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Mixed algorithms interview practice",
    "objectives": [
      "Combine recursion, greedy, backtracking and DP foundations.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Attempt one recursion, one greedy and one DP problem. Write state/choice reasoning before coding.",
    "expectedOutcome": "Mixed algorithms interview practice. Combine recursion, greedy, backtracking and DP foundations.",
    "deliverable": "Three attempted problems and error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 73,
    "isoDate": "2027-01-27",
    "dateLabel": "27 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 11,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Graph and traversal revision",
    "objectives": [
      "Revisit graph representation, BFS, DFS, DSU and shortest-path assumptions.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Solve one BFS/DFS problem and trace one shortest-path example. Explain visited-state handling.",
    "expectedOutcome": "Graph and traversal revision. Revisit graph representation, BFS, DFS, DSU and shortest-path assumptions.",
    "deliverable": "Graph revision sheet and two practice tasks.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 74,
    "isoDate": "2027-01-28",
    "dateLabel": "28 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 11,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Timed assessment and error analysis",
    "objectives": [
      "Assess problem-solving speed, correctness and explanation.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Complete a timed mixed set. Categorize errors: concept, implementation, edge case or complexity. Re-solve missed problems.",
    "expectedOutcome": "Timed assessment and error analysis. Assess problem-solving speed, correctness and explanation.",
    "deliverable": "Assessment score and prioritized weak-topic list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 75,
    "isoDate": "2027-01-29",
    "dateLabel": "29 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 11,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "C++ consolidation",
    "objectives": [
      "Consolidate syntax, functions, arrays, strings, pointers and OOP.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Build a small console-based student/expense record program using functions, classes and STL containers.",
    "expectedOutcome": "C++ consolidation. Consolidate syntax, functions, arrays, strings, pointers and OOP.",
    "deliverable": "Working mini-program and README.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 76,
    "isoDate": "2027-01-30",
    "dateLabel": "30 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 11,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 77,
    "isoDate": "2027-01-31",
    "dateLabel": "31 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 11,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 78,
    "isoDate": "2027-02-01",
    "dateLabel": "01 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 12,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "STL consolidation",
    "objectives": [
      "Consolidate vector, map, set, stack, queue, priority_queue and algorithms.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Solve four small tasks using the correct STL container; justify each choice.",
    "expectedOutcome": "STL consolidation. Consolidate vector, map, set, stack, queue, priority_queue and algorithms.",
    "deliverable": "Four STL solutions and container-choice notes.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 79,
    "isoDate": "2027-02-02",
    "dateLabel": "02 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 12,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Search and sort consolidation",
    "objectives": [
      "Consolidate linear/binary search, bounds, elementary and efficient sorting.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Implement binary search and one efficient sort from memory; test duplicates and edge cases.",
    "expectedOutcome": "Search and sort consolidation. Consolidate linear/binary search, bounds, elementary and efficient sorting.",
    "deliverable": "Two implementations and test log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 80,
    "isoDate": "2027-02-03",
    "dateLabel": "03 Feb 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 12,
    "phaseOrModule": "Data structures and algorithms (Days 51–80)",
    "topic": "Array pattern consolidation",
    "objectives": [
      "Consolidate hashing, two pointers, sliding window and prefix sums.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Solve four mixed array problems; record brute force and optimized complexity.",
    "expectedOutcome": "Array pattern consolidation. Consolidate hashing, two pointers, sliding window and prefix sums.",
    "deliverable": "Four solutions and comparison notes.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 81,
    "isoDate": "2027-02-04",
    "dateLabel": "04 Feb 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 12,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Linked list and stack consolidation",
    "objectives": [
      "Consolidate list operations, reversal, cycle detection and stack patterns.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Re-implement reverse list and valid parentheses without notes; solve one queue/stack variant.",
    "expectedOutcome": "Linked list and stack consolidation. Consolidate list operations, reversal, cycle detection and stack patterns.",
    "deliverable": "Three solutions from memory.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 82,
    "isoDate": "2027-02-05",
    "dateLabel": "05 Feb 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 12,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Tree and heap consolidation",
    "objectives": [
      "Consolidate traversals, BST, height, heap and top-K.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Implement one traversal and solve one BST or heap problem. Explain invariants.",
    "expectedOutcome": "Tree and heap consolidation. Consolidate traversals, BST, height, heap and top-K.",
    "deliverable": "Two solutions and oral explanation.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 83,
    "isoDate": "2027-02-06",
    "dateLabel": "06 Feb 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 12,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 84,
    "isoDate": "2027-02-07",
    "dateLabel": "07 Feb 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 12,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 85,
    "isoDate": "2027-02-08",
    "dateLabel": "08 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 13,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Greedy and backtracking consolidation",
    "objectives": [
      "Consolidate interval scheduling, subsets, permutations and pruning.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Solve one interval problem and one backtracking problem. Explain why choices are explored/pruned.",
    "expectedOutcome": "Greedy and backtracking consolidation. Consolidate interval scheduling, subsets, permutations and pruning.",
    "deliverable": "Two solutions and reasoning notes.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 86,
    "isoDate": "2027-02-09",
    "dateLabel": "09 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 13,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Dynamic programming consolidation",
    "objectives": [
      "Consolidate memoization, tabulation, 1D and 2D DP.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Re-solve climbing stairs and grid paths without notes; write recurrence before implementation.",
    "expectedOutcome": "Dynamic programming consolidation. Consolidate memoization, tabulation, 1D and 2D DP.",
    "deliverable": "Two DP solutions and recurrence sheet.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 87,
    "isoDate": "2027-02-10",
    "dateLabel": "10 Feb 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 13,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Graph consolidation",
    "objectives": [
      "Consolidate adjacency list, BFS, DFS, DSU and shortest-path concepts.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Implement BFS/DFS from memory and solve one connected-components task.",
    "expectedOutcome": "Graph consolidation. Consolidate adjacency list, BFS, DFS, DSU and shortest-path concepts.",
    "deliverable": "Two graph solutions.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 88,
    "isoDate": "2027-02-11",
    "dateLabel": "11 Feb 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 13,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Final interview simulation",
    "objectives": [
      "Practice explaining code, complexity, trade-offs and edge cases.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Complete a timed mock: two coding problems plus verbal explanation. Review all prior mistakes.",
    "expectedOutcome": "Final interview simulation. Practice explaining code, complexity, trade-offs and edge cases.",
    "deliverable": "Mock score, revised resume-ready DSA summary and next 30-day practice plan.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 89,
    "isoDate": "2027-02-12",
    "dateLabel": "12 Feb 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 13,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "C++ syntax from-memory challenge",
    "objectives": [
      "Consolidate data types, operators, branches, loops and functions.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Write five short programs from a blank file without notes. Compile, test boundary cases and correct errors.",
    "expectedOutcome": "C++ syntax from-memory challenge. Consolidate data types, operators, branches, loops and functions.",
    "deliverable": "Five standalone programs and error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 90,
    "isoDate": "2027-02-13",
    "dateLabel": "13 Feb 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 13,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 91,
    "isoDate": "2027-02-14",
    "dateLabel": "14 Feb 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 13,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 92,
    "isoDate": "2027-02-15",
    "dateLabel": "15 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 14,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Array and string challenge set",
    "objectives": [
      "Consolidate traversal, frequency, two-dimensional arrays and string processing.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Solve three unseen easy array/string exercises. For each, write a brute-force idea and test edge cases.",
    "expectedOutcome": "Array and string challenge set. Consolidate traversal, frequency, two-dimensional arrays and string processing.",
    "deliverable": "Three solutions with complexity notes.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 93,
    "isoDate": "2027-02-16",
    "dateLabel": "16 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 14,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "STL container selection",
    "objectives": [
      "Consolidate vector, map, set, stack, queue and priority_queue.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Given six small tasks, choose the appropriate STL container, implement three, and explain why the chosen container fits.",
    "expectedOutcome": "STL container selection. Consolidate vector, map, set, stack, queue and priority_queue.",
    "deliverable": "Container-selection table and three programs.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 94,
    "isoDate": "2027-02-17",
    "dateLabel": "17 Feb 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 14,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Search/sort challenge set",
    "objectives": [
      "Consolidate binary search, bounds, sorting and comparator usage.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Solve two search and two sorting exercises. Test empty, single-element, duplicate and already-sorted inputs.",
    "expectedOutcome": "Search/sort challenge set. Consolidate binary search, bounds, sorting and comparator usage.",
    "deliverable": "Four tested solutions.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 95,
    "isoDate": "2027-02-18",
    "dateLabel": "18 Feb 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 14,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Linear data structure challenge",
    "objectives": [
      "Consolidate linked list, stack, queue and deque patterns.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Re-implement list reversal, balanced parentheses and queue simulation without notes.",
    "expectedOutcome": "Linear data structure challenge. Consolidate linked list, stack, queue and deque patterns.",
    "deliverable": "Three implementations and self-review.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 96,
    "isoDate": "2027-02-19",
    "dateLabel": "19 Feb 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 14,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Tree and heap challenge",
    "objectives": [
      "Consolidate traversals, BST operations and heap patterns.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Build a sample tree, write traversals, validate a BST and solve one top-K exercise.",
    "expectedOutcome": "Tree and heap challenge. Consolidate traversals, BST operations and heap patterns.",
    "deliverable": "Tree/heap practice file.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 97,
    "isoDate": "2027-02-20",
    "dateLabel": "20 Feb 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 14,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's C++/DSA concepts and check whether the learner can explain and implement them without copying.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Re-solve selected exercises from the week, complete a short timed coding assessment, test edge cases, explain time/space complexity and correct mistakes.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly coding assessment, corrected solutions, score and updated DSA error log.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 98,
    "isoDate": "2027-02-21",
    "dateLabel": "21 Feb 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 14,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's C++/DSA topics and prepare for the next week's concepts.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review notes, rebuild one solution from a blank file, explain the week's key patterns aloud and list three weak areas to revisit.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Weekly revision notes, one solution rebuilt from memory and next-week warm-up list.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 99,
    "isoDate": "2027-02-22",
    "dateLabel": "22 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 15,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Algorithm reasoning challenge",
    "objectives": [
      "Consolidate greedy, backtracking and dynamic programming.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Solve one interval scheduling, one subset-generation and one 1D DP problem. Explain each decision/state.",
    "expectedOutcome": "Algorithm reasoning challenge. Consolidate greedy, backtracking and dynamic programming.",
    "deliverable": "Three solutions with reasoning.",
    "isDsaRelated": true
  },
  {
    "trackId": "dsa",
    "trackLabel": "DSA in C++ (100 Days)",
    "dayNumber": 100,
    "isoDate": "2027-02-23",
    "dateLabel": "23 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 15,
    "phaseOrModule": "Graphs and interview readiness (Days 81–100)",
    "topic": "Final DSA readiness assessment",
    "objectives": [
      "Review all major topics and identify the next practice priorities.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Complete a timed assessment with two coding problems and one complexity explanation. Re-solve every missed question.",
    "expectedOutcome": "Final DSA readiness assessment. Review all major topics and identify the next practice priorities.",
    "deliverable": "Final score, error log and 30-day follow-up plan.",
    "isDsaRelated": true
  }
];

export const AZURE_CURRICULUM_CONTEXTS: SharedCurriculumDayContext[] = [
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 1,
    "isoDate": "2026-11-16",
    "dateLabel": "16 Nov 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 1,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Cloud concepts and shared responsibility",
    "objectives": [
      "Understand cloud computing, consumption-based pricing, scalability, elasticity and shared responsibility.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Make a one-page comparison of on-premises vs cloud. Explain who manages infrastructure, OS, runtime and application in common service models.",
    "expectedOutcome": "Cloud concepts and shared responsibility. Understand cloud computing, consumption-based pricing, scalability, elasticity and shared responsibility.",
    "deliverable": "One-page cloud concepts note.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 2,
    "isoDate": "2026-11-17",
    "dateLabel": "17 Nov 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 1,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "IaaS, PaaS and SaaS",
    "objectives": [
      "Understand service-model boundaries and common examples.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Classify 12 example workloads as IaaS/PaaS/SaaS and justify two ambiguous choices.",
    "expectedOutcome": "IaaS, PaaS and SaaS. Understand service-model boundaries and common examples.",
    "deliverable": "Service-model comparison table.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 3,
    "isoDate": "2026-11-18",
    "dateLabel": "18 Nov 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 1,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Public, private and hybrid cloud",
    "objectives": [
      "Understand deployment models, availability, scalability and business use cases.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Choose a deployment model for a small startup, a regulated organization and a hybrid legacy system; explain trade-offs.",
    "expectedOutcome": "Public, private and hybrid cloud. Understand deployment models, availability, scalability and business use cases.",
    "deliverable": "Three scenario answers.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 4,
    "isoDate": "2026-11-19",
    "dateLabel": "19 Nov 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 1,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Azure regions and availability",
    "objectives": [
      "Understand geography, region, region pairs, availability zones and datacenters.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Draw a simple multi-region architecture and explain how availability zones differ from region pairs.",
    "expectedOutcome": "Azure regions and availability. Understand geography, region, region pairs, availability zones and datacenters.",
    "deliverable": "Architecture sketch and definitions.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 5,
    "isoDate": "2026-11-20",
    "dateLabel": "20 Nov 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 1,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Resources, groups and subscriptions",
    "objectives": [
      "Understand Azure resource hierarchy and scope.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "In portal or screenshots/docs, identify tenant, management group, subscription, resource group and resource. Draw hierarchy.",
    "expectedOutcome": "Resources, groups and subscriptions. Understand Azure resource hierarchy and scope.",
    "deliverable": "Azure hierarchy diagram.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 6,
    "isoDate": "2026-11-21",
    "dateLabel": "21 Nov 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 1,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 7,
    "isoDate": "2026-11-22",
    "dateLabel": "22 Nov 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 1,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 8,
    "isoDate": "2026-11-23",
    "dateLabel": "23 Nov 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 2,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Azure Resource Manager",
    "objectives": [
      "Understand ARM, resource providers, tags, locks and deployment concepts.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Create a resource group if access permits; inspect resource providers, add tags and explain delete/read-only locks. Clean up lab resources.",
    "expectedOutcome": "Azure Resource Manager. Understand ARM, resource providers, tags, locks and deployment concepts.",
    "deliverable": "Portal lab notes and screenshots if available.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 9,
    "isoDate": "2026-11-24",
    "dateLabel": "24 Nov 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 2,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Compute services overview",
    "objectives": [
      "Understand VMs, containers, App Service and Functions.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Match five workloads to compute services. Compare VM control vs managed platform responsibilities.",
    "expectedOutcome": "Compute services overview. Understand VMs, containers, App Service and Functions.",
    "deliverable": "Compute selection matrix.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 10,
    "isoDate": "2026-11-25",
    "dateLabel": "25 Nov 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 2,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Networking fundamentals",
    "objectives": [
      "Understand VNet, subnet, NSG, DNS, peering, VPN Gateway and ExpressRoute.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Draw a VNet with two subnets and NSG boundaries. Explain private connectivity vs public internet.",
    "expectedOutcome": "Networking fundamentals. Understand VNet, subnet, NSG, DNS, peering, VPN Gateway and ExpressRoute.",
    "deliverable": "Network diagram and scenario notes.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 11,
    "isoDate": "2026-11-26",
    "dateLabel": "26 Nov 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 2,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Azure storage services",
    "objectives": [
      "Understand Blob, Files, Queue, Table and managed disks.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Choose a storage type for images, shared files, messages, key-value data and VM disks. Explain access tiers.",
    "expectedOutcome": "Azure storage services. Understand Blob, Files, Queue, Table and managed disks.",
    "deliverable": "Storage selection table.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 12,
    "isoDate": "2026-11-27",
    "dateLabel": "27 Nov 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 2,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Identity and access",
    "objectives": [
      "Understand Microsoft Entra ID, authentication, authorization and RBAC.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Explain authentication vs authorization. Create a least-privilege role assignment scenario on paper or in a safe lab.",
    "expectedOutcome": "Identity and access. Understand Microsoft Entra ID, authentication, authorization and RBAC.",
    "deliverable": "RBAC scenario and identity notes.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 13,
    "isoDate": "2026-11-28",
    "dateLabel": "28 Nov 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 2,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 14,
    "isoDate": "2026-11-29",
    "dateLabel": "29 Nov 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 2,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 15,
    "isoDate": "2026-11-30",
    "dateLabel": "30 Nov 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 3,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Security and governance",
    "objectives": [
      "Understand Defender for Cloud, Azure Policy, locks and compliance.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Write examples of a policy, a resource lock and a security recommendation. Explain when each helps.",
    "expectedOutcome": "Security and governance. Understand Defender for Cloud, Azure Policy, locks and compliance.",
    "deliverable": "Security/governance comparison.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 16,
    "isoDate": "2026-12-01",
    "dateLabel": "01 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 3,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Pricing, budgets and SLAs",
    "objectives": [
      "Understand pricing calculator, TCO, Cost Management, budgets and SLAs.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Estimate a simple lab cost using official pricing tools before deployment. Explain SLA percentage and cumulative downtime conceptually.",
    "expectedOutcome": "Pricing, budgets and SLAs. Understand pricing calculator, TCO, Cost Management, budgets and SLAs.",
    "deliverable": "Cost estimate and SLA notes.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 17,
    "isoDate": "2026-12-02",
    "dateLabel": "02 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 3,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Monitoring and management",
    "objectives": [
      "Understand Azure Monitor, Service Health, Advisor and Log Analytics.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Map an app issue to the appropriate monitoring tool. Draft an alert for high CPU or repeated failures.",
    "expectedOutcome": "Monitoring and management. Understand Azure Monitor, Service Health, Advisor and Log Analytics.",
    "deliverable": "Monitoring decision sheet.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 18,
    "isoDate": "2026-12-03",
    "dateLabel": "03 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 3,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "AZ-900 portal practice",
    "objectives": [
      "Reinforce core Azure concepts in the portal.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "If subscription access exists, create a resource group, inspect one free/low-cost resource, apply tags, review cost and delete resources. Otherwise use a guided portal walkthrough.",
    "expectedOutcome": "AZ-900 portal practice. Reinforce core Azure concepts in the portal.",
    "deliverable": "Evidence of portal navigation and cleanup.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 19,
    "isoDate": "2026-12-04",
    "dateLabel": "04 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 3,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "AZ-900 checkpoint",
    "objectives": [
      "Review AZ-900 domains and scenario selection.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Answer 20 self-made questions covering cloud, architecture, compute, networking, storage, identity, security and pricing. Review wrong answers.",
    "expectedOutcome": "AZ-900 checkpoint. Review AZ-900 domains and scenario selection.",
    "deliverable": "Quiz score and weak-area list.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 20,
    "isoDate": "2026-12-05",
    "dateLabel": "05 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 3,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 21,
    "isoDate": "2026-12-06",
    "dateLabel": "06 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 3,
    "phaseOrModule": "AZ-900 — Azure Fundamentals (Days 1–25 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 22,
    "isoDate": "2026-12-07",
    "dateLabel": "07 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 4,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "Relational data concepts",
    "objectives": [
      "Understand tables, rows, columns, schema, keys and relationships.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Design a small student-course relational schema with primary and foreign keys. Explain normalization at a basic level.",
    "expectedOutcome": "Relational data concepts. Understand tables, rows, columns, schema, keys and relationships.",
    "deliverable": "ER diagram or schema note.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 23,
    "isoDate": "2026-12-08",
    "dateLabel": "08 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 4,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "SQL SELECT and filtering",
    "objectives": [
      "Learn SELECT, WHERE, ORDER BY, DISTINCT and aliases.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Create/use a sample table and write queries for filtering, sorting, selecting distinct values and limiting results.",
    "expectedOutcome": "SQL SELECT and filtering. Learn SELECT, WHERE, ORDER BY, DISTINCT and aliases.",
    "deliverable": "At least eight SQL queries.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 24,
    "isoDate": "2026-12-09",
    "dateLabel": "09 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 4,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "SQL aggregation and joins",
    "objectives": [
      "Learn GROUP BY, HAVING, COUNT, SUM, AVG and JOIN.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Write queries to count records by category, calculate averages and join two related tables.",
    "expectedOutcome": "SQL aggregation and joins. Learn GROUP BY, HAVING, COUNT, SUM, AVG and JOIN.",
    "deliverable": "At least eight aggregation/join queries.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 25,
    "isoDate": "2026-12-10",
    "dateLabel": "10 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 4,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "OLTP and OLAP",
    "objectives": [
      "Understand transactional vs analytical workloads and row/column orientation.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Classify retail checkout, monthly sales reporting and event analytics workloads. Explain why their data patterns differ.",
    "expectedOutcome": "OLTP and OLAP. Understand transactional vs analytical workloads and row/column orientation.",
    "deliverable": "OLTP/OLAP comparison.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 26,
    "isoDate": "2026-12-11",
    "dateLabel": "11 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 4,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "Azure relational database options",
    "objectives": [
      "Compare Azure SQL Database, SQL Managed Instance and SQL Server on VM.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Select a service for a new cloud app, a near-compatible migration and a full OS-control requirement.",
    "expectedOutcome": "Azure relational database options. Compare Azure SQL Database, SQL Managed Instance and SQL Server on VM.",
    "deliverable": "Service-selection matrix.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 27,
    "isoDate": "2026-12-12",
    "dateLabel": "12 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 4,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 28,
    "isoDate": "2026-12-13",
    "dateLabel": "13 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 4,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 29,
    "isoDate": "2026-12-14",
    "dateLabel": "14 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 5,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "Non-relational data models",
    "objectives": [
      "Understand key-value, document, graph and column-family models.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Model a shopping cart as key-value, product catalog as document and social connections as graph. Explain trade-offs.",
    "expectedOutcome": "Non-relational data models. Understand key-value, document, graph and column-family models.",
    "deliverable": "Four data-model examples.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 30,
    "isoDate": "2026-12-15",
    "dateLabel": "15 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 5,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "Cosmos DB fundamentals",
    "objectives": [
      "Understand account, database, container, item, partition key and throughput concepts.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Design a container for customer orders. Pick a partition key and explain hot-partition risk at a high level.",
    "expectedOutcome": "Cosmos DB fundamentals. Understand account, database, container, item, partition key and throughput concepts.",
    "deliverable": "Cosmos DB design note.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 31,
    "isoDate": "2026-12-16",
    "dateLabel": "16 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 5,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "Analytics workloads",
    "objectives": [
      "Understand batch vs streaming, warehouse, lake and lakehouse.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Map daily batch reporting, live telemetry and raw historical files to suitable patterns.",
    "expectedOutcome": "Analytics workloads. Understand batch vs streaming, warehouse, lake and lakehouse.",
    "deliverable": "Analytics workload comparison.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 32,
    "isoDate": "2026-12-17",
    "dateLabel": "17 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 5,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "Azure analytics services",
    "objectives": [
      "Understand the high-level roles of Data Lake Storage, Synapse, Databricks and Fabric.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Create a diagram showing storage, processing and analytics layers; describe each service's role without memorizing every feature.",
    "expectedOutcome": "Azure analytics services. Understand the high-level roles of Data Lake Storage, Synapse, Databricks and Fabric.",
    "deliverable": "Analytics architecture diagram.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 33,
    "isoDate": "2026-12-18",
    "dateLabel": "18 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 5,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "DP-900 checkpoint",
    "objectives": [
      "Review relational, non-relational, SQL and analytics concepts.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Complete 20 scenario questions and write five SQL queries without notes. Correct mistakes and note unfamiliar terms.",
    "expectedOutcome": "DP-900 checkpoint. Review relational, non-relational, SQL and analytics concepts.",
    "deliverable": "Quiz score and SQL evidence.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 34,
    "isoDate": "2026-12-19",
    "dateLabel": "19 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 5,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 35,
    "isoDate": "2026-12-20",
    "dateLabel": "20 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 5,
    "phaseOrModule": "DP-900 — Azure Data Fundamentals (Days 26–50 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 36,
    "isoDate": "2026-12-21",
    "dateLabel": "21 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 6,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "AI workloads and responsible AI",
    "objectives": [
      "Understand ML, vision, NLP, speech, conversational AI and responsible AI principles.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Match common business problems to AI workload categories. Write examples of fairness, reliability, privacy, inclusiveness and transparency considerations.",
    "expectedOutcome": "AI workloads and responsible AI. Understand ML, vision, NLP, speech, conversational AI and responsible AI principles.",
    "deliverable": "AI workload mapping sheet.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 37,
    "isoDate": "2026-12-22",
    "dateLabel": "22 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 6,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Machine learning concepts",
    "objectives": [
      "Understand regression, classification, clustering, features, labels and train/test split.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Classify example tasks as regression/classification/clustering. Explain why test data must remain unseen during training.",
    "expectedOutcome": "Machine learning concepts. Understand regression, classification, clustering, features, labels and train/test split.",
    "deliverable": "ML concept table.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 38,
    "isoDate": "2026-12-23",
    "dateLabel": "23 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 6,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Azure Machine Learning overview",
    "objectives": [
      "Understand workspace, compute, data assets, jobs, models and endpoints at overview level.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Draw a workflow from data to training job to registered model to endpoint. Identify where evaluation occurs.",
    "expectedOutcome": "Azure Machine Learning overview. Understand workspace, compute, data assets, jobs, models and endpoints at overview level.",
    "deliverable": "Azure ML lifecycle diagram.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 39,
    "isoDate": "2026-12-24",
    "dateLabel": "24 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 6,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Computer vision services",
    "objectives": [
      "Understand image analysis, OCR and object detection use cases.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Choose the right vision capability for image captions, text extraction and object localization. Outline input/output for each.",
    "expectedOutcome": "Computer vision services. Understand image analysis, OCR and object detection use cases.",
    "deliverable": "Vision service-selection examples.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 40,
    "isoDate": "2026-12-25",
    "dateLabel": "25 Dec 2026",
    "dayOfWeek": "Friday",
    "weekNumber": 6,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Document Intelligence",
    "objectives": [
      "Understand prebuilt/custom extraction, fields, tables and confidence.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Inspect a sample invoice/form and list fields to extract. Design a JSON-like output and note confidence/validation needs.",
    "expectedOutcome": "Document Intelligence. Understand prebuilt/custom extraction, fields, tables and confidence.",
    "deliverable": "Document extraction schema.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 41,
    "isoDate": "2026-12-26",
    "dateLabel": "26 Dec 2026",
    "dayOfWeek": "Saturday",
    "weekNumber": 6,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 42,
    "isoDate": "2026-12-27",
    "dateLabel": "27 Dec 2026",
    "dayOfWeek": "Sunday",
    "weekNumber": 6,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 43,
    "isoDate": "2026-12-28",
    "dateLabel": "28 Dec 2026",
    "dayOfWeek": "Monday",
    "weekNumber": 7,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Language services",
    "objectives": [
      "Understand language detection, sentiment, key phrases, entities, summarization and translation.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Take five sample sentences and identify which language tasks apply. Draft expected outputs for sentiment and entity extraction.",
    "expectedOutcome": "Language services. Understand language detection, sentiment, key phrases, entities, summarization and translation.",
    "deliverable": "NLP task/output worksheet.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 44,
    "isoDate": "2026-12-29",
    "dateLabel": "29 Dec 2026",
    "dayOfWeek": "Tuesday",
    "weekNumber": 7,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Speech services",
    "objectives": [
      "Understand speech-to-text, text-to-speech and speech translation.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Draw a voice assistant flow from microphone to transcription to response to speech synthesis. Note privacy and latency considerations.",
    "expectedOutcome": "Speech services. Understand speech-to-text, text-to-speech and speech translation.",
    "deliverable": "Speech workflow diagram.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 45,
    "isoDate": "2026-12-30",
    "dateLabel": "30 Dec 2026",
    "dayOfWeek": "Wednesday",
    "weekNumber": 7,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Conversational AI",
    "objectives": [
      "Understand question answering, language understanding concepts and bot integration.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Design a simple FAQ bot flow with user question, intent/answer lookup, fallback and escalation.",
    "expectedOutcome": "Conversational AI. Understand question answering, language understanding concepts and bot integration.",
    "deliverable": "Conversation flowchart.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 46,
    "isoDate": "2026-12-31",
    "dateLabel": "31 Dec 2026",
    "dayOfWeek": "Thursday",
    "weekNumber": 7,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Azure AI Search fundamentals",
    "objectives": [
      "Understand indexes, indexers, data sources, skillsets, filters and semantic/hybrid search.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Design an index for PDF metadata and chunks. Identify searchable, filterable and retrievable fields.",
    "expectedOutcome": "Azure AI Search fundamentals. Understand indexes, indexers, data sources, skillsets, filters and semantic/hybrid search.",
    "deliverable": "Search index schema.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 47,
    "isoDate": "2027-01-01",
    "dateLabel": "01 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 7,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Search practical exercise",
    "objectives": [
      "Reinforce indexing and retrieval concepts.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "If access permits, follow a small Azure AI Search walkthrough using sample data; otherwise create a mock index schema and write sample search/filter scenarios.",
    "expectedOutcome": "Search practical exercise. Reinforce indexing and retrieval concepts.",
    "deliverable": "Lab notes or mock schema and query examples.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 48,
    "isoDate": "2027-01-02",
    "dateLabel": "02 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 7,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 49,
    "isoDate": "2027-01-03",
    "dateLabel": "03 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 7,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 50,
    "isoDate": "2027-01-04",
    "dateLabel": "04 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 8,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Generative AI foundations",
    "objectives": [
      "Understand LLMs, tokens, context windows, prompts, grounding and hallucinations.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Explain an LLM request/response lifecycle. Write a grounded prompt and identify two ways hallucinations may occur.",
    "expectedOutcome": "Generative AI foundations. Understand LLMs, tokens, context windows, prompts, grounding and hallucinations.",
    "deliverable": "LLM lifecycle notes and prompt example.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 51,
    "isoDate": "2027-01-05",
    "dateLabel": "05 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 8,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Azure AI Foundry overview",
    "objectives": [
      "Understand model catalog, projects, playground, deployments and evaluation workflow.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Navigate the available Foundry interface if access exists. Identify model selection, playground, deployment and evaluation areas; record unavailable features.",
    "expectedOutcome": "Azure AI Foundry overview. Understand model catalog, projects, playground, deployments and evaluation workflow.",
    "deliverable": "Foundry walkthrough notes.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 52,
    "isoDate": "2027-01-06",
    "dateLabel": "06 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 8,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Model deployment and inference",
    "objectives": [
      "Understand endpoint, deployment, keys, quota, tokens, latency and cost.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Draw client-to-endpoint request flow. List what must be protected and what metrics affect inference cost.",
    "expectedOutcome": "Model deployment and inference. Understand endpoint, deployment, keys, quota, tokens, latency and cost.",
    "deliverable": "Deployment flow and cost checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 53,
    "isoDate": "2027-01-07",
    "dateLabel": "07 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 8,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Prompt engineering",
    "objectives": [
      "Understand system/user instructions, few-shot examples and structured outputs.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Create three prompts for the same task: zero-shot, few-shot and JSON-style output. Compare consistency and failure cases.",
    "expectedOutcome": "Prompt engineering. Understand system/user instructions, few-shot examples and structured outputs.",
    "deliverable": "Three prompts and comparison.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 54,
    "isoDate": "2027-01-08",
    "dateLabel": "08 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 8,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "GenAI application architecture",
    "objectives": [
      "Understand client, API, model endpoint, identity, retrieval and monitoring components.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Draw a small application architecture and label trust boundaries, secrets, data flow and failure points.",
    "expectedOutcome": "GenAI application architecture. Understand client, API, model endpoint, identity, retrieval and monitoring components.",
    "deliverable": "Architecture diagram.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 55,
    "isoDate": "2027-01-09",
    "dateLabel": "09 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 8,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 56,
    "isoDate": "2027-01-10",
    "dateLabel": "10 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 8,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 57,
    "isoDate": "2027-01-11",
    "dateLabel": "11 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 9,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "RAG concepts",
    "objectives": [
      "Understand ingestion, chunking, embeddings, vector search, retrieval, grounding and citations.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Explain the RAG pipeline in your own words. Design a document-ingestion sequence and list metadata to retain.",
    "expectedOutcome": "RAG concepts. Understand ingestion, chunking, embeddings, vector search, retrieval, grounding and citations.",
    "deliverable": "RAG pipeline diagram.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 58,
    "isoDate": "2027-01-12",
    "dateLabel": "12 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 9,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Vector and hybrid search",
    "objectives": [
      "Understand vector fields, embeddings, hybrid search and semantic ranking concepts.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Compare keyword, vector and hybrid retrieval using three example questions. Explain when exact terms matter.",
    "expectedOutcome": "Vector and hybrid search. Understand vector fields, embeddings, hybrid search and semantic ranking concepts.",
    "deliverable": "Retrieval comparison table.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 59,
    "isoDate": "2027-01-13",
    "dateLabel": "13 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 9,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "RAG workflow design",
    "objectives": [
      "Understand query embedding, retrieval, context construction and grounded response.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Write pseudocode for user question → search → top-k context → prompt → answer with citations. Include no-result behavior.",
    "expectedOutcome": "RAG workflow design. Understand query embedding, retrieval, context construction and grounded response.",
    "deliverable": "RAG pseudocode and fallback rule.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 60,
    "isoDate": "2027-01-14",
    "dateLabel": "14 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 9,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "RAG evaluation",
    "objectives": [
      "Understand relevance, groundedness, completeness, retrieval quality and human review.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Create 10 test questions with expected source documents. Define a simple pass/fail rubric for source relevance and grounded answer.",
    "expectedOutcome": "RAG evaluation. Understand relevance, groundedness, completeness, retrieval quality and human review.",
    "deliverable": "RAG evaluation test set.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 61,
    "isoDate": "2027-01-15",
    "dateLabel": "15 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 9,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "AI safety and prompt injection",
    "objectives": [
      "Understand content filters, prompt injection, privacy and safe output handling.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Write examples of malicious document instructions and explain why retrieved content is untrusted. Define safe handling rules.",
    "expectedOutcome": "AI safety and prompt injection. Understand content filters, prompt injection, privacy and safe output handling.",
    "deliverable": "Threat examples and mitigations.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 62,
    "isoDate": "2027-01-16",
    "dateLabel": "16 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 9,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 63,
    "isoDate": "2027-01-17",
    "dateLabel": "17 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 9,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 64,
    "isoDate": "2027-01-18",
    "dateLabel": "18 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 10,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "AI security and identity",
    "objectives": [
      "Understand managed identity concepts, keys/secrets, RBAC and least privilege.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Draw a secret-safe architecture. Identify where keys must never be committed and how access should be restricted.",
    "expectedOutcome": "AI security and identity. Understand managed identity concepts, keys/secrets, RBAC and least privilege.",
    "deliverable": "Security checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 65,
    "isoDate": "2027-01-19",
    "dateLabel": "19 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 10,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "AI monitoring and operations",
    "objectives": [
      "Understand latency, errors, token use, throughput and quality signals.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Design a basic monitoring table for requests, latency, status, token usage and user feedback. Define two alert conditions.",
    "expectedOutcome": "AI monitoring and operations. Understand latency, errors, token use, throughput and quality signals.",
    "deliverable": "Monitoring plan.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 66,
    "isoDate": "2027-01-20",
    "dateLabel": "20 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 10,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "AI-102 service selection",
    "objectives": [
      "Map requirements to vision, language, speech, search, document and generative AI services.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Complete 10 scenario mappings and explain why the selected service fits each requirement.",
    "expectedOutcome": "AI-102 service selection. Map requirements to vision, language, speech, search, document and generative AI services.",
    "deliverable": "Service selection worksheet.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 67,
    "isoDate": "2027-01-21",
    "dateLabel": "21 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 10,
    "phaseOrModule": "AI-102 — Azure AI Engineer (Days 51–85 overview)",
    "topic": "AI-102 checkpoint",
    "objectives": [
      "Review AI workloads, service selection, security and deployment.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Complete a 25-question scenario assessment. Revisit wrong answers and explain each correction.",
    "expectedOutcome": "AI-102 checkpoint. Review AI workloads, service selection, security and deployment.",
    "deliverable": "Assessment score and weak-area list.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 68,
    "isoDate": "2027-01-22",
    "dateLabel": "22 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 10,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Capstone requirements and architecture",
    "objectives": [
      "Define a small document Q&A assistant using Azure concepts.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Write user stories, supported file types, data boundary, expected citations, failure behavior and architecture diagram.",
    "expectedOutcome": "Capstone requirements and architecture. Define a small document Q&A assistant using Azure concepts.",
    "deliverable": "One-page capstone specification.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 69,
    "isoDate": "2027-01-23",
    "dateLabel": "23 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 10,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 70,
    "isoDate": "2027-01-24",
    "dateLabel": "24 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 10,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 71,
    "isoDate": "2027-01-25",
    "dateLabel": "25 Jan 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 11,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Capstone document preparation",
    "objectives": [
      "Prepare clean sample documents and metadata.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Select non-sensitive sample documents. Define file naming, metadata, chunk boundaries and a simple ingestion checklist.",
    "expectedOutcome": "Capstone document preparation. Prepare clean sample documents and metadata.",
    "deliverable": "Sample corpus and metadata plan.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 72,
    "isoDate": "2027-01-26",
    "dateLabel": "26 Jan 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 11,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Capstone search schema",
    "objectives": [
      "Design searchable and filterable fields.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Define fields for document ID, title, chunk text, source, page, category and embedding. Mark which fields are searchable/filterable/retrievable.",
    "expectedOutcome": "Capstone search schema. Design searchable and filterable fields.",
    "deliverable": "Search schema document.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 73,
    "isoDate": "2027-01-27",
    "dateLabel": "27 Jan 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 11,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Capstone prompt and model design",
    "objectives": [
      "Choose an available model and define grounded response behavior.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Write system instructions requiring answers only from retrieved context, source references and an explicit unknown response.",
    "expectedOutcome": "Capstone prompt and model design. Choose an available model and define grounded response behavior.",
    "deliverable": "System prompt and test cases.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 74,
    "isoDate": "2027-01-28",
    "dateLabel": "28 Jan 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 11,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Capstone API design",
    "objectives": [
      "Define request/response and error behavior.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Specify endpoints for health, ingest and ask. Define validation, timeout, no-result and service-unavailable responses.",
    "expectedOutcome": "Capstone API design. Define request/response and error behavior.",
    "deliverable": "API contract.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 75,
    "isoDate": "2027-01-29",
    "dateLabel": "29 Jan 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 11,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Capstone implementation I",
    "objectives": [
      "Implement or simulate document ingestion and chunking.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Build the ingestion component using available services; if cloud access is unavailable, create a local mock and clearly label it.",
    "expectedOutcome": "Capstone implementation I. Implement or simulate document ingestion and chunking.",
    "deliverable": "Working ingestion step.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 76,
    "isoDate": "2027-01-30",
    "dateLabel": "30 Jan 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 11,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 77,
    "isoDate": "2027-01-31",
    "dateLabel": "31 Jan 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 11,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 78,
    "isoDate": "2027-02-01",
    "dateLabel": "01 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 12,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Capstone implementation II",
    "objectives": [
      "Implement retrieval and grounded answer generation.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Connect search/retrieval to the model endpoint if available; otherwise implement a documented mock. Include source metadata in results.",
    "expectedOutcome": "Capstone implementation II. Implement retrieval and grounded answer generation.",
    "deliverable": "Working retrieval/answer flow or mock.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 79,
    "isoDate": "2027-02-02",
    "dateLabel": "02 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 12,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Capstone evaluation",
    "objectives": [
      "Test retrieval and answer grounding.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Run the prepared question set. Record expected source, retrieved source, answer quality and failure reason.",
    "expectedOutcome": "Capstone evaluation. Test retrieval and answer grounding.",
    "deliverable": "Evaluation results table.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 80,
    "isoDate": "2027-02-03",
    "dateLabel": "03 Feb 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 12,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Capstone security review",
    "objectives": [
      "Review identity, secrets, privacy, prompt injection and permissions.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Scan repository for exposed keys. Add environment variables, input validation and untrusted-document handling notes.",
    "expectedOutcome": "Capstone security review. Review identity, secrets, privacy, prompt injection and permissions.",
    "deliverable": "Security checklist and cleaned configuration.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 81,
    "isoDate": "2027-02-04",
    "dateLabel": "04 Feb 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 12,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Capstone deployment and cost review",
    "objectives": [
      "Understand deployment, quotas, logs and resource cleanup.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Deploy only if subscription access and budget permit. Check usage/cost, test endpoint, capture evidence and stop/delete paid resources.",
    "expectedOutcome": "Capstone deployment and cost review. Understand deployment, quotas, logs and resource cleanup.",
    "deliverable": "Deployment evidence or documented local demo plus cost review.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 82,
    "isoDate": "2027-02-05",
    "dateLabel": "05 Feb 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 12,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "AZ-900 final revision",
    "objectives": [
      "Consolidate cloud concepts, architecture, core services, security and pricing.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Explain 15 core AZ-900 concepts aloud without notes; redo weak questions and one portal navigation exercise.",
    "expectedOutcome": "AZ-900 final revision. Consolidate cloud concepts, architecture, core services, security and pricing.",
    "deliverable": "AZ-900 revision score.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 83,
    "isoDate": "2027-02-06",
    "dateLabel": "06 Feb 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 12,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 84,
    "isoDate": "2027-02-07",
    "dateLabel": "07 Feb 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 12,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 85,
    "isoDate": "2027-02-08",
    "dateLabel": "08 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 13,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "DP-900 final revision",
    "objectives": [
      "Consolidate data concepts, SQL, relational/non-relational models and analytics.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Write five SQL queries, explain OLTP/OLAP and select data services for five scenarios.",
    "expectedOutcome": "DP-900 final revision. Consolidate data concepts, SQL, relational/non-relational models and analytics.",
    "deliverable": "DP-900 revision score and SQL file.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 86,
    "isoDate": "2027-02-09",
    "dateLabel": "09 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 13,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "AI-102 final revision",
    "objectives": [
      "Consolidate AI services, Search, Document Intelligence, language, speech and GenAI.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Create a service-selection map for 12 scenarios and explain security, evaluation and deployment considerations.",
    "expectedOutcome": "AI-102 final revision. Consolidate AI services, Search, Document Intelligence, language, speech and GenAI.",
    "deliverable": "AI-102 service map and revision score.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 87,
    "isoDate": "2027-02-10",
    "dateLabel": "10 Feb 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 13,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Final practical assessment",
    "objectives": [
      "Demonstrate and explain the capstone and identify gaps honestly.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Present architecture, data flow, retrieval, model use, safety, evaluation, cost and limitations. Do not claim cloud deployment if only mocked locally.",
    "expectedOutcome": "Final practical assessment. Demonstrate and explain the capstone and identify gaps honestly.",
    "deliverable": "Final assessment report and next-learning list.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 88,
    "isoDate": "2027-02-11",
    "dateLabel": "11 Feb 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 13,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Azure core services scenario practice",
    "objectives": [
      "Consolidate compute, networking, storage and identity service choices.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Answer 8 scenarios and explain the selected service, security boundary and cost consideration.",
    "expectedOutcome": "Azure core services scenario practice. Consolidate compute, networking, storage and identity service choices.",
    "deliverable": "Scenario answer sheet.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 89,
    "isoDate": "2027-02-12",
    "dateLabel": "12 Feb 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 13,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "AZ-900 security and cost lab review",
    "objectives": [
      "Consolidate RBAC, policy, locks, monitoring, pricing and SLA concepts.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Draw a secure resource-group setup, identify a budget alert and explain how to remove unused lab resources.",
    "expectedOutcome": "AZ-900 security and cost lab review. Consolidate RBAC, policy, locks, monitoring, pricing and SLA concepts.",
    "deliverable": "Security and cost checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 90,
    "isoDate": "2027-02-13",
    "dateLabel": "13 Feb 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 13,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 91,
    "isoDate": "2027-02-14",
    "dateLabel": "14 Feb 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 13,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 92,
    "isoDate": "2027-02-15",
    "dateLabel": "15 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 14,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "DP-900 SQL practice set",
    "objectives": [
      "Consolidate SELECT, filters, joins, grouping and relational concepts.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Write 10 SQL queries against a small sample schema and explain each query's result.",
    "expectedOutcome": "DP-900 SQL practice set. Consolidate SELECT, filters, joins, grouping and relational concepts.",
    "deliverable": "SQL practice file and corrections.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 93,
    "isoDate": "2027-02-16",
    "dateLabel": "16 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 14,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "DP-900 data-model selection",
    "objectives": [
      "Consolidate relational, document, key-value, graph and analytical data models.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Map 8 business scenarios to data models/services and justify partitioning or relationship choices.",
    "expectedOutcome": "DP-900 data-model selection. Consolidate relational, document, key-value, graph and analytical data models.",
    "deliverable": "Data service decision matrix.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 94,
    "isoDate": "2027-02-17",
    "dateLabel": "17 Feb 2027",
    "dayOfWeek": "Wednesday",
    "weekNumber": 14,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "AI-102 vision and document scenarios",
    "objectives": [
      "Consolidate image analysis, OCR, object detection and document extraction.",
      "Focus: Guided coding / practical implementation"
    ],
    "practicalWork": "Map 8 document/image scenarios to capabilities and specify expected output fields or detections.",
    "expectedOutcome": "AI-102 vision and document scenarios. Consolidate image analysis, OCR, object detection and document extraction.",
    "deliverable": "Vision/document service selection sheet.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 95,
    "isoDate": "2027-02-18",
    "dateLabel": "18 Feb 2027",
    "dayOfWeek": "Thursday",
    "weekNumber": 14,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "AI-102 language, speech and bot scenarios",
    "objectives": [
      "Consolidate language analysis, translation, speech and conversational AI.",
      "Focus: Testing, debugging and failure scenarios"
    ],
    "practicalWork": "Design a voice-enabled FAQ flow and select the required speech/language capabilities.",
    "expectedOutcome": "AI-102 language, speech and bot scenarios. Consolidate language analysis, translation, speech and conversational AI.",
    "deliverable": "Voice FAQ flowchart.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 96,
    "isoDate": "2027-02-19",
    "dateLabel": "19 Feb 2027",
    "dayOfWeek": "Friday",
    "weekNumber": 14,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "AI Search and RAG troubleshooting",
    "objectives": [
      "Consolidate indexing, filters, embeddings, hybrid search, citations and evaluation.",
      "Focus: Demo, code review and weekly learning checkpoint"
    ],
    "practicalWork": "Diagnose five hypothetical RAG failures: missing chunks, weak retrieval, wrong metadata, unsupported answer and absent citation.",
    "expectedOutcome": "AI Search and RAG troubleshooting. Consolidate indexing, filters, embeddings, hybrid search, citations and evaluation.",
    "deliverable": "RAG troubleshooting matrix.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 97,
    "isoDate": "2027-02-20",
    "dateLabel": "20 Feb 2027",
    "dayOfWeek": "Saturday",
    "weekNumber": 14,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Weekly practical revision and assessment",
    "objectives": [
      "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
      "Focus: Weekly preparation review and practical assessment"
    ],
    "practicalWork": "Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.",
    "expectedOutcome": "Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.",
    "deliverable": "Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 98,
    "isoDate": "2027-02-21",
    "dateLabel": "21 Feb 2027",
    "dayOfWeek": "Sunday",
    "weekNumber": 14,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Weekly revision and consolidation",
    "objectives": [
      "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
      "Focus: Weekly revision, consolidation and next-week preparation"
    ],
    "practicalWork": "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
    "expectedOutcome": "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic.",
    "deliverable": "Azure revision sheet, one architecture diagram and next-week learning checklist.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 99,
    "isoDate": "2027-02-22",
    "dateLabel": "22 Feb 2027",
    "dayOfWeek": "Monday",
    "weekNumber": 15,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Azure capstone demo rehearsal",
    "objectives": [
      "Consolidate architecture, implementation, evaluation, security, monitoring and cost.",
      "Focus: Concepts, architecture and design decisions"
    ],
    "practicalWork": "Prepare a 5-minute walkthrough of the document Q&A capstone or clearly labelled mock. State what is real, simulated and not yet implemented.",
    "expectedOutcome": "Azure capstone demo rehearsal. Consolidate architecture, implementation, evaluation, security, monitoring and cost.",
    "deliverable": "Demo script and architecture explanation.",
    "isDsaRelated": false
  },
  {
    "trackId": "azure",
    "trackLabel": "Azure — Alternate Plan (100 Days)",
    "dayNumber": 100,
    "isoDate": "2027-02-23",
    "dateLabel": "23 Feb 2027",
    "dayOfWeek": "Tuesday",
    "weekNumber": 15,
    "phaseOrModule": "Capstone and final consolidation (Days 86–100 overview)",
    "topic": "Final Azure readiness assessment",
    "objectives": [
      "Review AZ-900, DP-900 and AI-102 certification scopes.",
      "Focus: Instructor-led learning and implementation"
    ],
    "practicalWork": "Complete a mixed scenario assessment, correct wrong answers and list practical gaps that need further lab time.",
    "expectedOutcome": "Final Azure readiness assessment. Review AZ-900, DP-900 and AI-102 certification scopes.",
    "deliverable": "Final assessment score and next-step list.",
    "isDsaRelated": false
  }
];

export const DSA_DAILY_LEETCODE_TRIPLETS: Record<number, SharedDailyLeetCodeQuestion[]> = {
  "1": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "2235",
      "title": "Add Two Integers",
      "slug": "add-two-integers",
      "url": "https://leetcode.com/problems/add-two-integers/",
      "shortExplanation": "Write a clean C++ function returning the sum of two integers to test compilation and execution.",
      "whyMatchesTopic": "Minimal C++ function signature exercise matching Day 1 setup without advanced prerequisites.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "7",
      "title": "Reverse Integer",
      "slug": "reverse-integer",
      "url": "https://leetcode.com/problems/reverse-integer/",
      "shortExplanation": "Reverse digits of a signed 32-bit integer while guarding against 32-bit signed overflow.",
      "whyMatchesTopic": "Directly reinforces C++ int bounds and arithmetic compilation/testing on Day 1.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": false,
      "shortExplanation": "No verified Hard problem assigned for this introductory setup topic.",
      "whyMatchesTopic": "Day 1 covers C++ compiler setup and compiling Hello World; no authentic Hard LeetCode problem specifically tests compiler setup without jumping ahead to unrelated algorithms.",
      "whyUnavailable": "Day 1 covers C++ compiler setup and compiling Hello World; no authentic Hard LeetCode problem specifically tests compiler setup without jumping ahead to unrelated algorithms.",
      "isVerified": false
    }
  ],
  "2": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "2469",
      "title": "Convert the Temperature",
      "slug": "convert-the-temperature",
      "url": "https://leetcode.com/problems/convert-the-temperature/",
      "shortExplanation": "Convert a floating-point Celsius temperature into Kelvin and Fahrenheit using double precision.",
      "whyMatchesTopic": "Directly exercises C++ double precision floating-point types and type arithmetic.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "8",
      "title": "String to Integer (atoi)",
      "slug": "string-to-integer-atoi",
      "url": "https://leetcode.com/problems/string-to-integer-atoi/",
      "shortExplanation": "Parse numeric characters into a signed 32-bit integer while clamping values cleanly at INT_MIN and INT_MAX.",
      "whyMatchesTopic": "Tests integer data types, signed ranges, char-to-int conversion, and overflow clamping in C++.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "65",
      "title": "Valid Number",
      "slug": "valid-number",
      "url": "https://leetcode.com/problems/valid-number/",
      "shortExplanation": "Validate whether an input string represents a valid integer, decimal, or scientific-notation floating number.",
      "whyMatchesTopic": "Directly tests numeric data-type formatting rules (signs, decimals, exponents) in C++.",
      "isVerified": true
    }
  ],
  "3": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1281",
      "title": "Subtract the Product and Sum of Digits of an Integer",
      "slug": "subtract-the-product-and-sum-of-digits-of-an-integer",
      "url": "https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/",
      "shortExplanation": "Use modulo (%) and integer division (/) operators to compute digit product minus digit sum.",
      "whyMatchesTopic": "Directly practices C++ arithmetic operators, modulo extraction, and operator precedence.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "227",
      "title": "Basic Calculator II",
      "slug": "basic-calculator-ii",
      "url": "https://leetcode.com/problems/basic-calculator-ii/",
      "shortExplanation": "Evaluate an arithmetic expression string containing +, -, *, and / respecting operator precedence.",
      "whyMatchesTopic": "Directly applies operator precedence rules and integer division behavior taught in Day 3.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "224",
      "title": "Basic Calculator",
      "slug": "basic-calculator",
      "url": "https://leetcode.com/problems/basic-calculator/",
      "shortExplanation": "Evaluate an arithmetic expression string with +, -, parentheses, and unary minus operators.",
      "whyMatchesTopic": "Tests full expression evaluation, operator precedence, and nested grouping.",
      "isVerified": true
    }
  ],
  "4": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "412",
      "title": "Fizz Buzz",
      "slug": "fizz-buzz",
      "url": "https://leetcode.com/problems/fizz-buzz/",
      "shortExplanation": "Apply multi-branch if/else-if divisibility conditionals across numbers 1 through n.",
      "whyMatchesTopic": "Classic multi-branch conditional logic exercise matching if/else-if fundamentals.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "12",
      "title": "Integer to Roman",
      "slug": "integer-to-roman",
      "url": "https://leetcode.com/problems/integer-to-roman/",
      "shortExplanation": "Convert an integer into Roman numerals using ordered conditional/subtractive rules.",
      "whyMatchesTopic": "Applies multi-case branching and clean boundary value conditions.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "273",
      "title": "Integer to English Words",
      "slug": "integer-to-english-words",
      "url": "https://leetcode.com/problems/integer-to-english-words/",
      "shortExplanation": "Translate a non-negative integer into its exact English word representation across place-value cases.",
      "whyMatchesTopic": "Rich conditional edge-case branching covering zero, teens, tens, and thousand groupings.",
      "isVerified": true
    }
  ],
  "5": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "9",
      "title": "Palindrome Number",
      "slug": "palindrome-number",
      "url": "https://leetcode.com/problems/palindrome-number/",
      "shortExplanation": "Check whether an integer reads the same forward and backward using an iterative digit-reversal loop.",
      "whyMatchesTopic": "Reinforces while-loop termination conditions and digit accumulators.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "50",
      "title": "Pow(x, n)",
      "slug": "powx-n",
      "url": "https://leetcode.com/problems/powx-n/",
      "shortExplanation": "Compute x raised to the power n iteratively using binary exponentiation loops while handling negative exponents.",
      "whyMatchesTopic": "Practices loop invariants, accumulator updates, and signed exponent edge cases.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "41",
      "title": "First Missing Positive",
      "slug": "first-missing-positive",
      "url": "https://leetcode.com/problems/first-missing-positive/",
      "shortExplanation": "Find the smallest missing positive integer using in-place index placement loops in O(n) time.",
      "whyMatchesTopic": "Challenges loop termination guarantees and index-swapping invariants.",
      "isVerified": true
    }
  ],
  "6": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "412",
      "title": "Fizz Buzz",
      "slug": "fizz-buzz",
      "url": "https://leetcode.com/problems/fizz-buzz/",
      "shortExplanation": "Apply multi-branch if/else-if divisibility conditionals across numbers 1 through n.",
      "whyMatchesTopic": "Classic multi-branch conditional logic exercise matching if/else-if fundamentals.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "12",
      "title": "Integer to Roman",
      "slug": "integer-to-roman",
      "url": "https://leetcode.com/problems/integer-to-roman/",
      "shortExplanation": "Convert an integer into Roman numerals using ordered conditional/subtractive rules.",
      "whyMatchesTopic": "Applies multi-case branching and clean boundary value conditions.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "273",
      "title": "Integer to English Words",
      "slug": "integer-to-english-words",
      "url": "https://leetcode.com/problems/integer-to-english-words/",
      "shortExplanation": "Translate a non-negative integer into its exact English word representation across place-value cases.",
      "whyMatchesTopic": "Rich conditional edge-case branching covering zero, teens, tens, and thousand groupings.",
      "isVerified": true
    }
  ],
  "7": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "9",
      "title": "Palindrome Number",
      "slug": "palindrome-number",
      "url": "https://leetcode.com/problems/palindrome-number/",
      "shortExplanation": "Check whether an integer reads the same forward and backward using an iterative digit-reversal loop.",
      "whyMatchesTopic": "Reinforces while-loop termination conditions and digit accumulators.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "50",
      "title": "Pow(x, n)",
      "slug": "powx-n",
      "url": "https://leetcode.com/problems/powx-n/",
      "shortExplanation": "Compute x raised to the power n iteratively using binary exponentiation loops while handling negative exponents.",
      "whyMatchesTopic": "Practices loop invariants, accumulator updates, and signed exponent edge cases.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "41",
      "title": "First Missing Positive",
      "slug": "first-missing-positive",
      "url": "https://leetcode.com/problems/first-missing-positive/",
      "shortExplanation": "Find the smallest missing positive integer using in-place index placement loops in O(n) time.",
      "whyMatchesTopic": "Challenges loop termination guarantees and index-swapping invariants.",
      "isVerified": true
    }
  ],
  "8": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "118",
      "title": "Pascal's Triangle",
      "slug": "pascals-triangle",
      "url": "https://leetcode.com/problems/pascals-triangle/",
      "shortExplanation": "Generate rows of Pascal’s triangle using nested loops over row and column indices.",
      "whyMatchesTopic": "Mirrors nested-loop row/column pattern generation and off-by-one boundary debugging.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "54",
      "title": "Spiral Matrix",
      "slug": "spiral-matrix",
      "url": "https://leetcode.com/problems/spiral-matrix/",
      "shortExplanation": "Traverse a 2D matrix in spiral order by coordinating four boundary loops cleanly.",
      "whyMatchesTopic": "Tests nested directional loops and strict off-by-one boundary checks.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "68",
      "title": "Text Justification",
      "slug": "text-justification",
      "url": "https://leetcode.com/problems/text-justification/",
      "shortExplanation": "Distribute spaces across words line by line using nested formatting loops and careful edge checks.",
      "whyMatchesTopic": "Deep loop-invariant and off-by-one debugging practice for multi-case iteration.",
      "isVerified": true
    }
  ],
  "9": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "509",
      "title": "Fibonacci Number",
      "slug": "fibonacci-number",
      "url": "https://leetcode.com/problems/fibonacci-number/",
      "shortExplanation": "Implement a clean reusable Fibonacci function returning F(n) for small integer inputs.",
      "whyMatchesTopic": "Reinforces function signature, return types, parameter passing, and base handling.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "204",
      "title": "Count Primes",
      "slug": "count-primes",
      "url": "https://leetcode.com/problems/count-primes/",
      "shortExplanation": "Decompose prime counting cleanly into modular sieve/helper steps for O(n log log n) efficiency.",
      "whyMatchesTopic": "Builds directly on modular prime-check functions from Day 9.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "149",
      "title": "Max Points on a Line",
      "slug": "max-points-on-a-line",
      "url": "https://leetcode.com/problems/max-points-on-a-line/",
      "shortExplanation": "Decompose slope reduction (GCD helper function) and point colinearity checks into clean helper functions.",
      "whyMatchesTopic": "Applies modular mathematical helper functions (gcd, normalized slope keys).",
      "isVerified": true
    }
  ],
  "10": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "344",
      "title": "Reverse String",
      "slug": "reverse-string",
      "url": "https://leetcode.com/problems/reverse-string/",
      "shortExplanation": "Modify a vector of characters in-place via pass-by-reference without returning a new vector.",
      "whyMatchesTopic": "Directly demonstrates mutating caller state via C++ reference parameters (&).",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "189",
      "title": "Rotate Array",
      "slug": "rotate-array",
      "url": "https://leetcode.com/problems/rotate-array/",
      "shortExplanation": "Rotate an array in-place using a reusable reverse helper taking a vector reference and index bounds.",
      "whyMatchesTopic": "Demonstrates pass-by-reference in-place mutation across subranges.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "42",
      "title": "Trapping Rain Water",
      "slug": "trapping-rain-water",
      "url": "https://leetcode.com/problems/trapping-rain-water/",
      "shortExplanation": "Compute trapped water over an elevation slice passed by const reference in O(1) auxiliary space.",
      "whyMatchesTopic": "Applies const-reference read-only input semantics with zero unnecessary copies.",
      "isVerified": true
    }
  ],
  "11": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1480",
      "title": "Running Sum of 1d Array",
      "slug": "running-sum-of-1d-array",
      "url": "https://leetcode.com/problems/running-sum-of-1d-array/",
      "shortExplanation": "Traverse an integer array sequentially to compute cumulative sums.",
      "whyMatchesTopic": "Core array indexing and single-pass traversal matching Day 11.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "238",
      "title": "Product of Array Except Self",
      "slug": "product-of-array-except-self",
      "url": "https://leetcode.com/problems/product-of-array-except-self/",
      "shortExplanation": "Compute prefix and suffix products across an array without using division.",
      "whyMatchesTopic": "Strong 1D array traversal and boundary-index reasoning.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "42",
      "title": "Trapping Rain Water",
      "slug": "trapping-rain-water",
      "url": "https://leetcode.com/problems/trapping-rain-water/",
      "shortExplanation": "Determine water trapped at each array index using left/right maximum array bounds.",
      "whyMatchesTopic": "Classic array-bounds reasoning problem building on min/max traversal.",
      "isVerified": true
    }
  ],
  "12": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "125",
      "title": "Valid Palindrome",
      "slug": "valid-palindrome",
      "url": "https://leetcode.com/problems/valid-palindrome/",
      "shortExplanation": "Check if alphanumeric characters of a std::string form a palindrome case-insensitively.",
      "whyMatchesTopic": "Direct std::string indexing and character inspection matching Day 12.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "151",
      "title": "Reverse Words in a String",
      "slug": "reverse-words-in-a-string",
      "url": "https://leetcode.com/problems/reverse-words-in-a-string/",
      "shortExplanation": "Extract and reverse space-delimited words from a string while trimming extra spaces.",
      "whyMatchesTopic": "Practices std::string parsing, substr/word boundaries, and in-place reversal.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "76",
      "title": "Minimum Window Substring",
      "slug": "minimum-window-substring",
      "url": "https://leetcode.com/problems/minimum-window-substring/",
      "shortExplanation": "Find the smallest substring containing all target characters using character frequency arrays.",
      "whyMatchesTopic": "Advanced string frequency tracking and substring window shrinking.",
      "isVerified": true
    }
  ],
  "13": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1480",
      "title": "Running Sum of 1d Array",
      "slug": "running-sum-of-1d-array",
      "url": "https://leetcode.com/problems/running-sum-of-1d-array/",
      "shortExplanation": "Traverse an integer array sequentially to compute cumulative sums.",
      "whyMatchesTopic": "Core array indexing and single-pass traversal matching Day 11.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "238",
      "title": "Product of Array Except Self",
      "slug": "product-of-array-except-self",
      "url": "https://leetcode.com/problems/product-of-array-except-self/",
      "shortExplanation": "Compute prefix and suffix products across an array without using division.",
      "whyMatchesTopic": "Strong 1D array traversal and boundary-index reasoning.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "42",
      "title": "Trapping Rain Water",
      "slug": "trapping-rain-water",
      "url": "https://leetcode.com/problems/trapping-rain-water/",
      "shortExplanation": "Determine water trapped at each array index using left/right maximum array bounds.",
      "whyMatchesTopic": "Classic array-bounds reasoning problem building on min/max traversal.",
      "isVerified": true
    }
  ],
  "14": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "125",
      "title": "Valid Palindrome",
      "slug": "valid-palindrome",
      "url": "https://leetcode.com/problems/valid-palindrome/",
      "shortExplanation": "Check if alphanumeric characters of a std::string form a palindrome case-insensitively.",
      "whyMatchesTopic": "Direct std::string indexing and character inspection matching Day 12.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "151",
      "title": "Reverse Words in a String",
      "slug": "reverse-words-in-a-string",
      "url": "https://leetcode.com/problems/reverse-words-in-a-string/",
      "shortExplanation": "Extract and reverse space-delimited words from a string while trimming extra spaces.",
      "whyMatchesTopic": "Practices std::string parsing, substr/word boundaries, and in-place reversal.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "76",
      "title": "Minimum Window Substring",
      "slug": "minimum-window-substring",
      "url": "https://leetcode.com/problems/minimum-window-substring/",
      "shortExplanation": "Find the smallest substring containing all target characters using character frequency arrays.",
      "whyMatchesTopic": "Advanced string frequency tracking and substring window shrinking.",
      "isVerified": true
    }
  ],
  "15": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1572",
      "title": "Matrix Diagonal Sum",
      "slug": "matrix-diagonal-sum",
      "url": "https://leetcode.com/problems/matrix-diagonal-sum/",
      "shortExplanation": "Sum primary and secondary diagonals of a square 2D array without double-counting the center.",
      "whyMatchesTopic": "Directly mirrors Day 15 2D diagonal sum exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "48",
      "title": "Rotate Image",
      "slug": "rotate-image",
      "url": "https://leetcode.com/problems/rotate-image/",
      "shortExplanation": "Rotate an n×n matrix 90 degrees clockwise in-place by transposing and reversing rows.",
      "whyMatchesTopic": "Applies matrix transpose from Day 15 to an in-place 2D array transformation.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "329",
      "title": "Longest Increasing Path in a Matrix",
      "slug": "longest-increasing-path-in-a-matrix",
      "url": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
      "shortExplanation": "Traverse strictly increasing neighbor cells across a 2D grid with memoized paths.",
      "whyMatchesTopic": "2D grid boundary and row/column neighbor traversal challenge.",
      "isVerified": true
    }
  ],
  "16": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "27",
      "title": "Remove Element",
      "slug": "remove-element",
      "url": "https://leetcode.com/problems/remove-element/",
      "shortExplanation": "Compact non-target elements in-place using read/write positions without extra allocation.",
      "whyMatchesTopic": "Reinforces pointer-like in-place reference updates and bounds safety.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "75",
      "title": "Sort Colors",
      "slug": "sort-colors",
      "url": "https://leetcode.com/problems/sort-colors/",
      "shortExplanation": "Partition an array in-place using three boundary indices (low, mid, high).",
      "whyMatchesTopic": "Practices indirect swap/position manipulation safely within array bounds.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "23",
      "title": "Merge k Sorted Lists",
      "slug": "merge-k-sorted-lists",
      "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
      "shortExplanation": "Manipulate ListNode* pointers safely with nullptr checks while merging sorted chains.",
      "whyMatchesTopic": "Directly exercises C++ node pointer dereferencing and nullptr defensive guards.",
      "isVerified": true
    }
  ],
  "17": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1603",
      "title": "Design Parking System",
      "slug": "design-parking-system",
      "url": "https://leetcode.com/problems/design-parking-system/",
      "shortExplanation": "Design a class with constructor state and member method validation.",
      "whyMatchesTopic": "Directly models C++ class constructors, private fields, and member methods.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "355",
      "title": "Design Twitter",
      "slug": "design-twitter",
      "url": "https://leetcode.com/problems/design-twitter/",
      "shortExplanation": "Encapsulate user posts, followee sets, and timeline retrieval cleanly inside a C++ class.",
      "whyMatchesTopic": "Object-oriented data modeling with clean private invariants and public API methods.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "460",
      "title": "LFU Cache",
      "slug": "lfu-cache",
      "url": "https://leetcode.com/problems/lfu-cache/",
      "shortExplanation": "Architect a multi-structure C++ cache class with strict O(1) invariants and private helpers.",
      "whyMatchesTopic": "Full C++ class encapsulation uniting custom structs and invariant maintenance.",
      "isVerified": true
    }
  ],
  "18": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "706",
      "title": "Design HashMap",
      "slug": "design-hashmap",
      "url": "https://leetcode.com/problems/design-hashmap/",
      "shortExplanation": "Implement encapsulated key-value put/get/remove methods inside a C++ class.",
      "whyMatchesTopic": "Applies OOP encapsulation and clean constructor/method separation.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "146",
      "title": "LRU Cache",
      "slug": "lru-cache",
      "url": "https://leetcode.com/problems/lru-cache/",
      "shortExplanation": "Encapsulate capacity-bounded eviction inside a clean class interface.",
      "whyMatchesTopic": "Demonstrates separating internal representation from public contract.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "295",
      "title": "Find Median from Data Stream",
      "slug": "find-median-from-data-stream",
      "url": "https://leetcode.com/problems/find-median-from-data-stream/",
      "shortExplanation": "Encapsulate streaming balance invariants cleanly inside a MedianFinder class.",
      "whyMatchesTopic": "Strong C++ class encapsulation and invariant enforcement problem.",
      "isVerified": true
    }
  ],
  "19": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "231",
      "title": "Power of Two",
      "slug": "power-of-two",
      "url": "https://leetcode.com/problems/power-of-two/",
      "shortExplanation": "Determine recursively whether n is a power of two using clear base and recursive cases.",
      "whyMatchesTopic": "Direct base-case and recursive reduction practice matching Day 19.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "50",
      "title": "Pow(x, n)",
      "slug": "powx-n",
      "url": "https://leetcode.com/problems/powx-n/",
      "shortExplanation": "Implement recursive binary exponentiation with O(log n) call stack depth.",
      "whyMatchesTopic": "Clean recursive divide-and-conquer call-stack trace exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "10",
      "title": "Regular Expression Matching",
      "slug": "regular-expression-matching",
      "url": "https://leetcode.com/problems/regular-expression-matching/",
      "shortExplanation": "Solve recursive pattern matching over characters, wildcards, and Kleene stars.",
      "whyMatchesTopic": "Demonstrates careful base cases and branching recursive subproblems.",
      "isVerified": true
    }
  ],
  "20": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1572",
      "title": "Matrix Diagonal Sum",
      "slug": "matrix-diagonal-sum",
      "url": "https://leetcode.com/problems/matrix-diagonal-sum/",
      "shortExplanation": "Sum primary and secondary diagonals of a square 2D array without double-counting the center.",
      "whyMatchesTopic": "Directly mirrors Day 15 2D diagonal sum exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "48",
      "title": "Rotate Image",
      "slug": "rotate-image",
      "url": "https://leetcode.com/problems/rotate-image/",
      "shortExplanation": "Rotate an n×n matrix 90 degrees clockwise in-place by transposing and reversing rows.",
      "whyMatchesTopic": "Applies matrix transpose from Day 15 to an in-place 2D array transformation.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "329",
      "title": "Longest Increasing Path in a Matrix",
      "slug": "longest-increasing-path-in-a-matrix",
      "url": "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/",
      "shortExplanation": "Traverse strictly increasing neighbor cells across a 2D grid with memoized paths.",
      "whyMatchesTopic": "2D grid boundary and row/column neighbor traversal challenge.",
      "isVerified": true
    }
  ],
  "21": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "231",
      "title": "Power of Two",
      "slug": "power-of-two",
      "url": "https://leetcode.com/problems/power-of-two/",
      "shortExplanation": "Determine recursively whether n is a power of two using clear base and recursive cases.",
      "whyMatchesTopic": "Direct base-case and recursive reduction practice matching Day 19.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "50",
      "title": "Pow(x, n)",
      "slug": "powx-n",
      "url": "https://leetcode.com/problems/powx-n/",
      "shortExplanation": "Implement recursive binary exponentiation with O(log n) call stack depth.",
      "whyMatchesTopic": "Clean recursive divide-and-conquer call-stack trace exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "10",
      "title": "Regular Expression Matching",
      "slug": "regular-expression-matching",
      "url": "https://leetcode.com/problems/regular-expression-matching/",
      "shortExplanation": "Solve recursive pattern matching over characters, wildcards, and Kleene stars.",
      "whyMatchesTopic": "Demonstrates careful base cases and branching recursive subproblems.",
      "isVerified": true
    }
  ],
  "22": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "344",
      "title": "Reverse String",
      "slug": "reverse-string",
      "url": "https://leetcode.com/problems/reverse-string/",
      "shortExplanation": "Reverse characters recursively by swapping outer endpoints and recursing inward.",
      "whyMatchesTopic": "Directly matches Day 22 recursive string reverse exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "394",
      "title": "Decode String",
      "slug": "decode-string",
      "url": "https://leetcode.com/problems/decode-string/",
      "shortExplanation": "Recursively decode nested k[encoded_string] expressions by tracking string index.",
      "whyMatchesTopic": "Applies recursive string parsing and call-stack frame isolation.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "224",
      "title": "Basic Calculator",
      "slug": "basic-calculator",
      "url": "https://leetcode.com/problems/basic-calculator/",
      "shortExplanation": "Recursively evaluate parenthesized nested sub-expressions in a single pass.",
      "whyMatchesTopic": "Uses recursion cleanly to handle nested scopes in strings.",
      "isVerified": true
    }
  ],
  "23": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "121",
      "title": "Best Time to Buy and Sell Stock",
      "slug": "best-time-to-buy-and-sell-stock",
      "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      "shortExplanation": "Optimize an O(n^2) nested-loop solution down to a single O(n) pass with O(1) space.",
      "whyMatchesTopic": "Concrete demonstration of why reducing O(n^2) to O(n) matters on large inputs.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "53",
      "title": "Maximum Subarray",
      "slug": "maximum-subarray",
      "url": "https://leetcode.com/problems/maximum-subarray/",
      "shortExplanation": "Improve O(n^2) subarray enumeration to O(n) time and O(1) auxiliary space via Kadane’s algorithm.",
      "whyMatchesTopic": "Directly highlights sequential optimization vs quadratic complexity.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "4",
      "title": "Median of Two Sorted Arrays",
      "slug": "median-of-two-sorted-arrays",
      "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      "shortExplanation": "Achieve strict O(log(min(m,n))) time complexity instead of O(m+n) linear merge.",
      "whyMatchesTopic": "Deep time-complexity constraint challenge comparing O(m+n) vs O(log n).",
      "isVerified": true
    }
  ],
  "24": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "121",
      "title": "Best Time to Buy and Sell Stock",
      "slug": "best-time-to-buy-and-sell-stock",
      "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      "shortExplanation": "Optimize an O(n^2) nested-loop solution down to a single O(n) pass with O(1) space.",
      "whyMatchesTopic": "Concrete demonstration of why reducing O(n^2) to O(n) matters on large inputs.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "53",
      "title": "Maximum Subarray",
      "slug": "maximum-subarray",
      "url": "https://leetcode.com/problems/maximum-subarray/",
      "shortExplanation": "Improve O(n^2) subarray enumeration to O(n) time and O(1) auxiliary space via Kadane’s algorithm.",
      "whyMatchesTopic": "Directly highlights sequential optimization vs quadratic complexity.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "4",
      "title": "Median of Two Sorted Arrays",
      "slug": "median-of-two-sorted-arrays",
      "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      "shortExplanation": "Achieve strict O(log(min(m,n))) time complexity instead of O(m+n) linear merge.",
      "whyMatchesTopic": "Deep time-complexity constraint challenge comparing O(m+n) vs O(log n).",
      "isVerified": true
    }
  ],
  "25": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1929",
      "title": "Concatenation of Array",
      "slug": "concatenation-of-array",
      "url": "https://leetcode.com/problems/concatenation-of-array/",
      "shortExplanation": "Build and resize std::vector outputs using indexing and push_back operations.",
      "whyMatchesTopic": "Clean practice with C++ std::vector creation, size(), and iteration.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "56",
      "title": "Merge Intervals",
      "slug": "merge-intervals",
      "url": "https://leetcode.com/problems/merge-intervals/",
      "shortExplanation": "Store and sort interval vectors/pairs by start coordinate and merge overlaps cleanly.",
      "whyMatchesTopic": "Classic std::vector and pair-comparison pattern in C++.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "354",
      "title": "Russian Doll Envelopes",
      "slug": "russian-doll-envelopes",
      "url": "https://leetcode.com/problems/russian-doll-envelopes/",
      "shortExplanation": "Sort std::vector<pair<int,int>> with custom pair ordering and find longest valid chain.",
      "whyMatchesTopic": "Applies pair ordering in std::vector to solve a multi-dimensional constraint problem.",
      "isVerified": true
    }
  ],
  "26": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "88",
      "title": "Merge Sorted Array",
      "slug": "merge-sorted-array",
      "url": "https://leetcode.com/problems/merge-sorted-array/",
      "shortExplanation": "Merge and maintain sorted order cleanly using STL patterns or two-way scan.",
      "whyMatchesTopic": "Reinforces sorted sequence invariants and STL sort/reverse familiarity.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "179",
      "title": "Largest Number",
      "slug": "largest-number",
      "url": "https://leetcode.com/problems/largest-number/",
      "shortExplanation": "Sort strings using a custom std::sort comparator (a + b > b + a).",
      "whyMatchesTopic": "Directly practices std::sort with custom lambda comparators from Day 26.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "315",
      "title": "Count of Smaller Numbers After Self",
      "slug": "count-of-smaller-numbers-after-self",
      "url": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
      "shortExplanation": "Combine divide-and-conquer / STL lower_bound ordering to count right-side smaller items.",
      "whyMatchesTopic": "Applies sorting invariants and binary-search positioning.",
      "isVerified": true
    }
  ],
  "27": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1929",
      "title": "Concatenation of Array",
      "slug": "concatenation-of-array",
      "url": "https://leetcode.com/problems/concatenation-of-array/",
      "shortExplanation": "Build and resize std::vector outputs using indexing and push_back operations.",
      "whyMatchesTopic": "Clean practice with C++ std::vector creation, size(), and iteration.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "56",
      "title": "Merge Intervals",
      "slug": "merge-intervals",
      "url": "https://leetcode.com/problems/merge-intervals/",
      "shortExplanation": "Store and sort interval vectors/pairs by start coordinate and merge overlaps cleanly.",
      "whyMatchesTopic": "Classic std::vector and pair-comparison pattern in C++.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "354",
      "title": "Russian Doll Envelopes",
      "slug": "russian-doll-envelopes",
      "url": "https://leetcode.com/problems/russian-doll-envelopes/",
      "shortExplanation": "Sort std::vector<pair<int,int>> with custom pair ordering and find longest valid chain.",
      "whyMatchesTopic": "Applies pair ordering in std::vector to solve a multi-dimensional constraint problem.",
      "isVerified": true
    }
  ],
  "28": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "88",
      "title": "Merge Sorted Array",
      "slug": "merge-sorted-array",
      "url": "https://leetcode.com/problems/merge-sorted-array/",
      "shortExplanation": "Merge and maintain sorted order cleanly using STL patterns or two-way scan.",
      "whyMatchesTopic": "Reinforces sorted sequence invariants and STL sort/reverse familiarity.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "179",
      "title": "Largest Number",
      "slug": "largest-number",
      "url": "https://leetcode.com/problems/largest-number/",
      "shortExplanation": "Sort strings using a custom std::sort comparator (a + b > b + a).",
      "whyMatchesTopic": "Directly practices std::sort with custom lambda comparators from Day 26.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "315",
      "title": "Count of Smaller Numbers After Self",
      "slug": "count-of-smaller-numbers-after-self",
      "url": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
      "shortExplanation": "Combine divide-and-conquer / STL lower_bound ordering to count right-side smaller items.",
      "whyMatchesTopic": "Applies sorting invariants and binary-search positioning.",
      "isVerified": true
    }
  ],
  "29": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "20",
      "title": "Valid Parentheses",
      "slug": "valid-parentheses",
      "url": "https://leetcode.com/problems/valid-parentheses/",
      "shortExplanation": "Validate nested bracket matching in O(n) using std::stack LIFO semantics.",
      "whyMatchesTopic": "Directly matches Day 29 balanced-parentheses stack exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "150",
      "title": "Evaluate Reverse Polish Notation",
      "slug": "evaluate-reverse-polish-notation",
      "url": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
      "shortExplanation": "Use std::stack to push operands and evaluate postfix operators in order.",
      "whyMatchesTopic": "Clean LIFO stack application for expression evaluation.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "239",
      "title": "Sliding Window Maximum",
      "slug": "sliding-window-maximum",
      "url": "https://leetcode.com/problems/sliding-window-maximum/",
      "shortExplanation": "Maintain a monotonic std::deque of candidate indices in O(n) time.",
      "whyMatchesTopic": "Directly exercises std::deque front/back operations taught in Day 29.",
      "isVerified": true
    }
  ],
  "30": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "217",
      "title": "Contains Duplicate",
      "slug": "contains-duplicate",
      "url": "https://leetcode.com/problems/contains-duplicate/",
      "shortExplanation": "Detect duplicate values in O(n) average time using std::unordered_set.",
      "whyMatchesTopic": "Directly practices set uniqueness and duplicate checking from Day 30.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "49",
      "title": "Group Anagrams",
      "slug": "group-anagrams",
      "url": "https://leetcode.com/problems/group-anagrams/",
      "shortExplanation": "Group words by canonical frequency key using std::unordered_map.",
      "whyMatchesTopic": "Classic C++ map key-value grouping exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "30",
      "title": "Substring with Concatenation of All Words",
      "slug": "substring-with-concatenation-of-all-words",
      "url": "https://leetcode.com/problems/substring-with-concatenation-of-all-words/",
      "shortExplanation": "Use std::unordered_map word-frequency comparisons across sliding word offsets.",
      "whyMatchesTopic": "Tests map frequency counting under strict performance constraints.",
      "isVerified": true
    }
  ],
  "31": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "703",
      "title": "Kth Largest Element in a Stream",
      "slug": "kth-largest-element-in-a-stream",
      "url": "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
      "shortExplanation": "Maintain a min-heap std::priority_queue of size k to return the kth largest stream element.",
      "whyMatchesTopic": "Direct C++ min-heap priority_queue practice.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "215",
      "title": "Kth Largest Element in an Array",
      "slug": "kth-largest-element-in-an-array",
      "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      "shortExplanation": "Find the kth largest integer using a bounded min-heap priority_queue.",
      "whyMatchesTopic": "Directly matches Day 31 kth-largest priority_queue task.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "295",
      "title": "Find Median from Data Stream",
      "slug": "find-median-from-data-stream",
      "url": "https://leetcode.com/problems/find-median-from-data-stream/",
      "shortExplanation": "Balance a max-heap and a min-heap priority_queue to query running medians in O(log n).",
      "whyMatchesTopic": "Applies both max-heap and min-heap std::priority_queue together.",
      "isVerified": true
    }
  ],
  "32": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1636",
      "title": "Sort Array by Increasing Frequency",
      "slug": "sort-array-by-increasing-frequency",
      "url": "https://leetcode.com/problems/sort-array-by-increasing-frequency/",
      "shortExplanation": "Use a custom comparator breaking frequency ties in descending value order.",
      "whyMatchesTopic": "Directly applies multi-key custom comparator sorting taught on Day 32.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "973",
      "title": "K Closest Points to Origin",
      "slug": "k-closest-points-to-origin",
      "url": "https://leetcode.com/problems/k-closest-points-to-origin/",
      "shortExplanation": "Sort coordinate vectors using a custom squared-distance comparator.",
      "whyMatchesTopic": "Applies custom lambda comparator over multi-field points.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "354",
      "title": "Russian Doll Envelopes",
      "slug": "russian-doll-envelopes",
      "url": "https://leetcode.com/problems/russian-doll-envelopes/",
      "shortExplanation": "Sort pairs ascending by width and descending by height via a custom comparator.",
      "whyMatchesTopic": "Shows how tie-breaking custom comparators simplify nested constraints.",
      "isVerified": true
    }
  ],
  "33": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "704",
      "title": "Binary Search",
      "slug": "binary-search",
      "url": "https://leetcode.com/problems/binary-search/",
      "shortExplanation": "Implement classic lo <= hi binary search on a sorted array in O(log n) time.",
      "whyMatchesTopic": "Exact binary search invariant and precondition implementation matching Day 33.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "33",
      "title": "Search in Rotated Sorted Array",
      "slug": "search-in-rotated-sorted-array",
      "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      "shortExplanation": "Adapt binary search invariants to determine which half remains sorted.",
      "whyMatchesTopic": "Deepens binary search loop-invariant reasoning.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "4",
      "title": "Median of Two Sorted Arrays",
      "slug": "median-of-two-sorted-arrays",
      "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      "shortExplanation": "Partition two sorted arrays via binary search over cut indices in logarithmic time.",
      "whyMatchesTopic": "Ultimate binary-search partition invariant problem.",
      "isVerified": true
    }
  ],
  "34": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "703",
      "title": "Kth Largest Element in a Stream",
      "slug": "kth-largest-element-in-a-stream",
      "url": "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
      "shortExplanation": "Maintain a min-heap std::priority_queue of size k to return the kth largest stream element.",
      "whyMatchesTopic": "Direct C++ min-heap priority_queue practice.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "215",
      "title": "Kth Largest Element in an Array",
      "slug": "kth-largest-element-in-an-array",
      "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      "shortExplanation": "Find the kth largest integer using a bounded min-heap priority_queue.",
      "whyMatchesTopic": "Directly matches Day 31 kth-largest priority_queue task.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "295",
      "title": "Find Median from Data Stream",
      "slug": "find-median-from-data-stream",
      "url": "https://leetcode.com/problems/find-median-from-data-stream/",
      "shortExplanation": "Balance a max-heap and a min-heap priority_queue to query running medians in O(log n).",
      "whyMatchesTopic": "Applies both max-heap and min-heap std::priority_queue together.",
      "isVerified": true
    }
  ],
  "35": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "704",
      "title": "Binary Search",
      "slug": "binary-search",
      "url": "https://leetcode.com/problems/binary-search/",
      "shortExplanation": "Implement classic lo <= hi binary search on a sorted array in O(log n) time.",
      "whyMatchesTopic": "Exact binary search invariant and precondition implementation matching Day 33.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "33",
      "title": "Search in Rotated Sorted Array",
      "slug": "search-in-rotated-sorted-array",
      "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      "shortExplanation": "Adapt binary search invariants to determine which half remains sorted.",
      "whyMatchesTopic": "Deepens binary search loop-invariant reasoning.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "4",
      "title": "Median of Two Sorted Arrays",
      "slug": "median-of-two-sorted-arrays",
      "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      "shortExplanation": "Partition two sorted arrays via binary search over cut indices in logarithmic time.",
      "whyMatchesTopic": "Ultimate binary-search partition invariant problem.",
      "isVerified": true
    }
  ],
  "36": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "35",
      "title": "Search Insert Position",
      "slug": "search-insert-position",
      "url": "https://leetcode.com/problems/search-insert-position/",
      "shortExplanation": "Implement lower_bound manually to return the first index >= target.",
      "whyMatchesTopic": "Directly exercises std::lower_bound invariant from Day 36.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "34",
      "title": "Find First and Last Position of Element in Sorted Array",
      "slug": "find-first-and-last-position-of-element-in-sorted-array",
      "url": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
      "shortExplanation": "Combine lower_bound and upper_bound binary searches to locate first and last occurrence.",
      "whyMatchesTopic": "Exact match to Day 36 first/last occurrence pattern.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "410",
      "title": "Split Array Largest Sum",
      "slug": "split-array-largest-sum",
      "url": "https://leetcode.com/problems/split-array-largest-sum/",
      "shortExplanation": "Apply binary search on the answer space using a monotonic greedy feasibility helper.",
      "whyMatchesTopic": "Applies upper/lower bound binary search to optimization decision problems.",
      "isVerified": true
    }
  ],
  "37": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "912",
      "title": "Sort an Array",
      "slug": "sort-an-array",
      "url": "https://leetcode.com/problems/sort-an-array/",
      "shortExplanation": "Practice ordering elements cleanly and verifying sorted output on edge cases.",
      "whyMatchesTopic": "Directly tests sorting implementations and array invariants.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "75",
      "title": "Sort Colors",
      "slug": "sort-colors",
      "url": "https://leetcode.com/problems/sort-colors/",
      "shortExplanation": "Partition 0s, 1s, and 2s in-place with minimal swaps.",
      "whyMatchesTopic": "Connects elementary in-place swapping strategies to linear partitioning.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "164",
      "title": "Maximum Gap",
      "slug": "maximum-gap",
      "url": "https://leetcode.com/problems/maximum-gap/",
      "shortExplanation": "Find the maximum successive difference in sorted order using bucket/radix sorting ideas.",
      "whyMatchesTopic": "Explores distribution/bucket sorting beyond O(n^2) elementary sorts.",
      "isVerified": true
    }
  ],
  "38": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "268",
      "title": "Missing Number",
      "slug": "missing-number",
      "url": "https://leetcode.com/problems/missing-number/",
      "shortExplanation": "Locate the missing value in [0..n] cleanly using sorting or XOR/sum invariants.",
      "whyMatchesTopic": "Introduces ordering and duplicate/missing boundary reasoning.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "148",
      "title": "Sort List",
      "slug": "sort-list",
      "url": "https://leetcode.com/problems/sort-list/",
      "shortExplanation": "Implement top-down or bottom-up merge sort in O(n log n) time.",
      "whyMatchesTopic": "Directly implements divide-and-conquer merge sort on chains.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "493",
      "title": "Reverse Pairs",
      "slug": "reverse-pairs",
      "url": "https://leetcode.com/problems/reverse-pairs/",
      "shortExplanation": "Modify merge sort’s merge step to count important reverse pairs across sorted halves.",
      "whyMatchesTopic": "Classic merge-sort augmentation testing divide-and-conquer mastery.",
      "isVerified": true
    }
  ],
  "39": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1",
      "title": "Two Sum",
      "slug": "two-sum",
      "url": "https://leetcode.com/problems/two-sum/",
      "shortExplanation": "Store seen complements in an unordered_map for O(n) single-pass pair lookup.",
      "whyMatchesTopic": "Directly matches Day 39 Two Sum hashing exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "560",
      "title": "Subarray Sum Equals K",
      "slug": "subarray-sum-equals-k",
      "url": "https://leetcode.com/problems/subarray-sum-equals-k/",
      "shortExplanation": "Combine prefix sums with a hash map of cumulative sum frequencies.",
      "whyMatchesTopic": "Bridges hashing frequency lookups into linear subarray counting.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "76",
      "title": "Minimum Window Substring",
      "slug": "minimum-window-substring",
      "url": "https://leetcode.com/problems/minimum-window-substring/",
      "shortExplanation": "Match target character frequency hash counts dynamically across a window.",
      "whyMatchesTopic": "High-precision hash-table frequency matching under strict O(n) bounds.",
      "isVerified": true
    }
  ],
  "40": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "26",
      "title": "Remove Duplicates from Sorted Array",
      "slug": "remove-duplicates-from-sorted-array",
      "url": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      "shortExplanation": "Compact unique values in-place using slow and fast two pointers.",
      "whyMatchesTopic": "Direct match to Day 40 in-place duplicate removal exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "3",
      "title": "Longest Substring Without Repeating Characters",
      "slug": "longest-substring-without-repeating-characters",
      "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      "shortExplanation": "Expand and shrink a variable sliding window maintaining unique characters.",
      "whyMatchesTopic": "Core variable-size sliding window pattern from Day 40.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "239",
      "title": "Sliding Window Maximum",
      "slug": "sliding-window-maximum",
      "url": "https://leetcode.com/problems/sliding-window-maximum/",
      "shortExplanation": "Track the maximum element across every fixed-size window of length k in O(n).",
      "whyMatchesTopic": "Directly advances Day 40 fixed-window max concepts.",
      "isVerified": true
    }
  ],
  "41": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1",
      "title": "Two Sum",
      "slug": "two-sum",
      "url": "https://leetcode.com/problems/two-sum/",
      "shortExplanation": "Store seen complements in an unordered_map for O(n) single-pass pair lookup.",
      "whyMatchesTopic": "Directly matches Day 39 Two Sum hashing exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "560",
      "title": "Subarray Sum Equals K",
      "slug": "subarray-sum-equals-k",
      "url": "https://leetcode.com/problems/subarray-sum-equals-k/",
      "shortExplanation": "Combine prefix sums with a hash map of cumulative sum frequencies.",
      "whyMatchesTopic": "Bridges hashing frequency lookups into linear subarray counting.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "76",
      "title": "Minimum Window Substring",
      "slug": "minimum-window-substring",
      "url": "https://leetcode.com/problems/minimum-window-substring/",
      "shortExplanation": "Match target character frequency hash counts dynamically across a window.",
      "whyMatchesTopic": "High-precision hash-table frequency matching under strict O(n) bounds.",
      "isVerified": true
    }
  ],
  "42": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "26",
      "title": "Remove Duplicates from Sorted Array",
      "slug": "remove-duplicates-from-sorted-array",
      "url": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      "shortExplanation": "Compact unique values in-place using slow and fast two pointers.",
      "whyMatchesTopic": "Direct match to Day 40 in-place duplicate removal exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "3",
      "title": "Longest Substring Without Repeating Characters",
      "slug": "longest-substring-without-repeating-characters",
      "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      "shortExplanation": "Expand and shrink a variable sliding window maintaining unique characters.",
      "whyMatchesTopic": "Core variable-size sliding window pattern from Day 40.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "239",
      "title": "Sliding Window Maximum",
      "slug": "sliding-window-maximum",
      "url": "https://leetcode.com/problems/sliding-window-maximum/",
      "shortExplanation": "Track the maximum element across every fixed-size window of length k in O(n).",
      "whyMatchesTopic": "Directly advances Day 40 fixed-window max concepts.",
      "isVerified": true
    }
  ],
  "43": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "303",
      "title": "Range Sum Query - Immutable",
      "slug": "range-sum-query-immutable",
      "url": "https://leetcode.com/problems/range-sum-query-immutable/",
      "shortExplanation": "Precompute a prefix sum array so range queries answer in O(1) time.",
      "whyMatchesTopic": "Exact match to Day 43 prefix-array range-sum objective.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "560",
      "title": "Subarray Sum Equals K",
      "slug": "subarray-sum-equals-k",
      "url": "https://leetcode.com/problems/subarray-sum-equals-k/",
      "shortExplanation": "Count subarrays summing to k by subtracting prior prefix sums.",
      "whyMatchesTopic": "Classic prefix-sum subarray query pattern from Day 43.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "862",
      "title": "Shortest Subarray with Sum at Least K",
      "slug": "shortest-subarray-with-sum-at-least-k",
      "url": "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",
      "shortExplanation": "Find shortest non-empty subarray >= k using prefix sums with a monotonic deque (handles negatives).",
      "whyMatchesTopic": "Deep prefix-sum + monotonic constraint extension.",
      "isVerified": true
    }
  ],
  "44": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "203",
      "title": "Remove Linked List Elements",
      "slug": "remove-linked-list-elements",
      "url": "https://leetcode.com/problems/remove-linked-list-elements/",
      "shortExplanation": "Traverse a singly linked list with a dummy head and delete matching nodes safely.",
      "whyMatchesTopic": "Directly matches Day 44 insert/delete-by-value traversal objective.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "2",
      "title": "Add Two Numbers",
      "slug": "add-two-numbers",
      "url": "https://leetcode.com/problems/add-two-numbers/",
      "shortExplanation": "Traverse two linked lists digit-by-digit and build a result list appending at tail.",
      "whyMatchesTopic": "Reinforces node allocation, head/tail tracking, and nullptr handling.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "25",
      "title": "Reverse Nodes in k-Group",
      "slug": "reverse-nodes-in-k-group",
      "url": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
      "shortExplanation": "Relink k-sized sub-chains cleanly without losing head or tail pointers.",
      "whyMatchesTopic": "Rigorous pointer-relinking exercise testing linked list manipulation.",
      "isVerified": true
    }
  ],
  "45": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "206",
      "title": "Reverse Linked List",
      "slug": "reverse-linked-list",
      "url": "https://leetcode.com/problems/reverse-linked-list/",
      "shortExplanation": "Iteratively reverse next pointers using prev, curr, and next variables.",
      "whyMatchesTopic": "Exact match to Day 45 iterative linked-list reversal.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "142",
      "title": "Linked List Cycle II",
      "slug": "linked-list-cycle-ii",
      "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
      "shortExplanation": "Use Floyd’s slow and fast pointers to detect a cycle and pinpoint its entry node.",
      "whyMatchesTopic": "Directly builds on Day 45 slow/fast cycle detection.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "23",
      "title": "Merge k Sorted Lists",
      "slug": "merge-k-sorted-lists",
      "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
      "shortExplanation": "Merge k sorted linked lists systematically using divide-and-conquer or min-heap.",
      "whyMatchesTopic": "Extends Day 45 merge-sorted-lists pattern to k chains.",
      "isVerified": true
    }
  ],
  "46": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "496",
      "title": "Next Greater Element I",
      "slug": "next-greater-element-i",
      "url": "https://leetcode.com/problems/next-greater-element-i/",
      "shortExplanation": "Maintain a decreasing monotonic stack to find the next greater value to the right.",
      "whyMatchesTopic": "Directly matches Day 46 next greater element exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "739",
      "title": "Daily Temperatures",
      "slug": "daily-temperatures",
      "url": "https://leetcode.com/problems/daily-temperatures/",
      "shortExplanation": "Use a monotonic stack of indices to compute wait days until a warmer value.",
      "whyMatchesTopic": "Classic monotonic stack index-distance application.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "84",
      "title": "Largest Rectangle in Histogram",
      "slug": "largest-rectangle-in-histogram",
      "url": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      "shortExplanation": "Compute previous/next smaller bars in O(n) via a monotonic stack.",
      "whyMatchesTopic": "Flagship monotonic stack boundary problem.",
      "isVerified": true
    }
  ],
  "47": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "933",
      "title": "Number of Recent Calls",
      "slug": "number-of-recent-calls",
      "url": "https://leetcode.com/problems/number-of-recent-calls/",
      "shortExplanation": "Maintain a FIFO queue pruning timestamps older than the 3000ms window.",
      "whyMatchesTopic": "Clean FIFO queue sliding-window pruning exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "622",
      "title": "Design Circular Queue",
      "slug": "design-circular-queue",
      "url": "https://leetcode.com/problems/design-circular-queue/",
      "shortExplanation": "Implement a fixed-capacity ring buffer with head, tail, and count invariants.",
      "whyMatchesTopic": "Direct match to Day 47 circular queue objective.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "239",
      "title": "Sliding Window Maximum",
      "slug": "sliding-window-maximum",
      "url": "https://leetcode.com/problems/sliding-window-maximum/",
      "shortExplanation": "Use a double-ended queue (deque) to maintain candidate maxima in O(1) amortized time.",
      "whyMatchesTopic": "Direct match to Day 47 sliding-window maximum deque exercise.",
      "isVerified": true
    }
  ],
  "48": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "206",
      "title": "Reverse Linked List",
      "slug": "reverse-linked-list",
      "url": "https://leetcode.com/problems/reverse-linked-list/",
      "shortExplanation": "Iteratively reverse next pointers using prev, curr, and next variables.",
      "whyMatchesTopic": "Exact match to Day 45 iterative linked-list reversal.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "142",
      "title": "Linked List Cycle II",
      "slug": "linked-list-cycle-ii",
      "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
      "shortExplanation": "Use Floyd’s slow and fast pointers to detect a cycle and pinpoint its entry node.",
      "whyMatchesTopic": "Directly builds on Day 45 slow/fast cycle detection.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "23",
      "title": "Merge k Sorted Lists",
      "slug": "merge-k-sorted-lists",
      "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
      "shortExplanation": "Merge k sorted linked lists systematically using divide-and-conquer or min-heap.",
      "whyMatchesTopic": "Extends Day 45 merge-sorted-lists pattern to k chains.",
      "isVerified": true
    }
  ],
  "49": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "496",
      "title": "Next Greater Element I",
      "slug": "next-greater-element-i",
      "url": "https://leetcode.com/problems/next-greater-element-i/",
      "shortExplanation": "Maintain a decreasing monotonic stack to find the next greater value to the right.",
      "whyMatchesTopic": "Directly matches Day 46 next greater element exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "739",
      "title": "Daily Temperatures",
      "slug": "daily-temperatures",
      "url": "https://leetcode.com/problems/daily-temperatures/",
      "shortExplanation": "Use a monotonic stack of indices to compute wait days until a warmer value.",
      "whyMatchesTopic": "Classic monotonic stack index-distance application.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "84",
      "title": "Largest Rectangle in Histogram",
      "slug": "largest-rectangle-in-histogram",
      "url": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      "shortExplanation": "Compute previous/next smaller bars in O(n) via a monotonic stack.",
      "whyMatchesTopic": "Flagship monotonic stack boundary problem.",
      "isVerified": true
    }
  ],
  "50": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "94",
      "title": "Binary Tree Inorder Traversal",
      "slug": "binary-tree-inorder-traversal",
      "url": "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      "shortExplanation": "Traverse Left → Root → Right recursively (and iteratively) across TreeNode pointers.",
      "whyMatchesTopic": "Direct match to Day 50 recursive tree traversal exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "105",
      "title": "Construct Binary Tree from Preorder and Inorder Traversal",
      "slug": "construct-binary-tree-from-preorder-and-inorder-traversal",
      "url": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
      "shortExplanation": "Reconstruct exact TreeNode structure using preorder root and inorder left/right splits.",
      "whyMatchesTopic": "Tests deep understanding of preorder and inorder invariants.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "124",
      "title": "Binary Tree Maximum Path Sum",
      "slug": "binary-tree-maximum-path-sum",
      "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
      "shortExplanation": "Aggregate left and right subtree gains cleanly during postorder recursion.",
      "whyMatchesTopic": "Applies postorder recursive return values vs global path tracking.",
      "isVerified": true
    }
  ],
  "51": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "104",
      "title": "Maximum Depth of Binary Tree",
      "slug": "maximum-depth-of-binary-tree",
      "url": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      "shortExplanation": "Compute tree height recursively or via queue-based level-order BFS.",
      "whyMatchesTopic": "Direct match to Day 51 depth/height and BFS level counting.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "102",
      "title": "Binary Tree Level Order Traversal",
      "slug": "binary-tree-level-order-traversal",
      "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      "shortExplanation": "Use a FIFO queue tracking level sizes to collect nodes layer by layer.",
      "whyMatchesTopic": "Exact match to Day 51 level-order BFS using queue.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "297",
      "title": "Serialize and Deserialize Binary Tree",
      "slug": "serialize-and-deserialize-binary-tree",
      "url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      "shortExplanation": "Encode and reconstruct a binary tree via BFS or preorder traversal strings.",
      "whyMatchesTopic": "Demonstrates lossless tree traversal serialization.",
      "isVerified": true
    }
  ],
  "52": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "700",
      "title": "Search in a Binary Search Tree",
      "slug": "search-in-a-binary-search-tree",
      "url": "https://leetcode.com/problems/search-in-a-binary-search-tree/",
      "shortExplanation": "Navigate left or right branches using the BST ordering property.",
      "whyMatchesTopic": "Direct match to Day 52 BST search implementation.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "98",
      "title": "Validate Binary Search Tree",
      "slug": "validate-binary-search-tree",
      "url": "https://leetcode.com/problems/validate-binary-search-tree/",
      "shortExplanation": "Verify strict min/max value bounds (or sorted inorder property) across every node.",
      "whyMatchesTopic": "Exact match to Day 52 BST validation task.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1373",
      "title": "Maximum Sum BST in Binary Tree",
      "slug": "maximum-sum-bst-in-binary-tree",
      "url": "https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/",
      "shortExplanation": "Verify subtree BST validity and accumulate valid BST sums bottom-up.",
      "whyMatchesTopic": "Deepens BST invariant checks across arbitrary subtrees.",
      "isVerified": true
    }
  ],
  "53": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1046",
      "title": "Last Stone Weight",
      "slug": "last-stone-weight",
      "url": "https://leetcode.com/problems/last-stone-weight/",
      "shortExplanation": "Repeatedly extract the two largest stones from a max-heap and push their difference.",
      "whyMatchesTopic": "Clear max-heap simulation reinforcing push/pop/top invariants.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "347",
      "title": "Top K Frequent Elements",
      "slug": "top-k-frequent-elements",
      "url": "https://leetcode.com/problems/top-k-frequent-elements/",
      "shortExplanation": "Maintain a min-heap priority_queue of size k over frequency pairs.",
      "whyMatchesTopic": "Classic top-K priority_queue pattern.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "295",
      "title": "Find Median from Data Stream",
      "slug": "find-median-from-data-stream",
      "url": "https://leetcode.com/problems/find-median-from-data-stream/",
      "shortExplanation": "Balance lower-half max-heap and upper-half min-heap for dynamic medians.",
      "whyMatchesTopic": "Classic dual-heap architecture problem.",
      "isVerified": true
    }
  ],
  "54": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "455",
      "title": "Assign Cookies",
      "slug": "assign-cookies",
      "url": "https://leetcode.com/problems/assign-cookies/",
      "shortExplanation": "Sort children greed factors and cookie sizes and match greedily from smallest.",
      "whyMatchesTopic": "Clean introductory greedy matching choice.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "435",
      "title": "Non-overlapping Intervals",
      "slug": "non-overlapping-intervals",
      "url": "https://leetcode.com/problems/non-overlapping-intervals/",
      "shortExplanation": "Sort intervals by finish time and greedily keep earliest-ending non-overlapping intervals.",
      "whyMatchesTopic": "Direct match to Day 54 interval selection after sorting by finish time.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "135",
      "title": "Candy",
      "slug": "candy",
      "url": "https://leetcode.com/problems/candy/",
      "shortExplanation": "Satisfy left-neighbor and right-neighbor rating constraints in two greedy linear passes.",
      "whyMatchesTopic": "Tests proving local greedy invariants from left and right directions.",
      "isVerified": true
    }
  ],
  "55": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "700",
      "title": "Search in a Binary Search Tree",
      "slug": "search-in-a-binary-search-tree",
      "url": "https://leetcode.com/problems/search-in-a-binary-search-tree/",
      "shortExplanation": "Navigate left or right branches using the BST ordering property.",
      "whyMatchesTopic": "Direct match to Day 52 BST search implementation.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "98",
      "title": "Validate Binary Search Tree",
      "slug": "validate-binary-search-tree",
      "url": "https://leetcode.com/problems/validate-binary-search-tree/",
      "shortExplanation": "Verify strict min/max value bounds (or sorted inorder property) across every node.",
      "whyMatchesTopic": "Exact match to Day 52 BST validation task.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1373",
      "title": "Maximum Sum BST in Binary Tree",
      "slug": "maximum-sum-bst-in-binary-tree",
      "url": "https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/",
      "shortExplanation": "Verify subtree BST validity and accumulate valid BST sums bottom-up.",
      "whyMatchesTopic": "Deepens BST invariant checks across arbitrary subtrees.",
      "isVerified": true
    }
  ],
  "56": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "455",
      "title": "Assign Cookies",
      "slug": "assign-cookies",
      "url": "https://leetcode.com/problems/assign-cookies/",
      "shortExplanation": "Sort children greed factors and cookie sizes and match greedily from smallest.",
      "whyMatchesTopic": "Clean introductory greedy matching choice.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "435",
      "title": "Non-overlapping Intervals",
      "slug": "non-overlapping-intervals",
      "url": "https://leetcode.com/problems/non-overlapping-intervals/",
      "shortExplanation": "Sort intervals by finish time and greedily keep earliest-ending non-overlapping intervals.",
      "whyMatchesTopic": "Direct match to Day 54 interval selection after sorting by finish time.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "135",
      "title": "Candy",
      "slug": "candy",
      "url": "https://leetcode.com/problems/candy/",
      "shortExplanation": "Satisfy left-neighbor and right-neighbor rating constraints in two greedy linear passes.",
      "whyMatchesTopic": "Tests proving local greedy invariants from left and right directions.",
      "isVerified": true
    }
  ],
  "57": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1863",
      "title": "Sum of All Subset XOR Totals",
      "slug": "sum-of-all-subset-xor-totals",
      "url": "https://leetcode.com/problems/sum-of-all-subset-xor-totals/",
      "shortExplanation": "Explore include/exclude choices cleanly across array elements.",
      "whyMatchesTopic": "Introductory subset-exploration recursion.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "78",
      "title": "Subsets",
      "slug": "subsets",
      "url": "https://leetcode.com/problems/subsets/",
      "shortExplanation": "Generate all unique subsets using choose-explore-unchoose backtracking.",
      "whyMatchesTopic": "Exact match to Day 57 subsets generation exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "51",
      "title": "N-Queens",
      "slug": "n-queens",
      "url": "https://leetcode.com/problems/n-queens/",
      "shortExplanation": "Place queens row-by-row with column and diagonal conflict pruning.",
      "whyMatchesTopic": "Classic backtracking + constraint pruning challenge.",
      "isVerified": true
    }
  ],
  "58": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "509",
      "title": "Fibonacci Number",
      "slug": "fibonacci-number",
      "url": "https://leetcode.com/problems/fibonacci-number/",
      "shortExplanation": "Implement naive recursion, top-down memoization, and bottom-up tabulation with O(1) space.",
      "whyMatchesTopic": "Exact match to Day 58 Fibonacci memoization and tabulation conversion.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "322",
      "title": "Coin Change",
      "slug": "coin-change",
      "url": "https://leetcode.com/problems/coin-change/",
      "shortExplanation": "Formulate minimum-coin state transitions over amount 0..S cleanly.",
      "whyMatchesTopic": "Demonstrates overlapping subproblems and optimal substructure beyond Fibonacci.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "32",
      "title": "Longest Valid Parentheses",
      "slug": "longest-valid-parentheses",
      "url": "https://leetcode.com/problems/longest-valid-parentheses/",
      "shortExplanation": "Compute longest valid substring endings using structured 1D DP state transitions.",
      "whyMatchesTopic": "Tests clear DP state transition design on edge cases.",
      "isVerified": true
    }
  ],
  "59": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "70",
      "title": "Climbing Stairs",
      "slug": "climbing-stairs",
      "url": "https://leetcode.com/problems/climbing-stairs/",
      "shortExplanation": "Write recurrence dp[i] = dp[i-1] + dp[i-2] with base states.",
      "whyMatchesTopic": "Exact match to Day 59 climbing stairs task.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "198",
      "title": "House Robber",
      "slug": "house-robber",
      "url": "https://leetcode.com/problems/house-robber/",
      "shortExplanation": "Write recurrence dp[i] = max(dp[i-1], nums[i] + dp[i-2]) before coding.",
      "whyMatchesTopic": "Exact match to Day 59 house robber recurrence exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1235",
      "title": "Maximum Profit in Job Scheduling",
      "slug": "maximum-profit-in-job-scheduling",
      "url": "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
      "shortExplanation": "Sort intervals by end time and combine 1D DP transitions with binary search.",
      "whyMatchesTopic": "Scales 1D take-or-skip DP to weighted interval transitions.",
      "isVerified": true
    }
  ],
  "60": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "119",
      "title": "Pascal's Triangle II",
      "slug": "pascals-triangle-ii",
      "url": "https://leetcode.com/problems/pascals-triangle-ii/",
      "shortExplanation": "Compute 2D row-transition states and observe how current row depends on previous row.",
      "whyMatchesTopic": "Builds intuition for 2D grid state dependencies.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "62",
      "title": "Unique Paths",
      "slug": "unique-paths",
      "url": "https://leetcode.com/problems/unique-paths/",
      "shortExplanation": "Fill an m×n 2D grid DP table summing top and left transitions.",
      "whyMatchesTopic": "Exact match to Day 60 unique paths grid DP exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "115",
      "title": "Distinct Subsequences",
      "slug": "distinct-subsequences",
      "url": "https://leetcode.com/problems/distinct-subsequences/",
      "shortExplanation": "Fill a 2D DP table counting subsequence matches across s[0..i] and t[0..j].",
      "whyMatchesTopic": "Canonical verified Hard 2D string DP transition table.",
      "isVerified": true
    }
  ],
  "61": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1971",
      "title": "Find if Path Exists in Graph",
      "slug": "find-if-path-exists-in-graph",
      "url": "https://leetcode.com/problems/find-if-path-exists-in-graph/",
      "shortExplanation": "Build an adjacency list from an edge list and test reachability between source and destination.",
      "whyMatchesTopic": "Direct adjacency-list construction and neighbor traversal matching Day 61.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "1557",
      "title": "Minimum Number of Vertices to Reach All Nodes",
      "slug": "minimum-number-of-vertices-to-reach-all-nodes",
      "url": "https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/",
      "shortExplanation": "Reason about directed graph in-degrees over edge lists.",
      "whyMatchesTopic": "Tests directed vs undirected graph representation concepts from Day 61.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "127",
      "title": "Word Ladder",
      "slug": "word-ladder",
      "url": "https://leetcode.com/problems/word-ladder/",
      "shortExplanation": "Construct implicit graph edges between neighboring words and find minimum transformation steps.",
      "whyMatchesTopic": "Bridges graph adjacency construction into shortest unweighted path search.",
      "isVerified": true
    }
  ],
  "62": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "70",
      "title": "Climbing Stairs",
      "slug": "climbing-stairs",
      "url": "https://leetcode.com/problems/climbing-stairs/",
      "shortExplanation": "Write recurrence dp[i] = dp[i-1] + dp[i-2] with base states.",
      "whyMatchesTopic": "Exact match to Day 59 climbing stairs task.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "198",
      "title": "House Robber",
      "slug": "house-robber",
      "url": "https://leetcode.com/problems/house-robber/",
      "shortExplanation": "Write recurrence dp[i] = max(dp[i-1], nums[i] + dp[i-2]) before coding.",
      "whyMatchesTopic": "Exact match to Day 59 house robber recurrence exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1235",
      "title": "Maximum Profit in Job Scheduling",
      "slug": "maximum-profit-in-job-scheduling",
      "url": "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
      "shortExplanation": "Sort intervals by end time and combine 1D DP transitions with binary search.",
      "whyMatchesTopic": "Scales 1D take-or-skip DP to weighted interval transitions.",
      "isVerified": true
    }
  ],
  "63": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "119",
      "title": "Pascal's Triangle II",
      "slug": "pascals-triangle-ii",
      "url": "https://leetcode.com/problems/pascals-triangle-ii/",
      "shortExplanation": "Compute 2D row-transition states and observe how current row depends on previous row.",
      "whyMatchesTopic": "Builds intuition for 2D grid state dependencies.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "62",
      "title": "Unique Paths",
      "slug": "unique-paths",
      "url": "https://leetcode.com/problems/unique-paths/",
      "shortExplanation": "Fill an m×n 2D grid DP table summing top and left transitions.",
      "whyMatchesTopic": "Exact match to Day 60 unique paths grid DP exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "115",
      "title": "Distinct Subsequences",
      "slug": "distinct-subsequences",
      "url": "https://leetcode.com/problems/distinct-subsequences/",
      "shortExplanation": "Fill a 2D DP table counting subsequence matches across s[0..i] and t[0..j].",
      "whyMatchesTopic": "Canonical verified Hard 2D string DP transition table.",
      "isVerified": true
    }
  ],
  "64": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "733",
      "title": "Flood Fill",
      "slug": "flood-fill",
      "url": "https://leetcode.com/problems/flood-fill/",
      "shortExplanation": "Apply DFS or BFS over a 2D grid avoiding re-visiting already-colored cells.",
      "whyMatchesTopic": "Introductory grid traversal with visited-state control.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "200",
      "title": "Number of Islands",
      "slug": "number-of-islands",
      "url": "https://leetcode.com/problems/number-of-islands/",
      "shortExplanation": "Count connected components on a 2D grid using DFS/BFS traversal.",
      "whyMatchesTopic": "Exact match to Day 64 connected-components and grid traversal exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "127",
      "title": "Word Ladder",
      "slug": "word-ladder",
      "url": "https://leetcode.com/problems/word-ladder/",
      "shortExplanation": "Use level-order BFS with visited tracking to find shortest transformation distance.",
      "whyMatchesTopic": "Classic shortest-path unweighted BFS challenge.",
      "isVerified": true
    }
  ],
  "65": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "997",
      "title": "Find the Town Judge",
      "slug": "find-the-town-judge",
      "url": "https://leetcode.com/problems/find-the-town-judge/",
      "shortExplanation": "Compute vertex in-degree and out-degree counts over directed edges.",
      "whyMatchesTopic": "Directly builds in-degree intuition used in Kahn’s topological sort.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "210",
      "title": "Course Schedule II",
      "slug": "course-schedule-ii",
      "url": "https://leetcode.com/problems/course-schedule-ii/",
      "shortExplanation": "Generate a topological ordering of a directed graph and detect cycles.",
      "whyMatchesTopic": "Exact match to Day 65 topological sort objective.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "2050",
      "title": "Parallel Courses III",
      "slug": "parallel-courses-iii",
      "url": "https://leetcode.com/problems/parallel-courses-iii/",
      "shortExplanation": "Combine Kahn’s topological ordering over a DAG with critical-path longest completion times.",
      "whyMatchesTopic": "Verified non-premium Hard topological DAG DP problem.",
      "isVerified": true
    }
  ],
  "66": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1971",
      "title": "Find if Path Exists in Graph",
      "slug": "find-if-path-exists-in-graph",
      "url": "https://leetcode.com/problems/find-if-path-exists-in-graph/",
      "shortExplanation": "Union connected edges via Disjoint Set Union with path compression.",
      "whyMatchesTopic": "Direct DSU find/union exercise from Day 66.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "684",
      "title": "Redundant Connection",
      "slug": "redundant-connection",
      "url": "https://leetcode.com/problems/redundant-connection/",
      "shortExplanation": "Use DSU to find the first edge forming a cycle in a graph.",
      "whyMatchesTopic": "Matches Day 66 DSU cycle detection requirement.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1489",
      "title": "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree",
      "slug": "find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree",
      "url": "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/",
      "shortExplanation": "Run Kruskal’s MST algorithm with DSU to classify critical and optional MST edges.",
      "whyMatchesTopic": "Canonical verified Hard DSU + Kruskal MST problem.",
      "isVerified": true
    }
  ],
  "67": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "136",
      "title": "Single Number",
      "slug": "single-number",
      "url": "https://leetcode.com/problems/single-number/",
      "shortExplanation": "XOR every array element together using a ^ a = 0 to isolate the unique value.",
      "whyMatchesTopic": "Exact match to Day 67 single-number XOR exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "137",
      "title": "Single Number II",
      "slug": "single-number-ii",
      "url": "https://leetcode.com/problems/single-number-ii/",
      "shortExplanation": "Count bits per bit position modulo 3 using bit masks and shifts.",
      "whyMatchesTopic": "Exercises bitwise masking and bit-by-bit reconstruction.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1611",
      "title": "Minimum One Bit Operations to Make Integers Zero",
      "slug": "minimum-one-bit-operations-to-make-integers-zero",
      "url": "https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero/",
      "shortExplanation": "Use Gray-code bit manipulation invariants to reduce n to 0 in minimal bit operations.",
      "whyMatchesTopic": "Verified Hard bit-manipulation & parity reduction problem.",
      "isVerified": true
    }
  ],
  "68": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1480",
      "title": "Running Sum of 1d Array",
      "slug": "running-sum-of-1d-array",
      "url": "https://leetcode.com/problems/running-sum-of-1d-array/",
      "shortExplanation": "Traverse an integer array sequentially to compute cumulative sums.",
      "whyMatchesTopic": "Core array indexing and single-pass traversal matching Day 11.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "238",
      "title": "Product of Array Except Self",
      "slug": "product-of-array-except-self",
      "url": "https://leetcode.com/problems/product-of-array-except-self/",
      "shortExplanation": "Compute prefix and suffix products across an array without using division.",
      "whyMatchesTopic": "Strong 1D array traversal and boundary-index reasoning.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "42",
      "title": "Trapping Rain Water",
      "slug": "trapping-rain-water",
      "url": "https://leetcode.com/problems/trapping-rain-water/",
      "shortExplanation": "Determine water trapped at each array index using left/right maximum array bounds.",
      "whyMatchesTopic": "Classic array-bounds reasoning problem building on min/max traversal.",
      "isVerified": true
    }
  ],
  "69": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "733",
      "title": "Flood Fill",
      "slug": "flood-fill",
      "url": "https://leetcode.com/problems/flood-fill/",
      "shortExplanation": "Apply DFS or BFS over a 2D grid avoiding re-visiting already-colored cells.",
      "whyMatchesTopic": "Introductory grid traversal with visited-state control.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "200",
      "title": "Number of Islands",
      "slug": "number-of-islands",
      "url": "https://leetcode.com/problems/number-of-islands/",
      "shortExplanation": "Count connected components on a 2D grid using DFS/BFS traversal.",
      "whyMatchesTopic": "Exact match to Day 64 connected-components and grid traversal exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "127",
      "title": "Word Ladder",
      "slug": "word-ladder",
      "url": "https://leetcode.com/problems/word-ladder/",
      "shortExplanation": "Use level-order BFS with visited tracking to find shortest transformation distance.",
      "whyMatchesTopic": "Classic shortest-path unweighted BFS challenge.",
      "isVerified": true
    }
  ],
  "70": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "136",
      "title": "Single Number",
      "slug": "single-number",
      "url": "https://leetcode.com/problems/single-number/",
      "shortExplanation": "XOR every array element together using a ^ a = 0 to isolate the unique value.",
      "whyMatchesTopic": "Exact match to Day 67 single-number XOR exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "137",
      "title": "Single Number II",
      "slug": "single-number-ii",
      "url": "https://leetcode.com/problems/single-number-ii/",
      "shortExplanation": "Count bits per bit position modulo 3 using bit masks and shifts.",
      "whyMatchesTopic": "Exercises bitwise masking and bit-by-bit reconstruction.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1611",
      "title": "Minimum One Bit Operations to Make Integers Zero",
      "slug": "minimum-one-bit-operations-to-make-integers-zero",
      "url": "https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero/",
      "shortExplanation": "Use Gray-code bit manipulation invariants to reduce n to 0 in minimal bit operations.",
      "whyMatchesTopic": "Verified Hard bit-manipulation & parity reduction problem.",
      "isVerified": true
    }
  ],
  "71": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "104",
      "title": "Maximum Depth of Binary Tree",
      "slug": "maximum-depth-of-binary-tree",
      "url": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      "shortExplanation": "Compute tree height recursively or via queue-based level-order BFS.",
      "whyMatchesTopic": "Direct match to Day 51 depth/height and BFS level counting.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "102",
      "title": "Binary Tree Level Order Traversal",
      "slug": "binary-tree-level-order-traversal",
      "url": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      "shortExplanation": "Use a FIFO queue tracking level sizes to collect nodes layer by layer.",
      "whyMatchesTopic": "Exact match to Day 51 level-order BFS using queue.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "297",
      "title": "Serialize and Deserialize Binary Tree",
      "slug": "serialize-and-deserialize-binary-tree",
      "url": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
      "shortExplanation": "Encode and reconstruct a binary tree via BFS or preorder traversal strings.",
      "whyMatchesTopic": "Demonstrates lossless tree traversal serialization.",
      "isVerified": true
    }
  ],
  "72": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "70",
      "title": "Climbing Stairs",
      "slug": "climbing-stairs",
      "url": "https://leetcode.com/problems/climbing-stairs/",
      "shortExplanation": "Write recurrence dp[i] = dp[i-1] + dp[i-2] with base states.",
      "whyMatchesTopic": "Exact match to Day 59 climbing stairs task.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "198",
      "title": "House Robber",
      "slug": "house-robber",
      "url": "https://leetcode.com/problems/house-robber/",
      "shortExplanation": "Write recurrence dp[i] = max(dp[i-1], nums[i] + dp[i-2]) before coding.",
      "whyMatchesTopic": "Exact match to Day 59 house robber recurrence exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1235",
      "title": "Maximum Profit in Job Scheduling",
      "slug": "maximum-profit-in-job-scheduling",
      "url": "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
      "shortExplanation": "Sort intervals by end time and combine 1D DP transitions with binary search.",
      "whyMatchesTopic": "Scales 1D take-or-skip DP to weighted interval transitions.",
      "isVerified": true
    }
  ],
  "73": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "997",
      "title": "Find the Town Judge",
      "slug": "find-the-town-judge",
      "url": "https://leetcode.com/problems/find-the-town-judge/",
      "shortExplanation": "Compute vertex in-degree and out-degree counts over directed edges.",
      "whyMatchesTopic": "Directly builds in-degree intuition used in Kahn’s topological sort.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "210",
      "title": "Course Schedule II",
      "slug": "course-schedule-ii",
      "url": "https://leetcode.com/problems/course-schedule-ii/",
      "shortExplanation": "Generate a topological ordering of a directed graph and detect cycles.",
      "whyMatchesTopic": "Exact match to Day 65 topological sort objective.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "2050",
      "title": "Parallel Courses III",
      "slug": "parallel-courses-iii",
      "url": "https://leetcode.com/problems/parallel-courses-iii/",
      "shortExplanation": "Combine Kahn’s topological ordering over a DAG with critical-path longest completion times.",
      "whyMatchesTopic": "Verified non-premium Hard topological DAG DP problem.",
      "isVerified": true
    }
  ],
  "74": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1",
      "title": "Two Sum",
      "slug": "two-sum",
      "url": "https://leetcode.com/problems/two-sum/",
      "shortExplanation": "Store seen complements in an unordered_map for O(n) single-pass pair lookup.",
      "whyMatchesTopic": "Directly matches Day 39 Two Sum hashing exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "560",
      "title": "Subarray Sum Equals K",
      "slug": "subarray-sum-equals-k",
      "url": "https://leetcode.com/problems/subarray-sum-equals-k/",
      "shortExplanation": "Combine prefix sums with a hash map of cumulative sum frequencies.",
      "whyMatchesTopic": "Bridges hashing frequency lookups into linear subarray counting.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "76",
      "title": "Minimum Window Substring",
      "slug": "minimum-window-substring",
      "url": "https://leetcode.com/problems/minimum-window-substring/",
      "shortExplanation": "Match target character frequency hash counts dynamically across a window.",
      "whyMatchesTopic": "High-precision hash-table frequency matching under strict O(n) bounds.",
      "isVerified": true
    }
  ],
  "75": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1603",
      "title": "Design Parking System",
      "slug": "design-parking-system",
      "url": "https://leetcode.com/problems/design-parking-system/",
      "shortExplanation": "Design a class with constructor state and member method validation.",
      "whyMatchesTopic": "Directly models C++ class constructors, private fields, and member methods.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "355",
      "title": "Design Twitter",
      "slug": "design-twitter",
      "url": "https://leetcode.com/problems/design-twitter/",
      "shortExplanation": "Encapsulate user posts, followee sets, and timeline retrieval cleanly inside a C++ class.",
      "whyMatchesTopic": "Object-oriented data modeling with clean private invariants and public API methods.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "460",
      "title": "LFU Cache",
      "slug": "lfu-cache",
      "url": "https://leetcode.com/problems/lfu-cache/",
      "shortExplanation": "Architect a multi-structure C++ cache class with strict O(1) invariants and private helpers.",
      "whyMatchesTopic": "Full C++ class encapsulation uniting custom structs and invariant maintenance.",
      "isVerified": true
    }
  ],
  "76": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1863",
      "title": "Sum of All Subset XOR Totals",
      "slug": "sum-of-all-subset-xor-totals",
      "url": "https://leetcode.com/problems/sum-of-all-subset-xor-totals/",
      "shortExplanation": "Explore include/exclude choices cleanly across array elements.",
      "whyMatchesTopic": "Introductory subset-exploration recursion.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "78",
      "title": "Subsets",
      "slug": "subsets",
      "url": "https://leetcode.com/problems/subsets/",
      "shortExplanation": "Generate all unique subsets using choose-explore-unchoose backtracking.",
      "whyMatchesTopic": "Exact match to Day 57 subsets generation exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "51",
      "title": "N-Queens",
      "slug": "n-queens",
      "url": "https://leetcode.com/problems/n-queens/",
      "shortExplanation": "Place queens row-by-row with column and diagonal conflict pruning.",
      "whyMatchesTopic": "Classic backtracking + constraint pruning challenge.",
      "isVerified": true
    }
  ],
  "77": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "119",
      "title": "Pascal's Triangle II",
      "slug": "pascals-triangle-ii",
      "url": "https://leetcode.com/problems/pascals-triangle-ii/",
      "shortExplanation": "Compute 2D row-transition states and observe how current row depends on previous row.",
      "whyMatchesTopic": "Builds intuition for 2D grid state dependencies.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "62",
      "title": "Unique Paths",
      "slug": "unique-paths",
      "url": "https://leetcode.com/problems/unique-paths/",
      "shortExplanation": "Fill an m×n 2D grid DP table summing top and left transitions.",
      "whyMatchesTopic": "Exact match to Day 60 unique paths grid DP exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "115",
      "title": "Distinct Subsequences",
      "slug": "distinct-subsequences",
      "url": "https://leetcode.com/problems/distinct-subsequences/",
      "shortExplanation": "Fill a 2D DP table counting subsequence matches across s[0..i] and t[0..j].",
      "whyMatchesTopic": "Canonical verified Hard 2D string DP transition table.",
      "isVerified": true
    }
  ],
  "78": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "217",
      "title": "Contains Duplicate",
      "slug": "contains-duplicate",
      "url": "https://leetcode.com/problems/contains-duplicate/",
      "shortExplanation": "Detect duplicate values in O(n) average time using std::unordered_set.",
      "whyMatchesTopic": "Directly practices set uniqueness and duplicate checking from Day 30.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "49",
      "title": "Group Anagrams",
      "slug": "group-anagrams",
      "url": "https://leetcode.com/problems/group-anagrams/",
      "shortExplanation": "Group words by canonical frequency key using std::unordered_map.",
      "whyMatchesTopic": "Classic C++ map key-value grouping exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "30",
      "title": "Substring with Concatenation of All Words",
      "slug": "substring-with-concatenation-of-all-words",
      "url": "https://leetcode.com/problems/substring-with-concatenation-of-all-words/",
      "shortExplanation": "Use std::unordered_map word-frequency comparisons across sliding word offsets.",
      "whyMatchesTopic": "Tests map frequency counting under strict performance constraints.",
      "isVerified": true
    }
  ],
  "79": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "35",
      "title": "Search Insert Position",
      "slug": "search-insert-position",
      "url": "https://leetcode.com/problems/search-insert-position/",
      "shortExplanation": "Implement lower_bound manually to return the first index >= target.",
      "whyMatchesTopic": "Directly exercises std::lower_bound invariant from Day 36.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "34",
      "title": "Find First and Last Position of Element in Sorted Array",
      "slug": "find-first-and-last-position-of-element-in-sorted-array",
      "url": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
      "shortExplanation": "Combine lower_bound and upper_bound binary searches to locate first and last occurrence.",
      "whyMatchesTopic": "Exact match to Day 36 first/last occurrence pattern.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "410",
      "title": "Split Array Largest Sum",
      "slug": "split-array-largest-sum",
      "url": "https://leetcode.com/problems/split-array-largest-sum/",
      "shortExplanation": "Apply binary search on the answer space using a monotonic greedy feasibility helper.",
      "whyMatchesTopic": "Applies upper/lower bound binary search to optimization decision problems.",
      "isVerified": true
    }
  ],
  "80": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "26",
      "title": "Remove Duplicates from Sorted Array",
      "slug": "remove-duplicates-from-sorted-array",
      "url": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      "shortExplanation": "Compact unique values in-place using slow and fast two pointers.",
      "whyMatchesTopic": "Direct match to Day 40 in-place duplicate removal exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "3",
      "title": "Longest Substring Without Repeating Characters",
      "slug": "longest-substring-without-repeating-characters",
      "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      "shortExplanation": "Expand and shrink a variable sliding window maintaining unique characters.",
      "whyMatchesTopic": "Core variable-size sliding window pattern from Day 40.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "239",
      "title": "Sliding Window Maximum",
      "slug": "sliding-window-maximum",
      "url": "https://leetcode.com/problems/sliding-window-maximum/",
      "shortExplanation": "Track the maximum element across every fixed-size window of length k in O(n).",
      "whyMatchesTopic": "Directly advances Day 40 fixed-window max concepts.",
      "isVerified": true
    }
  ],
  "81": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "206",
      "title": "Reverse Linked List",
      "slug": "reverse-linked-list",
      "url": "https://leetcode.com/problems/reverse-linked-list/",
      "shortExplanation": "Iteratively reverse next pointers using prev, curr, and next variables.",
      "whyMatchesTopic": "Exact match to Day 45 iterative linked-list reversal.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "142",
      "title": "Linked List Cycle II",
      "slug": "linked-list-cycle-ii",
      "url": "https://leetcode.com/problems/linked-list-cycle-ii/",
      "shortExplanation": "Use Floyd’s slow and fast pointers to detect a cycle and pinpoint its entry node.",
      "whyMatchesTopic": "Directly builds on Day 45 slow/fast cycle detection.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "23",
      "title": "Merge k Sorted Lists",
      "slug": "merge-k-sorted-lists",
      "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
      "shortExplanation": "Merge k sorted linked lists systematically using divide-and-conquer or min-heap.",
      "whyMatchesTopic": "Extends Day 45 merge-sorted-lists pattern to k chains.",
      "isVerified": true
    }
  ],
  "82": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "700",
      "title": "Search in a Binary Search Tree",
      "slug": "search-in-a-binary-search-tree",
      "url": "https://leetcode.com/problems/search-in-a-binary-search-tree/",
      "shortExplanation": "Navigate left or right branches using the BST ordering property.",
      "whyMatchesTopic": "Direct match to Day 52 BST search implementation.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "98",
      "title": "Validate Binary Search Tree",
      "slug": "validate-binary-search-tree",
      "url": "https://leetcode.com/problems/validate-binary-search-tree/",
      "shortExplanation": "Verify strict min/max value bounds (or sorted inorder property) across every node.",
      "whyMatchesTopic": "Exact match to Day 52 BST validation task.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1373",
      "title": "Maximum Sum BST in Binary Tree",
      "slug": "maximum-sum-bst-in-binary-tree",
      "url": "https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/",
      "shortExplanation": "Verify subtree BST validity and accumulate valid BST sums bottom-up.",
      "whyMatchesTopic": "Deepens BST invariant checks across arbitrary subtrees.",
      "isVerified": true
    }
  ],
  "83": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1046",
      "title": "Last Stone Weight",
      "slug": "last-stone-weight",
      "url": "https://leetcode.com/problems/last-stone-weight/",
      "shortExplanation": "Repeatedly extract the two largest stones from a max-heap and push their difference.",
      "whyMatchesTopic": "Clear max-heap simulation reinforcing push/pop/top invariants.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "347",
      "title": "Top K Frequent Elements",
      "slug": "top-k-frequent-elements",
      "url": "https://leetcode.com/problems/top-k-frequent-elements/",
      "shortExplanation": "Maintain a min-heap priority_queue of size k over frequency pairs.",
      "whyMatchesTopic": "Classic top-K priority_queue pattern.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "295",
      "title": "Find Median from Data Stream",
      "slug": "find-median-from-data-stream",
      "url": "https://leetcode.com/problems/find-median-from-data-stream/",
      "shortExplanation": "Balance lower-half max-heap and upper-half min-heap for dynamic medians.",
      "whyMatchesTopic": "Classic dual-heap architecture problem.",
      "isVerified": true
    }
  ],
  "84": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "303",
      "title": "Range Sum Query - Immutable",
      "slug": "range-sum-query-immutable",
      "url": "https://leetcode.com/problems/range-sum-query-immutable/",
      "shortExplanation": "Precompute a prefix sum array so range queries answer in O(1) time.",
      "whyMatchesTopic": "Exact match to Day 43 prefix-array range-sum objective.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "560",
      "title": "Subarray Sum Equals K",
      "slug": "subarray-sum-equals-k",
      "url": "https://leetcode.com/problems/subarray-sum-equals-k/",
      "shortExplanation": "Count subarrays summing to k by subtracting prior prefix sums.",
      "whyMatchesTopic": "Classic prefix-sum subarray query pattern from Day 43.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "862",
      "title": "Shortest Subarray with Sum at Least K",
      "slug": "shortest-subarray-with-sum-at-least-k",
      "url": "https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/",
      "shortExplanation": "Find shortest non-empty subarray >= k using prefix sums with a monotonic deque (handles negatives).",
      "whyMatchesTopic": "Deep prefix-sum + monotonic constraint extension.",
      "isVerified": true
    }
  ],
  "85": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1863",
      "title": "Sum of All Subset XOR Totals",
      "slug": "sum-of-all-subset-xor-totals",
      "url": "https://leetcode.com/problems/sum-of-all-subset-xor-totals/",
      "shortExplanation": "Explore include/exclude choices cleanly across array elements.",
      "whyMatchesTopic": "Introductory subset-exploration recursion.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "78",
      "title": "Subsets",
      "slug": "subsets",
      "url": "https://leetcode.com/problems/subsets/",
      "shortExplanation": "Generate all unique subsets using choose-explore-unchoose backtracking.",
      "whyMatchesTopic": "Exact match to Day 57 subsets generation exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "51",
      "title": "N-Queens",
      "slug": "n-queens",
      "url": "https://leetcode.com/problems/n-queens/",
      "shortExplanation": "Place queens row-by-row with column and diagonal conflict pruning.",
      "whyMatchesTopic": "Classic backtracking + constraint pruning challenge.",
      "isVerified": true
    }
  ],
  "86": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "70",
      "title": "Climbing Stairs",
      "slug": "climbing-stairs",
      "url": "https://leetcode.com/problems/climbing-stairs/",
      "shortExplanation": "Write recurrence dp[i] = dp[i-1] + dp[i-2] with base states.",
      "whyMatchesTopic": "Exact match to Day 59 climbing stairs task.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "198",
      "title": "House Robber",
      "slug": "house-robber",
      "url": "https://leetcode.com/problems/house-robber/",
      "shortExplanation": "Write recurrence dp[i] = max(dp[i-1], nums[i] + dp[i-2]) before coding.",
      "whyMatchesTopic": "Exact match to Day 59 house robber recurrence exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1235",
      "title": "Maximum Profit in Job Scheduling",
      "slug": "maximum-profit-in-job-scheduling",
      "url": "https://leetcode.com/problems/maximum-profit-in-job-scheduling/",
      "shortExplanation": "Sort intervals by end time and combine 1D DP transitions with binary search.",
      "whyMatchesTopic": "Scales 1D take-or-skip DP to weighted interval transitions.",
      "isVerified": true
    }
  ],
  "87": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "733",
      "title": "Flood Fill",
      "slug": "flood-fill",
      "url": "https://leetcode.com/problems/flood-fill/",
      "shortExplanation": "Apply DFS or BFS over a 2D grid avoiding re-visiting already-colored cells.",
      "whyMatchesTopic": "Introductory grid traversal with visited-state control.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "200",
      "title": "Number of Islands",
      "slug": "number-of-islands",
      "url": "https://leetcode.com/problems/number-of-islands/",
      "shortExplanation": "Count connected components on a 2D grid using DFS/BFS traversal.",
      "whyMatchesTopic": "Exact match to Day 64 connected-components and grid traversal exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "127",
      "title": "Word Ladder",
      "slug": "word-ladder",
      "url": "https://leetcode.com/problems/word-ladder/",
      "shortExplanation": "Use level-order BFS with visited tracking to find shortest transformation distance.",
      "whyMatchesTopic": "Classic shortest-path unweighted BFS challenge.",
      "isVerified": true
    }
  ],
  "88": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "121",
      "title": "Best Time to Buy and Sell Stock",
      "slug": "best-time-to-buy-and-sell-stock",
      "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      "shortExplanation": "Optimize an O(n^2) nested-loop solution down to a single O(n) pass with O(1) space.",
      "whyMatchesTopic": "Concrete demonstration of why reducing O(n^2) to O(n) matters on large inputs.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "53",
      "title": "Maximum Subarray",
      "slug": "maximum-subarray",
      "url": "https://leetcode.com/problems/maximum-subarray/",
      "shortExplanation": "Improve O(n^2) subarray enumeration to O(n) time and O(1) auxiliary space via Kadane’s algorithm.",
      "whyMatchesTopic": "Directly highlights sequential optimization vs quadratic complexity.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "4",
      "title": "Median of Two Sorted Arrays",
      "slug": "median-of-two-sorted-arrays",
      "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      "shortExplanation": "Achieve strict O(log(min(m,n))) time complexity instead of O(m+n) linear merge.",
      "whyMatchesTopic": "Deep time-complexity constraint challenge comparing O(m+n) vs O(log n).",
      "isVerified": true
    }
  ],
  "89": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "9",
      "title": "Palindrome Number",
      "slug": "palindrome-number",
      "url": "https://leetcode.com/problems/palindrome-number/",
      "shortExplanation": "Check whether an integer reads the same forward and backward using an iterative digit-reversal loop.",
      "whyMatchesTopic": "Reinforces while-loop termination conditions and digit accumulators.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "50",
      "title": "Pow(x, n)",
      "slug": "powx-n",
      "url": "https://leetcode.com/problems/powx-n/",
      "shortExplanation": "Compute x raised to the power n iteratively using binary exponentiation loops while handling negative exponents.",
      "whyMatchesTopic": "Practices loop invariants, accumulator updates, and signed exponent edge cases.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "41",
      "title": "First Missing Positive",
      "slug": "first-missing-positive",
      "url": "https://leetcode.com/problems/first-missing-positive/",
      "shortExplanation": "Find the smallest missing positive integer using in-place index placement loops in O(n) time.",
      "whyMatchesTopic": "Challenges loop termination guarantees and index-swapping invariants.",
      "isVerified": true
    }
  ],
  "90": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "455",
      "title": "Assign Cookies",
      "slug": "assign-cookies",
      "url": "https://leetcode.com/problems/assign-cookies/",
      "shortExplanation": "Sort children greed factors and cookie sizes and match greedily from smallest.",
      "whyMatchesTopic": "Clean introductory greedy matching choice.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "435",
      "title": "Non-overlapping Intervals",
      "slug": "non-overlapping-intervals",
      "url": "https://leetcode.com/problems/non-overlapping-intervals/",
      "shortExplanation": "Sort intervals by finish time and greedily keep earliest-ending non-overlapping intervals.",
      "whyMatchesTopic": "Direct match to Day 54 interval selection after sorting by finish time.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "135",
      "title": "Candy",
      "slug": "candy",
      "url": "https://leetcode.com/problems/candy/",
      "shortExplanation": "Satisfy left-neighbor and right-neighbor rating constraints in two greedy linear passes.",
      "whyMatchesTopic": "Tests proving local greedy invariants from left and right directions.",
      "isVerified": true
    }
  ],
  "91": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1971",
      "title": "Find if Path Exists in Graph",
      "slug": "find-if-path-exists-in-graph",
      "url": "https://leetcode.com/problems/find-if-path-exists-in-graph/",
      "shortExplanation": "Union connected edges via Disjoint Set Union with path compression.",
      "whyMatchesTopic": "Direct DSU find/union exercise from Day 66.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "684",
      "title": "Redundant Connection",
      "slug": "redundant-connection",
      "url": "https://leetcode.com/problems/redundant-connection/",
      "shortExplanation": "Use DSU to find the first edge forming a cycle in a graph.",
      "whyMatchesTopic": "Matches Day 66 DSU cycle detection requirement.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1489",
      "title": "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree",
      "slug": "find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree",
      "url": "https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/",
      "shortExplanation": "Run Kruskal’s MST algorithm with DSU to classify critical and optional MST edges.",
      "whyMatchesTopic": "Canonical verified Hard DSU + Kruskal MST problem.",
      "isVerified": true
    }
  ],
  "92": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "125",
      "title": "Valid Palindrome",
      "slug": "valid-palindrome",
      "url": "https://leetcode.com/problems/valid-palindrome/",
      "shortExplanation": "Check if alphanumeric characters of a std::string form a palindrome case-insensitively.",
      "whyMatchesTopic": "Direct std::string indexing and character inspection matching Day 12.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "151",
      "title": "Reverse Words in a String",
      "slug": "reverse-words-in-a-string",
      "url": "https://leetcode.com/problems/reverse-words-in-a-string/",
      "shortExplanation": "Extract and reverse space-delimited words from a string while trimming extra spaces.",
      "whyMatchesTopic": "Practices std::string parsing, substr/word boundaries, and in-place reversal.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "76",
      "title": "Minimum Window Substring",
      "slug": "minimum-window-substring",
      "url": "https://leetcode.com/problems/minimum-window-substring/",
      "shortExplanation": "Find the smallest substring containing all target characters using character frequency arrays.",
      "whyMatchesTopic": "Advanced string frequency tracking and substring window shrinking.",
      "isVerified": true
    }
  ],
  "93": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "703",
      "title": "Kth Largest Element in a Stream",
      "slug": "kth-largest-element-in-a-stream",
      "url": "https://leetcode.com/problems/kth-largest-element-in-a-stream/",
      "shortExplanation": "Maintain a min-heap std::priority_queue of size k to return the kth largest stream element.",
      "whyMatchesTopic": "Direct C++ min-heap priority_queue practice.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "215",
      "title": "Kth Largest Element in an Array",
      "slug": "kth-largest-element-in-an-array",
      "url": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      "shortExplanation": "Find the kth largest integer using a bounded min-heap priority_queue.",
      "whyMatchesTopic": "Directly matches Day 31 kth-largest priority_queue task.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "295",
      "title": "Find Median from Data Stream",
      "slug": "find-median-from-data-stream",
      "url": "https://leetcode.com/problems/find-median-from-data-stream/",
      "shortExplanation": "Balance a max-heap and a min-heap priority_queue to query running medians in O(log n).",
      "whyMatchesTopic": "Applies both max-heap and min-heap std::priority_queue together.",
      "isVerified": true
    }
  ],
  "94": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "268",
      "title": "Missing Number",
      "slug": "missing-number",
      "url": "https://leetcode.com/problems/missing-number/",
      "shortExplanation": "Locate the missing value in [0..n] cleanly using sorting or XOR/sum invariants.",
      "whyMatchesTopic": "Introduces ordering and duplicate/missing boundary reasoning.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "148",
      "title": "Sort List",
      "slug": "sort-list",
      "url": "https://leetcode.com/problems/sort-list/",
      "shortExplanation": "Implement top-down or bottom-up merge sort in O(n log n) time.",
      "whyMatchesTopic": "Directly implements divide-and-conquer merge sort on chains.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "493",
      "title": "Reverse Pairs",
      "slug": "reverse-pairs",
      "url": "https://leetcode.com/problems/reverse-pairs/",
      "shortExplanation": "Modify merge sort’s merge step to count important reverse pairs across sorted halves.",
      "whyMatchesTopic": "Classic merge-sort augmentation testing divide-and-conquer mastery.",
      "isVerified": true
    }
  ],
  "95": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "933",
      "title": "Number of Recent Calls",
      "slug": "number-of-recent-calls",
      "url": "https://leetcode.com/problems/number-of-recent-calls/",
      "shortExplanation": "Maintain a FIFO queue pruning timestamps older than the 3000ms window.",
      "whyMatchesTopic": "Clean FIFO queue sliding-window pruning exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "622",
      "title": "Design Circular Queue",
      "slug": "design-circular-queue",
      "url": "https://leetcode.com/problems/design-circular-queue/",
      "shortExplanation": "Implement a fixed-capacity ring buffer with head, tail, and count invariants.",
      "whyMatchesTopic": "Direct match to Day 47 circular queue objective.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "239",
      "title": "Sliding Window Maximum",
      "slug": "sliding-window-maximum",
      "url": "https://leetcode.com/problems/sliding-window-maximum/",
      "shortExplanation": "Use a double-ended queue (deque) to maintain candidate maxima in O(1) amortized time.",
      "whyMatchesTopic": "Direct match to Day 47 sliding-window maximum deque exercise.",
      "isVerified": true
    }
  ],
  "96": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "94",
      "title": "Binary Tree Inorder Traversal",
      "slug": "binary-tree-inorder-traversal",
      "url": "https://leetcode.com/problems/binary-tree-inorder-traversal/",
      "shortExplanation": "Traverse Left → Root → Right recursively (and iteratively) across TreeNode pointers.",
      "whyMatchesTopic": "Direct match to Day 50 recursive tree traversal exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "105",
      "title": "Construct Binary Tree from Preorder and Inorder Traversal",
      "slug": "construct-binary-tree-from-preorder-and-inorder-traversal",
      "url": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
      "shortExplanation": "Reconstruct exact TreeNode structure using preorder root and inorder left/right splits.",
      "whyMatchesTopic": "Tests deep understanding of preorder and inorder invariants.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "124",
      "title": "Binary Tree Maximum Path Sum",
      "slug": "binary-tree-maximum-path-sum",
      "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
      "shortExplanation": "Aggregate left and right subtree gains cleanly during postorder recursion.",
      "whyMatchesTopic": "Applies postorder recursive return values vs global path tracking.",
      "isVerified": true
    }
  ],
  "97": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "1046",
      "title": "Last Stone Weight",
      "slug": "last-stone-weight",
      "url": "https://leetcode.com/problems/last-stone-weight/",
      "shortExplanation": "Repeatedly extract the two largest stones from a max-heap and push their difference.",
      "whyMatchesTopic": "Clear max-heap simulation reinforcing push/pop/top invariants.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "347",
      "title": "Top K Frequent Elements",
      "slug": "top-k-frequent-elements",
      "url": "https://leetcode.com/problems/top-k-frequent-elements/",
      "shortExplanation": "Maintain a min-heap priority_queue of size k over frequency pairs.",
      "whyMatchesTopic": "Classic top-K priority_queue pattern.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "295",
      "title": "Find Median from Data Stream",
      "slug": "find-median-from-data-stream",
      "url": "https://leetcode.com/problems/find-median-from-data-stream/",
      "shortExplanation": "Balance lower-half max-heap and upper-half min-heap for dynamic medians.",
      "whyMatchesTopic": "Classic dual-heap architecture problem.",
      "isVerified": true
    }
  ],
  "98": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "136",
      "title": "Single Number",
      "slug": "single-number",
      "url": "https://leetcode.com/problems/single-number/",
      "shortExplanation": "XOR every array element together using a ^ a = 0 to isolate the unique value.",
      "whyMatchesTopic": "Exact match to Day 67 single-number XOR exercise.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "137",
      "title": "Single Number II",
      "slug": "single-number-ii",
      "url": "https://leetcode.com/problems/single-number-ii/",
      "shortExplanation": "Count bits per bit position modulo 3 using bit masks and shifts.",
      "whyMatchesTopic": "Exercises bitwise masking and bit-by-bit reconstruction.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "1611",
      "title": "Minimum One Bit Operations to Make Integers Zero",
      "slug": "minimum-one-bit-operations-to-make-integers-zero",
      "url": "https://leetcode.com/problems/minimum-one-bit-operations-to-make-integers-zero/",
      "shortExplanation": "Use Gray-code bit manipulation invariants to reduce n to 0 in minimal bit operations.",
      "whyMatchesTopic": "Verified Hard bit-manipulation & parity reduction problem.",
      "isVerified": true
    }
  ],
  "99": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "119",
      "title": "Pascal's Triangle II",
      "slug": "pascals-triangle-ii",
      "url": "https://leetcode.com/problems/pascals-triangle-ii/",
      "shortExplanation": "Compute 2D row-transition states and observe how current row depends on previous row.",
      "whyMatchesTopic": "Builds intuition for 2D grid state dependencies.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "62",
      "title": "Unique Paths",
      "slug": "unique-paths",
      "url": "https://leetcode.com/problems/unique-paths/",
      "shortExplanation": "Fill an m×n 2D grid DP table summing top and left transitions.",
      "whyMatchesTopic": "Exact match to Day 60 unique paths grid DP exercise.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "115",
      "title": "Distinct Subsequences",
      "slug": "distinct-subsequences",
      "url": "https://leetcode.com/problems/distinct-subsequences/",
      "shortExplanation": "Fill a 2D DP table counting subsequence matches across s[0..i] and t[0..j].",
      "whyMatchesTopic": "Canonical verified Hard 2D string DP transition table.",
      "isVerified": true
    }
  ],
  "100": [
    {
      "slot": 1,
      "difficulty": "Easy",
      "available": true,
      "problemNumber": "704",
      "title": "Binary Search",
      "slug": "binary-search",
      "url": "https://leetcode.com/problems/binary-search/",
      "shortExplanation": "Implement classic lo <= hi binary search on a sorted array in O(log n) time.",
      "whyMatchesTopic": "Exact binary search invariant and precondition implementation matching Day 33.",
      "isVerified": true
    },
    {
      "slot": 2,
      "difficulty": "Medium",
      "available": true,
      "problemNumber": "33",
      "title": "Search in Rotated Sorted Array",
      "slug": "search-in-rotated-sorted-array",
      "url": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      "shortExplanation": "Adapt binary search invariants to determine which half remains sorted.",
      "whyMatchesTopic": "Deepens binary search loop-invariant reasoning.",
      "isVerified": true
    },
    {
      "slot": 3,
      "difficulty": "Hard",
      "available": true,
      "problemNumber": "4",
      "title": "Median of Two Sorted Arrays",
      "slug": "median-of-two-sorted-arrays",
      "url": "https://leetcode.com/problems/median-of-two-sorted-arrays/",
      "shortExplanation": "Partition two sorted arrays via binary search over cut indices in logarithmic time.",
      "whyMatchesTopic": "Ultimate binary-search partition invariant problem.",
      "isVerified": true
    }
  ]
};

export const OFFICIAL_DOCS_BY_TRACK_DAY: Record<string, SharedDailyReferenceLink[]> = {
  "main:1": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:2": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:3": [
    {
      "id": "py_docs",
      "resourceType": "official_documentation",
      "title": "Python 3 Official Documentation — Typing & Exceptions",
      "url": "https://docs.python.org/3/library/typing.html",
      "description": "Official Python typing and runtime reference for dataclasses, annotations, and error hierarchies.",
      "sourceLabel": "Python Software Foundation",
      "isVerifiedUrl": true
    },
    {
      "id": "py_async",
      "resourceType": "official_documentation",
      "title": "Python asyncio — Asynchronous I/O Documentation",
      "url": "https://docs.python.org/3/library/asyncio.html",
      "description": "Official reference for async/await event loops and non-blocking I/O.",
      "sourceLabel": "Python Software Foundation",
      "isVerifiedUrl": true
    }
  ],
  "main:4": [
    {
      "id": "py_docs",
      "resourceType": "official_documentation",
      "title": "Python 3 Official Documentation — Typing & Exceptions",
      "url": "https://docs.python.org/3/library/typing.html",
      "description": "Official Python typing and runtime reference for dataclasses, annotations, and error hierarchies.",
      "sourceLabel": "Python Software Foundation",
      "isVerifiedUrl": true
    },
    {
      "id": "py_async",
      "resourceType": "official_documentation",
      "title": "Python asyncio — Asynchronous I/O Documentation",
      "url": "https://docs.python.org/3/library/asyncio.html",
      "description": "Official reference for async/await event loops and non-blocking I/O.",
      "sourceLabel": "Python Software Foundation",
      "isVerifiedUrl": true
    }
  ],
  "main:5": [
    {
      "id": "py_docs",
      "resourceType": "official_documentation",
      "title": "Python 3 Official Documentation — Typing & Exceptions",
      "url": "https://docs.python.org/3/library/typing.html",
      "description": "Official Python typing and runtime reference for dataclasses, annotations, and error hierarchies.",
      "sourceLabel": "Python Software Foundation",
      "isVerifiedUrl": true
    },
    {
      "id": "py_async",
      "resourceType": "official_documentation",
      "title": "Python asyncio — Asynchronous I/O Documentation",
      "url": "https://docs.python.org/3/library/asyncio.html",
      "description": "Official reference for async/await event loops and non-blocking I/O.",
      "sourceLabel": "Python Software Foundation",
      "isVerifiedUrl": true
    }
  ],
  "main:6": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:7": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:8": [
    {
      "id": "git_docs",
      "resourceType": "official_documentation",
      "title": "Official Git Reference Manual",
      "url": "https://git-scm.com/docs",
      "description": "Authoritative Git CLI reference for branching, merging, and clean commits.",
      "sourceLabel": "Git SCM",
      "isVerifiedUrl": true
    },
    {
      "id": "gh_actions",
      "resourceType": "official_documentation",
      "title": "GitHub Actions Documentation",
      "url": "https://docs.github.com/en/actions",
      "description": "Official CI/CD workflow reference for automated testing and deployment pipelines.",
      "sourceLabel": "GitHub Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:9": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:10": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:11": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:12": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:13": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:14": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:15": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:16": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:17": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:18": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:19": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:20": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:21": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:22": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:23": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:24": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:25": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:26": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:27": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:28": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:29": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:30": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:31": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:32": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:33": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:34": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:35": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:36": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:37": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:38": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:39": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:40": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:41": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:42": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:43": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:44": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:45": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:46": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:47": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:48": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:49": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:50": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:51": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:52": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:53": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:54": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:55": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:56": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:57": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:58": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:59": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:60": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:61": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:62": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:63": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:64": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:65": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:66": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:67": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:68": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:69": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:70": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:71": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:72": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:73": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:74": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:75": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:76": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:77": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:78": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:79": [
    {
      "id": "git_docs",
      "resourceType": "official_documentation",
      "title": "Official Git Reference Manual",
      "url": "https://git-scm.com/docs",
      "description": "Authoritative Git CLI reference for branching, merging, and clean commits.",
      "sourceLabel": "Git SCM",
      "isVerifiedUrl": true
    },
    {
      "id": "gh_actions",
      "resourceType": "official_documentation",
      "title": "GitHub Actions Documentation",
      "url": "https://docs.github.com/en/actions",
      "description": "Official CI/CD workflow reference for automated testing and deployment pipelines.",
      "sourceLabel": "GitHub Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:80": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:81": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:82": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:83": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:84": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:85": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:86": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:87": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:88": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:89": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:90": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:91": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:92": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:93": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:94": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:95": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:96": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:97": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:98": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:99": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:100": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:101": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:102": [
    {
      "id": "git_docs",
      "resourceType": "official_documentation",
      "title": "Official Git Reference Manual",
      "url": "https://git-scm.com/docs",
      "description": "Authoritative Git CLI reference for branching, merging, and clean commits.",
      "sourceLabel": "Git SCM",
      "isVerifiedUrl": true
    },
    {
      "id": "gh_actions",
      "resourceType": "official_documentation",
      "title": "GitHub Actions Documentation",
      "url": "https://docs.github.com/en/actions",
      "description": "Official CI/CD workflow reference for automated testing and deployment pipelines.",
      "sourceLabel": "GitHub Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:103": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:104": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:105": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:106": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:107": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:108": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:109": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:110": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:111": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:112": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:113": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:114": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:115": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:116": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:117": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:118": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:119": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:120": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:121": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:122": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:123": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:124": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:125": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:126": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:127": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:128": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:129": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:130": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:131": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:132": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:133": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:134": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:135": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:136": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:137": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:138": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:139": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:140": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:141": [
    {
      "id": "docker_docs",
      "resourceType": "official_documentation",
      "title": "Docker Official Documentation",
      "url": "https://docs.docker.com/get-started/",
      "description": "Official Docker guide for multi-stage builds, containerization, and Compose setups.",
      "sourceLabel": "Docker Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_deploy",
      "resourceType": "official_documentation",
      "title": "FastAPI Deployment Guide",
      "url": "https://fastapi.tiangolo.com/deployment/",
      "description": "Official FastAPI production deployment and container architecture guidance.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:142": [
    {
      "id": "docker_docs",
      "resourceType": "official_documentation",
      "title": "Docker Official Documentation",
      "url": "https://docs.docker.com/get-started/",
      "description": "Official Docker guide for multi-stage builds, containerization, and Compose setups.",
      "sourceLabel": "Docker Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_deploy",
      "resourceType": "official_documentation",
      "title": "FastAPI Deployment Guide",
      "url": "https://fastapi.tiangolo.com/deployment/",
      "description": "Official FastAPI production deployment and container architecture guidance.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:143": [
    {
      "id": "py_docs",
      "resourceType": "official_documentation",
      "title": "Python 3 Official Documentation — Typing & Exceptions",
      "url": "https://docs.python.org/3/library/typing.html",
      "description": "Official Python typing and runtime reference for dataclasses, annotations, and error hierarchies.",
      "sourceLabel": "Python Software Foundation",
      "isVerifiedUrl": true
    },
    {
      "id": "py_async",
      "resourceType": "official_documentation",
      "title": "Python asyncio — Asynchronous I/O Documentation",
      "url": "https://docs.python.org/3/library/asyncio.html",
      "description": "Official reference for async/await event loops and non-blocking I/O.",
      "sourceLabel": "Python Software Foundation",
      "isVerifiedUrl": true
    }
  ],
  "main:144": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:145": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:146": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:147": [
    {
      "id": "git_docs",
      "resourceType": "official_documentation",
      "title": "Official Git Reference Manual",
      "url": "https://git-scm.com/docs",
      "description": "Authoritative Git CLI reference for branching, merging, and clean commits.",
      "sourceLabel": "Git SCM",
      "isVerifiedUrl": true
    },
    {
      "id": "gh_actions",
      "resourceType": "official_documentation",
      "title": "GitHub Actions Documentation",
      "url": "https://docs.github.com/en/actions",
      "description": "Official CI/CD workflow reference for automated testing and deployment pipelines.",
      "sourceLabel": "GitHub Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:148": [
    {
      "id": "git_docs",
      "resourceType": "official_documentation",
      "title": "Official Git Reference Manual",
      "url": "https://git-scm.com/docs",
      "description": "Authoritative Git CLI reference for branching, merging, and clean commits.",
      "sourceLabel": "Git SCM",
      "isVerifiedUrl": true
    },
    {
      "id": "gh_actions",
      "resourceType": "official_documentation",
      "title": "GitHub Actions Documentation",
      "url": "https://docs.github.com/en/actions",
      "description": "Official CI/CD workflow reference for automated testing and deployment pipelines.",
      "sourceLabel": "GitHub Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:149": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:150": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:151": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:152": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:153": [
    {
      "id": "py_docs",
      "resourceType": "official_documentation",
      "title": "Python 3 Official Documentation — Typing & Exceptions",
      "url": "https://docs.python.org/3/library/typing.html",
      "description": "Official Python typing and runtime reference for dataclasses, annotations, and error hierarchies.",
      "sourceLabel": "Python Software Foundation",
      "isVerifiedUrl": true
    },
    {
      "id": "py_async",
      "resourceType": "official_documentation",
      "title": "Python asyncio — Asynchronous I/O Documentation",
      "url": "https://docs.python.org/3/library/asyncio.html",
      "description": "Official reference for async/await event loops and non-blocking I/O.",
      "sourceLabel": "Python Software Foundation",
      "isVerifiedUrl": true
    }
  ],
  "main:154": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:155": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:156": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:157": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:158": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:159": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:160": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:161": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:162": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:163": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:164": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:165": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:166": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:167": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:168": [
    {
      "id": "react_docs",
      "resourceType": "official_documentation",
      "title": "React Official Learn Documentation",
      "url": "https://react.dev/learn",
      "description": "Official React guide covering components, state boundaries, hooks, and UI architecture.",
      "sourceLabel": "React Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "ts_docs",
      "resourceType": "official_documentation",
      "title": "TypeScript Handbook",
      "url": "https://www.typescriptlang.org/docs/handbook/intro.html",
      "description": "Official TypeScript handbook for typed API contracts and component props.",
      "sourceLabel": "TypeScript Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:169": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:170": [
    {
      "id": "fastapi_docs",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Tutorial & Reference",
      "url": "https://fastapi.tiangolo.com/tutorial/",
      "description": "Official FastAPI documentation covering routes, Pydantic validation, status codes, and dependencies.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "pydantic_docs",
      "resourceType": "official_documentation",
      "title": "Pydantic Settings & Validation Docs",
      "url": "https://docs.pydantic.dev/latest/concepts/pydantic_settings/",
      "description": "Official Pydantic v2 BaseSettings configuration and schema validation documentation.",
      "sourceLabel": "Pydantic Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:171": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:172": [
    {
      "id": "pg_docs",
      "resourceType": "official_documentation",
      "title": "PostgreSQL Official Documentation",
      "url": "https://www.postgresql.org/docs/current/",
      "description": "Official PostgreSQL documentation for relational entities, indexing, and transactions.",
      "sourceLabel": "PostgreSQL Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_api_docs",
      "resourceType": "official_documentation",
      "title": "Google Gemini API Official Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official Gemini API guide covering text generation, structured JSON outputs, and embeddings.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:173": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:174": [
    {
      "id": "pytest_docs",
      "resourceType": "official_documentation",
      "title": "pytest Official Documentation",
      "url": "https://docs.pytest.org/en/stable/",
      "description": "Official pytest documentation for unit, integration, and fixture-driven API tests.",
      "sourceLabel": "pytest Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "fastapi_test",
      "resourceType": "official_documentation",
      "title": "FastAPI Testing Guide",
      "url": "https://fastapi.tiangolo.com/tutorial/testing/",
      "description": "Official TestClient documentation for verifying FastAPI endpoints.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    }
  ],
  "main:175": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:176": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:177": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:178": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:179": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "main:180": [
    {
      "id": "fastapi_main",
      "resourceType": "official_documentation",
      "title": "FastAPI Official Documentation",
      "url": "https://fastapi.tiangolo.com/",
      "description": "Core backend API framework reference for Production RAG services.",
      "sourceLabel": "FastAPI Docs",
      "isVerifiedUrl": true
    },
    {
      "id": "gemini_main",
      "resourceType": "official_documentation",
      "title": "Google AI Gemini API Documentation",
      "url": "https://ai.google.dev/gemini-api/docs",
      "description": "Official LLM & RAG architecture API documentation.",
      "sourceLabel": "Google AI for Developers",
      "isVerifiedUrl": true
    }
  ],
  "dsa:1": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:2": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:3": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:4": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:5": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:6": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:7": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:8": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:9": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:10": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:11": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:12": [
    {
      "id": "cpp_string",
      "resourceType": "official_documentation",
      "title": "cppreference — std::basic_string",
      "url": "https://en.cppreference.com/w/cpp/string/basic_string",
      "description": "Complete C++ std::string methods reference (substr, find, length, compare).",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:13": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:14": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:15": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:16": [
    {
      "id": "cpp_classes",
      "resourceType": "official_documentation",
      "title": "cppreference — Classes & Structs",
      "url": "https://en.cppreference.com/w/cpp/language/classes",
      "description": "Official reference covering C++ constructors, access specifiers, inheritance, and pointers.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:17": [
    {
      "id": "cpp_classes",
      "resourceType": "official_documentation",
      "title": "cppreference — Classes & Structs",
      "url": "https://en.cppreference.com/w/cpp/language/classes",
      "description": "Official reference covering C++ constructors, access specifiers, inheritance, and pointers.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:18": [
    {
      "id": "cpp_classes",
      "resourceType": "official_documentation",
      "title": "cppreference — Classes & Structs",
      "url": "https://en.cppreference.com/w/cpp/language/classes",
      "description": "Official reference covering C++ constructors, access specifiers, inheritance, and pointers.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:19": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:20": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:21": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:22": [
    {
      "id": "cpp_string",
      "resourceType": "official_documentation",
      "title": "cppreference — std::basic_string",
      "url": "https://en.cppreference.com/w/cpp/string/basic_string",
      "description": "Complete C++ std::string methods reference (substr, find, length, compare).",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:23": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:24": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:25": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:26": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:27": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:28": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:29": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:30": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:31": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:32": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:33": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:34": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:35": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:36": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:37": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:38": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:39": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:40": [
    {
      "id": "cpp_classes",
      "resourceType": "official_documentation",
      "title": "cppreference — Classes & Structs",
      "url": "https://en.cppreference.com/w/cpp/language/classes",
      "description": "Official reference covering C++ constructors, access specifiers, inheritance, and pointers.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:41": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:42": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:43": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:44": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:45": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:46": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:47": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:48": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:49": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:50": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:51": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:52": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:53": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:54": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:55": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:56": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:57": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:58": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:59": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:60": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:61": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:62": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:63": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:64": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:65": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:66": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:67": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:68": [
    {
      "id": "cpp_string",
      "resourceType": "official_documentation",
      "title": "cppreference — std::basic_string",
      "url": "https://en.cppreference.com/w/cpp/string/basic_string",
      "description": "Complete C++ std::string methods reference (substr, find, length, compare).",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:69": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:70": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:71": [
    {
      "id": "cpp_classes",
      "resourceType": "official_documentation",
      "title": "cppreference — Classes & Structs",
      "url": "https://en.cppreference.com/w/cpp/language/classes",
      "description": "Official reference covering C++ constructors, access specifiers, inheritance, and pointers.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:72": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:73": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:74": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:75": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:76": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:77": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:78": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:79": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:80": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:81": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:82": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:83": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:84": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:85": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:86": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:87": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:88": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:89": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:90": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:91": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:92": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:93": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:94": [
    {
      "id": "cpp_containers",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Containers Library",
      "url": "https://en.cppreference.com/w/cpp/container",
      "description": "Authoritative reference for vector, stack, queue, deque, set, map, and priority_queue.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Algorithms Library",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official reference for sort, lower_bound, upper_bound, binary_search, and iterators.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:95": [
    {
      "id": "cpp_classes",
      "resourceType": "official_documentation",
      "title": "cppreference — Classes & Structs",
      "url": "https://en.cppreference.com/w/cpp/language/classes",
      "description": "Official reference covering C++ constructors, access specifiers, inheritance, and pointers.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:96": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:97": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:98": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:99": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "dsa:100": [
    {
      "id": "cpp_lang",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Language Reference",
      "url": "https://en.cppreference.com/w/cpp/language",
      "description": "Authoritative C++17 language reference covering types, operators, control flow, and functions.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    },
    {
      "id": "cpp_algo_base",
      "resourceType": "official_documentation",
      "title": "cppreference — C++ Standard Algorithms",
      "url": "https://en.cppreference.com/w/cpp/algorithm",
      "description": "Official C++ STL algorithm reference and complexity guarantees.",
      "sourceLabel": "cppreference",
      "isVerifiedUrl": true
    }
  ],
  "azure:1": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:2": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:3": [
    {
      "id": "ms_aisearch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Search Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/search/",
      "description": "Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_rag",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — RAG Architecture in Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
      "description": "Official Microsoft guide to RAG pipelines, chunking, and grounding citations.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:4": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:5": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:6": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:7": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:8": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:9": [
    {
      "id": "ms_arch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Core Cloud Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/",
      "description": "Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_az900",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path",
      "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
      "description": "Official Microsoft Learn Azure Fundamentals training modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:10": [
    {
      "id": "ms_arch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Core Cloud Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/",
      "description": "Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_az900",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path",
      "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
      "description": "Official Microsoft Learn Azure Fundamentals training modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:11": [
    {
      "id": "ms_aisearch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Search Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/search/",
      "description": "Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_rag",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — RAG Architecture in Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
      "description": "Official Microsoft guide to RAG pipelines, chunking, and grounding citations.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:12": [
    {
      "id": "ms_arch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Core Cloud Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/",
      "description": "Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_az900",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path",
      "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
      "description": "Official Microsoft Learn Azure Fundamentals training modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:13": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:14": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:15": [
    {
      "id": "ms_arch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Core Cloud Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/",
      "description": "Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_az900",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path",
      "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
      "description": "Official Microsoft Learn Azure Fundamentals training modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:16": [
    {
      "id": "ms_arch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Core Cloud Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/",
      "description": "Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_az900",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path",
      "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
      "description": "Official Microsoft Learn Azure Fundamentals training modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:17": [
    {
      "id": "ms_arch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Core Cloud Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/",
      "description": "Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_az900",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path",
      "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
      "description": "Official Microsoft Learn Azure Fundamentals training modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:18": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:19": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:20": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:21": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:22": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:23": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:24": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:25": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:26": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:27": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:28": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:29": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:30": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:31": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:32": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:33": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:34": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:35": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:36": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:37": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:38": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:39": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:40": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:41": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:42": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:43": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:44": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:45": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:46": [
    {
      "id": "ms_aisearch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Search Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/search/",
      "description": "Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_rag",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — RAG Architecture in Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
      "description": "Official Microsoft guide to RAG pipelines, chunking, and grounding citations.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:47": [
    {
      "id": "ms_aisearch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Search Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/search/",
      "description": "Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_rag",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — RAG Architecture in Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
      "description": "Official Microsoft guide to RAG pipelines, chunking, and grounding citations.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:48": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:49": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:50": [
    {
      "id": "ms_foundry",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Foundry Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-foundry/",
      "description": "Official Microsoft Learn documentation for Azure AI Foundry projects, model deployments, and prompt engineering.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_openai_safety",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Content Safety",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview",
      "description": "Official Microsoft documentation for content filtering, prompt shields, and AI safety.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:51": [
    {
      "id": "ms_foundry",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Foundry Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-foundry/",
      "description": "Official Microsoft Learn documentation for Azure AI Foundry projects, model deployments, and prompt engineering.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_openai_safety",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Content Safety",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview",
      "description": "Official Microsoft documentation for content filtering, prompt shields, and AI safety.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:52": [
    {
      "id": "ms_foundry",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Foundry Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-foundry/",
      "description": "Official Microsoft Learn documentation for Azure AI Foundry projects, model deployments, and prompt engineering.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_openai_safety",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Content Safety",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview",
      "description": "Official Microsoft documentation for content filtering, prompt shields, and AI safety.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:53": [
    {
      "id": "ms_foundry",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Foundry Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-foundry/",
      "description": "Official Microsoft Learn documentation for Azure AI Foundry projects, model deployments, and prompt engineering.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_openai_safety",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Content Safety",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview",
      "description": "Official Microsoft documentation for content filtering, prompt shields, and AI safety.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:54": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:55": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:56": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:57": [
    {
      "id": "ms_aisearch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Search Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/search/",
      "description": "Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_rag",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — RAG Architecture in Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
      "description": "Official Microsoft guide to RAG pipelines, chunking, and grounding citations.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:58": [
    {
      "id": "ms_aisearch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Search Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/search/",
      "description": "Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_rag",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — RAG Architecture in Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
      "description": "Official Microsoft guide to RAG pipelines, chunking, and grounding citations.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:59": [
    {
      "id": "ms_aisearch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Search Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/search/",
      "description": "Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_rag",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — RAG Architecture in Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
      "description": "Official Microsoft guide to RAG pipelines, chunking, and grounding citations.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:60": [
    {
      "id": "ms_aisearch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Search Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/search/",
      "description": "Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_rag",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — RAG Architecture in Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
      "description": "Official Microsoft guide to RAG pipelines, chunking, and grounding citations.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:61": [
    {
      "id": "ms_foundry",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Foundry Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-foundry/",
      "description": "Official Microsoft Learn documentation for Azure AI Foundry projects, model deployments, and prompt engineering.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_openai_safety",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Content Safety",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview",
      "description": "Official Microsoft documentation for content filtering, prompt shields, and AI safety.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:62": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:63": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:64": [
    {
      "id": "ms_arch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Core Cloud Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/",
      "description": "Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_az900",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path",
      "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
      "description": "Official Microsoft Learn Azure Fundamentals training modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:65": [
    {
      "id": "ms_arch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Core Cloud Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/",
      "description": "Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_az900",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path",
      "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
      "description": "Official Microsoft Learn Azure Fundamentals training modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:66": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:67": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:68": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:69": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:70": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:71": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:72": [
    {
      "id": "ms_aisearch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Search Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/search/",
      "description": "Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_rag",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — RAG Architecture in Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
      "description": "Official Microsoft guide to RAG pipelines, chunking, and grounding citations.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:73": [
    {
      "id": "ms_foundry",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Foundry Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-foundry/",
      "description": "Official Microsoft Learn documentation for Azure AI Foundry projects, model deployments, and prompt engineering.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_openai_safety",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Content Safety",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview",
      "description": "Official Microsoft documentation for content filtering, prompt shields, and AI safety.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:74": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:75": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:76": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:77": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:78": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:79": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:80": [
    {
      "id": "ms_arch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Core Cloud Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/",
      "description": "Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_az900",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path",
      "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
      "description": "Official Microsoft Learn Azure Fundamentals training modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:81": [
    {
      "id": "ms_foundry",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Foundry Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-foundry/",
      "description": "Official Microsoft Learn documentation for Azure AI Foundry projects, model deployments, and prompt engineering.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_openai_safety",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Content Safety",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview",
      "description": "Official Microsoft documentation for content filtering, prompt shields, and AI safety.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:82": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:83": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:84": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:85": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:86": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:87": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:88": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:89": [
    {
      "id": "ms_arch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Core Cloud Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/",
      "description": "Official Microsoft Azure documentation hub for Compute, Networking, Storage, Identity, and Monitoring.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_az900",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Fundamentals (AZ-900) Learning Path",
      "url": "https://learn.microsoft.com/en-us/training/courses/az-900t00",
      "description": "Official Microsoft Learn Azure Fundamentals training modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:90": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:91": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:92": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:93": [
    {
      "id": "ms_sql",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure SQL Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/azure-sql/",
      "description": "Official comparison and documentation for Azure SQL Database, Managed Instance, and SQL VMs.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_cosmos",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Cosmos DB Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/cosmos-db/",
      "description": "Official Microsoft Learn reference for Cosmos DB containers, items, and partition keys.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:94": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:95": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:96": [
    {
      "id": "ms_aisearch",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Search Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/search/",
      "description": "Official Microsoft Learn documentation for indexes, indexers, vector search, and hybrid retrieval.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_rag",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — RAG Architecture in Azure AI Search",
      "url": "https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview",
      "description": "Official Microsoft guide to RAG pipelines, chunking, and grounding citations.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:97": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:98": [
    {
      "id": "ms_aisvc",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure AI Services Documentation",
      "url": "https://learn.microsoft.com/en-us/azure/ai-services/",
      "description": "Official Microsoft documentation covering Vision, Document Intelligence, Language, and Speech services.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_ai102",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Exam AI-102 Study & Training Path",
      "url": "https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/",
      "description": "Official Azure AI Engineer Associate (AI-102) skills outline and learning modules.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:99": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ],
  "azure:100": [
    {
      "id": "ms_az900_hub",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Cloud Concepts & Azure Fundamentals",
      "url": "https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/",
      "description": "Official Microsoft Learn path covering cloud models, shared responsibility, IaaS/PaaS/SaaS, and Azure hierarchy.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    },
    {
      "id": "ms_azure_home",
      "resourceType": "official_documentation",
      "title": "Microsoft Learn — Azure Architecture Center",
      "url": "https://learn.microsoft.com/en-us/azure/architecture/",
      "description": "Official Microsoft reference architectures and best practices.",
      "sourceLabel": "Microsoft Learn",
      "isVerifiedUrl": true
    }
  ]
};

export function getSharedCurriculumDayContext(trackId: SharedTrackId, dayNumber: number): SharedCurriculumDayContext | null {
  if (!Number.isInteger(dayNumber) || dayNumber < 1) return null;
  if (trackId === 'main') return MAIN_CURRICULUM_CONTEXTS[dayNumber - 1] || null;
  if (trackId === 'dsa') return DSA_CURRICULUM_CONTEXTS[dayNumber - 1] || null;
  return AZURE_CURRICULUM_CONTEXTS[dayNumber - 1] || null;
}

export function getSharedDsaDailyLeetCodeTriplet(dayNumber: number): SharedDailyLeetCodeQuestion[] {
  const safeDay = Math.max(1, Math.min(100, dayNumber));
  return (DSA_DAILY_LEETCODE_TRIPLETS[safeDay] || []).map((q) => ({ ...q }));
}

export function getSharedOfficialDocs(trackId: SharedTrackId, dayNumber: number): SharedDailyReferenceLink[] {
  return (OFFICIAL_DOCS_BY_TRACK_DAY[trackId + ':' + dayNumber] || []).map((d) => ({ ...d }));
}
