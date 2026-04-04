import { pgTable, uuid, varchar, doublePrecision, timestamp, text, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ───────── Users ───────── */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("users_email_idx").on(t.email)]);

/* ───────── Portfolios ───────── */
export const portfolios = pgTable("portfolios", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("TRY"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("portfolios_user_idx").on(t.userId)]);

/* ───────── Holdings ───────── */
export const holdings = pgTable("holdings", {
  id: uuid("id").defaultRandom().primaryKey(),
  portfolioId: uuid("portfolio_id").references(() => portfolios.id, { onDelete: "cascade" }).notNull(),
  symbol: varchar("symbol", { length: 30 }).notNull(),
  name: varchar("name", { length: 255 }),
  type: varchar("type", { length: 20 }).notNull(), // stock, crypto, fund, forex
  quantity: doublePrecision("quantity").notNull(),
  avgBuyPrice: doublePrecision("avg_buy_price").notNull(),
  currentPrice: doublePrecision("current_price"),
  currency: varchar("currency", { length: 10 }).notNull().default("TRY"),
  lastUpdated: timestamp("last_updated"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (t) => [index("holdings_portfolio_idx").on(t.portfolioId)]);

/* ───────── Price History ───────── */
export const priceHistory = pgTable("price_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  symbol: varchar("symbol", { length: 30 }).notNull(),
  price: doublePrecision("price").notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("TRY"),
  source: varchar("source", { length: 20 }).notNull(), // yahoo, tefas
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
}, (t) => [index("price_history_symbol_idx").on(t.symbol)]);

/* ───────── Relations ───────── */
export const usersRelations = relations(users, ({ many }) => ({
  portfolios: many(portfolios),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, { fields: [portfolios.userId], references: [users.id] }),
  holdings: many(holdings),
}));

export const holdingsRelations = relations(holdings, ({ one }) => ({
  portfolio: one(portfolios, { fields: [holdings.portfolioId], references: [portfolios.id] }),
}));
