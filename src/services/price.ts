import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { holdings } from "@/db/schema";

export async function fetchCryptoPrices(symbols: string[]) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${symbols
      .map((s) => s.toLowerCase())
      .join(",")}&vs_currencies=usd`
  );
  return res.json();
}

export async function fetchTefasFunds() {
  const { exec } = await import("child_process");
  const util = await import("util");
  const execAsync = util.promisify(exec);

  const { stdout } = await execAsync(
    "cd /Users/hayli/.openclaw && source .venv/bin/activate && python3 -c \"from tefas import Crawler; tefas = Crawler(); data = tefas.fetch(start='2026-04-03'); print(data[['code','price']].to_json(orient='records'))\" 2>/dev/null"
  );

  try {
    return JSON.parse(stdout);
  } catch {
    return [];
  }
}

export async function updatePortfolioPrices(portfolioId: string) {
  const h = await db.query.holdings.findMany({
    where: eq(holdings.portfolioId, portfolioId),
  });

  const crypto = h
    .filter((x) => x.type === "crypto")
    .map((x) => x.symbol);

  const funds = h
    .filter((x) => x.type === "fund")
    .map((x) => x.symbol);

  let prices: Record<string, number> = {};

  if (crypto.length > 0) {
    const res = await fetchCryptoPrices(crypto);
    for (const [sym, val] of Object.entries(res)) {
      prices[sym] = (val as any).usd;
    }
  }

  if (funds.length > 0) {
    const res = await fetchTefasFunds();
    for (const item of res) {
      prices[item.code] = parseFloat(item.price);
    }
  }

  return { holdings: h, prices };
}
