export type ResourceAttachmentMode = "none" | "upload" | "saved"

export type SavedResource = {
  id: string
  name: string
  updatedAt: string
  termCount?: number
}

export const MOCK_SAVED_GLOSSARIES: SavedResource[] = [
  { id: "gl-legal-en-de", name: "Legal EN → DE", updatedAt: "2026-09-12", termCount: 312 },
  { id: "gl-product-fr", name: "Product terminology (FR)", updatedAt: "2026-08-03", termCount: 245 },
  { id: "gl-medical-es", name: "Medical glossary (ES)", updatedAt: "2026-07-21", termCount: 891 },
]

export const MOCK_SAVED_GUIDELINES: SavedResource[] = [
  { id: "gd-formal-eu", name: "Formal EU register", updatedAt: "2026-09-01", termCount: 18 },
  { id: "gd-marketing", name: "Marketing tone of voice", updatedAt: "2026-06-18", termCount: 24 },
  { id: "gd-internal", name: "Internal comms style", updatedAt: "2026-05-09", termCount: 12 },
]

export function formatSavedResourceLabel(item: SavedResource): string {
  return item.termCount ? `${item.name} (${item.termCount})` : item.name
}

export type TranslationResourceSelection = {
  mode: ResourceAttachmentMode
  file: File | null
  savedId: string
}

export type TranslationEnhancements = {
  context: string
  glossary: TranslationResourceSelection
  guidelines: TranslationResourceSelection
}

export function emptyResourceSelection(): TranslationResourceSelection {
  return { mode: "none", file: null, savedId: "" }
}

export function emptyTranslationEnhancements(): TranslationEnhancements {
  return {
    context: "",
    glossary: emptyResourceSelection(),
    guidelines: emptyResourceSelection(),
  }
}

export function resolveResourceLabel(
  selection: TranslationResourceSelection,
  saved: SavedResource[],
): string | undefined {
  if (selection.mode === "upload" && selection.file) {
    return selection.file.name
  }
  if (selection.mode === "saved" && selection.savedId) {
    return saved.find((item) => item.id === selection.savedId)?.name
  }
  return undefined
}
