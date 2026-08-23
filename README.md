# SASI SmartRide

SASI SmartRide is a full-stack campus mobility network for discovering routes, coordinating Smart Pools, sharing rides, and measuring collective sustainability impact. The application is designed around real, user-owned data: each student has an independent account, profile, rides, pool memberships, and notifications.

## Product capabilities

The existing SmartRide experience includes route discovery across the SASI route catalog, route detail timelines, Smart Pool creation and membership, ride publishing and management, impact summaries, a mobility command center, profile preferences, and notification read states. Protected actions are available only to authenticated users.

Authentication supports separate email/password accounts with persistent, signed sessions. Passwords are never stored in plaintext; the server stores a salted scrypt-derived password hash. The project also preserves the existing Manus OAuth integration as an optional authentication path for environments that use it.

## Technology

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS 4, shadcn/ui components |
| API | Express, tRPC 11, SuperJSON |
| Persistence | MySQL/TiDB, Drizzle ORM, SQL migrations |
| Authentication | Signed HTTP-only session cookie, email/password accounts, optional Manus OAuth |
| Testing | Vitest, TypeScript checks, production build validation |

## Running locally

Use Node.js 22 or a compatible current Node.js release and pnpm.

```bash
pnpm install
cp .env.example .env
pnpm drizzle-kit generate
pnpm dev
```

Set `DATABASE_URL` and `JWT_SECRET` in the local environment before using account features. The managed Manus project injects its production values automatically; never commit `.env` files or real credentials.

Useful commands:

```bash
pnpm check       # TypeScript validation
pnpm test        # Vitest suite
pnpm build       # Production frontend and server build
pnpm format      # Prettier formatting
```

## Account and data model

Account creation accepts a student's name, email, password, and optional college, course, city, and pickup-point details. Login creates a persistent signed session. Every protected query and mutation resolves the current account from that session and scopes profile, ride, Smart Pool, membership, and notification data to that user. No demo users or fake student records are seeded.

## Security notes

Do not commit `.env`, database credentials, API keys, session secrets, or password values. Password authentication uses server-side hashing and constant-time comparison. Session cookies are HTTP-only and use the secure cookie settings provided by the application runtime.

## License

This project is released under the MIT License. See [LICENSE](./LICENSE).

## Password recovery email configuration

The SmartRide Forgot Password interface is staged but remains intentionally gated until production email delivery is configured. The server-side Resend credential has been validated successfully, and `onboarding@resend.dev` is configured only as a test sender. Resend test-sender usage must remain limited to permitted test recipients; it is not a production sender for arbitrary registered users.

To enable real password-reset emails, verify a domain in Resend, create a sender address on that domain (for example `SmartRide <no-reply@yourdomain.com>`), and update the server-side `RESEND_FROM_EMAIL` secret. Keep `RESEND_API_KEY` server-side only. Until that verified sender is configured, the application does not send password-reset messages and does not claim that account recovery is active.
