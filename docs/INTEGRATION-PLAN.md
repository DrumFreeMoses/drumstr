# Integration Plan

How Drumstr's components connect once servers are provisioned.
Execute steps in order. Each phase depends on the previous.

---

## Phase 0: Pre-Server (Current — in progress)

- [x] Repo initialized at `~/repos/drumstr`
- [x] All specs written and reviewed (`docs/specs/`)
- [x] Monorepo directory structure scaffolded
- [x] Mock API documented (`docs/MOCK-API.md`)
- [x] UI wireframes documented (`docs/UI-WIREFRAMES.md`)
- [x] Test data fixtures documented (`docs/TEST-DATA.md`)
- [ ] Monorepo initialized (pnpm workspaces + Turborepo)
- [ ] `packages/shared` timing utilities implemented + tested
- [ ] GitHub Actions CI skeleton created

---

## Phase 1: Infrastructure

**Trigger:** VPS servers purchased.

1. Run `infra/scripts/bootstrap-backend.sh` on Infomaniak VPS (CH)
2. Run `infra/scripts/bootstrap-av.sh` on Hetzner VPS (DE)
3. Configure Cloudflare DNS (see INFRA-SPEC §5 DNS table)
4. Verify SSL on all subdomains
5. Push Docker images and start services: `docker compose -f infra/compose/docker-compose.prod.yml up -d`

**Verify:**
```bash
curl https://api.drumstr.app/health    # → { "status": "ok" }
wscat -c wss://relay.drumstr.app       # Nostr relay handshake
```

---

## Phase 2: Backend API + Database

**Trigger:** Phase 1 complete.

1. Initialize `packages/api/` — Express, Prisma, TypeScript
2. Apply Prisma migrations: `pnpm prisma migrate deploy`
3. Seed test data: `pnpm prisma db seed`
4. Implement auth endpoints (Nostr challenge/verify → JWT)
5. Implement user, event, slot, drum-call, facilitator endpoints
6. Wire Nostr relay publishing for event announcements + Drum Calls
7. Wire Firebase FCM for push notifications

**Verify:**
```bash
# Auth flow
curl -X POST https://api.drumstr.app/auth/challenge -d '{"npub":"npub1..."}'
# Health
curl https://api.drumstr.app/health
# Open slots
curl https://api.drumstr.app/slots
```

---

## Phase 3: A/V Server

**Trigger:** Phase 1 complete (parallel with Phase 2).

1. Deploy HiveTalk or MiroTalk SFU on A/V VPS
2. ⚠️ **Resolve noise cancellation blocker first** — see HIVETALK-AV-SPEC §7
3. Configure WebRTC ports (40000–40200 UDP/TCP open in firewall)
4. Verify Cloudflare grey-cloud on `av.drumstr.app` (direct IP for WebRTC)
5. Test room creation via API and manual join

**Verify:**
- Browser → `https://av.drumstr.app` → video/audio room loads
- Two participants join same room → audio heard both ways
- Drum sounds transmitted with noise cancellation off

---

## Phase 4: Payments (MoneyDevKit)

**Trigger:** Phase 2 complete.

1. Create MoneyDevKit account and obtain API keys
2. Configure `MDK_ACCESS_TOKEN` and `MDK_MNEMONIC` in API + web `.env`
3. Implement `app/api/checkout/route.ts` in `apps/web/`
4. Implement `POST /webhooks/moneydevkit` in `packages/api/`
5. Configure webhook URL in MoneyDevKit dashboard: `https://api.drumstr.app/webhooks/moneydevkit`
6. Test payment split: facilitator (70%) + DFE (30%)

**Verify:**
- Create checkout session → receive `checkoutUrl`
- Complete test payment → webhook fires → `Payment.status = CONFIRMED`
- Facilitator wallet receives correct split amount

---

## Phase 5: Web App

**Trigger:** Phase 2 + Phase 4 complete.

1. Initialize `apps/web/` — Next.js 15, Tailwind, shadcn/ui
2. Implement Nostr NIP-07 auth (`NostrAuthContext`)
3. Build pages: Home, Events, Facilitators, Request, Profile, Admin, Checkout
4. Integrate MoneyDevKit `@moneydevkit/nextjs`
5. Add `BlockTimeDisplay` component (from `packages/shared`)
6. Add room embed (`RoomEmbed` → `https://av.drumstr.app`)
7. Deploy: `docker compose` on Backend VPS or Vercel

**Verify:**
- Home page loads events from API
- Nostr login works (browser extension)
- Drum Call submitted → slot energy updates
- Payment checkout flow end-to-end

---

## Phase 6: Mobile App

**Trigger:** Phase 2 + Phase 4 + Phase 5 complete (web app as checkout host).

1. Initialize `apps/mobile/` — Expo SDK 52, React Navigation
2. Implement Nostr keypair auth (SecureStore)
3. Build screens: Welcome, Home, Explore, Request, Room (WebView), Checkout (WebView), Profile
4. Integrate Firebase push notifications
5. Add `BlockTimeDisplay` component
6. Test iOS Simulator + Android Emulator
7. Build for TestFlight (iOS) and internal testing (Android)

**Verify:**
- Keypair generation + auth JWT flow
- Drum Call submitted from mobile → visible on web
- WebView room join → audio/video works (test noise cancellation toggle)
- Push notification received on session confirmation

---

## Integration Checklist (Final)

| Feature | Web | Mobile | Backend | Nostr |
|---|---|---|---|---|
| Nostr auth | ✅ NIP-07 | ✅ keypair | ✅ challenge/verify | ✅ pubkey |
| Block time display | ✅ | ✅ | — | — |
| Open slots list | ✅ | ✅ | ✅ /slots | — |
| Drum Call submit | ✅ | ✅ | ✅ /drum-calls | ✅ Kind 8131 |
| Threshold activation | — | — | ✅ server-side | — |
| Facilitator claim | ✅ | ✅ | ✅ /slots/:id/claim | — |
| A/V room join | ✅ iframe | ✅ WebView | ✅ HiveTalk API | — |
| Drum Mode toggle | ✅ | ✅ | — | — |
| Payment checkout | ✅ MDK native | ✅ WebView | ✅ webhook | — |
| Push notifications | — | ✅ FCM | ✅ FCM trigger | — |
| Profile + history | ✅ | ✅ | ✅ /users/:npub | ✅ Kind 0 |
