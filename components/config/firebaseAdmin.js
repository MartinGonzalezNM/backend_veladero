// firebaseAdmin.js - AL PRINCIPIO
import dotenv from 'dotenv';
dotenv.config();

import admin from "firebase-admin";

console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_PRIVATE_KEY definida:', !!process.env.FIREBASE_PRIVATE_KEY);

// Validación de seguridad
if (!process.env.FIREBASE_PRIVATE_KEY) {
  console.error('ERROR: FIREBASE_PRIVATE_KEY no está definida');
  console.error('Variables de entorno cargadas:', Object.keys(process.env).filter(key => key.includes('FIREBASE')));
  throw new Error('FIREBASE_PRIVATE_KEY no está definida en las variables de entorno');
}

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.FIREBASE_CLIENT_EMAIL || '')}`
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  });
  console.log('✅ Firebase Admin inicializado correctamente');
} catch (error) {
  console.error('❌ Error inicializando Firebase Admin:', error);
  throw error;
}

export const bucket = admin.storage().bucket();
export default admin;