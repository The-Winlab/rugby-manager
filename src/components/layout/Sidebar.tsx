'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import RugbyLogo from '@/components/ui/RugbyLogo'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/squad', icon: Users, label: 'Plantel' },
  { href: '/fixtures', icon: Calendar, label: 'Fixtures' },
  { href: '/stats/team', icon: BarChart3, label: 'Estadísticas' },
  { href: '/settings', icon: Settings, label: 'Configuración' },
]

interface SidebarProps {
  clubName?: string
  clubShortName?: string
  clubLogoUrl?: string | null
  clubPrimaryColor?: string
  clubSecondaryColor?: string
}

export default function Sidebar({
  clubName,
  clubShortName,
  clubLogoUrl,
  clubPrimaryColor = '#2A3A5C',
  clubSecondaryColor = '#FFFFFF',
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-[#1A2744] border-r border-[#2A3A5C] flex flex-col z-50">
      {/* Logo / Club */}
      <div className="px-4 py-5 border-b border-[#2A3A5C]">
        <div className="flex items-center gap-3">
          {clubLogoUrl ? (
            <img
              src={clubLogoUrl}
              alt={clubShortName ?? clubName ?? 'Club'}
              className="w-9 h-9 rounded-lg object-contain flex-shrink-0 bg-white/5"
            />
          ) : clubShortName ? (
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: clubPrimaryColor, color: clubSecondaryColor }}
            >
              {clubShortName.slice(0, 3).toUpperCase()}
            </div>
          ) : (
            <RugbyLogo size={36} className="flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate leading-tight">
              {clubName ?? 'Rugby Manager'}
            </p>
            <p className="text-[#5A6A85] text-xs">URBA</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#00D68F]/15 text-[#00D68F]'
                  : 'text-[#8A9BB5] hover:text-white hover:bg-[#243558]'
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#2A3A5C]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8A9BB5] hover:text-[#FF4757] hover:bg-[#FF4757]/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
