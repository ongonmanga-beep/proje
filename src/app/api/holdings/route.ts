import { NextResponse } from "next/server";
import { db } from "@/db";
import { holdings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const portfolioId = searchParams.get("portfolioId");

  if (!portfolioId) {
    return NextResponse.json({ error: "portfolioId required" }, { status: 400 });
  }

  const data = await db.query.holdings.findMany({
    where: eq(holdings.portfolioId, portfolioId),
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { symbol, quantity, buyPrice, portfolioId, type } = await req.json();
  const result = await db
    .insert(holdings)
    .values({ symbol, quantity, buyPrice, portfolioId, type })
    .returning();
  return NextResponse.json(result[0], { status: 201 });
}
