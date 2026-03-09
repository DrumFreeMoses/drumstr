---
Note-type: spec
status: Backlog
tags:
  - drumstr
  - dfe
  - architecture
creation: 2026-03-07
modified: 2026-03-07
---

## AI Agent Rules
1. Do not change structure or delete sections — only add content.
2. Apply TDD (red/green/refactor). MCP-first using jsonrpc 2.0. Maintain a config guide with key decisions.
3. Favor reusable wrapper/container components; prefer composition.
4. Favor simple solutions. Do not jump to abstractions — consult human if a flow seems overly complex.
5. If nesting exceeds ~5-6 levels, extract a wrapper/container component.
6. Make decisions for longevity without over-engineering. You are a key contributor — own the architecture.

---

# DRUMSTR — Master Specification

## 1. Project Details

| Field | Value |
|---|---|
| Project Name | Drumstr |
| Organization | Drum Free Experience (DFE) |
| Version | 0.1.0 (v1 Bootstrap) |
| Primary Domain | drumstr.app |
| Redirect Domain | drumfreeexperience.org → drumstr.app |
| Code Repository | ~/repos/drumstr |
| Spec Repository | projects/dfe/Drumstr/ (Obsidian vault) |
| Created | 2026-03-07 |

## 2. End Goal

A sleek, modular, mobile-first, globally-accessible virtual group drumming network. Drumstr replaces the legacy DFE Wordpress site as the primary product. It enables users to discover and join virtual group drumming sessions, request events, pay facilitators, and connect globally — all powered by a privacy-first, decentralized stack.

**v1 Scope:** Identity (Nostr), Events, A/V (HiveTalk/MiroTalk SFU), Payments (MoneyDevKit).

## 3. Current Implementation Details

Repository initialized at `~/repos/drumstr`. Initial commit complete. Skeleton directories created.

```
~/repos/drumstr/           ← Repo root (initial commit, 2026-03-09)
├── apps/
│   └── web/               ← Placeholder (empty)
├── packages/
│   └── shared/            ← Placeholder (empty)
├── docs/
│   ├── specs/             ← All spec files seeded (this file + 9 others)
│   └── PRE-SERVER-TASKS.md
└── README.md

projects/dfe/Drumstr/      ← Obsidian Kanban task management (not in repo)
```

**Still to create per §4 monorepo structure:**
- `apps/mobile/`
- `packages/api/`
- `packages/nostr/`
- `infra/docker/`, `infra/compose/`, `infra/scripts/`, `infra/nginx/`
- `.github/workflows/`
- Root config files: `turbo.json`, `pnpm-workspace.yaml`, root `package.json`

## 4. Updated Implementation Details

### Monorepo Structure

```
~/repos/drumstr/
├── apps/
│   ├── mobile/                  # Expo (React Native, TypeScript) — iOS + Android
│   └── web/                     # Next.js (TypeScript, App Router) — web app
├── packages/
│   ├── api/                     # Node.js/Express (TypeScript) — REST backend
│   ├── shared/                  # Shared types, constants, utilities
│   └── nostr/                   # Nostr client utilities (keypairs, relays, events)
├── infra/
│   ├── docker/                  # Dockerfiles per service
│   ├── compose/                 # docker-compose files (dev, prod)
│   └── scripts/                 # Deployment & bootstrap scripts
├── .github/
│   └── workflows/               # GitHub Actions CI/CD
├── turbo.json                   # Turborepo config
├── pnpm-workspace.yaml          # pnpm workspaces config
├── package.json                 # Root package.json
└── README.md
```

### Spec Files

| Spec | Purpose |
|---|---|
| DRUMSTR-MASTER-SPEC.md | This file — system overview, decisions, architecture |
| INFRA-SPEC.md | VPS setup, Docker, CI/CD, DNS, SSL |
| BACKEND-API-SPEC.md | Node.js/TypeScript REST API, PostgreSQL |
| HIVETALK-AV-SPEC.md | Self-hosted HiveTalk/MiroTalk SFU (A/V server) |
| NOSTR-IDENTITY-SPEC.md | Nostr key-based identity, profiles, relay |
| EVENT-MGMT-SPEC.md | Event requests, facilitator availability, Zaps |
| MONEYDEVKIT-SPEC.md | Lightning payments, admin split distribution |
| MOBILE-APP-SPEC.md | Expo/React Native mobile app |
| WEB-APP-SPEC.md | Next.js web app |

## 5. Current Proposed Solution — High-Level Architecture

### Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Mobile App | Expo (React Native, TypeScript) | Cross-platform iOS/Android, TypeScript, large ecosystem |
| Web App | Next.js (TypeScript, App Router) | SSR/SEO, native MoneyDevKit SDK, React ecosystem |
| Backend API | Node.js + Express (TypeScript) | Unified language, fast, flexible |
| Database | PostgreSQL (via Prisma ORM) | Structured data, mature, Docker-friendly |
| A/V | HiveTalk (self-hosted, Nostr-native) | Privacy-first, Nostr identity integration, open-source |
| A/V Fallback | MiroTalk SFU (self-hosted) | Proven WebRTC SFU, well-documented, scales to 100+ |
| Identity | Nostr keypairs | Decentralized, censorship-resistant, privacy-preserving |
| Nostr Relay | nostr-rs-relay (self-hosted) | Lightweight, Rust-based, low resource usage |
| Payments | MoneyDevKit | Lightning, self-custodial, Next.js native, MCP-compatible |
| Notifications | Firebase Cloud Messaging (FCM) | Free tier, broad platform coverage |
| CDN | Cloudflare | Free tier, DDoS protection, DNS |
| Storage | Backblaze B2 | S3-compatible, $6/TB, privacy-friendly |
| Monorepo | pnpm + Turborepo | Fast installs, smart caching, workspace support |
| CI/CD | GitHub Actions + Docker | Standard, free tier |

### Infrastructure

| Server | Provider | Spec | Cost | Purpose |
|---|---|---|---|---|
| Backend VPS | Infomaniak (Switzerland) | 4 vCPU, 4GB RAM, 40GB SSD | CHF 9.50/mo ≈ $10.50 | API, PostgreSQL, Nostr relay, Wordpress/FluentCRM |
| A/V VPS | Hetzner (Germany) | 4 vCPU, 8GB RAM, 160GB, 20TB traffic | €14.38/mo ≈ $15.80 | HiveTalk/MiroTalk SFU |
| DNS/CDN | Cloudflare | — | Free | DNS, SSL, DDoS |
| Storage | Backblaze B2 | Pay-as-you-go | Free (10GB) → $6/TB | Media storage |
| Notifications | Firebase | Spark plan | Free | Push notifications |
| Domain | drumstr.app | Annual | ~$10/yr | Primary domain |
| **Total** | | | **~$26-28/mo USD** | Within bootstrap budget |

### Architecture Diagram

```mermaid
flowchart TD
    subgraph Client["Client Layer"]
        MOB["📱 Mobile App\n(Expo / React Native)"]
        WEB["🌐 Web App\n(Next.js)"]
    end

    subgraph BackendVPS["Backend VPS — Infomaniak, Switzerland"]
        API["🔧 REST API\n(Node.js / Express / TypeScript)"]
        DB["🗄️ PostgreSQL\n(Prisma ORM)"]
        RELAY["📡 Nostr Relay\n(nostr-rs-relay)"]
        WP["📝 Wordpress\n(FluentCRM + Blog)"]
    end

    subgraph AVVPS["A/V VPS — Hetzner, Germany"]
        HT["🎵 HiveTalk / MiroTalk SFU\n(WebRTC, self-hosted)"]
    end

    subgraph ExternalServices["External Services"]
        MDK["⚡ MoneyDevKit\n(Lightning Payments)"]
        FCM["🔔 Firebase FCM\n(Push Notifications)"]
        CF["🛡️ Cloudflare\n(DNS / CDN / SSL)"]
        B2["🗂️ Backblaze B2\n(Media Storage)"]
    end

    MOB -->|REST API| API
    MOB -->|WebView| HT
    MOB -->|WebView checkout| MDK
    WEB -->|REST API| API
    WEB -->|iframe / redirect| HT
    WEB -->|@moneydevkit/nextjs| MDK
    API --> DB
    API --> RELAY
    API --> FCM
    API --> B2
    API --> HT
    WP -->|contact sync| API
    CF -->|proxy| API
    CF -->|proxy| HT
    CF -->|proxy| WEB
```

## 6. Next Steps

1. Review and approve all sub-specs in this folder.
2. Create GitHub repo `drumstr` (monorepo).
3. Initialize monorepo: pnpm workspaces + Turborepo.
4. Provision VPS servers (Infomaniak + Hetzner).
5. Execute specs in this order (respecting dependencies):
   - INFRA-SPEC → BACKEND-API-SPEC → HIVETALK-AV-SPEC → NOSTR-IDENTITY-SPEC
   - EVENT-MGMT-SPEC → MONEYDEVKIT-SPEC (parallel, depends on API)
   - MOBILE-APP-SPEC + WEB-APP-SPEC (parallel, depends on API)

## 7. Current Unresolved Issues

- MoneyDevKit is in **public beta** — verify stability before production.
- MoneyDevKit has no native React Native SDK; mobile payments via WebView checkout (verify UX).
- HiveTalk self-hosting docs were inaccessible; using MiroTalk SFU docs as infrastructure reference.
- Confirm Infomaniak VPS specs and current pricing before provisioning.
- Payment split distribution (DFE % vs facilitator %) needs admin UI spec — defer to v1.1.

## 8. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-03-07 | Moses / Copilot | Initial master spec created |
