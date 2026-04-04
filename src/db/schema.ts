import { pgTable, uuid, varchar, doublePrecision, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ───────── Users ───────── */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ───────── Portfolios (her kullanıcının birden fazla portföyü olabilir) ───────── */
export const portfolios = pgTable("portfolios", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ───────── Holdings (varlıklar — portföye ait) ───────── */
export const holdings = pgTable("holdings", {
  id: uuid("id").defaultRandom().primaryKey(),
  portfolioId: uuid("portfolio_id")
    .references(() => portfolios.id, { onDelete: "cascade" })
    .notNull(),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("stock"), // stock | crypto | fund
  quantity: doublePrecision("quantity").notNull(),
  avgBuyPrice: doublePrecision("avg_buy_price").notNull(),
  currentPrice: doublePrecision("current_price"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

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
