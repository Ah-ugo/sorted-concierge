"use client";

import { useState } from "react";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const memberships = [
  {
    id: "sorted-lifestyle",
    name: "Sorted Lifestyle",
    description:
      "Luxury, from touchdown to takeoff. Sorted Lifestyle is built for high-performers, power travelers, and seasoned executives who need everything done, but don’t have time to chase details. From the moment you land to the second you take off, our team handles the logistics, so you can focus on living well.",
    features: [
      "VIP Airport Protocol & Global Fast-Track: Private immigration, dedicated ground handling, luggage coordination, meet-and-greet services, average processing time of 12 minutes.",
      "Executive Transport & Armored Security: Armored vehicles, real-time GPS tracking, executive protection specialists, 24/7 emergency response.",
      "Private Aviation & Air Transfers: On-demand charter coordination, vetted aircraft, custom catering, ground handling, real-time flight tracking.",
      "Private Culinary Experiences: Michelin-trained chefs, custom menus, premium ingredient sourcing, wine pairing services.",
      "Private Island & Yacht Charters: Access to private islands, luxury yachts, custom itineraries, gourmet catering, water sports equipment.",
      "Exclusive Access & Social Capital: Private members' clubs, gallery openings, business networking, VIP sporting and entertainment events.",
    ],
    contact: {
      lagos: "+234 [Number]",
      london: "+44 [Number]",
      dubai: "+971 [Number]",
      global: "[Email Address]",
    },
    icon: "🌟",
  },
  {
    id: "sorted-experiences",
    name: "Sorted Experiences",
    description:
      "Unforgettable moments, flawlessly executed. Sorted Experiences exists for those who understand that extraordinary moments don't happen by accident; they're orchestrated by people who refuse to accept anything less than perfection.",
    features: [
      "Milestone Celebrations & Proposal Planning: Custom proposals with 100% success rate, milestone birthdays, anniversary celebrations, surprise coordination.",
      "Cultural Immersion & Art Curation: Private gallery tours, fashion week access, exclusive performances, museum after-hours tours.",
      "Destination Experiences Worldwide: Events in Africa, Europe, Middle East, Asia, Americas, with local expertise and global standards.",
      "Bespoke Experience Design: Custom concerts, celebrity chef dinners, pop-up art exhibitions, tailored to your vision.",
    ],
    contact: {
      global: "[Email Address]",
      direct: "[Phone Number]",
    },
    icon: "🎉",
  },
  {
    id: "sorted-heritage",
    name: "Sorted Heritage",
    description:
      "Legacy lives here. Sorted Heritage serves families and individuals who understand that today's achievements represent tomorrow's foundation. We connect accomplished individuals with sophisticated financial structures, global mobility solutions, and wealth preservation strategies.",
    features: [
      "Global Citizenship & Residency Solutions: Caribbean, European, UAE, Singapore programs, visa-free travel, tax optimization.",
      "International Real Estate & Investment Assets: Off-market properties in London, Dubai, Lagos, Cape Town, New York, Singapore, with due diligence and financing.",
      "Wealth Preservation & Life Insurance: USD-denominated universal life policies, tax-deferred accumulation, estate planning benefits.",
      "Family Office & Estate Planning: Governance, investment oversight, succession planning, international trust structures.",
      "Private Banking & Investment Access: Swiss private banks, offshore banking, institutional-quality private equity, pre-IPO opportunities.",
    ],
    contact: {
      global: "[Email Address]",
      direct: "[Phone Number]",
    },
    icon: "🏛️",
  },
];

const faqs = [
  {
    question:
      "What sets Sorted Concierge apart from other luxury concierge services?",
    answer:
      "We’re not a concierge directory, a call center, or a glorified booking agent. Sorted is a high-trust lifestyle management partner. We anticipate needs, manage logistics end-to-end, and operate like a personal operations team. You deal with one dedicated manager, we use a vetted global network, and we cap our client list for excellence.",
  },
  {
    question:
      "How far in advance should I contact Sorted to kick off the booking process?",
    answer:
      "As soon as possible, especially for high-demand periods like Detty December or Fashion Week. Simple tasks need 24–48 hours, luxury events 3–8 weeks, travel 2–6 weeks, and residency/legacy planning varies. We’re experts at moving fast without sacrificing quality.",
  },
  {
    question:
      "Will you work with me if I need a private concierge on short notice?",
    answer:
      "Yes, on a case-by-case basis depending on availability. We prioritize referred clients and ensure we can deliver at our standard of care. Provide full context upfront for faster delivery, and we’ll confirm immediately if we can take it on.",
  },
];

interface MembershipDetailsProps {
  params: Promise<{ id: string }>;
}

export default function MembershipDetails({ params }: MembershipDetailsProps) {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { id } = use(params);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.03]);

  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [detailsRef, detailsInView] = useInView({ threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1 });

  const membership = memberships.find((m) => m.id === id) || memberships[0];

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-[60vh] items-center justify-center pt-16 overflow-hidden"
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <Image
            src="/image6.png"
            alt={`${membership.name} Hero`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70" />
        </motion.div>
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <Button
              asChild
              variant="ghost"
              className="mb-4 text-gray-200 hover:text-white hover:bg-secondary/20"
            >
              <Link href="/services">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Memberships
              </Link>
            </Button>
            <p className="mb-4 font-lora text-sm md:text-lg italic text-secondary">
              MEMBERSHIP TIER
            </p>
            <h1 className="mb-6 text-3xl md:text-5xl font-cinzel font-bold uppercase tracking-widest">
              {membership.name}
            </h1>
            <p className="mb-8 text-sm md:text-lg font-lora text-gray-200 max-w-2xl mx-auto">
              {membership.description}
            </p>
            <Button
              asChild
              className="bg-secondary px-8 py-3 text-sm font-lora uppercase tracking-widest text-white hover:bg-secondary/80"
            >
              <Link href="/booking">Join This Membership</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section ref={detailsRef} className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={detailsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-white mb-6">
                What We Handle
              </h2>
              <ul className="space-y-4">
                {membership.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={detailsInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start text-sm md:text-base font-lora text-gray-200"
                  >
                    <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-1" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex items-center justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                  <span className="text-3xl">{membership.icon}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-800/50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={detailsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-white mb-6">
              Connect With Us
            </h2>
            <p className="text-sm md:text-base font-lora text-gray-200 mb-6">
              Contact our global concierge team to discuss your{" "}
              {membership.name.toLowerCase()} requirements. All communications
              are held in absolute confidence.
            </p>
            <div className="space-y-2 text-sm md:text-base font-lora text-gray-200">
              {Object.entries(membership.contact).map(([key, value]) => (
                <p key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest">
              Frequently Asked Questions
            </h2>
          </motion.div>
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-xl p-6 shadow-md"
              >
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h3 className="text-lg md:text-xl font-cinzel font-bold text-white">
                    {faq.question}
                  </h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-secondary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-secondary" />
                  )}
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    openFaq === index
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="mt-2 text-sm md:text-base font-lora text-gray-200">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative aspect-[21/9] min-h-[300px]">
        <div className="absolute inset-0">
          <Image
            src="/image7.png"
            alt="CTA Background"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="mb-6 text-2xl md:text-4xl font-cinzel font-bold uppercase tracking-widest">
              Ready to Experience {membership.name}?
            </h2>
            <Button
              asChild
              className="bg-secondary px-8 py-3 text-sm font-lora uppercase tracking-widest text-white hover:bg-secondary/80"
            >
              <Link href="/booking">Join Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
