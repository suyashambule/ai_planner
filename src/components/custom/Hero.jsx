import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <div className="text-center px-8">
        <h1 className="text-6xl font-bold tracking-wide leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
          Discover your next Adventures
        </h1>
        <p className="text-3xl font-light mb-8 leading-relaxed max-w-3xl mx-auto">
          Embark on a journey like no other with AI guiding your path. Your
          personal goal, redefined.
        </p>
        <Link to="/create-trip">
          <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-full shadow-xl hover:scale-110 hover:opacity-90 transition-all duration-300 ease-out">
            It's Free
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
