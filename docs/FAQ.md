# Drumstr FAQ

## General

### What is Drumstr?
Drumstr is a **community-owned platform** for real-time, on-demand facilitated drumming sessions. Every session is 10 minutes, free to join, and powered by Bitcoin Lightning.

### How does it work?
1. **Join a Drum Block** — Click a room link at the scheduled time
2. **Drum Together** — 10 minutes of collective drumming via video/audio
3. **Optional Tip** — Support the facilitator with a Lightning payment (sliding scale: 0 sats → ∞)
4. **Come Back** — Do it again tomorrow

### Is it free?
**Yes!** Joining Drum Blocks is always free. The tip after is completely optional and sliding-scale (you decide the amount).

### Do I need experience?
**No.** Drumming is for everyone. All levels welcome. No prior experience needed.

### What equipment do I need?
- **Drum:** Any hand drum (djembe, conga, bongo, cajon, or even a bucket/pillow)
- **Device:** Phone, tablet, or computer with camera and microphone
- **Internet:** Stable connection (5+ Mbps recommended)
- **Software:** Just click the room link (no app install required)

---

## Payments

### What's Lightning?
Lightning is a fast, low-cost payment network built on Bitcoin. Instead of paying via credit card, you pay sats (tiny Bitcoin units) in milliseconds with near-zero fees.

### Is this real money?
**Yes.** Bitcoin Lightning is real money. Every sat you tip is a real Bitcoin transaction. Self-custodial (you hold your own keys) and instant.

### How do I pay?
1. After the Drum Block, you'll see a QR code or payment link
2. Scan with a Lightning wallet (CashApp, Alby, Wallet of Satoshi, etc.)
3. Enter the amount (or use the suggested amount)
4. Confirm payment
5. Done! Instant settlement.

### What if I don't have a Lightning wallet?
You can still join Drum Blocks for free! The tip is optional. If you want to tip, you'll need a Lightning wallet. Popular options:
- **CashApp** (US) — easiest for beginners
- **Alby** (global) — Nostr integration
- **Wallet of Satoshi** (global) — simple, beginner-friendly
- **Phoenix** (global) — self-custodial

### What's the split?
- **80%** goes to the facilitator (the person leading the drumming)
- **20%** goes to DFE (the platform, for maintenance and development)

### Can I tip more?
**Yes!** The sliding scale is 0 sats → ∞. You decide how much to tip based on your experience and means.

### Can I tip less?
**Yes!** The minimum is 0 sats (free). No tip is totally fine — we're glad you're here.

---

## Identity & Privacy

### What's Nostr?
Nostr is a **decentralized protocol** for identity and social communication. Your identity is tied to a Bitcoin keypair (public/private key), not a username or email. Learn more at [nostr.com](https://nostr.com).

### Do I need to sign up?
**No.** No signup required. No email. No password. Just click the room link and join.

### How do I get a Nostr identity?
1. Download a Nostr client (Damus, Primal, or web client)
2. Generate a keypair (public + private key)
3. Your public key (npub) is your identity
4. Your private key (nsec) is your secret (never share it!)

**Note:** You can join Drum Blocks without a Nostr identity. It's only needed for tipping (optional).

### Is my data private?
**Yes.** We don't track personal data. No email. No phone. No name. Just your Nostr pubkey (if you choose to use one). Tips are pseudonymous (linked to your pubkey, not your identity).

### Can I remain anonymous?
**Yes.** You can join Drum Blocks completely anonymously. If you tip, your pubkey is visible (not your real name). You can generate a new keypair anytime for fresh anonymity.

---

## Facilitation

### Can I facilitate?
**Yes!** We're recruiting facilitators. You receive 80% of tips. Open an issue on [GitHub](https://github.com/drumstr/drumstr/issues) or email us. Training provided.

### What does a facilitator do?
- Lead a 10-minute drumming session
- Welcome participants
- Guide the rhythm (simple patterns, call-and-response)
- Encourage community
- Receive tips (80% of total)

### Do I need to be a professional drummer?
**No.** Basic drumming skills are enough. The focus is on community, not perfection. Simple rhythms work great.

### How do I get paid?
- Tips go to your Lightning wallet (you set this up in your facilitator profile)
- 80% of total tips from your sessions go to you
- Instant settlement via Lightning Network

### Can I choose my schedule?
**Yes.** You choose which Drum Blocks to facilitate. Set your availability in your facilitator profile.

---

## Community

### How do I join the community?
- **Drum Blocks:** Join daily at Noon Mountain Time
- **GitHub:** [github.com/drumstr/drumstr](https://github.com/drumstr/drumstr)
- **Nostr:** Follow @drumstr (pubkey: npub1xxxxx)
- **Discussions:** [GitHub Discussions](https://github.com/drumstr/drumstr/discussions)

### How do I contribute?
- **Code:** Fork the repo, submit a PR
- **Design:** Logo, brand, UI/UX feedback
- **Content:** Documentation, tutorials, videos
- **Community:** Engage in discussions, help others
- **Facilitation:** Lead Drum Blocks

### Is there a code of conduct?
**Yes.** Be respectful. We're building together. No harassment, discrimination, or hate speech.

---

## Technical

### What video platform do you use?
**MiroTalk SFU** (public demo) or **HiveTalk** (Nostr-native). Both support 100+ participants with excellent audio/video quality.

### Do I need to install anything?
**No.** Just click the room link. Works in Chrome, Firefox, Safari, or Edge. No app install required.

### What if my audio/video doesn't work?
1. Check browser permissions (camera/microphone access)
2. Try a different browser
3. Check internet connection
4. Restart browser
5. Ask in chat for help

### Is there a mobile app?
**Not yet.** Coming in Phase 2 (Q3 2026). For now, use the web app (mobile-optimized).

### Is there a desktop app?
**Not yet.** Coming in Phase 3 (Q4 2026). For now, use the web app.

---

## Support

### How do I get help?
- **FAQ:** Check this page first
- **GitHub Issues:** [Open an issue](https://github.com/drumstr/drumstr/issues/new)
- **Discussions:** [Ask in discussions](https://github.com/drumstr/drumstr/discussions/new)
- **Nostr:** Tag @drumstr in a post

### How do I report a bug?
[Open an issue](https://github.com/drumstr/drumstr/issues/new) with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

### How do I suggest a feature?
[Start a discussion](https://github.com/drumstr/drumstr/discussions/new) with:
- Feature description
- Use case
- Benefits
- Any implementation ideas

---

## Roadmap

### What's the current status?
**Pre-Alpha (MVP Phase 0)** — Launching daily Drum Blocks next week.

### What's coming next?
- **Phase 1 (Q2 2026):** Core platform (backend, web app, payments)
- **Phase 2 (Q3 2026):** Mobile app (iOS + Android)
- **Phase 3 (Q4 2026):** Community features (matching, leaderboards)
- **Phase 4 (Q1 2027):** Ecosystem (marketplace, merchandise)
- **Phase 5 (Q2 2027+):** Scaling (enterprise, API, franchise)

### How can I influence the roadmap?
Engage in [GitHub Discussions](https://github.com/drumstr/drumstr/discussions). Vote on features. Suggest ideas. The roadmap is public and community-driven.

---

## Still Have Questions?

[Open a discussion](https://github.com/drumstr/drumstr/discussions/new) and we'll answer it!

---

*Last updated: March 2026*
