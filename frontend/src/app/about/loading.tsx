export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-[42rem] animate-pulse space-y-4 px-4 py-16 sm:px-6">
      <div className="h-3 w-28 rounded bg-muted" />
      <div className="h-10 w-full max-w-md rounded bg-muted" />
      <div className="h-24 w-full rounded bg-muted" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
      </div>
    </div>
  )
}
