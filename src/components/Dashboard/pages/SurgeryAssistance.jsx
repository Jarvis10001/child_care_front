import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SurgeryAssistance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    surgeryType: '',
    hospital: '',
    estimatedCost: '',
    insuranceCoverage: 'no',
    insuranceName: '',
    urgencyLevel: 'medium', 
    contactNumber: '',
    preferredContactMethod: 'phone',
    surgeryDate: '',
    doctorName: '',
    additionalDetails: '',
    financialAssistance: false,
    insuranceNavigation: false,
    hospitalCoordination: false,
    documentationSupport: false
  });

  const assistanceTypes = [
    {
      title: 'Financial Support',
      icon: 'ri-money-dollar-circle-line',
      description: 'Get information about financial assistance programs and funding options for surgery.'
    },
    {
      title: 'Insurance Navigation',
      icon: 'ri-shield-check-line',
      description: 'Help with understanding insurance coverage and navigating claims processes.'
    },
    {
      title: 'Hospital Coordination',
      icon: 'ri-hospital-line',
      description: 'Assistance in coordinating with hospitals and healthcare providers.'
    },
    {
      title: 'Documentation Support',
      icon: 'ri-file-list-3-line',
      description: 'Help with preparing and organizing required medical documentation.'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user makes changes
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = (step) => {
    const errors = {};
    
    if (step === 1) {
      if (!formData.childName.trim()) errors.childName = "Child's name is required";
      if (!formData.childAge.trim()) errors.childAge = "Child's age is required";
      if (!formData.surgeryType.trim()) errors.surgeryType = "Type of surgery is required";
      if (!formData.urgencyLevel) errors.urgencyLevel = "Urgency level is required";
    } else if (step === 2) {
      if (!formData.contactNumber.trim()) errors.contactNumber = "Contact number is required";
      if (formData.insuranceCoverage === "yes" && !formData.insuranceName.trim()) {
        errors.insuranceName = "Please provide your insurance provider";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (validateForm(formStep)) {
      setFormStep(formStep + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formStep)) return;
    
    setFormSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Feedback message
      toast.success('Your assistance request has been submitted successfully!');
      
      // Reset form
      setFormData({
        childName: '',
        childAge: '',
        surgeryType: '',
        hospital: '',
        estimatedCost: '',
        insuranceCoverage: 'no',
        insuranceName: '',
        urgencyLevel: 'medium',
        contactNumber: '',
        preferredContactMethod: 'phone',
        surgeryDate: '',
        doctorName: '',
        additionalDetails: '',
        financialAssistance: false,
        insuranceNavigation: false,
        hospitalCoordination: false,
        documentationSupport: false
      });
      
      setFormStep(1);
      setShowForm(false);
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-[#4CAF50]/10 p-4 rounded-full mr-4">
              <i className="ri-heart-add-line text-3xl text-[#4CAF50]"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#333333]">Surgery Assistance</h1>
              <p className="text-[#6C757D] mt-1">Get support and guidance for your child's surgical needs</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            {['overview', 'assistance', 'resources'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200
                  ${activeTab === tab 
                    ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
                    : 'text-[#6C757D] hover:text-[#4CAF50]'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className={activeTab === 'overview' ? "lg:col-span-3" : "lg:col-span-2"}>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Introduction */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-[#333333] mb-4">Pediatric Surgery Support Program</h2>
                  <p className="text-[#6C757D] mb-6">
                    Our comprehensive support system helps families navigate the complexities of pediatric surgeries. From financial assistance 
                    to post-operative care coordination, we're here to ensure your child receives the best possible care with minimal stress for your family.
                  </p>
                  
                  {/* Key Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-6">
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-[#4CAF50]">5,000+</div>
                      <div className="text-xs text-[#6C757D]">Children Supported</div>
                    </div>
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-[#4CAF50]">₹3.2Cr</div>
                      <div className="text-xs text-[#6C757D]">Financial Aid Facilitated</div>
                    </div>
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-[#4CAF50]">250+</div>
                      <div className="text-xs text-[#6C757D]">Partner Hospitals</div>
                    </div>
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-[#4CAF50]">96%</div>
                      <div className="text-xs text-[#6C757D]">Success Rate</div>
                    </div>
                  </div>
                  
                  {/* Quick Action Button */}
                  <div className="text-center mt-2">
                    <button
                      onClick={() => {
                        setActiveTab('assistance');
                        setShowForm(true);
                      }}
                      className="bg-[#4CAF50] text-white px-8 py-3 rounded-xl hover:bg-[#45a049] transition-colors duration-200 inline-flex items-center"
                    >
                      <i className="ri-file-list-3-line mr-2"></i>
                      Request Surgery Assistance
                    </button>
                  </div>
                </div>
                
                {/* Support Services */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-[#333333] mb-6">How We Can Help</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assistanceTypes.map((type, index) => (
                      <div 
                        key={index} 
                        className="p-5 rounded-xl border border-gray-100 hover:border-[#4CAF50]/20 hover:shadow-md transition-all duration-300 flex flex-col h-full"
                      >
                        <div className="flex items-start mb-4">
                          <div className="bg-[#4CAF50]/10 p-3 rounded-full mr-3 flex-shrink-0">
                            <i className={`${type.icon} text-xl text-[#4CAF50]`}></i>
                          </div>
                          <h3 className="font-medium text-[#333333] text-lg pt-1">{type.title}</h3>
                        </div>
                        <p className="text-[#6C757D] flex-grow">{type.description}</p>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <a href="#" className="text-[#4CAF50] font-medium text-sm flex items-center hover:underline">
                            Learn more <i className="ri-arrow-right-line ml-1"></i>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Surgical Journey */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-[#333333] mb-6">Understanding the Surgical Journey</h2>
                  
                  <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-4 sm:left-6 top-0 h-full w-0.5 bg-[#4CAF50]/20"></div>
                    
                    <div className="space-y-6">
                      {[
                        { 
                          title: 'Pre-Surgery Consultation', 
                          icon: 'ri-stethoscope-line',
                          description: 'Meet with surgeons to discuss diagnosis, procedure options, and expected outcomes.',
                          tip: 'Prepare a list of questions beforehand and consider bringing a family member for support.'
                        },
                        { 
                          title: 'Financial Planning', 
                          icon: 'ri-money-dollar-circle-line',
                          description: 'Understand costs, verify insurance coverage, and explore available financial assistance options.',
                          tip: 'Ask about hospital payment plans and inquire about discounts for upfront payments.'
                        },
                        { 
                          title: 'Pre-Surgery Preparation', 
                          icon: 'ri-calendar-check-line',
                          description: 'Complete medical tests, follow dietary instructions, and prepare your child emotionally.',
                          tip: 'Use age-appropriate books or videos to help your child understand what to expect.'
                        },
                        { 
                          title: 'Day of Surgery', 
                          icon: 'ri-hospital-line',
                          description: 'Hospital admission, surgical procedure, and immediate recovery in post-anesthesia care.',
                          tip: 'Bring comfort items for your child and essentials for yourself if staying overnight.'
                        },
                        { 
                          title: 'Post-Surgery Recovery', 
                          icon: 'ri-heart-pulse-line',
                          description: 'Hospital recovery, discharge planning, and transition to home care and follow-up visits.',
                          tip: 'Create a comfortable recovery space at home before the surgery date.'
                        }
                      ].map((step, index) => (
                        <div key={index} className="relative pl-12 sm:pl-16">
                          <div className="absolute left-0 w-9 h-9 bg-[#4CAF50]/10 rounded-full flex items-center justify-center text-[#4CAF50] border border-[#4CAF50]/20">
                            <i className={`${step.icon} text-xl`}></i>
                          </div>
                          <div className="bg-[#F8FAF8] p-4 rounded-xl">
                            <h3 className="font-medium text-[#333333] mb-2">{step.title}</h3>
                            <p className="text-[#6C757D] mb-3">{step.description}</p>
                            <div className="bg-[#4CAF50]/5 p-3 rounded-lg border-l-2 border-[#4CAF50]">
                              <p className="text-sm flex items-start">
                                <i className="ri-lightbulb-flash-line text-[#4CAF50] mr-2 mt-0.5"></i>
                                <span><strong>Tip:</strong> {step.tip}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Common Pediatric Surgeries */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-[#333333] mb-6">Common Pediatric Surgeries</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Procedure</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Typical Age</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recovery Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[
                          {
                            name: 'Cleft Lip & Palate Repair',
                            description: 'Surgery to fix openings or splits in the upper lip and roof of the mouth',
                            age: '3-12 months',
                            recovery: '2-3 weeks'
                          },
                          {
                            name: 'Hernia Repair',
                            description: 'Surgery to fix protrusions of intestine or other tissue through the abdominal wall',
                            age: '6 months - 5 years',
                            recovery: '1-2 weeks'
                          },
                          {
                            name: 'Tonsillectomy',
                            description: 'Removal of the tonsils to treat recurrent infections or breathing difficulties',
                            age: '3-7 years',
                            recovery: '1-2 weeks'
                          },
                          {
                            name: 'Club Foot Correction',
                            description: 'Surgical correction of foot deformities present at birth',
                            age: '3-12 months',
                            recovery: '2-3 months'
                          }
                        ].map((surgery, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333333]">{surgery.name}</td>
                            <td className="px-6 py-4 text-sm text-[#6C757D]">{surgery.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6C757D]">{surgery.age}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6C757D]">{surgery.recovery}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="mt-4 text-sm text-[#6C757D] italic">
                    <i className="ri-information-line mr-1 text-[#4CAF50]"></i>
                    This is general information. Your child's specific needs may vary. Always consult with a healthcare professional.
                  </p>
                </div>
                
                {/* FAQ Section */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-[#333333] mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        question: `How can I determine if my child's surgery is covered by insurance?`,
                        answer: 'Most insurance plans cover medically necessary surgeries, but coverage varies by provider and plan. Our team can help you verify coverage and understand your benefits before scheduling surgery.'
                      },
                      {
                        question: 'What financial assistance options are available if we don\'t have insurance?',
                        answer: 'Several options exist including government schemes like Ayushman Bharat, hospital charity care programs, NGO support, and installment payment plans. Our coordinators can help identify which options are best for your situation.'
                      },
                      {
                        question: 'How should I prepare my child emotionally for surgery?',
                        answer: 'Use age-appropriate explanations, books, or videos about hospitals. Be honest but reassuring, emphasizing the positive outcome. For younger children, play "doctor" with toys to familiarize them with medical procedures.'
                      }
                    ].map((faq, index) => (
                      <details key={index} className="group border border-gray-100 rounded-xl overflow-hidden">
                        <summary className="flex justify-between items-center px-6 py-4 cursor-pointer bg-white hover:bg-gray-50">
                          <span className="font-medium text-[#333333]">{faq.question}</span>
                          <span className="transition-transform duration-300 group-open:rotate-180">
                            <i className="ri-arrow-down-s-line text-[#4CAF50]"></i>
                          </span>
                        </summary>
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                          <p className="text-[#6C757D]">{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <a href="#" className="text-[#4CAF50] font-medium hover:underline inline-flex items-center">
                      View all FAQs <i className="ri-arrow-right-line ml-1"></i>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assistance' && !showForm && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-center py-8">
                  <div className="bg-[#4CAF50]/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <i className="ri-hand-heart-line text-4xl text-[#4CAF50]"></i>
                  </div>
                  <h2 className="text-2xl font-semibold text-[#333333] mb-2">Need Surgery Assistance?</h2>
                  <p className="text-[#6C757D] mb-8 max-w-xl mx-auto">
                    Our dedicated team helps families navigate the complexities of pediatric surgeries by providing financial assistance, 
                    insurance navigation, hospital coordination, and emotional support.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl">
                      <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="ri-service-line text-xl text-[#4CAF50]"></i>
                      </div>
                      <h3 className="text-lg font-medium text-[#333333] mb-2">Free Consultation</h3>
                      <p className="text-sm text-[#6C757D]">Initial assessment and consultation at no cost</p>
                    </div>
                    
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl">
                      <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="ri-timer-line text-xl text-[#4CAF50]"></i>
                      </div>
                      <h3 className="text-lg font-medium text-[#333333] mb-2">Quick Response</h3>
                      <p className="text-sm text-[#6C757D]">Get connected with a coordinator within 24 hours</p>
                    </div>
                    
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl">
                      <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="ri-shield-check-line text-xl text-[#4CAF50]"></i>
                      </div>
                      <h3 className="text-lg font-medium text-[#333333] mb-2">Confidential</h3>
                      <p className="text-sm text-[#6C757D]">Your information is kept secure and private</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#4CAF50] text-white px-8 py-4 rounded-xl hover:bg-[#45a049] transition-colors duration-200 shadow-md"
                  >
                    <i className="ri-file-list-3-line mr-2"></i>
                    Request Assistance
                  </button>
                  
                  <div className="mt-6 text-sm text-[#6C757D]">
                    Already submitted a request? <a href="#" className="text-[#4CAF50] font-medium">Track your request status</a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assistance' && showForm && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-[#4CAF50]/10 p-3 rounded-full mr-3">
                      <i className="ri-file-list-3-line text-xl text-[#4CAF50]"></i>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[#333333]">Surgery Assistance Request</h2>
                      <p className="text-sm text-[#6C757D]">Please provide details for your assistance request</p>
                    </div>
                  </div>
                  
                  <div className="hidden sm:flex items-center">
                    <div className={`flex items-center ${formStep >= 1 ? 'text-[#4CAF50]' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formStep >= 1 ? 'bg-[#4CAF50] text-white' : 'bg-gray-200'}`}>
                        1
                      </div>
                      <span className="ml-2 text-sm font-medium">Basic Info</span>
                    </div>
                    <div className="w-8 h-0.5 mx-2 bg-gray-200"></div>
                    <div className={`flex items-center ${formStep >= 2 ? 'text-[#4CAF50]' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formStep >= 2 ? 'bg-[#4CAF50] text-white' : 'bg-gray-200'}`}>
                        2
                      </div>
                      <span className="ml-2 text-sm font-medium">Contact Details</span>
                    </div>
                    <div className="w-8 h-0.5 mx-2 bg-gray-200"></div>
                    <div className={`flex items-center ${formStep >= 3 ? 'text-[#4CAF50]' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${formStep >= 3 ? 'bg-[#4CAF50] text-white' : 'bg-gray-200'}`}>
                        3
                      </div>
                      <span className="ml-2 text-sm font-medium">Support Needed</span>
                    </div>
                  </div>
                  
                  <div className="sm:hidden text-sm font-medium text-[#4CAF50]">
                    Step {formStep} of 3
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Step 1: Basic Information */}
                  {formStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#333333] mb-1">
                            Child's Name*
                          </label>
                          <input
                            type="text"
                            name="childName"
                            value={formData.childName}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.childName ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]`}
                          />
                          {formErrors.childName && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.childName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-[#333333] mb-1">
                            Child's Age*
                          </label>
                          <input
                            type="text"
                            name="childAge"
                            value={formData.childAge}
                            onChange={handleInputChange}
                            placeholder="e.g., 3 years 2 months"
                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.childAge ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]`}
                          />
                          {formErrors.childAge && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.childAge}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-1">
                          Type of Surgery*
                        </label>
                        <select
                          name="surgeryType"
                          value={formData.surgeryType}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-lg border ${formErrors.surgeryType ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]`}
                        >
                          <option value="">Select surgery type</option>
                          <option value="cardiac">Cardiac Surgery</option>
                          <option value="orthopedic">Orthopedic Surgery</option>
                          <option value="cleft">Cleft Lip/Palate Repair</option>
                          <option value="ophthalmic">Ophthalmic Surgery</option>
                          <option value="neurosurgical">Neurosurgical Procedure</option>
                          <option value="hernia">Hernia Repair</option>
                          <option value="tonsillectomy">Tonsillectomy</option>
                          <option value="other">Other</option>
                        </select>
                        {formErrors.surgeryType && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.surgeryType}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-1">
                          Hospital/Medical Center (if known)
                        </label>
                        <input
                          type="text"
                          name="hospital"
                          value={formData.hospital}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                          placeholder="Enter hospital name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-1">
                          Doctor's Name (if known)
                        </label>
                        <input
                          type="text"
                          name="doctorName"
                          value={formData.doctorName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                          placeholder="Enter doctor's name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#333333] mb-1">
                            Expected Surgery Date (if scheduled)
                          </label>
                          <input
                            type="date"
                            name="surgeryDate"
                            value={formData.surgeryDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-[#333333] mb-1">
                            Urgency Level*
                          </label>
                          <select
                            name="urgencyLevel"
                            value={formData.urgencyLevel}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-2 rounded-lg border ${formErrors.urgencyLevel ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]`}
                          >
                            <option value="high">Urgent (within 2 weeks)</option>
                            <option value="medium">Medium (1-2 months)</option>
                            <option value="low">Planning Phase (3+ months)</option>
                          </select>
                          {formErrors.urgencyLevel && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.urgencyLevel}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-1">
                          Estimated Cost (if known)
                        </label>
                        <input
                          type="text"
                          name="estimatedCost"
                          value={formData.estimatedCost}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                          placeholder="e.g., ₹50,000"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Contact Details */}
                  {formStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-1">
                          Contact Number*
                        </label>
                        <input
                          type="tel"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-lg border ${formErrors.contactNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]`}
                        />
                        {formErrors.contactNumber && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.contactNumber}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-1">
                          Preferred Contact Method
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {['phone', 'whatsapp', 'email'].map(method => (
                            <div 
                              key={method}
                              className={`border rounded-lg p-3 flex items-center cursor-pointer ${
                                formData.preferredContactMethod === method 
                                  ? 'border-[#4CAF50] bg-[#4CAF50]/5' 
                                  : 'border-gray-200 hover:border-[#4CAF50]/20'
                              }`}
                              onClick={() => handleInputChange({
                                target: { name: 'preferredContactMethod', value: method }
                              })}
                            >
                              <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2 flex-shrink-0
                                border-gray-300">
                                {formData.preferredContactMethod === method && (
                                  <div className="w-3 h-3 bg-[#4CAF50] rounded-full"></div>
                                )}
                              </div>
                              <span className="text-sm capitalize">{method}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4 mt-6">
                        <label className="block text-sm font-medium text-[#333333] mb-1">
                          Insurance Information
                        </label>
                        
                        <div className="mt-2">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="insuranceCoverage"
                              checked={formData.insuranceCoverage === 'yes'}
                              onChange={() => handleInputChange({
                                target: {
                                  name: 'insuranceCoverage',
                                  value: formData.insuranceCoverage === 'yes' ? 'no' : 'yes'
                                }
                              })}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4CAF50] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            <span className="ml-3 text-sm text-gray-700">I have insurance coverage</span>
                          </label>
                        </div>
                        
                        {formData.insuranceCoverage === 'yes' && (
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-[#333333] mb-1">
                              Insurance Provider
                            </label>
                            <input
                              type="text"
                              name="insuranceName"
                              value={formData.insuranceName}
                              onChange={handleInputChange}
                              className={`w-full px-4 py-2 rounded-lg border ${formErrors.insuranceName ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]`}
                              placeholder="Enter insurance company name"
                            />
                            {formErrors.insuranceName && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.insuranceName}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Support Needed */}
                  {formStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-base font-medium text-[#333333] mb-3">
                          What Type of Support Do You Need?
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            {
                              id: 'financialAssistance',
                              label: 'Financial Assistance',
                              desc: 'Help with funding for surgery costs'
                            },
                            {
                              id: 'insuranceNavigation',
                              label: 'Insurance Navigation',
                              desc: 'Help with claims and coverage'
                            },
                            {
                              id: 'hospitalCoordination',
                              label: 'Hospital Coordination',
                              desc: 'Help with appointments and hospital liaison'
                            },
                            {
                              id: 'documentationSupport',
                              label: 'Documentation Support',
                              desc: 'Help with medical records and paperwork'
                            }
                          ].map(item => (
                            <div 
                              key={item.id}
                              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                formData[item.id] 
                                  ? 'border-[#4CAF50] bg-[#4CAF50]/5' 
                                  : 'border-gray-200 hover:border-[#4CAF50]/20'
                              }`}
                              onClick={() => handleInputChange({
                                target: {
                                  name: item.id,
                                  type: 'checkbox',
                                  checked: !formData[item.id]
                                }
                              })}
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  name={item.id}
                                  checked={formData[item.id]}
                                  onChange={handleInputChange}
                                  className="w-4 h-4 text-[#4CAF50] rounded border-gray-300 focus:ring-[#4CAF50]"
                                />
                                <label className="ml-3 font-medium text-sm">{item.label}</label>
                              </div>
                              <p className="text-xs text-[#6C757D] mt-2 ml-7">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-[#333333] mb-1">
                          Additional Information
                        </label>
                        <textarea
                          name="additionalDetails"
                          value={formData.additionalDetails}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
                          rows="4"
                          placeholder="Please share any additional details about your needs or circumstances that would help us assist you better."
                        ></textarea>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                        <div className="flex">
                          <i className="ri-information-line text-lg mr-2 flex-shrink-0"></i>
                          <div>
                            <p className="font-medium mb-1">Privacy Notice</p>
                            <p>
                              The information you provide will be used only to process your assistance request and provide you with 
                              the appropriate support. We respect your privacy and handle your data in accordance with our privacy policy.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-4 border-t border-gray-100 mt-6">
                    {formStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => setFormStep(formStep - 1)}
                        className="px-6 py-2 border border-gray-200 text-[#333333] rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <i className="ri-arrow-left-line mr-1"></i>
                        Back
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-6 py-2 border border-gray-200 text-[#333333] rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    
                    {formStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
                      >
                        Next
                        <i className="ri-arrow-right-line ml-1"></i>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className="px-8 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors flex items-center"
                      >
                        {formSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Request
                            <i className="ri-check-line ml-1"></i>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-[#333333] mb-6">Support Resources</h2>
                
                {/* Search Bar */}
                <div className="mb-6 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-search-line text-gray-400"></i>
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/20 focus:border-[#4CAF50] transition-all"
                    placeholder="Search resources..." 
                  />
                </div>
                
                {/* Resource Categories */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['All', 'Government', 'Financial', 'NGOs', 'Hospitals', 'Educational'].map((category) => (
                    <button 
                      key={category} 
                      className={`px-4 py-1.5 text-sm rounded-full transition-colors
                        ${category === 'All' 
                          ? 'bg-[#4CAF50] text-white' 
                          : 'bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50]/20'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Government Programs */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-blue-50">
                      <i className="ri-government-line text-blue-500"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-[#333333] ml-2">Government Programs</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        name: "Ayushman Bharat PM-JAY",
                        description: "Health insurance scheme providing coverage up to ₹5 lakhs per family per year for secondary and tertiary care hospitalization.",
                        eligibility: "Economically disadvantaged families identified through SECC database",
                        contact: "1800-111-565",
                        website: "https://pmjay.gov.in"
                      },
                      {
                        name: "Rashtriya Bal Swasthya Karyakram (RBSK)",
                        description: "Child health screening and early intervention services for children from birth to 18 years.",
                        eligibility: "All children aged 0-18 years",
                        contact: "Nearest RBSK mobile health team or PHC",
                        website: "https://nhm.gov.in/rbsk.html"
                      },
                      {
                        name: "Chief Minister's Relief Fund",
                        description: "Financial assistance for patients with serious ailments requiring expensive surgical interventions.",
                        eligibility: "Based on financial need and medical condition severity",
                        application: "Through District Collector's office",
                        website: "State government website"
                      }
                    ].map((program, index) => (
                      <div key={index} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                          <div>
                            <h4 className="font-medium text-[#333333]">{program.name}</h4>
                            <p className="text-sm text-[#6C757D] mt-1">{program.description}</p>
                            
                            <div className="mt-3 space-y-1">
                              <p className="text-xs flex items-start">
                                <span className="text-blue-500 font-medium min-w-[80px] inline-block">Eligibility:</span>
                                <span className="text-[#6C757D]">{program.eligibility}</span>
                              </p>
                              <p className="text-xs flex items-start">
                                <span className="text-blue-500 font-medium min-w-[80px] inline-block">Contact:</span>
                                <span className="text-[#6C757D]">{program.contact}</span>
                              </p>
                            </div>
                          </div>
                          
                          <a
                            href={program.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 sm:mt-0 inline-block px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                          >
                            <i className="ri-global-line mr-1"></i>
                            Visit Website
                          </a>
                        </div>
                      </div>
                    ))}
                    
                    <button className="w-full text-center text-blue-500 text-sm py-2 hover:underline">
                      View all government programs <i className="ri-arrow-right-line align-middle ml-1"></i>
                    </button>
                  </div>
                </div>

                {/* NGO & Charitable Organizations */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-purple-50">
                      <i className="ri-heart-2-line text-purple-500"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-[#333333] ml-2">NGO & Charitable Organizations</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        name: "Child Heart Foundation",
                        focus: "Pediatric cardiac surgeries",
                        support: "Financial assistance, doctor referrals",
                        color: "bg-purple-50 text-purple-600"
                      },
                      {
                        name: "Smile Foundation",
                        focus: "Cleft lip and palate surgeries",
                        support: "Free surgeries and post-operative care",
                        color: "bg-pink-50 text-pink-600"
                      },
                      {
                        name: "Help Age India",
                        focus: "Senior citizen healthcare",
                        support: "Medical equipment, surgical assistance",
                        color: "bg-indigo-50 text-indigo-600"
                      },
                      {
                        name: "Give India Foundation",
                        focus: "Various medical treatments",
                        support: "Crowdfunding platform for surgeries",
                        color: "bg-amber-50 text-amber-600"
                      }
                    ].map((org, index) => (
                      <div key={index} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-all duration-300">
                        <h4 className="font-medium text-[#333333] mb-1">{org.name}</h4>
                        <div className="space-y-1 mb-3">
                          <p className="text-xs flex gap-1">
                            <span className="text-[#6C757D] font-medium">Focus:</span>
                            <span>{org.focus}</span>
                          </p>
                          <p className="text-xs flex gap-1">
                            <span className="text-[#6C757D] font-medium">Support:</span>
                            <span>{org.support}</span>
                          </p>
                        </div>
                        <button className={`text-xs px-3 py-1.5 rounded-lg ${org.color} w-full text-center`}>
                          Request Assistance
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Resources */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-green-50">
                      <i className="ri-money-dollar-circle-line text-green-600"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-[#333333] ml-2">Financial Resources</h3>
                  </div>
                  
                  <div className="overflow-hidden rounded-xl border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Eligibility</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          { name: "Hospital Payment Plans", type: "Interest-free EMI", eligibility: "All patients" },
                          { name: "Health Ministry Grants", type: "One-time grant", eligibility: "BPL families" },
                          { name: "Surgery Crowdfunding", type: "Donations", eligibility: "Case-by-case basis" },
                          { name: "Medical Loans", type: "Low-interest loans", eligibility: "Credit verification" },
                        ].map((resource, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{resource.type}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                              <div className="text-sm text-gray-500">{resource.eligibility}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button className="text-[#4CAF50] hover:text-[#45a049] hover:underline">
                                Learn more
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hospital Networks with Special Programs */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-red-50">
                      <i className="ri-hospital-line text-red-500"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-[#333333] ml-2">Hospital Networks with Special Programs</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        name: "AIIMS Children's Hospital",
                        location: "Delhi, Mumbai, Patna, Bhubaneswar",
                        services: "Pediatric specialty surgeries at subsidized rates",
                        icon: "ri-hospital-fill"
                      },
                      {
                        name: "Rainbow Children's Hospitals",
                        location: "Multiple cities across India",
                        services: "Specialized pediatric surgical care with payment assistance",
                        icon: "ri-rainbow-line"
                      },
                      {
                        name: "Narayana Health",
                        location: "Pan-India presence",
                        services: "Affordable cardiac and other critical surgeries",
                        icon: "ri-heart-pulse-line"
                      },
                    ].map((hospital, index) => (
                      <div key={index} className="flex bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300">
                        <div className="w-2 bg-red-500"></div>
                        <div className="p-4 flex-1">
                          <div className="flex items-start">
                            <i className={`${hospital.icon} text-red-500 mr-2 text-lg`}></i>
                            <h4 className="font-medium text-[#333333]">{hospital.name}</h4>
                          </div>
                          <div className="mt-2 space-y-1 text-xs">
                            <p className="flex gap-1">
                              <i className="ri-map-pin-line text-red-400"></i>
                              <span>{hospital.location}</span>
                            </p>
                            <p className="flex gap-1">
                              <i className="ri-service-line text-red-400"></i>
                              <span>{hospital.services}</span>
                            </p>
                          </div>
                          <button className="mt-3 text-xs px-3 py-1.5 bg-white border border-red-200 text-red-500 rounded-lg hover:bg-red-50 w-full transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Educational Resources */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="p-2 rounded-full bg-amber-50">
                      <i className="ri-book-open-line text-amber-600"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-[#333333] ml-2">Educational Resources</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        title: "Understanding Pediatric Surgery: A Parent's Guide",
                        type: "PDF Guide",
                        size: "2.4 MB",
                        icon: "ri-file-pdf-line"
                      },
                      {
                        title: "Preparing Your Child for Surgery",
                        type: "Video Series",
                        size: "35 minutes",
                        icon: "ri-video-line"
                      },
                      {
                        title: "Post-Surgery Care at Home",
                        type: "Interactive Tutorial",
                        size: "Web-based",
                        icon: "ri-computer-line"
                      }
                    ].map((resource, index) => (
                      <div key={index} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 hover:border-amber-200 transition-all duration-300">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
                          <i className={`${resource.icon} text-lg`}></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[#333333] truncate">{resource.title}</h4>
                          <p className="text-xs text-[#6C757D] flex gap-2">
                            <span>{resource.type}</span>
                            <span>•</span>
                            <span>{resource.size}</span>
                          </p>
                        </div>
                        <button className="flex-shrink-0 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors text-xs flex items-center">
                          <i className="ri-download-line mr-1"></i>
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-amber-50 rounded-xl p-4 mt-4 flex items-center">
                    <i className="ri-information-line text-amber-600 text-xl mr-3"></i>
                    <div>
                      <p className="text-sm text-amber-800">
                        Looking for more resources? Our support team can provide personalized guidance materials for your specific needs.
                      </p>
                    </div>
                    <button className="ml-auto bg-white px-3 py-1.5 rounded-lg border border-amber-200 text-amber-600 text-xs hover:bg-amber-100 transition-colors whitespace-nowrap">
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - only show for assistance and resources tabs */}
          {activeTab !== 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-[#333333] mb-4">Need Help?</h2>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50]/20 transition-colors">
                    <span className="flex items-center">
                      <i className="ri-phone-line mr-2"></i>
                      Contact Support
                    </span>
                    <i className="ri-arrow-right-line"></i>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50]/20 transition-colors">
                    <span className="flex items-center">
                      <i className="ri-message-3-line mr-2"></i>
                      Chat with Us
                    </span>
                    <i className="ri-arrow-right-line"></i>
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-semibold mb-2">Emergency Support</h3>
                <p className="text-white/80 text-sm mb-4">Need immediate assistance? Our support team is available 24/7.</p>
                <button className="w-full bg-white text-[#4CAF50] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Contact Emergency Team
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurgeryAssistance;
