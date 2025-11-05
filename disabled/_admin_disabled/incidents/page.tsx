"use client"

import { useEffect, useState } from "react"
import dayjs from "dayjs"

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [showResolved, setShowResolved] = useState(false)

  async function load() {
    try {
      const res = await fetch("/api/incidents")
      const data = await res.json()
      setIncidents(data)
    } catch {
      setIncidents([])
    }
  }

  async function add() {
    if (!title.trim()) return
    setLoading(true)

    await fetch("/api/incidents", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ title, description })
    })

    setLoading(false)
    setTitle("")
    setDescription("")
    load()
  }

  async function resolveIncident(id: number) {
    await fetch(`/api/incidents/${id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ resolved: true })
    })

    load()
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-12 pb-10">

      {/* Header */}
      <div className="pt-2">
        <h1 className="text-5xl font-semibold text-neutral-900 tracking-tight">
          Incidents
        </h1>
        <p className="text-neutral-500 text-lg mt-2">
          Track issues. Keep uptime pristine.
        </p>
      </div>

      {/* Add Form */}
      <div className="p-8 rounded-3xl bg-white/40 backdrop-blur-2xl
                      border border-white/50 shadow-[0_8px_45px_rgba(0,0,0,0.04)]
                      flex gap-4 items-center transition-all">

        <input
          className="flex-1 px-5 py-3 rounded-2xl bg-white/70 border border-white/60
                     text-neutral-900 shadow-inner focus:ring-4
                     focus:ring-blue-300/30 outline-none transition-all"
          placeholder="Incident title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="flex-1 px-5 py-3 rounded-2xl bg-white/70 border border-white/60
                     text-neutral-900 shadow-inner focus:ring-4
                     focus:ring-blue-300/30 outline-none transition-all"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={add}
          disabled={loading}
          className="px-6 py-3 rounded-full font-semibold text-white
                     bg-gradient-to-r from-blue-600 to-blue-500
                     shadow-lg hover:shadow-xl active:scale-[0.97]
                     transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add"}
        </button>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-4 pl-1 select-none">
        <span className="text-sm text-neutral-600">
          Show Resolved
        </span>

        <button
          onClick={() => setShowResolved(!showResolved)}
          className={`
            relative w-14 h-8 rounded-full bg-gradient-to-br backdrop-blur-xl
            transition-all duration-300 shadow-inner border
            ${showResolved
              ? "from-blue-600/60 to-blue-500/40 border-blue-300/50"
              : "from-neutral-300/40 to-neutral-200/30 border-neutral-300/60"
            }
          `}
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-7 h-7 rounded-full bg-white shadow-md
              transition-all duration-300
              ${showResolved ? "translate-x-6" : ""}
            `}
          />
        </button>
      </div>

      {/* Incident List */}
      <div className="space-y-6">
        {incidents
          .filter(i => showResolved || !i.resolvedAt)
          .map((i) => (
            <div
              key={i.id}
              className="group p-7 rounded-3xl bg-white/60 backdrop-blur-2xl
                         border border-white/50 shadow-[0_6px_32px_rgba(0,0,0,0.08)]
                         hover:shadow-[0_14px_45px_rgba(0,0,0,0.12)]
                         hover:-translate-y-1 transition-all"
            >
              <div className="flex justify-between items-center w-full">

                <div>
                  <h3 className="text-lg font-medium text-neutral-900">
                    {i.title}
                  </h3>

                  <p className="text-xs text-neutral-500 mt-1">
                    {dayjs(i.startedAt).format("MMM D, YYYY · h:mm A")}
                  </p>

                  <span
                    className={`
                      inline-block mt-3 px-4 py-1.5 rounded-full text-xs font-semibold
                      backdrop-blur-xl border transition-all
                      ${
                        i.resolvedAt
                          ? "bg-green-200/50 text-green-700 border-green-300/50"
                          : "bg-red-200/50 text-red-700 border-red-300/50"
                      }
                    `}
                  >
                    {i.resolvedAt ? "Resolved ✅" : "Active 🔥"}
                  </span>
                </div>

                {!i.resolvedAt && (
                  <button
                    onClick={() => resolveIncident(i.id)}
                    className="px-6 py-2.5 rounded-full font-medium
                               bg-white/40 backdrop-blur-2xl border border-white/60
                               text-blue-600 shadow-[0_4px_20px_rgba(0,0,255,0.10)]
                               hover:bg-white/70 hover:shadow-[0_10px_28px_rgba(0,0,255,0.18)]
                               active:scale-[0.96] transition-all"
                  >
                    Resolve
                  </button>
                )}

              </div>
            </div>
          ))}
      </div>

    </div>
  )
}