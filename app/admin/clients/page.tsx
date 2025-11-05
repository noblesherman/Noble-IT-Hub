"use client";

import { useEffect, useState } from "react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");

  async function loadClients() {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  }

  async function addClient() {
    if (!name.trim()) return alert("Name required");

    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, website }),
    });

    setName("");
    setWebsite("");
    loadClients();
  }

  async function deleteClient(id: number) {
    await fetch("/api/clients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadClients();
  }

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
        Clients
      </h1>

      {/* Add Client */}
      <div className="flex gap-3 items-center p-5 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-sm">
        <input
          placeholder="Client Name"
          className="flex-1 px-4 py-3 rounded-lg border border-neutral-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Client Website (optional)"
          className="flex-1 px-4 py-3 rounded-lg border border-neutral-300"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <button
          onClick={addClient}
          className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
        >
          Add
        </button>
      </div>

      {/* Clients List */}
      <div className="space-y-4">
        {clients.map((client) => (
          <div
            key={client.id}
            className="flex justify-between items-center p-5 rounded-2xl bg-white border shadow-sm"
          >
            <div>
              <h3 className="font-medium text-neutral-900">{client.name}</h3>
              {client.website && (
                <a
                  href={client.website}
                  target="_blank"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {client.website}
                </a>
              )}
            </div>

            <button
              onClick={() => deleteClient(client.id)}
              className="text-red-600 hover:text-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        ))}

        {clients.length === 0 && (
          <p className="text-neutral-500 text-sm">No clients yet.</p>
        )}
      </div>
    </div>
  );
}