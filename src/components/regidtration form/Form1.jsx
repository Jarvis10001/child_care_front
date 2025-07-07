import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import cityData from '../../City.json';
import api from '../../services/axiosConfig';
import axios from 'axios'; // Add direct axios import
import toast from 'react-hot-toast';
import config from '../../config/environment'; // Assuming you have a config file for API base URL

const Form1 = () => {
    const navigate = useNavigate();
    const inputClasses = `
        w-full p-3 rounded-xl 
        bg-[#F8F9F4] border-2 border-transparent
        focus:border-[#4CAF50]
        focus:ring-4 focus:ring-[#4CAF50]/10 
        focus:bg-white
        hover:border-[#4CAF50]/30
        transition-all duration-300 ease-in-out
        text-[#333333] placeholder-[#6C757D]/60
        focus:placeholder-[#4CAF50]/50
        focus:shadow-lg focus:shadow-[#4CAF50]/5
        outline-none
    `;

    const selectClasses = inputClasses + ` appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,${encodeURIComponent(
        `<svg width="20" height="20" fill="none" stroke="%234CAF50" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`
    )}')] bg-[length:20px_20px] bg-no-repeat bg-[center_right_1rem] pr-12`;

    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [filePreview, setFilePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState(null);
    const [registrationComplete, setRegistrationComplete] = useState(0);

    const MAX_FILE_SIZE = 500 * 1024; // 500KB
    const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    const validateFile = (file) => {
        if (!file) return 'Please select a file';
        if (file.size > MAX_FILE_SIZE) {
            return 'File size must be less than 500KB';
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
            return 'Only JPEG, PNG and PDF files are allowed';
        }
        return null;
    };

    // Load states on component mount
    useEffect(() => {
        setStates(Object.keys(cityData));
    }, []);

    useEffect(() => {
        const checkRegistrationStatus = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem('token');
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                
                if (!token) {
                    console.log('No token found, redirecting to login');
                    navigate('/login');
                    return;
                }
                
                // Add explicit boolean check (=== true) to avoid truthy/falsy issues
                if (userData.hasCompletedRegistration === true) {
                    console.log('Registration already completed (from localStorage), redirecting to dashboard');
                    navigate('/dashboard');
                    return;
                }
    
                // Always verify with server as source of truth
                console.log('Verifying registration status with server...');
                try {
                    const response = await axios.get(`${config.API_BASE_URL}/api/users/registration-status`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    // Use strict comparison (=== true) to ensure boolean check
                    if (response.data.hasCompletedRegistration === true) {
                        console.log('Server indicates registration complete, updating localStorage and redirecting');
                        // Update localStorage to fix any inconsistency
                        localStorage.setItem('user', JSON.stringify({
                            ...userData,
                            hasCompletedRegistration: true
                        }));
                        
                        navigate('/dashboard');
                        return;
                    } else {
                        console.log('Registration not completed, showing form');
                        // Pre-populate form with existing user data
                        if (userData.firstName || response.data.userData?.firstName) {
                            setFormData(prevData => ({
                                ...prevData,
                                applicantName: `${userData.firstName || response.data.userData?.firstName || ''} ${userData.lastName || response.data.userData?.lastName || ''}`.trim(),
                                email: userData.email || response.data.userData?.email || '',
                            }));
                        }
                    }
                } catch (apiError) {
                    console.error('API error checking registration status:', apiError);
                    // If API error, fall back to localStorage value
                    if (userData.hasCompletedRegistration === true) {
                        navigate('/dashboard');
                    }
                }
            } catch (error) {
                console.error('Error in registration status check:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        checkRegistrationStatus();
    }, [navigate]);

    // Update cities when state changes
    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        // Don't filter unique cities - just set them directly
        setCities(state ? cityData[state] : []);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateFile(file);
            if (error) {
                alert(error);
                e.target.value = ''; // Reset input
                return;
            }
            setSelectedFile(file);

            // Create preview
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                setFilePreview('pdf');
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('border-[#4CAF50]', 'bg-[#4CAF50]/5');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedFile) {
            e.currentTarget.classList.remove('border-[#4CAF50]', 'bg-[#4CAF50]/5');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const file = e.dataTransfer.files[0];
        if (file) {
            const validTypes = ['.jpeg', '.jpg', '.png', '.pdf']
                .map(type => `image/${type.replace('.', '')}`)
                .concat(['application/pdf']);

            if (!validTypes.includes(file.type)) {
                alert('Please upload only jpeg, jpg, png or pdf files');
                return;
            }

            if (file.size > 500 * 1024) {
                alert('File size must be less than 500KB');
                return;
            }

            setSelectedFile(file);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                setFilePreview('pdf');
            }
        }
    };

    // Update handleSubmit to be more robust
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        
        try {
            const formFields = e.target.elements;
            const fullName = formFields.namedItem("applicant-name").value.trim().split(' ');
            
            // Validate required fields
            const formValues = {
                firstName: fullName[0],
                lastName: fullName.slice(1).join(' '),
                gender: formFields.namedItem("gender").value,
                phone: formFields.namedItem("mobile-number").value,
                dob: formFields.namedItem("dob").value,
                relation: formFields.namedItem("relation").value,
                address: formFields.namedItem("address").value,
                city: formFields.namedItem("city").value,
                state: formFields.namedItem("state").value,
                zipCode: formFields.namedItem("pincode").value,
                identityProof: {
                    type: formFields.namedItem("identity-proof-type").value,
                    hasBirthCertificate: formFields.namedItem("has-birth-certificate").value === 'yes'
                }
            };

            // Validate required fields
            const requiredFields = ['firstName', 'gender', 'phone', 'dob'];
            const missingFields = requiredFields.filter(field => !formValues[field]);
            
            if (missingFields.length > 0) {
                toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
                return;
            }

            console.log('Submitting form data:', formValues);
            
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication required');
            }
            
            const response = await axios.post(
                `${config.API_BASE_URL}/api/users/complete-registration`,
                formValues,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        
            if (response.data.success) {
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                localStorage.setItem('user', JSON.stringify({
                    ...userData,
                    ...response.data.user,
                    hasCompletedRegistration: true
                }));
        
                toast.success('Registration completed successfully!');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // Image compression utility
    const compressImage = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions while maintaining aspect ratio
                    if (width > 800) {
                        height = Math.round((height * 800) / width);
                        width = 800;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            const compressedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        },
                        file.type,
                        0.7 // compression quality
                    );
                };
            };
            reader.onerror = (error) => reject(error);
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4CAF50]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto my-10 px-4">
            {formData?.isSubmitted && (  // Only show if form was previously submitted
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <i className="ri-information-line text-xl text-blue-500"></i>
                        </div>
                        <div>
                            <h4 className="text-[#333333] font-medium">Form Already Submitted</h4>
                            <p className="text-[#6C757D] text-sm">
                                You can view and update your previously submitted information below.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Add notification banner */}
            <div className="mb-6 bg-[#4CAF50]/10 border border-[#4CAF50]/20 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <i className="ri-information-line text-xl text-[#4CAF50]"></i>
                    </div>
                    <div>
                        <h4 className="text-[#333333] font-medium">Mandatory Registration</h4>
                        <p className="text-[#6C757D] text-sm">
                            Please complete this registration form to access all features of the application. This is a one-time process.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header - Adjusted height and padding */}
                <div className="relative h-32 bg-gradient-to-r from-[#4CAF50]/20 to-[#45a049]/20">
                    <div className="absolute inset-0 px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-[#333333] mb-1">
                                    Registration Form
                                </h2>
                                <p className="text-[#6C757D] text-sm">
                                    Please fill in the details accurately
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                <i className="ri-file-list-3-line text-2xl text-[#4CAF50]"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Form Heading - Adjusted margins */}
                    <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-[#333333]">APPLICATION FORM</h3>
                        <p className="text-sm text-[#6C757D] mt-1">
                            Reference ID: REF-{new Date().getFullYear()}-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </p>
                    </div>

                    {/* Form Sections */}
                    <form 
                        onSubmit={handleSubmit} 
                        encType="multipart/form-data"
                        method="POST"
                    >
                        <div className="space-y-8">
                            {/* Personal Details */}
                            <FormSection
                                icon="ri-user-line"
                                title="Personal Information"
                                content={
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            label="Applicant's Full Name"
                                            type="text"
                                            name="applicant-name"
                                            placeholder="As per official documents"
                                            className={inputClasses}
                                            defaultValue={formData?.personalInfo?.applicantName}
                                        />
                                        <FormField
                                            label="Mobile Number*"
                                            type="tel"
                                            name="mobile-number"
                                            placeholder="Enter 10-digit mobile number"
                                            pattern="[0-9]{10}"
                                            className={inputClasses}
                                            defaultValue={formData?.personalInfo?.mobileNumber}
                                        />
                                        <FormField 
                                            label="Date of Birth" 
                                            type="date" 
                                            name="dob" 
                                            id="dob" 
                                            required 
                                            min="1900-01-01" 
                                            max={new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "-" + new Date().getDate().toString().padStart(2, '0')}
                                            className={inputClasses}
                                            defaultValue={formData?.personalInfo?.dob}
                                        />
                                        <FormField
                                            label="Email Address*"
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email address"
                                            className={inputClasses}
                                            defaultValue={formData?.personalInfo?.email}
                                        />
                                        <div className="space-y-2">
                                            <label className="text-[#333333] font-medium block">Gender</label>
                                            <select className={selectClasses} name="gender" required defaultValue={formData?.personalInfo?.gender}>
                                                <option value="">Please select</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <FormField
                                            label="Relation with Applicant*"
                                            type="text"
                                            name="relation"
                                            placeholder="Parent/Guardian/Other"
                                            className={inputClasses}
                                            defaultValue={formData?.personalInfo?.relation}
                                        />
                                    </div>
                                }
                            />

                            {/* Address Section */}
                            <FormSection
                                icon="ri-map-pin-line"
                                title="Address for Correspondence"
                                content={
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <FormField
                                                label="Address*"
                                                type="text"
                                                name="address"
                                                placeholder="Enter your complete address"
                                                className={inputClasses}
                                                defaultValue={formData?.address?.address}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[#333333] font-medium block">State / UTs*</label>
                                            <select 
                                                className={selectClasses} 
                                                name="state" 
                                                required
                                                value={selectedState}
                                                onChange={handleStateChange}
                                            >
                                                <option value="">Choose State / UTs</option>
                                                {states.map(state => (
                                                    <option key={state} value={state}>
                                                        {state}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[#333333] font-medium block">City*</label>
                                            <select 
                                                className={selectClasses} 
                                                name="city" 
                                                required
                                                disabled={!selectedState}
                                                defaultValue={formData?.address?.city}
                                            >
                                                <option value="">Choose City</option>
                                                {cities.map((city, index) => (
                                                    // Use index in key to allow duplicate city names
                                                    <option key={`${city}-${index}`} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[#333333] font-medium block">Village / Block</label>
                                            <input
                                                type="text"
                                                name="village"
                                                placeholder="Enter village or block name"
                                                className={inputClasses}
                                                defaultValue={formData?.address?.village}
                                            />
                                        </div>
                                        <FormField
                                            label="Pincode*"
                                            type="text"
                                            name="pincode"
                                            placeholder="Enter 6-digit pincode"
                                            pattern="[0-9]{6}"
                                            className={inputClasses}
                                            defaultValue={formData?.address?.pincode}
                                        />
                                    </div>
                                }
                            />

                            {/* Identity Proof Section */}
                            <FormSection
                                icon="ri-id-card-line"
                                title="Proof of Identity"
                                content={
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="text-[#333333] font-medium block mb-2">Do you have a Birth Certificate?*</label>
                                            <div className="flex gap-4">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="has-birth-certificate"
                                                        value="yes"
                                                        className="form-radio text-[#4CAF50] focus:ring-[#4CAF50]"
                                                        required
                                                        defaultChecked={formData?.identityProof?.hasBirthCertificate === 'yes'}
                                                    />
                                                    <span className="ml-2 text-[#333333]">Yes</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="has-birth-certificate"
                                                        value="no"
                                                        className="form-radio text-[#4CAF50] focus:ring-[#4CAF50]"
                                                        defaultChecked={formData?.identityProof?.hasBirthCertificate === 'no'}
                                                    />
                                                    <span className="ml-2 text-[#333333]">No</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-[#333333] font-medium block mb-2">Identity Proof*</label>
                                            <select className={selectClasses} name="identity-proof-type" required defaultValue={formData?.identityProof?.identityProofType}>
                                                <option value="">Select Identity Proof</option>
                                                <option value="birth-certificate">Birth Certificate</option>
                                                <option value="passport">Passport</option>
                                                <option value="school-id">School ID</option>
                                                <option value="immunization">Immunization Record</option>
                                                <option value="medical">Medical Record</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-[#333333] font-medium block mb-2">Upload Identity Proof*</label>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-center w-full">
                                                    <label className={`flex flex-col w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
                                                        ${selectedFile ? 'border-[#4CAF50] bg-[#4CAF50]/5' : 'border-gray-300 bg-[#F8F9F4]'} 
                                                        hover:bg-[#F1F3F1] transition-colors duration-300`}
                                                        onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave}
                                                        onDrop={handleDrop}
                                                    >
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            {!selectedFile ? (
                                                                <>
                                                                    <svg className="w-8 h-8 mb-4 text-[#4CAF50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                    </svg>
                                                                    <p className="mb-2 text-sm text-[#6C757D]">
                                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                                    </p>
                                                                    <p className="text-xs text-[#6C757D]">Only jpeg, jpg, png and pdf (10 KB to 500 KB)</p>
                                                                </>
                                                            ) : (
                                                                <div className="flex items-center gap-2 text-[#4CAF50]">
                                                                    <i className="ri-check-line text-xl"></i>
                                                                    <span className="text-sm font-medium">{selectedFile.name}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Modified file input - remove required attribute and add name */}
                                                        <input 
                                                            type="file" 
                                                            name="identity-proof-file"
                                                            className="hidden" 
                                                            accept=".jpeg,.jpg,.png,.pdf" 
                                                            onChange={handleFileChange}
                                                        />
                                                    </label>
                                                </div>

                                                {/* File Preview */}
                                                {selectedFile ? (
                                                    // ...existing preview code...
                                                    <div className="relative bg-white p-4 rounded-xl border border-gray-100">
                                                        <div className="flex items-center gap-4">
                                                            {filePreview === 'pdf' ? (
                                                                <div className="w-12 h-12 bg-[#4CAF50]/10 rounded-lg flex items-center justify-center">
                                                                    <i className="ri-file-pdf-line text-2xl text-[#4CAF50]"></i>
                                                                </div>
                                                            ) : (
                                                                <img 
                                                                    src={filePreview} 
                                                                    alt="Preview" 
                                                                    className="w-20 h-20 object-cover rounded-lg"
                                                                />
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-[#333333]">{selectedFile.name}</p>
                                                                <p className="text-xs text-[#6C757D]">
                                                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                                                </p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedFile(null);
                                                                    setFilePreview(null);
                                                                }}
                                                                className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                                                            >
                                                                <i className="ri-close-line"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-red-500 text-sm">* Please upload an identity proof document</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                }
                            />

                            {/* Submit Button */}
                            <div className="pt-8 border-t border-gray-100">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={isUploading}
                                    className={`w-full p-4 bg-gradient-to-r from-[#4CAF50] to-[#45a049] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-[#4CAF50]/20 transition-all duration-300 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {isUploading ? (
                                            <>
                                                <i className="ri-loader-4-line animate-spin"></i>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <i className="ri-save-line"></i>
                                                {formData ? 'Update Information' : 'Submit Application'}
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                                <p className="text-center mt-4 text-sm text-[#6C757D]">
                                    By submitting this form, you agree to our{' '}
                                    <a href="#" className="text-[#4CAF50] hover:text-[#45a049] underline">
                                        Terms and Conditions
                                    </a>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Form Section Component
const FormSection = ({ icon, title, content }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 rounded-xl p-6 backdrop-blur-sm border border-gray-100 shadow-sm"
    >
        <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[#4CAF50]/10 flex items-center justify-center">
                <i className={`${icon} text-xl text-[#4CAF50]`}></i>
            </div>
            <h3 className="text-xl font-bold text-[#333333]">{title}</h3>
        </div>
        {content}
    </motion.div>
);

// FormField Component with updated styling
const FormField = ({ label, type, name, placeholder, pattern, className, defaultValue }) => (
    <div className="form-group">
        <label className="block text-sm font-medium text-[#333333] mb-2">
            {label}
        </label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            pattern={pattern}
            className={className}
            required
            defaultValue={defaultValue}
        />
    </div>
);

export default Form1;