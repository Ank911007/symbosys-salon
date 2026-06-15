require('dotenv').config();
const prisma = require('./src/config/prisma');

async function run() {
  try {
    const seededNames = [
      "Valentino X Family Salon",
      "Page 3 Luxury Salon & Makeover Studio",
      "Cheveux Vuitton | Family Salon and SPA",
      "F Salon Ranchi by FTV",
      "Naturals Salon",
      "Lotus Salon Ranchi",
      "Looks Salon – Best Unisex Salon in Ranchi"
    ];

    const result = await prisma.salon.deleteMany({
      where: { name: { in: seededNames } }
    });
    console.log(`Deleted ${result.count} seeded salons.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
