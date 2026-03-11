import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="section-pad bg-brand-black">
      <div className="container-main">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Looking to hire from{" "}
            <span className="text-brand-saffron">SSJCOE?</span>
          </h2>
          <p className="text-white/50 mb-8 leading-relaxed">
            Connect with our placement cell. Browse 800+ verified placement
            records and reach out directly to the team.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/placements">
              <Button
                size="lg"
                className="bg-brand-saffron hover:bg-brand-saffron/90 text-white gap-2 h-12"
              >
                Browse Placements <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent h-12 gap-2"
              >
                <Mail className="w-4 h-4" /> Contact Placement Cell
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
