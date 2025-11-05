"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminMetric({
  label,
  value,
  color,
  href
}: {
  label: string;
  value: string | number;
  color: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className="
          rounded-3xl p-6 flex flex-col justify-center cursor-pointer
          bg-white/60 backdrop-blur-2xl border border-white/40
          shadow-[0_20px_40px_rgba(0,0,0,0.12)]
          transition-all
        "
      >
        <span className="text-neutral-600 text-sm">{label}</span>
        <span className="text-4xl font-bold mt-2" style={{ color }}>
          {value}
        </span>
      </motion.div>
    </Link>
  );
}