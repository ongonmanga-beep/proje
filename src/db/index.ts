import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import * as schema from "./schema";

const dbPath = path.join(process.cwd(), "data", "portfolio.db");

// Always recreate on startup
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

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
  CREATE INDEX users_email_idx ON users(email);

  CREATE TABLE portfolios (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TRY',
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );
  CREATE INDEX portfolios_user_idx ON portfolios(user_id);

  CREATE TABLE holdings (
    id TEXT PRIMARY KEY,
    portfolio_id TEXT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    name TEXT,
    type TEXT NOT NULL,
    quantity REAL NOT NULL,
    avg_buy_price REAL NOT NULL,
    current_price REAL,
    currency TEXT NOT NULL DEFAULT 'TRY',
    last_updated INTEGER,
    added_at INTEGER DEFAULT (strftime('%s', 'now'))
  );
  CREATE INDEX holdings_portfolio_idx ON holdings(portfolio_id);

  CREATE TABLE price_history (
    id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    price REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'TRY',
    source TEXT NOT NULL,
    recorded_at INTEGER DEFAULT (strftime('%s', 'now'))
  );
  CREATE INDEX price_history_symbol_idx ON price_history(symbol);
`);

console.log("✅ Database created:", dbPath);

export const db = drizzle(sqlite, { schema });
