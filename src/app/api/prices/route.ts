import { NextResponse } from "next/server";
import { updatePortfolioPrices } from "@/services/price";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const portfolioId = searchParams.get("portfolioId");

  if (!portfolioId) {
    return NextResponse.json(
      { error: "portfolioId required" },
      { status: 400 }
    );
  }

  const result = await updatePortfolioPrices(portfolioId);
  return NextResponse.json(result);
}
