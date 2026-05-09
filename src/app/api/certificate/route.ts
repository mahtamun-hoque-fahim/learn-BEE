import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { certificates, adminQuotes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const DEFAULT_QUOTES = {
  male: [
    "Knowledge is power. Electricity is energy. Together, you are unstoppable.",
    "Every great engineer was once a student who refused to give up.",
    "The circuit of your future is powered by the knowledge you gained today.",
    "Ohm's Law may be simple, but your potential is infinite.",
    "From voltage dividers to voltage leaders — you've made the journey.",
  ],
  female: [
    "You've proven that brilliance knows no boundaries.",
    "She who masters the circuit, masters her future.",
    "Every electron in every circuit knows: persistence powers progress.",
    "Charge forward. The world needs engineers like you.",
    "You didn't just complete a course. You completed a transformation.",
  ],
  other: [
    "The language of electricity speaks to all who listen.",
    "Understanding flows where curiosity leads.",
    "You've wired yourself for a brighter future.",
    "Beyond labels, beyond limits — you've learned what matters.",
    "The spark of knowledge you carry will light the way for others.",
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { studentName, university, department, semester, gender, bonusScore } = body;

    if (!studentName || !university) {
      return NextResponse.json({ error: "Name and university required" }, { status: 400 });
    }

    const db = getDb();

    // Try to get admin-set quote first
    let quote = "";
    try {
      const adminQuoteRows = await db
        .select()
        .from(adminQuotes)
        .where(
          and(
            eq(adminQuotes.gender, gender ?? "other"),
            eq(adminQuotes.isActive, true)
          )
        );

      if (adminQuoteRows.length > 0) {
        // Pick one relevant to semester if possible, else random
        const semesterMatches = adminQuoteRows.filter(q => !q.semester || q.semester === semester);
        const pool = semesterMatches.length > 0 ? semesterMatches : adminQuoteRows;
        quote = pool[Math.floor(Math.random() * pool.length)].quote;
      }
    } catch {
      // DB quotes unavailable, use defaults
    }

    // Fallback to defaults
    if (!quote) {
      const pool = DEFAULT_QUOTES[gender as keyof typeof DEFAULT_QUOTES] ?? DEFAULT_QUOTES.other;
      quote = pool[Math.floor(Math.random() * pool.length)];
    }

    const certId = `BEE-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // Save certificate record
    try {
      await db.insert(certificates).values({
        userId,
        studentName,
        university,
        department: department ?? "",
        semester: semester ?? "",
        gender: gender ?? "other",
        quote,
        bonusScore: bonusScore ?? 0,
        certId,
      });
    } catch {
      // Non-fatal if DB insert fails — still return cert data
    }

    return NextResponse.json({ success: true, quote, certId });
  } catch (error) {
    console.error("Certificate POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = getDb();
    const certs = await db.select().from(certificates).where(eq(certificates.userId, userId));
    return NextResponse.json({ certificates: certs });
  } catch (error) {
    console.error("Certificate GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
