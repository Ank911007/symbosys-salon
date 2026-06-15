/**
 * Middleware to enforce a strict timeout on all API requests.
 * Prevents requests from hanging indefinitely if downstream services (like DB) are unresponsive.
 */
function requestTimeout(timeoutMs = 10000) {
  return (req, res, next) => {
    // Set timeout on the socket
    req.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          message: 'Gateway Timeout: The request took too long to process.',
        });
      }
    });

    // Also use setTimeout to abort the handler explicitly if possible
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          message: 'Gateway Timeout: The request took too long to process.',
        });
      }
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    next();
  };
}

module.exports = requestTimeout;
