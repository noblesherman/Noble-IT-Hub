/* app/services/page.tsx */
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import Image from "next/image"
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion"
import {
  ArrowRight,
  Check,
  LineChart,
  Rocket,
  Settings2,
  Shield,
  Sparkles,
  TimerReset,
  Zap,
  MousePointerClick,
  Smile,
  Star,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/* CONFIG                                                             */
/* ------------------------------------------------------------------ */

const APPLE_BLUE = "#0A84FF"

type CaseItem = {
  title: string
  url: string
  logo: string
  frames: string[]
  banner: string
}

const CASES: CaseItem[] = [
  {
    title: "Food4Philly",
    url: "https://food4philly.org",
    logo: "/cases/food4philly.png",
    frames: ["/cases/food4philly.png", "/cases/food4philly-iphone.png"],
    banner: "/promo/food4philly-hero.jpg",
  },
  {
    title: "Kensure Logistics",
    url: "https://kensure.example",
    logo: "/cases/kensure.png",
    frames: ["/cases/kensure.png", "/cases/kensure-iphone.png"],
    banner: "/promo/kensure-hero.jpg",
  },
  {
    title: "Martino’s of Elmont",
    url: "https://martinos.example",
    logo: "/cases/martinos.png",
    frames: ["/cases/martinos.png", "/cases/martinos-iphone.png"],
    banner: "/promo/martinos-hero.jpg",
  },
]

const FEATURES = [
  {
    icon: Zap,
    title: "Performance first",
    copy: "Snappy load, tuned images, smart caching. People feel it, Google notices.",
  },
  {
    icon: MousePointerClick,
    title: "Conversion minded",
    copy: "Clear hierarchy and frictionless flows. Less noise, more action, better leads.",
  },
  {
    icon: TimerReset,
    title: "Maintainable",
    copy: "Sane content structure and minimal plugins. Updates without headaches.",
  },
  {
    icon: Shield,
    title: "Solid foundations",
    copy: "SEO basics, analytics, backups, and a stack that won’t box you in.",
  },
]

const PROCESS = [
  { icon: Sparkles, title: "Clarity Call", copy: "Define outcomes. Trim fluff. Lock goals that matter." },
  { icon: LineChart, title: "Blueprint", copy: "Sitemap, wireframes, and content plan tied to metrics." },
  { icon: Settings2, title: "Design + Build", copy: "Clean UI, fast Next.js stack, sensible components." },
  { icon: Shield, title: "QA + Launch", copy: "Accessibility, performance passes, smooth go-live." },
  { icon: Rocket, title: "Aftercare", copy: "Training, light retainers, proactive tweaks as you grow." },
]

const PACKAGES = [
  {
    name: "Starter",
    price: "$900–$1,400",
    pitch: "Launch fast without looking cheap.",
    bullets: ["Up to 4 pages", "Responsive layout", "SEO fundamentals", "Content setup & launch support"],
  },
  {
    name: "Growth",
    price: "$1,500–$3,000",
    pitch: "Dialed for speed, conversion, and polish.",
    bullets: ["Up to 8 pages", "Conversion-focused sections", "Analytics dashboard", "Email & light automations"],
    best: true,
  },
  {
    name: "Premium",
    price: "Custom Quote",
    pitch: "Unlimited scope, deeper integrations.",
    bullets: ["Unlimited pages", "Content production", "Advanced automations", "Priority iteration & support"],
  },
]

const FAQS = [
  { q: "How fast can we launch?", a: "Starter ships in 2-3 weeks. Growth averages 3-6 weeks." },
  { q: "Do you write the copy?", a: "We sharpen your message. Full copywriting is an add-on." },
  { q: "Do you host domains?", a: "You keep ownership. We configure Vercel + Cloudflare." },
  { q: "Can you migrate my site?", a: "Yes—content import, modern structure, and SEO-safe redirects." },
  { q: "Ongoing support?", a: "30 days included. Optional monthly retainer for tweaks & tests." },
]

/* ------------------------------------------------------------------ */
/* LITTLE HELPERS                                                      */
/* ------------------------------------------------------------------ */

const SectionTag = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1 text-xs font-medium tracking-wide text-neutral-600">
    <span className="h-1.5 w-1.5 rounded-full" style={{ background: APPLE_BLUE }} />
    {children}
  </div>
)

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    whileHover={{ y: -2, scale: 1.01 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className={`rounded-3xl bg-white border border-neutral-200 shadow-[0_10px_36px_rgba(0,0,0,0.06)] ${className}`}
  >
    {children}
  </motion.div>
)

/* ------------------------------------------------------------------ */
/* CURSOR GLOW                                                         */
/* ------------------------------------------------------------------ */

function CursorGlow() {
  useEffect(() => {
    const blob = document.createElement("div")
    Object.assign(blob.style, {
      position: "fixed",
      width: "240px",
      height: "240px",
      borderRadius: "50%",
      pointerEvents: "none",
      zIndex: "0",
      filter: "blur(60px)",
      background: `radial-gradient(circle, ${APPLE_BLUE}33 0%, transparent 60%)`,
      left: "-1000px",
      top: "-1000px",
      mixBlendMode: "multiply",
      transition: "opacity .2s",
    } as Partial<CSSStyleDeclaration>)
    document.body.appendChild(blob)

    let x = 0,
      y = 0,
      tx = 0,
      ty = 0
    const follow = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      blob.style.transform = `translate3d(${x - 120}px,${y - 120}px,0)`
      requestAnimationFrame(follow)
    }
    follow()
    const move = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }
    window.addEventListener("mousemove", move)
    return () => {
      document.body.removeChild(blob)
      window.removeEventListener("mousemove", move)
    }
  }, [])
  return null
}

/* PARALLAX HALO ----------------------------------------------------- */

function ParallaxHalo() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 60])
  const opacity = useTransform(scrollY, [0, 400], [1, 0.6])
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[-220px] mx-auto h-[560px] w-[1200px] rounded-[1000px] blur-3xl"
      style={{
        background:
          "radial-gradient(600px 260px at 50% 40%, rgba(10,132,255,0.18), rgba(10,132,255,0) 60%)",
        y,
        opacity,
      }}
    />
  )
}

/* HERO SHOWCASE DRAG ------------------------------------------------ */

function DragShowcase({ items }: { items: CaseItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragW, setDragW] = useState(0)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    setDragW(el.scrollWidth - el.clientWidth)
  }, [])

  return (
    <div className="relative w-full">
      <motion.div
        ref={trackRef}
        className="flex gap-6 px-6"
        drag="x"
        dragConstraints={{ left: -dragW, right: 0 }}
        dragElastic={0.06}
      >
        {items.map((c) => (
          <motion.figure
            key={c.title}
            whileHover={{ scale: 0.995 }}
            transition={{ duration: 0.25 }}
            className="relative w-[90vw] sm:w-[86vw] lg:w-[80vw] h-[56vw] sm:h-[48vw] lg:h-[38vw] overflow-hidden rounded-[28px] border border-neutral-200 shadow-[0_20px_60px_rgba(0,0,0,0.12)] bg-neutral-100"
          >
            <Image src={c.banner} alt={c.title} fill sizes="100vw" className="object-cover" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-white/80 backdrop-blur px-4 py-1 text-sm font-medium text-neutral-900">
              {c.title}
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </div>
  )
}

/* HOVER-SCRUB CARD -------------------------------------------------- */

function HoverScrub({ frames, title }: { frames: string[]; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || frames.length < 2) return
    const move = (e: MouseEvent) => {
      const { left, width } = el.getBoundingClientRect()
      const pct = (e.clientX - left) / width
      setIdx(Math.min(frames.length - 1, Math.max(0, Math.floor(pct * frames.length))))
    }
    el.addEventListener("mousemove", move)
    return () => el.removeEventListener("mousemove", move)
  }, [frames])

  return (
    <motion.div
      ref={ref}
      whileHover={{ rotateX: -2, rotateY: 2 }}
      transition={{ duration: 0.25 }}
      className="relative aspect-[16/10] w-full cursor-ew-resize rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
      style={{ transformStyle: "preserve-3d" as any }}
    >
      <Image src={frames[idx]} alt={title} fill className="object-cover rounded-3xl" />
    </motion.div>
  )
}

/* PROCESS TIMELINE -------------------------------------------------- */

function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" })

  return (
    <div ref={ref} className="relative mx-auto max-w-6xl px-6">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-neutral-200" />
      <div
        className="absolute left-1/2 top-0 w-px -translate-x-1/2 bg-neutral-900"
        style={{ height: inView ? "100%" : "0%", transition: "height 1.2s cubic-bezier(.2,.8,.2,1)" }}
      />
      <div className="grid gap-8 md:grid-cols-5">
        {PROCESS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="rounded-3xl bg-white p-6 border border-neutral-200 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: APPLE_BLUE }}>
              <step.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-neutral-600">{step.copy}</p>
            <div className="mt-4 text-xs text-neutral-500">Step {i + 1}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* LOGO MARQUEE ------------------------------------------------------ */

function LogoMarquee({ logos }: { logos: string[] }) {
  const items = [...logos, ...logos] // loop
  return (
    <div className="relative mt-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white via-transparent to-white opacity-80" />
      <div className="flex gap-10 animate-[scrollLeft_28s_linear_infinite] will-change-transform">
        {items.map((src, i) => (
          <div key={i} className="shrink-0 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
            <div className="relative h-14 w-40">
              <Image src={src} alt="Logo" fill className="object-contain" />
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes scrollLeft { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* PAGE COMPONENT                                                     */
/* ------------------------------------------------------------------ */

export default function ServicesPage() {
  const year = new Date().getFullYear()
  const [faqOpen, setFaqOpen] = useState<number | null>(0)

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key="services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white text-neutral-900 min-h-screen overflow-x-hidden"
      >
        {/* Glass nav */}
        <div className="fixed inset-x-0 top-0 z-50 flex justify-center">
          <div className="mt-4 w-[min(1100px,92vw)] rounded-2xl border border-white/40 bg-white/70 px-4 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
            <Navbar />
          </div>
        </div>

        <CursorGlow />
        <ParallaxHalo />

        {/* HERO */}
        <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
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
              Book Strategy Call <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
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

        {/* SHOWCASE */}
        <section className="pb-20">
          <DragShowcase items={CASES} />
        </section>

        {/* TRUST STRIP */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-sm text-neutral-500">Trusted by businesses who want real results</p>
          </div>
          <LogoMarquee logos={CASES.map((c) => c.logo)} />
        </section>

        {/* FEATURES */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center mb-12">
            <SectionTag>What matters</SectionTag>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">Built for trust and outcomes</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {FEATURES.map((f) => (
              <Card key={f.title} className="p-8">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl" style={{ background: APPLE_BLUE + "10" }}>
                    <div className="rounded-2xl p-3 text-white" style={{ background: APPLE_BLUE }}>
                      <f.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{f.title}</h3>
                    <p className="mt-2 text-neutral-600">{f.copy}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className="relative bg-neutral-50 py-20">
          <div className="text-center mb-12">
            <SectionTag>Process</SectionTag>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">A simple path to launch</h2>
          </div>
          <ProcessTimeline />
        </section>

        {/* CASES */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center mb-12">
            <SectionTag>Featured</SectionTag>
          </div>
          <div className="grid gap-10 lg:grid-cols-3">
            {CASES.map((c) => (
              <div key={c.title} className="flex flex-col gap-4">
                <HoverScrub frames={c.frames} title={c.title} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-neutral-200 bg-white">
                      <Image src={c.logo} alt={c.title} width={32} height={32} className="object-contain" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{c.title}</div>
                      <div className="text-xs text-neutral-500">Case study</div>
                    </div>
                  </div>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[15px] text-[#0A84FF] hover:underline"
                  >
                    Visit →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="packages" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="text-center mb-12">
            <SectionTag>Pricing</SectionTag>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">Pick what fits your moment</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <motion.div
                key={pkg.name}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25 }}
                className={`relative rounded-3xl p-10 border shadow-md ${
                  pkg.best ? "bg-neutral-900 text-white border-neutral-900 scale-[1.02]" : "bg-white border-neutral-200"
                }`}
              >
                {pkg.best && (
                  <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-900 shadow">
                    <Star className="h-3.5 w-3.5" /> Most chosen
                  </div>
                )}
                <h3 className="text-2xl font-bold">{pkg.name}</h3>
                <p className={`mt-2 ${pkg.best ? "text-white/80" : "text-neutral-600"}`}>{pkg.pitch}</p>
                <div className={`mt-6 text-xl font-semibold ${pkg.best ? "text-white" : "text-neutral-900"}`}>{pkg.price}</div>
                <ul className={`mt-6 space-y-3 ${pkg.best ? "text-white/90" : "text-neutral-700"}`}>
                  {pkg.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className={`mt-0.5 h-4 w-4 ${pkg.best ? "text-white" : "text-neutral-900"}`} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${
                    pkg.best ? "bg-white text-neutral-900 hover:opacity-90" : "border border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  {pkg.best ? "Start Growth" : `Start ${pkg.name}`} <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* LITTLE BENEFITS */}
        <section className="mx-auto max-w-6xl px-6 pb-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ icon: Smile, label: "Zero-stress flow" }, { icon: Shield, label: "SEO + accessibility" }, { icon: Zap, label: "Ultra-fast load" }].map((i) => (
              <div key={i.label} className="rounded-2xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <i.icon className="h-4.5 w-4.5" style={{ color: APPLE_BLUE }} />
                  <span className="text-sm">{i.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center mb-12">
            <SectionTag>FAQ</SectionTag>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">Quick answers</h2>
          </div>
          <div className="divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white">
            {FAQS.map((f, i) => {
              const open = faqOpen === i
              return (
                <div key={f.q} className="px-6 sm:px-10">
                  <button className="flex w-full items-center justify-between py-6 text-left" onClick={() => setFaqOpen(open ? null : i)}>
                    <span className="text-base sm:text-lg font-semibold">{f.q}</span>
                    <span className="ml-4 text-neutral-500">{open ? "−" : "+"}</span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-neutral-600">{f.a}</p>
                  </motion.div>
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-neutral-50">
          <div
            className="absolute inset-x-0 -top-24 mx-auto h-48 w-[900px] rounded-[1000px] blur-2xl"
            style={{ background: "radial-gradient(600px 120px at 50% 50%, rgba(10,132,255,0.14), rgba(10,132,255,0))" }}
          />
          <div className="mx-auto max-w-6xl px-6 py-24 text-center">
            <h3 className="text-4xl font-bold">Let’s build something that works</h3>
            <p className="mx-auto mt-3 max-w-xl text-neutral-600">One call, a clear plan, and a site that earns its keep.</p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/contact" className="group inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-7 py-4 text-white">
                Book Strategy Call <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
              <a href="#packages" className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-7 py-4 hover:bg-neutral-50">
                See Packages
              </a>
            </div>
            <div className="mt-8 text-xs text-neutral-500">© {year} Noble’s Web Designs</div>
          </div>
        </section>
      </motion.main>
    </AnimatePresence>
  )
}
