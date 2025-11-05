"use client";

import { useEffect, useState } from "react";
import StatusDetail from "./StatusDetail";

export default function AdminStatus() {
  const [monitors, setMonitors] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  async function load() {
    try {
      const r = await fetch("/api/admin/status");
      const json = await r.json();
      setMonitors(json);
    } catch {
      setMonitors([]);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-neutral-900">Status</h1>
        <p className="text-neutral-500 text-lg">
          Live system uptime and reliability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {monitors.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(m)}
            className="rounded-3xl p-6 bg-white/80 backdrop-blur-xl
                       border border-white/40 shadow-xl
                       hover:shadow-2xl hover:-translate-y-1 transition
                       text-left cursor-pointer"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-neutral-900">{m.name}</h3>
              <span
                className={`w-3 h-3 rounded-full ${
                  m.status === 2 ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>

            <p className="text-3xl font-bold mt-4">
              {m.uptime30 ? `${m.uptime30}%` : "--"}
            </p>
          </button>
        ))}
      </div>

      {selected && (
        <StatusDetail
          monitor={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}