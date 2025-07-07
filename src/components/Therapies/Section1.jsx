import React from "react";
import img from '../../assets/img1.webp';

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-transparent"></div>
      
      <div className="container mx-auto px-6 lg:px-20 flex flex-col md:flex-row items-center">
        {/* Text Section */}
        <div className="md:w-1/2 z-10">
          <h1 className="text-5xl font-bold text-green-800">Prayatna</h1>
          <p className="text-gray-600 font-semibold mt-2">Shaping Future Minds</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-400 text-xl">★★★★★</span>
            <span className="text-gray-600 ml-2">(4.5 Rating)</span>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mt-4">
            We Bring Out the Best in Your Child:
          </h2>
          <p className="text-gray-700 mt-2">
            Discover Why We’re Kerala’s Top Child Development Centre.
          </p>

          {/* Buttons */}
          <div className="mt-6">
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold mr-4 hover:bg-yellow-600 transition">
              More About Prayatna Services
            </button>
            <button className="bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition">
              Online Therapy
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 flex justify-end">
          <img
            src={img}
            alt="Child"
            className="w-96 h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
