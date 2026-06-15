/**
 * Middleware to log requests taking longer than a specified threshold.
 */
function requestTiming(thresholdMs = 200) {
  return (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
      const diff = process.hrtime(start);
      const timeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

      if (timeMs > thresholdMs) {
        console.warn(`[SLOW ROUTE] ${req.method} ${req.originalUrl} took ${timeMs}ms`);
      }
    });

    next();
  };
}

module.exports = requestTiming;
