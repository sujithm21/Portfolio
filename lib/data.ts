/**
 * Single source of truth for every content bucket on the site.
 * Sourced from the resume set in /Resumes.
 */

export const profile = {
  name: 'Sujith Makam',
  role: 'AI & Cloud Engineer',
  roles: [
    'Agentic AI Systems',
    'AWS CDK & Infrastructure-as-Code',
    'LLM & RAG Platforms',
    'Cloud Reliability & DR',
  ],
  tagline:
    'I build production AI systems that run on real cloud infrastructure — multi-agent platforms, RAG pipelines and Infrastructure-as-Code that holds up when a region goes dark.',
  summary: [
    "I'm a Software Engineer at CGI working at the intersection of applied AI and cloud infrastructure. Day to day that means shipping enterprise agentic-AI systems on Azure AI Foundry and AWS, and provisioning the contact-center platforms they run on as Infrastructure-as-Code with AWS CDK.",
    'Before CGI I was a research intern at IISc Bangalore working on LLM pruning and low-level GPT-2 optimization, and I have four IEEE-published papers across federated learning, network security and applied ML. I gravitate to problems where model quality, systems performance and reliability all have to hold at once.',
  ],
  location: 'Bengaluru, India',
  email: 'makamsujith2004@gmail.com',
  phone: '+91 8555042700',
  availability: 'Open to AI / Cloud engineering roles',
  socials: {
    github: 'https://github.com/sujithm21',
    linkedin: 'https://www.linkedin.com/in/makamsujith/',
    leetcode: 'https://leetcode.com/u/msujith21/',
  },
} as const;

export const stats = [
  { value: 40000, suffix: '+', label: 'Support calls auto-evaluated', hint: '99% coverage' },
  { value: 99.9, suffix: '%', label: 'DR sync success rate', hint: 'in production' },
  { value: 4, suffix: 'x', label: 'GPT-2 attention speedup', hint: 'IISc research' },
  { value: 4, suffix: '', label: 'IEEE publications', hint: 'ML & network security' },
];

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  kind: string;
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
    points: [
      'Designed and shipped enterprise agentic-AI solutions across Azure AI Foundry, Cognigy, Genesys and AWS, automating first-level customer interactions and reducing manual agent escalations by 85%.',
      'Built production LLM applications — AI call summarization and automated QA evaluation over 40,000+ calls — with Azure OpenAI and RAG pipelines over enterprise knowledge bases.',
      'Developed multi-agent workflows for autonomous, context-aware task execution across support operations, cutting manual intervention and improving SLA compliance.',
      'Provisioned complete Amazon Connect environments as Infrastructure-as-Code with AWS CDK (TypeScript), reducing manual setup time by 80% and enabling automated multi-region contact-center deployments.',
      'Engineered a production Amazon Connect disaster-recovery synchronization solution (Lambda, Step Functions, EventBridge, SSM, SNS) keeping DR a near-real-time mirror of production for zero-downtime failover.',
      'Built a unified multi-source data platform on Microsoft Fabric with a governed Medallion Lakehouse and Microsoft Purview lineage, powering real-time Power BI analytics.',
    ],
    stack: [
      'Azure AI Foundry',
      'Azure OpenAI',
      'AWS CDK',
      'Amazon Connect',
      'Lambda',
      'Step Functions',
      'Cognigy',
      'Genesys',
      'Microsoft Fabric',
      'RAG',
    ],
  },
  {
    company: 'Indian Institute of Science (IISc), Bangalore',
    role: 'Research Intern',
    period: 'May 2024 — Jul 2024',
    location: 'Bengaluru, India',
    kind: 'Research',
    points: [
      'Investigated LLM pruning techniques for GPT-2, optimizing the attention and feed-forward layers for inference efficiency.',
      'Profiled GPT-2 with Intel VTune to isolate cache and memory bottlenecks, achieving a 4x speedup in attention-layer execution.',
      'Implemented custom tiled matrix multiplication, cutting instruction-cache misses by 5.2% and memory bandwidth usage by 34.8%.',
    ],
    stack: ['LLM Pruning', 'GPT-2', 'Intel VTune', 'C++', 'Python', 'Performance Profiling'],
  },
];

export type Project = {
  title: string;
  blurb: string;
  points: string[];
  tags: string[];
  categories: string[];
  metric?: { value: string; label: string };
  github?: string;
  badge?: 'Enterprise' | 'Research' | 'Hackathon' | 'Open Source';
  featured?: boolean;
};

export const projectCategories = [
  'All',
  'Agentic AI',
  'Cloud & IaC',
  'Data & Analytics',
  'ML & Research',
  'Full-Stack',
];

export const projects: Project[] = [
  {
    title: 'LegacyLift',
    blurb: 'Makes legacy COBOL logic callable by AI agents — without rewriting the mainframe.',
    points: [
      'Built a multi-agent system exposing mainframe COBOL routines to AI agents; top 13 of 200+ entries at the CGI Envision 2026 Hackathon.',
      'Implemented 5 collaborating agents over an A2A message bus with a shared context graph, parsing COBOL source to auto-generate MCP tools.',
      'Streamed live execution state to a Next.js UI over a WebSocket relay behind a provider abstraction to avoid vendor SDK coupling.',
    ],
    tags: ['Multi-Agent', 'MCP', 'A2A Protocol', 'Next.js', 'WebSockets', 'COBOL'],
    categories: ['Agentic AI'],
    metric: { value: 'Top 13', label: 'of 200+ entries' },
    badge: 'Hackathon',
    featured: true,
  },
  {
    title: 'AI Governance Platform',
    blurb: 'Secure orchestration, observability and Responsible-AI controls for multi-agent workflows.',
    points: [
      'Built an enterprise AI governance platform for multi-agent workflows using Azure AI Foundry, Google ADK, CrewAI and Agent Gateway.',
      'Integrated Langfuse and AgentOps for end-to-end observability — prompt tracing, KPI monitoring, latency analysis and production evaluation.',
      'Implemented Responsible-AI controls: prompt-injection prevention, sensitive-data masking, virtual API isolation and policy enforcement.',
    ],
    tags: ['Azure AI Foundry', 'CrewAI', 'Google ADK', 'Langfuse', 'AgentOps', 'Responsible AI'],
    categories: ['Agentic AI'],
    metric: { value: '5+', label: 'guardrail controls' },
    badge: 'Enterprise',
    featured: true,
  },
  {
    title: 'Automated QA Evaluation',
    blurb: 'An LLM platform that scores every support call against quality metrics — no human sampling.',
    points: [
      'Designed and deployed an LLM-powered QA evaluation platform on Azure AI Foundry, Azure OpenAI and Azure Functions behind REST APIs.',
      'Built RAG pipelines over enterprise knowledge-base documents using vector search and embeddings for context-aware, low-hallucination assessment.',
      'Automated evaluation for 40,000+ calls at 99% coverage, replacing manual review sampling and accelerating agent feedback cycles.',
    ],
    tags: ['Azure OpenAI', 'RAG', 'Azure Functions', 'Vector Search', 'LLM Evaluation'],
    categories: ['Agentic AI'],
    metric: { value: '40k+', label: 'calls at 99% coverage' },
    badge: 'Enterprise',
    featured: true,
  },
  {
    title: 'Amazon Connect DR & Reliability Framework',
    blurb: 'Cross-region disaster recovery for enterprise contact centers, fully automated.',
    points: [
      'Engineered production-grade DR synchronization for Amazon Connect with Boto3, Lambda, Step Functions, EventBridge and SNS orchestrating cross-region configuration sync and failover.',
      'Provisioned the entire DR stack as Infrastructure-as-Code with AWS CDK (TypeScript) for repeatable, version-controlled cross-region environments.',
      'Scheduled syncs outside business hours with automated failure detection, retries and SNS alerting, cutting recovery time and manual intervention.',
      'Ran in production at a 99.9% successful-run rate, eliminating DR configuration drift and improving failover readiness.',
    ],
    tags: ['AWS CDK', 'Step Functions', 'Lambda', 'EventBridge', 'SNS', 'Boto3'],
    categories: ['Cloud & IaC'],
    metric: { value: '99.9%', label: 'successful-run rate' },
    badge: 'Enterprise',
    featured: true,
  },
  {
    title: 'Contact-Center Infrastructure-as-Code',
    blurb: 'Complete Amazon Connect environments spun up from a single CDK deploy.',
    points: [
      'Implemented end-to-end IaC with AWS CDK (TypeScript) provisioning full Amazon Connect environments — instances, flows, queues, routing profiles and IAM.',
      'Reduced manual setup time by 80% and made contact-center deployments repeatable and reviewable across regions.',
      'Version-controlled every environment change, removing configuration drift between dev, staging and production.',
    ],
    tags: ['AWS CDK', 'TypeScript', 'Amazon Connect', 'IAM', 'CI/CD'],
    categories: ['Cloud & IaC'],
    metric: { value: '80%', label: 'less manual setup' },
    badge: 'Enterprise',
  },
  {
    title: 'Enterprise Multi-Source Data Platform',
    blurb: 'A governed Medallion Lakehouse unifying five streaming and batch sources on Microsoft Fabric.',
    points: [
      'Architected a production Medallion Lakehouse on Microsoft Fabric ingesting from Azure SQL, AWS S3, ADLS Gen2, Azure IoT Hub and Event Hubs via Pipelines, Eventstream and OneLake Shortcuts.',
      'Built Bronze/Silver/Gold transformation layers in Apache Spark notebooks with schema evolution, incremental updates and idempotent late-arriving-data handling.',
      'Enforced governance with Microsoft Purview — asset cataloguing, sensitivity labels, end-to-end lineage and role-based access across workspaces.',
      'Delivered real-time KQL dashboards and Power BI reporting on the Gold layer from a single semantic model.',
    ],
    tags: ['Microsoft Fabric', 'Apache Spark', 'Delta Lake', 'Purview', 'KQL', 'Power BI'],
    categories: ['Data & Analytics', 'Cloud & IaC'],
    metric: { value: '5', label: 'heterogeneous sources' },
    badge: 'Enterprise',
  },
  {
    title: 'Lightweight IoT Intrusion Detection (Edge-AI)',
    blurb: 'Curriculum learning plus XAI intrusion detection, small enough to live on an edge device.',
    points: [
      'Developed a scalable curriculum-learning framework with LIME-based XAI validation over optimized GRU/LSTM attention layers to progressively detect complex cyber-attacks.',
      'Attained 98% accuracy on the CIC-IoV-2024 dataset while compressing the model to 367KB through quantization and pruning.',
      'Published at IEEE FNWF 2025.',
    ],
    tags: ['Curriculum Learning', 'GRU/LSTM', 'XAI (LIME)', 'Quantization', 'Edge AI'],
    categories: ['ML & Research'],
    metric: { value: '98%', label: 'accuracy @ 367KB' },
    badge: 'Research',
  },
  {
    title: 'FAPL-DM-BC — Blockchain-Federated Security',
    blurb: 'Privacy-preserving federated learning for the Internet of Vehicles, anchored on-chain.',
    points: [
      'Designed a privacy-preserving IoV framework merging federated learning with blockchain smart contracts for decentralized model validation and tamper-proof provenance.',
      'Engineered a Dockerized microservices architecture using SMPC with a dual-model XAI feedback loop (SHAP/LIME) for real-time threat detection.',
      'Achieved 93.1% accuracy at 42ms latency; published at IEEE COMSNETS 2026.',
    ],
    tags: ['Federated Learning', 'Blockchain', 'SMPC', 'SHAP/LIME', 'Docker'],
    categories: ['ML & Research'],
    metric: { value: '93.1%', label: 'accuracy @ 42ms' },
    badge: 'Research',
  },
  {
    title: 'Blog Generation & Chat with PDFs',
    blurb: 'A generative-AI workspace that writes long-form posts and answers questions over your documents.',
    points: [
      'Built a GenAI web app producing topic blogs and enabling chat over PDFs — summarization and Q&A — with Llama 2, Streamlit and a retrieval-based interface.',
      'Combined prompt templating with document chunking and retrieval to keep answers grounded in the uploaded source.',
    ],
    tags: ['Llama 2', 'Streamlit', 'Python', 'NLP', 'Retrieval'],
    categories: ['ML & Research'],
    github: 'https://github.com/sujithm21/Blog-generation-and-chat-with-PDF',
    badge: 'Open Source',
  },
  {
    title: 'Crop Recommendation System',
    blurb: 'Predicts the optimal crop for the coming season from soil and climate signals.',
    points: [
      'Built a crop recommendation system identifying the optimal crop for the next season based on environmental and soil factors.',
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
      'Built a dynamic notebook app with a React frontend and an Express backend providing secure, token-authenticated note storage.',
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
      'Developed a full-stack news application with React on the front end and Node.js/Express on the back end, delivering up-to-date daily news through a clean interface.',
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
      'Built a comprehensive rental application with Tkinter and MySQL, designed around two distinct user journeys — property seekers and owners.',
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
      'Responsible AI',
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
      'CrewAI',
      'Google ADK',
      'Agent Gateway',
      'Vertex AI',
      'Cognigy',
      'Genesys',
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
      'IAM & KMS',
      'Azure Functions',
      'Cosmos DB',
      'GCP Cloud Run',
      'Docker',
      'Infrastructure-as-Code',
    ],
  },
  {
    name: 'SRE & DevOps',
    icon: 'shield',
    items: [
      'Reliability Engineering',
      'Disaster Recovery',
      'Failure Recovery',
      'Automation',
      'Monitoring & Alerting',
      'OpenTelemetry',
      'CloudWatch',
      'CI/CD',
      'Linux',
      'Git',
    ],
  },
  {
    name: 'Backend & Distributed Systems',
    icon: 'server',
    items: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'WebSockets',
      'JSON-RPC',
      'Microservices',
      'Serverless',
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
    items: ['MongoDB', 'MySQL', 'PostgreSQL', 'DynamoDB', 'Cosmos DB', 'Azure SQL', 'SQL Optimization'],
  },
  {
    name: 'Languages',
    icon: 'code',
    items: ['Python', 'TypeScript', 'JavaScript', 'C++', 'C', 'SQL'],
  },
  {
    name: 'Tools & Collaboration',
    icon: 'wrench',
    items: [
      'Langfuse',
      'AgentOps',
      'Pytest',
      'Postman',
      'React.js',
      'Jira',
      'Confluence',
      'GitLab',
      'Claude',
      'Copilot',
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
      'A federated-learning microservices architecture for distributed vessel tracking that scales AIS analytics without exposing raw feeds — FedAvg aggregation in 10 ms, 406 ms inference, and SHAP feature attribution.',
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

export const achievements = [
  {
    title: 'CGI Envision 2026 Hackathon — Top 13',
    detail:
      'Placed in the top 13 of 200+ submissions company-wide with LegacyLift, a multi-agent COBOL modernization system.',
    year: '2026',
    icon: 'trophy',
  },
  {
    title: 'Research Intern @ IISc Bangalore',
    detail:
      'Selected for a research internship working on LLM pruning and GPT-2 inference optimization, delivering a 4x attention-layer speedup.',
    year: '2024',
    icon: 'microscope',
  },
  {
    title: 'TCS TechBytes — Dharwad Regional Finals Runner-Up',
    detail:
      'Runner-up at a prestigious inter-college tech quiz conducted by TCS and BITES across Karnataka.',
    year: '2024',
    icon: 'medal',
  },
  {
    title: 'Andhra Pradesh State Board Topper',
    detail:
      'Scored 990/1000 in the state board examinations, placing among the top rank holders in the state.',
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
    description: 'Default — AWS CDK, IaC, reliability and AI platforms',
    file: '/resume/Sujith_Makam_Cloud_AI.pdf',
  },
  {
    label: 'AI Developer',
    description: 'LLM applications, RAG and agentic systems',
    file: '/resume/Sujith_Makam_AI_Developer.pdf',
  },
  {
    label: 'Agentic AI / ML',
    description: 'Multi-agent orchestration and AI governance',
    file: '/resume/Sujith_Makam_Agentic_AI.pdf',
  },
  {
    label: 'AWS & Cloud',
    description: 'Serverless, CDK and contact-center infrastructure',
    file: '/resume/Sujith_Makam_AWS_Cloud.pdf',
  },
  {
    label: 'Conversational AI',
    description: 'Cognigy, Genesys and omnichannel automation',
    file: '/resume/Sujith_Makam_Conversational_AI.pdf',
  },
  {
    label: 'Data & Fabric',
    description: 'Microsoft Fabric, Lakehouse and analytics',
    file: '/resume/Sujith_Makam_Data_Fabric.pdf',
  },
];

export const primaryResume = '/resume/Sujith_Makam_Resume.pdf';

export const navSections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'research', label: 'Research' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
];
