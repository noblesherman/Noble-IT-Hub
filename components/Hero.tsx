"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export default function Hero() {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const sTiltX = useSpring(tiltX, { stiffness: 200, damping: 20 });
  const sTiltY = useSpring(tiltY, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(sTiltY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sTiltX, [-0.5, 0.5], [-8, 8]);

  const cardRef = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function resetTilt() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-neutral-100 border-b border-neutral-200">
  <div className="mx-auto max-w-7xl px-6 lg:px-12 py-24 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">
    
    {/* LEFT SIDE */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-6"
    >
      <p className="uppercase tracking-[0.12em] text-neutral-500 text-sm font-medium">
        Noble’s Web Designs
      </p>

      <h1 className="text-5xl md:text-6xl font-semibold leading-tight text-neutral-900">
        Websites that grow your business
        <br />
        <span className="text-blue-600">without growing your stress.</span>
      </h1>

      <p className="max-w-xl text-[17px] leading-7 text-neutral-600">
        Clean design, fast performance, reliable tech. Built with Next.js and ruthless attention to detail.
      </p>

      <div className="flex gap-3 pt-2">
        <Link className="btn-primary" href="/projects">View Projects</Link>
        <Link className="btn-outline" href="/contact">Book Free Strategy Call</Link>
      </div>
    </motion.div>

    {/* RIGHT SIDE */}
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={resetTilt}
      style={{ rotateX, rotateY }}
      className="relative w-full max-w-sm mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
    >
      <div className="absolute inset-0 rounded-[50px] bg-white shadow-2xl blur-xl opacity-70" />
      <Image
        src="/me.jpeg"
        width={800}
        height={900}
        alt="Noble Sherman"
        className="relative rounded-[50px] shadow-xl object-cover"
        priority
      />
    </motion.div>

  </div>
</section>
  );
}