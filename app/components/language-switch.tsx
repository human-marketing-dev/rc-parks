"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Dictionary, type Locale } from "../dictionaries";

const labels: Record<Locale, string> = { es: "ES", en: "EN" };

export function LanguageSwitch({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["languageSwitch"];
}) {
  const pathname = usePathname();

  // Cambia solo el primer segmento (/es/... → /en/...), así el enlace seguirá
  // siendo correcto si algún día la landing deja de ser una sola página.
  const pathFor = (target: Locale) => {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  };

  return (
    <div
      className="flex items-center rounded-btn border border-ink/15 p-0.5"
      role="group"
      aria-label={dict.label}
    >
      {locales.map((target) => {
        const isActive = target === locale;
        return (
          <Link
            key={target}
            href={pathFor(target)}
            hrefLang={target}
            aria-current={isActive ? "true" : undefined}
            aria-label={target === "en" ? dict.toEnglish : dict.toSpanish}
            className={`rounded-[1px] px-2 py-1 text-[12px] font-medium transition-colors md:px-2.5 md:text-[13px] ${
              isActive
                ? "bg-ink text-white"
                : "text-ink/50 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {labels[target]}
          </Link>
        );
      })}
    </div>
  );
}
