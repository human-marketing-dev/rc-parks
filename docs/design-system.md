# Design system

Sistema tokenizado del sitio, en dos capas:

1. **Tokens** en el `@theme` de [`app/globals.css`](../app/globals.css)
   (Tailwind v4, CSS-first: cada token genera su utilidad con nombre).
2. **Primitivas UI** en [`app/components/ui/`](../app/components/ui/), que
   convierten los tokens en recetas reutilizables.

Regla de oro: **ningún valor de diseño se inventa en un componente**. Colores,
radios, tracking y roles tipográficos salen del tema; las recetas repetidas
(botón, campo, título…) salen de `ui/`.

## Tokens

### Color

| Token | Valor | Utilidades | Uso |
| --- | --- | --- | --- |
| `ink` | `#0a0a0a` | `bg-ink`, `text-ink`… | Marca: tinta / fondos oscuros. |
| `azure` | `#4ebfe0` | `bg-azure`, `text-azure`… | Marca: acento. |
| `stone` | `#e8e6e4` | `border-stone`… | Neutro de superficie. |
| `stone-dark` | `#dedcda` | `hover:bg-stone-dark` | Hover de `stone`. |
| `hairline` | `#f0efec` | `border-hairline` | Divisores finos. |
| `field` | `#dad8d5` | `border-field` | Bordes de inputs. |
| `error` | `#b42318` | `text-error` | Mensajes de error. |
| `online` | `#4ade80` | `bg-online` | Punto de "en línea". |
| `whatsapp` | `#25d366` | `bg-whatsapp`, `outline-whatsapp` | Verde de marca de WhatsApp. |
| `whatsapp-hover` | `#1ebe5a` | `hover:bg-whatsapp-hover` | Hover del CTA de WhatsApp. |
| `whatsapp-header` | `#128c7e` | `bg-whatsapp-header` | Header del panel de chat. |
| `whatsapp-chat` | `#ece5dd` | `bg-whatsapp-chat` | Fondo de la burbuja de chat. |

### Tipografía (roles, no tamaños)

Cada rol empaqueta tamaño + interlineado (+ tracking y peso en los display), así
un heading nuevo no inventa su propio `clamp(...)`:

| Token | Utilidad | Valor | Uso |
| --- | --- | --- | --- |
| `eyebrow` | `text-eyebrow` | 12.5px · ls 3px · w500 | Kickers en mayúsculas. |
| `label` | `text-label` | 13px | Labels de formulario, rótulos. |
| `nav` | `text-nav` | 14.5px | Links del header. |
| `body` | `text-body` | 16px | Inputs, botones, cuerpo. 16px evita el zoom de iOS al enfocar. |
| `lead` | `text-lead` | clamp(16→20px) · lh 1.6 | Párrafos introductorios. |
| `display-md` | `text-display-md` | clamp(24→34px) | Título de tile destacado. |
| `display-lg` | `text-display-lg` | clamp(32→48px) | Título de sección (h2). |
| `display-xl` | `text-display-xl` | clamp(35→60px) | Cita de visión. |
| `display-2xl` | `text-display-2xl` | clamp(41→80px) | H1 del hero. |

### Forma y layout

| Token | Utilidad | Valor | Uso |
| --- | --- | --- | --- |
| `radius-btn` | `rounded-btn` | 2px | Botones, chips. |
| `radius-field` | `rounded-field` | 3px | Tarjetas pequeñas de datos. |
| `radius-card` | `rounded-card` | 4px | Tarjetas, imágenes. |
| `radius-tile` | `rounded-tile` | 5px | Tiles del bento. |
| `radius-panel` | `rounded-panel` | 14px | Panel flotante de WhatsApp. |
| `tracking-caption` | `tracking-caption` | 2px | Rótulos de captions. |
| `tracking-label` | `tracking-label` | 1.5px | Mini-labels en mayúsculas. |
| `container-shell` | `max-w-shell` | 1400px | Ancho de página (via `Container`). |

## Primitivas UI (`app/components/ui/`)

Todas son server-safe (sin hooks) y aceptan `className` para márgenes/anchos.

| Componente | API | Reemplaza |
| --- | --- | --- |
| `Container` | `className` | La constante `SHELL` de page.tsx. |
| `Eyebrow` | `tone: "azure" \| "muted" \| "inherit"` | La constante `EYEBROW`. |
| `SectionTitle` | `as: h1–h3` · `size: md–2xl` | Los `<h2 className="text-[clamp…">` por sección. |
| `Button` | `variant: dark \| accent \| ghost` · `size: lg \| compact` · `href?` | Las 4 recetas de botón dispersas. Con `href` es `<a>`; sin él, `<button>` (pasa `type`, `disabled`, `aria-*`). |
| `TextField` / `TextAreaField` | `id`, `label` + atributos nativos | El `fieldClass` + label del formulario. |

```tsx
<Container className="py-24">
  <Eyebrow>05 — Contacto</Eyebrow>
  <SectionTitle className="mt-5">Solicita tu espacio.</SectionTitle>
  <Button href="#contacto" variant="accent">Solicitar</Button>
  <TextField id="email" name="email" type="email" label="Email" required />
</Container>
```

## Reglas

- **Ningún hex fuera de `@theme`.** Color nuevo → primero se nombra en el tema.
- **Radios y tracking siempre por token** (`rounded-card`, no `rounded-[4px]`).
- **Headings por `SectionTitle`/tokens display**; no clamps a mano.
- **Un valor arbitrario (`text-[15px]`) es válido mientras sea único.** En
  cuanto aparece en un segundo lugar, se promueve a token. (Quedan varios
  one-offs deliberados: marquee, cifras de stats, números fantasma del bento.)
- **`cx` de [`app/lib/cx.ts`](../app/lib/cx.ts)** para clases condicionales; no
  se agrega tailwind-merge mientras las recetas no compitan por propiedades.

## Cómo extender

- **Token nuevo:** agrégalo al `@theme` con comentario de uso → la utilidad
  existe al instante (`--color-x` → `bg-x`, `--radius-x` → `rounded-x`,
  `--text-x` → `text-x`).
- **Variante de botón:** una entrada más en `variants` de
  [`button.tsx`](../app/components/ui/button.tsx).
- **Primitiva nueva:** mismo patrón — server-safe, recetas desde tokens,
  `className` passthrough, comentario del porqué en español.

## Normalizaciones aplicadas al adoptarlo

El sistema unificó valores que habían drifteado entre secciones (cambios
deliberados, visualmente imperceptibles):

- Títulos de sección **46/48/50px → `display-lg` (48px)** con lh/tracking común.
- Leads **19/20/21px → `lead` (20px, lh 1.6)**.
- El submit del formulario adoptó el padding horizontal del `Button lg`
  (invisible: es `w-full` con texto centrado).

Verificado con un diff de estilos computados sobre 23 elementos clave: las
únicas diferencias contra el sitio previo son las tres de arriba.
