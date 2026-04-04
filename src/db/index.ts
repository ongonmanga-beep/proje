import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import * as schema from "./schema";

const dbPath = path.join(process.cwd(), "data", "portfolio.db");
const dbDir = path.dirname(dbPath);
const flagPath = path.join(dbDir, ".db_init_v3");

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const needsInit = !fs.existsSync(flagPath);

if (needsInit && fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

if (needsInit) {
  const sqlite = new Database(dbPath);
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE portfolios (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'TRY',
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE holdings (
      id TEXT PRIMARY KEY,
      portfolio_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      name TEXT,
      type TEXT NOT NULL,
      quantity REAL NOT NULL,
      avg_buy_price REAL NOT NULL,
      current_price REAL,
      currency TEXT NOT NULL DEFAULT 'TRY',
      last_updated INTEGER,
      added_at INTEGER DEFAULT (strftime('%s', 'now')),
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
    );

    CREATE TABLE price_history (
      id TEXT PRIMARY KEY,
      symbol TEXT NOT NULL,
      price REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'TRY',
      source TEXT NOT NULL,
      recorded_at INTEGER DEFAULT (strftime('%s', 'now'))
    );
  `);
  sqlite.close();
  fs.writeFileSync(flagPath, "1");
  console.log("✅ DB tables created");
}

const sqlite = new Database(dbPath);
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });
