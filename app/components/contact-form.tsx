"use client";

import { useState } from "react";
import type { Dictionary } from "../dictionaries";

const fieldClass =
  "border-b border-field bg-transparent py-2.5 text-[16px] outline-none transition-colors focus:border-azure";

type Status = "idle" | "sending" | "error";

export function ContactForm({
  dict,
}: {
  dict: Dictionary["contact"]["form"];
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
          empresa: data.get("empresa"),
          email: data.get("email"),
          telefono: data.get("telefono"),
          mensaje: data.get("mensaje"),
          website: data.get("website"),
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const first = (data.get("nombre") ?? "").toString().trim().split(" ")[0];
      setSentName(first);
    } catch {
      setStatus("error");
    }
  }

  if (sentName !== null) {
    return (
      <div className="flex min-h-[440px] flex-col items-start justify-center gap-4 rounded-[4px] bg-white p-8 text-ink sm:p-12">
        <span className="flex size-12 items-center justify-center rounded-full bg-azure text-2xl font-medium">
          ✓
        </span>
        <h3 className="text-[28px] font-medium tracking-[-0.6px]">
          {sentName
            ? dict.thanksNamed.replace("{name}", sentName)
            : dict.thanks}
        </h3>
        <p className="text-[16px] leading-[1.55] text-ink/60">
          {dict.thanksBody}
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <div className="rounded-[4px] bg-white p-8 text-ink sm:p-12">
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

        <div className="flex flex-col gap-2">
          <label htmlFor="nombre" className="text-[13px] text-ink/55">
            {dict.name}
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            maxLength={120}
            placeholder={dict.namePlaceholder}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="empresa" className="text-[13px] text-ink/55">
            {dict.company}
          </label>
          <input
            id="empresa"
            name="empresa"
            maxLength={160}
            placeholder={dict.companyPlaceholder}
            className={fieldClass}
          />
        </div>

        <div className="grid gap-[22px] sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-[13px] text-ink/55">
              {dict.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={200}
              placeholder={dict.emailPlaceholder}
              className={fieldClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="telefono" className="text-[13px] text-ink/55">
              {dict.phone}
            </label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              maxLength={40}
              placeholder={dict.phonePlaceholder}
              className={fieldClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="mensaje" className="text-[13px] text-ink/55">
            {dict.message}
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows={3}
            maxLength={2000}
            placeholder={dict.messagePlaceholder}
            className={`${fieldClass} resize-none`}
          />
        </div>

        {status === "error" ? (
          <p
            role="alert"
            className="text-[14px] leading-[1.5] text-[#B42318]"
          >
            {dict.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={sending}
          aria-busy={sending}
          className="mt-2.5 cursor-pointer rounded-[2px] bg-ink p-[17px] text-[16px] font-medium text-white transition-colors hover:bg-azure hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-ink disabled:hover:text-white"
        >
          {sending ? dict.sending : dict.submit}
        </button>
      </form>
    </div>
  );
}
