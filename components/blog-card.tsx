import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface BlogCardProps {
  post: {
    id: string | number
    title: string
    slug: string
    excerpt: string
    coverImage: string
    date: string
    author: {
      name: string
      avatar: string
    }
    tags: string[]
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative h-64 md:h-full md:col-span-1">
          <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
        </div>
        <CardContent className="p-6 md:col-span-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <Badge key={tag} className="bg-primary/10 text-primary hover:bg-primary/20">
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-3">
            <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
              {post.title}
            </Link>
          </h2>
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                  <Image
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-gray-600">{post.author.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1" />
                {post.date}
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href={`/blog/${post.slug}`}>Read More</Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
