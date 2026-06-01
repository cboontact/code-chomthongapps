import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const standaloneDir = join(root, ".next", "standalone");
const staticSource = join(root, ".next", "static");
const staticTarget = join(standaloneDir, ".next", "static");
const publicSource = join(root, "public");
const publicTarget = join(standaloneDir, "public");
const appEntryTarget = join(standaloneDir, "app.js");

if (!existsSync(standaloneDir)) {
  throw new Error("Missing .next/standalone. Run npm run build first.");
}

mkdirSync(join(standaloneDir, ".next"), { recursive: true });

if (existsSync(staticSource)) {
  rmSync(staticTarget, { recursive: true, force: true });
  cpSync(staticSource, staticTarget, { recursive: true });
}

if (existsSync(publicSource)) {
  rmSync(publicTarget, { recursive: true, force: true });
  cpSync(publicSource, publicTarget, { recursive: true });
}

writeFileSync(
  appEntryTarget,
  `const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\\r?\\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^[\\"']|[\\"']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

require("./server.js");
`,
);

console.log("Standalone bundle is ready in .next/standalone");
