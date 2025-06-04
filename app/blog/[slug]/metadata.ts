import { Metadata } from "next";
import { apiClient } from "@/lib/api";

// Type Definitions
interface AuthorApiResponse {
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
}

interface BlogPostApiResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  author: AuthorApiResponse;
  tags: string[];
  published_at?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const slug = (await params).slug;
    const apiPost: BlogPostApiResponse = await apiClient.getBlogBySlug(slug);

    return {
      title: `${apiPost.title} | Sorted Concierge Blog`,
      description: apiPost.excerpt,
      openGraph: {
        type: "article",
        url: `https://naijaconcierge.com/blog/${apiPost.slug}`,
        title: apiPost.title,
        description: apiPost.excerpt,
        images: apiPost.coverImage || "/placeholder.svg?height=600&width=1200",
        publishedTime: apiPost.published_at
          ? new Date(apiPost.published_at).toISOString()
          : new Date().toISOString(),
        authors:
          apiPost.author.name || apiPost.author.username || "Unknown Author",
        section: apiPost.tags[0] || "General",
        tags: apiPost.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: apiPost.title,
        description: apiPost.excerpt,
        images: apiPost.coverImage || "/placeholder.svg?height=600&width=1200",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post Not Found | Sorted Concierge Blog",
      description: "The blog post you are looking for could not be found.",
    };
  }
}
