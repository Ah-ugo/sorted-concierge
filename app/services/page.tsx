"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
  Users,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "@/lib/api";

interface Package {
  id: string;
  title: string;
  description: string;
  features: string[];
  popular: boolean;
  type: string;
}

const PackageCard = ({
  package: pkg,
  index,
}: {
  package: Package;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative group overflow-hidden rounded-2xl transition-all duration-500 ${
        pkg.popular
          ? "bg-gold-gradient border-2 border-secondary-light/50"
          : "bg-card border border-muted/50"
      } backdrop-blur-xl shadow-2xl hover:shadow-secondary-light/10`}
    >
      {/* Glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-secondary-light/3 rounded-2xl" // Reduced opacity for better readability
      />

      {/* Popular badge */}
      {pkg.popular && (
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: -12 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div className="bg-secondary-light text-black text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            MOST POPULAR
          </div>
        </motion.div>
      )}

      <div className="relative p-8 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <motion.h3
            className={`text-2xl font-bold mb-3 group-hover:text-secondary-light transition-colors duration-300 ${
              pkg.popular ? "text-black" : "text-white"
            }`} // Black for popular, white for others
            style={{ fontFamily: "serif" }}
          >
            {pkg.title}
          </motion.h3>
          <motion.div
            className="w-12 h-1 bg-secondary-light rounded-full mb-4"
            initial={{ width: 0 }}
            animate={{ width: 48 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
          />
          <p
            className={`leading-relaxed text-sm ${
              pkg.popular ? "text-black/80" : "text-muted-foreground"
            }`} // Black/80 for popular, muted-foreground for others
          >
            {pkg.description}
          </p>
        </div>

        {/* Features */}
        <div className="flex-1 mb-8">
          <ul className="space-y-3">
            {pkg.features.map((feature, featureIndex) => (
              <motion.li
                key={featureIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.65 + index * 0.1 + featureIndex * 0.05,
                  duration: 0.4,
                }}
                className={`flex items-start gap-3 text-sm ${
                  pkg.popular ? "text-black" : "text-white"
                }`} // Black for popular, white for others
              >
                <CheckCircle
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    pkg.popular ? "text-secondary-dark" : "text-secondary-light"
                  }`} // Secondary-dark for popular, secondary-light for others
                />
                <span className="leading-relaxed">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`group relative overflow-hidden rounded-xl px-6 py-3 font-medium transition-all duration-300 ${
            pkg.popular
              ? "bg-secondary-light text-black shadow-lg hover:bg-secondary-dark" // Updated hover to secondary-dark
              : "bg-muted/50 text-white hover:bg-muted/80 border border-muted/50"
          }`}
        >
          <Link
            href={`/services/${pkg.id}`}
            className="relative z-10 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-wider"
          >
            Join Now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.button>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon: Icon, number, label, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
    className="text-center p-6 rounded-xl bg-muted/30 backdrop-blur-sm border border-muted/30"
  >
    <Icon className="w-8 h-8 text-secondary-light mx-auto mb-3" />
    <div className="text-2xl font-bold text-white mb-1">{number}</div>
    <div className="text-sm text-muted-foreground uppercase tracking-wider">
      {label}
    </div>
  </motion.div>
);

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroY = useTransform(scrollY, [0, 400], [0, -100]);

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true);
      try {
        const packagesData = await apiClient.getPackages();
        const mappedPackages: Package[] = packagesData.map((pkg: any) => ({
          id: pkg.id,
          title: pkg.name,
          description: pkg.description,
          features: pkg.features,
          popular: pkg.isPopular,
          type: pkg.type,
        }));
        setPackages(mappedPackages);
      } catch (err: any) {
        console.error("Failed to fetch packages:", err.message);
        setError("Failed to load packages. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const faqs = [
    {
      question:
        "What sets Sorted Concierge apart from other luxury concierge services?",
      answer:
        "We're not a concierge directory, a call center, or a glorified booking agent. Sorted is a high-trust lifestyle management partner. That means we don't just respond to requests, we anticipate needs, manage logistics end-to-end, and operate like a personal operations team behind the scenes. You talk to one dedicated manager, we use a vetted global network, and we cap our client list for excellence.",
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
        "If anything doesn't go as expected, we handle it immediately with a dedicated 24/7 lifestyle manager (depending on your tier). We resolve issues like missed flights or vendor problems quickly and discreetly, often before you ask twice.",
    },
    {
      question:
        "How far in advance should I contact Sorted to kick off the booking process?",
      answer:
        "As soon as possible, especially for high-demand periods like Detty December or Fashion Week. Simple tasks need 24–48 hours, luxury events 3–8 weeks, travel 2–6 weeks, and residency/legacy planning varies. We're experts at moving fast without sacrificing quality.",
    },
    {
      question:
        "Will you work with me if I need a private concierge on short notice?",
      answer:
        "Yes, on a case-by-case basis depending on availability. We prioritize referred clients and ensure we can deliver at our standard of care. Provide full context upfront for faster delivery, and we'll confirm immediately if we can take it on.",
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
    <div className="bg-black text-white overflow-x-hidden">
      {/* Hero Section with Image Overlay */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/image6.png')",
            }}
          />
          {/* <div className="absolute inset-0 bg-gradient-to-b from-muted/60 via-muted/70 to-muted/80" /> */}
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 z-1"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]" />
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <span className="px-4 py-2 bg-muted/70 border border-muted/70 rounded-full text-secondary-light text-sm font-medium uppercase tracking-wider backdrop-blur-sm">
                Your Luxury, Our Expertise
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl md:text-7xl font-bold mb-8 leading-tight"
              style={{ fontFamily: "serif" }}
            >
              <span className="text-white drop-shadow-lg">
                Sorted Concierge
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-secondary-light font-normal drop-shadow-lg">
                Memberships
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
            >
              High-trust lifestyle management for those who value time, privacy,
              and seamless experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href={"/membership-booking"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative overflow-hidden px-8 py-4 bg-gold-gradient rounded-xl text-black font-medium shadow-2xl hover:bg-secondary-light/80 transition-all duration-300 backdrop-blur-sm"
                >
                  <span className="relative z-10 flex items-center gap-2 text-sm uppercase tracking-wider text-black">
                    Get Started
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.button>
              </Link>
              <Link href={"/about"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border border-muted/70 rounded-xl text-white font-medium hover:bg-muted/50 transition-all duration-300 text-sm uppercase tracking-wider backdrop-blur-sm"
                >
                  Learn More
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
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
      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <StatCard
              icon={Users}
              number="500+"
              label="Elite Clients"
              delay={0}
            />
            <StatCard
              icon={Shield}
              number="99%"
              label="Success Rate"
              delay={0.1}
            />
            <StatCard icon={Clock} number="24/7" label="Support" delay={0.2} />
            <StatCard icon={Star} number="5-Star" label="Service" delay={0.3} />
          </div>
        </div>
      </section>
      {/* Membership Tiers Section */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2
              className="text-3xl md:text-5xl font-bold mb-6 text-white"
              style={{ fontFamily: "serif" }}
            >
              Our Service Tiers
            </h2>
            <div className="w-24 h-1 bg-secondary-light rounded-full mx-auto mb-6" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Three distinct paths built around how you live, travel, and plan
              for the future.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-secondary-light border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-secondary-dark text-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {packages.map((pkg, index) => (
                <PackageCard key={pkg.id} package={pkg} index={index} />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground mb-8 text-lg">
              Need a custom solution? We can tailor a membership to your unique
              lifestyle.
            </p>
            <Link href={"/contact"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-secondary-light/50 rounded-xl text-secondary-light font-medium hover:bg-secondary-light/10 transition-all duration-300 text-sm uppercase tracking-wider"
              >
                Contact Us
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2
              className="text-3xl md:text-5xl font-bold mb-6 text-white"
              style={{ fontFamily: "serif" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="w-24 h-1 bg-secondary-light rounded-full mx-auto" />
          </motion.div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-muted/50 backdrop-blur-sm rounded-2xl border border-muted/50 overflow-hidden transition-all duration-300 hover:border-secondary-light/30">
                  <motion.button
                    className="flex w-full items-center justify-between p-6 text-left focus:outline-none focus:ring-2 focus:ring-secondary-light/50 rounded-2xl"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    whileHover={{ backgroundColor: "rgba(43, 43, 43, 0.1)" }}
                  >
                    <h3
                      className="text-lg md:text-xl font-bold text-white pr-4 leading-relaxed"
                      style={{ fontFamily: "serif" }}
                    >
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-6 h-6 text-secondary-light" />
                    </motion.div>
                  </motion.button>
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={
                      openFaq === index
                        ? { height: "auto", opacity: 1 }
                        : { height: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="w-full h-px bg-muted/50 mb-4" />
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/image7.png')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-muted/70 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2
              className="text-3xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg"
              style={{ fontFamily: "serif" }}
            >
              Ready to Live Sorted?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed drop-shadow-md">
              Join an exclusive community of individuals who demand excellence
              in every aspect of their lifestyle.
            </p>
          </motion.div>

          <Link href={"/membership-booking"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden px-10 py-5 bg-gold-gradient rounded-2xl text-black font-bold shadow-2xl hover:bg-secondary-light/80 transition-all duration-300 backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center gap-3 text-lg uppercase tracking-wider text-black">
                Apply Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </span>
            </motion.button>
          </Link>
        </div>
        {/* </div> */}
      </section>
    </div>
  );
}
