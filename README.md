# SkillBridge AI

SkillBridge AI is an **Adaptive Career Intelligence & Skill Optimization Platform** for students, fresh graduates, and early-career professionals. It answers one practical question: **given what I know today and the opportunities I want tomorrow, what should I do next?**

The current repository contains a polished, responsive prototype built around one connected story:

> Resume → Evidence → Assessment → Intelligence → Opportunity → Improvement

The experience is designed for a recruiter walkthrough centered on a final-year B.Tech student, Aarav Mehta, targeting AI/ML Engineer roles in Bangalore. It is deliberately more than a resume analyzer or job board: the dashboard connects evidence-backed skills, adaptive verification, explainable job matching, prioritized gaps, a learning roadmap, and progress analytics.

## What is included

| Product area | Prototype behavior |
| --- | --- |
| Public entry | Premium landing page with product promise, workflow, core features, ethics messaging, and conversion CTAs |
| Authentication entry | Login/create-account modal with privacy-first copy and extension points for the repository’s supported session provider |
| Onboarding | Three-step profile context, career goal/location selection, and PDF/DOCX resume intake with a demo-resume path |
| Dashboard | Career Readiness estimate, evidence coverage, best role match, readiness drivers, priority signal, and trajectory |
| Skill Evidence Engine | Claim/support/verification states, proficiency, confidence, demand, evidence source, and career diagnosis |
| Adaptive assessment | Full/skill-specific start points, changing Easy → Medium → Hard difficulty, answer progression, practical questions, and results |
| Job explorer | Search, work-mode filter, realistic sample roles, match score, missing skills, strong matches, and explainable detail drawer |
| Growth plan | Skill Priority Engine, impact simulator, learning roadmap, and interactive dependency graph |
| Analytics | Readiness history, skill growth, jobs unlocked, roadmap progress, market demand visualization, and narrative insight |
| Profile and notifications | Candidate context, projects, certifications, notification read states, and preference controls |
| Assistant and evaluation | Profile-grounded deterministic assistant surface and transparent future AI-evaluation metrics page |

Simulated readiness, match, and opportunity values are clearly labeled as estimates. The prototype does not promise employment, interviews, salary, or selection outcomes.

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4 with custom CSS tokens |
| UI | Reusable local primitives plus Lucide icons |
| Existing server foundation | Express, tRPC 11, SuperJSON, Drizzle ORM, MySQL/TiDB schema |
| Existing auth foundation | Signed session support and optional Manus OAuth from the repository template |
| Validation | TypeScript, existing Vitest setup, browser walkthrough verification |

The new prototype UI is intentionally self-contained in `client/src/pages/Home.tsx` with reusable demo data in `client/src/lib/skillbridge-data.ts`. This keeps the recruiter demo deterministic while leaving the server foundation available for the next integration step.

## Run locally

Use Node.js 22 or a compatible current Node.js release and pnpm.

```bash
pnpm install
pnpm dev
```

The local development server serves the app at `http://localhost:3000/`. To create a production-style bundle:

```bash
pnpm build
pnpm start
```

Validation commands:

```bash
pnpm check       # TypeScript validation
pnpm test        # Existing Vitest suite
pnpm build       # Frontend and server production bundle
pnpm format      # Prettier formatting, when desired
```

No database or external AI credentials are required to explore the demo UI. The repository’s existing server routes continue to require their normal runtime configuration when used.

## Recruiter walkthrough

Open the landing page and choose **Analyze my career**. Create a demo account, complete the three onboarding steps, and choose **Use Aarav’s demo resume**. The dashboard then exposes the core story through the left navigation.

Start with **Skill profile** to review claimed versus supported versus assessment-verified evidence. Move to **Assessment**, begin the full assessment, choose an answer, and submit it to see the progression move from Python/Easy to Python/Medium. Continue through the questions to view the result breakdown. In **Job explorer**, search or filter roles and open a job to inspect why the candidate matches and why the score is not yet 100%. In **Growth plan**, switch between the Priority engine, Impact simulator, Learning roadmap, and Skill graph tabs. Finally, review **Analytics**, **Profile**, **Notifications**, **AI assistant**, and **AI evaluation**.

The completed demo state is stored in browser local storage so a refresh returns to the workspace. Use **Log out** in the sidebar to clear the demo state and return to the landing page.

## Project structure

```text
client/
  src/
    lib/skillbridge-data.ts       # Typed demo domain data and sample market data
    pages/Home.tsx                # Landing, auth/onboarding, dashboard, and major prototype surfaces
    index.css                    # SkillBridge design tokens, typography, focus, and motion rules
    App.tsx                      # Existing app shell and route entry
  index.html                     # SkillBridge metadata and browser title
drizzle/                         # Existing relational schema and migrations
server/                          # Existing Express/tRPC/auth foundation
verification-notes.md            # Browser walkthrough findings from local verification
```

## Future production architecture

The interface is organized around domain concepts that can be moved behind protected typed procedures without changing the page-level product language. The intended future pipeline is:

```text
Resume
  ↓
Text extraction
  ↓
Skill extraction and normalization
  ↓
Candidate skill vector
  ↓
Adaptive assessment
  ↓
Verified skill profile
  ↓
Job requirement extraction
  ↓
Embedding generation
  ↓
Semantic similarity
  ↓
Explainable match + skill gaps
  ↓
Priority and opportunity optimization
  ↓
Personalized roadmap
  ↓
Impact simulation and progress tracking
```

The current deterministic data layer should be replaced incrementally, not all at once. The first production integration points should be user-scoped profile and resume persistence, server-side file validation/storage, actual text extraction, normalized skill entities, adaptive assessment persistence, and live job ingestion. Embeddings, vector search, RAG retrieval, and LLM-generated explanations can then be introduced behind service interfaces once evaluation datasets and privacy requirements are ready.

## Data and security notes

The current UI uses demo data and local browser state for the walkthrough. It does not expose API keys or secrets in client source. For production, resume files should be uploaded through the server/storage boundary, validated for type and size, associated with the authenticated user, and never exposed through public paths. All profile, evidence, assessment, job-match, progress, and notification procedures should be protected and scoped to the current session. Confidence and recommendation language should remain calibrated and should not be presented as deterministic career decisions.

## Evaluation contract

The AI Evaluation page is intentionally a placeholder for real benchmark results. It includes the metric categories needed for skill extraction, semantic job matching, adaptive assessment, recommendation relevance, and RAG grounding, but shows **Pending** until model testing is complete. This prevents the product from fabricating precision, recall, NDCG, reliability, or grounding numbers.

## License

This project is released under the MIT License. See [LICENSE](./LICENSE).
