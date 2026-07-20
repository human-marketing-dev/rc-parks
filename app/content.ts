/**
 * Datos duros del parque: viven una sola vez, fuera de los diccionarios, para que
 * una cifra no pueda quedar distinta entre español e inglés. Los diccionarios
 * traducen los textos y le ponen nombre a cada `id` de aquí.
 */

import type { Locale } from "./dictionaries";

const MILES_PER_KM = 0.621371;

/**
 * Las distancias se guardan en km (número) y se formatean al vuelo: km en
 * español, millas en inglés. Así una sola cifra alimenta ambas versiones y no
 * pueden quedar desfasadas.
 */
export function formatDistance(km: number, locale: Locale): string {
  if (locale !== "en") return `${km} km`;

  const miles = km * MILES_PER_KM;
  // Conserva un decimal solo si el valor original en km lo traía.
  return Number.isInteger(km)
    ? `${Math.round(miles)} mi`
    : `${miles.toFixed(1)} mi`;
}

export const stats = [
  { id: "area", value: "67,000", delay: 0 },
  { id: "power", value: "2,400", delay: 90 },
  { id: "clean", value: "900", delay: 180 },
] as const;

export const fronteras = [
  { id: "colombia", name: "Puente Colombia", km: 230 },
  { id: "pharr", name: "Pharr, Texas", km: 190 },
  { id: "reynosa", name: "Reynosa", km: 232 },
] as const;

export type LocationItem = {
  id: string;
  /** Numeración propia de la lista; no corresponde a los puntos del mapa. */
  num?: string;
  /** En kilómetros; se convierte a millas en la versión en inglés. */
  km?: number;
  /** Conexión directa (ferrocarril): el texto lo pone el diccionario. */
  direct?: boolean;
};

export type LocationGroup = { id: string; items: LocationItem[] };

export const locationGroups: LocationGroup[] = [
  {
    id: "empresas",
    items: [
      { id: "lego", num: "01", km: 14.6 },
      { id: "volvo", num: "02", km: 5.2 },
      { id: "ternium-pesqueria", num: "03", km: 26 },
      { id: "ternium-planos", num: "04", km: 24 },
      { id: "ternium-largos", num: "05", km: 19 },
      { id: "kia", num: "06", km: 25 },
    ],
  },
  {
    id: "aeropuertos",
    items: [
      { id: "aeropuerto-norte", km: 18 },
      { id: "aeropuerto-mty", km: 32 },
    ],
  },
  {
    id: "accesos",
    items: [
      { id: "reynosa", km: 232 },
      { id: "laredo", km: 201 },
      { id: "saltillo", km: 106 },
    ],
  },
  {
    id: "ferrocarriles",
    items: [
      { id: "ferromex", direct: true },
      { id: "kcs", direct: true },
    ],
  },
];

export const socialLinks = [
  {
    id: "instagram",
    name: "Instagram",
    href: "https://www.instagram.com/rcparksmty/",
  },
  {
    id: "facebook",
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61576694774936",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/rc-parks/",
  },
] as const;

export const contactInfo = {
  email: "contacto@rc-parks.com",
  phone: "+52 81 3100 6363",
  whatsapp: "https://wa.me/528131006363",
  site: "rc-parks.com",
};
