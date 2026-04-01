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

  async function selectClub(clubId: string): Promise<{ success: true; clubName: string } | { success: false; error: string }> {
    'use server'
    try {
      const supabase = await createClient()
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError) return { success: false, error: `Auth error: ${authError.message}` }
      if (!user) return { success: false, error: 'No authenticated user' }

      const club = await prisma.club.findUnique({ where: { id: clubId } })
      if (!club) return { success: false, error: `Club not found: ${clubId}` }

      await prisma.userProfile.upsert({
        where: { id: user.id },
        create: { id: user.id, clubId },
        update: { clubId },
      })

      return { success: true, clubName: club.name }
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : String(e) }
    }
  }

  return <ClubSelector clubs={clubs} selectClub={selectClub} />
}
