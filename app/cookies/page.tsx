"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiePage() {
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

  const cookieContent = [
    {
      section: "Introduction",
      description:
        "This Cookie Policy explains how Sorted Concierge Services uses cookies and similar technologies to enhance your experience on our website.",
    },
    {
      section: "What Are Cookies?",
      description:
        "Cookies are small text files stored on your device when you visit our website. They help us remember your preferences, analyze site usage, and deliver personalized content.",
    },
    {
      section: "Types of Cookies We Use",
      description: [
        "Essential Cookies: Necessary for website functionality (e.g., navigation, form submissions).",
        "Analytics Cookies: Track site performance and user behavior (e.g., Google Analytics).",
        "Marketing Cookies: Enable personalized ads and promotions, with your consent.",
      ],
    },
    {
      section: "Managing Cookies",
      description:
        "You can control cookies through your browser settings or our cookie consent tool. Disabling cookies may affect website functionality.",
    },
    {
      section: "Contact Us",
      description:
        "For questions about our Cookie Policy, reach out to us at cookies@sortedconcierge.com.",
    },
  ];

  return (
    <>
      <section
        ref={heroRef}
        className="relative flex min-h-[50vh] items-center justify-center bg-black pt-20"
      >
        <div className="relative z-10 mx-auto my-16 px-12 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Button
              asChild
              variant="outline"
              className="mb-4 text-muted-foreground hover:text-white hover:bg-muted/50 border border-dark hover:border-secondary-light/50 rounded-xl"
            >
              <Link href="/">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </Button>
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-semibold uppercase tracking-widest text-white">
              Cookie Policy
            </h1>
            <p className="mb-12 text-base sm:text-sm md:text-lg font-normal text-muted-foreground">
              Understand how we use cookies to improve your browsing experience.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-black py-16 md py-32" ref={contentRef}>
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
              {cookieContent.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    contentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="mb-8"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">
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
                          }}
                          className="text-sm sm:text-base font-normal text-muted-foreground flex items-start"
                        >
                          <span className="mr-2 text-secondary-light">•</span>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm sm:text-base font-normal text-muted-foreground">
                      {section.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-muted/20 py-16 md py-32" ref={ctaRef}>
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-semibold uppercase tracking-widest text-white">
              Have Questions?
            </h2>
            <p className="mb-8 text-sm sm:text-base font-normal text-muted-foreground">
              Contact us for more information about our services or policies.
            </p>
            <Button
              asChild
              className="bg-gold-gradient text-black px-8 py-6 text-xs sm:text-sm font-normal uppercase tracking-widest hover:bg-secondary-light/80 shadow-lg hover:shadow-secondary-light/20"
            >
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
