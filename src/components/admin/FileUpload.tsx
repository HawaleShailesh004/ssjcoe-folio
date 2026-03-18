'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, ExternalLink } from 'lucide-react'

interface Props {
  label: string
  accept: string // e.g. 'image/*' or '.pdf' or 'image/*,.pdf'
  currentUrl?: string | null
  onUpload: (file: File) => Promise<void>
  onRemove?: () => void
  uploading?: boolean
  hint?: string
}

export default function FileUpload({ label, accept, currentUrl, onUpload, onRemove, uploading, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const isImage = currentUrl && /\.(jpg|jpeg|png|webp|gif)$/i.test(currentUrl)
  const isPdf = currentUrl && /\.pdf$/i.test(currentUrl)

  async function handleFile(file: File) {
    if (!file) return
    await onUpload(file)
  }

  return (
    <div>
      <label className="block text-xs text-stone-500 uppercase tracking-wide mb-1">{label}</label>

      {/* Current file preview */}
      {currentUrl && (
        <div className="mb-2 flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
          {isImage && <img src={currentUrl} alt="" className="w-10 h-10 rounded object-cover shrink-0" />}
          {isPdf && <FileText className="w-5 h-5 text-red-500 shrink-0" />}
          {!isImage && !isPdf && <FileText className="w-5 h-5 text-stone-400 shrink-0" />}
          <a href={currentUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#E8820C] hover:underline flex items-center gap-1 flex-1 truncate">
            View current file <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
          {onRemove && (
            <button type="button" onClick={onRemove} className="text-stone-400 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        className={`border-2 border-dashed rounded-lg px-4 py-3 text-center cursor-pointer transition-colors ${
          dragOver ? 'border-[#E8820C] bg-[#E8820C]/5' : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
        }`}
      >
        {uploading ? (
          <p className="text-xs text-stone-500">Uploading…</p>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Upload className="w-4 h-4 text-stone-400" />
            <p className="text-xs text-stone-500">
              {currentUrl ? 'Replace file' : 'Click or drag to upload'}
            </p>
          </div>
        )}
        {hint && <p className="text-xs text-stone-400 mt-0.5">{hint}</p>}
      </div>

      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
    </div>
  )
}
