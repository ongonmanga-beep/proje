import { NextResponse } from "next/server";
import { db } from "@/db";
import { portfolios, holdings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const data = await db.query.portfolios.findMany({
    with: { holdings: true },
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { name, userId } = await req.json();
  const result = await db
    .insert(portfolios)
    .values({ name, userId })
    .returning();
  return NextResponse.json(result[0], { status: 201 });
}
