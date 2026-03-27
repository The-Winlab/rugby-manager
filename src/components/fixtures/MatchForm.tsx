'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SEASONS, COMPETITIONS } from '@/lib/rugby-constants'

interface Club {
  id: string
  name: string
  shortName: string | null
  primaryColor: string | null
}

interface MatchData {
  id?: string
  opponentId?: string | null
  opponentName?: string | null
  isHome?: boolean
  matchDate?: string
  round?: string | null
  competition?: string | null
  season?: string
  venue?: string | null
  coachNotesPre?: string | null
}

interface Props {
  clubs: Club[]
  userClubId: string
  initialData?: MatchData
  mode: 'create' | 'edit'
}

export default function MatchForm({ clubs, userClubId, initialData, mode }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [opponentType, setOpponentType] = useState<'urba' | 'other'>(
    initialData?.opponentId ? 'urba' : 'other'
  )
  const [opponentId, setOpponentId] = useState(initialData?.opponentId ?? '')
  const [opponentName, setOpponentName] = useState(initialData?.opponentName ?? '')
  const [isHome, setIsHome] = useState(initialData?.isHome ?? true)

  // Format date for input
  const initialDate = initialData?.matchDate
    ? new Date(initialData.matchDate).toISOString().slice(0, 16)
    : ''
  const [matchDate, setMatchDate] = useState(initialDate)
  const [round, setRound] = useState(initialData?.round ?? '')
  const [competition, setCompetition] = useState(initialData?.competition ?? '')
  const [season, setSeason] = useState(initialData?.season ?? SEASONS[0])
  const [venue, setVenue] = useState(initialData?.venue ?? '')
  const [coachNotesPre, setCoachNotesPre] = useState(initialData?.coachNotesPre ?? '')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!matchDate) { setError('La fecha del partido es requerida'); return }
    if (opponentType === 'urba' && !opponentId) { setError('Seleccioná el club rival'); return }
    if (opponentType === 'other' && !opponentName.trim()) { setError('Ingresá el nombre del rival'); return }

    setSaving(true)
    try {
      const payload = {
        opponentId: opponentType === 'urba' ? opponentId : null,
        opponentName: opponentType === 'other' ? opponentName.trim() : null,
        isHome,
        matchDate: new Date(matchDate).toISOString(),
        round: round || null,
        competition: competition || null,
        season,
        venue: venue || null,
        coachNotesPre: coachNotesPre || null,
      }

      const url = mode === 'create' ? '/api/fixtures' : `/api/fixtures/${initialData!.id}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Error al guardar')
        return
      }

      const match = await res.json()
      router.push(`/fixtures/${match.id}`)
      router.refresh()
    } catch {
      setError('Error inesperado')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'bg-[#0F1923] border border-[#2A3A5C] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00D68F] w-full transition-colors'
  const labelClass = 'block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rival */}
      <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Rival</h3>

        {/* Opponent type toggle */}
        <div className="flex gap-2">
          {(['urba', 'other'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setOpponentType(t)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                opponentType === t
                  ? 'bg-[#00D68F]/15 text-[#00D68F] border-[#00D68F]/40'
                  : 'text-slate-400 border-[#2A3A5C] hover:text-white hover:border-slate-500'
              }`}
            >
              {t === 'urba' ? 'Club URBA' : 'Otro rival'}
            </button>
          ))}
        </div>

        {opponentType === 'urba' ? (
          <div>
            <label className={labelClass}>Club</label>
            <select
              value={opponentId}
              onChange={(e) => setOpponentId(e.target.value)}
              className={inputClass}
            >
              <option value="">Seleccionar club...</option>
              {clubs
                .filter((c) => c.id !== userClubId)
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>
        ) : (
          <div>
            <label className={labelClass}>Nombre del rival</label>
            <input
              type="text"
              value={opponentName}
              onChange={(e) => setOpponentName(e.target.value)}
              placeholder="Ej: San Cirano, Tucumán RC..."
              className={inputClass}
            />
          </div>
        )}

        {/* Home/Away */}
        <div>
          <label className={labelClass}>Localía</label>
          <div className="flex gap-2">
            {[{ value: true, label: 'Local' }, { value: false, label: 'Visitante' }].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setIsHome(opt.value)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  isHome === opt.value
                    ? 'bg-[#00D68F]/15 text-[#00D68F] border-[#00D68F]/40'
                    : 'text-slate-400 border-[#2A3A5C] hover:text-white hover:border-slate-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fecha y competencia */}
      <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Fecha y competencia</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Fecha y hora</label>
            <input
              type="datetime-local"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Temporada</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className={inputClass}
            >
              {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Competencia</label>
            <select
              value={competition}
              onChange={(e) => setCompetition(e.target.value)}
              className={inputClass}
            >
              <option value="">Sin especificar</option>
              {COMPETITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Fecha / Ronda</label>
            <input
              type="text"
              value={round}
              onChange={(e) => setRound(e.target.value)}
              placeholder="Ej: 1, Final, Cuartos..."
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Cancha / Sede</label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Ej: Cancha de Los Tilos..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Notas del coach */}
      <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white">Notas previas al partido</h3>
        <textarea
          value={coachNotesPre}
          onChange={(e) => setCoachNotesPre(e.target.value)}
          placeholder="Estrategia, aspectos a trabajar, rival a tener en cuenta..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-xl border border-[#2A3A5C] text-slate-400 hover:text-white hover:border-slate-500 text-sm font-medium transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-3 rounded-xl bg-[#00D68F] text-[#0F1923] text-sm font-bold hover:bg-[#00D68F]/90 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Guardando...' : mode === 'create' ? 'Crear partido' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
