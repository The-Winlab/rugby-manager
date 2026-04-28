'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import RugbyLogo from '@/components/ui/RugbyLogo'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Cuenta creada. Revisá tu email para confirmarla.')
      router.push('/auth/login')
    } catch (err) {
      toast.error('Error al crear la cuenta. Intentá de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#00D68F]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#FFB800]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-3">
            <RugbyLogo size={48} />
          </div>
          <h1 className="text-2xl font-bold text-white">Rugby Manager</h1>
          <p className="text-[#8A9BB5] text-sm mt-1">URBA Edition</p>
        </div>

        <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Crear cuenta</h2>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#8A9BB5] text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="coach@miclub.com"
                required
                className="bg-[#243558] border-[#2A3A5C] text-white placeholder:text-[#5A6A85] focus:border-[#00D68F]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#8A9BB5] text-sm">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                required
                className="bg-[#243558] border-[#2A3A5C] text-white placeholder:text-[#5A6A85] focus:border-[#00D68F]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00D68F] hover:bg-[#00B87A] text-[#0F1923] font-semibold"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="text-center text-sm text-[#5A6A85] mt-6">
            ¿Ya tenés cuenta?{' '}
            <Link href="/auth/login" className="text-[#00D68F] hover:text-[#00B87A] font-medium">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
