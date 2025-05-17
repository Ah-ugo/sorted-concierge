"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, Tag } from "lucide-react"
import BlogCard from "@/components/blog-card"

export default function BlogPage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [searchQuery, setSearchQuery] = useState("")

  const blogPosts = [
    {
      id: 1,
      title: "Top 10 Restaurants in Lagos You Must Visit",
      slug: "top-restaurants-lagos",
      excerpt:
        "Discover the finest dining establishments in Lagos, from traditional Nigerian cuisine to international flavors.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "May 15, 2023",
      author: {
        name: "Adebayo Johnson",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      tags: ["Dining", "Lagos", "Food"],
    },
    {
      id: 2,
      title: "The Ultimate Guide to Lagos Nightlife",
      slug: "lagos-nightlife-guide",
      excerpt:
        "Navigate the vibrant nightlife scene in Lagos with our comprehensive guide to the best clubs, bars, and lounges.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "April 28, 2023",
      author: {
        name: "Ngozi Okafor",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      tags: ["Nightlife", "Entertainment", "Lagos"],
    },
    {
      id: 3,
      title: "Luxury Shopping in Lagos: A Concierge's Perspective",
      slug: "luxury-shopping-lagos",
      excerpt: "Explore the luxury shopping scene in Lagos with insider tips from our experienced concierge team.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "April 10, 2023",
      author: {
        name: "Emeka Nwachukwu",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      tags: ["Shopping", "Luxury", "Fashion"],
    },
    {
      id: 4,
      title: "Planning the Perfect Corporate Event in Lagos",
      slug: "corporate-event-planning-lagos",
      excerpt:
        "Learn how to plan and execute successful corporate events in Lagos with our expert tips and venue recommendations.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "March 22, 2023",
      author: {
        name: "Amina Bello",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      tags: ["Events", "Corporate", "Planning"],
    },
    {
      id: 5,
      title: "The Art of VIP Transportation in Lagos",
      slug: "vip-transportation-lagos",
      excerpt:
        "Discover the ins and outs of VIP transportation in Lagos, from luxury vehicles to professional chauffeurs.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "March 5, 2023",
      author: {
        name: "Adebayo Johnson",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      tags: ["Transportation", "Luxury", "Travel"],
    },
    {
      id: 6,
      title: "Exclusive Access: Lagos's Hidden Gems",
      slug: "lagos-hidden-gems",
      excerpt: "Uncover the hidden gems of Lagos that only locals know about, from secret beaches to exclusive venues.",
      coverImage: "/placeholder.svg?height=400&width=600",
      date: "February 18, 2023",
      author: {
        name: "Ngozi Okafor",
        avatar: "/placeholder.svg?height=80&width=80",
      },
      tags: ["Lifestyle", "Experiences", "Lagos"],
    },
  ]

  const filteredPosts = searchQuery
    ? blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : blogPosts

  const allTags = Array.from(new Set(blogPosts.flatMap((post) => post.tags)))

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">Our Blog</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Insights & Experiences</h1>
            <p className="text-gray-600 text-lg mb-8">
              Discover the latest trends, tips, and stories from our concierge team and lifestyle experts.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 bg-white" ref={ref}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 gap-8">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <BlogCard post={post} />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No articles found matching your search.</p>
                    <Button onClick={() => setSearchQuery("")} variant="outline">
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="mt-8 md:mt-0">
              <div className="sticky top-24">
                {/* Categories */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {allTags.map((tag) => (
                      <li key={tag}>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => setSearchQuery(tag)}>
                          <Tag className="mr-2 h-4 w-4" />
                          {tag}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Posts */}
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-4">Recent Posts</h3>
                  <ul className="space-y-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <li key={post.id} className="flex items-start space-x-3">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {post.date}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Newsletter */}
                <div className="bg-primary/10 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
                  <p className="text-gray-600 mb-4">Stay updated with our latest articles and exclusive offers.</p>
                  <div className="space-y-3">
                    <Input placeholder="Your email address" />
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">Subscribe</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
