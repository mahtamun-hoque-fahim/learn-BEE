import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { bonusAttempts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { answers, score, total, passed, mode, timeTaken } = body;

    const db = getDb();
    await db.insert(bonusAttempts).values({
      userId,
      answers: answers ?? {},
      score,
      total: total ?? 20,
      passed: passed ?? score / total >= 0.6,
      mode: mode ?? "practice",
      timeTaken: timeTaken ?? 0,
    });

    return NextResponse.json({ success: true, passed, score });
  } catch (error) {
    console.error("Bonus POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const attempts = await db.select().from(bonusAttempts).where(eq(bonusAttempts.userId, userId));
    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("Bonus GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
