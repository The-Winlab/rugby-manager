export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getAuthProfile } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Calendar, Users, Trophy, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const profile = await getAuthProfile()
  if (!profile?.club) redirect('/onboarding/club-selection')

  const club = profile.club

  // Fetch summary stats
  const [totalPlayers, upcomingMatches, completedMatches] = await Promise.all([
    prisma.player.count({ where: { clubId: club.id, status: 'available' } }),
    prisma.match.count({ where: { userClubId: club.id, status: 'upcoming' } }),
    prisma.match.count({ where: { userClubId: club.id, status: 'completed' } }),
  ])

  const recentMatches = await prisma.match.findMany({
    where: { userClubId: club.id, status: { in: ['completed', 'upcoming'] } },
    orderBy: { matchDate: 'desc' },
    take: 5,
    include: { opponent: true },
  })

  const stats = [
    { label: 'Jugadores habilitados', value: totalPlayers, icon: Users, color: '#00D68F' },
    { label: 'Próximos partidos', value: upcomingMatches, icon: Calendar, color: '#FFB800' },
    { label: 'Partidos jugados', value: completedMatches, icon: Trophy, color: '#3D8EF0' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {club.logoUrl ? (
          <img
            src={club.logoUrl}
            alt={club.shortName ?? club.name}
            className="w-12 h-12 rounded-xl object-contain flex-shrink-0 bg-white/5"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              backgroundColor: club.primaryColor ?? '#2A3A5C',
              color: club.secondaryColor ?? '#FFFFFF',
            }}
          >
            {club.shortName?.slice(0, 3) ?? club.name.slice(0, 2)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">{club.name}</h1>
          <p className="text-[#8A9BB5] text-sm">Panel de control</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[#8A9BB5] text-sm">{stat.label}</p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Ver plantel', href: '/squad', icon: Users },
          { label: 'Fixtures', href: '/fixtures', icon: Calendar },
          { label: 'Estadísticas', href: '/stats/team', icon: TrendingUp },
        ].map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-4 hover:border-[#00D68F]/40 hover:bg-[#243558] transition-colors"
            >
              <Icon className="w-5 h-5 text-[#00D68F]" />
              <span className="text-sm font-medium text-white">{action.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Recent matches */}
      {recentMatches.length > 0 && (
        <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#2A3A5C]">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Partidos recientes</h2>
          </div>
          <div className="divide-y divide-[#2A3A5C]">
            {recentMatches.map((match) => {
              const opponentName = match.opponent?.name ?? match.opponentName ?? 'Rival'
              const isHome = match.isHome
              const isCompleted = match.status === 'completed'

              return (
                <Link
                  key={match.id}
                  href={`/fixtures/${match.id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#243558] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {isHome ? 'vs' : '@'} {opponentName}
                    </p>
                    <p className="text-xs text-[#5A6A85] mt-0.5">
                      {match.round ?? match.competition ?? '—'} · {match.season}
                    </p>
                  </div>
                  <div className="text-right">
                    {isCompleted ? (
                      <p className="text-sm font-bold text-white">
                        {match.homeScore} – {match.awayScore}
                      </p>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-[#243558] text-[#8A9BB5]">
                        {match.matchDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
