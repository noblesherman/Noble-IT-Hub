"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "@/components/Navbar"

export default function ContactPage() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://tally.so/widgets/embed.js"
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#F3F4FF] text-neutral-900">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-[#E0EAFF] via-[#DBEAFE] to-[#ECFDF5] blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-[#F9E3FF] via-[#BFDBFE] to-[#C4F1F9] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.15),_transparent_55%),linear-gradient(to_bottom,_rgba(148,163,184,0.12),_transparent_40%)] mix-blend-soft-light" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,_rgba(148,163,184,0.12)_1px,_transparent_1px),linear-gradient(to_bottom,_rgba(148,163,184,0.12)_1px,_transparent_1px)] bg-[size:120px_120px] opacity-25" />

      <Navbar />

      <section className="relative mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-24 md:flex-row md:items-center md:gap-14 md:px-8 lg:pt-28">
        {/* Left content */}
        <motion.div
          className="relative z-10 max-w-xl space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4DAFF] bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Bookings, projects, questions</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Let&apos;s build something
            <span className="bg-gradient-to-r from-[#4B5BFF] via-[#0A84FF] to-[#EC4899] bg-clip-text text-transparent">
              {" "}
              unforgettable
            </span>
          </h1>

          <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
            Tell me what you are working on, what you need help with,
            and where you want your brand to go.
            I will reply with clear next steps, no fluff.
          </p>

          <div className="grid gap-4 text-sm text-neutral-800 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#E0E3FF] bg-white/95 px-4 py-3.5 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Typical projects
              </p>
              <ul className="mt-2 space-y-1.5 text-neutral-800">
                <li>• Full site builds</li>
                <li>• Restyling & UX passes</li>
                <li>• Performance clean-up</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#E0E3FF] bg-white/95 px-4 py-3.5 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Response
              </p>
              <ul className="mt-2 space-y-1.5 text-neutral-800">
                <li>• 24–48 hour reply window</li>
                <li>• Clear timeline & pricing</li>
                <li>• No generic templates</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Form side */}
        <motion.div
          className="relative z-10 flex h-[420px] flex-1 items-stretch md:h-[520px]"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
        >
          {/* Glow ring */}
          <div className="pointer-events-none absolute -inset-1 rounded-[32px] bg-gradient-to-tr from-[#BFDBFE]/70 via-[#A5B4FC]/60 to-[#F9A8D4]/70 opacity-80 blur-xl" />

          {/* Card */}
          <div className="relative flex w-full overflow-hidden rounded-[30px] border border-[#D4DAFF] bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.25)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/90 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/90 to-transparent" />

            <iframe
              data-tally-src="https://tally.so/r/1APlaQ?transparentBackground=1&formEventsForwarding=1"
              className="relative z-10 h-full w-full border-0"
              title="Contact form"
            />

            {/* Soft fade to hide Tally bottom bar */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 h-16 w-full"
              style={{
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                background:
                  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(249,250,251,0.96) 55%, rgba(249,250,251,1) 100%)"
              }}
            />
          </div>
        </motion.div>
      </section>
    </main>
  )
}