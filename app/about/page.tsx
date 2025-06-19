"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Globe, Award, Users, Eye, Heart } from "lucide-react";

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const values = [
    {
      number: "01",
      title: "Privacy First",
      description:
        "Every Sorted client is protected by strict confidentiality and NDAs. What we do for you stays between us.",
      icon: Shield,
    },
    {
      number: "02",
      title: "Excellence & Trust",
      description:
        'We don\'t believe in "good enough." We treat every task like it matters because to you, it does.',
      icon: Award,
    },
    {
      number: "03",
      title: "Global, But Personal",
      description:
        "We're built to support you across borders. Whether in Lagos, London, or Dubai, our team moves with you, adapts to your style, and respects your rhythm.",
      icon: Globe,
    },
  ];

  const clientTypes = [
    "Private clients & HNW families",
    "Entertainment professionals & talent teams",
    "Luxury brand directors",
    "Executive assistants, chiefs of staff, and private office teams",
    "Diaspora and international clients visiting or relocating",
    "Family offices seeking full-service lifestyle and travel support",
  ];

  const workingProcess = [
    "A dedicated lifestyle manager who knows your preferences and handles your requests",
    "Fast, responsive communication with full discretion",
    "Quiet, efficient execution, no micromanaging required",
    "A global support network across key cities, vendors, and vetted partners",
    "No cut corners, ever. If we promise it, we deliver it.",
  ];

  const globalLocations = [
    { flag: "🇬🇧", city: "London" },
    { flag: "🇳🇬", city: "Lagos" },
    { flag: "🇦🇪", city: "Dubai" },
    { flag: "🇫🇷", city: "Paris" },
    { flag: "🇺🇸", city: "New York" },
    { flag: "🇬🇭", city: "Accra" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/image27.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-background/50" />

        <motion.div
          className="relative z-10 text-center text-foreground max-w-4xl mx-auto px-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">About Sorted</h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-crimson_pro leading-relaxed">
            Born in Lagos. Built for the world.
          </p>
        </motion.div>
      </section>

      {/* Our Origins */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              Our Origins
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Lagos skyline"
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed font-crimson_pro text-muted-foreground">
                  Sorted started with one goal: to make life easier for people
                  who live fast, travel often, and can't afford chaos.
                </p>
                <p className="text-lg font-crimson_pro leading-relaxed text-muted-foreground">
                  Our founder, a corporate strategist and lifestyle consultant,
                  repeatedly saw the same problem: clients had access to luxury
                  but still had to chase details, fix mistakes, and explain
                  things twice.
                </p>
                <p className="text-lg font-crimson_pro leading-relaxed text-muted-foreground">
                  What began as a private network serving a few Lagos-based
                  executives and diaspora clients has quickly grown into a
                  trusted global service for HNWIs, founders, creatives, and
                  luxury brands across Lagos, London, Dubai, Paris, and beyond.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder Profile */}
      <section className="py-20 bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              Founder's Profile
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Emeka Idam</h3>
                <p className="text-lg font-crimson_pro text-muted-foreground">
                  Founder of Sorted Concierge
                </p>
                <p className="text-lg font-crimson_pro leading-relaxed text-muted-foreground">
                  Some people build businesses. He built a solution.
                </p>
                <p className="text-lg font-crimson_pro leading-relaxed text-muted-foreground">
                  After years of working with high-profile individuals and
                  executives, and as a global traveler himself, Emeka saw the
                  same pattern repeat: people had access to luxury, but not the
                  ease that should come with it.
                </p>
                <blockquote className="border-l-4 border-primary pl-6 font-crimson_pro italic text-lg">
                  "Luxury, to me, isn't the thing you post, it's the peace of
                  mind you feel when everything's just… handled."
                  <footer className="mt-2 text-muted-foreground font-crimson_pro">
                    — Emeka Idam
                  </footer>
                </blockquote>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Emeka Idam"
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              Who We Serve
            </h2>
            <p className="text-lg text-center font-crimson_pro text-muted-foreground mb-12 max-w-3xl mx-auto">
              We work with a small, highly selective group of clients who value
              their privacy, their time, and doing things right the first time.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clientTypes.map((type, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 mb-4 text-secondary font-crimson_pro" />
                    <p className="text-lg">{type}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              How We Work
            </h2>
            <p className="text-lg text-center text-muted-foreground mb-12 font-crimson_pro max-w-3xl mx-auto">
              Every Sorted engagement is personal. There are no cookie-cutter
              packages. No generic templates.
            </p>
            <div className="space-y-6">
              {workingProcess.map((process, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-card rounded-lg shadow-sm"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-lg text-muted-foreground font-crimson_pro">
                    {process}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-8 text-center">
                      <div className="text-4xl font-bold mb-4">
                        {value.number}
                      </div>
                      <IconComponent className="w-12 h-12 mx-auto mb-4 text-secondary" />
                      <h3 className="text-xl font-semibold mb-4">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground font-crimson_pro leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Access */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              Global Access
            </h2>
            <p className="text-lg font-crimson_pro text-center text-primary-foreground/80 mb-12">
              Sorted currently supports clients across:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {globalLocations.map((location, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-2">{location.flag}</div>
                  <p className="text-lg font-crimson_pro">{location.city}</p>
                </div>
              ))}
            </div>
            <p className="text-center font-crimson_pro text-primary-foreground/80 mt-8">
              And extends to seasonal travel and custom destination requests.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policies */}
      <section className="py-20 bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
              Our Policies & Approach
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  How We Work With Clients
                </h3>
                <ul className="space-y-4 text-muted-foreground font-crimson_pro">
                  <li>• Sorted is a private, membership-based service</li>
                  <li>
                    • All new clients go through an intake and onboarding
                    process
                  </li>
                  <li>
                    • Services available by membership, bespoke packages, or
                    referral-only projects
                  </li>
                  <li>
                    • Urgent or one-time requests may be accepted based on
                    bandwidth and alignment
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6">Confidentiality</h3>
                <p className="text-muted-foreground mb-6 font-crimson_pro">
                  Strict confidentiality protocols and NDAs protect client data
                  and activity. We do not disclose, promote, or reference client
                  names, photos, or stories unless explicitly permitted.
                </p>
                <h3 className="text-2xl font-semibold mb-6">Vendor Network</h3>
                <p className="text-muted-foreground font-crimson_pro">
                  We work with a curated list of vetted vendors and service
                  providers across travel, hospitality, security, wellness, and
                  logistics.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to Get Sorted?
            </h2>
            <p className="text-xl mb-8 font-crimson_pro text-primary-foreground/80">
              We're not for everyone, and that's intentional.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground font-crimson_pro text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              Contact Us
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
