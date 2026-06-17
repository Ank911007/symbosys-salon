/**
 * Middleware to enforce a strict timeout on all API requests.
 * Prevents requests from hanging indefinitely if downstream services (like DB) are unresponsive.
 * 
 * Uses a single timer with proper cleanup to avoid double-response bugs.
 */
function requestTimeout(timeoutMs = 10000) {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({
          success: false,
          message: 'Gateway Timeout: The request took too long to process.',
        });
      }
    }, timeoutMs);

    // Clean up the timer when the response completes or closes
    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    next();
  };
}

module.exports = requestTimeout;
