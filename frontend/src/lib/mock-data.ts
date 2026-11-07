import type { DocumentPage } from "@/lib/mock-document-pages"

export type TaskStatus = "processing" | "completed" | "failed"

export interface TranslationTask {
  id: string
  title: string
  fileName: string
  sourceLanguage: string
  targetLanguage: string
  status: TaskStatus
  createdAt: string
  pageCount: number
  progress: number
  sourceContent: string
  translatedContent: string
  /** Optional instructions supplied at upload */
  translationContext?: string
  glossaryName?: string
  guidelinesName?: string
  pages?: DocumentPage[]
}

export function getMockSourceContent(fileName: string, sourceLanguage: string) {
  const title = fileName.replace(/\.[^/.]+$/, "")
  return `${title}

1. Intro

This is placeholder transcript text for the mock editor. In production, this would be the speech-to-text output from your upload.

2. Pricing note

Transcription is billed per minute. You start with complimentary minutes on signup; additional time uses the published credit tiers at checkout.

3. Confidentiality

Both parties agree to treat uploaded audio, transcripts, and account information as confidential.

4. Wrap-up

Detection / language context for this mock: ${sourceLanguage}`
}

export function getMockTranslatedContent(
  sourceContent: string,
  sourceLanguage: string,
  targetLanguage: string,
) {
  if (targetLanguage.toLowerCase().includes("french")) {
    return `${sourceContent.split("\n")[0]}

1. Portee des services

Le fournisseur fournira des services de traduction documentaire avec preservation de la mise en page pour tous les fichiers soumis. Les livrables comprennent les documents traduits au format demande, une revision qualite et un cycle de revisions.

2. Conditions de paiement

Les frais sont calcules par page. Le client recoit cinq pages gratuites a l'inscription. Les pages supplementaires sont facturees selon les niveaux de credits publies lors du paiement.

3. Confidentialite

Les deux parties conviennent de traiter les fichiers telecharges, les resultats traduits et les informations de compte comme confidentiels. Les documents ne doivent pas etre partages avec des tiers, sauf si necessaire pour achever la traduction.

4. Acceptation

Le present accord entre en vigueur a la date du premier telechargement et reste valable jusqu'a la fermeture du compte client.

Langue source : ${sourceLanguage}
Langue cible : ${targetLanguage}`
  }

  if (targetLanguage.toLowerCase().includes("spanish")) {
    return `${sourceContent.split("\n")[0]}

1. Alcance de los servicios

El proveedor entregara servicios de traduccion de documentos con preservacion del formato para todos los archivos enviados. Los entregables incluyen documentos traducidos en el formato solicitado, revision de calidad y una ronda de revisiones.

2. Terminos de pago

Las tarifas se calculan por pagina. El cliente recibe cinco paginas gratuitas al registrarse. Las paginas adicionales se facturan segun los niveles de creditos publicados al pagar.

3. Confidencialidad

Ambas partes acuerdan tratar los archivos cargados, los resultados traducidos y la informacion de la cuenta como confidenciales. Los materiales no deben compartirse con terceros excepto cuando sea necesario para completar la traduccion.

4. Aceptacion

Este acuerdo entra en vigor en la fecha de la primera carga y permanece valido hasta que el cliente cierre su cuenta.

Idioma de origen: ${sourceLanguage}
Idioma de destino: ${targetLanguage}`
  }

  return `${sourceContent.split("\n")[0]}

1. Scope of services

The supplier will provide document translation services with layout preservation for all submitted files. Deliverables include translated documents in the requested format, quality review, and one round of revisions.

2. Payment terms

Fees are calculated per page. The client receives five complimentary pages on signup. Additional pages are billed using the published credit tiers at checkout.

3. Confidentiality

Both parties agree to treat uploaded files, translated output, and account information as confidential. Materials must not be shared with third parties except where required to complete the translation.

4. Acceptance

This agreement takes effect on the date of first upload and remains valid until the client closes their account.

Source language: ${sourceLanguage}
Target language: ${targetLanguage}`
}

export interface MockUser {
  id: string
  email: string
  name: string
  credits: number
  freeMinutesRemaining: number
}

const TASKS_KEY = "nerrawave_tasks"
const LEGACY_TASKS_KEY = "nerracell_tasks"
const USER_KEY = "nerrawave_user"
const LEGACY_USER_KEY = "nerracell_user"

export function loadTasks(): TranslationTask[] {
  if (typeof window === "undefined") return []
  try {
    let raw = localStorage.getItem(TASKS_KEY)
    if (!raw) {
      raw = localStorage.getItem(LEGACY_TASKS_KEY)
      if (raw) {
        localStorage.setItem(TASKS_KEY, raw)
        localStorage.removeItem(LEGACY_TASKS_KEY)
      }
    }
    return raw ? (JSON.parse(raw) as TranslationTask[]) : []
  } catch {
    return []
  }
}

export function saveTasks(tasks: TranslationTask[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export function loadUser(): MockUser | null {
  if (typeof window === "undefined") return null
  try {
    let raw = localStorage.getItem(USER_KEY)
    if (!raw) {
      raw = localStorage.getItem(LEGACY_USER_KEY)
      if (raw) {
        localStorage.setItem(USER_KEY, raw)
        localStorage.removeItem(LEGACY_USER_KEY)
      }
    }
    if (!raw) return null
    const parsed = JSON.parse(raw) as MockUser & { freePagesRemaining?: number }
    if (
      typeof parsed.freeMinutesRemaining !== "number" &&
      typeof parsed.freePagesRemaining === "number"
    ) {
      parsed.freeMinutesRemaining = parsed.freePagesRemaining
    }
    delete (parsed as { freePagesRemaining?: number }).freePagesRemaining
    return parsed as MockUser
  } catch {
    return null
  }
}

export function saveUser(user: MockUser | null) {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(USER_KEY)
  }
}

export function createMockUser(email: string): MockUser {
  return {
    id: crypto.randomUUID(),
    email,
    name: email.split("@")[0] ?? "User",
    credits: 0,
    freeMinutesRemaining: 30,
  }
}

export type CreateTaskEnhancements = {
  translationContext?: string
  glossaryName?: string
  guidelinesName?: string
}

export function createMockTask(
  fileName: string,
  sourceLanguage: string,
  targetLanguage: string,
  enhancements?: CreateTaskEnhancements,
): TranslationTask {
  const sourceContent = getMockSourceContent(fileName, sourceLanguage)

  return {
    id: crypto.randomUUID(),
    title: fileName.replace(/\.[^/.]+$/, ""),
    fileName,
    sourceLanguage,
    targetLanguage,
    status: "processing",
    createdAt: new Date().toISOString(),
    pageCount: Math.max(1, Math.floor(Math.random() * 8) + 1),
    progress: 0,
    sourceContent,
    translatedContent: "",
    ...(enhancements?.translationContext
      ? { translationContext: enhancements.translationContext }
      : {}),
    ...(enhancements?.glossaryName ? { glossaryName: enhancements.glossaryName } : {}),
    ...(enhancements?.guidelinesName ? { guidelinesName: enhancements.guidelinesName } : {}),
  }
}

export function withLegacyTaskFields(task: TranslationTask): TranslationTask {
  const sourceContent =
    task.sourceContent ||
    getMockSourceContent(task.fileName, task.sourceLanguage)

  return {
    ...task,
    sourceContent,
    translatedContent: task.translatedContent ?? "",
    pages: task.pages,
  }
}
