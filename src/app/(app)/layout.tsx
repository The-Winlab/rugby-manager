export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/layout/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const profile = await prisma.userProfile.findUnique({
    where: { id: user.id },
    include: { club: true },
  })

  if (!profile?.clubId) redirect('/onboarding/club-selection')

  const club = profile.club

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F1923]">
      <Sidebar
        clubName={club?.name}
        clubShortName={club?.shortName ?? undefined}
        clubPrimaryColor={club?.primaryColor ?? undefined}
        clubSecondaryColor={club?.secondaryColor ?? undefined}
      />

      {/* Main content */}
      <main className="flex-1 ml-56 overflow-y-auto">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
