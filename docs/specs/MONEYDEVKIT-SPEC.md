---
Note-type: spec
status: Backlog
tags:
  - drumstr
  - payments
  - moneydevkit
  - lightning
  - bitcoin
creation: 2026-03-07
modified: 2026-03-07
---

## AI Agent Rules
1. Do not change structure or delete sections — only add content.
2. TDD (red/green/refactor). Test webhook signature verification and split logic thoroughly.
3. Self-custodial — never store MDK_MNEMONIC server-side in plaintext beyond `.env`.
4. Keep payment logic simple: receive → record → route split. No complex escrow for v1.
5. Consult human before adding payment logic that isn't explicitly spec'd here.
6. Make decisions for longevity. Payment bugs = lost funds. Test exhaustively.

---

# MONEYDEVKIT-SPEC — Lightning Payments & Admin Split Distribution

## 1. Project Details

| Field | Value |
|---|---|
| Spec | MONEYDEVKIT-SPEC |
| Package | packages/api (payments service + webhook route) + apps/web (checkout) |
| Depends On | BACKEND-API-SPEC, EVENT-MGMT-SPEC |
| Blocks | MOBILE-APP-SPEC (WebView checkout), WEB-APP-SPEC (checkout pages) |
| Library | @moneydevkit/nextjs (web), REST API (mobile WebView) |
| Status | MoneyDevKit is in public beta — validate before production use |

## 2. End Goal

Users pay for drum session events via Bitcoin Lightning through MoneyDevKit. Payments are self-custodial (keys tied to `MDK_MNEMONIC`). Admins configure a split percentage: a portion routes to DFE's Lightning wallet and the remainder to the facilitator's configured Lightning address. v1 supports event-based payments; Zap incentives for event requests are tracked but settlement deferred to v1.1.

## 3. Current Implementation Details

Repository initialized at `~/repos/drumstr`. No payment integration exists yet. MoneyDevKit public beta SDK reviewed at `docs.moneydevkit.com`. `packages/api/` not yet created.

## 4. Updated Implementation Details

```
apps/web/
├── app/
│   ├── checkout/
│   │   ├── [sessionId]/
│   │   │   └── page.tsx          # MoneyDevKit hosted checkout page redirect
│   │   └── success/
│   │       └── page.tsx          # useCheckoutSuccess() confirmation
│   └── api/
│       └── webhooks/
│           └── moneydevkit/
│               └── route.ts      # MoneyDevKit webhook handler (Next.js API route)

packages/api/
└── src/
    ├── routes/webhooks.routes.ts  # POST /webhooks/moneydevkit
    └── services/payments.service.ts
```

## 5. Current Proposed Solution

### Payment Flow

```
User RSVPs to event
        │
        ▼
Web: createCheckout() via @moneydevkit/nextjs
Mobile: POST /api/checkout → redirect to MoneyDevKit hosted page (WebView)
        │
        ▼
MoneyDevKit hosted Lightning invoice/checkout
        │  user pays
        ▼
MDK webhook → POST /webhooks/moneydevkit
        │  verify HMAC, update Payment record
        ▼
payments.service.ts: route split
  ├─ DFE cut → DFE Lightning address
  └─ Facilitator cut → FacilitatorWallet.lightningAddress
        │
        ▼
Notify user: payment confirmed, event access granted
```

### Payment Split Logic

```typescript
// src/services/payments.service.ts
export const processSplit = async (paymentId: string) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: { event: { include: { facilitator: { include: { wallet: true } } } } }
  })

  const facilitatorWallet = payment.event.facilitator.wallet
  const splitPercent = facilitatorWallet?.splitPercent ?? 70 // Default: 70% to facilitator

  const facilitatorSats = Math.floor(payment.amountSats * (splitPercent / 100))
  const dfeSats = payment.amountSats - facilitatorSats

  // Route facilitator cut to their Lightning address
  if (facilitatorWallet?.lightningAddress) {
    await lightningPay(facilitatorWallet.lightningAddress, facilitatorSats)
  }

  // Route DFE cut to DFE Lightning address
  await lightningPay(process.env.DFE_LIGHTNING_ADDRESS!, dfeSats)

  await prisma.payment.update({ where: { id: paymentId }, data: { status: 'CONFIRMED' } })
}
```

### Facilitator Wallet Configuration

- Each facilitator sets their Lightning address (e.g., `name@walletofsatoshi.com`).
- Admin (DFE) sets the global default split (default: 70% facilitator / 30% DFE).
- Per-facilitator overrides allowed for featured facilitators.

### Web Checkout (Next.js — apps/web)

```typescript
// apps/web/app/checkout/[sessionId]/page.tsx
import { useCheckout } from '@moneydevkit/nextjs'

export default function CheckoutPage({ params }: { params: { sessionId: string } }) {
  // MoneyDevKit handles the checkout UI
  // This page is a redirect target from the checkout session
  return <div>Redirecting to payment...</div>
}
```

```typescript
// apps/web/app/api/webhooks/moneydevkit/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.text()
  // Verify MDK webhook signature
  // Forward to backend API for payment processing
  const res = await fetch(`${process.env.API_URL}/webhooks/moneydevkit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-mdk-signature': req.headers.get('x-mdk-signature') ?? '' },
    body,
  })
  return NextResponse.json({ ok: res.ok })
}
```

### Mobile Payment (WebView)

- Mobile app does NOT use @moneydevkit/nextjs directly (no React Native SDK).
- Flow: mobile app calls backend `POST /api/checkout` → backend creates MDK checkout session → returns checkout URL → mobile opens URL in WebView.
- On success, MDK redirects to `drumstr.app/checkout/success` → mobile detects navigation to this URL → closes WebView → shows confirmation.

### MoneyDevKit Configuration

```bash
# packages/api/.env
MDK_ACCESS_TOKEN=your_api_key_here
MDK_MNEMONIC=your_mnemonic_here          # CRITICAL: back up securely
MDK_WEBHOOK_SECRET=your_webhook_secret
DFE_LIGHTNING_ADDRESS=dfe@walletofsatoshi.com
```

### Admin Payment Split UI (v1 — simple)

| Setting | Default | Configurable |
|---|---|---|
| Default facilitator split % | 70% | Yes (admin only) |
| Per-facilitator override | — | Yes |
| DFE Lightning address | `DFE_LIGHTNING_ADDRESS` env var | Via admin env config |

## 6. Next Steps

1. **Create MoneyDevKit account** at https://moneydevkit.com
   - Run `npx @moneydevkit/create` to generate credentials
   - Save `MDK_ACCESS_TOKEN` and `MDK_MNEMONIC` securely (offline backup of mnemonic)

2. **Install SDK in web app**
   ```bash
   cd apps/web
   pnpm add @moneydevkit/nextjs
   ```

3. **Write payment webhook tests (TDD)**
   ```typescript
   describe('POST /webhooks/moneydevkit', () => {
     it('rejects requests with invalid HMAC signature', ...)
     it('updates payment status to CONFIRMED on valid webhook', ...)
     it('triggers split routing on confirmation', ...)
   })
   describe('processSplit', () => {
     it('routes 70% to facilitator and 30% to DFE by default', ...)
     it('respects per-facilitator split override', ...)
     it('skips facilitator payment if no wallet configured', ...)
   })
   ```

4. **Implement webhook route** (`packages/api/src/routes/webhooks.routes.ts`)
   - Verify HMAC signature using `MDK_WEBHOOK_SECRET`
   - Call `payments.service.processSplit(paymentId)`

5. **Implement `createCheckout` endpoint** for mobile WebView:
   ```typescript
   // POST /api/checkout
   // Body: { eventId, amountSats, currency: 'USD' }
   // Returns: { checkoutUrl: string }
   ```

6. **Implement success page** in `apps/web/app/checkout/success/page.tsx` using `useCheckoutSuccess()`.

7. **Implement `lightningPay` utility** — use MoneyDevKit's outbound payment capability or LNURL Pay to route split payments. Research MDK outbound payment API.

8. **Add `FacilitatorWallet` management endpoint** for facilitators to set their Lightning address:
   ```http
   PUT /facilitators/wallet
   Body: { lightningAddress: "name@walletofsatoshi.com", splitPercent: 70 }
   ```

9. **Test end-to-end on testnet** before enabling real payments.

## 7. Current Unresolved Issues

- **MDK outbound payments:** MoneyDevKit docs focus on receiving payments. Sending split payments to facilitators may require a separate mechanism (LNURL-pay, keysend, or waiting for MDK to expose outbound API). Research required.
- **MoneyDevKit public beta risk:** Not production-hardened. Have a fallback plan (manual split processing or BTC Pay Server re-introduction).
- **Zap settlement:** Zap amounts on event requests are informational in v1 — actual Lightning settlement deferred to v1.1.
- **Currency:** MDK supports USD-denominated amounts (converts to sats). Confirm all amounts stored in sats in DB.
- **Mobile WebView UX:** Test that Lightning wallet apps (CashApp, Alby) can intercept the payment URI from the WebView correctly on iOS and Android.

## 8. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-03-07 | Moses / Copilot | Initial spec created; BTC Pay Server replaced by MoneyDevKit |
