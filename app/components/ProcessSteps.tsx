"use client"

import { motion } from "framer-motion"

const STEPS = [
  { t: "Strategy", d: "Discovery. Goals. Site map." },
  { t: "Design", d: "Art direction. Components. Motion." },
  { t: "Build", d: "Next.js. Performance. Accessibility." },
  { t: "Launch", d: "QA. Redirects. Analytics." }
]

export default function ProcessSteps() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-semibold tracking-tight">Process</h2>

      <div className="mt-10 grid md:grid-cols-4 gap-6">
        {STEPS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="p-6 border rounded-2xl bg-white shadow-sm"
          >
            <div className="text-xl font-bold mb-1">{i + 1}. {s.t}</div>
            <p className="text-sm text-neutral-600">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}