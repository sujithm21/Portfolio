/**
 * Single source of truth for every piece of content on the site.
 * Wrap a phrase in **double asterisks** to emphasise it where the text is rendered with <Rich>.
 */

export const profile = {
  name: 'Sujith Makam',
  role: 'AI Engineer & Cloud Engineer',
  tagline:
    "I'm Sujith Makam, a Software Engineer at CGI building and shipping LLM, agentic and generative-AI systems into production on Azure and AWS, backed by RAG pipelines, evals and Infrastructure-as-Code.",
  summary: [
    'AI and Cloud engineer who builds and ships **LLM, agentic and generative-AI systems** into production on **Azure and AWS**. As a Software Engineer at CGI, I develop enterprise GenAI and multi-agent solutions across **Azure AI Foundry**, **Azure OpenAI** and **AWS**, backed by RAG pipelines, evals and Infrastructure-as-Code, delivering measurable outcomes: **40,000+ calls auto-evaluated** and **3–7 minutes** cut from Average Handle Time.',
    '**1+ year of experience** building production systems across AWS and Azure, with hands-on expertise in cloud infrastructure, **Infrastructure-as-Code**, disaster recovery, automation, observability and distributed systems. Experienced in **AWS CDK**, serverless architectures and AI/LLM platforms, and author of **4 IEEE-published papers** in machine learning and network security.',
  ],
  location: 'Bengaluru, India',
  email: 'makamsujith2004@gmail.com',
  phone: '+91 8555042700',
  availability: 'Open to AI / Cloud engineering roles',
  currently: 'Software Engineer at CGI',
  socials: {
    github: 'https://github.com/sujithm21',
    linkedin: 'https://www.linkedin.com/in/makamsujith/',
    leetcode: 'https://leetcode.com/u/msujith21/',
  },
} as const;

export type Stat = {
  value: number;
  /** Shown as-is instead of counting up to `value` (for ranges such as "3–7 min"). */
  display?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  hint: string;
};

/** Headline numbers shown in the hero. */
export const stats: Stat[] = [
  {
    value: 40000,
    suffix: '+',
    label: 'Support calls auto-evaluated',
    hint: '100% of transcripts · 24 parameters',
  },
  {
    value: 7,
    display: '3–7 min',
    label: 'Cut from Average Handle Time',
    hint: 'conversational AI in the contact center',
  },
  {
    value: 99.9,
    suffix: '%',
    decimals: 1,
    label: 'DR sync success rate',
    hint: 'zero-downtime failover',
  },
  { value: 4, label: 'IEEE publications', hint: 'ML & network security' },
];

/** Scrolling strip under the hero. */
export const stackTicker = [
  'Agentic AI',
  'Azure AI Foundry',
  'Amazon Bedrock',
  'AWS CDK',
  'RAG',
  'MCP',
  'A2A',
  'Amazon Connect',
  'Step Functions',
  'CrewAI',
  'Google ADK',
  'Langfuse',
  'FastAPI',
  'Microsoft Fabric',
  'TypeScript',
  'Python',
];

/** Oversized words in the scroll-driven band between sections. */
export const marqueeRows = [
  ['Agentic AI', 'Multi-Agent', 'RAG', 'MCP', 'A2A', 'LLM Evals', 'Guardrails'],
  ['AWS CDK', 'Infrastructure-as-Code', 'Serverless', 'Disaster Recovery', 'Observability'],
];

export const marqueePlatforms = [
  ['Azure AI Foundry', 'Amazon Bedrock', 'CrewAI', 'Google ADK', 'Langfuse', 'FastAPI'],
  ['Amazon Connect', 'Step Functions', 'Lambda', 'Microsoft Fabric', 'Python', 'TypeScript'],
];

export const marqueeClosing = [
  ['Let’s build', 'Let’s ship', 'Let’s talk'],
  ['AI Engineering', 'Cloud Engineering', 'Agentic Systems', 'Reliability'],
];

export type Pillar = { icon: string; title: string; body: string; agent: string };

export const pillars: Pillar[] = [
  {
    icon: 'bot',
    title: 'Agentic AI systems',
    body: 'Multi-agent orchestration, MCP tooling and A2A messaging — with evaluation and guardrails baked in, not bolted on.',
    agent: 'planner',
  },
  {
    icon: 'cloud',
    title: 'Cloud infrastructure',
    body: 'AWS CDK and Infrastructure-as-Code: repeatable, reviewable and multi-region by default.',
    agent: 'builder',
  },
  {
    icon: 'shield',
    title: 'Reliability engineering',
    body: 'Disaster recovery, automated failover and observability that keep production honest.',
    agent: 'deployer',
  },
  {
    icon: 'chart',
    title: 'Data platforms',
    body: 'Governed Medallion Lakehouses on Microsoft Fabric feeding real-time analytics and Power BI.',
    agent: 'qa',
  },
];

export const beyondWork =
  'Outside work I read widely, play badminton and sing — music has been the constant counterweight to engineering for as long as I have been writing code.';

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  kind: string;
  headline: string;
  points: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    company: 'CGI',
    role: 'Software Engineer',
    period: 'Jul 2025 — Present',
    location: 'Bengaluru, India',
    kind: 'Full-time',
    headline: 'Enterprise conversational and agentic AI, and the Infrastructure-as-Code behind it.',
    points: [
      'Designed and deployed enterprise conversational and agentic-AI solutions — task-specific agents on Azure AI Foundry, Google ADK and CrewAI, wired into Azure OpenAI, Cognigy, the Genesys CCaaS platform and AWS to automate customer-support workflows — reducing Average Handle Time (AHT) by **3–7 minutes**.',
      'Designed and built an agentic AI voice assistant on NiCE Cognigy for retail store IT support: an LLM agent orchestrating **11 tools** verifies callers, triages POS and device issues, checks incident history, and creates or updates ServiceNow tickets through REST APIs, handing off to specialists with context passed in SIP headers.',
      'Integrated Cognigy Voice Gateway with Genesys Cloud over **BYOC SIP trunks** (carriers, number routing, access control lists, Azure STT/TTS), and designed an automated evaluation framework that replays real call transcripts against the AI agent with **LLM-as-judge** scoring for resolution rate, accuracy and tone.',
      'Built an agentic QA platform on Amazon Bedrock that scores **100% of call transcripts** against **24 quality parameters**, automating **90%+ of QA** that was previously manual and sampled only a fraction of calls. **40,000+ calls** evaluated; later ported to Azure Functions and Cosmos DB.',
      'Shipped production LLM applications — AI call summarization and RAG pipelines over enterprise knowledge bases — on Azure OpenAI.',
      'Developed multi-agent workflows for autonomous, context-aware task execution across support operations, cutting manual intervention and improving SLA compliance.',
      'Provisioned complete multi-region Amazon Connect environments as Infrastructure-as-Code with AWS CDK (TypeScript) and the AWS SDK — **80% less manual setup**, delivered with AI-accelerated development.',
      'Engineered a production disaster-recovery sync (Boto3, Lambda, Step Functions, EventBridge, SSM, SNS) that holds a cross-region mirror at **100% config compliance** with **zero-downtime failover** and a **99.9% successful-run rate**.',
      'Built a unified multi-source data platform on Microsoft Fabric: a governed Medallion Lakehouse with Microsoft Purview lineage powering real-time Power BI analytics.',
    ],
    stack: [
      'Azure AI Foundry',
      'Amazon Bedrock',
      'Azure OpenAI',
      'Google ADK',
      'CrewAI',
      'AWS CDK',
      'Amazon Connect',
      'Lambda',
      'Step Functions',
      'Boto3',
      'Azure Functions',
      'Cosmos DB',
      'Cognigy',
      'Genesys',
      'ServiceNow',
      'Microsoft Fabric',
    ],
  },
  {
    company: 'Indian Institute of Science (IISc), Bangalore',
    role: 'Research Intern',
    period: 'May 2024 — Jul 2024',
    location: 'Bengaluru, India',
    kind: 'Research',
    headline: 'LLM pruning and GPT-2 inference optimization.',
    points: [
      'Investigated LLM pruning techniques for GPT-2, optimizing the attention and feed-forward layers for inference efficiency.',
      'Profiled GPT-2 with Intel VTune to isolate cache and memory bottlenecks, achieving a **4× speedup** in attention-layer execution.',
      'Implemented custom tiled matrix multiplication, cutting instruction-cache misses by **5.2%** and memory-bandwidth usage by **34.8%**.',
    ],
    stack: ['LLM Pruning', 'GPT-2', 'Intel VTune', 'C++', 'Python', 'Performance Profiling'],
  },
];

export type ProjectBadge = 'Enterprise' | 'Research' | 'Hackathon' | 'Open Source';

export type Project = {
  title: string;
  blurb: string;
  points: string[];
  tags: string[];
  categories: string[];
  metric?: { value: string; label: string };
  github?: string;
  badge: ProjectBadge;
  featured?: boolean;
};

/** Filter tabs. "Featured" is what the section opens on. */
export const projectCategories = [
  'Featured',
  'All',
  'Agentic AI',
  'Cloud & IaC',
  'Data & Analytics',
  'ML & Research',
  'Full-Stack',
];

export const projects: Project[] = [
  {
    title: 'Agentic QA Evaluation',
    blurb: 'Scores every support call against 24 quality parameters. No human sampling.',
    points: [
      'Agentic QA platform on Amazon Bedrock that scores 100% of call transcripts, replacing manual review that sampled only a fraction of calls.',
      'RAG pipelines over enterprise knowledge-base documents, with vector search and embeddings, keep assessments context-aware and low-hallucination.',
      'Automated 90%+ of QA across 40,000+ calls; later ported the pipeline to Azure Functions and Cosmos DB behind REST APIs.',
    ],
    tags: ['Amazon Bedrock', 'RAG', 'LLM Evaluation', 'Azure Functions', 'Cosmos DB'],
    categories: ['Agentic AI'],
    metric: { value: '100%', label: 'of calls scored' },
    badge: 'Enterprise',
    featured: true,
  },
  {
    title: 'Conversational AI Voice Assistant',
    blurb:
      'An agentic AI voice assistant for a global retail chain’s store IT support desk, built on NiCE Cognigy with Azure speech services.',
    points: [
      'An LLM agent orchestrating 11 tools verifies the caller’s identity, triages POS and device issues, checks incident history, and creates or updates ServiceNow tickets through REST APIs. Complex cases go to human specialists with full context passed in SIP headers.',
      'Integrated Cognigy Voice Gateway with Genesys Cloud over BYOC SIP trunks, covering carriers, number routing, access control lists and Azure STT/TTS, with automatic fallback to a human queue. Diagnosed call-routing failures end to end using SIP traces and the Cognigy APIs.',
      'Designed an automated evaluation framework that replays real human-agent call transcripts against the AI agent, using LLM-as-judge scoring to benchmark resolution rate, accuracy and tone against human agents.',
    ],
    tags: [
      'NiCE Cognigy',
      'Genesys Cloud',
      'BYOC SIP',
      'ServiceNow',
      'Azure STT/TTS',
      'LLM-as-Judge',
      'REST APIs',
    ],
    categories: ['Agentic AI'],
    metric: { value: '11', label: 'tools orchestrated' },
    badge: 'Enterprise',
    featured: true,
  },
  {
    title: 'AI Governance Platform',
    blurb:
      'Secure orchestration, observability and Responsible-AI controls for multi-agent workflows.',
    points: [
      'Enterprise platform for secure orchestration of multi-agent LLM workflows on Azure AI Foundry, Google ADK, CrewAI and Agent Gateway.',
      'End-to-end observability with Langfuse and AgentOps: prompt tracing, KPI and latency monitoring, and production evaluation.',
      'Responsible-AI controls: prompt-injection prevention, sensitive-data masking, virtual API isolation, policy enforcement and secure tool execution.',
    ],
    tags: ['Azure AI Foundry', 'Google ADK', 'CrewAI', 'MCP', 'A2A', 'Langfuse', 'AgentOps'],
    categories: ['Agentic AI'],
    metric: { value: '5', label: 'guardrail controls' },
    badge: 'Enterprise',
    featured: true,
  },
  {
    title: 'LegacyLift',
    blurb: 'Makes legacy COBOL logic callable by AI agents — without rewriting the mainframe.',
    points: [
      'Five collaborating agents (Manager, Analyzer, Developer, QA, Feasibility) coordinate over an A2A message bus with a shared context graph. Shortlisted top 13 of 200+ entries at CGI Envision 2026.',
      'Two-phase rollout: Phase 1 ships an MCP wrapper that AI-enables users from day one; Phase 2 modernizes the codebase component-by-component with the strangler-fig cut-over pattern, behind human-in-the-loop approval gates.',
      'Parses COBOL source to find exposable routines and auto-generates MCP tools around them, streaming live execution state to a Next.js UI over a FastAPI WebSocket behind a provider abstraction.',
    ],
    tags: ['Multi-Agent', 'MCP', 'A2A', 'Python', 'FastAPI', 'Next.js', 'COBOL'],
    categories: ['Agentic AI'],
    metric: { value: 'Top 13', label: 'of 200+ entries' },
    badge: 'Hackathon',
    featured: true,
  },
  {
    title: 'Amazon Connect DR & Reliability Framework',
    blurb: 'Cross-region disaster recovery for enterprise contact centers, fully automated.',
    points: [
      'Production-grade DR synchronization for Amazon Connect: Boto3, the AWS SDK, Lambda, Step Functions, EventBridge and SNS orchestrate cross-region configuration sync and failover.',
      'The entire DR stack is Infrastructure-as-Code in AWS CDK (TypeScript): repeatable, version-controlled cross-region environments.',
      'Syncs run outside business hours with automated failure detection, retries and SNS alerting, cutting recovery time and manual intervention.',
      'Runs in production at a 99.9% successful-run rate and 100% config compliance, eliminating DR configuration drift and improving failover readiness, high availability and business continuity.',
    ],
    tags: ['AWS CDK', 'Step Functions', 'Lambda', 'EventBridge', 'SNS', 'Boto3'],
    categories: ['Cloud & IaC'],
    metric: { value: '99.9%', label: 'successful-run rate' },
    badge: 'Enterprise',
    featured: true,
  },
  {
    title: 'Contact-Center Infrastructure-as-Code',
    blurb: 'Complete Amazon Connect environments from a single CDK deploy.',
    points: [
      'End-to-end IaC with AWS CDK (TypeScript) provisioning full Amazon Connect environments: instances, flows, queues, routing profiles and IAM.',
      'Reduced manual setup time by 80% and made contact-center deployments repeatable and reviewable across regions.',
      'Every environment change is version-controlled, removing configuration drift between dev, staging and production.',
    ],
    tags: ['AWS CDK', 'TypeScript', 'Amazon Connect', 'IAM', 'CI/CD'],
    categories: ['Cloud & IaC'],
    metric: { value: '80%', label: 'less manual setup' },
    badge: 'Enterprise',
    featured: true,
  },
  {
    title: 'Enterprise Multi-Source Data Platform',
    blurb: 'A governed Medallion Lakehouse unifying five streaming and batch sources.',
    points: [
      'Production Medallion Lakehouse on Microsoft Fabric ingesting from Azure SQL, AWS S3, ADLS Gen2, Azure IoT Hub and Event Hubs via Pipelines, Eventstream and OneLake Shortcuts.',
      'Bronze/Silver/Gold layers in Apache Spark notebooks with schema evolution, incremental updates and idempotent late-arriving-data handling.',
      'Governance with Microsoft Purview: asset cataloguing, sensitivity labels, end-to-end lineage and role-based access across workspaces.',
      'Real-time KQL dashboards and Power BI reporting on the Gold layer from a single semantic model.',
    ],
    tags: ['Microsoft Fabric', 'Apache Spark', 'Delta Lake', 'Purview', 'KQL', 'Power BI'],
    categories: ['Data & Analytics', 'Cloud & IaC'],
    metric: { value: '5', label: 'sources unified' },
    badge: 'Enterprise',
  },
  {
    title: 'Lightweight IoT Intrusion Detection',
    blurb: 'Curriculum learning plus XAI, small enough to live on an edge device.',
    points: [
      'Scalable curriculum-learning framework with LIME-based XAI validation over optimized GRU/LSTM attention layers to progressively detect complex cyber-attacks.',
      'Reached 98% accuracy on the CIC-IoV-2024 dataset while compressing the model to 367KB through quantization and pruning.',
      'Published at IEEE FNWF 2025.',
    ],
    tags: ['Curriculum Learning', 'GRU/LSTM', 'XAI (LIME)', 'Quantization', 'Edge AI'],
    categories: ['ML & Research'],
    metric: { value: '98%', label: 'accuracy at 367KB' },
    badge: 'Research',
  },
  {
    title: 'FAPL-DM-BC',
    blurb: 'Privacy-preserving federated learning for the Internet of Vehicles, anchored on-chain.',
    points: [
      'Privacy-preserving IoV framework merging federated learning with blockchain smart contracts for decentralized model validation and tamper-proof provenance.',
      'Dockerized microservices architecture using SMPC with a dual-model XAI feedback loop (SHAP/LIME) for real-time threat detection.',
      'Achieved 93.1% accuracy at 42ms latency. Published at IEEE COMSNETS 2026.',
    ],
    tags: ['Federated Learning', 'Blockchain', 'SMPC', 'SHAP/LIME', 'Docker'],
    categories: ['ML & Research'],
    metric: { value: '93.1%', label: 'accuracy at 42ms' },
    badge: 'Research',
  },
  {
    title: 'Blog Generation & Chat with PDFs',
    blurb: 'A GenAI workspace that writes long-form posts and answers questions over documents.',
    points: [
      'Generates topic blogs and enables chat over PDFs — summarization and Q&A — with Llama 2, Streamlit and a retrieval-based interface.',
      'Prompt templating with document chunking and retrieval keeps answers grounded in the uploaded source.',
    ],
    tags: ['Llama 2', 'Streamlit', 'Python', 'NLP', 'Retrieval'],
    categories: ['ML & Research'],
    github: 'https://github.com/sujithm21/Blog-generation-and-chat-with-PDF',
    badge: 'Open Source',
  },
  {
    title: 'Crop Recommendation System',
    blurb: 'Predicts the best crop for the coming season from soil and climate signals.',
    points: [
      'Identifies the optimal crop for the next season from environmental and soil factors.',
      'Reached 99% accuracy with a tuned Random Forest classifier over the engineered feature set.',
    ],
    tags: ['Random Forest', 'scikit-learn', 'Python', 'Feature Engineering'],
    categories: ['ML & Research'],
    metric: { value: '99%', label: 'accuracy' },
    github: 'https://github.com/sujithm21/Crop-Prediction',
    badge: 'Open Source',
  },
  {
    title: 'Cloud Notebook',
    blurb: 'A fast, secure digital notebook with cloud sync.',
    points: [
      'Notebook app with a React frontend and an Express backend providing secure, token-authenticated note storage.',
    ],
    tags: ['React', 'Express', 'MongoDB', 'JWT'],
    categories: ['Full-Stack'],
    github: 'https://github.com/sujithm21/inotebok',
    badge: 'Open Source',
  },
  {
    title: 'DailySphere',
    blurb: 'A clean, always-current news reader.',
    points: [
      'Full-stack news application with React on the front end and Node.js/Express on the back end, delivering daily news through a clean interface.',
    ],
    tags: ['React', 'Node.js', 'Express', 'REST APIs'],
    categories: ['Full-Stack'],
    github: 'https://github.com/sujithm21/newsapp',
    badge: 'Open Source',
  },
  {
    title: 'Dream Home',
    blurb: 'A rental marketplace desktop app for seekers and property owners.',
    points: [
      'Rental application built with Tkinter and MySQL around two distinct user journeys: property seekers and owners.',
    ],
    tags: ['Python', 'Tkinter', 'MySQL'],
    categories: ['Full-Stack'],
    github: 'https://github.com/sujithm21/Dream-Home-Project',
    badge: 'Open Source',
  },
];

export type SkillBucket = { name: string; icon: string; items: string[] };

export const skillBuckets: SkillBucket[] = [
  {
    name: 'AI & Machine Learning',
    icon: 'brain',
    items: [
      'Generative AI',
      'Agentic AI',
      'LLMs',
      'RAG',
      'Multi-Agent Systems',
      'LLM Evaluation',
      'Prompt Engineering',
      'MCP',
      'A2A Protocol',
      'Conversational AI',
      'Voice AI',
      'LLM-as-Judge',
      'Responsible AI',
      'Human-in-the-Loop',
      'LLM Pruning',
      'Federated Learning',
      'Explainable AI (XAI)',
      'MLOps',
    ],
  },
  {
    name: 'AI Frameworks & Platforms',
    icon: 'sparkles',
    items: [
      'Azure AI Foundry',
      'Azure OpenAI',
      'Amazon Bedrock',
      'AWS Strands',
      'CrewAI',
      'Google ADK',
      'Agent Gateway',
      'Vertex AI',
      'Dialogflow CX',
      'NiCE Cognigy',
      'Cognigy Voice Gateway',
      'Genesys Cloud',
      'Azure Speech (STT/TTS)',
      'ServiceNow',
    ],
  },
  {
    name: 'Cloud & Infrastructure',
    icon: 'cloud',
    items: [
      'AWS Lambda',
      'AWS CDK',
      'Amazon Connect',
      'S3',
      'DynamoDB',
      'EventBridge',
      'Step Functions',
      'SNS',
      'IAM & KMS',
      'Azure Functions',
      'Cosmos DB',
      'GCP Cloud Run',
      'AWS SDK (Boto3)',
      'AWS Systems Manager',
      'Docker',
      'Infrastructure-as-Code',
    ],
  },
  {
    name: 'SRE & Observability',
    icon: 'shield',
    items: [
      'Reliability Engineering',
      'Disaster Recovery',
      'Failure Recovery',
      'Automation',
      'Monitoring & Alerting',
      'OpenTelemetry',
      'Distributed Tracing',
      'CloudWatch',
      'Langfuse',
      'AgentOps',
      'CI/CD',
      'Linux',
      'Git',
    ],
  },
  {
    name: 'Backend & APIs',
    icon: 'server',
    items: [
      'FastAPI',
      'Node.js',
      'Express.js',
      'REST APIs',
      'WebSockets',
      'JSON-RPC',
      'SIP / BYOC Trunking',
      'Pydantic',
      'Microservices',
      'Serverless',
      'API Design',
      'Distributed Systems',
    ],
  },
  {
    name: 'Data & Analytics',
    icon: 'database',
    items: [
      'Microsoft Fabric',
      'Medallion Lakehouse',
      'Apache Spark',
      'Delta Lake',
      'Eventstream & KQL',
      'Microsoft Purview',
      'Power BI',
      'Vector Databases',
    ],
  },
  {
    name: 'Databases',
    icon: 'layers',
    items: [
      'PostgreSQL',
      'MongoDB',
      'MySQL',
      'DynamoDB',
      'Cosmos DB',
      'Azure SQL',
      'Data Modelling',
      'SQL Optimization',
    ],
  },
  {
    name: 'Languages',
    icon: 'code',
    items: ['Python', 'TypeScript', 'JavaScript', 'C++', 'C', 'SQL'],
  },
  {
    name: 'Frontend & Tools',
    icon: 'wrench',
    items: [
      'React.js',
      'Next.js',
      'Redux',
      'Tailwind CSS',
      'Pytest',
      'Postman',
      'Jira',
      'Confluence',
      'GitLab',
      'Intel VTune',
    ],
  },
];

export type Publication = {
  title: string;
  venue: string;
  year: string;
  summary: string;
  topics: string[];
  url: string;
};

export const publications: Publication[] = [
  {
    title:
      'FAPL-DM-BC: Adaptive Privacy-Aware, Blockchain-Backed FL Framework with Dual-Model XAI for the IoVs',
    venue: 'IEEE COMSNETS',
    year: '2026',
    summary:
      'Privacy-preserving federated learning for the Internet of Vehicles with blockchain-anchored model validation and a dual-model XAI feedback loop.',
    topics: ['Federated Learning', 'Blockchain', 'XAI', 'IoV'],
    url: 'https://ieeexplore.ieee.org/document/11418113',
  },
  {
    title: 'Enhancing IoT Network Security through Adaptive Curriculum Learning and XAI',
    venue: 'IEEE FNWF',
    year: '2025',
    summary:
      'An adaptive curriculum-learning intrusion detection framework with LIME validation, compressed for edge deployment.',
    topics: ['Curriculum Learning', 'IoT Security', 'XAI', 'Edge AI'],
    url: 'https://ieeexplore.ieee.org/document/11317635',
  },
  {
    title: 'Scalable Marine AIS Architecture with FedMicro for Distributed Vessel Tracking',
    venue: 'IEEE FNWF',
    year: '2025',
    summary:
      'A federated-learning microservices architecture for distributed vessel tracking that scales AIS analytics without exposing raw feeds: FedAvg aggregation in 10 ms, 406 ms inference and SHAP feature attribution.',
    topics: ['Federated Learning', 'Microservices', 'Maritime AIS', 'XAI (SHAP)'],
    url: 'https://ieeexplore.ieee.org/document/11317183',
  },
  {
    title:
      'Predicting Stellar Metallicity: A Comparative Analysis of Regression Models for Solar Twin Stars',
    venue: 'IEEE SPACE',
    year: '2025',
    summary:
      'A comparative study of regression models for estimating stellar metallicity in solar-twin candidates.',
    topics: ['Applied ML', 'Regression', 'Astrophysics'],
    url: 'https://ieeexplore.ieee.org/document/11171345',
  },
];

export const certifications = [
  {
    issuer: 'CGI',
    items: [
      'Inside Agentic AI — Foundations',
      'Inside Agentic AI — Core Architecture',
      'AI Guardrails & Governance',
      'Elements of an AI Architect',
      'Reusable AI Architecture Patterns',
      'Cloud Computing & MLOps',
      'Microsoft Foundry for Enterprise AI',
    ],
  },
  {
    issuer: 'Udemy',
    items: ['Full Stack Web Development', 'Machine Learning A-Z'],
  },
];

export const featuredCertifications = [
  {
    name: 'AWS Certified AI Practitioner',
    issuer: 'Amazon Web Services',
    exam: 'AIF-C01',
    badge: '/aws-ai-practitioner-badge.png',
  },
  {
    name: 'Cognigy Certified Specialist',
    issuer: 'Cognigy',
    exam: 'Cognigy Mastery Program',
    badge: '/cognigy-certified-specialist-badge.png',
  },
  {
    name: 'AWS Certified Cloud Practitioner',
    issuer: 'Amazon Web Services',
    exam: 'CLF-C02',
    badge: '/aws-cloud-practitioner-badge.png',
  },
];

export const achievements = [
  {
    title: 'CGI Envision 2026 Hackathon — Top 13',
    detail:
      'Shortlisted in the top 13 of 200+ submissions company-wide with LegacyLift, a multi-agent COBOL modernization system.',
    year: '2026',
    icon: 'trophy',
  },
  {
    title: 'Research Intern at IISc Bangalore',
    detail:
      'Selected for a research internship on LLM pruning and GPT-2 inference optimization, delivering a 4× attention-layer speedup.',
    year: '2024',
    icon: 'microscope',
  },
  {
    title: 'TCS TechBytes — Regional Finals Runner-Up',
    detail:
      'Runner-up at the Dharwad regional finals of the inter-college tech quiz run by TCS and BITES across Karnataka.',
    year: '2024',
    icon: 'medal',
  },
  {
    title: 'Andhra Pradesh State Board Topper',
    detail:
      'Scored 990/1000 in the state board examinations, among the top rank holders in the state.',
    year: '2021',
    icon: 'star',
  },
];

export const education = {
  institution: 'Indian Institute of Information Technology (IIIT), Dharwad',
  degree: 'B.Tech in Computer Science and Engineering',
  period: 'Dec 2021 — Jul 2025',
  score: 'CGPA 8.41',
};

export type ResumeVariant = { label: string; description: string; file: string };

export const resumeVariants: ResumeVariant[] = [
  {
    label: 'Cloud & AI',
    description: 'AWS CDK, IaC, reliability and AI platforms',
    file: '/resume/Sujith_Makam_Cloud_AI.pdf',
  },
  {
    label: 'AI Developer',
    description: 'LLM applications, agentic systems and GenAI delivery',
    file: '/resume/Sujith_Makam_AI_Developer.pdf',
  },
];

export const primaryResume = '/resume/Sujith_Makam_Resume.pdf';

export const navSections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'research', label: 'Publications' },
  { id: 'credentials', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];
