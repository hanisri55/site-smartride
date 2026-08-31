# SkillBridge AI browser verification notes

- Local app loads at `http://localhost:3000/` with the updated title `SkillBridge AI — Career Intelligence`.
- Landing page renders with the intended premium light SaaS visual system, indigo/mint palette, readable hero hierarchy, visible primary CTA, workflow sections, feature grid, ethics messaging, and footer.
- Primary CTA opens the auth modal with login/create account tabs, email/name/password fields, and a working create-profile action.
- Auth continue opens the three-step onboarding flow with profile fields, role cards, location select, and resume/demo-resume step.
- Demo resume action opens the authenticated dashboard state with sidebar navigation, readiness score, evidence cards, best match, and trajectory content.
- Interactive dashboard navigation is present. Browser click index shifted during verification and opened Assessment from the left nav instead of Skill profile, but the assessment page rendered successfully.
- Assessment page shows adaptive assessment hero, full and skill-specific choices, latest verification cards, and has clickable assessment choices.

- Full assessment starts from a dedicated, non-quiz hero and renders question 1 with Python/Easy metadata, answer options, and disabled-submit behavior until an option is chosen.
- Selecting the correct `dict` answer and submitting advanced to question 2, which changed to Python/Medium and updated the progress bar, confirming the adaptive state transition.

- Job explorer rendered six realistic sample roles with search input, work-mode select, match percentages, strong-skill chips, and missing-skill chips.
- Opening the Nexa Labs role revealed a working detail drawer with 89% estimate, role metadata, salary, match rationale, missing Docker/AWS evidence, Save role, View original, and non-guarantee disclosure.

- Analytics page rendered with readiness, completed skills, jobs unlocked, roadmap progress cards, a rising readiness chart, progress insight narrative, and clearly labeled sample market-demand bars.

- Growth plan opened with four working tabs: Priority engine, Impact simulator, Learning roadmap, and Skill graph. The priority view ranked Docker 94, AWS 88, PyTorch 82, MLOps 76, and Kubernetes 61 with rationale.
- Impact simulator started at 72 readiness and 42 estimated opportunities. Selecting Docker updated the visible scenario to 78 readiness and 58 opportunities, confirming live interaction and the estimate disclaimer.

- The full assessment completed through six questions spanning Python, Machine Learning, SQL, and a practical deployment decision. The UI visibly progressed Python/Easy → Python/Medium → ML/Medium → ML/Hard → SQL/Medium → Practical/Hard.
- Completing the final question rendered a detailed results report with 100 assessment score, “Assessment complete” state, performance-by-level bars, adaptive-path explanation, profile changes, and a working “Take another assessment” action.

- Learning roadmap rendered five ordered stages from Statistics for ML through MLOps, with recommended/queued states, durations, rationale, mini-project/assessment/resource chips, and a working completion-toggle control on each stage.

- Skill graph rendered connected learning nodes from Python through ML, PyTorch, Docker, AWS, and MLOps, with Docker selected and prerequisite/next-layer/current-proficiency details.
- AI assistant rendered as a secondary profile-grounded surface with suggested questions, grounding context cards, deterministic response disclosure, and an input for asking about next steps.

- Profile page rendered candidate identity, target trajectory, location/role context, export action, editable-profile action, education, experience, project, and certification evidence sections.
- Notifications page rendered three useful updates with mark-read/mark-all-read controls plus notification-preference checkboxes for reminders, milestones, matches, recommendations, and roadmap updates.
