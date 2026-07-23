/**
 * Datos duros del parque: viven una sola vez, fuera de los diccionarios, para que
 * una cifra no pueda quedar distinta entre español e inglés. Los diccionarios
 * traducen los textos y le ponen nombre a cada `id` de aquí.
 */

import type { Locale } from "./dictionaries";

const MILES_PER_KM = 0.621371;
const SQFT_PER_M2 = 10.763910417;

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

/**
 * Superficies: se guardan en m² y se convierten a pies cuadrados en inglés.
 * La unidad ("m²" / "sq ft") la pone el diccionario.
 */
export function formatArea(
  m2: number,
  locale: Locale,
  sqftOverride?: number,
): string {
  if (locale !== "en") return m2.toLocaleString("en-US");

  const sqft = sqftOverride ?? Math.round(m2 * SQFT_PER_M2);
  return sqft.toLocaleString("en-US");
}

export type Stat = {
  id: "area" | "power" | "clean";
  delay: number;
  /** Superficie en m²: se convierte a pies cuadrados en inglés. */
  m2?: number;
  /**
   * Cifra oficial en pies cuadrados. Cuando está presente gana sobre la
   * conversión automática de `m2`: la cifra comercial en sq ft no siempre es la
   * conversión exacta del m² redondeado que se publica en español.
   */
  sqft?: number;
  /** Valor sin unidad métrica (KW): igual en ambos idiomas. */
  value?: string;
};

export const stats: Stat[] = [
  { id: "area", m2: 67000, sqft: 723550, delay: 0 },
  { id: "power", value: "2,400", delay: 90 },
  { id: "clean", value: "900", delay: 180 },
];

/**
 * Strip de datos de la landing de renta. Solo cambia el primer dato: en lugar
 * del área total muestra el rango arrendable. Va como texto por idioma —y no
 * como número convertible— porque la cifra en sq ft es la oficial del cliente
 * (no la conversión exacta del rango en m²) y el separador difiere: "-" vs "to".
 */
export const rentalStats: {
  id: Stat["id"];
  delay: number;
  range?: Record<Locale, string>;
  value?: string;
}[] = [
  {
    id: "area",
    range: { es: "15,000 - 67,000", en: "161,450 to 723,550" },
    delay: 0,
  },
  { id: "power", value: "2,400", delay: 90 },
  { id: "clean", value: "900", delay: 180 },
];

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
  /** Número en formato wa.me (sin +): base para armar el enlace con mensaje. */
  whatsappNumber: "528131006363",
  site: "rc-parks.com",
};
