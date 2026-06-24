# Contributing to CogniVia

Thank you for taking the time to contribute. This guide explains how to get a development environment running, the conventions
we follow, and how to get your change reviewed and merged. It complements the
[README](README.md) (project overview, architecture, full command reference),
[DEPLOYMENT.md](DEPLOYMENT.md) (hosting), and [SCALING.md](SCALING.md)
(production-readiness roadmap).

If anything here is unclear or out of date, that itself is a worthwhile PR.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Reporting Bugs & Requesting Features](#reporting-bugs--requesting-features)
- [Development Setup](#development-setup)
- [Branching Model](#branching-model)
- [Commit Conventions](#commit-conventions)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Security Disclosures](#security-disclosures)

## Code of Conduct

Be respectful, assume good intent, and keep discussion focused on the work.
Harassment or discrimination of any kind isn't tolerated. By participating you
agree to uphold a welcoming, professional environment for everyone.

## Ways to Contribute

- **Report a bug** or **suggest a feature** by opening an issue.
- **Improve documentation** — fixes to the README, this guide, or inline docs are always welcome and a good first contribution.
- **Submit code** — pick up an open issue (comment so others know you are on it) or propose a change.

If your change is large or architectural, **open an issue to discuss it first** so
we can agree on the approach before you invest significant time.

## Reporting Bugs & Requesting Features

Open a [GitHub issue](https://github.com/ijanvincent/cognivia/issues). A good bug
report includes:

- **What happened** vs. **what you expected**.
- **Steps to reproduce** (the smaller and more deterministic, the better).
- **Environment** — platform (web/mobile), OS, browser/device, and relevant versions.
- **Evidence** — error messages, logs, or screenshots. Redact any secrets/tokens.

For features, describe the **problem** you're trying to solve, not just the
solution — it helps us find the best fit for the codebase.

## Development Setup

Get a local environment running with Docker Compose. The [README](README.md)
carries a condensed Quick Start; the full steps are below.

**Prerequisites:** Docker and Docker Compose, Node.js 18+, and the Expo Go app
(for the mobile client).

```bash
# 1. Clone and configure
git clone https://github.com/ijanvincent/cognivia.git
cd cognivia
cp backend/.env.example backend/.env

# 2. Start the backend stack (PHP-FPM, Nginx, MySQL, Soketi)
docker compose up -d
docker exec cognivia_backend php artisan key:generate
docker exec cognivia_backend php artisan migrate --seed
docker exec cognivia_backend php artisan storage:link

# 3. Web client (dev server on :3001; app served via the gateway on :3000)
cd frontend && npm install && npm start

# 4. Mobile client (optional)
cd mobile && npm install && npx expo start --tunnel --clear
```

> **Never commit secrets.** Every `.env` is gitignored — only the `.env.example`
> templates are tracked. Don't add real keys, tokens, or tunnel URLs to the repo.

## Branching Model

`main` is protected and release-ready — **it never receives direct commits.** A
GitHub ruleset enforces pull requests, blocks force-pushes/deletions, and keeps
history linear; local git hooks catch accidental direct commits before they reach
the remote.

All work happens on a short-lived feature branch, named `type/short-description`:

| Prefix | Use for |
|---|---|
| `feature/` | new functionality |
| `fix/` | bug fixes |
| `docs/` | documentation only |
| `refactor/` | code changes with no behavior change |
| `test/` | adding or fixing tests |
| `chore/` | tooling, deps, config |

Examples: `feature/deck-export`, `fix/login-race`, `docs/contributing-guide`.

Always branch from an up-to-date `main`, and sync with `main` before opening your
PR so conflicts are resolved on your branch — never on `main`:

```bash
git switch main && git pull origin main
git switch -c feature/my-change
```

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/). The subject
line is `type(scope): summary`, written in the imperative mood:

```
feat(flashcards): add CSV export for decks
fix(auth): reject tokens used on the wrong platform
docs(readme): clarify mobile setup steps
```

- **Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`.
- **Keep the subject short** (≤ ~72 chars). Add a brief body only when the *why*
  isn't obvious from the subject — put the full reasoning in the PR description.
- Make each commit a logical, self-contained unit; avoid "wip"/"fixup" noise.

## Coding Standards

**General**
- Write code as if it will be reviewed in a production PR — clear names, no dead
  code, no magic numbers, no commented-out blocks.
- Validate all client input at the API boundary; never trust client-side checks.
- Keep the AI provider key and all secrets server-side only.

**Backend (Laravel / PHP 8.4)**
- Follow **PSR-12**, enforced by **Laravel Pint** — run `./vendor/bin/pint`
  before committing.
- Respect the **Controller, Service, Repository** layering: controllers stay
  thin, business logic lives in services, persistence in repositories.
- Put request validation in **Form Request** classes (`app/Http/Requests/`), not
  in the service layer.
- Treat real-time events as signals only — always reconcile authoritative state
  over an authenticated HTTP endpoint.

**Web (React 18) & Mobile (Expo / React Native)**
- Functional components and hooks only — no class components.
- Keep user and admin token storage in their separate namespaces.
- Every authenticated request sends the `X-Platform` header (`web` / `mobile`).

## Testing

Add or update tests for any behavior you change, and make sure the suite is green
before opening a PR:

```bash
docker exec cognivia_backend php artisan test                  # full suite
docker exec cognivia_backend php artisan test --filter MyTest  # a single test
docker exec cognivia_backend ./vendor/bin/pint                 # format / lint (PSR-12)
docker exec cognivia_backend php -l <file>                     # syntax-check one file
```

- Backend tests run on **PHPUnit** via `php artisan test`.
- Prefer fast, isolated tests (use `Http::fake()`, `Event::fake()`, etc. instead
  of hitting real services or spending AI quota).

## Pull Request Process

1. **Sync** your branch with the latest `main` and resolve any conflicts locally.
2. **Run** the suite and Pint — both must pass.
3. **Open the PR** into `main` with a clear description: *what* changed, *why*,
   and how you verified it. Link any related issue (e.g. `Closes #123`).
4. **Fill out the PR template** (it prompts for the checklist below).
5. A maintainer reviews; address feedback by pushing follow-up commits to the
   same branch. Squash-merge is used to keep history linear.

For **authentication or real-time** changes, also run these checks before
opening the PR:

```bash
docker exec cognivia_backend php -l routes/api.php
docker exec cognivia_backend php -l app/Services/Auth/AuthService.php
docker exec cognivia_backend php artisan route:list
```

## Security Disclosures

**Please do not open public issues for security vulnerabilities.** Instead, report
them privately via GitHub's [private vulnerability reporting](https://github.com/ijanvincent/cognivia/security/advisories/new),
or contact the maintainer directly. We'll acknowledge your report and work on a
fix before any public disclosure. Responsible disclosure is genuinely appreciated.

---

Thank you for contributing to CogniVia.
</content>
