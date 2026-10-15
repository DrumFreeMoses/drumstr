#!/bin/bash
# bootstrap-av.sh — One-time A/V VPS setup (Hetzner shared vCPU, Ubuntu 24.04)
# Deployed 2026-10-14 on av-drumstr (204.168.251.185, 2 vCPU / 4GB).
# Per docs/specs/INFRA-SPEC.md + HIVETALK-AV-SPEC.md (v1 = MiroTalk SFU).
# Domain decision (2026-10-14): drumstr.app is FUTURE. Real domain: drumfreeexperience.org.
#   A/V host: av.drumfreeexperience.org (Cloudflare grey-cloud / DNS-only — WebRTC needs direct IP)
# Run as root on a fresh box: curl -fsSL <raw-url>/bootstrap-av.sh | bash
set -euo pipefail

AV_PORT_MIN=40000
AV_PORT_MAX=40200
APP_PORT=3010

echo "==> apt update + base packages"
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git ufw ca-certificates gnupg

echo "==> Docker"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
fi

echo "==> Firewall (SSH + HTTP(S) + WebRTC UDP/TCP ${AV_PORT_MIN}-${AV_PORT_MAX})"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow "${AV_PORT_MIN}:${AV_PORT_MAX}/tcp"
ufw allow "${AV_PORT_MIN}:${AV_PORT_MAX}/udp"
ufw --force enable

echo "==> Deploy MiroTalk SFU (Docker)"
mkdir -p /opt/drumstr-av
cd /opt/drumstr-av
if [ ! -f docker-compose.yml ]; then
  curl -fsSL https://raw.githubusercontent.com/DrumFreeMoses/drumstr/main/infra/compose/docker-compose.av.yml -o docker-compose.yml
fi

# SFU_ANNOUNCED_IP must be this box's public IPv4 (WebRTC ICE candidate).
# Force -4: ifconfig.me otherwise returns the box's IPv6 and ICE breaks
# on IPv4-only/broken-IPv6 client networks (iPad spinner, 2026-10-15).
PUBLIC_IP=$(curl -4 -fsSL https://api.ipify.org || curl -4 -fsSL https://ifconfig.me)
cat > .env <<EOF
SFU_ANNOUNCED_IP=${PUBLIC_IP}
SFU_MIN_PORT=${AV_PORT_MIN}
SFU_MAX_PORT=${AV_PORT_MAX}
SFU_NUM_WORKERS=2
ENVIRONMENT=production
JWT_SECRET=$(openssl rand -hex 32)
API_KEY_SECRET=$(openssl rand -hex 32)
EOF

docker compose pull
docker compose up -d

echo "==> Verify"
sleep 3
curl -sf "http://127.0.0.1:${APP_PORT}/" >/dev/null && echo "MiroTalk SFU: UP on :${APP_PORT}" || echo "MiroTalk SFU: NOT RESPONDING — check: docker compose logs"

echo ""
echo "DONE. Public IP: ${PUBLIC_IP}"
echo "Next: point av.drumfreeexperience.org (Cloudflare, DNS-only/grey) at ${PUBLIC_IP},"
echo "then: certbot --nginx -d av.drumfreeexperience.org"
