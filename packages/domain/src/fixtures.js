export const seedProfile = {
  id: 'candidate-demo',
  name: 'Alex Morgan',
  headline: 'Senior Data & AI Platform Engineer',
  location: 'Boston, MA',
  seniority: 'senior',
  yearsExperience: 9,
  skills: ['Python','SQL','Snowflake','Databricks','AWS','Kubernetes','dbt','Airflow','LLM','RAG','TypeScript'],
  targetRoles: ['Staff Data Engineer','Senior AI Engineer','Platform Engineer','Solutions Architect'],
  experience: [
    { company:'Northstar Systems', title:'Senior Data Platform Engineer', years:4, highlight:'Built governed data platforms serving analytics and AI workloads across multiple business units.' },
    { company:'Atlas Labs', title:'Data Engineer', years:3, highlight:'Designed batch and streaming pipelines with Python, SQL, Airflow and cloud warehouses.' }
  ],
  education: [{ degree:'M.S. Computer Science', school:'State University' }],
  preferences: { workplace:['remote','hybrid'], locations:['United States','Boston','New York'], salary:{min:170000,currency:'USD'}, relocate:false }
};

export const seedListings = [
  { id:'job-openai-senior-platform',company:'Lumina AI',title:'Senior AI Platform Engineer',location:'Remote — United States',workplace:'remote',salaryMin:190000,salaryMax:245000,currency:'USD',skills:['Python','Kubernetes','AWS','LLM','RAG'],description:'Build reliable AI platform infrastructure, agent runtimes, retrieval systems, model gateways and production observability. Partner with product teams and own platform reliability.',source:'seed',sourceUrl:'#',postedAt:'2026-09-03T12:00:00Z' },
  { id:'job-northwind-staff-data',company:'Northwind Cloud',title:'Staff Data Engineer',location:'New York, NY',workplace:'hybrid',salaryMin:185000,salaryMax:230000,currency:'USD',skills:['Python','SQL','Snowflake','dbt','Airflow','AWS'],description:'Lead a modern analytics and data-products platform using Snowflake, dbt, Airflow and Python. Establish governance, lineage and engineering standards.',source:'seed',sourceUrl:'#',postedAt:'2026-09-02T17:30:00Z' },
  { id:'job-vector-solution-arch',company:'VectorWorks',title:'Principal Solutions Architect — Data & AI',location:'Boston, MA',workplace:'hybrid',salaryMin:200000,salaryMax:260000,currency:'USD',skills:['AWS','Snowflake','Databricks','Kubernetes','LLM'],description:'Architect enterprise data and AI solutions, lead client technical strategy, and translate business outcomes into scalable cloud platforms.',source:'seed',sourceUrl:'#',postedAt:'2026-09-01T15:00:00Z' },
  { id:'job-helix-data',company:'Helix Health',title:'Senior Data Engineer',location:'Remote — United States',workplace:'remote',salaryMin:155000,salaryMax:195000,currency:'USD',skills:['Python','SQL','Databricks','Airflow'],description:'Develop healthcare data pipelines, quality controls and lakehouse services. Experience with regulated data environments is preferred.',source:'seed',sourceUrl:'#',postedAt:'2026-08-31T09:00:00Z' },
  { id:'job-cascade-frontend',company:'Cascade',title:'Senior Frontend Engineer',location:'San Francisco, CA',workplace:'onsite',salaryMin:180000,salaryMax:220000,currency:'USD',skills:['TypeScript','React','CSS'],description:'Build polished product interfaces in React and TypeScript with strong design-system fundamentals.',source:'seed',sourceUrl:'#',postedAt:'2026-08-30T09:00:00Z' },
  { id:'job-orbit-ml',company:'Orbit Compute',title:'Machine Learning Infrastructure Engineer',location:'Remote — US/Canada',workplace:'remote',salaryMin:175000,salaryMax:235000,currency:'USD',skills:['Python','Kubernetes','AWS','ML','LLM'],description:'Build GPU orchestration, model-serving infrastructure, evaluation pipelines and internal developer platforms for ML teams.',source:'seed',sourceUrl:'#',postedAt:'2026-08-29T18:00:00Z' }
];
