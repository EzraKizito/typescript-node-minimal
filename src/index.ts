#!/usr/bin/env node
import { fileURLToPath } from "url";
import * as path from "node:path";
import * as fs from "node:fs";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const targetDir = process.argv[2] || "my-ts-app";
  const dest = path.resolve(process.cwd(), targetDir);
  const templateDir = path.join(__dirname, "../template");

  // Copy template
  fs.mkdirSync(dest, { recursive: true });
  for (const file of fs.readdirSync(templateDir)) {
    const src = path.join(templateDir, file);
    const dst = path.join(dest, file);
    fs.cpSync(src, dst, { recursive: true });
  }

  console.log(`✅ Project created at ${dest}`);

  // Try to install dependencies
  try {
    execSync("pnpm install", { stdio: "inherit", cwd: dest });
    console.log("✅ Dependencies installed");

    execSync("git init", { cwd: dest, stdio: "inherit" });

    const gitignoreContent = `node_modules/
    dist/
    build/
    *.log
    .DS_Store
    .env
    .env.local
    *.tsbuildinfo
    coverage/
    .nyc_output/
    `;

    fs.writeFileSync(path.join(dest, ".gitignore"), gitignoreContent);
    console.log("✅ Git repository initialized");
  } catch {
    console.log("⚠️  Failed to install dependencies automatically.");
  }
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
