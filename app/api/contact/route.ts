import type { NextRequest } from "next/server";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/** Topes de longitud: cortan payloads absurdos antes de llegar a Brevo. */
const LIMITS = {
  nombre: 120,
  empresa: 160,
  email: 200,
  telefono: 40,
  mensaje: 2000,
} as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  //    bot no pueda deducir que fue detectado; simplemente no se manda nada.
  if (asString(data.website) !== "") {
    return Response.json({ ok: true });
  }

  // 3) Validación server-side: la del cliente se puede saltar trivialmente.
  const nombre = asString(data.nombre);
  const empresa = asString(data.empresa);
  const email = asString(data.email);
  const telefono = asString(data.telefono);
  const mensaje = asString(data.mensaje);

  const invalid =
    !nombre ||
    nombre.length > LIMITS.nombre ||
    !email ||
    email.length > LIMITS.email ||
    !EMAIL_RE.test(email) ||
    empresa.length > LIMITS.empresa ||
    telefono.length > LIMITS.telefono ||
    mensaje.length > LIMITS.mensaje;

  if (invalid) {
    return Response.json({ ok: false }, { status: 400 });
  }

  // 4) Configuración del servidor.
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !senderEmail || !toEmail) {
    console.error("[contact] Faltan variables de entorno:", {
      BREVO_API_KEY: Boolean(apiKey),
      BREVO_SENDER_EMAIL: Boolean(senderEmail),
      CONTACT_TO_EMAIL: Boolean(toEmail),
    });
    return Response.json({ ok: false }, { status: 500 });
  }

  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 16px 4px 0;color:#666">${label}</td>` +
    `<td style="padding:4px 0"><strong>${escapeHtml(value)}</strong></td></tr>`;

  const htmlContent = [
    `<h2 style="font-family:Helvetica,Arial,sans-serif">Nueva solicitud desde rc-parks.com</h2>`,
    `<table style="font-family:Helvetica,Arial,sans-serif;font-size:15px">`,
    row("Nombre", nombre),
    empresa ? row("Empresa", empresa) : "",
    row("Email", email),
    telefono ? row("Teléfono", telefono) : "",
    `</table>`,
    mensaje
      ? `<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px">` +
        `<strong>Mensaje:</strong><br>${escapeHtml(mensaje).replace(/\n/g, "<br>")}</p>`
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
        replyTo: { email, name: nombre },
        subject: `Nueva solicitud de espacio — ${nombre}`,
        htmlContent,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "(sin cuerpo)");
      console.error(`[contact] Brevo respondió ${res.status}:`, detail);
      return Response.json({ ok: false }, { status: 502 });
    }
  } catch (error) {
    console.error("[contact] Error de red al llamar a Brevo:", error);
    return Response.json({ ok: false }, { status: 502 });
  }

  return Response.json({ ok: true });
}
