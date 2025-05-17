import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"
import { useCurrency } from "@/lib/currency-context"

interface PackageProps {
  package: {
    id: string | number
    title: string
    description: string
    price: string | number
    features: string[]
    popular: boolean
    type: string
  }
}

export default function PackageCard({ package: pkg }: PackageProps) {
  const { formatPrice } = useCurrency()

  return (
    <Card className={`h-full flex flex-col relative ${pkg.popular ? "border-primary shadow-lg" : ""}`}>
      {pkg.popular && (
        <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
          Most Popular
        </div>
      )}
      <CardContent className="pt-6 flex-grow">
        <Badge className="mb-2 bg-primary/10 text-primary">{pkg.type}</Badge>
        <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
        <p className="text-gray-600 mb-4">{pkg.description}</p>
        <p className="font-bold text-2xl mb-6">{formatPrice(pkg.price)}</p>
        <ul className="space-y-2">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          asChild
          className={`w-full ${
            pkg.popular ? "bg-primary hover:bg-primary/90 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900"
          }`}
        >
          <Link href="/booking">Subscribe Now</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
