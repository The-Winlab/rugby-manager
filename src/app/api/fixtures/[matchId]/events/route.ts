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

// GET /api/fixtures/[matchId]/events
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId } = await params
  const match = await prisma.match.findFirst({ where: { id: matchId, userClubId: clubId } })
  if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  const events = await prisma.matchEvent.findMany({
    where: { matchId },
    include: {
      player: { select: { id: true, fullName: true } },
      subPlayer: { select: { id: true, fullName: true } },
    },
    orderBy: { minute: 'asc' },
  })
  return NextResponse.json(events)
}

// POST /api/fixtures/[matchId]/events
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId } = await params
  const match = await prisma.match.findFirst({ where: { id: matchId, userClubId: clubId } })
  if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  const body = await req.json()
  const { team, eventType, minute, playerId, subPlayerId, result, infractionType, notes } = body

  if (!team || !eventType || minute === undefined) {
    return NextResponse.json({ error: 'team, eventType y minute son requeridos' }, { status: 400 })
  }

  const event = await prisma.matchEvent.create({
    data: {
      matchId,
      team,
      eventType,
      minute: Number(minute),
      playerId: playerId || null,
      subPlayerId: subPlayerId || null,
      result: result || null,
      infractionType: infractionType || null,
      notes: notes || null,
    },
    include: {
      player: { select: { id: true, fullName: true } },
      subPlayer: { select: { id: true, fullName: true } },
    },
  })
  return NextResponse.json(event, { status: 201 })
}
