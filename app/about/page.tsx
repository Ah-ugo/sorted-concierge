"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Award,
  Globe,
  ChevronDown,
  ChevronUp,
  Users,
  Star,
  Briefcase,
  Plane,
  Building,
  Globe2,
} from "lucide-react";

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(null);

  const [heroRef, heroInView] = useInView({
    threshold: 0.03,
    triggerOnce: true,
  });
  const [originsRef, originsInView] = useInView({
    threshold: 0.03,
    triggerOnce: true,
  });
  const [founderRef, founderInView] = useInView({
    threshold: 0.03,
    triggerOnce: true,
  });
  const [clientsRef, clientsInView] = useInView({
    threshold: 0.03,
    triggerOnce: true,
  });
  const [howWeWorkRef, howWeWorkInView] = useInView({
    threshold: 0.03,
    triggerOnce: true,
  });
  const [valuesRef, valuesInView] = useInView({
    threshold: 0.03,
    triggerOnce: true,
  });
  const [policiesRef, policiesInView] = useInView({
    threshold: 0.03,
    triggerOnce: true,
  });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.03, triggerOnce: true });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const founder = {
    id: 1,
    name: "Emeka Idam",
    role: "Founder of Sorted Concierge",
    bio: [
      "Some people build businesses. He built a solution.",
      "After years of working with high-profile individuals and executives, and as a global traveler himself, Emeka saw a recurring issue.",
      "Clients had access to luxury, but not the ease that should come with it.",
      "Reservations were made, drivers showed up, and tickets were booked, yet things still fell through the cracks.",
      "Clients had to follow up, repeat themselves, and manage the very lifestyle they paid others to handle.",
      "So, he created Sorted Concierge to be a go-to fixer and lifestyle partner.",
      "Today, Sorted supports a private roster of high-net-worth individuals, diaspora clients, family offices, and global creatives across key cities worldwide.",
      "Under his leadership, Sorted is known for its discretion, taste, and ability to make complex experiences effortless.",
    ],
    image: "/placeholder.svg?height=600&width=600&text=Emeka",
    quote: [
      "“Luxury isn’t the thing you post.",
      "It’s the peace of mind you feel when everything is just… handled.”",
      "— Emeka Idam",
    ],
  };

  const values = [
    {
      icon: <Shield className="h-6 w-6 text-secondary-light" />, // Updated to secondary.light (#FAC364)
      title: "Privacy First",
      description:
        "Every Sorted client is protected by strict confidentiality and NDAs. What we do for you stays between us.",
    },
    {
      icon: <Award className="h-6 w-6 text-secondary-light" />, // Updated to secondary.light (#FAC364)
      title: "Excellence & Trust",
      description:
        "We don’t believe in 'good enough.' We treat every task like it matters because to you, it does.",
    },
    {
      icon: <Globe className="h-6 w-6 text-secondary-light" />, // Updated to secondary.light (#FAC364)
      title: "Global, But Personal",
      description:
        "We’re built to support you across borders. Whether in Lagos, London, or Dubai, our team moves with you, adapts to your style, and respects your rhythm.",
    },
  ];

  const clients = [
    {
      title: "Private Clients & HNW Families",
      description:
        "Tailored solutions for high-net-worth individuals seeking discreet, seamless luxury.",
      icon: <Users className="h-6 w-6 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
    {
      title: "Entertainment Professionals & Talent Teams",
      description:
        "Effortless coordination for artists and teams with demanding schedules.",
      icon: <Star className="h-6 w-6 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
    {
      title: "Luxury Brand Directors",
      description: "Exclusive access and flawless execution for brand leaders.",
      icon: <Briefcase className="h-6 w-6 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
    {
      title: "Executive Assistants, Chiefs of Staff, and Private Office Teams",
      description: "Trusted support for those managing elite lifestyles.",
      icon: <Building className="h-6 w-6 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
    {
      title: "Diaspora and International Clients",
      description:
        "Smooth transitions for those visiting or relocating globally.",
      icon: <Plane className="h-6 w-6 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
    {
      title: "Family Offices",
      description:
        "Comprehensive lifestyle and travel support for family offices.",
      icon: <Globe2 className="h-6 w-6 text-secondary-light" />, // Updated to secondary.light (#FAC364)
    },
  ];

  const howWeWorkSteps = [
    "A dedicated lifestyle manager who knows your preferences and handles your requests",
    "Fast, responsive communication with full discretion",
    "Quiet, efficient execution, no micromanaging required",
    "A global support network across key cities, vendors, and vetted partners",
    "No cut corners, ever. If we promise it, we deliver it.",
  ];

  const policies = [
    {
      title: "How We Work With Clients",
      content: (
        <ul className="text-sm sm:text-base font-archivo text-muted-foreground list-disc list-inside">
          {" "}
          {/* Updated to muted.foreground */}
          <li>
            Sorted is a private, membership-based service. To maintain the
            highest level of care, we work with a limited number of clients.
          </li>
          <li>All new clients go through an intake and onboarding process.</li>
          <li>
            Services are available by membership, bespoke packages, or
            referral-only projects.
          </li>
          <li>
            Urgent or one-time requests may be accepted based on bandwidth and
            alignment.
          </li>
        </ul>
      ),
    },
    {
      title: "Confidentiality",
      content: (
        <p className="text-sm sm:text-base font-archivo text-muted-foreground">
          {" "}
          {/* Updated to muted.foreground */}
          Strict confidentiality protocols and NDAs protect client data and
          activity. We do not disclose, promote, or reference client names,
          photos, or stories unless explicitly permitted.
        </p>
      ),
    },
    {
      title: "Vendor Network",
      content: (
        <p className="text-sm sm:text-base font-archivo text-muted-foreground">
          {" "}
          {/* Updated to muted.foreground */}
          We work with a curated list of vetted vendors and service providers
          across travel, hospitality, security, wellness, and logistics. All
          vendors are vetted for professionalism, reliability, and discretion.
        </p>
      ),
    },
    {
      title: "Global Access",
      content: (
        <p className="text-sm sm:text-base font-archivo text-muted-foreground">
          {" "}
          {/* Updated to muted.foreground */}
          Sorted currently supports clients across: 🇬🇧 London | 🇳🇬 Lagos | 🇦🇪
          Dubai | 🇫🇷 Paris | 🇺🇸 New York | 🇬🇭 Accra etc
          <br />
          And extends to seasonal travel and custom destination requests.
        </p>
      ),
    },
  ];

  const toggleAccordion = (index: any) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-secondary-light"></div>{" "}
        {/* Updated to muted and secondary.light */}
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex h-[70vh] items-center justify-center pt-20 bg-black"
      >
        <div className="absolute inset-0">
          <Image
            src="/image18.png"
            alt="Sorted Concierge global luxury"
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
          {/* Updated to muted */}
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <h1 className="mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold uppercase tracking-widest text-white">
              Born in Lagos. Built for the World.
            </h1>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              {" "}
              {/* Updated to muted.foreground */}
              Sorted Concierge was founded to make life easier for those who
              live fast, travel often, and can’t afford chaos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Origins Section */}
      <section className="bg-black py-12 md:py-16" ref={originsRef}>
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:gap-12 md:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={
                originsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col justify-center order-2 md:order-1"
            >
              <h2 className="mb-6 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary-light">
                {" "}
                {/* Updated to secondary.light */}
                Our Origins
              </h2>
              <div className="space-y-4">
                <p className="text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
                  {" "}
                  {/* Updated to muted.foreground */}
                  Sorted started with one goal: to make life easier for people
                  who live fast, travel often, and can’t afford chaos.
                </p>
                <p className="text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
                  {" "}
                  {/* Updated to muted.foreground */}
                  Our founder, a corporate strategist and lifestyle consultant,
                  saw clients facing the same issue: access to luxury without
                  ease.
                </p>
                <p className="text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
                  {" "}
                  {/* Updated to muted.foreground */}
                  What began in Lagos serving executives and diaspora clients
                  has grown into a trusted global service across cities like
                  London, Dubai, and Paris.
                </p>
                <p className="text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
                  {" "}
                  {/* Updated to muted.foreground */}
                  We built our name by turning complicated situations into
                  seamless experiences.
                </p>
                <p className="text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
                  {" "}
                  {/* Updated to muted.foreground */}
                  We stay small to serve a select group of clients exceptionally
                  well, prioritizing quality over quantity.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={
                originsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="order-1 md:order-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg elegant-shadow">
                <Image
                  src="https://thewheatbakerlagos.com/oatchace/2023/08/dl.beatsnoop.com-3000-qXWf3j7NcD-2048x1366.jpg"
                  alt="Lagos cityscape reflecting Sorted's origins"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder’s Profile Section */}
      <section className="bg-black py-12 md:py-16" ref={founderRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              founderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary-light">
              {" "}
              {/* Updated to secondary.light */}
              Founder’s Profile
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={
                founderInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg elegant-shadow">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={
                founderInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col justify-center"
            >
              <h3 className="mb-1 text-lg sm:text-xl md:text-2xl font-cinzel font-bold text-white">
                {founder.name}
              </h3>
              <p className="mb-4 text-xs sm:text-sm font-archivo uppercase tracking-wider text-secondary-light">
                {" "}
                {/* Updated to secondary.light */}
                {founder.role}
              </p>
              <div className="space-y-3 mb-4">
                {founder.bio.map((sentence, index) => (
                  <p
                    key={index}
                    className="text-sm sm:text-base font-archivo text-muted-foreground" // Updated to muted.foreground
                  >
                    {sentence}
                  </p>
                ))}
              </div>
              <div className="space-y-2">
                {founder.quote.map((line, index) => (
                  <p
                    key={index}
                    className="text-sm sm:text-base font-archivo italic text-muted-foreground" // Updated to muted.foreground
                  >
                    {line}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="bg-black py-12 md:py-16" ref={clientsRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              clientsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary-light">
              {" "}
              {/* Updated to secondary.light */}
              Who We Serve
            </h2>
            <p className="mb-8 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              {" "}
              {/* Updated to muted.foreground */}
              We work with a small, highly selective group of clients who value
              their privacy, their time, and doing things right the first time.
            </p>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground italic">
              {" "}
              {/* Updated to muted.foreground */}
              We’re not for everyone, and that’s intentional.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map((client, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  clientsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="group bg-card p-6 rounded-lg border border-muted hover:border-secondary elegant-shadow hover:shadow-2xl transition-all duration-300" // Updated to card and muted
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-light/10 group-hover:bg-secondary-light/20 transition-colors duration-300">
                  {" "}
                  {/* Updated to secondary.light */}
                  {client.icon}
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-cinzel font-bold tracking-wider text-white group-hover:text-secondary-light transition-colors duration-300">
                  {" "}
                  {/* Updated to secondary.light */}
                  {client.title}
                </h3>
                <p className="text-sm font-archivo text-muted-foreground">
                  {" "}
                  {/* Updated to muted.foreground */}
                  {client.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      {/* <section className="bg-black py-12 md:py-16" ref={howWeWorkRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              howWeWorkInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary-light">
              
              How We Work
            </h2>
            <p className="mb-8 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              
              Every Sorted engagement is personal. There are no cookie-cutter
              packages. No generic templates.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            {howWeWorkSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={
                  howWeWorkInView
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: -20 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                className="flex items-start mb-6"
              >
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-secondary-light/20 border border-secondary-light text-secondary-light font-cinzel font-bold text-sm mr-4">
                  
                  {index + 1}
                </div>
                <p className="text-sm sm:text-base font-archivo text-muted-foreground">
                  
                  {step}
                </p>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={
                howWeWorkInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 text-center"
            >
              <p className="mb-6 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
                
                We focus on building relationships, not just service plans. The
                longer we work with you, the better we anticipate your needs.
              </p>
              <Button
                asChild
                className="px-8 py-4 border-secondary border text-xs sm:text-sm font-archivo uppercase tracking-widest text-white hover:bg-secondary hover:text-black elegant-shadow" // Updated hover state
              >
                <Link href="/contact">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Our Values Section */}
      <section className="bg-black py-12 md:py-16" ref={valuesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary-light">
              {" "}
              {/* Updated to secondary.light */}
              Our Values
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="bg-card p-6 md:p-8 shadow-sm rounded-lg border border-muted hover:border-secondary elegant-shadow" // Updated to card and muted
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-light/10">
                  {" "}
                  {/* Updated to secondary.light */}
                  {value.icon}
                </div>
                <h3 className="mb-4 text-lg sm:text-xl md:text-2xl font-cinzel font-bold tracking-wider text-white">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base font-archivo text-muted-foreground">
                  {" "}
                  {/* Updated to muted.foreground */}
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Policies & Approach Section */}
      <section className="bg-black py-12 md:py-16" ref={policiesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              policiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary-light flex items-center justify-center">
              {" "}
              {/* Updated to secondary.light */}
              <Globe className="h-8 w-8 mr-2 text-secondary-light" />{" "}
              {/* Updated to secondary.light */}
              Our Policies & Approach
            </h2>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              {" "}
              {/* Updated to muted.foreground */}
              Discover the principles that guide our global, discreet, and
              exceptional service.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {policies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  policiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="mb-4"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className={`w-full flex justify-between items-center bg-muted/50 p-4 rounded-lg border ${
                    openAccordion === index
                      ? "border-secondary"
                      : "border-muted"
                  } hover:border-secondary shadow-none focus:outline-none focus:ring-2 focus:ring-secondary`} // Updated to muted
                  aria-expanded={openAccordion === index}
                  aria-controls={`policy-${index}`}
                >
                  <h3 className="text-base sm:text-lg font-cinzel font-bold tracking-wider text-white">
                    {policy.title}
                  </h3>
                  {openAccordion === index ? (
                    <ChevronUp className="h-5 w-5 text-white" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-white" />
                  )}
                </button>
                <motion.div
                  id={`policy-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    openAccordion === index
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-secondary-light/20 rounded-b-lg">
                    {" "}
                    {/* Updated to secondary.light */}
                    {policy.content}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="relative py-12 md:py-16 bg-black" ref={ctaRef}>
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Join the Sorted Circle
            </h2>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-archivo text-muted-foreground">
              
              Experience a lifestyle where every detail is handled with
              discretion and excellence. Apply for membership or contact us to
              learn more.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="border-secondary-light px-8 py-6 text-xs sm:text-sm font-archivo uppercase tracking-widest bg-black text-white hover:bg-secondary hover:text-black elegant-shadow" // Updated to secondary.light
              >
                <Link href="/membership-booking">Apply for Membership</Link>
              </Button>
              <Button
                asChild
                className="bg-gold-gradient border px-8 py-6 text-xs sm:text-sm font-archivo uppercase tracking-widest text-black border-secondary-light hover:bg-none hover:border-secondary-light hover:text-white elegant-shadow" // Updated to gold-gradient and secondary.light
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section> */}
    </>
  );
}
