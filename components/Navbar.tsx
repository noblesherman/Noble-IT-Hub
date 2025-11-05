"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type NavLink = { label: string; href: string };

const LINKS: NavLink[] = [
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
  { label: "Status", href: "/status" }
];

// distance -> scale helper for dock magnification
function dockScale(px: number, radius = 120, max = 1.22, min = 1) {
  const d = Math.min(Math.max(px, 0), radius);
  const t = 1 - d / radius;
  return min + (max - min) * t * t;
}

export default function Navbar() {
  const [collapsed, setCollapsed] = useState(false);
  const [proxOpen, setProxOpen] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // smooth tilt of the whole bar
  const tiltX = useSpring(
    useTransform(cursorY, [0, 1], [5, -5]),
    { stiffness: 220, damping: 20 }
  );
  const tiltY = useSpring(
    useTransform(cursorX, [0, 1], [-5, 5]),
    { stiffness: 220, damping: 20 }
  );

  // glass highlight that follows the cursor
  const glowX = useSpring(useTransform(cursorX, [0, 1], ["-8%", "8%"]), { stiffness: 250, damping: 22 });
  const glowY = useSpring(useTransform(cursorY, [0, 1], ["-12%", "6%"]), { stiffness: 250, damping: 22 });

  // track cursor inside the bar for tilt and glow
  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    cursorX.set((e.clientX - r.left) / r.width);
    cursorY.set((e.clientY - r.top) / r.height);
  }

  // collapse on scroll down, expand on scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const down = y > lastY && y > 80;
        setCollapsed(down);
        lastY = y;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // proximity open when pointer gets close to the bar area
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      const cx = Math.max(r.left, Math.min(e.clientX, r.right));
      const cy = Math.max(r.top, Math.min(e.clientY, r.bottom));
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      // open when within 140px of the bar, close otherwise if collapsed
      setProxOpen(dist < 140);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const open = !collapsed || proxOpen;

  return (
    <motion.nav
      ref={wrapRef}
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
transition={{
  type: "spring",
  stiffness: 200,
  damping: 22,
  mass: 0.4
}}
      style={{ rotateX: tiltX, rotateY: tiltY }}
      className="
        fixed bottom-8 left-1/2 -translate-x-1/2 z-50
        will-change-transform
      "
    >
      <motion.div
        layout
        className="
          relative flex items-center gap-8
          px-6 py-3
          rounded-[28px]
          border
          shadow-[0_12px_48px_rgba(0,0,0,0.18)]
          backdrop-blur-2xl backdrop-saturate-150
        "
        style={{
          width: open ? 680 : 160,
          justifyContent: open ? "space-between" as const : "center",
          // VisionOS glass stack: subtle base tint plus inner glows
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.35))",
          borderColor: "rgba(255,255,255,0.5)"
        }}
        transition={{
  layout: {
    type: "spring",
    stiffness: 420,
    damping: 30,
    mass: 0.3
  }
}}
      >
        {/* soft rim highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/40" />

        {/* liquid glow following cursor */}
        <motion.div
          aria-hidden
          style={{ translateX: glowX, translateY: glowY }}
          className="
            pointer-events-none absolute -inset-8 rounded-[40px]
            bg-[radial-gradient(180px_140px_at_center,rgba(255,255,255,0.45),transparent 65%)]
            opacity-70
          "
        />

        {/* logo, always visible */}
        <Link
          href="/"
          className="relative shrink-0 text-[20px] font-semibold tracking-tight text-neutral-900"
        >
          Noble<span className="text-blue-600">.</span>
        </Link>

        {/* links, dock-style magnify, hidden when closed */}
        {open && (
          <DockLinks />
        )}
      </motion.div>
    </motion.nav>
  );
}

function DockLinks() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const r = containerRef.current?.getBoundingClientRect();
      if (!r) return setMouseX(null);
      setMouseX(e.clientX);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={containerRef} className="flex items-center gap-10 pr-2">
      {LINKS.map((link) => (
        <DockItem
          key={link.href}
          label={link.label}
          href={link.href}
          mouseX={mouseX}
          containerRef={containerRef}
        />
      ))}
    </div>
  );
}

function DockItem({
  label,
  href,
  mouseX,
  containerRef
}: {
  label: string;
  href: string;
  mouseX: number | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!mouseX || !ref.current || !containerRef.current) {
      setScale(1);
      return;
    }
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const dist = Math.abs(mouseX - cx);
    setScale(dockScale(dist));
  }, [mouseX, containerRef]);

  return (
    <motion.div
      style={{ scale }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="relative"
    >
      <Link
        ref={ref}
        href={href}
        className="
          group relative text-[15px] font-medium text-neutral-900
          px-2 py-1 rounded-md
        "
      >
        {label}
        <span
          className="
            absolute left-0 -bottom-1 h-[2px] w-full
            bg-gradient-to-r from-blue-600 to-cyan-500
            scale-x-0 group-hover:scale-x-100
            transition-transform duration-300 origin-left
            rounded-full
          "
        />
      </Link>
    </motion.div>
  );
}