import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const urbaClubs = [
  { name: 'Alumni Athletic Club', shortName: 'Alumni', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'Banco Nación', shortName: 'Banco Nación', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'Belgrano Athletic Club', shortName: 'Belgrano', primaryColor: '#CC0000', secondaryColor: '#FFFFFF' },
  { name: 'Buenos Aires Cricket & Rugby Club', shortName: 'BACRC', primaryColor: '#003082', secondaryColor: '#CC0000' },
  { name: 'Champagnat', shortName: 'Champagnat', primaryColor: '#009B3A', secondaryColor: '#FFFFFF' },
  { name: 'Club Atletico del Rosario', shortName: 'CAR', primaryColor: '#003082', secondaryColor: '#FFCC00' },
  { name: 'Curupayti', shortName: 'Curupayti', primaryColor: '#CC0000', secondaryColor: '#FFFFFF' },
  { name: 'Del Libertador', shortName: 'Del Libertador', primaryColor: '#009B3A', secondaryColor: '#FFFFFF' },
  { name: 'Delta RC', shortName: 'Delta', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'El Nacional', shortName: 'El Nacional', primaryColor: '#003082', secondaryColor: '#FFCC00' },
  { name: 'Estudiantes de Buenos Aires', shortName: 'Estudiantes', primaryColor: '#CC0000', secondaryColor: '#000000' },
  { name: 'Gimnasia y Esgrima de Buenos Aires', shortName: 'GEBA', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'Hindu Club', shortName: 'Hindu', primaryColor: '#009B3A', secondaryColor: '#FFFFFF' },
  { name: 'LICEO', shortName: 'LICEO', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'Los Matreros', shortName: 'Los Matreros', primaryColor: '#CC0000', secondaryColor: '#FFFFFF' },
  { name: 'Los Tilos', shortName: 'Los Tilos', primaryColor: '#009B3A', secondaryColor: '#FFFFFF' },
  { name: 'Manuel Belgrano', shortName: 'Manuel Belgrano', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'Natacion y Gimnasia', shortName: 'Natación', primaryColor: '#CC0000', secondaryColor: '#FFFFFF' },
  { name: 'Newman', shortName: 'Newman', primaryColor: '#003082', secondaryColor: '#FFCC00' },
  { name: 'Old Boys', shortName: 'Old Boys', primaryColor: '#009B3A', secondaryColor: '#000000' },
  { name: 'Old Christians', shortName: 'Old Christians', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'Old Georgian RC', shortName: 'Old Georgian', primaryColor: '#CC0000', secondaryColor: '#003082' },
  { name: 'Old Resian', shortName: 'Old Resian', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'Olivos RC', shortName: 'Olivos', primaryColor: '#009B3A', secondaryColor: '#FFFFFF' },
  { name: 'PUCARÁ', shortName: 'Pucará', primaryColor: '#CC0000', secondaryColor: '#FFFFFF' },
  { name: 'Regatas Bella Vista', shortName: 'Regatas', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'Richmond RC', shortName: 'Richmond', primaryColor: '#009B3A', secondaryColor: '#000000' },
  { name: 'San Albano', shortName: 'San Albano', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'San Andrés', shortName: 'San Andrés', primaryColor: '#CC0000', secondaryColor: '#FFFFFF' },
  { name: 'San Cirano', shortName: 'San Cirano', primaryColor: '#003082', secondaryColor: '#FFCC00' },
  { name: 'San Luis', shortName: 'San Luis', primaryColor: '#009B3A', secondaryColor: '#FFFFFF' },
  { name: 'San Patricio', shortName: 'San Patricio', primaryColor: '#009B3A', secondaryColor: '#FFFFFF' },
  { name: 'SIC – San Isidro Club', shortName: 'SIC', primaryColor: '#CC0000', secondaryColor: '#003082' },
  { name: 'Tala RC', shortName: 'Tala', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
  { name: 'USAM', shortName: 'USAM', primaryColor: '#CC0000', secondaryColor: '#FFFFFF' },
  { name: 'ZAR RC', shortName: 'ZAR', primaryColor: '#003082', secondaryColor: '#FFFFFF' },
]

async function main() {
  console.log('Seeding URBA clubs...')

  // Delete existing URBA clubs and re-seed for idempotency
  await prisma.club.deleteMany({ where: { isUrbaClub: true } })

  await prisma.club.createMany({
    data: urbaClubs.map((club) => ({
      name: club.name,
      shortName: club.shortName,
      primaryColor: club.primaryColor,
      secondaryColor: club.secondaryColor,
      isUrbaClub: true,
    })),
  })

  console.log(`Seeded ${urbaClubs.length} URBA clubs successfully.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
