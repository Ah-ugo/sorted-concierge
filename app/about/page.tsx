"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Check, Users, Award, Clock } from "lucide-react";

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);

  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const [storyRef, storyInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const [valuesRef, valuesInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const [teamRef, teamInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Emeka Idam",
      role: "Founder & CEO",
      bio: "With over 15 years of experience in luxury hospitality, Emeka founded Sorted Concierge to bring world-class concierge services to Lagos.",
      image: "/placeholder.svg?height=600&width=600&text=Emeka",
    },
    {
      id: 2,
      name: "Ngozi Okafor",
      role: "Head of Operations",
      bio: "Ngozi ensures that every client experience exceeds expectations through meticulous planning and flawless execution.",
      image: "/placeholder.svg?height=600&width=600&text=Ngozi",
    },
    {
      id: 3,
      name: "Emeka Nwachukwu",
      role: "Client Relations Manager",
      bio: "Emeka's extensive network and personable approach help create meaningful connections and unforgettable experiences for our clients.",
      image: "/placeholder.svg?height=600&width=600&text=Emeka N",
    },
    {
      id: 4,
      name: "Amina Bello",
      role: "Events Specialist",
      bio: "Amina brings creativity and precision to every event, ensuring that each occasion is unique and memorable.",
      image: "/placeholder.svg?height=600&width=600&text=Amina",
    },
  ];

  const values = [
    {
      icon: <Check className="h-6 w-6 text-teal-500" />,
      title: "EXCELLENCE",
      description:
        "We are committed to delivering exceptional service that exceeds expectations in every interaction.",
    },
    {
      icon: <Users className="h-6 w-6 text-teal-500" />,
      title: "PERSONALIZATION",
      description:
        "We tailor our services to meet the unique needs and preferences of each client.",
    },
    {
      icon: <Award className="h-6 w-6 text-teal-500" />,
      title: "INTEGRITY",
      description:
        "We operate with honesty, transparency, and the highest ethical standards in all our dealings.",
    },
    {
      icon: <Clock className="h-6 w-6 text-teal-500" />,
      title: "RELIABILITY",
      description:
        "We are available 24/7 to ensure that our clients receive prompt and dependable service.",
    },
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-neutral-300 border-t-teal-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex h-[70vh] items-center justify-center"
      >
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920&text=About Us"
            alt="About Sorted Concierge"
            fill
            priority
            className="object-cover"
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
            <p className="mb-4 text-center font-medium uppercase tracking-wider text-white/90">
              OUR STORY
            </p>
            <h1 className="mb-8 text-center text-4xl font-bold uppercase tracking-widest text-white md:text-5xl lg:text-6xl">
              THE ESSENCE OF LUXURY
            </h1>
            <p className="mb-12 text-lg text-white/90">
              Sorted Concierge was founded with a vision to redefine luxury
              lifestyle management in Lagos. We combine local expertise with
              international standards to provide unparalleled concierge
              services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white py-32" ref={storyRef}>
        <div className="container mx-auto px-6">
          <div className="grid gap-12 md:gap-24 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={
                storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col justify-center order-2 md:order-1"
            >
              <h2 className="mb-8 text-3xl font-light uppercase tracking-widest text-neutral-800">
                Our Journey
              </h2>
              <p className="mb-8 text-lg text-neutral-700">
                Founded in 2018, Sorted Concierge emerged from a simple
                observation: Lagos, a city of boundless energy and opportunity,
                needed a service that could navigate its complexities with
                elegance and precision.
              </p>
              <p className="mb-12 text-lg text-neutral-700">
                Our founder, drawing from extensive experience in luxury
                hospitality across three continents, assembled a team of
                dedicated professionals united by a passion for exceptional
                service and deep local knowledge.
              </p>
              <p className="mb-12 text-lg text-neutral-700">
                Today, we stand as the premier concierge service in Lagos,
                trusted by discerning clients who value time, quality, and
                memorable experiences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={
                storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="order-1 md:order-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/placeholder.svg?height=800&width=600&text=Our Story"
                  alt="Our journey"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-neutral-100 py-32" ref={valuesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-3xl font-light uppercase tracking-widest text-neutral-800 md:text-4xl">
              Our Values
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                className="bg-white p-8 shadow-sm"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                  {value.icon}
                </div>
                <h3 className="mb-4 text-xl font-light tracking-wider">
                  {value.title}
                </h3>
                <p className="text-neutral-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-32" ref={teamRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-16 text-3xl font-light uppercase tracking-widest text-neutral-800 md:text-4xl">
              Our Team
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="group"
              >
                <div className="relative mb-6 aspect-square overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mb-1 text-xl font-medium">{member.name}</h3>
                <p className="mb-4 text-sm uppercase tracking-wider text-teal-600">
                  {member.role}
                </p>
                <p className="text-neutral-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-neutral-900" ref={ctaRef}>
        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 text-3xl font-light uppercase tracking-widest text-white md:text-4xl">
              Experience Our Service
            </h2>
            <p className="mb-12 text-lg text-white/80">
              Let us help you make the most of your time in Lagos with our
              premium concierge services.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="border-teal-400 bg-transparent px-8 py-6 text-sm font-medium uppercase tracking-widest text-white hover:bg-teal-400/10"
              >
                <Link href="/services">Explore Services</Link>
              </Button>

              <Button
                asChild
                className="bg-teal-400 px-8 py-6 text-sm font-medium uppercase tracking-widest text-neutral-900 hover:bg-teal-500"
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
