"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, CalendarDays, Dumbbell, History, Settings } from "lucide-react";
import clsx from "clsx";

const navItems: Array<{ href: Route; label: string; icon: typeof Dumbbell }> = [
  { href: "/today", label: "Today", icon: Dumbbell },
  { href: "/plan", label: "Plan", icon: CalendarDays },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/history", label: "History", icon: History },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-paper/95 px-2 pb-2 pt-2 backdrop-blur">
        <div className="mx-auto grid max-w-5xl grid-cols-6 gap-1 safe-bottom">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-1 text-[0.68rem] font-semibold transition",
                  active ? "bg-teal text-white shadow-soft" : "text-ink/65 hover:bg-ink/5"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
