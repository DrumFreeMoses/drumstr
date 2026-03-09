# CONTRIBUTING — Local Development Setup

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20 LTS | https://nodejs.org or `nvm install 20` |
| pnpm | 9+ | `npm install -g pnpm` |
| Docker Desktop | Latest | https://docs.docker.com/desktop/ |
| Git | Any | https://git-scm.com |

## Initial Setup

```bash
# 1. Clone the repo
git clone https://git.shakespeare.diy/npub1rkncyukv5fpyrf4c3tes26rfkhd529jvq3sdp4kgd2ll69tklwusw9rfhq/drumstr.git
cd drumstr

# 2. Install dependencies (once monorepo is initialized)
pnpm install

# 3. Copy environment files
cp packages/api/.env.example packages/api/.env
cp apps/web/.env.example apps/web/.env.local

# 4. Start local services via Docker
docker compose -f infra/compose/docker-compose.dev.yml up -d

# 5. Run database migrations
pnpm --filter api prisma migrate dev

# 6. Start all packages in dev mode
pnpm dev
```

## Environment Variables

### packages/api/.env
```bash
DATABASE_URL=postgresql://drumstr:drumstr@localhost:5432/drumstr
JWT_SECRET=local-dev-secret-at-least-32-chars-long
NOSTR_RELAY_URL=ws://localhost:7777
FIREBASE_SERVICE_ACCOUNT={}   # leave empty for local dev (notifications disabled)
HIVETALK_API_URL=http://localhost:3030
MDK_WEBHOOK_SECRET=local-webhook-secret
```

### apps/web/.env.local
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL=http://localhost:3001
MDK_ACCESS_TOKEN=          # optional for local dev (payments disabled)
MDK_MNEMONIC=              # optional for local dev
ADMIN_NPUB=                # your local test npub
```

## Local Services (Docker)

| Service | Port | Description |
|---|---|---|
| PostgreSQL | 5432 | Database |
| nostr-rs-relay | 7777 | Local Nostr relay (ws://localhost:7777) |
| API | 3001 | Node.js/Express backend |
| Web | 3000 | Next.js web app |

## Running Tests

```bash
# All packages
pnpm test

# Single package
pnpm --filter api test
pnpm --filter shared test

# Watch mode
pnpm --filter api test:watch
```

## Code Conventions

- TypeScript strict mode everywhere
- TDD: write tests before implementation
- Commit messages: `type(scope): description` (e.g. `feat(api): add drum call endpoint`)
- No `any` types — use `unknown` and narrow
- Run `pnpm lint` before committing

## Repo Structure

```
apps/
  mobile/     Expo React Native (iOS + Android)
  web/        Next.js (web app + MoneyDevKit checkout host)
packages/
  api/        Node.js/Express REST API
  shared/     Shared types, timing utilities, constants
  nostr/      Nostr client utilities (keypairs, relay, NIPs)
infra/
  docker/     Dockerfiles
  compose/    docker-compose files (dev + prod)
  scripts/    VPS bootstrap + deploy scripts
  nginx/      Reverse proxy config
docs/
  specs/      Architecture and implementation specs (authoritative)
```

## Spec-First Development

All implementation follows a spec in `docs/specs/`. Before writing code for any feature:
1. Read the relevant spec completely
2. Check §7 (Unresolved Issues) for blockers
3. Follow §6 (Next Steps) in order
4. Write tests first (TDD red/green/refactor)

See `docs/specs/DRUMSTR-MASTER-SPEC.md` for the full system overview.
