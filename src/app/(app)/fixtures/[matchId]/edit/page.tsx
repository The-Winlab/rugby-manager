export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import MatchForm from '@/components/fixtures/MatchForm'

export default async function EditFixturePage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await prisma.userProfile.findUnique({
    where: { id: user.id },
    include: { club: true },
  })
  if (!profile?.club) redirect('/onboarding/club-selection')

  const club = profile!.club!

  const match = await prisma.match.findFirst({
    where: { id: matchId, userClubId: club.id },
  })
  if (!match) notFound()

  const m = match!

  const clubs = await prisma.club.findMany({
    where: { isUrbaClub: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, shortName: true, primaryColor: true },
  })

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/fixtures/${matchId}`} className="p-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Editar partido</h1>
          <p className="text-[#8A9BB5] text-sm mt-0.5">{club.name}</p>
        </div>
      </div>

      <MatchForm
        clubs={clubs}
        userClubId={club.id}
        mode="edit"
        initialData={{
          id: m.id,
          opponentId: m.opponentId,
          opponentName: m.opponentName,
          isHome: m.isHome,
          matchDate: m.matchDate.toISOString(),
          round: m.round,
          competition: m.competition,
          season: m.season,
          venue: m.venue,
          coachNotesPre: m.coachNotesPre,
        }}
      />
    </div>
  )
}
