"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function ProjectChart({ data }: any) {
  return (
    <div className="h-72 bg-white/60 backdrop-blur-xl rounded-2xl shadow p-5 border border-white/20">
      <h3 className="font-semibold text-neutral-800 mb-4">Projects Over Time</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis hide />
          <Tooltip />
          <Line type="monotone" dataKey="created" stroke="#2563eb" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}