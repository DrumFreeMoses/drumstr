---
Note-type: spec
status: Backlog
tags:
  - drumstr
  - mobile
  - expo
  - reactnative
creation: 2026-03-07
modified: 2026-03-07
---

## AI Agent Rules
1. Do not change structure or delete sections — only add content.
2. TDD (red/green/refactor). Use Jest + React Native Testing Library.
3. Favor reusable screen containers and composable UI components.
4. Simple navigation over complex deep-link routing. Consult human before adding complexity.
5. If a screen component exceeds ~150 lines, extract sub-components.
6. Make decisions for longevity. Mobile changes are expensive — get screens right before wiring data.

---

# MOBILE-APP-SPEC — Expo / React Native Mobile App

## 1. Project Details

| Field | Value |
|---|---|
| Spec | MOBILE-APP-SPEC |
| Package | apps/mobile |
| Depends On | BACKEND-API-SPEC, NOSTR-IDENTITY-SPEC, EVENT-MGMT-SPEC, MONEYDEVKIT-SPEC |
| Runtime | Expo SDK 52+ (React Native), TypeScript |
| Platforms | iOS + Android |
| Navigation | React Navigation v7 |
| State | Zustand |
| Auth | Nostr keypair (stored in Expo SecureStore) |

## 2. End Goal

A polished, mobile-first iOS and Android app for Drumstr. Users create a Nostr identity, browse events, request sessions, join live A/V drumming rooms, and pay facilitators — all from their phone. The app is the primary interface for most users.

## 3. Current Implementation Details

Repository initialized at `~/repos/drumstr`. Package location: `apps/mobile/` — directory does not yet exist (scaffold pending).

**Repo current state:**
```
~/repos/drumstr/
├── apps/web/              ← placeholder
├── packages/shared/       ← placeholder
├── docs/specs/            ← all specs seeded (2026-03-09)
└── README.md
```
`apps/mobile/` not yet created.

## 4. Updated Implementation Details

```
apps/mobile/
├── app/                          # Expo Router file-based navigation
│   ├── (auth)/
│   │   ├── welcome.tsx           # Onboarding / generate or import keypair
│   │   └── import-key.tsx        # Import existing nsec
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab bar layout
│   │   ├── index.tsx             # Home — upcoming events list
│   │   ├── explore.tsx           # Browse facilitators + available times
│   │   ├── request.tsx           # Request an event (form)
│   │   └── profile.tsx           # My profile, wallet, settings
│   ├── events/
│   │   ├── [id].tsx              # Event detail page
│   │   └── room.tsx              # A/V room (WebView → av.drumstr.app)
│   ├── checkout/
│   │   └── [sessionId].tsx       # Payment WebView (MoneyDevKit checkout)
│   └── _layout.tsx               # Root layout (auth guard)
├── components/
│   ├── EventCard.tsx             # Reusable event card component
│   ├── FacilitatorCard.tsx       # Reusable facilitator card
│   ├── AvailabilitySlot.tsx      # Time slot display
│   └── PaymentButton.tsx         # Lightning payment trigger
├── store/
│   ├── auth.store.ts             # Nostr keypair, JWT
│   ├── events.store.ts           # Event list, current event
│   └── user.store.ts             # Profile data
├── lib/
│   ├── api.ts                    # Axios API client (uses JWT)
│   ├── nostr.ts                  # Thin wrapper over packages/nostr
│   └── notifications.ts          # Firebase push notification setup
├── constants/
│   └── theme.ts                  # Colors, typography, spacing
├── tests/
│   ├── EventCard.test.tsx
│   ├── auth.store.test.ts
│   └── events.store.test.ts
├── app.json                      # Expo config
├── package.json
└── tsconfig.json
```

## 5. Current Proposed Solution

### Navigation Structure

```
Root (auth guard)
├── (auth) — shown when no keypair stored
│   ├── Welcome (generate new key OR import existing)
│   └── ImportKey
└── (tabs) — shown when keypair exists
    ├── Home (upcoming confirmed events)
    ├── Explore (browse facilitators, request event)
    ├── Request (event request form)
    └── Profile (my profile, wallet, settings)
        
Event Detail (modal over tabs)
A/V Room (full-screen WebView)
Checkout (full-screen WebView — MoneyDevKit)
```

### Auth Store (Zustand)

```typescript
// store/auth.store.ts
import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

interface AuthState {
  npub: string | null
  jwt: string | null
  isAuthenticated: boolean
  generateKeypair: () => Promise<void>
  importKeypair: (nsec: string) => Promise<void>
  authenticate: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  npub: null,
  jwt: null,
  isAuthenticated: false,
  generateKeypair: async () => {
    const { npub, nsec } = generateKeypair() // from packages/nostr
    await SecureStore.setItemAsync('nsec', nsec)
    set({ npub })
  },
  // ...
}))
```

### A/V Room (WebView)

```typescript
// app/events/room.tsx
import { WebView } from 'react-native-webview'

export default function RoomScreen() {
  const { event } = useLocalSearchParams()
  const roomUrl = event.hivetalkRoomId  // e.g. https://av.drumstr.app/join?room=...

  return (
    <WebView
      source={{ uri: roomUrl }}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      style={{ flex: 1 }}
    />
  )
}
```

### Payment WebView

```typescript
// app/checkout/[sessionId].tsx
import { WebView } from 'react-native-webview'

export default function CheckoutScreen() {
  const { sessionId } = useLocalSearchParams()
  const checkoutUrl = `https://drumstr.app/checkout/${sessionId}`

  const handleNavChange = (navState: WebViewNavigation) => {
    if (navState.url.includes('/checkout/success')) {
      // Payment confirmed — navigate back
      router.replace('/events/' + eventId)
    }
  }

  return (
    <WebView
      source={{ uri: checkoutUrl }}
      onNavigationStateChange={handleNavChange}
      style={{ flex: 1 }}
    />
  )
}
```

### Key Libraries

```json
{
  "dependencies": {
    "expo": "~52.0",
    "expo-router": "~4.0",
    "expo-secure-store": "~14.0",
    "expo-notifications": "~0.29",
    "react-native-webview": "^13",
    "react-navigation": "^7",
    "@react-navigation/bottom-tabs": "^7",
    "zustand": "^5",
    "axios": "^1",
    "@drumstr/shared": "workspace:*",
    "@drumstr/nostr": "workspace:*"
  }
}
```

## 6. Next Steps

1. **Initialize Expo project**
   ```bash
   cd apps/mobile
   npx create-expo-app . --template blank-typescript
   pnpm add expo-router expo-secure-store expo-notifications react-native-webview zustand axios
   ```

2. **Write auth store tests (TDD)**
   ```typescript
   describe('auth.store', () => {
     it('generates a valid keypair and stores nsec securely', ...)
     it('authenticates via Nostr challenge flow and receives JWT', ...)
     it('returns isAuthenticated=false when no keypair stored', ...)
   })
   ```

3. **Implement auth store** — `generateKeypair`, `importKeypair`, `authenticate`, `logout`.

4. **Build Welcome screen** — two CTAs: "Create New Identity" and "Import Existing Key". Simple, visually bold.

5. **Build tab layout** with bottom tab bar: Home, Explore, Request, Profile.

6. **Build Home screen** — fetch `GET /events`, render list of `EventCard` components.
   - `EventCard`: show title, facilitator name/avatar, date, participant count, join button.

7. **Build Explore screen** — fetch `GET /facilitators`, show available facilitators with next available slot.

8. **Build Request screen** — form: select facilitator, preferred time, optional message, optional Zap amount.

9. **Build Event Detail** — show event info + "Join Room" button → opens `room.tsx` WebView.

10. **Build Profile screen** — show npub (truncated), display name, Lightning address, key backup option.

11. **Set up push notifications** — register device token with backend on login, handle foreground/background notifications.

12. **Test on iOS Simulator and Android Emulator** before building for physical device.

## 7. Current Unresolved Issues

- **WebRTC in WebView (iOS):** iOS WebKit restricts microphone/camera access in WKWebView. May need to set `allowsInlineMediaPlayback: true` and request permissions explicitly. Test thoroughly.
- **MoneyDevKit mobile:** No native React Native SDK — WebView checkout flow confirmed for v1. Verify UX is smooth.
- **Key backup UX:** Users must be warned about private key loss. Show backup prompt after key generation.
- **Expo vs bare React Native:** Using Expo managed workflow for simplicity. If WebRTC in WebView requires bare workflow, evaluate migration cost.

## 8. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-03-07 | Moses / Copilot | Initial spec created |
