import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const incidents = await prisma.incident.groupBy({
    by: ["startedAt"],
    _count: { startedAt: true }
  });

  const data = incidents.map(i => ({
    date: new Date(i.startedAt).toISOString().split("T")[0],
    count: i._count.startedAt
  }));

  return NextResponse.json(data);
}