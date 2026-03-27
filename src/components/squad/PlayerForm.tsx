'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RUGBY_POSITIONS, PLAYER_STATUSES } from '@/lib/rugby-constants'

interface PlayerData {
  fullName?: string
  jerseyNumber?: number | null
  dateOfBirth?: string | null
  primaryPosition?: string | null
  altPosition?: string | null
  status?: string
  availableFrom?: string | null
  notes?: string | null
  photoUrl?: string | null
}

interface Props {
  playerId?: string
  defaultValues?: PlayerData
  mode: 'create' | 'edit'
}

export default function PlayerForm({ playerId, defaultValues, mode }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    fullName: defaultValues?.fullName ?? '',
    jerseyNumber: defaultValues?.jerseyNumber?.toString() ?? '',
    dateOfBirth: defaultValues?.dateOfBirth?.split('T')[0] ?? '',
    primaryPosition: defaultValues?.primaryPosition ?? '',
    altPosition: defaultValues?.altPosition ?? '',
    status: defaultValues?.status ?? 'available',
    availableFrom: defaultValues?.availableFrom?.split('T')[0] ?? '',
    notes: defaultValues?.notes ?? '',
    photoUrl: defaultValues?.photoUrl ?? '',
  })

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.fullName.trim()) { setError('El nombre es requerido'); return }
    setSaving(true)
    setError('')

    const payload = {
      fullName: form.fullName.trim(),
      jerseyNumber: form.jerseyNumber ? Number(form.jerseyNumber) : null,
      dateOfBirth: form.dateOfBirth || null,
      primaryPosition: form.primaryPosition || null,
      altPosition: form.altPosition || null,
      status: form.status,
      availableFrom: form.availableFrom || null,
      notes: form.notes || null,
      photoUrl: form.photoUrl || null,
    }

    try {
      const res = await fetch(
        mode === 'create' ? '/api/squad' : `/api/squad/${playerId}`,
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Error al guardar')
        return
      }

      const saved = await res.json()
      router.push(`/squad/${saved.id}`)
      router.refresh()
    } catch {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full bg-[#0F1923] border border-[#2A3A5C] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D68F] transition-colors'
  const labelClass = 'block text-xs font-medium text-slate-400 mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Personal data */}
      <div className="bg-[#1E2D4A] rounded-xl border border-[#2A3A5C] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Datos personales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Nombre completo *</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="Ej: Juan Manuel García"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Número de camiseta</label>
            <input
              type="number"
              value={form.jerseyNumber}
              onChange={(e) => set('jerseyNumber', e.target.value)}
              placeholder="1 – 23"
              min={1}
              max={99}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Fecha de nacimiento</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => set('dateOfBirth', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Position & status */}
      <div className="bg-[#1E2D4A] rounded-xl border border-[#2A3A5C] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Posición y estado</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Posición principal</label>
            <select value={form.primaryPosition} onChange={(e) => set('primaryPosition', e.target.value)} className={inputClass}>
              <option value="">Seleccionar...</option>
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
          </div>
          <div>
            <label className={labelClass}>Posición alternativa</label>
            <select value={form.altPosition} onChange={(e) => set('altPosition', e.target.value)} className={inputClass}>
              <option value="">Ninguna</option>
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
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
              {PLAYER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {(form.status === 'injured' || form.status === 'suspended') && (
          <div>
            <label className={labelClass}>Disponible desde</label>
            <input
              type="date"
              value={form.availableFrom}
              onChange={(e) => set('availableFrom', e.target.value)}
              className={inputClass}
            />
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="bg-[#1E2D4A] rounded-xl border border-[#2A3A5C] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Notas adicionales</h3>
        <textarea
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Notas del coach sobre el jugador..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-[#2A3A5C] hover:border-slate-400 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 text-sm font-semibold bg-[#00D68F] hover:bg-[#00B876] text-[#0F1923] rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : mode === 'create' ? 'Agregar jugador' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
