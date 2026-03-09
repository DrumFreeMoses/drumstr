# Mock API Reference

Sample request/response pairs for all Drumstr REST API endpoints.
Use these for frontend development and testing before the backend is live.

Base URL: `https://api.drumstr.app` (prod) / `http://localhost:3001` (dev)

---

## Authentication

### POST /auth/challenge
```json
// Request
{ "npub": "npub1abc123..." }

// Response 200
{ "challenge": "a3f8c2e1d9b7..." }
```

### POST /auth/verify
```json
// Request
{
  "npub": "npub1abc123...",
  "signedEvent": {
    "id": "abc...",
    "pubkey": "hex-pubkey",
    "created_at": 1741557600,
    "kind": 22242,
    "tags": [["challenge", "a3f8c2e1d9b7..."]],
    "sig": "hex-sig..."
  }
}

// Response 200
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }

// Response 401
{ "error": "Invalid Nostr signature" }
```

---

## Users

### GET /users/:npub
```json
// Response 200
{
  "id": "cldx1a2b3c",
  "npub": "npub1abc123...",
  "displayName": "Drumr Moses",
  "bio": "Rhythmic Resonance Facilitator | DFE",
  "avatarUrl": "https://cdn.drumstr.app/avatars/moses.jpg",
  "isFacilitator": true,
  "createdAt": "2026-03-09T00:00:00Z"
}
```

---

## Open Slots

### GET /slots
```json
// Response 200
[
  {
    "id": "slot_1a2b3c",
    "scheduledAt": "2026-03-09T20:00:00Z",
    "slotCount": 1,
    "status": "OPEN",
    "totalEnergy": 12,
    "uniqueCallers": 4,
    "activationThreshold": 5,
    "facilitatorId": null,
    "drumCallCount": 4
  },
  {
    "id": "slot_2b3c4d",
    "scheduledAt": "2026-03-09T21:00:00Z",
    "slotCount": 6,
    "status": "ACTIVATING",
    "totalEnergy": 27,
    "uniqueCallers": 8,
    "activationThreshold": 5,
    "facilitatorId": null,
    "drumCallCount": 8
  }
]
```

---

## Drum Calls

### POST /drum-calls
```json
// Request
{
  "slotId": "slot_1a2b3c",
  "intensity": 3,
  "nostrEventId": "hex-nostr-event-id"
}

// Response 201
{
  "id": "dc_9z8y7x",
  "callerNpub": "npub1abc123...",
  "slotId": "slot_1a2b3c",
  "intensity": 3,
  "createdAt": "2026-03-09T19:43:00Z",
  "slotTotalEnergy": 15,
  "slotUniqueCallers": 5,
  "activated": true
}

// Response 409 (already called, can update intensity)
{ "error": "Already submitted a Drum Call for this slot", "existingId": "dc_abc..." }

// Response 429 (rate limited)
{ "error": "Drum Call rate limit exceeded (3 per hour)" }
```

### GET /slots/:id/drum-calls
```json
// Response 200
{
  "slotId": "slot_1a2b3c",
  "totalEnergy": 15,
  "uniqueCallers": 5,
  "calls": [
    { "callerNpub": "npub1abc...", "intensity": 5, "createdAt": "2026-03-09T19:40:00Z" },
    { "callerNpub": "npub1def...", "intensity": 3, "createdAt": "2026-03-09T19:41:00Z" },
    { "callerNpub": "npub1ghi...", "intensity": 2, "createdAt": "2026-03-09T19:42:00Z" }
  ]
}
```

### PUT /slots/:id/claim (facilitator only)
```json
// Response 200
{
  "id": "slot_1a2b3c",
  "status": "CONFIRMED",
  "facilitatorId": "cldx_facilitator",
  "hivetalkRoomId": "https://av.drumstr.app/room/slot_1a2b3c",
  "scheduledAt": "2026-03-09T20:00:00Z"
}
```

---

## Events

### GET /events
```json
// Response 200
[
  {
    "id": "evt_abc123",
    "title": "Drum session with Moses",
    "description": "1-block earth rhythm for focus and clarity",
    "scheduledAt": "2026-03-09T20:00:00Z",
    "slotCount": 1,
    "durationMins": 10,
    "status": "CONFIRMED",
    "blockHeightAtStart": null,
    "maxParticipants": 20,
    "hivetalkRoomId": "https://av.drumstr.app/room/evt_abc123",
    "facilitator": {
      "npub": "npub1moses...",
      "displayName": "Moses",
      "avatarUrl": "https://cdn.drumstr.app/avatars/moses.jpg"
    }
  }
]
```

### POST /events (facilitator only)
```json
// Request
{
  "title": "6-Block Fire Rhythm — Full Transformation",
  "description": "60 minutes of elemental drumming across all 5 elements",
  "scheduledAt": "2026-03-10T21:00:00Z",
  "slotCount": 6,
  "maxParticipants": 20,
  "slotId": "slot_2b3c4d"
}

// Response 201
{
  "id": "evt_new123",
  "status": "CONFIRMED",
  "hivetalkRoomId": "https://av.drumstr.app/room/evt_new123"
}
```

---

## Facilitators

### GET /facilitators
```json
// Response 200
[
  {
    "npub": "npub1moses...",
    "displayName": "Moses",
    "bio": "Rhythmic Resonance Facilitator",
    "avatarUrl": "https://cdn.drumstr.app/avatars/moses.jpg",
    "nextAvailable": "2026-03-09T20:00:00Z",
    "lightningAddress": "moses@getalby.com"
  }
]
```

### PUT /facilitators/availability (facilitator only)
```json
// Request
{
  "windows": [
    { "availableFrom": "2026-03-10T18:00:00Z", "availableTo": "2026-03-10T22:00:00Z" },
    { "availableFrom": "2026-03-11T18:00:00Z", "availableTo": "2026-03-11T22:00:00Z" }
  ]
}

// Response 200
{ "updated": 2 }
```

---

## Health

### GET /health
```json
// Response 200
{
  "status": "ok",
  "db": "connected",
  "relay": "connected",
  "timestamp": "2026-03-09T20:00:00Z"
}
```
