---
title: Drumstr Launch Readiness Plan — SOLO MODE
status: Planning
target_launch: Next Week (Daily Drum Blocks)
mode: Phased build (prioritized for solo execution)
update_date: 2026-03-27
---

# Drumstr Launch Readiness Plan — SOLO MODE

## Overview

Execute everything needed to launch daily Drum Blocks next week with **solo effort** (you alone). Prioritized for maximum impact with minimum custom code.

**Daily Block Schedule:** Noon Mountain Time (11 AM PST / 2 PM EST)

**Success Criteria:** First Drum Block launches Monday with:
- Live landing page (dfe.org/drumstr)
- HiveTalk/MiroTalk room ready (100-capacity)
- MoneyDevKit payment workflow (manual, sliding-scale, 80/20 split)
- GitHub repo open (inviting contributors)
- Repeatable daily operations workflow

---

## STRATEGY FOR SOLO EXECUTION

### Key Principle: Leverage Existing Tools
- **Logo:** AI-generated (Midjourney, 2 hours)
- **Landing Page:** Static HTML (copy-paste template, 3-4 hours)
- **Payments:** Manual (MoneyDevKit dashboard, no custom backend code)
- **Video:** Public MiroTalk demo (zero setup)
- **GitHub:** Template README/issues (2 hours)

### Time Budget: ~20-25 hours solo
- **Feasible over 2-3 days** if focused
- **Spread over 1-2 weeks** if part-time

---

## PHASE 1: PREPARATION (2-3 hours)

### 1.1 MoneyDevKit Account Setup

**Prerequisite — Do this first!**

1. **Create account:** https://moneydevkit.com
   - Sign up → verify email
   - Generate credentials: `MDK_ACCESS_TOKEN`, `MDK_MNEMONIC`, `MDK_WEBHOOK_SECRET`
   - **CRITICAL:** Back up mnemonic securely (offline storage)

2. **Save credentials locally** (you'll reference these)
   ```bash
   export MDK_ACCESS_TOKEN="your_token_here"
   export MDK_MNEMONIC="word1 word2 ... word12"
   export MDK_WEBHOOK_SECRET="your_webhook_secret"
   export DFE_LIGHTNING_ADDRESS="your_lightning_address@walletofsatoshi.com"
   ```

3. **Verify credentials work**
   ```bash
   curl -X GET https://api.moneydevkit.com/v1/account \
     -H "Authorization: Bearer $MDK_ACCESS_TOKEN"
   ```

4. **Create test invoice** (in MoneyDevKit dashboard)
   - Amount: 1,000 sats
   - Note: "Drum Block Tip — Week 1 Test"
   - Save QR code screenshot

**Effort:** 30 min  
**Blocker Risk:** LOW (if account creation delays, use fallback: Alby or manual splits Week 2)

---

### 1.2 Confirm Tech Stack

| Component | Choice | Why |
|-----------|--------|-----|
| Landing Page | Static HTML + CSS | Fast, no server needed, easy to update |
| Logo | AI-generated (Midjourney) | 2 hours, iterate quickly, low cost |
| Video Platform | MiroTalk demo (public) | Zero setup, 100-person capacity, tested |
| Payment Tracking | Manual (MoneyDevKit dashboard + spreadsheet) | No database schema needed Week 1 |
| GitHub Issues | 5 pre-written templates | Copy-paste, ready to launch |
| Nostr Posting | Manual (via Nostr client) | Damus, Primal, or web client — your choice |

---

### 1.3 Decisions to Confirm

- [ ] Daily block time confirmed: **Noon Mountain Time (11 AM PST / 2 PM EST)**
- [ ] GitHub username ready? (personal or org?)
- [ ] Nostr identity ready? (existing pubkey or generate new one?)
- [ ] Lightning wallet ready? (where will DFE tips go?)
- [ ] Payment tracking method? (spreadsheet, MoneyDevKit dashboard, or custom form?)

**Effort:** 15 min (decisions only, no code)

---

## PHASE 2: BRAND & VISUALS (3-4 hours)

### 2.1 Logo Design (1-2 hours)

**Option A: Midjourney (Recommended — fastest, iterable)**

1. Go to https://midjourney.com (sign up if needed, $10-30/month or pay-per-image)
2. Run prompt:
   ```
   hand hitting djembe drum, action shot, vibrant energetic colors, 
   playful cartoonish style, clean modern design, isolated white background
   ```
3. Generate ~4 variations
4. Pick best + upscale to 1024x1024
5. Download: PNG + transparent version

**Option B: Adobe Express Free**
- Go to https://express.adobe.com
- Design → "Logo" template
- Search "drum" assets, customize
- Export PNG

**Option C: Fiverr or similar**
- Budget: $50-150
- Timeline: 24-48 hours
- Your brief: "Hand hitting drum, vibrant, energetic, dynamic action shot"

**Deliverables needed:**
- Square (512x512) — favicon
- Horizontal (1200x400) — header
- SVG or PNG (transparent background)

**Recommendation:** Midjourney (Option A) — 1.5 hours total, iterate quickly, keep control.

**Timeline:** 1-2 hours

---

### 2.2 Color Palette (30 min)

Pick a vibrant, energetic palette:

**Option A: Warm Energy**
```
Primary:    #FF6B35 (Warm Orange)
Secondary:  #004E89 (Deep Blue)
Accent:     #F77F00 (Bright Orange)
Light:      #FFFFFF
Dark:       #1A1A1A
```

**Option B: Electro**
```
Primary:    #00D9FF (Cyan)
Secondary:  #FF006E (Hot Pink)
Accent:     #FB5607 (Orange)
Light:      #FFFFFF
Dark:       #121212
```

**Option C: Sunset**
```
Primary:    #FF6B9D (Rose)
Secondary:  #C44569 (Deep Rose)
Accent:     #FFA502 (Golden)
Light:      #FFFFFF
Dark:       #1F1F1F
```

**Action:** Pick one. Save as comment in landing page CSS (you'll reference it).

**Timeline:** 15 min

---

### 2.3 Typography (20 min)

Use free Google Fonts:

**Heading Font:** `Fredoka` (modern, playful, bold)
```html
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&display=swap" rel="stylesheet">
```

**Body Font:** `Inter` (clean, readable, professional)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**Copy to landing page `<head>` section** (provided in Phase 3).

**Timeline:** 10 min (just copy-paste URLs)

---

### 2.4 Hero Animation (optional, 0-1 hour)

**Option A: Skip for MVP** (just static image)
- Use your logo or a screenshot of a drumming session
- 1-minute setup

**Option B: Lottie Animation** (lightweight, looping)
- Search LottieFiles.com for "drumming" or "rhythm"
- Download free animation (JSON)
- Embed with `<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.6/lottie.min.js"></script>`

**Option C: MP4 Video** (3-5 sec loop)
- Create short clip (phone video, screen record, or AI-generated)
- Upload to landing page `/images/` folder
- Embed as `<video autoplay muted loop>`

**Recommendation for MVP:** **Skip or use static image** (Option A). Add animation Week 2.

**Timeline:** 0-1 hour

---

### 2.5 Supporting Images (optional, 1-2 hours)

**Background:** Abstract rhythm pattern (drums, waves, colors)
- Source: Unsplash.com search "drum" or "rhythm"
- Or AI-generate: Midjourney: `abstract drum rhythm pattern, waves, vibrant colors, seamless`
- Resize to 1200x1200, compress with TinyPNG

**Community vibe:** People drumming together, diverse, joyful
- Source: Unsplash search "community music" or "drum circle"
- Or AI-generate: Midjourney: `diverse group smiling playing drums together, community, joyful`
- Resize to 1200x800, compress

**Recommendation:** Use Unsplash (free, fast, pre-optimized). Skip AI images if time-pressed.

**Timeline:** 1-2 hours (if doing images; 0 if using Unsplash only)

---

**Brand Package Checklist:**
- [ ] Logo (SVG + PNG 512x512)
- [ ] Color palette (hex codes saved in CSS comment)
- [ ] Typography (Google Fonts links copied)
- [ ] Hero animation (optional; skip for MVP)
- [ ] Background image (Unsplash or AI-generated, compressed)
- [ ] Community image (Unsplash or AI-generated, compressed)

**Total Brand Phase:** 3-4 hours (solo)

---

## PHASE 3: LANDING PAGE BUILD (5-6 hours)

### 3.1 Architecture Decision

**Recommendation: Static HTML + CSS** (no server, easy to update, fast)

**File structure:**
```
/home/username/public_html/drumstr/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/
    ├── logo.svg (from Phase 2)
    ├── bg-pattern.png (from Phase 2)
    └── community.jpg (from Phase 2)
```

**Deployment:** Upload via CPanel File Manager → live at `dfe.org/drumstr`

---

### 3.2 HTML Template (index.html)

**Copy-paste ready template below.** Customize sections marked `[CUSTOMIZE HERE]`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Drumstr — 10 minutes. Every day. After work. A global community drumming on Bitcoin. Nostr-native. Open source.">
  <title>Drumstr — Community Drumming on Bitcoin</title>
  <link rel="icon" type="image/svg+xml" href="images/logo.svg">
  
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  
  <!-- Custom Styles -->
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- HEADER -->
  <header class="header">
    <div class="container">
      <div class="header-content">
        <img src="images/logo.svg" alt="Drumstr" class="logo">
        <h1>Imagine Drumstr</h1>
        <p class="tagline">10 minutes. Every day. After work.</p>
      </div>
    </div>
  </header>

  <!-- HERO -->
  <section class="hero">
    <div class="container">
      <h2>A global community drumming on Bitcoin.</h2>
      <p class="hero-subtitle">Nostr-native. Open source. Voluntary tips via Lightning.</p>
      <div class="cta-group">
        <a href="#signup" class="btn btn-primary">Get Next Room Link</a>
        <a href="#about" class="btn btn-secondary">Learn More</a>
      </div>
    </div>
  </section>

  <!-- LIVE SIGNUP -->
  <section class="signup" id="signup">
    <div class="container">
      <h3>🥁 Next Drum Block</h3>
      <div class="block-info">
        <div class="block-detail">
          <p class="label">When:</p>
          <p id="next-time" class="value">Loading...</p>
        </div>
        <div class="block-detail">
          <p class="label">Attending:</p>
          <p class="value"><span id="count">0</span>/100</p>
        </div>
      </div>
      
      <a id="room-link" href="#" class="btn btn-primary btn-large">Join Room</a>
      <p class="footnote">No signup required. Free to join. Optional tip after.</p>
      
      <div class="upcoming">
        <h4>This Week's Blocks</h4>
        <ul id="upcoming-list">
          <li>Loading...</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- WHAT IS DRUMSTR -->
  <section class="about" id="about">
    <div class="container">
      <h3>What is Drumstr?</h3>
      <p>Drumstr is a community-owned platform for real-time, on-demand facilitated drumming sessions. Every session is 10 minutes, free to join, and powered by Bitcoin Lightning. We're building it openly on GitHub.</p>
      
      <div class="features">
        <div class="feature-card">
          <div class="feature-icon">🔓</div>
          <h4>Open Source</h4>
          <p>Code on GitHub. Contribute. Fork. Build your own version.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h4>Community-Owned</h4>
          <p>Run by facilitators and participants. Transparent splits. Fair pay.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h4>Bitcoin-Powered</h4>
          <p>Lightning Network. Instant payments. No middlemen. Self-custodial.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🌐</div>
          <h4>Nostr-Native</h4>
          <p>Decentralized identity. No password. No surveillance.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="how-it-works">
    <div class="container">
      <h3>How It Works</h3>
      <ol class="steps">
        <li>
          <h4>Join a Block</h4>
          <p>Click the room link above at the scheduled time.</p>
        </li>
        <li>
          <h4>Drum Together</h4>
          <p>10 minutes of collective drumming. No experience needed.</p>
        </li>
        <li>
          <h4>Optional Tip</h4>
          <p>Support the facilitator with a Lightning payment (sliding scale: 0 sats → ∞).</p>
        </li>
        <li>
          <h4>Vibe Check</h4>
          <p>Come back tomorrow. Build community.</p>
        </li>
      </ol>
    </div>
  </section>

  <!-- HELP US BUILD -->
  <section class="contribute">
    <div class="container">
      <h3>Help Us Build It</h3>
      <p>Drumstr is open source. Review the code, contribute features, help us think through the roadmap, or join as a facilitator.</p>
      <div class="cta-buttons">
        <a href="https://github.com/drumstr/drumstr" class="btn btn-primary">GitHub Repo</a>
        <a href="https://nostr.com" class="btn btn-secondary">Learn Nostr</a>
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="faq" id="faq">
    <div class="container">
      <h3>FAQ</h3>
      
      <div class="faq-item">
        <h4 onclick="toggleFAQ(this)">How does Drumstr work?</h4>
        <p>Join a Drum Block at the scheduled time. We drum together for 10 minutes. After, you can optionally support the facilitator with a Lightning payment (sliding scale: 0 sats and up). The facilitator receives 80%, and 20% goes to DFE (the platform).</p>
      </div>

      <div class="faq-item">
        <h4 onclick="toggleFAQ(this)">What's Lightning?</h4>
        <p>Lightning is a fast, low-cost payment network built on Bitcoin. Instead of paying via credit card, you pay sats (tiny Bitcoin units) in milliseconds with near-zero fees.</p>
      </div>

      <div class="faq-item">
        <h4 onclick="toggleFAQ(this)">Is joining free?</h4>
        <p>Yes! Joining Drum Blocks is always free. The tip after is completely optional and sliding-scale (you decide the amount).</p>
      </div>

      <div class="faq-item">
        <h4 onclick="toggleFAQ(this)">Do I need experience?</h4>
        <p>No. Drumming is for everyone. All levels welcome. No prior experience needed.</p>
      </div>

      <div class="faq-item">
        <h4 onclick="toggleFAQ(this)">Can I facilitate?</h4>
        <p>Yes! We're recruiting facilitators. You receive 80% of tips. Open an issue on GitHub or email us. Training provided.</p>
      </div>

      <div class="faq-item">
        <h4 onclick="toggleFAQ(this)">What's Nostr?</h4>
        <p>Nostr is a decentralized protocol for identity and social communication. Your identity is tied to a Bitcoin keypair (public/private key), not a username or email. Learn more at <a href="https://nostr.com" target="_blank">nostr.com</a>.</p>
      </div>

      <div class="faq-item">
        <h4 onclick="toggleFAQ(this)">Is this real money?</h4>
        <p>Yes. Bitcoin Lightning is real money. Every sat you tip is a real Bitcoin transaction. Self-custodial (you hold your own keys) and instant.</p>
      </div>

      <div class="faq-item">
        <h4 onclick="toggleFAQ(this)">Privacy?</h4>
        <p>No signup required. No email. No password. Join anonymously. Tips are pseudonymous (linked to your Nostr pubkey, not your name). We don't track personal data.</p>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <p>&copy; 2026 Drumstr. Built with ❤️ on Bitcoin and Nostr.</p>
      <div class="footer-links">
        <a href="https://github.com/drumstr/drumstr" target="_blank">GitHub</a>
        <a href="https://nostr.com" target="_blank">Nostr</a>
        <a href="https://dfe.org" target="_blank">DFE</a>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="js/script.js"></script>
</body>
</html>
```

---

### 3.3 CSS Styling (css/style.css)

```css
/* ============================================
   DRUMSTR LANDING PAGE — MAIN STYLES
   ============================================ */

/* COLOR PALETTE — CUSTOMIZE HERE */
:root {
  --primary: #FF6B35;          /* Change this to your primary color */
  --secondary: #004E89;        /* Change this to your secondary color */
  --accent: #F77F00;           /* Change this to your accent color */
  --light: #FFFFFF;
  --dark: #1A1A1A;
  --bg-light: #F5F5F5;
  --text: #333;
  --text-light: #666;
  --border: #E0E0E0;
}

/* RESET & BASE */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', sans-serif;
  color: var(--text);
  line-height: 1.6;
  background: var(--light);
  overflow-x: hidden;
}

h1, h2, h3, h4, h5 {
  font-family: 'Fredoka', sans-serif;
  font-weight: 700;
  line-height: 1.2;
}

a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--accent);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* ============================================
   HEADER
   ============================================ */

.header {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 60px 20px;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.header .logo {
  height: 100px;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.header h1 {
  font-size: 3.5em;
  margin-bottom: 10px;
  letter-spacing: -1px;
}

.header .tagline {
  font-size: 1.3em;
  opacity: 0.95;
  font-weight: 500;
}

/* ============================================
   HERO
   ============================================ */

.hero {
  background: linear-gradient(180deg, var(--bg-light) 0%, white 100%);
  padding: 80px 20px;
  text-align: center;
}

.hero h2 {
  font-size: 2.2em;
  margin-bottom: 15px;
  color: var(--dark);
}

.hero .hero-subtitle {
  font-size: 1.2em;
  color: var(--text-light);
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-group {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ============================================
   SIGNUP SECTION
   ============================================ */

.signup {
  padding: 70px 20px;
  background: white;
  border-top: 5px solid var(--primary);
  text-align: center;
}

.signup h3 {
  font-size: 2em;
  margin-bottom: 40px;
}

.block-info {
  background: var(--bg-light);
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.block-detail {
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.block-detail .label {
  font-size: 0.9em;
  color: var(--text-light);
  margin-bottom: 8px;
}

.block-detail .value {
  font-size: 1.5em;
  font-weight: 600;
  color: var(--primary);
}

.footnote {
  font-size: 0.95em;
  color: var(--text-light);
  margin: 20px 0 40px;
}

.upcoming {
  margin-top: 50px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.upcoming h4 {
  font-size: 1.2em;
  margin-bottom: 20px;
  text-align: center;
}

.upcoming ul {
  list-style: none;
}

.upcoming li {
  padding: 12px 16px;
  background: var(--bg-light);
  border-radius: 6px;
  margin-bottom: 8px;
  border-left: 4px solid var(--primary);
}

/* ============================================
   BUTTONS
   ============================================ */

.btn {
  display: inline-block;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1em;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(255, 107, 53, 0.3);
}

.btn-secondary {
  background: var(--secondary);
  color: white;
}

.btn-secondary:hover {
  background: #00325c;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.btn-outline:hover {
  background: var(--primary);
  color: white;
}

.btn-large {
  padding: 18px 48px;
  font-size: 1.1em;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 30px 0;
}

/* ============================================
   FEATURES
   ============================================ */

.about, .how-it-works, .contribute {
  padding: 70px 20px;
}

.about {
  background: var(--bg-light);
}

.about h3, .how-it-works h3, .contribute h3 {
  font-size: 2.2em;
  margin-bottom: 20px;
  text-align: center;
}

.about > .container > p {
  font-size: 1.1em;
  margin-bottom: 50px;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  color: var(--text-light);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.feature-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.feature-card h4 {
  font-size: 1.3em;
  margin-bottom: 12px;
  color: var(--primary);
}

.feature-card p {
  color: var(--text-light);
  font-size: 0.95em;
}

/* ============================================
   HOW IT WORKS
   ============================================ */

.how-it-works {
  background: white;
}

.steps {
  list-style: none;
  max-width: 900px;
  margin: 50px auto 0;
  counter-reset: step-counter;
}

.steps li {
  counter-increment: step-counter;
  padding-left: 80px;
  position: relative;
  margin-bottom: 40px;
}

.steps li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 60px;
  background: var(--primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5em;
}

.steps li h4 {
  font-size: 1.3em;
  margin-bottom: 8px;
}

.steps li p {
  color: var(--text-light);
}

/* ============================================
   CONTRIBUTE
   ============================================ */

.contribute {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  text-align: center;
}

.contribute h3 {
  color: white;
  margin-bottom: 20px;
}

.contribute > .container > p {
  font-size: 1.1em;
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.95;
}

.contribute .btn {
  margin: 0 10px;
}

/* ============================================
   FAQ
   ============================================ */

.faq {
  padding: 70px 20px;
  background: var(--bg-light);
}

.faq h3 {
  text-align: center;
  font-size: 2.2em;
  margin-bottom: 50px;
}

.faq-item {
  background: white;
  padding: 25px 30px;
  margin-bottom: 15px;
  border-radius: 8px;
  border-left: 4px solid var(--primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.faq-item h4 {
  color: var(--primary);
  margin-bottom: 12px;
  font-size: 1.1em;
  user-select: none;
}

.faq-item p {
  display: none;
  color: var(--text-light);
  line-height: 1.7;
}

.faq-item.open p {
  display: block;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faq-item a {
  color: var(--primary);
}

.faq-item a:hover {
  text-decoration: underline;
}

/* ============================================
   FOOTER
   ============================================ */

.footer {
  background: var(--dark);
  color: white;
  padding: 50px 20px 30px;
  text-align: center;
}

.footer p {
  margin-bottom: 15px;
}

.footer-links {
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.footer a {
  color: var(--primary);
  font-weight: 500;
}

.footer a:hover {
  color: var(--accent);
  text-decoration: underline;
}

/* ============================================
   RESPONSIVE
   ============================================ */

@media (max-width: 768px) {
  .header h1 {
    font-size: 2.2em;
  }

  .header .tagline {
    font-size: 1.1em;
  }

  .hero h2 {
    font-size: 1.6em;
  }

  .hero .hero-subtitle {
    font-size: 1em;
  }

  .cta-group, .cta-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .block-info {
    grid-template-columns: 1fr;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .steps li {
    padding-left: 70px;
  }

  .steps li::before {
    width: 50px;
    height: 50px;
    font-size: 1.2em;
  }

  .contribute .btn {
    display: block;
    margin: 10px 0;
  }

  .footer-links {
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.8em;
  }

  .hero h2 {
    font-size: 1.3em;
  }

  .signup h3 {
    font-size: 1.5em;
  }

  .about h3, .how-it-works h3, .contribute h3, .faq h3 {
    font-size: 1.5em;
  }

  .feature-card {
    padding: 25px 20px;
  }

  .feature-icon {
    font-size: 2em;
  }

  .faq-item {
    padding: 18px 20px;
  }

  .faq-item h4 {
    font-size: 1em;
  }
}
```

---

### 3.4 JavaScript Logic (js/script.js)

**[CUSTOMIZE THESE VARIABLES FOR YOUR SCHEDULE]**

```javascript
// ============================================
// DRUMSTR LANDING PAGE — JAVASCRIPT
// ============================================

// ============================================
// CUSTOMIZE: BLOCK SCHEDULE
// ============================================
// Update this array with your daily Drum Block schedule
// Times should match your timezone (Noon Mountain = 11 AM PST / 2 PM EST)

const blockSchedule = [
  {
    day: "Monday",
    date: "March 31",
    time: "12:00 PM MT",
    attendance: 0,
    roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-03-31"
  },
  {
    day: "Tuesday",
    date: "April 1",
    time: "12:00 PM MT",
    attendance: 0,
    roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-04-01"
  },
  {
    day: "Wednesday",
    date: "April 2",
    time: "12:00 PM MT",
    attendance: 0,
    roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-04-02"
  },
  {
    day: "Thursday",
    date: "April 3",
    time: "12:00 PM MT",
    attendance: 0,
    roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-04-03"
  },
  {
    day: "Friday",
    date: "April 4",
    time: "12:00 PM MT",
    attendance: 0,
    roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-04-04"
  },
  {
    day: "Saturday",
    date: "April 5",
    time: "12:00 PM MT",
    attendance: 0,
    roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-04-05"
  },
  {
    day: "Sunday",
    date: "April 6",
    time: "12:00 PM MT",
    attendance: 0,
    roomUrl: "https://demo.mirotalk.com/join/drumstr-block-2026-04-06"
  }
];

// ============================================
// UPDATE: SIGNUP INFO
// ============================================
// Called on page load — displays next Block + upcoming schedule

function updateSignup() {
  // Today's or next Block
  const nextBlock = blockSchedule[0];
  
  if (nextBlock) {
    document.getElementById("next-time").textContent = 
      `${nextBlock.day}, ${nextBlock.date} at ${nextBlock.time}`;
    document.getElementById("count").textContent = nextBlock.attendance;
    document.getElementById("room-link").href = nextBlock.roomUrl;
  }

  // Show upcoming Blocks (next 7 days)
  const upcomingHTML = blockSchedule
    .map((block, idx) => 
      `<li>${block.day}, ${block.date} at ${block.time}</li>`
    )
    .join("");
  
  document.getElementById("upcoming-list").innerHTML = upcomingHTML;
}

// ============================================
// FAQ TOGGLE
// ============================================
// Click h4 to toggle FAQ answer visibility

function toggleFAQ(element) {
  element.parentElement.classList.toggle("open");
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

document.addEventListener("DOMContentLoaded", function() {
  updateSignup();
  
  // Smooth scroll for FAQ items
  document.querySelectorAll(".faq-item h4").forEach(h4 => {
    h4.style.cursor = "pointer";
  });
});

// ============================================
// OPTIONAL: UPDATE ATTENDANCE MANUALLY
// ============================================
// If you want to track attendance dynamically, use this:
// updateAttendance(blockIndex, newCount)

function updateAttendance(blockIndex, newCount) {
  if (blockSchedule[blockIndex]) {
    blockSchedule[blockIndex].attendance = newCount;
    updateSignup();
  }
}

// ============================================
// OPTIONAL: ADD NEW BLOCK
// ============================================
// addBlock({ day, date, time, roomUrl })

function addBlock(blockData) {
  blockSchedule.push({
    ...blockData,
    attendance: 0
  });
  updateSignup();
}
```

**How to use:**
1. Customize `blockSchedule` array at top with your dates + room URLs
2. Update MiroTalk room URLs daily: `https://demo.mirotalk.com/join/drumstr-block-YYYY-MM-DD`
3. After each Block, increment attendance count (manually or via `updateAttendance()`)

---

### 3.5 Deployment to dfe.org/drumstr

**Steps:**

1. **Create folder via CPanel**
   - Login to CPanel
   - File Manager → public_html
   - Create folder: `drumstr`

2. **Upload files**
   - Upload `index.html` to `drumstr/`
   - Create folder: `css/` → Upload `style.css`
   - Create folder: `js/` → Upload `script.js`
   - Create folder: `images/` → Upload your logo, bg-pattern, community.jpg

3. **Test live**
   - Visit `dfe.org/drumstr` in browser
   - Verify: all images load, buttons clickable, responsive on mobile
   - Test room link (should open MiroTalk)

4. **Update daily**
   - Edit `js/script.js` → update `blockSchedule` array
   - Upload updated file
   - Refresh page in browser (hard refresh: Ctrl+Shift+R)

---

**Landing Page Checklist:**
- [ ] HTML file ready (customize taglines if desired)
- [ ] CSS file ready (colors customized to your palette)
- [ ] JS file ready (blockSchedule dates filled in)
- [ ] Logo uploaded to `/images/`
- [ ] Background image uploaded (optional)
- [ ] Community image uploaded (optional)
- [ ] Deployed to dfe.org/drumstr
- [ ] Mobile responsive (test on phone)
- [ ] All links working (GitHub, Nostr, room links)
- [ ] FAQ toggle working (click to expand/collapse)

**Total Landing Page Time:** 4-6 hours (copy-paste templates + customization + deployment)

---

## PHASE 4: MIROTALK VIDEO SETUP (30-45 min)

### 4.1 Public MiroTalk Demo (Week 1)

**NO SETUP REQUIRED — ready to use now.**

**Benefits:**
- 100+ person capacity (SFU architecture)
- Excellent audio/video quality
- Free forever
- No account needed

**Rooms:**
```
https://demo.mirotalk.com/join/drumstr-block-2026-03-31
https://demo.mirotalk.com/join/drumstr-block-2026-04-01
https://demo.mirotalk.com/join/drumstr-block-2026-04-02
...
```

**Test procedure (15 min):**
1. Open room URL in 2 different browsers
2. Verify: Audio works, video streams, chat works
3. Verify: Can see /join/ rooms are unlimited (create as many as you want)
4. Save room URLs in `js/script.js` blockSchedule array

**Naming convention:** `drumstr-block-YYYY-MM-DD` (predictable, easy to remember)

**Week 2+ upgrade option:**
- Self-hosted MiroTalk (Docker) for branding + control
- Stay with public demo (simpler, zero maintenance)

---

**Video Checklist:**
- [ ] Test 1 public MiroTalk room (audio + video + chat working)
- [ ] Confirm 100-person capacity
- [ ] Save all room URLs in `js/script.js`
- [ ] Document naming convention in README

**Total Video Time:** 30 min

---

## PHASE 5: GITHUB REPOSITORY (2-3 hours)

### 5.1 Create GitHub Repo

1. Go to https://github.com/new
2. Repo name: `drumstr`
3. Description: `10 minutes. Every day. After work. A global community drumming on Bitcoin. Nostr-native. Open source.`
4. Public visibility
5. License: MIT
6. Create repo

---

### 5.2 Repo Structure

```
drumstr/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── docs/
│   ├── VISION.md
│   ├── ROADMAP.md
│   ├── ARCHITECTURE.md
│   ├── FAQ.md
│   └── LAUNCH-READINESS-PLAN.md (this file)
├── landing-page/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── images/
│       ├── logo.svg
│       ├── logo.png
│       └── community.jpg
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── feature-request.md
└── .gitignore
```

---

### 5.3 README.md (Copy-Paste Ready)

```markdown
# Drumstr

**10 minutes. Every day. After work. A global community drumming on Bitcoin. Nostr-native. Open source.**

## 🥁 Join a Drum Block

**Live:** https://dfe.org/drumstr

Pick a time above, click "Join Room", and drum with us!

- **Free to join** — every Drum Block is free
- **Optional tip** — support facilitators via Lightning (sliding scale: 0 sats → ∞)
- **No signup** — join anonymously via Nostr or just click the link
- **10 minutes** — intentionally short for daily engagement
- **Every day** — at Noon Mountain Time (11 AM PST / 2 PM EST)

---

## 📖 Documentation

- **[Vision](docs/VISION.md)** — What we're building and why
- **[Roadmap](docs/ROADMAP.md)** — 90-day plan and milestones
- **[Architecture](docs/ARCHITECTURE.md)** — How the platform works
- **[FAQ](docs/FAQ.md)** — Common questions answered
- **[Launch Readiness Plan](docs/LAUNCH-READINESS-PLAN.md)** — Building Drumstr (solo mode)

---

## 🤝 How to Contribute

### For Developers
- Review the codebase
- Contribute features
- Fix bugs
- See [good first issues](https://github.com/drumstr/drumstr/issues?label=good+first+issue)

### For Designers
- Logo feedback
- Brand guidelines
- UI/UX improvements
- Visual assets

### For Facilitators
- Facilitate a Drum Block
- You receive 80% of tips
- Email us or open an issue

### For Community
- Join a Drum Block
- Engage in [Discussions](https://github.com/drumstr/drumstr/discussions)
- Share ideas
- Help shape the roadmap

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 🎯 What is Drumstr?

Drumstr is a **community-owned platform** for real-time, on-demand facilitated drumming sessions.

### Core Values
- **Community-driven** — not a VC-funded startup
- **Open source** — MIT license, fork and build your own
- **Bitcoin-native** — Lightning Network for payments, self-custodial
- **Nostr-native** — decentralized identity, no surveillance
- **Transparent** — 80/20 split (facilitator/platform), public roadmap

### How It Works
1. **Join a Block** — Click room link at Noon MT
2. **Drum Together** — 10 minutes of collective drumming
3. **Optional Tip** — Support facilitators via Lightning (sliding scale)
4. **Come Back** — Do it again tomorrow

---

## 🛠 Tech Stack (Future)

| Component | Tech | Purpose |
|-----------|------|---------|
| Backend | Node.js + Express + PostgreSQL | API, user auth, event management |
| Frontend | React / Next.js | Web app (desktop + mobile web) |
| Mobile | React Native + Expo | Native iOS + Android app |
| Payments | MoneyDevKit + Lightning Network | Sliding-scale tips, instant settlement |
| A/V | MiroTalk SFU + HiveTalk | Real-time video/audio, Nostr integration |
| Identity | Nostr (NIP-07, NIP-98) | Decentralized auth, no passwords |
| Relay | nostr-rs-relay | Self-hosted Nostr relay at relay.drumstr.app |

---

## 📊 Current Status

🚀 **Pre-Alpha (MVP Phase 0)**

- ✅ Landing page live (dfe.org/drumstr)
- ✅ Daily Drum Blocks launching
- ✅ GitHub repo open for contributions
- ✅ Manual payment processing (MoneyDevKit)
- 🔜 Web app (React, full auth)
- 🔜 Mobile app (Expo)
- 🔜 Backend API (Node.js + PostgreSQL)
- 🔜 Automated payments + splits

**[See full roadmap](docs/ROADMAP.md)**

---

## 📜 License

MIT — build what you want, credit appreciated but not required.

---

**Come drum with us. ⚡🥁**

Follow us on [Nostr](https://nostr.com) | Star us on [GitHub](https://github.com/drumstr/drumstr) | Join us [live](https://dfe.org/drumstr)
```

---

### 5.4 CONTRIBUTING.md

```markdown
# Contributing to Drumstr

Thanks for your interest! We're excited to have you help build this.

## How to Contribute

### 1. Pick an Issue
Browse [good first issues](https://github.com/drumstr/drumstr/issues?label=good+first+issue) or [open issues](https://github.com/drumstr/drumstr/issues).

### 2. Comment "I'll work on this"
Let us know you're interested before diving in.

### 3. Open a Pull Request
- Fork the repo
- Create a branch: `git checkout -b feature/your-feature`
- Make changes
- Push: `git push origin feature/your-feature`
- Open a PR with a clear description

### 4. Code Review
We'll review and iterate until it's ready to merge. Thanks for patience!

---

## Development Setup

### Landing Page (HTML + CSS + JS)
- No build tools needed
- Edit `landing-page/` files directly
- Test locally or deploy to dfe.org/drumstr
- See [LAUNCH-READINESS-PLAN.md](../docs/LAUNCH-READINESS-PLAN.md) for deployment steps

### Backend / Frontend (Future)
- Coming in Phase 1 (Q2 2026)
- Setup instructions will be added to this file

---

## Code Style

- **Landing page:** HTML5 semantic markup, plain CSS (no preprocessor), vanilla JS
- **Future backend:** TypeScript, ESLint, Prettier
- **Tests:** TDD encouraged (red → green → refactor)

---

## Issues & Discussions

- **Have a bug?** [Open an issue](https://github.com/drumstr/drumstr/issues/new)
- **Want to suggest a feature?** [Start a discussion](https://github.com/drumstr/drumstr/discussions/new)
- **General question?** [Ask in Discussions](https://github.com/drumstr/drumstr/discussions)

---

## Code of Conduct

Be respectful. We're building together.

---

Thanks for contributing! 🥁⚡
```

---

### 5.5 Five "Good First Issues"

**Issue 1: Improve README with screenshots**
```markdown
Title: Add screenshot of landing page to README

Description:
Our README is text-heavy. New visitors might appreciate seeing what the landing page actually looks like.

Add a screenshot or GIF showing:
- Header with logo
- "Next Drum Block" section with join button
- Features cards

Save as `docs/screenshots/landing-page.png` and link in README.

Labels: documentation, good-first-issue
Effort: ~15 min
```

**Issue 2: Create VISION.md**
```markdown
Title: Write detailed vision statement (docs/VISION.md)

Description:
We need a longer-form vision document explaining:
- **Problem:** Why Drumstr exists (community, music, Bitcoin)
- **Solution:** How we solve it (10-min blocks, Lightning, Nostr, open source)
- **Values:** Community ownership, transparency, simplicity
- **3-year goal:** Where do we want to be?
- **Facilitator economy:** How facilitators benefit

Expand from README's vision paragraph to 1-2 pages, markdown.

Example structure:
1. Problem Statement
2. Our Solution
3. Core Values
4. Long-term Vision
5. Facilitator Economy

Labels: documentation, good-first-issue
Effort: ~1-2 hours
```

**Issue 3: Create BRAND.md with visual identity**
```markdown
Title: Create BRAND.md with Drumstr visual identity guidelines

Description:
Document the brand identity:
- Logo (colors, sizing, usage guidelines)
- Color palette (hex codes + meaning)
- Typography (fonts, hierarchy)
- Tone & voice (how we communicate)
- Example: Instagram post vs. GitHub issue vs. Nostr post

Save as `docs/BRAND.md`. Keep it 1 page, concise.

Labels: design, good-first-issue
Effort: ~1 hour
```

**Issue 4: Research Nostr Kind 39613 (events)**
```markdown
Title: Research and summarize Nostr Kind 39613 event specification

Description:
Drumstr needs to announce Drum Blocks on the Nostr network using Kind 39613 (event/gathering).

Research:
- Read [NIP-52](https://github.com/nostr-protocol/nips/blob/master/52.md) (Events)
- Summarize key fields: title, description, location, start_time, duration, tags
- Create `docs/NOSTR-KIND-39613.md` with:
  - Summary of spec
  - Example Drumstr event
  - Required + optional fields
  - Implementation notes for future backend

Labels: research, good-first-issue
Effort: ~1-2 hours
```

**Issue 5: Sketch facilitator matching algorithm**
```markdown
Title: Design facilitator matching logic for Drum Block bookings

Description:
When a user requests a Drum Block, the backend needs to match them to an available facilitator.

Sketch the algorithm in `docs/FACILITATOR-MATCHING.md`:
- **Input:** User request (date, time, session type, experience level?)
- **Output:** Matched facilitator or "no match" response
- **Constraints:** availability, language (if multilingual), rating, capacity
- **Fallback:** What if no facilitator available?

Keep it simple for MVP! Pseudocode or flowchart OK.

Example:
```
1. Check facilitator availability for requested time
2. Filter by language (if needed)
3. Prefer new facilitators if capacity allows (share load)
4. Return facilitator + room link
```

Labels: architecture, good-first-issue
Effort: ~1 hour
```

---

**GitHub Checklist:**
- [ ] Repo created (public, MIT license)
- [ ] README.md customized + pushed
- [ ] CONTRIBUTING.md added
- [ ] docs/ folder created + LAUNCH-READINESS-PLAN.md added
- [ ] landing-page/ folder with HTML/CSS/JS/images added
- [ ] 5 good first issues created + labeled
- [ ] .gitignore added (ignore .env, node_modules, etc.)
- [ ] Branch protection: require PR review before merge
- [ ] Add repo link to landing page footer

**Total GitHub Time:** 2-3 hours

---

## PHASE 6: MONEYDEVKIT MANUAL WORKFLOW (1-2 hours)

### 6.1 Week 1 Payment Flow (Manual)

**You handle payments manually via MoneyDevKit dashboard. No backend code needed.**

**Workflow:**

1. **Before Block:** Prepare payment link
   - Login to MoneyDevKit dashboard
   - Create test invoice: 1,000 sats (for testing)
   - Generate QR code
   - Save QR screenshot

2. **After Block:** Collect tips
   - Post QR code + payment link in Nostr
   - Users scan → pay Lightning
   - You see payment confirmed in MDK dashboard
   - Note: user pubkey + amount + Block ID in spreadsheet

3. **Send Facilitator Payment** (if applicable)
   - You're the facilitator Week 1
   - So: 100% of tips go to you (or manually split if sharing with co-facilitator)

---

### 6.2 Example Payment Post (Nostr)

**After-Block Nostr post:**

```
✅ Drumstr Block #1 complete!

14 people from 9 countries just finished drumming together. 
Vibes: grounding, energetic, joyful. 🥁

Want to support this work? Optional sliding-scale tip:

[QR CODE IMAGE]
OR
[MONEYDEVKIT PAYMENT LINK]

80% goes to facilitators, 20% goes to DFE (our team).
No tip? No problem! See you tomorrow at Noon MT.

Next Block: Tomorrow, 12:00 PM Mountain Time
Join: https://dfe.org/drumstr

#drumstr #nostr #bitcoin ⚡🥁
```

---

### 6.3 Payment Tracking Spreadsheet

**Create a Google Sheet or Excel file:**

| Date | Block | Attendees | Payer Pubkey | Amount (sats) | Tip? (Y/N) | Notes |
|------|-------|-----------|--------------|---------------|-----------|-------|
| 3/31 | Block #1 | 14 | npub1xxx...xxx | 5,000 | Y | Community member |
| 3/31 | Block #1 | 14 | npub1yyy...yyy | 2,500 | Y | Facilitator co-worker |
| 4/1 | Block #2 | 18 | (no pubkey) | 0 | N | Joined but didn't tip |

**Calculate weekly stats:**
- Total attendees
- Total tips
- Average tip per attendee
- Growth vs. previous week

---

### 6.4 Week 2+ Backend Integration

**When ready (not MVP):**
- API endpoint: `POST /api/checkout` (returns MoneyDevKit session)
- Webhook: `POST /webhooks/moneydevkit` (signature verification)
- Auto-route split: 80% facilitator, 20% DFE
- Use WebhookVerifier from PrivaFlow P0 (already built)

**For now:** Keep it manual.

---

**Payment Checklist:**
- [ ] MoneyDevKit account active + credentials saved
- [ ] Test invoice created + QR code screenshot saved
- [ ] Example Nostr payment post drafted
- [ ] Payment tracking spreadsheet created
- [ ] Weekly stats template created
- [ ] Payment flow documented (for future devs)

**Total MoneyDevKit Time (Week 1):** 1-2 hours (manual)
**Backend Integration (Week 2+):** 4-6 hours (with API)

---

## PHASE 7: NOSTR IDENTITY & POSTING (1-2 hours)

### 7.1 Nostr Account Setup

**If you don't have a Nostr account yet:**

1. Go to https://nostr.com or https://damus.io
2. Generate keypair (or use existing one if you have it)
3. Set profile: name, bio, avatar, website
4. Example profile:
   ```
   Name: Drumstr
   Bio: 10 min / day. Community drumming on Bitcoin. Nostr-native. Open source. https://dfe.org/drumstr
   Picture: Your logo
   Website: https://dfe.org/drumstr
   ```

5. **Save your pubkey:**
   - Format: `npub1xxxxx...` (bech32-encoded)
   - Keep private key (`nsec1...`) **secure**

---

### 7.2 Daily Posting Strategy (30-40 min/day)

**Template 1: Pre-Block Announcement (30 min before)**

```
🥁 Drumstr Block in 30 min — [DATE] at 12:00 PM MT

Join us for 10 minutes of collective drumming.
Everyone welcome. No experience needed. Free.

Room: [MIROTALK_URL]
Info: https://dfe.org/drumstr

#drumstr #nostr #drums #bitcoin ⚡
```

**Template 2: Post-Block Recap (15 min after)**

```
✅ Drumstr Block complete!

[ATTENDANCE] people from [# COUNTRIES] countries just drummed together.

Vibes: [descriptive words - grounding, joyful, energetic, etc.]

🙏 Thanks to everyone who joined.
💰 Supported this with a tip? More power to you. No tip? Still loved.
📈 This is week [#], block [#].

Optional tip: [PAYMENT LINK]
Next block: Tomorrow, 12:00 PM MT
https://dfe.org/drumstr

#drumstr #nostr 🥁⚡
```

**Template 3: Weekly Stats (Sunday or Monday)**

```
📊 Drumstr Weekly — Week [#] Summary

🥁 Blocks: 7
👥 Total attendance: [X] people
🌍 Countries: [COUNTRIES]
⚡ Revenue: [Y] sats

💸 Breakdown:
80% → Facilitators: [X] sats
20% → DFE: [Y] sats

📈 Growth: [% increase from last week]

🙏 Thanks to everyone drumming with us.
🤝 Help us build: https://github.com/drumstr/drumstr

Next week: [brief teaser]

#drumstr #nostr
```

---

### 7.3 Nostr Identity for Users (Manual Week 1)

**How users tip (Week 1 process):**

1. After Block, you post payment link + QR code
2. User scans → pays Lightning invoice
3. In Nostr post/chat, you ask: "What's your Nostr pubkey?" (optional for receipt)
4. User replies: `npub1xxxxx...`
5. You note their pubkey + amount in spreadsheet (for records)
6. Reply: "Thanks for supporting! ⚡"

**Week 2+ (automated):**
- User clicks "Tip" button on landing page
- Form requests Nostr pubkey (or generates one locally)
- Payment form includes pubkey in metadata
- Backend verifies payment signature
- Send "Thank you" message via Nostr (optional)

---

**Nostr Checklist:**
- [ ] Nostr account created + profile set
- [ ] Pubkey saved (npub1...)
- [ ] Private key secured (never shared)
- [ ] Pre-Block post template saved
- [ ] Post-Block post template saved
- [ ] Weekly stats template saved
- [ ] Understand user pubkey collection process (Week 1 manual)

**Total Nostr Setup Time:** 1-2 hours

---

## PHASE 8: OPERATIONS & DAILY WORKFLOW (1-2 hours)

### 8.1 Daily Drum Block Checklist

**30 minutes before:**
- [ ] Test MiroTalk room URL (refresh, check audio/video)
- [ ] Update landing page (js/script.js) with live room link for today
- [ ] Post Nostr pre-announcement (30-40 min before start)
- [ ] Optional: ping any Telegram/Discord/community channels

**During Block (10 min):**
- [ ] Facilitate! Drum together
- [ ] Optional: record screen for archive/clips
- [ ] Encourage participation in chat

**Immediately after (15 min):**
- [ ] Count attendance (ask in room: "How many of us?")
- [ ] Update spreadsheet: date, block #, attendance count
- [ ] Post Nostr recap + payment link (within 15 min of end)
- [ ] Update landing page attendance display (optional, manual)

**Weekly (1 hour, Sunday or Monday):**
- [ ] Compile attendance + revenue stats
- [ ] Post weekly recap on Nostr
- [ ] Review GitHub issues (reply to any new comments)
- [ ] Update roadmap if needed

---

### 8.2 Daily Schedule Confirmation

**Your chosen time: Noon Mountain Time**

| Timezone | Time |
|----------|------|
| Mountain | 12:00 PM (Noon) |
| Pacific | 11:00 AM |
| Central | 1:00 PM |
| Eastern | 2:00 PM |
| GMT | 7:00 PM (19:00) |

**Is this still your preferred time? If not, update:**
1. `js/script.js` (blockSchedule times)
2. Landing page copy
3. README.md
4. Nostr posts

---

### 8.3 Pre-Launch Checklist (Sunday before Monday launch)

**Saturday/Sunday:**
- [ ] All landing page files deployed to dfe.org/drumstr
- [ ] MiroTalk room URLs tested + in blockSchedule
- [ ] GitHub repo created + README + 5 issues + repo link in landing page
- [ ] MoneyDevKit account active + test invoice works
- [ ] Nostr account ready + post templates saved
- [ ] Payment tracking spreadsheet created
- [ ] Daily workflow checklist printed or saved locally

**Monday morning (launch day):**
- [ ] Wake up 1 hour before Block time
- [ ] Test MiroTalk room URL one final time
- [ ] Confirm landing page is live + room link showing
- [ ] Post Nostr pre-announcement (30 min before)
- [ ] Deep breath. You're about to facilitate your first Drum Block. 🥁

---

**Operations Checklist:**
- [ ] Daily time confirmed: Noon Mountain Time
- [ ] Pre-Block checklist saved (screenshot or bookmark this)
- [ ] Post-Block checklist saved
- [ ] Nostr post templates saved locally
- [ ] Weekly recap template saved
- [ ] Attendance tracking method decided (spreadsheet)
- [ ] Payment tracking method decided (MoneyDevKit dashboard + spreadsheet)
- [ ] Daily schedule published on landing page + GitHub

**Total Operations Planning:** 1-2 hours

---

## SUMMARY: SOLO TIMELINE

| Phase | Effort | Time | Status |
|-------|--------|------|--------|
| 1. Preparation | Pre-work | 2-3 hrs | Priority: Do first |
| 2. Brand | Design | 3-4 hrs | AI logo + colors + fonts |
| 3. Landing Page | Build | 5-6 hrs | Copy-paste templates + customize |
| 4. MiroTalk | Test | 30 min | Verify public demo works |
| 5. GitHub | Build | 2-3 hrs | Create repo + README + issues |
| 6. MoneyDevKit | Setup | 1-2 hrs | Manual workflow + QR codes |
| 7. Nostr | Setup | 1-2 hrs | Account + posting templates |
| 8. Operations | Plan | 1-2 hrs | Daily checklist + workflow |
| **TOTAL** | | **16-24 hrs** | Feasible over 2-3 focused days |

**Realistic solo execution:**
- **Fastest:** 2 full days (16 hours/day) = weekend sprint
- **Comfortable:** 3-4 half-days (5-6 hours/day) = distribute across week
- **Part-time:** 2-3 weeks (1-2 hours/day) = no rush

---

## DECISION POINTS FOR FINAL CONFIRMATION

Before you start building, confirm:

1. **GitHub username?**
   - Personal: `github.com/username/drumstr`
   - Organization: `github.com/drumstr-team/drumstr` (requires creating GitHub org)
   - **Recommendation:** Personal is simpler for solo MVP

2. **Facilitator for Week 1?**
   - You'll be the facilitator (receive all tips)?
   - Or partnering with someone else?
   - **Recommendation:** You facilitate Week 1, invite co-facilitators Week 2+

3. **Payment preference if MoneyDevKit delays?**
   - Fallback to Alby (Nostr wallet connect)?
   - BTC Pay Server (self-hosted)?
   - Go free-only Week 1, add payments Week 2?
   - **Recommendation:** Free-only Week 1, add payments Week 2 (less pressure to launch)

4. **Hosting confirmation?**
   - Landing page: dfe.org/drumstr (via CPanel, confirmed)
   - GitHub: github.com/drumstr/drumstr (or your org)
   - Nostr relay: relay.drumstr.app (self-hosted, Week 2+, or skip MVP)
   - **Recommendation:** CPanel + GitHub are ready; skip Nostr relay for MVP

5. **Nostr posting frequency?**
   - Daily pre/post Block posts (14 posts/week)?
   - Evening posts only (3-4 posts/week)?
   - Weekly recap only (1 post/week)?
   - **Recommendation:** Daily pre/post (2/day = 14/week) to build momentum

---

## READY TO BUILD?

Once you've reviewed this plan and answered the decision points above, you're ready to execute!

**Next step:** Start with **Phase 1 (Preparation)** — it's the fastest and clears blockers.

---

**Questions or adjustments needed before we start building?**
