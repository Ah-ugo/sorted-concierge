"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { apiClient, type Service, type GalleryImage } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import {
  ChevronDown,
  Plane,
  Car,
  Calendar,
  Users,
  Star,
  Briefcase,
  Shield,
} from "lucide-react";

interface Package {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function Home() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 1.05]);

  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [promiseRef, promiseInView] = useInView({ threshold: 0.03 });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.03 });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.03 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, packagesData, galleryData] = await Promise.all([
          apiClient.getServices({ limit: 3 }),
          apiClient.getPackages(),
          apiClient.getGallery({ limit: 10 }),
        ]);
        setServices(servicesData);
        setPackages(
          packagesData.map((pkg: any) => ({
            id: pkg.id,
            name: pkg.name,
            description: pkg.description,
            image: pkg.image || "/images/default-membership.jpg",
          }))
        );
        setGalleryImages(galleryData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description:
            error.message || "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const timer = setTimeout(() => setIsPreloaderVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const carouselItems = [
    {
      id: 1,
      image: "/romantic-bohemian-couple-bed.jpg",
      category: "TRAVEL",
      title: "Global Travel & Aviation",
      description:
        "Full-service concierge support for your global travel needs",
      width: 350,
      height: 450,
      link: "/services/sorted-lifestyle#travel",
    },
    {
      id: 2,
      image: "/medium-shot-people-eating.jpg",
      category: "EVENTS",
      title: "Private Event Production",
      description: "Full-service concierge support for your exclusive events",
      width: 350,
      height: 450,
      link: "/services/sorted-experiences#events",
    },
    {
      id: 3,
      image: "/image.png",
      category: "EXPERIENCES",
      title: "Rare Cultural Moments",
      description: "Full-service concierge support for unique experiences",
      width: 350,
      height: 450,
      link: "/services/sorted-experiences#experiences",
    },
    {
      id: 4,
      image: "/image2.png",
      category: "LIFESTYLE",
      title: "Personal Affairs Management",
      description: "Full-service concierge support for your lifestyle needs",
      width: 350,
      height: 450,
      link: "/services/sorted-lifestyle#lifestyle",
    },
    {
      id: 5,
      image: "/image1.png",
      category: "MOBILITY",
      title: "Luxury Transportation",
      description: "Full-service concierge support for your mobility needs",
      width: 350,
      height: 450,
      link: "/services/sorted-lifestyle#mobility",
    },
    {
      id: 6,
      image: "/image3.png",
      category: "LOGISTICS",
      title: "Crisis Response",
      description: "Full-service concierge support for critical situations",
      width: 350,
      height: 450,
      link: "/services/sorted-heritage#logistics",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative flex h-screen items-center justify-center bg-black"
        ref={heroRef}
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 w-full h-screen"
        >
          <video
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src="/0526.mp4" type="video/mp4" />
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-3" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20 z-3" />
        </motion.div>
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <h1 className="mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cinzel font-bold uppercase tracking-widest text-white drop-shadow-lg">
              Luxury, handled.
            </h1>
            <p className="mb-12 font-crimson_pro text-sm sm:text-base md:text-lg tracking-wider text-muted-foreground">
              For those who demand absolute discretion
            </p>
            <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="border-secondary text-white hover:bg-secondary hover:text-muted-foreground px-8 py-6 text-xs sm:text-sm font-crimson_pro uppercase tracking-widest elegant-shadow backdrop-blur-sm"
              >
                <Link href="/services">Unlock The Sorted Life</Link>
              </Button>
              <Button
                asChild
                className="bg-gold-gradient px-8 py-6 text-xs sm:text-sm font-crimson_pro uppercase tracking-widest text-black hover:bg-secondary-light/80 elegant-shadow"
              >
                <Link href="/contact">Request Exclusive Access</Link>
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
          <ChevronDown className="h-8 w-8 text-secondary-light opacity-70 drop-shadow-md" />
        </motion.div>
      </section>

      {/* The Sorted Promise Section */}
      <section className="bg-black py-12 md:py-16" ref={promiseRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              promiseInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-4xl text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              The Sorted Promise
            </h2>
          </motion.div>
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={
                promiseInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg elegant-shadow">
                <Image
                  loading="lazy"
                  src="/image28.jpg"
                  alt="Seamless travel experience"
                  width={600}
                  height={450}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={
                promiseInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }
              }
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col justify-center space-y-6"
            >
              <p className="text-sm sm:text-base md:text-lg font-crimson_pro text-muted-foreground">
                At Sorted Concierge, we understand your time is your most
                valuable asset. That's why we go beyond simply meeting
                expectations; we anticipate them, eliminate friction, and
                orchestrate seamless experiences that empower you to move
                through the world with unparalleled ease. Experience your world,
                sorted.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your World, Sorted Section */}
      <section className="bg-black py-12" ref={servicesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-8">
              Your World, Sorted
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-crimson_pro text-muted-foreground mb-12">
              We don't just handle requests, we anticipate needs, solve problems
              before they surface, and deliver outcomes that exceed
              expectations. You envision, we execute.
            </p>
          </motion.div>

          {/* Single Line Carousel with Overlay */}
          <div className="max-w-full mx-auto overflow-hidden relative group py-8">
            <motion.div
              className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
              animate={{ x: [0, -2100] }}
              transition={{
                x: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
              drag="x"
              dragConstraints={{ left: -2100, right: 0 }}
              dragElastic={0.1}
              whileDrag={{ scale: 0.98 }}
            >
              {[...carouselItems, ...carouselItems].map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    servicesInView
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 30 }
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * (index % carouselItems.length),
                    ease: "easeOut",
                  }}
                  className="group relative w-[350px] h-[450px] overflow-hidden rounded-lg elegant-shadow hover:shadow-2xl transition-all duration-300 flex-shrink-0"
                >
                  <Image
                    loading="lazy"
                    src={item.image}
                    alt={item.title}
                    width={item.width}
                    height={item.height}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="350px"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <p className="text-xs sm:text-sm font-crimson_pro uppercase tracking-widest text-secondary-light mb-2">
                      {item.category}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-cinzel font-bold uppercase tracking-wider text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm font-crimson_pro text-white/80 mb-4">
                      {item.description}
                    </p>
                    <Button
                      asChild
                      className="bg-gold-gradient w-full py-3 text-xs sm:text-sm font-crimson_pro uppercase tracking-widest text-black hover:bg-secondary-light/80 transition-all duration-300 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <Link href={item.link}>Learn More</Link>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-black py-12" ref={testimonialsRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-4">
              Sorted Stories
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-crimson_pro text-muted-foreground mb-8">
              Real words. Real experiences. Discover how we turn luxury into
              ease, one client at a time.
            </p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-card p-6 rounded-lg elegant-shadow">
              <p className="text-sm sm:text-base font-crimson_pro text-muted-foreground italic">
                "Sorted Concierge turned a complex multi-city itinerary into a
                seamless experience. Their discretion and precision are
                unparalleled."
              </p>
              <p className="mt-4 text-xs sm:text-sm font-crimson_pro uppercase tracking-wider text-secondary-light">
                - Private Client, New York
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg elegant-shadow">
              <p className="text-sm sm:text-base font-crimson_pro text-muted-foreground italic">
                "From exclusive cultural events to last-minute travel solutions,
                Sorted delivers the extraordinary with effortless ease."
              </p>
              <p className="mt-4 text-xs sm:text-sm font-crimson_pro uppercase tracking-wider text-secondary-light">
                - Elite Traveler, Dubai
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center mx-8"
          >
            <div className="bg-card p-6 rounded-lg elegant-shadow">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-secondary-light mb-2">
                500+
              </h3>
              <p className="text-xs sm:text-sm font-crimson_pro uppercase tracking-wider text-muted-foreground">
                Curated Experiences
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg elegant-shadow">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-secondary-light mb-2">
                50+
              </h3>
              <p className="text-xs sm:text-sm font-crimson_pro uppercase tracking-wider text-muted-foreground">
                Global Cities
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg elegant-shadow">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-secondary-light mb-2">
                1000+
              </h3>
              <p className="text-xs sm:text-sm font-crimson_pro uppercase tracking-wider text-muted-foreground">
                Satisfied Clients
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg elegant-shadow">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-secondary-light mb-2">
                24/7
              </h3>
              <p className="text-xs sm:text-sm font-crimson_pro uppercase tracking-widest text-muted-foreground">
                Concierge Support
              </p>
            </div>
          </motion.div>

          {/* Office Address */}
          {/* <div className="mt-16 text-center">
            <p className="text-sm sm:text-base font-crimson_pro text-muted-foreground">
              1st Floor, Wings Office Complex
              <br />
              17A Ozumba Mbadiwe Avenue
              <br />
              Victoria Island, Lagos
            </p>
          </div> */}
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-40">
        {/* <CurrencySelector /> */}
      </div>
    </>
  );
}
