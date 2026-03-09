# UI Wireframes — Drumstr

Text-based wireframes for key screens. Mobile-first (375px). All times shown in user's local timezone alongside block height.

---

## 1. Home Screen (Mobile)

```
┌─────────────────────────────┐
│ 🥁 DRUMSTR          [npub▼] │
├─────────────────────────────┤
│  Mon Mar 09  7:43 PM MST    │
│  ⛏ ~Block 889,412           │
│  Next slot in: 7 min 22 sec │
│  [▓▓▓▓▓░░░░░] Slot 5 of 6   │
├─────────────────────────────┤
│  🔥 LIVE NOW                │
│ ┌───────────────────────────┐│
│ │ Fire Rhythm w/ Moses      ││
│ │ 🧑 14 drumming  ⚡ 1-block ││
│ │ [JOIN ROOM →]             ││
│ └───────────────────────────┘│
├─────────────────────────────┤
│  UPCOMING SLOTS              │
│ ┌───────────────────────────┐│
│ │ ⏰ 8:00 PM  •  1 block    ││
│ │ Earth Rhythm — Requested  ││
│ │ 🥁 5 callers  ⚡ 27 energy ││
│ │ [DRUM CALL]  [Details]    ││
│ └───────────────────────────┘│
│ ┌───────────────────────────┐│
│ │ ⏰ 9:00 PM  •  6 blocks   ││
│ │ Full Transformation       ││
│ │ 🥁 2 callers  ⚡ 8 energy  ││
│ │ [DRUM CALL]  [Details]    ││
│ └───────────────────────────┘│
├─────────────────────────────┤
│  [🏠 Home] [🔍 Explore]      │
│  [🥁 Call] [👤 Profile]      │
└─────────────────────────────┘
```

---

## 2. Drum Call Screen (Modal)

```
┌─────────────────────────────┐
│        🥁 DRUM CALL         │
│    Earth Rhythm · 8:00 PM   │
├─────────────────────────────┤
│  How urgently do you want   │
│  to drum right now?         │
│                             │
│  ┌─────────────────────────┐│
│  │  1  ░  2  ░  3  ░  4  ░ 5 ││ ← slider
│  └─────────────────────────┘│
│                             │
│  ③  KEEN — I really         │
│     want this session       │
│     Suggested Zap: 100 sats │
│                             │
│  Community energy so far:   │
│  ████████░░░░░░░  27/50     │
│  5 unique callers           │
│                             │
│  [🥁 SEND DRUM CALL]        │
│  [Cancel]                   │
│                             │
│  ─────────────────────────  │
│  💡 What's a Bitcoin block? │
└─────────────────────────────┘
```

---

## 3. Active A/V Room (Full Screen)

```
┌─────────────────────────────┐
│ 🥁 Fire Rhythm · Block 1/1  │
│ ⛏ ~889,412  •  8:00→8:10 PM│
├─────────────────────────────┤
│                             │
│   [WebView → av.drumstr.app]│
│                             │
│   ┌──────────┐ ┌──────────┐ │
│   │  Moses   │ │  You     │ │
│   │ 🎙 ████  │ │ 🎙 ███   │ │
│   └──────────┘ └──────────┘ │
│   ┌──────────┐ ┌──────────┐ │
│   │ Drumr2   │ │ Drumr3   │ │
│   └──────────┘ └──────────┘ │
│                             │
├─────────────────────────────┤
│ 🔇 Mute  🥁 Drum Mode OFF   │
│           [Toggle →]        │
│ [⚡ Zap Moses]  [✕ Leave]   │
└─────────────────────────────┘
```

Note: "Drum Mode" toggle = noise cancellation off. See HIVETALK-AV-SPEC §7.

---

## 4. Explore / Facilitators Screen

```
┌─────────────────────────────┐
│ 🔍 EXPLORE FACILITATORS     │
├─────────────────────────────┤
│ ┌───────────────────────────┐│
│ │ 👤 Moses                  ││
│ │ Rhythmic Resonance Fac.   ││
│ │ ✅ Available tonight       ││
│ │ Next: 8:00 PM · 1 block   ││
│ │ [REQUEST SESSION]         ││
│ └───────────────────────────┘│
│ ┌───────────────────────────┐│
│ │ 👤 Drumr Giselle          ││
│ │ Five Element Facilitator  ││
│ │ 🕐 Next avail: Fri 6 PM   ││
│ │ [REQUEST SESSION]         ││
│ └───────────────────────────┘│
└─────────────────────────────┘
```

---

## 5. Profile Screen

```
┌─────────────────────────────┐
│         MY PROFILE          │
├─────────────────────────────┤
│  👤  Moses                  │
│  npub1abc...xyz  [Copy]     │
│  ⚡ moses@getalby.com       │
│                             │
│  [Edit Profile]             │
├─────────────────────────────┤
│  MY DRUM HISTORY            │
│  • Mar 09 · Fire Rhythm ✅  │
│  • Mar 07 · Earth 1-block ✅│
│  • Mar 05 · Full Session ✅ │
├─────────────────────────────┤
│  🔐 KEY BACKUP              │
│  ⚠️  Back up your nsec now!  │
│  [Show Recovery Key]        │
├─────────────────────────────┤
│  [Settings]  [Logout]       │
└─────────────────────────────┘
```

---

## 6. Welcome / Onboarding (Auth)

```
┌─────────────────────────────┐
│                             │
│         🥁 DRUMSTR          │
│                             │
│   Virtual Group Drumming    │
│   on Bitcoin & Nostr        │
│                             │
│  ─────────────────────────  │
│                             │
│  [⚡ CREATE NEW IDENTITY]   │
│    Generate a Nostr keypair │
│                             │
│  [🔑 IMPORT EXISTING KEY]   │
│    Paste your nsec          │
│                             │
│  ─────────────────────────  │
│  🔒 Self-sovereign identity │
│     No email. No password.  │
│     You own your keys.      │
│                             │
└─────────────────────────────┘
```

---

## 7. BlockTimeDisplay Component (reusable)

```
┌───────────────────────────────────┐
│ Mon Mar 09, 2026  7:43 PM MST     │  ← local datetime (always primary)
│ ⛏ ~Block 889,412                  │  ← block height (educational)
│ Next drum slot in: 7 min 22 sec   │  ← countdown to xx:50
│ [▓▓▓▓▓▓▓░░░] Slot 5 of 6          │  ← within-hour progress
│ 💡 What's a Bitcoin block?        │  ← newbie tooltip
└───────────────────────────────────┘
```

Compact variant (for event cards):
```
⛏ ~889,412  •  8:00 PM MST  •  1-block
```
