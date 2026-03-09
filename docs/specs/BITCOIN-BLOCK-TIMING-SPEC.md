---
Note-type: spec
status: Backlog
tags:
  - drumstr
  - bitcoin
  - timing
  - blocks
  - ux
creation: 2026-03-09
modified: 2026-03-09
---

## AI Agent Rules
1. Do not change structure or delete sections — only add content.
2. Keep timing logic simple — no complex block-prediction algorithms. Clock-aligned slots are the rule.
3. Block height is display/reference only — never use it as a trigger for session state changes.
4. Always show local datetime alongside block context. Newbie education is a first-class concern.
5. Consult human before changing session duration options — these are product decisions.
6. Make decisions for longevity. Timing bugs ruin sessions. Test thoroughly.

---

# BITCOIN-BLOCK-TIMING-SPEC — Block-Aligned Session Timing & Bitcoin Time Education

## 1. Project Details

| Field | Value |
|---|---|
| Spec | BITCOIN-BLOCK-TIMING-SPEC |
| Package | packages/shared (timing utilities) + apps/web + apps/mobile (display components) |
| Depends On | BACKEND-API-SPEC (event scheduling), NOSTR-IDENTITY-SPEC |
| Blocks | EVENT-MGMT-SPEC (session start/stop logic), MOBILE-APP-SPEC, WEB-APP-SPEC |
| Created | 2026-03-09 |

## 2. End Goal

Sessions in Drumstr are framed in "Bitcoin time" — 10-minute blocks, just like the Bitcoin timechain. But since Bitcoin blocks are non-deterministic (they don't land exactly every 10 minutes), Drumstr uses **clock-aligned 10-minute slots** as session containers, while displaying the **current Bitcoin block height** as contextual reference.

The dual purpose:
1. **Practical:** Sessions start and stop predictably, on the clock, at a 10-minute boundary.
2. **Educational:** New users learn what Bitcoin blocks are through the lived experience of drumming in "block time."

> *"Meet me at the next Bitcoin block where Nostr Drumrs connect…"* — Moses

## 3. Current Implementation Details

Repository initialized at `~/repos/drumstr`. No timing utilities exist yet. `packages/shared/` placeholder only.

## 4. Updated Implementation Details

```
packages/shared/
├── src/
│   ├── timing/
│   │   ├── blockSlots.ts         # Clock-aligned 10-min slot logic
│   │   ├── blockHeight.ts        # Bitcoin block height fetching (mempool.space API)
│   │   └── index.ts              # Re-exports
│   └── index.ts
```

Display components (in both apps/web and apps/mobile):
```
BlockTimeDisplay          # Shows: local time | block height | next slot countdown
SessionDurationPicker     # 1-block (10 min) or 6-block (60 min) selector
```

## 5. Current Proposed Solution

### Clock-Aligned 10-Minute Slots

The hour is divided into six 10-minute "block slots":

```
Slot 1: xx:00 – xx:10
Slot 2: xx:10 – xx:20
Slot 3: xx:20 – xx:30
Slot 4: xx:30 – xx:40
Slot 5: xx:40 – xx:50
Slot 6: xx:50 – (xx+1):00
```

Sessions always start at a slot boundary (xx:00, xx:10, xx:20, xx:30, xx:40, or xx:50). Sessions run for exactly 1 slot (10 min) or 6 slots (60 min). This makes session timing 100% predictable for participants regardless of what the Bitcoin network is doing.

### Bitcoin Block Height (Reference Only)

Block height is fetched from the [mempool.space](https://mempool.space) public API and displayed alongside local time. It is **never used as a trigger for session state** — it is purely contextual/educational.

```typescript
// packages/shared/src/timing/blockHeight.ts
const MEMPOOL_API = 'https://mempool.space/api/blocks/tip/height'

export async function getCurrentBlockHeight(): Promise<number> {
  const res = await fetch(MEMPOOL_API)
  if (!res.ok) throw new Error('Failed to fetch block height')
  return res.json() // returns a number
}
```

Poll interval: every 60 seconds client-side. Cache in state — stale-while-revalidate is fine since this is educational display only.

### Clock-Aligned Slot Utilities

```typescript
// packages/shared/src/timing/blockSlots.ts

/** Returns the start of the current 10-min slot (floor to :00, :10, :20, etc.) */
export function currentSlotStart(now: Date = new Date()): Date {
  const d = new Date(now)
  d.setMinutes(Math.floor(d.getMinutes() / 10) * 10, 0, 0)
  return d
}

/** Returns the start of the next 10-min slot */
export function nextSlotStart(now: Date = new Date()): Date {
  const d = currentSlotStart(now)
  d.setMinutes(d.getMinutes() + 10)
  return d
}

/** Returns seconds remaining until the next slot boundary */
export function secondsToNextSlot(now: Date = new Date()): number {
  return Math.floor((nextSlotStart(now).getTime() - now.getTime()) / 1000)
}

/** Returns slot number within the hour (1–6) */
export function currentSlotNumber(now: Date = new Date()): number {
  return Math.floor(now.getMinutes() / 10) + 1
}

/** Session duration options */
export const SESSION_DURATIONS = {
  ONE_BLOCK: { label: '1 Block — 10 min', minutes: 10, slots: 1 },
  SIX_BLOCKS: { label: '6 Blocks — 60 min', minutes: 60, slots: 6 },
} as const
```

### BlockTimeDisplay Component (shared concept, implemented per platform)

```
┌─────────────────────────────────────────────┐
│  🥁 DRUMSTR                         Block Time │
│                                              │
│  Mon Mar 09, 2026  7:43 PM (MST)            │
│  ⛏  Block #889,412                          │
│                                              │
│  Next Drum Slot in:  7 min 22 sec           │
│  Slot 5 of 6  ████████░░  :40 → :50         │
│                                              │
│  [What's a Bitcoin block?]  ← newbie link   │
└─────────────────────────────────────────────┘
```

Fields shown:
- **Local datetime** (user's timezone, human-readable) — always primary
- **Current block height** — prefixed with ⛏ to signal "mining context"
- **Countdown to next slot** — drives session readiness
- **Current slot progress bar** — visual within-hour position
- **"What's a Bitcoin block?"** — optional educational tooltip/link for newbies

### Educational Framing (Copy)

| Context | Display Text |
|---|---|
| Session start | "Session begins at Block ~889,412 (7:50 PM)" |
| Session running | "Block time: 1 of 6 blocks complete" |
| Between sessions | "Next block slot opens in 3 min 44 sec" |
| Newbie tooltip | "Bitcoin creates a new 'block' roughly every 10 minutes. Drumstr sessions align to this rhythm — connecting your drum to the heartbeat of the network." |

### Session Scheduling Rules

1. All session `scheduledAt` times are rounded to the nearest 10-min clock boundary.
2. On event creation, the UI shows only the next available slot times as options.
3. Session end time = `scheduledAt + (slots × 10 minutes)`.
4. Sessions do NOT auto-start/stop based on block height — the server starts/stops sessions on the clock boundary.
5. Block height at session start is recorded in the event record for display/history.

### Backend: Block Height at Session Time

```prisma
// Addition to Event model in schema.prisma
model Event {
  // ... existing fields ...
  blockHeightAtStart Int?   // block height recorded when session begins
  slotCount          Int    @default(1)  // 1 = 10 min, 6 = 60 min
}
```

## 6. Next Steps

1. **Add timing utilities to `packages/shared/`**
   ```bash
   cd packages/shared
   pnpm init
   pnpm add -D typescript
   mkdir -p src/timing
   ```
   Implement `blockSlots.ts` and `blockHeight.ts` from §5. Write tests first (TDD).

2. **Write tests for slot utilities**
   ```typescript
   describe('currentSlotStart', () => {
     it('floors 7:43 to 7:40', () => ...)
     it('floors 7:00 to 7:00', () => ...)
     it('floors 7:59 to 7:50', () => ...)
   })
   describe('nextSlotStart', () => {
     it('returns 7:50 when current is 7:43', () => ...)
     it('rolls over to next hour at :50', () => ...)
   })
   describe('secondsToNextSlot', () => {
     it('returns correct countdown seconds', () => ...)
   })
   ```

3. **Build `BlockTimeDisplay` component** — implement in both `apps/web` (React/Tailwind) and `apps/mobile` (Expo/React Native). Pull from `packages/shared` timing utilities.

4. **Add `blockHeightAtStart` and `slotCount` to Prisma schema** in BACKEND-API-SPEC.

5. **Update event creation UI** in both apps to show only clock-aligned slot times as scheduling options.

6. **Add educational tooltip** — "What's a Bitcoin block?" — link to a simple explainer (timechaincalendar.com or an in-app modal).

7. **Test countdown accuracy** — verify countdown resets cleanly at slot boundaries, handles DST transitions, handles timezone changes.

## 7. Current Unresolved Issues

- **mempool.space dependency:** If mempool.space is down, block height display fails. Add fallback (blockstream.info API) and graceful "block height unavailable" display — session timing is unaffected either way since it's clock-based.
- **Timezone display:** Always show user's local time. Confirm Expo/React Native timezone detection is reliable across Android and iOS.
- **Block height "drift":** The displayed block height may be slightly stale (up to 60s). This is fine for educational display — add a small "~" prefix to signal approximation: "⛏ ~Block 889,412".
- **Session scheduling lead time:** How far in advance can a session be scheduled? Needs product decision — propose: next 7 days, showing the next 20 available slots.

## 8. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-03-09 | Moses / Copilot | Initial spec created — block-aligned timing, educational display, shared utilities |
