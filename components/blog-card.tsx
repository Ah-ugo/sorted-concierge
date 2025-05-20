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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
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
                className="bg-teal-50 text-teal-600 hover:bg-teal-100"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-teal-600 transition-colors">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="text-neutral-600 mb-4 line-clamp-3">{post.excerpt}</p>
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
                <p className="text-sm font-medium">{post.author.name}</p>
                <div className="flex items-center text-xs text-neutral-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  {post.date}
                </div>
              </div>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="text-teal-600 hover:text-teal-700 inline-flex items-center text-sm font-medium"
            >
              Read More <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
