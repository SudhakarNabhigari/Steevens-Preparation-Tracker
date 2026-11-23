import type { DaySchedule } from '../types';

export const START_DATE_IST = '2026-11-23T00:00:00+05:30';
export const END_DATE_IST = '2027-05-21T23:59:59+05:30';

// Raw metadata for the 12 core modules + final 12 days
interface ModuleDef {
  number: number;
  title: string;
  pdfPages: string;
  startDay: number;
  endDay: number;
  days: {
    dayOffset: number; // 0 to 13
    topic: string;
    focusType: string;
    subtopics: string[];
    output: string;
    practicalTask: string;
    expectedOutcome: string;
    deliverable: string;
  }[];
}

const rawModules: ModuleDef[] = [
  {
    number: 1,
    title: 'Product, Python and web foundations',
    pdfPages: 'Page 3',
    startDay: 1,
    endDay: 14,
    days: [
      {
        dayOffset: 0,
        topic: 'Product framing',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Product requirements', 'Target users', 'Business problem', 'User journeys', 'User actions', 'Acceptance criteria'],
        output: 'Study notes + working exercise for product framing.',
        practicalTask: 'Define user persona sheet for enterprise employees querying technical SOPs and product manuals.',
        expectedOutcome: 'Clear understanding of user trust boundaries and business value of RAG over pure LLM chatbots.',
        deliverable: 'docs/product_requirements_v1.md with target user personas and 5 primary acceptance criteria.'
      },
      {
        dayOffset: 1,
        topic: 'Architecture and data flow',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Browser-to-API-to-response lifecycle', 'Ingestion pipeline', 'Question-answering pipeline', 'Trust boundaries'],
        output: 'Study notes + working exercise for architecture and data flow.',
        practicalTask: 'Diagram the two separate pipelines: document ingestion vs question answering with server security boundaries.',
        expectedOutcome: 'Knowledge that frontend never communicates with vector DB or LLM provider directly.',
        deliverable: 'docs/architecture_dataflow_v1.png / markdown specification.'
      },
      {
        dayOffset: 2,
        topic: 'Python refresh',
        focusType: 'Integrate with the current application',
        subtopics: ['Python modules', 'Imports', 'Package structure', 'Functions', 'Classes', 'Typing', 'Readable code'],
        output: 'Study notes + working exercise for python refresh.',
        practicalTask: 'Build modular Python package layout with strict typing (Pydantic / dataclasses) and PEP-8 readability.',
        expectedOutcome: 'Clean typing structure ensuring runtime validation and reliable type hinting.',
        deliverable: 'src/core/base_models.py with generic Result and Config classes.'
      },
      {
        dayOffset: 3,
        topic: 'Python environments and failures',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Virtual environments', 'Dependency installation', 'Exceptions', 'Structured error handling', 'Configuration'],
        output: 'Study notes + working exercise for python environments and failures.',
        practicalTask: 'Set up poetry / venv, create custom exception hierarchy (e.g. IngestionError, AuthError, ModelTimeout).',
        expectedOutcome: 'Zero unhandled exceptions; standard error response dictionary mapping.',
        deliverable: 'src/core/exceptions.py with AppBaseException and HTTP status code mappings.'
      },
      {
        dayOffset: 4,
        topic: 'Python runtime foundations',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Logging', 'Asynchronous basics', 'Async/await concepts', 'Blocking versus non-blocking work'],
        output: 'Study notes + working exercise for python runtime foundations.',
        practicalTask: 'Implement structured JSON logger and async worker test harness to verify non-blocking event loop.',
        expectedOutcome: 'Understand when thread pool executors (run_in_threadpool) are needed for CPU/disk-bound PDF parsing.',
        deliverable: 'src/core/logger.py and benchmark script comparing async vs sync throughput.'
      },
      {
        dayOffset: 5,
        topic: 'HTTP foundations',
        focusType: 'Learn concepts and make notes',
        subtopics: ['HTTP methods', 'Request/response lifecycle', 'Headers', 'Body', 'Status codes', 'JSON serialization'],
        output: 'Study notes + working exercise for http foundations.',
        practicalTask: 'Construct raw HTTP request test table mapping CRUD actions to semantic status codes (200, 201, 202, 400, 401, 403, 404, 422, 500).',
        expectedOutcome: 'Strict mastery of idempotent vs non-idempotent methods and headers for auth/caching.',
        deliverable: 'docs/http_status_contract.md.'
      },
      {
        dayOffset: 6,
        topic: 'REST and API interaction',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['REST resource thinking', 'Endpoint conventions', 'Request validation', 'Response structure', 'Browser developer tools'],
        output: 'Study notes + working exercise for rest and api interaction.',
        practicalTask: 'Inspect browser network tab during multipart form uploads and SSE streaming responses.',
        expectedOutcome: 'Ability to debug payloads, Content-Type headers, and chunked transfer encoding.',
        deliverable: 'Interactive API sandbox or curl collection.'
      },
      {
        dayOffset: 7,
        topic: 'Git and collaboration',
        focusType: 'Integrate with the current application',
        subtopics: ['Git status/add/commit', 'Branches', 'Merge/pull requests', 'Conflict awareness', 'GitHub repository workflow'],
        output: 'Study notes + working exercise for git and collaboration.',
        practicalTask: 'Initialize clean monorepo with branch protection, PR templates, and semantic git commit history.',
        expectedOutcome: 'Professional git discipline avoiding committed secrets or untracked test files.',
        deliverable: 'GitHub repository with initial README.md, .gitignore, and .env.example.'
      },
      {
        dayOffset: 8,
        topic: 'Project setup',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Repository layout', 'Frontend/backend/workers/rag/evaluation/infra/tests/docs folders', 'README', 'Local setup guide'],
        output: 'Study notes + working exercise for project setup.',
        practicalTask: 'Scaffold full multi-directory project architecture conforming to source Page 1 requirements.',
        expectedOutcome: 'Reproducible local dev bootup within 5 minutes on clean environment.',
        deliverable: 'Directory structure with frontend/, backend/, workers/, rag/, evaluation/, infra/, tests/, docs/.'
      },
      {
        dayOffset: 9,
        topic: 'Configuration and health',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Environment configuration', 'Secret separation', 'FastAPI application startup', '/health endpoint'],
        output: 'Study notes + working exercise for configuration and health.',
        practicalTask: 'Implement Pydantic BaseSettings loading from .env with strict validation; expose GET /health with DB readiness check.',
        expectedOutcome: 'Zero secrets committed to git; health check reports DB, storage, and worker status.',
        deliverable: 'src/api/routes/health.py and tests/test_health.py.'
      },
      {
        dayOffset: 10,
        topic: 'Architecture walkthrough',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Trace browser → authenticated backend → service → response', 'Explain why frontend does not call providers or vector DB'],
        output: 'Study notes + working exercise for architecture walkthrough.',
        practicalTask: 'Document trust boundaries and write security defense argument for server-side key encapsulation.',
        expectedOutcome: 'Full clarity on why API keys and vector credentials must never be in frontend client code.',
        deliverable: 'docs/architecture_walkthrough_and_threat_model.md.'
      },
      {
        dayOffset: 11,
        topic: 'Build milestone',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Create repository', 'Basic web shell', 'FastAPI health endpoint', 'Architecture v1', 'Local run instructions'],
        output: 'Study notes + working exercise for build milestone.',
        practicalTask: 'Connect basic frontend shell to FastAPI backend; verify browser displays server health and version.',
        expectedOutcome: 'First working integration milestone demonstrating end-to-end client-server connectivity.',
        deliverable: 'Live web shell calling backend /health successfully.'
      },
      {
        dayOffset: 12,
        topic: 'Testing and debugging',
        focusType: 'Module integration and milestone',
        subtopics: ['Run locally', 'Inspect requests', 'Handle startup/configuration errors', 'Verify health check', 'Write a small test'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Write pytest suite covering config failures, invalid env variables, and health checks.',
        expectedOutcome: 'Automated test suite execution with 100% pass rate.',
        deliverable: 'pytest suite with test_config.py and test_health.py.'
      },
      {
        dayOffset: 13,
        topic: 'Review and consolidation',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Explain product flow', 'Demo repository and health check', 'Revise notes', 'Record unresolved questions'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Record 5-minute video walkthrough or write detailed audit log of Module 1 deliverables.',
        expectedOutcome: 'Demonstrate readiness for Saturday assessment and next module.',
        deliverable: 'Module 1 handover summary and Week 1 assessment submission.'
      }
    ]
  },
  {
    number: 2,
    title: 'Frontend UI and backend API',
    pdfPages: 'Page 4',
    startDay: 15,
    endDay: 28,
    days: [
      {
        dayOffset: 0,
        topic: 'React and TypeScript foundations',
        focusType: 'Learn concepts and make notes',
        subtopics: ['React application structure', 'TypeScript types', 'Component boundaries', 'Typed props'],
        output: 'Study notes + working exercise for react and typescript foundations.',
        practicalTask: 'Define TypeScript interface contracts for documents, workspaces, chat messages, and user session.',
        expectedOutcome: 'Type safety between backend OpenAPI schema and frontend UI components.',
        deliverable: 'src/types/api_contracts.ts.'
      },
      {
        dayOffset: 1,
        topic: 'Components and reusable UI',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Components', 'Props', 'Composition', 'Reusable layout', 'Navigation'],
        output: 'Study notes + working exercise for components and reusable ui.',
        practicalTask: 'Build reusable UI primitive components: Button, Modal, Card, Input, Badge, Table, and Notification toast.',
        expectedOutcome: 'Consistent design system matching enterprise SaaS specifications.',
        deliverable: 'src/components/ui library with zero accessibility errors.'
      },
      {
        dayOffset: 2,
        topic: 'State and forms',
        focusType: 'Integrate with the current application',
        subtopics: ['State', 'Controlled inputs', 'Form submission', 'Client-side validation', 'Form feedback'],
        output: 'Study notes + working exercise for state and forms.',
        practicalTask: 'Build login and document upload forms with instant client-side validation and visual feedback.',
        expectedOutcome: 'Prevent empty or malformed submissions before touching network layer.',
        deliverable: 'Working LoginForm and UploadForm components.'
      },
      {
        dayOffset: 3,
        topic: 'Routing and page structure',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Routing', 'Protected-page concept', 'Login, workspace, document and chat page structure'],
        output: 'Study notes + working exercise for routing and page structure.',
        practicalTask: 'Implement client router with protected route guards redirecting unauthenticated users to /login.',
        expectedOutcome: 'Seamless navigation between Login, Dashboard, Workspaces, Documents, Chat, and Admin.',
        deliverable: 'Router setup with 6 defined routes and AuthGuard wrapper.'
      },
      {
        dayOffset: 4,
        topic: 'UI states',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Loading', 'Empty', 'Success', 'Error states', 'Responsive UI shell', 'Accessible feedback'],
        output: 'Study notes + working exercise for ui states.',
        practicalTask: 'Design dedicated empty states ("No documents uploaded yet"), skeleton loaders, and error banners.',
        expectedOutcome: 'Zero layout shift or unhandled loading states during async network calls.',
        deliverable: 'EmptyState, SkeletonLoader, and ErrorBanner components.'
      },
      {
        dayOffset: 5,
        topic: 'API client patterns',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Central API client', 'Base URL/configuration', 'Typed request and response handling', 'Error normalization'],
        output: 'Study notes + working exercise for api client patterns.',
        practicalTask: 'Create centralized fetch wrapper with automatic Bearer token injection and error normalization.',
        expectedOutcome: 'Unified handling of 401 token refresh, 403 forbidden, and 500 server errors.',
        deliverable: 'src/services/apiClient.ts.'
      },
      {
        dayOffset: 6,
        topic: 'FastAPI routers',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Application structure', 'Routers', 'Route grouping', 'Endpoint responsibilities'],
        output: 'Study notes + working exercise for fastapi routers.',
        practicalTask: 'Structure FastAPI with APIRouter into /auth, /workspaces, /documents, /chat, /usage, and /admin.',
        expectedOutcome: 'Clean modular backend routing matching the core API contract from source Page 6.',
        deliverable: 'src/api/routers/ with modular router files.'
      },
      {
        dayOffset: 7,
        topic: 'Pydantic schemas',
        focusType: 'Integrate with the current application',
        subtopics: ['Request schemas', 'Response schemas', 'Field types', 'Validation', 'Useful validation errors'],
        output: 'Study notes + working exercise for pydantic schemas.',
        practicalTask: 'Define Pydantic v2 schemas with Field constraints, email regex, and custom validators.',
        expectedOutcome: 'Automatic Swagger/OpenAPI documentation generation and structured 422 error responses.',
        deliverable: 'src/schemas/ with UserSchema, WorkspaceSchema, ChatSchema.'
      },
      {
        dayOffset: 8,
        topic: 'Dependency injection',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['FastAPI dependencies', 'Shared services', 'Request-scoped dependencies', 'Validation flow'],
        output: 'Study notes + working exercise for dependency injection.',
        practicalTask: 'Implement get_current_user, get_db_session, and get_workspace_permission dependencies using FastAPI Depends.',
        expectedOutcome: 'Decoupled business logic from HTTP handlers and simple mock injection for testing.',
        deliverable: 'src/api/dependencies.py with unit tests.'
      },
      {
        dayOffset: 9,
        topic: 'Frontend-backend connection',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Connect forms and pages to API endpoints', 'Submit data', 'Render returned data'],
        output: 'Study notes + working exercise for frontend-backend connection.',
        practicalTask: 'Wire React document list and workspace creator to FastAPI backend endpoints.',
        expectedOutcome: 'Live end-to-end data flow: user creates workspace in UI, stored in backend, listed in table.',
        deliverable: 'Working WorkspaceManager view connected to live API.'
      },
      {
        dayOffset: 10,
        topic: 'CORS and browser security',
        focusType: 'Learn concepts and make notes',
        subtopics: ['CORS purpose', 'Local development configuration', 'Allowed origins', 'Avoid frontend secrets'],
        output: 'Study notes + working exercise for cors and browser security.',
        practicalTask: 'Configure CORSMiddleware with explicit allowed origins; test preflight OPTIONS requests.',
        expectedOutcome: 'Secure cross-origin policy preventing unauthorized third-party site requests.',
        deliverable: 'FastAPI CORS configuration with environment-specific allowed origins.'
      },
      {
        dayOffset: 11,
        topic: 'Error handling end-to-end',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['API validation errors', 'Network failures', 'Loading reset', 'Empty and retry states'],
        output: 'Study notes + working exercise for error handling end-to-end.',
        practicalTask: 'Implement global React ErrorBoundary and Axios/Fetch interceptor showing user-friendly toast alerts.',
        expectedOutcome: 'App never crashes to white screen; provides clear actionable retry button on network glitch.',
        deliverable: 'src/components/ErrorBoundary.tsx and toast notification handler.'
      },
      {
        dayOffset: 12,
        topic: 'Build milestone',
        focusType: 'Module integration and milestone',
        subtopics: ['Responsive React + TypeScript UI shell connected to FastAPI', 'Navigation and endpoint calls work'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Deploy and test full UI shell with navigation, responsive mobile drawer, and functional CRUD calls.',
        expectedOutcome: 'Responsive UI operating smoothly on desktop and mobile viewports.',
        deliverable: 'Module 2 demo checkpoint verification.'
      },
      {
        dayOffset: 13,
        topic: 'Review and consolidation',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Test form submission', 'Inspect network tab', 'Confirm validation/API errors are clear', 'Demo'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Perform complete browser network inspection of all 6 core route groups.',
        expectedOutcome: 'Confirm all HTTP response codes, latency, and error states behave predictably.',
        deliverable: 'Module 2 review document and Week 2 assessment submission.'
      }
    ]
  },
  {
    number: 3,
    title: 'Authentication, database and tenant model',
    pdfPages: 'Page 5',
    startDay: 29,
    endDay: 42,
    days: [
      {
        dayOffset: 0,
        topic: 'Relational database foundations',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Relational tables', 'Rows', 'Primary keys', 'Foreign keys', 'Relationships', 'Basic SQL'],
        output: 'Study notes + working exercise for relational database foundations.',
        practicalTask: 'Write relational schema DDL creating users, tenants, memberships, workspaces, documents, messages.',
        expectedOutcome: 'Solid understanding of 1:1, 1:N, and N:M relational integrity and cascade rules.',
        deliverable: 'sql/init_schema.sql.'
      },
      {
        dayOffset: 1,
        topic: 'SQL practice',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'Filtering', 'Joins', 'Grouping relevant to app entities'],
        output: 'Study notes + working exercise for sql practice.',
        practicalTask: 'Execute complex multi-table SQL queries joining users, memberships, and workspaces with role filters.',
        expectedOutcome: 'Mastery of SQL joins (INNER, LEFT OUTER) and aggregate functions for usage metrics.',
        deliverable: 'sql/sample_queries.sql with explain analyze output.'
      },
      {
        dayOffset: 2,
        topic: 'PostgreSQL schema design',
        focusType: 'Integrate with the current application',
        subtopics: ['Users', 'Organizations/tenants', 'Memberships', 'Workspaces', 'Documents', 'Conversations', 'Messages', 'Usage'],
        output: 'Study notes + working exercise for postgresql schema design.',
        practicalTask: 'Implement SQLAlchemy / SQLModel models for all 10 core entities from source Page 16.',
        expectedOutcome: 'Complete entity mapping with UUID primary keys and timestamp tracking.',
        deliverable: 'src/db/models.py.'
      },
      {
        dayOffset: 3,
        topic: 'Migrations and constraints',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Schema migrations', 'Indexes', 'Uniqueness', 'Not-null constraints', 'Foreign-key constraints'],
        output: 'Study notes + working exercise for migrations and constraints.',
        practicalTask: 'Configure Alembic migrations; add composite unique index on (tenant_id, email) and foreign keys.',
        expectedOutcome: 'Repeatable, version-controlled database migrations with rollback capability.',
        deliverable: 'alembic/versions/ migration scripts.'
      },
      {
        dayOffset: 4,
        topic: 'Transactions',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Transaction boundaries', 'Commit/rollback', 'Consistency for multi-step writes'],
        output: 'Study notes + working exercise for transactions.',
        practicalTask: 'Wrap workspace creation and admin membership initialization in an ACID database transaction.',
        expectedOutcome: 'Zero orphaned records if secondary insert fails; atomic rollback tested.',
        deliverable: 'src/db/transactions.py with test_transaction_rollback test.'
      },
      {
        dayOffset: 5,
        topic: 'Authentication concepts',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Registration', 'Login', 'Identity', 'Authentication versus authorization'],
        output: 'Study notes + working exercise for authentication concepts.',
        practicalTask: 'Document authentication vs authorization differences; map session token lifecycle.',
        expectedOutcome: 'Clarity on who the user is (authn) vs what they can access (authz).',
        deliverable: 'docs/auth_flow_diagram.md.'
      },
      {
        dayOffset: 6,
        topic: 'Password and token handling',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Password hashing', 'Access tokens', 'Refresh/session strategy', 'Expiration and logout'],
        output: 'Study notes + working exercise for password and token handling.',
        practicalTask: 'Implement bcrypt / argon2 password hashing and JWT access token issuance (30-day expiration for prototype).',
        expectedOutcome: 'Secure password hashing with salt; JWT verification with secret signature.',
        deliverable: 'src/services/security.py with hash_password and verify_token functions.'
      },
      {
        dayOffset: 7,
        topic: 'Membership and roles',
        focusType: 'Integrate with the current application',
        subtopics: ['Tenant/workspace membership', 'Owner, admin and member roles', 'Role-based permission checks'],
        output: 'Study notes + working exercise for membership and roles.',
        practicalTask: 'Implement RBAC hierarchy: Owner (full + billing), Admin (workspace/user manage), Member (read/chat).',
        expectedOutcome: 'Granular permission matrix enforced before mutation operations.',
        deliverable: 'src/services/rbac.py with require_role decorator.'
      },
      {
        dayOffset: 8,
        topic: 'Server-side authorization',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Authorize every protected document and chat endpoint', 'Do not trust client-supplied tenant IDs'],
        output: 'Study notes + working exercise for server-side authorization.',
        practicalTask: 'Enforce tenant_id lookup from JWT payload rather than trusting path/body parameter from client.',
        expectedOutcome: 'Prevent IDOR (Insecure Direct Object Reference) attacks on document and conversation records.',
        deliverable: 'src/api/guards.py with strict tenant authorization.'
      },
      {
        dayOffset: 9,
        topic: 'Data ownership',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Associate records with users, tenants and workspaces', 'Prevent cross-tenant access'],
        output: 'Study notes + working exercise for data ownership.',
        practicalTask: 'Add tenant_id, workspace_id, created_by to all document and message queries automatically.',
        expectedOutcome: 'Architectural guarantee of multi-tenant data segregation.',
        deliverable: 'src/db/tenant_filters.py.'
      },
      {
        dayOffset: 10,
        topic: 'Database integration',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Persist users, workspaces and app records', 'Handle database errors safely'],
        output: 'Study notes + working exercise for database integration.',
        practicalTask: 'Integrate async database session pool with connection pooling and retry on disconnect.',
        expectedOutcome: 'Robust DB connection handling with graceful timeout and health recovery.',
        deliverable: 'src/db/session.py with async connection pool.'
      },
      {
        dayOffset: 11,
        topic: 'Negative security tests',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['User A versus User B', 'Unauthorized workspace/document access', 'Role boundary tests'],
        output: 'Study notes + working exercise for negative security tests.',
        practicalTask: 'Write automated pytest suite verifying User A cannot read, edit, or delete User B documents (HTTP 403/404).',
        expectedOutcome: 'Zero cross-tenant leakage proven by automated test logs.',
        deliverable: 'tests/test_tenant_isolation.py.'
      },
      {
        dayOffset: 12,
        topic: 'Build milestone',
        focusType: 'Module integration and milestone',
        subtopics: ['Authenticated application with PostgreSQL persistence and workspace-scoped data'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Deploy complete auth + DB milestone: register, login, create workspace, verify DB rows.',
        expectedOutcome: 'Fully persistent authentication and tenant-scoped workspace management.',
        deliverable: 'Module 3 acceptance test pass report.'
      },
      {
        dayOffset: 13,
        topic: 'Review and consolidation',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Demonstrate sign-in and isolation', 'Automated tests prove user A cannot read user B records'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Run full security audit checklist and record test coverage report.',
        expectedOutcome: 'Readiness for Module 4 and Saturday assessment.',
        deliverable: 'Module 3 documentation and Week 3 assessment submission.'
      }
    ]
  },
  {
    number: 4,
    title: 'File upload and document ingestion',
    pdfPages: 'Page 6',
    startDay: 43,
    endDay: 56,
    days: [
      {
        dayOffset: 0,
        topic: 'Upload UI',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Drag-and-drop', 'File picker', 'File list', 'Progress display', 'Processing status'],
        output: 'Study notes + working exercise for upload ui.',
        practicalTask: 'Build responsive drag-and-drop file upload zone with file size check and real-time upload progress.',
        expectedOutcome: 'Intuitive file upload interface displaying queued, processing, and finished states.',
        deliverable: 'src/components/FileUploadZone.tsx.'
      },
      {
        dayOffset: 1,
        topic: 'File validation',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Extension', 'MIME type', 'File size', 'Safe filenames', 'Reject unsupported or suspicious inputs'],
        output: 'Study notes + working exercise for file validation.',
        practicalTask: 'Validate file headers (magic bytes) to prevent renamed executables; enforce 50MB file size limit.',
        expectedOutcome: 'Server rejects malicious files before writing to object storage.',
        deliverable: 'src/services/file_validator.py.'
      },
      {
        dayOffset: 2,
        topic: 'Safe file handling',
        focusType: 'Integrate with the current application',
        subtopics: ['Path traversal prevention', 'Content validation', 'Safe storage names', 'Scanning where infrastructure permits'],
        output: 'Study notes + working exercise for safe file handling.',
        practicalTask: 'Generate UUID-based storage keys (e.g. s3://bucket/tenants/{tid}/docs/{uuid}.pdf); sanitize filenames.',
        expectedOutcome: 'Zero directory traversal vulnerability (../../etc/passwd).',
        deliverable: 'src/services/storage_key_generator.py.'
      },
      {
        dayOffset: 3,
        topic: 'Object storage',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Store originals', 'Local S3-compatible storage in development', 'Cloud object storage later'],
        output: 'Study notes + working exercise for object storage.',
        practicalTask: 'Implement S3/MinIO client interface with put_object, get_object, and delete_object methods.',
        expectedOutcome: 'Raw document bytes stored safely in object storage, separate from relational metadata.',
        deliverable: 'src/services/s3_storage.py.'
      },
      {
        dayOffset: 4,
        topic: 'Document formats',
        focusType: 'Explain the design and record evidence',
        subtopics: ['PDF', 'DOCX', 'TXT', 'HTML', 'CSV', 'Format-specific extraction considerations'],
        output: 'Study notes + working exercise for document formats.',
        practicalTask: 'Create parser factory routing files based on MIME type to specialized extractors.',
        expectedOutcome: 'Modular parser architecture supporting heterogeneous enterprise document formats.',
        deliverable: 'src/parsers/parser_factory.py.'
      },
      {
        dayOffset: 5,
        topic: 'Text extraction',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Extract text', 'Handle empty/malformed files', 'Preserve document boundaries and metadata'],
        output: 'Study notes + working exercise for text extraction.',
        practicalTask: 'Extract raw text using PyMuPDF (fitz) preserving page numbers, headers, and section breaks.',
        expectedOutcome: 'High-fidelity text extraction with clean handling of zero-byte or corrupt PDFs.',
        deliverable: 'src/parsers/pdf_parser.py.'
      },
      {
        dayOffset: 6,
        topic: 'OCR',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['OCR path for scanned PDFs/images', 'When OCR is required', 'Extraction metadata'],
        output: 'Study notes + working exercise for ocr.',
        practicalTask: 'Implement fallback OCR pipeline (Tesseract / EasyOCR) triggered when extracted text length < 50 chars per page.',
        expectedOutcome: 'Scanned image PDFs converted to searchable text with confidence scores.',
        deliverable: 'src/parsers/ocr_extractor.py.'
      },
      {
        dayOffset: 7,
        topic: 'Source location metadata',
        focusType: 'Integrate with the current application',
        subtopics: ['Page numbers', 'Section metadata', 'Source identity', 'Extraction provenance'],
        output: 'Study notes + working exercise for source location metadata.',
        practicalTask: 'Attach page_number, start_char, end_char, and doc_id to each extracted section.',
        expectedOutcome: 'Source provenance recorded for later citation mapping and snippet preview.',
        deliverable: 'src/parsers/metadata_attacher.py.'
      },
      {
        dayOffset: 8,
        topic: 'Background jobs',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Queue concept', 'Asynchronous processing', 'Why large documents should not process inside upload request'],
        output: 'Study notes + working exercise for background jobs.',
        practicalTask: 'Set up Celery / RQ background worker with Redis broker; return 202 Accepted with job_id immediately.',
        expectedOutcome: 'Upload requests return in <200ms; heavy PDF parsing happens asynchronously in background worker.',
        deliverable: 'src/workers/ingestion_worker.py.'
      },
      {
        dayOffset: 9,
        topic: 'Job lifecycle',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Persist queued/running/succeeded/failed state', 'Progress', 'Failure reason', 'Inspect status'],
        output: 'Study notes + working exercise for job lifecycle.',
        practicalTask: 'Store job state transitions (QUEUED → PROCESSING → COMPLETED / FAILED) in ingestion_jobs table.',
        expectedOutcome: 'Frontend can poll GET /documents/{id} to display live percentage progress bar.',
        deliverable: 'src/workers/job_tracker.py and status polling hook.'
      },
      {
        dayOffset: 10,
        topic: 'Retries and recovery',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Retry policy', 'Recoverable failures', 'Retry visibility', 'Avoid duplicate side effects'],
        output: 'Study notes + working exercise for retries and recovery.',
        practicalTask: 'Configure exponential backoff retries with max 3 attempts; log exact failure reason on dead-letter.',
        expectedOutcome: 'Transient network drops retry cleanly without creating duplicate chunk records.',
        deliverable: 'src/workers/retry_policy.py.'
      },
      {
        dayOffset: 11,
        topic: 'Ingestion pipeline',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Upload → validation → object storage → background job → extraction/OCR → cleaning → chunking handoff'],
        output: 'Study notes + working exercise for ingestion pipeline.',
        practicalTask: 'Wire the full ingestion pipeline end-to-end from browser drop to parsed text handoff.',
        expectedOutcome: 'Verified pipeline taking sample 20-page PDF from browser to cleaned text blocks.',
        deliverable: 'Complete ingestion pipeline integration test.'
      },
      {
        dayOffset: 12,
        topic: 'Build milestone',
        focusType: 'Module integration and milestone',
        subtopics: ['Reliable ingestion v1', 'Upload, status inspection, visible errors and retry'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Verify document manager UI shows uploaded docs, live status spinner, error badges, and retry button.',
        expectedOutcome: 'Ingestion milestone passes all format, size, and corruption tests.',
        deliverable: 'Module 4 milestone verification demo.'
      },
      {
        dayOffset: 13,
        topic: 'Review and consolidation',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Test supported formats, empty/corrupt files and failed jobs', 'Confirm asynchronous recovery'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Run chaos test: upload corrupt PDF, cut Redis connection, verify graceful error and recovery.',
        expectedOutcome: 'Zero server hangs or zombie worker processes.',
        deliverable: 'Module 4 consolidation report and Week 4 assessment submission.'
      }
    ]
  },
  {
    number: 5,
    title: 'Chunking, embeddings and vector storage',
    pdfPages: 'Page 7',
    startDay: 57,
    endDay: 70,
    days: [
      {
        dayOffset: 0,
        topic: 'Chunking purpose',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Why documents are split', 'Retrieval granularity', 'Context limits', 'Trade-offs'],
        output: 'Study notes + working exercise for chunking purpose.',
        practicalTask: 'Analyze chunking trade-offs: small chunks (precise retrieval, loss of context) vs large chunks (high context, dilution).',
        expectedOutcome: 'Knowledge of why chunking strategy determines RAG retrieval precision.',
        deliverable: 'docs/chunking_tradeoff_matrix.md.'
      },
      {
        dayOffset: 1,
        topic: 'Fixed-size chunking',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Chunk size', 'Overlap', 'Boundary effects', 'Strengths and limitations'],
        output: 'Study notes + working exercise for fixed-size chunking.',
        practicalTask: 'Implement token-based chunker with chunk_size=512, overlap=64 tokens using tiktoken / HuggingFace tokenizer.',
        expectedOutcome: 'Overlap preserves semantic continuity across arbitrary sentence boundaries.',
        deliverable: 'src/rag/chunkers/fixed_chunker.py.'
      },
      {
        dayOffset: 2,
        topic: 'Recursive chunking',
        focusType: 'Integrate with the current application',
        subtopics: ['Recursive splitting', 'Separators', 'Preserving paragraphs/sections'],
        output: 'Study notes + working exercise for recursive chunking.',
        practicalTask: 'Implement recursive character splitter splitting on ["\\n\\n", "\\n", ". ", " "].',
        expectedOutcome: 'Preserves coherent paragraphs and natural sentence boundaries wherever possible.',
        deliverable: 'src/rag/chunkers/recursive_chunker.py.'
      },
      {
        dayOffset: 3,
        topic: 'Semantic chunking',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Meaning-aware boundaries', 'When semantic splitting may help', 'Cost/complexity trade-offs'],
        output: 'Study notes + working exercise for semantic chunking.',
        practicalTask: 'Build semantic chunker calculating cosine similarity between adjacent sentences to detect topic shifts.',
        expectedOutcome: 'Understand when semantic chunking improves quality vs when cost is prohibitive.',
        deliverable: 'src/rag/chunkers/semantic_chunker.py with benchmark.'
      },
      {
        dayOffset: 4,
        topic: 'Parent-child chunking',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Small retrieval child', 'Larger parent context', 'Mapping child to parent'],
        output: 'Study notes + working exercise for parent-child chunking.',
        practicalTask: 'Create small 128-token child chunks for dense vector search linked to 1024-token parent section for LLM context.',
        expectedOutcome: 'High retrieval precision without starving the generator model of surrounding narrative.',
        deliverable: 'src/rag/chunkers/parent_child_chunker.py.'
      },
      {
        dayOffset: 5,
        topic: 'Chunk metadata',
        focusType: 'Learn concepts and make notes',
        subtopics: ['tenant_id', 'workspace_id', 'document_id', 'page', 'section', 'chunk_index', 'source', 'permissions'],
        output: 'Study notes + working exercise for chunk metadata.',
        practicalTask: 'Attach structured metadata payload to every chunk: tenant_id, workspace_id, doc_id, page_num, section_title.',
        expectedOutcome: 'Mandatory metadata fields present for security filtering during vector queries.',
        deliverable: 'src/rag/models/chunk_payload.py.'
      },
      {
        dayOffset: 6,
        topic: 'Embedding fundamentals',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Embedding model', 'Vector representation', 'Semantic similarity', 'Model selection'],
        output: 'Study notes + working exercise for embedding fundamentals.',
        practicalTask: 'Compare embedding models (text-embedding-3-small, BGE, Gemini text-embedding-004) on semantic similarity tasks.',
        expectedOutcome: 'Understand vector dimensionality, cosine similarity vs dot product.',
        deliverable: 'notebooks/embedding_model_comparison.ipynb.'
      },
      {
        dayOffset: 7,
        topic: 'Embedding properties',
        focusType: 'Integrate with the current application',
        subtopics: ['Dimensions', 'Normalization', 'Input limits', 'Token limits', 'Cost', 'Consistency of model/version'],
        output: 'Study notes + working exercise for embedding properties.',
        practicalTask: 'Implement batch embedding service with token counting, rate-limiting, and vector unit-length normalization.',
        expectedOutcome: 'Consistency of embedding model version across ingestion and retrieval.',
        deliverable: 'src/rag/embeddings/embedding_service.py.'
      },
      {
        dayOffset: 8,
        topic: 'Vector storage choices',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Qdrant or PostgreSQL with pgvector', 'Compare fit and operational trade-offs'],
        output: 'Study notes + working exercise for vector storage choices.',
        practicalTask: 'Benchmark Qdrant vs pgvector (HNSW index) for multi-tenant filtering speed and operational overhead.',
        expectedOutcome: 'Understand HNSW indexing parameters (m, ef_construction, ef_search) and metadata indexing.',
        deliverable: 'docs/vector_store_tradeoffs.md.'
      },
      {
        dayOffset: 9,
        topic: 'Vector records',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Stable IDs', 'Vector payload', 'Metadata filters', 'Relational metadata linkage'],
        output: 'Study notes + working exercise for vector records.',
        practicalTask: 'Store vector embeddings with deterministic UUIDs linking chunk records in Postgres to vector points in Qdrant/pgvector.',
        expectedOutcome: 'Seamless foreign key linkage between vector store and relational metadata.',
        deliverable: 'src/rag/vector_store/qdrant_adapter.py.'
      },
      {
        dayOffset: 10,
        topic: 'Indexing and retrieval basics',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Persist vectors', 'Similarity search', 'Top-k', 'Metadata filtering'],
        output: 'Study notes + working exercise for indexing and retrieval basics.',
        practicalTask: 'Execute top-k similarity search with hard metadata filter: tenant_id == X AND workspace_id == Y.',
        expectedOutcome: 'Guaranteed tenant isolation in vector index before distance calculation.',
        deliverable: 'src/rag/retrieval/vector_searcher.py.'
      },
      {
        dayOffset: 11,
        topic: 'Idempotent ingestion',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Stable IDs', 'Re-ingestion', 'Duplicate prevention', 'Document deletion', 'Vector cleanup'],
        output: 'Study notes + working exercise for idempotent ingestion.',
        practicalTask: 'Implement document re-index and deletion: delete existing vectors for doc_id before inserting new version.',
        expectedOutcome: 'Zero duplicate chunks when user re-uploads or updates an existing document.',
        deliverable: 'src/rag/vector_store/idempotent_indexer.py.'
      },
      {
        dayOffset: 12,
        topic: 'Retrieval test surface',
        focusType: 'Module integration and milestone',
        subtopics: ['Internal retrieval endpoint or developer screen', 'Inspect returned chunks and metadata'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Build developer inspection screen showing query, top-k chunks, cosine scores, and metadata tags.',
        expectedOutcome: 'Visual debug UI for verifying vector retrieval quality without calling LLM.',
        deliverable: 'src/components/RetrievalInspector.tsx and GET /api/v1/dev/retrieval endpoint.'
      },
      {
        dayOffset: 13,
        topic: 'Build milestone',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Persistent vector index', 'Uploaded documents become searchable', 'Indexed status visible'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Run end-to-end verification: upload PDF → chunk → embed → search via inspector.',
        expectedOutcome: 'Persistent vector storage milestone complete and verified.',
        deliverable: 'Module 5 completion report and Week 5 assessment submission.'
      }
    ]
  },
  {
    number: 6,
    title: 'Basic RAG chat and citations',
    pdfPages: 'Page 8',
    startDay: 71,
    endDay: 84,
    days: [
      {
        dayOffset: 0,
        topic: 'Chat interface',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Conversation list', 'Message bubbles', 'Input', 'Send/stop controls', 'Streaming display'],
        output: 'Study notes + working exercise for chat interface.',
        practicalTask: 'Build responsive chat UI with conversation sidebar, message bubbles, markdown rendering, and abort button.',
        expectedOutcome: 'Modern chat interface ready for streaming tokens and citation badges.',
        deliverable: 'src/components/chat/ChatWorkspace.tsx.'
      },
      {
        dayOffset: 1,
        topic: 'Query embedding',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Embed user query using compatible embedding model', 'Query/vector compatibility'],
        output: 'Study notes + working exercise for query embedding.',
        practicalTask: 'Implement query embedder using identical model and dimension configuration as document chunks.',
        expectedOutcome: 'Zero dimension mismatch errors; query normalized for cosine search.',
        deliverable: 'src/rag/retrieval/query_embedder.py.'
      },
      {
        dayOffset: 2,
        topic: 'Top-k retrieval',
        focusType: 'Integrate with the current application',
        subtopics: ['Vector search', 'Top-k selection', 'Tenant/workspace filters applied to retrieval'],
        output: 'Study notes + working exercise for top-k retrieval.',
        practicalTask: 'Execute top-k search (k=5) enforcing mandatory workspace and ACL filters.',
        expectedOutcome: 'Retrieve relevant chunks scoped strictly to the current user workspace.',
        deliverable: 'src/rag/retrieval/top_k_retriever.py.'
      },
      {
        dayOffset: 3,
        topic: 'Prompt construction',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['System instructions', 'Supplied context', 'Question', 'Explicit evidence-only behavior'],
        output: 'Study notes + working exercise for prompt construction.',
        practicalTask: 'Construct strict evidence-based system prompt instructing LLM to answer ONLY from context with [Source X] tags.',
        expectedOutcome: 'Drastic reduction in model hallucinations; strictly grounded generation.',
        deliverable: 'src/rag/prompts/grounded_rag_prompt.py.'
      },
      {
        dayOffset: 4,
        topic: 'Abstention behavior',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Admit insufficient evidence', 'Handle unanswerable questions', 'Avoid unsupported claims'],
        output: 'Study notes + working exercise for abstention behavior.',
        practicalTask: 'Evaluate abstention prompts with unanswerable questions; verify model replies "I cannot find this in the documents".',
        expectedOutcome: 'Model refuses to invent facts when context is missing.',
        deliverable: 'tests/test_abstention.py.'
      },
      {
        dayOffset: 5,
        topic: 'LLM provider adapter',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Server-side provider adapter', 'Provider abstraction', 'Configuration', 'Keep provider keys server-side'],
        output: 'Study notes + working exercise for llm provider adapter.',
        practicalTask: 'Create unified LLMProvider interface with Gemini, OpenAI, and Anthropic adapter implementations.',
        expectedOutcome: 'Vendor abstraction layer allowing zero-code provider swaps; keys never leave backend.',
        deliverable: 'src/rag/providers/llm_adapter.py.'
      },
      {
        dayOffset: 6,
        topic: 'Generation controls',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Timeouts', 'Token limits', 'Safe defaults', 'Provider errors'],
        output: 'Study notes + working exercise for generation controls.',
        practicalTask: 'Set strict generation timeout (30s), max_tokens=1024, temperature=0.1 for deterministic fact extraction.',
        expectedOutcome: 'Prevent runaway requests, infinite loops, and provider billing spikes.',
        deliverable: 'src/rag/providers/generation_config.py.'
      },
      {
        dayOffset: 7,
        topic: 'Context assembly',
        focusType: 'Integrate with the current application',
        subtopics: ['Select retrieved chunks', 'Order context', 'Manage context budget', 'Avoid irrelevant passages'],
        output: 'Study notes + working exercise for context assembly.',
        practicalTask: 'Build context assembler fitting chunks into token budget (e.g. 4000 tokens) sorted by relevance score.',
        expectedOutcome: 'Optimal context packing without truncation of high-relevance passages.',
        deliverable: 'src/rag/context/context_assembler.py.'
      },
      {
        dayOffset: 8,
        topic: 'Citation mapping',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Map generated claims/answers to retrieved chunks', 'Source filename', 'Page/section references'],
        output: 'Study notes + working exercise for citation mapping.',
        practicalTask: 'Parse [Source 1], [Source 2] references in model output and map to source filename and page numbers.',
        expectedOutcome: 'Every factual claim in model answer linked to concrete evidence chunks.',
        deliverable: 'src/rag/citations/citation_mapper.py.'
      },
      {
        dayOffset: 9,
        topic: 'Citation UI',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Show citations', 'Source preview', 'Source snippets', 'Link answer to evidence'],
        output: 'Study notes + working exercise for citation ui.',
        practicalTask: 'Build interactive citation pill badges in chat bubble; clicking opens drawer with excerpt and PDF page.',
        expectedOutcome: 'User can instantly verify the source sentence supporting the AI answer.',
        deliverable: 'src/components/chat/CitationDrawer.tsx.'
      },
      {
        dayOffset: 10,
        topic: 'Streaming',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Stream answer to browser', 'Partial output handling', 'Stop generation'],
        output: 'Study notes + working exercise for streaming.',
        practicalTask: 'Implement Server-Sent Events (SSE) endpoint streaming tokens to browser in real-time with AbortController support.',
        expectedOutcome: 'Sub-second Time-to-First-Token (TTFT) and smooth typewriter rendering.',
        deliverable: 'src/api/routes/chat_stream.py and useStreamingChat hook.'
      },
      {
        dayOffset: 11,
        topic: 'Conversation persistence',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Store conversation/message history', 'Retrieved context', 'Model metadata for traceability'],
        output: 'Study notes + working exercise for conversation persistence.',
        practicalTask: 'Persist chat sessions, user questions, assistant responses, citation arrays, and token usage to database.',
        expectedOutcome: 'Conversations reload on refresh; complete audit trail preserved.',
        deliverable: 'src/db/repositories/chat_repository.py.'
      },
      {
        dayOffset: 12,
        topic: 'Guardrails and trace',
        focusType: 'Module integration and milestone',
        subtopics: ['Citation/guardrail checks', 'Trace and usage record', 'Safe fallback'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Implement post-generation guardrail checking for ungrounded assertions; log trace ID for every question.',
        expectedOutcome: 'Safe fallback response if guardrail detects hallucinations.',
        deliverable: 'src/rag/guardrails/fact_checker.py.'
      },
      {
        dayOffset: 13,
        topic: 'Build milestone',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['End-to-end RAG MVP: streamed, cited answer grounded in retrieved sources'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Demonstrate full RAG chat: ask question against uploaded PDF → get streamed, cited response with citations.',
        expectedOutcome: 'RAG MVP working cleanly from start to finish.',
        deliverable: 'Module 6 completion milestone demo and Week 6 assessment submission.'
      }
    ]
  },
  {
    number: 7,
    title: 'Advanced retrieval quality',
    pdfPages: 'Page 9',
    startDay: 85,
    endDay: 98,
    days: [
      {
        dayOffset: 0,
        topic: 'Lexical search',
        focusType: 'Learn concepts and make notes',
        subtopics: ['BM25', 'Term matching', 'Strengths for exact names, identifiers and keywords'],
        output: 'Study notes + working exercise for lexical search.',
        practicalTask: 'Implement BM25 search index using rank_bm25 / Elasticsearch / Postgres pg_trgm for exact code/SKU search.',
        expectedOutcome: 'Find exact acronyms, error codes, and technical names that vector embeddings often miss.',
        deliverable: 'src/rag/retrieval/bm25_searcher.py.'
      },
      {
        dayOffset: 1,
        topic: 'Dense versus lexical',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Compare dense-only retrieval with lexical search', 'Understand complementary signals'],
        output: 'Study notes + working exercise for dense versus lexical.',
        practicalTask: 'Run side-by-side retrieval comparison on technical queries ("ERR_CONN_REFUSED", "ISO-27001 section 4.2").',
        expectedOutcome: 'Demonstrate where dense search fails on exact keywords and lexical fails on conceptual synonyms.',
        deliverable: 'docs/dense_vs_lexical_comparison.md.'
      },
      {
        dayOffset: 2,
        topic: 'Hybrid retrieval',
        focusType: 'Integrate with the current application',
        subtopics: ['Combine lexical and dense results', 'Fusion approach', 'Compare retrieval quality'],
        output: 'Study notes + working exercise for hybrid retrieval.',
        practicalTask: 'Implement Reciprocal Rank Fusion (RRF) algorithm: RRF_score = sum(1 / (k + rank)).',
        expectedOutcome: 'Robust hybrid retrieval combining semantic understanding with exact keyword precision.',
        deliverable: 'src/rag/retrieval/hybrid_rrf.py.'
      },
      {
        dayOffset: 3,
        topic: 'Metadata filters',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Tenant/workspace/document filters', 'Filtering before results reach the model'],
        output: 'Study notes + working exercise for metadata filters.',
        practicalTask: 'Combine pre-filtering on tenant/workspace with post-filtering on document date or tag filters.',
        expectedOutcome: 'Narrow search space to relevant document subset with zero performance penalty.',
        deliverable: 'src/rag/retrieval/filtered_retriever.py.'
      },
      {
        dayOffset: 4,
        topic: 'Query normalization',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Normalize user query', 'Handle wording variation and noisy input'],
        output: 'Study notes + working exercise for query normalization.',
        practicalTask: 'Clean user query: strip punctuation, resolve common typos, normalize whitespace and case.',
        expectedOutcome: 'Prevent retrieval failures caused by minor typographical noise.',
        deliverable: 'src/rag/query/query_normalizer.py.'
      },
      {
        dayOffset: 5,
        topic: 'Query rewriting',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Rewrite ambiguous or conversational questions while preserving intent'],
        output: 'Study notes + working exercise for query rewriting.',
        practicalTask: 'Use fast LLM prompt to rewrite conversational follow-ups ("What about its security?") into standalone queries.',
        expectedOutcome: 'Multi-turn chat queries become self-contained search queries containing full context.',
        deliverable: 'src/rag/query/query_rewriter.py.'
      },
      {
        dayOffset: 6,
        topic: 'Multi-query retrieval',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Generate alternate queries', 'Retrieve candidates', 'Combine results', 'Avoid unnecessary expansion'],
        output: 'Study notes + working exercise for multi-query retrieval.',
        practicalTask: 'Generate 3 perspective variants of query, execute parallel retrieval, and merge candidate pool.',
        expectedOutcome: 'Overcome single-query phrasing bias on complex conceptual topics.',
        deliverable: 'src/rag/query/multi_query_expander.py.'
      },
      {
        dayOffset: 7,
        topic: 'Reranking',
        focusType: 'Integrate with the current application',
        subtopics: ['Cross-encoder or hosted reranking model', 'Candidate ranking', 'Latency/cost trade-off'],
        output: 'Study notes + working exercise for reranking.',
        practicalTask: 'Integrate Cross-Encoder (e.g. bge-reranker-large or Cohere rerank) on top-20 retrieved chunks to pick top-5.',
        expectedOutcome: 'Significant jump in MRR and Precision@5 by scoring deep query-passage interactions.',
        deliverable: 'src/rag/rerank/cross_encoder_reranker.py.'
      },
      {
        dayOffset: 8,
        topic: 'Contextual compression',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Optional contextual compression', 'Reduce irrelevant context while preserving evidence'],
        output: 'Study notes + working exercise for contextual compression.',
        practicalTask: 'Extract only relevant sentence spans from 1000-character chunks before sending to prompt.',
        expectedOutcome: 'Higher prompt signal-to-noise ratio and reduced token costs.',
        deliverable: 'src/rag/context/context_compressor.py.'
      },
      {
        dayOffset: 9,
        topic: 'MMR',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Maximal Marginal Relevance', 'Relevance/diversity trade-off', 'Use only where useful'],
        output: 'Study notes + working exercise for mmr.',
        practicalTask: 'Implement Maximal Marginal Relevance to penalize redundant chunks covering identical paragraphs.',
        expectedOutcome: 'Diverse information representation across multiple document sections.',
        deliverable: 'src/rag/retrieval/mmr_reranker.py.'
      },
      {
        dayOffset: 10,
        topic: 'Parent-child retrieval',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Retrieve child chunks', 'Expand to parent context', 'Compare evidence completeness'],
        output: 'Study notes + working exercise for parent-child retrieval.',
        practicalTask: 'Implement automatic context expansion: child chunk match fetches parent section and sibling chunks.',
        expectedOutcome: 'Model receives complete technical explanation without broken table rows or orphan clauses.',
        deliverable: 'src/rag/retrieval/parent_context_expander.py.'
      },
      {
        dayOffset: 11,
        topic: 'Retrieval tuning',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Tune chunk size, overlap, top-k and reranker depth using a fixed test set'],
        output: 'Study notes + working exercise for retrieval tuning.',
        practicalTask: 'Run hyperparameter grid search across chunk sizes [256, 512, 1024] and reranker depths [10, 20, 30].',
        expectedOutcome: 'Empirically backed configuration delivering maximum HitRate@5 on benchmark corpus.',
        deliverable: 'evaluation/retrieval_tuning_results.csv.'
      },
      {
        dayOffset: 12,
        topic: 'Relevance feedback',
        focusType: 'Module integration and milestone',
        subtopics: ['Show source snippets', 'Collect optional relevance feedback', 'Use feedback as evaluation evidence'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Add thumbs up/down and relevance star rating to citations in UI, logging feedback to database.',
        expectedOutcome: 'Continuous collection of user relevance judgments for offline evaluation.',
        deliverable: 'src/components/chat/RelevanceFeedbackWidget.tsx.'
      },
      {
        dayOffset: 13,
        topic: 'Build milestone',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Hybrid retrieval + reranking with a documented comparison report'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Draft benchmark evaluation report comparing Dense-only vs Hybrid vs Hybrid+Reranker.',
        expectedOutcome: 'Demonstrable improvement in retrieval metrics (Recall@5 and MRR).',
        deliverable: 'docs/hybrid_reranking_benchmark_report.pdf and Week 7 assessment submission.'
      }
    ]
  },
  {
    number: 8,
    title: 'Evaluation, testing and quality gates',
    pdfPages: 'Page 10',
    startDay: 99,
    endDay: 112,
    days: [
      {
        dayOffset: 0,
        topic: 'Evaluation dataset',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Representative questions', 'Expected facts', 'Relevant source IDs', 'Unanswerable questions'],
        output: 'Study notes + working exercise for evaluation dataset.',
        practicalTask: 'Author 50 question-answer pairs with verified chunk IDs and 10 intentionally unanswerable trap questions.',
        expectedOutcome: 'Golden benchmark dataset representing real enterprise queries.',
        deliverable: 'evaluation/datasets/golden_eval_v1.json.'
      },
      {
        dayOffset: 1,
        topic: 'Dataset quality',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Coverage', 'Realistic user questions', 'Positive and negative examples', 'Version the dataset'],
        output: 'Study notes + working exercise for dataset quality.',
        practicalTask: 'Review dataset distribution: short vs long queries, keyword vs natural language, single-doc vs multi-doc.',
        expectedOutcome: 'High-diversity evaluation corpus without synthetic shortcut bias.',
        deliverable: 'evaluation/datasets/dataset_schema.py.'
      },
      {
        dayOffset: 2,
        topic: 'Recall@K',
        focusType: 'Integrate with the current application',
        subtopics: ['Relevant items retrieved within top K', 'Calculate and interpret'],
        output: 'Study notes + working exercise for recall@k.',
        practicalTask: 'Write script calculating Recall@1, Recall@3, Recall@5, and Recall@10 across test queries.',
        expectedOutcome: 'Mathematical formula implementation: (Relevant_Retrieved_in_K) / (Total_Relevant).',
        deliverable: 'src/evaluation/metrics/recall_at_k.py.'
      },
      {
        dayOffset: 3,
        topic: 'Precision@K',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Share of top-K results that are relevant', 'Calculate and interpret'],
        output: 'Study notes + working exercise for precision@k.',
        practicalTask: 'Implement Precision@K metric: (Relevant_Retrieved_in_K) / K.',
        expectedOutcome: 'Measure how much noise or irrelevant context is pushed into the LLM context window.',
        deliverable: 'src/evaluation/metrics/precision_at_k.py.'
      },
      {
        dayOffset: 4,
        topic: 'MRR',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Reciprocal rank of first relevant result', 'Compare systems'],
        output: 'Study notes + working exercise for mrr.',
        practicalTask: 'Calculate Mean Reciprocal Rank (MRR): (1/|Q|) * sum(1 / rank_i).',
        expectedOutcome: 'Quantify how high the first correct citation appears in the ranked results.',
        deliverable: 'src/evaluation/metrics/mrr.py.'
      },
      {
        dayOffset: 5,
        topic: 'nDCG',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Rank-sensitive relevance metric', 'Graded relevance', 'Compare ranked lists'],
        output: 'Study notes + working exercise for ndcg.',
        practicalTask: 'Implement normalized Discounted Cumulative Gain (nDCG@K) supporting graded relevance (0=irrelevant, 1=partial, 2=exact).',
        expectedOutcome: 'Gold standard ranking quality metric with logarithmic position discounting.',
        deliverable: 'src/evaluation/metrics/ndcg.py.'
      },
      {
        dayOffset: 6,
        topic: 'Generation evaluation',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Faithfulness', 'Answer relevance', 'Context precision', 'Context recall'],
        output: 'Study notes + working exercise for generation evaluation.',
        practicalTask: 'Implement Faithfulness check: decompose answer into claims and verify each claim is entailed by context.',
        expectedOutcome: 'Automated hallucination detection rate calculated per generation run.',
        deliverable: 'src/evaluation/metrics/faithfulness.py.'
      },
      {
        dayOffset: 7,
        topic: 'Evaluation tooling',
        focusType: 'Integrate with the current application',
        subtopics: ['Ragas or equivalent', 'Metric inputs', 'Limitations', 'Reproducible runs'],
        output: 'Study notes + working exercise for evaluation tooling.',
        practicalTask: 'Integrate Ragas framework pipeline executing batch evaluation over golden dataset.',
        expectedOutcome: 'Reproducible CI/CD evaluation run generating metrics report JSON and markdown summary.',
        deliverable: 'evaluation/run_ragas_eval.py.'
      },
      {
        dayOffset: 8,
        topic: 'Unit testing',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Chunking', 'Metadata', 'Prompt construction', 'Citation mapping'],
        output: 'Study notes + working exercise for unit testing.',
        practicalTask: 'Write isolated unit tests for text splitting, citation regex parsing, and token budget calculation.',
        expectedOutcome: 'Fast unit test suite executing in under 5 seconds with zero external dependencies.',
        deliverable: 'tests/unit/test_chunking.py and test_citations.py.'
      },
      {
        dayOffset: 9,
        topic: 'Integration testing',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Upload → index → retrieve → answer', 'Verify full flow'],
        output: 'Study notes + working exercise for integration testing.',
        practicalTask: 'Build end-to-end integration test creating a temporary workspace, ingesting test doc, asking question, asserting answer.',
        expectedOutcome: 'Automated verification that all pipeline components function synchronously.',
        deliverable: 'tests/integration/test_rag_pipeline.py.'
      },
      {
        dayOffset: 10,
        topic: 'API testing',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Request validation', 'Auth', 'Permissions', 'Success/error status codes'],
        output: 'Study notes + working exercise for api testing.',
        practicalTask: 'Write TestClient tests covering all 14 core API endpoints with valid, expired, and missing tokens.',
        expectedOutcome: 'Complete API contract compliance verified automatically.',
        deliverable: 'tests/api/test_endpoints.py.'
      },
      {
        dayOffset: 11,
        topic: 'Regression evaluation',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Compare prompt/model/chunking changes against fixed dataset', 'Track regressions'],
        output: 'Study notes + working exercise for regression evaluation.',
        practicalTask: 'Implement regression gate: fail build if Faithfulness drops >2% or Recall@5 drops >3% vs baseline.',
        expectedOutcome: 'Prevent silent quality degradations when updating system prompts or chunk sizes.',
        deliverable: 'evaluation/quality_gate_check.py.'
      },
      {
        dayOffset: 12,
        topic: 'Failure analysis',
        focusType: 'Module integration and milestone',
        subtopics: ['Separate parsing, retrieval, reranking and generation failures'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Build failure diagnostic report classifying errors into: OCR failed, Wrong chunks retrieved, Model hallucinated, or Incomplete answer.',
        expectedOutcome: 'Clear root-cause analysis distinguishing retrieval failures from generation failures.',
        deliverable: 'evaluation/failure_taxonomy_report.md.'
      },
      {
        dayOffset: 13,
        topic: 'Build milestone',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Repeatable evaluation suite', 'Baseline report', 'Admin/developer quality view'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Deploy evaluation dashboard in admin console showing latest Ragas metrics and trend graph.',
        expectedOutcome: 'Evaluation suite operating reliably on scheduled cadence.',
        deliverable: 'Module 8 evaluation milestone and Week 8 assessment submission.'
      }
    ]
  },
  {
    number: 9,
    title: 'Security, reliability and performance',
    pdfPages: 'Page 11',
    startDay: 113,
    endDay: 126,
    days: [
      {
        dayOffset: 0,
        topic: 'Tenant isolation',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Tenant isolation in every retrieval path', 'Enforce server-side boundaries'],
        output: 'Study notes + working exercise for tenant isolation.',
        practicalTask: 'Audit all SQL queries, vector filters, and cache keys to ensure tenant_id is strictly parameterized.',
        expectedOutcome: 'Zero chance of multi-tenant cross-contamination.',
        deliverable: 'security/tenant_isolation_audit.md.'
      },
      {
        dayOffset: 1,
        topic: 'Document ACL',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Document-level access control', 'Permission metadata', 'Authorize before retrieval results reach model'],
        output: 'Study notes + working exercise for document acl.',
        practicalTask: 'Implement document-level access permissions (PUBLIC, WORKSPACE, CONFIDENTIAL); filter chunks during vector retrieval.',
        expectedOutcome: 'User only sees answers generated from documents they have explicit permission to read.',
        deliverable: 'src/rag/security/acl_filter.py.'
      },
      {
        dayOffset: 2,
        topic: 'Prompt injection',
        focusType: 'Integrate with the current application',
        subtopics: ['User-question injection', 'Untrusted document content', 'Retrieved text is data, not instructions'],
        output: 'Study notes + working exercise for prompt injection.',
        practicalTask: 'Implement delimiter tagging and system prompt hardening: wrap context in <untrusted_document_context> XML tags.',
        expectedOutcome: 'Defense against indirect prompt injection embedded inside malicious uploaded PDFs.',
        deliverable: 'src/rag/security/injection_defense.py and penetration test suite.'
      },
      {
        dayOffset: 3,
        topic: 'Secrets management',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Environment variables', 'Secret manager', 'Least-privilege credentials', 'Never commit secrets'],
        output: 'Study notes + working exercise for secrets management.',
        practicalTask: 'Integrate AWS Secrets Manager / GCP Secret Manager / Vault; scan repo with git-secrets / TruffleHog.',
        expectedOutcome: 'Zero credentials or keys in git; dynamic secret rotation supported.',
        deliverable: 'scripts/verify_no_secrets.sh.'
      },
      {
        dayOffset: 4,
        topic: 'Transport and identity security',
        focusType: 'Explain the design and record evidence',
        subtopics: ['HTTPS/TLS', 'Protected endpoints', 'Safe service identity'],
        output: 'Study notes + working exercise for transport and identity security.',
        practicalTask: 'Enforce HTTPS redirect, HSTS headers, secure HTTP-only cookies, and internal service-to-service mTLS.',
        expectedOutcome: 'Encrypted communication in transit; credentials protected from man-in-the-middle attacks.',
        deliverable: 'src/api/middleware/security_headers.py.'
      },
      {
        dayOffset: 5,
        topic: 'Rate limiting and quotas',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Rate limits', 'Upload quotas', 'Request-size limits', 'Expensive-operation controls'],
        output: 'Study notes + working exercise for rate limiting and quotas.',
        practicalTask: 'Implement Redis token bucket rate limiter: 60 requests/minute for chat, 10 uploads/hour per user.',
        expectedOutcome: 'Protection against DoS attacks, API exhaustion, and budget overruns.',
        deliverable: 'src/api/middleware/rate_limiter.py.'
      },
      {
        dayOffset: 6,
        topic: 'Timeouts and retries',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Timeouts', 'Retries with backoff', 'Provider failure handling', 'Avoid retry storms'],
        output: 'Study notes + working exercise for timeouts and retries.',
        practicalTask: 'Implement circuit breaker pattern for LLM API calls with exponential backoff and jitter.',
        expectedOutcome: 'Prevent cascading system crashes when external LLM provider experiences 503 or latency spikes.',
        deliverable: 'src/core/resilience/circuit_breaker.py.'
      },
      {
        dayOffset: 7,
        topic: 'Caching safely',
        focusType: 'Integrate with the current application',
        subtopics: ['Cache only safe data', 'Avoid cross-user and permission-sensitive leakage'],
        output: 'Study notes + working exercise for caching safely.',
        practicalTask: 'Implement semantic cache with composite key: hash(tenant_id + user_permissions_hash + normalized_query).',
        expectedOutcome: 'Sub-millisecond responses for repeated queries without leaking confidential answers across users.',
        deliverable: 'src/rag/cache/semantic_cache.py.'
      },
      {
        dayOffset: 8,
        topic: 'Upload security',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Validate file size/type/content', 'Safe filenames', 'Path traversal defense'],
        output: 'Study notes + working exercise for upload security.',
        practicalTask: 'Implement PDF zip bomb defense, sanitize file extensions, and disallow executable or macro-enabled documents.',
        expectedOutcome: 'Zero file upload attack vectors.',
        deliverable: 'src/services/upload_security.py.'
      },
      {
        dayOffset: 9,
        topic: 'Reliability scenarios',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Provider outage', 'Invalid upload', 'Queue failure', 'Job retry', 'Idempotency'],
        output: 'Study notes + working exercise for reliability scenarios.',
        practicalTask: 'Execute chaos engineering drill: inject 50% simulated LLM timeouts and verify queue gracefully handles retries.',
        expectedOutcome: 'Documented disaster recovery procedure and verified automated healing.',
        deliverable: 'docs/chaos_test_reliability_report.md.'
      },
      {
        dayOffset: 10,
        topic: 'Performance scenarios',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Concurrency', 'Large files', 'Long answers', 'Provider rate limits'],
        output: 'Study notes + working exercise for performance scenarios.',
        practicalTask: 'Profile slow queries with pg_stat_statements; optimize vector index HNSW ef_search for <50ms retrieval.',
        expectedOutcome: 'High throughput and predictable latency under concurrent multi-user load.',
        deliverable: 'performance/db_query_optimization.sql.'
      },
      {
        dayOffset: 11,
        topic: 'Load testing',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Representative API/retrieval traffic', 'Workload assumptions', 'Throughput', 'Latency', 'Bottlenecks'],
        output: 'Study notes + working exercise for load testing.',
        practicalTask: 'Run Locust / k6 load test simulating 50 concurrent active users asking questions and downloading citations.',
        expectedOutcome: 'Identify system p95 and p99 latency thresholds and system breaking point.',
        deliverable: 'performance/locustfile.py and load_test_report.pdf.'
      },
      {
        dayOffset: 12,
        topic: 'Operational limitations',
        focusType: 'Module integration and milestone',
        subtopics: ['Document known limitations', 'Stable errors', 'Access-denied states'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Document system capacity boundaries: max document size 50MB, max workspace docs 10,000, max tokens/query 4000.',
        expectedOutcome: 'Honest, transparent operational bounds preventing unexpected production degradation.',
        deliverable: 'docs/operational_limits_and_slas.md.'
      },
      {
        dayOffset: 13,
        topic: 'Build milestone',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Security/reliability hardening report', 'Automated access-control tests pass'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Execute full security penetration test suite and generate compliance signoff report.',
        expectedOutcome: 'Pass all security acceptance targets defined on source Page 8.',
        deliverable: 'Module 9 signoff report and Week 9 assessment submission.'
      }
    ]
  },
  {
    number: 10,
    title: 'Observability, cost and operational controls',
    pdfPages: 'Page 12',
    startDay: 127,
    endDay: 140,
    days: [
      {
        dayOffset: 0,
        topic: 'Structured logging',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Request logs', 'Useful event fields', 'Safe logging', 'Avoid sensitive content leakage'],
        output: 'Study notes + working exercise for structured logging.',
        practicalTask: 'Implement JSON structured logging with timestamp, trace_id, user_id, tenant_id, path, and duration_ms.',
        expectedOutcome: 'Zero PII, passwords, or raw document content leaked into application logs.',
        deliverable: 'src/core/logging/json_logger.py.'
      },
      {
        dayOffset: 1,
        topic: 'Traceability',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Trace IDs', 'Trace a browser request through API, worker, retrieval and model'],
        output: 'Study notes + working exercise for traceability.',
        practicalTask: 'Implement distributed trace ID middleware (X-Trace-Id) propagating from React client to API, Redis worker, and vector store.',
        expectedOutcome: 'Trace any user question end-to-end to inspect exact chunks retrieved and model parameters.',
        deliverable: 'src/core/telemetry/tracer.py.'
      },
      {
        dayOffset: 2,
        topic: 'Operational metrics',
        focusType: 'Integrate with the current application',
        subtopics: ['API errors', 'Queue backlog', 'Latency', 'Provider failures'],
        output: 'Study notes + working exercise for operational metrics.',
        practicalTask: 'Export Prometheus metrics: http_requests_total, rag_query_duration_seconds, celery_queue_length, llm_token_count.',
        expectedOutcome: 'Real-time operational observability for operations and engineering teams.',
        deliverable: 'src/core/telemetry/prometheus_exporter.py.'
      },
      {
        dayOffset: 3,
        topic: 'Dashboards',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Operational dashboard', 'Ingestion health', 'Request and provider status'],
        output: 'Study notes + working exercise for dashboards.',
        practicalTask: 'Build Grafana / in-app admin dashboard displaying system health, throughput, latency percentiles, and error rate.',
        expectedOutcome: 'Single-pane-of-glass operational visibility.',
        deliverable: 'src/components/admin/OperationalDashboard.tsx.'
      },
      {
        dayOffset: 4,
        topic: 'Alerts',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Alert conditions for errors, backlog, latency and provider failures'],
        output: 'Study notes + working exercise for alerts.',
        practicalTask: 'Configure alert rules: Trigger warning if error rate >2% for 5 mins, or queue backlog >100 items.',
        expectedOutcome: 'Actionable alerts alerting on-call engineers before user impact occurs.',
        deliverable: 'infra/alerting_rules.yml.'
      },
      {
        dayOffset: 5,
        topic: 'Usage accounting',
        focusType: 'Learn concepts and make notes',
        subtopics: ['LLM input/output tokens', 'Embedding usage', 'Usage per tenant'],
        output: 'Study notes + working exercise for usage accounting.',
        practicalTask: 'Record every token used: input_tokens, output_tokens, embedding_tokens attributed to tenant_id and user_id.',
        expectedOutcome: 'Accurate multi-tenant billing and internal usage accounting.',
        deliverable: 'src/services/usage_accounting.py.'
      },
      {
        dayOffset: 6,
        topic: 'Cost estimation',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Cost per question', 'Embedding cost', 'Storage and compute', 'Cost per tenant'],
        output: 'Study notes + working exercise for cost estimation.',
        practicalTask: 'Build cost calculator: compute exact dollar cost per query based on token pricing and vector compute.',
        expectedOutcome: 'Understand economics of RAG: cost per query typically $0.002 - $0.015.',
        deliverable: 'src/services/cost_calculator.py.'
      },
      {
        dayOffset: 7,
        topic: 'Budget controls',
        focusType: 'Integrate with the current application',
        subtopics: ['Usage quotas', 'Cost visibility', 'Identify expensive workflows'],
        output: 'Study notes + working exercise for budget controls.',
        practicalTask: 'Enforce tenant monthly dollar budget limit; reject non-essential requests once 95% quota reached.',
        expectedOutcome: 'Prevent unexpected cloud billing disasters.',
        deliverable: 'src/services/budget_guard.py.'
      },
      {
        dayOffset: 8,
        topic: 'Latency measures',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['API latency', 'Retrieval latency', 'Time-to-first-token', 'Total answer time'],
        output: 'Study notes + working exercise for latency measures.',
        practicalTask: 'Measure and record latency waterfall: parsing (500ms) → embedding (80ms) → vector search (45ms) → TTFT (300ms) → total stream (2.1s).',
        expectedOutcome: 'Clear understanding of latency bottlenecks across the RAG lifecycle.',
        deliverable: 'docs/rag_latency_waterfall.md.'
      },
      {
        dayOffset: 9,
        topic: 'Queue operations',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Queue health', 'Failed jobs', 'Retry and recovery visibility'],
        output: 'Study notes + working exercise for queue operations.',
        practicalTask: 'Build dead-letter queue management screen allowing admin to inspect failed jobs and trigger manual retry.',
        expectedOutcome: 'Zero lost ingestion jobs during worker crashes.',
        deliverable: 'src/components/admin/QueueManager.tsx.'
      },
      {
        dayOffset: 10,
        topic: 'Backup strategy',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Relational database backups', 'Object storage backups', 'Vector index rebuild strategy'],
        output: 'Study notes + working exercise for backup strategy.',
        practicalTask: 'Define automated backup plan: daily Postgres pg_dump, S3 versioning, and cold vector index rebuild script.',
        expectedOutcome: 'Disaster recovery plan with Recovery Point Objective (RPO) < 24h and Recovery Time Objective (RTO) < 2h.',
        deliverable: 'scripts/backup_postgres.sh.'
      },
      {
        dayOffset: 11,
        topic: 'Restore and recovery',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Restore drill', 'Rebuild vector index', 'Validate recovered application'],
        output: 'Study notes + working exercise for restore and recovery.',
        practicalTask: 'Execute full disaster recovery drill: wipe local database, restore from backup, re-index vector store, run smoke test.',
        expectedOutcome: 'Proven recovery procedure tested in practice, not just theoretical documentation.',
        deliverable: 'docs/disaster_recovery_drill_evidence.md.'
      },
      {
        dayOffset: 12,
        topic: 'Runbooks',
        focusType: 'Module integration and milestone',
        subtopics: ['Operational procedures', 'Incident diagnosis', 'Provider outage and queue recovery'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Write clear standard operating procedure (SOP) runbooks for: High Error Rate, Queue Jam, Vector Search Failure, LLM Outage.',
        expectedOutcome: 'Operational clarity for on-call personnel during incidents.',
        deliverable: 'docs/runbooks/ directory with 4 operational SOPs.'
      },
      {
        dayOffset: 13,
        topic: 'Build milestone',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Operational dashboard', 'Traceable requests', 'Usage and cost report'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Verify in-app admin screen displays real token counts, estimated dollar costs, and trace IDs.',
        expectedOutcome: 'Observability and operational control milestone complete.',
        deliverable: 'Module 10 signoff and Week 10 assessment submission.'
      }
    ]
  },
  {
    number: 11,
    title: 'Deployment and CI/CD',
    pdfPages: 'Page 13',
    startDay: 141,
    endDay: 154,
    days: [
      {
        dayOffset: 0,
        topic: 'Deployment architecture',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Frontend, backend, worker, database, object storage and vector store deployment boundaries'],
        output: 'Study notes + working exercise for deployment architecture.',
        practicalTask: 'Draw production deployment topology diagram: Cloud Run / ECS / K8s, RDS Postgres, Qdrant Cloud, S3.',
        expectedOutcome: 'Clear isolation of stateless web/API nodes from stateful databases and asynchronous background workers.',
        deliverable: 'docs/production_deployment_topology.png.'
      },
      {
        dayOffset: 1,
        topic: 'Containerization',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Docker basics for app services', 'Reproducible runtime configuration'],
        output: 'Study notes + working exercise for containerization.',
        practicalTask: 'Write multi-stage Dockerfiles for React frontend (nginx) and Python FastAPI backend (uvicorn non-root user).',
        expectedOutcome: 'Minimal container image sizes (<150MB) and non-root security compliance.',
        deliverable: 'Dockerfile.backend and Dockerfile.frontend.'
      },
      {
        dayOffset: 2,
        topic: 'Environment separation',
        focusType: 'Integrate with the current application',
        subtopics: ['Development/staging/production configuration', 'Secrets per environment'],
        output: 'Study notes + working exercise for environment separation.',
        practicalTask: 'Configure distinct dev, staging, and prod environment profiles with dedicated databases and isolated storage buckets.',
        expectedOutcome: 'Zero risk of staging tests affecting production customer data.',
        deliverable: 'infra/environments/ directory with terraform/compose files.'
      },
      {
        dayOffset: 3,
        topic: 'Database deployment',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Production PostgreSQL', 'Migrations', 'Connectivity and backups'],
        output: 'Study notes + working exercise for database deployment.',
        practicalTask: 'Set up managed PostgreSQL with connection pooler (PgBouncer), automated backups, and SSL encryption enforced.',
        expectedOutcome: 'High-availability database configuration with automated point-in-time recovery.',
        deliverable: 'infra/postgres_config.sql.'
      },
      {
        dayOffset: 4,
        topic: 'Storage and worker deployment',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Object storage configuration', 'Background worker process', 'Queue connectivity'],
        output: 'Study notes + working exercise for storage and worker deployment.',
        practicalTask: 'Deploy Celery workers as dedicated auto-scaling container services connected to managed Redis.',
        expectedOutcome: 'Worker instances scale dynamically based on ingestion queue length.',
        deliverable: 'docker-compose.prod.yml with worker service.'
      },
      {
        dayOffset: 5,
        topic: 'Vector service deployment',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Qdrant or pgvector deployment', 'Persistence', 'Connectivity', 'Backup/rebuild plan'],
        output: 'Study notes + working exercise for vector service deployment.',
        practicalTask: 'Deploy persistent vector database with snapshot volume backups and health probes.',
        expectedOutcome: 'Vector search uptime decoupled from API restarts; snapshot persistence verified.',
        deliverable: 'infra/qdrant_service.yml.'
      },
      {
        dayOffset: 6,
        topic: 'CI workflow',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Automated checks', 'Lint/test/build', 'Pull-request validation'],
        output: 'Study notes + working exercise for ci workflow.',
        practicalTask: 'Set up GitHub Actions CI workflow executing ruff, mypy, tsc, pytest, and docker build on every pull request.',
        expectedOutcome: 'Automated quality gate blocking broken code from merging to main branch.',
        deliverable: '.github/workflows/ci.yml.'
      },
      {
        dayOffset: 7,
        topic: 'CD workflow',
        focusType: 'Integrate with the current application',
        subtopics: ['Controlled deployment', 'Environment configuration', 'Release process'],
        output: 'Study notes + working exercise for cd workflow.',
        practicalTask: 'Configure CD pipeline: automatically deploy passing main branch to staging, manual approval for production.',
        expectedOutcome: 'Repeatable, zero-downtime deployment process with blue/green or rolling updates.',
        deliverable: '.github/workflows/cd.yml.'
      },
      {
        dayOffset: 8,
        topic: 'HTTPS and domain',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Public HTTPS URL', 'TLS', 'Domain and allowed-origin configuration'],
        output: 'Study notes + working exercise for https and domain.',
        practicalTask: 'Provision TLS certificate via Let’s Encrypt / Cloudflare; configure custom domain with strict A+ SSL rating.',
        expectedOutcome: 'Secure public HTTPS URL with automated TLS renewal.',
        deliverable: 'infra/caddy_or_nginx.conf with TLS certificate rules.'
      },
      {
        dayOffset: 9,
        topic: 'Health checks',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Health endpoint', 'Service readiness', 'Dependency checks'],
        output: 'Study notes + working exercise for health checks.',
        practicalTask: 'Implement liveness (/healthz) and readiness (/readyz) probes checking database, Redis, and vector store.',
        expectedOutcome: 'Orchestrator routes traffic only to healthy instances; restarts deadlocked workers.',
        deliverable: 'src/api/routes/probes.py.'
      },
      {
        dayOffset: 10,
        topic: 'Monitoring after release',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Logs', 'Metrics', 'Alerts', 'Provider/queue failure observation'],
        output: 'Study notes + working exercise for monitoring after release.',
        practicalTask: 'Verify cloud logging and alerting in production environment; trigger synthetic test probe every 60 seconds.',
        expectedOutcome: 'Immediate notification via Slack / Email if API endpoint fails.',
        deliverable: 'infra/monitoring_synthetic_prober.py.'
      },
      {
        dayOffset: 11,
        topic: 'Rollback',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Release rollback', 'Database migration caution', 'Recovery plan'],
        output: 'Study notes + working exercise for rollback.',
        practicalTask: 'Execute rollback test: revert deployment to previous container digest within 60 seconds; handle DB backward compatibility.',
        expectedOutcome: 'Documented rollback procedure avoiding catastrophic data loss during faulty releases.',
        deliverable: 'docs/release_rollback_procedure.md.'
      },
      {
        dayOffset: 12,
        topic: 'Clean environment test',
        focusType: 'Module integration and milestone',
        subtopics: ['Bring up application from documented steps', 'Verify secrets/configuration and setup'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Clone repository onto clean VM/machine; execute setup guide word-for-word; verify full bootup.',
        expectedOutcome: 'Documentation is completely self-sufficient; zero missing environment variables.',
        deliverable: 'docs/clean_install_verification_log.md.'
      },
      {
        dayOffset: 13,
        topic: 'Build milestone',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Public HTTPS deployment with real login, upload and chat workflows'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Verify live public URL with working login, file upload, indexing, and chat streaming.',
        expectedOutcome: 'Deployed production product fully verified on public web.',
        deliverable: 'Module 11 deployment signoff and Week 11 assessment submission.'
      }
    ]
  },
  {
    number: 12,
    title: 'Capstone, load testing and handover',
    pdfPages: 'Page 14',
    startDay: 155,
    endDay: 168,
    days: [
      {
        dayOffset: 0,
        topic: 'Capstone scope',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Enterprise AI Knowledge Assistant', 'Internal policies, product manuals, technical documentation and process guides'],
        output: 'Study notes + working exercise for capstone scope.',
        practicalTask: 'Finalize enterprise scenario: multi-department employee knowledge portal covering HR, Engineering, and Compliance.',
        expectedOutcome: 'Comprehensive scope definition matching enterprise production standards.',
        deliverable: 'docs/capstone_specification.md.'
      },
      {
        dayOffset: 1,
        topic: 'Login/registration screen',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Sign in', 'Validation', 'Logout', 'Protected-route behavior'],
        output: 'Study notes + working exercise for login/registration screen.',
        practicalTask: 'Polish authentication screen: password show/hide, remember me, error handling, clean branding.',
        expectedOutcome: 'Production-grade login UX with zero visual defects.',
        deliverable: 'src/components/auth/AuthScreen.tsx.'
      },
      {
        dayOffset: 2,
        topic: 'Workspace dashboard',
        focusType: 'Integrate with the current application',
        subtopics: ['Create/select workspace', 'Document totals', 'Ingestion health'],
        output: 'Study notes + working exercise for workspace dashboard.',
        practicalTask: 'Build workspace switcher with document count cards, total indexed tokens, and ingestion health widget.',
        expectedOutcome: 'Intuitive multi-workspace navigation for different departments.',
        deliverable: 'src/components/workspace/WorkspaceDashboard.tsx.'
      },
      {
        dayOffset: 3,
        topic: 'Document manager',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Upload', 'List', 'Filter', 'Inspect status', 'Retry', 'Delete', 'Supported formats'],
        output: 'Study notes + working exercise for document manager.',
        practicalTask: 'Polish document manager: multi-file upload, search filter, status badges, chunk inspection modal, delete confirmation.',
        expectedOutcome: 'Robust document management with immediate UI responsiveness.',
        deliverable: 'src/components/documents/DocumentManager.tsx.'
      },
      {
        dayOffset: 4,
        topic: 'Chat workspace',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Ask questions', 'Stream responses', 'Stop generation', 'Citations', 'Source snippets'],
        output: 'Study notes + working exercise for chat workspace.',
        practicalTask: 'Polish chat screen: real-time streaming tokens, markdown table support, copy-to-clipboard, citation preview popover.',
        expectedOutcome: 'Executive-level chat experience matching ChatGPT / Claude interface fidelity.',
        deliverable: 'src/components/chat/ProductionChat.tsx.'
      },
      {
        dayOffset: 5,
        topic: 'Conversation history',
        focusType: 'Learn concepts and make notes',
        subtopics: ['List', 'Reopen', 'Rename', 'Delete sessions'],
        output: 'Study notes + working exercise for conversation history.',
        practicalTask: 'Implement session management: list historical chats by date, inline rename title, delete chat session.',
        expectedOutcome: 'Full chat history continuity across browser sessions.',
        deliverable: 'src/components/chat/ConversationHistorySidebar.tsx.'
      },
      {
        dayOffset: 6,
        topic: 'Admin/usage screen',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['User/tenant usage', 'Token counts', 'Estimated cost', 'System status', 'Role protection'],
        output: 'Study notes + working exercise for admin/usage screen.',
        practicalTask: 'Build admin console with role protection: show user breakdown, tokens consumed, estimated cost, system health indicators.',
        expectedOutcome: 'Enterprise administrative governance and cost visibility.',
        deliverable: 'src/components/admin/AdminUsageConsole.tsx.'
      },
      {
        dayOffset: 7,
        topic: 'End-to-end journey',
        focusType: 'Integrate with the current application',
        subtopics: ['Sign in → workspace → upload → processing → ask → cited answer → history'],
        output: 'Study notes + working exercise for end-to-end journey.',
        practicalTask: 'Walk through complete user journey with demo persona; verify zero glitches or latency hiccups.',
        expectedOutcome: 'Flawless execution of all 6 user journeys specified in capstone requirements.',
        deliverable: 'docs/e2e_user_journey_test_recording.md.'
      },
      {
        dayOffset: 8,
        topic: 'Load-test report',
        focusType: 'Test, debug and handle failure cases',
        subtopics: ['Representative workload', 'Throughput', 'Latency', 'Bottlenecks', 'Assumptions'],
        output: 'Study notes + working exercise for load-test report.',
        practicalTask: 'Execute final load test: document throughput (docs/min), chat response p95 latency under 100 RPS.',
        expectedOutcome: 'Comprehensive load test report with clear bottleneck identification.',
        deliverable: 'docs/final_load_test_report.pdf.'
      },
      {
        dayOffset: 9,
        topic: 'Evaluation evidence',
        focusType: 'Explain the design and record evidence',
        subtopics: ['Dataset', 'Metrics', 'Baseline', 'Improvement', 'Failure analysis'],
        output: 'Study notes + working exercise for evaluation evidence.',
        practicalTask: 'Compile final evaluation evidence pack: Ragas metrics table, baseline vs final comparisons, failure taxonomy.',
        expectedOutcome: 'Quantitative proof of high retrieval quality (MRR > 0.85, Faithfulness > 0.90).',
        deliverable: 'evaluation/final_evaluation_evidence_pack.pdf.'
      },
      {
        dayOffset: 10,
        topic: 'Security evidence',
        focusType: 'Learn concepts and make notes',
        subtopics: ['Negative access tests', 'Injection tests', 'Upload validation', 'Secret handling'],
        output: 'Study notes + working exercise for security evidence.',
        practicalTask: 'Assemble security test evidence: automated test run logs proving zero cross-tenant leakage and injection resistance.',
        expectedOutcome: 'Complete security signoff audit trail.',
        deliverable: 'security/final_security_audit_evidence.pdf.'
      },
      {
        dayOffset: 11,
        topic: 'Documentation',
        focusType: 'Guided implementation / hands-on practice',
        subtopics: ['Architecture diagram requirement', 'ER diagram requirement', 'OpenAPI/Swagger', 'Endpoint notes', 'Setup guide', 'Runbooks'],
        output: 'Study notes + working exercise for documentation.',
        practicalTask: 'Compile all architecture diagrams, ER diagrams, OpenAPI specs, and setup instructions into clean docs portal.',
        expectedOutcome: 'Comprehensive engineering documentation for seamless handover.',
        deliverable: 'docs/complete_system_documentation.pdf.'
      },
      {
        dayOffset: 12,
        topic: 'Demo and handover',
        focusType: 'Module integration and milestone',
        subtopics: ['Live URL', 'Demo account with non-sensitive sample data', 'Recorded demo/live walkthrough'],
        output: 'Complete the module milestone and run its acceptance checks.',
        practicalTask: 'Prepare live URL with demo credentials, populate with sample company policy PDFs, record 10-minute demo walkthrough.',
        expectedOutcome: 'Professional executive presentation demonstrating full capstone functionality.',
        deliverable: 'demo/recorded_walkthrough_link.txt and demo_credentials.md.'
      },
      {
        dayOffset: 13,
        topic: 'Build milestone',
        focusType: 'Review, assessment preparation and consolidation',
        subtopics: ['Complete deployed product demonstrated from sign-in to cited answer', 'Final handover pack'],
        output: 'Update README/notes; explain the end-to-end flow; list mistakes and fixes.',
        practicalTask: 'Package complete final submission pack conforming to source Page 9 specifications.',
        expectedOutcome: 'Full capstone project milestone completed and verified.',
        deliverable: 'Module 12 final capstone submission and Week 12 assessment.'
      }
    ]
  },
  {
    number: 13,
    title: 'Source-Requirements, Integration and Handover',
    pdfPages: 'Page 15',
    startDay: 169,
    endDay: 180,
    days: [
      {
        dayOffset: 0,
        topic: 'API contract — endpoint inventory',
        focusType: 'Source requirement audit and verification',
        subtopics: ['Read every endpoint group in the source API contract', 'Identify method, path, auth requirement, request/response responsibility and error behavior', 'Reproduce the source endpoint list exactly in your API notes'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Verify exact compliance with all 14 endpoints listed in source Page 16 contract.',
        expectedOutcome: '100% API contract compliance with zero missing endpoints.',
        deliverable: 'docs/audit/api_endpoint_inventory_audit.md.'
      },
      {
        dayOffset: 1,
        topic: 'API implementation and documentation',
        focusType: 'Implementation and OpenAPI validation',
        subtopics: ['Implement the source endpoint contract in FastAPI', 'Validate request/response schemas', 'Expose OpenAPI/Swagger', 'Write concise endpoint notes', 'Test protected and invalid requests'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Audit OpenAPI/Swagger documentation schema descriptions and error response structures.',
        expectedOutcome: 'Fully validated API documentation matching enterprise standards.',
        deliverable: 'openapi.json specification and interactive Swagger UI.'
      },
      {
        dayOffset: 2,
        topic: 'Database entities and relationships',
        focusType: 'Data model audit and relationship verification',
        subtopics: ['Study every source-listed entity and field', 'Map primary/foreign keys, tenant/workspace ownership, document/message relationships and usage records', 'Validate migrations and indexes'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Audit all 10 core entities from source Page 16 in Postgres database and verify relational constraints.',
        expectedOutcome: 'Zero missing fields or orphaned foreign keys across the schema.',
        deliverable: 'docs/audit/database_entity_schema_verification.md.'
      },
      {
        dayOffset: 3,
        topic: 'Vector payload and metadata integrity',
        focusType: 'Vector metadata and isolation audit',
        subtopics: ['Verify tenant_id, workspace_id, document_id, page, section, chunk_index, source and permissions are attached and filtered correctly', 'Test re-ingestion and deletion'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Inspect raw vector store payloads to confirm every chunk contains all 8 mandatory metadata attributes.',
        expectedOutcome: 'Vector payload metadata completeness verified.',
        deliverable: 'scripts/verify_vector_payloads.py.'
      },
      {
        dayOffset: 4,
        topic: 'Recommended stack audit',
        focusType: 'Stack audit and justification checklist',
        subtopics: ['Review the source’s recommended stack by layer', 'Record selected option, reason, cost/operational trade-off and what is deliberately not being adopted'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Audit architecture stack against source Page 16-17; document rationale for each technology choice.',
        expectedOutcome: 'Rigorous engineering justification for frontend, backend, vector store, and queue tools.',
        deliverable: 'docs/audit/recommended_stack_audit.md.'
      },
      {
        dayOffset: 5,
        topic: 'Evaluation evidence audit',
        focusType: 'Quality and evaluation audit',
        subtopics: ['Verify ingestion, retrieval, generation, security, reliability, performance, cost and operations evidence', 'Run the fixed dataset and retain results'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Execute full evaluation harness against test corpus; audit results against source Page 17 evaluation dimensions.',
        expectedOutcome: 'Retain versioned evaluation results proving quantitative system performance.',
        deliverable: 'docs/audit/evaluation_evidence_signoff.md.'
      },
      {
        dayOffset: 6,
        topic: 'Security and acceptance audit',
        focusType: 'Security and acceptance target verification',
        subtopics: ['Test every minimum security requirement and each suggested acceptance target', 'Retain negative tests, citation checks, abstention tests, recovery tests and clean deployment evidence'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Run all 8 minimum security requirement checks and 6 suggested acceptance targets from source Page 17-18.',
        expectedOutcome: '100% compliance with security and acceptance targets.',
        deliverable: 'docs/audit/security_acceptance_audit.md.'
      },
      {
        dayOffset: 7,
        topic: 'Capstone screens — first half',
        focusType: 'UI screen audit: auth, workspace, document manager',
        subtopics: ['Complete login/registration, workspace dashboard and document manager', 'Verify every required action and role boundary'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Verify all actions on screens 1, 2, and 3 from source Page 18: login, workspace selection, document upload/retry/delete.',
        expectedOutcome: 'First three capstone screens pass comprehensive QA checklist.',
        deliverable: 'docs/audit/capstone_screens_part1_qa.md.'
      },
      {
        dayOffset: 8,
        topic: 'Capstone screens — second half',
        focusType: 'UI screen audit: chat, history, admin console',
        subtopics: ['Complete chat workspace, conversation history and admin/usage screens', 'Verify streaming, citations, source snippets, history actions and role protection'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Verify all actions on screens 4, 5, and 6 from source Page 18: streaming chat, citation drawer, session history, admin metrics.',
        expectedOutcome: 'Final three capstone screens pass comprehensive QA checklist.',
        deliverable: 'docs/audit/capstone_screens_part2_qa.md.'
      },
      {
        dayOffset: 9,
        topic: 'Final submission pack',
        focusType: 'Packaging deliverables and artifacts',
        subtopics: ['Prepare live URL, non-sensitive demo account, clean GitHub repository, README, .env.example, setup guide, architecture and ER diagrams, API docs, evaluation report, security evidence, runbook and demo'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Audit all 7 mandatory items of the Final Submission Pack from source Page 18.',
        expectedOutcome: 'Complete, polished delivery pack ready for mentor and stakeholder review.',
        deliverable: 'docs/FINAL_SUBMISSION_PACK.md.'
      },
      {
        dayOffset: 10,
        topic: 'Grading rubric and mentor viva',
        focusType: 'Rubric assessment and mentor defense preparation',
        subtopics: ['Review every grading category and weight from the source', 'Answer mentor questions: explain feature, trace request, identify failures, prove isolation, justify chunking/retrieval/model/database choices, deploy cleanly and diagnose logs'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Simulate defense against all 6 mentor checkpoint questions and evaluate against the 6 rubric categories (100% total).',
        expectedOutcome: 'Mastery of technical explanation, architecture trade-offs, and failure mode analysis.',
        deliverable: 'docs/mentor_viva_defense_transcript.md.'
      },
      {
        dayOffset: 11,
        topic: 'Final end-to-end release rehearsal',
        focusType: 'Final graduation rehearsal and release signoff',
        subtopics: ['From a clean environment: sign in → create/select workspace → upload → inspect processing → ask question → verify cited answer → inspect history/admin usage → demonstrate logs/traces → explain limitations and recovery'],
        output: 'Evidence artifact, tested implementation and explanation.',
        practicalTask: 'Perform complete end-to-end dry run from scratch; celebrate completion of the 180-day preparation journey!',
        expectedOutcome: 'Flawless execution of complete production RAG system.',
        deliverable: 'docs/FINAL_COMPLETION_CERTIFICATE_AND_SIGNOFF.md.'
      }
    ]
  }
];

// Helper to compute ISO date string and DayOfWeek
export function generate180Days(): DaySchedule[] {
  const startDate = new Date(START_DATE_IST); // Day 1, official IST cycle start
  const days: DaySchedule[] = [];
  const dayNames: DaySchedule['dayOfWeek'][] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  for (let i = 0; i < 180; i++) {
    const dayNumber = i + 1;
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = dayNames[currentDate.getUTCDay()]; // UTC matches IST day since 00:00 IST is 18:30 UTC previous day, let's format in IST
    
    // Exact IST date formatting
    const istYear = currentDate.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', year: 'numeric' });
    const istMonth = currentDate.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'short' });
    const istDay = currentDate.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', day: '2-digit' });
    const istWeekday = currentDate.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long' }) as DaySchedule['dayOfWeek'];
    const dateString = `${istDay} ${istMonth} ${istYear}`;
    const isoDate = `${istYear}-${currentDate.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: '2-digit' })}-${istDay}`;

    // Target hours: Mon-Fri = 4h, Sat = 3h (+ 3h assessment), Sun = 3h revision
    const targetHours = (istWeekday === 'Saturday' || istWeekday === 'Sunday') ? 3 : 4;
    const weekNumber = Math.floor(i / 7) + 1;

    // Find corresponding module
    let assignedModule: ModuleDef = rawModules[0];
    let dayIndexInModule = 0;

    for (const mod of rawModules) {
      if (dayNumber >= mod.startDay && dayNumber <= mod.endDay) {
        assignedModule = mod;
        dayIndexInModule = dayNumber - mod.startDay;
        break;
      }
    }

    const dayMeta = assignedModule.days[dayIndexInModule] || {
      topic: `Advanced Review & Implementation Day ${dayNumber}`,
      focusType: 'Deep-dive practice and consolidation',
      subtopics: ['Concept mastery', 'Hands-on coding', 'Test cases', 'Documentation review'],
      output: `Study notes and code artifact for Day ${dayNumber}.`,
      practicalTask: `Implement and test core components for Day ${dayNumber}.`,
      expectedOutcome: `Validated deliverable for Day ${dayNumber}.`,
      deliverable: `Day ${dayNumber} verification report.`
    };

    days.push({
      dayNumber,
      dateString,
      isoDate,
      dayOfWeek: istWeekday,
      weekNumber,
      targetHours,
      moduleNumber: assignedModule.number,
      moduleTitle: assignedModule.title,
      focusType: dayMeta.focusType,
      topic: dayMeta.topic,
      subtopics: dayMeta.subtopics,
      output: dayMeta.output,
      deliverable: dayMeta.deliverable,
      practicalTask: dayMeta.practicalTask,
      expectedOutcome: dayMeta.expectedOutcome,
      revisionTasks: [
        'Review architecture and system flow for today’s topic without reading notes',
        'Verify error cases and edge boundary conditions',
        'Update personal study journal with key insights and questions'
      ],
      pdfPage: assignedModule.number <= 12 ? (assignedModule.number + 2) : 15,
      pdfSection: `Section 2.${assignedModule.number}`
    });
  }

  return days;
}

export const ALL_180_DAYS = generate180Days();

// Retained References accurately extracted from the PDF
export const RETAINED_REFERENCES = {
  contentAudit: {
    totalPages: 20,
    extractedItemsCount: 180 + 56, // 180 days + 56 reference checkpoints
    assignedDaysCount: 180,
    retainedReferenceItemsCount: 56,
    unassignedItemsCount: 0,
    coveragePercentage: 100.0
  },

  twoPipelines: {
    ingestion: 'browser upload → API validation → object storage → background job → text extraction/OCR → cleaning → chunking → metadata/ACL → embeddings → vector DB + relational metadata → UI status',
    qa: 'browser chat → authenticated API → tenant/workspace authorization → query normalization/rewrite → hybrid retrieval → reranking → context assembly → LLM generation → citation mapping/guardrails → streamed UI → trace/usage record',
    criticalRule: 'The frontend calls the authenticated backend; it never calls the LLM provider or vector database directly. Provider keys, database credentials and authorization decisions stay on the server.'
  },

  coreApiEndpoints: [
    { method: 'POST', path: '/api/v1/auth/register', purpose: 'Create user account.', auth: 'Public', status: '201 Created' },
    { method: 'POST', path: '/api/v1/auth/login', purpose: 'Authenticate and return session/token.', auth: 'Public', status: '200 OK' },
    { method: 'GET', path: '/api/v1/me', purpose: 'Return current user and memberships.', auth: 'Bearer Token', status: '200 OK' },
    { method: 'POST', path: '/api/v1/workspaces', purpose: 'Create a knowledge workspace.', auth: 'Bearer Token (Owner/Admin)', status: '201 Created' },
    { method: 'GET', path: '/api/v1/workspaces', purpose: 'List only workspaces the user can access.', auth: 'Bearer Token', status: '200 OK' },
    { method: 'POST', path: '/api/v1/workspaces/{id}/documents', purpose: 'Upload file; return document and ingestion job IDs.', auth: 'Bearer Token (Member+)', status: '202 Accepted' },
    { method: 'GET', path: '/api/v1/workspaces/{id}/documents', purpose: 'List documents and processing states.', auth: 'Bearer Token', status: '200 OK' },
    { method: 'GET', path: '/api/v1/documents/{id}', purpose: 'Get document metadata and status, after ACL check.', auth: 'Bearer Token (ACL checked)', status: '200 OK' },
    { method: 'DELETE', path: '/api/v1/documents/{id}', purpose: 'Delete original, metadata and indexed chunks safely.', auth: 'Bearer Token (Admin/Owner)', status: '204 No Content' },
    { method: 'POST', path: '/api/v1/chat/sessions', purpose: 'Create a conversation.', auth: 'Bearer Token', status: '201 Created' },
    { method: 'POST', path: '/api/v1/chat/sessions/{id}/messages', purpose: 'Submit question; return or stream answer and citations.', auth: 'Bearer Token', status: '200 OK / SSE stream' },
    { method: 'GET', path: '/api/v1/chat/sessions/{id}/messages', purpose: 'Load conversation history.', auth: 'Bearer Token', status: '200 OK' },
    { method: 'GET', path: '/api/v1/usage', purpose: 'Return authorized usage metrics.', auth: 'Bearer Token (Admin)', status: '200 OK' },
    { method: 'GET', path: '/api/v1/admin/health', purpose: 'Admin/operations health summary.', auth: 'Bearer Token (Super Admin)', status: '200 OK' }
  ],

  coreDatabaseEntities: [
    { entity: 'users', fields: ['id', 'email', 'password_hash', 'created_at', 'status'], notes: 'Unique email, hashed passwords with bcrypt/argon2.' },
    { entity: 'tenants / organizations', fields: ['id', 'name', 'plan', 'created_at'], notes: 'Top-level tenant boundary for multi-tenancy.' },
    { entity: 'memberships', fields: ['user_id', 'tenant_id', 'role', 'status'], notes: 'Roles: owner, admin, member.' },
    { entity: 'workspaces', fields: ['id', 'tenant_id', 'name', 'settings', 'created_by'], notes: 'Logical grouping of documents within tenant.' },
    { entity: 'documents', fields: ['id', 'workspace_id', 'uploaded_by', 'filename', 'storage_key', 'mime_type', 'status', 'checksum'], notes: 'Status: queued, processing, indexed, failed.' },
    { entity: 'ingestion_jobs', fields: ['id', 'document_id', 'status', 'attempts', 'error_code', 'started_at', 'completed_at'], notes: 'Tracks asynchronous background processing.' },
    { entity: 'chunks', fields: ['id', 'document_id', 'chunk_index', 'text reference', 'page', 'metadata', 'vector_id'], notes: 'Stores text reference and vector pointer.' },
    { entity: 'chat_sessions', fields: ['id', 'workspace_id', 'user_id', 'title', 'created_at'], notes: 'Conversation sessions linked to workspace and user.' },
    { entity: 'messages', fields: ['id', 'session_id', 'role', 'content', 'citations', 'model', 'token_usage', 'created_at'], notes: 'Role: user, assistant; includes citation arrays.' },
    { entity: 'usage_events', fields: ['id', 'tenant_id', 'user_id', 'request_id', 'tokens', 'estimated_cost', 'latency_ms'], notes: 'Detailed billing and operational telemetry.' }
  ],

  vectorPayloadRequirement: 'Vector payload metadata must include enough information to enforce access filters, at minimum tenant/workspace/document identifiers and any document-level access attributes. Do not rely on frontend filtering for security.',

  recommendedStack: [
    { layer: 'Frontend', choice: 'React + TypeScript', notes: 'Full UI, routing, forms, chat streaming. Streamlit is acceptable for a quick prototype, not the main portfolio product.' },
    { layer: 'Backend', choice: 'Python + FastAPI', notes: 'Typed APIs, async support, validation and OpenAPI docs.' },
    { layer: 'Database', choice: 'PostgreSQL', notes: 'Users, tenants, workspaces, documents, messages and usage.' },
    { layer: 'Vector search', choice: 'Qdrant OR pgvector', notes: 'Pick one first. Learn the other conceptually; compare filtering, operations and scale.' },
    { layer: 'Object storage', choice: 'S3-compatible storage', notes: 'Store original files separately from database records.' },
    { layer: 'Background jobs', choice: 'Celery/RQ + Redis', notes: 'Long-running OCR and ingestion must not block upload requests.' },
    { layer: 'Parsing/OCR', choice: 'PyMuPDF, python-docx, OCR engine', notes: 'Select tools per format; preserve page and section references.' },
    { layer: 'RAG orchestration', choice: 'Direct Python modules first; LangChain/LlamaIndex selectively', notes: 'Understand retrieval and prompt flow rather than hiding everything in a chain.' },
    { layer: 'LLM + embeddings', choice: 'One hosted provider initially', notes: 'Wrap behind provider interfaces; support model replacement and track cost.' },
    { layer: 'Reranking', choice: 'Cross-encoder / reranking API', notes: 'Use only after baseline retrieval evaluation.' },
    { layer: 'Evaluation', choice: 'Ragas + custom retrieval metrics', notes: 'Keep a versioned question/ground-truth dataset.' },
    { layer: 'Tracing', choice: 'Langfuse or equivalent', notes: 'Trace query, retrieval, prompt, model, latency and cost.' },
    { layer: 'Deployment', choice: 'Docker + cloud VM/container service', notes: 'CI/CD, HTTPS, secrets, monitoring and backups.' }
  ],

  earlyMistakesToAvoid: [
    'Do not start with agents, GraphRAG or a complex multi-agent framework before a reliable baseline RAG system exists.',
    'Do not put API keys in React, notebooks committed to GitHub, or client-side environment variables.',
    'Do not process large documents synchronously inside the upload request.',
    'Do not assume top-k vector similarity alone guarantees good answers.',
    'Do not claim production readiness without authorization tests, evaluation data, observability and deployment.',
    'Do not optimize for a huge document count before measuring parsing quality, retrieval quality and realistic workload.'
  ],

  evaluationDimensions: [
    { area: 'Ingestion', measure: 'File success rate, extraction quality, duplicate handling, job retry rate.', evidence: 'Test corpus covering text PDFs, scanned PDFs, DOCX, CSV, empty/corrupt files.' },
    { area: 'Retrieval', measure: 'Recall@K, Precision@K, MRR, nDCG, relevance of top results.', evidence: 'Versioned questions with expected relevant document/chunk IDs.' },
    { area: 'Generation', measure: 'Faithfulness, answer relevance, citation correctness, abstention quality.', evidence: 'Grounded and unanswerable question set; human review of sampled answers.' },
    { area: 'Security', measure: 'Tenant isolation, document ACL, injection resistance, secrets and upload validation.', evidence: 'Negative tests proving unauthorized data cannot be retrieved.' },
    { area: 'Reliability', measure: 'Timeouts, retries, provider outage behaviour, queue recovery, idempotency.', evidence: 'Failure simulation and recovery test report.' },
    { area: 'Performance', measure: 'API latency, retrieval latency, time-to-first-token, total answer time, concurrent load.', evidence: 'Load-test report with workload assumptions.' },
    { area: 'Cost', measure: 'Embedding cost, LLM input/output tokens, cost per question, storage and compute.', evidence: 'Usage dashboard and estimated cost per tenant.' },
    { area: 'Operations', measure: 'Logs, traces, alerting, backups, restore and release rollback.', evidence: 'Trace ID walkthrough, backup restore drill and runbooks.' }
  ],

  minimumSecurityRequirements: [
    'Authentication and server-side authorization on every protected endpoint.',
    'Tenant/workspace/document filters applied before retrieval results reach the model.',
    'No provider secrets or database credentials in browser code or source control.',
    'Validate file size, type and content; prevent path traversal and unsafe file handling.',
    'Treat document text and retrieved passages as untrusted input; do not obey instructions found inside them.',
    'Rate-limit expensive operations and apply usage quotas.',
    'Use TLS, least-privilege service accounts, safe logging and a documented retention/deletion policy.',
    'Back up relational data and object storage; define how vector indexes can be rebuilt.'
  ],

  suggestedAcceptanceTargets: [
    { measure: 'Retrieval', target: 'Set a baseline on a fixed dataset; demonstrate a measured improvement after hybrid search/reranking.' },
    { measure: 'Citations', target: 'Every factual answer derived from retrieved context should map to valid source references; no fabricated page references.' },
    { measure: 'Abstention', target: 'For clearly unanswerable questions, the system should state that the knowledge base does not contain sufficient evidence.' },
    { measure: 'Access control', target: 'Zero cross-tenant retrieval in automated negative tests.' },
    { measure: 'Reliability', target: 'A failed ingestion job can be inspected and retried without duplicate indexing.' },
    { measure: 'Deployment', target: 'A clean environment can be brought up from documented steps; HTTPS and health checks work.' }
  ],

  capstoneScreens: [
    { screen: 'Login / registration', functionality: 'Sign in, validation, logout and protected-route behaviour.' },
    { screen: 'Workspace dashboard', functionality: 'Create/select workspace; show document totals and ingestion health.' },
    { screen: 'Document manager', functionality: 'Upload, list, filter, inspect status, retry, delete and show supported formats.' },
    { screen: 'Chat workspace', functionality: 'Ask questions, stream responses, stop generation, show citations and source snippets.' },
    { screen: 'Conversation history', functionality: 'List, reopen, rename and delete sessions.' },
    { screen: 'Admin / usage', functionality: 'Show user/tenant usage, token counts, estimated cost and system status with role protection.' }
  ],

  capstoneGradingRubric: [
    { category: 'Frontend UX and complete user journeys', weight: 15 },
    { category: 'Backend/API design and data model', weight: 15 },
    { category: 'Ingestion, parsing, chunking and embeddings', weight: 15 },
    { category: 'Retrieval quality, reranking and grounded generation', weight: 20 },
    { category: 'Authentication, tenant isolation and security', weight: 15 },
    { category: 'Evaluation, observability, reliability and cost controls', weight: 10 },
    { category: 'Deployment, documentation and technical explanation', weight: 10 }
  ],

  mentorQuestions: [
    'Can the student explain the feature without reading the code?',
    'Can they trace a request from the browser through the API to the database/model and back?',
    'Can they identify what can fail and how the user sees the failure?',
    'Can they test permissions and prove data isolation?',
    'Can they justify the chunking, retrieval, model and database choices with evidence?',
    'Can they deploy the feature from a clean environment and diagnose logs?'
  ],

  readinessChecklist: [
    'Can explain browser → API → response and run the app locally.',
    'Frontend never exposes provider/database credentials or calls LLM/vector DB directly.',
    'User A cannot access User B’s tenant/workspace/document/chat records.',
    'Supported files process asynchronously; failures are visible and recoverable.',
    'Re-ingestion does not create uncontrolled duplicates; deletion removes searchable chunks.',
    'RAG answers are grounded in retrieved sources; unsupported questions receive a safe fallback.',
    'Hybrid retrieval/reranking improvement is measured on a documented fixed evaluation set.',
    'Every factual answer from retrieved context maps to valid citations; no fabricated page references.',
    'Unanswerable questions trigger evidence-based abstention.',
    'Access-control negative tests show zero cross-tenant retrieval.',
    'Provider outage and invalid upload do not crash the application; failed ingestion can be retried without duplicate indexing.',
    'Logs, traces, alerts, backups, restore and rollback/runbooks are demonstrated.',
    'Clean environment can be deployed from documented steps; HTTPS and health checks work.',
    'Capstone journeys and final submission pack are complete.'
  ]
};
