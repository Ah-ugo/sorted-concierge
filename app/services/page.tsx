"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2 } from "lucide-react";

interface ServiceFeature {
  name: string;
  description: string;
  image: string;
  duration: string;
  isAvailable: boolean;
  features: string[];
  requirements: string[];
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
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  category_type: "tiered" | "contact_only";
  image: string;
  is_active: boolean;
  tiers: ServiceTier[];
  services: ServiceFeature[];
}

export default function Services() {
  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ threshold: 0.1 });

  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://naija-concierge-api.onrender.com/service-categories?skip=0&limit=100",
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch service categories");
        }

        const data = await response.json();
        setServiceCategories(
          data.filter((category: ServiceCategory) => category.is_active)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceCategories();
  }, []);

  const faqs = [
    {
      question:
        "What sets Sorted Concierge apart from other luxury concierge services?",
      answer:
        "We're not a concierge directory, a call center, or a glorified booking agent. Sorted is a high-trust lifestyle management partner. That means we don't just respond to requests, we anticipate needs, manage logistics end-to-end, and operate like a personal operations team behind the scenes.\n\nWhat sets us apart is our depth, discretion, and executional control:\n• You don't speak to ten different agents. You talk to one person who knows your style, preferences, and schedule.\n• We don't rely on Google; we have a vetted network of global fixers, venues, vendors, and private partners.\n• We don't just \"book things\"; we manage the entire experience before, during, and after.\n• We're intentionally boutique. We cap our client list to maintain excellence and protect our bandwidth.",
    },
    {
      question:
        "What types of clients have you provided VIP concierge services to?",
      answer:
        "We serve a very specific client: those who value their time, privacy, and peace of mind. That includes:\n\n• Diaspora Nigerians and global travelers visiting Nigeria or West Africa for major events (Detty December, weddings, family reunions)\n• High-net-worth individuals and founders who live and work across multiple cities\n• Celebrities, music executives, creative directors, and influencers with packed calendars and complex movement\n• Luxury brand reps and private offices needing on-ground support for talent, executives, or VIP clients\n• Family offices requiring white-glove lifestyle, travel, or investment coordination\n\nSome of our clients have assistants or chiefs of staff, while others don't. Either way, we work quietly in the background to make everything smoother.",
    },
    {
      question:
        "What happens if I run into any issues during my concierge service period?",
      answer:
        "If anything doesn't go as expected, we handle it immediately. That's the Sorted promise.\n\nYou'll have a dedicated lifestyle manager or concierge assigned to you, reachable 24/7 depending on your membership tier. We don't wait for problems to escalate; we resolve them fast, with professionalism and discretion.\n\nWhether it's a missed flight, a vendor issue, a last-minute change, or a personal emergency, we activate our network and get it fixed often before you've had to ask twice.",
    },
    {
      question:
        "How far in advance should I contact Sorted to kick off the booking process?",
      answer:
        "We recommend getting in touch as soon as possible, especially for high-demand periods (e.g. Detty December, Fashion Week, holiday travel, etc.).\n\nThat said, we're built for speed, and many of our clients come to us when timelines are tight.\n\nHere's a general guide:\n• Simple lifestyle tasks: 24–48 hours ahead\n• Luxury event planning: Ideally 3–8 weeks ahead\n• Destination travel or group coordination: 2–6 weeks ahead\n• Residency, legacy planning, investment services: Varies by scope, but the sooner the better\n\nDon't worry if you're late to the table, we're experts at moving fast without sacrificing quality.",
    },
    {
      question:
        "Will you work with me if I need a private concierge on short notice?",
      answer:
        "Yes, depending on our availability and the scope of your request.\n\nWe accept last-minute or urgent projects on a case-by-case basis, especially for clients referred through our network.\n\nIf we have the capacity and it aligns with our standard of care, we'll make it happen. If not, we'll let you know immediately; we don't overpromise, ever.\n\nEither way, if you're reaching out last-minute, give us the full picture upfront. The more context we have, the faster we can deliver.",
    },
    {
      question:
        "What does the process of working with Sorted Concierge typically look like?",
      answer:
        "Here's how it works, simple, secure, and high-touch:\n\n**Discovery & Intake:**\nWe'll schedule a short consultation or intake call to understand your needs, preferences, and scope. This is where we determine whether a membership or bespoke engagement is the best fit.\n\n**Proposal & Onboarding:**\nOnce we have clarity, we send over a customized proposal, engagement terms, and (where applicable) an NDA. Once signed, you'll be assigned a dedicated lifestyle manager or concierge.\n\n**Execution & Access:**\nFrom there, we handle requests, manage vendors, coordinate timelines, and give real-time updates without blowing up your phone. We stay a step ahead and in your corner.\n\n**Ongoing Support:**\nIf you're on a membership, we operate continuously, handling your lifestyle, events, travel, and long-term plans. If you're on a one-time engagement, we close with a debrief, deliverables, and follow-up support if needed.",
    },
    {
      question: "Do you work with teams (assistants, managers, reps)?",
      answer:
        "Absolutely.\n\nWe regularly coordinate with personal assistants, talent managers, executive assistants, PR teams, brand reps, and family office staff.\n\nWhether supporting you directly or operating as your behind-the-scenes execution team, we're flexible, fast, and discreet. Sorted is often the secret sauce behind someone else's flawless delivery.",
    },
    {
      question: "How do I become a Sorted member?",
      answer:
        "You can:\n• Apply through our private intake form\n• Get referred by an existing client\n• Engage us on a bespoke project first, and convert to membership after experiencing the Sorted difference\n\nMembership isn't automatic. We only onboard clients we know we can serve at the highest level, so Sorted stays elite, responsive, and deeply trusted.",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
          <p className="text-muted-foreground font-crimson_pro">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-crimson_pro mb-4">
            Error loading services: {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gold-gradient text-black hover:bg-secondary/80"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center"
        ref={heroRef}
      >
        <div className="absolute inset-0">
          <Image
            src="/image26.jpg"
            alt="Luxury concierge services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-4xl"
          >
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold uppercase tracking-widest text-white">
              Our Services
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-16 md:py-24" ref={servicesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-6">
              Our Service Categories
            </h2>
            <p className="text-lg font-crimson_pro text-muted-foreground max-w-3xl mx-auto">
              Sorted Concierge offers distinct service paths, built around how
              our clients live, travel, and plan for the future.
            </p>
          </motion.div>

          <div className="grid gap-12 lg:gap-16">
            {serviceCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                animate={
                  servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                className="group"
              >
                <Card className="bg-card border-0 elegant-shadow overflow-hidden">
                  <CardContent className="p-0">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Content */}
                      <div className="p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                        <h3 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mb-4">
                          {category.name}
                        </h3>

                        <p className="text-muted-foreground font-crimson_pro mb-8 leading-relaxed">
                          {category.description}
                        </p>

                        {/* Tiers for tiered categories */}
                        {category.category_type === "tiered" &&
                          category.tiers.length > 0 && (
                            <div className="space-y-6 mb-8">
                              <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider">
                                Service Tiers:
                              </h4>
                              {category.tiers.map((tier) => (
                                <div
                                  key={tier.id}
                                  className="border-l-2 border-secondary/20 pl-6"
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <h5 className="font-cinzel font-bold text-white">
                                      {tier.name}
                                    </h5>
                                    <span className="text-secondary font-crimson_pro font-bold">
                                      {formatPrice(tier.price)}
                                    </span>
                                    {tier.is_popular && (
                                      <span className="bg-gold-gradient text-black px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                        Popular
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm font-crimson_pro text-muted-foreground mb-3">
                                    {tier.description}
                                  </p>
                                  <ul className="text-sm font-crimson_pro text-muted-foreground space-y-1">
                                    {tier.features.map(
                                      (feature, featureIndex) => (
                                        <li
                                          key={featureIndex}
                                          className="flex items-start"
                                        >
                                          <span className="text-secondary mr-2">
                                            •
                                          </span>
                                          {feature}
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                        {/* Services for contact-only categories */}
                        {category.category_type === "contact_only" &&
                          category.services.length > 0 && (
                            <div className="space-y-6 mb-8">
                              <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider">
                                Available Services:
                              </h4>
                              {category.services.slice(0, 3).map((service) => (
                                <div
                                  key={service.name}
                                  className="border-l-2 border-secondary/20 pl-6"
                                >
                                  <h5 className="font-cinzel font-bold text-white mb-2">
                                    {service.name}
                                  </h5>
                                  <p className="text-sm font-crimson_pro text-muted-foreground mb-2">
                                    {service.description}
                                  </p>
                                  {service.duration && (
                                    <p className="text-xs font-crimson_pro text-muted-foreground/80">
                                      Duration: {service.duration}
                                    </p>
                                  )}
                                </div>
                              ))}
                              {category.services.length > 3 && (
                                <p className="text-sm font-crimson_pro text-muted-foreground italic pl-6">
                                  + {category.services.length - 3} more services
                                  available
                                </p>
                              )}
                            </div>
                          )}

                        <Button
                          asChild
                          className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-3 font-crimson_pro uppercase tracking-wider w-fit group-hover:shadow-lg transition-all duration-300"
                        >
                          <Link
                            href={
                              category.category_type === "tiered"
                                ? `/services/${category.id}`
                                : `/services/${category.id}`
                            }
                            className="flex items-center"
                          >
                            {category.category_type === "tiered"
                              ? "View Tiers"
                              : "Learn More"}
                            <ChevronRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>

                      {/* Image */}
                      <div className="relative aspect-[4/3] lg:aspect-auto order-1 lg:order-2">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent lg:from-transparent lg:to-black/20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24" ref={faqRef}>
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-6">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-secondary/20 rounded-lg bg-card/50 px-6"
                >
                  <AccordionTrigger className="text-left font-cinzel font-bold text-white hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-crimson_pro text-muted-foreground leading-relaxed pb-6 whitespace-pre-line">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary/10 to-secondary/5">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-6">
              Step Into the Sorted Experience
            </h2>
            <p className="text-lg font-crimson_pro text-muted-foreground mb-8">
              Our services are intentionally exclusive, crafted for those who
              value privacy, precision, and peace of mind.
            </p>
            <Button
              asChild
              className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-4 font-crimson_pro uppercase tracking-wider"
            >
              <Link href="/contact">Get Sorted</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
