/**
 * Fiyat servisleri:
 * - Yahoo Finance (hisse + kripto)
 * - TEFAS Crawler (Türk fonları)
 */
import { db } from "@/db";
import { holdings, priceHistory } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

/* ── Yahoo Finance ──────────────────────────────── */

async function fetchYahoo(symbols: string[]): Promise<Record<string, number>> {
  const res = await fetch(
    `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols.join(",")}&fields=regularMarketPrice`
  );
  const json = await res.json();
  const results: Record<string, number> = {};
  for (const q of json.quoteResponse?.result ?? []) {
    results[q.symbol] = q.regularMarketPrice;
  }
  return results;
}

/* ── TEFAS Crawler ──────────────────────────────── */

async function fetchTefasFunds(): Promise<Record<string, number>> {
  const { exec } = await import("child_process");
  const util = await import("util");
  const { stdout } = await util.promisify(exec)(
    `cd /Users/hayli/.openclaw && source .venv/bin/activate && python3 -c "
from tefas import Crawler
from datetime import datetime
tefas = Crawler()
data = tefas.fetch(start='${new Date().toISOString().split("T")[0]}')
print(data[['code','price']].to_json(orient='records'))
" 2>/dev/null`
  );
  try {
    const items: { code: string; price: string }[] = JSON.parse(stdout);
    const prices: Record<string, number> = {};
    for (const it of items) {
      prices[it.code] = parseFloat(it.price);
    }
    return prices;
  } catch {
    return {};
  }
}

/* ── Public API ─────────────────────────────────── */

export async function getPricesByType(symbols: string[], type: string) {
  if (symbols.length === 0) return {};
  if (type === "fund") return fetchTefasFunds();
  return fetchYahoo(symbols);
}

export async function refreshPortfolioPrices(portfolioId: string) {
  const allHoldings = await db.query.holdings.findMany({
    where: eq(holdings.portfolioId, portfolioId),
  });

  const byType: Record<string, string[]> = {};
  for (const h of allHoldings) {
    const t = h.type;
    if (!byType[t]) byType[t] = [];
    byType[t].push(h.symbol);
  }

  const prices: Record<string, number> = {};
  for (const [type, symbols] of Object.entries(byType)) {
    const p = await getPricesByType(symbols, type);
    Object.assign(prices, p);
  }

  for (const h of allHoldings) {
    const cp = prices[h.symbol];
    if (cp) {
      await db
        .update(holdings)
        .set({ currentPrice: cp, lastUpdated: new Date() })
        .where(eq(holdings.id, h.id));

      await db.insert(priceHistory).values({
        id: crypto.randomUUID(),
        symbol: h.symbol,
        price: cp,
        currency: h.currency,
        source: h.type === "fund" ? "tefas" : "yahoo",
      });
    }
  }

  return allHoldings.map((h) => ({
    ...h,
    currentPrice: h.currentPrice ?? prices[h.symbol] ?? null,
  }));
}
