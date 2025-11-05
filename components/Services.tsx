"use client";
import { motion } from "framer-motion";
import { FiBarChart2, FiGlobe, FiSmartphone, FiZap } from "react-icons/fi";

const services = [
  {
    icon: FiGlobe,
    title: "Website Design",
    desc: "Beautiful, modern websites that build trust instantly."
  },
  {
    icon: FiBarChart2,
    title: "SEO + Performance",
    desc: "Fast loading, search-friendly, built to convert customers."
  },
  {
    icon: FiSmartphone,
    title: "Mobile-First",
    desc: "Looks perfect on every screen. Because phones exist."
  },
  {
    icon: FiZap,
    title: "Automation & Tech Setup",
    desc: "Contact forms, email flows, the nerd magic that saves you hours."
  }
];

export default function Services() {
  return (
    <section className="w-full bg-[#F8F9FB] py-24">
  <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <p className="eyebrow text-neutral-500">SERVICES</p>
        <h2 className="text-4xl font-semibold text-neutral-900 mt-2">
          What I Deliver
        </h2>

        <p className="text-neutral-600 mt-4 max-w-2xl mx-auto">
          Websites built with precision and purpose. Combining design, speed,
          and strategy to grow your business online.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((srv, i) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm 
                           hover:shadow-lg transition-all text-center flex flex-col 
                           items-center gap-4"
              >
                <Icon className="text-blue-600 text-4xl" />
                <h3 className="font-medium text-lg text-neutral-900">
                  {srv.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {srv.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}