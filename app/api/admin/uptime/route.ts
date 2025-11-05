import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      where: {
        startedAt: {
          // Only events in last 30 days
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { startedAt: "asc" }
    });

    const days = Array.from({ length: 30 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - index));
      const dayString = date.toISOString().split("T")[0];

      const down = incidents.some((inc) => {
        const start = new Date(inc.startedAt);
        const end = inc.resolvedAt ? new Date(inc.resolvedAt) : new Date();
        return (
          start <= new Date(dayString + "T23:59:59") &&
          end >= new Date(dayString + "T00:00:00")
        );
      });

      return {
        date: dayString,
        uptime: down ? 0.99 : 1.0
      };
    });

    return NextResponse.json(days, { status: 200 });

  } catch (error) {
    console.error("Failed to load uptime graph:", error);
    return NextResponse.json(
      { error: "Stats error" },
      { status: 500 }
    );
  }
}