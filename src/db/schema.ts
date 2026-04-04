import { sqliteTable, text, real, integer, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (t) => [index("users_email_idx").on(t.email)]);

export const portfolios = sqliteTable("portfolios", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  currency: text("currency").notNull().default("TRY"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (t) => [index("portfolios_user_idx").on(t.userId)]);

export const holdings = sqliteTable("holdings", {
  id: text("id").primaryKey(),
  portfolioId: text("portfolio_id")
    .references(() => portfolios.id, { onDelete: "cascade" })
    .notNull(),
  symbol: text("symbol").notNull(),
  name: text("name"),
  type: text("type").notNull(),
  quantity: real("quantity").notNull(),
  avgBuyPrice: real("avg_buy_price").notNull(),
  currentPrice: real("current_price"),
  currency: text("currency").notNull().default("TRY"),
  lastUpdated: integer("last_updated", { mode: "timestamp" }),
  addedAt: integer("added_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (t) => [index("holdings_portfolio_idx").on(t.portfolioId)]);

export const priceHistory = sqliteTable("price_history", {
  id: text("id").primaryKey(),
  symbol: text("symbol").notNull(),
  price: real("price").notNull(),
  currency: text("currency").notNull().default("TRY"),
  source: text("source").notNull(),
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (t) => [index("price_history_symbol_idx").on(t.symbol)]);

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
