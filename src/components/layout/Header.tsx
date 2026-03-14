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
    <header className="sticky top-0 z-50 bg-white border-b border-ink-7">
      <div className="container">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-sm bg-ink flex items-center justify-center shrink-0">
              <span className="font-mono text-white text-[9px] font-semibold leading-none">
                JF
              </span>
            </span>
            <span className="font-display text-lg text-ink leading-none">
              Jondhale Folio
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="hidden sm:block text-sm text-ink-4 hover:text-ink transition-colors"
            >
              Admin →
            </Link>
            <button
              type="button"
              className="lg:hidden p-1 text-ink-4 hover:text-ink"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-ink-7 bg-white">
          <div className="container py-4 flex flex-col gap-1">
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-2.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-ink"
                    : "text-ink-4 hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-1 border-t border-ink-7">
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="text-sm text-ink-2 hover:text-ink"
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
