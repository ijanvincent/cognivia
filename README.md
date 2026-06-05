# CogniVia

CogniVia is a cross-platform learning system with a Laravel API, React web client, Expo mobile app, MySQL database, Nginx gateway, and Soketi-powered realtime messaging.

## System Overview

The repository is organized into four main areas:

| Path | Purpose |
| --- | --- |
| `backend/` | Laravel 12 API, authentication, admin/user routes, document parsing, flashcard generation, and realtime event broadcasting. |
| `frontend/` | React web application for public pages, user login/dashboard, and admin management screens. |
| `mobile/` | Expo React Native application for mobile learning workflows and cross-platform login approval. |
| `docker/` | Local infrastructure configuration for PHP, Nginx, frontend serving, and WebSocket proxying. |

## Core Architecture

CogniVia uses the backend as the system of record and exposes API routes under `/api`. The web and mobile clients authenticate with Laravel Sanctum tokens and identify their platform with the `X-Platform` header.

Main services:

- **Laravel API:** business logic, validation, authorization, token lifecycle, and broadcasting.
- **React Web:** user-facing web experience and admin dashboard.
- **Expo Mobile:** mobile client with secure local token storage.
- **MySQL:** relational persistence.
- **Nginx:** local gateway for API, frontend, and WebSocket routing.
- **Soketi:** Pusher-compatible WebSocket server used by Laravel Echo.

## Authentication Model

The system separates user and admin sessions:

- User tokens are stored under user-specific storage keys.
- Admin tokens are stored under admin-specific storage keys.
- Admin and user API routes use separate middleware and route groups.
- Platform checks prevent a token issued for one platform from silently acting as another platform.

## Cross-Platform Login Approval

CogniVia supports a controlled login handoff between web and mobile.

When a user is already signed in on one platform and tries to sign in on the other:

1. The backend creates a short-lived `PendingLogin` record.
2. The active platform receives a sign-in approval request.
3. The active platform can allow or deny the request.
4. The requesting platform waits for approval.
5. If approved, the requesting platform consumes the approved request and receives its own session token.

The flow uses both realtime events and HTTP polling fallbacks:

- Realtime events provide fast user feedback when WebSocket delivery works.
- Polling fallbacks keep the flow reliable through tunnels, mobile networks, and browser state changes.
- Approval tokens are high-entropy, stored only as hashes in the database, and consumed as single-use records.

Relevant backend pieces:

- `PendingLogin` model and migration
- `LoginApprovalController`
- `NewLoginRequest`, `LoginApproved`, and `LoginDenied` events
- `AuthService` approval and status methods

## Local Development

### Backend infrastructure

Start the Docker services:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Common service endpoints:

- Nginx gateway: `http://localhost:3000`
- MySQL host port: `3307`
- Soketi WebSocket port: `6001`
- Soketi metrics port: `9601`

Run Laravel commands inside the backend container:

```bash
docker exec cognivia_backend php artisan migrate
docker exec cognivia_backend php artisan optimize:clear
docker exec cognivia_backend php artisan route:list
```

### Web app

From `frontend/`:

```bash
npm install
npm start
```

### Mobile app

From `mobile/`:

```bash
npm install
npx expo start --tunnel --clear
```

Use the Expo QR code to test on a physical device.

## Configuration Notes

Use `.env` files for local configuration. Do not commit real credentials, production tokens, API keys, database passwords, or tunnel URLs.

Important environment areas:

- Database connection settings
- Sanctum/session configuration
- Pusher/Soketi app ID, key, and secret
- Frontend API base URL
- Mobile API base URL

## Security Principles

This project should be maintained with production-grade security practices:

- Validate all client input at the backend boundary.
- Keep credentials and secrets out of source control.
- Use least-privilege tokens and platform-aware authorization.
- Store approval tokens as hashes, not plaintext.
- Keep login approval records short-lived and single-use.
- Treat realtime messages as convenience signals; use authenticated HTTPS endpoints for authoritative state changes.

## Verification Checklist

Before merging authentication or realtime changes:

```bash
docker exec cognivia_backend php -l routes/api.php
docker exec cognivia_backend php -l app/Services/Auth/AuthService.php
docker exec cognivia_backend php artisan route:list
```

Recommended manual checks:

- User login on web.
- User login on mobile.
- Admin login.
- Web active, mobile requests login, web approves.
- Mobile active, web requests login, mobile approves.
- Deny flow clears without requiring browser refresh.

