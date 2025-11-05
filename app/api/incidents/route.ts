import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET() {
  const incidents = await prisma.incident.findMany({
    orderBy: { startedAt: "desc" }
  });
  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title required" },
        { status: 400 }
      );
    }

    const incident = await prisma.incident.create({
      data: {
        title,
        description: description ?? null,
        startedAt: new Date(),
        resolvedAt: null
      }
    });

    return NextResponse.json(incident, { status: 201 });
  } catch (err) {
    console.error("Incident POST failed:", err);
    return NextResponse.json(
      { error: "Failed to create incident" },
      { status: 500 }
    );
  }
} 