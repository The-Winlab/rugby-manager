import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const WIKI = 'https://en.wikipedia.org/wiki/Special:FilePath/'

const urbaClubs = [
  // TOP 12 (2025)
  { name: 'Newman', shortName: 'Newman', division: 'Top 12', primaryColor: '#C8102E', secondaryColor: '#000000', logoUrl: `${WIKI}Club_Newman_rugby.svg` },
  { name: 'San Isidro Club', shortName: 'SIC', division: 'Top 12', primaryColor: '#C8102E', secondaryColor: '#003082', logoUrl: `${WIKI}San_Isidro_Club.png` },
  { name: 'Hindú Club', shortName: 'Hindú', division: 'Top 12', primaryColor: '#00843D', secondaryColor: '#C8102E', logoUrl: `${WIKI}Hind%C3%BA_Club.png` },
  { name: 'CASI', shortName: 'CASI', division: 'Top 12', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Club_Atl%C3%A9tico_de_San_Isidro.png` },
  { name: 'Belgrano Athletic Club', shortName: 'Belgrano', division: 'Top 12', primaryColor: '#C8102E', secondaryColor: '#000000', logoUrl: `${WIKI}Belgrano_Athletic_Club_logo.png` },
  { name: 'Alumni Athletic Club', shortName: 'Alumni', division: 'Top 12', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Alumni_Athletic_Club_logo.png` },
  { name: 'Club de Regatas Bella Vista', shortName: 'Regatas', division: 'Top 12', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Regatas_bv_logo.png` },
  { name: 'CUBA', shortName: 'CUBA', division: 'Top 12', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Universitario_BA_logo.svg` },
  { name: 'Buenos Aires Cricket & Rugby Club', shortName: 'BACRC', division: 'Top 12', primaryColor: '#003082', secondaryColor: '#C8102E', logoUrl: `${WIKI}Buenos_Aires_CRC_Crest.svg` },
  { name: 'Club Pucará', shortName: 'Pucará', division: 'Top 12', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'La Plata Rugby Club', shortName: 'La Plata', division: 'Top 12', primaryColor: '#003082', secondaryColor: '#FFCC00', logoUrl: `${WIKI}La_Plata_Rugby_Club_Crest.svg` },
  { name: 'Los Tilos', shortName: 'Los Tilos', division: 'Top 12', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Los_tilos_rugby_logo.png` },

  // PRIMERA A
  { name: 'Los Matreros', shortName: 'Matreros', division: 'Primera A', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Los_matreros_rc_logo.png` },
  { name: 'Atlético del Rosario', shortName: 'CAR', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFCC00', logoUrl: `${WIKI}Atlet_rosario_logo.svg` },
  { name: 'Champagnat', shortName: 'Champagnat', division: 'Primera A', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'San Luis', shortName: 'San Luis', division: 'Primera A', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}San_luis_rugby_logo.svg` },
  { name: 'San Cirano', shortName: 'San Cirano', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFCC00', logoUrl: null },
  { name: 'Pueyrredón', shortName: 'Pueyrredón', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Banco Nación', shortName: 'Banco Nación', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Club Italiano', shortName: 'Club Italiano', division: 'Primera A', primaryColor: '#00843D', secondaryColor: '#C8102E', logoUrl: null },
  { name: 'Liceo Naval', shortName: 'Liceo', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'San Patricio', shortName: 'San Patricio', division: 'Primera A', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Sanpatricio_rugbylogo.png` },
  { name: 'Club Argentino de Rugby', shortName: 'Argentino', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Club_argentino_rugby_logo.png` },
  { name: 'Vicentinos', shortName: 'Vicentinos', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Escudo_Vicentinos.png` },
  { name: 'Don Bosco', shortName: 'Don Bosco', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFCC00', logoUrl: null },
  { name: 'Delta RC', shortName: 'Delta', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Manuel Belgrano', shortName: 'M. Belgrano', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Escudo_del_Club_Manuel_Belgrano.svg` },
  { name: 'Monte Grande', shortName: 'Monte Grande', division: 'Primera A', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Monte_grande_rc_logo.png` },

  // PRIMERA B
  { name: 'Old Christians', shortName: 'Old Christians', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Oldchristians_club_escudo.png` },
  { name: 'Old Georgian RC', shortName: 'Old Georgian', division: 'Primera B', primaryColor: '#C8102E', secondaryColor: '#003082', logoUrl: null },
  { name: 'Old Resian', shortName: 'Old Resian', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Olivos RC', shortName: 'Olivos', division: 'Primera B', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Olivos_Rugby_Club_(logo).svg` },
  { name: 'Richmond RC', shortName: 'Richmond', division: 'Primera B', primaryColor: '#00843D', secondaryColor: '#000000', logoUrl: null },
  { name: 'San Albano', shortName: 'San Albano', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'San Andrés', shortName: 'San Andrés', division: 'Primera B', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Estudiantes de Buenos Aires', shortName: 'Estudiantes', division: 'Primera B', primaryColor: '#C8102E', secondaryColor: '#000000', logoUrl: null },
  { name: 'Natación y Gimnasia', shortName: 'Natación', division: 'Primera B', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Natac_gimnasia_logo.svg` },
  { name: 'USAM', shortName: 'USAM', division: 'Primera B', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'ZAR RC', shortName: 'ZAR', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'GEBA', shortName: 'GEBA', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Escudo_GEBA.png` },
  { name: 'El Nacional', shortName: 'El Nacional', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFCC00', logoUrl: null },
  { name: 'Curupayti', shortName: 'Curupayti', division: 'Primera B', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Club_curupayti_rugby_logo.png` },

  // PRIMERA C
  { name: 'DAOM', shortName: 'DAOM', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#C8102E', logoUrl: `${WIKI}Club_DAOM.png` },
  { name: 'CASA de Padua', shortName: 'CASA Padua', division: 'Primera C', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Casa_padua_logo.png` },
  { name: 'Club Virreyes', shortName: 'Virreyes', division: 'Primera C', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'San Miguel RC', shortName: 'San Miguel', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Los Molinos', shortName: 'Los Molinos', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Centro Naval', shortName: 'Centro Naval', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Lanús RC', shortName: 'Lanús', division: 'Primera C', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: "Saint Brendan's", shortName: "St. Brendan's", division: 'Primera C', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Del Sur', shortName: 'Del Sur', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Areco RC', shortName: 'Areco', division: 'Primera C', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'SITAS', shortName: 'SITAS', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'San Carlos', shortName: 'San Carlos', division: 'Primera C', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Ciudad de Buenos Aires RC', shortName: 'CABA RC', division: 'Primera C', primaryColor: '#FFCC00', secondaryColor: '#003082', logoUrl: null },
  { name: 'Luján RC', shortName: 'Luján', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Lujan_rc_logo.png` },

  // PRIMERA D
  { name: 'Del Libertador', shortName: 'Del Libertador', division: 'Primera D', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'Old Boys', shortName: 'Old Boys', division: 'Primera D', primaryColor: '#00843D', secondaryColor: '#000000', logoUrl: null },
  { name: 'Tala RC', shortName: 'Tala', division: 'Primera D', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
  { name: 'San Martín RC', shortName: 'San Martín', division: 'Primera D', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: null },
]

async function main() {
  console.log('Seeding URBA clubs...')
  await prisma.club.deleteMany({ where: { isUrbaClub: true } })
  await prisma.club.createMany({
    data: urbaClubs.map((club) => ({
      name: club.name,
      shortName: club.shortName,
      primaryColor: club.primaryColor,
      secondaryColor: club.secondaryColor,
      logoUrl: club.logoUrl,
      division: club.division,
      isUrbaClub: true,
    })),
  })
  const byDiv: Record<string, number> = {}
  for (const c of urbaClubs) { byDiv[c.division] = (byDiv[c.division] ?? 0) + 1 }
  console.log(`Seeded ${urbaClubs.length} URBA clubs:`)
  for (const [div, count] of Object.entries(byDiv)) { console.log(`  ${div}: ${count}`) }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
