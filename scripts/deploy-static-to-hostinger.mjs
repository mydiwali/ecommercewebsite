#!/usr/bin/env node
// Static-site variant of deploy-to-hostinger.mjs — for a project with no
// server/build step on Hostinger's side (plain HTML/CSS/JS, or the pre-built
// output of a frontend framework you build locally/in CI before this runs).
//
// Uses hosting_deployStaticWebsite instead of hosting_deployJsApplication.
// Key difference from the Node.js variant: archive the BUILD OUTPUT directory
// (e.g. dist/, build/, out/), not the git repo — and index.html must be at
// the archive's root, not nested in a subfolder.
//
// Required env vars:
//   HOSTINGER_API_TOKEN — Hostinger API token (hpanel → API section)
//   HOSTINGER_DOMAIN     — the website's domain
//   BUILD_DIR            — path to the built static files (default: "dist")

import { execSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
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

async function main() {
  const apiToken = requireEnv("HOSTINGER_API_TOKEN");
  const domain = requireEnv("HOSTINGER_DOMAIN");
  const buildDir = process.env.BUILD_DIR || "dist";

  const archiveDir = mkdtempSync(join(tmpdir(), "hostinger-deploy-"));
  const stamp = new Date().toISOString().replace(/[-:T.]/g, "").slice(0, 14);
  const archivePath = join(archiveDir, `site_${stamp}.zip`);

  console.log(`Archiving ${buildDir}/ (index.html must be at its root)...`);
  // Zip the CONTENTS of buildDir, not the folder itself, so index.html lands at the archive root.
  execSync(`cd "${buildDir}" && zip -r "${archivePath}" .`, { stdio: "inherit" });

  const transport = new StdioClientTransport({
    command: "npx",
    args: ["--yes", "--package=hostinger-api-mcp@latest", "hostinger-hosting-mcp"],
    env: { ...process.env, HOSTINGER_API_TOKEN: apiToken },
  });
  const client = new Client({ name: "static-deploy-script", version: "1.0.0" });
  await client.connect(transport);

  try {
    console.log(`Deploying to ${domain}...`);
    await callTool(client, "hosting_deployStaticWebsite", { domain, archivePath, removeArchive: true });
    console.log(`✓ Deployed (static deploys are effectively immediate).`);
    console.log(`Live at: https://${domain}`);
  } finally {
    await client.close();
  }
}

main().catch(err => { console.error("Deploy failed:", err); process.exit(1); });
