export function AboutHeroCover() {
  return (
    <div
      className="about-solid-panel relative mx-auto w-full overflow-hidden rounded-lg border border-border/60"
      aria-hidden
    >
      <svg viewBox="0 0 960 320" className="h-auto w-full" role="presentation">
        <defs>
          <linearGradient id="about-hero-fade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.06" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <rect width="960" height="320" fill="url(#about-hero-fade)" className="text-foreground" />
        <g className="text-foreground/25" stroke="currentColor" strokeWidth="1" fill="none">
          <rect x="250" y="72" width="200" height="176" rx="4" />
          <rect x="270" y="96" width="120" height="8" rx="2" fill="currentColor" fillOpacity="0.15" />
          <rect x="270" y="116" width="160" height="4" rx="1" fill="currentColor" fillOpacity="0.1" />
          <rect x="270" y="128" width="150" height="4" rx="1" fill="currentColor" fillOpacity="0.1" />
          <rect x="270" y="148" width="160" height="56" rx="2" />
          <path
            d="M460 160 H500"
            stroke="#ef4444"
            strokeDasharray="4 6"
            fill="none"
          />
          <polygon points="508,160 520,154 520,166" fill="#ef4444" />
          <rect x="510" y="72" width="200" height="176" rx="4" />
          <rect x="530" y="96" width="130" height="8" rx="2" fill="currentColor" fillOpacity="0.15" />
          <rect x="530" y="116" width="155" height="4" rx="1" fill="currentColor" fillOpacity="0.1" />
          <rect x="530" y="128" width="140" height="4" rx="1" fill="currentColor" fillOpacity="0.1" />
          <rect x="530" y="148" width="160" height="56" rx="2" />
        </g>
        <text
          x="480"
          y="268"
          textAnchor="middle"
          className="fill-muted-foreground text-[11px] uppercase tracking-[0.28em]"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          Same document · Another language
        </text>
      </svg>
    </div>
  )
}
