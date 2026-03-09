---
Note-type: spec
status: Backlog
tags:
  - drumstr
  - infrastructure
  - devops
creation: 2026-03-07
modified: 2026-03-07
---

## AI Agent Rules
1. Do not change structure or delete sections — only add content.
2. TDD (red/green/refactor). MCP-first, jsonrpc 2.0. Maintain config guide with key decisions.
3. Favor reusable scripts and composable Docker services.
4. Simple solutions first — avoid over-engineering infra config.
5. If a deploy script exceeds ~100 lines, split into focused sub-scripts.
6. Make decisions for longevity. Document every non-obvious config decision.

---

# INFRA-SPEC — Infrastructure, DevOps & Hosting

## 1. Project Details

| Field | Value |
|---|---|
| Spec | INFRA-SPEC |
| Depends On | None (first to execute) |
| Blocks | BACKEND-API-SPEC, HIVETALK-AV-SPEC |
| Servers | Backend VPS (Infomaniak, CH) + A/V VPS (Hetzner, DE) |
| OS | Ubuntu 22.04 LTS (both servers) |

## 2. End Goal

Fully provisioned, dockerized, SSL-terminated infrastructure for Drumstr. Two VPS servers — one for the backend/API/database stack (Switzerland), one for A/V (Germany). GitHub Actions CI/CD pipeline auto-deploys on push to `main`. Cloudflare handles DNS and SSL termination.

## 3. Current Implementation Details

Repository initialized at `~/repos/drumstr`. Infrastructure directories do not yet exist.

**Repo current state:**
```
~/repos/drumstr/
├── apps/web/              ← placeholder
├── packages/shared/       ← placeholder
├── docs/specs/            ← all specs seeded (2026-03-09)
└── README.md
```

`infra/` and `.github/workflows/` are not yet created. No VPS servers provisioned yet (pending purchase).

## 4. Updated Implementation Details

```
infra/
├── docker/
│   ├── api.Dockerfile          # Backend API container
│   ├── nostr-relay.Dockerfile  # nostr-rs-relay container
│   └── nginx.Dockerfile        # Nginx reverse proxy container
├── compose/
│   ├── docker-compose.dev.yml  # Local development
│   └── docker-compose.prod.yml # Production (Backend VPS)
├── scripts/
│   ├── bootstrap-backend.sh    # One-time VPS setup (Ubuntu, Docker, firewall)
│   ├── bootstrap-av.sh         # One-time A/V VPS setup
│   ├── deploy-backend.sh       # Pull & restart backend services
│   └── deploy-av.sh            # Pull & restart A/V services
└── nginx/
    ├── api.conf                # Reverse proxy for API
    └── nostr.conf              # Reverse proxy for Nostr relay (wss://)

.github/workflows/
├── ci.yml                      # Run tests on PR
└── deploy.yml                  # Deploy to VPS on merge to main
```

## 5. Current Proposed Solution

### Server 1: Backend VPS (Infomaniak, Switzerland)
- **Purpose:** API, PostgreSQL, nostr-rs-relay, Wordpress/FluentCRM
- **Spec:** 4 vCPU, 4GB RAM, 40GB SSD (Infomaniak VPS-S or equivalent)
- **Estimated Cost:** CHF 9.50/mo ≈ $10.50/mo
- **OS:** Ubuntu 22.04 LTS
- **Services (Docker):** `api`, `postgres`, `nostr-relay`, `nginx`
- **Ports:** 22 (SSH), 80 (HTTP→HTTPS redirect), 443 (HTTPS)

### Server 2: A/V VPS (Hetzner, Germany)
- **Purpose:** HiveTalk / MiroTalk SFU for WebRTC A/V
- **Spec:** CX31 — 4 vCPU, 8GB RAM, 160GB SSD, 20TB traffic
- **Estimated Cost:** €14.38/mo ≈ $15.80/mo
- **OS:** Ubuntu 22.04 LTS
- **Services:** MiroTalk SFU (Node.js, systemd or Docker)
- **Ports:** 22 (SSH), 80, 443, 40000–40200 (WebRTC UDP/TCP for 100 users)

> **Port math:** MiroTalk SFU uses 2 ports per participant. 100 users = 200 ports (40000–40200). `SFU_MIN_PORT=40000`, `SFU_MAX_PORT=40200`.

### DNS (Cloudflare)
| Subdomain | Target | Purpose |
|---|---|---|
| drumstr.app | Backend VPS IP | Web app + API (Cloudflare proxied) |
| api.drumstr.app | Backend VPS IP | REST API |
| relay.drumstr.app | Backend VPS IP | Nostr relay (WSS) |
| av.drumstr.app | A/V VPS IP | HiveTalk/MiroTalk SFU |
| drumfreeexperience.org | drumstr.app | Redirect (301) |

### SSL
- Cloudflare handles SSL termination for all subdomains.
- Backend Nginx receives proxied HTTPS → forwards to localhost services.
- A/V VPS: Let's Encrypt via Certbot (MiroTalk SFU handles its own SSL).

### Docker Compose (Production — Backend VPS)
```yaml
# docker-compose.prod.yml (abbreviated)
services:
  postgres:
    image: postgres:16-alpine
    volumes: [pgdata:/var/lib/postgresql/data]
    environment:
      POSTGRES_DB: drumstr
      POSTGRES_USER: drumstr
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  nostr-relay:
    image: scsibug/nostr-rs-relay:latest
    volumes: [./config/nostr.toml:/usr/src/app/config.toml]
    ports: ["7777:7777"]

  api:
    build: { context: ., dockerfile: docker/api.Dockerfile }
    depends_on: [postgres, nostr-relay]
    environment:
      DATABASE_URL: postgresql://drumstr:${POSTGRES_PASSWORD}@postgres:5432/drumstr
      NOSTR_RELAY_URL: ws://nostr-relay:7777

  nginx:
    image: nginx:alpine
    volumes: [./nginx:/etc/nginx/conf.d]
    ports: ["80:80", "443:443"]
    depends_on: [api]
```

### CI/CD (GitHub Actions)
- `ci.yml`: On PR — run `pnpm test` across all packages using Turborepo.
- `deploy.yml`: On push to `main` — SSH into VPS, run `deploy-backend.sh` or `deploy-av.sh` based on changed paths.

## 6. Next Steps

1. **Purchase Infomaniak VPS (Backend)**
   - Visit https://www.infomaniak.com/en/hosting/vps
   - Select a plan with ≥ 4 vCPU, 4GB RAM (verify current pricing)
   - Choose Switzerland datacenter, Ubuntu 22.04 LTS
   - Note server IP

2. **Purchase Hetzner CX31 (A/V)**
   - Visit https://console.hetzner.cloud
   - Create server: CX31, Ubuntu 22.04 LTS, Nuremberg or Helsinki datacenter
   - Add SSH public key during creation
   - Note server IP

3. **Configure DNS on Cloudflare**
   - Add A records for all subdomains in the table above
   - Enable proxy (orange cloud) for all except `av.drumstr.app` (direct for WebRTC)
   - Set `av.drumstr.app` as DNS-only (grey cloud) — WebRTC requires direct IP

4. **Run bootstrap-backend.sh on Backend VPS**
   ```bash
   #!/bin/bash
   # bootstrap-backend.sh
   apt-get update -y && apt-get upgrade -y
   apt-get install -y curl git ufw
   # Install Docker
   curl -fsSL https://get.docker.com | sh
   systemctl enable docker
   # Firewall
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw --force enable
   # Clone repo
   git clone https://github.com/drumfreeexperience/drumstr.git /opt/drumstr
   ```

5. **Run bootstrap-av.sh on A/V VPS**
   ```bash
   #!/bin/bash
   # bootstrap-av.sh
   apt-get update -y && apt-get upgrade -y
   apt-get install -y curl git ufw ffmpeg nodejs npm
   # Firewall
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 40000:40200/tcp
   ufw allow 40000:40200/udp
   ufw --force enable
   # Clone MiroTalk SFU
   git clone https://github.com/miroslavpejic85/mirotalksfu.git /opt/mirotalksfu
   cd /opt/mirotalksfu && cp .env.template .env
   # Set ENVIRONMENT=production and SFU_ANNOUNCED_IP in .env
   # Set SFU_MIN_PORT=40000, SFU_MAX_PORT=40200, SFU_NUM_WORKERS=4
   ```

6. **Initialize monorepo locally**
   ```bash
   mkdir -p ~/repos/drumstr && cd ~/repos/drumstr
   git init
   pnpm init
   npx create-turbo@latest --skip-install
   # Create apps/mobile, apps/web, packages/api, packages/shared, packages/nostr
   ```

7. **Create `.env` files** (never commit to git):
   - `packages/api/.env`: `DATABASE_URL`, `NOSTR_RELAY_URL`, `FIREBASE_KEY`, `MDK_ACCESS_TOKEN`, `MDK_MNEMONIC`
   - `apps/web/.env.local`: `NEXT_PUBLIC_API_URL`, `MDK_ACCESS_TOKEN`, `MDK_MNEMONIC`

8. **Set up GitHub Actions secrets**: `VPS_SSH_KEY`, `VPS_HOST_BACKEND`, `VPS_HOST_AV`, `POSTGRES_PASSWORD`

9. **Test end-to-end**: SSH → VPS → `docker compose up -d` → verify API health endpoint.

## 7. Current Unresolved Issues

- Infomaniak pricing not confirmed — verify exact VPS tier and cost before provisioning.
- Cloudflare grey-cloud for `av.drumstr.app` means no DDoS protection on WebRTC ports — acceptable for bootstrap.
- Decide on nostr-rs-relay vs nostpy vs Strfry for Nostr relay (nostr-rs-relay chosen for now — lightweight, Rust).
- Wordpress/FluentCRM deployment on Backend VPS vs shared hosting — needs decision (current shared hosting may continue until migration).

## 8. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-03-07 | Moses / Copilot | Initial spec created |
