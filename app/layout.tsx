/** @format */

import type React from 'react';
import type { Metadata } from 'next';
import { Cinzel, Lato, Lora, Archivo, Crimson_Pro } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-context';
import { CurrencyProvider } from '@/lib/currency-context';
import Header from '@/components/header1';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import WhatsAppChat from '@/components/whatsapp-chat';
import ClientLayoutWrapper from '@/components/client-layout-wrapper';
import Preloader from '@/components/preloader';
import CursorGlow from '@/components/cursor-glow';
import localFont from 'next/font/local';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '700'],
});

const montreal = localFont({
  src: [
    {
      path: '../public/fonts/ppneuemontreal-book.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ppneuemontreal-medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ppneuemontreal-bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-montreal',
});

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['400', '700'],
});

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['400', '700'],
});

const crimson_pro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['400', '700'],
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Sorted Concierge | Bespoke Luxury Services',
  description:
    'Curate extraordinary experiences in Lagos with our exclusive concierge services, tailored for the discerning.',
  keywords: 'concierge, lagos, nigeria, luxury, bespoke, travel, lifestyle',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://thesortedconcierge.com',
    title: 'Sorted Concierge | Bespoke Luxury Services',
    description:
      'Curate extraordinary experiences in Lagos with our exclusive concierge services, tailored for the discerning.',
    siteName: 'The Sorted Concierge',
    images: [{ url: '/logo.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${lato.variable} ${lora.variable} ${archivo.variable} ${crimson_pro.variable} ${montreal.variable}`}
      >
        <AuthProvider>
          <CurrencyProvider>
            <ThemeProvider
              attribute='class'
              defaultTheme='dark'
              // enableSystem={true}
              disableTransitionOnChange
            >
              <ClientLayoutWrapper>
                <Preloader />
                <CursorGlow />
                {/* <Header /> */}
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
