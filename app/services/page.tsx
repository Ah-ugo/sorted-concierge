"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

export default function Services() {
  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ threshold: 0.1 });

  const serviceTiers = [
    {
      id: "sorted-lifestyle",
      name: "Sorted Lifestyle",
      tagline:
        "This is for movers, founders, creatives, families, and global citizens who want to live well without the burden of managing it all.",
      description:
        "We design, orchestrate, and deliver experiences that feel tailored, intentional, and entirely stress-free.",
      image:
        "https://res.cloudinary.com/dejeplzpv/image/upload/v1749092226/naija_concierge/packages/dc8eab17-ab3f-48ec-96a9-8447c2bb504d.jpg",
      services: [
        {
          title: "Luxury Event Curation",
          description:
            "From intimate proposals in hidden corners of the world to milestone celebrations that span continents, your vision becomes our blueprint. Whether it's your Cape Town celebration or a Parisian anniversary, we handle the impossible logistics while you enjoy the flawless execution.",
        },
        {
          title: "Destination Planning",
          description:
            "We don't book trips, we build entire journeys. Full itinerary design. Guest movement across time zones. Venues that don't show up in Google searches. Every touchpoint aligns with your style, pace, and privacy. Think of us as your stage manager, but for the world.",
        },
        {
          title: "Group Travel & Experiences",
          description:
            "Multi-day corporate retreats, family milestone trips, friends' getaway weekends.",
          quote:
            "You share the vision. We turn it into a memory you'll never forget, with none of the stress that usually comes with it.",
        },
      ],
    },
    {
      id: "sorted-heritage",
      name: "Sorted Heritage",
      tagline: "Securing Your Legacy",
      description: "",
      image:
        "https://res.cloudinary.com/dejeplzpv/image/upload/v1749092615/naija_concierge/packages/2fef31a1-0dd1-4ae3-9fc8-6596fa22d1ed.jpg",
      services: [
        {
          title: "Legacy & Financial Structuring",
          description:
            "Through our trusted partners, we coordinate: USD-denominated life insurance planning, Cross-border estate planning & trust structures, Generational wealth protection, Inter-family financial coordination",
        },
        {
          title: "Global Mobility Solutions",
          description:
            "We manage your migration goals from start to finish: Citizenship & Residency by Investment (Caribbean, Europe, etc.), Strategic location planning (for tax, access, and security), Family documentation, renewals, and legal pathways, Partner coordination with licensed migration attorneys",
        },
        {
          title: "Global Real Estate Sourcing & Advisory",
          description:
            "Off-market property access across major cities and lifestyle destinations, Negotiation support, due diligence, and relocation concierge, Local fixer teams to manage viewings, inspections, and logistics, Luxury rental management and second-home setup",
        },
        {
          title: "Full Family Office Support",
          description:
            "We integrate with your existing family office or act as your trusted private team to handle: Philanthropic project support, Travel management across family branches, Wellness, education, and lifestyle planning for dependents, Executive coordination for key household or business assets",
        },
        {
          title: "Private Procurement",
          description:
            "We assist with sourcing and discreet purchasing of rare assets, including: Investment-grade art, collectibles, and timepieces, Vehicles, watercraft, and lifestyle acquisitions, Custom gifting for private or professional use",
        },
      ],
    },
  ];

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

      {/* Service Tiers Section */}
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
              Our Service Tiers
            </h2>
            <p className="text-lg font-crimson_pro text-muted-foreground max-w-3xl mx-auto">
              Sorted Concierge offers two distinct service paths, built around
              how our clients live, travel, and plan for the future.
            </p>
          </motion.div>

          <div className="grid gap-12 lg:gap-16">
            {serviceTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
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
                          {tier.name}
                        </h3>

                        <p className="text-muted-foreground font-crimson_pro mb-4 leading-relaxed">
                          {tier.tagline}
                        </p>

                        {tier.description && (
                          <p className="text-muted-foreground font-crimson_pro mb-8 leading-relaxed">
                            {tier.description}
                          </p>
                        )}

                        <div className="space-y-6 mb-8">
                          <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider">
                            What We{" "}
                            {tier.name === "Sorted Heritage"
                              ? "Handle"
                              : "Manage"}
                            :
                          </h4>

                          {tier.services.map((service, serviceIndex) => (
                            <div
                              key={serviceIndex}
                              className="border-l-2 border-secondary/20 pl-6"
                            >
                              <h5 className="font-cinzel font-bold text-white mb-2">
                                {service.title}
                              </h5>
                              <p className="text-sm font-crimson_pro text-muted-foreground mb-2">
                                {service.description}
                              </p>
                              {service.quote && (
                                <blockquote className="text-sm font-crimson_pro text-muted-foreground/80 italic mt-2">
                                  "{service.quote}"
                                </blockquote>
                              )}
                            </div>
                          ))}
                        </div>

                        <Button
                          asChild
                          className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-3 font-crimson_pro uppercase tracking-wider w-fit group-hover:shadow-lg transition-all duration-300"
                        >
                          <Link
                            href={`/services/${tier.id}`}
                            className="flex items-center"
                          >
                            Learn More
                            <ChevronRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>

                      {/* Image */}
                      <div className="relative aspect-[4/3] lg:aspect-auto order-1 lg:order-2">
                        <Image
                          src={tier.image}
                          alt={tier.name}
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
