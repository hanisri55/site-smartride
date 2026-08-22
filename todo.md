# Project TODO

- [x] Review the attached product requirements and convert them into concrete user flows and domain records
- [x] Establish an elegant, responsive visual system with distinctive typography, palette, spacing, and motion
- [x] Implement the primary frontend flow with responsive navigation and session-aware states
- [x] Add polished loading, empty, error, and success states for the core experience
- [x] Add persistent database schema and typed data-access helpers for the product's core records
- [x] Add protected tRPC procedures for application data and actions
- [x] Enforce authenticated access for protected functionality and preserve secure session behavior
- [x] Wire the frontend to the tRPC backend with typed queries and mutations
- [x] Add Vitest coverage for core backend behavior and authorization boundaries
- [x] Run type checks, tests, and build validation
- [x] Verify desktop and mobile layouts with rendered screenshots
- [x] Save the final project checkpoint for delivery

## Change history

- Initial product requirements received: responsive polished frontend, secure auth, tRPC API, persistent database, and elegant visual direction.

## SASI SmartRide requirements

- [x] Build the SmartRide home experience with mobility forecast, popular routes, Smart Pools, impact summary, and primary calls to action
- [x] Add route directory, route search/filtering, route detail timeline, and centralized SASI route data
- [x] Add Find flow for route and Smart Pool matching using route search and route-type filtering; deeper proximity ranking remains
- [x] Add Create flow for rides and Smart Pools with backend validation and persistence
- [x] Add Smart Pool join, leave, cancel, and capacity protection behavior
- [x] Add My Rides tabs and creator/member permissions for edit, cancel, and leave actions
- [x] Add editable profile fields, route preferences, and profile image metadata
- [x] Add notifications and read-state behavior
- [x] Add sustainability impact calculations and command center metrics
- [x] Add responsive desktop/mobile navigation and reduced-motion-aware mobility background
- [x] Add friendly auth-aware onboarding and protected app access states

## Multi-user authentication and repository hardening

- [x] Implement separate account signup with name, email, password, and profile details
- [x] Implement secure login, logout, persistent sessions, and protected application access
- [x] Ensure all SmartRide records and notifications are isolated by authenticated user
- [x] Show a clean empty state when no students are registered; do not seed fake people
- [ ] Add README.md, MIT LICENSE, proper .gitignore, and secret-safe .env.example (README.md, LICENSE, and .gitignore complete; .env.example is blocked by managed workspace environment-file protection)
- [x] Test signup → login → profile → logout → login again and verify persistent user data
- [ ] Save the updated project checkpoint for delivery

## Auth verification fixes

- [x] Clear authenticated query caches and leave protected views immediately on logout
- [x] Verify two separate accounts cannot see each other's profile, rides, pools, and notifications (ownership filters verified in protected procedures; distinct safe account identities covered by automated auth contract test; temporary browser data removed)
- [x] Mark the final checkpoint complete only after the auth leak fixes pass validation
