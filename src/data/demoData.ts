import { CandidateProfile, ResumeData, JobRoleAnalysis, SkillGapAnalysis, InterviewQuestion, AnswerEvaluation, FinalInterviewReport, RoadmapItem } from '../types/interview';

export interface DemoCandidate {
  id: string;
  label: string;
  profile: CandidateProfile;
  resume: ResumeData;
  rawResumeText: string;
}

export const DEMO_CANDIDATES: DemoCandidate[] = [
  {
    id: 'data-analyst',
    label: 'Alex Chen (CSE Graduate → Data Analyst)',
    profile: {
      name: 'Alex Chen',
      targetRole: 'Data Analyst',
      experienceLevel: 'Entry Level (Fresher)',
      interviewType: 'Mixed',
      numberOfQuestions: 5,
    },
    rawResumeText: `ALEX CHEN
San Francisco, CA | alex.chen@example.edu | (555) 345-6789 | linkedin.com/in/alexchen-demo

EDUCATION:
B.S. in Computer Science & Engineering | Tech University (2022 - 2026) | GPA: 3.82 / 4.0

TECHNICAL SKILLS:
Programming: Python (Pandas, NumPy, Matplotlib, Seaborn), SQL (PostgreSQL, MySQL), R
Data Tools & BI: Excel (Pivot Tables, VLOOKUP, Power Query), Tableau (Dashboards, LOD expressions), Git
Database Systems: PostgreSQL, MongoDB, SQLite
Core Concepts: Data Wrangling, Exploratory Data Analysis (EDA), Statistical Hypothesis Testing, A/B Testing, Linear Regression

PROJECTS:
1. E-Commerce Customer Segmentation & Churn Predictor (Python, Scikit-learn, Seaborn)
- Analyzed 120,000 transaction records to identify purchasing behavioral patterns.
- Engineered RFM (Recency, Frequency, Monetary) metrics and trained KMeans clustering models.
- Built interactive dashboard visualizing churn probabilities, highlighting 18% high-risk segments.

2. Healthcare Appointment Attendance Intelligence (SQL, Tableau, PostgreSQL)
- Designed relational SQL database schema with 5 normalized tables.
- Formulated optimized SQL queries using CTEs and window functions to assess patient no-show factors.
- Deployed interactive Tableau dashboard with dynamic date filters and geospatial clinic heatmaps.

INTERNSHIPS & EXPERIENCE:
Data Analytics Intern | RetailPulse Analytics (June 2025 - August 2025)
- Automated weekly KPI reports across 4 regional branches using Python and openpyxl, saving 6 hours per week.
- Assisted data engineering team in validating ETL pipeline consistency for 500k daily POS events.
- Created executive summaries tracking product category margins.

CERTIFICATIONS:
- Google Data Analytics Professional Certificate (Coursera)
- SQL for Data Science (UC Davis / Coursera)

KEY STRENGTHS:
- Strong exploratory data analysis and storytelling with data.
- Proficiency in writing complex analytical SQL queries.
- Rapid adaptation to business requirements and cross-functional communication.`,
    resume: {
      candidateName: 'Alex Chen',
      email: 'alex.chen@example.edu',
      phone: '(555) 345-6789',
      summary: 'Computer Science & Engineering graduate specializing in data analytics, quantitative problem solving, and business intelligence with hands-on experience in Python, SQL, and Tableau.',
      education: [
        {
          degree: 'B.S. in Computer Science & Engineering',
          institution: 'Tech University',
          year: '2022 - 2026',
          cgpaOrGrade: '3.82 / 4.0'
        }
      ],
      technicalSkills: [
        'Python',
        'SQL',
        'Data Wrangling',
        'Exploratory Data Analysis (EDA)',
        'Statistical Modeling',
        'A/B Testing Basics',
        'Pandas',
        'NumPy'
      ],
      programmingLanguages: ['Python', 'SQL', 'R', 'C++'],
      toolsAndFrameworks: ['Tableau', 'Excel (Power Query)', 'PostgreSQL', 'Jupyter Notebook', 'Git', 'Power BI (Basic)'],
      projects: [
        {
          title: 'E-Commerce Customer Segmentation & Churn Predictor',
          technologies: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib'],
          description: 'Analyzed 120,000 transaction records to calculate RFM scores and performed K-Means clustering to predict churn likelihood.',
          impact: 'Identified 18% at-risk user cluster; generated actionable retention strategies.'
        },
        {
          title: 'Healthcare Appointment Attendance Intelligence',
          technologies: ['PostgreSQL', 'SQL Window Functions', 'Tableau'],
          description: 'Engineered relational schema and CTE-based analytical queries to uncover attendance patterns across 14 clinic branches.',
          impact: 'Reduced report generation lag by 40% with automated queries and visual dashboards.'
        }
      ],
      internshipsAndExperience: [
        {
          role: 'Data Analytics Intern',
          company: 'RetailPulse Analytics',
          duration: 'June 2025 - August 2025',
          highlights: [
            'Automated weekly regional sales reporting using Python scripts, saving 6 hours per week.',
            'Validated data integrity on daily ETL pipelines ingesting over 500k transaction records.',
            'Collaborated with marketing leads to quantify promotional campaign lift.'
          ]
        }
      ],
      certifications: [
        'Google Data Analytics Professional Certificate',
        'SQL for Data Science (Coursera / UC Davis)'
      ],
      keyStrengths: [
        'Analytical problem-solving and structured hypothesis testing',
        'Clear data storytelling and visualization through Tableau',
        'Robust SQL querying with subqueries, CTEs, and window functions'
      ],
      extractedFromPdf: false
    }
  },
  {
    id: 'full-stack',
    label: 'Priya Sharma (Frontend/React → Full Stack Developer)',
    profile: {
      name: 'Priya Sharma',
      targetRole: 'Full Stack Software Engineer',
      experienceLevel: 'Junior (1-2 Years)',
      interviewType: 'Technical',
      numberOfQuestions: 5,
    },
    rawResumeText: `PRIYA SHARMA
Bengaluru, India | priya.sharma@example.com | +91 98765 43210

EDUCATION:
B.Tech in Information Technology | National Institute of Engineering (2021 - 2025) | CGPA: 8.9 / 10

TECHNICAL SKILLS:
Frontend: React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Redux Toolkit
Backend: Node.js, Express.js, RESTful APIs, basic Go
Databases: MongoDB, PostgreSQL, Redis caching basics
DevOps & Tools: Docker (Containers), Git/GitHub, Postman, Jest, AWS S3 basics

PROJECTS:
1. DevCollab: Real-Time Collaborative Workspace
- Developed full-stack SaaS platform using React, Node.js, Socket.io, and MongoDB.
- Implemented real-time document sync with operational transformation and JWT auth.
- Deployed on Docker containerized environment on AWS ECS.

2. Micro-Invoicing Engine & Payment Gateway Integration
- Engineered high-throughput invoice management REST API in Node.js/PostgreSQL.
- Integrated Stripe webhooks with idempotent transaction handling.

EXPERIENCE:
Associate Software Engineer | CloudStack Solutions (Aug 2025 - Present)
- Built 12+ responsive features for client portal using Next.js and TypeScript.
- Improved Core Web Vitals score from 68 to 94 through code splitting and image caching.

CERTIFICATIONS:
- Meta Certified Front-End Developer
- AWS Certified Cloud Practitioner`,
    resume: {
      candidateName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      summary: 'Passionate software engineer experienced in modern frontend architecture, TypeScript, REST APIs, and containerized microservices.',
      education: [
        {
          degree: 'B.Tech in Information Technology',
          institution: 'National Institute of Engineering',
          year: '2021 - 2025',
          cgpaOrGrade: '8.9 / 10'
        }
      ],
      technicalSkills: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'Next.js', 'REST API Design', 'Tailwind CSS', 'Redux Toolkit'],
      programmingLanguages: ['TypeScript', 'JavaScript', 'Python', 'Go (Basic)'],
      toolsAndFrameworks: ['Docker', 'Postman', 'Git', 'MongoDB', 'PostgreSQL', 'Redis', 'Jest'],
      projects: [
        {
          title: 'DevCollab: Real-Time Collaborative Workspace',
          technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Docker'],
          description: 'Built real-time synchronized canvas and Markdown document editor with JWT role-based authentication.',
          impact: 'Achieved sub-50ms message broadcast latency under concurrent load testing.'
        },
        {
          title: 'Micro-Invoicing Engine & Payment Gateway',
          technologies: ['Node.js', 'Express', 'PostgreSQL', 'Stripe API'],
          description: 'Engineered idempotent payment processing pipeline with automated PDF invoice generation.',
          impact: 'Processed 5,000+ sandbox transactions with zero duplicate payments.'
        }
      ],
      internshipsAndExperience: [
        {
          role: 'Associate Software Engineer',
          company: 'CloudStack Solutions',
          duration: 'Aug 2025 - Present',
          highlights: [
            'Spearheaded frontend migration to Next.js 14 App Router, cutting LCP by 45%.',
            'Implemented automated CI/CD pipeline using GitHub Actions and unit tests in Jest.'
          ]
        }
      ],
      certifications: [
        'Meta Certified Front-End Developer',
        'AWS Certified Cloud Practitioner'
      ],
      keyStrengths: [
        'Component architecture and state management in React/Redux',
        'API performance tuning and TypeScript type safety',
        'Agile team collaboration and sprint delivery'
      ],
      extractedFromPdf: false
    }
  }
];

export const SAMPLE_JOB_ANALYSES: Record<string, JobRoleAnalysis> = {
  'Data Analyst': {
    roleTitle: 'Data Analyst',
    overview: 'Transforms raw operational and product data into actionable business intelligence through rigorous querying, metric modeling, and stakeholder visualizations.',
    requiredTechnicalSkills: [
      'Advanced SQL (CTEs, Window Functions, Joins)',
      'Python for Analytics (Pandas, NumPy)',
      'Data Cleaning & Preprocessing',
      'Statistical Analysis & Hypothesis Testing',
      'Business Intelligence Dashboarding (Power BI / Tableau)',
      'Data Modeling & Dimensional Schemas',
      'A/B Testing Methodologies'
    ],
    requiredSoftSkills: [
      'Business Acumen & Commercial Insight',
      'Stakeholder Communication & Storytelling',
      'Critical Analytical Thinking',
      'Attention to Detail & Data Quality Awareness'
    ],
    expectedTools: [
      'SQL (Snowflake / PostgreSQL / BigQuery)',
      'Python (Jupyter Notebooks)',
      'Tableau / Microsoft Power BI',
      'Advanced Microsoft Excel / Google Sheets',
      'Git & Version Control',
      'dbt (Data Build Tool)'
    ],
    importantConcepts: [
      'Star & Snowflake Schemas',
      'Aggregation & Granularity',
      'Retention & Churn Cohorts',
      'P-values and Confidence Intervals',
      'KPI Frameworks (CAC, LTV, MRR, Conversion Funnels)'
    ],
    typicalInterviewTopics: [
      'Live SQL query problem solving (Window functions, Self joins)',
      'Case study: diagnosing a sudden 20% drop in user engagement',
      'Explaining complex statistical insights to non-technical executives',
      'Data wrangling edge cases: missing values, outliers, duplicate keys'
    ],
    industryDemand: 'Very High (Crucial across E-Commerce, SaaS, Healthcare, and Fintech)'
  },
  'Full Stack Software Engineer': {
    roleTitle: 'Full Stack Software Engineer',
    overview: 'Designs, develops, tests, and operates end-to-end web applications across modern frontend interfaces, scalable backend microservices, and reliable database architectures.',
    requiredTechnicalSkills: [
      'Modern JavaScript / TypeScript (ES2023+)',
      'Frontend Framework (React, Next.js, or Vue)',
      'Server-Side Engineering (Node.js, Express, Python, or Go)',
      'REST & GraphQL API Architecture',
      'Relational & NoSQL Databases (PostgreSQL, MongoDB)',
      'Caching & Performance (Redis, CDN)',
      'Authentication & Authorization (JWT, OAuth2, RBAC)'
    ],
    requiredSoftSkills: [
      'Systematic Debugging & Root Cause Analysis',
      'Cross-functional Agile Team Collaboration',
      'Code Review & Constructive Feedback',
      'User-Centric Engineering Mindset'
    ],
    expectedTools: [
      'Docker & Container Orchestration',
      'Git / GitHub CI/CD Actions',
      'Postman / Swagger OpenAPI',
      'Cloud Providers (AWS / GCP / Azure)',
      'Jest / Vitest / Playwright for Testing'
    ],
    importantConcepts: [
      'Database Indexing & Query Optimization',
      'Microservices vs Modular Monoliths',
      'Event-Driven Architecture (Message Queues)',
      'Security (CORS, CSRF, XSS, SQL Injection Prevention)',
      'SOLID Design Principles & Clean Architecture'
    ],
    typicalInterviewTopics: [
      'System design: Designing a scalable URL shortener or live notification service',
      'Data structures & algorithms (Arrays, Maps, Trees, Graphs)',
      'State management trade-offs and React component lifecycle re-renders',
      'Database transaction isolation levels and concurrency control'
    ],
    industryDemand: 'Extremely High (Universal across all software product engineering teams)'
  }
};

export const SAMPLE_SKILL_GAPS: Record<string, SkillGapAnalysis> = {
  'Data Analyst': {
    matchingSkills: [
      { name: 'Python (Pandas, NumPy)', category: 'Technical', details: 'Candidate demonstrated strong capability in data wrangling and segmentation.' },
      { name: 'SQL (PostgreSQL)', category: 'Technical', details: 'Solid grasp of joins, grouping, and schema normalization.' },
      { name: 'Tableau Dashboards', category: 'Tool', details: 'Built interactive dashboards for clinic attendance and customer churn.' },
      { name: 'Exploratory Data Analysis', category: 'Concept', details: 'Extensively applied in academic and internship capstones.' }
    ],
    partiallyMatchingSkills: [
      {
        name: 'A/B Testing & Hypothesis Testing',
        candidateSkill: 'Basic Statistical Concepts',
        gapDescription: 'Candidate knows theoretical p-values, but lacks practical experience with sample sizing, statistical power calculation, and multi-variant split tests.'
      },
      {
        name: 'Business Intelligence (Power BI)',
        candidateSkill: 'Tableau Only',
        gapDescription: 'Comfortable with Tableau, but enterprise roles often require Microsoft Power BI and DAX formulas.'
      }
    ],
    missingSkills: [
      { name: 'Cloud Data Warehousing (BigQuery / Snowflake)', category: 'Tool', details: 'No experience with petabyte-scale distributed SQL warehouses.' },
      { name: 'dbt (Data Build Tool)', category: 'Tool', details: 'Modern analytics engineering stack standard for modular data transformations.' },
      { name: 'Executive Business Storytelling', category: 'Soft Skill', details: 'Needs more practice translating technical metrics into C-suite financial revenue terms.' }
    ],
    skillGapPercentage: 28,
    matchPercentage: 72,
    readinessVerdict: 'Strong Junior Candidate — technically capable with high potential; requires grooming in modern enterprise cloud warehouses.',
    recommendedLearningAreas: [
      'Google BigQuery or Snowflake partitioning and clustering techniques',
      'Practical A/B testing design (Minimum Detectable Effect, sample size estimation)',
      'dbt core fundamentals and data testing automation',
      'Business KPI modeling (Unit economics, LTV/CAC ratios)'
    ]
  }
};

export const SAMPLE_QUESTIONS: Record<string, InterviewQuestion[]> = {
  'Data Analyst': [
    {
      id: 'q1',
      questionNumber: 1,
      question: 'In your E-Commerce Customer Segmentation project, how did you handle missing values and potential data anomalies before calculating RFM scores?',
      category: 'Resume-based',
      difficulty: 'Medium',
      targetedCompetency: 'Data Quality & Preprocessing',
      contextHint: 'Focus on how you identified outliers, imputed or removed records, and validated the business integrity of transaction dates.'
    },
    {
      id: 'q2',
      questionNumber: 2,
      question: 'Explain the difference between a Window Function (like ROW_NUMBER() or RANK()) and a standard GROUP BY clause in SQL. In what scenario would GROUP BY fail to solve your problem?',
      category: 'Technical',
      difficulty: 'Medium',
      targetedCompetency: 'Advanced SQL Querying',
      contextHint: 'Highlight row preservation vs aggregation collapsing, and giving top-N per category examples.'
    },
    {
      id: 'q3',
      questionNumber: 3,
      question: 'Imagine our product team noticed a 15% drop in checkout conversion rate week-over-week. Walk me through your step-by-step diagnostic workflow to investigate the root cause.',
      category: 'Situational',
      difficulty: 'Challenging',
      targetedCompetency: 'Analytical Problem Solving & Root Cause Diagnosis',
      contextHint: 'Break down by segments: platform/browser, geolocation, tracking/instrumentation bugs, payment gateway downtime, and seasonality.'
    },
    {
      id: 'q4',
      questionNumber: 4,
      question: 'Your skill profile indicates strong Tableau knowledge, but our enterprise stack relies on cloud data warehouses like Snowflake/BigQuery. How do you approach scaling SQL queries when datasets grow from thousands of rows to billions?',
      category: 'Technical',
      difficulty: 'Challenging',
      targetedCompetency: 'Query Optimization & Cloud Architecture',
      contextHint: 'Mention partition pruning, clustering keys, avoiding SELECT *, avoiding Cartesian joins, and materialized views.'
    },
    {
      id: 'q5',
      questionNumber: 5,
      question: 'Tell me about a time during your internship or projects when your analytical findings contradicted what a stakeholder or manager assumed. How did you communicate the insight?',
      category: 'Behavioral',
      difficulty: 'Medium',
      targetedCompetency: 'Stakeholder Communication & Persuasion',
      contextHint: 'Use the STAR method (Situation, Task, Action, Result) with clear visual evidence and empathetic collaboration.'
    }
  ]
};

export const SAMPLE_ROADMAP: RoadmapItem[] = [
  {
    id: 'rd1',
    skill: 'Cloud Data Warehousing (BigQuery / Snowflake)',
    priority: 'High',
    reason: 'Enterprise data analytics teams rarely query local databases; mastering distributed cloud SQL syntax, partitioning, and cost-aware querying is mandatory for mid-tier interviews.',
    whatToLearn: [
      'BigQuery partitioned and clustered tables',
      'Query execution plans and slot consumption',
      'Connecting BI tools directly to cloud warehouses'
    ],
    practiceTask: 'Load the public US Census or NYC Taxi dataset (10M+ rows) into Google BigQuery Free Tier, write partitioned analytical queries, and benchmark cost/execution time.',
    suggestedInterviewPractice: 'Practice answering: "How do you optimize an expensive SQL query that scanned 500GB of unpartitioned logs?"',
    estimatedTimeline: '1 - 2 Weeks',
    status: 'In Progress'
  },
  {
    id: 'rd2',
    skill: 'Practical A/B Testing & Experimentation',
    priority: 'High',
    reason: 'Tech companies hire data analysts primarily to evaluate product feature launches and measure statistical significance without bias.',
    whatToLearn: [
      'Hypothesis formulation (Null vs Alternative)',
      'Calculating Minimum Detectable Effect (MDE) and sample sizes',
      'Novelty effects, Simpson Paradox, and p-hacking pitfalls'
    ],
    practiceTask: 'Simulate a 2-sample t-test in Python on simulated website visitor conversion data, varying sample size from 500 to 50,000 to observe p-value stability.',
    suggestedInterviewPractice: 'Mock question: "What do you do if an A/B test shows statistically significant conversion gain but an increase in customer support tickets?"',
    estimatedTimeline: '1 Week',
    status: 'Not Started'
  },
  {
    id: 'rd3',
    skill: 'Analytics Engineering with dbt (Data Build Tool)',
    priority: 'Medium',
    reason: 'Bridging the gap between raw data and clean dashboard tables makes you 3x more competitive than candidates who only know basic SQL.',
    whatToLearn: [
      'dbt project structure: staging, intermediate, and marts models',
      'Jinja templating for dynamic SQL generation',
      'Automated schema tests (unique, not_null, accepted_values)'
    ],
    practiceTask: 'Set up dbt-core with PostgreSQL or BigQuery to build a dimensional Star-schema model on an open-source sales dataset.',
    suggestedInterviewPractice: 'Mock question: "How does dbt enhance data governance compared to running manual stored procedures?"',
    estimatedTimeline: '2 Weeks',
    status: 'Not Started'
  },
  {
    id: 'rd4',
    skill: 'Executive Presentation & Business Storytelling',
    priority: 'Medium',
    reason: 'Engineers who translate complex statistical models into actionable business revenue propositions stand out in managerial rounds.',
    whatToLearn: [
      'Minto Pyramid Principle for structured executive summaries',
      'Data visualization minimalism (eliminating chart junk)',
      'Translating metrics to Dollar Value / Retention Impact'
    ],
    practiceTask: 'Record a 3-minute video pitch summarizing the findings of your Customer Segmentation project as if presenting to the VP of Marketing.',
    suggestedInterviewPractice: 'Practice behavioral interview questions using the STAR framework under a 2-minute timer.',
    estimatedTimeline: 'Ongoing',
    status: 'Not Started'
  }
];
