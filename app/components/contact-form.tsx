"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dictionary, Locale } from "../dictionaries";
import { trackGenerateLead } from "../lib/analytics";
import { getAttributionPayload } from "../lib/attribution";
import { Button } from "./ui/button";
import { TextAreaField, TextField } from "./ui/field";

type Status = "idle" | "sending" | "error";

/**
 * Consentimiento opcional: cuando llega, se renderiza un checkbox obligatorio
 * que enlaza al aviso de privacidad. Lo usa la landing de campaña (/cotiza,
 * /getquote); el formulario del home lo omite y queda igual que antes.
 */
export type ConsentCopy = {
  before: string;
  link: string;
  after: string;
  /** Ruta al aviso de privacidad del idioma correspondiente. */
  href: string;
};

export function ContactForm({
  dict,
  locale,
  consent,
}: {
  dict: Dictionary["contact"]["form"];
  locale: Locale;
  consent?: ConsentCopy;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [sentName, setSentName] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Se lee antes del await: React limpia currentTarget al ceder el hilo.
    const data = new FormData(event.currentTarget);
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: data.get("nombre"),
          apellido: data.get("apellido"),
          empresa: data.get("empresa"),
          email: data.get("email"),
          telefono: data.get("telefono"),
          mensaje: data.get("mensaje"),
          website: data.get("website"),
          locale,
          // Atribución de marketing capturada a nivel de sitio (first/last touch).
          ...getAttributionPayload(),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const nombre = (data.get("nombre") ?? "").toString();
      const apellido = (data.get("apellido") ?? "").toString();

      // Conversión: generate_lead con datos del usuario (Enhanced Conversions).
      // Se emite aquí, tras el éxito real del envío, no en el clic del botón.
      trackGenerateLead({
        firstName: nombre,
        lastName: apellido,
        email: (data.get("email") ?? "").toString(),
        phone: (data.get("telefono") ?? "").toString(),
        company: (data.get("empresa") ?? "").toString(),
        locale,
      });

      setSentName(nombre.trim().split(" ")[0]);
    } catch {
      setStatus("error");
    }
  }

  if (sentName !== null) {
    return (
      <div className="flex min-h-[440px] flex-col items-start justify-center gap-4 rounded-card bg-white p-8 text-ink sm:p-12">
        <span className="flex size-12 items-center justify-center rounded-full bg-azure text-2xl font-medium">
          ✓
        </span>
        <h3 className="text-[28px] font-medium tracking-[-0.6px]">
          {sentName
            ? dict.thanksNamed.replace("{name}", sentName)
            : dict.thanks}
        </h3>
        <p className="text-body leading-[1.55] text-ink/60">
          {dict.thanksBody}
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <div className="rounded-card bg-white p-8 text-ink sm:p-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
        {/* Honeypot: invisible para personas, tentador para bots. Va fuera de
            pantalla en vez de display:none porque varios bots omiten los campos
            ocultos con display:none y no caerían en la trampa. */}
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid gap-[22px] sm:grid-cols-2">
          <TextField
            id="nombre"
            name="nombre"
            label={dict.name}
            required
            maxLength={120}
            placeholder={dict.namePlaceholder}
          />
          <TextField
            id="apellido"
            name="apellido"
            label={dict.lastName}
            required
            maxLength={120}
            placeholder={dict.lastNamePlaceholder}
          />
        </div>

        <TextField
          id="empresa"
          name="empresa"
          label={dict.company}
          maxLength={160}
          placeholder={dict.companyPlaceholder}
        />

        <div className="grid gap-[22px] sm:grid-cols-2">
          <TextField
            id="email"
            name="email"
            type="email"
            label={dict.email}
            required
            maxLength={200}
            placeholder={dict.emailPlaceholder}
          />
          <TextField
            id="telefono"
            name="telefono"
            type="tel"
            label={dict.phone}
            maxLength={40}
            placeholder={dict.phonePlaceholder}
          />
        </div>

        <TextAreaField
          id="mensaje"
          name="mensaje"
          label={dict.message}
          rows={3}
          maxLength={2000}
          placeholder={dict.messagePlaceholder}
        />

        {consent ? (
          // `required` bloquea el envío hasta marcarlo: es la autorización de
          // tratamiento de datos. El enlace abre el aviso en otra pestaña para
          // no perder lo ya capturado en el formulario.
          <label className="flex items-start gap-3 text-[13px] leading-[1.5] text-ink/70">
            <input
              type="checkbox"
              name="consent"
              value="si"
              required
              className="mt-0.5 size-4 shrink-0 accent-azure"
            />
            <span>
              {consent.before}
              <Link
                href={consent.href}
                target="_blank"
                className="text-ink underline underline-offset-2 hover:text-azure"
              >
                {consent.link}
              </Link>
              {consent.after}
            </span>
          </label>
        ) : null}

        {status === "error" ? (
          <p role="alert" className="text-sm leading-[1.5] text-error">
            {dict.error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          className="mt-2.5 w-full"
        >
          {sending ? dict.sending : dict.submit}
        </Button>
      </form>
    </div>
  );
}
