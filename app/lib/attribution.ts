/**
 * Captura de atribución de marketing a nivel de todo el sitio.
 *
 * Los parámetros de campaña (UTMs, click IDs) llegan como query params en la
 * página de aterrizaje, que puede no ser la misma donde vive el formulario. Por
 * eso se capturan al cargar cualquier página y se persisten en `localStorage`
 * durante toda la vida del visitante:
 *
 *   - `attribution`      → primer toque (first touch). Se fija UNA sola vez y no
 *                          se vuelve a tocar: es el "cómo nos conoció".
 *   - `lastAttribution`  → último toque (last touch). Se actualiza cada vez que
 *                          hay una señal de campaña nueva: es el "qué lo trajo
 *                          esta vez".
 *
 * Las llaves usan los mismos nombres que el esquema nativo de atribución de
 * GoHighLevel (`utmSource`, `sessionSource`, `campaign`…) para que el mapeo en
 * el workflow sea 1:1. Ojo: en GHL el objeto nativo `attributionSource` es de
 * solo lectura vía API/webhook (lo autopobla su propio pixel), así que estos
 * valores se mapean a custom fields equivalentes en la automatización.
 */

/** Un "toque": la foto de atribución de una visita concreta. */
export type Touch = {
  sessionSource: string;
  url: string;
  referrer: string;
  campaign: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  utmId: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  msclkid: string;
  ttclid: string;
  liFatId: string;
  twclid: string;
  timestamp: string;
};

/** Identificadores de la sesión/dispositivo actual (para matching avanzado). */
export type SessionInfo = {
  fbp: string;
  fbc: string;
  gaClientId: string;
  userAgent: string;
  language: string;
  pageUrl: string;
};

export type AttributionPayload = {
  attribution: Touch;
  lastAttribution: Touch;
  session: SessionInfo;
};

const FIRST_KEY = "rc_attribution_first";
const LAST_KEY = "rc_attribution_last";

/** Query param entrante → llave del toque (nombre nativo de GHL). */
const QUERY_TO_FIELD: Record<string, keyof Touch> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
  utm_id: "utmId",
  gclid: "gclid",
  gbraid: "gbraid",
  wbraid: "wbraid",
  fbclid: "fbclid",
  msclkid: "msclkid",
  ttclid: "ttclid",
  li_fat_id: "liFatId",
  twclid: "twclid",
};

/** Topes de longitud: nadie manda un utm_term de 2 KB de buena fe. */
const MAX_VALUE = 600;
const MAX_URL = 1000;

function emptyTouch(): Touch {
  return {
    sessionSource: "",
    url: "",
    referrer: "",
    campaign: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmContent: "",
    utmTerm: "",
    utmId: "",
    gclid: "",
    gbraid: "",
    wbraid: "",
    fbclid: "",
    msclkid: "",
    ttclid: "",
    liFatId: "",
    twclid: "",
    timestamp: "",
  };
}

/**
 * Deriva el "session source" al estilo de GHL: gana el utm_source explícito y,
 * si no hay, se infiere de los click IDs; en su defecto, el dominio que refirió.
 */
function deriveSessionSource(touch: Touch, referrerHost: string): string {
  if (touch.utmSource) return touch.utmSource;
  if (touch.gclid || touch.gbraid || touch.wbraid) return "google";
  if (touch.fbclid) return "facebook";
  if (touch.msclkid) return "bing";
  if (touch.ttclid) return "tiktok";
  if (touch.liFatId) return "linkedin";
  if (touch.twclid) return "twitter";
  if (referrerHost) return referrerHost;
  return "direct";
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Lee la atribución de la página actual desde la URL y el referrer. */
function readTouch(): Touch {
  const params = new URLSearchParams(window.location.search);
  const touch = emptyTouch();

  for (const [query, field] of Object.entries(QUERY_TO_FIELD)) {
    const value = params.get(query);
    if (value) touch[field] = value.trim().slice(0, MAX_VALUE);
  }

  const referrer = document.referrer;
  const referrerHost = hostOf(referrer);
  // Un referrer del propio sitio no cuenta como fuente externa.
  const externalReferrer =
    referrerHost && referrerHost !== hostOf(window.location.href)
      ? referrerHost
      : "";

  touch.campaign = touch.utmCampaign;
  touch.url = window.location.href.slice(0, MAX_URL);
  touch.referrer = referrer.slice(0, MAX_URL);
  touch.sessionSource = deriveSessionSource(touch, externalReferrer);
  touch.timestamp = new Date().toISOString();

  return touch;
}

/** ¿Este toque trae una señal real de campaña (UTM, click ID o referrer externo)? */
function hasSignal(touch: Touch): boolean {
  const referrerHost = hostOf(touch.referrer);
  const externalReferrer =
    referrerHost && referrerHost !== hostOf(window.location.href);

  return Boolean(
    touch.utmSource ||
      touch.utmMedium ||
      touch.utmCampaign ||
      touch.gclid ||
      touch.gbraid ||
      touch.wbraid ||
      touch.fbclid ||
      touch.msclkid ||
      touch.ttclid ||
      touch.liFatId ||
      touch.twclid ||
      externalReferrer,
  );
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.*+?^${}()|[\]\\])/g, "\\$1") + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : "";
}

function readSession(): SessionInfo {
  // Cookie `_ga`: "GA1.1.<clientId>". El clientId son los dos últimos segmentos.
  const ga = readCookie("_ga");
  const gaClientId = ga ? ga.split(".").slice(-2).join(".") : "";

  // `_fbc` puede no existir todavía aunque el fbclid venga en la URL: se
  // reconstruye con el mismo formato que usa el pixel de Meta.
  let fbc = readCookie("_fbc");
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbc && fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;

  return {
    fbp: readCookie("_fbp"),
    fbc,
    gaClientId,
    userAgent: navigator.userAgent.slice(0, MAX_VALUE),
    language: navigator.language || "",
    pageUrl: window.location.href.slice(0, MAX_URL),
  };
}

function readStored(key: string): Touch | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return { ...emptyTouch(), ...(JSON.parse(raw) as Partial<Touch>) };
  } catch {
    return null;
  }
}

/**
 * Se llama al cargar cada página. Fija el primer toque una sola vez y refresca
 * el último toque cuando la visita trae una señal de campaña nueva. Cualquier
 * fallo de `localStorage` (modo incógnito, cookies bloqueadas) se traga en
 * silencio: la medición nunca debe tumbar la página.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    const touch = readTouch();
    const signal = hasSignal(touch);

    if (!localStorage.getItem(FIRST_KEY)) {
      localStorage.setItem(FIRST_KEY, JSON.stringify(touch));
    }

    // El último toque se actualiza solo con señales reales: una vuelta directa
    // no debe borrar la campaña que trajo al visitante la vez anterior.
    if (signal || !localStorage.getItem(LAST_KEY)) {
      localStorage.setItem(LAST_KEY, JSON.stringify(touch));
    }
  } catch {
    /* almacenamiento no disponible: seguimos sin medición persistente */
  }
}

/**
 * Devuelve el payload de atribución para adjuntar al envío del formulario.
 * Si `localStorage` está bloqueado, cae a la atribución de la página actual
 * para no mandar el formulario "a ciegas".
 */
export function getAttributionPayload(): AttributionPayload {
  const live = typeof window === "undefined" ? emptyTouch() : readTouch();

  return {
    attribution: readStored(FIRST_KEY) ?? live,
    lastAttribution: readStored(LAST_KEY) ?? live,
    session:
      typeof window === "undefined"
        ? {
            fbp: "",
            fbc: "",
            gaClientId: "",
            userAgent: "",
            language: "",
            pageUrl: "",
          }
        : readSession(),
  };
}
