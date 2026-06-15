require('dotenv').config();
const prisma = require('./src/config/prisma');

async function run() {
  try {
    const result = await prisma.salon.updateMany({
      where: { lat: 0, lng: 0 },
      data: { lat: 23.3441, lng: 85.3096 }
    });
    console.log(`Updated ${result.count} salons.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
