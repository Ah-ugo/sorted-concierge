"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  Plane,
  Shield,
  Star,
  Globe,
  Users,
  Car,
  Calendar,
  Heart,
  MapPin,
  Phone,
  Mail,
  Check,
  Clock,
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
  intro?: string;
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
    intro:
      "Option 2: You move cities. We move the pieces. From private arrivals to flawless itineraries, Sorted Lifestyle delivers seamless, high-touch service across the world’s busiest cities, so you never break stride.",
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
        description:
          "Your schedule doesn't bend to airline timetables. Our aviation division connects you with vetted aircraft operators across six continents, ensuring your travel aligns with your agenda, not theirs.",
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
          "Our network of internationally trained chefs creates extraordinary culinary experiences, whether you're hosting in your Lagos residence, London pied-à-terre, or Cape Town penthouse.",
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
        description:
          "Our maritime division offers access to private islands, luxury yachts, and coastal villas that are not publicly known.",
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
        description:
          "The right table. The right invitation. The right introduction. In every major city, certain doors remain closed to public access. Our relationships ensure you're always on the right side of those doors.",
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
      title: "Access Granted",
      description:
        "Because access is everything, and you're already Sorted. Contact our global concierge team to discuss your lifestyle requirements.",
      locations: [
        { city: "Lagos", phone: "+234 [Number]" },
        { city: "Nairobi", phone: "+254 [Number]" },
        { city: "Dar Es Salaam", phone: "+255 [Number]" },
        { city: "Cape Town", phone: "+27 [Number]" },
      ],
    },
  },
  "sorted-experiences": {
    title: "Sorted Experiences",
    subtitle: "Quiet luxury, Loud memories.",
    intro:
      "Sorted Experiences exist for those who understand that extraordinary moments don't happen by accident; they're orchestrated by people who refuse to accept anything less than perfection.",
    icon: <Calendar className="w-8 h-8 text-secondary" />,
    heroImage:
      "https://res.cloudinary.com/dejeplzpv/image/upload/v1749092615/naija_concierge/packages/2fef31a1-0dd1-4ae3-9fc8-6596fa22d1ed.jpg",
    sections: [
      {
        title: "Milestone Celebrations & Proposal Planning",
        subtitle: "Because some moments deserve to be perfect.",
        description:
          "Your milestone celebrations, whether marking decades of marriage, or life transitions, deserve the same attention to what makes them meaningful to you.",
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
        description:
          "From private studio visits with renowned artists to front-row access at fashion weeks across four continents, these aren't tourist experiences; they're insider access to the creative forces shaping culture.",
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
        description:
          "Each destination experience combines local expertise with our global standards, ensuring your event feels authentically connected to its location while maintaining the luxury and service levels you expect.",
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
      title: "Luxury That Leaves a Lasting Impression",
      description:
        "You dream it. We sort it. Connect with our experience architects to begin designing your next unforgettable moment. Initial consultations require no commitment. Extraordinary experiences require everything we have.",
      email: "[Email Address]",
      phone: "[Phone Number]",
    },
  },
  "sorted-heritage": {
    title: "Sorted Heritage",
    subtitle: "Legacy lives here.",
    intro:
      "True wealth isn’t about having more. It’s about protecting what matters — and ensuring your legacy lives on. Sorted Heritage links you to top-tier specialists in wealth preservation, global mobility, and intergenerational planning. Every partner is vetted. Every connection is discreet. You focus on legacy. We’ll handle the access.",
    icon: <Shield className="w-8 h-8 text-secondary" />,
    heroImage:
      "https://res.cloudinary.com/dejeplzpv/image/upload/v1749092877/naija_concierge/packages/d14935c9-ecee-43ac-94fd-cf94a301b6ee.jpg",
    sections: [
      {
        title: "Citizenship & Residency by Investment",
        description:
          "Economic shifts. Political uncertainty. Tax burdens. In today’s world, second citizenship and strategic residency are essential tools in wealth preservation. Sorted Heritage partners with top-tier global firms specializing in citizenship and residency by investment.",
        icon: <Globe className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop",
        features: [
          "Caribbean Pathways: St. Kitts & Nevis, Antigua & Barbuda",
          "European Programs: Portugal Golden Visa, Austrian & Spanish residency",
          "Strategic Options: UAE, Canada, Singapore",
        ],
        details: [
          "Visa-free access to 120+ countries",
          "Diversified asset protection and tax positioning",
          "World-class education access for children",
          "Long-term security through geopolitical diversification",
        ],
      },
      {
        title: "International Real Estate Access",
        description:
          "Real estate remains a pillar of legacy planning. Sorted Heritage works with select international property firms and private deal networks to offer you access to exclusive listings, emerging hotspots, and heritage properties in key global cities.",
        icon: <MapPin className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
        features: [
          "London: Prime Central, investment-grade heritage units",
          "Dubai: Off-plan developments and high-yield properties",
          "Lagos: Luxury residential and Grade-A commercial assets",
          "Cape Town: Waterfront villas and wine estate portfolios",
          "New York, Singapore, and beyond",
        ],
        details: [
          "Off-market property access",
          "Legal & financial due diligence",
          "Mortgage & financing solutions through international banks",
          "Rental and portfolio management",
          "Strategic exits and capital gains optimisation",
        ],
      },
      {
        title: "Life Insurance & Wealth Structuring",
        description:
          "The right insurance solutions do more than protect — they preserve, grow, and pass on wealth intelligently. Through our network of licensed insurance advisors and financial planners, we help you access USD-denominated universal life insurance policies.",
        icon: <Shield className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop",
        features: [
          "Custom-built life insurance plans from top global providers",
          "Estate tax mitigation and succession planning tools",
          "Investment-linked growth with stable currency backing",
          "Tax-deferred cash value accumulation",
          "Flexible premium and death benefit structures",
        ],
        details: [
          "Liquidity for estate taxes",
          "Multigenerational wealth strategies",
          "Cross-border portability",
          "Asset protection with privacy and discretion",
        ],
      },
      {
        title: "Family Office & Estate Planning",
        description:
          "Once wealth reaches a certain threshold, family dynamics and asset complexity require a deeper approach. We connect our clients to top-tier family office consultants, international lawyers, and fiduciary specialists who structure legacy solutions with global foresight.",
        icon: <Users className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
        features: [
          "Family constitutions and governance frameworks",
          "Tax-efficient structures and trusts across multiple jurisdictions",
          "Succession planning for business and family leadership",
          "Cross-border estate and inheritance planning",
          "Philanthropic foundations and legacy impact strategies",
        ],
      },
      {
        title: "Private Banking & Investment Access",
        description:
          "Sorted Heritage facilitates introductions to renowned private banks and boutique investment firms trusted by sovereign wealth funds and HNIs. Through these relationships, you gain access to global financial infrastructure tailored to support international living, business expansion, and intergenerational planning.",
        icon: <Clock className="w-8 h-8 text-secondary" />,
        image:
          "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop",
        features: [
          "Swiss and London-based private banks",
          "Offshore banking in secure, well-regulated jurisdictions",
          "Currency hedging, international cash management",
          "Structured finance, credit facilities, and wealth lending",
        ],
        details: [
          "Private equity and hedge funds",
          "Real assets: art, wine, collectibles",
          "Direct investment in growth-stage companies",
          "Infrastructure and impact investments with long-term returns",
        ],
      },
    ],
    contact: {
      title: "Let’s Build Your Legacy",
      description:
        "Your journey begins with a confidential conversation. We’ll connect you to the right partner — no middlemen, no distractions. We support individuals and families with a net worth of $2 million+. Our clients value privacy, legacy, and access to world-class solutions without the noise.",
      email: "[YourEmail@example.com]",
      phone: "[YourPhoneNumber]",
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
            className="border-secondary text-white hover:border-b hover:border-secondary hover:text-black"
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
        className="relative min-h-screen flex flex-col justify-center items-center"
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
            className="max-w-4xl mx-auto text-center"
          >
            <Button
              asChild
              variant="ghost"
              className="text-white hover:text-secondary bg-none hover:bg-trasparent hover:border-b hover:border-secondary hover:border-r-0 mb-6 p-0"
            >
              <Link
                href="/services"
                className="flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Services
              </Link>
            </Button>

            <div className="flex justify-center items-center mb-6">
              {/* {service.icon} */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-cinzel font-bold uppercase tracking-widest text-white ml-4">
                {service.title}
              </h1>
            </div>

            <p className="text-secondary text-lg font-crimson_pro uppercase tracking-wider mb-4 mx-auto max-w-3xl">
              {service.subtitle}
            </p>

            <p className="text-lg sm:text-xl font-crimson_pro text-muted-foreground mb-8 leading-relaxed mx-auto max-w-3xl">
              {service.intro || service.description}
            </p>

            <div className="flex justify-center">
              <Button
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-4 font-crimson_pro uppercase tracking-wider"
              >
                Choose Your Plan
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

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
              <p className="text-lg font-crimson_pro text-muted-foreground">
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
                      <span className="bg-gold-gradient text-black px-4 py-1 rounded-full text-xs font-crimson_pro uppercase tracking-wider">
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
                      <p className="text-muted-foreground font-crimson_pro mb-6">
                        {tier.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        {tier.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start">
                            <Check className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-crimson_pro text-muted-foreground">
                              {feature}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Button
                        asChild
                        className={`w-full py-3 font-crimson_pro uppercase tracking-wider ${
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
                        {/* {section.icon} */}
                        <h3 className="ml-4 text-2xl sm:text-3xl font-cinzel font-bold text-white">
                          {section.title}
                        </h3>
                      </div>

                      {section.subtitle && (
                        <p className="text-secondary text-sm font-crimson_pro uppercase tracking-wider mb-4">
                          {section.subtitle}
                        </p>
                      )}

                      <p className="text-muted-foreground font-crimson_pro mb-8 leading-relaxed text-lg">
                        {section.description}
                      </p>

                      <div className="grid gap-8">
                        <div>
                          <h4 className="text-lg font-cinzel font-bold text-white uppercase tracking-wider mb-4">
                            {section.details
                              ? "What This Means for You"
                              : "What's Included"}
                          </h4>

                          <div className="space-y-3">
                            {(section.details || section.features).map(
                              (item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="flex items-start"
                                >
                                  <div className="w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0" />
                                  <p className="text-sm font-crimson_pro text-muted-foreground">
                                    {item}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
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
            <p className="text-lg font-crimson_pro text-muted-foreground mb-8">
              {service.contact.description}
            </p>

            {service.contact.locations && (
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {service.contact.locations.map((location, index) => (
                  <Card key={index} className="bg-card border-0 elegant-shadow">
                    <CardContent className="p-6 text-center">
                      <Phone className="w-6 h-6 text-secondary mx-auto mb-3" />
                      <h4 className="font-cinzel font-bold text-white mb-2 uppercase tracking-wider">
                        {location.city}
                      </h4>
                      <p className="text-sm font-crimson_pro text-muted-foreground">
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
                    <span className="text-sm font-crimson_pro text-muted-foreground">
                      {service.contact.email}
                    </span>
                  </div>
                )}
                {service.contact.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-secondary mr-2" />
                    <span className="text-sm font-crimson_pro text-muted-foreground">
                      {service.contact.phone}
                    </span>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={() =>
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-gold-gradient text-black hover:bg-secondary/80 px-8 py-4 font-crimson_pro uppercase tracking-wider"
            >
              Choose Your Plan
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
