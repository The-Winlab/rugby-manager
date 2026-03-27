'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  playerId: string
  currentPhotoUrl?: string | null
  playerName: string
}

export default function PlayerPhotoUpload({ playerId, currentPhotoUrl, playerName }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) { setError('Solo imágenes'); return }
    if (file.size > 2 * 1024 * 1024) { setError('Máximo 2MB'); return }

    setPreview(URL.createObjectURL(file))
    setError('')
    setUploading(true)

    const fd = new FormData()
    fd.append('photo', file)

    try {
      const res = await fetch(`/api/squad/${playerId}/photo`, { method: 'POST', body: fd })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Error al subir')
        setPreview(currentPhotoUrl ?? null)
        return
      }
      router.refresh()
    } catch {
      setError('Error de conexión')
      setPreview(currentPhotoUrl ?? null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#2A3A5C] hover:border-[#00D68F] transition-colors group"
        disabled={uploading}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={playerName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#1E2D4A] flex items-center justify-center text-2xl font-bold text-[#00D68F]">
            {playerName[0].toUpperCase()}
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white">
          {uploading ? '...' : 'Cambiar'}
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <p className="text-xs text-slate-500">JPG, PNG hasta 2MB</p>
    </div>
  )
}
