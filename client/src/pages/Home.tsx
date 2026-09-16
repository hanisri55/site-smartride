import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  Github,
  Globe2,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Network,
  ScanText,
  Send,
  Sparkles,
  Sun,
  X,
} from "lucide-react";

type Project = {
  id: string;
  index: string;
  name: string;
  kicker: string;
  description: string;
  tags: string[];
  flow: string[];
  icon: typeof Network;
  accent: string;
  details: { problem: string; solution: string; contribution: string };
};

const projects: Project[] = [
  {
    id: "skillbridge",
    index: "01",
    name: "SkillBridge AI",
    kicker: "Adaptive career intelligence",
    description: "A career intelligence platform that turns resume evidence and adaptive assessments into verified skills, focused learning paths, and better-fit opportunities.",
    tags: ["AI / ML", "NLP", "Recommendation systems"],
    flow: ["Resume", "Skill evidence", "Assessment", "Career readiness", "Job matching"],
    icon: Network,
    accent: "violet",
    details: {
      problem: "Early-career candidates often have scattered proof of ability, but no clear way to understand how that evidence maps to real roles.",
      solution: "SkillBridge connects resume signals, project evidence, and assessment performance into one explainable career profile.",
      contribution: "Product thinking, AI/ML workflow design, skill extraction concepts, and the full-stack experience.",
    },
  },
  {
    id: "smartride",
    index: "02",
    name: "SmartRide / RouteX",
    kicker: "Location-aware commute matching",
    description: "A smart ride-matching platform for students and daily commuters that connects people with overlapping routes, pickup points, and recurring travel patterns.",
    tags: ["React", "TypeScript", "Geolocation"],
    flow: ["Location", "Routes", "Matching", "Pickup", "Ride partner"],
    icon: Globe2,
    accent: "mint",
    details: {
      problem: "Finding a convenient ride partner is difficult when timing, route overlap, and pickup logistics all matter at once.",
      solution: "RouteX makes commute coordination more practical with location-aware matching and clear route context.",
      contribution: "Full-stack product development, interface architecture, matching flows, and authentication-ready UX.",
    },
  },
  {
    id: "medlingo",
    index: "03",
    name: "MedLingo AI",
    kicker: "Healthcare translation assistant",
    description: "An AI-assisted prescription companion that uses OCR and language models to explain medicines in patient-friendly, regional language.",
    tags: ["OCR", "Gemini AI", "Healthcare AI"],
    flow: ["Prescription", "OCR", "AI analysis", "Translation", "Clear result"],
    icon: ScanText,
    accent: "amber",
    details: {
      problem: "Medical instructions can be difficult to read and understand, especially across languages and levels of health literacy.",
      solution: "MedLingo turns prescription text into a simpler explanation while keeping the original information visible for context.",
      contribution: "Concept development, React/TypeScript interface, OCR pipeline thinking, and patient-centered interaction design.",
    },
  },
];

const skills = [
  ["Programming", "Python · C · Java · JavaScript · TypeScript", Code2],
  ["AI / ML", "Machine Learning · Deep Learning · NLP", Sparkles],
  ["Data", "NumPy · Pandas · Scikit-learn", Database],
  ["Build", "React · REST APIs · Git · GitHub", Network],
];

function ProjectVisual({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <div className={`project-visual ${project.accent}`} aria-hidden="true">
      <div className="visual-orbit orbit-one" />
      <div className="visual-orbit orbit-two" />
      <div className="visual-grid" />
      <div className="visual-center"><Icon size={28} strokeWidth={1.5} /></div>
      <div className="visual-flow">
        {project.flow.map((step, index) => <span key={step} className="flow-node"><b>0{index + 1}</b>{step}</span>)}
      </div>
      <span className="visual-label">{project.id}.system / live concept</span>
    </div>
  );
}

function Home() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", !dark);
  }, [dark]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="portfolio-shell">
      <header className="site-nav">
        <button className="wordmark" onClick={() => scrollTo("top")} aria-label="Back to top"><span>HB</span> / portfolio</button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <button onClick={() => scrollTo("work")}>Selected work</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
        </nav>
        <div className="nav-actions">
          <button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
          <a className="nav-cta" href="https://github.com/hanisri55" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
          <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <div className="hero-copy reveal">
            <div className="eyebrow"><span className="status-dot" /> Available for opportunities <span className="eyebrow-line" /></div>
            <p className="hero-kicker">AI/ML engineer <span>+</span> software engineer</p>
            <h1>Building intelligent systems <em>that solve real problems.</em></h1>
            <p className="hero-description">I’m Hani Burugupalli — a B.Tech graduate focused on practical AI-powered products, thoughtful software, and the space where intelligence meets everyday utility.</p>
            <div className="hero-actions"><button className="button button-primary" onClick={() => scrollTo("work")}>View my work <ArrowDownRight size={17} /></button><button className="button button-quiet" onClick={() => scrollTo("contact")}>Let’s connect <ArrowUpRight size={16} /></button></div>
            <div className="hero-meta"><span>Based in India</span><span>Open to building</span><span>2026</span></div>
          </div>
          <div className="hero-art reveal-delay" aria-hidden="true">
            <div className="art-corner">01 / 04</div><div className="art-word">BUILD<br /><i>with intent.</i></div>
            <div className="neural-map"><span className="node n1" /><span className="node n2" /><span className="node n3" /><span className="node n4" /><span className="node n5" /><span className="node n6" /><span className="connection c1" /><span className="connection c2" /><span className="connection c3" /><span className="connection c4" /><span className="connection c5" /></div>
            <div className="art-foot"><span>logic / empathy / iteration</span><span>scroll to explore ↓</span></div>
          </div>
        </section>

        <section className="signal-strip"><div className="section-wrap signal-inner"><span>Currently exploring</span><b>Applied machine learning</b><b>Human-centered products</b><b>Full-stack systems</b><span className="strip-mark">✦</span></div></section>

        <section id="work" className="section-wrap work-section"><div className="section-heading"><div><p className="eyebrow-number">01 / selected work</p><h2>Ideas, made <em>useful.</em></h2></div><p className="section-note">A selection of systems and interfaces built around one question: can technology make a complex problem feel clearer?</p></div>
          <div className="project-list">{projects.map((project) => <article className="project-row" key={project.id}><div className="project-index">{project.index}</div><ProjectVisual project={project} /><div className="project-info"><p className="project-kicker">{project.kicker}</p><h3>{project.name}</h3><p className="project-description">{project.description}</p><div className="tag-list">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button className="text-link" onClick={() => setSelected(project)}>Explore case study <ChevronRight size={15} /></button></div></article>)}</div>
        </section>

        <section id="about" className="about-section"><div className="section-wrap about-grid"><div><p className="eyebrow-number">02 / about me</p><h2>Curious by nature.<br /><em>Precise by practice.</em></h2></div><div className="about-copy"><p>I like working on problems that are bigger than a single screen. My approach blends AI/ML fundamentals with software engineering to turn messy inputs into products people can actually use.</p><p>As a fresher, I’m continuously learning — shipping projects, studying systems, and looking for the next opportunity to make something meaningful.</p><button className="text-link" onClick={() => scrollTo("contact")}>Start a conversation <ArrowUpRight size={15} /></button></div></div></section>

        <section className="section-wrap capabilities"><div className="section-heading compact"><div><p className="eyebrow-number">03 / toolkit</p><h2>Tools for <em>thinking.</em></h2></div><p className="section-note">The stack is a means to an end. I choose tools that keep the work useful, understandable, and ready to grow.</p></div><div className="skill-grid">{skills.map(([title, detail, Icon]) => { const SkillIcon = Icon as typeof Code2; return <div className="skill-item" key={title as string}><SkillIcon size={20} strokeWidth={1.5} /><div><h3>{title as string}</h3><p>{detail as string}</p></div></div>; })}</div></section>

        <section className="section-wrap credentials"><div className="credential-intro"><p className="eyebrow-number">04 / foundation</p><h2>Always learning.<br /><em>Never pretending.</em></h2><p>Grounded in a B.Tech in Computer Science Engineering — Artificial Intelligence & Machine Learning from SASI Institute of Technology and Engineering.</p></div><div className="credential-list"><div><span>Education</span><b>B.Tech · CSE (AI & ML)</b></div><div><span>Certifications</span><b>AWS GenAI · Responsible AI · Claude 101</b></div><div><span>Also</span><b>ICAT participant · NPTEL IoT</b></div></div></section>

        <section id="contact" className="contact-section"><div className="section-wrap contact-grid"><div><p className="eyebrow-number">05 / contact</p><h2>Let’s build something <em>intelligent.</em></h2><p className="contact-lede">Have a problem worth exploring, a team looking for a curious engineer, or just want to say hello?</p><div className="contact-links"><span className="contact-note"><Mail size={16} /> Email via the form</span><span className="contact-note"><Linkedin size={16} /> LinkedIn URL to be added</span><a href="https://github.com/hanisri55" target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a></div></div><form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><label>Name<input required placeholder="Your name" /></label><label>Email<input required type="email" placeholder="you@company.com" /></label><label>Message<textarea required rows={4} placeholder="Tell me a little about what you’re building..." /></label><button className="button button-primary" type="submit">{sent ? <><Check size={16} /> Message noted</> : <>Send message <Send size={15} /></>}</button>{sent && <small>This form is staged for future email integration. I’ll be glad to connect via email directly.</small>}</form></div></section>
      </main>

      <footer className="footer section-wrap"><span>© 2026 Hani Burugupalli</span><span>AI/ML Engineer <i>·</i> Software Engineer</span><span className="footer-mark">HB / end of page</span></footer>

      {selected && <div className="modal-backdrop" role="presentation" onClick={() => setSelected(null)}><div className="project-modal" role="dialog" aria-modal="true" aria-label={`${selected.name} case study`} onClick={(event) => event.stopPropagation()}><button className="modal-close icon-button" onClick={() => setSelected(null)} aria-label="Close case study"><X size={18} /></button><p className="eyebrow-number">{selected.index} / case study</p><h2>{selected.name}</h2><p className="modal-kicker">{selected.kicker}</p><div className="modal-flow">{selected.flow.map((step, index) => <span key={step}><b>0{index + 1}</b>{step}</span>)}</div><div className="modal-details"><div><span>Problem</span><p>{selected.details.problem}</p></div><div><span>Solution</span><p>{selected.details.solution}</p></div><div><span>My contribution</span><p>{selected.details.contribution}</p></div></div><a className="text-link" href="https://github.com/hanisri55" target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight size={15} /></a></div></div>}
    </div>
  );
}

export default Home;
