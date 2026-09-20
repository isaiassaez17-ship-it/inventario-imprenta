// ============================================================
// CONFIGURACIÓN DEL PROYECTO
// Reemplaza los valores marcados con "TU_..." según las
// instrucciones del README.md antes de usar la aplicación.
// ============================================================

// Configuración del proyecto Firebase (Firebase Console > Configuración
// del proyecto > Tus apps > Config del SDK).
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyApF-l19wJFYGERG1WDjcxfRvMqui2wAoQ",
  authDomain: "inventario-imprenta.firebaseapp.com",
  projectId: "inventario-imprenta",
  storageBucket: "inventario-imprenta.firebasestorage.app",
  messagingSenderId: "65570165627",
  appId: "1:65570165627:web:22a448c314e531c20863de",
};

// Dominio de correo institucional que se acepta para iniciar sesión.
export const INSTITUTION_DOMAIN = "tabancura.cl";

// Correo(s) que tienen acceso al catastro completo (vista de administrador).
// Normalmente el correo de imprenta.
export const ADMIN_EMAILS = ["imprenta@tabancura.cl"];

// Correo de imprenta donde deben llegar las notificaciones de cada
// solicitud. OJO: esto es solo informativo en el código; el destino real
// del correo se configura en la plantilla de EmailJS (ver README).
export const IMPRENTA_EMAIL = "imprenta@tabancura.cl";

// Configuración de EmailJS (emailjs.com > Account > General).
export const EMAILJS_CONFIG = {
  publicKey: "TU_EMAILJS_PUBLIC_KEY",
  serviceId: "TU_EMAILJS_SERVICE_ID",
  templateId: "TU_EMAILJS_TEMPLATE_ID",
};
