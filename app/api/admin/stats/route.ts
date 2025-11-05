import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function getUptime() {
  try {
    const apiKey = process.env.UPTIMEROBOT_API_KEY;
    if (!apiKey) {
      console.warn("NO UPTIMEROBOT API KEY FOUND");
      return 100;
    }

    const response = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        custom_uptime_ratios: "30"
      })
    });

    const data = await response.json();
    console.log("UPTIME API RESPONSE:", data);

    if (!data?.monitors?.length) {
      console.warn("NO MONITORS FOUND IN RESPONSE");
      return 100;
    }

    const avg =
      data.monitors.reduce((sum: number, m: any) => {
        return sum + Number(m.custom_uptime_ratio || 100);
      }, 0) / data.monitors.length;

    return Math.round(avg);
  } catch (err) {
    console.error("UPTIME ERROR:", err);
    return 100;
  }
}

export async function GET() {
  try {
    console.log("LOADING STATS…");

    const clients = await prisma.client.count();
    const projects = await prisma.project.count();

    // Tickets schema safe fallback
    const tickets = await prisma.ticket.count().catch(() => {
      console.warn("NO TICKET MODEL? USING 0");
      return 0;
    });

    const uptime30 = await getUptime();

    console.log("📊 RETURNING STATS:", {
      clients,
      projects,
      ticketsOpen: tickets,
      uptime30
    });

    return NextResponse.json(
      {
        clients,
        projects,
        ticketsOpen: tickets,
        uptime30
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("STATS FAIL BIG TIME:", err);
    return NextResponse.json(
      { error: "Failure loading stats", details: err.message },
      { status: 500 }
    );
  }
}