export const marqueeWords = [
  "Triple A",
  "Manufactura inteligente",
  "Almacenamiento",
  "4,500 KWa",
  "Vigilancia 24/7",
  "Bodegas de concreto",
  "Logística",
  "Ciénega de Flores",
  "Monterrey · Texas",
];

export const stats = [
  { value: "100,000", label: "m² · Área total del parque", delay: 0 },
  { value: "65,000", label: "m² · Área arrendable", delay: 90 },
  { value: "4,500", label: "KWa · Disponibilidad energética", delay: 180 },
  { value: "+200,000", label: "Casas habitación alrededor", delay: 270 },
];

export const fronteras = [
  { name: "Puente Colombia", km: "230 km" },
  { name: "Nuevo Laredo", km: "190 km" },
  { name: "Reynosa", km: "232 km" },
];

export type LocationItem = { num?: string; name: string; km: string };

export const locationTabs: {
  key: string;
  label: string;
  items: LocationItem[];
}[] = [
  {
    key: "empresas",
    label: "Empresas",
    items: [
      { num: "01", name: "Tesla", km: "48 km" },
      { num: "02", name: "Nemak", km: "40 km" },
      { num: "03", name: "John Deere", km: "39 km" },
      { num: "04", name: "Caterpillar", km: "38 km" },
      { num: "05", name: "Kia Plant", km: "25 km" },
      { num: "06", name: "Ternium Pesquería", km: "26 km" },
      { num: "07", name: "Ternium Planos", km: "24 km" },
      { num: "08", name: "Ternium Largos", km: "19 km" },
      { num: "09", name: "Frisa", km: "40 km" },
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
