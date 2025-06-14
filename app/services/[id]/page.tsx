"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
// import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Plane,
  Shield,
  Star,
  Clock,
  Globe,
  Users,
  Car,
  Calendar,
  Heart,
  MapPin,
  Phone,
  Mail,
  Check,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface ServiceTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

interface ServiceContent {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  heroImage: string;
  tiers?: ServiceTier[];
  sections: {
    title: string;
    subtitle?: string;
    description: string;
    icon: React.ReactNode;
    image: string;
    features: string[];
    details?: string[];
  }[];
  contact: {
    title: string;
    description: string;
    locations?: { city: string; phone: string }[];
    email?: string;
    phone?: string;
  };
}

const serviceContent: { [key: string]: ServiceContent } = {
  "sorted-lifestyle": {
    title: "Sorted Lifestyle",
    subtitle: "Luxury, from touchdown to takeoff.",
    description:
      "Sorted Lifestyle is built for high-performers, power travelers, and seasoned executives who need everything done, but don't have time to chase details. From the moment you land to the second you take off, our team handles the logistics, so you can focus on living well.",
    icon: <Star className="w-8 h-8 text-secondary" />,
    heroImage:
      "https://res.cloudinary.com/dejeplzpv/image/upload/v1749092226/naija_concierge/packages/dc8eab17-ab3f-48ec-96a9-8447c2bb504d.jpg",
    tiers: [
      {
        name: "Basic",
        price: "$2,500/month",
        description: "Essential lifestyle management for busy professionals",
        features: [
          "Airport fast-track services",
          "Basic transportation coordination",
          "Monthly lifestyle requests (up to 5)",
          "24/7 emergency support",
          "Basic travel planning",
        ],
      },
      {
        name: "Standard",
        price: "$5,000/month",
        description: "Comprehensive lifestyle coordination for executives",
        features: [
          "VIP airport protocol worldwide",
          "Executive transport & security",
          "Unlimited lifestyle requests",
          "Private aviation coordination",
          "Event planning assistance",
          "Culinary experiences",
          "Priority booking access",
        ],
        popular: true,
      },
      {
        name: "Premium",
        price: "$10,000/month",
        description: "Ultimate luxury lifestyle management",
        features: [
          "All Standard features",
          "Dedicated lifestyle manager",
          "Private island & yacht access",
          "Exclusive social capital access",
          "Custom experience design",
          "Global concierge network",
          "White-glove service guarantee",
        ],
      },
    ],
    sections: [
      {
        title: "VIP Airport Protocol & Global Fast-Track",
        description:
          "We ensure that within minutes, you're through private immigration channels, your luggage is secured, and your transport awaits. No queues. No delays. No explanations needed.",
        icon: <Plane className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
        features: [
          "Private immigration and customs processing",
          "Dedicated ground handling teams",
          "Luggage coordination and security screening",
          "Meet-and-greet services with government-trained staff",
          "Average processing time: 12 minutes from aircraft to transport",
        ],
      },
      {
        title: "Executive Transport & Armored Security",
        description:
          "Our global fleet, from armored Range Rovers in Lagos to Bentley Mulsannes in London, maintains the same exacting standards. Each vehicle undergoes weekly security assessments.",
        icon: <Car className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop",
        features: [
          "Armored protection rated to international standards",
          "Real-time GPS tracking and communication systems",
          "Executive protection specialists from military/police backgrounds",
          "24/7 emergency response coordination",
          "Discrete security protocols tailored to each destination",
        ],
      },
      {
        title: "Private Aviation & Air Transfers",
        subtitle: "When commercial aviation becomes inconvenient.",
        description:
          "Your schedule doesn't bend to airline timetables. Our aviation division connects you with vetted aircraft operators across six continents.",
        icon: <Globe className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop",
        features: [
          "On-demand charter coordination globally",
          "Pre-vetted aircraft and crew certifications",
          "Custom catering and in-flight preferences",
          "Ground handling coordination at departure and arrival",
          "Real-time flight tracking and communication",
        ],
      },
      {
        title: "Private Culinary Experiences",
        subtitle: "Michelin standards, anywhere you call home.",
        description:
          "Our network of internationally trained chefs creates extraordinary culinary experiences, whether you're hosting in your Lagos residence, London pied-à-terre, or Dubai penthouse.",
        icon: <Heart className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
        features: [
          "Michelin-trained chefs with international experience",
          "Custom menu creation for dietary preferences and cultural requirements",
          "Premium ingredient sourcing and preparation",
          "Full service coordination, including staff and presentation",
          "Wine pairing and sommelier services",
        ],
      },
      {
        title: "Private Island & Yacht Charters",
        subtitle: "Your own corner of paradise. Exclusively yours.",
        description:
          "Picture this: crystal waters stretching to the horizon, your closest friends or family, and absolutely no one else for miles.",
        icon: <MapPin className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        features: [
          "Access to private islands and exclusive coastal properties",
          "Luxury yacht charters with professional crews",
          "Custom itinerary planning for multi-day adventures",
          "Gourmet catering and beverage service",
          "Water sports equipment and instruction",
          "Complete logistics coordination from departure to return",
        ],
      },
      {
        title: "Exclusive Access & Social Capital",
        subtitle: "Where presence equals influence.",
        description:
          "The right table. The right invitation. The right introduction. In every major city, certain doors remain closed to public access.",
        icon: <Users className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&h=600&fit=crop",
        features: [
          "Private members' clubs and exclusive venues",
          "Gallery openings and cultural events",
          "Business networking opportunities",
          "VIP sporting and entertainment events",
          "Invitation-only social gatherings",
        ],
      },
    ],
    contact: {
      title: "Ready to Experience Sorted Lifestyle?",
      description: "Because access is everything, and you're already Sorted.",
      locations: [
        { city: "Lagos", phone: "+234 [Number]" },
        { city: "London", phone: "+44 [Number]" },
        { city: "Dubai", phone: "+971 [Number]" },
      ],
      email: "[Email Address]",
    },
  },
  "sorted-experiences": {
    title: "Sorted Experiences",
    subtitle: "Unforgettable moments, flawlessly executed.",
    description:
      "Some moments define decades. The proposal that becomes family lore. The celebration that friends reference years later. The weekend that restored perspective when you needed it most.",
    icon: <Calendar className="w-8 h-8 text-secondary" />,
    heroImage:
      "https://res.cloudinary.com/dejeplzpv/image/upload/v1749092615/naija_concierge/packages/2fef31a1-0dd1-4ae3-9fc8-6596fa22d1ed.jpg",
    sections: [
      {
        title: "Milestone Celebrations & Proposal Planning",
        subtitle: "Because some moments deserve to be perfect.",
        description:
          "We've orchestrated over 100 proposals. Each one said yes. Not because we're lucky, but because we understand that the perfect moment isn't about grand gestures.",
        icon: <Heart className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop",
        features: [
          "Custom proposal planning with a 100% success rate",
          "Milestone birthday and anniversary celebrations",
          "Achievement recognition events",
          "Intimate gatherings to grand celebrations",
          "Surprise coordination and guest management",
          "Vendor relationships for impossible-to-book venues",
        ],
      },
      {
        title: "Cultural Immersion & Art Curation",
        subtitle: "Access the inaccessible. Experience the exclusive.",
        description:
          "Art galleries open their private collections for you. Fashion designers share their creative process. Musicians perform in intimate settings.",
        icon: <Star className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
        features: [
          "Private gallery tours and artist studio visits",
          "Fashion week access and designer consultations",
          "Exclusive performance and concert arrangements",
          "Museum after-hours private tours",
          "Cultural festival VIP access",
          "Custom fashion and art acquisition services",
        ],
      },
      {
        title: "Destination Experiences Worldwide",
        subtitle: "The world is your venue.",
        description:
          "Your celebration doesn't need to be confined by geography. Our destination experience division coordinates extraordinary events from Cape Town to Kyoto.",
        icon: <Globe className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        features: [
          "Africa: Cape Town wine estates, Moroccan desert luxury camps, Safari lodges",
          "Europe: French château weekends, Italian villa celebrations, Swiss mountain retreats",
          "Middle East: Dubai desert experiences, Omani luxury resorts, Abu Dhabi cultural events",
          "Asia: Japanese traditional experiences, Bali private villas, Singapore exclusive venues",
          "Americas: Napa Valley estates, Caribbean private islands, Patagonian adventures",
        ],
      },
      {
        title: "Bespoke Experience Design",
        subtitle: "If you can imagine it, we can create it.",
        description:
          "Sometimes the perfect experience doesn't exist yet. That's when our bespoke design team creates something entirely new, built around your vision and values.",
        icon: <Users className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop",
        features: [
          "Initial vision consultation and preference mapping",
          "Concept development and feasibility assessment",
          "Vendor coordination and logistics planning",
          "Timeline management and quality assurance",
          "Day-of coordination and seamless execution",
          "Post-event documentation and memory preservation",
        ],
      },
    ],
    contact: {
      title: "Ready to Create Something Extraordinary?",
      description: "You dream it. We sort it. Together, we make it legendary.",
      email: "[Email Address]",
      phone: "[Phone Number]",
    },
  },
  "sorted-heritage": {
    title: "Sorted Heritage",
    subtitle: "Legacy lives here. When success becomes succession.",
    description:
      "True wealth transcends generations. It creates opportunities for children not yet born, builds bridges across borders, and opens doors that remain closed to even considerable fortune.",
    icon: <Shield className="w-8 h-8 text-secondary" />,
    heroImage:
      "https://res.cloudinary.com/dejeplzpv/image/upload/v1749092877/naija_concierge/packages/d14935c9-ecee-43ac-94fd-cf94a301b6ee.jpg",
    sections: [
      {
        title: "Global Citizenship & Residency Solutions",
        subtitle: "Expand your possibilities. Protect your future.",
        description:
          "Political landscapes shift. Economic policies change. Geographic diversification isn't just smart, it's essential for long-term wealth preservation and family security.",
        icon: <Globe className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
        features: [
          "Caribbean Excellence: St. Kitts & Nevis, Antigua & Barbuda citizenship by investment",
          "European Foundations: Portugal Golden Visa, Austrian residency, Spanish investment programs",
          "Strategic Positioning: UAE residency, Singapore permanent residence, Canadian investor programs",
          "Due Diligence: Complete background verification and application success optimization",
          "Family Integration: Spouse and dependent coverage with education pathway planning",
        ],
        details: [
          "Visa-free travel to 120+ countries",
          "Tax optimization across multiple jurisdictions",
          "Educational access for children at world-class institutions",
          "Business expansion opportunities in stable economies",
          "Political and economic risk diversification",
        ],
      },
      {
        title: "International Real Estate & Investment Assets",
        description:
          "Real estate remains the foundation of generational wealth. Our property acquisition specialists provide access to investment-grade assets in markets where appreciation has historically outpaced inflation.",
        icon: <MapPin className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
        features: [
          "London: Prime Central zones, historic properties, commercial investments",
          "Dubai: New construction, off-plan opportunities, commercial developments",
          "Lagos: Victoria Island premium, Ikoyi luxury residential, commercial properties",
          "Cape Town: Waterfront luxury, wine estate investments, commercial properties",
          "New York: Manhattan luxury, Brooklyn development opportunities",
          "Singapore: Prime district residential and commercial investment properties",
        ],
      },
      {
        title: "Wealth Preservation & Life Insurance",
        subtitle: "Protect what you've built. Multiply what you leave.",
        description:
          "Sophisticated wealth requires sophisticated protection. Our insurance specialists provide access to USD-denominated universal life policies that serve multiple functions.",
        icon: <Shield className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
        features: [
          "USD-denominated universal life policies from top-tier insurers",
          "Flexible premium structures adapted to cash flow preferences",
          "Investment options, including private equity and hedge fund access",
          "Estate planning benefits, including generation-skipping transfers",
          "Tax optimization across multiple jurisdictions",
          "Policy loans for liquidity without tax consequences",
        ],
      },
      {
        title: "Family Office & Estate Planning",
        subtitle: "Governance for generations.",
        description:
          "When family wealth reaches certain levels, traditional financial advice becomes insufficient. Family office structures provide comprehensive governance and investment oversight.",
        icon: <Users className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        features: [
          "Governance: Family constitution development, decision-making frameworks",
          "Investment Management: Diversified portfolio oversight, alternative investments access",
          "Tax Optimization: Multi-jurisdictional strategies, transfer pricing optimization",
          "Succession Planning: Next-generation preparation, leadership development",
          "Risk Management: Political risk assessment, asset protection strategies",
          "Legacy Preservation: Values integration, philanthropic structure development",
        ],
      },
      {
        title: "Private Banking & Investment Access",
        description:
          "The world's most sophisticated financial services aren't advertised, they're accessed through relationships. Our banking partnerships provide entry to institutions that manage money for established wealthy families.",
        icon: <Clock className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop",
        features: [
          "Swiss private banks with discretionary portfolio management",
          "London-based wealth managers specializing in international clients",
          "Offshore banking solutions in stable, regulated jurisdictions",
          "Currency hedging and international cash management",
          "Structured products for specific investment objectives",
          "Credit facilities secured by global asset portfolios",
        ],
      },
    ],
    contact: {
      title: "Ready to Build Your Legacy?",
      description:
        "Sorted Heritage works exclusively with individuals and families with a net worth exceeding $2 million. Our services require substantial commitment and long-term thinking.",
      email: "[Email Address]",
      phone: "[Phone Number]",
    },
  },
};

export default function ServiceItem() {
  const { id } = useParams<{ id: string }>();
  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [sectionsRef, sectionsInView] = useInView({ threshold: 0.1 });
  const [tiersRef, tiersInView] = useInView({ threshold: 0.1 });

  const service = id ? serviceContent[id] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-cinzel font-bold text-white mb-4">
            Service Not Found
          </h1>
          <Button
            asChild
            variant="outline"
            className="border-secondary text-white hover:bg-secondary hover:text-black"
          >
            <Link href="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center"
        ref={heroRef}
      >
        <div className="absolute inset-0">
          <img
            src={service.heroImage}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <Button
              asChild
              variant="ghost"
              className="text-white hover:text-secondary mb-6 p-0"
            >
              <Link href="/services" className="flex items-center">
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Services
              </Link>
            </Button>

            <div className="flex items-center mb-6">
              {service.icon}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold uppercase tracking-widest text-white ml-4">
                {service.title}
              </h1>
            </div>

            <p className="text-secondary text-lg font-archivo uppercase tracking-wider mb-4">
              {service.subtitle}
            </p>

            <p className="text-lg sm:text-xl font-archivo text-muted-foreground mb-8 leading-relaxed max-w-3xl">
              {service.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {service.tiers ? (
                <Button
                  onClick={() =>
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-4 font-archivo uppercase tracking-wider"
                >
                  View Pricing Plans
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-4 font-archivo uppercase tracking-wider"
                >
                  <Link href="/contact">Request Consultation</Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="border-secondary text-white hover:bg-secondary hover:text-black px-8 py-4 font-archivo uppercase tracking-wider"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Tiers (only for Sorted Lifestyle) */}
      {service.tiers && (
        <section
          id="pricing"
          className="py-16 md:py-24 bg-card/5"
          ref={tiersRef}
        >
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={
                tiersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-6">
                Membership Tiers
              </h2>
              <p className="text-lg font-archivo text-muted-foreground">
                Choose the level of luxury lifestyle management that fits your
                needs
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {service.tiers.map((tier, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={
                    tiersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                  }
                  transition={{
                    duration: 0.8,
                    delay: index * 0.2,
                    ease: "easeOut",
                  }}
                  className={`relative ${tier.popular ? "scale-105" : ""}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gold-gradient text-black px-4 py-1 rounded-full text-xs font-archivo uppercase tracking-wider">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <Card
                    className={`bg-card border-0 elegant-shadow h-full ${
                      tier.popular ? "border-secondary" : ""
                    }`}
                  >
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-cinzel font-bold text-white mb-2 uppercase tracking-wider">
                        {tier.name}
                      </h3>
                      <p className="text-3xl font-cinzel font-bold text-secondary mb-4">
                        {tier.price}
                      </p>
                      <p className="text-muted-foreground font-archivo mb-6">
                        {tier.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        {tier.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start">
                            <Check className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-archivo text-muted-foreground">
                              {feature}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Button
                        asChild
                        className={`w-full py-3 font-archivo uppercase tracking-wider ${
                          tier.popular
                            ? "bg-gold-gradient text-black hover:bg-secondary/80"
                            : "bg-transparent border border-secondary text-white hover:bg-secondary hover:text-black"
                        }`}
                      >
                        <Link href="/contact">Select Plan</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Sections */}
      <section className="py-16 md:py-24" ref={sectionsRef}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={
              sectionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
            }
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-6">
              What We Handle
            </h2>
          </motion.div>

          <div className="space-y-24">
            {service.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={
                  sectionsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg elegant-shadow">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      {section.icon}
                    </div>
                  </div>
                </div>

                <div
                  className={
                    index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""
                  }
                >
                  <Card className="bg-card border-0 elegant-shadow h-full">
                    <CardContent className="p-8">
                      <div className="flex items-center mb-6">
                        {section.icon}
                        <h3 className="ml-4 text-2xl sm:text-3xl font-cinzel font-bold text-white">
                          {section.title}
                        </h3>
                      </div>

                      {section.subtitle && (
                        <p className="text-secondary text-sm font-archivo uppercase tracking-wider mb-4">
                          {section.subtitle}
                        </p>
                      )}

                      <p className="text-muted-foreground font-archivo mb-8 leading-relaxed text-lg">
                        {section.description}
                      </p>

                      <div className="grid gap-8">
                        <div>
                          <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider mb-4">
                            What's Included:
                          </h4>

                          <div className="space-y-3">
                            {section.features.map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-start"
                              >
                                <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0" />
                                <p className="text-sm font-archivo text-muted-foreground">
                                  {feature}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {section.details && (
                          <div>
                            <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider mb-4">
                              Benefits:
                            </h4>

                            <div className="space-y-3">
                              {section.details.map((detail, detailIndex) => (
                                <div
                                  key={detailIndex}
                                  className="flex items-start"
                                >
                                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0" />
                                  <p className="text-sm font-archivo text-muted-foreground">
                                    {detail}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-card/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold uppercase tracking-widest text-white mb-6">
              {service.contact.title}
            </h2>
            <p className="text-lg font-archivo text-muted-foreground mb-8">
              {service.contact.description}
            </p>

            {service.contact.locations && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {service.contact.locations.map((location, index) => (
                  <Card key={index} className="bg-card border-0 elegant-shadow">
                    <CardContent className="p-6 text-center">
                      <Phone className="w-6 h-6 text-secondary mx-auto mb-3" />
                      <h4 className="font-cinzel font-bold text-white mb-2 uppercase tracking-wider">
                        {location.city}
                      </h4>
                      <p className="text-sm font-archivo text-muted-foreground">
                        {location.phone}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {(service.contact.email || service.contact.phone) && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                {service.contact.email && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-secondary mr-2" />
                    <span className="text-sm font-archivo text-muted-foreground">
                      {service.contact.email}
                    </span>
                  </div>
                )}
                {service.contact.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-secondary mr-2" />
                    <span className="text-sm font-archivo text-muted-foreground">
                      {service.contact.phone}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {service.tiers ? (
                <Button
                  onClick={() =>
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-4 font-archivo uppercase tracking-wider"
                >
                  Choose Your Plan
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-4 font-archivo uppercase tracking-wider"
                >
                  <Link href="/contact">Request Consultation</Link>
                </Button>
              )}
              <Button
                asChild
                variant="outline"
                className="border-secondary text-white hover:bg-secondary hover:text-black px-8 py-4 font-archivo uppercase tracking-wider"
              >
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
