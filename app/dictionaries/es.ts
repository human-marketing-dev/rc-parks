/**
 * Sección del aviso de privacidad. La forma es uniforme (todas las llaves
 * presentes, aunque queden arrays vacíos) para que `typeof es` infiera
 * `string[]` en cada campo y el inglés pueda calzar el tipo sin fricción.
 */
export type PrivacySection = {
  heading: string;
  /** Párrafos antes de la lista. */
  paragraphs: string[];
  /** Viñetas (vacío si la sección no lleva lista). */
  items: string[];
  /** Párrafos después de la lista. */
  after: string[];
};

const privacySectionsEs: PrivacySection[] = [
  {
    heading: "¿Cómo protegemos sus datos personales?",
    paragraphs: [
      "En la recolección y tratamiento de los datos personales que usted nos proporciona cumplimos todos los principios que marca la Ley: licitud, calidad, consentimiento, información, finalidad, lealtad, proporcionalidad y responsabilidad.",
      "R.C. Parks ha implementado medidas de seguridad administrativas, técnicas y físicas para proteger sus datos personales, mismas que exigimos también a los proveedores de servicios que contratamos.",
    ],
    items: [],
    after: [],
  },
  {
    heading: "¿Qué datos personales recabamos?",
    paragraphs: [
      "Los datos personales que recabamos de usted de manera libre y voluntaria, a través del formulario de contacto de este sitio o de los medios de contacto publicados en él, podrán ser algunos o todos de los siguientes:",
    ],
    items: [
      "Nombre y apellido.",
      "Empresa a la que representa.",
      "Dirección de correo electrónico.",
      "Número de teléfono.",
      "La información que usted decida compartirnos en su mensaje (por ejemplo, superficie, energía y fechas requeridas).",
    ],
    after: [
      "Al navegar el sitio también recabamos, mediante cookies y tecnologías similares, datos de medición como las páginas visitadas, la fuente de la visita (parámetros de campaña e identificadores de clic), el idioma del navegador e identificadores de cookies de herramientas de analítica y publicidad (por ejemplo, Google y Meta). Estos datos se utilizan de forma agregada o seudonimizada para medir la eficacia de nuestras campañas.",
      "Usted puede deshabilitar las cookies desde la configuración de su navegador; el sitio seguirá funcionando con normalidad.",
    ],
  },
  {
    heading: "¿Para qué utilizamos sus datos personales?",
    paragraphs: [
      "Sus datos personales serán utilizados para las siguientes finalidades primarias:",
    ],
    items: [
      "Atender su solicitud de información sobre los espacios industriales de R.C. Parks y darle seguimiento comercial.",
      "Contactarle por correo electrónico, teléfono o WhatsApp.",
      "Procesos internos administrativos, como atención a clientes, cotización, contratación y cobranza.",
      "Elaboración de facturas y presentación de declaraciones ante autoridades fiscales, en caso de concretarse una relación comercial.",
    ],
    after: [
      "De manera secundaria, utilizamos datos de navegación y de contacto para campañas de marketing y ventas de R.C. Parks y para medir el desempeño de nuestra publicidad digital. Si no desea que sus datos se utilicen para estas finalidades secundarias, puede indicárnoslo en cualquier momento escribiendo a contacto@rc-parks.com.",
    ],
  },
  {
    heading: "¿Con quién compartimos su información?",
    paragraphs: [
      "Para operar este sitio y dar seguimiento a su solicitud, sus datos son tratados por proveedores tecnológicos que actúan por cuenta de R.C. Parks (encargados), como la plataforma de correo que nos notifica su solicitud, el sistema CRM donde damos seguimiento a los prospectos y las herramientas de medición publicitaria de Google y Meta (estas últimas reciben identificadores seudonimizados o cifrados).",
      "Sus datos personales pueden ser transferidos a la Secretaría de Hacienda y Crédito Público (SHCP), a través del Servicio de Administración Tributaria (SAT), cuando exista obligación legal. Fuera de estos casos, nos comprometemos a no transferir su información personal a terceros sin su consentimiento, salvo las excepciones previstas en la Ley.",
    ],
    items: [],
    after: [],
  },
  {
    heading: "¿Cómo puede ejercer sus derechos ARCO y revocar su consentimiento?",
    paragraphs: [
      "Usted tiene derecho a acceder a los datos personales que poseemos y a los detalles de su tratamiento, así como a rectificarlos si son inexactos, cancelarlos cuando considere que resultan excesivos o innecesarios para las finalidades que justificaron su obtención, u oponerse a su tratamiento para fines específicos (derechos ARCO). También puede revocar en cualquier momento el consentimiento que nos haya otorgado.",
      "Para ejercerlos, envíe una solicitud a contacto@rc-parks.com incluyendo al menos: su nombre completo, un teléfono o correo de contacto; copia de su identificación oficial (o, si actúa en representación del titular, el documento que lo acredite); el derecho que desea ejercer y una descripción clara de los datos personales respecto de los que lo ejerce.",
      "Le responderemos por el mismo medio en un plazo no mayor a 20 días hábiles.",
    ],
    items: [],
    after: [],
  },
  {
    heading: "Modificaciones al aviso de privacidad",
    paragraphs: [
      "Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso para atender novedades legislativas, políticas internas o nuevos requerimientos para la prestación de nuestros servicios. Las modificaciones estarán disponibles en esta página, con su fecha de última actualización.",
    ],
    items: [],
    after: [],
  },
  {
    heading: "Procedimiento de protección de derechos",
    paragraphs: [
      "Si considera que su derecho a la protección de datos personales ha sido vulnerado, puede acudir ante la autoridad garante en materia de protección de datos personales (la Secretaría Anticorrupción y Buen Gobierno). Más información en www.gob.mx.",
    ],
    items: [],
    after: [],
  },
  {
    heading: "Consentimiento para el tratamiento de sus datos",
    paragraphs: [
      "Al proporcionar sus datos a través del formulario o de los medios de contacto de este sitio, usted consiente que sean tratados conforme al presente aviso de privacidad. Si no está de acuerdo, puede comunicarlo por escrito a contacto@rc-parks.com o al domicilio señalado al inicio de este aviso.",
    ],
    items: [],
    after: [],
  },
];

export const es = {
  metadata: {
    title: "R.C. Parks — El futuro de la innovación industrial",
    description:
      "Parque industrial en Ciénega de Flores, N.L. Bodegas Triple A para manufactura y almacenamiento inteligente en el corredor Monterrey–Texas.",
  },

  nav: {
    why: "¿Por qué?",
    amenities: "Amenidades",
    location: "Ubicación",
    gallery: "Galería",
    cta: "Solicitar espacio",
    /** Versión corta para el header en móvil, donde no cabe la larga. */
    ctaShort: "Solicitar",
  },

  hero: {
    eyebrow: "Parque Industrial · Ciénega de Flores, N.L.",
    title: "El futuro de la innovación industrial.",
    lead: "Espacios Triple A diseñados para la nueva era de manufactura y almacenamiento inteligente. Redefiniendo la logística industrial del Noreste de México y Estados Unidos.",
    ctaPrimary: "Solicitar un espacio",
    ctaSecondary: "Ver ubicación",
    imageAlt: "Vista aérea del parque en Ciénega de Flores",
  },

  marquee: [
    "Triple A",
    "Manufactura inteligente",
    "Almacenamiento",
    "2,400 KWa instalados",
    "Vigilancia 24/7",
    "Bodegas de concreto",
    "Logística",
    "Ciénega de Flores",
    "Monterrey · Texas",
  ],

  stats: {
    area: "m²",
    power: "KWa instalados",
    clean: "KW · Energías limpias",
  },

  why: {
    eyebrow: "01 — ¿Por qué R.C. Parks?",
    title:
      "El epicentro de las oportunidades en el sector industrial de Monterrey.",
    body1:
      "En R.C. Parks no solo ofrecemos lugares: encarnamos una visión sólida y un compromiso con la excelencia. Representamos más que espacios, representamos oportunidades para el crecimiento y el éxito empresarial.",
    body2:
      "Combinamos infraestructura, ubicación y asesoría para el éxito de nuestros clientes, generando un impacto positivo en el desarrollo económico y social de la región.",
    imageAlt: "Acceso principal del parque",
    captionEyebrow: "Acceso controlado · Vigilancia 24/7",
    captionTitle: "Un parque diseñado para operar de clase mundial.",
  },

  amenities: {
    eyebrow: "02 — Amenidades estratégicas",
    title: "Parque Ciénega de Flores",
    address: "Ciénega de Flores 405, Predio No. 23, Zona Norte, N.L. México.",
    feature: {
      eyebrow: "Construcción de concreto",
      title: "Bodegas Triple A / AAA",
      body: "Naves modulares de la más alta especificación, listas para manufactura y almacenamiento inteligente.",
      imageAlt: "Bodegas Triple A",
    },
    tiles: {
      cfe: {
        title: "Planta de CFE frente al parque",
        body: "Subestación dedicada con energía de alta capacidad.",
      },
      security: {
        title: "Caseta de vigilancia 24/7",
        body: "Seguridad permanente y acceso controlado.",
      },
      offices: {
        title: "Oficinas con salas de juntas",
        body: "Espacios corporativos listos para operar.",
      },
      ramps: {
        title: "Rampas neumáticas",
        body: "Andenes para carga y descarga eficiente.",
      },
      homes: {
        title: "+200,000 casas alrededor",
        body: "Mano de obra calificada de inmediato.",
      },
    },
  },

  vision: {
    eyebrow: "Nuestra visión",
    quote:
      "“Tenemos una visión de futuro: ser el referente del sector industrial.”",
    lead: "Conectamos negocios con soluciones de infraestructura de clase mundial, generando un impacto positivo en el desarrollo económico y social de la región.",
    facts: [
      { term: "Fundación", value: "2024" },
      { term: "Giro", value: "Parques Industriales" },
      { term: "Región", value: "Noreste de México · Texas" },
    ],
  },

  gallery: {
    eyebrow: "03 — Galería",
    title: "Bodegas Triple A, listas para la operación de clase mundial.",
    captionEyebrow: "Exterior",
    captionTitle: "Naves modulares con andenes y rampas neumáticas.",
    exteriorAlt: "Vista exterior de las naves con andenes",
    interiorAlt: "Interior de una nave industrial",
    oficinasAlt: "Sala de juntas en las oficinas",
  },

  location: {
    eyebrow: "04 — Ubicación estratégica",
    title: "En el corazón del corredor industrial Monterrey–Texas.",
    borderLabel: "Frontera",
    mapAlt: "Mapa de puntos estratégicos alrededor del parque",
    direct: "Directo",
    tabs: {
      empresas: "Empresas",
      aeropuertos: "Aeropuertos",
      accesos: "Accesos",
      ferrocarriles: "Ferrocarriles",
    },
    items: {
      lego: "Lego",
      volvo: "Volvo",
      "ternium-pesqueria": "Ternium Pesquería",
      "ternium-planos": "Ternium Planos",
      "ternium-largos": "Ternium Largos",
      kia: "Kia Plant",
      "aeropuerto-norte": "Aeropuerto Int. del Norte",
      "aeropuerto-mty": "Aeropuerto Int. de Monterrey · Mariano Escobedo",
      reynosa: "Autopista MTY – Reynosa",
      laredo: "Autopista MTY – Laredo",
      saltillo: "Autopista MTY – Saltillo",
      ferromex: "Ferromex",
      kcs: "Kansas City Southern",
    },
    highlights: [
      { value: "15 min", label: "del Aeropuerto Int. del Norte" },
      { value: "20 min", label: "del centro de Nuevo León" },
    ],
  },

  contact: {
    eyebrow: "05 — Contacto",
    title: "Solicita tu espacio en R.C. Parks.",
    lead: "Déjanos tus datos y un asesor te contactará para conocer tus necesidades de espacio, energía y logística.",
    emailLabel: "Email",
    phoneLabel: "Teléfono · WhatsApp",
    addressLabel: "Dirección",
    addressLine1: "Ciénega de Flores 405, Predio No. 23,",
    addressLine2: "Zona Norte, N.L. México",
    form: {
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      lastName: "Apellido",
      lastNamePlaceholder: "Tu apellido",
      company: "Empresa",
      companyPlaceholder: "Nombre de tu empresa",
      email: "Email",
      emailPlaceholder: "tu@email.com",
      phone: "Teléfono",
      phonePlaceholder: "+52",
      message: "¿Qué espacio buscas?",
      messagePlaceholder: "m² requeridos, energía, fechas...",
      submit: "Enviar solicitud",
      sending: "Enviando…",
      error:
        "No pudimos enviar tu solicitud. Por favor inténtalo de nuevo en unos momentos.",
      thanks: "¡Gracias!",
      /** {name} se reemplaza con el primer nombre de quien envía. */
      thanksNamed: "¡Gracias, {name}!",
      thanksBody:
        "Hemos recibido tu solicitud. Un asesor de R.C. Parks te contactará muy pronto.",
    },
  },

  footer: {
    tagline:
      "Redefiniendo la logística industrial del Noreste de México y Texas. Espacios Triple A para la nueva era de manufactura.",
    rights: "© 2026 R.C. Parks. Todos los derechos reservados.",
    social: "Redes sociales",
    privacy: "Aviso de privacidad",
  },

  languageSwitch: {
    label: "Cambiar idioma",
    toEnglish: "Ver el sitio en inglés",
    toSpanish: "Ver el sitio en español",
  },

  whatsapp: {
    floatingLabel: "Escríbenos por WhatsApp",
    title: "R.C. Parks",
    description: "En línea",
    greeting:
      "¡Hola! 👋 ¿Buscas espacio industrial en R.C. Parks? Escríbenos y con gusto te ayudamos.",
    defaultMessage:
      "Hola, me interesa conocer más sobre los espacios disponibles en R.C. Parks.",
    open: "Abrir WhatsApp",
    close: "Cerrar",
  },

  privacy: {
    metaTitle: "Aviso de privacidad — R.C. Parks",
    metaDescription:
      "Aviso de privacidad de Conglomerado RC, S.A. de C.V. (R.C. Parks): qué datos personales recabamos, para qué los usamos y cómo ejercer tus derechos ARCO.",
    eyebrow: "Legal",
    title: "Aviso de privacidad",
    updated: "Última actualización: 22 de julio de 2026",
    intro: [
      "En cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (en lo sucesivo, la “Ley”), Conglomerado RC, S.A. de C.V. (en lo sucesivo, “R.C. Parks”), con domicilio en Av. Gómez Morín 900, Int. L 65, Col. Carrizalejo, C.P. 66254, San Pedro Garza García, Nuevo León, México, emite el presente aviso de privacidad para informarle sobre la responsabilidad y el tratamiento de sus datos personales.",
      "Puede contactarnos en el domicilio indicado o en la dirección de correo electrónico contacto@rc-parks.com.",
    ],
    sections: privacySectionsEs,
    backHome: "Volver al inicio",
  },

  /**
   * Landing de campaña (Google Ads). Vive en /cotiza (es) y /getquote (en) y
   * reutiliza las secciones del home (why, amenities, location…); aquí solo van
   * las llaves propias de la landing: hero de renta, diferenciadores, productos
   * y el consentimiento del formulario.
   */
  quote: {
    metaTitle:
      "Bodegas industriales en renta en Ciénega de Flores, N.L. | R.C. Parks",
    metaDescription:
      "Renta de bodegas y naves industriales Triple A en Ciénega de Flores, N.L. Desde 487 hasta 5,100 m², integrables hasta 8,400 m². CFE frente al parque, 2,400 KVA y vigilancia 24/7.",
    nav: {
      cta: "Solicitar Espacio",
      /** Etiqueta del enlace a la versión en inglés (/getquote). */
      otherLang: "English",
    },
    hero: {
      eyebrow: "Parque Industrial · Ciénega de Flores, N.L.",
      title: "Bodegas industriales en renta en Ciénega de Flores, N.L.",
      range: "Desde 487 hasta 5,100 m²",
      lead: "Naves Triple A listas para manufactura y almacenamiento inteligente, en el corazón del corredor Monterrey–Texas. Déjanos tus datos y un asesor te contacta el mismo día.",
      formHeading: "Solicita tu espacio",
      formSub: "Respuesta el mismo día hábil.",
      cta: "Solicitar Espacio",
    },
    differentiators: {
      eyebrow: "Por qué R.C. Parks",
      title: "La infraestructura que tu operación necesita.",
      items: [
        { id: "cfe", value: "CFE", label: "Planta de CFE frente al parque" },
        {
          id: "power",
          value: "2,400 KVA",
          label: "Capacidad eléctrica instalada",
        },
        {
          id: "security",
          value: "24/7",
          label: "Vigilancia y acceso controlado",
        },
        {
          id: "airport",
          value: "15 min",
          label: "Del Aeropuerto Int. del Norte",
        },
        {
          id: "border",
          value: "190 km",
          label: "A la frontera de Pharr, Texas",
        },
      ],
    },
    products: {
      eyebrow: "Espacios disponibles",
      title: "Dos formatos de nave, listos para operar.",
      lead: "Superficies flexibles según tu operación, con posibilidad de integrar módulos.",
      rangeLabel: "Superficie",
      items: [
        {
          id: "avenida",
          name: "Bodegas con frente a avenida",
          range: "430 – 615 m²",
          body: "Ideales para última milla, showroom o logística ligera, con exposición y acceso directo a avenida.",
          note: "",
        },
        {
          id: "naves",
          name: "Naves grandes",
          range: "2,200 – 5,100 m²",
          body: "Para manufactura y almacenamiento de alto volumen, con andenes y rampas neumáticas.",
          note: "Integrables hasta ~8,400 m².",
        },
      ],
    },
    consent: {
      before: "He leído y acepto el ",
      link: "aviso de privacidad",
      after: " y autorizo el tratamiento de mis datos para ser contactado.",
    },
  },
};

/** El español define la forma: si al inglés le falta una llave, TypeScript avisa. */
export type Dictionary = typeof es;
