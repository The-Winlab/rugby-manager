'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MATCH_EVENT_TYPES, getEventTypeConfig } from '@/lib/rugby-constants'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface Player {
  id: string
  fullName: string
}

interface MatchEvent {
  id: string
  team: string
  eventType: string
  minute: number
  notes: string | null
  player: { id: string; fullName: string } | null
  subPlayer: { id: string; fullName: string } | null
}

interface Props {
  matchId: string
  initialEvents: MatchEvent[]
  players: Player[]
  userClubName: string
  opponentName: string
}

export default function EventLogger({ matchId, initialEvents, players, userClubName, opponentName }: Props) {
  const router = useRouter()
  const [events, setEvents] = useState(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [team, setTeam] = useState<'home' | 'away'>('home')
  const [eventType, setEventType] = useState('try')
  const [minute, setMinute] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [subPlayerId, setSubPlayerId] = useState('')
  const [notes, setNotes] = useState('')

  const eventTypeCfg = getEventTypeConfig(eventType)

  async function handleAdd() {
    if (!minute) return
    setSaving(true)
    try {
      const res = await fetch(`/api/fixtures/${matchId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team,
          eventType,
          minute: Number(minute),
          playerId: playerId || null,
          subPlayerId: subPlayerId || null,
          notes: notes || null,
        }),
      })
      if (res.ok) {
        const newEvent = await res.json()
        setEvents((prev) => [...prev, newEvent].sort((a, b) => a.minute - b.minute))
        setMinute('')
        setPlayerId('')
        setSubPlayerId('')
        setNotes('')
        setShowForm(false)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(eventId: string) {
    setDeleting(eventId)
    try {
      await fetch(`/api/fixtures/${matchId}/events/${eventId}`, { method: 'DELETE' })
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
      router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  const selectClass = 'bg-[#0F1923] border border-[#2A3A5C] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D68F] w-full'

  return (
    <div className="space-y-3">
      {/* Events list */}
      {events.length === 0 && !showForm ? (
        <p className="text-sm text-slate-500 text-center py-6">No hay eventos registrados.</p>
      ) : (
        <div className="space-y-1">
          {events.map((ev) => {
            const cfg = getEventTypeConfig(ev.eventType)
            const isMyTeam = ev.team === 'home'
            return (
              <div
                key={ev.id}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg bg-[#0F1923] border border-[#2A3A5C]/40 group ${
                  isMyTeam ? '' : 'opacity-70'
                }`}
              >
                {/* Minute */}
                <span className="text-xs font-mono font-bold text-slate-500 w-8 flex-shrink-0">
                  {ev.minute}&apos;
                </span>

                {/* Event type badge */}
                <span className={`text-xs font-semibold w-24 flex-shrink-0 ${cfg?.color ?? 'text-slate-400'}`}>
                  {cfg?.label ?? ev.eventType}
                </span>

                {/* Team */}
                <span className="text-xs text-slate-500 w-28 flex-shrink-0 truncate">
                  {isMyTeam ? userClubName : opponentName}
                </span>

                {/* Player */}
                <span className="text-sm text-white flex-1 truncate">
                  {ev.player?.fullName ?? '—'}
                  {ev.eventType === 'substitution' && ev.subPlayer && (
                    <span className="text-slate-500"> → {ev.subPlayer.fullName}</span>
                  )}
                </span>

                {/* Notes */}
                {ev.notes && (
                  <span className="text-xs text-slate-500 truncate max-w-[120px]">{ev.notes}</span>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(ev.id)}
                  disabled={deleting === ev.id}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-red-400 transition-all flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add event form */}
      {showForm && (
        <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-white">Agregar evento</p>

          <div className="grid grid-cols-2 gap-3">
            {/* Team */}
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Equipo</label>
              <select value={team} onChange={(e) => setTeam(e.target.value as 'home' | 'away')} className={selectClass}>
                <option value="home">{userClubName}</option>
                <option value="away">{opponentName}</option>
              </select>
            </div>

            {/* Minute */}
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Minuto</label>
              <input
                type="number"
                min={1}
                max={120}
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                placeholder="Ej: 23"
                className={selectClass}
              />
            </div>

            {/* Event type */}
            <div className="col-span-2">
              <label className="text-xs text-slate-500 mb-1 block">Tipo de evento</label>
              <div className="flex flex-wrap gap-2">
                {MATCH_EVENT_TYPES.map((et) => (
                  <button
                    key={et.value}
                    type="button"
                    onClick={() => setEventType(et.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      eventType === et.value
                        ? `${et.color} bg-current/10 border-current/30`
                        : 'text-slate-400 border-[#2A3A5C] hover:text-white'
                    }`}
                    style={eventType === et.value ? { borderColor: 'currentColor', backgroundColor: 'currentColor', color: 'inherit' } : {}}
                  >
                    <span className={eventType === et.value ? et.color : ''}>{et.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Player */}
            {eventTypeCfg?.hasPlayer && (
              <div className={eventTypeCfg.hasSubPlayer ? '' : 'col-span-2'}>
                <label className="text-xs text-slate-500 mb-1 block">
                  {eventType === 'substitution' ? 'Sale' : 'Jugador'}
                </label>
                <select value={playerId} onChange={(e) => setPlayerId(e.target.value)} className={selectClass}>
                  <option value="">— Seleccionar —</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sub player (for substitutions) */}
            {eventTypeCfg?.hasSubPlayer && (
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Entra</label>
                <select value={subPlayerId} onChange={(e) => setSubPlayerId(e.target.value)} className={selectClass}>
                  <option value="">— Seleccionar —</option>
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>{p.fullName}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Notes */}
            <div className="col-span-2">
              <label className="text-xs text-slate-500 mb-1 block">Notas (opcional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observaciones..."
                className={selectClass}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 py-2 rounded-lg border border-[#2A3A5C] text-slate-400 hover:text-white text-sm transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!minute || saving}
              className="flex-1 py-2 rounded-lg bg-[#00D68F] text-[#0F1923] text-sm font-semibold hover:bg-[#00D68F]/90 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Guardando...' : 'Agregar'}
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#00D68F] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Agregar evento
        </button>
      )}
    </div>
  )
}
