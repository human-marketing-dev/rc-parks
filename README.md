# R.C. Parks — Landing

Sitio de una sola página, bilingüe (español / inglés), para **R.C. Parks**, un
parque industrial en Ciénega de Flores, Nuevo León, México. Bodegas Triple A para
manufactura y almacenamiento en el corredor Monterrey–Texas.

Cada idioma se pre-genera como HTML estático; la única ruta dinámica es el
endpoint del formulario de contacto.

## Stack

- **Next.js 16.2** (App Router, Turbopack)
- **React 19.2**
- **TypeScript 5** (modo estricto)
- **Tailwind CSS v4** (configuración CSS-first con `@theme`, sin `tailwind.config.js`)
- **Brevo** (correo transaccional) y **GoHighLevel** (CRM vía webhook) para el
  formulario de contacto

> ⚠️ Esta es una versión de Next.js con breaking changes respecto a versiones
> previas (p. ej. el middleware vive en `proxy.ts`). Ver [`AGENTS.md`](AGENTS.md).

## Requisitos

- Node.js 20+
- npm

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La raíz redirige a `/es` o
`/en` según el idioma del navegador (español por defecto).

### Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (Turbopack). |
| `npm run build` | Build de producción (también verifica tipos). |
| `npm run start` | Sirve el build de producción. |
| `npm run lint` | ESLint (next core-web-vitals + typescript). |

## Variables de entorno

El formulario de contacto necesita estas variables (en Vercel o en un `.env`
local; los `.env*` están en `.gitignore`). Detalle completo en
[`docs/ghl-webhook.md`](docs/ghl-webhook.md).

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `BREVO_API_KEY` | Sí | API key de Brevo. |
| `BREVO_SENDER_EMAIL` | Sí | Remitente verificado en Brevo. |
| `CONTACT_TO_EMAIL` | Sí | Destinatario interno de las solicitudes. |
| `GHL_WEBHOOK_URL` | Sí* | Webhook de la automatización de GoHighLevel. |
| `GHL_WEBHOOK_SECRET` | Sí* | Secreto compartido que valida el workflow de GHL. |
| `NEXT_PUBLIC_GTM_ID` | No | Contenedor de Google Tag Manager (default: `GTM-TCKKHZ2T`). |

\* Sin ellas el sitio funciona igual, pero solo manda el correo por Brevo (no
reenvía el lead al CRM).

## Estructura

```
proxy.ts                 Redirección de idioma (middleware de Next 16)
app/
  [lang]/
    layout.tsx           Layout raíz + metadata + tracker de atribución
    page.tsx             La landing completa (todas las secciones)
    aviso-de-privacidad/ Aviso de privacidad bilingüe (LFPDPPP)
  api/contact/route.ts   Endpoint del formulario → Brevo + GoHighLevel
  components/            UI (form, tabs de ubicación, reveal, redes, etc.)
  components/ui/         Primitivas del design system (Button, Container…)
  content.ts             Datos duros (cifras, distancias, contacto) + formatos
  dictionaries/          Textos i18n (es = fuente de la verdad, en debe calzar)
  lib/attribution.ts     Captura de atribución de marketing (first/last touch)
  lib/analytics.ts       Capa de medición: dataLayer + eventos (GTM)
  globals.css            Design system: tokens @theme y animaciones (Tailwind v4)
public/assets/           Imágenes, video del hero, logos
docs/design-system.md    Tokens, primitivas UI y reglas de extensión
docs/ghl-webhook.md      Integración de contacto (payload, mapeo, seguridad)
docs/analytics.md        Medición: GTM, eventos y conversiones
```

## Internacionalización

- Los idiomas activos se definen en `app/dictionaries/index.ts` (`locales`).
- **`es.ts` es la fuente de la verdad**: define el tipo `Dictionary`. `en.ts` está
  tipado como `Dictionary`, así que si falta una llave, el build falla.
- Las cifras (superficies, distancias) viven una sola vez en `content.ts` y se
  formatean por idioma (km↔millas, m²↔sq ft); los diccionarios solo traducen
  textos y unidades.

Para agregar un idioma: añádelo a `locales`, crea su archivo de diccionario, y
`proxy.ts` + `generateStaticParams` lo toman automáticamente.

## Deploy

Pensado para **Vercel**. Configura las variables de entorno en el proyecto y
haz deploy desde la rama principal. El historial de cambios está en
[`CHANGELOG.md`](CHANGELOG.md).
