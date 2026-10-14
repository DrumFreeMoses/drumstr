#!/bin/bash
# deploy-landing.sh — rsync landing-page/ to cPanel hosting (stableserver)
# One-time setup done 2026-10-14: key ~/.ssh/id_dfe_web authorized in cPanel.
# Both docroots updated: ~/drumstr.drumfreeexperience.org (subdomain)
#                        ~/public_html/drumstr (drumfreeexperience.org/drumstr path)
set -euo pipefail
cd "$(dirname "$0")/../.."

HOST="comedrum@190.92.170.162"
KEY="$HOME/.ssh/id_dfe_web"
SSH_CMD=(ssh -o BatchMode=yes -o IdentitiesOnly=yes -i "$KEY")

echo "==> Remote sanity check"
"${SSH_CMD[@]}" "$HOST" 'echo ok: $(whoami)@$(hostname)'

echo "==> Sync landing-page/ → ~/drumstr.drumfreeexperience.org/ (subdomain, primary)"
rsync -avz --delete -e "ssh -o BatchMode=yes -o IdentitiesOnly=yes -i $KEY" \
  --exclude='.DS_Store' landing-page/ "$HOST:~/drumstr.drumfreeexperience.org/"

echo "==> Sync landing-page/ → ~/public_html/drumstr/ (path URL)"
rsync -avz --delete -e "ssh -o BatchMode=yes -o IdentitiesOnly=yes -i $KEY" \
  --exclude='.DS_Store' landing-page/ "$HOST:~/public_html/drumstr/"

echo "==> Verify live"
curl -sf -m 10 https://drumstr.drumfreeexperience.org >/dev/null \
  && echo "LIVE OK: https://drumstr.drumfreeexperience.org" \
  || echo "WARN: live check failed — purge Cloudflare cache if stale"
