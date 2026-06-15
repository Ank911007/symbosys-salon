require('dotenv').config();
const prisma = require('./src/config/prisma');
async function test() {
  const salons = await prisma.salon.findMany({ select: { salonAddress: true } });
  console.log(salons);
  await prisma.$disconnect();
}
test();
