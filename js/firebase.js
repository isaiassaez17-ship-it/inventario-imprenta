// Inicializa Firebase (App, Auth, Firestore) y exporta instancias
// listas para usar en el resto de la aplicación.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  increment,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import { FIREBASE_CONFIG, INSTITUTION_DOMAIN } from "./config.js";

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();
// Sugiere a Google mostrar solo cuentas del dominio institucional.
// (Es solo una ayuda de UX; la validación real ocurre después del login).
provider.setCustomParameters({ hd: INSTITUTION_DOMAIN });

export function isInstitutionalEmail(email) {
  return !!email && email.toLowerCase().endsWith("@" + INSTITUTION_DOMAIN.toLowerCase());
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (!isInstitutionalEmail(user.email)) {
    await signOut(auth);
    throw new Error(
      `Debes iniciar sesión con tu correo institucional @${INSTITUTION_DOMAIN}.`
    );
  }

  // Guarda / actualiza el registro de la persona (catastro de usuarios).
  await setDoc(
    doc(db, "users", user.uid),
    {
      name: user.displayName || "",
      email: user.email,
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );

  return user;
}

export function logout() {
  return signOut(auth);
}

export function watchAuth(onUser) {
  return onAuthStateChanged(auth, onUser);
}

export {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  increment,
};
