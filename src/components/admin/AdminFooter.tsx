'use client'

import Link from 'next/link'

export default function AdminFooter() {
  return (
    <footer className="shrink-0 border-t border-stone-200 bg-white px-6 py-3" role="contentinfo">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
        <span>
          SSJCOE Folio Admin · Dombivli
        </span>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="hover:text-stone-700 transition-colors">
            Public site
          </Link>
          <span>·</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}
