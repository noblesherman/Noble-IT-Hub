"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function StatusDetail({ monitor, onClose }: any) {
  if (!monitor) return null;

  const isDown = monitor.status !== 2;
  const color = isDown ? "#ef4444" : "#22c55e";
  const times = monitor.responseTimes || [];

  const avg = Math.round(
    times.reduce((a: number, b: number) => a + b, 0) /
      (times.length || 1)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 100, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl
                   bg-white/85 backdrop-blur-xl rounded-t-3xl
                   border border-white/50 p-8 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            {monitor.name}
          </h2>
          <span className="w-3 h-3 rounded-full" style={{ background: color }} />
        </div>

        <p className="text-neutral-600 text-sm mb-4">
          Avg Response: {avg}ms (last 20 checks)
        </p>

        {/* Sparkline */}
        <svg className="w-full h-24 mb-6">
          <polyline
            points={times
              .map((v: number, i: number) => `${(i / (times.length - 1)) * 100},${100 - (v % 100)}`)
              .join(" ")}
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
        </svg>

        <div className="flex justify-between">
          <Link
            href={monitor.url}
            target="_blank"
            className="text-blue-600 text-sm font-medium"
          >
            Open Website
          </Link>

          <button
            onClick={() => alert("Incident reporting is coming soon")}
            className="text-xs bg-red-100 text-red-700 rounded-full px-3 py-1"
          >
            Report Incident
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}