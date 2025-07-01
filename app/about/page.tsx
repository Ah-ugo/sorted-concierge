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
          {/* <h1 className="text-6xl md:text-8xl font-bold mb-6">About Sorted</h1> */}
          {/* <p className="text-xl md:text-2xl text-muted-foreground font-crimson_pro leading-relaxed">
            Born in Lagos. Built for the world.
          </p> */}

          <h1 className="text-3xl md:text-6xl font-bold mb-6">
            Born in Lagos. Built for the world.
          </h1>
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
                  src="/image23.jpg"
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
                  Sorted was born to change that. What began as a private
                  network serving a few Lagos-based executives and diaspora
                  clients has quickly evolved into a trusted global service for
                  high-net-worth individuals (HNWIs), founders, creatives, and
                  luxury brands across Lagos, London, Dubai, Paris, and beyond.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chief Host Profile */}
      <section className="py-20 bg-primary">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-primary-foreground">
              Chief Host's Profile
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-xl font-bold text-primary-foreground">
                  Some people build businesses. He built a solution.
                </p>
                <p className="text-lg font-crimson_pro leading-relaxed text-primary-foreground/80">
                  Our Chief Host, a corporate strategist and lifestyle
                  consultant, repeatedly saw the same problem: clients had
                  access to luxury but still had to chase details, fix mistakes,
                  and explain things twice.
                </p>
                <p className="text-lg font-crimson_pro leading-relaxed text-primary-foreground/80">
                  After years of working with high-profile individuals and
                  executives, and as a global traveler himself, Emeka observed a
                  consistent pattern: people had access to luxury, but not the
                  ease that should accompany it.
                </p>
                <p className="text-lg font-crimson_pro leading-relaxed text-primary-foreground font-medium">
                  So he built something better.
                </p>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Chief Host"
                  className="w-full h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Sorted Approach */}
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
              Our Sorted Approach
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg font-crimson_pro leading-relaxed text-muted-foreground mb-6">
                At Sorted Concierge, we operate as a private, concierge service,
                working with a select number of clients to ensure world-class
                attention and discretion. New clients go through a tailored
                intake process, and services are offered via membership, bespoke
                packages, or by referral only.
              </p>
              <p className="text-lg font-crimson_pro leading-relaxed text-muted-foreground">
                One-off requests are considered based on availability and fit.
                We maintain strict confidentiality, backed by NDAs, and only
                work with a handpicked network of vetted vendors across travel,
                security, wellness, and hospitality, each chosen for their
                reliability, and discretion.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Access */}
      <section className="pb-10 pt-0 bg-primary text-primary-foreground">
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
    </div>
  );
};

export default About;
