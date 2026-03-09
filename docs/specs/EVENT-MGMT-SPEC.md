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

## 8. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-03-07 | Moses / Copilot | Initial spec created |
