import React from "react";
import Link from "next/link";
// import { ROUTES } from "@/lib/constants";

const Intro = () => {
  return (
    <div className="introSection w-full h-[100vh] bg-cover bg-center">
      <div className="backdrop-blur-xs bg-black/30 w-full h-full p-10 flex flex-col items-center justify-center">
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center max-w-2xl mb-4">
          You can have a watchlist of your favorite{" "}
          <span className="text-yellow-400">currency</span>
        </h1>
        <p className="text-lg text-gray-200 mb-8 text-center max-w-xl">
          Create an account and start tracking real-time prices, set alerts, and
          never miss a market move.
        </p>
        <Link
          href={"/register"}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Intro;
