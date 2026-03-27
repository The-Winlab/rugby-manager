'use client'

import { useState } from 'react'
import LineupBuilder from './LineupBuilder'
import EventLogger from './EventLogger'

interface Player {
  id: string
  fullName: string
  jerseyNumber: number | null
  primaryPosition: string | null
  status: string
}

interface LineupEntry {
  id: string
  matchId: string
  playerId: string
  position: string | null
  role: string
  jerseyNumber: number | null
  createdAt: string
  player: { id: string; fullName: string; jerseyNumber: number | null; primaryPosition: string | null }
}

interface MatchEvent {
  id: string
  team: string
  eventType: string
  minute: number
  notes: string | null
  createdAt: string
  player: { id: string; fullName: string } | null
  subPlayer: { id: string; fullName: string } | null
}

interface Props {
  matchId: string
  players: Player[]
  initialLineup: LineupEntry[]
  initialEvents: MatchEvent[]
  userClubName: string
  opponentName: string
  coachNotesPre: string | null
  coachNotesPost: string | null
}

type Tab = 'lineup' | 'events' | 'notes'

export default function MatchDetailTabs({
  matchId,
  players,
  initialLineup,
  initialEvents,
  userClubName,
  opponentName,
  coachNotesPre,
  coachNotesPost,
}: Props) {
  const [tab, setTab] = useState<Tab>('lineup')

  const tabs: { value: Tab; label: string }[] = [
    { value: 'lineup', label: 'Formación' },
    { value: 'events', label: `Eventos${initialEvents.length > 0 ? ` (${initialEvents.length})` : ''}` },
    { value: 'notes', label: 'Notas' },
  ]

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-[#1A2744] rounded-xl p-1 border border-[#2A3A5C]">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.value
                ? 'bg-[#00D68F]/15 text-[#00D68F]'
                : 'text-[#8A9BB5] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'lineup' && (
        <LineupBuilder
          matchId={matchId}
          players={players}
          initialLineup={initialLineup}
        />
      )}

      {tab === 'events' && (
        <EventLogger
          matchId={matchId}
          initialEvents={initialEvents}
          players={players}
          userClubName={userClubName}
          opponentName={opponentName}
        />
      )}

      {tab === 'notes' && (
        <div className="space-y-4">
          {coachNotesPre && (
            <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Previo al partido</p>
              <p className="text-sm text-white whitespace-pre-wrap">{coachNotesPre}</p>
            </div>
          )}
          {coachNotesPost && (
            <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Post partido</p>
              <p className="text-sm text-white whitespace-pre-wrap">{coachNotesPost}</p>
            </div>
          )}
          {!coachNotesPre && !coachNotesPost && (
            <p className="text-sm text-slate-500 text-center py-8">
              No hay notas. Podés agregarlas desde la edición del partido.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
