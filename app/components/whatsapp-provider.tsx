"use client";

import Image from "next/image";
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
 * Provee el widget de WhatsApp a todo el sitio: un panel tipo chat anclado abajo
 * a la derecha (NO un modal a pantalla completa) + un botón flotante que aparece
 * tras unos segundos. El clic en el botón final del panel es el que emite
 * `whatsapp_click`, de modo que el evento representa intención real.
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
  const [fabReady, setFabReady] = useState(false);

  const open = useCallback((from: string) => setLocation(from), []);
  const close = useCallback(() => setLocation(null), []);
  const toggle = useCallback(
    () => setLocation((current) => (current ? null : "floating_button")),
    [],
  );

  // El botón flotante entra tras 5 s: deja respirar el primer vistazo del hero.
  useEffect(() => {
    const timer = setTimeout(() => setFabReady(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const directHref = waLink(number, dict.defaultMessage);

  return (
    <WhatsAppContext.Provider value={{ open, directHref }}>
      {children}
      {showFloating && fabReady ? (
        <FloatingButton label={dict.floatingLabel} onClick={toggle} />
      ) : null}
      {location !== null ? (
        <WhatsAppPanel
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
 * Envuelve cualquier contenido para que, al hacer clic, abra el panel. Renderiza
 * un `<a href>` real al WhatsApp directo: sin JS lleva a la conversación; con JS
 * intercepta y abre el panel (progressive enhancement).
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
      data-wa-fab
      onClick={onClick}
      aria-label={label}
      className="wa-fab fixed right-5 bottom-5 z-[60] flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp md:right-7 md:bottom-7"
    >
      <WhatsAppGlyph className="size-7" />
    </button>
  );
}

function WhatsAppPanel({
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
  const panelRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  // Cierra con Escape o al hacer clic fuera. No bloquea el scroll ni la página:
  // es un widget, no un modal.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target)) return;
      // Un clic en el botón flotante lo maneja su propio toggle.
      if (target instanceof Element && target.closest("[data-wa-fab]")) return;
      onClose();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    ctaRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [onClose]);

  // Segundo clic: se emite el evento y la navegación la hace el propio <a href>.
  const handleOpen = () => {
    trackWhatsAppClick(location);
    onClose();
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby="wa-title"
      className="wa-card fixed right-5 bottom-24 z-[65] w-[calc(100vw-2.5rem)] max-w-[330px] overflow-hidden rounded-panel bg-white shadow-2xl shadow-black/30 md:right-7 md:bottom-28"
    >
      <div className="flex items-center gap-3 bg-whatsapp-header px-4 py-3 text-white">
        <span className="size-9 flex-none overflow-hidden rounded-full bg-white/15">
          <Image
            src="/assets/logo-rc-parks-blue-black.webp"
            alt=""
            width={36}
            height={36}
            className="size-full object-cover"
          />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <div id="wa-title" className="text-[15px] font-medium">
            {dict.title}
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-white/75">
            <span className="size-1.5 rounded-full bg-online" />
            {dict.description}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.close}
          className="-mr-1 flex size-7 flex-none items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="bg-whatsapp-chat px-3.5 py-4">
        <div className="max-w-[92%] rounded-[10px] rounded-tl-[3px] bg-white px-3.5 py-2.5 text-[13.5px] leading-[1.5] text-ink/80 shadow-sm">
          {dict.greeting}
        </div>
      </div>

      <div className="bg-white p-3">
        <a
          ref={ctaRef}
          href={waLink(number, dict.defaultMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpen}
          className="flex w-full items-center justify-center gap-2.5 rounded-[9px] bg-whatsapp p-[13px] text-[15px] font-medium text-white transition-colors hover:bg-whatsapp-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp"
        >
          <WhatsAppGlyph className="size-[18px]" />
          {dict.open}
        </a>
      </div>
    </div>
  );
}
