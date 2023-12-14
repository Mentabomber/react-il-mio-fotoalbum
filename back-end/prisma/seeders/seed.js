const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
// creazione categorie di base
    const animali = await prisma.category.upsert({
        where: { type: 'Animali' },
        update: {},
        create: {
          type: 'Animali',
          description: 'Foto di animali carini',
        },
    })
    const viaggi = await prisma.category.upsert({
        where: { type: 'Viaggi' },
        update: {},
        create: {
          type: 'Viaggi',
          description: 'Foto viaggi',
        },
    })
    const cibo = await prisma.category.upsert({
        where: { type: 'Cibo' },
        update: {},
        create: {
          type: 'Cibo',
          description: 'Foto di cibo',
        },
    })



// creazione superadmin
    const Tilen = await prisma.user.upsert({
        where: { email: 'tilen.simcic@mail.com' },
        update: {},
        create: {
        email: 'tilen.simcic@mail.com',
        name: 'Tilen',
        surname: 'Simcic',
        Photo: {
            create: [
            {
                title: 'Foto 1',
                description: 'Descrizione della Foto 1',
                published: true,
                image: 'foto1.jpg',
                categories: {
                  connect: {
                    id: animali.id,
                  },
                },
            },
            {
                title: 'Foto 2',
                description: 'Descrizione della Foto 2',
                published: true,
                image: 'foto2.jpg',
                categories: {
                  connect: {
                    id: viaggi.id,
                  },
                },
              },
            ]
        },
        role: 'superadmin',
        password: 'ciao'
        },
    })

    console.log({ Tilen , animali , viaggi , cibo , })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })