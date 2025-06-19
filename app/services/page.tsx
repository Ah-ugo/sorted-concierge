"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Shield,
  Plane,
  Calendar,
  Users,
  Briefcase,
  ChevronRight,
  Globe,
  Heart,
  Building,
  Car,
} from "lucide-react";

export default function Services() {
  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ threshold: 0.1 });

  const membershipTiers = [
    {
      id: "sorted-lifestyle",
      name: "Sorted Lifestyle",
      icon: <Star className="w-8 h-8 text-secondary" />,
      tagline:
        "For the movers, the founders, creatives, families, and global citizens",
      description:
        "This membership is for those who want to live well without the weight of managing it all. We don't just assist. We design, orchestrate, and deliver experiences that feel tailored, intentional, and entirely stress-free.",
      image:
        "https://res.cloudinary.com/dejeplzpv/image/upload/v1749092226/naija_concierge/packages/dc8eab17-ab3f-48ec-96a9-8447c2bb504d.jpg",
      services: [
        {
          title: "Luxury Event Curation",
          description:
            "From intimate proposals in hidden corners of the world to milestone celebrations that span continents, your vision becomes our blueprint.",
          icon: <Calendar className="w-6 h-6 text-secondary" />,
          details:
            "Whether it's your Cape Town celebration or a Parisian anniversary, we handle the impossible logistics while you enjoy the flawless execution.",
        },
        {
          title: "Destination Planning",
          description:
            "We don't book trips, we build entire journeys. Full itinerary design, guest movement across time zones, venues that don't show up in Google searches.",
          icon: <Plane className="w-6 h-6 text-secondary" />,
          details:
            "Every touchpoint aligns with your style, pace, and privacy. Think of us as your stage manager, but for the world.",
        },
        {
          title: "Group Travel & Experiences",
          description:
            "Multi-day corporate retreats, family milestone trips, friends' getaway weekends.",
          icon: <Users className="w-6 h-6 text-secondary" />,
          details:
            "You share the vision. We turn it into a memory you'll never forget, with none of the stress that usually comes with it.",
        },
      ],
    },
    {
      id: "sorted-heritage",
      name: "Sorted Heritage",
      icon: <Shield className="w-8 h-8 text-secondary" />,
      tagline: "Securing Your Legacy",
      description:
        "Comprehensive wealth management and legacy planning services for those building generational impact and securing global mobility.",
      image:
        "https://res.cloudinary.com/dejeplzpv/image/upload/v1749092615/naija_concierge/packages/2fef31a1-0dd1-4ae3-9fc8-6596fa22d1ed.jpg",
      services: [
        {
          title: "Legacy & Financial Structuring",
          description:
            "USD-denominated life insurance planning, cross-border estate planning & trust structures, generational wealth protection.",
          icon: <Building className="w-6 h-6 text-secondary" />,
          details:
            "Inter-family financial coordination through our trusted partners.",
        },
        {
          title: "Global Mobility Solutions",
          description:
            "Citizenship & Residency by Investment (Caribbean, Europe, etc.), strategic location planning for tax, access, and security.",
          icon: <Globe className="w-6 h-6 text-secondary" />,
          details:
            "Family documentation, renewals, and legal pathways with licensed migration attorneys.",
        },
        {
          title: "Global Real Estate Sourcing",
          description:
            "Off-market property access across major cities and lifestyle destinations.",
          icon: <Heart className="w-6 h-6 text-secondary" />,
          details:
            "Negotiation support, due diligence, relocation concierge, and luxury rental management.",
        },
        {
          title: "Full Family Office Support",
          description:
            "Philanthropic project support, travel management across family branches, wellness and education planning.",
          icon: <Briefcase className="w-6 h-6 text-secondary" />,
          details:
            "Executive coordination for key household or business assets.",
        },
        {
          title: "Private Procurement",
          description:
            "Investment-grade art, collectibles, timepieces, vehicles, watercraft, and lifestyle acquisitions.",
          icon: <Car className="w-6 h-6 text-secondary" />,
          details:
            "Custom gifting for private or professional use with complete discretion.",
        },
      ],
    },
  ];

  const faqs = [
    {
      question:
        "What sets Sorted Concierge apart from other luxury concierge services?",
      answer:
        "We're not a concierge directory, a call center, or a glorified booking agent. Sorted is a high-trust lifestyle management partner. We don't just respond to requests, we anticipate needs, manage logistics end-to-end, and operate like a personal operations team behind the scenes. You don't speak to ten different agents. You talk to one person who knows your style, preferences, and schedule.",
    },
    {
      question:
        "What types of clients have you provided VIP concierge services to?",
      answer:
        "We serve diaspora Nigerians and global travelers, high-net-worth individuals and founders, celebrities and music executives, luxury brand reps, and family offices. Some of our clients have assistants or chiefs of staff, while others don't. Either way, we work quietly in the background to make everything smoother.",
    },
    {
      question:
        "How far in advance should I contact Sorted to kick off the booking process?",
      answer:
        "We recommend getting in touch as soon as possible, especially for high-demand periods. Simple lifestyle tasks: 24–48 hours ahead. Luxury event planning: Ideally 3–8 weeks ahead. Destination travel or group coordination: 2–6 weeks ahead. Legacy planning services: The sooner the better.",
    },
    {
      question:
        "What does the process of working with Sorted Concierge typically look like?",
      answer:
        "Discovery & Intake: Short consultation to understand your needs. Proposal & Onboarding: Customized proposal and NDA, then assignment of your dedicated lifestyle manager. Execution & Access: We handle requests and manage vendors with real-time updates. Ongoing Support: Continuous operation for members or project close-out for one-time engagements.",
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
            <p className="mb-8 text-lg sm:text-xl font-crimson_pro text-muted-foreground max-w-3xl mx-auto">
              Two distinct membership paths, built around how our clients live,
              travel, and plan for the future.
            </p>
            {/* <p className="text-base sm:text-lg font-crimson_pro text-muted-foreground max-w-2xl mx-auto">
              We follow the example of refined service providers by organizing
              our offerings under clear umbrella categories, making navigation
              easier and eliminating confusion about what we deliver.
            </p> */}
          </motion.div>
        </div>
      </section>

      {/* Membership Tiers Section */}
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
              Our Membership Tiers
            </h2>
            <p className="text-lg font-crimson_pro text-muted-foreground max-w-3xl mx-auto">
              Sorted Concierge offers two distinct membership paths, designed
              around the way our discerning clients live, work, and build their
              legacy.
            </p>
          </motion.div>

          <div className="grid gap-12 lg:gap-16">
            {membershipTiers.map((tier, index) => (
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
                        <div className="flex items-center mb-6">
                          {tier.icon}
                          <h3 className="ml-4 text-2xl sm:text-3xl font-cinzel font-bold text-white">
                            {tier.name}
                          </h3>
                        </div>

                        <p className="text-secondary text-sm font-crimson_pro uppercase tracking-wider mb-4">
                          {tier.tagline}
                        </p>

                        <p className="text-muted-foreground font-crimson_pro mb-8 leading-relaxed">
                          {tier.description}
                        </p>

                        <div className="space-y-6 mb-8">
                          <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider">
                            What We Handle:
                          </h4>

                          {tier.services.map((service, serviceIndex) => (
                            <div
                              key={serviceIndex}
                              className="border-l-2 border-secondary/20 pl-6"
                            >
                              <div className="flex items-start mb-2">
                                {service.icon}
                                <h5 className="ml-3 font-cinzel font-bold text-white">
                                  {service.title}
                                </h5>
                              </div>
                              <p className="text-sm font-crimson_pro text-muted-foreground mb-2 ml-9">
                                {service.description}
                              </p>
                              <p className="text-xs font-crimson_pro text-muted-foreground/80 ml-9 italic">
                                {service.details}
                              </p>
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

      {/* What Sets Us Apart Section */}
      <section className="py-16 bg-card/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-6">
              The Sorted Difference
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Depth",
                description:
                  "We don't rely on Google; we have a vetted network of global fixers, venues, vendors, and private partners.",
              },
              {
                title: "Discretion",
                description:
                  "You don't speak to ten different agents. You talk to one person who knows your style, preferences, and schedule.",
              },
              {
                title: "Control",
                description:
                  "We don't just 'book things'; we manage the entire experience before, during, and after.",
              },
              {
                title: "Excellence",
                description:
                  "We're intentionally boutique. We cap our client list to maintain excellence and protect our bandwidth.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-gold-gradient rounded-full" />
                </div>
                <h3 className="font-cinzel font-bold text-white mb-2 uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-sm font-crimson_pro text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
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

          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              >
                <Card className="bg-card border-0 elegant-shadow">
                  <CardContent className="p-8">
                    <h3 className="font-cinzel font-bold text-white mb-4 text-lg">
                      {faq.question}
                    </h3>
                    <Separator className="bg-secondary/20 mb-4" />
                    <p className="font-crimson_pro text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
              Ready to Begin?
            </h2>
            <p className="text-lg font-crimson_pro text-muted-foreground mb-8">
              Apply through our private intake form, get referred by an existing
              client, or engage us on a bespoke project first.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-4 font-crimson_pro uppercase tracking-wider"
              >
                <Link href="/contact">Request Private Access</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-secondary text-white hover:bg-secondary hover:text-black px-8 py-4 font-crimson_pro uppercase tracking-wider"
              >
                <Link href="/about">Learn Our Approach</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
