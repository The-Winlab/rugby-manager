export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getAuthUser, getAuthProfile } from '@/lib/auth'
import { Shield, User, Building2, Info } from 'lucide-react'

export default async function SettingsPage() {
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')

  const profile = await getAuthProfile()
  if (!profile?.club) redirect('/onboarding/club-selection')

  const club = profile.club

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="text-[#8A9BB5] text-sm mt-1">Tu cuenta y preferencias</p>
      </div>

      {/* User info */}
      <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2A3A5C] flex items-center gap-2">
          <User className="w-4 h-4 text-[#00D68F]" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Cuenta</h2>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <p className="text-xs text-[#5A6A85] mb-1">Email</p>
            <p className="text-sm text-white">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-[#5A6A85] mb-1">ID de usuario</p>
            <p className="text-xs text-[#8A9BB5] font-mono">{user.id}</p>
          </div>
        </div>
      </div>

      {/* Club info */}
      <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2A3A5C] flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#00D68F]" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Club</h2>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-3">
            {club.logoUrl ? (
              <img
                src={club.logoUrl}
                alt={club.name}
                className="w-10 h-10 object-contain rounded-lg bg-white/5"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: club.primaryColor ?? '#2A3A5C',
                  color: club.secondaryColor ?? '#FFFFFF',
                }}
              >
                {(club.shortName ?? club.name).slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-white">{club.name}</p>
              {club.division && (
                <p className="text-xs text-[#8A9BB5]">{club.division}</p>
              )}
            </div>
          </div>
          {club.groundName && (
            <div>
              <p className="text-xs text-[#5A6A85] mb-1">Estadio</p>
              <p className="text-sm text-white">{club.groundName}</p>
            </div>
          )}
          {club.foundedYear && (
            <div>
              <p className="text-xs text-[#5A6A85] mb-1">Fundado</p>
              <p className="text-sm text-white">{club.foundedYear}</p>
            </div>
          )}
        </div>
      </div>

      {/* App info */}
      <div className="bg-[#1E2D4A] border border-[#2A3A5C] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2A3A5C] flex items-center gap-2">
          <Info className="w-4 h-4 text-[#00D68F]" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Aplicación</h2>
        </div>
        <div className="px-5 py-4 space-y-2">
          <div className="flex justify-between">
            <p className="text-xs text-[#5A6A85]">Rugby Manager</p>
            <p className="text-xs text-[#8A9BB5]">URBA Edition</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Shield className="w-4 h-4 text-[#00D68F]" />
            <p className="text-xs text-[#5A6A85]">Unión de Rugby de Buenos Aires</p>
          </div>
        </div>
      </div>
    </div>
  )
}
