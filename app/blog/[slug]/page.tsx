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

// export async function generateStaticParams() {
//   try {
//     const allBlogs = await apiClient.getBlogs({ limit: 1000 });
//     return allBlogs.map((blog: { slug: string }) => ({
//       slug: blog.slug,
//     }));
//   } catch (error) {
//     console.error("Error generating static params for blog posts:", error);

//     return [];
//   }
// }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    console.log(slug, "params===");
    const apiPost = await apiClient.getBlogBySlug(slug);

    // Ensure absolute URLs for images
    const baseUrl = "https://thesortedconcierge.com";
    const imageUrl = apiPost.coverImage
      ? apiPost.coverImage.startsWith("http")
        ? apiPost.coverImage
        : `${baseUrl}${apiPost.coverImage}`
      : `${baseUrl}/placeholder.svg?height=630&width=1200`;

    const authorName =
      apiPost.author.name || apiPost.author.username || "Sorted Concierge";
    const postUrl = `${baseUrl}/blog/${apiPost.slug}`;

    return {
      title: `${apiPost.title} | Sorted Concierge Blog`,
      description: apiPost.excerpt,
      keywords: apiPost.tags.join(", "),
      authors: [{ name: authorName }],
      creator: authorName,
      publisher: "Sorted Concierge",
      robots: "index, follow",

      // Open Graph tags (Facebook, WhatsApp, LinkedIn)
      openGraph: {
        type: "article",
        url: postUrl,
        title: apiPost.title,
        description: apiPost.excerpt,
        siteName: "Sorted Concierge Blog",
        locale: "en_US",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: apiPost.title,
            type: "image/jpeg",
          },
          // WhatsApp prefers smaller images sometimes
          {
            url: imageUrl.replace("1200", "800").replace("630", "420"),
            width: 800,
            height: 420,
            alt: apiPost.title,
            type: "image/jpeg",
          },
        ],
        publishedTime: new Date(apiPost.createdAt).toISOString(),
        modifiedTime: new Date(apiPost.updatedAt).toISOString(),
        authors: [authorName],
        section: apiPost.tags[0] || "General",
        tags: apiPost.tags,
      },

      // Twitter/X Card tags
      twitter: {
        card: "summary_large_image",
        site: "@sortedconcierge",
        creator: "@sortedconcierge",
        title: apiPost.title,
        description: apiPost.excerpt,
        images: [imageUrl],
      },

      // Additional meta tags for better social sharing
      other: {
        // WhatsApp specific
        "og:image:width": "1200",
        "og:image:height": "630",
        "og:image:type": "image/jpeg",

        // LinkedIn specific
        "article:author": authorName,
        "article:published_time": new Date(apiPost.createdAt).toISOString(),
        "article:modified_time": new Date(apiPost.updatedAt).toISOString(),
        "article:section": apiPost.tags[0] || "General",
        "article:tag": apiPost.tags.join(", "),

        // Additional meta tags
        "theme-color": "#131313", // Updated to accent (#131313)
        "msapplication-TileColor": "#131313", // Updated to accent (#131313)

        // Telegram specific
        "telegram:channel": "@sortedconcierge",
      },

      // Verification tags (add if you have them)
      verification: {
        // google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
        // yahoo: "your-yahoo-verification-code",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    const baseUrl = "https://thesortedconcierge.com";
    const defaultImage = `${baseUrl}/placeholder.svg?height=630&width=1200`;

    return {
      title: "Blog Post | Sorted Concierge Blog",
      description: "Read this interesting blog post from Sorted Concierge",
      openGraph: {
        type: "article",
        url: `${baseUrl}/blog`,
        title: "Blog Post | Sorted Concierge Blog",
        description: "Read this interesting blog post from Sorted Concierge",
        siteName: "Sorted Concierge Blog",
        images: [
          {
            url: defaultImage,
            width: 1200,
            height: 630,
            alt: "Sorted Concierge Blog",
            type: "image/jpeg",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Blog Post | Sorted Concierge Blog",
        description: "Read this interesting blog post from Sorted Concierge",
        images: [defaultImage],
      },
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
      <div className="min-h-screen flex items-center justify-center px-4 bg-black">
        {" "}
        {/* Updated to black (background) */}
        <div className="text-center max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
            {" "}
            {/* Updated to white */}
            Blog Post Not Found
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist or may have been
            moved.
          </p>
          <a
            href="/blog"
            className="inline-flex items-center justify-center bg-gold-gradient hover:bg-secondary-light/90 text-xs sm:text-sm text-black px-4 py-2 rounded-md" // Updated to gold-gradient and secondary.light
          >
            <span className="mr-2">←</span>
            Back to Blog
          </a>
        </div>
      </div>
    );
  }
}
