# FINORA — Smart Personal Finance

Finora is a premium personal-finance workspace for tracking spending, understanding patterns, setting budgets, and staying close to long-term goals.

## Stack

React 19, TypeScript, Vite, Recharts, Lucide React and a browser-persistent typed demo data layer. The project is configured for the Manus Webdev runtime on port 3000 and can be connected to a relational database/API layer without changing the product surface.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Build

```bash
pnpm check
pnpm build
```

## Environment variables

No environment variables are required for the demo workspace. When replacing the browser persistence layer with a production API, keep private credentials server-side and provide the API base URL through the deployment environment rather than embedding secrets in frontend code.

## Main features

- Premium landing page and responsive fintech dashboard
- Login, sign-up and password-reset experience with a demo workspace
- Expense and income tracking with add/edit/delete, search, filtering and sorting
- Budgets with progress, remaining amounts and threshold warnings
- Analytics charts for cash flow, categories, daily spend and savings
- AI-style financial insights with informational-use disclaimer
- Goals with progress, contributions and completion estimates
- Notifications, profile, preferences, theme and logout controls
- Light/dark mode and browser persistence for demo data

## Demo account

Use any valid email and password with the sign-in form, or choose **Explore dashboard** on the landing page. The experience seeds the dashboard with realistic INR transactions so the charts and summaries are useful immediately.
