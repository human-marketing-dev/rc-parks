"use client";

import { useEffect } from "react";
import { captureAttribution } from "../lib/attribution";

/**
 * Monta la captura de atribución en todo el sitio. No pinta nada: solo corre al
 * cargar la página (que es justo cuando llega un clic de anuncio con sus UTMs)
 * y persiste el primer y último toque para que el formulario los adjunte.
 */
export function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
