/**
 * 404 handler for unmatched routes.
 * @type {import('express').RequestHandler}
 */
function notFound(req, res) {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: "Recurso no encontrado." },
  });
}

/**
 * Centralized error handler producing a consistent error envelope.
 * @type {import('express').ErrorRequestHandler}
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || (status === 502 ? "UPSTREAM_ERROR" : "INTERNAL_ERROR");

  if (status >= 500) {
    console.error(`[error] ${code}: ${err.message}`);
  }

  res.status(status).json({
    error: { code, message: err.message || "Error interno del servidor." },
  });
}

module.exports = { errorHandler, notFound };
