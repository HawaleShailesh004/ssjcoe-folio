import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const QUICK_LINKS = [
  { label: "Placements", href: "/placements" },
  { label: "Research", href: "/research" },
  { label: "Patents", href: "/patents" },
  { label: "Events", href: "/events" },
  { label: "Sports", href: "/sports" },
  { label: "Faculty", href: "/faculty" },
];

export function Footer() {
  return (
    <footer className="bg-brand-black text-white mt-24">
      <div className="container-main section-pad">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-saffron/20 flex items-center justify-center">
                <span className="text-brand-saffron font-mono font-bold text-sm">
                  JF
                </span>
              </div>
              <span className="font-display font-bold text-white text-lg">
                Jondhale <span className="text-brand-saffron">Folio</span>
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              A record of excellence. A proof of potential.
            </p>
            <p className="text-xs text-white/30">
              A credibility showcase platform for SSJCOE. Not the official
              college website.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <div className="flex flex-col gap-2.5">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5 text-sm text-white/50">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-saffron/70" />
                <span>SSJCOE, Dombivli, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Mail className="w-4 h-4 flex-shrink-0 text-brand-saffron/70" />
                <span>placement@ssjcoe.edu.in</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/50">
                <Phone className="w-4 h-4 flex-shrink-0 text-brand-saffron/70" />
                <span>+91 XXXXX XXXXX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Jondhale Folio · SSJCOE
          </p>
          <p className="text-xs text-white/30">
            Data verified by SSJCOE · Not the official website
          </p>
        </div>
      </div>
    </footer>
  );
}
