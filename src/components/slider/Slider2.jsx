import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Slider2 = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Special Care for Special Children",
      subtitle: "Supporting Development With Expert Care",
      description: "Comprehensive therapy and support services designed specifically for children with special needs.",
      image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1400&q=80",
      cta: "Get Started",
      stats: [
        { value: "2000+", label: "Children Helped" },
        { value: "98%", label: "Parent Satisfaction" },
        { value: "150+", label: "Expert Therapists" }
      ]
    },
    {
      title: "Early Intervention Programs",
      subtitle: "The Earlier, The Better",
      description: "Early identification and intervention is crucial for optimal development outcomes.",
      image: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&w=1400&q=80",
      cta: "Learn More",
      stats: [
        { value: "90%", label: "Success Rate" },
        { value: "6mo-3yr", label: "Best Age Range" },
        { value: "24/7", label: "Support Available" }
      ]
    },
    {
      title: "Expert Therapy Services",
      subtitle: "Personalized Care Plans",
      description: "Our experienced therapists provide customized treatment plans for each child's unique needs.",
      image: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1400&q=80",
      cta: "Book Session",
      stats: [
        { value: "15+", label: "Therapy Types" },
        { value: "1:1", label: "Personal Attention" },
        { value: "500+", label: "Success Stories" }
      ]
    }
  ];

  // Updated slide variants with slower transitions
  const slideVariants = {
    enter: (direction) => ({
      y: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)'
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)'
    },
    exit: (direction) => ({
      y: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      filter: 'blur(10px)'
    })
  };

  // Add direction state for slide transitions
  const [[page, direction], setPage] = useState([0, 0]);

  // Updated slide change handler
  const paginate = (newDirection) => {
    const newPage = (page + newDirection + slides.length) % slides.length;
    setPage([newPage, newDirection]);
  };

  // Modified useEffect for auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, [page]);

  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black"> {/* Changed background to black */}
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#4CAF50]/5 rounded-full -translate-x-1/2 -translate-y-1/2 z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5C9DFF]/5 rounded-full translate-x-1/2 translate-y-1/2 z-10"></div>

      <AnimatePresence initial={false} custom={direction} mode="popLayout"> {/* Changed mode to popLayout */}
        <motion.div
          key={page}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 100, damping: 30 }, // Reduced stiffness, increased damping
            opacity: { duration: 0.8 }, // Increased duration
            scale: { duration: 0.8 }, // Increased duration
            filter: { duration: 0.8 } // Increased duration
          }}
          className="absolute inset-0"
        >
          {/* Background Image with enhanced Gradient Overlay */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }} // Increased duration for smoother fade
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-transparent z-20"></div>
            <img
              src={slides[page].image}
              alt={slides[page].title}
              className="w-full h-full object-cover transform scale-[1.02] transition-transform duration-[2000ms]"
              style={{ backgroundColor: 'black' }} // Added black background to image
            />
          </motion.div>

          {/* Content */}
          <div className="relative z-30 h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl">
                <motion.div
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase bg-[#4CAF50]/20 backdrop-blur-sm rounded-full mb-4">
                    {slides[page].subtitle}
                  </span>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    {slides[page].title}
                  </h1>
                  
                  <p className="text-lg text-white/90 mb-8">
                    {slides[page].description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {slides[page].stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-center"
                      >
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-white/80">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="px-8 py-3 bg-[#4CAF50] text-white rounded-full hover:bg-[#45a049] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {slides[page].cta}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Enhanced Navigation Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-30">
        <button
          onClick={() => paginate(-1)}
          className="p-2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30 transition-all"
        >
          <i className="ri-arrow-left-s-line text-2xl"></i>
        </button>
        <button
          onClick={() => paginate(1)}
          className="p-2 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/30 transition-all"
        >
          <i className="ri-arrow-right-s-line text-2xl"></i>
        </button>
      </div>

      {/* Updated Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setPage([index, index > page ? 1 : -1])}
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              page === index
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider2;