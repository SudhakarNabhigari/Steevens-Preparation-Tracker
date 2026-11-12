import { Assessment } from '../types';

export const WEEKLY_ASSESSMENTS: Assessment[] = [
  {
    weekNumber: 1,
    title: 'Week 1 Assessment — Product, Python & Web Foundations',
    moduleTitle: 'Product, Python and web foundations',
    scheduledDayNumber: 6, // Day 6 (Saturday 21 Nov 2026)
    scheduledDate: '21 Nov 2026',
    durationMinutes: 180,
    topicsCovered: [
      'Product framing & acceptance criteria',
      'Ingestion & QA architecture dataflow',
      'Python typing, packaging, and async concepts',
      'HTTP methods, status codes, and JSON serialization',
      'FastAPI health checks & environment separation'
    ],
    totalPoints: 100,
    passThreshold: 70,
    questions: [
      {
        id: 'w1_q1',
        type: 'mcq',
        prompt: 'In a production RAG architecture, why must the frontend NEVER call the LLM provider or vector database directly?',
        options: [
          'Because browsers do not support sending POST HTTP requests to external domains.',
          'To keep provider API keys, database credentials, and tenant authorization decisions strictly server-side.',
          'Because vector similarity search requires GPU acceleration only available on native operating systems.',
          'Because JSON serialization is too slow when performed inside modern web browsers.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Direct frontend calls expose secret API keys, allow client-side tenant spoofing, and bypass rate limiting and audit logging.',
        points: 15
      },
      {
        id: 'w1_q2',
        type: 'mcq',
        prompt: 'Which HTTP status code should an ingestion endpoint return when an uploaded document has been validated and queued for background parsing?',
        options: [
          '200 OK with the final extracted text',
          '201 Created with the full vector index payload',
          '202 Accepted with a job/document ID for status polling',
          '204 No Content without returning any body'
        ],
        correctAnswer: 2,
        rubricExplanation: '202 Accepted signifies that the request has been received and accepted for processing, but processing has not completed.',
        points: 15
      },
      {
        id: 'w1_q3',
        type: 'short_answer',
        prompt: 'Explain the difference between CPU-bound blocking operations (such as PyMuPDF extraction) and I/O-bound async operations in a FastAPI event loop, and how FastAPI handles them.',
        rubricExplanation: 'CPU-bound operations block the single-threaded asyncio event loop. In FastAPI, declaring a route with "def" runs it in a background threadpool (ThreadPoolExecutor), whereas "async def" runs on the event loop. For heavy tasks, use run_in_threadpool or offload to background queues like Celery/RQ.',
        points: 20
      },
      {
        id: 'w1_q4',
        type: 'debugging',
        prompt: 'A junior engineer commits the following FastAPI health endpoint:\n\n```python\n@app.get("/health")\ndef health():\n    return {"status": "ok"}\n```\nIdentify two major production shortcomings with this health check and rewrite it to adhere to production requirements.',
        codeSnippet: '@app.get("/health")\ndef health():\n    return {"status": "ok"}',
        rubricExplanation: 'Shortcomings: 1) Shallow check that does not verify dependent services (PostgreSQL database, Redis queue, vector store); 2) Does not return HTTP 503 Service Unavailable when a critical dependency is down. Solution should check DB connection and return component health statuses with proper status codes.',
        points: 25
      },
      {
        id: 'w1_q5',
        type: 'architecture',
        prompt: 'Trace the complete lifecycle of a document ingestion request from the moment an enterprise user drops a PDF in the browser until it is marked "INDEXED". Identify every trust boundary, worker handoff, and storage location.',
        rubricExplanation: 'Browser upload → API validation (MIME, size, magic bytes) → Object storage (S3 original raw bytes) → Queue background job (Redis + Celery) → Text extraction & OCR (PyMuPDF) → Cleaning & chunking → Embeddings generation → Vector DB insertion (Qdrant/pgvector) with tenant/doc ACL metadata → Relational DB status update to INDEXED.',
        points: 25
      }
    ]
  },
  {
    weekNumber: 2,
    title: 'Week 2 Assessment — Frontend UI, React & Backend API Integration',
    moduleTitle: 'Frontend UI and backend API',
    scheduledDayNumber: 13, // Day 13 (Saturday 28 Nov 2026)
    scheduledDate: '28 Nov 2026',
    durationMinutes: 180,
    topicsCovered: [
      'React state management and controlled inputs',
      'Protected routes and JWT token storage',
      'FastAPI routers and Pydantic v2 schemas',
      'CORS security and error normalization',
      'Handling loading, empty, and error UI states'
    ],
    totalPoints: 100,
    passThreshold: 70,
    questions: [
      {
        id: 'w2_q1',
        type: 'mcq',
        prompt: 'Why should JWT access tokens never be stored in unencrypted browser LocalStorage in high-compliance enterprise applications?',
        options: [
          'LocalStorage is cleared whenever the user refreshes the browser page.',
          'LocalStorage is vulnerable to Cross-Site Scripting (XSS) extraction; HttpOnly SameSite cookies offer higher protection.',
          'LocalStorage only supports binary data and cannot serialize JWT strings.',
          'LocalStorage requests exceed standard HTTP header size limits.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'JavaScript running in the page has full read access to LocalStorage. If an XSS vulnerability exists, tokens can be exfiltrated. HttpOnly cookies cannot be read by JavaScript.',
        points: 15
      },
      {
        id: 'w2_q2',
        type: 'mcq',
        prompt: 'When FastAPI validates incoming JSON requests using Pydantic, what status code does it automatically return upon validation failure?',
        options: ['400 Bad Request', '401 Unauthorized', '422 Unprocessable Entity', '500 Internal Server Error'],
        correctAnswer: 2,
        rubricExplanation: 'FastAPI uses HTTP 422 Unprocessable Entity for schema validation failures with detailed field error locations.',
        points: 15
      },
      {
        id: 'w2_q3',
        type: 'short_answer',
        prompt: 'How does FastAPI’s Dependency Injection system (`Depends`) improve security and testability in multi-tenant API routes?',
        rubricExplanation: 'FastAPI Depends allows centralized extraction and validation of the authenticated user and tenant_id from the authorization header. In tests, dependencies can be overridden (app.dependency_overrides) with mock authenticated users without hitting the database.',
        points: 20
      },
      {
        id: 'w2_q4',
        type: 'debugging',
        prompt: 'Your React frontend running on http://localhost:3000 throws `CORS error: No "Access-Control-Allow-Origin" header is present on the requested resource` when calling FastAPI on http://localhost:8000. Describe the root cause and provide the exact FastAPI CORSMiddleware code to fix it securely for development.',
        codeSnippet: '# FastAPI CORS configuration needed',
        rubricExplanation: 'Cause: Browser Same-Origin Policy blocks cross-origin requests unless the backend explicitly responds with Access-Control-Allow-Origin. Fix: Add CORSMiddleware with allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"].',
        points: 25
      },
      {
        id: 'w2_q5',
        type: 'architecture',
        prompt: 'Design a resilient frontend API client pattern in TypeScript that handles automatic retry on transient network errors, token expiration with 401 interceptors, and user-friendly error normalization.',
        rubricExplanation: 'Should detail central Axios or fetch wrapper, interceptor logic checking error.response.status === 401, refresh token queue or logout redirect, and normalizing diverse backend error structures into a typed AppError.',
        points: 25
      }
    ]
  },
  {
    weekNumber: 3,
    title: 'Week 3 Assessment — Multi-Tenancy, Database Schemas & RBAC',
    moduleTitle: 'Authentication, database and tenant model',
    scheduledDayNumber: 20, // Day 20 (Saturday 05 Dec 2026)
    scheduledDate: '05 Dec 2026',
    durationMinutes: 180,
    topicsCovered: [
      'Relational schema design (users, tenants, workspaces, documents, messages)',
      'Password hashing with bcrypt / Argon2',
      'Role-Based Access Control (Owner, Admin, Member)',
      'Server-side authorization vs client parameters',
      'Negative security testing and cross-tenant leakage prevention'
    ],
    totalPoints: 100,
    passThreshold: 70,
    questions: [
      {
        id: 'w3_q1',
        type: 'mcq',
        prompt: 'In a multi-tenant PostgreSQL schema, what is the most critical constraint when querying documents by document_id?',
        options: [
          'Always use SELECT * without WHERE clauses.',
          'Always filter by tenant_id extracted from the verified server session, never trusting client-supplied tenant_id parameters.',
          'Filter by the user IP address stored in the request headers.',
          'Use client-side localStorage to confirm document ownership.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Trusting client-supplied tenant IDs or omitting tenant_id checks creates Insecure Direct Object References (IDOR), allowing User A to access User B documents.',
        points: 15
      },
      {
        id: 'w3_q2',
        type: 'mcq',
        prompt: 'Why should password hashes never be generated using fast general-purpose hash algorithms like MD5 or SHA-256?',
        options: [
          'Because MD5 and SHA-256 produce characters unsupported by PostgreSQL text columns.',
          'Because modern GPUs can compute billions of SHA-256 hashes per second, making brute-force dictionary attacks trivial; slow, salted algorithms like bcrypt or Argon2 are required.',
          'Because SHA-256 cannot hash passwords longer than 16 characters.',
          'Because Python does not include built-in support for SHA-256.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Password hashing requires computationally expensive, memory-hard algorithms with unique salts to defeat rainbow tables and GPU cracking.',
        points: 15
      },
      {
        id: 'w3_q3',
        type: 'short_answer',
        prompt: 'Describe the role-based permissions matrix for a B2B RAG system across Owner, Admin, and Member roles.',
        rubricExplanation: 'Owner: Tenant settings, billing, deletion of workspace/tenant, invite admins. Admin: Create/delete workspaces, upload/delete documents, view usage analytics, invite members. Member: Query chat, view workspace documents, download citations, view own session history.',
        points: 20
      },
      {
        id: 'w3_q4',
        type: 'debugging',
        prompt: 'Review the following backend endpoint:\n\n```python\n@app.get("/api/v1/workspaces/{workspace_id}/documents")\ndef list_docs(workspace_id: str, db: Session = Depends(get_db)):\n    return db.query(Document).filter(Document.workspace_id == workspace_id).all()\n```\nWhat vulnerability does this code introduce, and how must it be refactored?',
        codeSnippet: '@app.get("/api/v1/workspaces/{workspace_id}/documents")\ndef list_docs(workspace_id: str, db: Session = Depends(get_db)):\n    return db.query(Document).filter(Document.workspace_id == workspace_id).all()',
        rubricExplanation: 'IDOR vulnerability: Any unauthenticated or cross-tenant user who knows or guesses a workspace_id UUID can view all documents. Refactor must require current_user, verify user has membership in workspace’s tenant, and query with tenant_id filter.',
        points: 25
      },
      {
        id: 'w3_q5',
        type: 'architecture',
        prompt: 'Write an automated negative security test in pytest that verifies User A (Tenant A) receives an HTTP 403 or 404 when attempting to fetch a document belonging to User B (Tenant B).',
        rubricExplanation: 'Test should create Tenant A + User A and Tenant B + User B + Document B. Issue GET /api/v1/documents/{doc_b_id} with User A authorization header. Assert response status code is 403 or 404 and response does not contain Document B metadata.',
        points: 25
      }
    ]
  },
  {
    weekNumber: 4,
    title: 'Week 4 Assessment — Document Ingestion, Parsing & Background Workers',
    moduleTitle: 'File upload and document ingestion',
    scheduledDayNumber: 27, // Day 27 (Saturday 12 Dec 2026)
    scheduledDate: '12 Dec 2026',
    durationMinutes: 180,
    topicsCovered: [
      'File validation (magic bytes, MIME type, size limits)',
      'Object storage separation vs database storage',
      'PyMuPDF extraction and OCR fallbacks',
      'Asynchronous worker queues with Celery / RQ and Redis',
      'Job lifecycle states and idempotency on retries'
    ],
    totalPoints: 100,
    passThreshold: 70,
    questions: [
      {
        id: 'w4_q1',
        type: 'mcq',
        prompt: 'Why should document text extraction never be performed synchronously inside the HTTP file upload request handler?',
        options: [
          'Because HTTP clients automatically disconnect if a request takes longer than 5 milliseconds.',
          'Large PDFs take seconds or minutes to parse and OCR, causing HTTP timeouts, socket exhaustion, and worker thread starvation in web servers.',
          'Because object storage cannot store files that are currently being parsed.',
          'Because browsers cannot display progress spinners during async jobs.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Synchronous parsing of large documents exhausts HTTP worker pools, triggers client proxy gateway timeouts (504), and ruins user experience.',
        points: 15
      },
      {
        id: 'w4_q2',
        type: 'mcq',
        prompt: 'What is the primary indicator that an uploaded PDF requires Optical Character Recognition (OCR) rather than standard text extraction?',
        options: [
          'The PDF filename contains uppercase letters.',
          'The document contains more than 10 pages.',
          'Standard extraction tools (e.g. PyMuPDF) extract zero or near-zero characters per page because pages are scanned bitmap images.',
          'The PDF was generated on a Linux operating system.'
        ],
        correctAnswer: 2,
        rubricExplanation: 'Scanned documents store images of text without underlying font glyph streams; detecting <50 characters per page triggers the OCR pipeline.',
        points: 15
      },
      {
        id: 'w4_q3',
        type: 'short_answer',
        prompt: 'Explain how you guarantee idempotent document ingestion when an asynchronous worker crashes halfway through chunking and Celery re-executes the job.',
        rubricExplanation: 'Assign a deterministic checksum or doc_id. Before inserting newly extracted chunks, execute an atomic transaction or cleanup step that deletes any previously written partial chunks or vector points for that document_id, preventing duplicate chunks.',
        points: 20
      },
      {
        id: 'w4_q4',
        type: 'debugging',
        prompt: 'An attacker uploads a file named `../../../etc/cron.d/malicious.pdf`. If the server saves files using `open(f"/storage/{file.filename}", "wb")`, what security vulnerability occurs, and what is the proper defense?',
        codeSnippet: 'with open(f"/storage/{file.filename}", "wb") as f:\n    f.write(file.content)',
        rubricExplanation: 'Vulnerability: Path traversal (directory traversal) allowing arbitrary file write and remote code execution. Defense: Sanitize filename with werkzeug secure_filename or generate a random UUID storage key (e.g., /storage/tenants/{tid}/docs/{uuid}.pdf) and store original filename only in database metadata.',
        points: 25
      },
      {
        id: 'w4_q5',
        type: 'architecture',
        prompt: 'Diagram the complete state machine of an ingestion job across QUEUED, EXTRACTING, OCR_PROCESSING, CHUNKING, EMBEDDING, INDEXED, and FAILED. Detail how error codes and failure reasons are recorded for user recovery.',
        rubricExplanation: 'Detail state transitions, recording attempts count, error_code (e.g., CORRUPT_PDF, OCR_TIMEOUT, VECTOR_STORE_UNAVAILABLE), updating ingestion_jobs table, and providing an explicit retry action in the UI.',
        points: 25
      }
    ]
  },
  {
    weekNumber: 5,
    title: 'Week 5 Assessment — Chunking Strategies, Embeddings & Vector Storage',
    moduleTitle: 'Chunking, embeddings and vector storage',
    scheduledDayNumber: 34,
    scheduledDate: '19 Dec 2026',
    durationMinutes: 180,
    topicsCovered: [
      'Fixed-size, recursive, and semantic chunking trade-offs',
      'Parent-child chunking architecture',
      'Embedding models, dimensionality, and vector normalization',
      'Qdrant vs PostgreSQL pgvector comparison',
      'Vector payload metadata filtering and indexing'
    ],
    totalPoints: 100,
    passThreshold: 70,
    questions: [
      {
        id: 'w5_q1',
        type: 'mcq',
        prompt: 'What problem does Parent-Child chunking solve in production RAG systems?',
        options: [
          'It allows documents to inherit permissions from parent user accounts.',
          'It balances high retrieval precision (using small child chunks for vector search) with complete narrative context (passing the larger parent chunk to the LLM).',
          'It reduces embedding dimensions by half.',
          'It eliminates the need for vector databases completely.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Small chunks match semantic similarity queries accurately but lack surrounding sentences. Parent-child chunking indexes small chunks but returns the larger parent block to the prompt.',
        points: 15
      },
      {
        id: 'w5_q2',
        type: 'mcq',
        prompt: 'Why must the exact same embedding model and normalization parameters be used for both ingestion chunking and query embedding?',
        options: [
          'Different models project text into incompatible vector spaces and dimensionalities, making cosine similarity comparisons meaningless.',
          'Using different models causes database connection timeouts.',
          'FastAPI requires consistent Python variable names.',
          'Vector databases can only store one model name in their configuration.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Vector embeddings are coordinates in a specific learned geometric space. Comparing vectors from two different models produces pseudo-random distance values.',
        points: 15
      },
      {
        id: 'w5_q3',
        type: 'short_answer',
        prompt: 'Compare Qdrant and PostgreSQL pgvector (with HNSW index). Under what architectural circumstances would you choose pgvector over Qdrant, and vice-versa?',
        rubricExplanation: 'pgvector: Single database for relational data and vectors, ACID consistency, unified backups, lower operational complexity for <1-2M vectors. Qdrant: Dedicated vector engine, specialized payload filtering, faster indexing, distributed scaling, better performance for >10M vectors and high-QPS search.',
        points: 20
      },
      {
        id: 'w5_q4',
        type: 'debugging',
        prompt: 'A team notices that their vector queries take 800ms when filtering by tenant_id, even though HNSW index is enabled. What index is missing in Qdrant or PostgreSQL pgvector?',
        rubricExplanation: 'Missing a payload / column index on tenant_id. In Qdrant, a payload index (keyword) must be created on tenant_id. In PostgreSQL, a B-tree index on tenant_id (or composite index with vector) is required to avoid full-table sequential scans before vector distance calculation.',
        points: 25
      },
      {
        id: 'w5_q5',
        type: 'architecture',
        prompt: 'Design a chunk metadata payload schema that satisfies the source requirements from Page 16: tenant_id, workspace_id, document_id, page, section, chunk_index, source, and permissions. Explain how this prevents cross-tenant data leakage during vector search.',
        rubricExplanation: 'Provide JSON schema with all 8 fields. Explain hard vector pre-filtering where the vector search query includes a boolean filter ensuring only points matching the user tenant_id and workspace_id are considered in distance computation.',
        points: 25
      }
    ]
  },
  {
    weekNumber: 6,
    title: 'Week 6 Assessment — RAG Generation, Citations & Streaming',
    moduleTitle: 'Basic RAG chat and citations',
    scheduledDayNumber: 41,
    scheduledDate: '26 Dec 2026',
    durationMinutes: 180,
    topicsCovered: [
      'Prompt engineering for evidence-grounded answers',
      'Abstention behavior on unanswerable questions',
      'Citation mapping and source verification',
      'Server-Sent Events (SSE) streaming and abort signals',
      'Conversation persistence and audit traces'
    ],
    totalPoints: 100,
    passThreshold: 70,
    questions: [
      {
        id: 'w6_q1',
        type: 'mcq',
        prompt: 'When evaluating RAG generation on questions not covered in the knowledge base, what is the desired model behavior?',
        options: [
          'Extrapolate using general pre-trained knowledge to sound helpful.',
          'Explicitly state that the provided documents do not contain sufficient evidence to answer (abstention).',
          'Return an HTTP 500 error and crash the connection.',
          'Fabricate plausible page numbers and citations.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Production RAG requires high confidence and low hallucination; answering outside context destroys enterprise user trust.',
        points: 15
      },
      {
        id: 'w6_q2',
        type: 'mcq',
        prompt: 'How does Server-Sent Events (SSE) streaming benefit conversational RAG applications compared to traditional polling?',
        options: [
          'It encrypts browser passwords with TLS 1.3.',
          'It provides real-time token-by-token output delivery, dramatically reducing perceived Time-to-First-Token (TTFT) and allowing users to read answers immediately.',
          'It prevents the backend from running out of RAM.',
          'It converts text answers to audio speech automatically.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Streaming provides immediate visual feedback within 200-500ms rather than forcing the user to wait 5-15 seconds for complete response generation.',
        points: 15
      },
      {
        id: 'w6_q3',
        type: 'short_answer',
        prompt: 'Describe the mechanism for Citation Mapping: how do you reliably connect specific generated statements in the LLM answer to exact source document pages?',
        rubricExplanation: 'Format prompt context with explicit indices e.g. [Source 1: filename.pdf, p. 4]. Instruct model to append [Source X] after factual claims. Post-process response to parse source tags and attach metadata (title, page, excerpt) for clickable UI preview drawers.',
        points: 20
      },
      {
        id: 'w6_q4',
        type: 'debugging',
        prompt: 'A prompt produces answers where the LLM writes "According to Source 5, the policy allows 15 days", but only 3 chunks were provided in the prompt context. What caused this hallucination and how do you prevent it?',
        rubricExplanation: 'Hallucination caused by weak system prompt constraints and training priors where the model mimics multi-source patterns. Fix: Add strict prompt rule: "Only reference [Source 1] through [Source N] provided above. Never invent source numbers." Enforce post-generation regex validation checking source numbers <= len(context_chunks).',
        points: 25
      },
      {
        id: 'w6_q5',
        type: 'architecture',
        prompt: 'Implement a complete system prompt template for an Enterprise RAG Assistant that enforces: 1) Strict grounding in context, 2) Abstention when missing, 3) Inline citation formatting, and 4) Neutral professional tone.',
        rubricExplanation: 'Provide structured prompt with system instructions, context delimiters, clear citation rules, refusal instructions, and user query placeholders.',
        points: 25
      }
    ]
  }
];

export function getAssessmentForWeek(weekNumber: number, allDays: any[]): Assessment {
  const existing = WEEKLY_ASSESSMENTS.find(a => a.weekNumber === weekNumber);
  if (existing) return existing;

  // Find the days for this week
  const weekDays = allDays.filter(d => d.weekNumber === weekNumber);
  const saturday = weekDays.find(d => d.dayOfWeek === 'Saturday') || weekDays[0] || {
    dayNumber: weekNumber * 7,
    dateString: 'Saturday',
    moduleTitle: 'Production RAG Systems'
  };

  const topics = weekDays.map(d => d.topic);
  const moduleTitle = weekDays[0]?.moduleTitle || 'Advanced Production RAG';

  return {
    weekNumber,
    title: `Week ${weekNumber} Assessment — ${moduleTitle}`,
    moduleTitle,
    scheduledDayNumber: saturday.dayNumber,
    scheduledDate: saturday.dateString,
    durationMinutes: 180,
    topicsCovered: topics.length > 0 ? topics : ['Architecture', 'Retrieval', 'Security', 'Testing'],
    totalPoints: 100,
    passThreshold: 70,
    questions: [
      {
        id: `w${weekNumber}_q1`,
        type: 'mcq',
        prompt: `Regarding ${topics[0] || 'System Architecture'}, what is the primary technical rule required by production RAG standards?`,
        options: [
          'All secrets and provider credentials must remain strictly encapsulated on the authenticated backend.',
          'Frontend applications should directly query vector databases for lower latency.',
          'Document parsing should be done synchronously inside the HTTP request loop.',
          'Vector embeddings should ignore document access control metadata.'
        ],
        correctAnswer: 0,
        rubricExplanation: 'Backend trust boundaries guarantee credential protection, tenant isolation, and strict audit logging.',
        points: 20
      },
      {
        id: `w${weekNumber}_q2`,
        type: 'mcq',
        prompt: `When evaluating ${topics[1] || 'Retrieval Quality'}, how is reliable performance verified?`,
        options: [
          'By assuming top-k vector similarity alone guarantees correct answers without testing.',
          'By running an automated evaluation harness on a versioned ground-truth dataset and tracking metrics like Recall@K and MRR.',
          'By increasing model temperature to 1.0.',
          'By disabling citation verification in production.'
        ],
        correctAnswer: 1,
        rubricExplanation: 'Quantitative metrics on a versioned golden test set provide empirical proof of retrieval quality.',
        points: 20
      },
      {
        id: `w${weekNumber}_q3`,
        type: 'short_answer',
        prompt: `Explain how the topics covered in Week ${weekNumber} (${topics.slice(0, 3).join(', ')}) enforce system resilience and protect against production failure modes.`,
        rubricExplanation: 'Candidate must explain architectural boundaries, error isolation, server-side authorization, and recovery mechanisms without reading notes.',
        points: 20
      },
      {
        id: `w${weekNumber}_q4`,
        type: 'debugging',
        prompt: `Analyze a failure scenario where ${topics[2] || 'a core pipeline component'} experiences unexpected latency or timeout. Outline the diagnostic steps and implementation of circuit-breakers or graceful fallbacks.`,
        rubricExplanation: 'Candidate must isolate whether the bottleneck is network, database, LLM provider, or parsing queue, and explain retry with exponential backoff and safe user fallback messages.',
        points: 20
      },
      {
        id: `w${weekNumber}_q5`,
        type: 'architecture',
        prompt: `Design a technical deliverable demonstrating end-to-end integration of ${topics.slice(0, 4).join(' and ')}. Include API endpoints, data model entities, and security boundary tests.`,
        rubricExplanation: 'Candidate should describe REST endpoints, relational entity schemas, vector metadata filters, and automated negative tests proving zero unauthorized data leakage.',
        points: 20
      }
    ]
  };
}
