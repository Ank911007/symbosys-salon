const prisma = require('./src/config/prisma');
async function main() {
  const salons = await prisma.salon.findMany();
  console.log(salons.map(s => ({id: s.id, name: s.name, openTime: s.openTime, closeTime: s.closeTime, closedDates: s.closedDates})));
}
main().finally(() => process.exit(0));
