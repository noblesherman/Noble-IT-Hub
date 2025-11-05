import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const BodySchema = z.object({
  client: z.object({
    name: z.string().min(1),
    website: z.string().url().optional(),
    logoUrl: z.string().url().optional()
  }),
  project: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    link: z.string().url().optional()
  }).optional(),
  incident: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    impact: z.string().optional(),
    startedAt: z.string().datetime().optional()
  }).optional(),
  createUptimeMonitor: z.boolean().optional(),
  createOnboardingTicket: z.boolean().optional()
});

async function createUptimeRobotMonitor(apiKey: string, url: string, friendlyName: string) {
  try {
    const res = await fetch("https://api.uptimerobot.com/v2/newMonitor", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        api_key: apiKey,
        type: "1",
        url,
        friendly_name: friendlyName
      }).toString()
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.error("UptimeRobot error:", e);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const input = BodySchema.parse(json);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Client
      const client = await tx.client.create({
        data: {
          name: input.client.name,
          website: input.client.website,
          logoUrl: input.client.logoUrl
        }
      });

      await tx.timelineEvent.create({
        data: {
          clientId: client.id,
          type: "client.created",
          title: `Client created: ${client.name}`,
          details: client.website ?? ""
        }
      });

      // 2. Project
      let project = null;
      if (input.project) {
        project = await tx.project.create({
          data: {
            title: input.project.title,
            description: input.project.description,
            link: input.project.link,
            clientId: client.id
          }
        });

        await tx.timelineEvent.create({
          data: {
            clientId: client.id,
            projectId: project.id,
            type: "project.created",
            title: `Project created: ${input.project.title}`,
            details: input.project.description
          }
        });

        await tx.trafficLog.create({
          data: {
            clientId: client.id,
            projectId: project.id,
            source: "onboarding",
            hits: 1
          }
        });
      }

      // 3. Incident
      let incident = null;
      if (input.incident) {
        incident = await tx.incident.create({
          data: {
            title: input.incident.title,
            description: input.incident.description,
            impact: input.incident.impact,
            startedAt: input.incident.startedAt ? new Date(input.incident.startedAt) : undefined
          }
        });

        await tx.timelineEvent.create({
          data: {
            clientId: client.id,
            projectId: project?.id,
            incidentId: incident.id,
            type: "incident.opened",
            title: `Incident opened: ${incident.title}`,
            details: incident.description ?? ""
          }
        });
      }

      // 4. Ticket
      let ticket = null;
      if (input.createOnboardingTicket) {
        ticket = await tx.ticket.create({
          data: {
            clientId: client.id,
            projectId: project?.id,
            subject: "Onboarding",
            message: "Welcome, initial setup ticket created"
          }
        });

        await tx.timelineEvent.create({
          data: {
            clientId: client.id,
            projectId: project?.id,
            type: "ticket.created",
            title: "Onboarding ticket",
            details: "Auto created"
          }
        });
      }

      return { client, project, incident, ticket };
    });

    // 5. Optional UptimeRobot
    let uptimeRobot = null;
    if (process.env.UPTIMEROBOT_API_KEY && input.createUptimeMonitor && input.client.website) {
      const data = await createUptimeRobotMonitor(
        process.env.UPTIMEROBOT_API_KEY,
        input.client.website,
        input.client.name
      );

      if (data?.stat === "ok" && data.monitor?.id) {
        await prisma.client.update({
          where: { id: result.client.id },
          data: { monitorId: String(data.monitor.id) }
        });

        await prisma.timelineEvent.create({
          data: {
            clientId: result.client.id,
            type: "monitor.created",
            title: "UptimeRobot monitor added",
            details: String(data.monitor.id)
          }
        });
      }
    }

    return NextResponse.json({ ok: true, ...result, uptimeRobot }, { status: 201 });

  } catch (err: any) {
    console.error("create-wizard error:", err);
    return NextResponse.json(
      { ok: false, error: err.message ?? "Invalid input" },
      { status: 400 }
    );
  }
}