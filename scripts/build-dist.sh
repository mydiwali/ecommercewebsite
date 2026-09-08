#!/bin/bash
# Assembles the deployable subset of this repo into dist/ so scripts/deploy-static-to-hostinger.mjs
# has a clean archive root (no README/*.md/*.sh docs, no .git, no node_modules).
#
# IMPORTANT — two things are deliberately EXCLUDED and must stay excluded:
#
# 1) api/uploads/ (only its .htaccess placeholder is tracked in git — real product images get
#    uploaded to it live, on the server, via the admin panel, and are never in this repo).
#
# 2) api/config.php. This file holds the LIVE database credentials and JWT secret for
#    mydiwalicrackers.com. Those values only ever exist on the server — they are not derivable
#    from anything in this repo, and there is no working secrets-injection mechanism for this
#    "other"/CloudLinux PHP hosting (no per-app env vars like Node.js hosting gets). git's copy of
#    api/config.php is a reference/local-dev template only, with placeholder values.
#
#    On 2026-09-08 this file WAS included in the deploy set, and one push overwrote the server's
#    real credentials with git's placeholders — api/products started 500ing and every product
#    image disappeared from the storefront until the real credentials were reconstructed by hand
#    (see git log around that date). Do not re-add api/config.php here without first setting up a
#    real secrets mechanism (server-side PHP env vars, or a git-ignored file that's uploaded once
#    and never touched by this script again) — "it's just another repo file" is exactly the
#    assumption that broke production.
# DEPLOY_TARGET=staging swaps in .htaccess.staging (same rules, minus the canonical
# redirect-to-production-domain rule, which would otherwise bounce every request on
# dev.mydiwalicrackers.com straight to the live site). Default: production.
DEPLOY_TARGET="${DEPLOY_TARGET:-production}"

set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist

cp -r index.html payments.html sw.js logo.png admin assets banners dist/
if [ "$DEPLOY_TARGET" = "staging" ]; then
  cp .htaccess.staging dist/.htaccess
else
  cp .htaccess dist/.htaccess
fi
mkdir -p dist/api
cp -r api/. dist/api/
rm -rf dist/api/uploads dist/api/config.php
mkdir -p dist/api/uploads
cp api/uploads/.htaccess dist/api/uploads/.htaccess 2>/dev/null || true

echo "dist/ assembled for DEPLOY_TARGET=$DEPLOY_TARGET (api/uploads/ and api/config.php excluded — see comment above):"
du -sh dist
