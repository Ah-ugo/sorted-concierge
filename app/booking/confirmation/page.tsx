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
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export interface BookingConfirmationProps {
  booking?: {
    serviceName: string;
    bookingDate: string;
    location?: string;
  };
}

export default function BookingConfirmation({
  booking,
}: BookingConfirmationProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const router = useRouter();

  const defaultBooking = {
    serviceName: "Airport Pickup",
    bookingDate: new Date("2025-05-25T14:00:00Z").toISOString(),
    location: "Not specified",
  };

  const bookingData = booking || defaultBooking;

  const parsedDate = new Date(bookingData.bookingDate);
  const formattedDate = format(parsedDate, "PPP");
  const formattedTime = format(parsedDate, "p");

  return (
    <div className="min-h-screen bg-black py-32">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-muted/50 bg-card shadow-lg overflow-hidden">
            <div className="h-2 w-full bg-secondary-light"></div>
            <CardHeader className="text-center pt-10">
              <div className="flex justify-center mb-6">
                <div className="rounded-full h-20 w-20 bg-secondary-light/10 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-secondary-light" />
                </div>
              </div>
              <CardTitle className="text-3xl font-semibold uppercase tracking-widest text-white mb-2">
                Booking Confirmed!
              </CardTitle>
              <CardDescription className="text-lg font-normal text-muted-foreground">
                Thank you for booking with Sorted Concierge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground font-normal">
                Your booking has been received and is being processed. You will
                receive a confirmation email shortly with all the details.
              </p>
              <div className="bg-muted/20 p-6 rounded-lg my-8">
                <h3 className="font-normal text-lg text-white mb-4">
                  Your Booking Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-light/10">
                      <Calendar className="h-5 w-5 text-secondary-light" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-normal">
                        Date
                      </p>
                      <p className="font-medium font-normal">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-light/10">
                      <Clock className="h-5 w-5 text-secondary-light" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-normal">
                        Time
                      </p>
                      <p className="font-medium font-normal">{formattedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-light/10">
                      <MapPin className="h-5 w-5 text-secondary-light" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-normal">
                        Service
                      </p>
                      <p className="font-medium font-normal">
                        {bookingData.serviceName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/20 p-6 rounded-lg">
                <h3 className="font-normal text-lg text-white mb-4">
                  What happens next?
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-muted-foreground font-normal">
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
                className="bg-gold-gradient hover:bg-secondary-light/80 text-black px-6 font-normal"
              >
                <Link href="/profile">View My Bookings</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="border-secondary-light text-white hover:bg-secondary-light/10 hover:text-secondary-light font-normal"
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
