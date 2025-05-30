"use client";

import { useState } from "react";
import { use } from "react"; // Import React.use
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Sample service data (same as ServicesPage.tsx)
const services = [
  {
    id: "1",
    name: "Travel & Aviation Support",
    description:
      "From commercial to private, our travel service ensures you never have to ask twice. We plan door-to-door. You just show up.\n\n**What this covers:**\n- First-class and private jet booking\n- Fast-track airport immigration + meet & greet\n- Chauffeurs, armored vehicles, and airport pickups\n- Visa coordination, lounge access, backup options\n- Personal packing assistance (on request)\n\n**For you, if:** You’re always in motion and don’t have time for check-in drama, missed confirmations, or chasing drivers.",
    category: "Travel",
    price: 0,
    icon: "✈️",
  },
  {
    id: "2",
    name: "Exclusive Access & Bookings",
    description:
      "We get you into the rooms people whisper about. Whether it’s Fashion Week, a Michelin table, or a festival everyone’s flying in for, you walk in like it’s already yours.\n\n**What this covers:**\n- Concerts, galas, fashion shows\n- High-end restaurant bookings\n- Private showings, art auctions, and invite-only brand events\n- Members-only club access\n- Personal hosting and on-ground support\n\n**For you, if:** You hate asking. And love having options.",
    category: "Exclusive Access",
    price: 0,
    icon: "🎟️",
  },
  {
    id: "3",
    name: "Lifestyle Management",
    description:
      "For the details you don’t want to think about. You're busy. You're building things. You're flying out in 36 hours. Let us handle the logistics that make your lifestyle run smoothly.\n\n**What this covers:**\n- Booking your spa, stylist, or personal trainer\n- Handling surprise gifts and special deliveries\n- Scheduling home staff, errands, and vendors\n- Creating custom itineraries for family, friends, or VIPs\n- Organizing the chaos without bothering you with it\n\n**For you, if:** You like things done a certain way, but you don’t want to be the one doing them.",
    category: "Lifestyle",
    price: 0,
    icon: "🛍️",
  },
  {
    id: "4",
    name: "Private Events & Experiences",
    description:
      "One call. A full experience. No stress.\n\n**What this covers:**\n- Milestone birthdays, proposals, retreats, and private dinners\n- Destination event design + guest coordination\n- Vendor management, production, styling, and custom gifting\n- Cultural & seasonal events (Detty December, Ramadan, etc.)\n\n**For you, if:** You want to throw something unforgettable.",
    category: "Events",
    price: 0,
    icon: "🎉",
  },
];

// Sample FAQs relevant to service details
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

interface ServiceDetailsProps {
  params: Promise<{ id: string }>; // Update type to reflect params as a Promise
}

export default function ServiceDetails({ params }: ServiceDetailsProps) {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Unwrap params using React.use
  const { id } = use(params);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.7]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.05]);
  const heroTranslateY = useTransform(scrollY, [0, 300], [0, 50]);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [detailsRef, detailsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [faqRef, faqInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Find service by ID
  const service = services.find((s) => s.id === id) || services[0]; // Fallback to first service if not found
  const [description, ...sections] = service.description.split("\n\n");
  const whatThisCovers =
    sections
      .find((s) => s.startsWith("**What this covers:**"))
      ?.split("\n")
      .slice(1) || [];
  const forYouIf =
    sections
      .find((s) => s.startsWith("**For you, if:**"))
      ?.replace("**For you, if:**", "")
      .trim() || "";

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-[60vh] items-center justify-center pt-10 overflow-hidden"
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroTranslateY }}
          className="absolute inset-0"
        >
          <Image
            src="/image6.png"
            alt={`${service.name} Hero`}
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70" />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" /> */}
        </motion.div>

        <div className="container relative z-10 mx-auto my-16 md:my-32 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <Button
              asChild
              variant="ghost"
              className="mb-4 text-gray-200 hover:text-white hover:bg-secondary/20"
            >
              <Link href="/services">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Services
              </Link>
            </Button>
            <p className="mb-4 font-lora text-sm sm:text-base md:text-lg italic tracking-wider text-secondary">
              {service.category.toUpperCase()}
            </p>
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold uppercase tracking-widest text-white">
              {service.name}
            </h1>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-lora text-gray-200">
              {description}
            </p>
            <Button
              asChild
              className="bg-secondary px-8 py-6 text-xs sm:text-sm font-lora uppercase tracking-widest text-black hover:text-secondary hover:from-secondary/80 hover:to-primary/80"
            >
              <Link href="/booking">Book This Service</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Details Section */}
      <section className="bg-gray-900 py-16 md:py-32" ref={detailsRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              detailsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-4xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  What This Covers
                </h2>
                <ul className="space-y-4">
                  {whatThisCovers.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        detailsInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start text-sm font-lora text-gray-200"
                    >
                      <CheckCircle className="w-5 h-5 text-secondary mr-3 mt-1" />
                      {item.replace(/^- /, "")}
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-cinzel font-bold text-white mb-6">
                  For You, If
                </h2>
                <p className="text-sm font-lora text-gray-200">{forYouIf}</p>
                <div className="mt-6 flex items-center justify-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-secondary">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-800/50 py-16 md:py-32" ref={faqRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 md:mb-16 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md p-6 shadow-md"
              >
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h3 className="text-lg sm:text-xl font-cinzel font-bold text-white">
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
                  <p className="mt-2 text-sm sm:text-base font-lora text-gray-200">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative aspect-[21/9] w-full"
        style={{ minHeight: "300px" }}
        ref={ctaRef}
      >
        <div className="absolute inset-0">
          <Image
            src="/image7.png"
            alt="CTA Background"
            fill
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Ready to Experience {service.name}?
            </h2>
            <Button
              asChild
              className="bg-secondary px-8 py-6 text-xs sm:text-sm font-lora uppercase tracking-widest text-white hover:from-secondary/80 hover:to-primary/80"
            >
              <Link href="/booking">Book Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
