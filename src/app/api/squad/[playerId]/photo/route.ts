import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.userProfile.findUnique({ where: { id: user.id } })
  if (!profile?.clubId) return NextResponse.json({ error: 'No club' }, { status: 403 })

  const { playerId } = await params
  const player = await prisma.player.findFirst({ where: { id: playerId, clubId: profile.clubId } })
  if (!player) return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 })

  const formData = await request.formData()
  const file = formData.get('photo') as File | null
  if (!file) return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 400 })

  // Validate type & size (max 2MB)
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se permiten imágenes' }, { status: 400 })
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'La imagen no puede superar 2MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `players/${profile.clubId}/${playerId}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('player-photos')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('player-photos')
    .getPublicUrl(path)

  const updated = await prisma.player.update({
    where: { id: playerId },
    data: { photoUrl: publicUrl },
  })

  return NextResponse.json({ photoUrl: updated.photoUrl })
}
