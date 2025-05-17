"use client";

import type React from "react";

import { useSidebar } from "@/lib/sidebar-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Package,
  BarChart3,
  Settings,
  MessageSquare,
  Bell,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarLink({ href, icon, label, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
        active
          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
          : "text-gray-500 dark:text-gray-400"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function AdminSidebar() {
  const { isOpen } = useSidebar();
  const pathname = usePathname();

  const links = [
    {
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      label: "Dashboard",
    },
    {
      href: "/admin/bookings",
      icon: <Calendar className="h-4 w-4" />,
      label: "Bookings",
    },
    {
      href: "/admin/users",
      icon: <Users className="h-4 w-4" />,
      label: "Users",
    },
    {
      href: "/admin/services",
      icon: <Package className="h-4 w-4" />,
      label: "Services",
    },
    {
      href: "/admin/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
      label: "Analytics",
    },
    {
      href: "/admin/messages",
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Messages",
    },
    {
      href: "/admin/alerts",
      icon: <Bell className="h-4 w-4" />,
      label: "Alerts",
    },
    {
      href: "/admin/settings",
      icon: <Settings className="h-4 w-4" />,
      label: "Settings",
    },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center border-b border-gray-200 px-6 dark:border-gray-700">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold">Sorted Concierge</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4 px-3">
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <SidebarLink
              key={link.href}
              href={link.href}
              icon={link.icon}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/auth";
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </aside>
  );
}
