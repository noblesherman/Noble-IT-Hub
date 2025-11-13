"use client"

import { motion } from "framer-motion"

const ITEMS = [
  { q: "Traffic went up, and the site loads like it cares.", a: "Director, Nonprofit" },
  { q: "They shipped in weeks and nothing broke.", a: "Ops Lead, Logistics" },
  { q: "Clean design. Smart motion. Zero fluff.", a: "Restaurant Owner" }
]

export default function Testimonials() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-semibold tracking-tight">What clients say</h2>

      <div className="mt-10 flex gap-6 overflow-x-auto">
        {ITEMS.map((t, i) => (
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="min-w-[330px] max-w-[430px] p-6 rounded-2xl border bg-white shadow-sm"
          >
            <p className="text-lg">{t.q}</p>
            <cite className="block mt-3 text-sm text-neutral-500">— {t.a}</cite>
          </motion.blockquote>
        ))}
      </div>
    </section>
  )
}