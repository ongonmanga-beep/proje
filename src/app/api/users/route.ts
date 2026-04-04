import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function GET() {
  const all = await db.query.users.findMany({
    with: { portfolios: true },
  });
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const { email, name, passwordHash } = await req.json();
  const result = await db.insert(users).values({
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash: passwordHash || "none",
  }).returning();
  return NextResponse.json(result[0], { status: 201 });
}
