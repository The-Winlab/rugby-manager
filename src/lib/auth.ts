import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const getAuthUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export const getAuthProfile = cache(async () => {
  const user = await getAuthUser()
  if (!user) return null
  return prisma.userProfile.findUnique({
    where: { id: user.id },
    include: { club: true },
  })
})
