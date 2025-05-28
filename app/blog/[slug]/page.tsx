"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
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

export default function BlogPostPage() {
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPostUI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get params from the router
  const params = useParams<{ slug: string }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const apiPost: BlogPostApiResponse = await apiClient.getBlogBySlug(
          slug
        );
        const relatedApiPosts: BlogPostApiResponse[] = await apiClient.getBlogs(
          {
            tag: apiPost.tags[0] || undefined,
            limit: 3,
          }
        );

        const relatedPosts: RelatedPostUI[] = relatedApiPosts
          .filter((p) => p.slug !== apiPost.slug)
          .slice(0, 3)
          .map((p) => ({
            title: p.title,
            slug: p.slug,
            image: p.coverImage || "/placeholder.svg?height=300&width=400",
          }));

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
              apiPost.author.name ||
              apiPost.author.username ||
              "Unknown Author",
            image:
              apiPost.author.avatar || "/placeholder.svg?height=100&width=100",
            bio: apiPost.author.bio || "Contributor to our blog.",
          },
          date:
            apiPost.published_at ||
            new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          readTime,
          image: apiPost.coverImage || "/placeholder.svg?height=600&width=1200",
          category: apiPost.tags[0] || "General",
          tags: apiPost.tags || [],
          relatedPosts,
        };
        setPost(blogPost);
      } catch (error: unknown) {
        console.error("Error fetching blog post:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to load blog post",
          variant: "destructive",
        });
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchBlogPost();
    }
  }, [slug, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!post) {
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
          <Button
            asChild
            className="bg-secondary hover:bg-secondary/90 text-xs sm:text-sm text-secondary-foreground"
          >
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${post.title} | Sorted Concierge Blog`}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta
          property="og:url"
          content={`https://naijaconcierge.com/blog/${post.slug}`}
        />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:url"
          content={`https://naijaconcierge.com/blog/${post.slug}`}
        />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.image} />
        <meta
          property="article:published_time"
          content={new Date(post.date).toISOString()}
        />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
      </Head>

      <div className="min-h-screen pb-12 md:pb-16">
        <div className="relative h-[50vh] md:h-[60vh] bg-background">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-12">
            <div className="container mx-auto max-w-4xl">
              <Link
                href="/blog"
                className="flex items-center text-overlay mb-4 hover:text-secondary transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-overlay mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center text-overlay/80 gap-4 md:gap-6 text-xs sm:text-sm">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div
                className="prose prose-base sm:prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-8 md:mt-12 border-t border-border pt-6">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 flex items-center">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share this article
                </h3>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="mt-8 md:mt-12 border-t border-border pt-6">
                <div className="flex items-start space-x-4">
                  <Image
                    src={post.author.image}
                    alt={post.author.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                    sizes="(max-width: 768px) 20vw, 80px"
                  />
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                      {post.author.name}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                      {post.author.bio}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">
                    Subscribe to our Newsletter
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    Get the latest updates and offers directly to your inbox.
                  </p>
                  <div className="space-y-4">
                    <Input
                      placeholder="Your email address"
                      type="email"
                      className="text-sm sm:text-base"
                    />
                    <Button className="w-full bg-secondary hover:bg-secondary/90 text-xs sm:text-sm text-secondary-foreground">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">
                  Related Posts
                </h3>
                <div className="space-y-4">
                  {post.relatedPosts.map((relatedPost) => (
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      key={relatedPost.slug}
                      className="block group"
                    >
                      <div className="flex space-x-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover rounded-md"
                            sizes="(max-width: 768px) 20vw, 80px"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm sm:text-base font-medium group-hover:text-secondary transition-colors">
                            {relatedPost.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
