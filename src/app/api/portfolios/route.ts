import { NextResponse } from "next/server";
import { db } from "@/db";
import { portfolios, holdings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const data = await db.query.portfolios.findMany({
    where: eq(portfolios.userId, userId),
    with: { holdings: true },
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { name, userId } = await req.json();
  const result = await db
    .insert(portfolios)
    .values({ id: crypto.randomUUID(), name, userId })
    .returning();
  return NextResponse.json(result[0], { status: 201 });
}
