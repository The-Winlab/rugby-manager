'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Shield, Search, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Club } from '@prisma/client'

interface Props {
  clubs: Club[]
  userId: string
}

export default function ClubSelector({ clubs, userId }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Club | null>(null)
  const [loading, setLoading] = useState(false)

  const filtered = clubs.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.shortName?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  async function handleConfirm() {
    if (!selected) return
    setLoading(true)

    const res = await fetch('/api/onboarding/select-club', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clubId: selected.id }),
    })

    if (!res.ok) {
      toast.error('Error al guardar el club. Intentá de nuevo.')
      setLoading(false)
      return
    }

    toast.success(`¡Bienvenido a ${selected.name}!`)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen px-4 py-10">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#00D68F] flex items-center justify-center">
            <Shield className="w-7 h-7 text-[#0F1923]" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Seleccioná tu club</h1>
        <p className="text-[#8A9BB5]">
          Elegí el club que vas a gestionar. Esta selección queda asociada a tu cuenta.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6A85]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar club..."
            className="pl-10 bg-[#1E2D4A] border-[#2A3A5C] text-white placeholder:text-[#5A6A85] focus:border-[#00D68F]"
          />
        </div>

        {/* Club grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
          {filtered.map((club) => {
            const isSelected = selected?.id === club.id
            return (
              <button
                key={club.id}
                onClick={() => setSelected(club)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-150
                  ${isSelected
                    ? 'border-[#00D68F] bg-[#00D68F]/10'
                    : 'border-[#2A3A5C] bg-[#1E2D4A] hover:border-[#3A4A6C] hover:bg-[#243558]'
                  }`}
              >
                {isSelected && (
                  <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[#00D68F]" />
                )}

                {/* Club shield placeholder / logo */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-lg font-bold"
                  style={{
                    backgroundColor: club.primaryColor ?? '#2A3A5C',
                    color: club.secondaryColor ?? '#FFFFFF',
                  }}
                >
                  {club.shortName?.slice(0, 2).toUpperCase() ?? club.name.slice(0, 2).toUpperCase()}
                </div>

                <p className="text-sm font-semibold text-white leading-tight">{club.name}</p>
                {club.shortName && club.shortName !== club.name && (
                  <p className="text-xs text-[#5A6A85] mt-0.5">{club.shortName}</p>
                )}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[#5A6A85] py-8">
            No se encontraron clubes con ese nombre.
          </p>
        )}

        {/* Confirm button */}
        {selected && (
          <div className="sticky bottom-6 flex justify-center">
            <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-2xl px-6 py-4 flex items-center gap-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: selected.primaryColor ?? '#2A3A5C',
                    color: selected.secondaryColor ?? '#FFFFFF',
                  }}
                >
                  {selected.shortName?.slice(0, 2).toUpperCase() ?? selected.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{selected.name}</p>
                  <p className="text-[#8A9BB5] text-xs">Club seleccionado</p>
                </div>
              </div>
              <Button
                onClick={handleConfirm}
                disabled={loading}
                className="bg-[#00D68F] hover:bg-[#00B87A] text-[#0F1923] font-bold px-6"
              >
                {loading ? 'Guardando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
