import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState([]);

  // FAQ Categories
  const categories = [
    { id: 'all', name: 'All Questions', icon: 'ri-questionnaire-line' },
    { id: 'general', name: 'General', icon: 'ri-information-line' },
    { id: 'services', name: 'Our Services', icon: 'ri-service-line' },
    { id: 'assessment', name: 'Assessment', icon: 'ri-file-chart-line' },
    { id: 'therapy', name: 'Therapy', icon: 'ri-mental-health-line' },
    { id: 'education', name: 'Education', icon: 'ri-book-open-line' },
    { id: 'support', name: 'Support & Benefits', icon: 'ri-government-line' }
  ];

  // Enhanced FAQ data with categories and icons
  const faqsData = [
    {
      id: 1,
      category: 'general',
      question: "What is Child Care and how does it work?",
      answer: "Child Care is a comprehensive platform designed to support families with children who have special needs. We connect you with healthcare professionals, educational resources, and support services tailored to your child's specific requirements. Our platform offers assessment tools, therapy scheduling, educational institution connections, and access to government benefits.",
      icon: "ri-user-heart-line"
    },
    {
      id: 2,
      category: 'assessment',
      question: "How do I know if my child needs an assessment?",
      answer: "Consider an assessment if you notice your child is experiencing delays in development, communication difficulties, challenges with social interaction, or issues with physical skills compared to peers. Our platform provides free preliminary screening tools which can help identify potential areas of concern. Early intervention is crucial, so we recommend consulting with professionals if you have any doubts about your child's development.",
      icon: "ri-mental-health-line"
    },
    {
      id: 3,
      category: 'therapy',
      question: "What types of therapy services do you offer?",
      answer: "We offer a comprehensive range of therapy services including Speech Therapy (for communication disorders), Occupational Therapy (for daily living and motor skills), Physical Therapy (for movement and physical development), Behavioral Therapy (for behavioral challenges), and Developmental Therapy. All our therapists are certified professionals with specialized experience working with children with special needs. Sessions can be conducted both online and in person depending on your preference and specific requirements.",
      icon: "ri-psychotherapy-line"
    },
    {
      id: 4,
      category: 'services',
      question: "How do I schedule an appointment with a specialist?",
      answer: "Scheduling appointments is simple through our user-friendly dashboard. After creating an account and completing your child's profile, navigate to the 'Consultations' section, select your preferred therapy type, choose a specialist based on their expertise and reviews, and pick a convenient time slot. You can opt for either online video sessions or in-person meetings depending on availability in your area. Our system sends automatic reminders and offers easy rescheduling if needed.",
      icon: "ri-calendar-check-line"
    },
    {
      id: 5,
      category: 'services',
      question: "Are your services covered by insurance?",
      answer: "Many of our services are covered by insurance providers. We work with numerous insurance companies and government healthcare programs to ensure maximum coverage for our families. Our support team can help verify your coverage before appointments and provide necessary documentation for claims. For services not covered by insurance, we offer flexible payment plans and can guide you toward government schemes that might provide financial assistance.",
      icon: "ri-health-book-line"
    },
    {
      id: 6,
      category: 'general',
      question: "How do you ensure the quality of your professional services?",
      answer: "We maintain strict quality standards by thoroughly vetting all healthcare providers and therapists on our platform. Our professionals must possess appropriate certifications, licenses, and experience working with children with special needs. We continuously monitor service quality through parent feedback and regular performance reviews. Additionally, we provide ongoing professional development opportunities to our service providers to ensure they're up-to-date with the latest research and techniques.",
      icon: "ri-shield-check-line"
    },
    {
      id: 7,
      category: 'education',
      question: "What support do you provide for school enrollment and education?",
      answer: "Our educational support services include helping families find appropriate schools for children with special needs, coordinating with educational institutions for admissions, providing necessary documentation, developing Individual Education Plans (IEPs), facilitating communication between parents and schools, and offering resources for home-based learning. We also help advocate for appropriate accommodations and modifications in the classroom to support your child's learning journey.",
      icon: "ri-school-line"
    },
    {
      id: 8,
      category: 'support',
      question: "How can I access government schemes and benefits for my child?",
      answer: "Our platform provides comprehensive information about various government schemes and benefits available for children with special needs. We offer personalized recommendations based on your child's condition, location, and eligibility criteria. Our support team assists with documentation preparation, application submission, and follow-up with relevant authorities. We also provide guidance on disability certificates, financial assistance programs, tax benefits, and other entitlements to ensure you can access all available support.",
      icon: "ri-government-line"
    },
    {
      id: 9,
      category: 'therapy',
      question: "How long does therapy typically last, and how often are sessions scheduled?",
      answer: "The duration and frequency of therapy depend on your child's specific needs and the type of therapy. Typically, sessions last 30-60 minutes and may be scheduled 1-3 times per week initially. As your child progresses, the frequency might decrease. Our therapists regularly assess progress and adjust the treatment plan accordingly. Some children may need therapy for a few months, while others may benefit from longer-term support. We believe in a collaborative approach where parents are involved in the therapy process for better outcomes.",
      icon: "ri-time-line"
    },
    {
      id: 10,
      category: 'assessment',
      question: "What types of assessments do you provide and how are they conducted?",
      answer: "We offer a range of assessments including developmental screenings, comprehensive developmental evaluations, speech and language assessments, occupational therapy evaluations, behavioral assessments, and cognitive assessments. These can be conducted through a combination of online questionnaires, video observations, and in-person evaluations depending on the type of assessment needed. Our team of specialists uses standardized tools and clinical observations to gather comprehensive information about your child's strengths and challenges.",
      icon: "ri-file-chart-line"
    },
    {
      id: 11,
      category: 'services',
      question: "Can I access services if I live in a remote area?",
      answer: "Yes, we're committed to making services accessible regardless of your location. For families in remote areas, we offer extensive telehealth options including online therapy sessions, video consultations with specialists, and digital assessment tools. Our mobile app works even with limited connectivity, and resources can be downloaded for offline use. For services that require in-person interaction, we try to connect you with the nearest available providers and can help coordinate transportation when possible.",
      icon: "ri-global-line"
    },
    {
      id: 12,
      category: 'support',
      question: "What support is available for parents and caregivers?",
      answer: "We recognize that supporting parents is crucial for a child's development. We offer parent training programs, support groups facilitated by professionals, access to resources and educational materials, counseling services for parents, respite care information, and regular check-ins with our family support team. Our community forum allows you to connect with other parents facing similar challenges, and our parent workshops provide practical strategies for supporting your child at home.",
      icon: "ri-parent-line"
    }
  ];

  // Filter FAQs based on search query and selected category
  useEffect(() => {
    let results = faqsData;
    
    // Filter by category
    if (activeCategory !== 'all') {
      results = results.filter(faq => faq.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
      );
    }
    
    setFilteredFaqs(results);
  }, [searchQuery, activeCategory]);

  return (
    <>
      {/* Enhanced Hero Banner with improved coloring */}
      <div className="relative overflow-hidden">
        {/* Background with enhanced gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f5e9] via-[#c8e6c9] to-[#81c784] opacity-90"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#4CAF50] rounded-full opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#81c784] rounded-full opacity-20 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-[#a5d6a7] rounded-full opacity-20 translate-y-1/2"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5" 
             style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1.5\'/%3E%3C/g%3E%3C/svg%3E")',
                    backgroundSize: '20px 20px'}}></div>
                    
        {/* Content */}
        <div className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-white/30 backdrop-blur-sm text-[#1a472a] text-sm font-medium mb-4 border border-white/40">
                Support Center
              </span>
              <h1 className="text-4xl font-bold text-[#1a472a] mb-4">Frequently Asked Questions</h1>
              <p className="text-lg text-[#2e7d32] mb-8 max-w-2xl mx-auto">
                Find answers to common questions about our services and support for children with special needs
              </p>
            </motion.div>
            
            {/* Enhanced Search Bar - Removed hashtags/pattern below */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative max-w-xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-white/50 rounded-full shadow-xl focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-[#4CAF50] text-gray-900 text-lg bg-white/90 backdrop-blur-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#4CAF50] text-white p-2 rounded-full hover:bg-[#45a049] transition-colors cursor-pointer">
                  <i className="ri-search-line text-xl"></i>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Clean bottom edge - replacing the wave SVG */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>
      
      <div className="min-h-screen bg-gray-50 pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Category Tabs */}
          <div className="relative mb-8">
            {/* Container with gradient fade effects */}
            <div className="relative">
              {/* Left fade gradient for scroll indication */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
              
              {/* Right fade gradient for scroll indication */}
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
              
              {/* Category slider with enhanced styling */}
              <div className="bg-white/70 backdrop-blur-sm shadow-sm rounded-xl py-3 px-4 overflow-x-auto no-scrollbar">
                <div className="flex space-x-3 pb-1 min-w-max">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                        activeCategory === category.id
                          ? 'bg-[#4CAF50] text-white shadow-lg ring-2 ring-[#4CAF50]/20'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-100'
                      }`}
                    >
                      <i className={`${category.icon} mr-2 text-lg ${
                        activeCategory === category.id ? 'animate-pulse' : ''
                      }`}></i>
                      {category.name}
                      {activeCategory === category.id && (
                        <motion.span
                          className="ml-2 w-2 h-2 bg-white rounded-full"
                          initial={{ opacity: 0.5, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Navigation arrows for mobile */}
            <div className="md:hidden flex justify-center mt-3 space-x-2">
              <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-[#4CAF50] transition-colors">
                <i className="ri-arrow-left-s-line"></i>
              </button>
              <button className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-gray-500 hover:text-[#4CAF50] transition-colors">
                <i className="ri-arrow-right-s-line"></i>
              </button>
            </div>
          </div>

          {/* Results Counter */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Showing <span className="font-medium">{filteredFaqs.length}</span> {filteredFaqs.length === 1 ? 'result' : 'results'}
              {activeCategory !== 'all' && ` in ${categories.find(cat => cat.id === activeCategory)?.name}`}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            
            {(activeCategory !== 'all' || searchQuery) && (
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="text-sm text-[#4CAF50] hover:underline flex items-center"
              >
                <i className="ri-refresh-line mr-1"></i>
                Reset filters
              </button>
            )}
          </div>

          {/* FAQ List */}
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="ri-question-mark text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching questions found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search term or browse all categories.
              </p>
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
              >
                View all FAQs
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {filteredFaqs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:border-[#4CAF50]/30 hover:shadow-md transition-all duration-300"
                  >
                    <button
                      className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                      onClick={() => setActiveIndex(activeIndex === faq.id ? null : faq.id)}
                    >
                      <div className="flex items-center pr-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-[#4CAF50]/10 text-[#4CAF50] flex-shrink-0`}>
                          <i className={`${faq.icon || 'ri-questionnaire-line'} text-xl`}></i>
                        </div>
                        <span className="font-medium text-gray-900">{faq.question}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: activeIndex === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-[#4CAF50] flex-shrink-0"
                      >
                        <i className="ri-arrow-down-s-line text-2xl"></i>
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {activeIndex === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 py-5 border-t border-gray-100 text-gray-700 bg-gray-50">
                            <p className="whitespace-pre-line leading-relaxed">{faq.answer}</p>
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                              <span className="text-sm text-gray-500">
                                <i className="ri-folder-line mr-1"></i>
                                {categories.find(cat => cat.id === faq.category)?.name || 'General'}
                              </span>
                              <div className="flex gap-2">
                                <button className="text-sm text-[#4CAF50] hover:underline flex items-center">
                                  <i className="ri-thumb-up-line mr-1"></i> Helpful
                                </button>
                                <button className="text-sm text-[#4CAF50] hover:underline flex items-center">
                                  <i className="ri-share-line mr-1"></i> Share
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Contact Section - Enhanced */}
          <div className="mt-16 bg-white rounded-xl p-8 shadow border border-gray-200">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Still have questions?</h2>
                <p className="text-gray-600 mb-6">
                  Can't find the answer you're looking for? Our support team is ready to help you with any specific questions about our services.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link 
                    to="/contact" 
                    className="flex items-center px-6 py-3 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
                  >
                    <i className="ri-message-3-line mr-2 text-xl"></i>
                    Contact Support
                  </Link>
                  
                  <Link 
                    to="/dashboard/consultations/schedule" 
                    className="flex items-center px-6 py-3 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/20 transition-colors"
                  >
                    <i className="ri-calendar-line mr-2 text-xl"></i>
                    Schedule Consultation
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/3 bg-gray-50 p-6 rounded-xl">
                <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
                
                <div className="space-y-4 text-gray-600">
                  <div className="flex">
                    <i className="ri-phone-line text-[#4CAF50] mt-0.5 mr-3"></i>
                    <span>+1 (800) 123-4567</span>
                  </div>
                  
                  <div className="flex">
                    <i className="ri-mail-line text-[#4CAF50] mt-0.5 mr-3"></i>
                    <span>support@childcare.com</span>
                  </div>
                  
                  <div className="flex">
                    <i className="ri-time-line text-[#4CAF50] mt-0.5 mr-3"></i>
                    <div>
                      <p>Monday-Friday: 9am-6pm</p>
                      <p>Saturday: 10am-4pm</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-3">
                    <a href="#" className="w-8 h-8 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full flex items-center justify-center hover:bg-[#4CAF50] hover:text-white transition-colors">
                      <i className="ri-facebook-fill"></i>
                    </a>
                    <a href="#" className="w-8 h-8 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full flex items-center justify-center hover:bg-[#4CAF50] hover:text-white transition-colors">
                      <i className="ri-twitter-fill"></i>
                    </a>
                    <a href="#" className="w-8 h-8 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full flex items-center justify-center hover:bg-[#4CAF50] hover:text-white transition-colors">
                      <i className="ri-instagram-fill"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Resources */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Related Resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "ri-article-line",
                  title: "Blogs & Articles",
                  description: "Read our latest articles on child development and special needs care",
                  link: "/resources/blog"
                },
                {
                  icon: "ri-book-read-line",
                  title: "Resource Library",
                  description: "Download guides, worksheets, and activities for your child",
                  link: "/resources/library"
                },
                {
                  icon: "ri-video-line",
                  title: "Video Tutorials",
                  description: "Watch instructional videos and webinars from our experts",
                  link: "/resources/videos"
                }
              ].map((resource, index) => (
                <Link 
                  key={index}
                  to={resource.link}
                  className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#4CAF50]/30 hover:shadow-md transition-all duration-300 flex flex-col h-full"
                >
                  <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-full flex items-center justify-center text-[#4CAF50] mb-4">
                    <i className={`${resource.icon} text-2xl`}></i>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm flex-grow">{resource.description}</p>
                  <div className="mt-4 flex items-center text-[#4CAF50] text-sm">
                    <span>Learn more</span>
                    <i className="ri-arrow-right-line ml-1"></i>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
