"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const LINES = [
  "Brand, strategy, and web design with motion.",
  "Interfaces that feel alive.",
  "We ship fast and keep things sharp."
]

type LineProps = {
  text: string
  i: number
}

function Line({ text, i }: LineProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.p
      ref={ref}
      className="text-3xl md:text-[42px] leading-tight tracking-tight transition-transform"
      onMouseMove={(e) => {
        if (!ref.current) return
        const r = ref.current.getBoundingClientRect()
        const x = ((e.clientX - r.left) / r.width - 0.5) * 8
        ref.current.style.transform = `skewY(${x}deg)`
      }}
      onMouseLeave={() => {
        if (!ref.current) return
        ref.current.style.transform = "skewY(0deg)"
      }}
    >
      <motion.span
        initial={{ y: "100%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ delay: i * 0.08, duration: 0.6 }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </motion.p>
  )
}

export default function IntroLines() {
  return (
    <section className="py-28 px-6 max-w-4xl mx-auto">
      <div className="grid gap-8">
        {LINES.map((t, i) => (
          <Line key={i} text={t} i={i} />
        ))}
      </div>
    </section>
  )
}