import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const portfolioId = searchParams.get("portfolioId");

  if (!portfolioId) {
    return NextResponse.json({ error: "portfolioId required" }, { status: 400 });
  }

  const holdings = await prisma.holding.findMany({
    where: { portfolioId },
  });
  return NextResponse.json(holdings);
}

export async function POST(req: Request) {
  const { symbol, quantity, buyPrice, portfolioId } = await req.json();
  const holding = await prisma.holding.create({
    data: { symbol, quantity, buyPrice, portfolioId },
  });
  return NextResponse.json(holding, { status: 201 });
}
