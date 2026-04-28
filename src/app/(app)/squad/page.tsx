export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthProfile } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import SquadTable from '@/components/squad/SquadTable'

export default async function SquadPage() {
  const profile = await getAuthProfile()
  if (!profile?.clubId) redirect('/onboarding/club-selection')

  const players = await prisma.player.findMany({
    where: { clubId: profile.clubId },
    orderBy: [{ jerseyNumber: 'asc' }, { fullName: 'asc' }],
    select: {
      id: true,
      fullName: true,
      jerseyNumber: true,
      primaryPosition: true,
      altPosition: true,
      status: true,
      dateOfBirth: true,
      photoUrl: true,
    },
  })

  const available = players.filter((p) => p.status === 'available').length
  const injured = players.filter((p) => p.status === 'injured').length
  const suspended = players.filter((p) => p.status === 'suspended').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Plantel</h1>
          <p className="text-slate-400 text-sm mt-1">Gestión de jugadores del equipo</p>
        </div>
        <Link
          href="/squad/new"
          className="bg-[#00D68F] hover:bg-[#00B876] text-[#0F1923] font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
        >
          + Agregar jugador
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1E2D4A] rounded-xl p-4 border border-[#2A3A5C]">
          <div className="text-2xl font-bold text-white">{players.length}</div>
          <div className="text-sm text-slate-400 mt-1">Total jugadores</div>
        </div>
        <div className="bg-[#1E2D4A] rounded-xl p-4 border border-[#2A3A5C]">
          <div className="text-2xl font-bold text-green-400">{available}</div>
          <div className="text-sm text-slate-400 mt-1">Disponibles</div>
        </div>
        <div className="bg-[#1E2D4A] rounded-xl p-4 border border-[#2A3A5C]">
          <div className="text-2xl font-bold text-red-400">{injured + suspended}</div>
          <div className="text-sm text-slate-400 mt-1">Lesionados / Suspendidos</div>
        </div>
      </div>

      {/* Table */}
      <SquadTable players={players.map((p) => ({
        ...p,
        dateOfBirth: p.dateOfBirth ? p.dateOfBirth.toISOString() : null,
      }))} />
    </div>
  )
}
