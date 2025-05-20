import type React from "react";
import type { Metadata } from "next";
import { Cinzel, Lato, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";
import { CurrencyProvider } from "@/lib/currency-context";
import Header from "@/components/header1";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import WhatsAppChat from "@/components/whatsapp-chat";
import ClientLayoutWrapper from "@/components/client-layout-wrapper";
import Preloader from "@/components/preloader";
import CursorGlow from "@/components/cursor-glow";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Sorted Concierge | Bespoke Luxury Services",
  description:
    "Curate extraordinary experiences in Lagos with our exclusive concierge services, tailored for the discerning.",
  keywords: "concierge, lagos, nigeria, luxury, bespoke, travel, lifestyle",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cinzel.variable} ${lato.variable} ${lora.variable}`}>
        <AuthProvider>
          <CurrencyProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <ClientLayoutWrapper>
                <Preloader />
                <CursorGlow />
                <Header />
                {children}
                {/* <Footer /> */}
                <Toaster />
                <WhatsAppChat />
              </ClientLayoutWrapper>
            </ThemeProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
