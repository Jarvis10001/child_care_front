import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' }
  ];

  const serviceLinks = [
    { name: 'Speech Therapy', path: '/services/speech-therapy' },
    { name: 'Physical Therapy', path: '/services/physical-therapy' },
    { name: 'Occupational Therapy', path: '/services/occupational-therapy' },
    { name: 'Early Intervention', path: '/services/early-intervention' },
    { name: 'Assessment', path: '/services/assessment' }
  ];

  const supportLinks = [
    { name: 'Support Center', path: '/support' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Documentation', path: '/docs' }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#f8fdf8] to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#4CAF50] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5C9DFF] opacity-5 rounded-full translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center group">
              <div className="p-2 rounded-xl bg-[#4CAF50]/10 group-hover:bg-[#4CAF50]/20 transition-colors duration-300">
                <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 w-8" alt="Logo" />
              </div>
              <div className="ml-3">
                <h2 className="font-bold text-xl text-[#333333]">
                  CHILD <span className="bg-[#4CAF50] text-white px-2 rounded-md">CARE</span>
                </h2>
              </div>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Empowering children with special needs through comprehensive care, 
              support, and developmental services.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="w-10 h-10 rounded-full bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white transition-colors duration-300"
                >
                  <i className={`ri-${social}-fill text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-[#4CAF50] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#4CAF50]/30 group-hover:bg-[#4CAF50] mr-3 transition-colors duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Our Services</h3>
            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-[#4CAF50] transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#4CAF50]/30 group-hover:bg-[#4CAF50] mr-3 transition-colors duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Us</h3>
            <div className="space-y-4">
              <p className="flex items-start text-gray-600">
                <i className="ri-map-pin-line text-[#4CAF50] mt-1 mr-3"></i>
                123 Healthcare Avenue, Mumbai, Maharashtra 400001, India
              </p>
              <p className="flex items-start text-gray-600">
                <i className="ri-phone-line text-[#4CAF50] mt-1 mr-3"></i>
                +91 (800) 123-4567
              </p>
              <p className="flex items-start text-gray-600">
                <i className="ri-mail-line text-[#4CAF50] mt-1 mr-3"></i>
                support@childcare.com
              </p>
              <p className="flex items-start text-gray-600">
                <i className="ri-time-line text-[#4CAF50] mt-1 mr-3"></i>
                Monday - Saturday: 9am - 6pm
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Child Care. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {supportLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-gray-600 hover:text-[#4CAF50] transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
