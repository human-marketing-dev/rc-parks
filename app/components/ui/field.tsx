import { cx } from "../../lib/cx";

/**
 * Receta compartida de los inputs de línea (solo borde inferior). text-body
 * (16px) además evita el zoom automático de iOS al enfocar el campo.
 */
const fieldClass =
  "border-b border-field bg-transparent py-2.5 text-body outline-none transition-colors focus:border-azure";

type WrapProps = {
  id: string;
  label: string;
  className?: string;
};

function Wrap({
  id,
  label,
  className,
  children,
}: WrapProps & { children: React.ReactNode }) {
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-label text-ink/55">
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextField({
  id,
  label,
  className,
  ...rest
}: WrapProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap id={id} label={label} className={className}>
      <input id={id} {...rest} className={fieldClass} />
    </Wrap>
  );
}

export function TextAreaField({
  id,
  label,
  className,
  ...rest
}: WrapProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap id={id} label={label} className={className}>
      <textarea id={id} {...rest} className={cx(fieldClass, "resize-none")} />
    </Wrap>
  );
}
