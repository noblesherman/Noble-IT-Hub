import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const id = parseInt(context.params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updated = await prisma.incident.update({
      where: { id },
      data: {
        resolvedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, incident: updated });
  } catch (err) {
    console.error("PATCH ERROR:", err);
    return NextResponse.json(
      { error: "Failed to resolve incident" },
      { status: 500 }
    );
  }
}