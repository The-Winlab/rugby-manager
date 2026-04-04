export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import ClubSelector from './ClubSelector'

export default async function ClubSelectionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const profile = await prisma.userProfile.findUnique({ where: { id: user.id } })
  if (profile?.clubId) redirect('/dashboard')

  const clubs = await prisma.club.findMany({
    where: { isUrbaClub: true },
    orderBy: [{ division: 'asc' }, { name: 'asc' }],
  })

  return <ClubSelector clubs={clubs} />
}
