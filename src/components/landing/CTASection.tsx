import Link from "next/link";

export function CTASection() {
  return (
    <section className="section bg-white border-t border-ink-7">
      <div className="container">
        <div className="max-w-xl">
          <span className="accent-line" />
          <h2 className="text-3xl mb-4">Looking to hire from SSJCOE?</h2>
          <p className="text-base text-ink-4 mb-8 leading-relaxed">
            Connect with our placement cell. Browse verified placement records
            and reach the team directly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/placements"
              className="inline-flex items-center h-10 px-5 bg-ink text-white text-sm font-medium rounded hover:bg-ink-2 transition-colors"
            >
              Browse placements
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center h-10 px-5 border border-ink-7 text-ink-3 hover:border-ink-6 text-sm font-medium rounded hover:border-ink-6 transition-colors"
            >
              Contact placement cell
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
