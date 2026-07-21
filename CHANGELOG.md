# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Las entradas se reconstruyeron a partir del historial de git; el proyecto aún no
usa versionado semántico ni tags.

## [No liberado] — PR #1

Trabajo en la rama `feat/webhook-ghl-atribucion` (todavía no fusionado a `main`).

### Añadido

- Campos **Nombre** y **Apellido** separados en el formulario de contacto (UI,
  diccionarios es/en, validación de la API y correo de Brevo).
- **Captura de atribución de marketing a nivel de todo el sitio** (UTMs, click
  IDs, referrer y cookies `_ga`/`_fbp`/`_fbc`), con primer y último toque
  persistidos en `localStorage` (`app/lib/attribution.ts` + `AttributionTracker`
  en el layout).
- Reenvío del lead + atribución al **webhook de GoHighLevel** desde
  `/api/contact`, en paralelo al correo (best-effort).
- **Entorno de medición con Google Tag Manager** (`GTM-TCKKHZ2T`) a nivel de todo
  el sitio, con el `dataLayer` centralizado en `app/lib/analytics.ts`.
- Evento **`generate_lead`** al enviar el formulario, con datos del usuario (UPD)
  para conversiones mejoradas (Enhanced Conversions).
- Evento **`whatsapp_click`** con un **panel tipo chat de WhatsApp** anclado abajo
  a la derecha (mensaje de bienvenida + botón flotante que aparece tras 5 s); el
  evento se emite en el clic final, no al abrir.
- Documentación: [`docs/ghl-webhook.md`](docs/ghl-webhook.md),
  [`docs/analytics.md`](docs/analytics.md), `AGENTS.md`, `README.md` y este
  `CHANGELOG.md`.

### Seguridad

- URL y secreto del webhook **solo por variables de entorno** (sin default
  hardcodeado, porque el repo es público).
- **Secreto compartido** (`token`) que el workflow de GHL valida en su primer
  paso: descarta POSTs directos a la URL sin el token.
- **Chequeo de Origin** en `/api/contact` (rechaza cross-origin evidente).

## [2026-07-20]

### Añadido

- Enlaces a redes sociales (Instagram, Facebook, LinkedIn) y mapa de ubicación.
- Integración del formulario de contacto con **Brevo** (correo transaccional).

### Cambiado

- Ajuste de las unidades de medida mostradas en el sitio.

## [2026-07-16]

### Cambiado

- Actualización de imágenes del sitio.
- Empresas listadas en la sección de ubicación.
- Ajustes de texto.

## [2026-07-14]

### Añadido

- Implementación inicial de la landing de R.C. Parks a partir del diseño.
- Sistema de diseño: tokens de tema y animaciones (Tailwind CSS v4).
- Versión en **inglés** e internacionalización es/en.
- Scaffolding inicial del proyecto con `create-next-app` (Next.js 16).
