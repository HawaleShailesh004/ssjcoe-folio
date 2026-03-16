import Link from "next/link";

/** Official SSJCOE Folio logo — S letterform mark + wordmark. Use in Header and Footer. */
const SIZES = {
  header: { mark: 44, wordmark: "26px", folio: "12px", gap: "12px" },
  footer: { mark: 40, wordmark: "21px", folio: "10px", gap: "10px" },
} as const;

type LogoSize = keyof typeof SIZES;

interface LogoProps {
  size?: LogoSize;
  /** If true, wrap in Link to /. Default true for header, false for footer when used inside other links. */
  link?: boolean;
  className?: string;
}

function LogoMark({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="8"
        stroke="#292524"
        strokeWidth="1.5"
        className="group-hover:stroke-stone-600 transition-colors"
      />
      <rect x="11" y="10" width="18" height="3.5" rx="1.5" fill="#E8820C" />
      <rect x="11" y="18.25" width="18" height="3.5" rx="1.5" fill="#E8820C" />
      <rect x="11" y="26.5" width="18" height="3.5" rx="1.5" fill="#E8820C" />
      <rect x="11" y="10" width="3.5" height="12" fill="#E8820C" />
      <rect x="25.5" y="18.25" width="3.5" height="12" fill="#E8820C" />
    </svg>
  );
}

export function Logo({ size = "header", link = true, className = "" }: LogoProps) {
  const s = SIZES[size];
  const content = (
    <span
      className={`flex items-center gap-3 shrink-0 group ${className}`}
      style={{ gap: s.gap }}
    >
      <LogoMark size={s.mark} />
      <span className="flex flex-col leading-none gap-0.5">
        <span
          className="font-display text-white group-hover:text-stone-100 transition-colors"
          style={{ fontSize: s.wordmark, letterSpacing: "-0.01em" }}
        >
          SS<span className="text-saffron">COE</span>
        </span>
        <span
          className="font-mono text-stone-600"
          style={{ fontSize: s.folio, letterSpacing: "0.18em" }}
        >
          FOLIO
        </span>
      </span>
    </span>
  );

  if (link) {
    return (
      <Link href="/" className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}
