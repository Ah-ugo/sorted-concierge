"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface InstagramPost {
  id: string;
  image: string;
  likes: number;
  url: string;
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    // In a real app, you would fetch from Instagram API
    // For now, we'll use placeholder data
    const fetchInstagramPosts = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockPosts: InstagramPost[] = [
          {
            id: "1",
            image:
              "https://nzepro.com/wp-content/uploads/2024/12/Elegushi-private-678x381.jpg",
            likes: 124,
            url: "https://instagram.com",
          },
          {
            id: "2",
            image:
              "https://nzepro.com/wp-content/uploads/2024/06/Jhalobia-Recreation-Park-and-Gardens.jpg",
            likes: 89,
            url: "https://instagram.com",
          },
          {
            id: "3",
            image:
              "https://nzepro.com/wp-content/uploads/2024/06/Encourage-Park-Osborne-Ikoyi.jpg",
            likes: 213,
            url: "https://instagram.com",
          },
          {
            id: "4",
            image:
              "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/53/a1/dc/beach-front.jpg?w=1400&h=800&s=1",
            likes: 167,
            url: "https://instagram.com",
          },
        ];

        setPosts(mockPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Instagram posts:", error);
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  if (loading) {
    return (
      <div className="instagram-feed">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="instagram-post bg-gray-200 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="instagram-feed" ref={ref}>
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="instagram-post"
        >
          <a href={post.url} target="_blank" rel="noopener noreferrer">
            <Image
              src={post.image || "/placeholder.svg"}
              alt="Instagram post"
              width={300}
              height={300}
              className="w-full h-full object-cover"
            />
            <div className="instagram-overlay">
              <div className="flex items-center gap-2">
                <Heart size={20} />
                <span>{post.likes} likes</span>
              </div>
            </div>
          </a>
        </motion.div>
      ))}
    </div>
  );
}
