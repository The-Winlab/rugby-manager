'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Edit2, Check, X } from 'lucide-react'

interface Props {
  matchId: string
  status: string
  homeScore: number
  awayScore: number
  isHome: boolean
  userClubShortName: string
  opponentName: string
}

export default function MatchScorer({
  matchId,
  status,
  homeScore,
  awayScore,
  isHome,
  userClubShortName,
  opponentName,
}: Props) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [home, setHome] = useState(String(homeScore))
  const [away, setAway] = useState(String(awayScore))

  const myScore = isHome ? homeScore : awayScore
  const theirScore = isHome ? awayScore : homeScore
  const result = myScore > theirScore ? 'Victoria' : myScore < theirScore ? 'Derrota' : 'Empate'
  const resultColor = myScore > theirScore ? 'text-green-400' : myScore < theirScore ? 'text-red-400' : 'text-yellow-400'

  async function handleSave() {
    setSaving(true)
    try {
      await fetch(`/api/fixtures/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeScore: Number(home),
          awayScore: Number(away),
          status: 'completed',
        }),
      })
      setEditing(false)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setHome(String(homeScore))
    setAway(String(awayScore))
    setEditing(false)
  }

  const inputClass = 'w-16 text-center text-2xl font-bold bg-[#0F1923] border border-[#2A3A5C] rounded-lg py-2 text-white focus:outline-none focus:border-[#00D68F]'

  if (status === 'upcoming') {
    return (
      <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5">
        {editing ? (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-white">Registrar resultado</p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-2">{isHome ? userClubShortName : opponentName}</p>
                <input
                  type="number"
                  min={0}
                  value={home}
                  onChange={(e) => setHome(e.target.value)}
                  className={inputClass}
                />
              </div>
              <span className="text-2xl font-bold text-slate-500 pb-1">—</span>
              <div className="text-center">
                <p className="text-xs text-slate-500 mb-2">{isHome ? opponentName : userClubShortName}</p>
                <input
                  type="number"
                  min={0}
                  value={away}
                  onChange={(e) => setAway(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-[#2A3A5C] text-slate-400 hover:text-white text-sm transition-colors"
              >
                <X className="w-4 h-4" /> Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#00D68F] text-[#0F1923] text-sm font-semibold hover:bg-[#00D68F]/90 disabled:opacity-50 transition-colors"
              >
                <Check className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Confirmar resultado'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-3 w-full text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-[#00D68F]/10 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-4 h-4 text-[#00D68F]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Registrar resultado</p>
              <p className="text-xs text-slate-500">Cargá el marcador final del partido</p>
            </div>
          </button>
        )}
      </div>
    )
  }

  // Completed — show result with edit option
  return (
    <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl p-5">
      {editing ? (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-white">Editar resultado</p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-2">{isHome ? userClubShortName : opponentName}</p>
              <input
                type="number"
                min={0}
                value={home}
                onChange={(e) => setHome(e.target.value)}
                className={inputClass}
              />
            </div>
            <span className="text-2xl font-bold text-slate-500 pb-1">—</span>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-2">{isHome ? opponentName : userClubShortName}</p>
              <input
                type="number"
                min={0}
                value={away}
                onChange={(e) => setAway(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-[#2A3A5C] text-slate-400 hover:text-white text-sm transition-colors"
            >
              <X className="w-4 h-4" /> Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#00D68F] text-[#0F1923] text-sm font-semibold hover:bg-[#00D68F]/90 disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <div className="flex-1 text-center">
            <p className="text-xs text-slate-500 mb-1">{isHome ? userClubShortName : opponentName}</p>
            <p className="text-4xl font-bold text-white font-mono">{homeScore}</p>
          </div>
          <div className="flex-shrink-0 text-center">
            <p className={`text-sm font-semibold ${resultColor}`}>{result}</p>
            <p className="text-slate-600 text-lg font-bold">—</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-xs text-slate-500 mb-1">{isHome ? opponentName : userClubShortName}</p>
            <p className="text-4xl font-bold text-white font-mono">{awayScore}</p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
