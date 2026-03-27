'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getMatchStatusConfig } from '@/lib/rugby-constants'
import { Calendar, MapPin, Plus, Trash2 } from 'lucide-react'

interface Match {
  id: string
  isHome: boolean
  matchDate: string
  round: string | null
  competition: string | null
  season: string
  venue: string | null
  status: string
  homeScore: number
  awayScore: number
  opponentName: string | null
  opponent: { name: string; shortName: string | null; primaryColor: string | null; secondaryColor: string | null } | null
}

interface Props {
  matches: Match[]
  userClubShortName: string
  userClubPrimaryColor: string
}

export default function FixturesList({ matches, userClubShortName, userClubPrimaryColor }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = matches.filter((m) => m.status === tab)

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este partido? Esta acción no se puede deshacer.')) return
    setDeleting(id)
    try {
      await fetch(`/api/fixtures/${id}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  function getOpponentName(m: Match) {
    return m.opponent?.name ?? m.opponentName ?? 'Rival'
  }

  function getOpponentShort(m: Match) {
    return m.opponent?.shortName ?? getOpponentName(m).slice(0, 3).toUpperCase()
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-[#1A2744] rounded-lg p-1 border border-[#2A3A5C]">
          {(['upcoming', 'completed'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-[#00D68F]/15 text-[#00D68F]'
                  : 'text-[#8A9BB5] hover:text-white'
              }`}
            >
              {t === 'upcoming' ? 'Próximos' : 'Historial'}
              <span className="ml-1.5 text-xs opacity-60">
                {matches.filter((m) => m.status === t).length}
              </span>
            </button>
          ))}
        </div>

        <Link
          href="/fixtures/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#00D68F] text-[#0F1923] rounded-lg text-sm font-semibold hover:bg-[#00D68F]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo partido
        </Link>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          {tab === 'upcoming'
            ? 'No hay partidos programados. Cargá el próximo fixture.'
            : 'No hay partidos jugados todavía.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((match) => {
            const statusCfg = getMatchStatusConfig(match.status)
            const opponentName = getOpponentName(match)
            const opponentShort = getOpponentShort(match)
            const opponentColor = match.opponent?.primaryColor ?? '#2A3A5C'
            const date = new Date(match.matchDate)

            const homeClub = match.isHome ? { short: userClubShortName, color: userClubPrimaryColor } : { short: opponentShort, color: opponentColor }
            const awayClub = match.isHome ? { short: opponentShort, color: opponentColor } : { short: userClubShortName, color: userClubPrimaryColor }

            return (
              <div
                key={match.id}
                className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl overflow-hidden hover:border-[#3A4A6C] transition-colors group"
              >
                <Link href={`/fixtures/${match.id}`} className="flex items-center gap-4 px-5 py-4">
                  {/* Date */}
                  <div className="w-14 text-center flex-shrink-0">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">
                      {date.toLocaleDateString('es-AR', { month: 'short' })}
                    </p>
                    <p className="text-2xl font-bold text-white leading-none">
                      {date.getDate()}
                    </p>
                    <p className="text-xs text-slate-500">{date.getFullYear()}</p>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-10 bg-[#2A3A5C]" />

                  {/* Teams */}
                  <div className="flex-1 flex items-center gap-3">
                    {/* Home */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-sm font-semibold text-white text-right">
                        {match.isHome ? userClubShortName : opponentName}
                      </span>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: homeClub.color, color: '#fff' }}
                      >
                        {homeClub.short.slice(0, 3)}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-1 px-3">
                      {match.status === 'completed' ? (
                        <span className="text-lg font-bold text-white font-mono tracking-wider">
                          {match.homeScore} – {match.awayScore}
                        </span>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border} border`}>
                          vs
                        </span>
                      )}
                    </div>

                    {/* Away */}
                    <div className="flex items-center gap-2 flex-1 justify-start">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: awayClub.color, color: '#fff' }}
                      >
                        {awayClub.short.slice(0, 3)}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {match.isHome ? opponentName : userClubShortName}
                      </span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    {(match.competition || match.round) && (
                      <p className="text-xs text-slate-400">
                        {match.competition ?? '—'}{match.round ? ` · Fecha ${match.round}` : ''}
                      </p>
                    )}
                    {match.venue && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 justify-end mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {match.venue}
                      </p>
                    )}
                    {!match.competition && !match.venue && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(match.id)}
                  disabled={deleting === match.id}
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition-all rounded hidden"
                  aria-label="Eliminar partido"
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
