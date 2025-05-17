"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import ServiceCard from "@/components/service-card"
import PackageCard from "@/components/package-card"

export default function ServicesPage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [packagesRef, packagesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const categories = ["All", "Transportation", "Dining", "Events", "Lifestyle", "Travel", "Business"]

  const [activeCategory, setActiveCategory] = useState("All")

  const services = [
    {
      id: 1,
      title: "Airport Transfers",
      description: "Seamless airport pickups and drop-offs with luxury vehicles and professional drivers.",
      icon: "🚗",
      price: "₦25,000",
      category: "Transportation",
    },
    {
      id: 2,
      title: "Restaurant Reservations",
      description: "Secure tables at the most exclusive restaurants in Lagos with VIP treatment.",
      icon: "🍽️",
      price: "₦10,000",
      category: "Dining",
    },
    {
      id: 3,
      title: "Event Planning",
      description: "Full-service event planning for corporate events, parties, and special occasions.",
      icon: "🎉",
      price: "From ₦150,000",
      category: "Events",
    },
    {
      id: 4,
      title: "Personal Shopping",
      description: "Personalized shopping assistance with access to exclusive items and collections.",
      icon: "🛍️",
      price: "₦35,000",
      category: "Lifestyle",
    },
    {
      id: 5,
      title: "Chauffeur Services",
      description: "Professional drivers and luxury vehicles for daily transportation needs.",
      icon: "🚘",
      price: "₦45,000/day",
      category: "Transportation",
    },
    {
      id: 6,
      title: "Hotel Bookings",
      description: "Secure the best rates and rooms at top hotels with VIP amenities.",
      icon: "🏨",
      price: "Service fee: ₦15,000",
      category: "Travel",
    },
    {
      id: 7,
      title: "Business Support",
      description: "Administrative assistance, meeting arrangements, and business services.",
      icon: "💼",
      price: "From ₦30,000",
      category: "Business",
    },
    {
      id: 8,
      title: "VIP Nightlife Access",
      description: "Skip the lines and enjoy VIP treatment at the hottest clubs and venues.",
      icon: "🎵",
      price: "From ₦50,000",
      category: "Lifestyle",
    },
  ]

  const packages = [
    {
      id: 1,
      title: "Essential Package",
      description: "Perfect for first-time visitors or those with occasional needs.",
      price: "₦100,000/month",
      features: [
        "Airport transfers (2 per month)",
        "Restaurant reservations",
        "Hotel bookings",
        "24/7 concierge support",
      ],
      popular: false,
      type: "Monthly",
    },
    {
      id: 2,
      title: "Premium Package",
      description: "Our most popular package for regular visitors and residents.",
      price: "₦250,000/month",
      features: [
        "Airport transfers (4 per month)",
        "Restaurant reservations",
        "Hotel bookings",
        "Chauffeur service (2 days per month)",
        "Event access",
        "Personal shopping assistance",
        "24/7 dedicated concierge",
      ],
      popular: true,
      type: "Monthly",
    },
    {
      id: 3,
      title: "Elite Package",
      description: "The ultimate luxury concierge experience with unlimited services.",
      price: "₦500,000/month",
      features: [
        "Unlimited airport transfers",
        "Priority restaurant reservations",
        "VIP hotel bookings with upgrades",
        "Unlimited chauffeur service",
        "VIP event access",
        "Dedicated personal shopper",
        "Business support services",
        "24/7 dedicated concierge team",
      ],
      popular: false,
      type: "Monthly",
    },
  ]

  const filteredServices =
    activeCategory === "All" ? services : services.filter((service) => service.category === activeCategory)

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">Our Services</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Premium Concierge Services</h1>
            <p className="text-gray-600 text-lg mb-8">
              Discover our comprehensive range of concierge services designed to enhance your lifestyle and save you
              time.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/booking">Book a Service</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white" ref={ref}>
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Tabs defaultValue={activeCategory}>
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 mb-8">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    onClick={() => setActiveCategory(category)}
                    className={activeCategory === category ? "bg-primary text-white" : ""}
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gray-50" ref={packagesRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">Our Packages</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Concierge Membership Packages</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully curated membership packages to enjoy priority access and exclusive benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={packagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PackageCard package={pkg} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Need a custom package? We can create a bespoke solution tailored to your specific needs.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/contact">Contact Us for Custom Packages</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Simple Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've made it easy to request and receive our concierge services. Here's how it works:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Request a Service</h3>
              <p className="text-gray-600">
                Submit your request through our booking form, WhatsApp, or by calling our concierge line.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Receive Confirmation</h3>
              <p className="text-gray-600">
                Our team will confirm your request and provide you with all the necessary details.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Enjoy Your Experience</h3>
              <p className="text-gray-600">
                Sit back and relax as we take care of everything, ensuring a seamless and enjoyable experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience Our Services?</h2>
            <p className="text-white/90 mb-8 text-lg">
              Book your first service today and discover the difference our concierge can make.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
