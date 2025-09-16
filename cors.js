// cors.js
// Configuración de CORS con whitelist

export const allowedOrigins = [
  'http://localhost:5173',
  'https://forntend-veladero.pages.dev'
  // Agrega aquí otros orígenes permitidos
];

export const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
};
