"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion"
import Lenis from "@studio-freight/lenis"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Environment } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react"

/* ============================= THEME ============================== */
const APPLE_BLUE = "#0A84FF"
const BLURPLE = "#5B5BFF"
const PINK = "#FF6DD8"
const CYAN = "#34E8E2"

/* ========================= GLOBAL UTIL ============================ */
function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.06, easing: t => 1 - Math.pow(1 - t, 3), smoothWheel: true })
    let id = 0
    const raf = (time: number) => { lenis.raf(time); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])
  return null
}

/* Top progress bar */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-[#5B5BFF] via-[#0A84FF] to-[#34E8E2]"
    />
  )
}

/* ============================== NAV =============================== */
function GlassNav() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto mt-4 w-[min(1200px,94vw)] rounded-2xl border border-white/50 bg-white/70 px-4 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <nav className="flex items-center justify-between text-sm">
          <Link href="/" className="font-semibold tracking-tight">Noble.</Link>
          <div className="flex items-center gap-4">
            <Link href="/projects" className="hover:opacity-80">Projects</Link>
            <Link href="/contact" className="hover:opacity-80">Contact</Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-3 py-1.5 text-white">
              Book call <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
}

/* ======================= INTERACTIVE BACKDROP ===================== */
function InteractiveBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const scrollDrift = useRef(0)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext("2d", { alpha: true })!
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false

    const stars = Array.from({ length: 120 }).map(() => ({
      x: Math.random(), y: Math.random(), s: 0.6 + Math.random() * 1.2, p: Math.random() * Math.PI * 2, spd: 0.5 + Math.random() * 0.8
    }))

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight
      c.width = Math.floor(w * dpr); c.height = Math.floor(h * dpr)
      c.style.width = w + "px"; c.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize, { passive: true })

    const onMove = (e: PointerEvent) => { pointer.current.tx = e.clientX; pointer.current.ty = e.clientY }
    window.addEventListener("pointermove", onMove, { passive: true })

    const onScroll = () => { scrollDrift.current += 0.4 }
    window.addEventListener("scroll", onScroll, { passive: true })

    let id = 0
    const loop = () => {
      id = requestAnimationFrame(loop)
      const t = performance.now() * 0.001
      const w = c.width / dpr, h = c.height / dpr

      pointer.current.x += ((pointer.current.tx || w * 0.5) - pointer.current.x) * 0.08
      pointer.current.y += ((pointer.current.ty || h * 0.4) - pointer.current.y) * 0.08

      ctx.clearRect(0, 0, w, h)

      ctx.save()
      ctx.globalAlpha = 0.35
      const gap = 64
      ctx.beginPath()
      for (let x = 0; x < w + gap; x += gap) {
        ctx.moveTo(x + (Math.sin(t * 0.2) * 4), 0)
        ctx.lineTo(x + (Math.sin(t * 0.2) * 4), h)
      }
      for (let y = 0; y < h + gap; y += gap) {
        ctx.moveTo(0, y + (Math.cos(t * 0.25) * 4))
        ctx.lineTo(w, y + (Math.cos(t * 0.25) * 4))
      }
      ctx.strokeStyle = "rgba(0,0,0,0.035)"
      ctx.stroke()
      ctx.restore()

      ctx.save()
      stars.forEach(s => {
        const y = (s.y * h + (prefersReduce ? 0 : scrollDrift.current)) % h
        const tw = 0.5 + Math.sin(t * s.spd + s.p) * 0.5
        ctx.fillStyle = `rgba(30,30,40,${0.6 + tw * 0.3})`
        ctx.fillRect((s.x * w) | 0, y | 0, s.s, s.s)
      })
      ctx.restore()

      const drawBlob = (cx: number, cy: number, r: number, color: string, alpha: number) => {
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        grad.addColorStop(0, color + "99")
        grad.addColorStop(1, "transparent")
        ctx.globalAlpha = alpha
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      }
      const mx = pointer.current.x, my = pointer.current.y
      const wob = prefersReduce ? 0 : Math.sin(t * 0.7) * 40

      ctx.save()
      ctx.globalCompositeOperation = "lighter"
      drawBlob((mx || w * 0.5) + wob, my || h * 0.4, 220, BLURPLE, 0.5)
      drawBlob((mx || w * 0.5) - 140, (my || h * 0.4) + 60, 260, CYAN, 0.42)
      drawBlob((mx || w * 0.5) + 120, (my || h * 0.4) - 100, 200, PINK, 0.36)
      ctx.restore()
    }
    id = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ contain: "strict", background: "linear-gradient(180deg,#ffffff,#f9fafb 40%,#ffffff)" }}
    />
  )
}

/* ========================= 3D FOR HERO =========================== */
function Particles({ count = 220 }: { count?: number }) {
  const ref = useRef<any>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 6
      arr[i + 1] = (Math.random() - 0.5) * 4
      arr[i + 2] = (Math.random() - 0.5) * 4
    }
    return arr
  }, [count])
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.04
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.1
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#9aa3b2" sizeAttenuation />
    </points>
  )
}
function BuildingBlock({ i }: { i: number }) {
  const ref = useRef<any>(null)
  useFrame((state) => {
    const t = state.clock.getElapsedTime() + i * 0.22
    if (!ref.current) return
    ref.current.position.x = Math.sin(t * 0.7) * 0.6 + (i % 4) * 0.9 - 1.4
    ref.current.position.y = Math.cos(t * 0.9) * 0.4 + Math.floor(i / 4) * 0.6 - 0.8
    ref.current.position.z = Math.sin(t * 0.4) * 0.4
    ref.current.rotation.x = t * 0.3
    ref.current.rotation.y = t * 0.25
  })
  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.28, 0.08]} />
        <meshStandardMaterial color={APPLE_BLUE} metalness={0.2} roughness={0.2} />
      </mesh>
    </Float>
  )
}
function SiteFrame() {
  return (
    <group position={[0, 0, -0.2]}>
      <mesh>
        <boxGeometry args={[4.4, 2.6, 0.02]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <planeGeometry args={[4.4, 0.3]} />
        <meshBasicMaterial color="#efefef" />
      </mesh>
      <mesh position={[-2.0, 1.3, 0.02]}>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#ff5f57" />
      </mesh>
      <mesh position={[-1.8, 1.3, 0.02]}>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#febc2e" />
      </mesh>
      <mesh position={[-1.6, 1.3, 0.02]}>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#28c840" />
      </mesh>
    </group>
  )
}
function BuilderScene() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.6, 5.5], fov: 42 }} style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} castShadow />
      <Environment preset="city" />
      <Particles />
      <group>
        <SiteFrame />
        {Array.from({ length: 16 }).map((_, i) => <BuildingBlock key={i} i={i} />)}
      </group>
      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.2} luminanceSmoothing={0.6} />
      </EffectComposer>
    </Canvas>
  )
}

/* ============================= HERO (KEEPING YOUR CURRENT ONE) ==== */
function MagnetButton({ href, children }: { href: string, children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = (e.clientX - cx) / 24
      const dy = (e.clientY - cy) / 24
      el.style.transform = `translate(${dx}px, ${dy}px)`
    }
    const reset = () => { el.style.transform = "translate(0px, 0px)" }
    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", reset)
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", reset) }
  }, [])
  return (
    <Link ref={ref} href={href} className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 px-7 py-4 text-white shadow-[0_10px_40px_rgba(0,0,0,.25)]">
      {children}
    </Link>
  )
}

function Hero() {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const o = useTransform(scrollYProgress, [0, 1], [1, 0.6])

  return (
    <section ref={ref} className="relative h-[100svh] w-full overflow-hidden">
      <motion.div className="absolute -top-24 -left-24 h-[540px] w-[540px] rounded-full blur-[120px]" style={{ background: `${BLURPLE}55` }} />
      <motion.div className="absolute top-[30%] -right-24 h-[520px] w-[520px] rounded-full blur-[120px]" style={{ background: `${PINK}40` }} />
      <motion.div className="absolute bottom-0 left-[10%] h-[420px] w-[420px] rounded-full blur-[100px]" style={{ background: `${CYAN}35` }} />

      <motion.div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-[40vh] lg:h-full order-2 lg:order-1">
          <div className="absolute inset-0"><BuilderScene /></div>
        </div>
        <motion.div style={{ y, opacity: o }} className="order-1 lg:order-2 flex items-center justify-center">
          <div className="px-6 max-w-xl">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1 text-xs font-medium tracking-wide text-neutral-600">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: APPLE_BLUE }} />
                Strategy, design, performance
              </div>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }} className="mt-6 text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
              Websites that assemble themselves
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-6 text-lg text-neutral-600">
              Motion that guides the eye. Speed that respects the click. Flows that convert.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="mt-10 flex flex-wrap items-center gap-4">
              <MagnetButton href="/contact">Book Strategy Call <ArrowRight className="h-4 w-4" /></MagnetButton>
              <Link href="/projects" className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-7 py-4 hover:bg-neutral-50">See Projects</Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* =========================== SECTION WRAPPERS ===================== */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-1 text-xs font-medium text-neutral-600">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: APPLE_BLUE }} />
      {children}
    </div>
  )
}
function Section({ id, children, neutral = false, tight = false }:
  { id?: string; children: React.ReactNode; neutral?: boolean; tight?: boolean }) {
  return (
    <section id={id} className={(neutral ? "bg-neutral-50 " : "") + (tight ? "py-16" : "py-28")}>
      <div className="relative z-10 mx-auto max-w-6xl px-6">{children}</div>
    </section>
  )
}

/* =========================== INTRO STACK ========================== */
function IntroStack() {
  const lines = [
    "Brand, strategy, and web design rooted in motion.",
    "Interfaces that feel alive. Copy that respects focus.",
    "We ship fast and keep the soul of the work."
  ]
  return (
    <Section id="intro" tight>
      <div className="grid gap-8 md:gap-10">
        {lines.map((t, i) => <RevealLine key={i} idx={i} text={t} />)}
      </div>
    </Section>
  )
}
function RevealLine({ text, idx }: { text: string; idx: number }) {
  const ref = useRef<HTMLParagraphElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" })
  return (
    <p
      ref={ref}
      className="text-2xl md:text-[40px] leading-[1.15] tracking-tight transition-transform"
      onMouseMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 2
        el.style.transform = `skewY(${dx * 1.6}deg)`
      }}
      onMouseLeave={() => { const el = ref.current; if (el) el.style.transform = "skewY(0deg)" }}
    >
      <motion.span
        initial={{ y: "100%", opacity: 0.6 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </p>
  )
}

/* =========================== LOGO MARQUEE ========================== */
function LogoMarquee() {
  const logos = [
    "/logos/stripe.svg", "/logos/vercel.svg", "/logos/next.svg", "/logos/react.svg",
    "/logos/figma.svg", "/logos/netlify.svg"
  ]
  return (
    <Section neutral tight>
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-transparent to-white [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]" />
        <div className="flex gap-12 py-8 animate-[marquee_20s_linear_infinite] will-change-transform">
          {[...logos, ...logos].map((src, i) => (
            <div key={i} className="h-8 w-auto opacity-70">
              <Image src={src} alt="logo" width={120} height={32} className="h-8 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </Section>
  )
}

/* ============================= STATS STRIP ========================= */
function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      onUpdate: (v) => { if (ref.current) ref.current.textContent = `${Math.round(v).toLocaleString()}${suffix}` }
    })
    return () => controls.stop()
  }, [value, suffix])
  return <span ref={ref} />
}
function StatsStrip() {
  const items = [
    { n: 24, s: "sites shipped", d: "Real launches, not mockups" },
    { n: 3, s: "sec TTI", d: "Median across builds", suf: "s" },
    { n: 18, s: "avg days", d: "Kickoff to launch" },
    { n: 92, s: "lighthouse", d: "Performance score", suf: "%" }
  ]
  return (
    <Section tight>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="text-3xl font-semibold">
              <AnimatedNumber value={it.n} suffix={it.suf || ""} />
            </div>
            <div className="text-xs mt-1 text-neutral-500 uppercase tracking-wide">{it.s}</div>
            <div className="text-sm mt-2 text-neutral-600">{it.d}</div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* =========================== WORK GRID ============================= */
const CASES = [
  { t: "Food4Philly", d: "Nonprofit refactor, higher conversions.", img: "/cases/food4philly.png", url: "https://food4philly.org" },
  { t: "Kensure Logistics", d: "B2B clarity, faster lead capture.", img: "/cases/kensure.png", url: "https://example.com" },
  { t: "Martino’s of Elmont", d: "Local icon, mobile first refresh.", img: "/cases/martinos.png", url: "https://example.com" },
]
function WorkGrid() {
  return (
    <Section id="work" neutral>
      <div className="flex items-end justify-between">
        <div>
          <Tag>Selected work</Tag>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Less noise, more results</h2>
        </div>
        <Link href="/projects" className="hidden md:inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm hover:bg-neutral-50">
          Explore all projects <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CASES.map((c, i) => <WorkCard key={c.t + i} item={c} idx={i} />)}
      </div>

      <div className="mt-10 md:hidden">
        <Link href="/projects" className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-sm hover:bg-neutral-50">
          Explore all projects <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  )
}
function WorkCard({ item, idx }: { item: typeof CASES[number]; idx: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (py - 0.5) * -6
    const ry = (px - 0.5) * 8
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`
  }
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)"
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: idx * 0.06 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-100 shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-transform will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative aspect-[16/11]">
        <Image src={item.img} alt={item.t} fill className="object-cover transition duration-500 group-hover:scale-[1.04]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500"
          style={{ background: "linear-gradient(75deg, transparent 35%, rgba(255,255,255,.25) 45%, transparent 55%)", transform: "translateX(-120%)", animation: "sheen 1.2s ease forwards" }}
        />
      </div>
      <div className="absolute left-0 right-0 bottom-0 p-5">
        <div className="flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur px-4 py-3 border border-white">
          <div>
            <div className="font-semibold">{item.t}</div>
            <div className="text-xs text-neutral-600">{item.d}</div>
          </div>
          <Link href={item.url} target="_blank" className="inline-flex items-center gap-1 rounded-xl border border-neutral-300 bg-white px-3 py-1 text-xs hover:bg-neutral-50">
            Visit <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
      <style>{`@keyframes sheen { to { transform: translateX(120%) } }`}</style>
    </motion.article>
  )
}

/* ============================ PROCESS STRIP ======================== */
function Process() {
  const steps = [
    { t: "Strategy", d: "Discovery, goals, site map, copy frames" },
    { t: "Design", d: "Art direction, UI system, motion language" },
    { t: "Build", d: "Next.js, performance, accessibility" },
    { t: "Launch", d: "QA, redirects, analytics, handoff" },
  ]
  return (
    <Section>
      <div className="flex items-end justify-between">
        <Tag>Process</Tag>
        <div className="text-sm text-neutral-500">Fast. Precise. No chaos.</div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#5B5BFF] to-[#34E8E2] text-white text-xs font-bold">{i + 1}</div>
            <div className="text-sm font-semibold">{s.t}</div>
            <div className="text-sm text-neutral-600 mt-1">{s.d}</div>
            {i < steps.length - 1 && <span className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-gradient-to-r from-transparent via-black/10 to-transparent md:block" />}
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* =========================== TESTIMONIALS ========================== */
function Testimonials() {
  const items = [
    { q: "Traffic went up and the site loads like it cares.", a: "Director, Nonprofit" },
    { q: "They shipped in weeks and nothing broke.", a: "Ops Lead, Logistics" },
    { q: "Clean design, smart motion, zero fluff.", a: "Owner, Restaurant" },
  ]
  return (
    <Section neutral>
      <div className="flex items-end justify-between">
        <Tag>What clients say</Tag>
        <div className="text-sm text-neutral-500">Short and honest</div>
      </div>
      <div className="mt-8 overflow-x-auto [scroll-snap-type:x_mandatory] [-webkit-overflow-scrolling:touch]">
        <div className="flex gap-6 min-w-max">
          {items.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="w-[min(520px,85vw)] scroll-snap-align-start rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <p className="text-lg leading-snug">{t.q}</p>
              <cite className="mt-4 block text-sm text-neutral-500 not-italic">— {t.a}</cite>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* =============================== FOOTER CTA ======================== */
function FooterCTA() {
  const year = useMemo(() => new Date().getFullYear(), [])
  return (
    <Section id="contact" neutral>
      <div className="grid gap-10 lg:grid-cols-2 items-end">
        <div>
          <Tag>Get in touch</Tag>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Let’s build something precise and alive</h2>
          <p className="mt-3 text-neutral-600 max-w-md">One call to align. A plan that makes sense. A site that pays its own rent.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-2xl bg-neutral-900 text-white px-6 py-3 text-sm">Book strategy call <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/projects" className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-3 text-sm hover:bg-neutral-50">See projects</Link>
          </div>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm text-neutral-600">Email</div>
          <div className="text-lg font-semibold">hello@nobleswebdesigns.com</div>
          <div className="mt-4 h-px bg-neutral-200" />
          <div className="mt-4 text-xs text-neutral-500">© {year} Noble’s Web Designs</div>
        </div>
      </div>
    </Section>
  )
}

/* Sticky bottom CTA */
function StickyCTA() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0.25, 0.35], [100, 0])
  const o = useTransform(scrollYProgress, [0.25, 0.35], [0, 1])
  return (
    <motion.div style={{ y, opacity: o }} className="fixed bottom-4 left-1/2 z-[90] -translate-x-1/2">
      <div className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 shadow-lg">
        <span className="text-sm">Ready when you are</span>
        <Link href="/contact" className="inline-flex items-center rounded-full bg-neutral-900 px-4 py-2 text-white text-sm">
          Book call
        </Link>
      </div>
    </motion.div>
  )
}

/* ============================== PAGE =============================== */
export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full text-neutral-900 overflow-x-hidden">
      <SmoothScroll />
      <ScrollProgress />
      <InteractiveBackground />
      <GlassNav />

      {/* Hero kept as-is */}
      <Hero />

      {/* Sections */}
      <IntroStack />
      <LogoMarquee />
      <StatsStrip />
      <WorkGrid />
      <Process />
      <Testimonials />
      <FooterCTA />
      <StickyCTA />
    </main>
  )
}