import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

const LINKS = [
  { label: "Placements",   href: "/placements"   },
  { label: "Research",     href: "/research"     },
  { label: "Patents",      href: "/patents"      },
  { label: "Events",       href: "/events"       },
  { label: "Achievements", href: "/achievements" },
  { label: "Faculty",      href: "/faculty"      },
  { label: "Departments",  href: "/departments"  },
  { label: "About",        href: "/about"        },
  { label: "Contact",      href: "/contact"      },
];

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400 mt-32">
      <div className="container">
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-5">
              <Logo size="footer" link />
            </div>
            <p className="text-sm leading-relaxed text-stone-500 max-w-xs">
              A verified record of excellence.
            </p>
            <p className="text-xs text-stone-600 mt-4">
              Shivajirao S. Jondhale College of Engineering
              <br />
              Dombivli (E), Thane — 421204
            </p>
            <p className="text-xs text-stone-700 mt-3">
              Not the official college website.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="label text-stone-600 mb-5">Explore</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm text-stone-500 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="label text-stone-600 mb-5">Contact</p>
            <div className="space-y-2.5 text-sm text-stone-500">
              <p>Behind Venkatesh Petrol Pump</p>
              <p>Sonarpada, Dombivli (E)</p>
              <p>Dist. Thane, Maharashtra — 421204</p>
              <div className="pt-2 space-y-1.5">
                <a
                  href="tel:02512872560"
                  className="block hover:text-stone-300 transition-colors"
                >
                  0251-2872560
                </a>
                <a
                  href="mailto:placement@ssjcoe.edu.in"
                  className="block text-saffron-muted hover:text-saffron transition-colors"
                >
                  placement@ssjcoe.edu.in
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} SSJCOE Folio
          </p>
          <p className="text-xs text-stone-700">
            Data verified by college · Not the official website
          </p>
        </div>
      </div>
    </footer>
  );
}
