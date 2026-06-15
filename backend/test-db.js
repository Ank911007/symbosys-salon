require('dotenv').config();
const prisma = require('./src/config/prisma');
prisma.salon.findMany().then(s => console.log(JSON.stringify(s, null, 2))).finally(() => prisma.$disconnect());
