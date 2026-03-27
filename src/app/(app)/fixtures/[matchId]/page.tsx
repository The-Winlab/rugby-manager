export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Edit2 } from 'lucide-react'
import { getMatchStatusConfig } from '@/lib/rugby-constants'
import MatchScorer from '@/components/fixtures/MatchScorer'
import MatchDetailTabs from '@/components/fixtures/MatchDetailTabs'

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await prisma.userProfile.findUnique({
    where: { id: user.id },
    include: { club: true },
  })
  if (!profile?.club) redirect('/onboarding/club-selection')

  const club = profile!.club!

  const match = await prisma.match.findFirst({
    where: { id: matchId, userClubId: club.id },
    include: {
      opponent: true,
      lineups: {
        include: {
          player: { select: { id: true, fullName: true, jerseyNumber: true, primaryPosition: true } },
        },
      },
      events: {
        include: {
          player: { select: { id: true, fullName: true } },
          subPlayer: { select: { id: true, fullName: true } },
        },
        orderBy: { minute: 'asc' },
      },
    },
  })

  if (!match) notFound()

  const m = match!

  const players = await prisma.player.findMany({
    where: { clubId: club.id },
    orderBy: [{ jerseyNumber: 'asc' }, { fullName: 'asc' }],
    select: { id: true, fullName: true, jerseyNumber: true, primaryPosition: true, status: true },
  })

  const opponentName = m.opponent?.name ?? m.opponentName ?? 'Rival'
  const statusCfg = getMatchStatusConfig(m.status)
  const date = m.matchDate

  const serializedLineup = m.lineups.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }))
  const serializedEvents = m.events.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() }))

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <Link
        href="/fixtures"
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a fixtures
      </Link>

      <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                {statusCfg.label}
              </span>
              {m.competition && <span className="text-xs text-slate-500">{m.competition}</span>}
              {m.round && <span className="text-xs text-slate-500">· Fecha {m.round}</span>}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold mx-auto mb-1"
                  style={{ backgroundColor: m.isHome ? (club.primaryColor ?? '#2A3A5C') : (m.opponent?.primaryColor ?? '#2A3A5C'), color: '#fff' }}
                >
                  {m.isHome ? (club.shortName?.slice(0, 3) ?? club.name.slice(0, 2)) : (m.opponent?.shortName?.slice(0, 3) ?? opponentName.slice(0, 2))}
                </div>
                <p className="text-xs text-slate-400 max-w-[80px] truncate">{m.isHome ? club.name : opponentName}</p>
              </div>

              <div className="flex-1 text-center px-4">
                {m.status === 'completed' ? (
                  <p className="text-3xl font-bold text-white font-mono">{m.homeScore} – {m.awayScore}</p>
                ) : (
                  <p className="text-lg text-slate-500 font-medium">vs</p>
                )}
                <p className="text-xs text-slate-500 mt-1">{m.isHome ? 'Local' : 'Visitante'}</p>
              </div>

              <div className="text-center">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold mx-auto mb-1"
                  style={{ backgroundColor: m.isHome ? (m.opponent?.primaryColor ?? '#2A3A5C') : (club.primaryColor ?? '#2A3A5C'), color: '#fff' }}
                >
                  {m.isHome ? (m.opponent?.shortName?.slice(0, 3) ?? opponentName.slice(0, 2)) : (club.shortName?.slice(0, 3) ?? club.name.slice(0, 2))}
                </div>
                <p className="text-xs text-slate-400 max-w-[80px] truncate">{m.isHome ? opponentName : club.name}</p>
              </div>
            </div>
          </div>

          <Link href={`/fixtures/${matchId}/edit`} className="p-2 text-slate-500 hover:text-white transition-colors flex-shrink-0">
            <Edit2 className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-[#2A3A5C]">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            {date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}
            {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          {m.venue && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5" />
              {m.venue}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">Temporada {m.season}</div>
        </div>
      </div>

      <MatchScorer
        matchId={matchId}
        status={m.status}
        homeScore={m.homeScore}
        awayScore={m.awayScore}
        isHome={m.isHome}
        userClubShortName={club.shortName ?? club.name.slice(0, 3)}
        opponentName={opponentName}
      />

      <MatchDetailTabs
        matchId={matchId}
        players={players}
        initialLineup={serializedLineup}
        initialEvents={serializedEvents}
        userClubName={club.name}
        opponentName={opponentName}
        coachNotesPre={m.coachNotesPre}
        coachNotesPost={m.coachNotesPost}
      />
    </div>
  )
}
