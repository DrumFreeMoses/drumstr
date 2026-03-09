# Test Data & Fixtures

Sample data for development and testing. Import these as seed data or use as JSON fixtures in tests.

---

## Users

```json
[
  {
    "id": "user_moses",
    "npub": "npub1moses000000000000000000000000000000000000000000000000000000",
    "displayName": "Moses",
    "bio": "Rhythmic Resonance Facilitator | DFE | Bitcoin/Nostr",
    "avatarUrl": "https://picsum.photos/seed/moses/100",
    "isFacilitator": true
  },
  {
    "id": "user_giselle",
    "npub": "npub1giselle0000000000000000000000000000000000000000000000000000",
    "displayName": "Drumr Giselle",
    "bio": "Five Element Drumming Facilitator",
    "avatarUrl": "https://picsum.photos/seed/giselle/100",
    "isFacilitator": true
  },
  {
    "id": "user_newbie",
    "npub": "npub1newbie000000000000000000000000000000000000000000000000000000",
    "displayName": "NewDrumr",
    "bio": null,
    "avatarUrl": null,
    "isFacilitator": false
  }
]
```

---

## Open Slots

```json
[
  {
    "id": "slot_open_1",
    "scheduledAt": "2026-03-10T02:00:00Z",
    "slotCount": 1,
    "status": "OPEN",
    "totalEnergy": 8,
    "uniqueCallers": 3,
    "activationThreshold": 5,
    "facilitatorId": null
  },
  {
    "id": "slot_activating_1",
    "scheduledAt": "2026-03-10T03:00:00Z",
    "slotCount": 6,
    "status": "ACTIVATING",
    "totalEnergy": 34,
    "uniqueCallers": 9,
    "activationThreshold": 5,
    "facilitatorId": null
  }
]
```

---

## Drum Calls

```json
[
  { "id": "dc_1", "callerNpub": "npub1newbie...", "slotId": "slot_open_1", "intensity": 3 },
  { "id": "dc_2", "callerNpub": "npub1giselle...", "slotId": "slot_open_1", "intensity": 5 },
  { "id": "dc_3", "callerNpub": "npub1other...", "slotId": "slot_activating_1", "intensity": 4 }
]
```

---

## Events

```json
[
  {
    "id": "evt_confirmed",
    "title": "Fire Rhythm — 1 Block",
    "description": "10 minutes of elemental fire rhythm for focus renewal",
    "scheduledAt": "2026-03-10T02:00:00Z",
    "slotCount": 1,
    "durationMins": 10,
    "status": "CONFIRMED",
    "facilitatorId": "user_moses",
    "hivetalkRoomId": "https://av.drumstr.app/room/evt_confirmed",
    "maxParticipants": 20,
    "blockHeightAtStart": null
  },
  {
    "id": "evt_active",
    "title": "Full Transformation — 6 Blocks",
    "description": "60 minutes through all five elements",
    "scheduledAt": "2026-03-09T21:00:00Z",
    "slotCount": 6,
    "durationMins": 60,
    "status": "ACTIVE",
    "facilitatorId": "user_giselle",
    "hivetalkRoomId": "https://av.drumstr.app/room/evt_active",
    "maxParticipants": 20,
    "blockHeightAtStart": 889401
  },
  {
    "id": "evt_completed",
    "title": "Earth Rhythm — 1 Block",
    "description": null,
    "scheduledAt": "2026-03-09T20:00:00Z",
    "slotCount": 1,
    "durationMins": 10,
    "status": "COMPLETED",
    "facilitatorId": "user_moses",
    "hivetalkRoomId": null,
    "maxParticipants": 20,
    "blockHeightAtStart": 889398
  }
]
```

---

## Facilitator Availability

```json
[
  {
    "facilitatorId": "user_moses",
    "availableFrom": "2026-03-10T01:00:00Z",
    "availableTo": "2026-03-10T04:00:00Z"
  },
  {
    "facilitatorId": "user_giselle",
    "availableFrom": "2026-03-11T23:00:00Z",
    "availableTo": "2026-03-12T02:00:00Z"
  }
]
```

---

## Payments

```json
[
  {
    "id": "pay_1",
    "eventId": "evt_completed",
    "payerNpub": "npub1newbie...",
    "amountSats": 100,
    "status": "CONFIRMED",
    "mdkSessionId": "mdk_abc123"
  }
]
```

---

## Facilitator Wallets

```json
[
  {
    "facilitatorId": "user_moses",
    "lightningAddress": "moses@getalby.com",
    "splitPercent": 70
  },
  {
    "facilitatorId": "user_giselle",
    "lightningAddress": "giselle@walletofsatoshi.com",
    "splitPercent": 70
  }
]
```

---

## Nostr Test Events (Kind 8131 — Drum Call)

```json
{
  "id": "abc123hex...",
  "pubkey": "newbie-hex-pubkey",
  "created_at": 1741557600,
  "kind": 8131,
  "tags": [
    ["e", "slot_open_1"],
    ["intensity", "3"],
    ["p", "moses-hex-pubkey"]
  ],
  "content": "",
  "sig": "signature-hex..."
}
```

---

## Prisma Seed Script Location

Once `packages/api/` is initialized:
```
packages/api/prisma/seed.ts   ← import and insert all fixtures above
```

Run with:
```bash
pnpm --filter api prisma db seed
```
