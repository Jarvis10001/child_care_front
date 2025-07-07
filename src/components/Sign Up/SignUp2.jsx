import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import config from '../../config/environment'; // Assuming you have a config file for API base URL

const SignUp2 = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'parent' // Set default role to parent
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Note: Password will be hashed on the backend
      const response = await axios.post(`${config.API_BASE_URL}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email.toLowerCase(), // ensure email is lowercase
        password: formData.password,
        role: formData.role
      });

      if (response.data.success) {
        // Add timestamp to track registration time
        const userData = {
          ...response.data.user,
          registrationTimestamp: new Date().toISOString(),
          hasCompletedRegistration: false
        };
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Debug logging
        console.log('User registered:', userData); 
        console.log('User role:', userData.role);
        console.log('Registration completion status:', userData.hasCompletedRegistration);
        
        switch(userData.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'therapist':
            navigate('/therapist/dashboard');
            break;
          default:
            navigate('/dashboard/child/registration');
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-[#f0f7f0] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#4CAF50]/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5C9DFF]/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto min-h-screen flex flex-col px-4 relative">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 group inline-flex items-center px-5 py-2.5 bg-white text-[#4CAF50] rounded-full hover:bg-[#4CAF50] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <i className="ri-arrow-left-s-line mr-2"></i>
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl w-full">
            {/* Content Section */}
            <div className="max-w-xl space-y-6 px-4 lg:px-8">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-[#4CAF50] uppercase bg-[#4CAF50]/10 rounded-full">
                  Get Started
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-4">
                  Create Your <span className="text-[#4CAF50] relative">Account
                    <svg className="absolute bottom-1 left-0 w-full h-3 -z-10 text-[#4CAF50]/10" viewBox="0 0 172 16" fill="none">
                      <path d="M1 15.5C1 15.5 64 1 86 1C108 1 171.5 15.5 171.5 15.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
                    </svg>
                  </span>
                </h1>
                <p className="text-lg text-gray-600 mt-4 leading-relaxed">
                  Join us to access personalized support and track your child's developmental journey
                </p>
              </div>
            </div>

            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full max-w-md mx-auto lg:mx-0"
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-[#4CAF50]/20 to-[#5C9DFF]/20 rounded-xl transform rotate-2"></div>
              <div className="relative bg-white/95 backdrop-blur-xl rounded-xl shadow-xl p-8 border border-white/20">
                <div className="mb-7">
                  <h3 className="font-semibold text-2xl text-[#333333]">Sign Up</h3>
                  <p className="text-[#6C757D]">
                    Already have an account?
                    <Link to="/login" className="text-sm text-[#4CAF50] hover:text-[#45a049] ml-1">
                      Sign In
                    </Link>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                        placeholder="Last Name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#4CAF50]"
                    >
                      {showPassword ? (
                        <i className="ri-eye-off-line"></i>
                      ) : (
                        <i className="ri-eye-line"></i>
                      )}
                    </button>
                  </div>

                  <div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>

                  <div>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full text-sm px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#4CAF50]"
                    >
                      <option value="parent">Parent</option>
                      <option value="doctor">Healthcare Provider</option>
                      <option value="therapist">Therapist</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-xl font-semibold
                             shadow-lg shadow-[#4CAF50]/20 transition duration-300 disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-[#6C757D]">or sign up with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-[#4CAF50]/20 hover:bg-[#4CAF50]/5 transition duration-300"
                    >
                      <img className="w-5 h-5" src="https://static.cdnlogo.com/logos/g/35/google-icon.svg" alt="Google" />
                      <span className="text-sm text-[#333333]">Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-[#4CAF50]/20 hover:bg-[#4CAF50]/5 transition duration-300"
                    >
                      <i className="ri-apple-fill text-xl text-[#333333]"></i>
                      <span className="text-sm text-[#333333]">Apple</span>
                    </button>
                  </div>
                </form>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#4CAF50]/20 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp2;
