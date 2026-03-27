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

// GET /api/fixtures/[matchId]/lineup
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId } = await params
  const match = await prisma.match.findFirst({ where: { id: matchId, userClubId: clubId } })
  if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  const lineups = await prisma.matchLineup.findMany({
    where: { matchId },
    include: { player: { select: { id: true, fullName: true, jerseyNumber: true, primaryPosition: true } } },
  })
  return NextResponse.json(lineups)
}

// POST /api/fixtures/[matchId]/lineup — bulk replace
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
  const { lineup } = body
  // lineup: Array<{ playerId: string, position: string, role: 'starter' | 'reserve', jerseyNumber?: number }>

  if (!Array.isArray(lineup)) {
    return NextResponse.json({ error: 'lineup debe ser un array' }, { status: 400 })
  }

  await prisma.matchLineup.deleteMany({ where: { matchId } })

  if (lineup.length > 0) {
    await prisma.matchLineup.createMany({
      data: lineup.map((item) => ({
        matchId,
        playerId: item.playerId,
        position: item.position || null,
        role: item.role || 'starter',
        jerseyNumber: item.jerseyNumber ? Number(item.jerseyNumber) : null,
      })),
    })
  }

  const saved = await prisma.matchLineup.findMany({
    where: { matchId },
    include: { player: { select: { id: true, fullName: true, jerseyNumber: true } } },
  })
  return NextResponse.json(saved)
}
