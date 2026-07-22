import { AttributionTracker } from "./attribution-tracker";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "./google-tag-manager";
import { WhatsAppProvider } from "./whatsapp-provider";
import { contactInfo } from "../content";
import type { Dictionary, Locale } from "../dictionaries";

/**
 * Envoltura común a todos los root layouts (home `[lang]`, y las landings de
 * campaña `/cotiza` y `/getquote`, que son root layouts propios por vivir fuera
 * de `[lang]`). Centraliza `<html>/<body>`, GTM, la captura de atribución y el
 * widget de WhatsApp para no repetir el mismo boilerplate tres veces.
 */
export function SiteShell({
  lang,
  dict,
  children,
}: {
  lang: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <html lang={lang} className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <AttributionTracker />
        <WhatsAppProvider
          dict={dict.whatsapp}
          number={contactInfo.whatsappNumber}
        >
          {children}
        </WhatsAppProvider>
      </body>
    </html>
  );
}
