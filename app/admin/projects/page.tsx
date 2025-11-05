"use client";

import { useState, useEffect } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [clientId, setClientId] = useState("");

  async function fetchProjects() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  async function fetchClients() {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  }

  async function addProject(e) {
    e.preventDefault();

    if (!clientId) {
      alert("Please select a client");
      return;
    }

    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, link, clientId })
    });

    setTitle("");
    setDescription("");
    setLink("");
    setClientId("");

    fetchProjects();
  }

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>Projects</h1>

      <div className="card">
        <form onSubmit={addProject} style={{ display: "grid", gap: 12 }}>
          <input
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            placeholder="Link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button type="submit">Add Project</button>
        </form>
      </div>

      <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
        {projects.map((p) => (
          <div key={p.id} className="card">
            <h2 style={{ fontSize: 20, marginBottom: 6 }}>{p.title}</h2>
            <p style={{ fontSize: 14, opacity: 0.8 }}>{p.description}</p>
            <p style={{ fontSize: 13, opacity: 0.7 }}>
              Client ID: {p.clientId}
            </p>
            {p.link && (
              <a href={p.link} target="_blank" style={{ color: "#4F8CF7" }}>
                Visit Project →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}