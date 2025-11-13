"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { Route } from "next"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView, animate, useMotionValue, useSpring } from "framer-motion"
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
    const lenis = new Lenis({
      duration: 1.1,
      easing: t => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })

    let id = 0
    const raf = (time: number) => {
      lenis.raf(time)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])

  return null
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[80] h-[3px] origin-left bg-gradient-to-r from-[#0B1120] via-[#4B5BFF] to-[#93C5FD]"
    />
  )
}

/* ======================= BACKGROUND + CURSOR ====================== */

function InteractiveBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const scrollDrift = useRef(0)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext("2d", { alpha: true })
    if (!ctx) return

    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const prefersReduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false

    const ribbons = Array.from({ length: 4 }).map((_, i) => ({
      phase: Math.random() * Math.PI * 2,
      amp: 60 + i * 18,
      speed: 0.25 + i * 0.06,
      width: 220 + i * 40,
    }))

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      c.width = Math.floor(w * dpr)
      c.height = Math.floor(h * dpr)
      c.style.width = w + "px"
      c.style.height = h + "px"
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const onMove = (e: PointerEvent) => {
      pointer.current.tx = e.clientX
      pointer.current.ty = e.clientY
    }

    const onScroll = () => {
      scrollDrift.current += 0.4
    }

    window.addEventListener("resize", resize, { passive: true })
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", onScroll, { passive: true })

    let id = 0
    const loop = () => {
      id = requestAnimationFrame(loop)
      const t = performance.now() * 0.001
      const w = c.width / dpr
      const h = c.height / dpr

      pointer.current.x += (((pointer.current.tx || w * 0.5) - pointer.current.x) * 0.08)
      pointer.current.y += (((pointer.current.ty || h * 0.35) - pointer.current.y) * 0.08)

      ctx.clearRect(0, 0, w, h)

      const baseGrad = ctx.createLinearGradient(0, 0, 0, h)
      baseGrad.addColorStop(0, "#F5F7FF")
      baseGrad.addColorStop(0.35, "#FFFFFF")
      baseGrad.addColorStop(1, "#F3F4F6")
      ctx.fillStyle = baseGrad
      ctx.fillRect(0, 0, w, h)

      ctx.save()
      ctx.globalCompositeOperation = "soft-light"
      ribbons.forEach((r, i) => {
        ctx.beginPath()
        const offsetY = h * (0.2 + i * 0.18)
        for (let x = -100; x <= w + 100; x += 8) {
          const noise = Math.sin((x / r.width) + r.phase + t * r.speed) * r.amp
          const y = offsetY + noise + Math.sin(t * 0.4 + i) * 20
          if (x === -100) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        const grad = ctx.createLinearGradient(0, offsetY - r.amp, 0, offsetY + r.amp)
        if (i === 0) {
          grad.addColorStop(0, "rgba(87,103,255,0.15)")
          grad.addColorStop(1, "rgba(180,190,255,0.0)")
        } else if (i === 1) {
          grad.addColorStop(0, "rgba(37,99,235,0.12)")
          grad.addColorStop(1, "rgba(243,244,246,0.0)")
        } else {
          grad.addColorStop(0, "rgba(15,23,42,0.05)")
          grad.addColorStop(1, "rgba(209,213,219,0.0)")
        }
        ctx.strokeStyle = grad
        ctx.lineWidth = 90
        ctx.lineCap = "round"
        ctx.stroke()
      })
      ctx.restore()

      const mx = pointer.current.x || w * 0.5
      const my = pointer.current.y || h * 0.35
      const wob = prefersReduce ? 0 : Math.sin(t * 0.7) * 40

      const drawBlob = (cx: number, cy: number, r: number, color: string, alpha: number) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, color)
        g.addColorStop(1, "transparent")
        ctx.globalAlpha = alpha
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.save()
      ctx.globalCompositeOperation = "lighter"
      drawBlob(mx + wob * 0.4, my, 210, "rgba(91,91,255,0.22)", 1)
      drawBlob(mx - 90, my + 40, 260, "rgba(148,163,184,0.3)", 0.9)
      drawBlob(mx + 120, my - 60, 230, "rgba(239,246,255,0.9)", 0.9)
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
      style={{ contain: "strict" }}
    />
  )
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ix = useMotionValue(-100)
  const iy = useMotionValue(-100)

  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 })
  const six = useSpring(ix, { stiffness: 400, damping: 30, mass: 0.5 })
  const siy = useSpring(iy, { stiffness: 400, damping: 30, mass: 0.5 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const target = (e.target as HTMLElement) || null
      const isActive = target?.closest("a, button, [data-hover]")

      const outer = cursorRef.current
      const inner = innerRef.current

      const tx = e.clientX
      const ty = e.clientY

      x.set(tx - 24)
      y.set(ty - 24)
      ix.set(tx - 4)
      iy.set(ty - 4)

      if (outer && inner) {
        if (isActive) {
          outer.style.transform = "scale(1.5)"
          outer.style.mixBlendMode = "multiply"
          outer.style.background =
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(91,91,255,0.5))"
          inner.style.transform = "scale(0.9)"
          inner.style.backgroundColor = BLURPLE
        } else {
          outer.style.transform = "scale(1)"
          outer.style.mixBlendMode = "normal"
          outer.style.background =
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(15,23,42,0.08))"
          inner.style.transform = "scale(1)"
          inner.style.backgroundColor = "#111827"
        }
      }
    }

    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [x, y, ix, iy])

  return (
    <>
      <motion.div
        ref={cursorRef}
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed z-[75] h-12 w-12 rounded-full shadow-[0_18px_55px_rgba(15,23,42,0.32)] backdrop-blur-[18px]"
      />
      <motion.div
        ref={innerRef}
        style={{ x: six, y: siy }}
        className="pointer-events-none fixed z-[76] h-2.5 w-2.5 rounded-full bg-neutral-900"
      />
    </>
  )
}

/* ========================= 3D HERO SCENE ========================== */

function Particles({ count = 200 }: { count?: number }) {
  const ref = useRef<any>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) {
      arr[i] = (Math.random() - 0.5) * 5
      arr[i + 1] = (Math.random() - 0.5) * 3
      arr[i + 2] = (Math.random() - 0.5) * 3
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime()
    ref.current.rotation.y = t * 0.06
    ref.current.rotation.x = Math.sin(t * 0.25) * 0.16
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#9CA3AF" sizeAttenuation />
    </points>
  )
}

function BuildingBlock({ i }: { i: number }) {
  const ref = useRef<any>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.getElapsedTime() + i * 0.25
    ref.current.position.x = Math.sin(t * 0.8) * 0.55 + (i % 4) * 0.9 - 1.4
    ref.current.position.y = Math.cos(t * 0.9) * 0.45 + Math.floor(i / 4) * 0.55 - 0.8
    ref.current.position.z = Math.sin(t * 0.4) * 0.4
    ref.current.rotation.x = t * 0.32
    ref.current.rotation.y = t * 0.25
  })

  return (
    <Float speed={2} rotationIntensity={0.7} floatIntensity={0.7}>
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.28, 0.06]} />
        <meshStandardMaterial color={BLURPLE} metalness={0.35} roughness={0.25} />
      </mesh>
    </Float>
  )
}

function SiteFrame() {
  return (
    <group position={[0, 0, -0.15]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.4, 2.7, 0.04]} />
        <meshStandardMaterial color="#F9FAFB" metalness={0.25} roughness={0.3} />
      </mesh>

      <mesh position={[0, 1.27, 0.02]}>
        <planeGeometry args={[4.4, 0.36]} />
        <meshStandardMaterial color="#E5E7EB" />
      </mesh>

      <mesh position={[-2.0, 1.3, 0.03]}>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      <mesh position={[-1.8, 1.3, 0.03]}>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>
      <mesh position={[-1.6, 1.3, 0.03]}>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>

      <group position={[0, 0.3, 0.03]}>
        <mesh>
          <planeGeometry args={[1.8, 0.6]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <planeGeometry args={[1.8, 0.32]} />
          <meshBasicMaterial color="#E5E7EB" />
        </mesh>
      </group>

      <group position={[1.2, -0.3, 0.03]}>
        <mesh position={[0, 0.45, 0]}>
          <planeGeometry args={[1.6, 0.3]} />
          <meshBasicMaterial color="#E5E7EB" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <planeGeometry args={[1.6, 0.6]} />
          <meshBasicMaterial color="#F3F4F6" />
        </mesh>
        <mesh position={[0, -0.55, 0]}>
          <planeGeometry args={[1.6, 0.5]} />
          <meshBasicMaterial color="#E5E7EB" />
        </mesh>
      </group>
    </group>
  )
}

function BuilderScene() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0.7, 5.8], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[3.5, 4.5, 5]}
        intensity={1.15}
        castShadow
      />
      <Environment preset="city" />
      <Particles />
      <group>
        <SiteFrame />
        {Array.from({ length: 16 }).map((_, i) => (
          <BuildingBlock key={i} i={i} />
        ))}
      </group>
      <EffectComposer>
        <Bloom
          intensity={0.35}
          luminanceThreshold={0.25}
          luminanceSmoothing={0.6}
        />
      </EffectComposer>
    </Canvas>
  )
}

/* ============================= NAV ================================ */

function NavBar() {
  const { scrollYProgress } = useScroll()
  const bg = useTransform(scrollYProgress, [0, 0.08], ["rgba(255,255,255,0)", "rgba(255,255,255,0.9)"])
  const border = useTransform(scrollYProgress, [0, 0.08], ["transparent", "rgba(229,231,235,1)"])

  return (
    <motion.header
      style={{ backgroundColor: bg, borderBottomColor: border }}
      className="fixed inset-x-0 top-0 z-[79] border-b backdrop-blur-md"
    >
      <div className="mx-auto flex h-14 w-[min(1200px,92vw)] items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight" data-hover>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF0FF] text-[13px] font-semibold text-[#3737FF]">
            N
          </span>
          <span className="text-neutral-900">
            Noble Web Designs
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-xs text-neutral-600">
          <Link href="#work" data-hover className="hover:text-neutral-900">
            Work
          </Link>
          <Link href="#about" data-hover className="hover:text-neutral-900">
            About
          </Link>
          <Link href="#contact" data-hover className="hover:text-neutral-900">
            Contact
          </Link>
          <Link
            href="/contact"
            data-hover
            className="hidden rounded-full bg-[#111827] px-3 py-1.5 text-[11px] font-medium text-white md:inline-flex"
          >
            Book call
          </Link>
        </nav>
      </div>
    </motion.header>
  )
}

/* ============================= HERO =============================== */

function MagnetButton({ href, children }: { href: Route; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = (e.clientX - cx) / 18
      const dy = (e.clientY - cy) / 18
      el.style.transform = `translate(${dx}px, ${dy}px)`
    }
    const reset = () => {
      el.style.transform = "translate(0px, 0px)"
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", reset)

    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", reset)
    }
  }, [])

  return (
    <Link
      ref={ref}
      href={href}
      data-hover
      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#5B5BFF] via-[#4C6FFF] to-[#0A84FF] px-7 py-4 text-sm font-medium text-white shadow-[0_18px_45px_rgba(37,99,235,0.55)]"
    >
      {children}
    </Link>
  )
}

function Hero() {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const o = useTransform(scrollYProgress, [0, 1], [1, 0.65])
  const sceneRotate = useTransform(scrollYProgress, [0, 1], [0, -6])

  return (
    <section
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden"
    >
      <motion.div className="pointer-events-none absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full bg-[#E0E3FF] blur-[150px]" />
      <motion.div className="pointer-events-none absolute top-[26%] -right-32 h-[520px] w-[520px] rounded-full bg-[#F3F4FF] blur-[130px]" />
      <motion.div className="pointer-events-none absolute bottom-[-8%] left-[10%] h-[420px] w-[420px] rounded-full bg-[#E5E7EB] blur-[120px]" />

      <motion.div className="absolute inset-0 grid grid-cols-1 items-center lg:grid-cols-2">
        <motion.div
          style={{ rotateZ: sceneRotate }}
          className="relative order-2 h-[42vh] lg:order-1 lg:h-full"
        >
          <div className="absolute inset-0 px-6 lg:px-10 flex items-center">
            <div className="w-full rounded-[32px] border border-white/70 bg-white/70 shadow-[0_40px_90px_rgba(15,23,42,0.18)] overflow-hidden backdrop-blur-2xl">
              <div className="h-[260px] sm:h-[320px] lg:h-[420px]">
                <BuilderScene />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ y, opacity: o }}
          className="order-1 flex items-center justify-center lg:order-2"
        >
          <div className="max-w-xl px-6 md:px-10 pt-10 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D1D5FF] bg-white/90 px-4 py-1 text-[11px] font-medium tracking-[0.12em] uppercase text-[#4B4BFF]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5B5BFF]" />
                Noble Sherman, web designer and builder
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.75 }}
              className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-neutral-900 md:text-6xl lg:text-7xl"
            >
              Websites built
              <span className="block text-[#4B4BFF]">
                like you actually use them.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.65 }}
              className="mt-5 text-[15px] text-neutral-600 md:text-base"
            >
              I work with nonprofits and small teams that care about how their site feels.
              Clean layouts, calm motion, and pages that respect people’s time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagnetButton href="/contact">
                Book strategy call
                <ArrowRight className="h-4 w-4" />
              </MagnetButton>
              <Link
                href="/projects"
                data-hover
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white/90 px-7 py-4 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
              >
                See projects
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ============================================================= */
/*   NOBLE IDENTITY BLOCK                                        */
/* ============================================================= */

function IdentityBlock() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative w-full py-32 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="w-[min(900px,90vw)] mx-auto rounded-[32px] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_30px_90px_rgba(0,0,0,0.12)] p-12 flex flex-col md:flex-row gap-12 items-center"
        data-hover
      >
        {/* Headshot */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative h-44 w-44 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(91,91,255,0.25)] ring-4 ring-[#EEF0FF]"
        >
          <img
            src="/your-headshot.jpg"
            alt="Noble Sherman"
            className="object-cover h-full w-full"
          />
        </motion.div>

        {/* Text */}
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-4xl font-semibold tracking-tight text-neutral-900"
          >
            Hey, I’m Noble.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-4 text-[15px] max-w-md text-neutral-600"
          >
            I build motion-heavy websites that hit fast, feel alive, and actually convert.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="mt-8 grid grid-cols-3 gap-6"
          >
            <div className="text-center">
              <p className="text-3xl font-semibold text-[#4B4BFF]">24</p>
              <p className="text-xs text-neutral-500 mt-1">Sites Shipped</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-semibold text-[#4B4BFF]">3s</p>
              <p className="text-xs text-neutral-500 mt-1">Median TTI</p>
            </div>
 sbs
            <div className="text-center">
              <p className="text-3xl font-semibold text-[#4B4BFF]">18</p>
              <p className="text-xs text-neutral-500 mt-1">Days to Launch</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

/* =========================== LAYOUT HELPERS ======================= */

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#D4DAFF] bg-white px-4 py-1 text-[11px] font-medium text-neutral-700">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLURPLE }} />
      {children}
    </div>
  )
}

function Section({
  id,
  children,
  neutral = false,
  tight = false,
}: {
  id?: string
  children: React.ReactNode
  neutral?: boolean
  tight?: boolean
}) {
  return (
    <section
      id={id}
      className={`${neutral ? "bg-[#F6F7FF]" : "bg-transparent"} ${
        tight ? "py-16 md:py-20" : "py-24 md:py-32"
      }`}
    >
      <div className="relative z-10 mx-auto w-[min(1200px,92vw)]">
        {children}
      </div>
    </section>
  )
}

/* =========================== INTRO STACK ========================== */

function IntroStack() {
  const lines = [
    "Noble Web Designs is a one-person studio focused on motion-forward sites.",
    "I design and build in the same brain, so nothing gets lost between mockup and dev.",
    "You get a site that looks sharp, moves well, and loads fast.",
  ]

  return (
    <Section id="intro" tight>
      <div className="grid gap-7 md:gap-8">
        {lines.map((t, i) => (
          <RevealLine key={i} idx={i} text={t} />
        ))}
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
      className="text-[22px] leading-[1.15] tracking-[-0.03em] text-neutral-900 transition-transform md:text-[34px]"
      onMouseMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 2
        el.style.transform = `skewY(${dx * 1.4}deg)`
      }}
      onMouseLeave={() => {
        const el = ref.current
        if (el) el.style.transform = "skewY(0deg)"
      }}
    >
      <motion.span
        initial={{ y: "100%", opacity: 0.4 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{
          duration: 0.7,
          delay: idx * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="inline-block border-b border-[#E0E3FF] pb-1"
      >
        {text}
      </motion.span>
    </p>
  )
}

/* =========================== ABOUT NOBLE ========================== */

function AboutNoble() {
  const bullets = [
    "Based near Philadelphia, working with local orgs and online clients.",
    "Comfortable in both Figma and VS Code, so design and build stay aligned.",
    "Experience with nonprofits, logistics, and local restaurants.",
    "Here for long-term relationships, not one-off mystery handoffs.",
  ]

  return (
    <Section id="about">
      <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
        <div>
          <Tag>About Noble</Tag>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            A one-person studio, on purpose.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-neutral-600">
            I am Noble Sherman, a designer and developer who cares more about how your site feels
            than how many slides are in a pitch deck. I like clear timelines, plain language, and builds
            that do not need a babysitter after launch.
          </p>
          <div className="mt-5 space-y-2 text-sm text-neutral-700">
            {bullets.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="flex gap-3"
              >
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#5B5BFF]" />
                <span>{b}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-br from-[#5B5BFF0F] via-[#0A84FF08] to-transparent" />
          <div className="relative rounded-[28px] border border-[#E0E3FF] bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF0FF] text-sm font-semibold text-[#3737FF]">
                N
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-900">
                  Noble Sherman
                </div>
                <div className="text-xs text-neutral-500">
                  Designer, developer, and your main contact.
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-neutral-600">
              You do not get passed around between “accounts” and “dev.”
              You talk to the person who is actually building your site.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-neutral-600">
              <span className="rounded-full bg-[#F3F4FF] px-3 py-1">
                Next.js & React
              </span>
              <span className="rounded-full bg-[#F3F4FF] px-3 py-1">
                Motion & interaction design
              </span>
              <span className="rounded-full bg-[#F3F4FF] px-3 py-1">
                Nonprofit & small team friendly
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

/* =========================== STATS STRIP ========================== */

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = `${Math.round(v)}${suffix}`
        }
      },
    })
    return () => controls.stop()
  }, [value, suffix])

  return <span ref={ref} />
}

function StatsStrip() {
  const items = [
    { n: 24, label: "sites shipped", sub: "Real launches, not mockups." },
    { n: 3, label: "sec TTI", sub: "Median time to interactive.", suffix: "s" },
    { n: 18, label: "avg days", sub: "From kickoff to go-live." },
    { n: 92, label: "lighthouse", sub: "Typical performance score.", suffix: "%" },
  ]

  return (
    <Section tight>
      <div className="grid gap-4 md:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="rounded-3xl border border-[#D4DAFF] bg-white/95 p-5 shadow-sm backdrop-blur"
          >
            <div className="text-3xl font-semibold text-neutral-900 md:text-4xl">
              <AnimatedNumber value={it.n} suffix={it.suffix || ""} />
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-neutral-500">
              {it.label}
            </div>
            <div className="mt-3 text-sm text-neutral-600">
              {it.sub}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* =========================== WORK GRID ============================ */

type CaseItem = {
  t: string
  d: string
  tag: string
  url: string
}

const CASES: CaseItem[] = [
  {
    t: "Food4Philly",
    d: "A refocused nonprofit site that makes donating and finding food simple.",
    tag: "Nonprofit",
    url: "https://food4philly.org",
  },
  {
    t: "Kensure Logistics",
    d: "A B2B marketing site that cuts straight to what ops people care about.",
    tag: "Logistics",
    url: "https://freightkensure.com",
  },
  {
    t: "Martino’s of Elmont",
    d: "A neighborhood restaurant with a cleaner menu and smoother mobile flow.",
    tag: "Restaurant",
    url: "https://martinosofelmont.net",
  },
]

function WorkGrid() {
  return (
    <Section id="work" neutral>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Tag>Selected work</Tag>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Less noise, more signal.
          </h2>
          <p className="mt-2 max-w-md text-sm text-neutral-600">
            A quick look at projects where motion, speed, and clear copy line up. 
            Each build started with what the client actually needed people to do.
          </p>
        </div>
        <Link
          href="/projects"
          data-hover
          className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-5 py-3 text-xs font-medium text-neutral-900 hover:bg-neutral-50"
        >
          Explore all projects
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CASES.map((c, i) => (
          <WorkCard key={c.t} item={c} idx={i} />
        ))}
      </div>
    </Section>
  )
}

function WorkCard({ item, idx }: { item: CaseItem; idx: number }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, amount: 0.25 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (py - 0.5) * -6
    const ry = (px - 0.5) * 8
    el.style.transform =
      `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`
  }

  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)"
  }

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 26 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: idx * 0.07 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group relative overflow-hidden rounded-[28px] border border-[#D4DAFF] bg-[#F7F8FF] shadow-[0_18px_55px_rgba(15,23,42,0.12)] transition-transform will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,#1F2937_0,#1F2937_12%,#4B5BFF_40%,#E5E7EB_100%)]" />
        <div className="absolute inset-[18%] rounded-3xl border border-white/10 bg-gradient-to-br from-white/12 via-white/0 to-black/30 backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
          <div className="absolute -inset-x-1/2 inset-y-[-20%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[sheen_1.3s_ease-out_forwards]" />
        </div>
      </div>

      <div className="relative p-5">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.16em] text-[#4B4BFF]">
              {item.tag}
            </div>
            <div className="mt-1 truncate text-sm font-semibold text-neutral-900">
              {item.t}
            </div>
            <div className="mt-1 text-xs text-neutral-600 line-clamp-2">
              {item.d}
            </div>
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer noopener"
            data-hover
            className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-[#D4DAFF] bg-[#EEF0FF] px-3 py-1.5 text-[11px] font-medium text-[#1F2A7F] hover:bg-[#E0E3FF]"
          >
            Visit
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <style>{`
        @keyframes sheen {
          0% { transform: translateX(-40%); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateX(40%); opacity: 0; }
      `}</style>
    </motion.article>
  )
}

/* ============================ PROCESS ============================= */

function Process() {
  const steps = [
    {
      t: "Strategy",
      d: "We talk through goals, audience, and site map on a quick call.",
    },
    {
      t: "Design",
      d: "I sketch flows, set the motion rules, and lock in key screens.",
    },
    {
      t: "Build",
      d: "I ship the Next.js build with performance and accessibility baked in.",
    },
    {
      t: "Launch",
      d: "You get QA, redirects, analytics, and clear docs for updates.",
    },
  ]

  return (
    <Section>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Tag>Process</Tag>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Fast, calm, and structured.
          </h2>
        </div>
        <div className="text-xs text-neutral-500">
          No mystery sprints. You always know what is being worked on.
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.t}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="relative rounded-3xl border border-[#D4DAFF] bg-white/95 p-6 shadow-sm backdrop-blur"
          >
            <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#5B5BFF] text-[11px] font-semibold text-white">
              {i + 1}
            </div>
            <div className="text-sm font-semibold text-neutral-900">
              {s.t}
            </div>
            <div className="mt-2 text-sm text-neutral-600">
              {s.d}
            </div>
            {i < steps.length - 1 && (
              <span className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#D4DAFF] to-transparent md:block" />
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* =========================== TESTIMONIALS ========================= */

function Testimonials() {
  const items = [
    { q: "Traffic went up and the site loads like it cares.", a: "Director, nonprofit" },
    { q: "We launched in weeks and nothing broke.", a: "Ops lead, logistics" },
    { q: "Clean design, smart motion, no fluff.", a: "Owner, restaurant" },
  ]

  return (
    <Section neutral>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <Tag>What clients say</Tag>
        <div className="text-xs text-neutral-500">
          Short, honest, and to the point.
        </div>
      </div>

      <div className="mt-8 overflow-x-auto [scroll-snap-type:x_mandatory] [-webkit-overflow-scrolling:touch]">
        <div className="flex min-w-max gap-6">
          {items.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="w-[min(520px,85vw)] scroll-snap-align-start rounded-3xl border border-[#D4DAFF] bg-white/95 p-6 shadow-sm backdrop-blur"
            >
              <p className="text-[15px] leading-snug text-neutral-900">
                {t.q}
              </p>
              <cite className="mt-4 block text-xs text-neutral-500 not-italic">
                — {t.a}
              </cite>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* =============================== FOOTER ============================ */

function FooterCTA() {
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <Section id="contact" neutral>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <div>
          <Tag>Get in touch</Tag>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            Ready when you are.
          </h2>
          <p className="mt-3 max-w-md text-sm text-neutral-600">
            One short call to see if we are a good fit.
            If we are, you get a clear scope, pricing, and a timeline that respects your schedule.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              data-hover
              className="inline-flex items-center gap-2 rounded-2xl bg-[#111827] px-6 py-3 text-sm font-medium text-white"
            >
              Book strategy call
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              data-hover
              className="inline-flex items-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
            >
              See projects
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#D4DAFF] bg-white/95 p-6 shadow-sm backdrop-blur">
          <div className="text-xs text-neutral-500">Email</div>
          <div className="mt-1 text-sm font-semibold text-neutral-900">
            hello@nobleswebdesigns.com
          </div>
          <div className="mt-4 h-px bg-[#E0E3FF]" />
          <div className="mt-4 text-[11px] text-neutral-500">
            © {year} Noble’s Web Designs
          </div>
        </div>
      </div>
    </Section>
  )
}

function StickyCTA() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0.2, 0.35], [80, 0])
  const o = useTransform(scrollYProgress, [0.2, 0.35], [0, 1])

  return (
    <motion.div
      style={{ y, opacity: o }}
      className="fixed bottom-4 left-1/2 z-[70] -translate-x-1/2 px-4"
    >
      <div className="flex items-center gap-3 rounded-full border border-[#D4DAFF] bg-white/95 px-4 py-2 text-xs text-neutral-900 shadow-[0_18px_50px_rgba(15,23,42,0.24)] backdrop-blur">
        <span className="hidden text-neutral-500 sm:inline">
          Have a project in mind?
        </span>
        <Link
          href="/contact"
          data-hover
          className="inline-flex items-center rounded-full bg-[#5B5BFF] px-4 py-1.5 text-[11px] font-medium text-white"
        >
          Book a call
        </Link>
      </div>
    </motion.div>
  )
}

/* ============================== PAGE ============================== */

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-transparent text-neutral-900 antialiased">
      <SmoothScroll />
      <ScrollProgress />
      <InteractiveBackground />
      <NavBar />
      <CustomCursor />

      <Hero />
      <IntroStack />
      <AboutNoble />
      <StatsStrip />
      <WorkGrid />
      <Process />
      <Testimonials />
      <FooterCTA />
      <StickyCTA />
    </main>
  )
}
