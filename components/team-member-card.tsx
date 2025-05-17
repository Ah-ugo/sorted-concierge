import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface TeamMemberProps {
  member: {
    id: string | number
    name: string
    role: string
    bio: string
    image: string
  }
}

export default function TeamMemberCard({ member }: TeamMemberProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="relative h-64 w-full">
          <Image
            src={member.image || "/placeholder.svg"}
            alt={member.name}
            fill
            className="object-cover rounded-t-lg"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-1">{member.name}</h3>
          <p className="text-primary font-medium mb-3">{member.role}</p>
          <p className="text-gray-600">{member.bio}</p>
        </div>
      </CardContent>
    </Card>
  )
}
