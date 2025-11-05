import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.UPTIMEROBOT_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing UPTIMEROBOT_API_KEY env" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        format: "json",
        logs: 1,
        response_times: 1,
        response_times_limit: 20,
        custom_uptime_ratios: "30"
      })
    });

    const data = await response.json();

    if (!data?.monitors) return NextResponse.json([], { status: 200 });

    const formatted = data.monitors.map((m: any) => ({
      id: m.id,
      name: m.friendly_name,
      url: m.url,
      status: m.status,
      uptime30: Number(m.custom_uptime_ratio) || 0,
      responseTimes: m.response_times?.map((rt: any) => rt.value || 100) || []
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("ADMIN STATUS ERROR", err);
    return NextResponse.json([], { status: 500 });
  }
}