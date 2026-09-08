#!/usr/bin/env node
// Deploys dist/ (built by scripts/build-dist.sh) to mydiwalicrackers.com file-by-file, via
// Hostinger's TUS resumable-upload endpoint — NOT via hosting_deployStaticSiteArchiveV1 /
// hosting_deployStaticWebsite.
//
// Why not the usual archive-based deploy (as documented in the hostinger-cicd skill): this
// site's document root has real, server-only state living next to the static files —
// api/uploads/product-images/<uuid>/... — product photos uploaded live through the admin
// panel, never tracked in git. The archive-deploy tools are explicitly documented as
// overwriting the website's existing contents ("cannot be undone"), and it's not established
// whether that clears the whole document root before extracting or only overlays matching
// paths. Given real production data is at stake, this script instead uploads only the files
// that are actually part of the site's known deployable set (dist/, which build-dist.sh
// assembles WITHOUT api/uploads/), each to its own path with override=true — so nothing
// outside that exact file list is ever touched, deleted, or at risk.
//
// Required env vars:
//   HOSTINGER_API_TOKEN — Hostinger API token (hpanel → API section)
//   HOSTINGER_DOMAIN     — the website's domain
//   BUILD_DIR            — path to the built static files (default: "dist")
//   DEPLOY_PATH_PREFIX   — remote subdirectory (relative to public_html) to upload into,
//                          e.g. "dev/" to deploy to dev.mydiwalicrackers.com (a subdomain
//                          whose root IS public_html/dev) without touching the production
//                          files at public_html itself. Default: "" (site root / production).

import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

function requireEnv(name) {
  const v = process.env[name];
  if (!v) { console.error(`Missing required env var: ${name}`); process.exit(1); }
  return v;
}

async function callTool(client, name, args) {
  const result = await client.callTool({ name, arguments: args });
  const text = result.content?.find(c => c.type === "text")?.text;
  if (!text) throw new Error(`Tool ${name} returned no text content: ${JSON.stringify(result)}`);
  return JSON.parse(text);
}

function walk(dir, base = dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, base, out);
    } else {
      out.push(relative(base, full));
    }
  }
  return out;
}

async function uploadFile(uploadUrl, authKey, restAuthKey, localPath, remotePath) {
  const bytes = readFileSync(localPath);
  const dest = `${uploadUrl}/${remotePath}?override=true`;
  const headers = {
    "X-Auth": authKey,
    "X-Auth-Rest": restAuthKey,
    "Tus-Resumable": "1.0.0",
  };

  const createRes = await fetch(dest, {
    method: "POST",
    headers: { ...headers, "Upload-Length": String(bytes.length), "Upload-Offset": "0" },
  });
  if (!createRes.ok) {
    throw new Error(`create failed for ${remotePath}: ${createRes.status} ${await createRes.text()}`);
  }

  const patchRes = await fetch(dest, {
    method: "PATCH",
    headers: { ...headers, "Content-Type": "application/offset+octet-stream", "Upload-Offset": "0" },
    body: bytes,
  });
  if (!patchRes.ok) {
    throw new Error(`upload failed for ${remotePath}: ${patchRes.status} ${await patchRes.text()}`);
  }
}

async function main() {
  const apiToken = requireEnv("HOSTINGER_API_TOKEN");
  const domain = requireEnv("HOSTINGER_DOMAIN");
  const buildDir = process.env.BUILD_DIR || "dist";
  const pathPrefix = process.env.DEPLOY_PATH_PREFIX || "";

  const files = walk(buildDir);
  if (files.length === 0) {
    console.error(`No files found in ${buildDir}/ — did the predeploy build step run?`);
    process.exit(1);
  }
  console.log(`Found ${files.length} files in ${buildDir}/ to deploy to ${domain}.`);

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp"],
    env: { ...process.env, HOSTINGER_API_TOKEN: apiToken },
  });
  const client = new Client({ name: "static-deploy-script", version: "1.0.0" });
  await client.connect(transport);

  try {
    const sites = await callTool(client, "hosting_listWebsitesV1", { domain });
    const site = sites.data?.find(w => w.domain === domain);
    if (!site) throw new Error(`No website found for domain ${domain}`);
    const username = site.username;

    console.log(`Requesting upload URL for ${username}/${domain}...`);
    const upload = await callTool(client, "hosting_generateUploadURLV1", { username, domain });

    let done = 0;
    for (const relPath of files) {
      const localPath = join(buildDir, relPath);
      const remotePath = pathPrefix + relPath;
      await uploadFile(upload.url, upload.auth_key, upload.rest_auth_key, localPath, remotePath);
      done += 1;
      console.log(`  [${done}/${files.length}] ${remotePath}`);
    }

    const target = pathPrefix ? `https://${domain}/${pathPrefix}` : `https://${domain}`;
    console.log(`✓ Deployed ${done} files to ${target} (api/uploads/ was not touched).`);
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error("Deploy failed:", err); process.exit(1); });
