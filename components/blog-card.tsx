import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Author {
  name: string;
  avatar?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  date: string;
  author: Author;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md bg-card">
      {" "}
      {/* Ensured bg-card (#2B2B2B) */}
      <div className="grid md:grid-cols-[2fr_3fr]">
        <div className="relative aspect-[4/3] md:h-full">
          <Image
            src={post.coverImage || "/placeholder.svg?height=400&width=600"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-gold-gradient text-black hover:bg-secondary-light/90" // Updated to gold-gradient and black, hover to secondary.light
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-secondary-light transition-colors">
            {" "}
            {/* Updated to secondary.light */}
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {" "}
            {/* Updated to muted.foreground */}
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar || "/placeholder.svg"}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-sm font-medium text-white">
                  {" "}
                  {/* Updated to white */}
                  {post.author.name}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  {" "}
                  {/* Updated to muted.foreground */}
                  <Calendar className="mr-1 h-3 w-3" />
                  {post.date}
                </div>
              </div>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="text-secondary-light hover:text-secondary-dark inline-flex items-center text-sm font-medium" // Updated to secondary.light and secondary.dark
            >
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
