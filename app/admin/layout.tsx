"use client";

import Link from "next/link";
import { Home, Users, FolderKanban, ShieldCheck, AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Status", href: "/admin/status", icon: ShieldCheck },
  { name: "Incidents", href: "/admin/incidents", icon: ShieldCheck }
];

  return (
    <div className="flex min-h-screen bg-neutral-100 overflow-hidden">

      {/* Sidebar */}
      <aside className="
        fixed left-4 top-4 bottom-4 w-64
        rounded-3xl border border-white/50
        bg-white/40 backdrop-blur-3xl backdrop-saturate-200
        shadow-[0_16px_50px_rgba(0,0,0,0.15)]
        flex flex-col p-6
      ">
        {/* Glass shine */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none ring-1 ring-white/50" />

        <h2 className="relative text-xl font-semibold tracking-tight text-neutral-900 mb-10">
          Noble<span className="text-blue-600"> Admin</span>
        </h2>

        <nav className="relative space-y-1">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.href;

            return (
              <Link
                key={l.href}
                href={l.href}
                className={`
                  group flex items-center gap-3 text-[15px] font-medium px-3 py-2 rounded-xl transition-all 
                  ${active 
                    ? "bg-white/90 text-blue-600 shadow-[0_6px_20px_rgba(0,0,0,0.12)] translate-x-[2px]" 
                    : "text-neutral-800 hover:text-blue-600 hover:bg-white/70 hover:translate-x-[2px]"} 
                `}
              >
                <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-neutral-700 group-hover:text-blue-600"}`} />
                {l.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto text-xs text-neutral-500 select-none">
          © {new Date().getFullYear()} Noble Sherman
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto ml-[18rem] p-10">
        {children}
      </main>

    </div>
  );
}