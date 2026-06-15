/**
 * Middleware to add Cache-Control headers for read-heavy endpoints.
 */
function cacheHeaders(maxAgeSeconds = 300) {
  return (req, res, next) => {
    // Only apply cache to GET requests
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', `public, max-age=${maxAgeSeconds}`);
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }
    next();
  };
}

module.exports = cacheHeaders;
