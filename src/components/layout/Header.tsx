"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Placements", href: "/placements" },
  { label: "Research", href: "/research" },
  { label: "Patents", href: "/patents" },
  { label: "Events", href: "/events" },
  { label: "Achievements", href: "/achievements" },
  { label: "Faculty", href: "/faculty" },
  { label: "Departments", href: "/departments" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAdmin =
    pathname.startsWith("/admin") || pathname.startsWith("/superadmin");

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-7 h-7 bg-saffron flex items-center justify-center rounded-sm flex-shrink-0">
              <span className="font-mono text-white text-[10px] font-bold leading-none">
                SS
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg text-stone-950 leading-none">
                Jondhale Folio
              </p>
              <p className="text-[10px] text-stone-500 tracking-wider uppercase mt-0.5">
                SSJCOE · Dombivli
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link ${pathname.startsWith(l.href) ? "active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="hidden sm:block text-xs text-stone-500 hover:text-stone-950 transition-colors"
            >
              Admin →
            </Link>
            <button
              type="button"
              className="lg:hidden p-1.5 text-stone-500 hover:text-stone-950 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="lg:hidden border-t border-stone-100 bg-white">
          <div className="container py-4 flex flex-col gap-0.5">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-sm font-medium transition-colors border-b border-stone-100 last:border-0 ${
                  pathname.startsWith(l.href)
                    ? "text-stone-950"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="text-sm text-saffron hover:text-saffron-dark transition-colors"
              >
                Admin login →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
