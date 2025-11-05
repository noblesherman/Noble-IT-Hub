// app/projects/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

const prisma = new PrismaClient();

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="px-6 py-10 max-w-7xl mx-auto">
      <section className="mb-10">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Projects
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Stuff I built because sleep is for the weak.
        </p>
      </section>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <article
            key={p.id}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          >
            {p.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{p.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {p.description}
              </p>

              <div className="flex items-center justify-between">
                {p.link && (
                  <Link
                    href={p.link}
                    className="inline-block px-4 py-2 text-sm font-semibold 
                    bg-blue-600 text-white rounded-md hover:bg-blue-700 
                    transition-colors"
                  >
                    View Project
                  </Link>
                )}

                {p.tags && (
                  <div className="flex gap-2 flex-wrap">
                    {p.tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 dark:bg-neutral-800 
                        text-gray-800 dark:text-gray-200 
                        text-xs font-medium px-2 py-1 rounded-md"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}