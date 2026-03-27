'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { STARTER_POSITIONS, RESERVE_SLOTS } from '@/lib/rugby-constants'
import { Save } from 'lucide-react'

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
  player: { id: string; fullName: string; jerseyNumber: number | null; primaryPosition: string | null }
}

interface Props {
  matchId: string
  players: Player[]
  initialLineup: LineupEntry[]
}

type SlotKey = string // position number as string '1'-'23'

export default function LineupBuilder({ matchId, players, initialLineup }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Build initial selection map: position -> playerId
  const buildInitialMap = () => {
    const map: Record<SlotKey, string> = {}
    for (const entry of initialLineup) {
      if (entry.position) map[entry.position] = entry.playerId
    }
    return map
  }

  const [selection, setSelection] = useState<Record<SlotKey, string>>(buildInitialMap)

  // Available players = only those with status 'available'
  const availablePlayers = players.filter((p) => p.status === 'available')

  // Get players already selected in other slots (to avoid duplication)
  function isPlayerUsed(playerId: string, excludeSlot: SlotKey) {
    return Object.entries(selection).some(([slot, pid]) => pid === playerId && slot !== excludeSlot)
  }

  function setSlot(position: SlotKey, playerId: string) {
    setSelection((prev) => ({ ...prev, [position]: playerId }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    const lineup = Object.entries(selection)
      .filter(([, playerId]) => playerId)
      .map(([position, playerId]) => ({
        playerId,
        position,
        role: Number(position) <= 15 ? 'starter' : 'reserve',
        jerseyNumber: Number(position) <= 23 ? Number(position) : null,
      }))

    try {
      const res = await fetch(`/api/fixtures/${matchId}/lineup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lineup }),
      })
      if (res.ok) {
        setSaved(true)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  const selectClass = 'bg-[#0F1923] border border-[#2A3A5C] rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D68F] w-full transition-colors appearance-none'

  function renderSlot(position: SlotKey, label: string, isReserve = false) {
    const selectedId = selection[position] ?? ''
    return (
      <tr key={position} className={`border-b border-[#2A3A5C]/40 ${isReserve ? 'bg-[#111D2E]/50' : ''}`}>
        <td className="px-3 py-2 w-8">
          <span className="text-xs font-mono font-bold text-slate-500">{position}</span>
        </td>
        <td className="px-3 py-2 w-40">
          <span className="text-xs text-slate-400">{label}</span>
        </td>
        <td className="px-3 py-2">
          <select
            value={selectedId}
            onChange={(e) => setSlot(position, e.target.value)}
            className={selectClass}
          >
            <option value="">— Sin asignar —</option>
            {availablePlayers.map((p) => {
              const used = isPlayerUsed(p.id, position)
              return (
                <option key={p.id} value={p.id} disabled={used}>
                  {used ? '✓ ' : ''}{p.jerseyNumber ? `#${p.jerseyNumber} ` : ''}{p.fullName}
                  {used ? ' (ya en formación)' : ''}
                </option>
              )
            })}
          </select>
        </td>
      </tr>
    )
  }

  const starterCount = Object.entries(selection).filter(([pos, pid]) => pid && Number(pos) <= 15).length
  const reserveCount = Object.entries(selection).filter(([pos, pid]) => pid && Number(pos) > 15).length

  return (
    <div className="space-y-4">
      {/* Titulares */}
      <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A3A5C] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Titulares</h3>
          <span className="text-xs text-slate-500">{starterCount}/15</span>
        </div>
        <table className="w-full">
          <tbody>
            {STARTER_POSITIONS.map((pos) =>
              renderSlot(pos.value, pos.label.replace(/^\d+ - /, ''))
            )}
          </tbody>
        </table>
      </div>

      {/* Banco */}
      <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#2A3A5C] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Banco</h3>
          <span className="text-xs text-slate-500">{reserveCount}/8</span>
        </div>
        <table className="w-full">
          <tbody>
            {RESERVE_SLOTS.map((slot) =>
              renderSlot(slot.value, slot.label, true)
            )}
          </tbody>
        </table>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors ${
          saved
            ? 'bg-[#00D68F]/10 text-[#00D68F] border border-[#00D68F]/30'
            : 'bg-[#00D68F] text-[#0F1923] hover:bg-[#00D68F]/90'
        } disabled:opacity-50 w-full justify-center`}
      >
        <Save className="w-4 h-4" />
        {saving ? 'Guardando...' : saved ? 'Formación guardada' : 'Guardar formación'}
      </button>
    </div>
  )
}
