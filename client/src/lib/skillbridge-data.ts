export type SkillStatus = "verified" | "supported" | "claimed" | "gap";

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
  status: SkillStatus;
  evidence: string;
  confidence: number;
  demand: number;
  priority: number;
  color: string;
};

export type Job = {
  id: string;
  role: string;
  company: string;
  initials: string;
  location: string;
  mode: "Hybrid" | "On-site" | "Remote";
  salary: string;
  posted: string;
  match: number;
  skills: string[];
  missing: string[];
  strong: string[];
  description: string;
};

export const skills: Skill[] = [
  { id: "python", name: "Python", category: "Programming", level: 91, status: "verified", evidence: "Resume + 3 projects + assessment", confidence: 91, demand: 87, priority: 64, color: "#6f63ff" },
  { id: "ml", name: "Machine Learning", category: "AI / ML", level: 84, status: "verified", evidence: "Resume + project evidence", confidence: 86, demand: 68, priority: 73, color: "#14b8a6" },
  { id: "nlp", name: "NLP", category: "AI / ML", level: 79, status: "supported", evidence: "Sentiment analysis project", confidence: 82, demand: 61, priority: 76, color: "#f59e0b" },
  { id: "sql", name: "SQL", category: "Data", level: 64, status: "supported", evidence: "Resume + internship project", confidence: 71, demand: 71, priority: 78, color: "#ec4899" },
  { id: "stats", name: "Statistics", category: "Foundations", level: 47, status: "gap", evidence: "Limited supporting evidence", confidence: 58, demand: 65, priority: 89, color: "#fb7185" },
  { id: "pytorch", name: "PyTorch", category: "AI / ML", level: 42, status: "claimed", evidence: "Listed on resume; needs verification", confidence: 44, demand: 58, priority: 82, color: "#f97316" },
  { id: "docker", name: "Docker", category: "Cloud & DevOps", level: 19, status: "gap", evidence: "Not found in project evidence", confidence: 34, demand: 46, priority: 94, color: "#38bdf8" },
  { id: "aws", name: "AWS", category: "Cloud & DevOps", level: 13, status: "gap", evidence: "Limited supporting evidence", confidence: 29, demand: 41, priority: 88, color: "#fbbf24" },
  { id: "mlops", name: "MLOps", category: "Cloud & DevOps", level: 8, status: "gap", evidence: "Not yet assessed", confidence: 20, demand: 32, priority: 76, color: "#a78bfa" },
  { id: "git", name: "Git", category: "Tools", level: 78, status: "supported", evidence: "GitHub project history", confidence: 88, demand: 76, priority: 46, color: "#f97316" },
  { id: "rest", name: "REST APIs", category: "Development", level: 67, status: "supported", evidence: "Flask capstone project", confidence: 69, demand: 64, priority: 55, color: "#22c55e" },
  { id: "kubernetes", name: "Kubernetes", category: "Cloud & DevOps", level: 4, status: "gap", evidence: "Not yet assessed", confidence: 16, demand: 25, priority: 61, color: "#60a5fa" },
];

export const jobs: Job[] = [
  { id: "j1", role: "AI/ML Engineer", company: "Nexa Labs", initials: "NL", location: "Bangalore, India", mode: "Hybrid", salary: "₹8–12 LPA", posted: "2d ago", match: 89, skills: ["Python", "Machine Learning", "NLP", "SQL", "PyTorch"], missing: ["Docker", "AWS"], strong: ["Python", "Machine Learning", "NLP", "SQL"], description: "Build practical ML systems for high-growth product teams, from experimentation through deployment." },
  { id: "j2", role: "Machine Learning Intern", company: "Orbit Analytics", initials: "OA", location: "Hyderabad, India", mode: "Remote", salary: "₹35k–50k / mo", posted: "5h ago", match: 86, skills: ["Python", "Statistics", "SQL", "Pandas"], missing: ["Statistics depth"], strong: ["Python", "SQL", "Project evidence"], description: "Work alongside applied scientists on forecasting and customer intelligence workflows." },
  { id: "j3", role: "Data Scientist - Fresher", company: "Fintide", initials: "FT", location: "Pune, India", mode: "On-site", salary: "₹7–10 LPA", posted: "1d ago", match: 78, skills: ["Python", "Statistics", "SQL", "Machine Learning"], missing: ["Statistics", "AWS"], strong: ["Python", "Machine Learning"], description: "Join a small data science team focused on credit risk and responsible AI." },
  { id: "j4", role: "Applied NLP Engineer", company: "Lattice AI", initials: "LA", location: "Bangalore, India", mode: "Hybrid", salary: "₹10–15 LPA", posted: "4d ago", match: 74, skills: ["Python", "NLP", "PyTorch", "Docker"], missing: ["PyTorch", "Docker"], strong: ["Python", "NLP"], description: "Prototype language features that move from research notebooks into production products." },
  { id: "j5", role: "Software Engineer - Platform", company: "Quanta Systems", initials: "QS", location: "Chennai, India", mode: "Hybrid", salary: "₹9–13 LPA", posted: "6d ago", match: 71, skills: ["Python", "REST APIs", "Docker", "AWS"], missing: ["Docker", "AWS"], strong: ["Python", "REST APIs", "Git"], description: "Develop developer tooling and APIs for internal ML platform teams." },
  { id: "j6", role: "ML Platform Associate", company: "VectorForge", initials: "VF", location: "Remote / India", mode: "Remote", salary: "₹8–11 LPA", posted: "1w ago", match: 68, skills: ["Python", "Docker", "Kubernetes", "MLOps"], missing: ["Docker", "Kubernetes", "MLOps"], strong: ["Python"], description: "Learn the systems layer behind reliable model training and serving." },
];

export const assessmentQuestions = [
  { id: 1, skill: "Python", level: "Easy", prompt: "Which Python data structure preserves insertion order and stores key-value pairs?", options: ["set", "tuple", "dict", "deque"], answer: 2, explanation: "Dictionaries preserve insertion order in modern Python and map keys to values." },
  { id: 2, skill: "Python", level: "Medium", prompt: "What is the primary benefit of a generator expression?", options: ["It sorts values", "It evaluates lazily", "It copies an iterable", "It forces parallelism"], answer: 1, explanation: "Generators produce values lazily, which keeps memory use low for large sequences." },
  { id: 3, skill: "Machine Learning", level: "Medium", prompt: "A model has high training accuracy but poor validation accuracy. What is the most likely issue?", options: ["Underfitting", "Data leakage only", "Overfitting", "Low variance"], answer: 2, explanation: "The gap suggests the model has learned training-specific patterns that do not generalize." },
  { id: 4, skill: "Machine Learning", level: "Hard", prompt: "Which technique is most appropriate for reducing the impact of multicollinearity in linear regression?", options: ["Ridge regularization", "One-hot encoding", "Random oversampling", "Bagging"], answer: 0, explanation: "Ridge regularization stabilizes correlated coefficient estimates by shrinking them." },
  { id: 5, skill: "SQL", level: "Medium", prompt: "Which clause filters groups after aggregation?", options: ["WHERE", "ORDER BY", "HAVING", "LIMIT"], answer: 2, explanation: "HAVING filters the result of grouped or aggregated records." },
  { id: 6, skill: "Practical", level: "Hard", prompt: "You need to ship a reproducible inference API. Which addition creates the clearest path to environment consistency?", options: ["A larger notebook", "A Dockerfile", "A second README", "A spreadsheet"], answer: 1, explanation: "A Dockerfile captures the runtime environment and makes deployment behavior reproducible." },
];

export const roadmap = [
  { id: "stats", name: "Statistics for ML", status: "next", duration: "2 weeks", score: 89, why: "Your largest verified gap and a frequent requirement across your target roles.", resources: ["StatQuest: Probability & Statistics", "Khan Academy: Statistics"], project: "Build a confidence-interval dashboard for a public dataset." },
  { id: "pytorch", name: "PyTorch Fundamentals", status: "queued", duration: "3 weeks", score: 82, why: "Converts your strong ML fundamentals into the framework employers ask for in applied roles.", resources: ["PyTorch 60-Minute Blitz", "DeepLearning.AI labs"], project: "Train and serve an image classifier with experiment tracking." },
  { id: "docker", name: "Docker for ML", status: "queued", duration: "1 week", score: 94, why: "The highest opportunity gain for turning projects into deployable systems.", resources: ["Docker Getting Started", "Full Stack Deep Learning"], project: "Containerize your NLP API with a health-check endpoint." },
  { id: "aws", name: "AWS Foundations", status: "queued", duration: "2 weeks", score: 88, why: "Adds credible cloud exposure and unlocks more of the Bangalore job set.", resources: ["AWS Skill Builder", "AWS Well-Architected Labs"], project: "Deploy your containerized API with a managed service." },
  { id: "mlops", name: "MLOps Foundations", status: "queued", duration: "3 weeks", score: 76, why: "The compounding next step after Docker and AWS for production ML workflows.", resources: ["Made With ML", "MLOps.community"], project: "Create a lightweight model monitoring and retraining loop." },
];

export const marketDemand = [
  { name: "Python", value: 87 }, { name: "SQL", value: 71 }, { name: "Machine Learning", value: 68 }, { name: "PyTorch", value: 58 }, { name: "Docker", value: 46 }, { name: "AWS", value: 41 }, { name: "MLOps", value: 32 },
];

export const notifications = [
  { id: 1, icon: "spark", title: "Your next skill is ready", body: "Docker could unlock an estimated 16 more matches.", time: "Today" },
  { id: 2, icon: "trend", title: "Assessment milestone", body: "Python verification moved from 76% to 91%.", time: "Yesterday" },
  { id: 3, icon: "briefcase", title: "New strong match", body: "Nexa Labs added an AI/ML Engineer role at 89% match.", time: "2 days ago" },
];

export const navItems = [
  { id: "overview", label: "Overview", icon: "grid" },
  { id: "skills", label: "Skill profile", icon: "layers" },
  { id: "assessment", label: "Assessment", icon: "target" },
  { id: "jobs", label: "Job explorer", icon: "briefcase" },
  { id: "growth", label: "Growth plan", icon: "route" },
  { id: "analytics", label: "Analytics", icon: "chart" },
];
