/* components/Hero.tsx */
"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const APPLE_BLUE = "#0A84FF"

export default function Hero() {
  return (
    <>
      {/* full-viewport hero */}
      <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-7xl font-extrabold leading-[1.05] tracking-tight px-6"
        >
          Websites that feel effortless,
          <br className="hidden sm:block" />
          <span style={{ color: APPLE_BLUE }}>convert like crazy</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mt-7 text-lg sm:text-xl text-neutral-600 text-center max-w-2xl px-6"
        >
          Clean UI. Fast load. Zero nonsense. Design that earns money, not just applause.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-8 py-4 text-white font-medium"
          >
            Book Strategy Call
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Link>
          <a
            href="#packages"
            className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-8 py-4 font-medium hover:bg-neutral-50"
          >
            See Pricing
          </a>
        </motion.div>

        {/* shimmer orb */}
        <motion.div
          className="absolute w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] rounded-full blur-3xl opacity-30"
          animate={{ x: ["-10%", "20%", "-10%"], y: ["10%", "-10%", "10%"] }}
          transition={{ duration: 18, repeat: Infinity }}
          style={{ background: `radial-gradient(circle, ${APPLE_BLUE}33 0%, transparent 70%)` }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-10 text-sm text-neutral-500"
        >
          Scroll to explore ↓
        </motion.div>
      </section>
      {/* Hero flows directly into showcase – no divider bar */}
    </>
  )
}