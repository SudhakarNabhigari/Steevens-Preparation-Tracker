import { Assessment } from '../../types';
import { buildWeekAssessment } from './helpers';

export const WEEKS_21_TO_26_ASSESSMENTS: Assessment[] = [
  // =========================================================================
  // WEEK 21: Deployment Architecture, Docker, Env Separation, CI Workflows
  // =========================================================================
  buildWeekAssessment({
    weekNumber: 21,
    title: 'Week 21 Assessment — Containerization, Stateful Service Deploy & CI Pipelines',
    moduleTitle: 'Deployment and CI/CD',
    topicsCovered: [
      'D141–D142: Production deployment topology & multi-stage Docker containerization',
      'D143: Strict dev / staging / prod environment & secret separation',
      'D144–D146: Managed PostgreSQL migrations, Object Storage/Redis/Worker & Vector DB deploy',
      'D147: Automated CI workflow (lint, typecheck, unit/integration tests, image scan)'
    ],
    extraAzureTopics: [
      'Azure Container Apps / ACR deployment topology, Private Networking & non-root containers',
      'GitHub Actions OIDC build, Trivy image vulnerability scan & Alembic migration safety'
    ],
    questions: [
      {
        id: 'w21_q1',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why use a multi-stage `Dockerfile` running as a non-root user (`USER appuser`) for a Python FastAPI + React container image?',
        options: [
          'Drops build-time compilers (`gcc`, npm devDependencies) from the final runtime layer (cutting image size & CVE surface) and limits blast radius if a runtime exploit occurs.',
          'Forces Python to compile `.exe` binaries.',
          'Embeds `.env` secrets permanently into the image.',
          'Allows binding port 80 without reverse proxies.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Minimal multi-stage non-root images reduce CVEs, pull times, and container escape risks.',
        points: 4
      },
      {
        id: 'w21_q2',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why must database schema migrations (`alembic upgrade head`) NEVER execute unconditionally inside all 8 horizontal API container startup entrypoints simultaneously?',
        options: [
          'Concurrent containers racing migrations cause DDL lock contention or partial migration corruption; execute migrations once as a pre-deploy job/init hook using backward-compatible expand-contract steps.',
          'Alembic only runs on laptops.',
          'PostgreSQL drops tables during concurrent connections.',
          'Docker images cannot run `alembic`.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Decoupling schema migration jobs from stateless API container boot avoids migration lock races and enables safe rolling updates.',
        points: 4
      },
      {
        id: 'w21_q3',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'What failure happens during zero-downtime rolling deploy if Migration v2 immediately drops column `old_title` while half the v1 API containers are STILL serving traffic?',
        options: [
          'Live v1 containers crash with `UndefinedColumn` SQL 500 errors until rollout finishes; follow Expand -> Migrate Code -> Contract across releases.',
          'PostgreSQL preserves dropped columns in memory.',
          'React rewrites SQL columns dynamically.',
          'Qdrant backs up SQL columns.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Expand-and-contract migrations keep old + new code compatible across rolling deploy transitions.',
        points: 4
      },
      {
        id: 'w21_q4',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'In Environment Separation (D143), why should staging NEVER share the same vector collection, Object Storage bucket, or Redis instance as production?',
        options: [
          'Staging eval tests, bug reproductions, or accidental `FLUSHDB` / purge scripts would corrupt or delete live customer tenant data.',
          'Staging runs slower TCP packets.',
          'Vector stores refuse staging namespaces.',
          'CORS only works in production.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Complete data-plane & secret isolation prevents test runs from leaking or damaging customer assets.',
        points: 4
      },
      {
        id: 'w21_q5',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'When deploying Qdrant / pgvector as a persistent stateful vector service (D146), what happens if container orchestration restarts the pod without an attached persistent volume?',
        options: [
          'All indexed vector collections inside ephemeral container storage disappear permanently on container restart.',
          'Qdrant pulls vectors back from browser LocalStorage.',
          'PostgreSQL automatically mirrors Qdrant RAM.',
          'Docker saves `/qdrant/storage` in GitHub.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Stateful data tiers require persistent disks/managed services plus verified automated backups.',
        points: 4
      },
      {
        id: 'w21_q6',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'In an automated CI pipeline (D147), what order fails fastest and saves compute?',
        options: [
          'Lint + Typecheck + Fast Unit Tests (<1 min) -> Build/Scan Images + Ephemeral Postgres/Redis Integration Tests -> Quality/Eval Gates.',
          'Build GPU containers first -> Check ESLint syntax last.',
          'Deploy directly to production -> Run pytest afterward.',
          'Skip tests when urgent.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Fast static/unit checks fail within seconds before spinning up heavier integration or container scans.',
        points: 4
      },
      {
        id: 'w21_q7',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should React SPA runtime environment configuration (`VITE_*`) contain ZERO secrets such as LLM API keys or DB passwords?',
        options: [
          'Vite inlines `VITE_*` variables statically into public JS bundles shipped directly to every visitor’s browser.',
          'Vite hashes `VITE_*` strings securely with Argon2.',
          'Browsers block `VITE_*` strings.',
          'TypeScript strips secrets automatically.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Keep every API key strictly server-side; frontend bundles are 100% public client code.',
        points: 4
      },
      {
        id: 'w21_q8',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why pin base images (`python:3.12.7-slim@sha256:...` or explicit minor tags) and lockfiles (`package-lock.json` / `uv.lock`) inside CI Docker builds?',
        options: [
          'Prevents sudden unverified upstream base-image or transitive package updates from breaking production builds mid-release.',
          'Reduces HTTP SSE buffer size.',
          'Disables TypeScript strict checks.',
          'Forces Docker builds to run uncached.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Immutable image digests and lockfiles guarantee deterministic repeatable builds.',
        points: 4
      },
      {
        id: 'w21_q9',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'On Azure Container Apps, why scale the **Celery Ingestion Worker** container app via KEDA Queue-Length scaling (`Redis list length`) separately from the **FastAPI Web API** (`HTTP concurrency`)?',
        options: [
          'OCR bursts scale ingestion workers elastically without forcing unnecessary web API replicas (and vice versa during heavy chat traffic).',
          'Celery cannot run on Linux.',
          'Web APIs cannot scale horizontally.',
          'KEDA deletes queued messages.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Independent workload-appropriate scaling profiles cut waste and protect interactive chat SLOs during ingestion spikes.',
        points: 4
      },
      {
        id: 'w21_q10',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Under Deployment Architecture (D141), why put the React static SPA behind a CDN/Edge reverse proxy (`Azure Static Web Apps` / `Front Door` / `Nginx`) routing `/api/*` to FastAPI?',
        options: [
          'Same-origin `/api` routing eliminates cross-origin CORS friction, simplifies `SameSite` cookie security, and serves cached JS/CSS fast globally.',
          'CDNs run PyMuPDF OCR inside edge caches.',
          'Browsers cannot fetch `.js` files without Front Door.',
          'Proxies decrypt PostgreSQL tables.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Unified origin reverse proxy simplifies cookies/CSP while offloading static asset caching cleanly.',
        points: 4
      },
      {
        id: 'w21_q11',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should `.dockerignore` explicitly exclude `.git`, `.env`, `node_modules`, `.venv`, and local test artifacts before `docker build`?',
        options: [
          'Prevents copying secrets (`*.env`) or multi-GB host binaries into build contexts/image layers and preserves clean reproducible container builds.',
          'Docker fails if `.dockerignore` is missing.',
          'Speeds up `alembic` runtime SQL.',
          'Turns Python bytecode into Rust.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Strict `.dockerignore` stops accidental `.env` secret baking and speeds up CI context uploads.',
        points: 4
      },
      {
        id: 'w21_q12',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'When deploying Celery workers inside Docker/Kubernetes, what happens on deploy shutdown if workers ignore `SIGTERM` graceful termination signals?',
        options: [
          'Orchestrators forcefully `SIGKILL` workers mid-embedding/OCR after the grace window, leaving partial jobs orphaned instead of cleanly finishing current chunk or requeuing.',
          'Redis freezes permanently.',
          'FastAPI switches ports.',
          'PDF files lose page 1.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Handling `SIGTERM` warm shutdown lets running tasks finish cleanly or release visibility locks reliably.',
        points: 4
      },
      {
        id: 'w21_q13',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Parallel Courses III` (#2050, critical-path build/deploy DAG duration), how do you find the minimum total months to complete all dependent tasks?',
        options: [
          'Run Kahn’s topological sort propagating `finishTime[v] = max(finishTime[v], finishTime[u] + time[v])` over prerequisite edges `u -> v`, taking `max(finishTime)`.',
          'Sum all `time[i]` sequentially.',
          'Pick longest single node only.',
          'Run BFS from the last course backwards without durations.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'DAG critical-path longest duration accounts for parallel execution across independent branches.',
        points: 4
      },
      {
        id: 'w21_q14',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Minimum Height Trees` (#310), why does iterative leaf-trimming (`degree == 1` peel inward until `<= 2` nodes remain) locate all tree centroids in `O(V)`?',
        options: [
          'Moving inward from longest leaf paths converges strictly onto the 1 or 2 middle nodes of the tree’s longest diameter, minimizing max distance to every leaf.',
          'Trees always have 3 roots.',
          'DFS from node 0 only returns centroids.',
          'Degree-2 nodes are leaves.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Topological onion-peeling finds tree centers in linear time without `O(V²)` all-roots BFS.',
        points: 4
      },
      {
        id: 'w21_q15',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Find Eventual Safe States` (#802), which graph nodes are "safe"?',
        options: [
          'Nodes from which every outgoing path terminates without entering any directed cycle (detectable via 3-color DFS or reverse-graph Kahn’s topological sort from terminal outdegree-0 nodes).',
          'Only nodes with zero outgoing edges.',
          'Any node inside a strongly connected cycle.',
          'All nodes with even indices.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Reversing edges and peeling terminal `outdegree == 0` nodes identifies exact cycle-free safe nodes in `O(V + E)`.',
        points: 4
      },
      {
        id: 'w21_q16',
        type: 'debugging',
        domain: 'python',
        evaluationMode: 'self_reported_coding',
        prompt: 'Inspect this production `Dockerfile` for the FastAPI RAG API:\n```dockerfile\nFROM python:latest\nWORKDIR /app\nCOPY . .\nRUN pip install -r requirements.txt\nCMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0"]\n```\nSpot FOUR production/security flaws (`:latest` floating tag, copying `.env`/secrets before pip caching, running as root, `--reload` in prod!) and write a hardened multi-stage version.',
        codeSnippet: 'FROM python:latest\nCOPY . .\nCMD ["uvicorn", "app.main:app", "--reload"]',
        rubricExplanation: 'Flaws: 1) `python:latest` breaks reproducibility; 2) `COPY . .` BEFORE `pip install` busts Docker layer cache on every code tweak AND risks copying local `.env` if `.dockerignore` slips; 3) Runs as `root`; 4) `--reload` spawns file-watcher processes causing memory waste & instability in prod (use multi-worker `gunicorn -k uvicorn.workers.UvicornWorker` or container-scaled `uvicorn --workers`). Fix: pin `python:3.12-slim`, build wheels in builder stage, copy lockfile first, create non-root user, drop `--reload`.',
        points: 10
      },
      {
        id: 'w21_q17',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement `int minimumTime(int n, const std::vector<std::vector<int>>& relations, const std::vector<int>& time)` (`Parallel Courses III` #2050, 1-indexed courses `1..n`) in C++ using topological DP in `O(V + E)` time.',
        codeSnippet: 'int minimumTime(int n, const std::vector<std::vector<int>>& relations, const std::vector<int>& time) {\n    // Propagate critical path completion times\n}',
        rubricExplanation: 'Build `adj[u].push_back(v)`, `indeg[v]++`. Init `finish[u] = time[u - 1]` for all `indeg[u] == 0` pushed to queue. Pop `u`, for each neighbor `v`: `finish[v] = max(finish[v], finish[u] + time[v - 1])`; if `--indeg[v] == 0` push `v`. Return `*max_element(finish.begin() + 1, finish.end())`.',
        points: 10
      },
      {
        id: 'w21_q18',
        type: 'short_answer',
        domain: 'python',
        evaluationMode: 'rubric_review',
        prompt: 'Describe how you safely execute a backward-compatible database column rename/change (`chunks.source_name -> chunks.source_uri`) across a zero-downtime rolling API + worker deployment.',
        rubricExplanation: 'Step 1 (Expand): Add nullable `source_uri` column + trigger/dual-write in code while reading `coalesce(source_uri, source_name)`; Step 2 (Backfill): Batch-backfill historical rows; Step 3 (Switch): Deploy code reading/writing only `source_uri`; Step 4 (Contract): Drop `source_name` in subsequent release after old containers drain.',
        points: 6
      },
      {
        id: 'w21_q19',
        type: 'architecture',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'Design the Production Deployment Architecture (D141–D146) for this multi-tenant RAG platform (Frontend, FastAPI Web API, Celery Workers, Redis, Managed PostgreSQL, Object Storage, Qdrant/AI Search) highlighting private networking and separation from Staging.',
        rubricExplanation: 'Separate resource groups/subscriptions per env. Edge CDN + WAF terminates TLS and proxies `/api` to multi-replica Container Apps Web API inside private VNet subnet. API pushes uploads to Blob Storage (private endpoint), metadata to Managed PostgreSQL Flexible Server (private endpoint + HA), jobs to Redis (private TLS). Auto-scaled Celery Workers (`ocr_heavy`, `ingest_fast`) write vectors to isolated persistent Qdrant/AI Search. Zero public DB/Redis/Vector ports exposed.',
        points: 8
      },
      {
        id: 'w21_q20',
        type: 'short_answer',
        domain: 'python',
        evaluationMode: 'rubric_review',
        prompt: 'What security and quality checks belong in a GitHub Actions CI workflow (D147) before pushing a container tag to your Container Registry?',
        rubricExplanation: '1) Secret scanning (Gitleaks/TruffleHog); 2) Frontend `tsc --noEmit` + lint + production `vite build`; 3) Backend `ruff`/`mypy` + unit pytest + integration tests (ephemeral Postgres+pgvector+Redis); 4) Golden retrieval regression threshold check; 5) Docker build + Trivy high/critical CVE scan before registry push.',
        points: 6
      }
    ]
  }),

  // =========================================================================
  // WEEK 22: CD Workflow, HTTPS/Domain, Health Checks, Monitoring, Rollback, Clean Env
  // =========================================================================
  buildWeekAssessment({
    weekNumber: 22,
    title: 'Week 22 Assessment — CD Release, TLS, Readiness Probes, Post-Release Monitoring & Rollback',
    moduleTitle: 'Deployment and CI/CD',
    topicsCovered: [
      'D148–D149: Automated CD release flow, custom domains & enforced HTTPS TLS 1.2+/1.3',
      'D150: Separating Kubernetes/Container Liveness (`/healthz`) vs Readiness (`/readyz`) checks',
      'D151–D152: Post-release canary monitoring & rapid deterministic rollback',
      'D153–D154: Clean-environment from-scratch deploy test & Week 22 CI/CD milestone'
    ],
    extraAzureTopics: [
      'Azure Container Apps revision traffic splitting (10% -> 100% canary & 1-click rollback)',
      'Managed TLS certificates, HSTS, and clean-environment IaC (Terraform/Bicep) verification'
    ],
    questions: [
      {
        id: 'w22_q1',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'What critical disaster happens if a Kubernetes/Container **Liveness** probe (`/healthz`) fails whenever PostgreSQL experiences a brief 5-second failover?',
        options: [
          'The orchestrator restarts ALL healthy API pods in a synchronized crash loop right when the DB recovers, worsening downtime; check local process deadlock in Liveness and check dependencies (DB/Redis/Qdrant) in **Readiness** (`/readyz`).',
          'PostgreSQL recovers faster.',
          'DNS updates IP addresses automatically.',
          'Pods stop consuming RAM cleanly.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Liveness = "am I deadlocked?"; Readiness = "am I ready to serve traffic from load balancer?".',
        points: 4
      },
      {
        id: 'w22_q2',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'In an automated CD workflow (D148), why promote the EXACT immutable image digest (`ghcr.io/app/api@sha256:...`) built and tested in Staging to Production instead of rebuilding `:main` again during prod deploy?',
        options: [
          'Eliminates "worked in staging, broke in prod" dependency drift by deploying the exact bit-for-bit artifact already verified in staging.',
          'Image digests shrink containers by 50%.',
          'Rebuilding skips Dockerfile steps.',
          'Digests disable HTTPS.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Build once, promote verified immutable artifact across environments.',
        points: 4
      },
      {
        id: 'w22_q3',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'During a Canary Release (D151, 10% traffic on v2 revision), which signals trigger an immediate automated/manual Rollback to v1?',
        options: [
          'Spike in HTTP 5xx rate, P95 latency / TTFT regression above SLO, surging OpenTelemetry uncaught exceptions, or broken `/readyz` health checks.',
          'A single 404 typo on `/favicon.ico`.',
          'Normal 5% traffic variation at noon.',
          'Users liking dark mode.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Explicit rollback thresholds observed over the first 10–15 minutes limit blast radius of undetected regressions.',
        points: 4
      },
      {
        id: 'w22_q4',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'What is the purpose of a Clean Environment Deploy Test (D153) running setup from scratch in a blank ephemeral environment?',
        options: [
          'Exposes hidden "it worked on my laptop" assumptions (missing Alembic migration order, undocumented env vars, missing Qdrant collection init script, unseeded bucket CORS).',
          'Deletes customer production backups.',
          'Speeds up CSS animations.',
          'Bypasses CI security checks.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Reproducible blank-slate bootstrapping proves documentation, IaC, and startup scripts are self-contained.',
        points: 4
      },
      {
        id: 'w22_q5',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should rollback (D152) shift traffic back to the prior container revision (`v1`) WITHOUT automatically running destructive `alembic downgrade` unless specifically safe?',
        options: [
          'Downgrade scripts can drop newly written columns/rows irreversibly; keeping schema backward-compatible (`expand-contract`) makes instant container rollback 100% lossless.',
          'Alembic downgrade deletes Docker images.',
          'Containers cannot route HTTP without migrations.',
          'PostgreSQL prevents rollbacks.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Forward-compatible migrations make traffic-switch rollbacks instantaneous and data-safe.',
        points: 4
      },
      {
        id: 'w22_q6',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'When configuring Custom Domains & HTTPS (D149), why enforce HTTP -> HTTPS `301/308` permanent redirect + HSTS + TLS >= 1.2 at the gateway?',
        options: [
          'Protects bearer tokens and cookies against plaintext MITM downgrade attacks and enforces modern cryptographic suites.',
          'Allows browsers to skip certificate validation.',
          'Prevents WebSockets from running.',
          'Compresses PNG images.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Enforced HTTPS + HSTS protects credentials at transport edges unconditionally.',
        points: 4
      },
      {
        id: 'w22_q7',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'After releasing a new prompt template or RAG model version in CD, what domain-specific metric should post-release monitoring watch for 24 hours alongside HTTP 5xx?',
        options: [
          'Empty-citation rate, abstention rate surge, invalid-citation regex count, and average output tokens per answer.',
          'Browser window height.',
          'Git commit message length.',
          'Number of CSS classes.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Domain telemetry catches silent quality or format regressions immediately after release.',
        points: 4
      },
      {
        id: 'w22_q8',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'In `GET /readyz`, what latency risk arises if a readiness check runs a full LLM completion prompt (`"Hello"`) every 5 seconds?',
        options: [
          'Wastes LLM API quota/money constantly and marks healthy pods down if OpenAI hiccups; verify lightweight local/DB/Redis/Qdrant TCP/ping checks instead (and cache/rate-bound external dependency probes).',
          'Makes LLM responses deterministic.',
          'Cleans up Redis memory.',
          'Fixes Docker networking.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Readiness checks must be sub-50ms cheap core checks; never spend inference tokens inside health probes.',
        points: 4
      },
      {
        id: 'w22_q9',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'On Azure, which deployment security control prevents manual ad-hoc portal tweaks ("configuration drift") between Staging and Production?',
        options: [
          'Managing infrastructure declaratively via Infrastructure-as-Code (Bicep / Terraform) deployed exclusively via audited GitHub Actions OIDC pipelines.',
          'Giving every developer Subscription Owner rights to click in the Portal.',
          'Sharing local `.env` files in Slack.',
          'Turning off Azure Monitor.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'IaC + locked CI/CD promotion keeps environments auditable, repeatable, and drift-free.',
        points: 4
      },
      {
        id: 'w22_q10',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'When an Azure Container App revises frontend bundles while API stays active, why can users with an open old browser tab temporarily hit `ChunkLoadError` on lazy-loaded JS routes?',
        options: [
          'Their old `index.html` references hashed chunk filenames replaced in the new container; retain previous hashed static chunks briefly (or prompt clean reload on dynamic import failure).',
          'TLS certificates expire during deploys.',
          'Browsers disable JSON parsing during deploys.',
          'PostgreSQL locks JS files.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Keeping previous asset hashes across overlap windows or graceful chunk-error reload recovery avoids post-deploy blank screens.',
        points: 4
      },
      {
        id: 'w22_q11',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'Why include a post-deploy **Smoke Test** script running against Staging right after CD completes?',
        options: [
          'Automated smoke test logs in, hits `/readyz`, checks auth protection (401 unauthenticated), runs 1 minimal upload->retrieval->chat verification, catching broken wiring/env vars before prod promotion.',
          'Replaces unit tests.',
          'Tests 10,000 concurrent users.',
          'Publishes source code.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Fast end-to-end smoke checks confirm real secrets, DB permissions, and reverse-proxy routing are alive.',
        points: 4
      },
      {
        id: 'w22_q12',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'What does `proxy_read_timeout 120s` (or equivalent ingress idle timeout) prevent on long-running RAG SSE endpoints?',
        options: [
          'Prevents load balancers from prematurely terminating valid 45s streaming responses with HTTP `504 Gateway Timeout`.',
          'Encrypts SSE frames.',
          'Speeds up vector search.',
          'Deletes client cookies.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'SSE streams require ingress idle timeouts aligned above max stream generation duration (plus periodic keepalive comments).',
        points: 4
      },
      {
        id: 'w22_q13',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Compare Version Numbers` (#165), how are `"1.01"` vs `"1.001"` and `"1.0"` vs `"1.0.0"` handled cleanly without overflowing ints?',
        options: [
          'Parse integer segments between `\'.\'` in two-pointer single pass treating missing trailing segments as `0`, returning `-1`/`1` at the first differing integer.',
          'Lexicographic `string` compare (`"1.10" < "1.2"` fails!).',
          'Convert `"1.0.0"` to `double`.',
          'Strip all zeros globally (`"1.10"` would wrongly become `"1.1"`!).'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Segment-by-segment numeric parsing handles leading zeros and unequal segment counts in `O(m + n)` time and `O(1)` space.',
        points: 4
      },
      {
        id: 'w22_q14',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `First Bad Version` (#278, analogous to bisecting a buggy CD release across `1..n` builds), how do you prevent `(left + right) / 2` overflow and minimize API calls?',
        options: [
          'Use `mid = left + (right - left) / 2`; if `isBadVersion(mid)` keep `right = mid` else `left = mid + 1`, terminating at `left` in `ceil(log2 n)` calls.',
          'Call `isBadVersion(i)` linearly from `1` to `n`.',
          'Use `left = mid` when good without `+1` (infinite loop!).',
          'Cache nothing and pick random commits.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Lower-bound binary search locates the exact first bad release commit in logarithmic probes.',
        points: 4
      },
      {
        id: 'w22_q15',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Snapshot Array` (#1146), why store a list of `(snap_id, val)` pairs ONLY for modified indices rather than copying the full array of size `length` on every `snap()`?',
        options: [
          'Copying `O(length)` on every `snap()` causes `O(length * snaps)` TLE/MLE; storing sparse per-index `(snap_id, val)` histories reduces `snap()` to `O(1)` and `get(index, snap_id)` to `O(log snaps)` binary search.',
          'Sorting global snapshots takes `O(1)`.',
          'Vectors cannot be copied in C++.',
          'Binary search works on unsorted IDs.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Sparse per-element version history (`upper_bound`) models immutable state snapshots efficiently.',
        points: 4
      },
      {
        id: 'w22_q16',
        type: 'debugging',
        domain: 'python',
        evaluationMode: 'self_reported_coding',
        prompt: 'Inspect this Nginx reverse-proxy & FastAPI health setup:\n```nginx\nlocation /api/ {\n    proxy_pass http://api:8000;\n}\n```\n```python\n@app.get("/healthz")\nasync def liveness():\n    llm.generate("ping")  # Live external LLM probe!\n    return {"ok": True}\n```\nSpot TWO production bugs causing random pod restarts and laggy streaming UI, and fix both cleanly.',
        codeSnippet: 'proxy_pass http://api:8000; # buffering ON by default\nasync def liveness(): llm.generate("ping")',
        rubricExplanation: 'Bug 1: Nginx defaults `proxy_buffering on`, stalling SSE tokens until buffer fills or response finishes! Fix SSE routes with `proxy_buffering off; proxy_cache off; chunked_transfer_encoding on; proxy_read_timeout 120s;` (and backend `X-Accel-Buffering: no`). Bug 2: Calling an external LLM inside `/healthz` liveness causes crash-looping restarts on LLM hiccups + wastes money! Make `/healthz` trivial (`{"status":"alive"}`) and check Postgres/Redis/Qdrant quickly in `/readyz` returning `503` if unreachable.',
        points: 10
      },
      {
        id: 'w22_q17',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement `int compareVersion(const std::string& v1, const std::string& v2)` (`Compare Version Numbers` #165) in C++ in `O(m + n)` time and `O(1)` extra space without splitting into temporary string arrays.',
        codeSnippet: 'int compareVersion(const std::string& v1, const std::string& v2) {\n    // Accumulate numeric segments cleanly across .\n}',
        rubricExplanation: 'Maintain indices `i = 0, j = 0`. While `i < v1.size() || j < v2.size()`: parse `long long num1 = 0` while `i < n1 && v1[i] != \'.\'`, advance past `\'.\'`; same for `num2`. If `num1 < num2` return `-1`; if `num1 > num2` return `1`. Return `0` after loop.',
        points: 10
      },
      {
        id: 'w22_q18',
        type: 'short_answer',
        domain: 'python',
        evaluationMode: 'rubric_review',
        prompt: 'Outline a Complete CD Release Checklist (D148–D153) from GitHub merge to Staging verification to Production 10%->100% rollout and rapid Rollback.',
        rubricExplanation: '1) Merge CI produces immutable SHA-pinned images + security scan pass; 2) Run backward-compatible Alembic migration job against Staging -> deploy Staging -> run automated E2E smoke test; 3) Approval/gate -> run Prod migration -> deploy Canary Prod revision (10% traffic) monitoring 5xx, TTFT, trace errors, abstention metrics for 15 mins; 4) Promote 100% or execute 1-click revision traffic rollback if thresholds breach.',
        points: 6
      },
      {
        id: 'w22_q19',
        type: 'architecture',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'Design a Clean-Environment Bootstrap & Verification Protocol (D153) proving another engineer can recreate your entire RAG stack from scratch in a blank cloud/container environment.',
        rubricExplanation: 'Include declarative IaC / Compose + `.env.example` documenting every variable -> idempotent setup scripts (DB migrate, Qdrant collection + payload index bootstrap, Blob container CORS/lifecycle init, seed fixture workspace) -> automated clean-boot integration smoke suite proving `login -> upload -> index -> hybrid cite chat -> cleanup` works on first run.',
        points: 8
      },
      {
        id: 'w22_q20',
        type: 'short_answer',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Explain the exact difference between `/healthz` (Liveness), `/readyz` (Readiness), and Startup Probes for BOTH the FastAPI API pod and the Celery Ingestion Worker pod.',
        rubricExplanation: 'API Liveness checks Python event loop responsiveness; API Readiness verifies Postgres pool, Redis, and Qdrant/AI Search connectivity (HTTP 503 if down). Worker Liveness verifies worker process heartbeats / Celery `inspect ping`; Startup probe grants initial model-download/init headroom so heavy embedding/rerank models aren’t prematurely killed during boot.',
        points: 6
      }
    ]
  }),

  // =========================================================================
  // WEEK 23: Capstone Scope & All 7 Core UI Screens
  // =========================================================================
  buildWeekAssessment({
    weekNumber: 23,
    title: 'Week 23 Assessment — Capstone Screens 1–7, UX Resilience & System Data Structures',
    moduleTitle: 'Capstone, load testing and handover',
    topicsCovered: [
      'D155–D156: Capstone end-to-end scope & Login / Registration authentication screen',
      'D157–D158: Workspace Dashboard & Document Manager UI (upload, retry, delete, status)',
      'D159–D160: Streaming Chat Workspace with clickable citations & Persistent History UI',
      'D161: Tenant Admin / Usage, Cost & Ingestion Audit screen'
    ],
    extraAzureTopics: [
      'Accessible React UI state machines, Entra/JWT auth persistence & Admin telemetry panels',
      'Pagination, optimistic updates vs server truth & role-gated UI routes'
    ],
    questions: [
      {
        id: 'w23_q1',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'On Screen 1 (Login & Registration, D156), why must UI form validation error messages avoid revealing `"No user exists with that email"` vs `"Wrong password"` on login?',
        options: [
          'Generic `"Invalid email or password"` prevents Account Enumeration attacks while clear inline rules guide password strength on Registration.',
          'React cannot render two different error messages.',
          'PostgreSQL does not know which failed.',
          'HTTP 401 forbids JSON bodies.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Preventing login account enumeration protects user privacy without hurting valid registration feedback.',
        points: 4
      },
      {
        id: 'w23_q2',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'On Screen 2 (Workspace Dashboard, D157), why should role-gated buttons (e.g. `"Delete Workspace"`, `"Invite Admin"`) be disabled/hidden for `Member` UI roles AND STILL rejected (`403 Forbidden`) by FastAPI?',
        options: [
          'UI hiding improves UX clarity, while server-side enforcement prevents attackers from calling the API directly via curl/DevTools.',
          'Hiding React buttons secures the backend automatically.',
          'Server 403 checks disable React rendering.',
          'Members need `DELETE` access in Postgres.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Frontend checks are UX convenience only; server endpoints remain the authoritative security boundary.',
        points: 4
      },
      {
        id: 'w23_q3',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'On Screen 3 (Document Manager, D158), how should uploading status updates (`QUEUED -> EXTRACTING -> INDEXED`) be polled efficiently without hammering the server forever?',
        options: [
          'Poll ONLY while at least one visible document is in a non-terminal state (`QUEUED/PROCESSING`) at bounded intervals (e.g., 2–3s with backoff), pausing when tab is hidden or all jobs settle.',
          'Run `setInterval(..., 100)` globally on every page forever.',
          'Make the user press F5 manually forever.',
          'Store PDF bytes in React Context forever.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Conditional visibility-aware polling (or SSE progress push) keeps UX snappy at minimal server load.',
        points: 4
      },
      {
        id: 'w23_q4',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'On Screen 4 (Chat Workspace, D159), what happens if a user selects a brand-new conversation or clicks `"Stop Generating"` while an old SSE stream is still arriving?',
        options: [
          'Call `abortController.abort()` cleanly and tag streams by `conversation_id` so late tokens from an abandoned stream NEVER bleed into the newly opened chat window!',
          'Allow both streams to concatenate into one bubble.',
          'Crash React with Uncaught AbortError.',
          'Disable switching chats.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Aborting in-flight streams on navigation/switch and ignoring `AbortError` cleanly prevents cross-chat token corruption.',
        points: 4
      },
      {
        id: 'w23_q5',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'When clicking an inline `[Source 2]` citation chip on Screen 4, what should the Citation Preview Drawer show?',
        options: [
          'Document title, page number, section breadcrumb, highlighted retrieved excerpt, and an authorized download/view link (`403`-protected across tenants).',
          'Raw float32 embedding numbers.',
          'PostgreSQL internal row OIDs.',
          'System prompt secrets.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Human-verifiable source evidence closes the trust loop between LLM synthesis and primary enterprise records.',
        points: 4
      },
      {
        id: 'w23_q6',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'On Screen 5 (Conversation History, D160), why implement cursor/keyset pagination (`before_created_at` / `limit=20`) instead of `SELECT *` loading 10,000 messages at login?',
        options: [
          'Keyset pagination keeps page loads fast (`O(1)` indexed seek), avoids `OFFSET` slowdown on deep history, and bounds browser DOM/memory usage.',
          'React refuses arrays above 50 elements.',
          'JSON truncates strings after 100 KB.',
          'SQL cannot sort timestamps.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Cursor pagination keeps UI responsive as long-running tenant conversation archives grow.',
        points: 4
      },
      {
        id: 'w23_q7',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'On Screen 6/7 (Admin & Usage Screen, D161), what data must a Tenant Admin NEVER see across multi-tenant boundaries?',
        options: [
          'Another tenant’s token usage, member list, error logs, documents, or billing limits — Admin views must remain strictly scoped to the Admin’s own verified `tenant_id`.',
          'Their own workspace token breakdown.',
          'Failed ingestion error messages inside their own org.',
          'Remaining monthly quota percentage.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Tenant Admin is scoped per customer organization, distinct from internal system operators.',
        points: 4
      },
      {
        id: 'w23_q8',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should React Workspace Switchers clear stale component state / React Query caches cleanly when switching active `workspace_id`?',
        options: [
          'Prevents Workspace A’s document list or chat thread from momentarily flashing or accidentally submitting queries with stale Workspace A filters inside Workspace B.',
          'React caches CSS inside SQL.',
          'Workspaces share vector indexes without filters.',
          'LocalStorage encrypts context.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Keying state/queries cleanly by `[tenant_id, workspace_id]` guarantees zero UI context bleed.',
        points: 4
      },
      {
        id: 'w23_q9',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'In an enterprise Capstone hosted on Azure, how should the Document Manager allow Admin users to view/download an original 15 MB PDF cleanly?',
        options: [
          'Backend authenticates user + verifies `doc.tenant_id/workspace_id` membership -> requests short-lived (60s) read-only User-Delegation SAS URL from Azure Blob -> redirects/streams download cleanly.',
          'Make the Azure Blob Container publicly readable (`Anonymous Blob`).',
          'Send a permanent container key to React.',
          'Store PDF base64 strings inside localStorage.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'On-demand User-Delegation SAS links offload large binary transfer directly to Blob Storage while retaining strict RBAC authorization.',
        points: 4
      },
      {
        id: 'w23_q10',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should React Chat & Document Manager render explicit Empty States with a clear next step (`"Upload your first PDF to start asking questions"`)?',
        options: [
          'Guides first-time onboarding clearly and prevents confused users from blaming broken chat on empty workspace indexes.',
          'Empty states disable FastAPI routes.',
          'TypeScript requires empty state JSX.',
          'It shrinks bundle size.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Helpful empty/loading/error handling is an explicit Capstone acceptance criterion.',
        points: 4
      },
      {
        id: 'w23_q11',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'When displaying confidence / retrieval relevance cues inside the Capstone Chat UI, why avoid printing fabricated raw percentages (`"98.4% Accurate!"`) next to LLM prose?',
        options: [
          'Cosine similarity ≠ factual probability; misleading synthetic accuracy percentages fool users — show grounded citation counts & verified source excerpts instead.',
          'Floats cannot format in React.',
          'LLM answers always are 100% accurate.',
          'Browsers block percentage signs.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Authentic UI metrics build trust without exaggerating probabilistic model certainty.',
        points: 4
      },
      {
        id: 'w23_q12',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'On Screen 3 (Document Manager), what happens when an Admin clicks `"Retry Ingestion"` on a `FAILED` PDF?',
        options: [
          'Backend verifies ownership + job status is retryable (`FAILED`), clears partial failure artifacts, transitions status to `QUEUED` via atomic conditional update (`WHERE status = \'FAILED\'`), and re-enqueues Celery job.',
          'Frontend flips the green CSS badge locally without API call.',
          'Backend deletes the user’s account.',
          'Creates a second duplicate Document row.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Atomic conditional state transition avoids duplicate retry races on double-clicks.',
        points: 4
      },
      {
        id: 'w23_q13',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'How does `Insert Delete GetRandom O(1)` (#380) support `remove(val)` AND `getRandom()` in `O(1)` average time?',
        options: [
          'Store elements in a `vector<int>` + `unordered_map<int, int> indexMap`; on `remove(val)`, swap `val` with `vec.back()`, update `indexMap[back] = idx`, and `pop_back()`.',
          'Erase directly from middle of `vector` (`O(n)` shift!).',
          'Use an `unordered_set` and advance iterator `rand() % size` steps (`O(n)`!).',
          'Sort on every insert.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Swap-with-back turns arbitrary dense vector deletion into `O(1)` while preserving uniform O(1) random indexing.',
        points: 4
      },
      {
        id: 'w23_q14',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Design Browser History` (#1472), how do a dynamic `vector<string>` + `currIdx` + `maxValidIdx` outperform doubly linked lists on `back(steps)` and `forward(steps)`?',
        options: [
          '`back(steps)` and `forward(steps)` jump cleanly in `O(1)` (`curr = max(0, curr - steps)`, `min(last, curr + steps)`) instead of `O(steps)` pointer hopping!',
          'Vectors cannot store strings.',
          '`visit(url)` shifts all elements right.',
          'Linked lists allow `O(1)` random step jumps.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Overwriting `curr + 1` and setting `last = curr` clears forward history in `O(1)` while achieving `O(1)` multi-step jumps.',
        points: 4
      },
      {
        id: 'w23_q15',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'When implementing `Design HashMap` (#706) using separate chaining, what guarantees good average `O(1)` bucket performance?',
        options: [
          'A prime/power-of-two bucket count with uniform hash distribution and resizing/rehashing when load factor (`elements / buckets`) crosses threshold (~0.75).',
          'Single linked list of 1 bucket.',
          'Sorting buckets alphabetically.',
          'Storing keys in a stack.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Bounded load factor + rehashing keeps chain lengths `O(1)` expected.',
        points: 4
      },
      {
        id: 'w23_q16',
        type: 'debugging',
        domain: 'python',
        evaluationMode: 'self_reported_coding',
        prompt: 'Inspect this React chat hook handling SSE streaming when switching workspaces/threads:\n```tsx\nconst sendMessage = async (text: string) => {\n  const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ text }) });\n  const reader = res.body!.getReader();\n  while (true) {\n    const { value, done } = await reader.read();\n    if (done) break;\n    setMessages(prev => [...prev, decode(value)]);\n  }\n};\n```\nSpot THREE UX/correctness bugs (new message bubble created per chunk!, no `AbortController` cleanup, no HTTP error status check) and describe the fix.',
        codeSnippet: 'setMessages(prev => [...prev, decode(value)]);',
        rubricExplanation: 'Bugs: 1) `setMessages` appends a brand new message item for EVERY single token chunk instead of appending tokens to the active assistant message ID; 2) Missing `if (!res.ok)` check silently tries reading 401/429 error JSON as token stream; 3) Missing `AbortController` + unmount/thread-switch cleanup causes stale responses to overwrite newly opened conversations! Also needs buffered `\n\n` SSE frame parsing.',
        points: 10
      },
      {
        id: 'w23_q17',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement `RandomizedSet` (`bool insert(int val)`, `bool remove(int val)`, `int getRandom()`) (`Insert Delete GetRandom O(1)` #380) in C++ with strict `O(1)` average time per operation.',
        codeSnippet: 'class RandomizedSet {\npublic:\n    bool insert(int val) { return false; }\n    bool remove(int val) { return false; }\n    int getRandom() { return 0; }\n};',
        rubricExplanation: '`vector<int> vals; unordered_map<int, int> idx;`. `insert`: return false if exists, else `idx[val] = vals.size(); vals.push_back(val); return true;`. `remove`: if missing return false; `int i = idx[val], last = vals.back(); vals[i] = last; idx[last] = i; vals.pop_back(); idx.erase(val); return true;`. `getRandom`: `vals[rand() % vals.size()]`.',
        points: 10
      },
      {
        id: 'w23_q18',
        type: 'short_answer',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Map all 7 Core Capstone Screens (D156–D161: Auth, Workspace Dashboard, Document Manager, Chat Workspace + Citations Drawer, Conversation History, Admin Usage/Audit) to their backing REST/SSE API endpoints and required RBAC role gates.',
        rubricExplanation: 'Auth: `/auth/login`, `/auth/register`, `/auth/me`; Workspaces: `GET/POST /workspaces` (Admin create/delete, Member read); Docs: `POST /documents/upload`, `GET /documents`, `POST /documents/{id}/retry`, `DELETE /documents/{id}`; Chat: `POST /chat/stream`, `GET /conversations`, `GET /conversations/{id}/messages`; Admin: `GET /admin/usage`, `GET /admin/audit-logs` (Owner/Admin only `403` for Members).',
        points: 6
      },
      {
        id: 'w23_q19',
        type: 'architecture',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Design the Streaming Chat UI + Citation Drawer UX state machine handling: Normal grounded answer, Abstention ("insufficient evidence"), Stopped mid-stream, Upstream 429 Quota Exceeded, and Clicking historical citations 2 weeks later.',
        rubricExplanation: 'Model explicit states (`idle`, `connecting`, `streaming`, `completed`, `aborted`, `rate_limited`, `error`). Attach verified `citations[]` manifest + `abstention: bool` badge on assistant message; disable fake citations; render inline `[Source i]` chips opening Drawer with preserved excerpt & authorized `/documents/{doc_id}/preview` (gracefully indicating `"Source document was deleted by workspace admin"` if 404).',
        points: 8
      },
      {
        id: 'w23_q20',
        type: 'short_answer',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'On Screen 7 (Admin / Usage & Ingestion Audit), which 4 backend-computed metrics give a Tenant Admin genuine operational control without leaking cross-tenant data?',
        rubricExplanation: '1) Monthly token/budget spend breakdown (embedding vs chat input/output tokens + remaining quota %); 2) Indexed documents vs Pending/Failed ingestion queue summary with actionable error codes; 3) Workspace active users & request latency/5xx trend; 4) Tenant audit log (doc uploads, deletes, role changes, failed auth attempts) scoped strictly by verified `tenant_id`.',
        points: 6
      }
    ]
  }),

  // =========================================================================
  // WEEK 24: E2E Journey, Load-Test Report, Eval/Security Evidence, Docs, Demo
  // =========================================================================
  buildWeekAssessment({
    weekNumber: 24,
    title: 'Week 24 Assessment — End-to-End Integration, Load/Security Evidence & Demo Readiness',
    moduleTitle: 'Capstone, load testing and handover',
    topicsCovered: [
      'D162: Verified end-to-end multi-tenant user journey walkthrough',
      'D163: Reproducible k6/Locust load-test report with P50/P95/TTFT & bottlenecks',
      'D164–D165: Retrieval/Generation evaluation evidence & security audit proof',
      'D166–D168: Architecture docs, README/runbooks, live demo & Week 24 build milestone'
    ],
    extraAzureTopics: [
      'Production Readiness Review (PRR) evidence packet & Azure Monitor live dashboards',
      'Cost, scaling, and security posture defense under technical review'
    ],
    questions: [
      {
        id: 'w24_q1',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'In an End-to-End Journey verification (D162), which complete sequence proves the entire RAG system is truly integrated end-to-end?',
        options: [
          'Register Tenant A & Tenant B -> Upload real PDF to Tenant A -> Observe QUEUED -> INDEXED -> Ask answerable + unanswerable + injection queries -> Inspect citations & audit log -> Prove Tenant B receives 403 & zero leaked chunks.',
          'Open localhost login page and take a screenshot.',
          'Run `SELECT 1` in SQL.',
          'Check React CSS compiles.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Full E2E verification exercises auth, persistence, async queue, retrieval, streaming citations, abstention, telemetry, and isolation together.',
        points: 4
      },
      {
        id: 'w24_q2',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'In a credible Load-Test Report (D163), what MUST accompany charts of P95 latency and Requests/Sec for results to be scientifically reproducible?',
        options: [
          'Exact test environment specs (CPU/RAM/replicas), dataset size, concurrency profile, duration, error rate (`429/5xx`), bottleneck breakdown, and before/after tuning comparison.',
          'A single round number (`"Supports 10,000 RPS!"`) with zero context.',
          'Screenshot of empty terminal.',
          'Latency averages only with errors excluded.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Honest load reports document hardware, dataset scale, errors, and real ceiling limits.',
        points: 4
      },
      {
        id: 'w24_q3',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'Why present retrieval metrics (Recall@5, MRR, nDCG) **across iterations** (Baseline Fixed-Size Dense -> Hybrid RRF -> Parent-Child + Cross-Encoder Rerank) in your Evaluation Evidence packet (D164)?',
        options: [
          'Empirical before/after ablation tables prove each architectural complexity upgrade measurably improved quality rather than adding pointless complexity.',
          'Fixed-size always beats Hybrid+Rerank.',
          'Reviewers ignore numbers.',
          'Abstention drops to 0%.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Controlled ablation evidence demonstrates engineering rigor and justifies architectural choices.',
        points: 4
      },
      {
        id: 'w24_q4',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'What concrete proof belongs in a Security Evidence Report (D165)?',
        options: [
          'Passing negative RBAC/IDOR test suite logs, cross-tenant vector isolation check, secret-scan clean report (`0 leaks`), upload magic-byte rejection test, and rate-limit 429 trace.',
          'Claiming `"Our app is 100% unhackable"` in a bullet point.',
          'Sharing production `.env` file as proof.',
          'Disabling login.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Reproducible automated security test artifacts carry far more credibility than unsupported claims.',
        points: 4
      },
      {
        id: 'w24_q5',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'In Documentation (D166), why include explicit Architecture Decision Records (ADRs) explaining **why** you chose e.g. Qdrant or pgvector, FastAPI, and Redis?',
        options: [
          'Captures concrete constraints, rejected alternatives, and trade-offs so future maintainers or interviewers understand system reasoning.',
          'ADRs slow down compilation.',
          'Replaces README setup steps.',
          'Hides bugs.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Short ADRs preserve architectural context and trade-off awareness.',
        points: 4
      },
      {
        id: 'w24_q6',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'During a Live Technical Demo (D167), what should you intentionally demonstrate AFTER showing a smooth happy-path citation answer?',
        options: [
          'Ask an unanswerable question proving clean abstention, show a cross-tenant access denial or prompt-injection refusal, and open live observability/usage traces.',
          'Only ask 1 pre-memorized greeting prompt.',
          'Hide code when bugs appear.',
          'Refresh localhost continuously.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Demonstrating failure boundaries, abstention, and real traces proves production engineering depth.',
        points: 4
      },
      {
        id: 'w24_q7',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'If a live demo environment hits an external LLM rate limit (`429`) mid-presentation, what engineering practice keeps the team composed?',
        options: [
          'Clear user-safe 429 UI message + provider fallback toggle / recorded trace backup, showing graceful error handling rather than raw crash.',
          'Silently freeze the UI forever.',
          'Remove auth checks.',
          'Claim offline caching handles arbitrary unseen questions.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Graceful degradation turns transient provider glitches into proof of resilience.',
        points: 4
      },
      {
        id: 'w24_q8',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'When evaluating load vs quality trade-offs in your Capstone Handover report, how do you summarize the latency impact of enabling Cross-Encoder Reranking?',
        options: [
          'State exact delta honestly (e.g., `"+75ms P95 retrieval latency in exchange for +14% MRR@5 and +11% Recall@5"`, with timeout circuit-breaker fallback).',
          'Pretend reranking adds 0ms latency.',
          'Disable retrieval completely.',
          'Avoid benchmarking latency.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Honest cost/latency/quality quantification is the hallmark of senior systems engineering.',
        points: 4
      },
      {
        id: 'w24_q9',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Before final Handover on Azure, what final FinOps / Cost Governance check ensures dev/load-test cloud spend doesn’t leak after Capstone completion?',
        options: [
          'Verify resource tags, active budget alert thresholds, auto-scale `minReplicas` bounds, and decommission orphaned unattached disks / test snapshots.',
          'Leave 10 idle GPU VMs running.',
          'Delete Azure Monitor.',
          'Set budget alert to $1,000,000.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Cleaning unused test artifacts and verifying autoscale minimums protects ongoing cloud spend.',
        points: 4
      },
      {
        id: 'w24_q10',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should every API repository include a verified `GET /openapi.json` / Swagger schema exported or kept synchronized with Pydantic request/response models?',
        options: [
          'Guarantees frontend TypeScript clients, Postman collections, and QA reviewers work from an exact machine-readable API contract.',
          'Replaces database indexes.',
          'Encrypts cookies.',
          'Compiles Dockerfiles.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Strongly typed OpenAPI contracts eliminate integration guesswork.',
        points: 4
      },
      {
        id: 'w24_q11',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'Why document Known Limitations & Future Roadmap honestly inside the Capstone Handover package?',
        options: [
          'Articulating real scope boundaries (e.g., handwritten cursive OCR limits, video/audio ingestion out-of-scope, future GraphRAG phase) proves mature engineering judgment.',
          'Reviewers prefer pretending there are zero limitations.',
          'Admitting limits removes security rules.',
          'Future roadmaps fix SQL syntax errors.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Candid limitation boundaries demonstrate awareness of production trade-offs.',
        points: 4
      },
      {
        id: 'w24_q12',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'In concurrency debugging during E2E load testing, why does an unbounded `asyncio.gather(*1000_tasks)` against an embedding API fail compared to `asyncio.Semaphore(10)`?',
        options: [
          'Unbounded gather opens 1,000 simultaneous TLS connections triggering socket exhaustion and instant `429` throttling; a bounded semaphore caps concurrent in-flight calls smoothly.',
          'Semaphores make tasks run single-threaded synchronously.',
          'Gather drops exceptions silently without order.',
          'TLS only allows 1 request per minute.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Bounded concurrency (`asyncio.Semaphore`) maximizes throughput without overwhelming sockets or downstream rate limits.',
        points: 4
      },
      {
        id: 'w24_q13',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Decode String` (#394, e.g. `"3[a2[c]]"` -> `"accaccacc"`), why use stacks (`countStack` and `strStack`) cleanly?',
        options: [
          'Nested `[ ... ]` brackets match LIFO: pushing prior string & repeat count on `[` and popping + multiplying `curr` on `]` evaluates arbitrary nesting in `O(outputLength)`.',
          'Greedy regex without recursion handles arbitrary depth.',
          'Queue FIFO reverses brackets.',
          'Sorting characters solves it.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Pair of stacks resolves arbitrary nested bracket scopes linearly.',
        points: 4
      },
      {
        id: 'w24_q14',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Basic Calculator II` (#227, `+`, `-`, `*`, `/` without parentheses), how do you achieve `O(n)` time and `O(1)` space without even needing a full stack?',
        options: [
          'Maintain `res`, `lastTerm`, and `currNum`: resolve `*` and `/` immediately onto `lastTerm` (`lastTerm *= currNum`), while `+`/`-` flush `lastTerm` into `res` first.',
          'Evaluate left-to-right ignoring `*` precedence.',
          'Always require recursion.',
          'Sort operators.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Deferred term accumulation handles operator precedence in constant extra memory.',
        points: 4
      },
      {
        id: 'w24_q15',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Longest Common Subsequence` (#1143) between strings of lengths `m` and `n`, how do you transition `dp[i][j]` when `text1[i-1] == text2[j-1]` vs mismatched?',
        options: [
          'Match: `1 + dp[i-1][j-1]`; Mismatch: `max(dp[i-1][j], dp[i][j-1])`.',
          'Match: `dp[i-1][j] + dp[i][j-1]`; Mismatch: `0`.',
          'Always `1 + min(...)`.',
          'Match: `0`.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Standard 2D LCS recurrence (reducible to `O(min(m, n))` 1D row keeping `prevDiag`).',
        points: 4
      },
      {
        id: 'w24_q16',
        type: 'debugging',
        domain: 'python',
        evaluationMode: 'self_reported_coding',
        prompt: 'Inspect this batch embedding helper triggered during ingestion load tests:\n```python\nasync def embed_all(chunks: list[str]) -> list[list[float]]:\n    return await asyncio.gather(*[embed_one(c) for c in chunks])\n```\nWhen a user uploads a 400-page PDF yielding 1,500 chunks, why does this crash the worker or trigger upstream HTTP 429 storms, and how should it be rewritten?',
        codeSnippet: 'await asyncio.gather(*[embed_one(c) for c in chunks])',
        rubricExplanation: 'Flaws: Fires 1,500 concurrent HTTP requests simultaneously instead of batching text arrays (e.g., 64 chunks per API batch call) AND bounding concurrent batches with `asyncio.Semaphore(4)` + retry/backoff + timeout! Batching cuts 1,500 HTTP calls down to ~24 calls and semaphore caps pressure cleanly.',
        points: 10
      },
      {
        id: 'w24_q17',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement `int longestCommonSubsequence(const std::string& text1, const std::string& text2)` (`#1143`) in C++ using `O(min(m, n))` space and `O(m * n)` time.',
        codeSnippet: 'int longestCommonSubsequence(const std::string& text1, const std::string& text2) {\n    // Space-optimized 1D LCS DP\n}',
        rubricExplanation: 'Ensure `text2` is shorter (`if (text2.size() > text1.size()) swap`). Keep `vector<int> dp(n + 1, 0)`. Outer `i = 1..m`: `int prevDiag = 0;` inner `j = 1..n`: `int temp = dp[j]; dp[j] = (text1[i-1] == text2[j-1]) ? prevDiag + 1 : max(dp[j], dp[j-1]); prevDiag = temp;`. Return `dp[n]`.',
        points: 10
      },
      {
        id: 'w24_q18',
        type: 'short_answer',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Structure the Executive Summary of your Capstone Evaluation & Load-Test Handover Evidence (D163–D164): list the exact golden metrics, k6 load targets, and honest bottlenecks you would report.',
        rubricExplanation: 'Include: 1) Ablation table (Baseline vs Hybrid+Rerank Recall@5, Precision@5, MRR@5, nDCG@5, Faithfulness, Abstention Acc on N-query golden set); 2) k6 Load report (target concurrency, TTFT P50/P95, retrieval P95, ingestion throughput, error rate <0.1%); 3) Observed saturation point and documented mitigation.',
        points: 6
      },
      {
        id: 'w24_q19',
        type: 'architecture',
        domain: 'python',
        evaluationMode: 'rubric_review',
        prompt: 'Design a 5-Minute Live Capstone Demo Script & Security Proof Walkthrough (D165, D167) that proves both product utility AND production hardening in front of senior reviewers.',
        rubricExplanation: 'Min 1: Live workspace creation & real PDF upload showing async status progress (`QUEUED -> INDEXED`) + Prometheus/Monitor counter ticking; Min 2: Grounded chat question streaming live tokens -> clicking `[Source 1]` citation drawer highlighting exact PDF page; Min 3: Unanswerable prompt triggering clean abstention + Indirect injection chunk blocked cleanly; Min 4: Negative Tenant B `403` isolation demo + Admin token cost dashboard; Min 5: CI quality-gate + k6 evidence recap.',
        points: 8
      },
      {
        id: 'w24_q20',
        type: 'short_answer',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'What 6 artifacts make up a complete, engineer-friendly Capstone Handover Documentation Pack (D166)?',
        rubricExplanation: '1) Quickstart + Clean-Env setup (`README` + `.env.example`); 2) System & Trust-Boundary Architecture Diagram; 3) OpenAPI spec + Data Model / Vector Payload Contract; 4) CI/CD + Deployment & Rollback Runbook; 5) Incident / Ops Playbook (queue stall, DB restore, key rotation, 429 spike); 6) Eval, Load & Security Evidence + Known Limitations.',
        points: 6
      }
    ]
  }),

  // =========================================================================
  // WEEK 25: Source-Requirements Audits (API, DB, Vector, Stack, Eval, Security)
  // =========================================================================
  buildWeekAssessment({
    weekNumber: 25,
    title: 'Week 25 Assessment — Source-Requirements Compliance, DB/Vector Audits & Acceptance Sign-Off',
    moduleTitle: 'Source-Requirements, Integration and Handover',
    topicsCovered: [
      'D169–D170: Complete API endpoint inventory, contract accuracy & OpenAPI verification',
      'D171–D172: Relational entity/FK integrity & Vector payload 8-field contract audit',
      'D173: Recommended production tech-stack & dependency audit',
      'D174–D175: Final Evaluation, Security & Acceptance criteria sign-off audit'
    ],
    extraAzureTopics: [
      'Cloud acceptance audit: Azure RBAC, Key Vault, PITR backup verification & cost budget sign-off',
      'Negative compliance testing across Auth, Document ACLs, PII redaction, and Data Deletion'
    ],
    questions: [
      {
        id: 'w25_q1',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'During a Vector Payload Audit (D172), what exact 8 metadata fields must every vector chunk record carry to satisfy multi-tenant governance and citation provenance?',
        options: [
          '`tenant_id`, `workspace_id`, `document_id`, `page`, `section`, `chunk_index`, `source`, and `permissions`.',
          '`username`, `password`, `credit_card`, `ip`, `color`, `font`, `os`, `browser`.',
          'Only `id` and `text`.',
          'Only `embedding`.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'The 8-field contract enables strict tenant/ACL pre-filtering, ordered reconstruction, and rich clickable source citations.',
        points: 4
      },
      {
        id: 'w25_q2',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'During an API Contract Endpoint Inventory Audit (D169–D170), what mismatch breaks frontend reliability most silently?',
        options: [
          'Undocumented nullable fields, inconsistent error envelope shapes across routes (`{"detail": ...}` vs `{"error": ...}`), or missing status codes (`202` vs `200`) in OpenAPI.',
          'Endpoints sorted alphabetically.',
          'Trailing slashes ignored consistently.',
          'Using UUID v4.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Normalized error responses and synchronized Pydantic/OpenAPI schemas keep clients deterministic.',
        points: 4
      },
      {
        id: 'w25_q3',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'When auditing Relational Entities & Relationships (D171), why ensure `ON DELETE CASCADE` (or controlled soft-delete sweep) covers `workspaces -> documents -> chunks -> message_citations` carefully?',
        options: [
          'Guarantees workspace deletion cleanly purges child records without leaving dangling orphaned citations or foreign-key integrity crashes.',
          'Cascading deletes double Postgres speed.',
          'Prevents `SELECT` statements.',
          'Deletes vector DB indexes automatically inside SQL.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Referential integrity + explicit vector cleanup guarantees complete workspace removal.',
        points: 4
      },
      {
        id: 'w25_q4',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'In a Recommended Stack Audit (D173), what red flags indicate unmaintainable or risky dependencies before handover?',
        options: [
          'Known critical CVEs (`pip-audit`/`npm audit`), abandoned unmaintained libraries, conflicting floating versions, or duplicate HTTP/DB clients doing identical jobs.',
          'Using TypeScript strict mode.',
          'Using Pydantic v2.',
          'Pinning versions in lockfiles.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Dependency hygiene eliminates security debt and reduces onboarding friction.',
        points: 4
      },
      {
        id: 'w25_q5',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'During an Evaluation Evidence Audit (D174), why reject an evaluation report that tuned chunking/prompts directly ON the final held-out test set without a separate dev split?',
        options: [
          'Tuning repeatedly on the same final test queries leaks test assumptions ("metric overfitting"), making reported accuracy artificially inflated on unseen user queries.',
          'Dev/test splits break cosine math.',
          'Eval runs only need 2 queries.',
          'Test splits are slower.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Keeping a dev tuning split separate from a clean held-out acceptance test set preserves honest generalization estimates.',
        points: 4
      },
      {
        id: 'w25_q6',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'What acceptance check verifies true **GDPR / Right-to-Erasure** Document Deletion compliance in a RAG platform?',
        options: [
          'Deleting a document purges: (1) Object Storage raw file, (2) PostgreSQL chunks/rows, (3) Vector DB points, and (4) invalidates workspace retrieval/answer caches so zero fragments surface afterward.',
          'Hiding the filename only in React state.',
          'Removing the row from PostgreSQL while leaving Qdrant points active.',
          'Leaving PDF bytes in public S3.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'True deletion sweeps every persistence and cache layer atomically.',
        points: 4
      },
      {
        id: 'w25_q7',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'Under Security & Acceptance Audit (D175), what automated test confirms SSE streaming endpoints ALSO enforce authentication, workspace membership, and tenant rate limits?',
        options: [
          'Sending unauthenticated, cross-tenant, and burst requests directly to `POST /api/v1/chat/stream` verifying `401`, `403`, and `429` BEFORE any stream starts.',
          'Checking `/chat/stream` only in browser manual clicking.',
          'Testing only `/health`.',
          'Returning `200 OK` then streaming `"Unauthorized"` inside SSE text.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Auth, RBAC, and quota checks must fail fast with proper HTTP status codes before opening an SSE stream.',
        points: 4
      },
      {
        id: 'w25_q8',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why should acceptance audits verify database connection strings, JWT signing keys, and TLS settings fail closed (crash at startup) if default dev placeholders (`"changeme"`, `"secret123"`) remain in `ENVIRONMENT=production`?',
        options: [
          'Prevents catastrophic deployment with forgeable default JWT secrets if `.env` wiring was overlooked during release.',
          'Makes local dev slower.',
          'Forces developers to commit production keys to Git.',
          'Turns PostgreSQL off.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Startup secret-strength assertions prevent accidental production launch on insecure defaults.',
        points: 4
      },
      {
        id: 'w25_q9',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'During an Azure Security Audit, why verify BOTH Microsoft Defender for Cloud / Key Vault audit logs AND PostgreSQL/Storage network access rules (`Public Network Access: Disabled`)?',
        options: [
          'Confirms defense-in-depth at both identity control plane and network data plane rather than assuming defaults stayed secure.',
          'Defender for Cloud replaces application RBAC.',
          'Public endpoints run faster queries.',
          'Audit logs fix SQL queries.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Empirical configuration audits verify real deployed state matches intended architecture diagrams.',
        points: 4
      },
      {
        id: 'w25_q10',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'What subtle data-integrity check catches silent mismatches between PostgreSQL `documents.chunk_count` and actual points indexed inside Qdrant?',
        options: [
          'An administrative audit/reconciliation script comparing SQL `chunk_count` against Qdrant `count(filter: doc_id)` and flagging discrepancies.',
          'Counting lines in CSS.',
          'Checking browser cookies.',
          'Running `npm run lint`.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Cross-store count invariants surface partial-write or failed-delete drift rapidly.',
        points: 4
      },
      {
        id: 'w25_q11',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'Why inspect PostgreSQL `EXPLAIN (ANALYZE, BUFFERS)` on your core paginated messages & filtered vector queries before final acceptance?',
        options: [
          'Confirms HNSW, GIN (`tsvector`), and composite B-tree `(tenant_id, workspace_id, created_at)` indexes are actually selected instead of slow `Seq Scan` table sweeps.',
          'Rewrites Python tests automatically.',
          'Drops unused columns.',
          'Generates OpenAPI JSON.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Verifying real query plans at realistic row counts eliminates production query-plan surprises.',
        points: 4
      },
      {
        id: 'w25_q12',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'In Acceptance Sign-Off (D175), what guarantees audit traces capture who did what when across security-sensitive events?',
        options: [
          'Immutable `audit_logs` table recording `{actor_user_id, tenant_id, action, target_type, target_id, request_id, timestamp, ip_hash}` for login failures, role updates, doc uploads/deletes, and key rotations.',
          'Storing temporary `console.log` strings in Chrome DevTools.',
          'Writing events to browser `sessionStorage`.',
          'Logging only errors.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Tamper-evident audit logs fulfill enterprise compliance and forensic traceability.',
        points: 4
      },
      {
        id: 'w25_q13',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Word Search II` (#212), why does indexing all dictionary words into a **Trie** + backtracking over the board outperform running `Word Search` (#79) separately for `K` words?',
        options: [
          'Shared prefixes are traversed simultaneously in ONE DFS pass across the board, pruning dead board cells immediately when no Trie child exists (plus removing matched leaf words to avoid duplicate work).',
          'Trie converts the 2D board into 1D array.',
          'Separate DFS for 30,000 words runs in `O(1)`.',
          'Hashing board cells skips adjacency.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Trie pruning cuts exponential branching early across large word dictionaries.',
        points: 4
      },
      {
        id: 'w25_q14',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Find the Duplicate Number` (#287), how does treating array values as next-index pointers (`0 -> nums[0] -> ...`) locate the duplicate in `O(n)` time and `O(1)` space without modifying `nums`?',
        options: [
          'By Pigeonhole Principle over `[1..n]` in length `n+1`, the duplicate target creates a cycle entry point found exactly via Floyd’s Tortoise & Hare Phase 1 + Phase 2.',
          'Sum `1..n` and subtract array sum (fails if duplicate appears >2 times!).',
          'Sort `nums` (modifies input and takes `O(n log n)`).',
          'Hash set (`O(n)` space).'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Floyd cycle detection handles repeats appearing 2+ times strictly read-only in `O(1)` auxiliary space.',
        points: 4
      },
      {
        id: 'w25_q15',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Copy List with Random Pointer` (#138), how can deep cloning run in `O(n)` time and `O(1)` auxiliary space (excluding cloned nodes)?',
        options: [
          'Interleave cloned nodes right after originals (`A -> A\' -> B -> B\'`), assign `A\'->random = A->random->next`, then unweave the two lists.',
          'Traverse `random` pointers recursively without a map (loops forever on cycles!).',
          'Compare node values for equality (breaks on duplicate values!).',
          'Requires `O(n²)` scan.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Interweaving links each original directly to its clone without an `O(n)` hash table.',
        points: 4
      },
      {
        id: 'w25_q16',
        type: 'debugging',
        domain: 'rag',
        evaluationMode: 'self_reported_coding',
        prompt: 'During Week 25 Code & Vector Audit, you uncover this Qdrant deletion & ingestion payload snippet:\n```python\npoints.append(PointStruct(id=uid, vector=vec, payload={\n    "doc_id": doc.id, "page": p, "text": chunk_text\n}))\n# And on document delete:\nawait db.execute(delete(Document).where(Document.id == doc_id))\n```\nIdentify ALL compliance/contract failures against the Week 25 Page-16 Audit criteria and write the compliant implementation.',
        codeSnippet: 'payload={"doc_id": doc.id, "page": p, "text": chunk_text}\nawait db.execute(delete(Document).where(Document.id == doc_id))',
        rubricExplanation: 'Failures: 1) Vector payload is missing 6 of 8 mandatory audit/isolation fields (`tenant_id`, `workspace_id`, `section`, `chunk_index`, `source`, `permissions`) — breaking multi-tenant pre-filtering and ACL isolation!; 2) `DELETE` omits `tenant_id` check (IDOR!) and NEVER deletes vectors from Qdrant, objects from Blob Storage, or bumps Redis workspace cache epoch! Fix: enforce full 8-field payload + keyword payload indexes, verify `tenant_id` ownership on delete, purge Qdrant points & Blob file, invalidate workspace cache epoch, and commit audit log.',
        points: 10
      },
      {
        id: 'w25_q17',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement `int findDuplicate(const std::vector<int>& nums)` (`#287`) in C++ read-only (`const&`) in `O(n)` time and `O(1)` auxiliary space using Floyd’s Cycle Detection.',
        codeSnippet: 'int findDuplicate(const std::vector<int>& nums) {\n    // Phase 1: intersection; Phase 2: cycle entrance\n}',
        rubricExplanation: '`int slow = nums[0], fast = nums[0]; do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast); slow = nums[0]; while (slow != fast) { slow = nums[slow]; fast = nums[fast]; } return slow;`.',
        points: 10
      },
      {
        id: 'w25_q18',
        type: 'short_answer',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Perform a Database Entity & Relationship Audit checklist across `tenants`, `users`, `memberships`, `workspaces`, `documents`, `ingestion_jobs`, `conversations`, `messages`, and `usage_events`. Which indexes & constraints MUST exist?',
        rubricExplanation: 'Composite unique `(tenant_id, user_id)` on memberships; foreign keys with explicit delete behavior; composite B-tree `(tenant_id, workspace_id, status)` on documents, `(conversation_id, created_at)` on messages, `(tenant_id, created_at)` on usage_events & audit_logs; partial/unique SHA-256 `(workspace_id, content_hash)` check; HNSW + GIN index on chunks if using pgvector.',
        points: 6
      },
      {
        id: 'w25_q19',
        type: 'architecture',
        domain: 'python',
        evaluationMode: 'rubric_review',
        prompt: 'Design an Automated Pre-Signoff Acceptance Audit Runner (`scripts/acceptance_audit.py`) that outputs a deterministic Pass/Fail compliance checklist verifying API contracts, Postgres/Vector parity, security bounds, and production config invariants.',
        rubricExplanation: 'Checks: 1) Fail-closed production settings assertion (no default secrets, HTTPS/CORS strict, `DEBUG=False`); 2) Live Postgres index & RLS check + Qdrant payload index check; 3) Cross-store parity check (`SQL INDEXED chunks == Vector points count`); 4) Automated negative auth/IDOR/upload-magic-byte verification; 5) Clean CI eval benchmark threshold check.',
        points: 8
      },
      {
        id: 'w25_q20',
        type: 'short_answer',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'Summarize the 5 highest-severity items you verify in a Cloud & Security Acceptance Audit before declaring a multi-tenant AI application ready for external customer onboarding.',
        rubricExplanation: '1) Zero public storage buckets or DB/Redis ports (private network + Managed Identity RBAC verified); 2) Secret scan clean + Key Vault rotation configured; 3) Tenant isolation verified at API + DB + Vector + Cache layers; 4) Tested PITR DB & Blob restore drill completed; 5) Budget caps, 429 limits, Content Safety shields & SLO alerts active.',
        points: 6
      }
    ]
  }),

  // =========================================================================
  // WEEK 26: Final Capstone Audit, Submission Pack, Grading Rubric, Viva & Release Rehearsal (Unlocks 14 May 2027)
  // =========================================================================
  buildWeekAssessment({
    weekNumber: 26,
    title: 'Week 26 Final Assessment — Capstone Sign-Off, Architecture Viva & Production Release Rehearsal',
    moduleTitle: 'Source-Requirements, Integration and Handover',
    topicsCovered: [
      'D176–D177: Complete Capstone UI screens 1–7 parity & polish verification',
      'D178: Final submission pack (code, OpenAPI, eval, load, security, ops docs)',
      'D179: End-to-end grading rubric self-audit & senior mentor architecture viva defense',
      'D180: Final production release rehearsal, clean-room deploy & post-launch handover readiness'
    ],
    extraAzureTopics: [
      'Final multi-track mastery defense: AI/RAG Systems + C++ DSA Problem Solving + Azure Cloud Architecture',
      'Production Go/No-Go release rehearsal, canary verification & rollback readiness'
    ],
    questions: [
      {
        id: 'w26_q1',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'In the Final Grading Rubric & Capstone Defense (D179), what distinguishes an enterprise Production-Grade RAG system from a weekend tutorial wrapper?',
        options: [
          'Enforced server-side multi-tenant isolation across API/DB/Vector/Cache, async resilient ingestion, hybrid+rerank eval gates, verifiable citations & abstention, observability, CI/CD, and tested rollback/recovery.',
          'Using a single 30-line script pasting an entire PDF into one GPT prompt.',
          'Having colorful landing page animations without auth.',
          'Hiding errors with empty `try/except: pass` blocks.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Production engineering spans security boundaries, observability, empirical evaluation, fault tolerance, and reproducible operations.',
        points: 4
      },
      {
        id: 'w26_q2',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'During the Final Release Rehearsal (D180 Go/No-Go gate), what discovery MUST trigger an immediate **"No-Go"** hold before promoting to production?',
        options: [
          'Any cross-tenant isolation failure, unpinned broken migration, failing golden abstention/faithfulness gate, or unverified secret leak — regardless of schedule pressure.',
          'One minor non-blocking alignment tweak inside a help tooltip.',
          'A team wanting an extra feature outside MVP scope.',
          'Logs printing structured JSON.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Security correctness, data integrity, and release gates are non-negotiable launch criteria.',
        points: 4
      },
      {
        id: 'w26_q3',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'In a Senior Architecture Viva, when asked *"How would you debug hallucinated policy numbers slipping past your RAG prompt?"*, what systematic root-cause order is strongest?',
        options: [
          'Inspect trace: (1) Were right chunks retrieved? (Recall) -> (2) Did rerank/compression truncate footnotes or numbers? (Context integrity) -> (3) Did prompt/citation validator permit uncited claims? (Generation faithfulness) -> Fix faulty stage & add regression case.',
          'Randomly raise `temperature` from 0.1 to 1.2.',
          'Add 200 more irrelevant chunks to prompt.',
          'Delete PostgreSQL.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Trace-driven stage isolation diagnoses retrieval vs context assembly vs generation defects cleanly.',
        points: 4
      },
      {
        id: 'w26_q4',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'When asked *"How do you cut RAG monthly LLM inference costs by 50% without dropping answer accuracy?"*, which measured engineering levers work best together?',
        options: [
          'Improve retrieval precision (`top_n` tight parent chunks instead of dumping 20 noisy chunks), route simple classification/query-rewrite calls to fast mini models, enable prompt-prefix caching, and use tenant-scoped semantic/exact caches.',
          'Disable retrieval altogether.',
          'Force 1-word answers for every user prompt.',
          'Double `chunk_overlap` to 80%.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Shorter higher-precision context, tiered model routing, prefix caching, and safe tenant caching cut cost while often improving accuracy.',
        points: 4
      },
      {
        id: 'w26_q5',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'In the Final Submission Pack (D178), why verify that EVERY claimed metric in the README / Handover deck links to a runnable evaluation or load-test command?',
        options: [
          'Reproducible commands prove honest verified engineering rather than fabricated resume/deck numbers.',
          'Long READMEs double Python runtime speed.',
          'Links replace unit tests.',
          'Docker requires READMEs to boot.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Empirical reproducibility separates authentic engineering claims from hype.',
        points: 4
      },
      {
        id: 'w26_q6',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'After completing Day 180 Production Release Rehearsal (canary pass -> 100% traffic), what post-launch hypercare checks verify stability across the first 60 minutes?',
        options: [
          'Watch error budget / 5xx rate, TTFT P95, ingestion queue lag, DB connection pool headroom, and real-time OpenTelemetry exception traces.',
          'Shut down monitoring to save RAM.',
          'Delete the previous container revision immediately so rollback is impossible.',
          'Run `FLUSHALL` on Redis.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Active post-launch observation while retaining warm rollback capability minimizes incident impact.',
        points: 4
      },
      {
        id: 'w26_q7',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Synthesizing AZ-900, DP-900, and AI-102 in a cloud mentor viva: which Azure architecture cleanly secures multi-tenant RAG end-to-end?',
        options: [
          'Entra/JWT auth + Private VNet endpoints + Managed Identity RBAC + Key Vault + Azure PostgreSQL (PITR HA) + Private Blob Storage + Azure AI Search (hybrid+semantic+tenant `$filter`) + Azure OpenAI w/ Content Safety Prompt Shields + Monitor/Cost Alerts.',
          'Single public VM running SQLite + `.env` plaintext + public Blob container.',
          'Static HTML calling Azure OpenAI directly from browser JS.',
          'Local localhost server with manual copy-paste.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Every layer enforces zero-trust identity, private networking, transactional durability, hybrid precision, and cost/telemetry control.',
        points: 4
      },
      {
        id: 'w26_q8',
        type: 'mcq',
        domain: 'rag',
        evaluationMode: 'auto_mcq',
        prompt: 'If a Capstone reviewer asks: *"Suppose our corpus scales 100x from 50,000 chunks to 5,000,000 chunks across 2,000 tenants — what bottlenecks hit FIRST?"*',
        options: [
          'Vector HNSW RAM footprint (mitigate via Qdrant scalar quantization / sharding / per-large-tenant partitioning), ingestion OCR worker queue throughput (KEDA autoscale + priority queues), and Postgres table partitioning/archiving.',
          'React JSX `<button>` rendering speed.',
          'JWT string length.',
          'JSON key names.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'RAM-bound ANN graphs, worker queue throughput, and relational table bloat/index pressure dominate at 100x scale.',
        points: 4
      },
      {
        id: 'w26_q9',
        type: 'mcq',
        domain: 'genai',
        evaluationMode: 'auto_mcq',
        prompt: 'Why is keeping an explicit **Audit Trace** (`retrieved_chunk_ids`, `model_version`, `prompt_version`, `latency_ms`) essential months after release?',
        options: [
          'Enables auditing historical compliance answers deterministically ("why did the assistant cite X on Jan 15?") even after prompts, chunkers, or models upgrade.',
          'Compresses PDF storage.',
          'Forces browsers to refresh SSE.',
          'Avoids unit testing.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Immutable provenance traces make enterprise AI systems accountable and debuggable over long lifecycles.',
        points: 4
      },
      {
        id: 'w26_q10',
        type: 'mcq',
        domain: 'python',
        evaluationMode: 'auto_mcq',
        prompt: 'When performing Final QA across Capstone Screens 1–7 (D176–D177), why test keyboard navigation, mobile viewports, loading skeletons, and readable error messages?',
        options: [
          'Usability, accessibility, and graceful error recovery turn technically strong backends into polished products users actually adopt.',
          'Mobile viewports change vector cosine scores.',
          'Loading skeletons replace authentication.',
          'CORS requires responsive design.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'End-to-end polish closes the gap between internal prototype and real-world software.',
        points: 4
      },
      {
        id: 'w26_q11',
        type: 'mcq',
        domain: 'ml',
        evaluationMode: 'auto_mcq',
        prompt: 'In your Career & Architecture Portfolio reflection after 180 days: how should evaluation metrics for any AI feature be tracked post-launch?',
        options: [
          'Combine offline CI regression gates (golden set before deploy) with online production telemetry (abstention ratio, user citation clicks, thumbs feedback, TTFT, cost per resolved query).',
          'Launch once and never measure offline or online metrics again.',
          'Track only total server uptime.',
          'Optimize only prompt word count.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Closed-loop offline + online observability sustains quality as data and user patterns evolve.',
        points: 4
      },
      {
        id: 'w26_q12',
        type: 'mcq',
        domain: 'azure',
        evaluationMode: 'auto_mcq',
        prompt: 'Under Final Production Handover, why schedule automated chaos / restore drills periodically after initial launch?',
        options: [
          'Systems evolve continuously; periodic backup restore & failover drills ensure RPO/RTO promises remain true months after launch.',
          'Chaos drills delete production tenants randomly without staging.',
          'Backups never break once created.',
          'Runbooks update themselves.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Operational resilience is a continuous habit, not a one-time Day 180 checkbox.',
        points: 4
      },
      {
        id: 'w26_q13',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Longest Consecutive Sequence` (#128), how do you find the longest consecutive integer run in `O(n)` average time?',
        options: [
          'Put all elements in an `unordered_set<int>`; iterate unique set entries `x` and ONLY expand `x+1, x+2...` upward when `x - 1` is NOT in the set (each element visited at most twice).',
          'Sort `nums` first (`O(n log n)`).',
          'Expand both up and down from every duplicate copy (`O(n²)`!).',
          'Use a 2D DP matrix.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Starting chains exclusively at sequence starts (`!set.count(x - 1)`) guarantees linear overall time.',
        points: 4
      },
      {
        id: 'w26_q14',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Burst Balloons` (#312), why does Interval DP iterate over choosing which balloon `k` bursts **LAST** inside range `(left, right)` rather than which bursts FIRST?',
        options: [
          'Choosing `k` to burst FIRST makes left and right subproblems coupled (`nums[k-1]` touches `nums[k+1]`); choosing `k` to burst LAST keeps boundaries `nums[left]` and `nums[right]` fixed cleanly across independent `(left, k)` and `(k, right)` subproblems!',
          'Greedy smallest-first always gives optimal coins.',
          'First-burst DP runs in `O(n)`.',
          'Subproblems never overlap.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Thinking backward ("last remaining item") decouples interval DP subproblems cleanly in `O(n³)`.',
        points: 4
      },
      {
        id: 'w26_q15',
        type: 'mcq',
        domain: 'dsa',
        evaluationMode: 'auto_mcq',
        prompt: 'In `Sliding Window Median` (#480), how do two heaps support deleting outgoing expired window elements (`nums[i - k]`) without `O(k)` heap scanning?',
        options: [
          'Track outgoing deletions lazily in an `unordered_map<int, int> delayed` and prune expired elements whenever they surface to either heap’s `top()` during rebalancing (while tracking valid logical sizes separately).',
          'Always rebuild both heaps from scratch (`O(nk)`).',
          'Ignore outgoing elements.',
          'Min-heap supports arbitrary `O(1)` value deletion in STL `priority_queue`.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Lazy deletion (or balanced `multiset` / dual-set) preserves `O(n log k)` window median performance.',
        points: 4
      },
      {
        id: 'w26_q16',
        type: 'debugging',
        domain: 'python',
        evaluationMode: 'self_reported_coding',
        prompt: 'Final Release Audit! Look at this production deployment config & chat guard:\n```python\nsettings = Settings()  # SECRET_KEY default = "dev-secret"\napp.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True)\n\n@app.post("/api/v1/admin/reindex/{tenant_id}")\nasync def reindex(tenant_id: str, user=Depends(current_user)):\n    background_tasks.add_task(rebuild_vectors, tenant_id)\n    return {"status": "started"}\n```\nList ALL FOUR Go/No-Go Release Blockers present and provide the exact fixes.',
        codeSnippet: 'SECRET_KEY default = "dev-secret"\nallow_origins=["*"], allow_credentials=True\nasync def reindex(tenant_id: str, user=Depends(current_user)): ...',
        rubricExplanation: 'Blockers: 1) Predictable default `SECRET_KEY="dev-secret"` — must fail startup if weak/default in prod; 2) Wildcard CORS `*` with `allow_credentials=True` — restrict explicitly to trusted frontend origins; 3) Critical IDOR/Privilege Escalation on `/admin/reindex/{tenant_id}` — allows ANY Member from Tenant A to trigger expensive/destructive reindexing for Tenant B! Must verify Admin/Owner authorization & match `user.tenant_id == tenant_id`; 4) `background_tasks.add_task` runs in-process inside API pod (lost on scale-in/restart) instead of durable Celery/Redis queue returning `202 Accepted` with `job_id`.',
        points: 10
      },
      {
        id: 'w26_q17',
        type: 'coding',
        domain: 'dsa',
        evaluationMode: 'self_reported_coding',
        prompt: 'Implement `int longestConsecutive(const std::vector<int>& nums)` (`Longest Consecutive Sequence` #128) in C++ in `O(n)` average time cleanly avoiding overflow on `INT_MIN - 1` (`x == INT_MIN` check!).',
        codeSnippet: 'int longestConsecutive(const std::vector<int>& nums) {\n    // O(n) hash-set sequence-start expansion\n}',
        rubricExplanation: '`unordered_set<int> s(nums.begin(), nums.end()); int best = 0; for (int x : s) { if (x != INT_MIN && s.count(x - 1)) continue; int cur = x, len = 1; while (cur != INT_MAX && s.count(cur + 1)) { cur++; len++; } best = max(best, len); } return best;`',
        points: 10
      },
      {
        id: 'w26_q18',
        type: 'short_answer',
        domain: 'rag',
        evaluationMode: 'rubric_review',
        prompt: 'Senior Architecture Viva Question 1: Defend your entire 180-Day Production RAG Stack end-to-end in 8 crisp sentences — covering Ingestion, Chunking/Vectors, Hybrid+Rerank Retrieval, Grounded SSE Chat, Security Isolation, Observability, CI/CD Gates, and Disaster Recovery.',
        rubricExplanation: 'Must weave cohesively: validated magic-byte upload -> Blob + Redis/Celery async OCR/PyMuPDF -> token-counted recursive/parent-child chunking w/ 8-field ACL metadata -> Hybrid BM25+Vector RRF + Cross-Encoder Rerank + fallback -> strictly grounded SSE streaming w/ verified citations & abstention -> server-derived tenant/ACL filtering + rate limits/quotas -> structured JSON OTel traces + token costing -> automated pytest/Ragas/k6 gates + immutable SHA canary CD + tested Postgres/Blob/Vector recovery.',
        points: 6
      },
      {
        id: 'w26_q19',
        type: 'architecture',
        domain: 'azure',
        evaluationMode: 'rubric_review',
        prompt: 'Final Release Rehearsal (D180): Outline your step-by-step Go/No-Go Launch Runbook from T-24h Freeze through Canary Promotion, First-Hour Monitoring, and Post-Launch Handover Verification.',
        rubricExplanation: 'T-24h: Security/secret audit + PITR backup baseline verified + clean-env staging smoke pass + eval/load sign-off; T-0: backward-compatible Alembic migration -> deploy Canary revision (10%) -> verify `/readyz`, 0 cross-tenant leaks, clean logs & normal TTFT -> promote 100%; T+60m: check 5xx (<0.1%), queue lag, cache hit rate, token spend; Final Handover: deliver repo, ADRs, OpenAPI, eval/load evidence, runbooks.',
        points: 8
      },
      {
        id: 'w26_q20',
        type: 'short_answer',
        domain: 'dsa',
        evaluationMode: 'rubric_review',
        prompt: 'Reflect on integrating 100 days of C++ DSA + 100 days of Azure Cloud + 180 days of Production RAG Engineering: describe 2 concrete places inside a RAG/AI system where classic DSA algorithms directly prevented severe production scaling bugs.',
        rubricExplanation: 'Examples: 1) Sliding-window / Token Bucket + Trie/Prefix trees for O(1)/O(L) rate-limiting & secret/PII redaction scanners instead of quadratic string scans; 2) Min-heaps (`top-K`), hash-set deduplication (`Parent-Child`), DAG dependency scheduling, and dual-heap streaming percentiles (`P95`) preventing O(N²) memory/CPU stalls under concurrent traffic.',
        points: 6
      }
    ]
  })
];
