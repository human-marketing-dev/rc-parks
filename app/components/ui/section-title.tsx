import { cx } from "../../lib/cx";

const sizes = {
  md: "text-display-md",
  lg: "text-display-lg",
  xl: "text-display-xl",
  "2xl": "text-display-2xl",
} as const;

/**
 * Título de display. Tamaño, interlineado y tracking los da el token
 * --text-display-*; `font-medium` va además explícito como respaldo por si el
 * modificador --font-weight del tema cambiara de comportamiento entre versiones
 * de Tailwind.
 */
export function SectionTitle({
  as: Tag = "h2",
  size = "lg",
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag className={cx(sizes[size], "font-medium text-balance", className)}>
      {children}
    </Tag>
  );
}
