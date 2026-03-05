/**
 * Middleware: Limitador de Concurrencia
 * ─────────────────────────────────────
 * Limita el número de solicitudes que se procesan simultáneamente.
 * Si se alcanza el límite, responde con HTTP 503 (Service Unavailable).
 *
 * Configuración via variables de entorno:
 *   CONCURRENCY_LIMIT_ENABLED=false  → desactiva el middleware (default: activo)
 *   CONCURRENCY_LIMIT_MAX=20         → número máximo de conexiones simultáneas
 */

const DEFAULT_MAX = 20;

/**
 * Crea un middleware de limitación de concurrencia.
 *
 * @param {object} [options]
 * @param {number} [options.max=20]      - Máximo de peticiones simultáneas permitidas.
 * @param {boolean} [options.enabled]    - Activa o desactiva el middleware.
 *                                         Si se omite, se lee de CONCURRENCY_LIMIT_ENABLED.
 * @returns {import('express').RequestHandler}
 */
export function createConcurrencyLimiter({ max, enabled } = {}) {
  // ── Resolución de configuración ─────────────────────────────────────────
  const maxConcurrent =
    max ??
    (process.env.CONCURRENCY_LIMIT_MAX
      ? Number.parseInt(process.env.CONCURRENCY_LIMIT_MAX, 10)
      : DEFAULT_MAX);

  const isEnabled =
    enabled ??
    (process.env.CONCURRENCY_LIMIT_ENABLED !== undefined
      ? process.env.CONCURRENCY_LIMIT_ENABLED === "true"
      : true); // activo por defecto

  // ── Estado compartido por todas las solicitudes ──────────────────────────
  let activeRequests = 0;

  // ── Middleware ───────────────────────────────────────────────────────────
  return async function concurrencyLimiter(req, res, next) {
    // Si está desactivado, pasa directamente
    if (!isEnabled) {
      return next();
    }

    if (activeRequests >= maxConcurrent) {
      return res.status(503).json({
        error: "Servicio temporalmente no disponible",
        mensaje: `Se alcanzó el límite de ${maxConcurrent} solicitudes simultáneas. Intenta de nuevo en un momento.`,
        retryAfter: 1,
      });
    }

    activeRequests++;

    // Decrementamos siempre al terminar la respuesta (éxito o error)
    res.on("finish", () => {
      activeRequests--;
    });

    // Por si la conexión se cierra antes de enviar la respuesta
    res.on("close", () => {
      if (!res.writableEnded) {
        activeRequests--;
      }
    });

    // ── Delay artificial para pruebas (quitar en producción) ─────────────────
    await new Promise((resolve) => setTimeout(resolve, 300));

    next();
  };
}
