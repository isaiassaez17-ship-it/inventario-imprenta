// Protege una página: si no hay sesión válida, redirige al login.
// Si hay sesión, ejecuta el callback con el usuario y pinta el header.
import { auth, watchAuth, logout } from "./firebase.js";
import { ADMIN_EMAILS } from "./config.js";

export function isAdmin(email) {
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(
    (email || "").toLowerCase()
  );
}

export function requireLogin(onReady) {
  watchAuth((user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    renderHeader(user);
    onReady(user);
  });
}

function renderHeader(user) {
  const mount = document.getElementById("topbar");
  if (!mount) return;

  const currentPage = window.location.pathname.split("/").pop();
  const link = (href, label) =>
    `<a href="${href}" class="${currentPage === href ? "active" : ""}">${label}</a>`;

  mount.innerHTML = `
    <div class="brand">Inventario Imprenta</div>
    <nav>
      ${link("solicitar.html", "Solicitar materiales")}
      ${link("historial.html", isAdmin(user.email) ? "Catastro mensual" : "Mis solicitudes")}
      <div class="user-info">
        <span>${user.displayName || user.email}</span>
        <button id="logout-btn" class="btn-secondary">Salir</button>
      </div>
    </nav>
  `;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await logout();
    window.location.href = "index.html";
  });
}
