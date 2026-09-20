// Envía una notificación por correo (vía EmailJS) cada vez que alguien
// hace una solicitud. El correo de destino (imprenta) se configura en
// la plantilla de EmailJS, no aquí — así nadie puede cambiarlo desde el navegador.
import { EMAILJS_CONFIG } from "./config.js";

let emailjsReady = null;

function loadEmailJs() {
  if (emailjsReady) return emailjsReady;
  emailjsReady = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.onload = () => {
      window.emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
      resolve(window.emailjs);
    };
    script.onerror = () => reject(new Error("No se pudo cargar EmailJS"));
    document.head.appendChild(script);
  });
  return emailjsReady;
}

export async function sendRequestNotification({ userName, userEmail, items, otherText, notes, date }) {
  const itemsText =
    items.map((i) => `- ${i.material}: ${i.quantity}`).join("\n") +
    (otherText ? `\n- Otro: ${otherText}` : "");

  const templateParams = {
    user_name: userName,
    user_email: userEmail,
    items_text: itemsText || "(sin materiales de la lista)",
    notes: notes || "(sin notas)",
    date,
  };

  try {
    const emailjs = await loadEmailJs();
    await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams);
  } catch (err) {
    // No bloquea el flujo si el correo falla: la solicitud ya quedó
    // guardada en la base de datos. Solo se registra el error.
    console.error("Error enviando notificación por correo:", err);
  }
}
