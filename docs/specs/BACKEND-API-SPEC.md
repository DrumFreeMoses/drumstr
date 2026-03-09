---
Note-type: spec
status: Backlog
tags:
  - drumstr
  - backend
  - api
  - nodejs
  - postgresql
creation: 2026-03-07
modified: 2026-03-07
---

## AI Agent Rules
1. Do not change structure or delete sections — only add content.
2. TDD (red/green/refactor). MCP-first, jsonrpc 2.0. Maintain config guide.
3. Favor reusable Express middleware and shared validation schemas.
4. Simple REST over complex GraphQL for v1. Consult human before adding abstractions.
5. If a route handler exceeds ~50 lines, extract business logic to a service layer.
6. Make decisions for longevity. Keep the API stateless; state belongs in the DB.

---

# BACKEND-API-SPEC — Node.js / Express / TypeScript REST API

## 1. Project Details

| Field | Value |
|---|---|
| Spec | BACKEND-API-SPEC |
| Package | packages/api |
| Depends On | INFRA-SPEC (VPS + PostgreSQL provisioned) |
| Blocks | MOBILE-APP-SPEC, WEB-APP-SPEC, EVENT-MGMT-SPEC, MONEYDEVKIT-SPEC |
| Runtime | Node.js 20 LTS, TypeScript |
| Framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL 16 |

## 2. End Goal

A clean, stateless REST API serving both the mobile app and web app. Handles user identity (Nostr-backed JWT auth), event CRUD, facilitator management, and payment webhooks. Acts as the orchestration hub connecting PostgreSQL, Nostr relay, HiveTalk, MoneyDevKit, and Firebase.

## 3. Current Implementation Details

Repository initialized at `~/repos/drumstr`. Package location: `packages/api/` — directory does not yet exist (scaffold pending).

**Repo current state:**
```
~/repos/drumstr/
├── apps/web/              ← placeholder
├── packages/shared/       ← placeholder
├── docs/specs/            ← all specs seeded (2026-03-09)
└── README.md
```
`packages/api/` not yet created.

## 4. Updated Implementation Details

```
packages/api/
├── src/
│   ├── app.ts                    # Express app initialization
│   ├── server.ts                 # Entry point (listen on port)
│   ├── config.ts                 # Environment variable validation (zod)
│   ├── routes/
│   │   ├── index.ts              # Route aggregator
│   │   ├── auth.routes.ts        # POST /auth/challenge, POST /auth/verify
│   │   ├── users.routes.ts       # GET/PUT /users/:npub
│   │   ├── events.routes.ts      # CRUD /events
│   │   ├── facilitators.routes.ts # GET /facilitators, PUT /facilitators/availability
│   │   └── webhooks.routes.ts    # POST /webhooks/moneydevkit
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── error.middleware.ts   # Centralized error handler
│   │   └── validate.middleware.ts # Zod request validation
│   ├── services/
│   │   ├── auth.service.ts       # Nostr challenge/verify, JWT issuance
│   │   ├── events.service.ts     # Event business logic
│   │   ├── hivetalk.service.ts   # HiveTalk room creation API calls
│   │   ├── nostr.service.ts      # Publish/subscribe Nostr events
│   │   ├── notifications.service.ts # Firebase FCM push notifications
│   │   └── payments.service.ts   # MoneyDevKit webhook handling, split logic
│   ├── db/
│   │   └── prisma.ts             # Prisma client singleton
│   └── types/
│       └── index.ts              # API-specific types (re-exports from packages/shared)
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Prisma migration files
├── tests/
│   ├── auth.test.ts
│   ├── events.test.ts
│   └── facilitators.test.ts
├── .env                          # Local env (never commit)
├── package.json
└── tsconfig.json
```

## 5. Current Proposed Solution

### Authentication Flow (Nostr-backed JWT)
1. Client sends `POST /auth/challenge` with `{ npub: "npub1..." }`.
2. API returns a random challenge string.
3. Client signs challenge with their Nostr private key → sends `POST /auth/verify` with `{ npub, signedChallenge }`.
4. API verifies signature using Nostr public key → issues JWT (24h expiry).
5. All protected routes require `Authorization: Bearer <token>`.

### Database Schema (Prisma)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String    @id @default(cuid())
  npub        String    @unique           // Nostr public key (npub format)
  displayName String?
  bio         String?
  avatarUrl   String?
  isFacilitator Boolean @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  events      Event[]   @relation("facilitatorEvents")
  requests    EventRequest[]
  availability FacilitatorAvailability[]
  wallet      FacilitatorWallet?
}

model Event {
  id           String       @id @default(cuid())
  title        String
  description  String?
  scheduledAt  DateTime
  durationMins Int          @default(60)
  status       EventStatus  @default(PENDING)
  facilitatorId String
  facilitator  User         @relation("facilitatorEvents", fields: [facilitatorId], references: [id])
  hivetalkRoomId String?    // Room ID/URL from HiveTalk/MiroTalk
  maxParticipants Int       @default(20)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  requests     EventRequest[]
  payments     Payment[]
}

enum EventStatus {
  PENDING
  CONFIRMED
  ACTIVE
  COMPLETED
  CANCELLED
}

model EventRequest {
  id          String    @id @default(cuid())
  requesterId String
  requester   User      @relation(fields: [requesterId], references: [id])
  eventId     String?
  event       Event?    @relation(fields: [eventId], references: [id])
  message     String?
  zapAmount   Int       @default(0)  // sats — incentivizes facilitator response
  status      RequestStatus @default(PENDING)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

enum RequestStatus {
  PENDING
  ACCEPTED
  DECLINED
}

model FacilitatorAvailability {
  id           String   @id @default(cuid())
  facilitatorId String
  facilitator  User     @relation(fields: [facilitatorId], references: [id])
  availableFrom DateTime
  availableTo  DateTime
  createdAt    DateTime @default(now())
}

model FacilitatorWallet {
  id            String @id @default(cuid())
  facilitatorId String @unique
  facilitator   User   @relation(fields: [facilitatorId], references: [id])
  lightningAddress String          // e.g. facilitator@walletofsatoshi.com
  splitPercent  Int    @default(70) // % of payment routed to facilitator (DFE gets remainder)
}

model Payment {
  id           String        @id @default(cuid())
  eventId      String
  event        Event         @relation(fields: [eventId], references: [id])
  payerNpub    String
  amountSats   Int
  status       PaymentStatus @default(PENDING)
  mdkSessionId String?       // MoneyDevKit session reference
  createdAt    DateTime      @default(now())
}

enum PaymentStatus {
  PENDING
  CONFIRMED
  FAILED
}
```

### REST Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /auth/challenge | — | Request challenge for Nostr signing |
| POST | /auth/verify | — | Verify signed challenge → return JWT |
| GET | /users/:npub | JWT | Get user profile |
| PUT | /users/:npub | JWT (own) | Update own profile |
| GET | /events | — | List upcoming confirmed events |
| POST | /events | JWT (facilitator) | Create event |
| GET | /events/:id | — | Get event details |
| PUT | /events/:id | JWT (facilitator) | Update event |
| DELETE | /events/:id | JWT (facilitator) | Cancel event |
| GET | /facilitators | — | List available facilitators |
| PUT | /facilitators/availability | JWT (facilitator) | Set availability windows |
| POST | /event-requests | JWT | Submit event request (with optional Zap amount) |
| PUT | /event-requests/:id | JWT (facilitator) | Accept/decline request |
| POST | /webhooks/moneydevkit | HMAC | Payment webhook from MoneyDevKit |
| GET | /health | — | Health check |

### Key Libraries

```json
{
  "dependencies": {
    "express": "^4.18",
    "@prisma/client": "^5",
    "zod": "^3",
    "jsonwebtoken": "^9",
    "nostr-tools": "^2",
    "firebase-admin": "^12",
    "axios": "^1",
    "cors": "^2",
    "helmet": "^7",
    "morgan": "^1"
  },
  "devDependencies": {
    "typescript": "^5",
    "prisma": "^5",
    "@types/express": "^4",
    "@types/jsonwebtoken": "^9",
    "vitest": "^1",
    "supertest": "^6"
  }
}
```

## 6. Next Steps

1. **Initialize package**
   ```bash
   cd packages/api
   pnpm init
   pnpm add express @prisma/client zod jsonwebtoken nostr-tools firebase-admin axios cors helmet morgan
   pnpm add -D typescript prisma @types/express @types/jsonwebtoken vitest supertest
   npx tsc --init
   ```

2. **Create prisma schema** — copy schema from section 5 above into `prisma/schema.prisma`.

3. **Run initial migration**
   ```bash
   pnpm prisma migrate dev --name init
   ```

4. **Implement `config.ts`** — validate all env vars with Zod at startup. App must fail fast if required vars are missing.
   ```typescript
   // src/config.ts
   import { z } from 'zod'
   const schema = z.object({
     DATABASE_URL: z.string().url(),
     JWT_SECRET: z.string().min(32),
     NOSTR_RELAY_URL: z.string(),
     FIREBASE_SERVICE_ACCOUNT: z.string(),
     HIVETALK_API_URL: z.string().url(),
     MDK_WEBHOOK_SECRET: z.string(),
   })
   export const config = schema.parse(process.env)
   ```

5. **Write auth tests first (TDD)**
   ```typescript
   // tests/auth.test.ts
   describe('POST /auth/challenge', () => {
     it('returns a challenge for a valid npub', ...)
     it('returns 400 for missing npub', ...)
   })
   describe('POST /auth/verify', () => {
     it('returns JWT for valid Nostr signature', ...)
     it('returns 401 for invalid signature', ...)
   })
   ```

6. **Implement auth routes** (make tests pass):
   - `auth.service.ts`: generate random 32-byte hex challenge, store in memory (or Redis in future), verify Nostr signature using `nostr-tools/pure`.

7. **Implement user, event, facilitator routes** — follow test-first pattern for each.

8. **Implement `hivetalk.service.ts`** — on event confirmation, call HiveTalk/MiroTalk API to create a named room. Store room ID/URL in `Event.hivetalkRoomId`.

9. **Implement `notifications.service.ts`** — send FCM push notification to user devices on: event confirmation, event request accepted/declined, event starting in 15 min.

10. **Implement `webhooks.routes.ts`** — verify MoneyDevKit HMAC signature, update `Payment` status, trigger payout split logic in `payments.service.ts`.

11. **Test all routes with supertest** — achieve ≥ 80% coverage before shipping.

12. **Dockerize**: create `infra/docker/api.Dockerfile`.
    ```dockerfile
    FROM node:20-alpine
    WORKDIR /app
    COPY packages/api/package.json packages/api/pnpm-lock.yaml ./
    RUN npm install -g pnpm && pnpm install --frozen-lockfile
    COPY packages/api/ .
    RUN pnpm build
    EXPOSE 3001
    CMD ["node", "dist/server.js"]
    ```

## 7. Current Unresolved Issues

- Challenge storage: in-memory Map is fine for v1 (single server), but needs Redis if/when scaling horizontally.
- HiveTalk API: no confirmed REST API documentation found — may need to inspect HiveTalk source or use MiroTalk's API pattern.
- MoneyDevKit webhook HMAC verification: confirm webhook secret mechanism in MDK docs.
- Payment split routing: MDK routes to a single wallet. Split to facilitator wallet requires a separate outgoing payment after receiving — add to MONEYDEVKIT-SPEC.

## 8. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-03-07 | Moses / Copilot | Initial spec created |
