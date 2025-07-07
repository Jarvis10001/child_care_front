import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    sex: '',
    dob: userData?.dob?.split('T')[0] || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Form submitted:', formData);
  };

  const inputClasses = `
    w-full p-3 rounded-xl 
    bg-[#F8F9F4] border-2 border-transparent
    focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 
    hover:border-[#4CAF50]/30
    transition-all duration-300
    text-[#333333] placeholder-[#6C757D]/60
  `;

  return (
    <section className="py-10 my-auto">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-[#4CAF50]/20 to-[#45a049]/20">
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-[#4CAF50]/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-[#4CAF50]">
                      {userData?.firstName?.[0]}
                    </span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-[#4CAF50]/10 transition-colors"
                >
                  <i className="ri-camera-line text-[#4CAF50] text-xl"></i>
                  <input type="file" className="hidden" />
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 pt-20 pb-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#333333]">Profile Settings</h1>
              <p className="text-[#6C757D] text-sm mt-1">Update your personal information</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[#333333] font-medium block">First Name</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[#333333] font-medium block">Last Name</label>
                  <input
                    type="text"
                    className={inputClasses}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              {/* Additional Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[#333333] font-medium block">Sex</label>
                  <select
                    className={inputClasses}
                    value={formData.sex}
                    onChange={(e) => setFormData({...formData, sex: e.target.value})}
                  >
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[#333333] font-medium block">Date of Birth</label>
                  <input
                    type="date"
                    className={inputClasses}
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full p-4 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#4CAF50]/20 transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-save-line"></i>
                    Save Changes
                  </span>
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
