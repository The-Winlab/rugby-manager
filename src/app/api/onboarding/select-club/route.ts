import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { clubId } = await request.json()

  if (!clubId) {
    return NextResponse.json({ error: 'clubId required' }, { status: 400 })
  }

  // Verify club exists
  const club = await prisma.club.findUnique({ where: { id: clubId } })
  if (!club) {
    return NextResponse.json({ error: 'Club not found' }, { status: 404 })
  }

  // Upsert user profile with club
  await prisma.userProfile.upsert({
    where: { id: user.id },
    create: { id: user.id, clubId },
    update: { clubId },
  })

  // Set cookie so middleware knows club is selected
  const cookieStore = await cookies()
  cookieStore.set('rugby_manager_has_club', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  return NextResponse.json({ success: true, club })
}
