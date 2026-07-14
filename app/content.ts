/**
 * Datos duros del parque: viven una sola vez, fuera de los diccionarios, para que
 * una cifra no pueda quedar distinta entre español e inglés. Los diccionarios
 * traducen los textos y le ponen nombre a cada `id` de aquí.
 */

export const stats = [
  { id: "area", value: "67,000", delay: 0 },
  { id: "power", value: "2,400", delay: 90 },
  { id: "clean", value: "900", delay: 180 },
] as const;

export const fronteras = [
  { id: "colombia", name: "Puente Colombia", km: "230 km" },
  { id: "pharr", name: "Pharr, Texas", km: "190 km" },
  { id: "reynosa", name: "Reynosa", km: "232 km" },
] as const;

export type LocationItem = {
  id: string;
  /** Numeración propia de la lista; no corresponde a los puntos del mapa. */
  num?: string;
  km?: string;
  /** Conexión directa (ferrocarril): el texto lo pone el diccionario. */
  direct?: boolean;
};

export type LocationGroup = { id: string; items: LocationItem[] };

export const locationGroups: LocationGroup[] = [
  {
    id: "empresas",
    items: [
      // Lego y Volvo aún no tienen distancia confirmada.
      { id: "lego", num: "01" },
      { id: "volvo", num: "02" },
      { id: "ternium-pesqueria", num: "03", km: "26 km" },
      { id: "ternium-planos", num: "04", km: "24 km" },
      { id: "ternium-largos", num: "05", km: "19 km" },
      { id: "kia", num: "06", km: "25 km" },
      { id: "tesla", num: "07", km: "48 km" },
      { id: "nemak", num: "08", km: "40 km" },
      { id: "john-deere", num: "09", km: "39 km" },
      { id: "caterpillar", num: "10", km: "38 km" },
      { id: "frisa", num: "11", km: "40 km" },
    ],
  },
  {
    id: "aeropuertos",
    items: [
      { id: "aeropuerto-norte", km: "18 km" },
      { id: "aeropuerto-mty", km: "32 km" },
    ],
  },
  {
    id: "accesos",
    items: [
      { id: "reynosa", km: "232 km" },
      { id: "laredo", km: "201 km" },
      { id: "saltillo", km: "106 km" },
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

export const contactInfo = {
  email: "contacto@rc-parks.com",
  phone: "+52 81 3100 6363",
  whatsapp: "https://wa.me/528131006363",
  site: "rc-parks.com",
};
