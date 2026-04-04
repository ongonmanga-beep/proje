"use server";

import { z } from "zod";
import { db } from "@/db";
import { holdings, transactions } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const addTransactionSchema = z.object({
  holdingId: z.string().uuid(),
  type: z.enum(["buy", "sell"]),
  quantity: z.string().regex(/^\d+(\.\d+)?$/, "Geçersiz miktar"),
  price: z.string().regex(/^\d+(\.\d+)?$/, "Geçersiz fiyat"),
  currency: z.string().default("TRY"),
  note: z.string().optional(),
  executedAt: z.string().datetime(),
});

export async function addTransaction(input: z.infer<typeof addTransactionSchema>) {
  const validated = addTransactionSchema.parse(input);

  const totalCost = (
    parseFloat(validated.quantity) * parseFloat(validated.price)
  ).toFixed(8);

  await db.transaction(async (tx) => {
    const [newTx] = await tx
      .insert(transactions)
      .values({
        id: crypto.randomUUID(),
        holdingId: validated.holdingId,
        type: validated.type,
        quantity: validated.quantity,
        price: validated.price,
        totalCost,
        currency: validated.currency,
        note: validated.note ?? null,
        executedAt: new Date(validated.executedAt),
      })
      .returning();

    const existingHolding = await tx.query.holdings.findFirst({
      where: eq(holdings.id, validated.holdingId),
    });

    if (!existingHolding) {
      throw new Error("Holding bulunamadı");
    }

    const currentQty = parseFloat(existingHolding.quantity);
    const currentAvgPrice = parseFloat(existingHolding.avgBuyPrice);
    const newQty = parseFloat(validated.quantity);
    const newPrice = parseFloat(validated.price);

    let updatedQty: number;
    let updatedAvgPrice: number;
    let updatedTotalPrice: string;

    if (validated.type === "buy") {
      const totalCostBefore = currentQty * currentAvgPrice;
      const totalCostNew = newQty * newPrice;
      updatedQty = currentQty + newQty;
      updatedAvgPrice = updatedQty > 0 ? (totalCostBefore + totalCostNew) / updatedQty : currentAvgPrice;
      updatedTotalPrice = (updatedQty * updatedAvgPrice).toFixed(8);
    } else {
      updatedQty = currentQty - newQty;
      updatedAvgPrice = currentAvgPrice;
      if (updatedQty <= 0) {
        await tx.delete(holdings).where(eq(holdings.id, validated.holdingId));
        return { status: "success", message: "İşlem eklendi ve holding kapatıldı" };
      }
      updatedTotalPrice = (updatedQty * updatedAvgPrice).toFixed(8);
    }

    await tx
      .update(holdings)
      .set({
        quantity: updatedQty.toFixed(8),
        avgBuyPrice: updatedAvgPrice.toFixed(8),
        totalPrice: updatedTotalPrice,
        lastUpdated: new Date(),
      })
      .where(eq(holdings.id, validated.holdingId));
  });

  return { status: "success", message: "İşlem başarıyla eklendi" };
}

export async function getPortfolioHoldings(portfolioId: string) {
  return await db.query.holdings.findMany({
    where: and(
      eq(holdings.portfolioId, portfolioId),
    ),
    with: {
      transactions: true,
    },
    orderBy: (holdings, { desc }) => [desc(holdings.addedAt)],
  });
}

export async function getPortfolioSummary(portfolioId: string) {
  const allHoldings = await db.query.holdings.findMany({
    where: eq(holdings.portfolioId, portfolioId),
  });

  let totalCost = 0;
  let totalCurrent = 0;

  for (const h of allHoldings) {
    const qty = parseFloat(h.quantity);
    const avgPrice = parseFloat(h.avgBuyPrice);
    const currentPrice = h.currentPrice ? parseFloat(h.currentPrice) : avgPrice;
    totalCost += qty * avgPrice;
    totalCurrent += qty * currentPrice;
  }

  const pnl = totalCurrent - totalCost;
  const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

  return {
    totalCost: totalCost.toFixed(2),
    totalCurrent: totalCurrent.toFixed(2),
    pnl: pnl.toFixed(2),
    pnlPercent: pnlPercent.toFixed(2),
    holdingCount: allHoldings.length,
  };
}
