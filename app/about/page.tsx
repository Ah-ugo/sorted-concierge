"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { Check, Users, Award, Clock } from "lucide-react";
import TeamMemberCard from "@/components/team-member-card";

export default function AboutPage() {
  const [missionRef, missionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [valuesRef, valuesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [teamRef, teamInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const teamMembers = [
    {
      id: 1,
      name: "Emeka Idam",
      role: "Founder & CEO",
      bio: "With over 15 years of experience in luxury hospitality, Emeka founded Sorted Concierge to bring world-class concierge services to Lagos.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Ngozi Okafor",
      role: "Head of Operations",
      bio: "Ngozi ensures that every client experience exceeds expectations through meticulous planning and flawless execution.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Emeka Nwachukwu",
      role: "Client Relations Manager",
      bio: "Emeka's extensive network and personable approach help create meaningful connections and unforgettable experiences for our clients.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      name: "Amina Bello",
      role: "Events Specialist",
      bio: "Amina brings creativity and precision to every event, ensuring that each occasion is unique and memorable.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ];

  const values = [
    {
      icon: <Check className="h-6 w-6 text-primary" />,
      title: "Excellence",
      description:
        "We are committed to delivering exceptional service that exceeds expectations in every interaction.",
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Personalization",
      description:
        "We tailor our services to meet the unique needs and preferences of each client.",
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Integrity",
      description:
        "We operate with honesty, transparency, and the highest ethical standards in all our dealings.",
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Reliability",
      description:
        "We are available 24/7 to ensure that our clients receive prompt and dependable service.",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">
              About Us
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
            <p className="text-gray-600 text-lg mb-8">
              Sorted Concierge was founded with a vision to redefine luxury
              lifestyle management in Lagos. We combine local expertise with
              international standards to provide unparalleled concierge
              services.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white" ref={missionRef}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={
                missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }
              }
              transition={{ duration: 0.8 }}
              className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden"
            >
              <Image
                src="https://img.freepik.com/free-photo/young-african-american-waiter-man-hold-tray-with-burger-restaurant-show-thumb-up_627829-13236.jpg?ga=GA1.1.1637729209.1747454173&semt=ais_hybrid&w=740"
                alt="Our mission"
                fill
                className="object-cover rounded-lg"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={
                missionInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">
                Our Mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Elevating Experiences, One Client at a Time
              </h2>
              <p className="text-gray-600 mb-6">
                Our mission is to provide exceptional concierge services that
                enhance the lives of our clients by saving them time, reducing
                stress, and creating memorable experiences.
              </p>
              <p className="text-gray-600 mb-8">
                We strive to be the most trusted concierge service in Nigeria,
                known for our attention to detail, personalized approach, and
                unwavering commitment to excellence.
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Link href="/services">Discover Our Services</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50" ref={valuesRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">
              Our Values
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              What Drives Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our core values guide everything we do and shape the way we
              interact with our clients and partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white" ref={teamRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary px-4 py-1">
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Meet the Experts
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of dedicated professionals is committed to providing
              exceptional service and creating unforgettable experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={
                  teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                }
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TeamMemberCard member={member} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Our Service?
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Let us help you make the most of your time in Lagos with our
              premium concierge services.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
