"use client";

import { useState } from "react";
import type { Dictionary } from "../dictionaries";

const fieldClass =
  "border-b border-field bg-transparent py-2.5 text-[16px] outline-none transition-colors focus:border-azure";

export function ContactForm({
  dict,
}: {
  dict: Dictionary["contact"]["form"];
}) {
  const [sentName, setSentName] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const first = (data.get("nombre") ?? "").toString().trim().split(" ")[0];
    setSentName(first);
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

  return (
    <div className="rounded-[4px] bg-white p-8 text-ink sm:p-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[22px]">
        <div className="flex flex-col gap-2">
          <label htmlFor="nombre" className="text-[13px] text-ink/55">
            {dict.name}
          </label>
          <input
            id="nombre"
            name="nombre"
            required
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
            placeholder={dict.messagePlaceholder}
            className={`${fieldClass} resize-none`}
          />
        </div>

        <button
          type="submit"
          className="mt-2.5 cursor-pointer rounded-[2px] bg-ink p-[17px] text-[16px] font-medium text-white transition-colors hover:bg-azure hover:text-ink"
        >
          {dict.submit}
        </button>
      </form>
    </div>
  );
}
