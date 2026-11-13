import { Assessment } from '../../types';
import { buildWeekAssessment } from './helpers';

export const WEEKS_01_TO_06_ASSESSMENTS: Assessment[] = [
  buildWeekAssessment({
    weekNumber: 1,
    title: 'Week 1 Assessment — Product, Python & Web Foundations',
    moduleTitle: 'Product, Python and web foundations',
    topicsCovered: [
      'Product framing & acceptance criteria',
      'Ingestion & QA architecture dataflow',
      'Python typing, packaging, and async concepts',
      'HTTP methods, status codes, and JSON serialization',
      'FastAPI health checks & environment separation'
    ],
    questions: [
      {
        id: 'w1_q1',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'In a production RAG architecture, why must the frontend NEVER call the LLM provider or vector database directly?',
        options: [
          'Because browsers do not support sending POST HTTP requests to external domains.',
          'To keep provider API keys, database credentials, and tenant authorization decisions strictly server-side.',
          'Because vector similarity search requires GPU acceleration only available on native operating systems.',
          'Because JSON serialization is too slow when performed inside modern web browsers.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Direct frontend calls expose secret API keys, allow client-side tenant spoofing, and bypass rate limiting and audit logging.',
        points: 4
      },
      {
        id: 'w1_q2',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Which HTTP status code should an ingestion endpoint return when an uploaded document has been validated and queued for background parsing?',
        options: [
          '200 OK with the final extracted text',
          '201 Created with the full vector index payload',
          '202 Accepted with a job/document ID for status polling',
          '204 No Content without returning any body'
        ],
        correctAnswer: 2,
        rubricExplanation: '202 Accepted signifies that the request has been received and accepted for processing, but processing has not completed.',
        points: 4
      },
      {
        id: 'w1_q6',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should `.venv` and `.env` secrets always be isolated from source control and pinned via lockfiles (`requirements.txt` / `uv.lock`)?',
        options: [
          'Because Git refuses to commit files smaller than 1 KB.',
          'To guarantee reproducible package versions across local, CI, and production while keeping credentials out of version history.',
          'Because Python cannot import type annotations unless `.venv` is deleted.',
          'To disable virtual environment isolation globally.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Pinned dependencies prevent silent library drift and security breaks, while keeping `.env` ignored stops API key leaks.',
        points: 4
      },
      {
        id: 'w1_q7',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'What is the primary purpose of Python type hints paired with runtime validation (e.g., Pydantic `BaseModel`) at an API boundary?',
        options: [
          'They compile Python code into native x86 C++ binaries automatically.',
          'They document static contracts for linters/IDEs and reject malformed external JSON payloads early with clear field errors.',
          'They bypass HTTP serialization overhead completely.',
          'They automatically encrypt database columns at rest.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Python type hints alone are not enforced at runtime; pairing them with Pydantic enforces strict runtime schema contracts at ingress.',
        points: 4
      },
      {
        id: 'w1_q8',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'During Week 1 product framing, which acceptance criterion best measures an enterprise RAG system’s trustworthiness?',
        options: [
          'The UI uses dark gradients on all landing buttons.',
          'Every factual claim cites a verified tenant-scoped chunk or explicitly abstains when supporting evidence is missing.',
          'Every user prompt returns at least 1,000 generated tokens.',
          'Users can query documents uploaded by any other organization.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Grounded citations, tenant isolation, and controlled abstention define measurable RAG reliability criteria.',
        points: 4
      },
      {
        id: 'w1_q9',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'In HTTP semantics, why should a destructive operation like deleting a workspace document use `DELETE` rather than `GET`?',
        options: [
          'GET requests cannot carry URL path parameters.',
          'GET is defined as safe and idempotent; crawlers, caches, or link prefetchers could trigger unintended state mutation.',
          'DELETE automatically encrypts the request body without TLS.',
          'FastAPI only parses headers on DELETE routes.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'HTTP `GET` must remain side-effect free; caches, proxies, and browser prefetching assume `GET` is safe.',
        points: 4
      },
      {
        id: 'w1_q10',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'Which two separate dataflow pipelines should be documented in an architecture overview before coding a RAG service?',
        options: [
          'CSS animation pipeline and font caching pipeline',
          'Offline/async document ingestion-to-index pipeline and real-time online retrieval-to-generation QA pipeline',
          'Email marketing pipeline and browser cookie sync',
          'BIOS firmware boot and printer spooling'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Separating write-heavy ingestion from latency-sensitive online QA keeps interactive chat responsive.',
        points: 4
      },
      {
        id: 'w1_q11',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'When calling an external LLM API over HTTPS from a Python backend, why is setting an explicit request timeout mandatory?',
        options: [
          'Python removes HTTP headers if timeout is omitted.',
          'Unbounded network waits can hang worker connections indefinitely and exhaust server capacity under upstream slowdowns.',
          'Timeouts double the model context window.',
          'Timeouts disable TLS certificate verification.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Explicit connect/read timeouts bound worst-case resource lockup and allow predictable fallback responses.',
        points: 4
      },
      {
        id: 'w1_q12',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Under the Azure Shared Responsibility Model (AZ-900), which responsibility ALWAYS stays with the customer regardless of IaaS, PaaS, or SaaS?',
        options: [
          'Physical datacenter perimeter security and hardware replacement',
          'Data governance, classification, accounts/identities, and endpoint protection',
          'Hypervisor firmware patching',
          'Fiber backbone routing between Azure regions'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Microsoft manages physical infrastructure; the customer always owns data classification, identity access, and client endpoints.',
        points: 4
      },
      {
        id: 'w1_q13',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Which Azure deployment model combines on-premises private infrastructure with public Azure cloud services connected via secure networking?',
        options: [
          'Serverless-only cloud',
          'Hybrid cloud',
          'Single-tenant colocation',
          'Static edge CDN'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Hybrid cloud spans on-premises and public cloud workloads for compliance, data residency, or burst capacity.',
        points: 4
      },
      {
        id: 'w1_q14',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'In Azure governance hierarchy, what is the correct parent-to-child order from broadest scope down to individual resources?',
        options: [
          'Resource -> Subscription -> Resource Group -> Management Group',
          'Management Group -> Subscription -> Resource Group -> Resource',
          'Resource Group -> Management Group -> Resource -> Subscription',
          'Region -> Availability Zone -> Subscription -> Tenant'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Management Groups organize Subscriptions, which contain Resource Groups, which hold individual Azure Resources.',
        points: 4
      },
      {
        id: 'w1_q15',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'How do Azure Availability Zones protect a production database or API tier inside a single region?',
        options: [
          'By replicating resources across physically separate datacenters with independent power, cooling, and networking within that region.',
          'By automatically downgrading PaaS services to IaaS VMs.',
          'By storing plaintext backups in browser cookies.',
          'By disabling cross-zone network latency.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Availability Zones isolate datacenter-level failures (power/cooling/network) while keeping low-latency intra-region connectivity.',
        points: 4
      },
      {
        id: 'w1_q16',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In C++, what is the result of the expression `7 / 2` when both operands have type `int`?',
        options: ['3.5', '4', '3', 'Compilation error'],
        correctAnswer: 2,
        rubricExplanation: 'Integer division in C++ truncates toward zero, so `7 / 2` evaluates to `3`.',
        points: 4
      },
      {
        id: 'w1_q17',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'Which C++ loop guarantees the loop body executes AT LEAST once before checking its termination condition?',
        options: ['for loop', 'while loop', 'do-while loop', 'range-based for loop'],
        correctAnswer: 2,
        rubricExplanation: '`do { ... } while (cond);` evaluates the condition after running the body once.',
        points: 4
      },
      {
        id: 'w1_q18',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'When counting digits or reversing an integer `n` in C++ with `while (n > 0)`, what critical edge case causes `int` overflow in Palindrome Number (#9)?',
        options: [
          'Negative numbers and integers near `INT_MAX` whose reversed digits exceed 32-bit signed max (`2,147,483,647`).',
          'Single-digit positive numbers like `7`.',
          'Using `long long` instead of `bool`.',
          'Checking `n % 10` on even numbers.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Full reversal of 10-digit ints near `INT_MAX` can overflow 32-bit `int`; either reverse only half the digits or use `long long`.',
        points: 4
      },
      {
        id: 'w1_q3',
        type: 'short_answer',
        domain: 'python',
        evaluationMode: 'rubric_review',
        prompt: 'Explain the difference between CPU-bound blocking operations (such as PyMuPDF extraction) and I/O-bound async operations in a FastAPI event loop, and how FastAPI handles them.',
        rubricExplanation: 'CPU-bound operations block the single-threaded asyncio event loop. In FastAPI, declaring a route with "def" runs it in a background threadpool (ThreadPoolExecutor), whereas "async def" runs on the event loop. For heavy tasks, use run_in_threadpool or offload to background queues like Celery/RQ.',
        points: 6
      },
      {
        id: 'w1_q4',
        type: 'debugging',
        domain: 'python',
        evaluationMode: 'self_reported_coding',
        prompt: 'A junior engineer commits the following FastAPI health endpoint:\n\n```python\n@app.get("/health")\ndef health():\n    return {"status": "ok"}\n```\nIdentify two major production shortcomings with this health check and rewrite it to adhere to production requirements.',
        codeSnippet: '@app.get("/health")\ndef health():\n    return {"status": "ok"}',
        rubricExplanation: 'Shortcomings: 1) Shallow check that does not verify dependent services (PostgreSQL database, Redis queue, vector store); 2) Does not return HTTP 503 Service Unavailable when a critical dependency is down. Solution should check DB connection and return component health statuses with proper status codes.',
        points: 10
      },
      {
        id: 'w1_q19',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement a C++ or Python function `is_palindrome_half_reverse(x: int) -> bool` that checks if an integer is a palindrome WITHOUT converting it to a string and WITHOUT risking 32-bit integer overflow. Handle negative inputs and trailing-zero edge cases (e.g., `10`).',
        codeSnippet: '// Check integer palindrome via half-reversal in O(log10 n) time, O(1) space',
        rubricExplanation: 'Reject `x < 0` and `(x % 10 == 0 && x != 0)`. Reverse only while `x > rev` via `rev = rev * 10 + x % 10; x /= 10;`. Return `x == rev || x == rev / 10`.',
        points: 10
      },
      {
        id: 'w1_q5',
        type: 'architecture',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Trace the complete lifecycle of a document ingestion request from the moment an enterprise user drops a PDF in the browser until it is marked "INDEXED". Identify every trust boundary, worker handoff, and storage location.',
        rubricExplanation: 'Browser upload → API validation (MIME, size, magic bytes) → Object storage (S3 original raw bytes) → Queue background job (Redis + Celery) → Text extraction & OCR (PyMuPDF) → Cleaning & chunking → Embeddings generation → Vector DB insertion (Qdrant/pgvector) with tenant/doc ACL metadata → Relational DB status update to INDEXED.',
        points: 8
      },
      {
        id: 'w1_q20',
        type: 'short_answer',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'You are organizing a RAG startup’s Azure footprint (dev, staging, prod APIs, Blob Storage, PostgreSQL). Explain how you structure Subscriptions, Resource Groups, and Availability Zones to isolate environments cleanly and eliminate single-datacenter downtime.',
        rubricExplanation: 'Separate prod vs non-prod Subscriptions (or dedicated Resource Groups per lifecycle with RBAC + cost budgets). Deploy stateful DB/API replicas across multiple Availability Zones inside a single region for HA without cross-region latency penalties.',
        points: 6
      }
    ]
  }),
  buildWeekAssessment({
    weekNumber: 2,
    title: 'Week 2 Assessment — Frontend UI, React & Backend API Integration',
    moduleTitle: 'Frontend UI and backend API',
    topicsCovered: [
      'React state management and controlled inputs',
      'Protected routes and JWT token storage',
      'FastAPI routers and Pydantic v2 schemas',
      'CORS security and error normalization',
      'Handling loading, empty, and error UI states'
    ],
    questions: [
      {
        id: 'w2_q1',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should JWT access tokens never be stored in unencrypted browser LocalStorage in high-compliance enterprise applications?',
        options: [
          'LocalStorage is cleared whenever the user refreshes the browser page.',
          'LocalStorage is vulnerable to Cross-Site Scripting (XSS) extraction; HttpOnly SameSite cookies offer higher protection.',
          'LocalStorage only supports binary data and cannot serialize JWT strings.',
          'LocalStorage requests exceed standard HTTP header size limits.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'JavaScript running in the page has full read access to LocalStorage. If an XSS vulnerability exists, tokens can be exfiltrated. HttpOnly cookies cannot be read by JavaScript.',
        points: 4
      },
      {
        id: 'w2_q2',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'When FastAPI validates incoming JSON requests using Pydantic, what status code does it automatically return upon validation failure?',
        options: ['400 Bad Request', '401 Unauthorized', '422 Unprocessable Entity', '500 Internal Server Error'],
        correctAnswer: 2,
        rubricExplanation: 'FastAPI uses HTTP 422 Unprocessable Entity for schema validation failures with detailed field error locations.',
        points: 4
      },
      {
        id: 'w2_q6',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'In Git team collaboration during Week 2 project setup, what happens if you run `git push --force` on a shared `main` branch?',
        options: [
          'Git creates an automatic backup branch for every teammate.',
          'You rewrite shared commit history and can overwrite teammates’ merged work unless `--force-with-lease` or protected PR rules block it.',
          'FastAPI automatically restarts the server.',
          'TypeScript compiles unused files.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Force-pushing a shared branch destroys upstream commits; protected branches with PR review prevent accidental history loss.',
        points: 4
      },
      {
        id: 'w2_q7',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should structured configuration (database URL, CORS origins, secret keys) be loaded at startup through a typed settings class (e.g., `pydantic_settings.BaseSettings`)?',
        options: [
          'So the server fails fast on boot with an explicit error if required environment variables are missing or malformed.',
          'So secrets are automatically printed to HTML meta tags.',
          'Because `.env` files cannot contain strings.',
          'To skip unit tests in CI.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Fail-fast config validation prevents broken deployments from crashing hours later on first runtime request.',
        points: 4
      },
      {
        id: 'w2_q8',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'In a React RAG chat/upload interface, why must loading, empty, and error states be explicitly modeled instead of assuming arrays are always populated?',
        options: [
          'Network requests are asynchronous and can fail or return empty workspaces; explicit states prevent null crashes and stale spinners.',
          'React refuses to render arrays shorter than 10 items.',
          'CSS Grid requires three states.',
          'Empty arrays throw HTTP 500.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Explicit UI states guide users reliably during slow uploads, zero-document workspaces, and recoverable API outages.',
        points: 4
      },
      {
        id: 'w2_q9',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'How do FastAPI `APIRouter` modules improve maintainability in a growing backend?',
        options: [
          'They allow splitting endpoints cleanly by domain (auth, workspaces, documents, chat) with shared prefixes, tags, and route dependencies.',
          'They run each route in a separate physical server.',
          'They convert SQL queries into HTML templates.',
          'They remove the need for database migrations.'
        ],
        correctAnswer: 0,
        rubricExplanation: '`APIRouter` keeps route modules cohesive and cleanly groups OpenAPI documentation and middleware dependencies.',
        points: 4
      },
      {
        id: 'w2_q10',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'When configuring `CORSMiddleware` in production, why is combining `allow_origins=["*"]` with `allow_credentials=True` dangerous and rejected by browsers?',
        options: [
          'Browsers block `*` with credentials because any malicious third-party website could make authenticated cross-origin requests reading private responses.',
          'Browsers cannot parse JSON when credentials are true.',
          'CORS only works over FTP.',
          'It forces all responses to HTTP 204.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Explicit origin allowlists are required whenever cookies or Authorization credentials are permitted.',
        points: 4
      },
      {
        id: 'w2_q11',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'What security risk arises if a backend forwards raw internal Python stack traces in 500 error responses to the React client?',
        options: [
          'Stack traces expose internal file paths, SQL queries, library versions, or leaked variable values; return a generic error + trace `request_id`.',
          'Browsers refuse to display JSON strings longer than 200 characters.',
          'Stack traces consume GPU VRAM.',
          'CORS headers disappear.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Central exception handlers log full diagnostics server-side keyed by `request_id` while returning sanitized client messages.',
        points: 4
      },
      {
        id: 'w2_q12',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Which Azure compute option provides managed web/API hosting with built-in deployment slots, TLS, and autoscaling without managing OS patching (PaaS)?',
        options: [
          'Bare-metal Dedicated Host',
          'Azure App Service',
          'Azure Storage Queue',
          'Azure DNS'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Azure App Service is a PaaS web hosting platform handling runtime patching, HTTPS, and zero-downtime staging slots.',
        points: 4
      },
      {
        id: 'w2_q13',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'In Azure Storage services, where should uploaded enterprise PDF files and raw ingestion artifacts be stored rather than relational DB rows?',
        options: [
          'Azure Blob Storage',
          'Azure Virtual Network NAT Gateway',
          'Azure Active Directory Logs',
          'Azure Key Vault Secrets (1 KB limit)'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Azure Blob Storage is durable, cost-effective object storage suited for binary documents and large uploads.',
        points: 4
      },
      {
        id: 'w2_q14',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should an Azure Virtual Network (VNet) place database instances in private subnets rather than exposing public IP endpoints?',
        options: [
          'Private subnets remove public internet attack surface so only authorized application subnets/private endpoints can reach the DB.',
          'Public IPs do not support TCP connections.',
          'VNet private subnets double SSD capacity.',
          'Databases cannot accept TLS over private IPs.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Network isolation via VNets and Private Endpoints prevents internet-wide port scanning and credential stuffing against data tiers.',
        points: 4
      },
      {
        id: 'w2_q15',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'In Microsoft Entra ID (Azure AD) Role-Based Access Control, what principle grants an engineer only the permissions required for their job?',
        options: [
          'Owner Inheritance Everywhere',
          'Principle of Least Privilege',
          'Public Read Default',
          'Shared Root Key'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Least Privilege limits blast radius if an identity or service principal is ever compromised.',
        points: 4
      },
      {
        id: 'w2_q16',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In C++, why do we pass large `std::vector<int>` or `std::string` parameters as `const T&` instead of by value?',
        options: [
          'Passing by value duplicates the entire container in memory (`O(N)` copy); `const &` avoids copying (`O(1)`) while preventing mutation.',
          '`const &` converts vectors into hash tables.',
          'C++ forbids passing vectors by value.',
          '`const &` skips bounds checking.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Passing by `const` reference eliminates expensive deep copies while preserving immutability guarantees.',
        points: 4
      },
      {
        id: 'w2_q17',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'What is the time and auxiliary space complexity of reversing a string `s` in-place using two pointers (`left`, `right`)?',
        options: [
          'O(n²) time, O(n) space',
          'O(n) time, O(1) auxiliary space',
          'O(log n) time, O(n) space',
          'O(n) time, O(n) space'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Each pointer moves inward at most `n/2` swaps in-place with constant extra memory.',
        points: 4
      },
      {
        id: 'w2_q18',
        type: 'mcq',
        evaluationMode: 'auto_mcq',
        prompt: 'What common bug happens when checking `Valid Palindrome` ignoring non-alphanumeric characters if pointer bounds are not re-verified inside inner `while` loops?',
        options: [
          'The `left` pointer can advance past `right` (or past string length), causing out-of-bounds memory access or false comparisons.',
          'Upper and lowercase letters become identical.',
          'Nested loops automatically sort the string.',
          'Strings become null-terminated twice.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Inner skipping loops must always guard `while (left < right && !isalnum(s[left])) left++;`.',
        points: 4
      },
      {
        id: 'w2_q3',
        type: 'short_answer',
        domain: 'python',
        evaluationMode: 'rubric_review',
        prompt: 'How does FastAPI’s Dependency Injection system (`Depends`) improve security and testability in multi-tenant API routes?',
        rubricExplanation: 'FastAPI Depends allows centralized extraction and validation of the authenticated user and tenant_id from the authorization header. In tests, dependencies can be overridden (app.dependency_overrides) with mock authenticated users without hitting the database.',
        points: 6
      },
      {
        id: 'w2_q4',
        type: 'debugging',
        domain: 'python',
        evaluationMode: 'self_reported_coding',
        prompt: 'Your React frontend running on http://localhost:3000 throws `CORS error: No "Access-Control-Allow-Origin" header is present on the requested resource` when calling FastAPI on http://localhost:8000. Describe the root cause and provide the exact FastAPI CORSMiddleware code to fix it securely for development.',
        codeSnippet: '# FastAPI CORS configuration needed',
        rubricExplanation: 'Cause: Browser Same-Origin Policy blocks cross-origin requests unless the backend explicitly responds with Access-Control-Allow-Origin. Fix: Add CORSMiddleware with allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"].',
        points: 10
      },
      {
        id: 'w2_q19',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Write a clean C++ function `bool isValidPalindrome(const std::string& s)` that determines if `s` is a palindrome considering ONLY alphanumeric characters and ignoring cases, in `O(n)` time and `O(1)` extra space.',
        codeSnippet: 'bool isValidPalindrome(const std::string& s) {\n    // Your two-pointer implementation\n}',
        rubricExplanation: 'Initialize `int l = 0, r = (int)s.size() - 1;`. Loop `while (l < r)`: skip non-`std::isalnum((unsigned char)s[l])` / `s[r]`, compare `std::tolower((unsigned char)s[l]) != std::tolower((unsigned char)s[r])` -> return false, else `l++; r--;`. Return true.',
        points: 10
      },
      {
        id: 'w2_q5',
        type: 'architecture',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Design a resilient frontend API client pattern in TypeScript that handles automatic retry on transient network errors, token expiration with 401 interceptors, and user-friendly error normalization.',
        rubricExplanation: 'Should detail central Axios or fetch wrapper, interceptor logic checking error.response.status === 401, refresh token queue or logout redirect, and normalizing diverse backend error structures into a typed AppError.',
        points: 8
      },
      {
        id: 'w2_q20',
        type: 'short_answer',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'Explain how Azure Resource Manager (ARM) templates / Bicep plus Managed Identities eliminate hardcoded storage connection strings between an App Service backend and Azure Blob Storage.',
        rubricExplanation: 'Enable a System-Assigned Managed Identity on App Service, assign it the `Storage Blob Data Contributor` RBAC role on the storage container, and use `DefaultAzureCredential` in Python — zero keys in `.env` or ARM parameters.',
        points: 6
      }
    ]
  }),
  buildWeekAssessment({
    weekNumber: 3,
    title: 'Week 3 Assessment — Multi-Tenancy, Database Schemas & RBAC',
    moduleTitle: 'Authentication, database and tenant model',
    topicsCovered: [
      'Relational schema design (users, tenants, workspaces, documents, messages)',
      'Password hashing with bcrypt / Argon2',
      'Role-Based Access Control (Owner, Admin, Member)',
      'Server-side authorization vs client parameters',
      'Negative security testing and cross-tenant leakage prevention'
    ],
    questions: [
      {
        id: 'w3_q1',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'In a multi-tenant PostgreSQL schema, what is the most critical constraint when querying documents by document_id?',
        options: [
          'Always use SELECT * without WHERE clauses.',
          'Always filter by tenant_id extracted from the verified server session, never trusting client-supplied tenant_id parameters.',
          'Filter by the user IP address stored in the request headers.',
          'Use client-side localStorage to confirm document ownership.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Trusting client-supplied tenant IDs or omitting tenant_id checks creates Insecure Direct Object References (IDOR), allowing User A to access User B documents.',
        points: 4
      },
      {
        id: 'w3_q2',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should password hashes never be generated using fast general-purpose hash algorithms like MD5 or SHA-256?',
        options: [
          'Because MD5 and SHA-256 produce characters unsupported by PostgreSQL text columns.',
          'Because modern GPUs can compute billions of SHA-256 hashes per second, making brute-force dictionary attacks trivial; slow, salted algorithms like bcrypt or Argon2 are required.',
          'Because SHA-256 cannot hash passwords longer than 16 characters.',
          'Because Python does not include built-in support for SHA-256.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Password hashing requires computationally expensive, memory-hard algorithms with unique salts to defeat rainbow tables and GPU cracking.',
        points: 4
      },
      {
        id: 'w3_q6',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'In React + TypeScript forms, why is lifting validation and dirty-state tracking into controlled inputs preferable to reading raw DOM `.value` refs before submission?',
        options: [
          'Controlled inputs keep UI error feedback, disabled submit buttons, and state synchronization deterministic.',
          'Refs cannot read string values in TypeScript.',
          'Controlled inputs automatically connect to PostgreSQL.',
          'DOM inputs cannot accept passwords.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Controlled React state gives immediate inline validation and single source of truth for form submissions.',
        points: 4
      },
      {
        id: 'w3_q7',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'When an HTTP request updates a workspace role from `member` to `admin`, what must the backend verify before committing?',
        options: [
          'Only that the request JSON contains `"role": "admin"`.',
          'That the authenticated caller holds Owner/Admin privilege inside THAT target tenant and is not self-escalating.',
          'That the browser URL starts with `/admin`.',
          'That the user uploaded at least one PDF.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Preventing privilege escalation requires verifying both caller identity and caller authority over the target tenant.',
        points: 4
      },
      {
        id: 'w3_q8',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should foreign key constraints and composite unique indexes `(tenant_id, name)` be enforced directly in PostgreSQL rather than only in Python?',
        options: [
          'Python checks cannot prevent race conditions under concurrent requests or protect data integrity across direct DB writes.',
          'PostgreSQL refuses to run SELECT queries without foreign keys.',
          'Foreign keys automatically create React routes.',
          'Unique indexes compress PDF files.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Database constraints provide atomic ACID enforcement invariant even under concurrent API workers.',
        points: 4
      },
      {
        id: 'w3_q9',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'In an enterprise RAG data model, why should a deleted tenant return `404` or `403` cleanly across conversations, documents, and audit lookups?',
        options: [
          'Returning consistent authorization failures prevents resource-existence enumeration (Oracle attacks) across tenants.',
          'HTTP 200 always caches confidential PDFs.',
          'PostgreSQL cannot return 401 codes.',
          'Because conversations contain no sensitive tenant info.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Preventing cross-tenant ID probing ensures attackers cannot even confirm whether an arbitrary UUID belongs to another company.',
        points: 4
      },
      {
        id: 'w3_q10',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'What security hazard occurs if chat telemetry logs store plaintext authorization tokens or unmasked PII alongside user queries?',
        options: [
          'Anyone with log-viewer access (or downstream analytics pipelines) gains unauthorized access to credentials and sensitive personal data.',
          'Embeddings lose vector dimensionality.',
          'SSE streams stop flushing.',
          'Unit tests run slower.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Logging middleware must redact Authorization headers, cookies, passwords, and sensitive fields before emitting JSON logs.',
        points: 4
      },
      {
        id: 'w3_q11',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'What is the purpose of a refresh token rotation policy paired with short-lived (e.g., 15-minute) JWT access tokens?',
        options: [
          'Limiting the exposure window of a stolen access token while enabling server-side revocation and theft detection on refresh.',
          'Increasing the size of JWT payloads.',
          'Avoiding HTTPS on localhost.',
          'Eliminating password hashing.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Short access TTL limits damage from leaks, while stateful refresh rotation lets the server revoke compromised sessions.',
        points: 4
      },
      {
        id: 'w3_q12',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Which Azure tool enforces organizational rules such as disallowing public storage accounts or restricting VM SKUs across subscriptions (AZ-900)?',
        options: [
          'Azure Policy',
          'Azure Pricing Calculator',
          'Azure CDN',
          'Azure Bastion'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Azure Policy evaluates and denies/audits non-compliant resource configurations at deployment and continuously.',
        points: 4
      },
      {
        id: 'w3_q13',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should production budgets and cost anomaly alerts be configured in Microsoft Cost Management from Week 3 onward?',
        options: [
          'To detect runaway LLM/API or compute spending early before monthly invoices spike unexpectedly.',
          'To raise Azure VM CPU clock speed.',
          'To skip Azure SLAs.',
          'To bypass RBAC assignments.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Budgets and automated alerts act as financial circuit breakers during development and load testing.',
        points: 4
      },
      {
        id: 'w3_q14',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'In Azure Monitor, what is the difference between a Metric and a Log?',
        options: [
          'Metrics are lightweight numerical time-series values sampled at regular intervals; Logs store rich structured event/trace records for querying.',
          'Metrics are text files; Logs are JPEG images.',
          'Metrics only work for VMs; Logs only work for billing.',
          'There is no difference.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Metrics power fast real-time dashboards/alerts, whereas Log Analytics enables deep KQL debugging over events.',
        points: 4
      },
      {
        id: 'w3_q15',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'If a system has two redundant Azure services in series, each with a 99.9% SLA, what happens to the composite availability SLA?',
        options: [
          'It increases to 99.99%.',
          'It decreases (`0.999 * 0.999 ≈ 99.80%`) because failure of either required dependency degrades the composite path.',
          'It stays fixed at 100%.',
          'Azure SLAs apply only to storage.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Independent required dependencies in series multiply availability probabilities, reducing overall composite SLA.',
        points: 4
      },
      {
        id: 'w3_q16',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In C++ Matrix Diagonal Sum (#1572) on an `n x n` square matrix with odd `n`, why must we avoid double-counting `mat[n/2][n/2]`?',
        options: [
          'The center element lies on BOTH the primary (`i == j`) and secondary (`i + j == n - 1`) diagonals.',
          'Odd matrices do not have secondary diagonals.',
          'C++ subtracts `mat[0][0]` automatically.',
          'Transpose changes matrix values.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'When `n` is odd, subtract `mat[n / 2][n / 2]` once or skip `i == n - 1 - i` during summation.',
        points: 4
      },
      {
        id: 'w3_q17',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In C++ OOP (`struct`/`class`), what does declaring member data `private` and exposing a validated `public` method enforce?',
        options: [
          'Encapsulation: internal invariants (such as remaining parking slots in Design Parking System #1603) cannot be corrupted externally.',
          'Multiple inheritance by default.',
          'Automatic heap allocation.',
          'O(1) recursion depth.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Encapsulation keeps internal object state consistent through controlled methods.',
        points: 4
      },
      {
        id: 'w3_q18',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'What happens in a recursive C++ function such as `fib(n)` if a base case (`n <= 1`) is omitted or unreachable?',
        options: [
          'The compiler converts it to a `for` loop.',
          'Infinite recursion exhausts the call stack, causing a Stack Overflow crash.',
          'The CPU returns `0` after 10 calls.',
          'Space complexity drops to `O(1)`.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Every recursion requires well-defined base cases and strict progress toward termination.',
        points: 4
      },
      {
        id: 'w3_q3',
        type: 'short_answer',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Describe the role-based permissions matrix for a B2B RAG system across Owner, Admin, and Member roles.',
        rubricExplanation: 'Owner: Tenant settings, billing, deletion of workspace/tenant, invite admins. Admin: Create/delete workspaces, upload/delete documents, view usage analytics, invite members. Member: Query chat, view workspace documents, download citations, view own session history.',
        points: 6
      },
      {
        id: 'w3_q4',
        type: 'debugging',
        domain: 'python',
        evaluationMode: 'self_reported_coding',
        prompt: 'Review the following backend endpoint:\n\n```python\n@app.get("/api/v1/workspaces/{workspace_id}/documents")\ndef list_docs(workspace_id: str, db: Session = Depends(get_db)):\n    return db.query(Document).filter(Document.workspace_id == workspace_id).all()\n```\nWhat vulnerability does this code introduce, and how must it be refactored?',
        codeSnippet: '@app.get("/api/v1/workspaces/{workspace_id}/documents")\ndef list_docs(workspace_id: str, db: Session = Depends(get_db)):\n    return db.query(Document).filter(Document.workspace_id == workspace_id).all()',
        rubricExplanation: 'IDOR vulnerability: Any unauthenticated or cross-tenant user who knows or guesses a workspace_id UUID can view all documents. Refactor must require current_user, verify user has membership in workspace’s tenant, and query with tenant_id filter.',
        points: 10
      },
      {
        id: 'w3_q19',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement a C++ `ParkingSystem` class supporting `ParkingSystem(int big, int medium, int small)` and `bool addCar(int carType)` (1=big, 2=medium, 3=small) in `O(1)` time and `O(1)` space, plus validate invalid `carType` cleanly.',
        codeSnippet: 'class ParkingSystem {\npublic:\n    ParkingSystem(int big, int medium, int small) {}\n    bool addCar(int carType) { return false; }\n};',
        rubricExplanation: 'Store `int slots[4] = {0, big, medium, small};`. In `addCar(carType)`: guard `if (carType < 1 || carType > 3 || slots[carType] <= 0) return false; slots[carType]--; return true;`.',
        points: 10
      },
      {
        id: 'w3_q5',
        type: 'architecture',
        domain: 'python',
        evaluationMode: 'rubric_review',
        prompt: 'Write an automated negative security test in pytest that verifies User A (Tenant A) receives an HTTP 403 or 404 when attempting to fetch a document belonging to User B (Tenant B).',
        rubricExplanation: 'Test should create Tenant A + User A and Tenant B + User B + Document B. Issue GET /api/v1/documents/{doc_b_id} with User A authorization header. Assert response status code is 403 or 404 and response does not contain Document B metadata.',
        points: 8
      },
      {
        id: 'w3_q20',
        type: 'short_answer',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'An Azure subscription hosts client RAG workloads under strict SOC-2 rules requiring no public Blob containers and mandatory region restriction (`Central India` / `East US 2`). How do you combine Azure Policy, Resource Locks, and Budgets to enforce this guardrailed landing zone?',
        rubricExplanation: 'Assign Deny Azure Policies for allowed locations and public-blob-access=disabled; apply `CanNotDelete` Resource Locks on shared Key Vault / VNet / DB; attach Cost Management action-group alerts at 50%/80%/100% spend.',
        points: 6
      }
    ]
  }),
  buildWeekAssessment({
    weekNumber: 4,
    title: 'Week 4 Assessment — Document Ingestion, Parsing & Background Workers',
    moduleTitle: 'File upload and document ingestion',
    topicsCovered: [
      'File validation (magic bytes, MIME type, size limits)',
      'Object storage separation vs database storage',
      'PyMuPDF extraction and OCR fallbacks',
      'Asynchronous worker queues with Celery / RQ and Redis',
      'Job lifecycle states and idempotency on retries'
    ],
    questions: [
      {
        id: 'w4_q1',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should document text extraction never be performed synchronously inside the HTTP file upload request handler?',
        options: [
          'Because HTTP clients automatically disconnect if a request takes longer than 5 milliseconds.',
          'Large PDFs take seconds or minutes to parse and OCR, causing HTTP timeouts, socket exhaustion, and worker thread starvation in web servers.',
          'Because object storage cannot store files that are currently being parsed.',
          'Because browsers cannot display progress spinners during async jobs.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Synchronous parsing of large documents exhausts HTTP worker pools, triggers client proxy gateway timeouts (504), and ruins user experience.',
        points: 4
      },
      {
        id: 'w4_q2',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'What is the primary indicator that an uploaded PDF requires Optical Character Recognition (OCR) rather than standard text extraction?',
        options: [
          'The PDF filename contains uppercase letters.',
          'The document contains more than 10 pages.',
          'Standard extraction tools (e.g. PyMuPDF) extract zero or near-zero characters per page because pages are scanned bitmap images.',
          'The PDF was generated on a Linux operating system.'
        ],
        correctAnswer: 2,
        rubricExplanation: 'Scanned documents store images of text without underlying font glyph streams; detecting <50 characters per page triggers the OCR pipeline.',
        points: 4
      },
      {
        id: 'w4_q6',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why must upload validation inspect file magic bytes (e.g., `%PDF-`) in addition to the filename extension and `Content-Type` header?',
        options: [
          'Attackers can easily rename an executable or HTML/SVG XSS script to `report.pdf` and spoof the HTTP `Content-Type` header.',
          'Magic bytes compress images inside the browser.',
          'FastAPI deletes extensions during parsing.',
          'MIME headers are encrypted by TLS.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Filename extensions and client-declared Content-Types are untrusted input; verifying header signature bytes defeats extension spoofing.',
        points: 4
      },
      {
        id: 'w4_q7',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should raw uploaded documents be stored in Object Storage (S3 / Azure Blob) instead of PostgreSQL `BYTEA` columns?',
        options: [
          'Object storage scales cheaply for large binaries, supports streaming/pre-signed URLs, and keeps relational DB backups and buffer pools fast.',
          'PostgreSQL cannot store binary data.',
          'Object storage executes OCR inside storage buckets.',
          'Browsers only upload to object storage.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Separating large blobs from OLTP tables prevents database bloat, expensive I/O, and slow point-in-time recovery.',
        points: 4
      },
      {
        id: 'w4_q8',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'When ingesting an enterprise PDF containing tables and multi-column headers, why does preserving page numbers and section headings matter during extraction?',
        options: [
          'Citation links (`filename.pdf, p. 12`), contextual chunk headers, and audit verification depend on accurate page/section provenance.',
          'Page numbers increase token speed.',
          'Vector databases reject chunks without bold text.',
          'CORS middleware checks page numbers.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Without page and heading provenance captured during parsing, downstream RAG answers cannot provide clickable, verifiable citations.',
        points: 4
      },
      {
        id: 'w4_q9',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'What occurs if an uploaded PDF exceeds the configured maximum upload size and the backend reads `await file.read()` completely into RAM before checking size?',
        options: [
          'A single oversized malicious upload can exhaust process memory (OOM crash) before validation even runs; stream in chunks with a byte counter.',
          'FastAPI splits the PDF across 10 servers automatically.',
          'Python compresses the buffer to 1 KB.',
          'Redis deletes the request automatically.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Bounded streaming reads abort oversized payloads immediately before memory exhaustion occurs.',
        points: 4
      },
      {
        id: 'w4_q10',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'When a Celery/RQ ingestion task transiently fails due to a rate-limited embedding API, why is exponential backoff with jitter preferable to immediate infinite retries?',
        options: [
          'Immediate retries cause a thundering herd that worsens upstream outage; exponential backoff + jitter spreads load and caps attempts before marking FAILED.',
          'Jitter disables worker logging.',
          'Immediate retries skip Redis completely.',
          'Backoff reduces embedding vector dimensions.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Capped exponential backoff with jitter stabilizes recovery and avoids infinite poison-pill retry loops.',
        points: 4
      },
      {
        id: 'w4_q11',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'During text cleaning prior to chunking, which normalization step helps embeddings WITHOUT destroying semantic formatting?',
        options: [
          'Stripping noisy repeated headers/footers and normalizing broken Unicode ligatures/whitespace while keeping list structure and code intact.',
          'Deleting all numbers, punctuation, and nouns.',
          'Lowercasing and sorting every word alphabetically.',
          'Replacing newlines with random UUIDs.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Over-aggressive normalization destroys meaning; targeted noise removal preserves structure and precision.',
        points: 4
      },
      {
        id: 'w4_q12',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Under DP-900 Relational Data concepts, why is normalizing tables into 3NF appropriate for an OLTP SaaS RAG application database?',
        options: [
          'Normalization eliminates redundant updates and guarantees integrity across users, workspaces, and documents during frequent transactional writes.',
          '3NF disables all SQL JOINs.',
          'OLTP databases do not support primary keys.',
          '3NF automatically builds Power BI dashboards.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'OLTP workloads benefit from normalized schemas that keep concurrent updates fast and anomaly-free.',
        points: 4
      },
      {
        id: 'w4_q13',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Which SQL clause filters groups AFTER `GROUP BY` aggregation (e.g., finding tenants with >100 indexed documents), as opposed to filtering individual rows?',
        options: ['WHERE', 'HAVING', 'ORDER BY', 'DISTINCT'],
        correctAnswer: 1,
        rubricExplanation: '`WHERE` filters rows before grouping; `HAVING` filters aggregated groups afterward.',
        points: 4
      },
      {
        id: 'w4_q14',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'In DP-900, what distinguishes OLAP (analytics) systems from OLTP (transactional) systems?',
        options: [
          'OLTP handles high-concurrency short point reads/writes with strict consistency; OLAP aggregates large historical datasets for reporting and BI.',
          'OLTP cannot use SQL.',
          'OLAP has no columns.',
          'OLTP stores only unstructured JPEG files.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'OLTP optimizes low-latency row transactions; OLAP optimizes wide analytical scans across historical data.',
        points: 4
      },
      {
        id: 'w4_q15',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Which managed Azure relational PostgreSQL option is built for open-source Postgres compatibility with built-in HA, automated backups, and pgvector support?',
        options: [
          'Azure Database for PostgreSQL – Flexible Server',
          'Azure Queue Storage',
          'Azure Cosmos DB for Table',
          'Azure Synapse Serverless Spark'
        ],
        correctAnswer: 0,
        rubricExplanation: 'PostgreSQL Flexible Server supports managed extensions including `pgvector`, zone-redundant HA, and automated backups.',
        points: 4
      },
      {
        id: 'w4_q16',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Sort Colors` (#75, Dutch National Flag algorithm), what is the optimal time and space complexity to sort `0, 1, 2` in a single pass?',
        options: [
          'O(n log n) time, O(n) space',
          'O(n) time, O(1) space using `low`, `mid`, `high` pointers',
          'O(n²) time, O(1) space',
          'O(log n) time, O(1) space'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Three-way partitioning swaps 0s to `low`, skips 1s at `mid`, and swaps 2s to `high` in one `O(n)` pass.',
        points: 4
      },
      {
        id: 'w4_q17',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Maximum Subarray` (#53, Kadane’s Algorithm), when should the running sum `curr` be reset to the current element `nums[i]`?',
        options: [
          'Whenever `curr + nums[i] < nums[i]` (i.e., the prior prefix sum became negative).',
          'Whenever `nums[i]` is even.',
          'At every middle index `n / 2`.',
          'Never; always sum the whole array.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'If the running prefix is negative, starting fresh at `nums[i]` yields a strictly larger subarray sum.',
        points: 4
      },
      {
        id: 'w4_q18',
        type: 'mcq',
        evaluationMode: 'auto_mcq',
        prompt: 'What is the worst-case time complexity of inserting `N` elements at the END of a C++ `std::vector` using amortized doubling?',
        options: [
          'O(N²) total',
          'O(N) total across all `N` pushes (O(1) amortized per `push_back`)',
          'O(N log N) total',
          'O(1) total for all N pushes combined'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Geometric capacity growth keeps total copied elements `<= 2N`, giving `O(1)` amortized cost per append.',
        points: 4
      },
      {
        id: 'w4_q3',
        type: 'short_answer',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Explain how you guarantee idempotent document ingestion when an asynchronous worker crashes halfway through chunking and Celery re-executes the job.',
        rubricExplanation: 'Assign a deterministic checksum or doc_id. Before inserting newly extracted chunks, execute an atomic transaction or cleanup step that deletes any previously written partial chunks or vector points for that document_id, preventing duplicate chunks.',
        points: 6
      },
      {
        id: 'w4_q4',
        type: 'debugging',
        domain: 'python',
        evaluationMode: 'self_reported_coding',
        prompt: 'An attacker uploads a file named `../../../etc/cron.d/malicious.pdf`. If the server saves files using `open(f"/storage/{file.filename}", "wb")`, what security vulnerability occurs, and what is the proper defense?',
        codeSnippet: 'with open(f"/storage/{file.filename}", "wb") as f:\n    f.write(file.content)',
        rubricExplanation: 'Vulnerability: Path traversal (directory traversal) allowing arbitrary file write and remote code execution. Defense: Sanitize filename with werkzeug secure_filename or generate a random UUID storage key (e.g., /storage/tenants/{tid}/docs/{uuid}.pdf) and store original filename only in database metadata.',
        points: 10
      },
      {
        id: 'w4_q19',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement Kadane’s algorithm `int maxSubArray(const std::vector<int>& nums)` in C++ handling all-negative arrays accurately in `O(n)` time and `O(1)` space.',
        codeSnippet: 'int maxSubArray(const std::vector<int>& nums) {\n    // Handle empty or all-negative inputs cleanly\n}',
        rubricExplanation: 'Initialize `int best = nums[0], curr = nums[0];` then for `i = 1..n-1`: `curr = std::max(nums[i], curr + nums[i]); best = std::max(best, curr); return best;`. Initializing to `nums[0]` instead of `0` handles all-negative arrays.',
        points: 10
      },
      {
        id: 'w4_q5',
        type: 'architecture',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Diagram the complete state machine of an ingestion job across QUEUED, EXTRACTING, OCR_PROCESSING, CHUNKING, EMBEDDING, INDEXED, and FAILED. Detail how error codes and failure reasons are recorded for user recovery.',
        rubricExplanation: 'Detail state transitions, recording attempts count, error_code (e.g., CORRUPT_PDF, OCR_TIMEOUT, VECTOR_STORE_UNAVAILABLE), updating ingestion_jobs table, and providing an explicit retry action in the UI.',
        points: 8
      },
      {
        id: 'w4_q20',
        type: 'short_answer',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'In an Azure RAG architecture, compare storing user accounts/document status in Azure Database for PostgreSQL (OLTP) vs exporting monthly token usage and retrieval traces to Azure Synapse / Analytics (OLAP). Why keep them separated?',
        rubricExplanation: 'Heavy analytical aggregations (`GROUP BY` across millions of usage traces) lock buffers and slow interactive OLTP auth/upload queries. Replicating usage events asynchronously to OLAP keeps interactive chat & ingestion latency fast.',
        points: 6
      }
    ]
  }),
  buildWeekAssessment({
    weekNumber: 5,
    title: 'Week 5 Assessment — Chunking Strategies, Embeddings & Vector Storage',
    moduleTitle: 'Chunking, embeddings and vector storage',
    topicsCovered: [
      'Fixed-size, recursive, and semantic chunking trade-offs',
      'Parent-child chunking architecture',
      'Embedding models, dimensionality, and vector normalization',
      'Qdrant vs PostgreSQL pgvector comparison',
      'Vector payload metadata filtering and indexing'
    ],
    questions: [
      {
        id: 'w5_q1',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'What problem does Parent-Child chunking solve in production RAG systems?',
        options: [
          'It allows documents to inherit permissions from parent user accounts.',
          'It balances high retrieval precision (using small child chunks for vector search) with complete narrative context (passing the larger parent chunk to the LLM).',
          'It reduces embedding dimensions by half.',
          'It eliminates the need for vector databases completely.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Small chunks match semantic similarity queries accurately but lack surrounding sentences. Parent-child chunking indexes small chunks but returns the larger parent block to the prompt.',
        points: 4
      },
      {
        id: 'w5_q2',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'Why must the exact same embedding model and normalization parameters be used for both ingestion chunking and query embedding?',
        options: [
          'Different models project text into incompatible vector spaces and dimensionalities, making cosine similarity comparisons meaningless.',
          'Using different models causes database connection timeouts.',
          'FastAPI requires consistent Python variable names.',
          'Vector databases can only store one model name in their configuration.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Vector embeddings are coordinates in a specific learned geometric space. Comparing vectors from two different models produces pseudo-random distance values.',
        points: 4
      },
      {
        id: 'w5_q6',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'Why is recursive character/token chunking with modest overlap (e.g., 10–15%) generally preferred over naive fixed-byte splitting?',
        options: [
          'Recursive splitting prioritizes paragraph, heading, and sentence boundaries first so ideas are not severed mid-word or mid-clause.',
          'Fixed-byte splitting deletes numbers.',
          'Overlap shrinks vector DB disk usage.',
          'Recursive splitting disables embeddings.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Preserving natural linguistic boundaries plus small overlap prevents boundary facts from falling out of context.',
        points: 4
      },
      {
        id: 'w5_q7',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'If vectors stored in Qdrant/pgvector are L2 unit-normalized (`||v|| = 1`), what mathematical relationship holds between dot product and cosine similarity?',
        options: [
          'Dot product equals cosine similarity identically, enabling faster inner-product SIMD distance scoring.',
          'Dot product becomes always negative.',
          'Cosine similarity doubles dimensionality.',
          'L2 normalization deletes semantic direction.'
        ],
        correctAnswer: 0,
        rubricExplanation: '`cos(a, b) = (a · b) / (||a|| ||b||)`. When both norms equal 1, inner product equals cosine similarity directly.',
        points: 4
      },
      {
        id: 'w5_q8',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'When a document is re-uploaded or updated, what happens if old vectors are not deleted or version-replaced deterministically?',
        options: [
          'Stale outdated answers and duplicate near-identical chunks pollute top-K retrieval results.',
          'Vector dimensions mutate automatically.',
          'HNSW stops building graphs.',
          'PostgreSQL drops the table.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Outdated orphan vectors produce conflicting citations; purge or supersede prior `document_id` points before indexing.',
        points: 4
      },
      {
        id: 'w5_q9',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should security filters (such as `tenant_id` and `workspace_id`) be applied INSIDE the vector search filter rather than post-filtering top-K results in Python?',
        options: [
          'Post-filtering top-10 global hits risks returning 0 authorized chunks when top global matches belong to other tenants, harming recall and leaking timing.',
          'Python cannot filter lists.',
          'Vector databases ignore post-filters.',
          'In-DB pre-filtering always removes embedding vectors.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Filtered HNSW / pre-filtered vector search evaluates similarity only over authorized tenant vectors.',
        points: 4
      },
      {
        id: 'w5_q10',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'During batch embedding ingestion of 2,000 chunks, why should worker pipelines send batches of 32–128 texts with rate-limit awareness instead of 2,000 sequential 1-chunk HTTP calls?',
        options: [
          'Batching cuts HTTP round-trip latency and throughput bottlenecks drastically while avoiding single oversized payload limits.',
          'Single-chunk calls alter cosine angles.',
          'Batching bypasses model tokenization limits automatically.',
          'Python forbids loops over 100 items.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Controlled batching maximizes throughput while staying safely below provider token-per-request and TPM ceilings.',
        points: 4
      },
      {
        id: 'w5_q11',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'In an HNSW vector index, how do parameters `ef_search` and `M` affect system behavior?',
        options: [
          'Higher `M` and `ef_search` increase recall accuracy at the cost of higher memory footprint and slightly higher query latency.',
          'Higher `ef_search` deletes unused chunks.',
          '`M` controls SQL password encryption.',
          'HNSW ignores `ef_search` during search.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Tuning HNSW balances memory, build speed, query latency, and approximate nearest neighbor recall.',
        points: 4
      },
      {
        id: 'w5_q12',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'In Azure Cosmos DB (DP-900 non-relational), why does choosing a high-cardinality partition key matter?',
        options: [
          'It distributes storage and Request Units (RU/s) evenly across physical partitions instead of creating hot partition bottlenecks.',
          'It forces relational foreign keys onto JSON documents.',
          'It limits collections to 10 MB.',
          'It disables JSON indexing.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'A poor partition key concentrates reads/writes onto one physical partition, throttling throughput.',
        points: 4
      },
      {
        id: 'w5_q13',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Which Cosmos DB API is typically chosen for flexible JSON operational documents (e.g., chat sessions & ingestion metadata) with global multi-region replication?',
        options: [
          'Cosmos DB for NoSQL',
          'Azure Data Factory Pipeline',
          'Azure File Sync',
          'Azure Key Vault'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Cosmos DB for NoSQL natively indexes JSON documents and offers tunable consistency and SLA-backed low latency.',
        points: 4
      },
      {
        id: 'w5_q14',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'In DP-900 analytics workloads, what distinguishes Batch Processing from Stream Processing?',
        options: [
          'Batch processes bounded stored datasets on scheduled intervals; Stream continuously evaluates unbounded incoming events with sub-second/second latency.',
          'Batch has zero latency; Stream runs once per month.',
          'Stream only supports CSV.',
          'Batch cannot aggregate numbers.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Daily cost rollups suit batch ETL, while real-time token/error alerting uses streaming pipelines.',
        points: 4
      },
      {
        id: 'w5_q15',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Under DP-900, which Cosmos DB consistency level guarantees reads always reflect the most recent committed write globally?',
        options: ['Eventual', 'Consistent Prefix', 'Strong', 'Bounded Staleness (1 day)'],
        correctAnswer: 2,
        rubricExplanation: 'Strong consistency linearizes reads to return the latest committed write at higher latency and RU cost.',
        points: 4
      },
      {
        id: 'w5_q16',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'What is the time complexity of finding the `K`-th largest element in an `N`-element array using a min-heap (`std::priority_queue` with `std::greater<int>`) of size `K`?',
        options: ['O(N log N)', 'O(N log K)', 'O(K²)', 'O(N²)'],
        correctAnswer: 1,
        rubricExplanation: 'Maintaining a min-heap capped at size `K` performs at most `N` heap push/pop operations of cost `O(log K)`.',
        points: 4
      },
      {
        id: 'w5_q17',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In C++ Binary Search (#704), why should the midpoint be computed as `mid = left + (right - left) / 2` instead of `(left + right) / 2`?',
        options: [
          'To avoid signed integer overflow when `left + right` exceeds `INT_MAX`.',
          'Because division binds slower than addition.',
          'To make binary search `O(1)`.',
          'Because `left` can be negative.'
        ],
        correctAnswer: 0,
        rubricExplanation: '`left + (right - left) / 2` evaluates the exact same midpoint safely without overflow.',
        points: 4
      },
      {
        id: 'w5_q18',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Top K Frequent Elements` (#347), which pairing solves the problem in `O(N)` bucket-sort or `O(N log K)` heap time?',
        options: [
          'Frequency `unordered_map<int, int>` + Min-Heap of size `K` (or frequency buckets of size `N + 1`).',
          'Sorting inside nested `for` loops in `O(N³)`.',
          'Single stack without counting.',
          'Recursion without memoization.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Hash map frequency counts followed by size-K min-heap or frequency bucket indexing achieves optimal time.',
        points: 4
      },
      {
        id: 'w5_q3',
        type: 'short_answer',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Compare Qdrant and PostgreSQL pgvector (with HNSW index). Under what architectural circumstances would you choose pgvector over Qdrant, and vice-versa?',
        rubricExplanation: 'pgvector: Single database for relational data and vectors, ACID consistency, unified backups, lower operational complexity for <1-2M vectors. Qdrant: Dedicated vector engine, specialized payload filtering, faster indexing, distributed scaling, better performance for >10M vectors and high-QPS search.',
        points: 6
      },
      {
        id: 'w5_q4',
        type: 'debugging',
        domain: 'rag',
        evaluationMode: 'self_reported_coding',
        prompt: 'A team notices that their vector queries take 800ms when filtering by tenant_id, even though HNSW index is enabled. What index is missing in Qdrant or PostgreSQL pgvector?',
        codeSnippet: 'SELECT id, content FROM chunks WHERE tenant_id = :tid ORDER BY embedding <=> :q LIMIT 10;',
        rubricExplanation: 'Missing a payload / column index on tenant_id. In Qdrant, a payload index (keyword) must be created on tenant_id. In PostgreSQL, a B-tree index on tenant_id (or composite index with vector) is required to avoid full-table sequential scans before vector distance calculation.',
        points: 10
      },
      {
        id: 'w5_q19',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement `std::vector<int> topKFrequent(const std::vector<int>& nums, int k)` in C++ returning the `k` most frequent elements in `O(N)` time using bucket sort (or `O(N log K)` min-heap).',
        codeSnippet: 'std::vector<int> topKFrequent(const std::vector<int>& nums, int k) {\n    // Count frequencies + heap/bucket selection\n}',
        rubricExplanation: 'Count with `unordered_map<int,int> freq`. Bucket `vector<vector<int>> buckets(nums.size() + 1)` placing `num` at `buckets[f]`; iterate `f` from `nums.size()` down to `1` collecting up to `k` items.',
        points: 10
      },
      {
        id: 'w5_q5',
        type: 'architecture',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Design a chunk metadata payload schema that satisfies the source requirements from Page 16: tenant_id, workspace_id, document_id, page, section, chunk_index, source, and permissions. Explain how this prevents cross-tenant data leakage during vector search.',
        rubricExplanation: 'Provide JSON schema with all 8 fields. Explain hard vector pre-filtering where the vector search query includes a boolean filter ensuring only points matching the user tenant_id and workspace_id are considered in distance computation.',
        points: 8
      },
      {
        id: 'w5_q20',
        type: 'short_answer',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'If you store tenant workspace sessions and non-relational JSON audit logs in Azure Cosmos DB, how would you choose a partition key and handle high read/write spikes without throttling?',
        rubricExplanation: 'Use a composite high-cardinality partition key such as `/tenantId_workspaceId` (or hierarchical partition keys `/tenantId` + `/workspaceId`) so no single enterprise customer starves partitions, combined with autoscale RU/s.',
        points: 6
      }
    ]
  }),
  buildWeekAssessment({
    weekNumber: 6,
    title: 'Week 6 Assessment — RAG Generation, Citations & Streaming',
    moduleTitle: 'Basic RAG chat and citations',
    topicsCovered: [
      'Prompt engineering for evidence-grounded answers',
      'Abstention behavior on unanswerable questions',
      'Citation mapping and source verification',
      'Server-Sent Events (SSE) streaming and abort signals',
      'Conversation persistence and audit traces'
    ],
    questions: [
      {
        id: 'w6_q1',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'When evaluating RAG generation on questions not covered in the knowledge base, what is the desired model behavior?',
        options: [
          'Extrapolate using general pre-trained knowledge to sound helpful.',
          'Explicitly state that the provided documents do not contain sufficient evidence to answer (abstention).',
          'Return an HTTP 500 error and crash the connection.',
          'Fabricate plausible page numbers and citations.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Production RAG requires high confidence and low hallucination; answering outside context destroys enterprise user trust.',
        points: 4
      },
      {
        id: 'w6_q2',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'How does Server-Sent Events (SSE) streaming benefit conversational RAG applications compared to traditional polling?',
        options: [
          'It encrypts browser passwords with TLS 1.3.',
          'It provides real-time token-by-token output delivery, dramatically reducing perceived Time-to-First-Token (TTFT) and allowing users to read answers immediately.',
          'It prevents the backend from running out of RAM.',
          'It converts text answers to audio speech automatically.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Streaming provides immediate visual feedback within 200-500ms rather than forcing the user to wait 5-15 seconds for complete response generation.',
        points: 4
      },
      {
        id: 'w6_q6',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'In an SSE-based RAG chat UI, why should the frontend attach an `AbortController` signal to the fetch request?',
        options: [
          'So clicking "Stop Generating" or navigating away immediately closes the stream and stops wasted backend LLM token generation.',
          'So the server skips authentication.',
          'To convert JSON to CSV automatically.',
          'To increase `temperature` dynamically.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Propagating client disconnects via `AbortController` -> backend request cancellation saves LLM token spend and worker resources.',
        points: 4
      },
      {
        id: 'w6_q7',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'When selecting decoding controls (`temperature`, `max_tokens`) for factual enterprise RAG Q&A, what setting best reduces creative fabrication?',
        options: [
          'Low temperature (`0.0 – 0.2`) and an explicit bounded `max_tokens` ceiling.',
          'Temperature `1.9` with no max tokens.',
          'Random seed rotation per sentence.',
          'Disabling system instructions.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Near-zero temperature encourages deterministic faithfulness to retrieved context chunks.',
        points: 4
      },
      {
        id: 'w6_q8',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should backend applications route LLM calls through a dedicated Provider Adapter interface rather than scattering provider SDK calls across routes?',
        options: [
          'An adapter centralizes retries, timeouts, token counting, model fallback, and seamless swapping across OpenAI, Gemini, or Azure OpenAI.',
          'Adapters make Python run without async.',
          'Routes cannot return JSON without adapters.',
          'Provider SDKs do not support HTTPS.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Decoupling business logic from provider SDK internals allows multi-provider resilience and unified telemetry.',
        points: 4
      },
      {
        id: 'w6_q9',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'What problem occurs if conversation history grows unbounded across 40 turns and every message + full retrieved chunks are blindly re-injected into the prompt?',
        options: [
          'Token costs explode, context-window overflow crashes requests, and stale prior chunks distract current-turn retrieval.',
          'Embeddings become negative.',
          'SSE streams turn into WebSockets.',
          'SQL schemas drop indexes.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Sliding window / summary memory over recent turns keeps prompts bounded within token budgets.',
        points: 4
      },
      {
        id: 'w6_q10',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'After an SSE RAG stream completes, what audit trace records should be persisted alongside the assistant message in PostgreSQL?',
        options: [
          'Retrieved `chunk_ids`/citations, prompt/completion token counts, model name, latency, and `request_id`.',
          'Only the user’s browser width in pixels.',
          'The raw API secret key.',
          'Nothing; discard all traces immediately.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Persisting citation links and token/latency traces powers debugging, compliance audits, and user source verification.',
        points: 4
      },
      {
        id: 'w6_q11',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'Why do LLMs exhibit the "lost in the middle" phenomenon on long stuffed RAG contexts?',
        options: [
          'Attention tends to weight tokens at the very start and end of long prompts more strongly than evidence buried in the middle.',
          'The middle of a prompt is compressed by gzip.',
          'Cosine similarity drops for odd chunk indices.',
          'Browsers truncate middle lines.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Keeping context compact, high-precision, and ordering strongest evidence toward prompt edges mitigates context degradation.',
        points: 4
      },
      {
        id: 'w6_q12',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Under AI-102 Responsible AI principles, which six pillars govern Azure AI systems?',
        options: [
          'Fairness, Reliability & Safety, Privacy & Security, Inclusiveness, Transparency, Accountability.',
          'Speed, Profit, Virality, Scale, Caching, Compression.',
          'IaaS, PaaS, SaaS, FaaS, DNS, VPN.',
          'CPU, GPU, TPU, RAM, SSD, NIC.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Microsoft’s six Responsible AI principles guide design, safety guardrails, human oversight, and auditability.',
        points: 4
      },
      {
        id: 'w6_q13',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Which Azure AI service extracts key-value pairs, tables, and structured layout fields directly from scanned invoices, receipts, and PDFs (AI-102)?',
        options: [
          'Azure AI Document Intelligence',
          'Azure Traffic Manager',
          'Azure DevOps Boards',
          'Azure Queue Storage'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Azure AI Document Intelligence (formerly Form Recognizer) provides prebuilt and custom layout/OCR extraction models.',
        points: 4
      },
      {
        id: 'w6_q14',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'In AI-102 Machine Learning foundations, why must a dataset be split into training, validation, and held-out test sets?',
        options: [
          'To tune hyperparameters on validation without leaking test labels, giving an unbiased generalization estimate on the test set.',
          'Because neural networks only accept 3 files.',
          'To triple training speed on GPUs.',
          'To avoid normalization.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Clean train/val/test separation prevents data leakage and over-optimistic evaluation metrics.',
        points: 4
      },
      {
        id: 'w6_q15',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Which Azure Computer Vision capability generates bounding boxes with class labels for items detected inside an image?',
        options: [
          'Object Detection',
          'Speech-to-Text',
          'Text Translation',
          'Azure Key Vault Rotation'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Object detection identifies both what objects appear and their spatial bounding box coordinates.',
        points: 4
      },
      {
        id: 'w6_q16',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Search in Rotated Sorted Array` (#33) with distinct integers, what key invariant lets binary search still achieve `O(log n)` time?',
        options: [
          'At every midpoint `mid`, AT LEAST ONE half (`[left..mid]` or `[mid..right]`) is guaranteed to remain strictly sorted.',
          'Both halves are always sorted.',
          'The array must be sorted first in `O(n log n)`.',
          'Linear scan is required on rotated arrays.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Checking which half is sorted (`nums[left] <= nums[mid]`) lets us decide in `O(1)` whether `target` lies inside that sorted range.',
        points: 4
      },
      {
        id: 'w6_q17',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Longest Substring Without Repeating Characters` (#3), how does the sliding window maintain `O(n)` worst-case time?',
        options: [
          'By jumping the `left` boundary directly to `max(left, lastSeen[ch] + 1)` using an index map/array in a single forward pass.',
          'By restarting from `left + 1` and rescanning every character.',
          'By sorting every substring.',
          'By generating all `2^n` subsequences.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Storing the last seen index per character advances `left` monotonically so each index is visited at most twice.',
        points: 4
      },
      {
        id: 'w6_q18',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'Which hashing key cleanly groups all anagrams in `Group Anagrams` (#49) in `O(N * K)` time (avoiding `O(K log K)` sort per string)?',
        options: [
          'A canonical 26-character frequency count encoding string (e.g. `#2#1#0...`).',
          'Sum of ASCII codes alone.',
          'String length alone.',
          'First character + last character.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Two lowercase words are anagrams iff their 26-letter frequency histograms match identically; ASCII sums collide (e.g., `ac` and `bb`).',
        points: 4
      },
      {
        id: 'w6_q3',
        type: 'short_answer',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Describe the mechanism for Citation Mapping: how do you reliably connect specific generated statements in the LLM answer to exact source document pages?',
        rubricExplanation: 'Format prompt context with explicit indices e.g. [Source 1: filename.pdf, p. 4]. Instruct model to append [Source X] after factual claims. Post-process response to parse source tags and attach metadata (title, page, excerpt) for clickable UI preview drawers.',
        points: 6
      },
      {
        id: 'w6_q4',
        type: 'debugging',
        domain: 'genai',
        evaluationMode: 'self_reported_coding',
        prompt: 'A prompt produces answers where the LLM writes "According to Source 5, the policy allows 15 days", but only 3 chunks were provided in the prompt context. What caused this hallucination and how do you prevent it?',
        codeSnippet: 'context = "\\n".join([f"[Source {i+1}] {c.text}" for i, c in enumerate(chunks[:3])])',
        rubricExplanation: 'Hallucination caused by weak system prompt constraints and training priors where the model mimics multi-source patterns. Fix: Add strict prompt rule: "Only reference [Source 1] through [Source N] provided above. Never invent source numbers." Enforce post-generation regex validation checking source numbers <= len(context_chunks).',
        points: 10
      },
      {
        id: 'w6_q19',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement `int lengthOfLongestSubstring(const std::string& s)` in C++ using a sliding window and last-seen character table (`std::array<int, 256>` initialized to `-1`) in `O(n)` time and `O(1)` space.',
        codeSnippet: 'int lengthOfLongestSubstring(const std::string& s) {\n    // Return length of longest substring without repeating characters\n}',
        rubricExplanation: 'Track `std::array<int, 256> last; last.fill(-1); int left = 0, best = 0;`. For `r = 0..s.size()-1`: `unsigned char c = s[r]; if (last[c] >= left) left = last[c] + 1; last[c] = r; best = std::max(best, r - left + 1);`.',
        points: 10
      },
      {
        id: 'w6_q5',
        type: 'architecture',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Implement a complete system prompt template for an Enterprise RAG Assistant that enforces: 1) Strict grounding in context, 2) Abstention when missing, 3) Inline citation formatting, and 4) Neutral professional tone.',
        rubricExplanation: 'Provide structured prompt with system instructions, context delimiters, clear citation rules, refusal instructions, and user query placeholders.',
        points: 8
      },
      {
        id: 'w6_q20',
        type: 'short_answer',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'How would you combine Azure AI Document Intelligence with an enterprise RAG ingestion pipeline so complex multi-column financial tables retain structural fidelity instead of becoming garbled text?',
        rubricExplanation: 'Route scanned or complex-table PDFs to Document Intelligence (`prebuilt-layout`), serialize extracted Markdown tables preserving column/row headers, attach page numbers, and chunk by table/section boundaries.',
        points: 6
      }
    ]
  })
];
