'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'

export default function AdminLoginPage() {
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError || !data.user) {
      setError('Invalid credentials. Please try again.')
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', data.user.id)
      .single()

    console.log(profile)

    if (profileError || !profile) {
      setError('Account not found. Contact administrator.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (!profile.is_active) {
      setError('Your account has been deactivated. Contact administrator.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (profile.role === 'superadmin') {
      router.push('/superadmin/dashboard')
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #E8820C 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative w-full max-w-sm">
        {/* Logo — same as header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center mb-4">
            <Logo size="header" link={false} />
          </div>
          <p className="font-mono text-stone-500 text-xs tracking-widest uppercase mb-2">
            Admin Portal
          </p>
          <h1 className="font-display text-stone-200 text-xl font-medium">
            Sign in to continue
          </h1>
        </div>

        {/* Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-950/50 border border-red-900 text-red-400 text-sm px-3 py-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@ssjcoe.in"
                  className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded-lg pl-9 pr-4 py-2.5 text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#E8820C] transition-colors"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 text-xs tracking-widest uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-stone-800 border border-stone-700 text-stone-200 rounded-lg pl-9 pr-10 py-2.5 text-sm placeholder:text-stone-600 focus:outline-none focus:border-[#E8820C] transition-colors"
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600 hover:text-stone-400 transition-colors"
                  suppressHydrationWarning
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8820C] hover:bg-[#d4750b] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
              suppressHydrationWarning
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-stone-900/80 border border-stone-800">
          <p className="text-stone-500 text-xs uppercase tracking-wider mb-3">Demo credentials</p>
          <div className="space-y-2 text-sm">
            <p className="text-stone-400">
              <span className="text-stone-500">HOD:</span>{' '}
              <span className="font-mono text-stone-300">hod.it@ssjcoe.in</span>
              <span className="text-stone-600 mx-1">/</span>
              <span className="font-mono text-stone-300">Hod@12345</span>
            </p>
            <p className="text-stone-400">
              <span className="text-stone-500">Principal:</span>{' '}
              <span className="font-mono text-stone-300">principal@ssjcoe.in</span>
              <span className="text-stone-600 mx-1">/</span>
              <span className="font-mono text-stone-300">Principal@12345</span>
            </p>
          </div>
        </div>

        <p className="text-center text-stone-600 text-xs mt-6">
          Access restricted to authorized personnel only
        </p>
      </div>
    </div>
  )
}
