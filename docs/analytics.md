# Medición y conversiones (Google Tag Manager)

El sitio empuja eventos a un `dataLayer` que consume el **contenedor web de Google
Tag Manager** `GTM-TCKKHZ2T`. Desde GTM se configuran las etiquetas de GA4 y
Google Ads; el código del sitio solo se encarga de **emitir eventos con una forma
consistente**.

## Piezas

| Archivo | Rol |
| --- | --- |
| [`app/lib/analytics.ts`](../app/lib/analytics.ts) | Capa de medición: `pushToDataLayer` + helpers tipados por evento (`trackGenerateLead`, `trackWhatsAppClick`) + normalización de datos. Único punto de entrada al `dataLayer`. |
| [`app/components/google-tag-manager.tsx`](../app/components/google-tag-manager.tsx) | Inyecta el contenedor GTM (script + `<noscript>`), montado en el layout → activo en todo el sitio. |
| [`app/components/whatsapp-provider.tsx`](../app/components/whatsapp-provider.tsx) | Modal de WhatsApp; emite `whatsapp_click` en el clic final. |
| [`app/components/contact-form.tsx`](../app/components/contact-form.tsx) | Emite `generate_lead` tras un envío exitoso. |

## Configuración

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_GTM_ID` | No | ID del contenedor. Si se omite, usa `GTM-TCKKHZ2T` (el ID no es secreto: viaja en el HTML). |

## Eventos

### `generate_lead`

Se dispara **solo tras un envío exitoso** del formulario (no en el clic del
botón). Incluye el bloque `user_data` con datos proporcionados por el usuario
(**User-Provided Data**) para **conversiones mejoradas** (Enhanced Conversions).
GTM se encarga del hasheo SHA-256; el sitio manda texto ya normalizado (correo en
minúsculas y sin espacios; teléfono en E.164 aproximado, MX por defecto).

```jsonc
{
  "event": "generate_lead",
  "form_id": "contacto",
  "form_name": "Contacto rc-parks.com",
  "lead_locale": "es",
  "user_data": {
    "email_address": "ana@ejemplo.com",
    "phone_number": "+528131006363",
    "address": { "first_name": "Ana", "last_name": "López" }
  }
}
```

### `whatsapp_click`

Se dispara en el **segundo clic**: al tocar el número/botón de WhatsApp aparece un
**panel tipo chat** anclado abajo a la derecha (no un modal a pantalla completa)
con un mensaje de bienvenida, y el evento se emite al pulsar "Abrir WhatsApp". Así
el evento representa intención real, no un roce accidental. El botón flotante
aparece unos segundos después de cargar la página.

```jsonc
{
  "event": "whatsapp_click",
  "whatsapp_location": "contact_section" // o "floating_button"
}
```

## Cómo configurarlo en GTM

1. **Triggers de evento personalizado** para `generate_lead` y `whatsapp_click`
   (Trigger type → Custom Event, con el nombre exacto).
2. **GA4**: una etiqueta de evento GA4 por cada trigger; los parámetros
   (`form_id`, `whatsapp_location`, etc.) se mapean como parámetros del evento.
3. **Enhanced Conversions (Google Ads)**: en la etiqueta de conversión, activa
   "Datos proporcionados por el usuario" y usa una **variable de capa de datos**
   apuntando a `user_data` (Google reconoce `email_address`, `phone_number` y
   `address.first_name` / `address.last_name`).
4. Verifica con el **modo de vista previa** de GTM: al enviar el formulario debe
   aparecer `generate_lead` con su `user_data`, y al usar el modal,
   `whatsapp_click`.

## Cómo agregar un evento nuevo

1. Añade un helper tipado en [`app/lib/analytics.ts`](../app/lib/analytics.ts)
   (p. ej. `trackVideoPlay`) que llame a `pushToDataLayer`.
2. Invócalo desde el componente cliente correspondiente.
3. Crea su trigger + etiqueta en GTM.

Mantén **toda** la escritura al `dataLayer` dentro de `analytics.ts`: ningún
componente debe llamar a `window.dataLayer.push` directamente.

## Privacidad / consentimiento

El `generate_lead` coloca correo y teléfono (texto plano) en el `dataLayer` para
Enhanced Conversions; GTM los hashea antes de enviarlos a Google. Si a futuro se
requiere un banner de consentimiento (p. ej. Consent Mode), se gestiona desde GTM
sin tocar el sitio. Hoy el contenedor carga sin gate de consentimiento.
