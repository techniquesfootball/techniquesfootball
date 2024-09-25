"use client";
import React from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const SibeBarMobile = () => {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname == "/first-website/admin"
                ? "text-white bg-black"
                : "text-muted-foreground"
            }`}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/first-website/admin/location")
                ? "text-white bg-black"
                : "text-muted-foreground"
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            Location
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/first-website/admin/players")
                ? "text-white bg-black"
                : "text-muted-foreground"
            }`}
          >
            <Package className="h-5 w-5" />
            Players
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/first-website/admin/schedule")
                ? "text-white bg-black"
                : "text-muted-foreground"
            }`}
          >
            <Users className="h-5 w-5" />
            Schedule
          </Link>
          <Link
            href="#"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
              pathname.startsWith("/first-website/admin/page-builder")
                ? "text-white bg-black"
                : "text-muted-foreground"
            }`}
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default SibeBarMobile;
