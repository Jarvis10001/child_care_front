import React from 'react';
import img1 from '../../assets/devlopment_img.jpg';

const About2 = () => {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-50 to-[#f0f7f0] relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#4CAF50]/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5C9DFF]/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div className="max-w-lg mx-auto md:ml-20">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-[#4CAF50] uppercase bg-[#4CAF50]/10 rounded-full mb-4">About Us</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 sm:text-4xl lg:text-5xl">
                Welcome to <span className="text-[#4CAF50] relative">FlowBite
                  <svg className="absolute bottom-1 left-0 w-full h-3 -z-10 text-[#4CAF50]/10" viewBox="0 0 172 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 15.5C1 15.5 64 1 86 1C108 1 171.5 15.5 171.5 15.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                  </svg>
                </span>
              </h2>
              
              <div className="space-y-6">
                <p className="text-[#6C757D] text-lg leading-relaxed">
                  At FLowBite, we are dedicated to providing the highest standards of expertise in pediatric therapy.
                  Our team of experienced professionals is committed 
                  to delivering results-driven interventions tailored to each child's unique needs.
                  We believe in setting customized SMART goals—Specific, Measurable, Achievable, Relevant, and 
                  Time-bound—to ensure meaningful progress. This approach allows parents to track their child's development in real-time, 
                  fostering confidence and clarity in their therapy journey.
                  Our mission is to empower children with the 
                  skills they need to thrive, using evidence-based 
                  techniques and a compassionate, child-centered approach. Whether it's speech therapy,occupational therapy, or developmental 
                  support, we are here to guide every step of the way.
                  Join us in building a brighter future for your child.
                </p>
              </div>

              <div className="mt-10">
                <a href="#" 
                   className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-full hover:from-[#45a049] hover:to-[#3d8b40] transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <span className="font-medium">Learn more about us</span>
                  <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">
                    &#8594;
                  </span>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#4CAF50]/20 to-[#5C9DFF]/20 rounded-lg transform rotate-3"></div>
              <img 
                src={img1} 
                alt="About Us Image" 
                className="relative rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" 
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#4CAF50]/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About2;