import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeLifeScore } from "@/lib/lifeScore";

// GET /api/metrics?from=&to=
export async function GET(req: NextRequest) {
  try {
    // TODO: Replace with actual session auth
    const userId = req.headers.get("x-user-id") || "demo-user";
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where = {
      userId,
      ...(from && to
        ? { date: { gte: new Date(from), lte: new Date(to) } }
        : {}),
    };

    const logs = await prisma.dailyLog.findMany({
      where,
      orderBy: { date: "desc" },
      take: 365,
    });

    return NextResponse.json({ data: logs, success: true, error: null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ data: null, success: false, error: "Failed to fetch metrics" }, { status: 500 });
  }
}

// POST /api/metrics
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id") || "demo-user";
    const body = await req.json();
    const { date, ...metrics } = body;

    const logDate = new Date(date || new Date().toISOString().split("T")[0]);

    const existing = await prisma.dailyLog.findFirst({
      where: { userId, date: logDate },
    });

    // Compute life score
    const scoreBreakdown = computeLifeScore(metrics);

    let log;
    if (existing) {
      log = await prisma.dailyLog.update({
        where: { id: existing.id },
        data: { ...metrics, lifeScore: scoreBreakdown.total, updatedAt: new Date() },
      });
    } else {
      log = await prisma.dailyLog.create({
        data: {
          userId,
          date: logDate,
          ...metrics,
          lifeScore: scoreBreakdown.total,
        },
      });
    }

    return NextResponse.json({ data: log, success: true, error: null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ data: null, success: false, error: "Failed to save metrics" }, { status: 500 });
  }
}
