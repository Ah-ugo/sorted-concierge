import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCurrency } from "@/lib/currency-context"

interface ServiceProps {
  service: {
    id: string | number
    title: string
    description: string
    icon: string
    price: string | number
    category: string
  }
}

export default function ServiceCard({ service }: ServiceProps) {
  const { formatPrice } = useCurrency()

  return (
    <Card className="service-card h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="mb-4 text-4xl">{service.icon}</div>
        <Badge className="mb-2 bg-primary/10 text-primary">{service.category}</Badge>
        <h3 className="text-xl font-bold mb-2">{service.title}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <p className="font-bold text-lg">{formatPrice(service.price)}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
          <Link href="/booking">Book Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
