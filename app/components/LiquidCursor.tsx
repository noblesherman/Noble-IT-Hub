"use client"

import { useEffect, useRef } from "react"

export default function LiquidCursor() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y

    const move = (e) => {
      tx = e.clientX
      ty = e.clientY
    }

    window.addEventListener("pointermove", move)

    const loop = () => {
      x += (tx - x) * 0.15
      y += (ty - y) * 0.15
      el.style.transform = `translate(${x - 40}px, ${y - 40}px)`
      requestAnimationFrame(loop)
    }

    loop()
    return () => window.removeEventListener("pointermove", move)
  }, [])

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-20 h-20 pointer-events-none rounded-full bg-[#0A84FF33] blur-2xl opacity-60 z-[1000]"
    />
  )
}