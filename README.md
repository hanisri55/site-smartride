# SITE SmartRide

SITE SmartRide is a full-stack campus mobility network for discovering routes, coordinating Smart Pools, sharing rides, and measuring collective sustainability impact. The application is designed around real, user-owned data: each student has an independent account, profile, rides, pool memberships, and notifications.

## Features

- Separate email/password accounts with salted server-side password hashing.
- Persistent signed HTTP-only sessions, protected application views, login, logout, and optional Manus OAuth.
- Route discovery across the SITE route catalog with route search, route details, and filters.
- Smart Pool creation, joining, leaving, capacity protection, and membership management.
- Ride creation, discovery, deterministic match scoring, request, accept, reject, cancel, and notification flows.
- Profile editing for college, course, year, phone, city, route, pickup point, preferences, and profile metadata.
- Notification unread states, mark-read, and mark-all-read behavior.
- Impact summaries and command-center metrics backed by persisted application data.
- Responsive SITE SmartRide interface with a reduced-motion-aware campus mobility background.
- No seeded demo users or fabricated student reviews, ratings, testimonials, or user records.

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, shadcn/ui components |
| API and server | Express, tRPC 11, SuperJSON |
| Persistence | MySQL/TiDB, Drizzle ORM, SQL migrations |
| Authentication | Signed HTTP-only session cookie, email/password accounts, optional Manus OAuth |
| Testing | Vitest, TypeScript checks, production build validation |
| Email integration | Resend, server-side only and gated until a verified sender is configured |

## Installation

Use Node.js 22 or a compatible current Node.js release and pnpm.

```bash
pnpm install
cp .env.example .env
```

Set `DATABASE_URL` and `JWT_SECRET` in `.env` before using account features. Never commit `.env` or any real credentials. The managed Manus project injects its configured production values through the runtime environment.

If database migrations are required for a local database, generate the migration files and apply them using your normal Drizzle workflow:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## Running the application

The development command starts the Express backend and Vite frontend together. The server owns the tRPC API and serves the frontend through the Vite bridge.

```bash
pnpm dev
```

For a production-style local run, build both the frontend and backend, then start the bundled server:

```bash
pnpm build
pnpm start
```

Useful validation commands:

```bash
pnpm check       # TypeScript validation
pnpm test        # Vitest suite
pnpm build       # Production frontend and server build
pnpm format      # Prettier formatting
```

## Environment variables

Copy `.env.example` to `.env` and replace placeholders only in your local environment.

| Variable | Purpose | Scope |
| --- | --- | --- |
| `DATABASE_URL` | MySQL/TiDB connection string | Server |
| `JWT_SECRET` | Session signing secret | Server |
| `VITE_APP_ID` | Manus OAuth application identifier | Frontend/server configuration |
| `OAUTH_SERVER_URL` | Manus OAuth service URL | Server |
| `VITE_OAUTH_PORTAL_URL` | Manus OAuth login portal | Frontend |
| `RESEND_API_KEY` | Resend API credential for approved email flows | Server only |
| `RESEND_FROM_EMAIL` | Verified sender used for email flows | Server only |
| `BUILT_IN_FORGE_API_URL` | Built-in Manus API endpoint | Server |
| `BUILT_IN_FORGE_API_KEY` | Built-in Manus server credential | Server only |
| `VITE_FRONTEND_FORGE_API_URL` | Built-in Manus frontend endpoint | Frontend |
| `VITE_FRONTEND_FORGE_API_KEY` | Built-in Manus frontend credential | Frontend configuration |

The Forgot Password interface remains intentionally gated until Resend has a verified sending domain and sender. `onboarding@resend.dev` is restricted to permitted Resend test-sender scenarios and is not a production sender for arbitrary registered users.

## Account and data model

Account creation accepts a student's name, email, password, and optional college, course, city, and pickup-point details. Login creates a persistent signed session. Every protected query and mutation resolves the current account from that session and scopes profile, ride, Smart Pool, membership, and notification data to that user. No demo users or fake student records are seeded.

## Security

Do not commit `.env` files, database credentials, API keys, session secrets, or password values. Password authentication uses server-side salted hashing and constant-time comparison. Session cookies are HTTP-only and use secure runtime settings. Keep Resend and other server credentials out of frontend source code.

## License

This project is released under the MIT License. See [LICENSE](./LICENSE).
