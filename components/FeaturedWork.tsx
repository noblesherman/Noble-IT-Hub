"use client";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const projects = [
  {
    name: "Food4Philly",
    link: "https://food4philly.org",
    logo: "/cases/food4philly.png",
    tagline: "Nonprofit food distribution",
  },
  {
    name: "Kensure Logistics",
    link: "https://freightkensure.com",
    logo: "/cases/kensure.png",
    tagline: "Freight logistics services",
  },
  {
    name: "Martino’s of Elmont",
    link: "https://martinos.net",
    logo: "/cases/martinos.png",
    tagline: "Italian specialty market",
  }
];

export default function FeaturedWork() {
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);

  const sTiltX = useSpring(tiltX, { stiffness: 120, damping: 12 });
  const sTiltY = useSpring(tiltY, { stiffness: 120, damping: 12 });

  const rotateX = useTransform(sTiltY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(sTiltX, [-0.5, 0.5], [-10, 10]);

  function handle(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    tiltX.set((e.clientX - rect.left) / rect.width - 0.5);
    tiltY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <section className="w-full bg-[#EFF1F3] py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">

        <p className="text-neutral-600 font-medium tracking-wide">
          FEATURED WORK
        </p>

        <h2 className="text-4xl font-semibold text-black mt-2">
          Recent Projects
        </h2>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 perspective-[1200px]">
          {projects.map((proj, i) => (
            <motion.a
              key={proj.name}
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              onMouseMove={handle}
              onMouseLeave={reset}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-2xl overflow-hidden
                         border border-neutral-200 shadow-sm
                         hover:shadow-xl hover:-translate-y-2 transition-all"
            >
              <Image
                src={proj.logo}
                alt={proj.name}
                width={800}
                height={450}
                className="w-full h-48 object-cover"
                priority
              />

              <div className="p-6 text-left">
                <h3 className="text-xl font-bold text-black">
                  {proj.name}
                </h3>
                <p className="text-neutral-700 mt-1 text-sm leading-relaxed">
                  {proj.tagline}
                </p>
              </div>

            </motion.a>
          ))}
        </div>

      </div>
    </section>
  );
}