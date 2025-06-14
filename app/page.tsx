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
  const [whoWeServeRef, whoWeServeInView] = useInView({ threshold: 0.03 });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.03 });
  const [circleRef, circleInView] = useInView({ threshold: 0.03 });
  const [testimonialsRef, testimonialsInView] = useInView({ threshold: 0.03 });
  const [galleryRef, galleryInView] = useInView({ threshold: 0.03 });

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

  const categories = [
    "All",
    ...new Set(galleryImages.map((image) => image.category)),
  ];
  const filteredGalleryImages =
    selectedCategory === "All"
      ? galleryImages.slice(0, 11)
      : galleryImages
          .filter((image) => image.category === selectedCategory)
          .slice(0, 11);

  const serviceItems = [
    {
      title: "Global Travel & Aviation Planning",
      icon: <Plane className="w-8 h-8 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
    {
      title: "Luxury Transportation & Secure Mobility",
      icon: <Car className="w-8 h-8 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
    {
      title: "Private Event Production",
      icon: <Calendar className="w-8 h-8 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
    {
      title: "Personal Affairs & Lifestyle Management",
      icon: <Users className="w-8 h-8 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
    {
      title: "Access to Rare Experiences & Cultural Moments",
      icon: <Star className="w-8 h-8 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
    {
      title: "Vetting, Scheduling, & Managing Luxury Vendors",
      icon: <Briefcase className="w-8 h-8 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
  ];

  const getPackageIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "sorted lifestyle":
        return <Star className="w-5 h-5 text-secondary mr-2" />;
      case "sorted experiences":
        return <Users className="w-5 h-5 text-secondary mr-2" />;
      case "sorted heritage":
        return <Shield className="w-5 h-5 text-secondary mr-2" />;
      default:
        return <Star className="w-5 h-5 text-secondary mr-2" />;
    }
  };

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
            <p className="mb-12 font-archivo text-sm sm:text-base md:text-lg tracking-wider text-muted-foreground">
              With absolute discretion for those who demand the exceptional
            </p>
            <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="border-secondary text-white hover:bg-secondary hover:text-muted-foreground px-8 py-6 text-xs sm:text-sm font-archivo uppercase tracking-widest elegant-shadow backdrop-blur-sm"
              >
                <Link href="/services">What We Handle</Link>
              </Button>
              <Button
                asChild
                className="bg-gold-gradient px-8 py-6 text-xs sm:text-sm font-archivo uppercase tracking-widest text-black hover:bg-secondary-light/80 elegant-shadow"
              >
                <Link href="/contact">Request Private Access</Link>
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
          <ChevronDown className="h-8 w-8 text-secondary-light opacity-70 drop-shadow-md" />{" "}
          {/* Updated to secondary.light */}
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
                  src="/image16.png"
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
              <p className="text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
                At Sorted Concierge, we understand your time is your most
                valuable asset. That's why we go beyond simply meeting
                expectations; we anticipate them, eliminate friction, and
                orchestrate seamless experiences that empower you to move
                through the world with unparalleled ease.
              </p>
              <p className="text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
                Our promise is to provide more than just a service; it's to
                deliver a lifestyle where the extraordinary becomes your
                everyday standard. Whether securing a private jet for a
                last-minute departure, curating a bespoke event, or sourcing the
                seemingly unattainable, our team works tirelessly behind the
                scenes to ensure your needs are sorted.
              </p>
              {/* <Button
                asChild
                variant="outline"
                className="border-secondary text-white hover:bg-secondary hover:text-muted-foreground px-8 py-4 text-xs sm:text-sm font-archivo uppercase tracking-widest elegant-shadow w-fit"
              >
                <Link href="/about">Discover Our Approach</Link>
              </Button> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      {/* <section className="bg-black py-12" ref={whoWeServeRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              whoWeServeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Who We Serve
            </h2>
            <p className="mb-8 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              We're more than a concierge. We're your lifestyle architect, your
              trusted fixer, and your inside line to the extraordinary.
            </p>
            <p className="mb-8 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              Whether you think of us as bespoke travel designers, luxury
              lifestyle managers, or your executive team, Sorted is whatever you
              need us to be. How we show up remains constant: with quiet
              excellence, relentless attention to detail, and the ability to
              make your vision real, anywhere in the world.
            </p>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              We work across three key verticals, serving private clients,
              families, and elite global citizens who demand more than service;
              they demand certainty. And they know: with Sorted, it’s always
              handled.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isLoading ? (
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-transparent"></div>
              ) : packages.length > 0 ? (
                packages.map((pkg) => (
                  <Button
                    key={pkg.id}
                    asChild
                    variant="outline"
                    className="border-secondary text-white hover:bg-secondary hover:text-muted-foreground px-8 py-4 text-xs sm:text-sm font-archivo uppercase tracking-widest elegant-shadow flex items-center"
                  >
                    <Link href={`/services/${pkg.id}`}>
                      {getPackageIcon(pkg.name)}
                      {pkg.name}
                    </Link>
                  </Button>
                ))
              ) : (
                <p className="text-sm font-archivo text-muted-foreground">
                  No memberships available.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* What We Do Section */}
      <section className="bg-black py-12" ref={servicesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              What We Do
            </h2>
            <p className="mb-8 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              Whether you're orchestrating a multi-continent business tour,
              hosting an intimate gathering in an unfamiliar city, or managing
              the intricate demands of a high-profile lifestyle, we are the
              invisible force ensuring perfection at every turn.
            </p>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              We don't just handle requests, we anticipate needs, solve problems
              before they surface, and deliver outcomes that exceed
              expectations. You envision, we execute.
            </p>
          </motion.div>
          <div className="max-w-full mx-auto overflow-hidden relative group">
            <div className="mb-8 overflow-hidden relative">
              <motion.div
                className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
                animate={{ x: [0, -1200] }}
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
                        loading="lazy"
                        src="/romantic-bohemian-couple-bed.jpg"
                        alt="Global travel and aviation planning"
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-muted/80 via-muted/20 to-transparent" />{" "}
                      {/* Updated to use muted */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <p className="text-xs sm:text-sm font-archivo uppercase tracking-widest text-secondary-light mb-2">
                          TRAVEL
                        </p>
                        <h3 className="text-xl sm:text-2xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Global Travel
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
                        loading="lazy"
                        src="/medium-shot-people-eating.jpg"
                        alt="Private event production"
                        width={320}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-muted/80 via-muted/20 to-transparent" />{" "}
                      {/* Updated to use muted */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <p className="text-[0.75rem] sm:text-xs font-archivo uppercase tracking-widest text-secondary-light mb-1">
                          EVENTS
                        </p>
                        <h3 className="text-lg sm:text-xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Event Production
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
                        loading="lazy"
                        src="/image.png"
                        alt="Access to rare experiences and cultural moments"
                        width={320}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-muted/80 via-muted/20 to-transparent" />{" "}
                      {/* Updated to use muted */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <p className="text-[0.75rem] sm:text-xs font-archivo uppercase tracking-widest text-secondary-light mb-1">
                          EXPERIENCES
                        </p>
                        <h3 className="text-lg sm:text-xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Rare Experiences
                        </h3>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                  
                  <p className="text-[0.75rem] sm:text-xs text-white font-archivo">
                    Drag to scroll
                  </p>
                </div> */}
              </div>
            </div>
            <div className="overflow-hidden relative">
              <motion.div
                className="flex gap-6 w-max cursor-grab active:cursor-grabbing"
                animate={{ x: [-1200, 0] }}
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
                        loading="lazy"
                        src="/image2.png"
                        alt="Personal affairs and lifestyle management"
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-muted/80 via-muted/20 to-transparent" />{" "}
                      {/* Updated to use muted */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <p className="text-xs sm:text-sm font-archivo uppercase tracking-widest text-secondary-light mb-2">
                          LIFESTYLE
                        </p>
                        <h3 className="text-xl sm:text-2xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Lifestyle Management
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
                        loading="lazy"
                        src="/image1.png"
                        alt="Luxury transportation and secure mobility"
                        width={320}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-muted/80 via-muted/20 to-transparent" />{" "}
                      {/* Updated to use muted */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <p className="text-[0.75rem] sm:text-xs font-archivo uppercase tracking-widest text-secondary-light mb-1">
                          MOBILITY
                        </p>
                        <h3 className="text-lg sm:text-xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Luxury Transport
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
                        loading="lazy"
                        src="/image3.png"
                        alt="Crisis response and high-stakes logistics"
                        width={320}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-muted/80 via-muted/20 to-transparent" />{" "}
                      {/* Updated to use muted */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        <p className="text-[0.75rem] sm:text-xs font-archivo uppercase tracking-widest text-secondary-light mb-1">
                          LOGISTICS
                        </p>
                        <h3 className="text-lg sm:text-xl font-cinzel font-bold uppercase tracking-wider text-white">
                          Crisis Response
                        </h3>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
          {/* <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="group relative p-6 bg-card border border-muted rounded-lg elegant-shadow hover:shadow-2xl transition-all duration-300 hover:border-secondary" // Updated to use card and muted
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-lg sm:text-xl font-cinzel font-bold uppercase tracking-wider text-white mb-4">
                    {item.title}
                  </h3>
                  <Button
                    asChild
                    className="bg-gold-gradient px-6 py-3 text-xs sm:text-sm font-archivo uppercase tracking-widest text-black hover:bg-secondary-light/80 elegant-shadow opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <Link href="/services">Learn More</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div> */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 text-center"
          >
            <Button
              asChild
              variant="outline"
              className="border-secondary text-white hover:bg-secondary hover:text-muted-foreground px-8 py-4 text-xs sm:text-sm font-archivo uppercase tracking-widest elegant-shadow"
            >
              <Link href="/services">See Our Signature Services</Link>
            </Button>
          </motion.div> */}
        </div>
      </section>

      {/* The Sorted Circle Section */}
      {/* <section className="bg-black py-12" ref={circleRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              circleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              The Sorted Circle
            </h2>
            <p className="mb-8 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              We work with a small, high-trust circle of clients who value
              privacy, polish, and the kind of service that never needs to be
              explained.
            </p>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              With team members and partners across key global cities from New
              York to Dubai, London to Lagos, we offer an uncommon blend of
              cultural fluency and logistical mastery. This is concierge for
              those who move differently.
            </p>
            <Button
              asChild
              variant="outline"
              className="border-secondary text-white hover:bg-secondary hover:text-muted-foreground px-8 py-4 text-xs sm:text-sm font-archivo uppercase tracking-widest elegant-shadow"
            >
              <Link href="/services">Apply for Membership</Link>
            </Button>
          </motion.div>
        </div>
      </section> */}

      {/* Testimonials Section */}
      <section className="bg-black py-12" ref={testimonialsRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              What Our Clients Say
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-card p-6 rounded-lg elegant-shadow">
                {" "}
                {/* Updated to use card */}
                <p className="text-sm sm:text-base font-archivo text-muted-foreground italic">
                  "Sorted Concierge turned a complex multi-city itinerary into a
                  seamless experience. Their discretion and precision are
                  unparalleled."
                </p>
                <p className="mt-4 text-xs sm:text-sm font-archivo uppercase tracking-wider text-secondary-light">
                  - Private Client, New York
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg elegant-shadow">
                {" "}
                {/* Updated to use card */}
                <p className="text-sm sm:text-base font-archivo text-muted-foreground italic">
                  "From exclusive cultural events to last-minute travel
                  solutions, Sorted delivers the extraordinary with effortless
                  ease."
                </p>
                <p className="mt-4 text-xs sm:text-sm font-archivo uppercase tracking-wider text-secondary-light">
                  - Elite Traveler, Dubai
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center mx-8"
        >
          <div className="bg-card p-6 rounded-lg elegant-shadow">
            {" "}
            {/* Updated to use card */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-secondary-light mb-2">
              500+
            </h3>
            <p className="text-xs sm:text-sm font-archivo uppercase tracking-wider text-muted-foreground">
              Curated Experiences
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg elegant-shadow">
            {" "}
            {/* Updated to use card */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-secondary-light mb-2">
              50+
            </h3>
            <p className="text-xs sm:text-sm font-archivo uppercase tracking-wider text-muted-foreground">
              Global Cities
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg elegant-shadow">
            {" "}
            {/* Updated to use card */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-secondary-light mb-2">
              1000+
            </h3>
            <p className="text-xs sm:text-sm font-archivo uppercase tracking-wider text-muted-foreground">
              Satisfied Clients
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg elegant-shadow">
            {" "}
            {/* Updated to use card */}
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-secondary-light mb-2">
              24/7
            </h3>
            <p className="text-xs sm:text-sm font-archivo uppercase tracking-widest text-muted-foreground">
              Concierge Support
            </p>
          </div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      {/* <section className="bg-black py-12" ref={galleryRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Your World, Curated
            </h2>
            <p className="mb-16 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              Explore a world of rare experiences and cultural moments,
              meticulously crafted for those who demand the exceptional.
            </p>
          </motion.div>
          <div className="mb-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                galleryInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.06, delay: 0.02 }}
              className="flex overflow-x-auto scrollbar-hide space-x-4 px-0 pb-4 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-6 py-2 text-xs sm:text-sm font-archivo uppercase tracking-wider rounded-full transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-gold-gradient text-black"
                      : "bg-transparent border border-muted text-muted-foreground hover:border-secondary hover:text-secondary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">
            {filteredGalleryImages.length > 0 ? (
              filteredGalleryImages.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={
                    galleryInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.95 }
                  }
                  transition={{
                    duration: 0.6,
                    delay: 0.1 + (index % 6) * 0.1,
                    ease: "easeOut",
                  }}
                  className={`group relative ${
                    index % 7 === 0 || index % 7 === 7
                      ? "col-span-2 row-span-2"
                      : "col-span-1 row-span-1"
                  } overflow-hidden rounded-lg elegant-shadow cursor-pointer`}
                >
                  <Image
                    loading="lazy"
                    src={item.image_url}
                    alt={item.title}
                    width={index % 7 === 0 || index % 7 === 6 ? 600 : 300}
                    height={index % 7 === 0 || index % 7 === 6 ? 600 : 200}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes={
                      index % 7 === 0 || index % 7 === 6
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 50vw, 25vw"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-muted/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />{" "}
                   
                  <div className="absolute top-2 left-2 opacity-0 group-hover:bg-secondary-light/80 transition-opacity duration-300">
                    <span className="bg-gold-gradient text-black px-2 py-1 rounded-full text-[0.75rem] sm:text-xs font-archivo uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  {(index % 7 === 0 || index % 7 === 6) && (
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white font-cinzel font-bold text-base sm:text-lg md:text-xl mb-1">
                        {item.title}
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm font-archivo">
                        {item.description || "Curated experience"}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground font-archivo">
                No images available for this category.
              </div>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={galleryInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 align-middle items-center text-center"
          >
            <Button
              asChild
              className="bg-gold-gradient px-8 py-4 mb-5 sm:mb-0 text-xs sm:text-sm font-archivo uppercase tracking-widest text-black hover:bg-secondary-light/80 mr-4 elegant-shadow"
            >
              <Link href="/gallery">View Full Gallery</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-secondary px-8 py-4 text-xs sm:text-sm font-archivo uppercase tracking-widest text-secondary hover:bg-secondary hover:text-muted-foreground hover:border-secondary elegant-shadow"
            >
              <Link href="/contact">Request Private Access</Link>
            </Button>
          </motion.div>
        </div>
      </section> */}

      {/* Begin Your Journey Section */}
      {/* <section className="relative aspect-[21/9] w-full sm:py-0 py-32">
        <Image
          loading="lazy"
          src="/image17.png"
          alt="Curated luxury experience"
          fill
          className="w-full h-full object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-muted/60 to-transparent" />{" "}
       
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Your World, Sorted
            </h2>
            <Button
              asChild
              className="bg-gold-gradient px-8 py-6 text-xs sm:text-sm font-archivo uppercase tracking-widest text-black hover:bg-secondary-light/80 elegant-shadow"
            >
              <Link href="/contact">Request Private Access</Link>
            </Button>
          </motion.div>
        </div>
      </section> */}

      <div className="fixed bottom-6 right-6 z-40">
        {/* <CurrencySelector /> */}
      </div>
    </>
  );
}
