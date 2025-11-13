"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const CASES = [
  {
    t: "Food4Philly",
    d: "Nonprofit refactor",
    img: "/cases/food4philly.png",
    url: "https://food4philly.org"
  },
  {
    t: "Kensure Logistics",
    d: "B2B clarity",
    img: "/cases/kensure.png",
    url: "#"
  },
  {
    t: "Martino’s of Elmont",
    d: "Local icon refresh",
    img: "/cases/martinos.png",
    url: "#"
  }
]

function Card({ c, i }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: i * 0.08 }}
      className="rounded-3xl overflow-hidden border bg-neutral-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[16/11]">
        <Image
          src={c.img}
          fill
          alt={c.t}
          className="object-cover"
        />
      </div>

      <div className="p-5 bg-white border-t">
        <div className="font-semibold">{c.t}</div>
        <div className="text-xs text-neutral-600">{c.d}</div>
        <Link
          href={c.url}
          className="inline-block mt-3 text-sm text-blue-600"
          target="_blank"
        >
          Visit →
        </Link>
      </div>
    </motion.article>
  )
}

export default function WorkGrid() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-semibold tracking-tight">Selected work</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CASES.map((c, i) => (
          <Card key={i} c={c} i={i} />
        ))}
      </div>
    </section>
  )
}