"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
import { motion, useScroll, useTransform } from "framer-motion";

const memberships = [
  {
    id: "sorted-lifestyle",
    name: "Sorted Lifestyle",
    subtitle: "Luxury, from touchdown to takeoff.",
    description:
      "Sorted Lifestyle is built for high-performers, power travelers, and seasoned executives who need everything done, but don't have time to chase details. From the moment you land to the second you take off, our team handles the logistics, so you can focus on living well.",
    fullDescription:
      "We ensure your arrival commands attention for all the right reasons. From Lagos to London, Dubai to New York, our global network transforms travel from necessity into seamless luxury.",
    icon: Crown,
    gradient: "from-amber-400/20 via-yellow-500/20 to-amber-600/20",
    detailedServices: [
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
        description: "When commercial aviation becomes inconvenient.",
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
    ],
    contact: {
      lagos: "+234 [Number]",
      london: "+44 [Number]",
      dubai: "+971 [Number]",
      global: "[Email Address]",
    },
    closing: "Because access is everything, and you're already Sorted.",
  },
];

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

  const membership = memberships[0];

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

  const FloatingOrbs = () => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-amber-400/10 to-yellow-500/10 blur-xl animate-pulse"
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
        backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 191, 36, 0.1) 0%, transparent 50%)`,
        transform: `translateY(${scrollY * 0.1}px)`,
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <FloatingOrbs />
      <ParallaxBackground />

      {/* Animated Grid Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            transform: `translate(${mousePosition.x * 0.01}px, ${
              mousePosition.y * 0.01
            }px)`,
          }}
        />
      </div>

      {/* Hero Section with Background Image */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-0"
        style={{
          backgroundImage: "url('/image6.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark Overlay */}
        {/* <div className="absolute inset-0 bg-black/60" /> */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
          <div className="absolute top-40 right-32 w-1 h-1 bg-yellow-500 rounded-full animate-pulse" />
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-amber-300 rounded-full animate-bounce" />
          <div
            className="absolute top-1/3 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-ping"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Gradient Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-black/90" /> */}

        <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center">
          {/* Back Button with Hover Effect */}
          <div className="mb-6 sm:mb-8 flex justify-center sm:justify-start w-full px-4 sm:px-0">
            <Link href="/memberships" passHref>
              <Button
                variant="ghost"
                className="group text-sm sm:text-base text-gray-400 hover:text-amber-400 hover:bg-gray-800/50 transition-all duration-500 border border-gray-700/50 hover:border-amber-400/50 rounded-xl px-4 py-2 sm:px-6 sm:py-3 relative flex items-center"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform group-hover:-translate-x-1 duration-300" />
                Back to Memberships
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              </Button>
            </Link>
          </div>

          {/* Membership Badge */}
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-500/20 border border-amber-400/30 backdrop-blur-sm">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            <span className="text-xs sm:text-sm text-amber-400 font-medium tracking-wide">
              MEMBERSHIP TIER
            </span>
          </div>

          {/* Main Title with Animated Glow */}
          <div className="relative mb-4 sm:mb-6">
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent relative">
              {membership.name}
            </h1>
            <div className="absolute inset-0 text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-wider text-amber-400/20 blur-2xl">
              {membership.name}
            </div>
          </div>

          {/* Subtitle with Typewriter Effect */}
          <p className="mb-4 sm:mb-6 text-amber-400 text-base sm:text-xl md:text-2xl italic relative">
            {membership.subtitle}
            <Sparkles className="inline-block w-4 h-4 sm:w-6 sm:h-6 ml-2 animate-pulse" />
          </p>

          {/* Description with Enhanced Typography */}
          <p className="mb-6 sm:mb-10 text-sm sm:text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
            {membership.description}
          </p>

          {/* CTA Button with Advanced Hover Effects */}
          <Button className="group relative px-8 py-4 sm:px-12 sm:py-6 text-sm sm:text-lg font-medium uppercase tracking-widest text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-yellow-500 hover:to-amber-400 transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105">
            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
              Join This Membership
              <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-2 duration-300" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-500 blur opacity-30 group-hover:opacity-60 transition-opacity duration-500" />
          </Button>
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
            className="w-6 h-10 border-2 border-gray-400/70 rounded-full flex justify-center backdrop-blur-sm"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-secondary rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Overview Section with Parallax Cards */}
      <section className="py-16 sm:py-16 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 py-1 sm:px-6 sm:py-2 rounded-full bg-gray-800/50 border border-gray-700/50">
              <Diamond className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span className="text-xs sm:text-sm text-amber-400 font-medium">
                OVERVIEW
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider mb-6 sm:mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Experience Excellence
            </h2>
            <p className="text-sm sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              {membership.fullDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section with Interactive Cards */}
      <section className="py-16 sm:py-16 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 py-1 sm:px-6 sm:py-2 rounded-full bg-gray-800/50 border border-gray-700/50">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span className="text-xs sm:text-sm text-amber-400 font-medium">
                SERVICES
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider mb-4">
              What We <span className="text-amber-400">Handle</span>
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
                      ? "bg-gradient-to-br from-gray-800 to-gray-900"
                      : "bg-gray-800/30"
                  } border border-gray-700/50 hover:border-amber-400/30 backdrop-blur-sm`}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                  <button
                    className="w-full p-4 sm:p-8 text-left transition-all duration-300 hover:bg-gray-700/20"
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
                              ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-black"
                              : "bg-gray-700/50 text-amber-400 group-hover:bg-amber-400/20"
                          }`}
                        >
                          <IconComponent className="w-5 h-5 sm:w-8 sm:h-8" />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4 group-hover:text-amber-100 transition-colors duration-300">
                            {service.title}
                          </h3>
                          <p className="text-amber-400 text-sm sm:text-lg mb-2 sm:mb-4 leading-relaxed">
                            {service.description}
                          </p>
                          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                            {service.details}
                          </p>
                        </div>
                      </div>

                      {/* Animated Chevron */}
                      <div
                        className={`ml-2 sm:ml-6 p-1 sm:p-2 rounded-full transition-all duration-500 ${
                          isExpanded
                            ? "bg-amber-400 text-black rotate-180"
                            : "bg-gray-700/50 text-amber-400"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
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
                      <div className="h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-4 sm:mb-6" />
                      <div className="grid gap-2 sm:gap-4">
                        {service.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-start gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg sm:rounded-xl bg-gray-700/20 hover:bg-gray-700/30 transition-all duration-300 group/feature"
                            style={{
                              animationDelay: `${featureIndex * 100}ms`,
                            }}
                          >
                            <div className="p-0.5 sm:p-1 rounded-full bg-amber-400/20 group-hover/feature:bg-amber-400/30 transition-colors duration-300">
                              <CheckCircle className="w-3 h-3 sm:w-5 sm:h-5 text-amber-400" />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-200 leading-relaxed group-hover/feature:text-white transition-colors duration-300">
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
      <section className="py-16 sm:py-16 relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 py-1 sm:px-6 sm:py-2 rounded-full bg-gray-800/50 border border-gray-700/50">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span className="text-xs sm:text-sm text-amber-400 font-medium">
                CONNECT
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider mb-6 sm:mb-8">
              Ready to Experience
              <span className="block text-amber-400">{membership.name}?</span>
            </h2>

            <p className="text-sm sm:text-xl text-gray-300 mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0">
              {membership.closing}
            </p>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-8 sm:mb-12 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 via-transparent to-amber-400/5" />

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 relative z-10">
                Connect With Our Global Team
              </h3>
              <p className="text-sm sm:text-lg text-gray-300 mb-6 sm:mb-8 relative z-10">
                Contact our global concierge team to discuss your requirements.
                All communications are held in absolute confidence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10">
                {Object.entries(membership.contact).map(([key, value]) => {
                  const IconComponent =
                    key.includes("phone") ||
                    key.includes("lagos") ||
                    key.includes("london") ||
                    key.includes("dubai")
                      ? Phone
                      : key.includes("global") || key.includes("email")
                      ? Mail
                      : MapPin;

                  return (
                    <div
                      key={key}
                      className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-700/20 hover:bg-gray-700/40 transition-all duration-300 group"
                    >
                      <div className="p-1 sm:p-2 rounded-full bg-amber-400/20 group-hover:bg-amber-400/30 transition-colors duration-300">
                        <IconComponent className="w-3 h-3 sm:w-5 sm:h-5 text-amber-400" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm text-amber-400 font-medium uppercase tracking-wide">
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
            <Button className="group relative px-8 py-4 sm:px-12 sm:py-6 text-sm sm:text-lg font-medium uppercase tracking-widest text-black bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-yellow-500 hover:to-amber-400 transition-all duration-500 rounded-2xl overflow-hidden shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105">
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                Apply Now
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-2 duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-16 relative bg-gray-800/20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-20">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 px-4 py-1 sm:px-6 sm:py-2 rounded-full bg-gray-800/50 border border-gray-700/50">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              <span className="text-xs sm:text-sm text-amber-400 font-medium">
                FAQ
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold uppercase tracking-wider">
              Frequently Asked
              <span className="block text-amber-400">Questions</span>
            </h2>
          </div>

          <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className={`group rounded-xl sm:rounded-3xl overflow-hidden transition-all duration-500 ${
                    isOpen
                      ? "bg-gradient-to-br from-gray-800 to-gray-900"
                      : "bg-gray-800/30"
                  } border border-gray-700/50 hover:border-amber-400/30 backdrop-blur-sm`}
                >
                  <button
                    className="flex w-full items-center justify-between text-left p-4 sm:p-8 hover:bg-gray-700/20 transition-all duration-300"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <h3 className="text-sm sm:text-xl md:text-2xl font-bold text-white pr-4 sm:pr-6 leading-tight group-hover:text-amber-100 transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <div
                      className={`p-1 sm:p-2 rounded-full transition-all duration-500 ${
                        isOpen
                          ? "bg-amber-400 text-black rotate-180"
                          : "bg-gray-700/50 text-amber-400"
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
                      <div className="h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-4 sm:mb-6" />
                      <p className="text-sm sm:text-lg text-gray-300 leading-relaxed">
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
