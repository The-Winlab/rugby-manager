import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const WIKI = 'https://en.wikipedia.org/wiki/Special:FilePath/'
const URBA = 'https://urbaweb-659150f8efd973a5-endpoint.azureedge.net/wp-content/uploads/'

const urbaClubs = [
  // TOP 14 (2026)
  { name: 'Newman', shortName: 'Newman', division: 'Top 14', primaryColor: '#6B0A2C', secondaryColor: '#F5A623', logoUrl: `${WIKI}Club_Newman_rugby.svg` },
  { name: 'San Isidro Club', shortName: 'SIC', division: 'Top 14', primaryColor: '#000080', secondaryColor: '#87CEEB', logoUrl: `${WIKI}CA_san_isidro_logo.svg` },
  { name: 'Hindú Club', shortName: 'Hindú', division: 'Top 14', primaryColor: '#00843D', secondaryColor: '#C8102E', logoUrl: `${WIKI}Hindu_club_logo.svg` },
  { name: 'CASI', shortName: 'CASI', division: 'Top 14', primaryColor: '#000000', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Escudo_de_Club_Atl%C3%A9tico_San_Isidro.svg` },
  { name: 'Belgrano Athletic Club', shortName: 'Belgrano', division: 'Top 14', primaryColor: '#6B3A2A', secondaryColor: '#DAA520', logoUrl: `${WIKI}Escudo_de_Belgrano_Athletic_Club.svg` },
  { name: 'Alumni Athletic Club', shortName: 'Alumni', division: 'Top 14', primaryColor: '#CC0000', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Alumni_rugby_logo.svg` },
  { name: 'Club de Regatas Bella Vista', shortName: 'Regatas', division: 'Top 14', primaryColor: '#003399', secondaryColor: '#FFD700', logoUrl: `${WIKI}Regatas_BV_flaglogo.svg` },
  { name: 'CUBA', shortName: 'CUBA', division: 'Top 14', primaryColor: '#000080', secondaryColor: '#000000', logoUrl: `${URBA}2024/03/CUBA.png` },
  { name: 'Buenos Aires Cricket & Rugby Club', shortName: 'BACRC', division: 'Top 14', primaryColor: '#002366', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Buenos-Aires-CRC.png` },
  { name: 'La Plata Rugby Club', shortName: 'La Plata', division: 'Top 14', primaryColor: '#003082', secondaryColor: '#FFCC00', logoUrl: `${WIKI}La_Plata_Rugby_Club_Crest.svg` },
  { name: 'Los Tilos', shortName: 'Los Tilos', division: 'Top 14', primaryColor: '#228B22', secondaryColor: '#FFD700', logoUrl: `${WIKI}Los_tilos_rugby_logo.png` },
  { name: 'Atlético del Rosario', shortName: 'At. Rosario', division: 'Top 14', primaryColor: '#87CEEB', secondaryColor: '#C0392B', logoUrl: `${WIKI}Atlet_rosario_logo.svg` },
  { name: 'Los Matreros', shortName: 'Matreros', division: 'Top 14', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Los_matreros_rc_logo.png` },
  { name: 'Champagnat', shortName: 'Champagnat', division: 'Top 14', primaryColor: '#003399', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Club-Champagnat.png` },

  // PRIMERA A (2026)
  { name: 'San Luis', shortName: 'San Luis', division: 'Primera A', primaryColor: '#002366', secondaryColor: '#FFD700', logoUrl: `${WIKI}San_luis_rugby_logo.svg` },
  { name: 'Pueyrredón', shortName: 'Pueyrredón', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Pueyrredon.png` },
  { name: 'San Cirano', shortName: 'San Cirano', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFCC00', logoUrl: `${URBA}2019/02/SC-escudo.png` },
  { name: 'Club Pucará', shortName: 'Pucará', division: 'Primera A', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Pucara.png` },
  { name: 'Hurling Club', shortName: 'Hurling', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Hurling.png` },
  { name: 'Curupaytí', shortName: 'Curupaytí', division: 'Primera A', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Club_curupayti_rugby_logo.png` },
  { name: 'San Andrés', shortName: 'San Andrés', division: 'Primera A', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/San-Andres.png` },
  { name: 'Lomas Athletic', shortName: 'Lomas', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Lomas-Athletic-128x128-1.png` },
  { name: 'Deportiva Francesa', shortName: 'Dep. Francesa', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2025/07/Logo-ADF-.png` },
  { name: 'Olivos RC', shortName: 'Olivos', division: 'Primera A', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Olivos_Rugby_Club_(logo).svg` },
  { name: 'Universitario de La Plata', shortName: 'Univ. LP', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Universitario-de-La-Plata.png` },
  { name: 'San Albano', shortName: 'San Albano', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/San-Albano-Logo-OPC-dark-268x300-1.png` },
  { name: 'GEBA', shortName: 'GEBA', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Escudo_GEBA.png` },
  { name: 'San Fernando', shortName: 'San Fernando', division: 'Primera A', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/San-Fernando.png` },

  // PRIMERA B (2026)
  { name: 'CUQ', shortName: 'CUQ', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/07/cudequilmes.png` },
  { name: 'Liceo Naval', shortName: 'Liceo', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Liceo-Naval.png` },
  { name: 'San Martín RC', shortName: 'San Martín', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Club_san_martin_logo.png` },
  { name: 'San Patricio', shortName: 'San Patricio', division: 'Primera B', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Sanpatricio_rugbylogo.png` },
  { name: 'Mariano Moreno', shortName: 'Mar. Moreno', division: 'Primera B', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Mariano-Moreno.png` },
  { name: 'Delta RC', shortName: 'Delta', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Delta-Rugby-Club.png` },
  { name: 'Club Argentino de Rugby', shortName: 'Argentino', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Club_argentino_rugby_logo.png` },
  { name: 'Don Bosco', shortName: 'Don Bosco', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFCC00', logoUrl: `${URBA}2024/03/Don-Bosco.png` },
  { name: 'Banco Nación', shortName: 'Banco Nación', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Banco-Nacion.png` },
  { name: 'Manuel Belgrano', shortName: 'M. Belgrano', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Escudo_del_Club_Manuel_Belgrano.svg` },
  { name: 'Club Italiano', shortName: 'Club Italiano', division: 'Primera B', primaryColor: '#00843D', secondaryColor: '#C8102E', logoUrl: `${URBA}2024/03/Club-Italiano.png` },
  { name: 'Vicentinos', shortName: 'Vicentinos', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Escudo_Vicentinos.png` },
  { name: 'Monte Grande', shortName: 'Monte Grande', division: 'Primera B', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Monte_grande_rc_logo.png` },
  { name: 'Liceo Militar', shortName: 'Liceo Militar', division: 'Primera B', primaryColor: '#003082', secondaryColor: '#FFD700', logoUrl: `${URBA}2024/05/liceomilitar.png` },

  // PRIMERA C (2026)
  { name: 'Luján RC', shortName: 'Luján', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Lujan_rc_logo.png` },
  { name: 'San Carlos', shortName: 'San Carlos', division: 'Primera C', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/San-Carlos.png` },
  { name: 'Centro Naval', shortName: 'Centro Naval', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2025/06/EscudoCN-color.png` },
  { name: 'SITAS', shortName: 'SITAS', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/SITAS.png` },
  { name: 'Lanús RC', shortName: 'Lanús', division: 'Primera C', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Asociacion-Lanus-Rugby.png` },
  { name: 'DAOM', shortName: 'DAOM', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#C8102E', logoUrl: `${WIKI}Daom_badge_copia.png` },
  { name: 'Ciudad de Buenos Aires RC', shortName: 'CABA RC', division: 'Primera C', primaryColor: '#FFCC00', secondaryColor: '#003082', logoUrl: `${URBA}2024/03/Escudo-Club-Ciudad-2000-.png` },
  { name: 'Areco RC', shortName: 'Areco', division: 'Primera C', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Logo-Institucional-4.jpeg` },
  { name: 'Club Virreyes', shortName: 'Virreyes', division: 'Primera C', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Virreyes-Rugby-Club.png` },
  { name: "Saint Brendan's", shortName: "St. Brendan's", division: 'Primera C', primaryColor: '#00843D', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/stbrendans-275x300-1.png` },
  { name: 'CASA de Padua', shortName: 'CASA Padua', division: 'Primera C', primaryColor: '#C8102E', secondaryColor: '#FFFFFF', logoUrl: `${WIKI}Casa_padua_logo.png` },
  { name: 'Del Sur', shortName: 'Del Sur', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/Asociacion-Del-Sur.png` },
  { name: 'Los Molinos', shortName: 'Los Molinos', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/los-molinos.png` },
  { name: 'San Miguel RC', shortName: 'San Miguel', division: 'Primera C', primaryColor: '#003082', secondaryColor: '#FFFFFF', logoUrl: `${URBA}2024/03/San-Miguel.png` },
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

  const withLogo = urbaClubs.filter((c) => c.logoUrl !== null).length
  console.log(`Clubs con logo: ${withLogo}/${urbaClubs.length}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
