import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const portfolios = sqliteTable("portfolios", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const holdings = sqliteTable("holdings", {
  id: text("id").primaryKey(),
  symbol: text("symbol").notNull(),
  quantity: real("quantity").notNull(),
  buyPrice: real("buy_price").notNull(),
  portfolioId: text("portfolio_id").references(() => portfolios.id).notNull(),
  type: text("type").notNull().default("stock"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  portfolios: many(portfolios),
}));

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
  user: one(users, { fields: [portfolios.userId], references: [users.id] }),
  holdings: many(holdings),
}));
