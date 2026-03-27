export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import MatchForm from '@/components/fixtures/MatchForm'

export default async function NewFixturePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await prisma.userProfile.findUnique({
    where: { id: user.id },
    include: { club: true },
  })
  if (!profile?.club) redirect('/onboarding/club-selection')

  const clubs = await prisma.club.findMany({
    where: { isUrbaClub: true },
    orderBy: { name: 'asc' },
    select: { id: true, name: true, shortName: true, primaryColor: true },
  })

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Nuevo partido</h1>
        <p className="text-[#8A9BB5] text-sm mt-1">{profile.club.name}</p>
      </div>

      <MatchForm
        clubs={clubs}
        userClubId={profile.club.id}
        mode="create"
      />
    </div>
  )
}
