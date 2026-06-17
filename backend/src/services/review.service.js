const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

/**
 * Add a review for a salon and recalculate the salon's aggregate rating.
 * This is the single source of truth for rating recalculation logic.
 *
 * @param {{ salonId: string, name: string, email: string, phone?: string, rating: number, comment?: string }} data
 * @returns {Promise<object>} The created review
 */
async function addReview({ salonId, name, email, phone, rating, comment }) {
  return prisma.$transaction(async (tx) => {
    // 1. Upsert the guest customer
    const customer = await tx.customer.upsert({
      where: { phone: phone || `guest_${Date.now()}` },
      update: { name, email },
      create: { email, name, phone: phone || `guest_${Date.now()}` },
    });

    // 2. Create the new review (default isApproved is false)
    const newReview = await tx.review.create({
      data: { rating, comment, salonId, customer_id: customer.id },
    });

    // 3. Recalculate aggregate rating from APPROVED reviews only
    await recalculateSalonRating(tx, salonId);

    return newReview;
  });
}

/**
 * Update review approval status and recalculate salon rating.
 *
 * @param {{ reviewId: string, salonId: string, isApproved: boolean }} data
 * @returns {Promise<object>} The updated review
 */
async function updateReviewApproval({ reviewId, salonId, isApproved }) {
  return prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: { isApproved },
      include: { customers: { select: { name: true, email: true } } },
    });

    // Recalculate using the same centralized logic
    await recalculateSalonRating(tx, salonId);

    return updatedReview;
  });
}

/**
 * Recalculate a salon's average rating and total review count.
 * Must be called within a Prisma transaction context (tx).
 *
 * @param {import('@prisma/client').Prisma.TransactionClient} tx
 * @param {string} salonId
 */
async function recalculateSalonRating(tx, salonId) {
  const agg = await tx.review.aggregate({
    where: { salonId, isApproved: true },
    _avg: { rating: true },
    _count: { id: true },
  });

  await tx.salon.update({
    where: { id: salonId },
    data: {
      rating: agg._avg.rating || 0,
      totalReviews: agg._count.id,
    },
  });
}

module.exports = { addReview, updateReviewApproval, recalculateSalonRating };
