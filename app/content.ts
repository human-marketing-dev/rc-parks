export const marqueeWords = [
  "Triple A",
  "Manufactura inteligente",
  "Almacenamiento",
  "2,400 KWa instalados",
  "Vigilancia 24/7",
  "Bodegas de concreto",
  "Logística",
  "Ciénega de Flores",
  "Monterrey · Texas",
];

export const stats = [
  { value: "67,000", label: "m²", delay: 0 },
  { value: "2,400", label: "KWa instalados", delay: 90 },
  { value: "900", label: "KW · Energías limpias", delay: 180 },
];

export const fronteras = [
  { name: "Puente Colombia", km: "230 km" },
  { name: "Pharr, Texas", km: "190 km" },
  { name: "Reynosa", km: "232 km" },
];

export type LocationItem = { num?: string; name: string; km?: string };

export const locationTabs: {
  key: string;
  label: string;
  items: LocationItem[];
}[] = [
  {
    key: "empresas",
    label: "Empresas",
    // La numeración es propia de esta lista: ya no corresponde a los puntos del mapa.
    // Lego y Volvo aún no tienen distancia confirmada.
    items: [
      { num: "01", name: "Lego" },
      { num: "02", name: "Volvo" },
      { num: "03", name: "Ternium Pesquería", km: "26 km" },
      { num: "04", name: "Ternium Planos", km: "24 km" },
      { num: "05", name: "Ternium Largos", km: "19 km" },
      { num: "06", name: "Kia Plant", km: "25 km" },
      { num: "07", name: "Tesla", km: "48 km" },
      { num: "08", name: "Nemak", km: "40 km" },
      { num: "09", name: "John Deere", km: "39 km" },
      { num: "10", name: "Caterpillar", km: "38 km" },
      { num: "11", name: "Frisa", km: "40 km" },
    ],
  },
  {
    key: "aeropuertos",
    label: "Aeropuertos",
    items: [
      { name: "Aeropuerto Int. del Norte", km: "18 km" },
      {
        name: "Aeropuerto Int. de Monterrey · Mariano Escobedo",
        km: "32 km",
      },
    ],
  },
  {
    key: "accesos",
    label: "Accesos",
    items: [
      { name: "Autopista MTY – Reynosa", km: "232 km" },
      { name: "Autopista MTY – Laredo", km: "201 km" },
      { name: "Autopista MTY – Saltillo", km: "106 km" },
    ],
  },
  {
    key: "ferrocarriles",
    label: "Ferrocarriles",
    items: [
      { name: "Ferromex", km: "Directo" },
      { name: "Kansas City Southern", km: "Directo" },
    ],
  },
];
