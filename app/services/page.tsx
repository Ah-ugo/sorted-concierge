"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const ServiceCard = ({
  service,
}: {
  service: {
    id: string;
    title: string;
    description: string;
    icon: string;
    price: string;
    category: string;
  };
}) => {
  return (
    <div className="relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-secondary">
          <span className="text-2xl">{service.icon}</span>
        </div>
        <h3 className="text-xl font-cinzel font-bold text-white mb-2">
          {service.title}
        </h3>
        <p className="text-sm font-lora text-gray-300 flex-grow">
          {service.description.split("\n")[0]}
        </p>
        <p className="text-sm font-lora text-secondary mt-2">{service.price}</p>
        <Button
          asChild
          className="mt-4 bg-secondary text-white font-lora uppercase tracking-widest hover:from-secondary/80 hover:to-primary/80"
        >
          <Link href={`/services/${service.id}`}>Learn More</Link>
        </Button>
      </div>
    </div>
  );
};

const PackageCard = ({
  package: pkg,
}: {
  package: {
    id: string;
    title: string;
    description: string;
    price: string;
    features: string[];
    popular: boolean;
    type: string;
  };
}) => {
  return (
    <div
      className={`relative bg-gradient-to-br ${
        pkg.popular
          ? "from-gray-900 to-blue-900/80"
          : "from-gray-800/80 to-gray-900/80"
      } backdrop-blur-md rounded-xl p-8 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border ${
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
        <p className="text-sm font-lora text-secondary mt-auto">{pkg.price}</p>
        <Button
          asChild
          className="mt-4 bg-secondary text-white font-lora uppercase tracking-widest hover:from-secondary/80 hover:to-primary/80"
        >
          <Link href="/contact">Join Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.7]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.05]);
  const heroTranslateY = useTransform(scrollY, [0, 300], [0, 50]);

  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [servicesRef, servicesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [packagesRef, packagesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [processRef, processInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [faqRef, faqInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const categories = [
    "All",
    "Travel",
    "Events",
    "Lifestyle",
    "Exclusive Access",
    "Heritage",
  ];

  const services = [
    {
      id: "1",
      name: "Travel & Aviation Support",
      description:
        "From commercial to private, our travel service ensures you never have to ask twice. We plan door-to-door. You just show up.\n\n**What this covers:**\n- First-class and private jet booking\n- Fast-track airport immigration + meet & greet\n- Chauffeurs, armored vehicles, and airport pickups\n- Visa coordination, lounge access, backup options\n- Personal packing assistance (on request)\n\n**For you, if:** You’re always in motion and don’t have time for check-in drama, missed confirmations, or chasing drivers.",
      category: "Travel",
      price: 0,
    },
    {
      id: "2",
      name: "Exclusive Access & Bookings",
      description:
        "We get you into the rooms people whisper about. Whether it’s Fashion Week, a Michelin table, or a festival everyone’s flying in for, you walk in like it’s already yours.\n\n**What this covers:**\n- Concerts, galas, fashion shows\n- High-end restaurant bookings\n- Private showings, art auctions, and invite-only brand events\n- Members-only club access\n- Personal hosting and on-ground support\n\n**For you, if:** You hate asking. And love having options.",
      category: "Exclusive Access",
      price: 0,
    },
    {
      id: "3",
      name: "Lifestyle Management",
      description:
        "For the details you don’t want to think about. You're busy. You're building things. You're flying out in 36 hours. Let us handle the logistics that make your lifestyle run smoothly.\n\n**What this covers:**\n- Booking your spa, stylist, or personal trainer\n- Handling surprise gifts and special deliveries\n- Scheduling home staff, errands, and vendors\n- Creating custom itineraries for family, friends, or VIPs\n- Organizing the chaos without bothering you with it\n\n**For you, if:** You like things done a certain way, but you don’t want to be the one doing them.",
      category: "Lifestyle",
      price: 0,
    },
    {
      id: "4",
      name: "Private Events & Experiences",
      description:
        "One call. A full experience. No stress.\n\n**What this covers:**\n- Milestone birthdays, proposals, retreats, and private dinners\n- Destination event design + guest coordination\n- Vendor management, production, styling, and custom gifting\n- Cultural & seasonal events (Detty December, Ramadan, etc.)\n\n**For you, if:** You want to throw something unforgettable.",
      category: "Events",
      price: 0,
    },
  ];

  const packages = [
    {
      id: "1",
      name: "Sorted Lifestyle",
      description:
        "This membership is for the movers, the founders, creatives, families, and global citizens who want to live well without the weight of managing it all. We don’t just assist. We design, orchestrate, and deliver experiences that feel tailored, intentional, and entirely stress-free.\n\n**What we manage:**\n- **Luxury Event Curation**: From intimate proposals to milestone celebrations, we handle the impossible logistics.\n- **Destination Planning**: Full itinerary design, guest movement, and exclusive venues.\n- **Group Travel & Experiences**: Corporate retreats, family milestone trips, friends’ getaway weekends.",
      price: 0,
      features: [
        "Luxury Event Curation",
        "Destination Planning",
        "Group Travel & Experiences",
      ],
      isPopular: true,
      type: "Membership",
    },
    {
      id: "2",
      name: "Sorted Heritage",
      description:
        "Securing Your Legacy.\n\n**What we handle:**\n- **Legacy & Financial Structuring**: USD-denominated life insurance, cross-border estate planning, generational wealth protection.\n- **Global Mobility Solutions**: Citizenship & residency by investment, strategic location planning.\n- **Global Real Estate Sourcing & Advisory**: Off-market property access, negotiation support, luxury rental management.\n- **Full Family Office Support**: Philanthropic projects, travel management, wellness, and executive coordination.\n- **Private Procurement**: Sourcing rare assets like investment-grade art, vehicles, and custom gifting.",
      price: 0,
      features: [
        "Legacy & Financial Structuring",
        "Global Mobility Solutions",
        "Global Real Estate Sourcing & Advisory",
        "Full Family Office Support",
        "Private Procurement",
      ],
      isPopular: false,
      type: "Membership",
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

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((service) => service.category === activeCategory);

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative flex min-h-[70vh] items-center justify-center pt-10 overflow-hidden"
      >
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroTranslateY }}
          className="absolute inset-0"
        >
          <Image
            src="/image6.png"
            alt="Services Hero"
            fill
            priority
            className="w-full h-full object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        </motion.div>

        <div className="container relative z-10 mx-auto my-16 md:my-32 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <p className="mb-4 font-lora text-sm sm:text-base md:text-lg italic tracking-wider text-secondary">
              SERVICES AT A GLANCE
            </p>
            <h1 className="mb-6 text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold uppercase tracking-widest text-white">
              SORTED CONCIERGE SERVICES
            </h1>
            <p className="mb-12 text-sm sm:text-base md:text-lg font-lora text-gray-200">
              High-trust lifestyle management for those who value time, privacy,
              and seamless experiences.
            </p>
            <Button
              asChild
              className="bg-secondary px-8 py-6 text-xs sm:text-sm font-lora uppercase tracking-widest text-white hover:from-secondary/80 hover:to-primary/80"
            >
              <Link href="/booking">Get Started</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-gray-900 py-8 md:py-16">
        <div className="container mx-auto px-6">
          <div className="overflow-x-auto">
            <div className="flex min-w-max space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={`min-w-[120px] py-6 text-xs sm:text-sm font-lora uppercase tracking-widest rounded-full ${
                    activeCategory === category
                      ? "bg-secondary text-white"
                      : "border-secondary/50 text-gray-200 hover:bg-secondary/20"
                  } transition-all duration-300`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-900 py-8 md:py-16" ref={servicesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 md:mb-16 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Services At A Glance
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceCard
                  service={{
                    id: service.id,
                    title: service.name,
                    description: service.description,
                    icon: getServiceIcon(service.category),
                    price: service.price
                      ? `₦${service.price.toLocaleString()}`
                      : "Contact for Pricing",
                    category: service.category,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="bg-gray-800/50 py-16 md:py-32" ref={packagesRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              packagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 md:mb-16 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Our Membership Tiers
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  packagesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PackageCard
                  package={{
                    id: pkg.id,
                    title: pkg.name,
                    description: pkg.description,
                    price: pkg.price
                      ? `₦${pkg.price.toLocaleString()}/${pkg.type.toLowerCase()}`
                      : "Contact for Pricing",
                    features: pkg.features,
                    popular: pkg.isPopular,
                    type: pkg.type,
                  }}
                />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={packagesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 md:mt-16 text-center"
          >
            <p className="mb-8 text-sm sm:text-base md:text-lg font-lora text-gray-200">
              Need a bespoke solution? We can create a custom membership
              tailored to your lifestyle.
            </p>
            <Button
              asChild
              className="bg-secondary px-8 py-6 text-xs sm:text-sm font-lora uppercase tracking-widest text-white hover:from-secondary/80 hover:to-primary/80"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-900 py-16 md:py-32" ref={processRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <h2 className="mb-8 md:mb-16 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Our Simple Process
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Discovery & Intake",
                description:
                  "A short consultation to understand your needs, preferences, and scope.",
              },
              {
                step: "2",
                title: "Proposal & Onboarding",
                description:
                  "Customized proposal, engagement terms, and NDA assignment.",
              },
              {
                step: "3",
                title: "Execution & Access",
                description:
                  "We handle requests, vendors, and timelines with real-time updates.",
              },
              {
                step: "4",
                title: "Ongoing Support",
                description:
                  "Continuous management for members or debrief for one-time projects.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
                  <span className="text-2xl sm:text-3xl font-lora text-white">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-4 text-lg sm:text-xl md:text-2xl font-cinzel font-bold uppercase tracking-wider text-white">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base font-lora text-gray-200">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
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
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8 text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white">
              Ready to Live Sorted?
            </h2>
            <Button
              asChild
              className="bg-secondary px-8 py-6 text-xs sm:text-sm font-lora uppercase tracking-widest text-white hover:from-secondary/80 hover:to-primary/80"
            >
              <Link href="/booking">Apply Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function getServiceIcon(category: string): string {
  switch (category.toLowerCase()) {
    case "travel":
      return "✈️";
    case "events":
      return "🎉";
    case "lifestyle":
      return "🛍️";
    case "exclusive access":
      return "🎟️";
    case "heritage":
      return "🏛️";
    default:
      return "🌟";
  }
}
