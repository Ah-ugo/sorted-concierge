import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

interface TestimonialProps {
  testimonial: {
    id: string | number
    name: string
    role: string
    content: string
    avatar: string
    rating?: number
  }
}

export default function TestimonialCard({ testimonial }: TestimonialProps) {
  return (
    <Card className="testimonial-card h-full">
      <CardContent className="pt-6 flex flex-col h-full">
        {testimonial.rating && (
          <div className="flex mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < testimonial.rating! ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
        )}
        <p className="text-gray-600 mb-6 flex-grow">{testimonial.content}</p>
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
