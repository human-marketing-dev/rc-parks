import { cx } from "../../lib/cx";

/**
 * Ancho de página estándar (reemplaza la constante SHELL que vivía en
 * page.tsx). `max-w-shell` sale del token --container-shell del tema.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cx("mx-auto w-full max-w-shell px-6 md:px-10", className)}>
      {children}
    </div>
  );
}
