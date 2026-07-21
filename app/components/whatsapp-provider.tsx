"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Dictionary } from "../dictionaries";
import { trackWhatsAppClick } from "../lib/analytics";

type WhatsAppDict = Dictionary["whatsapp"];

// Glifo de WhatsApp (Simple Icons, 24×24). Inline para no sumar librería de íconos.
const WHATSAPP_GLYPH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.335 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={WHATSAPP_GLYPH} />
    </svg>
  );
}

/** Arma el enlace wa.me con el mensaje pre-rellenado. */
function waLink(number: string, message: string): string {
  const text = message.trim()
    ? `?text=${encodeURIComponent(message.trim())}`
    : "";
  return `https://wa.me/${number}${text}`;
}

type WhatsAppContextValue = {
  open: (location: string) => void;
  /** Enlace directo con el mensaje por defecto: respaldo si no hay JS. */
  directHref: string;
};

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null);

export function useWhatsApp(): WhatsAppContextValue {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) {
    throw new Error("useWhatsApp debe usarse dentro de <WhatsAppProvider>");
  }
  return ctx;
}

/**
 * Provee el modal de WhatsApp a todo el sitio: un único modal + botón flotante,
 * y una función `open(location)` para que cualquier disparador (el número de
 * contacto, el flotante…) lo abra. El clic en el botón final del modal es el que
 * emite `whatsapp_click` — por eso el evento representa intención real, no un
 * roce accidental sobre el número.
 */
export function WhatsAppProvider({
  dict,
  number,
  children,
  showFloating = true,
}: {
  dict: WhatsAppDict;
  number: string;
  children: React.ReactNode;
  showFloating?: boolean;
}) {
  const [location, setLocation] = useState<string | null>(null);

  const open = useCallback((from: string) => setLocation(from), []);
  const close = useCallback(() => setLocation(null), []);

  const directHref = waLink(number, dict.defaultMessage);

  return (
    <WhatsAppContext.Provider value={{ open, directHref }}>
      {children}
      {showFloating ? (
        <FloatingButton
          label={dict.floatingLabel}
          onClick={() => open("floating_button")}
        />
      ) : null}
      {location !== null ? (
        <WhatsAppModal
          dict={dict}
          number={number}
          location={location}
          onClose={close}
        />
      ) : null}
    </WhatsAppContext.Provider>
  );
}

/**
 * Envuelve cualquier contenido para que, al hacer clic, abra el modal. Renderiza
 * un `<a href>` real al WhatsApp directo: sin JS lleva a la conversación; con JS
 * intercepta y abre el modal (progressive enhancement).
 */
export function WhatsAppTrigger({
  location,
  className,
  children,
}: {
  location: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { open, directHref } = useWhatsApp();
  return (
    <a
      href={directHref}
      onClick={(event) => {
        event.preventDefault();
        open(location);
      }}
      className={className}
    >
      {children}
    </a>
  );
}

function FloatingButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="fixed right-5 bottom-5 z-[60] flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] md:right-7 md:bottom-7"
    >
      <WhatsAppGlyph className="size-7" />
    </button>
  );
}

function WhatsAppModal({
  dict,
  number,
  location,
  onClose,
}: {
  dict: WhatsAppDict;
  number: string;
  location: string;
  onClose: () => void;
}) {
  const [message, setMessage] = useState(dict.defaultMessage);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Escape cierra, se bloquea el scroll del fondo y el foco entra al CTA.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ctaRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  // Segundo clic: se emite el evento y la navegación la hace el propio <a href>.
  const handleOpen = () => {
    trackWhatsAppClick(location);
    onClose();
  };

  return (
    <div
      className="wa-overlay fixed inset-0 z-[70] flex items-end justify-center bg-ink/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="wa-title"
        className="wa-card w-full max-w-[420px] rounded-[6px] bg-white p-6 text-ink shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 flex-none items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsAppGlyph className="size-5" />
            </span>
            <h2
              id="wa-title"
              className="text-[19px] font-medium tracking-[-0.3px]"
            >
              {dict.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.close}
            className="-mt-1 -mr-1 flex size-8 flex-none items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-[14px] leading-[1.5] text-ink/60">
          {dict.description}
        </p>

        <label
          htmlFor="wa-message"
          className="mt-5 block text-[13px] text-ink/55"
        >
          {dict.messageLabel}
        </label>
        <textarea
          id="wa-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          className="mt-2 w-full resize-none rounded-[3px] border border-field bg-transparent p-3 text-[15px] outline-none transition-colors focus:border-[#25D366]"
        />

        <a
          ref={ctaRef}
          href={waLink(number, message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpen}
          className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-[3px] bg-[#25D366] p-[15px] text-[16px] font-medium text-white transition-colors hover:bg-[#1ebe5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
        >
          <WhatsAppGlyph className="size-[18px]" />
          {dict.open}
        </a>
      </div>
    </div>
  );
}
