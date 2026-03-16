import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeLifeScore } from "@/lib/lifeScore";

// GET /api/score?date=2026-03-16
export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id") || "demo-user";
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const date = new Date(dateStr);

    const log = await prisma.dailyLog.findFirst({
      where: { userId, date },
    });

    if (!log) {
      return NextResponse.json({ data: { total: 0, categories: {}, streakBonus: 0, message: "No data logged for this date" }, success: true, error: null });
    }

    const score = computeLifeScore(log as never);

    // Cache the computed score
    if (log.lifeScore !== score.total) {
      await prisma.dailyLog.update({
        where: { id: log.id },
        data: { lifeScore: score.total },
      });
    }

    return NextResponse.json({ data: score, success: true, error: null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ data: null, success: false, error: "Failed to compute score" }, { status: 500 });
  }
}
