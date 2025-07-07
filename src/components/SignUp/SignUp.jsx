import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../../config/environment'; // Assuming you have a config file for API base URL

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '',
    relation: 'Parent'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        dob: formData.dob,
        relation: formData.relation
      });

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        // Redirect to dashboard or login
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inputClasses = `
    w-full text-sm px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg
    focus:outline-none focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20
    text-[#333333] placeholder-[#6C757D]
    transition-all duration-300
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4CAF50]/5 via-white to-[#4CAF50]/5 relative overflow-hidden">
      {/* Add Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 text-[#4CAF50] bg-transparent hover:bg-white/90 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg border border-[#4CAF50]/20"
      >
        <i className="ri-arrow-left-s-line text-xl"></i>
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="absolute inset-0 bg-[#4CAF50]/5 backdrop-blur-3xl"></div>
      
      <div className="relative min-h-screen sm:flex sm:flex-row justify-center items-center">
        {/* Left side content */}
        <div className="flex-col flex self-center lg:px-14 sm:max-w-4xl xl:max-w-md z-10">
          <div className="self-start lg:flex flex-col text-[#333333]">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Link to="/" className="inline-flex items-center">
                <div className="w-8 h-8 bg-[#4CAF50] rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">B</span>
                </div>
                <span className="ml-2 text-lg font-bold text-[#333333]">
                  BabyDev<span className="text-[#4CAF50]">.</span>
                </span>
              </Link>
            </motion.div>
            
            <h1 className="mb-2 font-semibold text-3xl">Create Account</h1>
            <p className="pr-3 text-sm text-[#6C757D] opacity-75">
              Start your journey in tracking your child's development
            </p>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="flex justify-center self-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white/80 backdrop-blur-xl mx-auto rounded-2xl w-[400px] shadow-xl"
          >
            <div className="mb-6">
              <h3 className="font-semibold text-xl text-[#333333]">Sign Up</h3>
              <p className="text-sm text-[#6C757D]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#4CAF50] hover:text-[#45a049]">
                  Sign In
                </Link>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-[#4CAF50]/20 hover:bg-[#4CAF50]/5 transition duration-300">
                <img className="w-5 h-5" src="https://static.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google" />
                <span className="text-sm">Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-[#4CAF50]/20 hover:bg-[#4CAF50]/5 transition duration-300">
                <i className="ri-apple-fill text-xl"></i>
                <span className="text-sm">Apple</span>
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-[#6C757D]">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-50 text-red-500 text-sm border border-red-100"
                >
                  {error}
                </motion.div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Email"
                required
              />

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#6C757D] ml-1">
                  {/* Date of Birth */}
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className={`${inputClasses} cursor-pointer`}
                  required
                  max={new Date().toISOString().split('T')[0]} // Prevents future dates
                />
              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Password"
                required
              />

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClasses}
                placeholder="Confirm Password"
                required
              />

              <select
                name="relation"
                value={formData.relation}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">Select Relationship</option>
                <option value="Parent">Parent</option>
                <option value="Guardian">Guardian</option>
                <option value="Caregiver">Caregiver</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-2.5 rounded-lg font-semibold transition duration-300
                  ${loading 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-[#4CAF50] hover:bg-[#45a049] text-white shadow-md shadow-[#4CAF50]/20'
                  }
                `}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#4CAF50" fillOpacity="0.05" d="M0,224L80,197.3C160,171,320,117,480,117.3C640,117,800,171,960,197.3C1120,224,1280,224,1360,224L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default SignUp;
