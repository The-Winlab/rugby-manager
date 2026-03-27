import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

async function getClubId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const profile = await prisma.userProfile.findUnique({ where: { id: user.id } })
  return profile?.clubId ?? null
}

// DELETE /api/fixtures/[matchId]/events/[eventId]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ matchId: string; eventId: string }> }
) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId, eventId } = await params
  const match = await prisma.match.findFirst({ where: { id: matchId, userClubId: clubId } })
  if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  await prisma.matchEvent.deleteMany({ where: { id: eventId, matchId } })
  return NextResponse.json({ success: true })
}
