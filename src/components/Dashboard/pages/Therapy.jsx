import React from "react";
import { motion } from "framer-motion";

const sections = [
  {
    title: "Prayatna Offers Best Online Therapy Programs",
    text: "Our online assessment is similar to our regular assessment process, involving standardized tests, interviews, and clinical observations. We provide a range of services including speech therapy, occupational therapy, and behavioral therapy. Each session is structured, ensuring measurable progress for every child.",
    button: "Book Appointment",
    image: "/images/image1.jpg",
  },
  {
    title: "Why Choose Prayatna for Your Child’s Online Therapy Needs?",
    text: "Prayatna provides comprehensive online therapy for children, addressing various developmental needs. We ensure accessibility, convenience, and individualized care tailored to your child's specific needs.",
    button: "Know More",
    image: "/images/image2.jpg",
  },
  {
    title: "Parent Training and Guidance",
    text: "Parents play a crucial role in their child's therapy. Our training sessions empower parents with strategies to support their child's development effectively, ensuring continuity in progress.",
    button: "Schedule Chat",
    image: "/images/image3.jpg",
  },
  {
    title: "Attend to Your Child’s Therapy Needs from the Comfort of Your Home",
    text: "Our teletherapy model ensures that your child can receive quality care from home. Our therapists use interactive techniques to engage children in a structured, goal-oriented manner.",
    button: "Book Now",
    image: "/images/image4.jpg",
  },
  {
    title: "How does it work?",
    text: "Our online therapy process involves a structured plan, periodic evaluations, and expert consultation to ensure optimal progress for your child. We use interactive tools, games, and activities to make learning engaging.",
  },
];

const Section = ({ title, text, button, image, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col md:flex-row items-center gap-8 mb-12 p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50 hover:shadow-xl transition-all duration-500 
        ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
    >
      {image && (
        <div className="w-full md:w-1/2">
          <motion.div
            className="relative group overflow-hidden rounded-xl shadow-md"
          >
            <img 
              src={image} 
              alt={title}
              className="w-full h-[350px] object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4CAF50]/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
              <span className="text-white font-medium px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                Learn More
              </span>
            </div>
          </motion.div>
        </div>
      )}
      <div className="w-full md:w-1/2 space-y-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-[#333333] leading-tight"
        >
          {title}
        </motion.h2>
        <p className="text-[#6C757D] leading-relaxed text-lg">{text}</p>
        {button && (
          <motion.button 
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="group px-8 py-3.5 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-xl font-medium
              shadow-lg shadow-[#4CAF50]/20 hover:shadow-xl hover:shadow-[#4CAF50]/30 
              transition-all duration-300 flex items-center gap-2"
          >
            {button}
            <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default function OnlineTherapy() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-[400px] rounded-2xl overflow-hidden mb-16 shadow-xl"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/header.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#4CAF50]/90 to-[#45a049]/80" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold">Online Therapy Services</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Professional therapeutic support for your child's development, available from the comfort of your home
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Dynamic Sections */}
      <div className="space-y-8">
        {sections.map((section, index) => (
          <Section key={index} {...section} index={index} />
        ))}
      </div>

      {/* Ready to Start CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-12 bg-[#4CAF50]/5 backdrop-blur-sm rounded-2xl text-center border border-[#4CAF50]/10 shadow-lg"
      >
        <h2 className="text-3xl font-bold text-[#333333] mb-4">Ready to Start?</h2>
        <p className="text-lg text-[#6C757D] mb-8 max-w-2xl mx-auto leading-relaxed">
          Get in touch with our therapy team today and take the first step towards your child's development journey.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-xl font-medium 
                     shadow-lg shadow-[#4CAF50]/20 hover:shadow-xl hover:shadow-[#4CAF50]/30 
                     transition-all duration-300"
        >
          Schedule a Consultation
          <i className="ri-arrow-right-line ml-2"></i>
        </motion.button>
      </motion.div>
    </div>
  );
}
