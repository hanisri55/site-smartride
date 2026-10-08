# FINORA — Implementation Plan

## Product approach
Finora will be a polished responsive personal-finance workspace built on the initialized React/TypeScript/Vite project. The first release will be immediately usable with a seeded demo account and browser persistence, while keeping the data layer typed and isolated around a single profile so the app can be connected to the managed relational database without redesigning the UI.

## Design direction
- **Design movement:** editorial fintech dashboard — calm, high-contrast surfaces with precise data density and a warm human tone.
- **Core principles:** signal over noise; actions are one tap away; numbers are explained, not merely displayed; every state feels intentional.
- **Color philosophy:** ink navy and soft cloud backgrounds create trust and clarity; mint is the ownable Finora signal color for positive cash flow; coral is reserved for warnings and expenses; violet is used sparingly for intelligence/insights.
- **Layout paradigm:** persistent rail navigation plus an offset, asymmetric content canvas; dashboards use a strong left narrative column and right-side evidence panels instead of a generic centered grid.
- **Signature elements:** mint “pulse” status dot, rounded ledger cards with thin dividers, and compact uppercase data labels.
- **Interaction philosophy:** progressive disclosure — overview first, then filtered details and editable drawers; destructive actions require confirmation; changes immediately update the summary.
- **Animation:** short ease-out entrances, hover elevation on actionable cards, and restrained progress-bar transitions. Respect reduced-motion preferences.
- **Typography:** Manrope for interface/body, Space Grotesk for display figures, and a compact mono label style for metadata.
- **Brand essence:** a confident money cockpit for people who want clarity without financial jargon. Personality: clear, optimistic, disciplined.
- **Brand voice:** direct, reassuring, practical. Example lines: “Your money has a pattern. Let’s make it work for you.” and “A better month starts with seeing this one clearly.”
- **Wordmark/logo:** FINORA wordmark paired with a circular F-mark built from a split arc, suggesting a balance ring and a forward path.
- **Signature brand color:** Finora Mint `#9BE7C1`.

## Implementation structure
- `client/src/App.tsx`: route-aware authenticated shell, landing/auth gates, modal/drawer orchestration.
- `client/src/pages/Home.tsx`: Finora product experience, dashboard, transactions, budgets, analytics, goals, insights, notifications and settings views.
- `client/src/index.css`: complete design system, responsive rail/mobile navigation, chart/card/table states and animation.
- `client/public/manus-routes.json`: canonical page route manifest.
- `app.config.ts`: project logo metadata.
- `server/`: preserve the existing Express/Vite serving foundation and current environment conventions.

## Functional scope
- Seeded demo profile and realistic income/expense/budget/goal/notification data.
- Local persistence for profile, theme, transactions, budgets, goals and notifications, keyed by the Finora demo account.
- Working add/edit/delete transaction flows, add income/expense forms, search/filter/sort, budget and goal updates, notification read state, theme persistence and logout.
- Derived totals, savings rate, budget usage, comparison copy, chart series and insight copy computed from current state.
- Landing page, sign in/sign up/forgot password screens and route guard behavior in the client shell.
- Loading/empty states and friendly toast feedback for actions.

## Serving and delivery
- Preview runs on the initialized Webdev runtime port 3000.
- `manus-routes.json` covers public and private pages.
- Build output is `dist`, with a self-contained pnpm/Vite build declaration prepared before publication.
- No frontend secrets; AI insights are deterministic, transparent summaries of user data with the required informational disclaimer.
