/**
 * StarRating — accessible star rating display.
 * Renders visual stars with aria-hidden and provides screen reader label.
 *
 * @param {number} rating - Number of filled stars
 * @param {number} max - Maximum stars (default: 5)
 */
export default function StarRating({ rating = 5, max = 5 }) {
  const stars = '★'.repeat(rating) + '☆'.repeat(max - rating);

  return (
    <span className="text-sage text-xs md:text-sm" role="img" aria-label={`${rating} out of ${max} stars`}>
      <span aria-hidden="true">{stars}</span>
    </span>
  );
}
