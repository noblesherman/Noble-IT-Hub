"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const items = [
  { title: "Food4Philly", url: "https://food4philly.org", img: "/cases/food4philly.jpg" },
  { title: "Kensure Logistics", url: "https://freightkensure.com", img: "/cases/kensure.jpg" },
  { title: "Martino’s of Elmont", url: "https://martinosofelmont.net", img: "/cases/martinos.jpg" }
];

export default function CaseStudies() {
  return (
    <section className="wrap mt-14">
      <div className="flex items-end justify-between">
        <div>
          <p className="eyebrow">FEATURED WORK</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold">Recent projects</h2>
        </div>
        <Link href="/projects" className="btn btn-quiet">All projects</Link>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="card p-0 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-44 w-full">
              <Image src={p.img} alt={p.title} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <div className="mt-3 flex items-center justify-between">
                <Link href={p.url} target="_blank" className="text-[15px] text-[#0A84FF] hover:underline">Visit →</Link>
                <span className="text-[13px] text-[color:var(--muted)]">Case study</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}