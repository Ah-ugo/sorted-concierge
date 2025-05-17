"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import ServiceCard from "@/components/service-card";
import TestimonialCard from "@/components/testimonial-card";
import CurrencySelector from "@/components/currency-selector";
import InstagramFeed from "@/components/instagram-feed";
import { servicesAPI, type Service } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [instagramRef, instagramInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getServices();
        setServices(data.slice(0, 4)); // Get first 4 services for homepage
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  const testimonials = [
    {
      id: 1,
      name: "Chioma A.",
      role: "Business Executive",
      content:
        "The concierge service has been a game-changer for my busy lifestyle. Their attention to detail and personalized approach is unmatched.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      id: 2,
      name: "David O.",
      role: "International Traveler",
      content:
        "As someone who travels to Lagos frequently, having this concierge service has made my trips seamless and enjoyable. Highly recommended!",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      id: 3,
      name: "Sarah M.",
      role: "Event Planner",
      content:
        "Their network of contacts and ability to secure exclusive venues has been invaluable for my clients. A true luxury service.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
    },
  ];

  return (
    <>
      {/* Hero Section with Video Background */}
      <section className="hero-video-container">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source
            src="https://videos.pexels.com/video-files/27939166/12267479_2560_1440_25fps.mp4"
            // src="https://framerusercontent.com/assets/0PSwmEFXZTcRS0QcwyeRUFbQ.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-4 bg-primary text-white px-4 py-1 text-sm">
              Premium Concierge Services
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Experience Lagos Like Never Before
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
              We handle everything so you can focus on what matters most. Your
              personal concierge is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Link href="/booking">Book Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white" ref={ref}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">
                About Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Premier Concierge Service in Lagos
              </h2>
              <p className="text-gray-600 mb-6">
                Founded with a passion for exceptional service, Sorted Concierge
                provides bespoke concierge solutions for discerning clients. We
                combine local expertise with international standards to deliver
                unparalleled experiences.
              </p>
              <p className="text-gray-600 mb-8">
                Our team of dedicated professionals is available 24/7 to cater
                to your every need, whether it's securing reservations at
                exclusive restaurants, arranging transportation, or planning
                special events.
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden"
            >
              <Image
                src="https://img.freepik.com/free-photo/guest-filling-registration-forms_482257-96635.jpg?semt=ais_hybrid&w=740"
                alt="Luxury concierge service"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50" ref={servicesRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">
              Our Services
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Exceptional Services Tailored to You
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our range of premium concierge services designed to
              enhance your lifestyle and save you time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading
              ? // Loading skeleton
                Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg p-6 h-80 animate-pulse"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
                    </div>
                  ))
              : // Actual services
                services.map((service, index) => {
                  // Transform service to match ServiceCard props
                  const transformedService = {
                    id: service.id,
                    title: service.name,
                    description: service.description,
                    icon: getServiceIcon(service.category),
                    price: service.price,
                    category: service.category,
                  };

                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        servicesInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 30 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <ServiceCard service={transformedService} />
                    </motion.div>
                  );
                })}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Elevate Your Experience?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Join our exclusive membership program and enjoy priority access to
              all our services, special rates, and dedicated support.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white" ref={testimonialsRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our satisfied clients about their experiences with our
              concierge services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  testimonialsInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-20 bg-gray-50" ref={instagramRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">
              Instagram
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Follow Our Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with our latest experiences and behind-the-scenes
              moments.
            </p>
          </div>

          <InstagramFeed />

          <div className="text-center mt-12">
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5"
            >
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="mr-2 h-4 w-4" />
                Follow Us on Instagram
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Currency Selector (Floating) */}
      <CurrencySelector />
    </>
  );
}

// Helper function to get icon based on category
function getServiceIcon(category: string): string {
  switch (category.toLowerCase()) {
    case "transportation":
      return "🚗";
    case "dining":
      return "🍽️";
    case "events":
      return "🎉";
    case "lifestyle":
      return "🛍️";
    case "travel":
      return "✈️";
    case "business":
      return "💼";
    default:
      return "🌟";
  }
}
