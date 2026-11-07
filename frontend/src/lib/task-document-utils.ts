export function highlightSegmentHtml(
  html: string,
  activeSegmentId: string | null,
  side: "source" | "target",
) {
  if (!activeSegmentId || typeof document === "undefined") return html
  const template = document.createElement("template")
  template.innerHTML = html
  template.content.querySelectorAll(".task-segment").forEach((node) => {
    node.classList.remove("task-segment--active-source", "task-segment--active-target")
    if (node.getAttribute("data-segment-id") === activeSegmentId) {
      node.classList.add(
        side === "source" ? "task-segment--active-source" : "task-segment--active-target",
      )
    }
  })
  return template.innerHTML
}

export function updateSegmentTextInHtml(html: string, segmentId: string, text: string) {
  if (typeof document === "undefined") return html
  const template = document.createElement("template")
  template.innerHTML = html
  const node = template.content.querySelector(`[data-segment-id="${segmentId}"]`)
  if (node) node.textContent = text
  return template.innerHTML
}
