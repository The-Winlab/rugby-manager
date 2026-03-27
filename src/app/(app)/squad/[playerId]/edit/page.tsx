export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import PlayerForm from '@/components/squad/PlayerForm'
import PlayerPhotoUpload from '@/components/squad/PlayerPhotoUpload'

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ playerId: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await prisma.userProfile.findUnique({ where: { id: user.id } })
  if (!profile?.clubId) redirect('/onboarding/club-selection')

  const { playerId } = await params
  const player = await prisma.player.findFirst({
    where: { id: playerId, clubId: profile.clubId },
  })

  if (!player) notFound()

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <Link href={`/squad/${player.id}`} className="text-sm text-slate-400 hover:text-white transition-colors">
          ← Volver al jugador
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Editar jugador</h1>
        <p className="text-slate-400 text-sm mt-1">{player.fullName}</p>
      </div>
      <div className="flex justify-center">
        <PlayerPhotoUpload
          playerId={player.id}
          currentPhotoUrl={player.photoUrl}
          playerName={player.fullName}
        />
      </div>
      <PlayerForm
        playerId={player.id}
        mode="edit"
        defaultValues={{
          fullName: player.fullName,
          jerseyNumber: player.jerseyNumber,
          dateOfBirth: player.dateOfBirth?.toISOString() ?? null,
          primaryPosition: player.primaryPosition,
          altPosition: player.altPosition,
          status: player.status,
          availableFrom: player.availableFrom?.toISOString() ?? null,
          notes: player.notes,
          photoUrl: player.photoUrl,
        }}
      />
    </div>
  )
}
