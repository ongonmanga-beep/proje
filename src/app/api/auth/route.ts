import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user || user.passwordHash !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  return NextResponse.json(user);
}
