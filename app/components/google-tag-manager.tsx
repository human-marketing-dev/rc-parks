import Script from "next/script";
import { GTM_ID } from "../lib/analytics";

/**
 * Contenedor web de Google Tag Manager, a nivel de todo el sitio. Se inyecta
 * manualmente (sin `@next/third-parties`) para no sumar dependencias: son ~10
 * líneas y el proyecto evita librerías de más.
 *
 * `afterInteractive` es la estrategia recomendada para GTM: carga en cuanto la
 * página es interactiva, sin bloquear el render. El `dataLayer` lo inicializa el
 * propio snippet, así que cualquier `pushToDataLayer` previo queda encolado.
 */
export function GoogleTagManager() {
  return (
    <Script id="gtm-base" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

/**
 * Respaldo para navegadores sin JS. Va inmediatamente después de <body>.
 */
export function GoogleTagManagerNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
