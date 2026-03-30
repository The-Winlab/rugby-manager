export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import ClubSelector from './ClubSelector'

export default async function ClubSelectionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Check if user already has a club
  const profile = await prisma.userProfile.findUnique({ where: { id: user.id } })
  if (profile?.clubId) redirect('/dashboard')

  const clubs = await prisma.club.findMany({
    where: { isUrbaClub: true },
    orderBy: [{ division: 'asc' }, { name: 'asc' }],
  })

  async function selectClub(clubId: string) {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const club = await prisma.club.findUnique({ where: { id: clubId } })
    if (!club) throw new Error('Club not found')

    await prisma.userProfile.upsert({
      where: { id: user.id },
      create: { id: user.id, clubId },
      update: { clubId },
    })

    redirect('/dashboard')
  }

  return <ClubSelector clubs={clubs} selectClub={selectClub} />
}
