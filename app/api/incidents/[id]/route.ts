import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const incident = await prisma.incident.update({
      where: { id: numericId },
      data: { resolvedAt: new Date() }
    });

    return NextResponse.json(incident);
  } catch (error) {
    console.error("Failed to resolve incident:", error);
    return NextResponse.json(
      { error: "Failed to resolve incident" },
      { status: 500 }
    );
  }
}