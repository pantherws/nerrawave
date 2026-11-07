import {
  getSustainabilityDocumentPages,
  useSustainabilityMock,
} from "@/lib/sustainability-document-pages"

export type DocumentPage = {
  pageNumber: number
  status: "completed" | "processing"
  sourceHtml: string
  translatedHtml: string
}

const PAGE1_SOURCE_AR = `
<div class="task-doc-header" dir="rtl">
  <p class="task-doc-title">نموذج طلب براءة اختراع — PCT/SA/2020/051234</p>
  <p class="task-doc-sub">إدارة الملكية الفكرية · المملكة العربية السعودية</p>
</div>
<table class="task-doc-table" dir="rtl">
  <tr><th colspan="4">بيانات الأولوية والإيداع</th></tr>
  <tr>
    <td>تاريخ الإشعار</td><td>١ يونيو ٢٠٢٠</td>
    <td>رقم الطلب</td><td>SA/P/2020/11298</td>
  </tr>
  <tr>
    <td>تاريخ الأولوية</td><td>٣ مارس ٢٠٢٠</td>
    <td>تاريخ الإيداع</td><td>١٥ مايو ٢٠٢٠</td>
  </tr>
  <tr><th colspan="4">تصنيف براءة الاختراع الدولي (IPC)</th></tr>
  <tr>
    <td colspan="2">H04L 9/32 · G06F 21/60</td>
    <td colspan="2">☑ تم التحقق ☐ قيد المراجعة</td>
  </tr>
  <tr><th colspan="4">مقدم الطلب / الوكيل</th></tr>
  <tr>
    <td>الاسم</td><td colspan="3">شركة الحلول المتقدمة للتقنية المحدودة</td>
  </tr>
  <tr>
    <td>العنوان</td><td colspan="3">طريق الملك فهد، الرياض ١٢٢١١</td>
  </tr>
</table>
`.trim()

const PAGE1_TRANSLATED_EN = `
<div class="task-doc-header">
  <p class="task-doc-title">Patent Application Form — PCT/SA/2020/051234</p>
  <p class="task-doc-sub">Intellectual Property Authority · Kingdom of Saudi Arabia</p>
</div>
<table class="task-doc-table">
  <tr><th colspan="4">Priority and filing data</th></tr>
  <tr>
    <td>Date of notification</td><td>1 June 2020</td>
    <td>Application no.</td><td>SA/P/2020/11298</td>
  </tr>
  <tr>
    <td>Priority date</td><td>3 March 2020</td>
    <td>Filing date</td><td>15 May 2020</td>
  </tr>
  <tr><th colspan="4">International Patent Classification (IPC)</th></tr>
  <tr>
    <td colspan="2">H04L 9/32 · G06F 21/60</td>
    <td colspan="2"><label><input type="checkbox" checked disabled /> Verified</label> <label><input type="checkbox" disabled /> Under review</label></td>
  </tr>
  <tr><th colspan="4">Applicant / Representative</th></tr>
  <tr>
    <td>Name</td><td colspan="3">Advanced Technology Solutions Ltd.</td>
  </tr>
  <tr>
    <td>Address</td><td colspan="3">King Fahd Road, Riyadh 12211</td>
  </tr>
</table>
`.trim()

function simplePageSource(pageNumber: number, title: string, lang: string) {
  return `
<div class="task-doc-header">
  <p class="task-doc-title">${title} — Page ${pageNumber}</p>
  <p class="task-doc-sub">Source language: ${lang}</p>
</div>
<table class="task-doc-table">
  <tr><th>Section</th><th>Detail</th><th>Status</th></tr>
  <tr><td>Claims summary</td><td>Method for secure document exchange with layout preservation.</td><td>☑</td></tr>
  <tr><td>Drawings ref.</td><td>Fig. ${pageNumber}-A through Fig. ${pageNumber}-C</td><td>☑</td></tr>
  <tr><td>Annex</td><td>Technical specification tables and notation index.</td><td>${pageNumber % 2 === 0 ? "☑" : "☐"}</td></tr>
</table>
`.trim()
}

function simplePageTranslated(pageNumber: number, targetLanguage: string) {
  return `
<div class="task-doc-header">
  <p class="task-doc-title">Continuation — Page ${pageNumber}</p>
  <p class="task-doc-sub">Target language: ${targetLanguage}</p>
</div>
<table class="task-doc-table">
  <tr><th>Section</th><th>Detail</th><th>Review</th></tr>
  <tr><td>Claims summary</td><td>Procedure for authenticated transfer of formatted documents between systems.</td><td><input type="checkbox" checked disabled /></td></tr>
  <tr><td>Drawings ref.</td><td>Fig. ${pageNumber}-A through Fig. ${pageNumber}-C (vector layer retained)</td><td><input type="checkbox" checked disabled /></td></tr>
  <tr><td>Annex</td><td>Tabular data, footnotes, and cross-references preserved from source layout.</td><td><input type="checkbox" ${pageNumber % 2 === 0 ? "checked" : ""} disabled /></td></tr>
</table>
`.trim()
}

type TaskPageInput = {
  pageCount: number
  status: "processing" | "completed" | "failed"
  title: string
  fileName?: string
  sourceLanguage: string
  targetLanguage: string
}

export function getMockDocumentPages(task: TaskPageInput): DocumentPage[] {
  if (task.status === "completed") {
    return getSustainabilityDocumentPages(task.pageCount, "completed")
  }

  if (useSustainabilityMock(task)) {
    return getSustainabilityDocumentPages(task.pageCount, "processing")
  }

  const count = Math.max(task.pageCount, 4)
  const pages: DocumentPage[] = []

  for (let i = 0; i < count; i += 1) {
    const pageNumber = i + 1
    const isFirst = pageNumber === 1
    pages.push({
      pageNumber,
      status: "processing" as const,
      sourceHtml: isFirst
        ? PAGE1_SOURCE_AR
        : simplePageSource(pageNumber, task.title, task.sourceLanguage),
      translatedHtml: isFirst
        ? PAGE1_TRANSLATED_EN
        : simplePageTranslated(pageNumber, task.targetLanguage),
    })
  }

  return pages
}
