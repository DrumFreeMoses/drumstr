---
Note-type: spec
status: Backlog
tags:
  - drumstr
  - web
  - nextjs
  - moneydevkit
creation: 2026-03-07
modified: 2026-03-07
---

## AI Agent Rules
1. Do not change structure or delete sections — only add content.
2. TDD (red/green/refactor). Test API route handlers and critical UI components.
3. Favor Server Components by default; use Client Components only when interactivity is needed.
4. Simple page structure over complex layouts. Consult human before adding abstractions.
5. If a page component exceeds ~150 lines, extract server/client sub-components.
6. Make decisions for longevity. Prefer native Next.js patterns (App Router, fetch caching).

---

# WEB-APP-SPEC — Next.js Web Application

## 1. Project Details

| Field | Value |
|---|---|
| Spec | WEB-APP-SPEC |
| Package | apps/web |
| Depends On | BACKEND-API-SPEC, NOSTR-IDENTITY-SPEC, MONEYDEVKIT-SPEC |
| Runtime | Next.js 15 (App Router), TypeScript |
| Payments | @moneydevkit/nextjs |
| Auth | Nostr NIP-07 (browser extension: Alby, nos2x, Flamingo) |
| Styling | Tailwind CSS + shadcn/ui |
| Domains | drumstr.app (primary), drumfreeexperience.org (301 redirect) |

## 2. End Goal

A responsive, mobile-first web app at `drumstr.app`. Users with a Nostr browser extension (or generated key) can browse events, request sessions, join rooms, and pay via Lightning. The web app also serves as the MoneyDevKit checkout host (used by both web and mobile clients). An admin area allows DFE to configure payment splits.

## 3. Current Implementation Details

Repository initialized at `~/repos/drumstr`. Package location: `apps/web/` — directory placeholder exists but is empty.

**Repo current state:**
```
~/repos/drumstr/
├── apps/web/              ← placeholder (empty)
├── packages/shared/       ← placeholder
├── docs/specs/            ← all specs seeded (2026-03-09)
└── README.md
```
No Next.js app initialized yet in `apps/web/`.

## 4. Updated Implementation Details

```
apps/web/
├── app/
│   ├── page.tsx                      # Home — hero + upcoming events
│   ├── layout.tsx                    # Root layout (Nostr auth provider, nav)
│   ├── events/
│   │   ├── page.tsx                  # Events list
│   │   └── [id]/
│   │       └── page.tsx              # Event detail + join button
│   ├── facilitators/
│   │   └── page.tsx                  # Browse facilitators
│   ├── request/
│   │   └── page.tsx                  # Event request form
│   ├── profile/
│   │   └── page.tsx                  # User profile (NIP-07 auth required)
│   ├── admin/
│   │   └── page.tsx                  # Payment split admin (facilitator wallets)
│   ├── checkout/
│   │   ├── [sessionId]/
│   │   │   └── page.tsx              # MDK checkout redirect
│   │   └── success/
│   │       └── page.tsx              # useCheckoutSuccess() confirmation
│   └── api/
│       ├── checkout/
│       │   └── route.ts              # POST — create MDK checkout session
│       └── webhooks/
│           └── moneydevkit/
│               └── route.ts          # POST — MDK payment webhook
├── components/
│   ├── ui/                           # shadcn/ui generated components
│   ├── EventCard.tsx                 # Shared with design system
│   ├── FacilitatorCard.tsx
│   ├── NostrAuthButton.tsx           # "Connect with Nostr" (NIP-07)
│   ├── RoomEmbed.tsx                 # HiveTalk iframe embed
│   └── PaymentButton.tsx             # Trigger MoneyDevKit checkout
├── lib/
│   ├── api.ts                        # Fetch wrapper for backend API
│   ├── nostr.ts                      # NIP-07 browser extension helpers
│   └── auth.ts                       # JWT management (localStorage)
├── contexts/
│   └── NostrAuthContext.tsx          # React context for Nostr identity
├── public/
│   └── logo.svg
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

## 5. Current Proposed Solution

### Authentication (NIP-07 Browser Extension)

```typescript
// lib/nostr.ts
export const connectNostr = async (): Promise<string | null> => {
  if (typeof window === 'undefined' || !window.nostr) {
    alert('Please install a Nostr browser extension (Alby, nos2x, or Flamingo)')
    return null
  }
  const pubkey = await window.nostr.getPublicKey()
  return pubkey // hex pubkey
}

export const signEvent = async (event: UnsignedEvent) => {
  return window.nostr!.signEvent(event)
}
```

```typescript
// contexts/NostrAuthContext.tsx
'use client'
export const NostrAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [npub, setNpub] = useState<string | null>(null)
  const [jwt, setJwt] = useState<string | null>(null)

  const login = async () => {
    const pubkey = await connectNostr()
    if (!pubkey) return
    // Challenge-response auth (NIP-98)
    const challenge = await fetchChallenge(pubkey)
    const signedEvent = await signEvent(buildAuthEvent(challenge))
    const { token } = await verifyAuth(pubkey, signedEvent)
    setNpub(nip19.npubEncode(pubkey))
    setJwt(token)
    localStorage.setItem('drumstr_jwt', token)
  }

  return <NostrAuthContext.Provider value={{ npub, jwt, login }}>{children}</NostrAuthContext.Provider>
}
```

### Home Page (Server Component)

```typescript
// app/page.tsx
import { EventCard } from '@/components/EventCard'

export default async function HomePage() {
  const events = await fetch(`${process.env.API_URL}/events`).then(r => r.json())
  return (
    <main>
      <HeroSection />
      <section className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event: Event) => <EventCard key={event.id} event={event} />)}
      </section>
    </main>
  )
}
```

### MoneyDevKit Checkout (Next.js API Route)

```typescript
// app/api/checkout/route.ts
import { createCheckout } from '@moneydevkit/nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { eventId, amountUsd, userId } = await req.json()
  const result = await createCheckout({
    type: 'AMOUNT',
    title: 'Drum Session Payment',
    amount: amountUsd * 100, // cents
    currency: 'USD',
    successUrl: '/checkout/success',
    customer: { externalId: userId },
    metadata: { eventId }
  })
  return NextResponse.json({ checkoutUrl: result.url, sessionId: result.id })
}
```

### Room Embed

```typescript
// components/RoomEmbed.tsx
'use client'
export const RoomEmbed = ({ roomUrl }: { roomUrl: string }) => (
  <iframe
    src={roomUrl}
    allow="camera; microphone; fullscreen; display-capture"
    className="w-full h-screen border-0"
  />
)
```

### Admin Payment Split Page

- Protected route: only accessible to users whose `npub` matches `ADMIN_NPUB` env var.
- Displays all facilitators with their configured Lightning address and split %.
- Allows admin to edit split % per facilitator.
- Simple table with inline edit (no complex UI framework needed).

### Key Libraries

```json
{
  "dependencies": {
    "next": "^15",
    "@moneydevkit/nextjs": "latest",
    "nostr-tools": "^2",
    "tailwindcss": "^3",
    "shadcn-ui": "latest",
    "axios": "^1",
    "@drumstr/shared": "workspace:*",
    "@drumstr/nostr": "workspace:*"
  }
}
```

### Environment Variables

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=https://api.drumstr.app
API_URL=https://api.drumstr.app            # Server-side only
MDK_ACCESS_TOKEN=your_api_key_here
MDK_MNEMONIC=your_mnemonic_here
ADMIN_NPUB=npub1...                        # DFE admin Nostr public key
```

## 6. Next Steps

1. **Initialize Next.js project**
   ```bash
   cd apps/web
   npx create-next-app . --typescript --tailwind --app --src-dir=false
   pnpm add @moneydevkit/nextjs nostr-tools axios
   npx shadcn@latest init
   ```

2. **Write NostrAuthContext tests (TDD)**
   ```typescript
   describe('NostrAuthContext', () => {
     it('calls window.nostr.getPublicKey on login', ...)
     it('stores JWT in localStorage after successful auth', ...)
     it('handles missing Nostr extension gracefully', ...)
   })
   ```

3. **Implement `NostrAuthContext`** — complete auth flow with challenge/sign/verify.

4. **Build `NostrAuthButton` component** — "Connect with Nostr" button; shows npub when connected.

5. **Build Home page** — server component, fetches and renders upcoming events.

6. **Build Events List and Event Detail pages** — server components with "Join Room" CTA that opens `RoomEmbed`.

7. **Build Facilitators page** — list with availability and "Request Session" CTA.

8. **Build Request page** — form (client component): facilitator, time, message, optional Zap amount.

9. **Implement MoneyDevKit checkout API route** — `app/api/checkout/route.ts`.

10. **Implement MoneyDevKit webhook route** — `app/api/webhooks/moneydevkit/route.ts` (verify, forward to backend).

11. **Build checkout success page** using `useCheckoutSuccess()`.

12. **Build Admin page** — facilitator wallet configuration table, protected by Nostr pubkey check.

13. **Configure 301 redirect** for `drumfreeexperience.org` → `drumstr.app` in `next.config.ts`:
    ```typescript
    redirects: async () => [
      { source: '/:path*', destination: 'https://drumstr.app/:path*', permanent: true, has: [{ type: 'host', value: 'drumfreeexperience.org' }] }
    ]
    ```

14. **Test all pages** on mobile viewport (375px width) before desktop.

## 7. Current Unresolved Issues

- **NIP-07 extension availability:** If user has no extension, offer a fallback (generate keypair in-browser, stored in localStorage). This is less secure but more accessible — spec a warning.
- **Admin auth:** Using Nostr pubkey match is simple but not role-based. Sufficient for v1 (single admin).
- **SEO:** Server components enable good SEO, but event details behind auth require careful handling.
- **drumfreeexperience.org redirect:** If DNS for this domain is at a different registrar, redirect must be handled at DNS level (Cloudflare redirect rule), not in Next.js config.

## 8. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-03-07 | Moses / Copilot | Initial spec created |
