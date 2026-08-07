import React from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="mt-auto bg-black text-gray-400 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
        <div>
          <p>Designed & Created by <Link className="text-white hover:text-green-600" href={"https://mrmohammadjr.github.io/portfolio-app/"}>Mohammad Javad Rasooli</Link></p>
        </div>
        <p className="text-sm text-center">
          © {new Date().getFullYear()} MH Crypto. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
