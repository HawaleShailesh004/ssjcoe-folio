"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const NAV = [
  {
    label: "Academics",
    items: [
      { label: "Research", href: "/research", desc: "Published papers & journals" },
      { label: "Patents", href: "/patents", desc: "Intellectual property" },
      { label: "Faculty", href: "/faculty", desc: "Our teaching staff" },
      { label: "Departments", href: "/departments", desc: "All 7 engineering departments" },
    ],
  },
  {
    label: "Campus",
    items: [
      { label: "Events", href: "/events", desc: "Festivals, workshops & more" },
      { label: "Achievements", href: "/achievements", desc: "What our students win" },
    ],
  },
  { label: "Placements", href: "/placements" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);

  const isAdmin =
    pathname.startsWith("/admin") || pathname.startsWith("/superadmin");
  if (isAdmin) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setDropdown(null);
  }, [pathname]);

  const isActive = (href?: string, items?: { href: string }[]) => {
    if (href) return pathname === href;
    if (items) return items.some((i) => pathname.startsWith(i.href));
    return false;
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(12,10,9,0.96)"
          : "rgba(12,10,9,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid transparent",
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-14">
          <Logo size="header" />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) =>
              item.items ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdown(item.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(undefined, item.items)
                        ? "text-white"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        dropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdown === item.label && (
                    <div
                      className="absolute top-full left-0 pt-2 w-56"
                      style={{ zIndex: 60 }}
                    >
                      <div
                        className="rounded-xl overflow-hidden"
                        style={{
                          background: "#1C1917",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
                        }}
                      >
                        {item.items.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`flex flex-col px-4 py-3 hover:bg-stone-800/60 transition-colors ${
                              pathname === sub.href ? "bg-stone-800/40" : ""
                            }`}
                          >
                            <span
                              className={`text-sm font-medium ${
                                pathname === sub.href
                                  ? "text-saffron"
                                  : "text-stone-200"
                              }`}
                            >
                              {sub.label}
                            </span>
                            <span className="caption mt-0.5">{sub.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-white bg-white/5"
                      : "text-stone-400 hover:text-stone-200"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{
            background: "#1C1917",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="container py-4 flex flex-col gap-1">
            {NAV.map((item) =>
              item.items ? (
                <div key={item.label}>
                  <p className="label px-3 py-2 text-stone-600">{item.label}</p>
                  {item.items.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        pathname === sub.href
                          ? "text-saffron bg-saffron-light/10"
                          : "text-stone-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    pathname === item.href
                      ? "text-saffron bg-saffron-light/10"
                      : "text-stone-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
