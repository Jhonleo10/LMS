import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

function loadDotEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDotEnv();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

const parsed = new URL(databaseUrl);
const dbName = parsed.pathname.replace(/^\//, "") || "lms";
parsed.pathname = "/postgres";
const adminUrl = parsed.toString();

const check = spawnSync(
  "npx",
  ["prisma", "db", "execute", "--stdin", "--url", adminUrl],
  {
    input: `SELECT 1 FROM pg_database WHERE datname = '${dbName.replace(/'/g, "''")}';`,
    encoding: "utf8",
    shell: true,
  }
);

if (check.status !== 0) {
  const message = (check.stderr || check.stdout || "").trim();
  console.error("\n❌ Could not connect to PostgreSQL.\n");
  if (message) console.error(`   ${message}\n`);
  console.error("   Start local PostgreSQL:");
  console.error("   • Docker:  npm run db:up   (start Docker Desktop first)");
  console.error("   • Or set DATABASE_URL to a Neon/Supabase URL in .env\n");
  process.exit(1);
}

if (!check.stdout?.includes("1")) {
  const create = spawnSync(
    "npx",
    ["prisma", "db", "execute", "--stdin", "--url", adminUrl],
    {
      input: `CREATE DATABASE "${dbName.replace(/"/g, '""')}";`,
      encoding: "utf8",
      shell: true,
    }
  );

  if (create.status !== 0) {
    const message = (create.stderr || create.stdout || "").trim();
    if (!message.includes("already exists")) {
      console.error("\n❌ Failed to create database.\n");
      console.error(`   ${message}\n`);
      process.exit(1);
    }
  } else {
    console.log(`✓ Created database "${dbName}"`);
  }
} else {
  console.log(`✓ Database "${dbName}" already exists`);
}
