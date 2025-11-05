"use client";

import { useEffect, useState } from "react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  
  useEffect(() => {
    fetch("/api/tickets")
      .then(res => res.json())
      .then(setTickets);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tickets</h1>

      <div className="space-y-4">
        {tickets.map(t => (
          <div
            key={t.id}
            className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl border border-white/40 shadow-md"
          >
            <strong className="text-base">{t.subject}</strong>
            <p className="text-sm text-neutral-600">{t.message}</p>
            <p className="mt-2 text-xs text-blue-600">{t.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}