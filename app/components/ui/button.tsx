import { cx } from "../../lib/cx";

const base =
  "inline-block cursor-pointer rounded-btn text-center transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  /** Fondo ink, hover azure: el CTA estándar (header, formulario). */
  dark: "bg-ink font-medium text-white hover:bg-azure hover:text-ink disabled:hover:bg-ink disabled:hover:text-white",
  /** Fondo azure: el CTA protagonista sobre fondos oscuros (hero). */
  accent: "bg-azure font-medium text-ink hover:bg-white",
  /** Delineado sobre fondo oscuro. Sin font-medium a propósito: el secundario
      del hero siempre fue regular y así se distingue del protagonista. */
  ghost: "border border-white/45 text-white hover:border-white hover:bg-white/10",
} as const;

const sizes = {
  lg: "px-[34px] py-[17px] text-body",
  /** Para el header: compacto en móvil, crece en md. */
  compact: "px-3.5 py-2.5 text-label md:px-[22px] md:py-3 md:text-nav",
} as const;

type ButtonProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Con `href` renderiza un <a>; sin él, un <button> (type, disabled, etc.). */
  href?: string;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = "dark",
  size = "lg",
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cx(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button {...rest} className={classes}>
      {children}
    </button>
  );
}
