import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params?: any }
) {
  try {
    // Handles both new and old Next.js param behaviors
    const params = await (context.params ?? context);
    const idStr = params.id ?? params.params?.id;
    const incidentId = parseInt(idStr, 10);

    if (isNaN(incidentId)) {
      console.error("Bad ID:", params);
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const updated = await prisma.incident.update({
      where: { id: incidentId },
      data: {
        resolvedAt: new Date()
      }
    });

    console.log("Resolved incident", updated.id);

    return NextResponse.json({ success: true, incident: updated });
  } catch (err) {
    console.error("PATCH ERROR:", err);
    return NextResponse.json(
      { error: "Failed to resolve incident" },
      { status: 500 }
    );
  }
}