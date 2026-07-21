import type { NextRequest } from "next/server";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/**
 * Webhook de la automatización de GoHighLevel y su secreto compartido. Ambos
 * viven SOLO en variables de entorno: el repo es público, así que la URL no
 * puede quedar hardcodeada. GHL no autentica sus inbound webhooks, así que el
 * `GHL_WEBHOOK_SECRET` viaja en el payload y el primer paso del workflow lo
 * valida: un POST directo a la URL (aunque la conozcan) sin el token se
 * descarta.
 */
const GHL_WEBHOOK_URL = process.env.GHL_WEBHOOK_URL;
const GHL_WEBHOOK_SECRET = process.env.GHL_WEBHOOK_SECRET;

/** Topes de longitud: cortan payloads absurdos antes de llegar a Brevo. */
const LIMITS = {
  nombre: 120,
  apellido: 120,
  empresa: 160,
  email: 200,
  telefono: 40,
  mensaje: 2000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Llaves de un "toque" de atribución. Coinciden con el esquema nativo de GHL
 * (`utmSource`, `sessionSource`…) para que el mapeo en el workflow sea directo.
 */
const TOUCH_KEYS = [
  "sessionSource",
  "url",
  "referrer",
  "campaign",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
  "utmId",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "ttclid",
  "liFatId",
  "twclid",
  "timestamp",
] as const;

const SESSION_KEYS = [
  "fbp",
  "fbc",
  "gaClientId",
  "userAgent",
  "language",
  "pageUrl",
] as const;

/** Escapa lo que podría inyectar markup en el correo HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Reduce un objeto arbitrario del cliente a un mapa de strings con solo las
 * llaves permitidas y con longitud acotada. Impide que el endpoint se use para
 * relayar basura arbitraria al webhook.
 */
function pickStrings(
  value: unknown,
  keys: readonly string[],
  max = 600,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof value === "object" && value !== null) {
    const obj = value as Record<string, unknown>;
    for (const key of keys) {
      const raw = obj[key];
      if (typeof raw === "string") {
        const trimmed = raw.trim();
        if (trimmed) out[key] = trimmed.slice(0, max);
      }
    }
  }
  return out;
}

/**
 * Reenvía el lead al webhook de GHL. Best-effort: cualquier fallo se registra
 * pero NO tumba el envío del usuario ni la notificación por correo. Nunca
 * lanza; devuelve siempre para poder await-earla antes de responder (en
 * serverless una promesa sin await se cancela al enviar la respuesta).
 */
async function sendToGhl(payload: unknown): Promise<void> {
  if (!GHL_WEBHOOK_URL) {
    console.error(
      "[contact] GHL_WEBHOOK_URL no configurada: se omite el reenvío al CRM.",
    );
    return;
  }

  try {
    const res = await fetch(GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "(sin cuerpo)");
      console.error(`[contact] GHL webhook respondió ${res.status}:`, detail);
    }
  } catch (error) {
    console.error("[contact] Error de red al llamar al webhook de GHL:", error);
  }
}

export async function POST(request: NextRequest) {
  // 1) Body malformado: 400, nunca reventar con 500.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const data = body as Record<string, unknown>;

  // 2) Honeypot. La respuesta es idéntica a la de un envío exitoso para que el
  //    bot no pueda deducir que fue detectado; simplemente no se manda nada
  //    (ni correo ni webhook: la basura de bots no entra al CRM).
  if (asString(data.website) !== "") {
    return Response.json({ ok: true });
  }

  // 3) Validación server-side: la del cliente se puede saltar trivialmente.
  const nombre = asString(data.nombre);
  const apellido = asString(data.apellido);
  const empresa = asString(data.empresa);
  const email = asString(data.email);
  const telefono = asString(data.telefono);
  const mensaje = asString(data.mensaje);

  const invalid =
    !nombre ||
    nombre.length > LIMITS.nombre ||
    !apellido ||
    apellido.length > LIMITS.apellido ||
    !email ||
    email.length > LIMITS.email ||
    !EMAIL_RE.test(email) ||
    empresa.length > LIMITS.empresa ||
    telefono.length > LIMITS.telefono ||
    mensaje.length > LIMITS.mensaje;

  if (invalid) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const nombreCompleto = `${nombre} ${apellido}`.trim();

  // 4) Atribución de marketing saneada (first touch / last touch + sesión).
  const attribution = pickStrings(data.attribution, TOUCH_KEYS);
  const lastAttribution = pickStrings(data.lastAttribution, TOUCH_KEYS);
  const session = pickStrings(data.session, SESSION_KEYS);

  // 5) Reenvío al CRM (GoHighLevel). Se dispara ya, en paralelo al correo, e
  //    independiente de que Brevo esté configurado: el lead no se pierde aunque
  //    el correo falle. Las llaves usan nombres mapeables 1:1 en el workflow.
  const ghlSend = sendToGhl({
    // Secreto compartido: el workflow descarta lo que no lo traiga. Si no está
    // configurado, JSON.stringify lo omite (queda `undefined`).
    token: GHL_WEBHOOK_SECRET,
    firstName: nombre,
    lastName: apellido,
    name: nombreCompleto,
    email,
    phone: telefono,
    company: empresa,
    message: mensaje,
    source: "Sitio web — Formulario de contacto",
    formName: "Contacto rc-parks.com",
    locale: asString(data.locale),
    submittedAt: new Date().toISOString(),
    attribution,
    lastAttribution,
    session,
  });

  // 6) Configuración del servidor para el correo.
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !senderEmail || !toEmail) {
    console.error("[contact] Faltan variables de entorno:", {
      BREVO_API_KEY: Boolean(apiKey),
      BREVO_SENDER_EMAIL: Boolean(senderEmail),
      CONTACT_TO_EMAIL: Boolean(toEmail),
    });
    await ghlSend;
    return Response.json({ ok: false }, { status: 500 });
  }

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#666">${label}</td>` +
    `<td style="padding:4px 0"><strong>${escapeHtml(value)}</strong></td></tr>`;

  // Resumen de origen para el equipo comercial (último toque conocido).
  const origen = [
    lastAttribution.sessionSource &&
      `Fuente: ${lastAttribution.sessionSource}`,
    lastAttribution.utmMedium && `Medio: ${lastAttribution.utmMedium}`,
    lastAttribution.utmCampaign && `Campaña: ${lastAttribution.utmCampaign}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const htmlContent = [
    `<h2 style="font-family:Helvetica,Arial,sans-serif">Nueva solicitud desde rc-parks.com</h2>`,
    `<table style="font-family:Helvetica,Arial,sans-serif;font-size:15px">`,
    row("Nombre", nombre),
    row("Apellido", apellido),
    empresa ? row("Empresa", empresa) : "",
    row("Email", email),
    telefono ? row("Teléfono", telefono) : "",
    `</table>`,
    mensaje
      ? `<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px">` +
        `<strong>Mensaje:</strong><br>${escapeHtml(mensaje).replace(/\n/g, "<br>")}</p>`
      : "",
    origen
      ? `<p style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#888">` +
        `${escapeHtml(origen)}</p>`
      : "",
  ].join("");

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: "R.C. Parks — Sitio web" },
        // El destinatario sale del entorno, nunca del body: así el endpoint no
        // puede usarse para mandar correo arbitrario a terceros.
        to: [{ email: toEmail }],
        replyTo: { email, name: nombreCompleto },
        subject: `Nueva solicitud de espacio — ${nombreCompleto}`,
        htmlContent,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "(sin cuerpo)");
      console.error(`[contact] Brevo respondió ${res.status}:`, detail);
      await ghlSend;
      return Response.json({ ok: false }, { status: 502 });
    }
  } catch (error) {
    console.error("[contact] Error de red al llamar a Brevo:", error);
    await ghlSend;
    return Response.json({ ok: false }, { status: 502 });
  }

  // El correo salió; nos aseguramos de que el reenvío a GHL también terminó
  // antes de responder (serverless cancela promesas pendientes al responder).
  await ghlSend;
  return Response.json({ ok: true });
}
