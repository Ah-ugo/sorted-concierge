"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [contentRef, contentInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const privacyContent = [
    {
      section: "Introduction",
      description:
        "At Sorted Concierge Services, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our website or services.",
    },
    {
      section: "Information We Collect",
      description: [
        "Personal details (e.g., name, email, phone number) provided during booking or inquiries.",
        "Payment information processed through secure third-party providers.",
        "Usage data (e.g., website interactions) collected via cookies and analytics tools.",
        "Preferences and special requests shared for service customization.",
      ],
    },
    {
      section: "How We Use Your Information",
      description: [
        "To process bookings and deliver services.",
        "To communicate with you about your requests or updates.",
        "To improve our website and services through analytics.",
        "To send promotional offers, with your consent.",
      ],
    },
    {
      section: "Data Sharing",
      description:
        "We do not sell your personal information. We may share data with trusted partners (e.g., travel providers, payment processors) to fulfill services, or as required by law.",
    },
    {
      section: "Your Rights",
      description:
        "You may request access, correction, or deletion of your personal data. To exercise these rights, contact us at privacy@sortedconcierge.com.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-[50vh] items-center justify-center bg-black pt-10" // Updated to bg-black
      >
        <div className="container relative z-10 mx-auto my-16 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <Button
              asChild
              variant="ghost"
              className="mb-4 text-muted-foreground hover:text-white hover:bg-muted/50 border border-muted/50 hover:border-secondary-light/50 rounded-xl" // Updated to muted-foreground, muted, secondary-light
            >
              <Link href="/">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold uppercase tracking-widest text-white">
              Privacy Policy
            </h1>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-lora text-muted-foreground">
              Learn how we protect your personal information and ensure your
              privacy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-black py-16 md:py-32" ref={contentRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-4xl"
          >
            <div className="bg-card backdrop-blur-md rounded-xl p-8 shadow-lg border border-muted/50">
              {privacyContent.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="mb-8"
                >
                  <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white mb-4">
                    {section.section}
                  </h2>
                  {Array.isArray(section.description) ? (
                    <ul className="space-y-2">
                      {section.description.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={
                            contentInView
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -10 }
                          }
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1 + i * 0.05,
                          }} // Added stagger for list items
                          className="text-sm sm:text-base font-lora text-muted-foreground flex items-start" // Updated to muted-foreground
                        >
                          <span className="mr-2 text-secondary-light">•</span>{" "}
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm sm:text-base font-lora text-muted-foreground">
                      {section.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/20 py-16 md:py-32" ref={ctaRef}>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Have Questions?
            </h2>
            <p className="mb-8 text-sm sm:text-base font-lora text-muted-foreground">
              Contact us for more information about our services or policies.
            </p>
            <Button
              asChild
              className="bg-gold-gradient text-black px-8 py-6 text-xs sm:text-sm font-lora uppercase tracking-widest hover:bg-secondary-light/80 shadow-lg hover:shadow-secondary-light/20" // Updated to gold-gradient, secondary-light
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
