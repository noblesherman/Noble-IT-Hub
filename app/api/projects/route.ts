import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const prisma = new PrismaClient();
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *   post:
 *     summary: Create a project
 *     tags: [Projects]
 */
// GET ALL PROJECTS
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true
      }
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("GET /api/projects failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// CREATE PROJECT
export async function POST(req: Request) {
  try {
    const data = await req.json();
    if (!data.title || !data.clientId) {
      return NextResponse.json(
        { error: "Required: title, clientId" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description || "",
        link: data.link || "",
        clientId: data.clientId
      }
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects failed:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// DELETE PROJECT
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Project ID required" },
        { status: 400 }
      );
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json(
      { message: "Project deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/projects failed:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}