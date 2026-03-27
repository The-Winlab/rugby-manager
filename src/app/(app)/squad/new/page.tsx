import Link from 'next/link'
import PlayerForm from '@/components/squad/PlayerForm'

export default function NewPlayerPage() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <Link href="/squad" className="text-sm text-slate-400 hover:text-white transition-colors">
          ← Volver al plantel
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Agregar jugador</h1>
        <p className="text-slate-400 text-sm mt-1">Completá los datos del nuevo jugador</p>
      </div>
      <PlayerForm mode="create" />
    </div>
  )
}
