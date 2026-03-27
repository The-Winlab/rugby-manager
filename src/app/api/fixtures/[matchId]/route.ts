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

// GET /api/fixtures/[matchId]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId } = await params
  const match = await prisma.match.findFirst({
    where: { id: matchId, userClubId: clubId },
    include: {
      opponent: true,
      lineups: {
        include: { player: { select: { id: true, fullName: true, jerseyNumber: true, primaryPosition: true } } },
        orderBy: { jerseyNumber: 'asc' },
      },
      events: {
        include: {
          player: { select: { id: true, fullName: true } },
          subPlayer: { select: { id: true, fullName: true } },
        },
        orderBy: { minute: 'asc' },
      },
    },
  })

  if (!match) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })
  return NextResponse.json(match)
}

// PATCH /api/fixtures/[matchId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId } = await params
  const existing = await prisma.match.findFirst({ where: { id: matchId, userClubId: clubId } })
  if (!existing) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  const body = await req.json()
  const {
    opponentName, isHome, matchDate, round, competition, season,
    venue, status, homeScore, awayScore, coachNotesPre, coachNotesPost, weather,
  } = body

  const match = await prisma.match.update({
    where: { id: matchId },
    data: {
      ...(opponentName !== undefined && { opponentName: opponentName || null }),
      ...(isHome !== undefined && { isHome: Boolean(isHome) }),
      ...(matchDate !== undefined && { matchDate: new Date(matchDate) }),
      ...(round !== undefined && { round: round || null }),
      ...(competition !== undefined && { competition: competition || null }),
      ...(season !== undefined && { season }),
      ...(venue !== undefined && { venue: venue || null }),
      ...(status !== undefined && { status }),
      ...(homeScore !== undefined && { homeScore: Number(homeScore) }),
      ...(awayScore !== undefined && { awayScore: Number(awayScore) }),
      ...(coachNotesPre !== undefined && { coachNotesPre: coachNotesPre || null }),
      ...(coachNotesPost !== undefined && { coachNotesPost: coachNotesPost || null }),
      ...(weather !== undefined && { weather: weather || null }),
    },
  })

  return NextResponse.json(match)
}

// DELETE /api/fixtures/[matchId]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> }
) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { matchId } = await params
  const existing = await prisma.match.findFirst({ where: { id: matchId, userClubId: clubId } })
  if (!existing) return NextResponse.json({ error: 'Partido no encontrado' }, { status: 404 })

  await prisma.match.delete({ where: { id: matchId } })
  return NextResponse.json({ success: true })
}
