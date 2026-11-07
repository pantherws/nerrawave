export type SegmentSuggestion = {
  id: string
  label: string
  text: string
}

export type DocumentSegment = {
  id: string
  index: number
  sourceText: string
  translatedText: string
  contextBefore: string
  contextAfter: string
  suggestions: SegmentSuggestion[]
}

export function getSegmentsForPage(pageNumber: number): DocumentSegment[] {
  if (pageNumber !== 2) {
    return [
      {
        id: `p${pageNumber}-s1`,
        index: 1,
        sourceText: "Summary section for page " + pageNumber,
        translatedText: "Sección resumida de la página " + pageNumber,
        contextBefore: "…continued from previous page.",
        contextAfter: "Additional tables and figures follow.",
        suggestions: [],
      },
    ]
  }

  return [
    {
      id: "p2-s1",
      index: 1,
      sourceText:
        "Our operational footprint extends across twelve countries, and we continue to invest in biodiversity programmes near every major facility.",
      translatedText:
        "Nuestra huella operativa se extiende por doce países, y seguimos invirtiendo en programas de biodiversidad cerca de cada instalación principal.",
      contextBefore:
        "1. Our approach to sustainability\n\nWe believe that long-term value depends on responsible stewardship of natural resources.",
      contextAfter:
        "In 2024 we reduced scope 1 and 2 emissions by 18% compared with our 2019 baseline.",
      suggestions: [
        {
          id: "s1-a",
          label: "Fluent • Natural",
          text: "Nuestra huella operativa abarca doce países y seguimos invirtiendo en programas de biodiversidad junto a cada instalación principal.",
        },
        {
          id: "s1-b",
          label: "More formal",
          text: "Nuestra huella operativa se extiende a doce países; continuamos invirtiendo en programas de biodiversidad en las proximidades de cada instalación principal.",
        },
        {
          id: "s1-c",
          label: "Shorter",
          text: "Operamos en doce países e invertimos en biodiversidad cerca de cada instalación principal.",
        },
      ],
    },
    {
      id: "p2-s2",
      index: 2,
      sourceText:
        "Progress towards our 2030 targets remains on track for renewable electricity and supplier engagement.",
      translatedText:
        "El progreso hacia nuestros objetivos de 2030 sigue en buen camino en electricidad renovable y compromiso con proveedores.",
      contextBefore: "Progress towards our 2030 targets",
      contextAfter: "Water intensity improved 9% year over year.",
      suggestions: [
        {
          id: "s2-a",
          label: "Fluent • Natural",
          text: "Avanzamos según lo previsto hacia los objetivos de 2030 en electricidad renovable y engagement de proveedores.",
        },
      ],
    },
  ]
}

export const TASK_WORKFLOW_STEPS = [
  "Translate",
  "Review",
  "Auto-fix",
  "Finalize",
] as const

export type TaskWorkflowStep = (typeof TASK_WORKFLOW_STEPS)[number]
