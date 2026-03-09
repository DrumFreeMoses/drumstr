---
Note-type: spec
status: Backlog
tags:
  - drumstr
  - nostr
  - identity
  - auth
creation: 2026-03-07
modified: 2026-03-07
---

## AI Agent Rules
1. Do not change structure or delete sections — only add content.
2. TDD (red/green/refactor). Test key generation, signing, and verification thoroughly.
3. Never store private keys server-side. Identity is fully client-side.
4. Keep Nostr integration simple — use nostr-tools library, avoid custom protocol code.
5. If Nostr logic exceeds simple publish/subscribe, consult human before abstracting.
6. Make decisions for longevity. Follow NIPs (Nostr Implementation Possibilities) standards.

---

# NOSTR-IDENTITY-SPEC — Nostr-Based Identity, Profiles & Auth

## 1. Project Details

| Field | Value |
|---|---|
| Spec | NOSTR-IDENTITY-SPEC |
| Package | packages/nostr (shared utility) + packages/api (auth routes) |
| Depends On | BACKEND-API-SPEC (auth routes) |
| Blocks | MOBILE-APP-SPEC, WEB-APP-SPEC, EVENT-MGMT-SPEC |
| Protocol | Nostr (Notes and Other Stuff Transmitted by Relays) |
| Relay | nostr-rs-relay (self-hosted at relay.drumstr.app) |

## 2. End Goal

All Drumstr users are identified by a Nostr keypair (public/private key). No email or password required. The backend issues JWTs based on verified Nostr signatures. User profiles are stored both on the Nostr relay (decentralized) and in PostgreSQL (for fast queries). A self-hosted Nostr relay at `relay.drumstr.app` anchors Drumstr's social layer.

## 3. Current Implementation Details

Repository initialized at `~/repos/drumstr`. Package location: `packages/nostr/` — directory does not yet exist (scaffold pending).

**Repo current state:**
```
~/repos/drumstr/
├── apps/web/              ← placeholder
├── packages/shared/       ← placeholder
├── docs/specs/            ← all specs seeded (2026-03-09)
└── README.md
```
`packages/nostr/` not yet created. No Nostr integration implemented yet.

## 4. Updated Implementation Details

```
packages/nostr/
├── src/
│   ├── index.ts              # Public exports
│   ├── keys.ts               # Key generation, npub/nsec encoding
│   ├── signing.ts            # Sign events, verify signatures
│   ├── relay.ts              # Connect to relay, publish/subscribe
│   ├── profile.ts            # Build and parse NIP-01 profile events (kind 0)
│   └── auth.ts               # NIP-98 HTTP Auth challenge/response helpers
├── tests/
│   ├── keys.test.ts
│   ├── signing.test.ts
│   └── auth.test.ts
├── package.json
└── tsconfig.json
```

## 5. Current Proposed Solution

### Nostr Primer (relevant NIPs for Drumstr)

| NIP | Purpose | Usage in Drumstr |
|---|---|---|
| NIP-01 | Basic protocol, event format, relay communication | Core — all events |
| NIP-07 | Browser extension signing (window.nostr) | Web app auth |
| NIP-19 | npub/nsec bech32 encoding | Display keys to users |
| NIP-46 | Remote signing (Nostr Connect) | Mobile auth (no private key in app) |
| NIP-57 | Lightning Zaps | Event request incentives |
| NIP-98 | HTTP Auth | Backend JWT auth |

### Identity Model
- Every user has a **keypair**: `privkey` (secret, client-only) and `pubkey` (public, used as user ID).
- `npub` = bech32-encoded public key (display format).
- `nsec` = bech32-encoded private key (never leaves client device).
- Profiles stored as **NIP-01 kind 0 events** on the relay: `{ name, bio, picture }`.

### Auth Flow
```
1. Client → POST /auth/challenge { npub }
2. Server → { challenge: "abc123..." }
3. Client signs challenge as NIP-98 HTTP Auth event
4. Client → POST /auth/verify { npub, event: <signed NIP-98 event> }
5. Server verifies event signature with nostr-tools
6. Server → { token: "<JWT>", expiresIn: 86400 }
```

### Self-Hosted Nostr Relay (nostr-rs-relay)
- Docker image: `scsibug/nostr-rs-relay`
- Domain: `relay.drumstr.app` (WSS)
- Config: Accept events from any pubkey; no write restrictions for v1.
- Drumstr client connects to `wss://relay.drumstr.app` for profile sync.

### Key Generation (packages/nostr/src/keys.ts)
```typescript
import { generateSecretKey, getPublicKey, nip19 } from 'nostr-tools/pure'

export const generateKeypair = () => {
  const privkey = generateSecretKey()          // Uint8Array
  const pubkey = getPublicKey(privkey)         // hex string
  return {
    privkey,
    pubkey,
    npub: nip19.npubEncode(pubkey),
    nsec: nip19.nsecEncode(privkey),
  }
}
```

### Profile Event (packages/nostr/src/profile.ts)
```typescript
import { finalizeEvent, type UnsignedEvent } from 'nostr-tools/pure'

export const buildProfileEvent = (
  privkey: Uint8Array,
  profile: { name: string; bio?: string; picture?: string }
) => {
  const unsigned: UnsignedEvent = {
    kind: 0,
    pubkey: getPublicKey(privkey),
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: JSON.stringify(profile),
  }
  return finalizeEvent(unsigned, privkey)
}
```

## 6. Next Steps

1. **Initialize package**
   ```bash
   cd packages/nostr
   pnpm init
   pnpm add nostr-tools
   pnpm add -D typescript vitest
   ```

2. **Write key generation tests (TDD)**
   ```typescript
   // tests/keys.test.ts
   describe('generateKeypair', () => {
     it('returns a valid npub and nsec', ...)
     it('derived public key matches encoded npub', ...)
   })
   ```

3. **Implement keys.ts** — key generation and bech32 encoding.

4. **Write signing tests**
   ```typescript
   describe('signing', () => {
     it('signs an event and produces a valid signature', ...)
     it('verifies a valid signature', ...)
     it('rejects an invalid signature', ...)
   })
   ```

5. **Implement signing.ts** — sign and verify using `nostr-tools/pure`.

6. **Write NIP-98 auth tests**
   ```typescript
   describe('buildAuthEvent', () => {
     it('produces a valid kind-27235 event', ...)
     it('includes the challenge in the tags', ...)
   })
   ```

7. **Implement auth.ts** — NIP-98 HTTP Auth event builder and verifier.

8. **Deploy nostr-rs-relay** on Backend VPS:
   ```bash
   docker pull scsibug/nostr-rs-relay
   # Create config.toml (allow all events, limit event storage to 30 days)
   docker run -d \
     --name nostr-relay \
     -v /opt/nostr/config.toml:/usr/src/app/config.toml \
     -p 7777:7777 \
     scsibug/nostr-rs-relay
   ```

9. **Configure Nginx** to proxy WSS traffic to the relay:
   ```nginx
   # nostr.conf
   server {
     listen 443 ssl;
     server_name relay.drumstr.app;
     location / {
       proxy_pass http://localhost:7777;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "upgrade";
     }
   }
   ```

10. **Integrate `packages/nostr` into `packages/api`** auth routes — use `auth.ts` to verify NIP-98 events in `POST /auth/verify`.

11. **Test relay connectivity** with a public Nostr client (e.g., Damus, Primal) by adding `wss://relay.drumstr.app` as a relay.

## 7. Current Unresolved Issues

- **NIP-46 (Nostr Connect) for mobile:** Allows mobile users to sign events via a separate signer app (e.g., Amber on Android). This is more secure than storing `nsec` in the app. Defer to v1.1 unless Expo SecureStore is deemed insufficient.
- **Key backup UX:** Users who lose their private key lose their identity. Need a user-friendly key backup/export flow — spec in MOBILE-APP-SPEC.
- **Relay spam/abuse:** No write restrictions on v1 relay — add rate limiting in v1.1.

## 8. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-03-07 | Moses / Copilot | Initial spec created |
