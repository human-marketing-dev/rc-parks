import { cx } from "../../lib/cx";

const tones = {
  azure: "text-azure",
  muted: "text-ink/50",
  /** Hereda el color del contenedor (p. ej. la sección sobre fondo azure). */
  inherit: "",
} as const;

/**
 * Kicker de sección en mayúsculas ("05 — Contacto"). Tamaño, tracking y peso
 * salen del token --text-eyebrow; aquí solo se decide el tono.
 */
export function Eyebrow({
  tone = "azure",
  className,
  children,
}: {
  tone?: keyof typeof tones;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cx("text-eyebrow font-medium uppercase", tones[tone], className)}
    >
      {children}
    </span>
  );
}
