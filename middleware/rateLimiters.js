import rateLimit from "express-rate-limit";

// ========================================
// RATE LIMITERS - Protección contra DDoS
// ========================================

/**
 * Rate limiter general para todas las rutas de la API
 * Previene abuso general del servidor
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // 200 peticiones por IP cada 15 minutos
  message: { 
    error: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde',
    retryAfter: '15 minutos'
  },
  standardHeaders: true, // Devuelve info en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`
  handler: (req, res) => {
    console.warn(`⚠️ Rate limit excedido - IP: ${req.ip} - Ruta: ${req.path}`);
    res.status(429).json({
      error: 'Demasiadas peticiones desde esta IP',
      retryAfter: '15 minutos',
      mensaje: 'Has excedido el límite de peticiones. Por favor espera unos minutos.'
    });
  }
});

/**
 * Rate limiter para rutas de autenticación
 * Protección extra contra ataques de fuerza bruta
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Solo 10 intentos de login cada 15 minutos
  message: { 
    error: 'Demasiados intentos de autenticación',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar intentos exitosos
  handler: (req, res) => {
    console.warn(`🚨 Posible ataque de fuerza bruta - IP: ${req.ip}`);
    res.status(429).json({
      error: 'Demasiados intentos de autenticación',
      retryAfter: '15 minutos',
      mensaje: 'Has excedido el límite de intentos de login. Por seguridad, espera 15 minutos.'
    });
  }
});

/**
 * Rate limiter para formularios con imágenes
 * Previene saturación del servidor con uploads pesados
 */
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // 50 uploads cada 15 minutos
  message: { 
    error: 'Demasiadas subidas de formularios',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Contar todos los intentos
  handler: (req, res) => {
    console.warn(`⚠️ Límite de uploads excedido - IP: ${req.ip}`);
    res.status(429).json({
      error: 'Demasiadas subidas de formularios',
      retryAfter: '15 minutos',
      mensaje: 'Has alcanzado el límite de envío de formularios. Espera unos minutos e intenta nuevamente.'
    });
  }
});

/**
 * Rate limiter para observaciones
 * Más permisivo porque se usan frecuentemente
 */
export const observacionesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 observaciones cada 15 minutos
  message: { 
    error: 'Demasiadas observaciones enviadas',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`⚠️ Límite de observaciones excedido - IP: ${req.ip}`);
    res.status(429).json({
      error: 'Demasiadas observaciones',
      retryAfter: '15 minutos',
      mensaje: 'Has alcanzado el límite de observaciones por hora.'
    });
  }
});

/**
 * Rate limiter estricto para operaciones sensibles
 * Usar en endpoints de administración, eliminación, etc.
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // Solo 20 operaciones sensibles por hora
  message: { 
    error: 'Demasiadas operaciones sensibles',
    retryAfter: '1 hora'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`🚨 Límite de operaciones sensibles excedido - IP: ${req.ip} - Ruta: ${req.path}`);
    res.status(429).json({
      error: 'Demasiadas operaciones sensibles',
      retryAfter: '1 hora',
      mensaje: 'Has excedido el límite de operaciones permitidas.'
    });
  }
});