import BlogPostClient from "./BlogPostClient";
import { apiClient } from "@/lib/api";
import { Metadata } from "next";

interface AuthorApiResponse {
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  [key: string]: string | undefined;
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
  createdAt: string;
  updatedAt: string;
}

interface AuthorUI {
  name: string;
  image: string;
  bio: string;
}

interface RelatedPostUI {
  title: string;
  slug: string;
  image: string;
}

interface BlogPostUI {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: AuthorUI;
  date: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
  relatedPosts: RelatedPostUI[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    console.log(slug, "params===");
    const apiPost = await apiClient.getBlogBySlug(slug);

    return {
      title: `${apiPost.title} | Sorted Concierge Blog`,
      description: apiPost.excerpt,
      openGraph: {
        type: "article",
        url: `https://naijaconcierge.com/blog/${apiPost.slug}`,
        title: apiPost.title,
        description: apiPost.excerpt,
        images: apiPost.coverImage || "/placeholder.svg?height=600&width=1200",
        publishedTime: new Date(apiPost.createdAt).toISOString(),
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
    return {
      title: "Blog Post | Sorted Concierge Blog",
      description: "Read this interesting blog post",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const apiPost: BlogPostApiResponse = await apiClient.getBlogBySlug(slug);
    const relatedApiPosts = await apiClient.getBlogs({
      tag: apiPost.tags[0] || undefined,
      limit: 3,
    });

    const wordCount = (apiPost.content || "").split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / 200);
    const readTime = `${readTimeMinutes} min read`;

    const blogPost: BlogPostUI = {
      slug: apiPost.slug,
      title: apiPost.title,
      excerpt: apiPost.excerpt,
      content: apiPost.content || "<p>No content available.</p>",
      author: {
        name:
          apiPost.author.name || apiPost.author.username || "Unknown Author",
        image: apiPost.author.avatar || "/placeholder.svg?height=100&width=100",
        bio: apiPost.author.bio || "Contributor to our blog.",
      },
      date: new Date(apiPost.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      readTime,
      image: apiPost.coverImage || "/placeholder.svg?height=600&width=1200",
      category: apiPost.tags[0] || "General",
      tags: apiPost.tags || [],
      relatedPosts: relatedApiPosts
        .filter((p) => p.slug !== slug)
        .slice(0, 3)
        .map((p) => ({
          title: p.title,
          slug: p.slug,
          image: p.coverImage || "/placeholder.svg?height=300&width=300",
        })),
    };

    return <BlogPostClient post={blogPost} />;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">
            Blog Post Not Found
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist or may have been
            moved.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center justify-center bg-secondary hover:bg-secondary/90 text-xs sm:text-sm text-secondary-foreground px-4 py-2 rounded-md"
          >
            <span className="mr-2">←</span>
            Back to Blog
          </a>
        </div>
      </div>
    );
  }
}
