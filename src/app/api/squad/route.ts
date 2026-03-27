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

// GET /api/squad — list players
export async function GET(request: NextRequest) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const position = searchParams.get('position')
  const status = searchParams.get('status')

  const players = await prisma.player.findMany({
    where: {
      clubId,
      ...(position ? { primaryPosition: position } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: [{ jerseyNumber: 'asc' }, { fullName: 'asc' }],
  })

  return NextResponse.json(players)
}

// POST /api/squad — create player
export async function POST(request: NextRequest) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    fullName, jerseyNumber, dateOfBirth, primaryPosition,
    altPosition, status, availableFrom, notes, photoUrl,
  } = body

  if (!fullName) return NextResponse.json({ error: 'fullName requerido' }, { status: 400 })

  const player = await prisma.player.create({
    data: {
      clubId,
      fullName,
      jerseyNumber: jerseyNumber ? Number(jerseyNumber) : null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      primaryPosition: primaryPosition || null,
      altPosition: altPosition || null,
      status: status || 'available',
      availableFrom: availableFrom ? new Date(availableFrom) : null,
      notes: notes || null,
      photoUrl: photoUrl || null,
    },
  })

  return NextResponse.json(player, { status: 201 })
}
