"use client"

import { BlogIndexMeshBackground } from "@/components/blog/blog-index-mesh-background"

const BLOG_INDEX_HEADLINE = "Reflections on translation and technology"

export function BlogIndexHero() {
  return (
    <header className="blog-index-header relative overflow-hidden">
      <BlogIndexMeshBackground />
      <div className="pointer-events-none relative z-[1] mx-auto flex min-h-[14rem] max-w-[46rem] flex-col justify-center px-4 py-8 sm:px-6 sm:py-9">
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Nerrawave blog
        </p>
        <div className="w-full min-w-0 overflow-visible">
          <h1
            className="blog-index-headline font-sentient-regular vhs-glitch vhs-glitch--live max-w-full whitespace-nowrap font-normal leading-none tracking-[-0.04em] text-foreground"
            data-text={BLOG_INDEX_HEADLINE}
          >
            {BLOG_INDEX_HEADLINE}
          </h1>
        </div>
      </div>
    </header>
  )
}
