import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // Reduced scroll threshold
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`fixed w-full top-0 z-50 transition-all duration-700 ${isScrolled ? 'mt-0' : 'mt-1'}`}>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav className={`relative mx-4 transition-all duration-500 z-50 ${
        isScrolled 
          ? 'bg-white shadow-lg border border-gray-100' 
          : 'bg-black/20 backdrop-blur-sm border border-white/20'
      } rounded-2xl`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Updated with new color scheme */}
            <Link to="/" className="flex items-center group">
              <div className={`p-2 rounded-xl transition-colors duration-300 ${
                isScrolled
                  ? 'bg-[#4CAF50]/10 group-hover:bg-[#4CAF50]/20'
                  : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 w-8" alt="Logo" />
              </div>
              <div className="ml-3">
                <h2 className={`font-bold text-xl transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  CHILD <span className="bg-[#4CAF50] px-2 rounded-md text-white shadow-sm">CARE</span>
                </h2>
              </div>
            </Link>

            {/* Desktop Navigation - Updated styling */}
            <div className="hidden md:flex items-center space-x-1">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors duration-300 ${
                isScrolled ? 'bg-gray-100' : 'bg-white/10 backdrop-blur-sm'
              }`}>
                {[
                  { name: 'Home', path: '/' },
                  { name: 'About', path: '/about' },
                  { name: 'Services', path: '/services' },
                  { name: 'Contact', path: '#contact-section', onClick: handleContactClick },
                  { name: 'FAQ', path: '/faq' }
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={item.onClick}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-[#4CAF50] text-white'
                        : isScrolled 
                          ? 'text-gray-700 hover:text-[#4CAF50] hover:bg-[#4CAF50]/10'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Auth Buttons - Updated styling */}
              <div className={`flex items-center gap-3 ml-6 pl-6 transition-colors duration-300 ${
                isScrolled ? 'border-l border-gray-200' : 'border-l border-white/20'
              }`}>
                <Link
                  to="/login"
                  className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                    isScrolled
                      ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      : 'text-white/90 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-[#4CAF50] rounded-full hover:bg-[#45a049] transition-all duration-300 shadow-lg shadow-[#4CAF50]/20"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button - Updated */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="w-6 h-6 relative flex items-center justify-center">
                <span className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ${
                  isOpen ? 'rotate-45' : '-translate-y-2'
                }`}></span>
                <span className={`absolute w-6 h-0.5 bg-white transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'opacity-100'
                }`}></span>
                <span className={`absolute w-6 h-0.5 bg-white transform transition-all duration-300 ${
                  isOpen ? '-rotate-45' : 'translate-y-2'
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Updated styling */}
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className={`md:hidden overflow-hidden ${
            isScrolled 
              ? 'bg-white border-t border-gray-100'
              : 'bg-black/90 backdrop-blur-md border-t border-white/10'
          }`}
        >
          <div className="px-4 py-3 border-t border-gray-100">
            {['Home', 'About', 'Services', 'Contact', 'FAQ'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="block px-4 py-2.5 rounded-full text-base font-medium transition-all duration-300 hover:bg-[#4CAF50]/10 hover:text-[#4CAF50]"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
            
            <div className="pt-4 flex gap-2">
              <Link 
                to="/login"
                className="flex-1 px-4 py-2.5 text-[#4CAF50] border-2 border-[#4CAF50] rounded-full 
                         text-center hover:bg-[#4CAF50] hover:text-white transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Log In
              </Link>
              <Link 
                to="/signup"
                className="flex-1 px-4 py-2.5 bg-[#4CAF50] text-white rounded-full 
                         hover:bg-[#45a049] transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>
    </div>
  );
};

const MobileNavItem = ({ href, children, current }) => (
  <a
    href={href}
    className={`block px-4 py-2.5 rounded-full text-base font-medium transition-all duration-300 ${
      current
        ? 'bg-[#4CAF50]/10 text-[#4CAF50]'
        : 'text-[#333333] hover:bg-[#4CAF50]/10 hover:text-[#4CAF50]'
    }`}
  >
    {children}
  </a>
);

export default Navbar2;
