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
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.05]);

  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [experienceRef, experienceInView] = useInView({ threshold: 0.03 });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.03 });
  const [galleryRef, galleryInView] = useInView({ threshold: 0.03 });

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

    const timer = setTimeout(() => setIsPreloaderVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <>
      {isPreloaderVisible && (
        <div className="preloader-container">
          {/* Beautiful Slide In Animation */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{
              duration: 1,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-[60] bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2.5,
                  ease: "easeInOut",
                }}
                className="mb-6"
              >
                <h1 className="text-5xl md:text-6xl font-cinzel font-bold gold-accent tracking-widest">
                  SORTED
                </h1>
              </motion.div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "200px" }}
                transition={{ duration: 1.2, delay: 0.8, ease: "easeInOut" }}
                className="h-0.5 bg-gradient-to-r from-transparent via-gold-accent to-transparent mx-auto mb-6"
              />

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="text-sm md:text-base font-lora uppercase tracking-[0.3em] text-gray-300"
              >
                Concierge Experience
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="mt-8"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 2,
                    ease: "linear",
                  }}
                  className="w-8 h-8 border border-gold-accent border-t-transparent rounded-full mx-auto"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Beautiful Slide Out Animation */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.2,
              delay: 2.5,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-[59] bg-gradient-to-r from-black via-gray-900 to-black"
          />

          {/* Final curtain effect */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 0.8,
              delay: 3,
              ease: [0.76, 0, 0.24, 1],
            }}
            className="fixed inset-0 z-[58] bg-gradient-to-r from-black/60 to-transparent"
          />
        </div>
      )}

      <section
        className="relative flex h-screen items-center justify-center bg-black"
        ref={heroRef}
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 w-full h-screen"
        >
          {/* Background Video */}
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/new-hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div
            data-testid="bgOverlay"
            className="absolute inset-0 z-2"
            style={{
              backgroundImage: "url(/images/texture-overlay.png)",
              backgroundSize: "auto",
              backgroundRepeat: "repeat",
              backgroundPosition: "center center",
              opacity: 0.4,
              mixBlendMode: "overlay",
            }}
          />

          {/* Additional gradient overlay for depth and readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-3" />

          {/* Subtle vignette effect */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20 z-3" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <p className="mb-4 font-lora text-lg italic tracking-wider gold-accent">
              SORTED CONCIERGE EXPERIENCE
            </p>
            <h1 className="mb-12 text-4xl font-cinzel font-bold uppercase tracking-widest text-white md:text-5xl lg:text-6xl drop-shadow-lg">
              A PREMIUM LUXURY ESCAPE
            </h1>
            <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="border-secondary text-white hover:bg-secondary hover:text-black px-8 py-6 text-sm font-lora uppercase tracking-widest elegant-shadow backdrop-blur-sm"
              >
                <Link href="/about">Discover More</Link>
              </Button>
              <Button
                asChild
                className="gold-gradient px-8 py-6 text-sm font-lora uppercase tracking-widest text-black hover:opacity-90 elegant-shadow"
              >
                <Link href="/booking">Book Now</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-0 right-0 z-10 flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-8 w-8 gold-accent opacity-70 drop-shadow-md" />
        </motion.div>
      </section>

      <section className="bg-black py-32" ref={experienceRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              experienceInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-3xl font-cinzel font-bold uppercase tracking-widest text-white md:text-4xl">
              Our Essence
            </h2>
          </motion.div>

          <div className="grid gap-24 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={
                experienceInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
              }
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg elegant-shadow">
                <Image
                  src="/tourist-carrying-luggage.jpg"
                  alt="Premium experience"
                  width={600}
                  height={450}
                  className="object-cover w-full h-full"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
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
              <h3 className="mb-8 text-2xl font-cinzel font-bold uppercase tracking-widest text-white">
                Luxurious Simplicity
              </h3>
              <p className="mb-8 text-lg font-lora text-gray-300">
                Sorted Concierge blends Nigerian hospitality with world-class
                service. Every detail is tailored to exceed expectations,
                offering an authentic yet refined experience.
              </p>
              <p className="mb-12 text-lg font-lora text-gray-300">
                From private excursions to bespoke dining, we curate exclusive
                moments that celebrate Nigeria's vibrant culture and beauty.
              </p>
              <Button
                asChild
                variant="link"
                className="px-0 text-sm font-lora uppercase tracking-widest gold-accent hover:opacity-80 link-underline"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-black py-32" ref={servicesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-3xl font-cinzel font-bold uppercase tracking-widest text-white md:text-4xl">
              A 360 DEGREE EXPERIENCE
            </h2>
          </motion.div>

          <div className="max-w-full mx-auto overflow-hidden relative group">
            {/* Top Row - Auto-scrolling Left with user scroll override */}
            <div className="mb-8 overflow-hidden relative">
              <motion.div
                className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
                animate={{
                  x: [0, -1200],
                }}
                transition={{
                  x: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                  },
                }}
                drag="x"
                dragConstraints={{ left: -1200, right: 0 }}
                dragElastic={0.1}
                whileDrag={{ scale: 0.95 }}
                style={{
                  overflowX: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {[...Array(2)].map((_, setIndex) => (
                  <div key={setIndex} className="flex gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        servicesInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 30 }
                      }
                      transition={{
                        duration: 0.5,
                        delay: 0.1,
                        ease: "easeOut",
                      }}
                      className="group relative w-[400px] h-[300px] overflow-hidden rounded-lg elegant-shadow hover:shadow-2xl transition-all duration-300 flex-shrink-0"
                    >
                      <Image
                        src="/romantic-bohemian-couple-bed.jpg"
                        alt="Stay"
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <p className="text-sm font-lora uppercase tracking-widest gold-accent mb-2">
                          RESERVATIONS
                        </p>
                        <h3 className="text-2xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Luxury Stays
                        </h3>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        servicesInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 30 }
                      }
                      transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: "easeOut",
                      }}
                      className="group relative w-[320px] h-[300px] overflow-hidden rounded-lg elegant-shadow hover:shadow-2xl transition-all duration-300 flex-shrink-0"
                    >
                      <Image
                        src="/medium-shot-people-eating.jpg"
                        alt="Dine"
                        width={320}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <p className="text-xs font-lora uppercase tracking-widest gold-accent mb-1">
                          EXPERIENCES
                        </p>
                        <h3 className="text-xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Fine Dining
                        </h3>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        servicesInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 30 }
                      }
                      transition={{
                        duration: 0.5,
                        delay: 0.3,
                        ease: "easeOut",
                      }}
                      className="group relative w-[320px] h-[300px] overflow-hidden rounded-lg elegant-shadow hover:shadow-2xl transition-all duration-300 flex-shrink-0"
                    >
                      <Image
                        src="/image.png"
                        alt="Adventure"
                        width={320}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <p className="text-xs font-lora uppercase tracking-widest gold-accent mb-1">
                          ACTIVITIES
                        </p>
                        <h3 className="text-xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Adventures
                        </h3>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>

              {/* Scroll indicator */}
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                  <p className="text-xs text-white font-lora">Drag to scroll</p>
                </div>
              </div>
            </div>

            {/* Bottom Row - Auto-scrolling Right with user scroll override */}
            <div className="overflow-hidden relative">
              <motion.div
                className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
                animate={{
                  x: [-1200, 0],
                }}
                transition={{
                  x: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    duration: 25,
                    ease: "linear",
                  },
                }}
                drag="x"
                dragConstraints={{ left: -1200, right: 0 }}
                dragElastic={0.1}
                whileDrag={{ scale: 0.95 }}
              >
                {[...Array(2)].map((_, setIndex) => (
                  <div key={setIndex} className="flex gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        servicesInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 30 }
                      }
                      transition={{
                        duration: 0.5,
                        delay: 0.4,
                        ease: "easeOut",
                      }}
                      className="group relative w-[400px] h-[300px] overflow-hidden rounded-lg elegant-shadow hover:shadow-2xl transition-all duration-300 flex-shrink-0"
                    >
                      <Image
                        src="/image2.png"
                        alt="Rejuvenate"
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <p className="text-sm font-lora uppercase tracking-widest gold-accent mb-2">
                          WELLNESS
                        </p>
                        <h3 className="text-2xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Spa & Wellness
                        </h3>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        servicesInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 30 }
                      }
                      transition={{
                        duration: 0.5,
                        delay: 0.5,
                        ease: "easeOut",
                      }}
                      className="group relative w-[320px] h-[300px] overflow-hidden rounded-lg elegant-shadow hover:shadow-2xl transition-all duration-300 flex-shrink-0"
                    >
                      <Image
                        src="/image1.png"
                        alt="Celebrate"
                        width={320}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <p className="text-xs font-lora uppercase tracking-widest gold-accent mb-1">
                          CONCIERGE
                        </p>
                        <h3 className="text-xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Events
                        </h3>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        servicesInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 30 }
                      }
                      transition={{
                        duration: 0.5,
                        delay: 0.6,
                        ease: "easeOut",
                      }}
                      className="group relative w-[320px] h-[300px] overflow-hidden rounded-lg elegant-shadow hover:shadow-2xl transition-all duration-300 flex-shrink-0"
                    >
                      <Image
                        src="/image3.png"
                        alt="Offers"
                        width={320}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <p className="text-xs font-lora uppercase tracking-widest gold-accent mb-1">
                          VIP
                        </p>
                        <h3 className="text-xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Special Offers
                        </h3>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black py-32" ref={galleryRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-3xl font-cinzel font-bold uppercase tracking-widest text-white md:text-4xl">
              Gallery
            </h2>
            <p className="mb-16 text-lg font-lora text-gray-300">
              Discover the beauty and luxury that awaits you through our curated
              collection of experiences
            </p>
          </motion.div>

          {/* Gallery Categories */}
          <div className="mb-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex overflow-x-auto scrollbar-hide space-x-4 px-0 pb-4 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {[
                "All",
                "Accommodations",
                "Dining",
                "Adventures",
                "Wellness",
                "Events",
              ].map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-6 py-2 text-sm font-lora uppercase tracking-wider rounded-full transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category
                      ? "gold-gradient text-black"
                      : "bg-transparent border border-gray-600 text-gray-300 hover:border-secondary hover:text-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">
            {/* Large featured image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                galleryInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="group relative col-span-2 row-span-2 overflow-hidden rounded-lg elegant-shadow cursor-pointer"
            >
              <Image
                src="/romantic-bohemian-couple-bed.jpg"
                alt="Luxury accommodation"
                width={600}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="gold-gradient text-black px-3 py-1 rounded-full text-xs font-lora uppercase tracking-wider">
                  Accommodations
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-cinzel font-bold text-lg mb-1">
                  Luxury Suite
                </h3>
                <p className="text-white/80 text-sm font-lora">
                  Experience ultimate comfort and elegance
                </p>
              </div>
            </motion.div>

            {/* Medium images with enhanced styling */}
            {[
              {
                src: "/medium-shot-people-eating.jpg",
                category: "Dining",
                title: "Fine Dining",
              },
              { src: "/image.png", category: "Adventure", title: "Adventures" },
              {
                src: "/image1.png",
                category: "Events",
                title: "Special Events",
              },
              { src: "/image3.png", category: "VIP", title: "VIP Experiences" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={
                  galleryInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                transition={{
                  duration: 0.6,
                  delay: 0.2 + index * 0.1,
                  ease: "easeOut",
                }}
                className="group relative col-span-1 row-span-1 overflow-hidden rounded-lg elegant-shadow cursor-pointer"
              >
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="gold-gradient text-black px-2 py-1 rounded-full text-xs font-lora uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Tall image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                galleryInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="group relative col-span-2 row-span-2 overflow-hidden rounded-lg elegant-shadow cursor-pointer"
            >
              <Image
                src="/image2.png"
                alt="Spa and wellness"
                width={600}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="gold-gradient text-black px-3 py-1 rounded-full text-xs font-lora uppercase tracking-wider">
                  Wellness
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-cinzel font-bold text-lg mb-1">
                  Spa Retreat
                </h3>
                <p className="text-white/80 text-sm font-lora">
                  Rejuvenate your mind, body, and soul
                </p>
              </div>
            </motion.div>

            {/* Wide image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                galleryInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              className="group relative col-span-2 row-span-1 overflow-hidden rounded-lg elegant-shadow cursor-pointer"
            >
              <Image
                src="/tourist-carrying-luggage.jpg"
                alt="Travel experiences"
                width={600}
                height={200}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="gold-gradient text-black px-2 py-1 rounded-full text-xs font-lora uppercase tracking-wider">
                  Travel
                </span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-cinzel font-bold text-sm mb-1">
                  Curated Journeys
                </h3>
              </div>
            </motion.div>

            {/* Additional small images */}
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={`extra-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={
                  galleryInView
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.95 }
                }
                transition={{
                  duration: 0.6,
                  delay: 0.8 + index * 0.1,
                  ease: "easeOut",
                }}
                className="group relative col-span-1 row-span-1 overflow-hidden rounded-lg elegant-shadow cursor-pointer"
              >
                <Image
                  src={`/placeholder.svg?height=200&width=300&text=Experience ${
                    index + 1
                  }`}
                  alt={`Experience ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="gold-gradient text-black px-2 py-1 rounded-full text-xs font-lora uppercase tracking-wider">
                    Premium
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Gallery Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <div className="luxury-card p-6 rounded-lg">
              <h3 className="text-3xl font-cinzel font-bold gold-accent mb-2">
                500+
              </h3>
              <p className="text-sm font-lora uppercase tracking-wider text-gray-300">
                Luxury Experiences
              </p>
            </div>
            <div className="luxury-card p-6 rounded-lg">
              <h3 className="text-3xl font-cinzel font-bold gold-accent mb-2">
                50+
              </h3>
              <p className="text-sm font-lora uppercase tracking-wider text-gray-300">
                Premium Locations
              </p>
            </div>
            <div className="luxury-card p-6 rounded-lg">
              <h3 className="text-3xl font-cinzel font-bold gold-accent mb-2">
                1000+
              </h3>
              <p className="text-sm font-lora uppercase tracking-wider text-gray-300">
                Happy Guests
              </p>
            </div>
            <div className="luxury-card p-6 rounded-lg">
              <h3 className="text-3xl font-cinzel font-bold gold-accent mb-2">
                24/7
              </h3>
              <p className="text-sm font-lora uppercase tracking-wider text-gray-300">
                Concierge Service
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={galleryInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 align-middle items-center text-center"
          >
            <Button
              asChild
              className="gold-gradient px-8 py-4 mb-5 sm:mb-0 text-sm font-lora uppercase tracking-widest text-black hover:opacity-90 mr-4 elegant-shadow"
            >
              <Link href="/gallery">View Full Gallery</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-secondary px-8 py-4 text-sm font-lora uppercase tracking-widest text-secondary hover:bg-secondary hover:text-black elegant-shadow"
            >
              <Link href="/booking">Book Experience</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="relative aspect-[21/9] w-full sm:py-0 py-32">
        <Image
          src="/image4.png"
          alt="Book your experience"
          // width={1920}
          // height={1080}
          fill
          className="w-full h-full object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8 text-3xl font-cinzel font-bold uppercase tracking-widest text-white md:text-4xl">
              Begin Your Journey
            </h2>
            <Button
              asChild
              className="gold-gradient px-8 py-6 text-sm font-lora uppercase tracking-widest text-black hover:opacity-90 elegant-shadow"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-40">
        <CurrencySelector />
      </div>
    </>
  );
}
