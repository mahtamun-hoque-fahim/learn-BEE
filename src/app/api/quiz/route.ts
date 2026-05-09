import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { quizAttempts, userProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { chapterId, answers, score, total, passed } = body;

    if (!chapterId || score === undefined) {
      return NextResponse.json({ error: "chapterId and score required" }, { status: 400 });
    }

    const db = getDb();

    // Record the attempt
    await db.insert(quizAttempts).values({
      userId,
      chapterId,
      answers: answers ?? {},
      score,
      total: total ?? 10,
      passed: passed ?? score / total >= 0.7,
    });

    // Update progress if passed
    if (passed) {
      const existing = await db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.chapterId, chapterId)));

      if (existing.length > 0) {
        await db
          .update(userProgress)
          .set({ quizPassed: true, quizScore: score, updatedAt: new Date() })
          .where(and(eq(userProgress.userId, userId), eq(userProgress.chapterId, chapterId)));
      }
    }

    return NextResponse.json({ success: true, passed, score });
  } catch (error) {
    console.error("Quiz POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const chapterId = searchParams.get("chapterId");

    const db = getDb();
    const query = chapterId
      ? db.select().from(quizAttempts).where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.chapterId, chapterId)))
      : db.select().from(quizAttempts).where(eq(quizAttempts.userId, userId));

    const attempts = await query;
    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("Quiz GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
