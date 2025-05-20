"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInView } from "react-intersection-observer";

export default function BookingConfirmation() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-neutral-50 py-32">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-teal-400/20 shadow-lg overflow-hidden">
            <div className="h-2 w-full bg-teal-400"></div>
            <CardHeader className="text-center pt-10">
              <div className="flex justify-center mb-6">
                <div className="rounded-full h-20 w-20 bg-teal-400/10 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-teal-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-light uppercase tracking-widest mb-2">
                Booking Confirmed!
              </CardTitle>
              <CardDescription className="text-lg">
                Thank you for booking with Sorted Concierge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-neutral-600">
                Your booking has been received and is being processed. You will
                receive a confirmation email shortly with all the details.
              </p>

              <div className="bg-teal-50 p-6 rounded-lg my-8">
                <h3 className="font-medium text-lg mb-4 text-teal-800">
                  Your Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10">
                      <Calendar className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Date</p>
                      <p className="font-medium">May 25, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10">
                      <Clock className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Time</p>
                      <p className="font-medium">2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10">
                      <MapPin className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Service</p>
                      <p className="font-medium">Airport Pickup</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-100 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-4">What happens next?</h3>
                <ol className="space-y-3 list-decimal list-inside text-neutral-700">
                  <li>
                    You'll receive a confirmation email with your booking
                    details
                  </li>
                  <li>Our concierge team will review your booking</li>
                  <li>
                    We'll contact you to confirm the details and arrange payment
                  </li>
                  <li>Your service will be delivered as scheduled</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center pb-10">
              <Button
                asChild
                className="bg-teal-400 hover:bg-teal-500 text-neutral-900 px-6"
              >
                <Link href="/profile">View My Bookings</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-teal-400 text-teal-600 hover:bg-teal-50"
              >
                <Link href="/">Return to Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
