'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Shield } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        toast.error(error.message)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      toast.error('Error al iniciar sesión. Intentá de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) toast.error(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00D68F]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFB800]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#00D68F] flex items-center justify-center">
              <Shield className="w-7 h-7 text-[#0F1923]" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Rugby Manager</h1>
          <p className="text-[#8A9BB5] text-sm mt-1">URBA Edition</p>
        </div>

        {/* Card */}
        <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Iniciar sesión</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#8A9BB5] text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@miclub.com"
                required
                className="bg-[#243558] border-[#2A3A5C] text-white placeholder:text-[#5A6A85] focus:border-[#00D68F] focus:ring-[#00D68F]/20"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#8A9BB5] text-sm">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-[#243558] border-[#2A3A5C] text-white placeholder:text-[#5A6A85] focus:border-[#00D68F] focus:ring-[#00D68F]/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00D68F] hover:bg-[#00B87A] text-[#0F1923] font-semibold"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#2A3A5C]" />
            <span className="text-[#5A6A85] text-xs">o</span>
            <div className="flex-1 h-px bg-[#2A3A5C]" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full border-[#2A3A5C] bg-transparent text-white hover:bg-[#243558] hover:border-[#3A4A6C]"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </Button>

          <p className="text-center text-sm text-[#5A6A85] mt-6">
            ¿No tenés cuenta?{' '}
            <Link href="/auth/register" className="text-[#00D68F] hover:text-[#00B87A] font-medium">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
