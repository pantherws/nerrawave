import { notFound } from "next/navigation"
import { JournalArticleView } from "@/components/journal/journal-article-view"
import { getBlogPost, getBlogPostSlugs } from "@/lib/blog-posts.server"

export function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  if (!post) notFound()

  const otherPost = getBlogPostSlugs()
    .filter((s) => s !== post.slug)
    .map((slug) => getBlogPost(slug))
    .find(Boolean)

  return (
    <JournalArticleView
      post={post}
      otherPost={otherPost ? { slug: otherPost.slug, title: otherPost.title } : undefined}
    />
  )
}
