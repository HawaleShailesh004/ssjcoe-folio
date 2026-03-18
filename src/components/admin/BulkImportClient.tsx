'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Upload, FileText, CheckCircle, AlertCircle, X, Download } from 'lucide-react'

interface Props { profile: any }

interface ParsedRow {
  student_name: string
  company: string
  role: string
  package_lpa: number
  year: number
  batch_year?: number
  location?: string
  linkedin_url?: string
  is_internship: boolean
  _valid: boolean
  _errors: string[]
}

const REQUIRED_COLS = ['student_name', 'company', 'role', 'package_lpa', 'year']

const TEMPLATE_CSV = `student_name,company,role,package_lpa,year,batch_year,location,linkedin_url,is_internship
Rahul Sharma,TCS,Software Engineer,4.5,2024,2024,Pune,,false
Priya Desai,Infosys,System Engineer,3.8,2024,2024,Mumbai,,false
Amit Patil,Wipro,Developer,4.2,2024,2024,Bengaluru,,false`

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'))
  const rows: ParsedRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const obj: Record<string, string> = {}
    headers.forEach((h, idx) => { obj[h] = values[idx] ?? '' })

    const errors: string[] = []
    if (!obj.student_name) errors.push('student_name required')
    if (!obj.company) errors.push('company required')
    if (!obj.role) errors.push('role required')
    if (!obj.package_lpa || isNaN(Number(obj.package_lpa))) errors.push('package_lpa must be a number')
    if (!obj.year || isNaN(Number(obj.year))) errors.push('year must be a number')

    rows.push({
      student_name: obj.student_name,
      company: obj.company,
      role: obj.role,
      package_lpa: Number(obj.package_lpa),
      year: Number(obj.year),
      batch_year: obj.batch_year ? Number(obj.batch_year) : undefined,
      location: obj.location || undefined,
      linkedin_url: obj.linkedin_url || undefined,
      is_internship: obj.is_internship?.toLowerCase() === 'true',
      _valid: errors.length === 0,
      _errors: errors,
    })
  }
  return rows
}

export default function BulkImportClient({ profile }: Props) {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [rows, setRows] = useState<ParsedRow[]>([])
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null)
  const [dragOver, setDragOver] = useState(false)

  function handleFile(file: File) {
    setResult(null)
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target?.result as string
      setRows(parseCSV(text))
      setFileName(file.name)
    }
    reader.readAsText(file)
  }

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'placements_template.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  async function importRows() {
    const valid = rows.filter(r => r._valid)
    if (valid.length === 0) return

    setImporting(true)
    const payload = valid.map(r => ({
      student_name: r.student_name, company: r.company, role: r.role,
      package_lpa: r.package_lpa, year: r.year,
      batch_year: r.batch_year ?? null, location: r.location ?? null,
      linkedin_url: r.linkedin_url ?? null, is_internship: r.is_internship,
      dept_id: profile.dept_id, submitted_by: profile.id, status: 'draft',
    }))

    const { error } = await supabase.from('placements').insert(payload)
    setImporting(false)

    if (error) {
      setResult({ success: 0, failed: valid.length })
    } else {
      setResult({ success: valid.length, failed: rows.filter(r => !r._valid).length })
      setRows([]); setFileName('')
      router.refresh()
    }
  }

  const validCount = rows.filter(r => r._valid).length
  const invalidCount = rows.filter(r => !r._valid).length

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Bulk Import</h1>
          <p className="text-stone-500 text-sm">Import placements from CSV — {profile.departments?.name}</p>
        </div>
        <button type="button" onClick={downloadTemplate} className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800 border border-stone-200 hover:border-stone-300 px-4 py-2 rounded-lg transition-colors">
          <Download className="w-4 h-4" /> Download Template
        </button>
      </div>

      {result && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm ${result.failed === 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{result.success} rows imported as draft. {result.failed > 0 ? `${result.failed} rows skipped due to errors.` : ''}</span>
          <button type="button" onClick={() => setResult(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {rows.length === 0 && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileRef.current?.click() } }}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${dragOver ? 'border-[#E8820C] bg-[#E8820C]/5' : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'}`}
        >
          <Upload className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-600 font-medium text-sm">Drop your CSV file here</p>
          <p className="text-stone-400 text-xs mt-1">or click to browse · CSV files only</p>
          <p className="text-stone-400 text-xs mt-3">
            Required columns: <span className="font-mono">{REQUIRED_COLS.join(', ')}</span>
          </p>
        </div>
      )}

      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />

      {rows.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-stone-600">
                <FileText className="w-4 h-4 text-stone-400" /> {fileName}
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{validCount} valid</span>
              {invalidCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{invalidCount} errors</span>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setRows([]); setFileName('') }} className="text-sm text-stone-500 hover:text-stone-700 px-3 py-1.5 rounded-lg hover:bg-stone-100">Clear</button>
              <button type="button" onClick={importRows} disabled={importing || validCount === 0}
                className="flex items-center gap-2 bg-[#E8820C] hover:bg-[#d4750b] text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50 transition-colors">
                {importing ? 'Importing…' : `Import ${validCount} rows`}
              </button>
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 text-stone-400 text-xs uppercase tracking-wide border-b border-stone-100">
                  <th className="text-left px-4 py-3 font-medium w-6">#</th>
                  <th className="text-left px-4 py-3 font-medium">Student</th>
                  <th className="text-left px-4 py-3 font-medium">Company</th>
                  <th className="text-left px-4 py-3 font-medium">Role</th>
                  <th className="text-left px-4 py-3 font-medium">Package</th>
                  <th className="text-left px-4 py-3 font-medium">Year</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Valid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {rows.map((row, idx) => (
                  <tr key={idx} className={`transition-colors ${row._valid ? 'hover:bg-stone-50' : 'bg-red-50/50'}`}>
                    <td className="px-4 py-3 text-stone-400 text-xs tabular-nums">{idx + 1}</td>
                    <td className="px-4 py-3 text-stone-700">{row.student_name || <span className="text-red-400 text-xs">missing</span>}</td>
                    <td className="px-4 py-3 text-stone-600">{row.company || <span className="text-red-400 text-xs">missing</span>}</td>
                    <td className="px-4 py-3 text-stone-600 max-w-[120px]"><div className="truncate">{row.role || <span className="text-red-400 text-xs">missing</span>}</div></td>
                    <td className="px-4 py-3 text-stone-600 tabular-nums">{row.package_lpa ? `₹${row.package_lpa}` : <span className="text-red-400 text-xs">invalid</span>}</td>
                    <td className="px-4 py-3 text-stone-500 tabular-nums">{row.year || <span className="text-red-400 text-xs">invalid</span>}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${row.is_internship ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-700'}`}>{row.is_internship ? 'Intern' : 'Full-time'}</span></td>
                    <td className="px-4 py-3">
                      {row._valid
                        ? <CheckCircle className="w-4 h-4 text-green-500" />
                        : <div className="flex flex-col gap-0.5">{row._errors.map((e, i) => <span key={i} className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3 shrink-0" />{e}</span>)}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
