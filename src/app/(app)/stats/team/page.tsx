export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getAuthProfile } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Trophy, TrendingUp, Target, Users } from 'lucide-react'

export default async function StatsPage() {
  const profile = await getAuthProfile()
  if (!profile?.club) redirect('/onboarding/club-selection')

  const club = profile.club

  const matches = await prisma.match.findMany({
    where: { userClubId: club.id, status: 'completed' },
    select: {
      isHome: true,
      homeScore: true,
      awayScore: true,
      season: true,
      events: {
        select: { eventType: true, playerId: true, team: true },
        where: { team: 'home' },
      },
    },
  })

  const totalGames = matches.length
  let wins = 0, draws = 0, losses = 0, pointsFor = 0, pointsAgainst = 0

  for (const m of matches) {
    const myScore = m.isHome ? m.homeScore : m.awayScore
    const oppScore = m.isHome ? m.awayScore : m.homeScore
    pointsFor += myScore
    pointsAgainst += oppScore
    if (myScore > oppScore) wins++
    else if (myScore === oppScore) draws++
    else losses++
  }

  const winPct = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0

  // Top scorers (tries only)
  const tryEvents = await prisma.matchEvent.findMany({
    where: {
      match: { userClubId: club.id, status: 'completed' },
      eventType: 'try',
      team: 'home',
      playerId: { not: null },
    },
    select: {
      player: { select: { fullName: true } },
    },
  })

  const tryCounts: Record<string, number> = {}
  for (const e of tryEvents) {
    if (e.player?.fullName) {
      tryCounts[e.player.fullName] = (tryCounts[e.player.fullName] ?? 0) + 1
    }
  }
  const topScorers = Object.entries(tryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const summaryCards = [
    { label: 'Partidos jugados', value: totalGames, icon: Trophy, color: '#3D8EF0' },
    { label: '% de victorias', value: `${winPct}%`, icon: TrendingUp, color: '#00D68F' },
    { label: 'Puntos a favor', value: pointsFor, icon: Target, color: '#FFB800' },
    { label: 'Puntos en contra', value: pointsAgainst, icon: Target, color: '#FF4757' },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Estadísticas</h1>
        <p className="text-[#8A9BB5] text-sm mt-1">{club.name} · Temporadas jugadas</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8A9BB5] text-xs">{card.label}</p>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: card.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
            </div>
          )
        })}
      </div>

      {/* W/D/L */}
      {totalGames > 0 && (
        <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Resultados
          </h2>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#00D68F]">{wins}</p>
              <p className="text-xs text-[#8A9BB5] mt-1">Victorias</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#FFB800]">{draws}</p>
              <p className="text-xs text-[#8A9BB5] mt-1">Empates</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#FF4757]">{losses}</p>
              <p className="text-xs text-[#8A9BB5] mt-1">Derrotas</p>
            </div>
          </div>
        </div>
      )}

      {/* Top tries */}
      {topScorers.length > 0 && (
        <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2A3A5C] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00D68F]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Máximos tries
            </h2>
          </div>
          <div className="divide-y divide-[#2A3A5C]">
            {topScorers.map(([name, count], i) => (
              <div key={name} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#5A6A85] w-4">{i + 1}</span>
                  <p className="text-sm font-medium text-white">{name}</p>
                </div>
                <span className="text-sm font-bold text-[#00D68F]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalGames === 0 && (
        <div className="text-center py-16">
          <Trophy className="w-12 h-12 text-[#2A3A5C] mx-auto mb-3" />
          <p className="text-[#5A6A85]">No hay partidos completados todavía.</p>
          <p className="text-[#5A6A85] text-sm mt-1">Las estadísticas aparecerán cuando cargues resultados.</p>
        </div>
      )}
    </div>
  )
}
