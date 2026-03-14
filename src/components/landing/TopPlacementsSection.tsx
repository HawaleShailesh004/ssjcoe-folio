import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Placement } from "@/types";

export function TopPlacementsSection({
  placements,
}: {
  placements: Placement[];
}) {
  if (!placements.length) return null;

  return (
    <section className="section bg-ink-9">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="accent-line" />
            <h2 className="text-3xl">Recent highlights</h2>
          </div>
          <Link
            href="/placements"
            className="hidden sm:flex items-center gap-1.5 text-sm text-ink-2 hover:text-ink transition-colors"
          >
            All placements <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Company</th>
                <th>Role</th>
                <th className="text-right">Package</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium text-ink">{p.student_name}</td>
                  <td className="text-ink-2 font-medium">{p.company}</td>
                  <td className="text-ink-4">{p.role}</td>
                  <td className="text-right font-mono font-semibold text-ink">
                    ₹{p.package_lpa} LPA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
