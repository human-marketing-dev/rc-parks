# Webhook de contacto → GoHighLevel

Al enviar el formulario de contacto, `POST /api/contact` hace dos cosas en
paralelo:

1. **Notifica al equipo por correo** (Brevo), como hasta ahora.
2. **Reenvía el lead + su atribución de marketing** al webhook de una
   automatización de GoHighLevel.

El reenvío a GHL es _best-effort_: si el webhook falla, se registra en logs pero
**no** rompe el envío del usuario ni la notificación por correo. El honeypot
anti-bot se descarta antes de ambos envíos (los bots no entran al CRM).

## Variables de entorno

| Variable             | Requerida | Descripción                                                        |
| -------------------- | --------- | ------------------------------------------------------------------ |
| `BREVO_API_KEY`      | Sí        | API key de Brevo para el correo transaccional.                     |
| `BREVO_SENDER_EMAIL` | Sí        | Remitente verificado en Brevo.                                     |
| `CONTACT_TO_EMAIL`   | Sí        | Destinatario interno de las solicitudes.                           |
| `GHL_WEBHOOK_URL`    | No        | Webhook de GHL. Si se omite, usa el de producción (hardcodeado).   |

## Estructura del payload enviado a GHL

```jsonc
{
  // Datos de contacto (mapear a campos nativos del contacto)
  "firstName": "Ana",
  "lastName": "López",
  "name": "Ana López",
  "email": "ana@empresa.com",
  "phone": "+52 81 1234 5678",
  "company": "ACME",
  "message": "Busco 5000 m²…",

  // Metadatos
  "source": "Sitio web — Formulario de contacto",
  "formName": "Contacto rc-parks.com",
  "locale": "es",
  "submittedAt": "2026-07-20T12:00:00.000Z",

  // Primer toque — cómo nos conoció (Attribution Source)
  "attribution": {
    "sessionSource": "google",
    "url": "https://rc-parks.com/es?utm_source=google&…",
    "referrer": "https://www.google.com/",
    "campaign": "lanzamiento-2026",
    "utmSource": "google",
    "utmMedium": "cpc",
    "utmCampaign": "lanzamiento-2026",
    "utmContent": "anuncio-a",
    "utmTerm": "bodegas-industriales",
    "utmId": "123456789",
    "gclid": "…", "gbraid": "…", "wbraid": "…",
    "fbclid": "…", "msclkid": "…", "ttclid": "…",
    "liFatId": "…", "twclid": "…",
    "timestamp": "2026-07-10T09:15:00.000Z"
  },

  // Último toque — qué lo trajo esta vez (Last Attribution). Misma forma.
  "lastAttribution": { "…": "…" },

  // Identificadores de sesión/dispositivo (matching avanzado: Meta CAPI, GA4)
  "session": {
    "fbp": "fb.1.…",
    "fbc": "fb.1.…",
    "gaClientId": "1234567890.1720000000",
    "userAgent": "Mozilla/5.0…",
    "language": "es-MX",
    "pageUrl": "https://rc-parks.com/es"
  }
}
```

## Cómo mapear en la automatización de GHL

1. En el workflow con el trigger **Inbound Webhook**, abre el mapeo de campos
   (ya recibió una petición de prueba con esta estructura exacta, así que las
   llaves aparecen disponibles).
2. Mapea los datos de contacto a los campos nativos:
   `firstName → First Name`, `lastName → Last Name`, `email → Email`,
   `phone → Phone`, `company → Company Name`.
3. Para la atribución, crea **custom fields** y mapéalos:
   `lastAttribution.utmSource`, `lastAttribution.utmMedium`,
   `lastAttribution.utmCampaign`, `attribution.utmSource`, etc.

### ⚠️ Sobre los campos nativos "Attribution Source / Last Attribution"

El objeto nativo de atribución de GHL (`attributionSource` / `lastAttributionSource`)
es **de solo lectura vía API/webhook**: GHL lo autopobla con su propio pixel
cuando el visitante aterriza en una página _alojada en GHL_. Un formulario
externo como este **no puede escribir directamente** esos campos nativos.

Por eso el payload usa los **mismos nombres** que el esquema nativo y se mapea a
**custom fields equivalentes** (p. ej. "UTM Source (Last)"). Es la vía correcta y
soportada para atribución desde formularios externos.

Si además quieres poblar los campos **nativos**, hay que instalar el _script de
tracking oficial de GHL_ en el sitio (requiere el snippet/Location ID de la
cuenta). Queda como mejora opcional; avísame y lo dejo listo detrás de una
variable de entorno.

## Captura de atribución en el sitio

`app/lib/attribution.ts` captura UTMs, click IDs, referrer y cookies (`_ga`,
`_fbp`, `_fbc`) en **cada carga de página** (montado en el layout vía
`AttributionTracker`) y los persiste en `localStorage`:

- **Primer toque** (`rc_attribution_first`): se fija una sola vez.
- **Último toque** (`rc_attribution_last`): se actualiza con cada nueva señal de
  campaña. Una visita directa no borra la campaña anterior.

El formulario adjunta ambos toques al enviar.
