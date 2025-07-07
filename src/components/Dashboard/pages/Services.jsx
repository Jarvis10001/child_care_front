import React from "react";
import { motion } from "framer-motion";

// Service categories
const services = [
  { 
    name: "Speech Therapy", 
    icon: "🗣️",
    description: "Improve communication and language skills"
  },
  { 
    name: "Occupational Therapy", 
    icon: "🛠️",
    description: "Enhance daily living and motor skills"
  },
  { 
    name: "Clinical Psychology", 
    icon: "🧠",
    description: "Support emotional and behavioral development"
  },
  { 
    name: "ABA Therapy", 
    icon: "📊",
    description: "Evidence-based behavioral intervention"
  },
  { 
    name: "Behavior Therapy", 
    icon: "🙂",
    description: "Positive behavior support strategies"
  },
  { 
    name: "Special Education", 
    icon: "📚",
    description: "Individualized learning programs"
  },
  { 
    name: "Physical Therapy", 
    icon: "🏃",
    description: "Improve mobility and physical function"
  },
  { 
    name: "Early Intervention", 
    icon: "👶",
    description: "Support developmental milestones"
  }
];

// Conditions we treat
const conditions = [
  {
    title: "Autism",
    description: "Autism treatment includes behavioral therapy, speech therapy, and educational interventions tailored to the child's needs.",
  },
  {
    title: "ADHD",
    description: "ADHD treatment typically includes behavior therapy, medication, and school-based interventions to improve focus and impulse control.",
  },
  {
    title: "Cerebral Palsy",
    description: "Cerebral palsy treatment involves physical therapy, occupational therapy, and assistive devices to enhance mobility and coordination.",
  },
  {
    title: "Intellectual Disability",
    description: "Intellectual disability support includes special education, therapy, and skill development programs to enhance independence.",
  },
  {
    title: "Down Syndrome",
    description: "Down syndrome care includes early intervention, speech therapy, and occupational therapy to support cognitive and motor development.",
  },
  {
    title: "Learning Disability",
    description: "Learning disability support includes specialized education plans, tutoring, and cognitive therapy to improve learning skills.",
  },
  {
    title: "Sensory Processing Disorder",
    description: "Therapies include occupational therapy, sensory integration, and structured routines to manage sensory sensitivity.",
  },
  {
    title: "Dyslexia",
    description: "Dyslexia interventions include specialized reading programs, phonics instruction, and multi-sensory learning techniques.",
  },
];

export default function Services() {
  return (
    <div className="max-w-7xl mx-auto">
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
            <h1 className="text-4xl md:text-5xl font-bold">Specialized Services</h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Comprehensive support services tailored to your child's unique needs
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Services Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-4 py-12 mb-16"
      >
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-[#333333] mb-4">Our Services</h2>
          <p className="text-lg text-[#6C757D]">
            Comprehensive therapeutic services designed to support your child's development journey
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#4CAF50]/20"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <span className="text-4xl bg-[#4CAF50]/10 w-16 h-16 rounded-xl flex items-center justify-center text-[#4CAF50] group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-[#333333] mb-2">{service.name}</h3>
                  <p className="text-sm text-[#6C757D]">{service.description}</p>
                </div>
              </div>
              <motion.div 
                className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                initial={{ y: 10 }}
                whileHover={{ y: 0 }}
              >
                <button className="w-full py-2 px-4 text-sm text-[#4CAF50] hover:bg-[#4CAF50]/5 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                  Learn More
                  <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1"></i>
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Conditions Section */}
      <section className="px-4 py-16 bg-[#4CAF50]/5 rounded-2xl mb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-[#333333] mb-4">Conditions We Support</h2>
          <p className="text-lg text-[#6C757D]">
            Expert care and support for various developmental conditions
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {conditions.map((condition, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-[#4CAF50] mb-3">{condition.title}</h3>
              <p className="text-[#6C757D] text-sm leading-relaxed">{condition.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center px-4 py-12 bg-white rounded-2xl shadow-lg border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-[#333333] mb-4">Need Support?</h2>
        <p className="text-lg text-[#6C757D] mb-8 max-w-2xl mx-auto">
          Contact our team of experts to discuss your child's specific needs and create a personalized care plan.
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-4 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-xl font-medium
            shadow-lg shadow-[#4CAF50]/20 hover:shadow-xl hover:shadow-[#4CAF50]/30 
            transition-all duration-300 flex items-center gap-2 mx-auto"
        >
          Schedule a Consultation
          <i className="ri-arrow-right-line transition-transform group-hover:translate-x-1"></i>
        </motion.button>
      </motion.div>
    </div>
  );
}
