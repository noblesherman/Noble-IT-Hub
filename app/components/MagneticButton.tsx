"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import clsx from "clsx"

export default function MagneticButton({ href, children, variant }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const move = (e) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) * 0.1
      const dy = (e.clientY - (r.top + r.height / 2)) * 0.1
      el.style.transform = `translate(${dx}px, ${dy}px)`
    }

    const leave = () => {
      el.style.transform = "translate(0,0)"
    }

    el.addEventListener("mousemove", move)
    el.addEventListener("mouseleave", leave)
    return () => {
      el.removeEventListener("mousemove", move)
      el.removeEventListener("mouseleave", leave)
    }
  }, [])

  return (
    <Link
      ref={ref}
      href={href}
      className={clsx(
        "px-6 py-3 rounded-2xl font-medium shadow-sm transition",
        variant === "outline"
          ? "border bg-white hover:bg-neutral-50"
          : "bg-neutral-900 text-white hover:bg-neutral-800"
      )}
    >
      {children}
    </Link>
  )
}