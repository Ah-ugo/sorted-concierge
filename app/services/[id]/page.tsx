"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  Plane,
  Shield,
  Star,
  Globe,
  Users,
  Car,
  Calendar,
  Heart,
  MapPin,
  Phone,
  Mail,
  Check,
  Clock,
  Loader2,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

interface ServiceFeature {
  name: string;
  description: string;
  image: string;
  duration: string;
  isAvailable: boolean;
  features: string[];
  requirements: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
}

interface ServiceTier {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  is_popular: boolean;
  is_available: boolean;
  image: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  category_type: "tiered" | "contact_only";
  image: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tiers: ServiceTier[];
  services: ServiceFeature[];
}

const getServiceIcon = (serviceName: string) => {
  const name = serviceName.toLowerCase();
  if (name.includes("lifestyle"))
    return <Star className="w-8 h-8 text-secondary" />;
  if (name.includes("experience"))
    return <Calendar className="w-8 h-8 text-secondary" />;
  if (name.includes("heritage"))
    return <Shield className="w-8 h-8 text-secondary" />;
  return <Globe className="w-8 h-8 text-secondary" />;
};

const getFeatureIcon = (featureName: string) => {
  const name = featureName.toLowerCase();
  if (name.includes("airport") || name.includes("aviation"))
    return <Plane className="w-6 h-6 text-secondary" />;
  if (name.includes("transport") || name.includes("car"))
    return <Car className="w-6 h-6 text-secondary" />;
  if (name.includes("celebration") || name.includes("proposal"))
    return <Heart className="w-6 h-6 text-secondary" />;
  if (name.includes("global") || name.includes("citizenship"))
    return <Globe className="w-6 h-6 text-secondary" />;
  if (name.includes("family") || name.includes("office"))
    return <Users className="w-6 h-6 text-secondary" />;
  if (name.includes("wealth") || name.includes("insurance"))
    return <Shield className="w-6 h-6 text-secondary" />;
  if (name.includes("real estate") || name.includes("property"))
    return <MapPin className="w-6 h-6 text-secondary" />;
  if (name.includes("banking") || name.includes("investment"))
    return <Clock className="w-6 h-6 text-secondary" />;
  return <Star className="w-6 h-6 text-secondary" />;
};

const ServiceCarousel = ({ services }: { services: ServiceFeature[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1); // -1 to account for rounding errors
    }
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      // Initial check after items are rendered
      const timeout = setTimeout(checkScroll, 100);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto group">
      {/* Navigation arrows */}
      {showLeftArrow && (
        <motion.button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 rounded-full p-2 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronLeftIcon className="h-8 w-8 text-white" />
        </motion.button>
      )}

      {showRightArrow && (
        <motion.button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 rounded-full p-2 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </motion.button>
      )}

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide gap-6 px-4 py-8"
        style={{
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            className="flex-shrink-0 w-[85vw] sm:w-[65vw] md:w-[45vw] lg:w-[35vw] xl:w-[30vw] snap-start"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-0 elegant-shadow h-full relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {getFeatureIcon(service.name)}
                  <h3 className="ml-3 text-xl sm:text-2xl font-cinzel font-bold text-white">
                    {service.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-secondary text-xs font-crimson_pro uppercase tracking-wider">
                    Duration: {service.duration}
                  </span>
                  {service.isAvailable && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                      Available
                    </span>
                  )}
                </div>

                <p className="text-muted-foreground font-crimson_pro mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-cinzel font-bold text-white uppercase tracking-wider mb-3">
                      What's Included
                    </h4>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div
                          key={`${service.id}-feature-${featureIndex}`}
                          className="flex items-start"
                        >
                          <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-2 flex-shrink-0" />
                          <p className="text-sm font-crimson_pro text-muted-foreground">
                            {feature}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {service.requirements.length > 0 && (
                    <div>
                      <h4 className="text-md font-cinzel font-bold text-white uppercase tracking-wider mb-3">
                        Requirements
                      </h4>
                      <div className="space-y-2">
                        {service.requirements.map((requirement, reqIndex) => (
                          <div
                            key={`${service.id}-req-${reqIndex}`}
                            className="flex items-start"
                          >
                            <Clock className="w-4 h-4 text-secondary mt-1 mr-2 flex-shrink-0" />
                            <p className="text-sm font-crimson_pro text-muted-foreground">
                              {requirement}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [sectionsRef, sectionsInView] = useInView({ threshold: 0.1 });
  const [tiersRef, tiersInView] = useInView({ threshold: 0.1 });

  const [serviceCategory, setServiceCategory] =
    useState<ServiceCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceCategory = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://naija-concierge-api.onrender.com/service-categories/${id}`,
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch service category");
        }

        const data = await response.json();
        setServiceCategory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceCategory();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBookingRoute = () => {
    if (!serviceCategory) return "/contact";

    if (serviceCategory.category_type === "tiered") {
      return "/membership-booking";
    }

    return "/booking";
  };

  const getBookingButtonText = () => {
    if (!serviceCategory) return "Contact Us";

    if (serviceCategory.category_type === "tiered") {
      return "Choose Service Tier";
    }

    return "Book This Service Category";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-muted-foreground font-crimson_pro">
            Loading service details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !serviceCategory) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-cinzel font-bold text-white mb-4">
            Service Not Found
          </h1>
          <p className="text-muted-foreground font-crimson_pro mb-6">
            {error || "Service category not found"}
          </p>
          <Button
            asChild
            variant="outline"
            className="border-secondary text-white hover:bg-secondary hover:text-black"
          >
            <Link href="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex flex-col justify-center items-center"
        ref={heroRef}
      >
        <div className="absolute inset-0">
          <Image
            src={
              serviceCategory.image || "/placeholder.svg?height=1080&width=1920"
            }
            alt={serviceCategory.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto text-center"
          >
            <Button
              asChild
              variant="ghost"
              className="text-white hover:text-secondary bg-none hover:bg-transparent hover:border-b hover:border-secondary mb-6 p-0"
            >
              <Link
                href="/services"
                className="flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Services
              </Link>
            </Button>

            <div className="flex justify-center items-center mb-6">
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-cinzel font-bold text-white ml-4">
                {serviceCategory.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => {
                  const targetId =
                    serviceCategory.category_type === "tiered"
                      ? "pricing"
                      : "services";
                  document
                    .getElementById(targetId)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-4 font-crimson_pro uppercase tracking-wider"
              >
                {serviceCategory.category_type === "tiered"
                  ? "View Pricing"
                  : "Explore Services"}
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-secondary text-white bg-black hover:bg-secondary hover:text-black px-8 py-4 font-crimson_pro uppercase tracking-wider"
              >
                <Link
                  href={`${getBookingRoute()}?categoryId=${serviceCategory.id}`}
                >
                  {getBookingButtonText()}
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      {serviceCategory.category_type === "tiered" &&
        serviceCategory.tiers.length > 0 && (
          <section
            id="pricing"
            className="py-16 md:py-24 bg-card/5"
            ref={tiersRef}
          >
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={
                  tiersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-16"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-6">
                  Service Tiers
                </h2>
                <p className="text-lg font-crimson_pro text-muted-foreground">
                  Choose the level of service that fits your lifestyle
                </p>
              </motion.div>
              <div className="flex justify-center align-middle items-center">
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {serviceCategory.tiers.map((tier, index) => (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={
                        tiersInView
                          ? { opacity: 1, y: 0 }
                          : { opacity: 0, y: 40 }
                      }
                      transition={{
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: "easeOut",
                      }}
                      className={`relative ${
                        tier.is_popular ? "scale-105" : ""
                      }`}
                    >
                      {tier.is_popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gold-gradient text-black px-4 py-1 rounded-full text-xs font-crimson_pro uppercase tracking-wider">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <Card
                        className={`bg-card border-0 elegant-shadow h-full ${
                          tier.is_popular ? "border-secondary" : ""
                        }`}
                      >
                        <CardContent className="p-8">
                          <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg">
                            <Image
                              src={
                                tier.image ||
                                "/placeholder.svg?height=300&width=400"
                              }
                              alt={tier.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <h3 className="text-2xl font-cinzel font-bold text-white mb-2 uppercase tracking-wider">
                            {tier.name}
                          </h3>
                          <p className="text-3xl font-cinzel font-bold text-secondary mb-4">
                            {formatPrice(tier.price)}
                          </p>
                          <p className="text-muted-foreground font-crimson_pro mb-6">
                            {tier.description}
                          </p>

                          <div className="space-y-3 mb-8">
                            {tier.features.map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-start"
                              >
                                <Check className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                                <p className="text-sm font-crimson_pro text-muted-foreground">
                                  {feature}
                                </p>
                              </div>
                            ))}
                          </div>

                          <Button
                            asChild
                            className={`w-full py-3 font-crimson_pro uppercase tracking-wider ${
                              tier.is_popular
                                ? "bg-gold-gradient text-black hover:bg-secondary/80"
                                : "bg-transparent border border-secondary text-white hover:bg-secondary hover:text-black"
                            }`}
                          >
                            <Link
                              href={`/membership-booking?tierId=${tier.id}`}
                            >
                              Select This Tier
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

      {/* Services Section */}
      {serviceCategory.services.length > 0 && (
        <section id="services" className="py-16 md:py-24" ref={sectionsRef}>
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={
                sectionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-6">
                What's Included
              </h2>
              <p className="text-lg font-crimson_pro text-muted-foreground">
                {serviceCategory.category_type === "contact_only"
                  ? "Book the entire service category and our team will customize the experience for you"
                  : "Explore our comprehensive range of luxury services"}
              </p>
            </motion.div>

            {serviceCategory.category_type === "contact_only" ? (
              <ServiceCarousel services={serviceCategory.services} />
            ) : (
              <div className="space-y-24">
                {serviceCategory.services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={
                      sectionsInView
                        ? { opacity: 1, y: 0 }
                        : { opacity: 0, y: 40 }
                    }
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: "easeOut",
                    }}
                    className={`grid lg:grid-cols-2 gap-12 items-center ${
                      index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                    }`}
                  >
                    <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-lg elegant-shadow">
                        <Image
                          src={
                            service.image ||
                            "/placeholder.svg?height=600&width=800"
                          }
                          alt={service.name}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          {getFeatureIcon(service.name)}
                        </div>
                      </div>
                    </div>

                    <div
                      className={
                        index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                      }
                    >
                      <Card className="bg-card border-0 elegant-shadow h-full">
                        <CardContent className="p-8">
                          <div className="flex items-center mb-6">
                            {getFeatureIcon(service.name)}
                            <h3 className="ml-4 text-2xl sm:text-3xl font-cinzel font-bold text-white">
                              {service.name}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <span className="text-secondary text-sm font-crimson_pro uppercase tracking-wider">
                              Duration: {service.duration}
                            </span>
                            {service.isAvailable && (
                              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                Available
                              </span>
                            )}
                          </div>

                          <p className="text-muted-foreground font-crimson_pro mb-8 leading-relaxed text-lg">
                            {service.description}
                          </p>

                          <div className="grid gap-8">
                            <div>
                              <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider mb-4">
                                What's Included
                              </h4>
                              <div className="space-y-3">
                                {service.features.map(
                                  (feature, featureIndex) => (
                                    <div
                                      key={featureIndex}
                                      className="flex items-start"
                                    >
                                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0" />
                                      <p className="text-sm font-crimson_pro text-muted-foreground">
                                        {feature}
                                      </p>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>

                            {service.requirements.length > 0 && (
                              <div>
                                <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider mb-4">
                                  Requirements
                                </h4>
                                <div className="space-y-3">
                                  {service.requirements.map(
                                    (requirement, reqIndex) => (
                                      <div
                                        key={reqIndex}
                                        className="flex items-start"
                                      >
                                        <Clock className="w-4 h-4 text-secondary mt-1 mr-3 flex-shrink-0" />
                                        <p className="text-sm font-crimson_pro text-muted-foreground">
                                          {requirement}
                                        </p>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 bg-card/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-6">
              Ready to Get Sorted?
            </h2>
            <p className="text-lg font-crimson_pro text-muted-foreground mb-8">
              {serviceCategory.category_type === "tiered"
                ? "Choose your service tier and experience luxury lifestyle management at its finest."
                : "Contact us to discuss your requirements and begin your journey with our exclusive services."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-secondary mr-2" />
                <span className="text-sm font-crimson_pro text-muted-foreground">
                  info@sortedconcierge.com
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-secondary mr-2" />
                <span className="text-sm font-crimson_pro text-muted-foreground">
                  +234 803 408 6086
                </span>
              </div>
            </div>

            <Button
              asChild
              className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-4 font-crimson_pro uppercase tracking-wider"
            >
              <Link href={getBookingRoute()}>{getBookingButtonText()}</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
