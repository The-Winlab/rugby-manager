export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getAuthUser, getAuthProfile } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')

  const profile = await getAuthProfile()
  if (!profile?.clubId) redirect('/onboarding/club-selection')

  const club = profile.club

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F1923]">
      <Sidebar
        clubName={club?.name}
        clubShortName={club?.shortName ?? undefined}
        clubLogoUrl={club?.logoUrl ?? undefined}
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
