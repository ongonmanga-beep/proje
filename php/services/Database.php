<?php
class DB {
    private static $pdo = null;

    public static function connect(): PDO {
        if (self::$pdo === null) {
            $dbPath = __DIR__ . '/../data/portfolio.db';
            $dbDir = dirname($dbPath);
            if (!is_dir($dbDir)) mkdir($dbDir, 0755, true);
            $exists = file_exists($dbPath);

            self::$pdo = new PDO('sqlite:' . $dbPath);
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            self::$pdo->exec('PRAGMA foreign_keys = ON');

            if (!$exists) {
                self::$pdo->exec("
                    CREATE TABLE users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL,
                        name TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE portfolios (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        name TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE TABLE holdings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        portfolio_id INTEGER NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
                        symbol TEXT NOT NULL,
                        type TEXT NOT NULL,
                        quantity REAL NOT NULL,
                        avg_buy_price REAL NOT NULL,
                        current_price REAL,
                        added_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );
                ");
            }
        }
        return self::$pdo;
    }
}
