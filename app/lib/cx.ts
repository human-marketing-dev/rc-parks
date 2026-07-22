/**
 * Une clases condicionales. Suficiente para este proyecto: las recetas de los
 * componentes UI no compiten entre sí por las mismas propiedades, así que no
 * hace falta una dependencia tipo tailwind-merge.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
