"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const PackageCard = ({
  package: pkg,
}: {
  package: {
    id: string;
    title: string;
    description: string;
    features: string[];
    popular: boolean;
    type: string;
  };
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative bg-gradient-to-br ${
        pkg.popular
          ? "from-gray-900 to-blue-900/80"
          : "from-gray-800/90 to-gray-900/90"
      } backdrop-blur-md rounded-xl p-8 shadow-lg transition-all duration-300 border ${
        pkg.popular ? "border-secondary/50" : "border-gray-700/50"
      }`}
    >
      {pkg.popular && (
        <span className="absolute top-0 right-0 bg-secondary text-white text-xs font-lora uppercase tracking-widest px-3 py-1 rounded-bl-md">
          Most Popular
        </span>
      )}
      <div className="relative flex flex-col h-full">
        <h3 className="text-2xl font-cinzel font-bold text-white mb-4">
          {pkg.title}
        </h3>
        <p className="text-sm font-lora text-gray-300 mb-4">
          {pkg.description.split("\n")[0]}
        </p>
        <ul className="space-y-2 mb-6">
          {pkg.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center text-sm font-lora text-gray-200"
            >
              <CheckCircle className="w-5 h-5 text-secondary mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        <Button
          asChild
          className="mt-auto bg-secondary text-white font-lora uppercase tracking-widest hover:bg-secondary/80"
        >
          <Link href={`/services/${pkg.id}`}>Join Now</Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.03]);

  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [packagesRef, packagesInView] = useInView({ threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ threshold: 0.1 });

  const packages = [
    {
      id: "sorted-lifestyle",
      title: "Sorted Lifestyle",
      description:
        "This membership is for the movers, the founders, creatives, families, and global citizens who want to live well without the weight of managing it all.",
      features: [
        "Luxury Event Curation",
        "Destination Planning",
        "Group Travel & Experiences",
      ],
      popular: true,
      type: "Membership",
    },
    {
      id: "sorted-experiences",
      title: "Sorted Experiences",
      description:
        "For those who crave unforgettable moments, we craft bespoke experiences that align with your vision, from milestone celebrations to exclusive events.",
      features: [
        "Luxury Event Curation",
        "Destination Planning",
        "Group Travel & Experiences",
      ],
      popular: false,
      type: "Membership",
    },
    {
      id: "sorted-heritage",
      title: "Sorted Heritage",
      description:
        "Securing Your Legacy. From financial structuring to global mobility and real estate, we manage your long-term vision.",
      features: [
        "Legacy & Financial Structuring",
        "Global Mobility Solutions",
        "Global Real Estate Sourcing & Advisory",
        "Full Family Office Support",
        "Private Procurement",
      ],
      popular: false,
      type: "Membership",
    },
  ];

  const faqs = [
    {
      question:
        "What sets Sorted Concierge apart from other luxury concierge services?",
      answer:
        "We’re not a concierge directory, a call center, or a glorified booking agent. Sorted is a high-trust lifestyle management partner. That means we don’t just respond to requests, we anticipate needs, manage logistics end-to-end, and operate like a personal operations team behind the scenes. You talk to one dedicated manager, we use a vetted global network, and we cap our client list for excellence.",
    },
    {
      question:
        "What types of clients have you provided VIP concierge services to?",
      answer:
        "We serve those who value time, privacy, and peace of mind: diaspora Nigerians, high-net-worth individuals, celebrities, music executives, influencers, luxury brand reps, and family offices. We support clients with or without assistants, working discreetly in the background.",
    },
    {
      question:
        "What happens if I run into any issues during my concierge service period?",
      answer:
        "If anything doesn’t go as expected, we handle it immediately with a dedicated 24/7 lifestyle manager (depending on your tier). We resolve issues like missed flights or vendor problems quickly and discreetly, often before you ask twice.",
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
    {
      question:
        "What does the process of working with Sorted Concierge typically look like?",
      answer:
        "1. **Discovery & Intake**: A consultation to understand your needs.\n2. **Proposal & Onboarding**: Customized proposal, engagement terms, and NDA.\n3. **Execution & Access**: We handle requests, vendors, and updates seamlessly.\n4. **Ongoing Support**: Continuous management for members or debrief for one-time projects.",
    },
    {
      question: "Do you work with teams (assistants, managers, reps)?",
      answer:
        "Absolutely. We coordinate with personal assistants, talent managers, PR teams, and family office staff, acting as a flexible, discreet execution team behind the scenes.",
    },
    {
      question: "How do I become a Sorted member?",
      answer:
        "Apply through our private intake form, get referred by an existing client, or start with a bespoke project and convert to membership. We onboard selectively to maintain elite service.",
    },
  ];

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
            alt="Services Hero"
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
            <p className="mb-4 font-lora text-sm md:text-lg italic text-secondary">
              YOUR LUXURY, OUR EXPERTISE
            </p>
            <h1 className="mb-6 text-3xl md:text-5xl font-cinzel font-bold uppercase tracking-widest">
              Sorted Concierge Memberships
            </h1>
            <p className="mb-8 text-sm md:text-lg font-lora text-gray-200 max-w-2xl mx-auto">
              High-trust lifestyle management for those who value time, privacy,
              and seamless experiences.
            </p>
            <Button
              asChild
              className="bg-secondary px-8 py-3 text-sm font-lora uppercase tracking-widest text-white hover:bg-secondary/80"
            >
              <Link href="/booking">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Membership Tiers Section */}
      <section ref={packagesRef} className="bg-gray-800/50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={packagesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest">
              Our Membership Tiers
            </h2>
            <p className="mt-4 text-sm md:text-base font-lora text-gray-300">
              Three distinct paths built around how you live, travel, and plan
              for the future.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={packagesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PackageCard package={pkg} />
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={packagesInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="mb-6 text-sm md:text-base font-lora text-gray-200">
              Need a custom solution? We can tailor a membership to your unique
              lifestyle.
            </p>
            <Button
              asChild
              className="bg-secondary px-8 py-3 text-sm font-lora uppercase tracking-widest text-white hover:bg-secondary/80"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
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
      <section className="relative aspect-[21/9] min-h-[300px]">
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
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-6 text-2xl md:text-4xl font-cinzel font-bold uppercase tracking-widest">
              Ready to Live Sorted?
            </h2>
            <Button
              asChild
              className="bg-secondary px-8 py-3 text-sm font-lora uppercase tracking-widest text-white hover:bg-secondary/80"
            >
              <Link href="/booking">Apply Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
