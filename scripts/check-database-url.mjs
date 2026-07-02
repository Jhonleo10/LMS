import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

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

const url = process.env.DATABASE_URL ?? "";

if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
  console.error("\n❌ Invalid DATABASE_URL for Prisma (PostgreSQL required).\n");
  console.error(`   Current: ${url ? `"${url.slice(0, 48)}..."` : "(not set)"}\n`);
  console.error("   Fix locally:");
  console.error("   1. Start PostgreSQL:  npm run db:up   (requires Docker Desktop)");
  console.error("   2. Or use a cloud DB:  paste Neon/Supabase URL into .env");
  console.error("   3. Setup database:    npm run setup\n");
  console.error('   Local Docker URL in .env:');
  console.error('   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lms"\n');
  process.exit(1);
}
