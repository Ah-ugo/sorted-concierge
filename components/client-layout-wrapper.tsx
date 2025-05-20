"use client";

import { usePathname } from "next/navigation";
// import Header from "@/components/header";
import Footer from "@/components/footer";
import WhatsAppChat from "@/components/whatsapp-chat";
import Header from "./header1";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.includes("/admin");

  return (
    <div className="overflow-x-hidden">
      {!isAdminRoute && <Header />}
      <main className="min-h-screen">{children}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppChat />}
    </div>
  );
}
