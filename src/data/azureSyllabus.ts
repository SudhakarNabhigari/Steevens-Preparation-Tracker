import { TrackChecklistItem, TrackDaySchedule } from '../types';

export const AZURE_PDF_URL = '/assets/aistudio/Azure_100_Day_180_Style_Daily_Curriculum_a614b703.pdf';
export const AZURE_PDF_FILENAME = 'Azure_100_Day_180_Style_Daily_Curriculum.pdf';
export const AZURE_START_DATE = '16 Nov 2026';
export const AZURE_END_DATE = '23 Feb 2027';

export const AZURE_PLAN_OVERVIEW = {
  title: 'AZURE — 100-DAY COMPLETE DAILY PREPARATION PLAN',
  subtitle: '180-day RAG plan-style daily curriculum · AZ-900 + DP-900 + AI-102 only',
  calendarSummary:
    'Calendar: 16 November 2026 – 23 February 2027 | Monday–Friday: 1 hour | Saturday: 1 hour revision | Sunday: 1 hour revision | Total: 100 consecutive calendar days.',
  dailyStructure:
    'Every day contains a defined topic or revision theme, Class focus, Objective, Student work and Milestone / output. Weekday topics are sequenced in order. Saturday is a weekly practical revision/checkpoint; Sunday consolidates the week and prepares for the next one.',
  scopeNote:
    "Practical learning plan restricted to the learner's existing AZ-900, DP-900 and AI-102 certification scopes. It is not a new certification plan. Azure service access, regional availability and cost may vary; use safe, budget-aware labs.",
  completionRule:
    'Mark a day complete only after completing its student work and saving the stated milestone/output. For Azure labs, use free/eligible resources where possible, check cost before deployment, never commit keys or secrets, and stop/delete paid resources after practice. If a cloud resource is unavailable, record a clearly labelled simulation rather than claiming a real deployment.',
  phases: [
    'AZ-900 — Azure Fundamentals (Days 1–25): Cloud concepts, Azure architecture, compute, networking, storage, identity, security, governance, pricing and monitoring.',
    'DP-900 — Azure Data Fundamentals (Days 26–50): Relational/non-relational data, SQL, OLTP/OLAP, Cosmos DB and analytics workloads/services.',
    'AI-102 — Azure AI Engineer (Days 51–85): AI workloads, Azure ML overview, vision, Document Intelligence, language, speech, conversational AI, Azure AI Search and GenAI.',
    'Capstone and final consolidation (Days 86–100): Azure AI document Q&A/RAG capstone, evaluation, security, deployment/cost review and revision across the three existing certification scopes.'
  ]
};

interface RawAzureDay {
  day: number;
  topic: string;
  classFocus: string;
  objective: string;
  studentWork: string;
  milestoneOutput: string;
  dailyScope: string;
}

const SATURDAY_ENTRY = (day: number): RawAzureDay => ({
  day,
  topic: 'Weekly practical revision and assessment',
  classFocus: 'Weekly preparation review and practical assessment',
  objective:
    "Consolidate the week's Azure concepts, certification-domain knowledge and practical service selection.",
  studentWork:
    'Answer scenario questions, repeat one portal/service exercise if access permits, review security/cost considerations and check lab resource cleanup.',
  milestoneOutput: 'Weekly Azure scenario assessment, corrected answers and lab evidence/cleanup record.',
  dailyScope:
    'Review and assess only the topics covered during the preceding six days; do not introduce a new syllabus topic.'
});

const SUNDAY_ENTRY = (day: number): RawAzureDay => ({
  day,
  topic: 'Weekly revision and consolidation',
  classFocus: 'Weekly revision, consolidation and next-week preparation',
  objective:
    "Strengthen retention of the week's Azure topics and prepare for the next week's certification scope.",
  studentWork:
    "Review service comparison notes, redraw one architecture/data-flow diagram, explain the week's concepts without notes and list gaps.",
  milestoneOutput: 'Azure revision sheet, one architecture diagram and next-week learning checklist.',
  dailyScope:
    "Consolidate the week's topics and assessment corrections; do not introduce a new syllabus topic."
});

const RAW_AZURE_DAYS: RawAzureDay[] = [
  {
    day: 1,
    topic: 'Cloud concepts and shared responsibility',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand cloud computing, consumption-based pricing, scalability, elasticity and shared responsibility.',
    studentWork:
      'Make a one-page comparison of on-premises vs cloud. Explain who manages infrastructure, OS, runtime and application in common service models.',
    milestoneOutput: 'One-page cloud concepts note.',
    dailyScope:
      'Cloud concepts and shared responsibility. Understand cloud computing, consumption-based pricing, scalability, elasticity and shared responsibility.'
  },
  {
    day: 2,
    topic: 'IaaS, PaaS and SaaS',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand service-model boundaries and common examples.',
    studentWork: 'Classify 12 example workloads as IaaS/PaaS/SaaS and justify two ambiguous choices.',
    milestoneOutput: 'Service-model comparison table.',
    dailyScope: 'IaaS, PaaS and SaaS. Understand service-model boundaries and common examples.'
  },
  {
    day: 3,
    topic: 'Public, private and hybrid cloud',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand deployment models, availability, scalability and business use cases.',
    studentWork:
      'Choose a deployment model for a small startup, a regulated organization and a hybrid legacy system; explain trade-offs.',
    milestoneOutput: 'Three scenario answers.',
    dailyScope:
      'Public, private and hybrid cloud. Understand deployment models, availability, scalability and business use cases.'
  },
  {
    day: 4,
    topic: 'Azure regions and availability',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand geography, region, region pairs, availability zones and datacenters.',
    studentWork: 'Draw a simple multi-region architecture and explain how availability zones differ from region pairs.',
    milestoneOutput: 'Architecture sketch and definitions.',
    dailyScope:
      'Azure regions and availability. Understand geography, region, region pairs, availability zones and datacenters.'
  },
  {
    day: 5,
    topic: 'Resources, groups and subscriptions',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand Azure resource hierarchy and scope.',
    studentWork:
      'In portal or screenshots/docs, identify tenant, management group, subscription, resource group and resource. Draw hierarchy.',
    milestoneOutput: 'Azure hierarchy diagram.',
    dailyScope: 'Resources, groups and subscriptions. Understand Azure resource hierarchy and scope.'
  },
  SATURDAY_ENTRY(6),
  SUNDAY_ENTRY(7),
  {
    day: 8,
    topic: 'Azure Resource Manager',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand ARM, resource providers, tags, locks and deployment concepts.',
    studentWork:
      'Create a resource group if access permits; inspect resource providers, add tags and explain delete/read-only locks. Clean up lab resources.',
    milestoneOutput: 'Portal lab notes and screenshots if available.',
    dailyScope: 'Azure Resource Manager. Understand ARM, resource providers, tags, locks and deployment concepts.'
  },
  {
    day: 9,
    topic: 'Compute services overview',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand VMs, containers, App Service and Functions.',
    studentWork: 'Match five workloads to compute services. Compare VM control vs managed platform responsibilities.',
    milestoneOutput: 'Compute selection matrix.',
    dailyScope: 'Compute services overview. Understand VMs, containers, App Service and Functions.'
  },
  {
    day: 10,
    topic: 'Networking fundamentals',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand VNet, subnet, NSG, DNS, peering, VPN Gateway and ExpressRoute.',
    studentWork: 'Draw a VNet with two subnets and NSG boundaries. Explain private connectivity vs public internet.',
    milestoneOutput: 'Network diagram and scenario notes.',
    dailyScope: 'Networking fundamentals. Understand VNet, subnet, NSG, DNS, peering, VPN Gateway and ExpressRoute.'
  },
  {
    day: 11,
    topic: 'Azure storage services',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand Blob, Files, Queue, Table and managed disks.',
    studentWork:
      'Choose a storage type for images, shared files, messages, key-value data and VM disks. Explain access tiers.',
    milestoneOutput: 'Storage selection table.',
    dailyScope: 'Azure storage services. Understand Blob, Files, Queue, Table and managed disks.'
  },
  {
    day: 12,
    topic: 'Identity and access',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand Microsoft Entra ID, authentication, authorization and RBAC.',
    studentWork:
      'Explain authentication vs authorization. Create a least-privilege role assignment scenario on paper or in a safe lab.',
    milestoneOutput: 'RBAC scenario and identity notes.',
    dailyScope: 'Identity and access. Understand Microsoft Entra ID, authentication, authorization and RBAC.'
  },
  SATURDAY_ENTRY(13),
  SUNDAY_ENTRY(14),
  {
    day: 15,
    topic: 'Security and governance',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand Defender for Cloud, Azure Policy, locks and compliance.',
    studentWork: 'Write examples of a policy, a resource lock and a security recommendation. Explain when each helps.',
    milestoneOutput: 'Security/governance comparison.',
    dailyScope: 'Security and governance. Understand Defender for Cloud, Azure Policy, locks and compliance.'
  },
  {
    day: 16,
    topic: 'Pricing, budgets and SLAs',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand pricing calculator, TCO, Cost Management, budgets and SLAs.',
    studentWork:
      'Estimate a simple lab cost using official pricing tools before deployment. Explain SLA percentage and cumulative downtime conceptually.',
    milestoneOutput: 'Cost estimate and SLA notes.',
    dailyScope: 'Pricing, budgets and SLAs. Understand pricing calculator, TCO, Cost Management, budgets and SLAs.'
  },
  {
    day: 17,
    topic: 'Monitoring and management',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand Azure Monitor, Service Health, Advisor and Log Analytics.',
    studentWork: 'Map an app issue to the appropriate monitoring tool. Draft an alert for high CPU or repeated failures.',
    milestoneOutput: 'Monitoring decision sheet.',
    dailyScope: 'Monitoring and management. Understand Azure Monitor, Service Health, Advisor and Log Analytics.'
  },
  {
    day: 18,
    topic: 'AZ-900 portal practice',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Reinforce core Azure concepts in the portal.',
    studentWork:
      'If subscription access exists, create a resource group, inspect one free/low-cost resource, apply tags, review cost and delete resources. Otherwise use a guided portal walkthrough.',
    milestoneOutput: 'Evidence of portal navigation and cleanup.',
    dailyScope: 'AZ-900 portal practice. Reinforce core Azure concepts in the portal.'
  },
  {
    day: 19,
    topic: 'AZ-900 checkpoint',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Review AZ-900 domains and scenario selection.',
    studentWork:
      'Answer 20 self-made questions covering cloud, architecture, compute, networking, storage, identity, security and pricing. Review wrong answers.',
    milestoneOutput: 'Quiz score and weak-area list.',
    dailyScope: 'AZ-900 checkpoint. Review AZ-900 domains and scenario selection.'
  },
  SATURDAY_ENTRY(20),
  SUNDAY_ENTRY(21),
  {
    day: 22,
    topic: 'Relational data concepts',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand tables, rows, columns, schema, keys and relationships.',
    studentWork:
      'Design a small student-course relational schema with primary and foreign keys. Explain normalization at a basic level.',
    milestoneOutput: 'ER diagram or schema note.',
    dailyScope: 'Relational data concepts. Understand tables, rows, columns, schema, keys and relationships.'
  },
  {
    day: 23,
    topic: 'SQL SELECT and filtering',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Learn SELECT, WHERE, ORDER BY, DISTINCT and aliases.',
    studentWork:
      'Create/use a sample table and write queries for filtering, sorting, selecting distinct values and limiting results.',
    milestoneOutput: 'At least eight SQL queries.',
    dailyScope: 'SQL SELECT and filtering. Learn SELECT, WHERE, ORDER BY, DISTINCT and aliases.'
  },
  {
    day: 24,
    topic: 'SQL aggregation and joins',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Learn GROUP BY, HAVING, COUNT, SUM, AVG and JOIN.',
    studentWork: 'Write queries to count records by category, calculate averages and join two related tables.',
    milestoneOutput: 'At least eight aggregation/join queries.',
    dailyScope: 'SQL aggregation and joins. Learn GROUP BY, HAVING, COUNT, SUM, AVG and JOIN.'
  },
  {
    day: 25,
    topic: 'OLTP and OLAP',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand transactional vs analytical workloads and row/column orientation.',
    studentWork:
      'Classify retail checkout, monthly sales reporting and event analytics workloads. Explain why their data patterns differ.',
    milestoneOutput: 'OLTP/OLAP comparison.',
    dailyScope: 'OLTP and OLAP. Understand transactional vs analytical workloads and row/column orientation.'
  },
  {
    day: 26,
    topic: 'Azure relational database options',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Compare Azure SQL Database, SQL Managed Instance and SQL Server on VM.',
    studentWork:
      'Select a service for a new cloud app, a near-compatible migration and a full OS-control requirement.',
    milestoneOutput: 'Service-selection matrix.',
    dailyScope:
      'Azure relational database options. Compare Azure SQL Database, SQL Managed Instance and SQL Server on VM.'
  },
  SATURDAY_ENTRY(27),
  SUNDAY_ENTRY(28),
  {
    day: 29,
    topic: 'Non-relational data models',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand key-value, document, graph and column-family models.',
    studentWork:
      'Model a shopping cart as key-value, product catalog as document and social connections as graph. Explain trade-offs.',
    milestoneOutput: 'Four data-model examples.',
    dailyScope: 'Non-relational data models. Understand key-value, document, graph and column-family models.'
  },
  {
    day: 30,
    topic: 'Cosmos DB fundamentals',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand account, database, container, item, partition key and throughput concepts.',
    studentWork: 'Design a container for customer orders. Pick a partition key and explain hot-partition risk at a high level.',
    milestoneOutput: 'Cosmos DB design note.',
    dailyScope:
      'Cosmos DB fundamentals. Understand account, database, container, item, partition key and throughput concepts.'
  },
  {
    day: 31,
    topic: 'Analytics workloads',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand batch vs streaming, warehouse, lake and lakehouse.',
    studentWork: 'Map daily batch reporting, live telemetry and raw historical files to suitable patterns.',
    milestoneOutput: 'Analytics workload comparison.',
    dailyScope: 'Analytics workloads. Understand batch vs streaming, warehouse, lake and lakehouse.'
  },
  {
    day: 32,
    topic: 'Azure analytics services',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand the high-level roles of Data Lake Storage, Synapse, Databricks and Fabric.',
    studentWork:
      "Create a diagram showing storage, processing and analytics layers; describe each service's role without memorizing every feature.",
    milestoneOutput: 'Analytics architecture diagram.',
    dailyScope:
      'Azure analytics services. Understand the high-level roles of Data Lake Storage, Synapse, Databricks and Fabric.'
  },
  {
    day: 33,
    topic: 'DP-900 checkpoint',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Review relational, non-relational, SQL and analytics concepts.',
    studentWork:
      'Complete 20 scenario questions and write five SQL queries without notes. Correct mistakes and note unfamiliar terms.',
    milestoneOutput: 'Quiz score and SQL evidence.',
    dailyScope: 'DP-900 checkpoint. Review relational, non-relational, SQL and analytics concepts.'
  },
  SATURDAY_ENTRY(34),
  SUNDAY_ENTRY(35),
  {
    day: 36,
    topic: 'AI workloads and responsible AI',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand ML, vision, NLP, speech, conversational AI and responsible AI principles.',
    studentWork:
      'Match common business problems to AI workload categories. Write examples of fairness, reliability, privacy, inclusiveness and transparency considerations.',
    milestoneOutput: 'AI workload mapping sheet.',
    dailyScope:
      'AI workloads and responsible AI. Understand ML, vision, NLP, speech, conversational AI and responsible AI principles.'
  },
  {
    day: 37,
    topic: 'Machine learning concepts',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand regression, classification, clustering, features, labels and train/test split.',
    studentWork:
      'Classify example tasks as regression/classification/clustering. Explain why test data must remain unseen during training.',
    milestoneOutput: 'ML concept table.',
    dailyScope:
      'Machine learning concepts. Understand regression, classification, clustering, features, labels and train/test split.'
  },
  {
    day: 38,
    topic: 'Azure Machine Learning overview',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand workspace, compute, data assets, jobs, models and endpoints at overview level.',
    studentWork: 'Draw a workflow from data to training job to registered model to endpoint. Identify where evaluation occurs.',
    milestoneOutput: 'Azure ML lifecycle diagram.',
    dailyScope:
      'Azure Machine Learning overview. Understand workspace, compute, data assets, jobs, models and endpoints at overview level.'
  },
  {
    day: 39,
    topic: 'Computer vision services',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand image analysis, OCR and object detection use cases.',
    studentWork:
      'Choose the right vision capability for image captions, text extraction and object localization. Outline input/output for each.',
    milestoneOutput: 'Vision service-selection examples.',
    dailyScope: 'Computer vision services. Understand image analysis, OCR and object detection use cases.'
  },
  {
    day: 40,
    topic: 'Document Intelligence',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand prebuilt/custom extraction, fields, tables and confidence.',
    studentWork:
      'Inspect a sample invoice/form and list fields to extract. Design a JSON-like output and note confidence/validation needs.',
    milestoneOutput: 'Document extraction schema.',
    dailyScope: 'Document Intelligence. Understand prebuilt/custom extraction, fields, tables and confidence.'
  },
  SATURDAY_ENTRY(41),
  SUNDAY_ENTRY(42),
  {
    day: 43,
    topic: 'Language services',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand language detection, sentiment, key phrases, entities, summarization and translation.',
    studentWork:
      'Take five sample sentences and identify which language tasks apply. Draft expected outputs for sentiment and entity extraction.',
    milestoneOutput: 'NLP task/output worksheet.',
    dailyScope:
      'Language services. Understand language detection, sentiment, key phrases, entities, summarization and translation.'
  },
  {
    day: 44,
    topic: 'Speech services',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand speech-to-text, text-to-speech and speech translation.',
    studentWork:
      'Draw a voice assistant flow from microphone to transcription to response to speech synthesis. Note privacy and latency considerations.',
    milestoneOutput: 'Speech workflow diagram.',
    dailyScope: 'Speech services. Understand speech-to-text, text-to-speech and speech translation.'
  },
  {
    day: 45,
    topic: 'Conversational AI',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand question answering, language understanding concepts and bot integration.',
    studentWork: 'Design a simple FAQ bot flow with user question, intent/answer lookup, fallback and escalation.',
    milestoneOutput: 'Conversation flowchart.',
    dailyScope: 'Conversational AI. Understand question answering, language understanding concepts and bot integration.'
  },
  {
    day: 46,
    topic: 'Azure AI Search fundamentals',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand indexes, indexers, data sources, skillsets, filters and semantic/hybrid search.',
    studentWork: 'Design an index for PDF metadata and chunks. Identify searchable, filterable and retrievable fields.',
    milestoneOutput: 'Search index schema.',
    dailyScope:
      'Azure AI Search fundamentals. Understand indexes, indexers, data sources, skillsets, filters and semantic/hybrid search.'
  },
  {
    day: 47,
    topic: 'Search practical exercise',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Reinforce indexing and retrieval concepts.',
    studentWork:
      'If access permits, follow a small Azure AI Search walkthrough using sample data; otherwise create a mock index schema and write sample search/filter scenarios.',
    milestoneOutput: 'Lab notes or mock schema and query examples.',
    dailyScope: 'Search practical exercise. Reinforce indexing and retrieval concepts.'
  },
  SATURDAY_ENTRY(48),
  SUNDAY_ENTRY(49),
  {
    day: 50,
    topic: 'Generative AI foundations',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand LLMs, tokens, context windows, prompts, grounding and hallucinations.',
    studentWork: 'Explain an LLM request/response lifecycle. Write a grounded prompt and identify two ways hallucinations may occur.',
    milestoneOutput: 'LLM lifecycle notes and prompt example.',
    dailyScope: 'Generative AI foundations. Understand LLMs, tokens, context windows, prompts, grounding and hallucinations.'
  },
  {
    day: 51,
    topic: 'Azure AI Foundry overview',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand model catalog, projects, playground, deployments and evaluation workflow.',
    studentWork:
      'Navigate the available Foundry interface if access exists. Identify model selection, playground, deployment and evaluation areas; record unavailable features.',
    milestoneOutput: 'Foundry walkthrough notes.',
    dailyScope:
      'Azure AI Foundry overview. Understand model catalog, projects, playground, deployments and evaluation workflow.'
  },
  {
    day: 52,
    topic: 'Model deployment and inference',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand endpoint, deployment, keys, quota, tokens, latency and cost.',
    studentWork: 'Draw client-to-endpoint request flow. List what must be protected and what metrics affect inference cost.',
    milestoneOutput: 'Deployment flow and cost checklist.',
    dailyScope: 'Model deployment and inference. Understand endpoint, deployment, keys, quota, tokens, latency and cost.'
  },
  {
    day: 53,
    topic: 'Prompt engineering',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand system/user instructions, few-shot examples and structured outputs.',
    studentWork:
      'Create three prompts for the same task: zero-shot, few-shot and JSON-style output. Compare consistency and failure cases.',
    milestoneOutput: 'Three prompts and comparison.',
    dailyScope: 'Prompt engineering. Understand system/user instructions, few-shot examples and structured outputs.'
  },
  {
    day: 54,
    topic: 'GenAI application architecture',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand client, API, model endpoint, identity, retrieval and monitoring components.',
    studentWork: 'Draw a small application architecture and label trust boundaries, secrets, data flow and failure points.',
    milestoneOutput: 'Architecture diagram.',
    dailyScope:
      'GenAI application architecture. Understand client, API, model endpoint, identity, retrieval and monitoring components.'
  },
  SATURDAY_ENTRY(55),
  SUNDAY_ENTRY(56),
  {
    day: 57,
    topic: 'RAG concepts',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand ingestion, chunking, embeddings, vector search, retrieval, grounding and citations.',
    studentWork: 'Explain the RAG pipeline in your own words. Design a document-ingestion sequence and list metadata to retain.',
    milestoneOutput: 'RAG pipeline diagram.',
    dailyScope: 'RAG concepts. Understand ingestion, chunking, embeddings, vector search, retrieval, grounding and citations.'
  },
  {
    day: 58,
    topic: 'Vector and hybrid search',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand vector fields, embeddings, hybrid search and semantic ranking concepts.',
    studentWork: 'Compare keyword, vector and hybrid retrieval using three example questions. Explain when exact terms matter.',
    milestoneOutput: 'Retrieval comparison table.',
    dailyScope:
      'Vector and hybrid search. Understand vector fields, embeddings, hybrid search and semantic ranking concepts.'
  },
  {
    day: 59,
    topic: 'RAG workflow design',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Understand query embedding, retrieval, context construction and grounded response.',
    studentWork:
      'Write pseudocode for user question → search → top-k context → prompt → answer with citations. Include no-result behavior.',
    milestoneOutput: 'RAG pseudocode and fallback rule.',
    dailyScope: 'RAG workflow design. Understand query embedding, retrieval, context construction and grounded response.'
  },
  {
    day: 60,
    topic: 'RAG evaluation',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand relevance, groundedness, completeness, retrieval quality and human review.',
    studentWork:
      'Create 10 test questions with expected source documents. Define a simple pass/fail rubric for source relevance and grounded answer.',
    milestoneOutput: 'RAG evaluation test set.',
    dailyScope: 'RAG evaluation. Understand relevance, groundedness, completeness, retrieval quality and human review.'
  },
  {
    day: 61,
    topic: 'AI safety and prompt injection',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Understand content filters, prompt injection, privacy and safe output handling.',
    studentWork:
      'Write examples of malicious document instructions and explain why retrieved content is untrusted. Define safe handling rules.',
    milestoneOutput: 'Threat examples and mitigations.',
    dailyScope: 'AI safety and prompt injection. Understand content filters, prompt injection, privacy and safe output handling.'
  },
  SATURDAY_ENTRY(62),
  SUNDAY_ENTRY(63),
  {
    day: 64,
    topic: 'AI security and identity',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Understand managed identity concepts, keys/secrets, RBAC and least privilege.',
    studentWork:
      'Draw a secret-safe architecture. Identify where keys must never be committed and how access should be restricted.',
    milestoneOutput: 'Security checklist.',
    dailyScope: 'AI security and identity. Understand managed identity concepts, keys/secrets, RBAC and least privilege.'
  },
  {
    day: 65,
    topic: 'AI monitoring and operations',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Understand latency, errors, token use, throughput and quality signals.',
    studentWork:
      'Design a basic monitoring table for requests, latency, status, token usage and user feedback. Define two alert conditions.',
    milestoneOutput: 'Monitoring plan.',
    dailyScope: 'AI monitoring and operations. Understand latency, errors, token use, throughput and quality signals.'
  },
  {
    day: 66,
    topic: 'AI-102 service selection',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Map requirements to vision, language, speech, search, document and generative AI services.',
    studentWork: 'Complete 10 scenario mappings and explain why the selected service fits each requirement.',
    milestoneOutput: 'Service selection worksheet.',
    dailyScope:
      'AI-102 service selection. Map requirements to vision, language, speech, search, document and generative AI services.'
  },
  {
    day: 67,
    topic: 'AI-102 checkpoint',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Review AI workloads, service selection, security and deployment.',
    studentWork: 'Complete a 25-question scenario assessment. Revisit wrong answers and explain each correction.',
    milestoneOutput: 'Assessment score and weak-area list.',
    dailyScope: 'AI-102 checkpoint. Review AI workloads, service selection, security and deployment.'
  },
  {
    day: 68,
    topic: 'Capstone requirements and architecture',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Define a small document Q&A assistant using Azure concepts.',
    studentWork:
      'Write user stories, supported file types, data boundary, expected citations, failure behavior and architecture diagram.',
    milestoneOutput: 'One-page capstone specification.',
    dailyScope: 'Capstone requirements and architecture. Define a small document Q&A assistant using Azure concepts.'
  },
  SATURDAY_ENTRY(69),
  SUNDAY_ENTRY(70),
  {
    day: 71,
    topic: 'Capstone document preparation',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Prepare clean sample documents and metadata.',
    studentWork:
      'Select non-sensitive sample documents. Define file naming, metadata, chunk boundaries and a simple ingestion checklist.',
    milestoneOutput: 'Sample corpus and metadata plan.',
    dailyScope: 'Capstone document preparation. Prepare clean sample documents and metadata.'
  },
  {
    day: 72,
    topic: 'Capstone search schema',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Design searchable and filterable fields.',
    studentWork:
      'Define fields for document ID, title, chunk text, source, page, category and embedding. Mark which fields are searchable/filterable/retrievable.',
    milestoneOutput: 'Search schema document.',
    dailyScope: 'Capstone search schema. Design searchable and filterable fields.'
  },
  {
    day: 73,
    topic: 'Capstone prompt and model design',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Choose an available model and define grounded response behavior.',
    studentWork:
      'Write system instructions requiring answers only from retrieved context, source references and an explicit unknown response.',
    milestoneOutput: 'System prompt and test cases.',
    dailyScope: 'Capstone prompt and model design. Choose an available model and define grounded response behavior.'
  },
  {
    day: 74,
    topic: 'Capstone API design',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Define request/response and error behavior.',
    studentWork:
      'Specify endpoints for health, ingest and ask. Define validation, timeout, no-result and service-unavailable responses.',
    milestoneOutput: 'API contract.',
    dailyScope: 'Capstone API design. Define request/response and error behavior.'
  },
  {
    day: 75,
    topic: 'Capstone implementation I',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Implement or simulate document ingestion and chunking.',
    studentWork:
      'Build the ingestion component using available services; if cloud access is unavailable, create a local mock and clearly label it.',
    milestoneOutput: 'Working ingestion step.',
    dailyScope: 'Capstone implementation I. Implement or simulate document ingestion and chunking.'
  },
  SATURDAY_ENTRY(76),
  SUNDAY_ENTRY(77),
  {
    day: 78,
    topic: 'Capstone implementation II',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Implement retrieval and grounded answer generation.',
    studentWork:
      'Connect search/retrieval to the model endpoint if available; otherwise implement a documented mock. Include source metadata in results.',
    milestoneOutput: 'Working retrieval/answer flow or mock.',
    dailyScope: 'Capstone implementation II. Implement retrieval and grounded answer generation.'
  },
  {
    day: 79,
    topic: 'Capstone evaluation',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Test retrieval and answer grounding.',
    studentWork:
      'Run the prepared question set. Record expected source, retrieved source, answer quality and failure reason.',
    milestoneOutput: 'Evaluation results table.',
    dailyScope: 'Capstone evaluation. Test retrieval and answer grounding.'
  },
  {
    day: 80,
    topic: 'Capstone security review',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Review identity, secrets, privacy, prompt injection and permissions.',
    studentWork:
      'Scan repository for exposed keys. Add environment variables, input validation and untrusted-document handling notes.',
    milestoneOutput: 'Security checklist and cleaned configuration.',
    dailyScope: 'Capstone security review. Review identity, secrets, privacy, prompt injection and permissions.'
  },
  {
    day: 81,
    topic: 'Capstone deployment and cost review',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Understand deployment, quotas, logs and resource cleanup.',
    studentWork:
      'Deploy only if subscription access and budget permit. Check usage/cost, test endpoint, capture evidence and stop/delete paid resources.',
    milestoneOutput: 'Deployment evidence or documented local demo plus cost review.',
    dailyScope: 'Capstone deployment and cost review. Understand deployment, quotas, logs and resource cleanup.'
  },
  {
    day: 82,
    topic: 'AZ-900 final revision',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Consolidate cloud concepts, architecture, core services, security and pricing.',
    studentWork: 'Explain 15 core AZ-900 concepts aloud without notes; redo weak questions and one portal navigation exercise.',
    milestoneOutput: 'AZ-900 revision score.',
    dailyScope: 'AZ-900 final revision. Consolidate cloud concepts, architecture, core services, security and pricing.'
  },
  SATURDAY_ENTRY(83),
  SUNDAY_ENTRY(84),
  {
    day: 85,
    topic: 'DP-900 final revision',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Consolidate data concepts, SQL, relational/non-relational models and analytics.',
    studentWork: 'Write five SQL queries, explain OLTP/OLAP and select data services for five scenarios.',
    milestoneOutput: 'DP-900 revision score and SQL file.',
    dailyScope: 'DP-900 final revision. Consolidate data concepts, SQL, relational/non-relational models and analytics.'
  },
  {
    day: 86,
    topic: 'AI-102 final revision',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Consolidate AI services, Search, Document Intelligence, language, speech and GenAI.',
    studentWork:
      'Create a service-selection map for 12 scenarios and explain security, evaluation and deployment considerations.',
    milestoneOutput: 'AI-102 service map and revision score.',
    dailyScope: 'AI-102 final revision. Consolidate AI services, Search, Document Intelligence, language, speech and GenAI.'
  },
  {
    day: 87,
    topic: 'Final practical assessment',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Demonstrate and explain the capstone and identify gaps honestly.',
    studentWork:
      'Present architecture, data flow, retrieval, model use, safety, evaluation, cost and limitations. Do not claim cloud deployment if only mocked locally.',
    milestoneOutput: 'Final assessment report and next-learning list.',
    dailyScope: 'Final practical assessment. Demonstrate and explain the capstone and identify gaps honestly.'
  },
  {
    day: 88,
    topic: 'Azure core services scenario practice',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Consolidate compute, networking, storage and identity service choices.',
    studentWork: 'Answer 8 scenarios and explain the selected service, security boundary and cost consideration.',
    milestoneOutput: 'Scenario answer sheet.',
    dailyScope: 'Azure core services scenario practice. Consolidate compute, networking, storage and identity service choices.'
  },
  {
    day: 89,
    topic: 'AZ-900 security and cost lab review',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Consolidate RBAC, policy, locks, monitoring, pricing and SLA concepts.',
    studentWork: 'Draw a secure resource-group setup, identify a budget alert and explain how to remove unused lab resources.',
    milestoneOutput: 'Security and cost checklist.',
    dailyScope: 'AZ-900 security and cost lab review. Consolidate RBAC, policy, locks, monitoring, pricing and SLA concepts.'
  },
  SATURDAY_ENTRY(90),
  SUNDAY_ENTRY(91),
  {
    day: 92,
    topic: 'DP-900 SQL practice set',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Consolidate SELECT, filters, joins, grouping and relational concepts.',
    studentWork: "Write 10 SQL queries against a small sample schema and explain each query's result.",
    milestoneOutput: 'SQL practice file and corrections.',
    dailyScope: 'DP-900 SQL practice set. Consolidate SELECT, filters, joins, grouping and relational concepts.'
  },
  {
    day: 93,
    topic: 'DP-900 data-model selection',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Consolidate relational, document, key-value, graph and analytical data models.',
    studentWork: 'Map 8 business scenarios to data models/services and justify partitioning or relationship choices.',
    milestoneOutput: 'Data service decision matrix.',
    dailyScope:
      'DP-900 data-model selection. Consolidate relational, document, key-value, graph and analytical data models.'
  },
  {
    day: 94,
    topic: 'AI-102 vision and document scenarios',
    classFocus: 'Guided coding / practical implementation',
    objective: 'Consolidate image analysis, OCR, object detection and document extraction.',
    studentWork: 'Map 8 document/image scenarios to capabilities and specify expected output fields or detections.',
    milestoneOutput: 'Vision/document service selection sheet.',
    dailyScope:
      'AI-102 vision and document scenarios. Consolidate image analysis, OCR, object detection and document extraction.'
  },
  {
    day: 95,
    topic: 'AI-102 language, speech and bot scenarios',
    classFocus: 'Testing, debugging and failure scenarios',
    objective: 'Consolidate language analysis, translation, speech and conversational AI.',
    studentWork: 'Design a voice-enabled FAQ flow and select the required speech/language capabilities.',
    milestoneOutput: 'Voice FAQ flowchart.',
    dailyScope:
      'AI-102 language, speech and bot scenarios. Consolidate language analysis, translation, speech and conversational AI.'
  },
  {
    day: 96,
    topic: 'AI Search and RAG troubleshooting',
    classFocus: 'Demo, code review and weekly learning checkpoint',
    objective: 'Consolidate indexing, filters, embeddings, hybrid search, citations and evaluation.',
    studentWork:
      'Diagnose five hypothetical RAG failures: missing chunks, weak retrieval, wrong metadata, unsupported answer and absent citation.',
    milestoneOutput: 'RAG troubleshooting matrix.',
    dailyScope:
      'AI Search and RAG troubleshooting. Consolidate indexing, filters, embeddings, hybrid search, citations and evaluation.'
  },
  SATURDAY_ENTRY(97),
  SUNDAY_ENTRY(98),
  {
    day: 99,
    topic: 'Azure capstone demo rehearsal',
    classFocus: 'Concepts, architecture and design decisions',
    objective: 'Consolidate architecture, implementation, evaluation, security, monitoring and cost.',
    studentWork:
      'Prepare a 5-minute walkthrough of the document Q&A capstone or clearly labelled mock. State what is real, simulated and not yet implemented.',
    milestoneOutput: 'Demo script and architecture explanation.',
    dailyScope:
      'Azure capstone demo rehearsal. Consolidate architecture, implementation, evaluation, security, monitoring and cost.'
  },
  {
    day: 100,
    topic: 'Final Azure readiness assessment',
    classFocus: 'Instructor-led learning and implementation',
    objective: 'Review AZ-900, DP-900 and AI-102 certification scopes.',
    studentWork: 'Complete a mixed scenario assessment, correct wrong answers and list practical gaps that need further lab time.',
    milestoneOutput: 'Final assessment score and next-step list.',
    dailyScope: 'Final Azure readiness assessment. Review AZ-900, DP-900 and AI-102 certification scopes.'
  }
];

function getAzurePhaseTitle(day: number): string {
  if (day <= 21) return 'AZ-900 — Azure Fundamentals (Days 1–25 overview)';
  if (day <= 35) return 'DP-900 — Azure Data Fundamentals (Days 26–50 overview)';
  if (day <= 67) return 'AI-102 — Azure AI Engineer (Days 51–85 overview)';
  return 'Capstone and final consolidation (Days 86–100 overview)';
}

const WEEKDAYS: TrackDaySchedule['dayOfWeek'][] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const AZURE_100_DAYS: TrackDaySchedule[] = RAW_AZURE_DAYS.map((raw) => {
  const d = new Date(Date.UTC(2026, 10, 16 + (raw.day - 1)));
  const dayOfWeek = WEEKDAYS[d.getUTCDay()];
  const isWeekendRevision = dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
  const targetMinutes = 60;
  const scheduleLabel = isWeekendRevision ? '1 hour revision' : '1 hour preparation';

  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mon = MONTHS[d.getUTCMonth()];
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');

  const checklist: TrackChecklistItem[] = [
    {
      id: `${raw.day}_objective`,
      title: `Objective: ${raw.objective}`,
      description: `Class focus: ${raw.classFocus}`,
      category: 'objective'
    },
    {
      id: `${raw.day}_work`,
      title: 'Complete Student Work',
      description: raw.studentWork,
      category: 'work'
    },
    {
      id: `${raw.day}_milestone`,
      title: 'Save Milestone / Output',
      description: raw.milestoneOutput,
      category: 'milestone'
    },
    {
      id: `${raw.day}_scope`,
      title: 'Verify Daily Scope & Lab Safety Rule',
      description: raw.dailyScope,
      category: 'scope'
    }
  ];

  const pdfPage = Math.floor((raw.day - 1) / 5) + 2;

  return {
    trackId: 'azure',
    dayNumber: raw.day,
    dateString: `${dd} ${mon} ${yyyy}`,
    isoDate: `${yyyy}-${mm}-${dd}`,
    dayOfWeek,
    weekNumber: Math.ceil(raw.day / 7),
    targetMinutes,
    scheduleLabel,
    phaseTitle: getAzurePhaseTitle(raw.day),
    topic: raw.topic,
    classFocus: raw.classFocus,
    objective: raw.objective,
    studentWork: raw.studentWork,
    milestoneOutput: raw.milestoneOutput,
    dailyScope: raw.dailyScope,
    isWeekendRevision,
    pdfPage,
    checklist
  };
});

export const AZURE_TOTAL_PLANNED_HOURS = Number(
  (AZURE_100_DAYS.reduce((sum, d) => sum + d.targetMinutes, 0) / 60).toFixed(1)
);
