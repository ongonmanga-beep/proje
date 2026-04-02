import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request) {
  const portfolios = await prisma.portfolio.findMany({
    include: { holdings: true },
  });
  return NextResponse.json(portfolios);
}

export async function POST(req: Request) {
  const { name, userId } = await req.json();
  const portfolio = await prisma.portfolio.create({
    data: { name, userId },
  });
  return NextResponse.json(portfolio, { status: 201 });
}
