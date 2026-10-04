# DrumstrBot + Pre-Drumstr DFE Holding Phase — Plan

## Problem Statement

Drumstr is fully spec'd but has no implementation yet and needs VPS provisioning before anything runs. Meanwhile, DFE sessions need to happen **now** to raise funds, followers, and validate the concept. The user also wants a DrumstrBot AI Agent — a persistent identity that manages, markets, facilitates, and automates the lifecycle of DFE sessions, and eventually acts as the operational core of a Facilitator DAO.

## Proposed Approach

Split work into three horizons:

- **Phase 0 (NOW):** Pre-Drumstr DFE Holding Phase — run live sessions with off-the-shelf tooling, minimal custom code
- **Phase 0.5 (Soon):** DrumstrBot MVP — lightweight Nostr bot + automation layer
- **Phase 1+ (Future):** Full Drumstr platform (existing spec), with DrumstrBot deeply integrated

---

## Phase 0: Pre-Drumstr DFE Holding Phase

**Goal:** Run live DFE 10-min block sessions, collect Lightning payments, grow Nostr-first audience, and share the Drumstr project broadly — with minimal custom development.

### Streaming & Zap Alerts: ZapsOnStream.com ✅

**ZapsOnStream.com is the right call.** It provides:
- OBS browser-source widgets: zap alerts, leaderboards, screen takeovers, milestones
- Multi-tier alert tiers map perfectly to Drum Call intensity levels (21 sats / 100 sats / 210 sats / 1000 sats)
- Palindrome/milestone effects for special zap moments during a drum session
- No custom development — plug-and-play in OBS
- Fully Lightning/Nostr-native

**Streaming Platform:** `zap.stream` (Nostr-native live streaming)
- Viewers can zap directly from the stream page
- Native Nostr integration — ZapsOnStream widgets pick up zaps automatically
- Stream key setup is minutes-long
- Fallback: Restream.io for simultaneous YouTube/Twitch/X for normie reach

### Calendar & Scheduling: Cal.com

- Self-hostable (add to Backend VPS later) or use Cal.com cloud (free tier) now
- Facilitator sets availability windows (10-min block-aligned)
- Cal.com webhooks will later trigger DrumstrBot auto-announcement
- For Phase 0: manual Nostr posts from calendar slots

### Payment Processing: BTCPay Server

- Self-hosted Lightning payment processor (open source)
- Can be deployed on any VPS (or use BTCPay hosted / Voltage.cloud temporarily)
- LNURL-pay endpoint — works with any Lightning wallet
- Handles payment splits manually via pull payments in v0 (DrumstrBot automates later)
- **Advantage over MoneyDevKit:** Production-hardened, battle-tested, no beta risk

### WordPress/Events Manager Refurbishment

- Refurbish for normie audience: SEO, email capture, fiat-friendly
- Add Nostr stream embed (iframe from zap.stream)
- Events Manager for booking 10-min slots with basic UX
- WooCommerce + BTC payment plugin as fiat/BTC hybrid checkout
- Keep `drumfreeexperience.org` pointing here for outreach; `drumstr.app` for Nostr-native

### Social Media Stack (Nostr-first)

| Platform | Tool | Audience |
|---|---|---|
| Nostr | Direct bot posts (DrumstrBot keypair) | Core community |
| Twitter/X | Zaprite or manual cross-post | Normie crypto |
| YouTube | Restream.io output | Normie general |
| Mastodon | Cross-post via n8n | Fediverse |
| Fountain.fm | Audio-only Nostr stream | Podcast/audio crowd |

---

## Phase 0.5: DrumstrBot MVP

### Identity

DrumstrBot is a **Nostr entity** — it has its own npub/nsec keypair. This is its identity across all platforms and social actions.

### Architecture (PrivaServe-native — NOT elizaOS)

DrumstrBot IS PrivaServe L3 workflows. No separate process, no elizaOS. All actions are L3 → L2 → L1 → MCP server.

```
PrivaFlow Architecture (confirmed from source):
─────────────────────────────────────────────
MCP Server (TypeScript tools)
  └── Service implementations (BTCPay, Nostr, FluentFamily tools)
      L1 calls these via JSON-RPC 2.0 tools/call

L1 — Node-RED Singleton Subflow (ONE per service)
  ├── Validates tool + args
  ├── Composes JSON-RPC 2.0 { method: "tools/call", params: { name, arguments } }
  ├── HTTP POST → MCP server endpoint
  ├── Normalizes response { service, level:1, tool, ok, data }
  └── Called by MULTIPLE L2 workflows. NEVER by L3.

L2 — Node-RED Subflow (the workhorse)
  ├── NLP input → structured tool + args
  ├── Session init (session_id, retry_policy, quality_threshold, timeout)
  ├── Calls L1 singleton
  ├── Quality check → retry or continue
  ├── Instance monitoring
  ├── Aggregation (weighted voting)
  └── Audit log (privacy-safe, no secrets)

L3 — Cross-service workflows (DrumstrBot's "brain")
  └── Calls L2 workflows ONLY
      Each L3 workflow = one business lifecycle event:
        - Session booking announced
        - Payment confirmed → attendee DM'd
        - 15-min reminder fired
        - Post-session summary published
```

### Facilitator DAO (Foundation)

For now (solo facilitator), plant the seeds:

- **Treasury:** LNbits instance (or BTCPay Server) with a shared "DAO wallet"
- **Voting:** Nostr-based — approved facilitator npubs sign Kind 1 notes tagged `#drumstr-dao` to vote on directions
- **Bot instructions:** DrumstrBot subscribes to `#drumstr-dao` events from authorized npubs and adjusts behavior (scheduling priorities, fee splits, PSA themes)
- **Growth:** As facilitators onboard, they get approved npubs added to the DAO roster (Kind 30078 on relay, already spec'd in NOSTR-IDENTITY-SPEC)

---

## Phase 0 A/V Automation Stack (Minimal Human Input)

### The Loop

```
Human Input Required Only For:
  └── Calendar negotiation (mark availability in Cal.com)

Everything Else Automated:
  Cal.com slot confirmed
    → n8n workflow triggered
    → DrumstrBot posts Nostr announcement (Kind 39613)
    → DrumstrBot cross-posts to Twitter/X
    → WordPress event created via REST API
    → 15-min before: DrumstrBot posts reminder + OBS stream key DM to facilitator
    → OBS (manual start, ~30 seconds human input) + ZapsOnStream widgets pre-loaded
    → Session runs: ZapsOnStream handles zap alerts, leaderboards automatically
    → Bitcoin block countdown widget (mempool.space API, pre-built OBS browser source)
    → Session ends: DrumstrBot posts summary to Nostr + Twitter/X
    → BTCPay splits payment (manual in v0, automated in v0.5)
```

### Tools for A/V Automation

| Tool | Role | Human Input |
|---|---|---|
| **OBS Studio** | Stream broadcast | Press "Go Live" (30 sec) |
| **ZapsOnStream.com** | Zap alerts, leaderboard, effects | Zero (pre-configured) |
| **zap.stream** | Nostr streaming platform | Stream key set once |
| **Restream.io** | Multi-platform simulcast (YouTube, X) | Zero after setup |
| **n8n (self-hosted)** | Workflow automation hub | Zero (event-driven) |
| **Cal.com** | Calendar/scheduling | Mark availability slots |
| **BTCPay Server** | Payment processing | Zero (webhook-driven) |
| **mempool.space** | Bitcoin block countdown widget | Zero (API) |

### Future: Full A/V Automation (v1+)

- OBS WebSocket API + DrumstrBot → bot triggers stream start/stop
- Clip automation: OBS auto-record → upload to Nostr (via blossom.band or similar)
- AI session summary generation from transcript
- Automated highlight reels

---

## ZapsOnStream.com Fit Analysis

| Feature | DFE Use Case | Fit |
|---|---|---|
| Multi-tier zap alerts | Drum Call intensity levels (21/100/210/1000 sats) | ✅ Perfect |
| Screen takeover effects | Big zap = massive drum energy moment | ✅ Perfect |
| Leaderboard | Top Drum Callers during session | ✅ Perfect |
| Palindrome detection | Fun Easter egg for drummers | ✅ Bonus |
| Milestone tracking | "Session funded!" announcement | ✅ Perfect |
| TTS voices | "DrumFree Moses calls you to the circle" | ✅ Great |
| OBS browser source | Zero streaming platform lock-in | ✅ Ideal |

**Verdict:** Integrate ZapsOnStream.com immediately in Phase 0. Configure tier thresholds to match Drum Call intensity levels. No development required.

---

## How to Update Existing Drumstr Plans

### Spec Files to Add/Update

1. **NEW: `docs/specs/DRUMSTRBOT-SPEC.md`** — DrumstrBot agent architecture, Nostr identity, elizaOS character file, tool integrations, DAO voting mechanics
2. **NEW: `docs/specs/PHASE0-HOLDING-SPEC.md`** — Phase 0 pre-Drumstr stack (Cal.com, BTCPay, ZapsOnStream, n8n, zap.stream, WordPress)
3. **UPDATE: `docs/specs/DRUMSTR-MASTER-SPEC.md`** — Add Phase 0 + DrumstrBot sections, update architecture diagram
4. **UPDATE: `docs/specs/DRUMSTR-TASKS.md`** — Prepend Phase 0 and Phase 0.5 task groups
5. **UPDATE: `docs/specs/EVENT-MGMT-SPEC.md`** — Add AI agent automation layer, n8n workflow hooks
6. **UPDATE: `docs/specs/MONEYDEVKIT-SPEC.md`** — Add BTCPay Server as primary Phase 0 solution (MoneyDevKit moves to v1)

### New Code to Add to Repo

1. **`apps/bot/`** — DrumstrBot elizaOS agent (new monorepo app)
2. **`infra/n8n/`** — n8n workflow definitions (JSON exports)
3. **`infra/btcpay/`** — BTCPay Server docker-compose + config
4. **`docs/PHASE0-RUNBOOK.md`** — Step-by-step Phase 0 ops guide

---

## Immediate Next Steps (Ordered)

1. Configure ZapsOnStream.com account + connect Lightning address
2. Set up zap.stream streaming profile (Nostr keypair)
3. Set up Cal.com free cloud account (10-min block-aligned slots)
4. Deploy BTCPay Server (Voltage.cloud hosted for now, self-host later)
5. Refurbish WordPress/Events Manager for Phase 0 sessions
6. Run first live DFE session as a test (OBS + ZapsOnStream + zap.stream)
7. Write DRUMSTRBOT-SPEC.md + PHASE0-HOLDING-SPEC.md
8. Scaffold `apps/bot/` with elizaOS DrumstrBot character
9. Wire Cal.com → n8n → Nostr announcement workflow
10. Wire BTCPay webhook → payment confirmation DM flow

---

## Open Questions

- **elizaOS vs custom Node.js bot?** elizaOS gives more AI capability but more setup; custom Node.js is simpler and faster to ship. Recommend elizaOS for long-term but custom bot for Phase 0.5 MVP.
- **BTCPay hosted vs Voltage.cloud?** Voltage.cloud is fastest to start ($5-10/mo) with zero ops. Self-host on VPS when infrastructure is provisioned.
- **Restream.io for simulcast?** Free tier supports 2 platforms simultaneously. Good for Phase 0 YouTube + Nostr simulcast.
- **NIP-46 for DrumstrBot signing?** Use server-side nsec in Phase 0.5, migrate to NIP-46 hardware signer later.
- **WordPress vs landing page?** Keep WordPress for now (existing investment), but plan migration to Drumstr web app once live.

---

## Update: 2026-03-11 — Live registry sync

- live-registry-sync script patched and committed (commit a2d93a61). Fixes: cross-platform get_mtime(), writes PID file, makes start detached, and hardens the long-running loop (trap/cleanup).
- Verified initial sync runs and registry auto-registration in logs; start now detaches and writes a PID, but detached process may still exit in some sessions. Next step: run smart-DEV-down then smart-DEV-up to restart the full dev environment and validate registry persistence.
- Todos updated: registry-related tasks marked 'done' in the session DB. Follow-ups: if persistent exit occurs, run extended debug (bash -x run) and collect /tmp/live-run.log plus logs/live-registry-sync.log for analysis.

---

## Plan: Fix Node-RED import without editing node-red/flows.json (2026-03-12)

Problem:
- The operationalizer/importer currently fails with jq errors ("startswith() requires string inputs") and reports missing subflows (e.g., sf-test-mcp-l2). node-red/flows.json is not a reliable source for deterministic imports (it may be empty or out-of-order), and the importer assumes non-null string fields and a specific artifact layout.

Goal:
- Make deterministic imports for test-mcp succeed without editing node-red/flows.json by (A) producing a correct import artifact that lists subflows (with full node arrays) before any references, and/or (B) hardening the importer to tolerate nulls and missing fields.

Approach (ordered):
1) Reproduce import failure and capture full companion-operationalize logs (already partially done). Collect the exact jq/filter commands that triggered "startswith" errors.
2) Inspect the canonical workflow artifacts under workflows/services/node-red/ (l1, l2, l3 and subflow JSON files) and identify which subflow IDs/names are referenced but missing nodes or definitions.
3) Create a deterministic import artifact for test-mcp (single import JSON) that contains: L1 subflow(s) (with full nodes arrays), L2 subflow(s), and L3 tab referencing them — ensure subflow definitions appear before any referencing nodes and that subflow IDs/names match references (no null names).
   - Place artifact at workflows/services/node-red/importable-test-mcp.json (do NOT edit node-red/flows.json).
4) Harden importer jq filters: change occurrences of startswith(.name; "...") to ( (.name // "") | startswith("...") ) and guard any string ops with // "" to avoid null errors.
5) Ensure importer imports subflows first, then tabs; add ordering if missing.
6) Re-run companion-operationalize.sh test-mcp --validate --deterministic and iterate until import succeeds.
7) Add unit tests for importer jq filters (small JSON fixtures) to avoid regressions.

Deliverables:
- workflows/services/node-red/importable-test-mcp.json (deterministic import artifact)
- Patch for smart-privaflow-companion / register-node-red-flows.sh with null-safe jq expressions
- Passing companion-operationalize validation for test-mcp

Risks & Mitigations:
- Risk: importer logic changes may affect other import flows. Mitigation: run deterministic validation and add unit tests/fixtures.
- Risk: subflow IDs mismatch. Mitigation: normalize names and IDs during artifact generation and validate references before import.

Next action requested: confirm approval to (A) generate importable-test-mcp.json from canonical templates and (B) patch importer jq filters. If approved I'll implement step 3 then step 4 and re-run validation.

---

## Update: 2026-03-12 — Manual import path selected

- Decision: MANUAL IMPORT ONLY for now. The team will import the canonical trio manually and provide feedback; automated importer fixes are deferred until manual import is validated.
- Action taken: Created deterministic import artifact: workflows/services/node-red/importable-test-mcp.json containing the canonical L1 subflow (sf-l1-enhanced-mcp-ops with full nodes), the canonical L2 subflow (sf-test-mcp-l2), and the L3 tab (l3-test-mcp-tab) referencing them. Do NOT edit node-red/flows.json — import using Node-RED UI or the companion manual import.
- Next: Please perform manual import of workflows/services/node-red/importable-test-mcp.json and report results; I'll iterate on any issues you find and then proceed to create canonical trio for FluentCRM.


## Workflow Specs (deterministic test-mcp demo)

These specs define the L1 (singleton), L2 (workhorse), and L3 (business workflows) for PrivaFlow and include deterministic test payloads under `--deterministic` / `test-mcp` to validate imports and runtime behavior.

L1 — Node-RED subflow: sf-canonical-l1-mcp
- Purpose: Single operational adaptor for MCP tool calls. Always present as a Node-RED subflow and exported in canonical templates.
- Inputs: msg.payload = { tool: string, args: object, action?: 'exec'|'list' }
- Outputs: msg.payload = { ok: boolean, data: any, error?: any, _mcp: { id, tool, created, responded? } }
- Env variables: MCP_BASE_URL (default http://localhost:3000), MCP_AUTH_TOKEN, TIMEOUT_MS
- Nodes (>=6): validate args (function), compose JSON-RPC (function), add id (function), switch list/exec (switch), http request (POST to MCP), ensure-json (function), normalize (function), format-result (function), debug logger (debug), http response (http response).
- Deterministic test payloads (examples):
  - List: { action: 'list' }
  - Exec: { tool: 'mcp-echo', args: { msg: 'hello', deterministic: true } }
- Expected behavior: For list -> returns static or registry-derived tool list. For exec -> posts JSON-RPC to MCP and returns normalized envelope with _mcp metadata.

L2 — Node-RED subflow: sf-l2-mcp-orchestrator (best-of-class)
- Purpose: NLP/session orchestrator and L1 caller. Receives user intent, resolves tool+args, enforces retries, quality thresholds, and aggregates results.
- Inputs: msg.payload = { user: string, intent: string, session_id?: string, deterministic?: true }
- Core steps:
  1. Intent parser (function or external LLM call) → normalized intent { action: 'list'|'exec', tool, args }
  2. Session manager: create/lookup session_id, set retry_policy and timeout from env
  3. If action == 'list' → call L1 with { action:'list' } and return list
  4. If action == 'exec' → call L1 subflow (sf-canonical-l1-mcp) with { tool, args } using Node-RED subflow call or post to Node-RED API
  5. Quality check: examine L1 response.ok and result confidence (if available), retry up to MAX_RETRIES
  6. Enrich response with session metadata; emit audit log to Directus or logs
- Env: MAX_RETRIES, QUALITY_THRESHOLD, DEFAULT_TIMEOUT, MCP_BASE_URL
- Deterministic test harness: When msg.payload.deterministic === true, bypass NLP and use mapped deterministic tool calls: intent 'echo' => tool 'mcp-echo'. Include a test L2 flow file: workflows/services/node-red/test-mcp-l2.json

L3 — Node-RED flow / business workflow: l3-test-mcp (demo lifecycle)
- Purpose: High-level business orchestration using L2 only.
- Example flows:
  1. Booking lifecycle: receive calendar webhook -> call L2 with intent 'announce' -> post Nostr announcement -> create WP event -> schedule reminder
  2. Payment confirmation lifecycle: BTCPay webhook -> call L2 with intent 'payment_confirm' -> DM attendee via Nostr -> mark session as started
- Inputs: webhooks (Cal.com, BTCPay), scheduler triggers, admin commands
- Test-mcp deterministic demo: l3-test-mcp receives a simulated booking webhook and calls L2 with { deterministic: true, intent: 'echo' } and expects a normalized ok response.

Validation steps (test-mcp deterministic demo):
1. Ensure TEMPLATES/l1-canon.json contains the L1 subflow and that workflows/services/node-red/importable-l1-subflow.json is importable.
2. Import L1 subflow into Node-RED manually (Import -> Clipboard). Confirm subflow appears as `sf-canonical-l1-mcp`.
3. Import the L2 test artifact (workflows/services/node-red/test-mcp-l2.json) which references the L1 subflow by name.
4. Import the L3 demo flow (workflows/services/node-red/l3-test-mcp.json) or inject demo payloads directly into L2's input node.
5. Run deterministic tests:
   - POST a 'list' request to L2's HTTP ingress (or use an Inject node): { action: 'list', deterministic: true } -> expect tool list reply.
   - POST an 'exec' request: { action: 'exec', tool: 'mcp-echo', args: { value: 42 }, deterministic: true } -> expect normalized { ok: true, data: ... } envelope.
6. If import errors occur, capture Node-RED import error messages and logs and attach here for iteration.

Deliverables:
- Updated TEMPLATES/l1-canon.json (done)
- workflows/services/node-red/importable-l1-subflow.json (done)
- workflows/services/node-red/test-mcp-l2.json (to create) and l3-test-mcp.json (to create)
- Test README: workflows/services/node-red/TEST-MCP.md with exact import & test steps

PrivaFlow Tiered Workflow Spec — human + AI audiences

Purpose
- Provide a single authoritative specification that both humans (devs, integrators, operators) and AI agents (L2 planners, L3 orchestrators) can consume to construct L1, L2 and L3 workflows predictably. The spec prescribes message contracts, environment configuration, error semantics, observability, and deterministic test modes.

Audience
- Human engineers: implementors of Node-RED subflows, MCP tools, and infra. Focus on explicit node lists, env variables, and importable JSON artifacts.
- AI agents and orchestrators: require machine-readable contracts (JSON Schemas) for inputs/outputs, deterministic flags, and stable subflow names/IDs.

High-level Tiering (restated)
- L1 (Service Adapter, "singleton") — deterministic, service-specific Node-RED subflow that accepts normalized tool calls and performs JSON-RPC calls to MCP server. Always exported as a subflow (sf-<service>-l1).
- L2 (Orchestrator, "workhorse") — intent/session orchestration, NLP/LLM integration, retries, quality checks, calls L1 subflows only (never call MCP directly). Exported as subflow(s) or library flows (sf-<domain>-l2).
- L3 (Business workflows, "brain") — event-driven cross-service flows that call L2 only. L3 implements calendar hooks, payment lifecycles, announcements, reminders, and DAO voting flows.

Message Contracts (machine-readable)
- All inter-flow messages MUST be JSON objects with these top-level fields:
  - meta: { version: string, trace_id?: string, timestamp: ISO8601 }
  - payload: { ok: bool | null, action?: string, tool?: string, args?: object, data?: any, error?: any }
  - deterministic?: boolean
- Provide a JSON Schema file per subflow (schemas/lf1-sf-canonical-l1-mcp.schema.json, schemas/l2-orchestrator.schema.json).
- L1 response envelope MUST include payload.ok (true/false), payload.data, and meta._mcp: { id, tool, created, responded }.

L1 Spec (precise)
- Name: sf-canonical-l1-<service>
- Inputs (msg.payload): { tool: string, args: object, action?: 'list'|'exec' }
- Outputs: single output returning envelope described above. Also expose an HTTP input variant for testing (optional).
- Env (subflow env): MCP_BASE_URL, MCP_AUTH_TOKEN, TIMEOUT_MS, LOG_LEVEL
- Nodes (minimum set; exported in this order to guarantee import):
  1. input validation (function)
  2. compose RPC body (function)
  3. add id + auth (function)
  4. exec switch (switch: list|exec)
  5. http request (http request) — uses msg.url and msg.headers
  6. ensure-json (function)
  7. normalize response (function)
  8. format final result (function)
  9. debug logger (debug)
  10. http response (http response) — wired from format
- Deterministic mode: when deterministic===true the L1 should short-circuit to local stubs (e.g., mcp-echo returns deterministic payload) instead of network calls.
- Error semantics: Any transport or tool error maps to payload.ok=false and payload.error with codes: transport, tool_error, invalid_input.
- Observability: emit trace_id to msg.meta and log start/end with durations; optionally push audit events to Directus or logging endpoint.

L2 Spec (precise)
- Name: sf-l2-<domain>-orchestrator
- Purpose: convert high-level intent into L1 tool calls; manage sessions, retries, policy checks, and aggregation.
- Inputs: msg.payload = { user?, intent?, text?, session_id?, deterministic? }
- Core components (subflow or flow): intent parser (LLM or deterministic mapper), session manager (state store reference), decision engine (map intent→tools), call executor (calls L1 subflow), aggregator/quality checker, result formatter, audit emitter.
- Contracts to L1: calls must use the L1 contract; never craft raw MCP JSON-RPC itself.
- Retry policy: configurable via env MAX_RETRIES, RETRY_BACKOFF_MS; L2 must retry only on transient transport errors and implement exponential backoff.
- Security: do not surface secrets in logs; use env-based auth tokens; validate caller npub signatures for sensitive ops.
- Deterministic mode: bypass LLM and use explicit mapping file (deterministic-mapping.json) for intent→tool resolution.

L3 Spec (precise)
- Name: flows named l3-<business>-<action>
- Purpose: implement concrete business lifecycles; call L2 for intent-handling; orchestrate multi-step interactions, schedule reminders, and perform publishing.
- Inputs: webhooks (Cal.com, BTCPay), admin commands, scheduler triggers.
- Example workflows: booking-announcement, payment-confirmation, reminder-scheduler, post-session-summary.
- Non-functional: L3 must be idempotent for webhook retries, have tombstone/expiry semantics for scheduled items, and persist minimal audit records.

Development & Import Guidelines (Deterministic + Importable)
- Export order: subflow definitions first, then subflow instances/tabs. Always generate import JSON where subflow nodes arrays appear before references.
- Stable IDs: use deterministic stable IDs (UUIDv5 or stamped constants) when generating import artifacts to avoid Node-RED reassigning IDs.
- Quoting & JSONata: avoid embedding raw JSONata expressions that require unescaped quotes; prefer function nodes for complex composition.
- Testing: include deterministic fixtures and a TEST-MCP.md describing import→inject→assert steps. Provide a CLI helper script to run deterministic smoke tests against running Node-RED (curl-based tests).

Observability, Tracing & Audit
- Use meta.trace_id propagated across L1→L2→L3 and include timestamps for start/finish. Log minimal PII; store audit events in Directus or an append-only log.
- Prometheus metrics via Node-RED contrib-exporter recommended: counters for calls, errors, latencies per tool.

Security & Secrets
- Keep secrets in subflow env or Node-RED credential store; never hardcode. Use MCP server for signing when possible. Nostr keys allowed in secured env only.

Machine-Readable Artifacts to Produce
- schemas/*.json (message contracts)
- TEMPLATES/l1-canon.json (already present)
- TEMPLATES/l2-canon.json (to author)
- TEMPLATES/l3-canon.json (to author)
- workflows/services/node-red/importable-l1-subflow.json (done)
- deterministic-mapping.json (intent->tool map for tests)
- workflows/services/node-red/TEST-MCP.md

Review & Approval Flow
- Deliverable: this PrivaFlow Tiered Workflow Spec in docs/specs/PRIVAFLOW-TIERED-SPEC.md
- Review step: Devs and AI auditors (automated schema validators) must sign off; after approval, generate test-mcp importables and implement.

Next actions (per your feedback)
1. Save this spec into docs/specs/PRIVAFLOW-TIERED-SPEC.md (I'll create it if you approve).
2. Pause on generating test-mcp artifacts until this spec is reviewed and approved.
3. After approval: generate importable deterministic L2/L3 JSON and TEST-MCP.md, run manual imports and smoke tests.

Approve to persist the spec file into the repo and mark spec-l1/spec-l2/spec-l3 todos as ready for implementation.
