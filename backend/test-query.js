require('dotenv').config();
const prisma = require('./src/config/prisma');
async function test() {
  try {
    const salons = await prisma.salon.findMany({
      where: { isOpen: true },
      select: {
        id: true,
        name: true,
        category: true,
        image: true,
        rating: true,
        totalReviews: true,
        salonAddress: {
          select: {
            address: true,
            lat: true,
            lng: true
          }
        },
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          }
        },
        reviews: {
          where: { isApproved: true },
          take: 3,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            customer: { select: { name: true } }
          }
        }
      }
    });
    console.log(JSON.stringify(salons, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
