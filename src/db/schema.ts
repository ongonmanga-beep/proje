import { pgTable, text, numeric, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";

/* ───────── Users ───────── */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("users_email_idx").on(t.email)]);

/* ───────── Portfolios ───────── */
export const portfolios = pgTable("portfolios", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  currency: text("currency").notNull().default("TRY"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [index("portfolios_user_idx").on(t.userId)]);

/* ───────── Holdings ───────── */
export const holdings = pgTable("holdings", {
  id: uuid("id").defaultRandom().primaryKey(),
  portfolioId: uuid("portfolio_id")
    .references(() => portfolios.id, { onDelete: "cascade" })
    .notNull(),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // stock | crypto | fund
  quantity: numeric("quantity").notNull(),
  avgBuyPrice: numeric("avg_buy_price").notNull(),
  totalPrice: numeric("total_price").notNull(),
  currentPrice: numeric("current_price"),
  currency: text("currency").notNull().default("TRY"),
  lastUpdated: timestamp("last_updated"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (t) => [index("holdings_portfolio_idx").on(t.portfolioId)]);

/* ───────── Transactions ───────── */
export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  holdingId: uuid("holding_id")
    .references(() => holdings.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(), // buy | sell
  quantity: numeric("quantity").notNull(),
  price: numeric("price").notNull(),
  totalCost: numeric("total_cost").notNull(),
  currency: text("currency").notNull().default("TRY"),
  note: text("note"),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
}, (t) => [index("transactions_holding_idx").on(t.holdingId)]);

/* ───────── Price History ───────── */
export const priceHistory = pgTable("price_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  symbol: text("symbol").notNull(),
  price: numeric("price").notNull(),
  currency: text("currency").notNull().default("TRY"),
  source: text("source").notNull(), // yahoo | coingecko | tefas
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

export const holdingsRelations = relations(holdings, ({ one, many }) => ({
  portfolio: one(portfolios, { fields: [holdings.portfolioId], references: [portfolios.id] }),
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  holding: one(holdings, { fields: [transactions.holdingId], references: [holdings.id] }),
}));

/* ───────── Zod Schemas ───────── */
export const selectUserSchema = createSelectSchema(users);
export const selectPortfolioSchema = createSelectSchema(portfolios);
export const selectHoldingSchema = createSelectSchema(holdings);
export const selectTransactionSchema = createSelectSchema(transactions);
