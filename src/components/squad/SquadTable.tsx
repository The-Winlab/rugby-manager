'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RUGBY_POSITIONS, PLAYER_STATUSES, getPositionLabel, getStatusConfig } from '@/lib/rugby-constants'

interface Player {
  id: string
  fullName: string
  jerseyNumber: number | null
  primaryPosition: string | null
  altPosition: string | null
  status: string
  dateOfBirth: string | null
  photoUrl: string | null
}

interface Props {
  players: Player[]
}

export default function SquadTable({ players }: Props) {
  const router = useRouter()
  const [positionFilter, setPositionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = players.filter((p) => {
    if (positionFilter && p.primaryPosition !== positionFilter) return false
    if (statusFilter && p.status !== statusFilter) return false
    if (search && !p.fullName.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar a ${name}? Esta acción no se puede deshacer.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/squad/${id}`, { method: 'DELETE' })
      router.refresh()
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar jugador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D68F] w-52"
        />
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D68F]"
        >
          <option value="">Todas las posiciones</option>
          <optgroup label="Forwards">
            {RUGBY_POSITIONS.slice(0, 8).map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </optgroup>
          <optgroup label="Backs">
            {RUGBY_POSITIONS.slice(8).map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </optgroup>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D68F]"
        >
          <option value="">Todos los estados</option>
          {PLAYER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {(positionFilter || statusFilter || search) && (
          <button
            onClick={() => { setPositionFilter(''); setStatusFilter(''); setSearch('') }}
            className="text-sm text-slate-400 hover:text-white px-2"
          >
            Limpiar filtros
          </button>
        )}
        <span className="ml-auto text-sm text-slate-400 self-center">
          {filtered.length} jugador{filtered.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          {players.length === 0 ? 'El plantel está vacío. Agregá tu primer jugador.' : 'Sin resultados para los filtros aplicados.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#2A3A5C]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2A3A5C] bg-[#1A2744]">
                <th className="text-left px-4 py-3 text-slate-400 font-medium w-12">#</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Jugador</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Posición</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Alt.</th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">Estado</th>
                <th className="text-right px-4 py-3 text-slate-400 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((player, i) => {
                const statusCfg = getStatusConfig(player.status)
                return (
                  <tr
                    key={player.id}
                    className={`border-b border-[#2A3A5C]/50 hover:bg-[#1E2D4A]/60 transition-colors ${
                      i % 2 === 0 ? 'bg-[#0F1923]' : 'bg-[#111D2E]'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-slate-300 font-bold">
                      {player.jerseyNumber ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/squad/${player.id}`}
                        className="font-medium text-white hover:text-[#00D68F] transition-colors"
                      >
                        {player.fullName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {player.primaryPosition ? getPositionLabel(player.primaryPosition) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {player.altPosition ? getPositionLabel(player.altPosition) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${statusCfg.color}`}>
                        ● {statusCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/squad/${player.id}`}
                          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded border border-[#2A3A5C] hover:border-slate-400 transition-colors"
                        >
                          Ver
                        </Link>
                        <Link
                          href={`/squad/${player.id}/edit`}
                          className="text-xs text-slate-400 hover:text-[#00D68F] px-2 py-1 rounded border border-[#2A3A5C] hover:border-[#00D68F] transition-colors"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(player.id, player.fullName)}
                          disabled={deleting === player.id}
                          className="text-xs text-slate-400 hover:text-red-400 px-2 py-1 rounded border border-[#2A3A5C] hover:border-red-400 transition-colors disabled:opacity-50"
                        >
                          {deleting === player.id ? '...' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
