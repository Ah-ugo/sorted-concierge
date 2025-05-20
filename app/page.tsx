"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import CurrencySelector from "@/components/currency-selector";
import { apiClient, type Service } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [experienceRef, experienceInView] = useInView({ threshold: 0.3 });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.3 });
  const [galleryRef, galleryInView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiClient.getServices({ limit: 3 });
        setServices(data);
      } catch (error: any) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description:
            error.message || "Failed to load services. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();

    // Hide preloader after 2 seconds
    const timer = setTimeout(() => setIsPreloaderVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [toast]);

  const mainCategories = [
    {
      name: "STAY",
      href: "/services?category=accommodation",
      active: true,
      image: "/romantic-bohemian-couple-bed.jpg",
    },
    {
      name: "DINE",
      href: "/services?category=dining",
      image: "/medium-shot-people-eating.jpg",
    },
    {
      name: "ADVENTURE",
      href: "/services?category=adventure",
      image: "/image.png",
    },
    {
      name: "REJUVENATE",
      href: "/services?category=wellness",
      image: "/image2.png",
    },
    {
      name: "CELEBRATE",
      href: "/services?category=events",
      image: "/image1.png",
    },
    {
      name: "OFFERS",
      href: "/services?category=offers",
      image: "/image3.png",
    },
  ];

  return (
    <>
      {/* Preloader */}
      {/* {isPreloaderVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative h-16 w-16"
          >
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">
              NC
            </span>
          </motion.div>
        </motion.div>
      )} */}

      {/* Main Navigation for desktop - similar to Kep West */}
      {/* <div className="absolute left-0 right-0 top-0 z-40 hidden md:block">
        <div className="container mx-auto flex items-center justify-between py-8">
          <div className="text-2xl font-bold text-white">NAIJA CONCIERGE</div>
          <div className="flex items-center space-x-8">
            {mainCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`border-b-2 text-sm font-medium tracking-widest ${
                  category.active
                    ? "border-teal-400 text-white"
                    : "border-transparent text-white/80 hover:border-white/50"
                } pb-1 transition-all duration-300`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div> */}

      {/* Hero Section - Full screen like Kep West */}
      <section
        // className="relative min-h-screen flex items-center"
        className="relative flex h-screen items-center justify-center"
        ref={heroRef}
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 object-cover w-full h-screen"
        >
          <video
            className="hero-video absolute object-cover w-full h-screen"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/hero-bg2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <p className="mb-4 text-center font-medium uppercase tracking-wider text-white/90">
              SORTED CONCIERGE EXPERIENCE
            </p>
            <h1 className="mb-12 text-center text-4xl font-bold uppercase tracking-widest text-white md:text-5xl lg:text-6xl">
              A PREMIUM LUXURY ESCAPE TO RELAX, EXPLORE, AND CONNECT.
            </h1>

            <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="border-teal-400 bg-transparent px-8 py-6 text-sm font-medium uppercase tracking-widest text-white hover:bg-teal-400/10"
              >
                <Link href="/about">Why You Will Love It Here</Link>
              </Button>

              <Button
                asChild
                className="bg-teal-400 px-8 py-6 text-sm font-medium uppercase tracking-widest text-neutral-900 hover:bg-teal-500"
              >
                <Link href="/booking">Book Your Experience</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-0 right-0 z-10 flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-8 w-8 text-white opacity-70" />
        </motion.div>
      </section>

      {/* Experience Section */}
      <section className="bg-white py-32" ref={experienceRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              experienceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-3xl font-light uppercase tracking-widest text-neutral-800 md:text-4xl">
              Our Essence
            </h2>
          </motion.div>

          <div className="grid gap-24 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={
                experienceInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/tourist-carrying-luggage.jpg"
                  alt="Premium experience"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={
                experienceInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col justify-center"
            >
              <h3 className="mb-8 text-2xl font-light uppercase tracking-widest text-neutral-800">
                Luxurious Simplicity
              </h3>
              <p className="mb-8 text-lg text-neutral-700">
                Sorted Concierge offers an exquisite blend of Nigerian
                hospitality and world-class service. Our personalized approach
                ensures every detail is tailored to exceed expectations,
                providing an authentic yet refined experience.
              </p>
              <p className="mb-12 text-lg text-neutral-700">
                We curate exclusive moments that highlight the vibrant culture
                and beauty of Nigeria, from private excursions to bespoke dining
                experiences.
              </p>
              <div>
                <Button
                  asChild
                  className="border-none bg-transparent px-0 text-sm font-normal uppercase tracking-widest text-teal-600 hover:bg-transparent hover:text-teal-800"
                >
                  <Link
                    href="/about"
                    className="border-b border-teal-600 pb-1 hover:border-teal-800"
                  >
                    Learn More About Us
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-neutral-100 py-32" ref={servicesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-3xl font-light uppercase tracking-widest text-neutral-800 md:text-4xl">
              Experience Categories
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mainCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.3,
                  delay: 0.1,
                  ease: "easeOut",
                }}
                className="group relative aspect-square overflow-hidden"
              >
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="mb-4 text-2xl font-light uppercase tracking-widest text-white">
                    {category.name}
                  </h3>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-4 border-white bg-transparent font-light uppercase tracking-widest text-white hover:bg-white hover:text-black"
                  >
                    <Link href={category.href}>Explore</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Gallery Section */}
      <section className="bg-white py-32" ref={galleryRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-3xl font-light uppercase tracking-widest text-neutral-800 md:text-4xl">
              Gallery
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={
                  galleryInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.9 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                className="relative aspect-square overflow-hidden"
              >
                <Image
                  src={`/placeholder.svg?height=400&width=400&text=Gallery ${
                    index + 1
                  }`}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={galleryInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Button
              asChild
              className="border-none bg-transparent px-0 text-sm font-normal uppercase tracking-widest text-teal-600 hover:bg-transparent hover:text-teal-800"
            >
              <Link
                href="/gallery"
                className="border-b border-teal-600 pb-1 hover:border-teal-800"
              >
                View Full Gallery
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Full-width CTA */}
      <section className="relative aspect-[21/9] w-full">
        <Image
          src="/image4.png"
          alt="Book your experience"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8 text-3xl font-light uppercase tracking-widest text-white md:text-4xl">
              Begin Your Journey
            </h2>
            <Button
              asChild
              className="bg-teal-400 px-8 py-6 text-sm font-medium uppercase tracking-widest text-neutral-900 hover:bg-teal-500"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Currency Selector */}
      <div className="fixed bottom-6 right-6 z-40">
        <CurrencySelector />
      </div>
    </>
  );
}
