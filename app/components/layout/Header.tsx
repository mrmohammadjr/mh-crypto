"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/app/assets/logo.webp";
import Link from "next/link";
import { useSession,signOut } from "next-auth/react";
import { ROUTES } from "@/lib/constants";

const Header = () => {
  
  const { data: session, status } = useSession();
  return (
    <div className="p-5 flex items-center justify-between bg-gradient-to-r from-black to-[#2d2d2d]">
      <Link href={ROUTES.home}>
        <Image src={Logo} alt="logo" className="w-22" />
      </Link>
      <ul className="flex items-center px-5 gap-5 text-white">
        <li>
          <Link
            href={ROUTES.currency}
            className="hover:text-green-400 transition"
          >
            Currencies
          </Link>
        </li>
        <li>
          <Link href={ROUTES.chart} className="hover:text-green-400 transition">
            Chart
          </Link>
        </li>
        {status === "authenticated" && session?.user ? (
          <>
            <li>
              <Link
                href={ROUTES.dashboard}
                className="hover:text-green-400 transition"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <button
                   onClick={() => signOut({ callbackUrl: "/login" })}
                className="hover:text-green-400 transition"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              href={ROUTES.login}
              className="hover:text-green-400 transition"
            >
              Login
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;
