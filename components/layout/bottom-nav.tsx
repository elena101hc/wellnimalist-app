"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutGrid, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/today", label: "Hoy", icon: Calendar, match: (p: string) => p === "/today" },
  {
    href: "/week/1",
    label: "Semanas",
    icon: LayoutGrid,
    match: (p: string) => p.startsWith("/week") || p.startsWith("/day"),
  },
  {
    href: "/dashboard",
    label: "Progreso",
    icon: Sparkles,
    match: (p: string) => p.startsWith("/dashboard"),
  },
] as const;

export function BottomNav() {
  const pathname = usePathname() ?? "";
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70"
      aria-label="Principal"
    >
      <div className="mx-auto flex max-w-[560px] items-stretch justify-around px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {links.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-[4.5rem] flex-col items-center gap-1 rounded-2xl px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "text-ink" : "text-ink-soft hover:text-ink",
              )}
            >
              <Icon
                className={cn(
                  "size-5 transition-transform",
                  active ? "text-gold" : "text-ink-soft",
                )}
                aria-hidden
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
