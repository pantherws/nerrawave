import type { DocumentPage } from "@/lib/mock-document-pages"

const IMG_HERO =
  "https://images.unsplash.com/photo-1500382017468-90403fed7de7?auto=format&fit=crop&w=900&q=80"
const IMG_PORTRAIT =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=480&q=80"

const CHART_SVG = `
<svg viewBox="0 0 420 160" class="task-doc-chart" role="img" aria-label="Emissions reduction chart">
  <text x="0" y="14" font-size="11" fill="#374151">Progress towards our 2030 targets</text>
  <rect x="40" y="110" width="48" height="40" fill="#e5e7eb" rx="2"/>
  <rect x="110" y="85" width="48" height="65" fill="#d1d5db" rx="2"/>
  <rect x="180" y="60" width="48" height="90" fill="#9ca3af" rx="2"/>
  <rect x="250" y="45" width="48" height="105" fill="#6b7280" rx="2"/>
  <rect x="320" y="30" width="48" height="120" fill="#525252" rx="2"/>
  <text x="52" y="128" font-size="9" fill="#374151">2019</text>
  <text x="118" y="128" font-size="9" fill="#374151">2021</text>
  <text x="188" y="128" font-size="9" fill="#fff">2022</text>
  <text x="258" y="128" font-size="9" fill="#fff">2023</text>
  <text x="328" y="128" font-size="9" fill="#fff">2024</text>
</svg>`.trim()

function sheet(body: string) {
  return `<div class="task-doc-sheet">${body}</div>`
}

const PAGE1_SOURCE = sheet(`
  <div class="task-doc-cover">
    <p class="task-doc-kicker">Annual disclosure</p>
    <h1 class="task-doc-cover-title">Sustainability Report 2024</h1>
    <p class="task-doc-cover-sub">Integrated environmental, social and governance performance</p>
    <div class="task-doc-cover-meta">
      <div><span>Reporting period</span><strong>Jan – Dec 2024</strong></div>
      <div><span>Publication</span><strong>March 2025</strong></div>
    </div>
    <img class="task-doc-cover-image" src="${IMG_HERO}" alt="Landscape at sunrise" width="720" height="320" />
  </div>
`)

const PAGE1_TRANSLATED = sheet(`
  <div class="task-doc-cover">
    <p class="task-doc-kicker">Informe anual</p>
    <h1 class="task-doc-cover-title">Informe de sostenibilidad 2024</h1>
    <p class="task-doc-cover-sub">Desempeño integrado ambiental, social y de gobernanza</p>
    <div class="task-doc-cover-meta">
      <div><span>Periodo</span><strong>Ene – Dic 2024</strong></div>
      <div><span>Publicación</span><strong>Marzo 2025</strong></div>
    </div>
    <img class="task-doc-cover-image" src="${IMG_HERO}" alt="Paisaje al amanecer" width="720" height="320" />
  </div>
`)

const PAGE2_SOURCE = sheet(`
  <p class="task-doc-section-num">1. Our approach to sustainability</p>
  <p class="task-doc-lead">We believe that long-term value depends on responsible stewardship of natural resources.</p>
  <p><span class="task-segment" data-segment-id="p2-s1">Our operational footprint extends across twelve countries, and we continue to invest in biodiversity programmes near every major facility.</span> In 2024 we reduced scope 1 and 2 emissions by 18% compared with our 2019 baseline.</p>
  <img class="task-doc-figure" src="${IMG_HERO}" alt="Renewable landscape" width="680" height="260" />
  <div class="task-doc-icon-row">
    <div class="task-doc-icon-card"><span class="task-doc-icon">🌱</span><strong>Regeneration</strong><p>Soil and habitat restoration near sites.</p></div>
    <div class="task-doc-icon-card"><span class="task-doc-icon">💧</span><strong>Water</strong><p>Closed-loop cooling at three plants.</p></div>
    <div class="task-doc-icon-card"><span class="task-doc-icon">⚡</span><strong>Energy</strong><p>92% renewable electricity in EMEA.</p></div>
  </div>
  ${CHART_SVG}
  <p class="task-doc-chart-caption"><span class="task-segment" data-segment-id="p2-s2">Progress towards our 2030 targets remains on track for renewable electricity and supplier engagement.</span> Water intensity improved 9% year over year.</p>
  <div class="task-doc-pullquote">
    <blockquote>“Transparency builds trust with the communities where we operate.”</blockquote>
    <div class="task-doc-pullquote-meta">
      <img src="${IMG_PORTRAIT}" alt="Executive portrait" width="56" height="56" />
      <div><strong>Elena Morales</strong><span>Chief Sustainability Officer</span></div>
    </div>
  </div>
`)

const PAGE2_TRANSLATED = sheet(`
  <p class="task-doc-section-num">1. Nuestro enfoque de la sostenibilidad</p>
  <p class="task-doc-lead">Creemos que el valor a largo plazo depende de una gestión responsable de los recursos naturales.</p>
  <p><span class="task-segment" data-segment-id="p2-s1">Nuestra huella operativa se extiende por doce países, y seguimos invirtiendo en programas de biodiversidad cerca de cada instalación principal.</span> En 2024 redujimos las emisiones de alcance 1 y 2 en un 18% respecto a la línea base de 2019.</p>
  <img class="task-doc-figure" src="${IMG_HERO}" alt="Paisaje renovable" width="680" height="260" />
  <div class="task-doc-icon-row">
    <div class="task-doc-icon-card"><span class="task-doc-icon">🌱</span><strong>Regeneración</strong><p>Restauración de suelos y hábitats cercanos.</p></div>
    <div class="task-doc-icon-card"><span class="task-doc-icon">💧</span><strong>Agua</strong><p>Refrigeración de circuito cerrado en tres plantas.</p></div>
    <div class="task-doc-icon-card"><span class="task-doc-icon">⚡</span><strong>Energía</strong><p>92% de electricidad renovable en EMEA.</p></div>
  </div>
  ${CHART_SVG}
  <p class="task-doc-chart-caption"><span class="task-segment" data-segment-id="p2-s2">El progreso hacia nuestros objetivos de 2030 sigue en buen camino en electricidad renovable y compromiso con proveedores.</span> La intensidad hídrica mejoró un 9% interanual.</p>
  <div class="task-doc-pullquote">
    <blockquote>«La transparencia genera confianza en las comunidades donde operamos.»</blockquote>
    <div class="task-doc-pullquote-meta">
      <img src="${IMG_PORTRAIT}" alt="Retrato ejecutivo" width="56" height="56" />
      <div><strong>Elena Morales</strong><span>Directora de sostenibilidad</span></div>
    </div>
  </div>
`)

function continuationSource(pageNumber: number) {
  return sheet(`
    <p class="task-doc-section-num">${pageNumber}. Performance data</p>
    <table class="task-doc-table">
      <tr><th>Metric</th><th>2023</th><th>2024</th><th>Target 2030</th></tr>
      <tr><td>Scope 1+2 (tCO₂e)</td><td>842</td><td>691</td><td>450</td></tr>
      <tr><td>Renewable electricity</td><td>78%</td><td>92%</td><td>100%</td></tr>
      <tr><td>Supplier audits</td><td>126</td><td>164</td><td>200</td></tr>
    </table>
    <p class="task-doc-body">Detailed methodology, assurance statements and scope 3 estimates are provided in the annex on page ${pageNumber + 1}.</p>
  `)
}

function continuationTranslated(pageNumber: number) {
  return sheet(`
    <p class="task-doc-section-num">${pageNumber}. Datos de desempeño</p>
    <table class="task-doc-table">
      <tr><th>Métrica</th><th>2023</th><th>2024</th><th>Objetivo 2030</th></tr>
      <tr><td>Alcance 1+2 (tCO₂e)</td><td>842</td><td>691</td><td>450</td></tr>
      <tr><td>Electricidad renovable</td><td>78%</td><td>92%</td><td>100%</td></tr>
      <tr><td>Auditorías a proveedores</td><td>126</td><td>164</td><td>200</td></tr>
    </table>
    <p class="task-doc-body">La metodología detallada, los informes de aseguramiento y las estimaciones de alcance 3 figuran en el anexo de la página ${pageNumber + 1}.</p>
  `)
}

export function getSustainabilityDocumentPages(pageCount: number, status: DocumentPage["status"]): DocumentPage[] {
  const count = Math.max(pageCount, 5)
  const pages: DocumentPage[] = []

  for (let i = 0; i < count; i += 1) {
    const pageNumber = i + 1
    let sourceHtml = continuationSource(pageNumber)
    let translatedHtml = continuationTranslated(pageNumber)
    if (pageNumber === 1) {
      sourceHtml = PAGE1_SOURCE
      translatedHtml = PAGE1_TRANSLATED
    } else if (pageNumber === 2) {
      sourceHtml = PAGE2_SOURCE
      translatedHtml = PAGE2_TRANSLATED
    }

    pages.push({
      pageNumber,
      status,
      sourceHtml,
      translatedHtml,
    })
  }

  return pages
}

export function useSustainabilityMock(task: { fileName?: string; title: string }) {
  const name = `${task.fileName ?? ""} ${task.title}`.toLowerCase()
  return (
    name.includes("sustain") ||
    name.includes("report") ||
    name.includes(".pdf") ||
    name.includes("annual")
  )
}
