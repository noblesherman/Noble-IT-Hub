import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const incidentId = parseInt(params.id, 10);

    if (isNaN(incidentId)) {
      return NextResponse.json({ error: "Invalid incident ID" }, { status: 400 });
    }

    const updated = await prisma.incident.update({
      where: { id: incidentId },
      data: { resolvedAt: new Date() }
    });

    return NextResponse.json({ success: true, incident: updated });
  } catch (err: any) {
    console.error("PATCH Error:", err);
    return NextResponse.json(
      { error: "Failed to update incident", details: err.message },
      { status: 500 }
    );
  }
}