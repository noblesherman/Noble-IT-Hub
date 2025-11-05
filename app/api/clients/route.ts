import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const prisma = new PrismaClient();
/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Get all clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: List of clients
 *   post:
 *     summary: Create a client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               website:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created client
 */
// GET ALL CLIENTS
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error("GET /api/clients failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

// CREATE NEW CLIENT
export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.name) {
      return NextResponse.json(
        { error: "Client name required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.create({
      data: {
        name: data.name,
        website: data.website || "",
        logoUrl: data.logoUrl || ""
      }
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("POST /api/clients failed:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 }
    );
  }
}

// DELETE CLIENT
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Client ID required" },
        { status: 400 }
      );
    }

    await prisma.client.delete({ where: { id } });

    return NextResponse.json(
      { message: "Client deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/clients failed:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}