"use client"

import { motion, animate } from "framer-motion"
import { useEffect, useRef } from "react"

function Count({ n, suf = "" }) {
  const ref = useRef(null)
  useEffect(() => {
    const controls = animate(0, n, {
      duration: 1.2,
      onUpdate(v) {
        if (ref.current) ref.current.textContent = Math.round(v) + suf
      }
    })
    return () => controls.stop()
  }, [n, suf])
  return <span ref={ref} />
}

const STATS = [
  { n: 24, s: "sites shipped", d: "Real launches" },
  { n: 3, suf: "s", s: "sec TTI", d: "Median load" },
  { n: 18, s: "days avg", d: "Kickoff to launch" },
  { n: 92, suf: "%", s: "lighthouse", d: "Performance score" }
]

export default function StatsStrip() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((x, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="p-6 rounded-2xl border bg-white shadow-sm"
          >
            <div className="text-3xl font-semibold">
              <Count n={x.n} suf={x.suf} />
            </div>
            <div className="mt-1 text-xs uppercase tracking-wide text-neutral-500">
              {x.s}
            </div>
            <div className="mt-2 text-sm text-neutral-600">{x.d}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}