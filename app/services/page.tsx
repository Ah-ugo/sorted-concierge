"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import ServiceCard from "@/components/service-card";
import PackageCard from "@/components/package-card";
import { apiClient, type Service, type Package } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

export default function ServicesPage() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [packagesRef, packagesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [processRef, processInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const categories = [
    "All",
    "Transportation",
    "Dining",
    "Events",
    "Lifestyle",
    "Travel",
    "Business",
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiClient.getServices();
        setServices(data);
      } catch (error: any) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description:
            error.message ||
            "Failed to load services. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingServices(false);
      }
    };

    const fetchPackages = async () => {
      try {
        const data = await apiClient.getPackages();
        setPackages(data);
      } catch (error: any) {
        console.error("Error fetching packages:", error);
        toast({
          title: "Error",
          description:
            error.message ||
            "Failed to load packages. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPackages(false);
      }
    };

    fetchServices();
    fetchPackages();
  }, [toast]);

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((service) => service.category === activeCategory);

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <Image
            src="/image6.png"
            alt="Services Hero"
            width={1920}
            height={1080}
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>

        <div className="container relative z-10 mx-auto my-32 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <p className="mb-4 font-lora text-lg italic tracking-wider text-secondary">
              EXPLORE OUR OFFERINGS
            </p>
            <h1 className="mb-6 text-4xl font-cinzel font-bold uppercase tracking-widest text-overlay md:text-5xl">
              PREMIUM CONCIERGE SERVICES
            </h1>
            <p className="mb-12 text-lg font-lora text-overlay">
              Discover our comprehensive range of concierge services designed to
              enhance your lifestyle and save you time.
            </p>
            <Button
              asChild
              className="bg-secondary px-8 py-6 text-sm font-lora uppercase tracking-widest text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="/booking">Book a Service</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="overflow-x-auto">
            <div className="flex min-w-max space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={`min-w-[120px] py-6 text-sm font-lora uppercase tracking-widest ${
                    activeCategory === category
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      : "border-border text-foreground hover:bg-secondary/10"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-background py-16" ref={servicesRef}>
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
              Our Services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoadingServices
              ? // Loading skeleton
                Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="h-[400px] animate-pulse overflow-hidden rounded-lg bg-card p-6"
                      style={{ minHeight: "250px" }}
                    >
                      <div className="mb-4 h-12 w-12 rounded-full bg-muted"></div>
                      <div className="mb-2 h-4 w-1/3 rounded bg-muted"></div>
                      <div className="mb-2 h-6 w-3/4 rounded bg-muted"></div>
                      <div className="mb-2 h-4 w-full rounded bg-muted"></div>
                      <div className="mb-2 h-4 w-full rounded bg-muted"></div>
                      <div className="mb-4 h-4 w-2/3 rounded bg-muted"></div>
                      <div className="mt-auto h-10 w-full rounded bg-muted"></div>
                    </div>
                  ))
              : // Actual services
                filteredServices.map((service, index) => {
                  const transformedService = {
                    id: service.id,
                    title: service.name,
                    description: service.description,
                    icon: getServiceIcon(service.category),
                    price: `₦${service.price.toLocaleString()}`,
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
                      className="transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg"
                    >
                      <ServiceCard service={transformedService} />
                    </motion.div>
                  );
                })}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="bg-muted py-32" ref={packagesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              packagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-3xl font-cinzel font-bold uppercase tracking-widest text-white md:text-4xl">
              Concierge Membership Packages
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {isLoadingPackages
              ? // Loading skeleton
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="h-[500px] animate-pulse overflow-hidden rounded-lg bg-card p-6 shadow-lg"
                    >
                      <div className="mb-4 h-6 w-1/2 rounded bg-muted"></div>
                      <div className="mb-4 h-4 w-3/4 rounded bg-muted"></div>
                      <div className="mb-2 h-4 w-full rounded bg-muted"></div>
                      <div className="mb-2 h-4 w-full rounded bg-muted"></div>
                      <div className="mb-2 h-4 w-full rounded bg-muted"></div>
                      <div className="mb-4 h-4 w-2/3 rounded bg-muted"></div>
                      <div className="mt-auto h-10 w-full rounded bg-muted"></div>
                    </div>
                  ))
              : // Actual packages
                packages.map((pkg, index) => {
                  const transformedPackage = {
                    id: pkg.id,
                    title: pkg.name,
                    description: pkg.description,
                    price: `₦${pkg.price.toLocaleString()}/${pkg.type.toLowerCase()}`,
                    features: pkg.features,
                    popular: pkg.isPopular,
                    type: pkg.type,
                  };
                  return (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        packagesInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 30 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="transform transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl"
                    >
                      <PackageCard package={transformedPackage} />
                    </motion.div>
                  );
                })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={packagesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="mb-8 text-lg font-lora text-foreground">
              Need a custom package? We can create a bespoke solution tailored
              to your specific needs.
            </p>
            <Button
              asChild
              className="bg-secondary px-8 py-6 text-sm font-lora uppercase tracking-widest text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="/contact">Contact Us for Custom Packages</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-background py-32" ref={processRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-3xl font-cinzel font-bold uppercase tracking-widest text-white md:text-4xl">
              Our Simple Process
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Request a Service",
                description:
                  "Submit your request through our booking form, WhatsApp, or by calling our concierge line.",
              },
              {
                step: "2",
                title: "Receive Confirmation",
                description:
                  "Our team will confirm your request and provide you with all the necessary details.",
              },
              {
                step: "3",
                title: "Enjoy Your Experience",
                description:
                  "Sit back and relax as we take care of everything, ensuring a seamless and enjoyable experience.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
                  <span className="text-3xl font-lora text-secondary">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-4 text-xl font-cinzel font-bold uppercase tracking-wider text-white">
                  {item.title}
                </h3>
                <p className="text-foreground font-lora">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative aspect-[21/9] w-full"
        style={{ minHeight: "300px" }}
      >
        <div className="absolute inset-0">
          <Image
            src="/image7.png"
            alt="CTA Background"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8 text-3xl font-cinzel font-bold uppercase tracking-widest text-overlay md:text-4xl">
              Ready to Experience Our Services?
            </h2>
            <Button
              asChild
              className="bg-secondary px-8 py-6 text-sm font-lora uppercase tracking-widest text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
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
