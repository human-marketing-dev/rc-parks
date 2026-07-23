# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).
Las entradas se reconstruyeron a partir del historial de git; el proyecto aún no
usa versionado semántico ni tags.

## [2026-07-22]

### Añadido

- **Landings de campaña (Google Ads)** en URL limpia por idioma: `/cotiza` (es) y
  `/getquote` (en). Reutilizan el diseño del sitio pero reordenado para
  conversión: hero de **renta** con el rango de m² y el **formulario a la vista**
  sobre el video, tira de **diferenciadores** con íconos (CFE frente al parque,
  2,400 KVA, vigilancia 24/7, 15 min del aeropuerto, distancia a frontera),
  sección de **productos/inventario** (bodegas con frente a avenida 430–615 m² y
  naves grandes 2,200–5,100 m², integrables hasta ~8,400 m²), y un **checkbox de
  consentimiento obligatorio** en el formulario que enlaza al aviso de privacidad.
  El CTA del formulario es "Solicitar Espacio".
  - Viven fuera de `[lang]`, cada una como **root layout** propio (patrón de
    múltiples root layouts de Next); `SiteShell` centraliza `<html>/<body>` + GTM
    + WhatsApp para los tres layouts. Excluidas del matcher de `proxy.ts` para no
    redirigirse al idioma del navegador.
  - El **botón flotante (burbuja) de WhatsApp se oculta** en las landings
    (`SiteShell` acepta `showWhatsAppFloating`, en `false` para /cotiza y
    /getquote) para no competir con el formulario; el panel sigue disponible al
    tocar el contacto de la sección de cierre. En el home sigue apareciendo.
- **Aviso de privacidad bilingüe** en `/es/aviso-de-privacidad` y
  `/en/aviso-de-privacidad` (LFPDPPP), con los datos del responsable
  (Conglomerado RC, S.A. de C.V.) y adaptado a lo que el sitio realmente
  recaba (formulario, cookies de medición, encargados). Enlazado desde el
  footer de la landing; todo el texto vive en los diccionarios.

- **Design system tokenizado.** Todos los valores de diseño viven como tokens en
  el `@theme` de `globals.css` (colores —incluida la paleta de WhatsApp y el
  rojo de error—, roles tipográficos `display-*`/`lead`/`body`/`label`, radios
  `btn`/`field`/`card`/`tile`/`panel`, tracking y ancho `shell`), y las recetas
  repetidas son primitivas reutilizables en `app/components/ui/`: `Container`,
  `Eyebrow`, `SectionTitle`, `Button` (variantes `dark`/`accent`/`ghost`) y
  `TextField`/`TextAreaField`. Documentado en
  [`docs/design-system.md`](docs/design-system.md).

### Cambiado

- Todo el sitio consume tokens y primitivas (sin hex ni clamps sueltos en
  componentes). Normalización deliberada de drift: títulos de sección
  46/48/50px → `display-lg`; leads 19/20/21px → `lead`. Verificado con diff de
  estilos computados: sin otros cambios visuales.

## [2026-07-20 → 2026-07-21] — PRs #1, #2 y #3 (fusionados)

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
