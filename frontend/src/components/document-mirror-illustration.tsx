"use client"

function DocumentPage({ locale }: { locale: "en" | "fr" }) {
  const copy =
    locale === "en"
      ? {
          label: "English",
          title: "Quarterly Service Report",
          heading: "Overview",
          paragraphs: [
            "This report summarizes service delivery for Q3 2025, including uptime metrics, response times, and stakeholder feedback across all operating regions.",
            "The table below outlines key performance indicators by department.",
          ],
          table: {
            headers: ["Department", "Target", "Actual"],
            rows: [
              ["Operations", "99.5%", "99.7%"],
              ["Support", "<4 hrs", "3.2 hrs"],
            ],
          },
          list: ["Monthly review completed", "Audit documentation filed"],
        }
      : {
          label: "French",
          title: "Rapport trimestriel de service",
          heading: "Aperçu",
          paragraphs: [
            "Ce rapport résume la prestation de services pour le T3 2025, y compris les mesures de disponibilité, les délais de réponse et les retours des parties prenantes dans toutes les régions.",
            "Le tableau ci-dessous présente les indicateurs clés de performance par département.",
          ],
          table: {
            headers: ["Département", "Objectif", "Réel"],
            rows: [
              ["Opérations", "99,5 %", "99,7 %"],
              ["Support", "<4 h", "3,2 h"],
            ],
          },
          list: ["Revue mensuelle terminée", "Documentation d'audit déposée"],
        }

  return (
    <div className="relative min-w-0 flex-1">
      <div
        className="relative overflow-hidden rounded-sm border border-black/[0.08] bg-[#fafafa] shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-[#f4f4f4] dark:shadow-[0_8px_28px_-12px_rgba(0,0,0,0.55)]"
        style={{ aspectRatio: "8.5 / 11" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-[#2b579a]/35" aria-hidden />
        <div className="absolute inset-y-0 left-[14%] w-px bg-black/[0.04]" aria-hidden />
        <div className="absolute inset-y-0 right-[14%] w-px bg-black/[0.04]" aria-hidden />

        <div className="relative flex h-full flex-col px-[14%] pb-4 pt-3 text-[#1a1a1a]">
          <p className="mb-2 text-[5px] font-medium uppercase tracking-[0.18em] text-[#2b579a]/80">
            {copy.label}
          </p>

          <h3 className="mb-1.5 text-[8px] font-medium leading-tight text-[#2b579a] sm:text-[9px]">
            {copy.title}
          </h3>

          <h4 className="mb-1.5 text-[6px] font-medium uppercase tracking-[0.08em] text-[#404040] sm:text-[7px]">
            {copy.heading}
          </h4>

          <div className="space-y-1.5">
            {copy.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 24)}
                className="text-[4.5px] leading-[1.55] text-[#333] sm:text-[5px]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <table className="my-2 w-full border-collapse text-[4px] sm:text-[4.5px]">
            <thead>
              <tr>
                {copy.table.headers.map((header) => (
                  <th
                    key={header}
                    className="border border-[#bfbfbf] bg-[#d9e2f3] px-1 py-0.5 text-left font-medium text-[#1f3864]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {copy.table.rows.map((row) => (
                <tr key={row.join("-")}>
                  {row.map((cell) => (
                    <td key={cell} className="border border-[#bfbfbf] px-1 py-0.5 text-[#333]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="mt-1 space-y-0.5">
            {copy.list.map((item) => (
              <li
                key={item}
                className="flex gap-1 text-[4.5px] leading-snug text-[#333] sm:text-[5px]"
              >
                <span className="text-[#2b579a]">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-1 pt-2" aria-hidden>
            <div className="h-px w-full bg-black/[0.06]" />
            <div className="h-px w-[88%] bg-black/[0.05]" />
            <div className="h-px w-[72%] bg-black/[0.04]" />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Side-by-side Word-style pages — original English and mirrored French translation. */
export function DocumentMirrorIllustration() {
  return (
    <figure className="my-10 -mx-1 sm:my-12 sm:-mx-2">
      <div className="about-solid-panel relative rounded-md border border-border/70 p-3 sm:p-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

        <div className="relative grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-3">
          <DocumentPage locale="en" />

          <div className="flex flex-col items-center justify-center gap-1 px-0.5" aria-hidden>
            <span className="h-px w-3 bg-foreground/15 sm:w-4" />
            <span className="text-[7px] uppercase tracking-[0.22em] text-muted-foreground/70">
              →
            </span>
            <span className="h-px w-3 bg-foreground/15 sm:w-4" />
          </div>

          <DocumentPage locale="fr" />
        </div>
      </div>

      <figcaption className="mt-3 text-center text-[10px] leading-relaxed tracking-[0.04em] text-muted-foreground">
        Original document and French translation — paragraphs, tables, and lists preserved.
      </figcaption>
    </figure>
  )
}
