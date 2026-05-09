import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { userProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const progress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Progress GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { chapterId, topicsRead, simulatorDone, quizPassed, quizScore, completed } = body;

    if (!chapterId) return NextResponse.json({ error: "chapterId required" }, { status: 400 });

    const db = getDb();

    // Upsert progress
    const existing = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.chapterId, chapterId)));

    if (existing.length > 0) {
      await db
        .update(userProgress)
        .set({
          topicsRead: topicsRead ?? existing[0].topicsRead,
          simulatorDone: simulatorDone ?? existing[0].simulatorDone,
          quizPassed: quizPassed ?? existing[0].quizPassed,
          quizScore: quizScore ?? existing[0].quizScore,
          completed: completed ?? existing[0].completed,
          updatedAt: new Date(),
        })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.chapterId, chapterId)));
    } else {
      await db.insert(userProgress).values({
        userId,
        chapterId,
        topicsRead: topicsRead ?? [],
        simulatorDone: simulatorDone ?? false,
        quizPassed: quizPassed ?? false,
        quizScore: quizScore ?? 0,
        completed: completed ?? false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Progress POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
