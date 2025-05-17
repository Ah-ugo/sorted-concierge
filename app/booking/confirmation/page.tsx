import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BookingConfirmation() {
  return (
    <div className="container max-w-4xl mx-auto py-20 px-4">
      <Card className="border-primary/20">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl">Booking Confirmed!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for booking with Sorted Concierge
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>
            Your booking has been received and is being processed. You will
            receive a confirmation email shortly with all the details.
          </p>
          <p>
            Our team will contact you to confirm the booking and provide any
            additional information you may need.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg mt-6">
            <h3 className="font-medium text-lg mb-2">What happens next?</h3>
            <ol className="text-left list-decimal list-inside space-y-2">
              <li>
                You'll receive a confirmation email with your booking details
              </li>
              <li>Our concierge team will review your booking</li>
              <li>
                We'll contact you to confirm the details and arrange payment
              </li>
              <li>Your service will be delivered as scheduled</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/profile">View My Bookings</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
