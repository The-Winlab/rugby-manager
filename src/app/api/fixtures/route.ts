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

// GET /api/fixtures
export async function GET(request: NextRequest) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const season = searchParams.get('season')

  const matches = await prisma.match.findMany({
    where: {
      userClubId: clubId,
      ...(status ? { status } : {}),
      ...(season ? { season } : {}),
    },
    include: {
      opponent: { select: { name: true, shortName: true, primaryColor: true, secondaryColor: true } },
    },
    orderBy: { matchDate: 'desc' },
  })

  return NextResponse.json(matches)
}

// POST /api/fixtures
export async function POST(request: NextRequest) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { opponentId, opponentName, isHome, matchDate, round, competition, season, venue, coachNotesPre } = body

  if (!matchDate || !season) {
    return NextResponse.json({ error: 'matchDate y season son requeridos' }, { status: 400 })
  }
  if (!opponentId && !opponentName) {
    return NextResponse.json({ error: 'Debe especificar un rival' }, { status: 400 })
  }

  const match = await prisma.match.create({
    data: {
      userClubId: clubId,
      opponentId: opponentId || null,
      opponentName: opponentName || null,
      isHome: Boolean(isHome),
      matchDate: new Date(matchDate),
      round: round || null,
      competition: competition || null,
      season,
      venue: venue || null,
      coachNotesPre: coachNotesPre || null,
      status: 'upcoming',
    },
  })

  return NextResponse.json(match, { status: 201 })
}
