/**
 * Capa de medición del sitio. Un único punto de entrada al `dataLayer` de Google
 * Tag Manager para que ningún componente empuje eventos "a mano" con formas
 * distintas. GTM (contenedor web) escucha el `dataLayer` y desde ahí se
 * configuran las etiquetas de GA4 / Google Ads.
 *
 * Los eventos siguen la nomenclatura recomendada de GA4 (`generate_lead`) y el
 * formato de datos proporcionados por el usuario (User-Provided Data) que
 * requieren las conversiones mejoradas (Enhanced Conversions). GTM se encarga
 * del hasheo; aquí solo se manda texto normalizado.
 */

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-TCKKHZ2T";

type DataLayerObject = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerObject[];
  }
}

/** Empuje seguro al dataLayer: no revienta en SSR ni si GTM aún no cargó. */
export function pushToDataLayer(data: DataLayerObject): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(data);
}

/** Normaliza el correo como pide Enhanced Conversions: sin espacios, minúsculas. */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Normaliza el teléfono a un E.164 aproximado (lo que espera Enhanced
 * Conversions). Heurística centrada en México: si no trae lada internacional,
 * se asume +52. Es best-effort; un dato imperfecto es mejor que ninguno.
 */
function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return "";

  const hadPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return "";

  if (hadPlus) return `+${digits}`;
  if (digits.length === 10) return `+52${digits}`; // celular/fijo local MX
  if (digits.length === 12 && digits.startsWith("52")) return `+${digits}`;
  return `+${digits}`;
}

export type LeadUserData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  locale?: string;
};

/**
 * `generate_lead` con el bloque `user_data` para conversiones mejoradas. Se
 * dispara SOLO tras un envío exitoso del formulario (no en el clic del botón).
 */
export function trackGenerateLead(data: LeadUserData): void {
  const email = normalizeEmail(data.email);
  const phone = normalizePhone(data.phone);

  pushToDataLayer({
    event: "generate_lead",
    form_id: "contacto",
    form_name: "Contacto rc-parks.com",
    lead_locale: data.locale,
    // User-Provided Data (Enhanced Conversions). GTM lo hashea antes de enviarlo.
    user_data: {
      email_address: email,
      phone_number: phone,
      address: {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
      },
    },
  });
}

/**
 * `whatsapp_click`: se dispara en el segundo clic (el botón "Abrir WhatsApp" del
 * modal), no al abrir el modal. `location` distingue desde dónde se originó.
 */
export function trackWhatsAppClick(location: string): void {
  pushToDataLayer({
    event: "whatsapp_click",
    whatsapp_location: location,
  });
}
