"use client";

import React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
// import { ROUTES } from "@/lib/constants";

const Banner = () => {
  useGSAP(() => {
    const tl = gsap.timeline();
    gsap.set(".text1", {
      x: "-500px",
      opacity: 0,
    });
    gsap.set(".text2", {
      y: "-100px",
      opacity: 0,
    });
    gsap.set(".buttons", {
      opacity: 0,
    });
    tl.to(".text1", {
      x: "0",
      opacity: 1,
      duration: 1,
    });
    tl.to(".text2", {
      y: "0",
      opacity: 1,
      duration: 1,
    });
    tl.to(".buttons", {
      opacity: 1,
    });
  });

  return (
    <div className="w-full flex flex-col items-center gap-10 h-[36.4rem] bg-gradient-to-l from-[#2d2d2d] to-black">
      <h1 className="text-6xl text-center mt-20 text1">
        Welcome to <span className="text-6xl text-green-500 font-bold">MH </span>
        <span className="text-6xl font-bold">Crypto</span>
      </h1>
      <p className="text2">
        You can see the status of different currencies on a chart or table
      </p>
      <section className="flex justify-center gap-5 w-full buttons">
        <Link
          href={"/chart"}
          className="px-3 py-2 bg-green-600 rounded-xl text-xl cursor-pointer hover:bg-green-500 transition"
        >
          Chart
        </Link>
        <Link
          href={"/currency"}
          className="px-3 py-2 bg-white text-black rounded-xl text-xl cursor-pointer hover:bg-gray-200 transition"
        >
          Currencies
        </Link>
      </section>
    </div>
  );
};

export default Banner;
