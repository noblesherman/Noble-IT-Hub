"use client";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface UptimeChartData { date: string; value: number; }
export function UptimeChart({ data }: { data: UptimeChartData[] }) {
  return (
    <div className="rounded-3xl p-6 bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg">
      <h2 className="text-lg font-medium text-neutral-700 mb-4">Uptime</h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis hide />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth="3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface IncidentBarChartData { date: string; count: number; }
export function IncidentBarChart({ data }: { data: IncidentBarChartData[] }) {
  return (
    <div className="rounded-3xl p-6 bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg">
      <h2 className="text-lg font-medium text-neutral-700 mb-4">Incident Frequency</h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ClientTrafficChartData { day: string; visits: number; }
export function ClientTrafficChart({ data }: { data: ClientTrafficChartData[] }) {
  return (
    <div className="rounded-3xl p-6 bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg">
      <h2 className="text-lg font-medium text-neutral-700 mb-4">Client Traffic</h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis hide />
          <Tooltip />
          <Line type="monotone" dataKey="visits" stroke="#10b981" strokeWidth="3" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}