# Inventario Imprenta

Sistema web para que el personal solicite materiales de imprenta con su
correo institucional. Cada solicitud queda guardada (catastro mensual por
persona) y se notifica por correo a la imprenta.

Es un sitio **100% estático** (HTML/CSS/JS, sin Node ni build tools) que usa:

- **Firebase Authentication** — login con Google, restringido al dominio `@tabancura.cl`.
- **Firebase Firestore** — base de datos de personas y solicitudes.
- **EmailJS** — envía un correo a `imprenta@tabancura.cl` por cada solicitud.

No necesitas instalar nada para desarrollarlo: solo un servidor estático
simple (Python, que ya tienes instalado) para probarlo en tu navegador.

## 1. Crear el proyecto de Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) e inicia sesión con tu cuenta Google.
2. Clic en **Agregar proyecto**, ponle un nombre (ej. `inventario-imprenta`) y créalo.
3. En el menú lateral, ve a **Compilación > Authentication** → pestaña **Sign-in method** → habilita **Google**.
4. Ve a **Compilación > Firestore Database** → **Crear base de datos** → modo **producción** → elige una región (ej. `southamerica-east1`).
5. En **Firestore Database > Reglas**, reemplaza el contenido por el de [`firestore.rules`](firestore.rules) de este proyecto y publica.
6. Ve a **Configuración del proyecto** (ícono de engranaje) > pestaña **General** > sección **Tus apps** > clic en el ícono `</>` para agregar una app web. Ponle un nombre y regístrala.
7. Copia el objeto `firebaseConfig` que te muestra y pégalo en [`js/config.js`](js/config.js), reemplazando `FIREBASE_CONFIG`.
8. En **Authentication > Settings > Authorized domains**, agrega el dominio donde vayas a alojar el sitio (para pruebas locales, `localhost` ya viene autorizado).

## 2. Configurar EmailJS (envío de notificaciones)

1. Crea una cuenta gratis en [emailjs.com](https://www.emailjs.com/).
2. **Email Services** → agrega un servicio (ej. conecta tu cuenta Gmail) → copia el **Service ID**.
3. **Email Templates** → crea una plantilla nueva. En el campo **To Email** de la plantilla escribe directamente `imprenta@tabancura.cl` (así el destino queda fijo en el servidor de EmailJS y nadie puede cambiarlo desde el navegador).
4. En el cuerpo de la plantilla usa variables como estas (los nombres deben calzar con los que manda `js/notify.js`):

   ```
   Asunto: Nueva solicitud de materiales — {{user_name}}

   Nombre: {{user_name}}
   Correo: {{user_email}}
   Fecha: {{date}}

   Materiales solicitados:
   {{items_text}}

   Notas: {{notes}}
   ```

5. Guarda la plantilla y copia su **Template ID**.
6. En **Account > General**, copia tu **Public Key**.
7. Pega `serviceId`, `templateId` y `publicKey` en [`js/config.js`](js/config.js), en `EMAILJS_CONFIG`.
8. (Recomendado) En **Account > Security**, restringe el uso de tu Public Key a los dominios donde vas a alojar el sitio (evita que otros lo usen desde afuera).

## 3. Ajustar dominio y administrador

En [`js/config.js`](js/config.js):

- `INSTITUTION_DOMAIN`: dominio de correo permitido para iniciar sesión (ya está en `tabancura.cl`).
- `ADMIN_EMAILS`: correos que pueden ver el **catastro mensual completo** (por defecto `imprenta@tabancura.cl`). Puedes agregar más de uno.

Si cambias estos valores, actualiza también `firestore.rules` (las funciones `isInstitution()` e `isAdmin()`) y vuelve a publicar las reglas en Firebase Console.

## 4. Probar en local

No necesitas Node. Desde esta carpeta, levanta un servidor estático con Python:

```bash
python -m http.server 5500
```

Abre `http://localhost:5500` en tu navegador. Inicia sesión con un correo `@tabancura.cl`, envía una solicitud de prueba y confirma que:

- Aparece en **Mis solicitudes**.
- Llega el correo a `imprenta@tabancura.cl`.
- Si entras con el correo definido en `ADMIN_EMAILS`, ves el **Catastro mensual** con el resumen por persona y el botón para exportar CSV.

## 5. Publicar el sitio (cuando quieras que la gente lo use de verdad)

La forma más simple es **Firebase Hosting** (gratis):

1. Instala Firebase CLI solo si en algún momento tienes Node disponible (`npm install -g firebase-tools`), o usa la opción sin instalar nada: sube estos archivos tal cual a cualquier hosting estático gratuito (Firebase Hosting, GitHub Pages, Netlify, Vercel) arrastrando la carpeta.
2. Agrega el dominio final en **Authentication > Settings > Authorized domains** en Firebase.
3. Restringe la Public Key de EmailJS a ese dominio (paso 2.8 de arriba).

## Estructura del proyecto

```
inventario-imprenta/
├── index.html          # Login con Google
├── solicitar.html       # Formulario de solicitud + mis últimas solicitudes
├── historial.html        # "Mis solicitudes" (usuario) o "Catastro mensual" (admin)
├── css/styles.css
├── js/
│   ├── config.js          # Claves y configuración (edítalo tú)
│   ├── firebase.js         # Inicialización de Firebase Auth + Firestore
│   ├── auth-guard.js        # Protege páginas y pinta el header
│   ├── materials.js          # Catálogo de materiales (edítalo tú)
│   └── notify.js              # Envío de correo vía EmailJS
└── firestore.rules              # Reglas de seguridad de la base de datos
```

## Notas de seguridad (prototipo local)

- La restricción de dominio institucional se aplica en el cliente (JS) **y** en las reglas de Firestore, así que aunque alguien manipule el JavaScript del navegador, no podrá leer ni escribir datos sin un correo `@tabancura.cl` válido (verificado por Google, no por el usuario).
- El correo de destino de las notificaciones se fija en la plantilla de EmailJS, no en el código del navegador — no se puede redirigir a otro correo desde el cliente.
- Antes de usarlo con datos reales de personas, revisa la política de privacidad de tu institución sobre almacenamiento de nombres y correos.
