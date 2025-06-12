"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircle,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star,
  Sparkles,
  Crown,
  Shield,
  Globe,
  Zap,
  Diamond,
} from "lucide-react";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";

interface Membership {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  fullDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  detailedServices: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    details: string;
    features: string[];
  }[];
  contact: { [key: string]: string };
  closing: string;
  image?: string;
}

const faqs = [
  {
    question:
      "What sets Sorted Concierge apart from other luxury concierge services?",
    answer:
      "We're not a concierge directory, a call center, or a glorified booking agent. Sorted is a high-trust lifestyle management partner. We anticipate needs, manage logistics end-to-end, and operate like a personal operations team.",
  },
  {
    question:
      "How far in advance should I contact Sorted to kick off the booking process?",
    answer:
      "As soon as possible, especially for high-demand periods like Detty December or Fashion Week. Simple tasks need 24–48 hours, luxury events 3–8 weeks, travel 2–6 weeks.",
  },
  {
    question:
      "Will you work with me if I need a private concierge on short notice?",
    answer:
      "Yes, on a case-by-case basis depending on availability. We prioritize referred clients and ensure we can deliver at our standard of care.",
  },
];

export default function MembershipDetails() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchMembership = async () => {
      setIsLoading(true);
      try {
        const packages = await apiClient.getPackages();
        const id = pathname.split("/").pop();
        const pkg = packages.find((p: any) => p.id === id);

        if (!pkg) {
          throw new Error("Membership not found");
        }

        const membershipData: Membership = {
          id: pkg.id,
          name: pkg.name,
          subtitle:
            pkg.name === "Sorted Lifestyle"
              ? "Luxury, from touchdown to takeoff."
              : pkg.name === "Sorted Experiences"
              ? "Unforgettable moments, flawlessly executed."
              : "Legacy lives here.",
          description: pkg.description,
          fullDescription:
            pkg.name === "Sorted Lifestyle"
              ? "We ensure your arrival commands attention for all the right reasons. From Lagos to London, Dubai to New York, our global network transforms travel from seamless luxury."
              : pkg.name === "Sorted Experiences"
              ? "From private islands in the Seychelles to exclusive châteaux in Bordeaux, we don’t plan experiences, we create memories that define decades."
              : "True wealth transcends generations, creating opportunities for children not yet born and building bridges across borders.",
          icon:
            pkg.name === "Sorted Lifestyle"
              ? Crown
              : pkg.name === "Sorted Experiences"
              ? Star
              : Shield,
          gradient:
            "from-secondary-light/20 via-secondary-light/30 to-secondary-light/20", // Uses secondary-light (#FAC364)
          detailedServices:
            pkg.name === "Sorted Lifestyle"
              ? [
                  {
                    title: "VIP Airport Protocol & Global Fast-Track",
                    icon: Shield,
                    description:
                      "We ensure that within minutes, you're through private immigration channels, your luggage is secured, and your transport awaits. No queues. No delays. No explanations needed.",
                    details:
                      "Our protocol specialists maintain relationships at key airports worldwide. Whether touching down in Lagos, London Heathrow, JFK, or Dubai International, your passage remains consistently effortless.",
                    features: [
                      "Private immigration and customs processing",
                      "Dedicated ground handling teams",
                      "Luggage coordination and security screening",
                      "Meet-and-greet services with government-trained staff",
                      "Average processing time: 12 minutes from aircraft to transport",
                    ],
                  },
                  {
                    title: "Executive Transport & Armored Security",
                    icon: Globe,
                    description:
                      "Our global fleet, from armored Range Rovers in Lagos to Bentley Mulsannes in London, maintains the same exacting standards. Each vehicle undergoes weekly security assessments, and every team member carries certifications that most governments would envy.",
                    details: "Global Fleet Standards:",
                    features: [
                      "Armored protection rated to international standards",
                      "Real-time GPS tracking and communication systems",
                      "Executive protection specialists from military/police backgrounds",
                      "24/7 emergency response coordination",
                      "Discrete security protocols tailored to each destination",
                    ],
                  },
                  {
                    title: "Private Aviation & Air Transfers",
                    icon: Zap,
                    description:
                      "When commercial aviation becomes inconvenient.",
                    details:
                      "Your schedule doesn't bend to airline timetables. Our aviation division connects you with vetted aircraft operators across six continents, ensuring your travel aligns with your agenda, not theirs.",
                    features: [
                      "On-demand charter coordination globally",
                      "Pre-vetted aircraft and crew certifications",
                      "Custom catering and in-flight preferences",
                      "Ground handling coordination at departure and arrival",
                      "Real-time flight tracking and communication",
                    ],
                  },
                ]
              : pkg.name === "Sorted Experiences"
              ? [
                  {
                    title: "Milestone Celebrations & Proposal Planning",
                    icon: Star,
                    description:
                      "We've orchestrated over 100 proposals, each one a yes. We focus on deeply personal details to create moments that become family lore.",
                    details:
                      "From intimate gatherings to grand celebrations, we ensure every milestone is perfect, tailored to your unique story.",
                    features: [
                      "Custom proposal planning with 100% success rate",
                      "Milestone birthday and anniversary celebrations",
                      "Achievement recognition events",
                      "Surprise coordination and guest management",
                      "Vendor relationships for exclusive venues",
                    ],
                  },
                  {
                    title: "Cultural Immersion & Art Curation",
                    icon: Diamond,
                    description:
                      "Access private art collections, fashion designer studios, and exclusive performances that money alone cannot buy.",
                    details:
                      "Our curators provide insider access to the creative forces shaping culture, from private gallery tours to fashion week front rows.",
                    features: [
                      "Private gallery tours and artist studio visits",
                      "Fashion week access and designer consultations",
                      "Exclusive performance and concert arrangements",
                      "Museum after-hours private tours",
                      "Cultural festival VIP access",
                    ],
                  },
                  {
                    title: "Bespoke Experience Design",
                    icon: Sparkles,
                    description:
                      "When the perfect experience doesn't exist, we create it from scratch, built around your vision.",
                    details:
                      "From private concerts by Grammy winners to pop-up art exhibitions, we craft extraordinary moments that are uniquely yours.",
                    features: [
                      "Initial vision consultation and preference mapping",
                      "Concept development and feasibility assessment",
                      "Vendor coordination and logistics planning",
                      "Day-of coordination and seamless execution",
                      "Post-event documentation and memory preservation",
                    ],
                  },
                ]
              : [
                  {
                    title: "Global Citizenship & Residency Solutions",
                    icon: Globe,
                    description:
                      "Our programs provide more than passports; they offer optionality for wealth preservation and family security.",
                    details:
                      "From Caribbean citizenship to European residencies, we facilitate access to programs that enhance global mobility and tax optimization.",
                    features: [
                      "Caribbean citizenship by investment (St. Kitts, Antigua)",
                      "European residency programs (Portugal, Austria, Spain)",
                      "Strategic residencies (UAE, Singapore, Canada)",
                      "Due diligence and application success optimization",
                      "Family integration with education pathways",
                    ],
                  },
                  {
                    title: "International Real Estate & Investment Assets",
                    icon: Shield,
                    description:
                      "Access investment-grade properties in markets where appreciation outpaces inflation and political uncertainty.",
                    details:
                      "From London’s prime zones to Dubai’s emerging developments, we connect you with assets that build wealth and offer personal enjoyment.",
                    features: [
                      "Off-market property access through exclusive networks",
                      "Due diligence (legal, financial, market analysis)",
                      "Financing coordination with international banks",
                      "Property management and rental optimization",
                      "Exit strategy planning and capital gains optimization",
                    ],
                  },
                  {
                    title: "Wealth Preservation & Family Office",
                    icon: Crown,
                    description:
                      "Sophisticated protection through life insurance and family office structures to safeguard and transfer wealth.",
                    details:
                      "Our solutions include USD-denominated policies and multi-jurisdictional governance to minimize tax liabilities and ensure legacy.",
                    features: [
                      "USD-denominated universal life policies",
                      "Family office governance and succession planning",
                      "Multi-jurisdictional tax optimization",
                      "Generation-skipping transfer strategies",
                      "Risk management and asset protection",
                    ],
                  },
                ],
          contact: {
            lagos: "+234 123 456 7890",
            london: "+44 20 1234 5678",
            dubai: "+971 4 123 4567",
            global: "info@sortedconcierge.com",
          },
          closing:
            pkg.name === "Sorted Lifestyle"
              ? "Because access is everything, and you're already Sorted."
              : pkg.name === "Sorted Experiences"
              ? "You dream it. We sort it. Together, we make it legendary."
              : "Your legacy, our commitment. Sorted for generations.",
          image: pkg.image || "/placeholder.svg?height=1200&width=800",
        };

        setMembership(membershipData);
      } catch (err: any) {
        console.error("Failed to fetch membership:", err.message);
        setError("Membership not found or failed to load.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembership();
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary-light border-t-transparent"></div>
      </div>
    );
  }

  if (error || !membership) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center text-white">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {error || "Membership Not Found"}
          </h2>
          <Link href="/services">
            <Button className="bg-gold-gradient text-black hover:bg-secondary-light/80">
              Back to Memberships
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const FloatingOrbs = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-secondary-light/10 to-secondary-light/5 blur-xl animate-pulse"
          style={{
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            left: `${20 + i * 15}%`,
            top: `${10 + i * 20}%`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${4 + i}s`,
          }}
        />
      ))}
    </div>
  );

  const ParallaxBackground = () => (
    <div
      className="fixed inset-0 opacity-5 pointer-events-none"
      style={{
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
        transform: `translateY(${scrollY * 0.1}px)`,
      }}
    />
  );

  const MembershipIcon = membership.icon;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <FloatingOrbs />
      <ParallaxBackground />

      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0"
        style={{
          backgroundImage: `url(${
            membership.image || "/placeholder.svg?height=1200&width=800"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-secondary-light rounded-full animate-ping" />
          <div className="absolute top-40 right-32 w-1 h-1 bg-secondary-light rounded-full animate-pulse" />
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-secondary-light rounded-full animate-bounce" />
          <div
            className="absolute top-1/3 right-20 w-2 h-2 bg-secondary-light rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center">
          {/* Back Button */}
          <div className="mb-6 sm:mb-8 flex justify-center sm:justify-start w-full px-4 sm:px-0">
            <Link href="/services" passHref>
              <Button
                variant="ghost"
                className="group text-sm sm:text-base text-muted-foreground hover:text-white hover:bg-muted/50 transition-all duration-300 border border-muted/50 hover:border-secondary-light/50 rounded-xl px-4 py-2 sm:px-6 sm:py-3 relative flex items-center"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform group-hover:-translate-x-1 duration-300" />
                Back to Services
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-light/0 via-secondary-light/5 to-secondary-light/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              </Button>
            </Link>
          </div>

          {/* Membership Badge */}
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-secondary-light/20 to-secondary-light/20 border border-secondary-light/30 backdrop-blur-sm">
            <MembershipIcon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-light" />
            <span className="text-xs sm:text-sm text-secondary-light font-medium tracking-wide uppercase">
              Service Tier
            </span>
          </div>

          {/* Main Title */}
          <div className="relative mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent">
              {membership.name}
            </h1>
            <div className="absolute inset-0 text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider text-secondary-light/20 blur-2xl">
              {membership.name}
            </div>
          </div>

          {/* Subtitle */}
          <p className="mb-4 sm:mb-6 text-secondary-light text-base sm:text-xl md:text-2xl italic">
            {membership.subtitle}
            <Sparkles className="inline-block w-4 h-4 sm:w-6 sm:h-6 ml-2 animate-pulse" />
          </p>

          {/* Description */}
          <p className="mb-6 sm:mb-10 text-sm sm:text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            {membership.description}
          </p>

          {/* CTA Button */}
          <Link href="/membership-booking">
            <Button className="group relative px-8 py-4 sm:px-12 sm:py-6 text-sm sm:text-lg font-medium uppercase tracking-widest bg-gold-gradient text-black hover:bg-secondary-light/80 transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl hover:shadow-secondary-light/25 transform hover:scale-105">
              <span className="relative z-10 flex items-center gap-2 sm:gap-3 text-black">
                Join This Service
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-2 duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-muted/70 rounded-full flex justify-center backdrop-blur-sm"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-secondary-light rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Overview Section */}
      <section className="py-8 sm:pt-12 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-10">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 py-1 sm:px-6 sm:py-2 rounded-full bg-muted/50 border border-muted/50">
              <Diamond className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-dark" />
              <span className="text-xs sm:text-sm text-secondary-light font-medium">
                OVERVIEW
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider mb-6 sm:mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Experience Excellence
            </h2>
            <p className="text-sm sm:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              {membership.fullDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-8 sm:pb-12 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 py-1 sm:px-6 sm:py-2 rounded-full bg-muted/50 border border-muted/50">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-dark" />
              <span className="text-xs sm:text-sm text-secondary-light font-medium">
                SERVICES
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider mb-4">
              What We <span className="text-secondary-light">Handle</span>
            </h2>
          </div>

          <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
            {membership.detailedServices.map((service, index) => {
              const IconComponent = service.icon;
              const isExpanded = expandedService === index;

              return (
                <div
                  key={index}
                  className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-700 ${
                    isExpanded
                      ? "bg-gold-gradient border-secondary-light/20"
                      : "bg-card border-muted/50"
                  } border hover:border-secondary-light/50 backdrop-blur-sm`}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-light/5 via-secondary-light/10 to-secondary-light/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <button
                    className="w-full p-4 sm:p-8 text-left transition-all duration-300 hover:bg-muted/20"
                    onClick={() =>
                      setExpandedService(isExpanded ? null : index)
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 sm:gap-6 flex-1">
                        {/* Animated Icon */}
                        <div
                          className={`p-2 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-500 ${
                            isExpanded
                              ? "bg-white text-secondary-dark"
                              : "bg-muted/50 text-secondary-light group-hover:bg-secondary-light/20"
                          }`}
                        >
                          <IconComponent className="w-5 h-5 sm:w-8 sm:h-8" />
                        </div>

                        <div className="flex-1">
                          <h3
                            className={`text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 group-hover:text-secondary-light/80 transition-colors duration-300 ${
                              isExpanded ? "text-black" : "text-white"
                            }`}
                          >
                            {service.title}
                          </h3>
                          <p
                            className={`text-sm sm:text-lg mb-2 sm:mb-4 leading-relaxed ${
                              isExpanded ? "text-black" : "text-secondary-light"
                            }`}
                          >
                            {service.description}
                          </p>
                          <p
                            className={`text-sm sm:text-base leading-relaxed ${
                              isExpanded
                                ? "text-black/75"
                                : "text-muted-foreground"
                            }`}
                          >
                            {service.details}
                          </p>
                        </div>
                      </div>

                      {/* Chevron */}
                      {/* <div
                        className={`ml-2 sm:ml-6 p-1 sm:p-2 rounded-full transition-all duration-500 ${
                          isExpanded
                            ? "bg-white text-secondary-dark rotate-180"
                            : "bg-muted/50 text-secondary-light"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div> */}
                    </div>
                  </button>

                  {/* Expandable Content */}
                  <div
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${
                      isExpanded
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                      <div className="h-px bg-gradient-to-r from-transparent via-secondary-light/50 to-transparent mb-4 sm:mb-6" />
                      <div className="grid gap-2 sm:gap-4">
                        {service.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 group/feature"
                            style={{
                              animationDelay: `${featureIndex * 100}ms`,
                            }}
                          >
                            <div className="p-0.5 sm:p-1 rounded-full bg-secondary-dark group-hover/feature:bg-secondary-dark/70 transition-colors duration-300">
                              <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <span className="text-xs sm:text-sm text-black/75 leading-relaxed group-hover/feature:text-black transition-colors duration-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 sm:py-12 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 py-1 sm:px-6 sm:py-2 rounded-full bg-muted/50 border border-muted/50">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-dark" />
              <span className="text-xs sm:text-sm text-secondary-light font-medium">
                CONNECT
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider mb-6 sm:mb-8">
              Ready to Experience
              <span className="block text-secondary-light">
                {membership.name}
              </span>
            </h2>

            <p className="text-sm sm:text-xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0">
              {membership.closing}
            </p>

            {/* Contact Card */}
            <div className="bg-card border border-muted/50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-8 sm:mb-12 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-light/5 via-transparent to-secondary-light/5" />

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 relative z-10">
                Connect With Our Global Team
              </h3>
              <p className="text-sm sm:text-lg text-muted-foreground mb-6 sm:mb-8 relative z-10">
                Contact our global concierge team to discuss your requirements.
                All communications are held in absolute confidence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10">
                {Object.entries(membership.contact).map(([key, value]) => {
                  const IconComponent =
                    key.includes("lagos") ||
                    key.includes("london") ||
                    key.includes("dubai")
                      ? Phone
                      : key.includes("global")
                      ? Mail
                      : MapPin;

                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 group"
                    >
                      <div className="p-1 sm:p-2 rounded-full bg-secondary-dark/20 group-hover:bg-secondary-dark/30 transition-colors duration-300">
                        <IconComponent className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm text-secondary-light font-medium uppercase tracking-wide">
                          {key}
                        </div>
                        <div className="text-sm sm:text-base text-white">
                          {value}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/contact">
              <Button
                variant="outline"
                className="group relative px-8 py-4 sm:px-8 sm:py-6 text-sm sm:text-lg font-medium uppercase tracking-wide border-secondary-dark text-secondary-light hover:bg-secondary-dark/10 hover:border-secondary-dark/80 transition-all duration-300 rounded-lg overflow-hidden shadow-lg hover:shadow-secondary-dark/20 transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                  Apply Now
                  <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-2 duration-300" />
                </span>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 relative bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 py-1 sm:px-6 sm:py-2 rounded-full bg-muted/50 border border-muted/50">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-dark" />
              <span className="text-xs sm:text-sm text-secondary-light font-medium">
                FAQ
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider">
              Frequently Asked
              <span className="block text-secondary-light">Questions</span>
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className={`group relative rounded-xl sm:rounded-3xl overflow-hidden transition-all duration-500 ${
                    isOpen
                      ? "bg-gold-gradient border-none"
                      : "bg-card border-muted/50"
                  } border hover:border-secondary-light/30 backdrop-blur-sm`}
                >
                  <button
                    className="flex w-full items-center justify-between text-left p-4 sm:p-8 hover:bg-muted/20 transition-all duration-300"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <h3
                      className={`text-sm sm:text-xl md:text-2xl font-bold pr-4 sm:pr-6 leading-tight transition-colors duration-300 ${
                        isOpen ? "text-black" : "text-white"
                      }`}
                    >
                      {faq.question}
                    </h3>
                    <div
                      className={`p-1 sm:p-2 rounded-full transition-all duration-500 ${
                        isOpen
                          ? "bg-white text-secondary-dark rotate-180"
                          : "bg-muted/50 text-secondary-light"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-700 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-4 sm:px-8 pb-4 sm:pb-8">
                      <div className="h-px bg-gradient-to-r from-transparent via-secondary-light/50 to-transparent mb-4 sm:mb-6" />
                      <p
                        className={`text-sm sm:text-lg leading-relaxed ${
                          isOpen ? "text-black/75" : "text-muted-foreground"
                        }`}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
