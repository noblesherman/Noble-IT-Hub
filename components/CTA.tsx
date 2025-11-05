"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="w-full py-32 bg-gradient-to-b from-neutral-100 to-white text-center">
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-4xl font-semibold text-neutral-900"
      >
        Ready to Build Something Great?
      </motion.h2>

      <p className="text-neutral-600 mt-4 mb-8">
        A free strategy call might be the smartest move you make today.
      </p>

      <Link
        href="/contact"
        className="btn-primary inline-block"
      >
        Book Free Strategy Call
      </Link>
    </section>
  );
}