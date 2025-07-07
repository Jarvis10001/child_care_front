import React from "react";
import img1 from '../../assets/img2.jpg';

const Steps = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-[#f0f7f0] w-full">
      <section className="relative overflow-hidden pl-20">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#4CAF50] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5C9DFF] opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto py-20 px-4 sm:px-6 lg:px-8 relative">
          {/* Title Section */}
          <div className="max-w-lg mb-16 ml-8">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-[#4CAF50] uppercase bg-[#4CAF50]/10 rounded-full">Our Process</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3 sm:text-4xl lg:text-5xl">
              Our Strategic <span className="text-[#4CAF50] relative">Approach
                <svg className="absolute bottom-1 left-0 w-full h-3 -z-10 text-[#4CAF50]/10" viewBox="0 0 172 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 15.5C1 15.5 64 1 86 1C108 1 171.5 15.5 171.5 15.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            {/* Image Section with enhanced styling */}
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#4CAF50]/20 to-[#5C9DFF]/20 rounded-lg transform rotate-3"></div>
              <img 
                src={img1} 
                alt="Steps Process" 
                className="relative rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" 
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#4CAF50]/20 rounded-full"></div>
            </div>

            {/* Content Section */}
            <div className="max-w-lg mx-auto md:mr-20 order-1 md:order-2">
              <div className="space-y-8">
                {[
                  {
                    step: "1",
                    title: "Market Research and Analysis",
                    description: "Identify your target audience and understand their needs, preferences, and behaviors."
                  },
                  {
                    step: "2",
                    title: "Product Development and Testing",
                    description: "Develop digital products or services that address the needs and preferences of your target audience."
                  },
                  {
                    step: "3",
                    title: "Marketing and Promotion",
                    description: "Develop a comprehensive marketing strategy to promote your digital products or services."
                  },
                  {
                    step: "4",
                    title: "Launch and Optimization",
                    description: "Launch your digital products or services to the market, closely monitoring their performance and user feedback."
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4 relative">
                    <div className="relative">
                      <div className="border-2 border-[#4CAF50] text-[#4CAF50] bg-white rounded-full w-10 h-10 flex items-center justify-center font-bold relative z-10">
                        {step.step}
                      </div>
                      {index < 3 && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-px h-16 bg-gradient-to-b from-[#4CAF50]/20 to-[#5C9DFF]/20"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <a href="#" 
                   className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-full hover:from-[#45a049] hover:to-[#3d8b40] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span className="font-medium">Start The Process</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                    &#8594;
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Steps;
