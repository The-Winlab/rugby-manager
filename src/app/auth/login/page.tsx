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
