export const RUGBY_POSITIONS = [
  { value: '1', label: '1 - Pilar Izquierdo' },
  { value: '2', label: '2 - Hooker' },
  { value: '3', label: '3 - Pilar Derecho' },
  { value: '4', label: '4 - Segunda Línea' },
  { value: '5', label: '5 - Segunda Línea' },
  { value: '6', label: '6 - Ala Flanker' },
  { value: '7', label: '7 - Open Flanker' },
  { value: '8', label: '8 - Octavo' },
  { value: '9', label: '9 - Medio Scrum' },
  { value: '10', label: '10 - Apertura' },
  { value: '11', label: '11 - Wing Izquierdo' },
  { value: '12', label: '12 - Centro' },
  { value: '13', label: '13 - Centro' },
  { value: '14', label: '14 - Wing Derecho' },
  { value: '15', label: '15 - Fullback' },
]

export const POSITION_GROUPS: Record<string, { label: string; positions: string[] }> = {
  forwards: { label: 'Forwards', positions: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  backs: { label: 'Backs', positions: ['9', '10', '11', '12', '13', '14', '15'] },
}

export const PLAYER_STATUSES = [
  { value: 'available', label: 'Disponible', color: 'text-green-400' },
  { value: 'injured', label: 'Lesionado', color: 'text-red-400' },
  { value: 'suspended', label: 'Suspendido', color: 'text-yellow-400' },
]

export function getPositionLabel(value: string): string {
  return RUGBY_POSITIONS.find((p) => p.value === value)?.label ?? `#${value}`
}

export function getStatusConfig(value: string) {
  return PLAYER_STATUSES.find((s) => s.value === value) ?? PLAYER_STATUSES[0]
}

export const MATCH_STATUSES = [
  { value: 'upcoming', label: 'Próximo', color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  { value: 'completed', label: 'Jugado', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
]

export function getMatchStatusConfig(value: string) {
  return MATCH_STATUSES.find((s) => s.value === value) ?? MATCH_STATUSES[0]
}

export const MATCH_EVENT_TYPES = [
  { value: 'try', label: 'Try', points: 5, color: 'text-green-400', hasPlayer: true, hasSubPlayer: false },
  { value: 'conversion', label: 'Conversión', points: 2, color: 'text-emerald-400', hasPlayer: true, hasSubPlayer: false },
  { value: 'penalty_goal', label: 'Penal', points: 3, color: 'text-blue-400', hasPlayer: true, hasSubPlayer: false },
  { value: 'drop_goal', label: 'Drop', points: 3, color: 'text-cyan-400', hasPlayer: true, hasSubPlayer: false },
  { value: 'yellow_card', label: 'Amarilla', points: 0, color: 'text-yellow-400', hasPlayer: true, hasSubPlayer: false },
  { value: 'red_card', label: 'Roja', points: 0, color: 'text-red-400', hasPlayer: true, hasSubPlayer: false },
  { value: 'substitution', label: 'Cambio', points: 0, color: 'text-slate-400', hasPlayer: true, hasSubPlayer: true },
]

export function getEventTypeConfig(value: string) {
  return MATCH_EVENT_TYPES.find((e) => e.value === value)
}

export const SEASONS = ['2026', '2025', '2024', '2023']

export const COMPETITIONS = [
  'URBA Primera División',
  'URBA Segunda División',
  'URBA Tercera División',
  'URBA Cuarta División',
  'Copa URBA',
  'Amistoso',
]

export const STARTER_POSITIONS = RUGBY_POSITIONS // positions 1-15
export const RESERVE_SLOTS = [
  { value: '16', label: 'Banco 16' },
  { value: '17', label: 'Banco 17' },
  { value: '18', label: 'Banco 18' },
  { value: '19', label: 'Banco 19' },
  { value: '20', label: 'Banco 20' },
  { value: '21', label: 'Banco 21' },
  { value: '22', label: 'Banco 22' },
  { value: '23', label: 'Banco 23' },
]
