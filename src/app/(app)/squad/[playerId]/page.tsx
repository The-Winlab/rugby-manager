export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getPositionLabel, getStatusConfig } from '@/lib/rugby-constants'

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ playerId: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await prisma.userProfile.findUnique({ where: { id: user.id } })
  if (!profile?.clubId) redirect('/onboarding/club-selection')

  const { playerId } = await params

  const player = await prisma.player.findFirst({
    where: { id: playerId, clubId: profile.clubId },
    include: {
      ratings: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          match: {
            select: {
              matchDate: true,
              competition: true,
              opponentName: true,
              homeScore: true,
              awayScore: true,
              isHome: true,
            },
          },
        },
      },
    },
  })

  if (!player) notFound()

  const avgRating =
    player.ratings.length > 0
      ? (player.ratings.reduce((sum, r) => sum + r.rating, 0) / player.ratings.length).toFixed(1)
      : null

  const totalMinutes = player.ratings.reduce((sum, r) => sum + (r.minutesPlayed ?? 0), 0)
  const motmCount = player.ratings.filter((r) => r.isManOfMatch).length
  const statusCfg = getStatusConfig(player.status)

  function calcAge(dob: Date | null) {
    if (!dob) return null
    const today = new Date()
    const age = today.getFullYear() - dob.getFullYear()
    const m = today.getMonth() - dob.getMonth()
    return m < 0 || (m === 0 && today.getDate() < dob.getDate()) ? age - 1 : age
  }

  const age = calcAge(player.dateOfBirth)

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Back */}
      <Link href="/squad" className="text-sm text-slate-400 hover:text-white transition-colors">
        ← Volver al plantel
      </Link>

      {/* Header */}
      <div className="bg-[#1E2D4A] rounded-xl border border-[#2A3A5C] p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            {/* Jersey number / avatar */}
            <div className="w-16 h-16 rounded-full bg-[#0F1923] border-2 border-[#00D68F] flex items-center justify-center">
              {player.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={player.photoUrl}
                  alt={player.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-[#00D68F]">
                  {player.jerseyNumber ?? player.fullName[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{player.fullName}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-slate-400 text-sm">
                  {player.primaryPosition ? getPositionLabel(player.primaryPosition) : 'Sin posición'}
                </span>
                <span className={`text-xs font-medium ${statusCfg.color}`}>
                  ● {statusCfg.label}
                </span>
              </div>
              {age !== null && (
                <p className="text-slate-500 text-xs mt-1">{age} años</p>
              )}
            </div>
          </div>
          <Link
            href={`/squad/${player.id}/edit`}
            className="text-sm text-slate-400 hover:text-[#00D68F] px-3 py-1.5 rounded-lg border border-[#2A3A5C] hover:border-[#00D68F] transition-colors"
          >
            Editar
          </Link>
        </div>

        {player.status !== 'available' && player.availableFrom && (
          <div className="mt-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-4 py-2 text-yellow-300 text-xs">
            Disponible desde: {new Date(player.availableFrom).toLocaleDateString('es-AR')}
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#1E2D4A] rounded-xl border border-[#2A3A5C] p-4">
          <div className="text-2xl font-bold text-white">{player.ratings.length}</div>
          <div className="text-xs text-slate-400 mt-1">Partidos</div>
        </div>
        <div className="bg-[#1E2D4A] rounded-xl border border-[#2A3A5C] p-4">
          <div className={`text-2xl font-bold ${avgRating ? 'text-[#FFB800]' : 'text-slate-500'}`}>
            {avgRating ?? '—'}
          </div>
          <div className="text-xs text-slate-400 mt-1">Rating promedio</div>
        </div>
        <div className="bg-[#1E2D4A] rounded-xl border border-[#2A3A5C] p-4">
          <div className="text-2xl font-bold text-white">{totalMinutes}</div>
          <div className="text-xs text-slate-400 mt-1">Minutos</div>
        </div>
        <div className="bg-[#1E2D4A] rounded-xl border border-[#2A3A5C] p-4">
          <div className="text-2xl font-bold text-[#00D68F]">{motmCount}</div>
          <div className="text-xs text-slate-400 mt-1">Man of the Match</div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-[#1E2D4A] rounded-xl border border-[#2A3A5C] p-5">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Datos del jugador</h3>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <dt className="text-xs text-slate-500">Posición principal</dt>
            <dd className="text-sm text-white mt-0.5">
              {player.primaryPosition ? getPositionLabel(player.primaryPosition) : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Posición alternativa</dt>
            <dd className="text-sm text-white mt-0.5">
              {player.altPosition ? getPositionLabel(player.altPosition) : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Número de camiseta</dt>
            <dd className="text-sm text-white mt-0.5">{player.jerseyNumber ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Fecha de nacimiento</dt>
            <dd className="text-sm text-white mt-0.5">
              {player.dateOfBirth
                ? new Date(player.dateOfBirth).toLocaleDateString('es-AR')
                : '—'}
            </dd>
          </div>
        </dl>
        {player.notes && (
          <div className="mt-4 pt-4 border-t border-[#2A3A5C]">
            <dt className="text-xs text-slate-500 mb-1">Notas del coach</dt>
            <dd className="text-sm text-slate-300 leading-relaxed">{player.notes}</dd>
          </div>
        )}
      </div>

      {/* Recent ratings */}
      {player.ratings.length > 0 && (
        <div className="bg-[#1E2D4A] rounded-xl border border-[#2A3A5C] p-5">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
            Historial de ratings
          </h3>
          <div className="space-y-2">
            {player.ratings.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-[#2A3A5C]/50 last:border-0">
                <div>
                  <div className="text-sm text-white">
                    {r.match.opponentName ?? 'Rival'} — {r.match.competition ?? 'Partido'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(r.match.matchDate).toLocaleDateString('es-AR')}
                    {r.minutesPlayed != null && ` · ${r.minutesPlayed} min`}
                    {r.isManOfMatch && ' · ⭐ MoM'}
                  </div>
                </div>
                <div className={`text-lg font-bold ${
                  r.rating >= 8 ? 'text-green-400' :
                  r.rating >= 6 ? 'text-[#FFB800]' :
                  'text-red-400'
                }`}>
                  {r.rating.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
