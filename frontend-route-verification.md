# SkillBridge AI Frontend Route Verification

## Initial walkthrough

- Public landing page loaded at `/` with visible hero CTA, navigation anchors, feature narrative, product metrics, and footer.
- Primary **Analyze my career** CTA navigated to `/register` and opened the registration modal.
- Registration action navigated to `/onboarding`.
- Onboarding step 1 rendered profile context fields and continued to step 2.
- Onboarding step 2 rendered selectable target roles, a location selector, and continued to step 3.
- Onboarding step 3 rendered resume upload affordances, a demo-resume path, and completed into `/dashboard`.
- Dashboard rendered the authenticated shell, readiness score, next-skill recommendation, evidence cards, role match, and progress history.

## Current status

The initial public-to-authenticated path is working. Continue verifying the sidebar workspace routes, direct named routes, assessment progression, simulator controls, roadmap toggles, notifications, assistant, and evaluation states.

## Workspace route checks

The sidebar Assessment route loaded `/assessment` and rendered both full and skill-specific assessment choices. The Skill profile route loaded `/skills` and rendered the evidence engine, verification queue, filters, twelve tracked skills, evidence details, and career diagnosis. The initial sidebar click test exposed an index-selection issue in the test harness rather than an application defect; using the correct control opened `/skills` successfully.

## Growth route checks

The direct `/roadmap` route loaded the Growth plan with Priority engine, Impact simulator, Learning roadmap, and Skill graph tabs. The Impact simulator tab rendered scenario controls with Reset, Docker, AWS, MLOps, and PyTorch options. Selecting Docker changed the readiness estimate from 72 to 78 and suitable jobs from 42 to 60, confirming the interactive calculation updates the output state.

## Additional workspace route checks

The direct `/analytics` route rendered readiness metrics, a trend chart, progress insight, and clearly labeled sample market data. The `/jobs` route rendered search, work-mode filtering, six opportunity cards, and an explainable detail drawer for the first result. The `/assistant` route rendered prompt suggestions and selecting “What should I learn next?” added the expected profile-grounded Docker response. The `/notifications` route rendered three updates, preference checkboxes, and the Mark all read action visibly reduced notification emphasis.
