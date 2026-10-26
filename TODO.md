# Finora delivery criteria

- The public landing page presents FINORA, “Know your money. Control your future.”, CTA buttons, feature sections, security messaging and a polished footer.
- Authentication screens include login, sign up and forgot password; private workspace routes redirect unauthenticated visitors and logout returns to the landing page.
- The authenticated workspace provides dashboard, transactions, budgets, analytics, goals, AI insights, notifications and settings views with responsive desktop/mobile layouts, light/dark/system appearance, loading/empty states and toast feedback.
- Transactions support seeded sample data plus add, edit, delete, search, filter, sort and detail-ready rows with amount, category, description, date, payment method, notes and recurring state; income is supported as a distinct transaction type.
- Budgets show budget, spent, remaining and progress values with warnings at 75%, 90% and 100%, plus create, edit and delete actions.
- Analytics renders category, monthly, income-versus-expenses, savings-trend and daily-spending visualizations with time-range selection and derived KPIs.
- Goals support target/current amounts, target dates, progress, add-money actions and estimated completion timing.
- AI Insights provides spending insights, saving suggestions, budget warnings, unusual-spending detection and a monthly summary with “AI-generated insights are for informational purposes only and should not be considered financial advice.”
- MySQL is the primary data store through `DATABASE_URL` or `DRIZZLE_DATABASE_URL`; the Express API exposes `/api/health`, `/api/session`, `/api/bootstrap` and `/api/state`, initializes the additive schema, and localStorage is only a fallback.
- The production container builds the frontend, serves it and the API from one origin, honors `PORT`, and uses `/api/health` for readiness. TypeScript, build and local MySQL round-trip checks pass before publication.
