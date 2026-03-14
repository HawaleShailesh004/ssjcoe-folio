import Link from "next/link";

const LINKS = [
  { label: "Placements", href: "/placements" },
  { label: "Research", href: "/research" },
  { label: "Patents", href: "/patents" },
  { label: "Events", href: "/events" },
  { label: "Achievements", href: "/achievements" },
  { label: "Faculty", href: "/faculty" },
  { label: "Departments", href: "/departments" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-7 bg-white mt-32">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-4"
            >
              <span className="w-5 h-5 rounded-sm bg-ink flex items-center justify-center">
                <span className="font-mono text-white text-[9px] font-semibold">
                  JF
                </span>
              </span>
              <span className="font-display text-base text-ink">
                Jondhale Folio
              </span>
            </Link>
            <p className="text-sm text-ink-4 leading-relaxed max-w-xs">
              A record of excellence. A proof of potential.
            </p>
            <p className="text-xs text-ink-5 mt-4">
              Not the official SSJCOE website.
            </p>
          </div>

          <div>
            <p className="label mb-4">Explore</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-ink-4 hover:text-ink transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="label mb-4">Contact</p>
            <div className="space-y-2 text-sm text-ink-4">
              <p>SSJCOE, Dombivli</p>
              <p>Maharashtra, India</p>
              <a
                href="mailto:placement@ssjcoe.edu.in"
                className="block text-ink-2 hover:text-ink transition-colors mt-3"
              >
                placement@ssjcoe.edu.in
              </a>
            </div>
          </div>
        </div>

        <div className="divider mt-10 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-5">
          <span>© {new Date().getFullYear()} Jondhale Folio · SSJCOE</span>
          <span>Data verified by college · Not the official website</span>
        </div>
      </div>
    </footer>
  );
}
