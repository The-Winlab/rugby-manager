export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import FixturesList from '@/components/fixtures/FixturesList'

export default async function FixturesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const profile = await prisma.userProfile.findUnique({
    where: { id: user.id },
    include: { club: true },
  })
  if (!profile?.club) redirect('/onboarding/club-selection')

  const club = profile.club

  const matches = await prisma.match.findMany({
    where: { userClubId: club.id },
    include: {
      opponent: { select: { name: true, shortName: true, primaryColor: true, secondaryColor: true } },
    },
    orderBy: { matchDate: 'desc' },
  })

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Fixtures</h1>
        <p className="text-[#8A9BB5] text-sm mt-1">Partidos de {club.name}</p>
      </div>

      <FixturesList
        matches={matches.map((m) => ({
          ...m,
          matchDate: m.matchDate.toISOString(),
          opponent: m.opponent
            ? { ...m.opponent, secondaryColor: m.opponent.secondaryColor ?? null }
            : null,
        }))}
        userClubShortName={club.shortName ?? club.name.slice(0, 3).toUpperCase()}
        userClubPrimaryColor={club.primaryColor ?? '#2A3A5C'}
      />
    </div>
  )
}
