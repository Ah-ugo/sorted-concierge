"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api";

export default function ContactPage() {
  const { toast } = useToast();
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [infoRef, infoInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send contact message to API
      await apiClient.sendContactMessage(formData);

      toast({
        title: "Message Sent!",
        description:
          "We've received your message and will get back to you shortly.",
        action: (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        ),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-neutral-900">
            <div className="h-full w-full bg-[url('/image9.png')] bg-cover bg-center bg-no-repeat opacity-50" />
          </div>
        </motion.div>

        <div className="container relative z-10 mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mx-auto max-w-3xl"
          >
            <p className="mb-4 text-center font-medium uppercase tracking-wider text-white/90">
              REACH OUT TO US
            </p>
            <h1 className="mb-6 text-center text-4xl font-bold uppercase tracking-widest text-white md:text-5xl">
              GET IN TOUCH
            </h1>
            <p className="text-lg text-white/80">
              Have questions or need assistance? Our team is here to help you
              with any inquiries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-white py-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <motion.div
              ref={infoRef}
              initial={{ opacity: 0, x: -40 }}
              animate={
                infoInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }
              }
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="mb-8 text-3xl font-light uppercase tracking-widest text-neutral-800">
                Contact Information
              </h2>
              <p className="mb-12 text-lg text-neutral-700">
                Feel free to reach out to us through any of the following
                channels. We're available 24/7 to assist you with your concierge
                needs.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-400/10">
                    <MapPin className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-light uppercase tracking-wider text-neutral-800">
                      Our Location
                    </h3>
                    <p className="text-neutral-600">
                      123 Victoria Island, Lagos, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-400/10">
                    <Phone className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-light uppercase tracking-wider text-neutral-800">
                      Phone Number
                    </h3>
                    <p className="text-neutral-600">+234 123 456 7890</p>
                    <p className="text-neutral-600">+234 987 654 3210</p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-400/10">
                    <Mail className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-light uppercase tracking-wider text-neutral-800">
                      Email Address
                    </h3>
                    <p className="text-neutral-600">info@naijaconcierge.com</p>
                    <p className="text-neutral-600">
                      support@naijaconcierge.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-400/10">
                    <Clock className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-light uppercase tracking-wider text-neutral-800">
                      Working Hours
                    </h3>
                    <p className="text-neutral-600">24/7 Concierge Service</p>
                    <p className="text-neutral-600">
                      Office Hours: 9 AM - 6 PM (Mon-Fri)
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <div className="mt-12 h-[300px] overflow-hidden rounded-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7286885532443!2d3.4226242!3d6.4280555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf53280e7648d%3A0x4d01e5de6b847fe!2sVictoria%20Island%2C%20Lagos!5e0!3m2!1sen!2sng!4v1652345678901!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: 40 }}
              animate={
                formInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }
              }
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <Card className="overflow-hidden border-none bg-neutral-50 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="mb-8 text-3xl font-light uppercase tracking-widest text-neutral-800">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium uppercase tracking-wider"
                      >
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        disabled={isSubmitting}
                        className="border-neutral-300 bg-white py-6 text-neutral-800 focus:border-teal-400 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium uppercase tracking-wider"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        disabled={isSubmitting}
                        className="border-neutral-300 bg-white py-6 text-neutral-800 focus:border-teal-400 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="phone"
                        className="mb-2 block text-sm font-medium uppercase tracking-wider"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        disabled={isSubmitting}
                        className="border-neutral-300 bg-white py-6 text-neutral-800 focus:border-teal-400 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="subject"
                        className="mb-2 block text-sm font-medium uppercase tracking-wider"
                      >
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter the subject of your message"
                        required
                        disabled={isSubmitting}
                        className="border-neutral-300 bg-white py-6 text-neutral-800 focus:border-teal-400 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="message"
                        className="mb-2 block text-sm font-medium uppercase tracking-wider"
                      >
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter your message"
                        rows={6}
                        required
                        disabled={isSubmitting}
                        className="border-neutral-300 bg-white text-neutral-800 focus:border-teal-400 focus:ring-teal-400"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-teal-400 py-6 text-sm font-medium uppercase tracking-widest text-neutral-900 hover:bg-teal-500"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative aspect-[21/9] w-full"
        style={{ minHeight: "300px" }}
      >
        <div className="absolute inset-0 bg-neutral-900">
          <div className="h-full w-full bg-[url('/image10.png')] bg-cover bg-center bg-no-repeat opacity-30" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8 text-3xl font-light uppercase tracking-widest text-white md:text-4xl">
              Begin Your Journey
            </h2>
            <Button
              asChild
              className="bg-teal-400 px-8 py-6 text-sm font-medium uppercase tracking-widest text-neutral-900 hover:bg-teal-500"
            >
              <a href="/booking">Book Now</a>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
