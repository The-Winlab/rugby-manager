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

// GET /api/squad/[playerId]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { playerId } = await params
  const player = await prisma.player.findFirst({
    where: { id: playerId, clubId },
    include: {
      ratings: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { match: { select: { matchDate: true, competition: true, opponentName: true } } },
      },
    },
  })

  if (!player) return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 })
  return NextResponse.json(player)
}

// PUT /api/squad/[playerId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { playerId } = await params
  const existing = await prisma.player.findFirst({ where: { id: playerId, clubId } })
  if (!existing) return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 })

  const body = await request.json()
  const {
    fullName, jerseyNumber, dateOfBirth, primaryPosition,
    altPosition, status, availableFrom, notes, photoUrl,
  } = body

  const player = await prisma.player.update({
    where: { id: playerId },
    data: {
      fullName: fullName || existing.fullName,
      jerseyNumber: jerseyNumber !== undefined ? (jerseyNumber ? Number(jerseyNumber) : null) : existing.jerseyNumber,
      dateOfBirth: dateOfBirth !== undefined ? (dateOfBirth ? new Date(dateOfBirth) : null) : existing.dateOfBirth,
      primaryPosition: primaryPosition !== undefined ? primaryPosition || null : existing.primaryPosition,
      altPosition: altPosition !== undefined ? altPosition || null : existing.altPosition,
      status: status || existing.status,
      availableFrom: availableFrom !== undefined ? (availableFrom ? new Date(availableFrom) : null) : existing.availableFrom,
      notes: notes !== undefined ? notes || null : existing.notes,
      photoUrl: photoUrl !== undefined ? photoUrl || null : existing.photoUrl,
    },
  })

  return NextResponse.json(player)
}

// DELETE /api/squad/[playerId]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const clubId = await getClubId()
  if (!clubId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { playerId } = await params
  const existing = await prisma.player.findFirst({ where: { id: playerId, clubId } })
  if (!existing) return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 })

  await prisma.player.delete({ where: { id: playerId } })
  return NextResponse.json({ success: true })
}
