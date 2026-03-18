'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface Props {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function AdminDetailModal({ title, onClose, children }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative h-full bg-white overflow-y-auto w-full max-w-md shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 border-b border-stone-200 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </div>
  )
}

/** Renders a label + value row for use inside AdminDetailModal */
export function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-stone-800">{value ?? '—'}</p>
    </div>
  )
}

function isLikelyImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp)(\?|#|$)/i.test(url)
}

function isLikelyPdfUrl(url: string) {
  return /\.pdf(\?|#|$)/i.test(url)
}

export function MediaValue({ url }: { url?: string | null }) {
  if (!url) return null
  const trimmed = String(url).trim()
  if (!trimmed) return null

  if (isLikelyImageUrl(trimmed)) {
    return (
      <a
        href={trimmed}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-1"
        title="Open image"
      >
        <img
          src={trimmed}
          alt=""
          className="w-full max-w-[320px] rounded-lg border border-stone-200 object-cover"
        />
      </a>
    )
  }

  const label = isLikelyPdfUrl(trimmed) ? 'Open PDF' : 'Open file'
  return (
    <a
      href={trimmed}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-[#E8820C] hover:underline break-all"
    >
      {label}
    </a>
  )
}
