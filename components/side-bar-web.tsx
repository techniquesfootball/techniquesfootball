"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Home, LineChart, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";

const SibeBarWeb = () => {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      <Link
        href="/first-website/admin"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname == "/first-website/admin"
            ? "text-white bg-black"
            : "text-muted-foreground"
        }`}
      >
        <Home className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        href="/first-website/admin/location"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname.startsWith("/first-website/admin/location")
            ? "text-white bg-black"
            : "text-muted-foreground"
        }`}
      >
        <ShoppingCart className="h-4 w-4" />
        Location
      </Link>
      <Link
        href="/first-website/admin/players"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname.startsWith("/first-website/admin/players")
            ? "text-white bg-black"
            : "text-muted-foreground"
        }`}
      >
        <Package className="h-4 w-4" />
        Players{" "}
      </Link>
      <Link
        href="/first-website/admin/schedule"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname.startsWith("/first-website/admin/schedule")
            ? "text-white bg-black"
            : "text-muted-foreground"
        }`}
      >
        <Users className="h-4 w-4" />
        Schedule
      </Link>
      <Link
        href="/first-website/admin/page-builder"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
          pathname.startsWith("/first-website/admin/page-builder")
            ? "text-white bg-black"
            : "text-muted-foreground"
        }`}
      >
        <LineChart className="h-4 w-4" />
        Page builder
      </Link>
    </nav>
  );
};

export default SibeBarWeb;
