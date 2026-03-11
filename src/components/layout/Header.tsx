"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Placements", href: "/placements" },
  { label: "Research", href: "/research" },
  { label: "Patents", href: "/patents" },
  { label: "Events", href: "/events" },
  { label: "Sports", href: "/sports" },
  { label: "Faculty", href: "/faculty" },
  { label: "Departments", href: "/departments" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin =
    pathname.startsWith("/admin") || pathname.startsWith("/superadmin");

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-border">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-brand-black flex items-center justify-center">
              <span className="text-brand-saffron font-mono font-bold text-sm">
                JF
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-brand-black text-lg leading-none">
                Jondhale
              </span>
              <span className="font-display font-bold text-brand-saffron text-lg leading-none">
                {" "}
                Folio
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === link.href
                    ? "text-brand-black bg-brand-bg"
                    : "text-brand-muted hover:text-brand-black hover:bg-brand-bg"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link href="/admin/login">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex border-brand-border text-brand-slate hover:bg-brand-bg"
              >
                Admin Login
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-md text-brand-muted hover:text-brand-black"
              onClick={() => setMobileOpen(!mobileOpen)}
              type="button"
              aria-expanded={mobileOpen}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-brand-border bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  pathname === link.href
                    ? "text-brand-black bg-brand-bg"
                    : "text-brand-muted hover:text-brand-black"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-brand-border">
              <Link href="/admin/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Admin Login
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
