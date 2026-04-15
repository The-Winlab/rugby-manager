'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function selectClub(clubId: string): Promise<
  { ok: true; clubName: string } | { ok: false; error: string }
> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { ok: false, error: `No autenticado: ${authError?.message ?? 'sin sesión'}` }
    }

    const club = await prisma.club.findUnique({ where: { id: clubId } })
    if (!club) {
      return { ok: false, error: `Club no encontrado: ${clubId}` }
    }

    await prisma.userProfile.upsert({
      where: { id: user.id },
      create: { id: user.id, clubId },
      update: { clubId },
    })

    return { ok: true, clubName: club.name }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}
