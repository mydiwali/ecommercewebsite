#!/bin/bash
# Assembles the deployable subset of this repo into dist/ so scripts/deploy-static-to-hostinger.mjs
# has a clean archive root (no README/*.md/*.sh docs, no .git, no node_modules).
#
# IMPORTANT: api/uploads/ is deliberately EXCLUDED (only its .htaccess placeholder is tracked in
# git — real product images get uploaded to it live, on the server, via the admin panel, and are
# never in this repo). Do not add it here without first confirming with Hostinger support/docs
# whether hosting_deployStaticSiteArchiveV1 fully wipes the destination before extracting, or
# only overlays matching paths — if it wipes, including this script's (empty) copy would delete
# every live product image on every deploy.
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
mkdir -p dist

cp -r index.html payments.html sw.js logo.png .htaccess admin assets banners dist/
mkdir -p dist/api
cp -r api/. dist/api/
rm -rf dist/api/uploads
mkdir -p dist/api/uploads
cp api/uploads/.htaccess dist/api/uploads/.htaccess 2>/dev/null || true

echo "dist/ assembled:"
du -sh dist
