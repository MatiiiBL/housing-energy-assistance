const PROGRAMS = [
  {
    id: 'heap_regular',
    name: {
      en: 'HEAP Regular Benefit',
      es: 'Beneficio Regular HEAP',
    },
    adminAgency: 'OTDA via HRA',
    category: {
      en: 'Direct payment',
      es: 'Pago directo',
    },
    incomeLimit: {
      en: '60% of State Median Income (varies by household size).',
      es: '60% del ingreso medio estatal (varía según el tamaño del hogar).',
    },
    categoricalEligibility: {
      en: 'SNAP, Medicaid, SSI, or TANF enrollment grants automatic eligibility.',
      es: 'La inscripción en SNAP, Medicaid, SSI o TANF otorga elegibilidad automática.',
    },
    estimatedValue: {
      en: '$200–$700/year. Typically $300–$500 for NYC households.',
      es: '$200–$700/año. Típicamente $300–$500 para hogares en NYC.',
    },
    applicationUrl: 'https://access.nyc.gov/',
    applicationMethod: {
      en: 'Online via ACCESS HRA or in-person at an HRA HEAP office',
      es: 'En línea a través de ACCESS HRA o en persona en una oficina HEAP de HRA',
    },
    deadline: {
      en: 'Typically November through May.',
      es: 'Generalmente de noviembre a mayo.',
    },
    requiredDocuments: {
      en: [
        'Government-issued photo ID',
        'Proof of NYC residency',
        'Proof of income for all household members',
        'Utility account number or fuel vendor info',
        'Social Security numbers for all household members',
      ],
      es: [
        'Identificación con foto emitida por el gobierno',
        'Prueba de residencia en NYC',
        'Prueba de ingresos de todos los miembros del hogar',
        'Número de cuenta de servicios públicos o proveedor de combustible',
        'Números de Seguro Social de todos los miembros del hogar',
      ],
    },
    notes: {
      en: 'Apply early — funding runs out every year.',
      es: 'Solicite temprano — los fondos se agotan cada año.',
    },
    triggers: [],
    triggeredBy: null,
  },

  {
    id: 'heap_emergency',
    name: {
      en: 'HEAP Emergency Benefit',
      es: 'Beneficio de Emergencia HEAP',
    },
    adminAgency: 'OTDA via HRA',
    category: {
      en: 'Emergency',
      es: 'Emergencia',
    },
    incomeLimit: {
      en: 'Same as HEAP Regular. Requires active shutoff notice.',
      es: 'Igual que HEAP Regular. Requiere aviso activo de corte.',
    },
    categoricalEligibility: {
      en: 'Same as HEAP Regular.',
      es: 'Igual que HEAP Regular.',
    },
    estimatedValue: {
      en: 'Up to $600 one-time emergency payment.',
      es: 'Hasta $600 en un pago único de emergencia.',
    },
    applicationUrl: 'https://access.nyc.gov/',
    applicationMethod: {
      en: 'In-person at an HRA HEAP office',
      es: 'En persona en una oficina HEAP de HRA',
    },
    deadline: {
      en: 'Available during HEAP season with emergency.',
      es: 'Disponible durante la temporada HEAP con emergencia.',
    },
    requiredDocuments: {
      en: [
        'Active utility shutoff notice',
        'All standard HEAP documents',
      ],
      es: [
        'Aviso activo de corte de servicio',
        'Todos los documentos estándar de HEAP',
      ],
    },
    notes: {
      en: 'Cannot apply preemptively — must show active emergency.',
      es: 'No se puede solicitar de forma preventiva — debe haber una emergencia activa.',
    },
    triggers: [],
    triggeredBy: null,
  },
];

module.exports = { PROGRAMS };