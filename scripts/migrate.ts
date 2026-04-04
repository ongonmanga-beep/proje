import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = path.join(process.cwd(), "data", "portfolio.db");
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Delete old DB and recreate
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log("Eski DB silindi:", dbPath);
}

const sqlite = new Database(dbPath);
sqlite.pragma("foreign_keys = ON");

sqlite.exec(`
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE portfolios (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id),
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE holdings (
    id TEXT PRIMARY KEY,
    symbol TEXT NOT NULL,
    quantity REAL NOT NULL,
    buy_price REAL NOT NULL,
    portfolio_id TEXT NOT NULL REFERENCES portfolios(id),
    type TEXT NOT NULL DEFAULT 'stock',
    created_at INTEGER DEFAULT (strftime('%s', 'now'))
  );
`);

console.log("Tablolar oluşturuldu.");
sqlite.close();
