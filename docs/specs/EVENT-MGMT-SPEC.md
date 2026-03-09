---
Note-type: spec
status: Backlog
tags:
  - drumstr
  - events
  - facilitation
  - zaps
creation: 2026-03-07
modified: 2026-03-07
---

## AI Agent Rules
1. Do not change structure or delete sections — only add content.
2. TDD (red/green/refactor). Test all event state transitions exhaustively.
3. Keep event state machine simple — 5 states max for v1.
4. Favor simple CRUD + state machine over complex workflow engine.
5. Do not build scheduling AI — availability windows are manually set by facilitators.
6. Make decisions for longevity. Event data is core business logic — handle errors explicitly.

---

# EVENT-MGMT-SPEC — Event Management, Requests & Facilitator Availability

## 1. Project Details

| Field | Value |
|---|---|
| Spec | EVENT-MGMT-SPEC |
| Package | packages/api (event routes + services) |
| Depends On | BACKEND-API-SPEC, NOSTR-IDENTITY-SPEC |
| Blocks | MONEYDEVKIT-SPEC (payment tied to event), MOBILE-APP-SPEC, WEB-APP-SPEC |
| Core Model | Event, EventRequest, FacilitatorAvailability (defined in BACKEND-API-SPEC schema) |

## 2. End Goal

Users can browse available facilitators, request a group drumming event (with optional Zap to incentivize response), and receive notifications when a facilitator accepts. Facilitators manage their availability windows and respond to requests. Confirmed events get a HiveTalk/MiroTalk SFU room URL and appear in the app's event list.

## 3. Current Implementation Details

Database schema defined in BACKEND-API-SPEC. Routes stubbed in `events.routes.ts` and `facilitators.routes.ts`. No business logic implemented yet.

## 4. Updated Implementation Details

No new files — all logic lives in `packages/api/src/services/events.service.ts` and `packages/api/src/services/notifications.service.ts`.

### Event State Machine

```
                    ┌─────────────────────────────┐
                    │                             │
  User submits  ─►  PENDING  ──► facilitator ──► CONFIRMED ──► session starts ──► ACTIVE
  request              │         accepts               │
                       │                               │ 15 min before
                  facilitator                     notification sent
                  declines
                       │
                    CANCELLED ◄── facilitator or user cancels at any point
                                                   │
                                            session ends ──► COMPLETED
```

### Use Case Flows

#### Flow 1: User Requests an Event
1. User opens "Request Event" screen.
2. User selects: event type, preferred time window, max participants, optional message.
3. User optionally attaches a Zap amount (sats) to incentivize faster facilitator response.
4. `POST /event-requests` → creates `EventRequest` (status: PENDING).
5. Backend publishes a Nostr event (kind 1) to relay announcing the request.
6. Nearby/available facilitators receive notification.

#### Flow 2: Facilitator Responds
1. Facilitator opens notification → sees event request details + Zap amount.
2. Facilitator accepts or declines.
3. If **accepted**:
   - `PUT /event-requests/:id` with `{ status: "ACCEPTED" }`.
   - Backend creates `Event` (status: CONFIRMED).
   - Backend calls HiveTalk/MiroTalk API → creates room → stores `hivetalkRoomId`.
   - Backend sends FCM notification to requester: "Your event is confirmed! Join: av.drumstr.app/..."
4. If **declined**:
   - `EventRequest.status = DECLINED`.
   - Requester notified.

#### Flow 3: Facilitator Sets Availability
1. Facilitator opens "My Availability" screen.
2. Selects time windows (recurring or one-time).
3. `PUT /facilitators/availability` → upserts `FacilitatorAvailability` rows.
4. Available facilitators shown to users when requesting events.

#### Flow 4: Zap Incentive
- Zap amount stored in `EventRequest.zapAmount` (sats).
- Displayed to facilitator alongside the request.
- Zap payment processed separately via MoneyDevKit after facilitator accepts.
- v1: Zap amount is informational/optional — actual Lightning payment handled in MONEYDEVKIT-SPEC.

#### Flow 5: Event Reminder
- 15 minutes before `Event.scheduledAt`, backend cron job sends FCM notification to all participants.
- Notification includes deep link: `drumstr://events/{eventId}`.

### Event Service Implementation Sketch

```typescript
// src/services/events.service.ts
export const confirmEvent = async (requestId: string, facilitatorNpub: string) => {
  const request = await prisma.eventRequest.findUniqueOrThrow({ where: { id: requestId } })
  const facilitator = await prisma.user.findUniqueOrThrow({ where: { npub: facilitatorNpub } })
  
  // State guard: only PENDING requests can be accepted
  if (request.status !== 'PENDING') throw new Error('Request is not in PENDING state')
  
  // Create the event
  const event = await prisma.event.create({
    data: {
      title: `Drum session with ${facilitator.displayName}`,
      scheduledAt: request.preferredTime,
      facilitatorId: facilitator.id,
      status: 'CONFIRMED',
    }
  })
  
  // Create HiveTalk room
  const roomUrl = await hivetalksService.createRoom(event.id)
  await prisma.event.update({ where: { id: event.id }, data: { hivetalkRoomId: roomUrl } })
  
  // Update request
  await prisma.eventRequest.update({ where: { id: requestId }, data: { status: 'ACCEPTED', eventId: event.id } })
  
  // Notify requester
  await notificationsService.send(request.requesterId, {
    title: 'Event Confirmed! 🥁',
    body: `Your drum session is confirmed for ${event.scheduledAt.toLocaleString()}`,
    data: { eventId: event.id, roomUrl }
  })
  
  return event
}
```

## 6. Next Steps

1. **Write event state machine tests (TDD)**
   ```typescript
   describe('confirmEvent', () => {
     it('creates an event when request is PENDING', ...)
     it('throws if request is already ACCEPTED', ...)
     it('creates a HiveTalk room and stores URL', ...)
     it('sends notification to requester', ...)
   })
   ```

2. **Implement `events.service.ts`** — `createRequest`, `confirmEvent`, `declineRequest`, `cancelEvent`, `completeEvent`.

3. **Add `preferredTime` field to `EventRequest` schema** (currently missing — add Prisma migration):
   ```prisma
   model EventRequest {
     ...
     preferredTime  DateTime?
     preferredDurationMins Int @default(60)
   }
   ```

4. **Implement facilitator availability routes** — `PUT /facilitators/availability` accepts an array of time windows:
   ```json
   { "windows": [{ "from": "2026-03-10T14:00:00Z", "to": "2026-03-10T18:00:00Z" }] }
   ```

5. **Build availability query** — `GET /facilitators` returns facilitators with their next available window:
   ```sql
   SELECT u.*, fa.available_from, fa.available_to
   FROM "User" u
   JOIN "FacilitatorAvailability" fa ON fa."facilitatorId" = u.id
   WHERE u."isFacilitator" = true
     AND fa.available_from > NOW()
   ORDER BY fa.available_from ASC
   ```

6. **Implement cron job** for 15-minute event reminders using `node-cron`:
   ```typescript
   cron.schedule('*/5 * * * *', async () => {
     const upcoming = await prisma.event.findMany({
       where: {
         status: 'CONFIRMED',
         scheduledAt: { gte: addMinutes(new Date(), 14), lte: addMinutes(new Date(), 16) }
       }
     })
     for (const event of upcoming) {
       await notificationsService.sendReminder(event)
     }
   })
   ```

7. **Test Zap incentive display** — verify `EventRequest.zapAmount` is included in facilitator notification payload.

8. **Document event state transitions** in `packages/shared/src/constants.ts`:
   ```typescript
   export const EVENT_STATUSES = ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const
   ```

## 7. Current Unresolved Issues

- `preferredTime` field missing from initial schema — requires migration.
- Zap payment flow (actual Lightning payment on accept) deferred to MONEYDEVKIT-SPEC.
- Recurring events / series not in v1 scope.
- Participant roster (who has RSVP'd) not modeled yet — needed for room capacity management.
- Timezone handling: store all times in UTC, display in user's local timezone on client.

## 9. Drum Call Mechanic — Community-Initiated Session Activation

> **Design principle:** This mechanic is the beating heart of Drumstr and *will evolve*. Build it modularly — the threshold logic, intensity model, and activation rules must be easy to change without touching the state machine.

### Concept

Instead of a single user *requesting* an event, the **community drums one into existence**. Users send "Drum Calls" — taps with an intensity signal (1–5) — expressing desire for a session. When accumulated community energy crosses a threshold, a facilitator is notified and can activate the session.

This is Nostr-native: Drum Calls are published as Nostr events on the relay (public, decentralized, community-owned). Aggregation and threshold logic runs server-side (Postgres) to prevent spam and enable fast querying.

### Drum Call Nostr Event (Kind 8131)

```typescript
// Drum Call — Kind 8131 (regular Nostr event, per Shakespeare NIP)
{
  kind: 8131,
  content: "",
  tags: [
    ["e", "<event-or-slot-id>"],       // reference to the open slot/session being called
    ["intensity", "3"],                 // 1–5 (community energy contribution)
    ["p", "<facilitator-npub>"],        // optional: targeting a specific facilitator
  ]
}
```

### Drum Call Data Model (Postgres — aggregation layer)

```prisma
// Addition to schema.prisma
model DrumCall {
  id            String    @id @default(cuid())
  callerNpub    String                          // Nostr pubkey of caller
  slotId        String                          // references OpenSlot or EventRequest
  intensity     Int       @default(1)           // 1–5
  nostrEventId  String?   @unique               // Nostr event ID for dedup/reference
  createdAt     DateTime  @default(now())

  @@unique([callerNpub, slotId])               // one call per user per slot
}

model OpenSlot {
  id              String      @id @default(cuid())
  scheduledAt     DateTime                         // clock-aligned (xx:00, xx:10, etc.)
  slotCount       Int         @default(1)          // 1 = 10 min, 6 = 60 min
  status          SlotStatus  @default(OPEN)
  facilitatorId   String?                          // null until claimed
  totalEnergy     Int         @default(0)          // sum of all intensities (denormalized for speed)
  uniqueCallers   Int         @default(0)          // count of distinct callers
  activationThreshold Int     @default(5)          // configurable per slot
  createdAt       DateTime    @default(now())
  drumCalls       DrumCall[]
}

enum SlotStatus {
  OPEN          // accepting Drum Calls
  ACTIVATING    // threshold reached, awaiting facilitator claim
  CONFIRMED     // facilitator claimed, room created
  ACTIVE        // session in progress
  COMPLETED
  CANCELLED
}
```

### Intensity Model (v1)

| Intensity | Meaning | Sats (suggested Zap) |
|---|---|---|
| 1 | Mild interest — I'd join if it happens | 0 |
| 2 | Interested — would make time for it | 21 |
| 3 | Keen — really want this session | 100 |
| 4 | Urgent — need this now | 210 |
| 5 | Fire — I'm drumming right now, join me! | 1000 |

> **Flexibility note:** Intensity levels, Zap amounts, and threshold values are configuration — not hardcoded. Store in a `config` table or env vars. These will be tuned based on real usage.

### Threshold & Activation Flow

```
User taps drum icon (intensity 1–5)
    │
    ▼
POST /drum-calls  (authenticated)
    │
    ├── Publish Nostr kind 8131 event to relay
    ├── Upsert DrumCall in Postgres (dedup: one per user per slot)
    ├── Recalculate OpenSlot.totalEnergy + uniqueCallers
    │
    └── IF totalEnergy >= activationThreshold AND status == OPEN:
            Set slot status → ACTIVATING
            Notify available facilitators via FCM:
            "🥁 The community wants to drum! 5 callers, energy: 23 — claim this slot"
                │
                ▼
        Facilitator claims slot:
        PUT /slots/:id/claim
            │
            ├── Set status → CONFIRMED
            ├── Create HiveTalk room
            ├── Notify all callers: "Session confirmed! Join: av.drumstr.app/..."
            └── Zap callers' contributions processed via MONEYDEVKIT-SPEC
```

### Anti-Spam Rules (server-enforced)

- One Drum Call per user per slot (enforced by Postgres unique constraint)
- Intensity can be updated (re-tap to increase), not decreased — keeps energy moving upward
- Rate limit: max 3 Drum Calls per user per hour across all slots
- Nostr event ID stored to prevent replay/duplicate webhook processing

### API Endpoints Added

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | /slots | — | List open slots with Drum Call stats |
| POST | /slots | JWT (admin/auto) | Create an open slot (manual or scheduled) |
| POST | /drum-calls | JWT | Submit a Drum Call (intensity 1–5) |
| GET | /slots/:id/drum-calls | — | Get all Drum Calls for a slot |
| PUT | /slots/:id/claim | JWT (facilitator) | Facilitator claims an activating slot |

### Evolution Path

This mechanic is intentionally v1-simple. Planned iterations (not in scope now, note for future):
- Community-proposed slot times (not just fixed clock slots)
- "Drum Call expiry" — calls fade if no session happens within N blocks
- Facilitator bidding — multiple facilitators can offer to host, community votes
- Zap-weighted threshold — heavy Zappers have more activation power
- Global energy heatmap — see where on Earth the drumming energy is highest

## 8. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-03-07 | Moses / Copilot | Initial spec created |
