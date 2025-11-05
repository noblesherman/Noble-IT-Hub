"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, FolderKanban, AlertTriangle, Activity } from "lucide-react";
import {
  UptimeChart,
  IncidentBarChart,
  ClientTrafficChart
} from "@/components/admin/charts";

type Stats = {
  clients: number;
  projects: number;
  ticketsOpen: number;
  uptime30: string | number;
};

export default function AdminHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [uptime, setUptime] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [traffic, setTraffic] = useState([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(setStats)
      .catch(() => setStats(null));

    fetch("/api/admin/uptime").then(r => r.json()).then(setUptime);
    fetch("/api/admin/incident-frequency").then(r => r.json()).then(setIncidents);
    fetch("/api/admin/client-traffic").then(r => r.json()).then(setTraffic);
  }, []);

  return (
    <div className="space-y-16 animate-fadeIn">

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tight text-neutral-900">
          Dashboard
        </h1>
        <p className="text-neutral-500 text-lg">
          Everything you need to run your empire.
        </p>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          label="Clients"
          value={stats?.clients}
          href="/admin/clients"
          icon={<Users className="w-6 h-6" />}
          color="from-blue-500/15 to-blue-500/5 text-blue-600"
        />
        <MetricCard
          label="Projects"
          value={stats?.projects}
          href="/admin/projects"
          icon={<FolderKanban className="w-6 h-6" />}
          color="from-green-500/15 to-green-500/5 text-green-600"
        />
        <MetricCard
          label="Open Tickets"
          value={stats?.ticketsOpen}
          href="/admin/tickets"
          icon={<AlertTriangle className="w-6 h-6" />}
          color="from-red-500/15 to-red-500/5 text-red-600"
        />
        <MetricCard
          label="Uptime (30d)"
          value={stats?.uptime30}
          href="/admin/status"
          icon={<Activity className="w-6 h-6" />}
          color="from-purple-500/15 to-purple-500/5 text-purple-600"
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UptimeChart data={uptime} />
        <IncidentBarChart data={incidents} />
        <ClientTrafficChart data={traffic} />
      </section>

    </div>
  );
}

/* MetricCard Component */
function MetricCard({
  label,
  value,
  href,
  icon,
  color
}: {
  label: string;
  value: number | string | undefined;
  href: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`
        group relative overflow-hidden rounded-3xl p-6
        bg-white/60 backdrop-blur-xl border border-white/50 
        shadow-[0_8px_32px_rgba(0,0,0,0.06)]
        hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(0,0,0,0.10)]
        transition-all duration-500
      `}
    >
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100
        bg-gradient-to-br ${color}
        blur-2xl transition-opacity duration-700
      `} />

      <div className="relative z-10 space-y-2">
        <div className="w-12 h-12 flex items-center justify-center 
                        rounded-xl bg-white/70 shadow-inner">
          {icon}
        </div>

        <p className="text-4xl font-semibold tracking-tight text-neutral-900">
          {value ?? "--"}
        </p>

        <p className="text-sm text-neutral-500">{label}</p>
      </div>
    </Link>
  );
}