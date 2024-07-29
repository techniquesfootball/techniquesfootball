// components/Navbar.tsx
"use client";
import Link from "next/link";
import * as React from "react";
import { Menu } from "lucide-react";
import LoginButton from "@/components/LoginLogoutButton";

type MenuItem = {
  title: string;
  path: string;
};

type NavbarProps = {
  menus: MenuItem[];
  logoText?: string;
  loginPath?: string;
};

export default function Navbar({
  menus,
  logoText = "Logo",
  loginPath = "/first-website/login",
}: NavbarProps) {
  const [state, setState] = React.useState(false);

  return (
    <nav className="bg-white w-full md:border-0">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5 md:block">
          <Link href="/">
            <h1 className="text-3xl font-bold">{logoText}</h1>
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li
                key={idx}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <LoginButton />
      </div>
    </nav>
  );
}
