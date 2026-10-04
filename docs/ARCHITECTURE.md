# Drumstr Architecture

## Overview

Drumstr is a community-owned platform for real-time, on-demand facilitated drumming sessions. The architecture is designed for:
- **Simplicity** — minimal dependencies, easy to understand
- **Scalability** — horizontal scaling, stateless services
- **Security** — no passwords, self-custodial payments
- **Privacy** — decentralized identity, no tracking

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DRUMSTR ECOSYSTEM                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   Web App   │    │  Mobile App │    │  CLI Tools  │    │
│  │  (React)    │    │  (Expo)     │    │  (Node.js)  │    │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                │
│                    ┌───────▼───────┐                        │
│                    │   Backend API │                        │
│                    │   (Node.js)   │                        │
│                    └───────┬───────┘                        │
│                            │                                │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│  ┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐    │
│  │  PostgreSQL │    │   Nostr     │    │ MoneyDevKit │    │
│  │   (data)    │    │  (identity) │    │  (payments) │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
│         ┌──────────────────┼──────────────────┐             │
│         │                  │                  │             │
│  ┌──────▼──────┐    ┌──────▼──────┐    ┌──────▼──────┐    │
│  │  MiroTalk   │    │  HiveTalk   │    │   Firebase  │    │
│  │  (video)    │    │  (Nostr AV) │    │   (push)    │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Frontend

#### Web App (React/Next.js)
- **Location:** `apps/web/`
- **Framework:** React 18 + Next.js 14
- **Styling:** Tailwind CSS
- **State:** React Query + Zustand
- **Auth:** Nostr (NIP-07 browser extension)

**Key Features:**
- Landing page (static, no auth)
- Dashboard (auth required)
- Event browser (list, filter, search)
- Event detail (join, pay, share)
- Facilitator dashboard (manage events, view stats)

#### Mobile App (React Native + Expo)
- **Location:** `apps/mobile/`
- **Framework:** React Native + Expo
- **Navigation:** React Navigation
- **State:** React Query + Zustand
- **Auth:** Nostr (NIP-46 remote signing)

**Key Features:**
- Push notifications (Firebase FCM)
- Offline mode (AsyncStorage + sync)
- Mobile-optimized checkout
- Native WebRTC (video/audio)

### 2. Backend API

- **Location:** `packages/api/`
- **Framework:** Node.js + Express
- **Database:** PostgreSQL + Prisma
- **Auth:** Nostr (NIP-98 HTTP Auth)
- **Payments:** MoneyDevKit + Lightning

**Key Features:**
- User authentication (Nostr-based)
- Event CRUD (create, read, update, delete)
- Payment webhooks (MoneyDevKit)
- Analytics (attendance, revenue)
- Facilitator management

### 3. Database

- **Engine:** PostgreSQL 15+
- **ORM:** Prisma
- **Schema:** `packages/api/prisma/schema.prisma`

**Key Tables:**
- `users` — Nostr pubkey, profile, role
- `events` — Title, description, time, facilitator
- `payments` — Amount, status, split, user
- `facilitators` — Availability, rating, wallet

### 4. Identity (Nostr)

- **Protocol:** Nostr (Notes and Other Stuff Transmitted by Relays)
- **Relay:** nostr-rs-relay (self-hosted at relay.drumstr.app)
- **NIPs Used:**
  - NIP-01: Basic protocol, event format
  - NIP-07: Browser extension signing (window.nostr)
  - NIP-19: npub/nsec bech32 encoding
  - NIP-46: Remote signing (Nostr Connect)
  - NIP-57: Lightning Zaps
  - NIP-98: HTTP Auth

**Auth Flow:**
1. Client → POST /auth/challenge { npub }
2. Server → { challenge: "abc123..." }
3. Client signs challenge as NIP-98 HTTP Auth event
4. Client → POST /auth/verify { npub, event: <signed NIP-98 event> }
5. Server verifies event signature with nostr-tools
6. Server → { token: "<JWT>", expiresIn: 86400 }

### 5. Payments (MoneyDevKit + Lightning)

- **Provider:** MoneyDevKit (public beta)
- **Network:** Bitcoin Lightning
- **Custody:** Self-custodial (keys tied to MDK_MNEMONIC)
- **Split:** 80% facilitator / 20% DFE

**Payment Flow:**
1. User RSVPs to event
2. Web: createCheckout() via @moneydevkit/nextjs
3. Mobile: POST /api/checkout → redirect to MoneyDevKit hosted page (WebView)
4. MoneyDevKit hosted Lightning invoice/checkout
5. User pays
6. MDK webhook → POST /webhooks/moneydevkit
7. Verify HMAC, update Payment record
8. Route split: facilitator → facilitator Lightning address, DFE → DFE Lightning address
9. Notify user: payment confirmed, event access granted

### 6. Video (MiroTalk + HiveTalk)

- **Primary:** HiveTalk (Nostr-native, SFU architecture)
- **Fallback:** MiroTalk SFU (public demo or self-hosted)
- **Protocol:** WebRTC (SFU for scalability)

**Key Features:**
- Real-time audio/video (100+ participants)
- Screen sharing (for demos)
- Chat (text)
- Recording (optional)

### 7. Notifications (Firebase)

- **Provider:** Firebase Cloud Messaging (FCM)
- **Platform:** Web + Mobile
- **Triggers:**
  - Upcoming Block (15 min before)
  - Payment confirmed
  - New event created
  - Facilitator message

## Data Flow

### 1. User Joins Drum Block
```
User → Web/Mobile App → Backend API
  → Verify Nostr signature (NIP-98)
  → Check event capacity
  → Create payment (MoneyDevKit)
  → Generate Lightning invoice
  → Return invoice URL to user
  → User pays invoice
  → MoneyDevKit webhook → Backend API
  → Verify webhook signature
  → Update payment status
  → Route split (80/20)
  → Notify user: payment confirmed
  → Grant event access (room link)
```

### 2. Facilitator Creates Event
```
Facilitator → Web/Mobile App → Backend API
  → Verify Nostr signature (NIP-98)
  → Check facilitator role
  → Create event in database
  → Publish Nostr event (Kind 39613)
  → Notify followers (optional)
  → Return event details
```

### 3. Payment Processing
```
User pays Lightning invoice
  → MoneyDevKit receives payment
  → MoneyDevKit webhook → Backend API
  → Verify HMAC signature
  → Update payment status (CONFIRMED)
  → Route facilitator split (80%)
    → Lightning Pay → Facilitator Lightning address
  → Route DFE split (20%)
    → Lightning Pay → DFE Lightning address
  → Notify user: payment confirmed
  → Notify facilitator: payment received
```

## Security Considerations

### 1. Authentication
- **No passwords** — Nostr keypair only
- **Client-side keys** — Private keys never leave client device
- **NIP-98 HTTP Auth** — Signed challenges for backend auth
- **JWT tokens** — Short-lived (24 hours), refresh on use

### 2. Payments
- **Self-custodial** — MoneyDevKit mnemonic stored securely
- **Webhook verification** — HMAC signature validation
- **Split enforcement** — 80/20 split hardcoded in backend
- **No custodial risk** — Lightning payments settle instantly

### 3. Data
- **Minimal data** — Only store what's necessary
- **No PII** — No email, no phone, no name (just Nostr pubkey)
- **Encrypted at rest** — PostgreSQL encryption
- **Encrypted in transit** — HTTPS everywhere

### 4. Relay
- **Self-hosted** — Nostr relay at relay.drumstr.app
- **Write restrictions** — Rate limiting (v1.1)
- **Event storage** — 30-day retention (configurable)
- **Access control** — Open for v1 (all pubkeys allowed)

## Scalability

### Horizontal Scaling
- **Backend API:** Stateless, scale horizontally behind load balancer
- **Database:** PostgreSQL read replicas (if needed)
- **Relay:** Nostr relay is stateless, scale horizontally

### Vertical Scaling
- **Database:** Increase CPU/RAM for PostgreSQL
- **Backend:** Increase CPU/RAM for Node.js
- **Relay:** Increase storage for event retention

### Performance Targets
- **API latency:** <100ms (p95)
- **Video latency:** <150ms (p95)
- **Payment processing:** <5 seconds (invoice generation)
- **Relay latency:** <50ms (p95)

## Development Workflow

### Local Development
1. Clone repo
2. Install dependencies: `pnpm install`
3. Start database: `docker-compose up -d postgres`
4. Run migrations: `pnpm prisma migrate dev`
5. Start backend: `pnpm dev:api`
6. Start frontend: `pnpm dev:web`

### Testing
- **Unit tests:** Vitest
- **Integration tests:** Vitest + Supertest
- **E2E tests:** Playwright
- **Load tests:** k6

### Deployment
- **Backend:** Railway or Render
- **Frontend:** Vercel
- **Database:** Supabase or Railway
- **Relay:** VPS (DigitalOcean, Linode)

## Future Considerations

### Phase 1
- [ ] Backend API (Node.js + Express + PostgreSQL)
- [ ] Web app (React/Next.js)
- [ ] Nostr auth (NIP-98)
- [ ] MoneyDevKit integration

### Phase 2
- [ ] Mobile app (React Native + Expo)
- [ ] Push notifications (Firebase)
- [ ] Offline mode
- [ ] Native WebRTC

### Phase 3
- [ ] AI facilitator matching
- [ ] Multi-room sessions
- [ ] Leaderboards + badges
- [ ] Community feed

### Phase 4
- [ ] Facilitator marketplace
- [ ] Merchandise store
- [ ] Multi-language support
- [ ] Global events

### Phase 5
- [ ] Enterprise features
- [ ] API + SDK
- [ ] White-label solutions
- [ ] Franchise model

---

*Last updated: March 2026*
