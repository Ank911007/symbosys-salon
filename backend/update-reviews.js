require('dotenv').config();
const prisma = require('./src/config/prisma');

async function main() {
  const reviews = await prisma.review.findMany();
  console.log("Current reviews length:", reviews.length);
  
  if (reviews.length > 0) {
    console.log("Sample review isApproved status:", reviews[0].isApproved);
  }

  // Update existing reviews to be approved so they don't disappear
  await prisma.review.updateMany({
    data: { isApproved: true }
  });

  console.log("Updated all existing reviews to isApproved: true");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
