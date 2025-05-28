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
    role: "Founder",
    bio: "After years of working with high-profile individuals and executives, and as a global traveler himself, Emeka saw the same pattern repeat: people had access to luxury, but not the ease that should come with it. Sorted Concierge was designed to be a go-to fixer, lifestyle partner, and trusted extension of his clients’ lives.",
    image: "/placeholder.svg?height=600&width=600&text=Emeka",
    quote:
      "“Luxury, to me, isn’t the thing you post, it’s the peace of mind you feel when everything’s just… handled.”",
  };

  const values = [
    {
      icon: <Shield className="h-6 w-6 text-secondary" />,
      title: "PRIVACY FIRST",
      description:
        "Every Sorted client is protected by strict confidentiality and NDAs. What we do for you stays between us.",
    },
    {
      icon: <Award className="h-6 w-6 text-secondary" />,
      title: "EXCELLENCE & TRUST",
      description:
        "We don’t believe in 'good enough.' We treat every task like it matters because to you, it does.",
    },
    {
      icon: <Globe className="h-6 w-6 text-secondary" />,
      title: "GLOBAL, BUT PERSONAL",
      description:
        "We’re built to support you across borders. Whether in Lagos, London, or Dubai, our team moves with you, adapts to your style, and respects your rhythm.",
    },
  ];

  const clients = [
    {
      title: "Private Clients & HNW Families",
      description:
        "Tailored solutions for high-net-worth individuals seeking discreet, seamless luxury.",
      icon: <Users className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Entertainment Professionals & Talent Teams",
      description:
        "Effortless coordination for artists and teams with demanding schedules.",
      icon: <Star className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Luxury Brand Directors",
      description: "Exclusive access and flawless execution for brand leaders.",
      icon: <Briefcase className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Executive Assistants & Private Office Teams",
      description: "Trusted support for those managing elite lifestyles.",
      icon: <Building className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Diaspora & International Clients",
      description:
        "Smooth transitions for those visiting or relocating globally.",
      icon: <Plane className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Family Offices",
      description:
        "Comprehensive lifestyle and travel support for family offices.",
      icon: <Globe2 className="h-6 w-6 text-secondary" />,
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
        <ul className="text-sm sm:text-base font-lora text-gray-300 list-disc list-inside">
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
        <p className="text-sm sm:text-base font-lora text-gray-300">
          Strict confidentiality protocols and NDAs protect client data and
          activity. We do not disclose, promote, or reference client names,
          photos, or stories unless explicitly permitted.
        </p>
      ),
    },
    {
      title: "Vendor Network",
      content: (
        <p className="text-sm sm:text-base font-lora text-gray-300">
          We work with a curated list of vetted vendors and service providers
          across travel, hospitality, security, wellness, and logistics. All
          vendors are vetted for professionalism, reliability, and discretion.
        </p>
      ),
    },
    {
      title: "Global Access",
      content: (
        <p className="text-sm sm:text-base font-lora text-gray-300">
          Sorted currently supports clients across: London, Lagos, Dubai, Paris,
          New York, Accra, and extends to seasonal travel and custom destination
          requests.
        </p>
      ),
    },
  ];

  const toggleAccordion = (index: any) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-background border-t-secondary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex h-[70vh] items-center justify-center pt-20"
      >
        <div className="absolute inset-0">
          <Image
            src="/image18.png"
            alt="Sorted Concierge origins"
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <p className="mb-4 font-lora text-sm sm:text-base md:text-lg italic tracking-wider text-secondary">
              OUR STORY
            </p>
            <h1 className="mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold uppercase tracking-widest text-overlay">
              BORN IN LAGOS. BUILT FOR THE WORLD.
            </h1>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-lora text-overlay">
              Sorted Concierge was founded to make life easier for those who
              live fast, travel often, and demand seamless luxury experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Origins Section */}
      <section className="bg-background py-16 md:py-32" ref={originsRef}>
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:gap-24 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={
                originsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col justify-center order-2 md:order-1"
            >
              <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary">
                Our Origins
              </h2>
              <p className="mb-8 text-sm sm:text-base md:text-lg font-lora text-muted-foreground">
                Sorted started with one goal: to make life easier for people who
                live fast, travel often, and can’t afford chaos. Our founder, a
                corporate strategist and lifestyle consultant, repeatedly saw
                the same problem: clients had access to luxury but still had to
                chase details, fix mistakes, and explain things twice.
              </p>
              <p className="mb-8 text-sm sm:text-base md:text-lg font-lora text-muted-foreground">
                Sorted was born to change that. What began as a private network
                serving a few Lagos-based executives and diaspora clients has
                quickly grown into a trusted global service for HNWIs, founders,
                creatives, and luxury brands across Lagos, London, Dubai, Paris,
                and beyond.
              </p>
              <p className="mb-8 text-sm sm:text-base md:text-lg font-lora text-muted-foreground">
                We built our name by handling one challenging request at a time,
                turning complicated situations into smooth experiences. We work
                with a select group of private clients, family offices, and
                luxury brands who know that excellent service isn’t about how
                many clients you have, but how well you care for each one.
              </p>
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
                  className="w-full h-full object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder’s Profile Section */}
      <section className="bg-primary py-16 md:py-32" ref={founderRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              founderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary">
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
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
              <h3 className="mb-1 text-lg sm:text-xl md:text-2xl font-cinzel font-bold text-foreground">
                {founder.name}
              </h3>
              <p className="mb-4 text-xs sm:text-sm font-lora uppercase tracking-wider text-secondary">
                {founder.role}
              </p>
              <p className="mb-4 text-sm sm:text-base font-lora text-muted-foreground">
                {founder.bio}
              </p>
              <p className="text-sm sm:text-base font-lora italic text-muted-foreground">
                {founder.quote}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="bg-black py-16 md:py-32" ref={clientsRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              clientsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary">
              Who We Serve
            </h2>
            <p className="mb-8 text-sm sm:text-base md:text-lg font-lora text-gray-300">
              We craft extraordinary experiences for a select few who demand
              privacy, precision, and perfection.
            </p>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-lora text-gray-300 italic">
              Our circle is exclusive, and that’s by design.
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
                className="group bg-card p-6 rounded-lg border border-gray-800 hover:border-secondary elegant-shadow hover:shadow-2xl transition-all duration-300"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300">
                  {client.icon}
                </div>
                <h3 className="mb-2 text-base sm:text-lg font-cinzel font-bold tracking-wider text-foreground group-hover:text-secondary transition-colors duration-300">
                  {client.title}
                </h3>
                <p className="text-sm font-lora text-gray-300">
                  {client.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section
        className="bg-gradient-to-b from-black to-gray-900 py-16 md:py-32"
        ref={howWeWorkRef}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              howWeWorkInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary">
              How We Work
            </h2>
            <p className="mb-8 text-sm sm:text-base md:text-lg font-lora text-gray-300">
              Your lifestyle, reimagined. We deliver seamless, bespoke
              experiences tailored to your every need.
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
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-secondary/20 border border-secondary text-secondary font-cinzel font-bold text-sm mr-4">
                  {index + 1}
                </div>
                <p className="text-sm sm:text-base font-lora text-gray-300">
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
              <p className="mb-6 text-sm sm:text-base md:text-lg font-lora text-gray-300">
                We build relationships, not just plans. Let us anticipate your
                needs.
              </p>
              <Button
                asChild
                className="gold-gradient px-8 py-4 text-xs sm:text-sm font-lora uppercase tracking-widest text-black hover:opacity-90 elegant-shadow"
              >
                <Link href="/contact">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="bg-background py-16 md:py-32" ref={valuesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary">
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
                className="bg-card p-6 md:p-8 shadow-sm rounded-lg border border-gray-800 hover:border-secondary elegant-shadow"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                  {value.icon}
                </div>
                <h3 className="mb-4 text-lg sm:text-xl md:text-2xl font-cinzel font-bold tracking-wider text-foreground">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base font-lora text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Policies & Approach Section */}
      <section className="bg-black py-16 md:py-32" ref={policiesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              policiesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-secondary flex items-center justify-center">
              <Globe className="h-8 w-8 mr-2 text-secondary" />
              Our Policies & Approach
            </h2>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-lora text-gray-300">
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
                  className="w-full flex justify-between items-center bg-card p-4 rounded-lg border border-gray-800 hover:border-secondary elegant-shadow focus:outline-none focus:ring-2 focus:ring-secondary"
                  aria-expanded={openAccordion === index}
                  aria-controls={`policy-${index}`}
                >
                  <h3 className="text-base sm:text-lg font-cinzel font-bold tracking-wider text-foreground">
                    {policy.title}
                  </h3>
                  {openAccordion === index ? (
                    <ChevronUp className="h-5 w-5 text-secondary" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-secondary" />
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
                  <div className="p-4 bg-gray-900 rounded-b-lg">
                    {policy.content}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-32 bg-primary" ref={ctaRef}>
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-primary-foreground">
              Join the Sorted Circle
            </h2>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-lora text-primary-foreground/80">
              Experience a lifestyle where every detail is handled with
              discretion and excellence. Apply for membership or contact us to
              learn more.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="border-secondary px-8 py-6 text-xs sm:text-sm font-lora uppercase tracking-widest bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground elegant-shadow"
              >
                <Link href="/booking">Apply for Membership</Link>
              </Button>
              <Button
                asChild
                className="bg-secondary px-8 py-6 text-xs sm:text-sm font-lora uppercase tracking-widest text-secondary-foreground hover:bg-secondary/90 elegant-shadow"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
