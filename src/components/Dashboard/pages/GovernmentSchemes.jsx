import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const GovernmentSchemes = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Enhanced schemes data with more details
  const schemes = [
    {
      id: 1,
      name: "Ayushman Bharat (PM-JAY)",
      category: "Healthcare",
      state: "All India",
      description: "Comprehensive healthcare coverage providing financial protection to over 10.74 crore poor, deprived rural families",
      eligibility: ["Below poverty line families", "Identified occupational categories", "Economically weaker sections"],
      benefits: ["Free medical treatment up to ₹5 lakhs per family per year", "Cashless hospitalization", "Coverage for pre-existing conditions", "No cap on family size"],
      deadline: "Open enrollment",
      icon: "ri-hospital-line",
      image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://pmjay.gov.in",
      incomeLimit: "Below ₹2.5 lakh per annum",
      status: "Active"
    },
    {
      id: 2,
      name: "ADIP Scheme",
      category: "Disability Support",
      state: "All India",
      description: "Assistance to disabled persons for purchasing aids and appliances to enhance their mobility and independence",
      eligibility: ["Person with 40% disability or more", "Monthly income below ₹20,000", "Not received assistance in past 3 years"],
      benefits: ["Free assistive devices", "Maintenance and repair support", "Travel allowance for fittings"],
      deadline: "Rolling applications",
      icon: "ri-wheelchair-line",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "http://disabilityaffairs.gov.in",
      incomeLimit: "Below ₹20,000 per month",
      status: "Active"
    },
    {
      id: 3,
      name: "Niramaya Health Insurance",
      category: "Insurance",
      state: "All India",
      description: "Health insurance scheme for persons with autism, cerebral palsy, mental retardation and multiple disabilities",
      eligibility: ["Persons with autism", "Cerebral palsy", "Multiple disabilities", "Mental retardation"],
      benefits: ["₹1 lakh health coverage", "OPD treatment", "Alternative medicine", "Regular medical checkups"],
      deadline: "Ongoing",
      icon: "ri-heart-pulse-line",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://thenationaltrust.gov.in",
      incomeLimit: "No income limit",
      status: "Active"
    },
    {
      id: 4,
      name: "PM-CARES for Children",
      category: "Child Welfare",
      state: "All India",
      description: "Support for children who have lost both parents or legal guardian during the COVID-19 pandemic period",
      eligibility: ["Children who lost parents to COVID-19", "Age below 18 years at time of loss"],
      benefits: ["₹10 lakh fund at age 18", "Free education", "Monthly stipend from age 18-23", "Health Insurance"],
      deadline: "Open",
      icon: "ri-parent-line",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://pmcaresforchildren.in",
      incomeLimit: "No income limit",
      status: "Active"
    },
    {
      id: 5,
      name: "Samagra Shiksha Abhiyan",
      category: "Education",
      state: "All India",
      description: "Holistic education program focused on improving school effectiveness, inclusive practices and equity",
      eligibility: ["Children with disabilities aged 6-18 years", "Enrolled in government schools"],
      benefits: ["Free textbooks & uniforms", "Special educators", "Barrier-free access", "Assistive devices"],
      deadline: "Ongoing through schools",
      icon: "ri-book-open-line",
      image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://samagra.education.gov.in",
      incomeLimit: "No income limit",
      status: "Active"
    },
    {
      id: 6,
      name: "Rashtriya Bal Swasthya Karyakram (RBSK)",
      category: "Healthcare",
      state: "All India",
      description: "Child health screening and early intervention program for 4Ds - Defects, Diseases, Deficiencies, and Developmental Delays",
      eligibility: ["Children aged 0-18 years", "Special focus on children with disabilities"],
      benefits: ["Free health screening", "Early intervention services", "Referral support", "Treatment at tertiary level"],
      deadline: "Ongoing",
      icon: "ri-microscope-line",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://nhm.gov.in/rbsk",
      incomeLimit: "No income limit",
      status: "Active"
    },
    {
      id: 7,
      name: "UDID Card",
      category: "Disability Support",
      state: "All India",
      description: "Unique ID for Persons with Disabilities project for creating a national database and standardized ID card",
      eligibility: ["Persons with benchmark disabilities", "All age groups"],
      benefits: ["Single document for availing benefits", "Online services", "Standardized assessment", "Centralized database"],
      deadline: "Ongoing",
      icon: "ri-id-card-line",
      image: "https://images.unsplash.com/photo-1589386417686-0d34b5903d23?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://www.swavlambancard.gov.in",
      incomeLimit: "No income limit",
      status: "Active"
    },
    {
      id: 8,
      name: "Inclusive Education for Disabled at Secondary Stage (IEDSS)",
      category: "Education",
      state: "All India",
      description: "Enables children with disabilities to complete secondary education in inclusive environment",
      eligibility: ["Children with disabilities aged 14-18 years", "Enrolled in Classes IX to XII"],
      benefits: ["Monthly scholarship of ₹600", "Reader allowance for visually impaired", "Transport allowance", "Escort allowance"],
      deadline: "Through schools",
      icon: "ri-school-line",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://mhrd.gov.in/iedss",
      incomeLimit: "No income limit",
      status: "Active"
    },
    {
      id: 9,
      name: "Scholarship for Top Class Education for Students with Disabilities",
      category: "Education",
      state: "All India",
      description: "Financial assistance to students with disabilities for pursuing higher education in prestigious institutions",
      eligibility: ["Students with 40% or more disability", "Admitted to recognized institutions", "Family income below ₹6 lakh per annum"],
      benefits: ["Full tuition fee reimbursement", "Monthly maintenance allowance", "Disability allowance", "Books and stationery allowance"],
      deadline: "30th September every year",
      icon: "ri-graduation-cap-line",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://scholarships.gov.in",
      incomeLimit: "Below ₹6 lakh per annum",
      status: "Active"
    },
    {
      id: 10,
      name: "Pre-Matric Scholarship for Students with Disabilities",
      category: "Education",
      state: "All India",
      description: "Financial assistance to students with disabilities studying in classes IX and X",
      eligibility: ["Students with 40% or more disability", "Enrolled in class IX-X", "Family income below ₹2.5 lakh per annum"],
      benefits: ["₹500 per month for day scholars", "₹800 per month for hostellers", "Disability allowance", "Book allowance"],
      deadline: "31st October every year",
      icon: "ri-book-3-line",
      image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://scholarships.gov.in",
      incomeLimit: "Below ₹2.5 lakh per annum",
      status: "Active"
    },
    {
      id: 11,
      name: "Deendayal Disabled Rehabilitation Scheme",
      category: "Disability Support",
      state: "All India",
      description: "Financial assistance to NGOs running rehabilitation centers for persons with disabilities",
      eligibility: ["Registered NGOs working with PWDs", "Individuals with disabilities seeking services from these centers"],
      benefits: ["Special education", "Vocational training", "Early intervention", "Rehabilitation services"],
      deadline: "Through NGOs",
      icon: "ri-empathize-line",
      image: "https://images.unsplash.com/photo-1469571486292-b53601cc4226?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "http://disabilityaffairs.gov.in/content/page/ddrs.php",
      incomeLimit: "Varies by program",
      status: "Active"
    },
    {
      id: 12,
      name: "Cochlear Implant Program",
      category: "Healthcare",
      state: "All India",
      description: "Financial support for cochlear implant surgery and follow-up therapy for children with hearing impairment",
      eligibility: ["Children below 5 years", "Severe to profound hearing loss", "Family income below ₹8 lakh per annum"],
      benefits: ["Full cost coverage for implant up to ₹6 lakh", "Auditory-verbal therapy", "Follow-up support"],
      deadline: "Ongoing",
      icon: "ri-ear-line",
      image: "https://images.unsplash.com/photo-1591944834477-d7solidness-4afa-4218-9c10-a52666b2b09?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "http://adiprehabilitationscheme.in/cochlear-implant/",
      incomeLimit: "Below ₹8 lakh per annum",
      status: "Active"
    },
    {
      id: 13,
      name: "Early Intervention Program",
      category: "Healthcare",
      state: "All India",
      description: "Comprehensive program for early identification and intervention for children with developmental delays and disabilities",
      eligibility: ["Children aged 0-6 years with developmental delays", "Children at risk of developmental disabilities"],
      benefits: ["Developmental screenings", "Therapy services", "Parent training", "Home-based intervention"],
      deadline: "Ongoing enrollment",
      icon: "ri-baby-line",
      image: "https://images.unsplash.com/photo-1557939574-a3bf2688db6a?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://depwd.gov.in/en/earlyintervention",
      incomeLimit: "No income limit",
      status: "Active"
    },
    {
      id: 14,
      name: "Swavlamban Health Insurance Scheme",
      category: "Insurance",
      state: "All India",
      description: "Affordable health insurance for persons with disabilities providing coverage for hospitalization and treatment",
      eligibility: ["Persons with benchmark disabilities", "Age below 65 years"],
      benefits: ["₹2 lakh coverage", "Premium of ₹357 annually", "Covers pre-existing conditions", "No age limit for dependent children with disabilities"],
      deadline: "Ongoing",
      icon: "ri-health-book-line",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://www.nhfdc.nic.in",
      incomeLimit: "Below ₹3 lakh per annum",
      status: "Active"
    },
    {
      id: 15,
      name: "National Fellowship for Persons with Disabilities",
      category: "Education",
      state: "All India",
      description: "Financial assistance for students with disabilities to pursue M.Phil and Ph.D studies",
      eligibility: ["Students with 40% or more disability", "Admitted to full-time M.Phil/Ph.D programs", "Below 35 years of age"],
      benefits: ["Monthly stipend of ₹31,000-₹35,000", "Annual contingency allowance", "Escorts/Reader assistance", "HRA as per university rules"],
      deadline: "Usually September each year",
      icon: "ri-book-mark-line",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://www.ugc.ac.in",
      incomeLimit: "No income limit",
      status: "Active"
    },
    {
      id: 16,
      name: "Assistive Devices Distribution Program",
      category: "Disability Support",
      state: "All India",
      description: "Free distribution of assistive devices to children with disabilities to improve functional capabilities",
      eligibility: ["Children with disabilities aged 0-18 years", "40% or more disability"],
      benefits: ["Wheelchairs", "Hearing aids", "Braille kits", "Smart canes", "Communication devices"],
      deadline: "Through assessment camps",
      icon: "ri-service-line",
      image: "https://images.unsplash.com/photo-1562963875-7fbb70f3327f?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://alimco.in",
      incomeLimit: "Below ₹2 lakh per annum for full subsidy",
      status: "Active"
    },
    {
      id: 17,
      name: "National Means-cum-Merit Scholarship Scheme",
      category: "Education",
      state: "All India",
      description: "Scholarships to meritorious students from economically weaker sections to prevent drop-out at class VIII",
      eligibility: ["Students securing at least 55% marks in Class VII", "Family income below ₹3.5 lakh per annum", "Additional benefits for students with disabilities"],
      benefits: ["₹12,000 per annum", "Continued till class XII", "Direct bank transfer"],
      deadline: "October each year",
      icon: "ri-award-line",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://scholarships.gov.in",
      incomeLimit: "Below ₹3.5 lakh per annum",
      status: "Active"
    },
    {
      id: 18,
      name: "Post Matric Scholarship for Students with Disabilities",
      category: "Education",
      state: "All India",
      description: "Financial assistance for students with disabilities pursuing higher education (class XI onwards)",
      eligibility: ["Students with 40% or more disability", "Enrolled in Class XI onwards", "Family income below ₹2.5 lakh per annum"],
      benefits: ["Course fee reimbursement", "Maintenance allowance", "Disability allowance", "Study tour charges"],
      deadline: "31st October every year",
      icon: "ri-graduation-cap-line",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://scholarships.gov.in",
      incomeLimit: "Below ₹2.5 lakh per annum",
      status: "Active"
    },
    {
      id: 19,
      name: "National Action Plan for Skill Development",
      category: "Vocational Training",
      state: "All India",
      description: "Vocational training and skill development programs for persons with disabilities to enhance employability",
      eligibility: ["Persons with disabilities aged 15-59 years"],
      benefits: ["Free vocational training", "Skill assessment", "Job placement assistance", "Stipend during training period"],
      deadline: "Rolling applications",
      icon: "ri-tools-line",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://www.nhfdc.nic.in",
      incomeLimit: "No income limit",
      status: "Active"
    },
    {
      id: 20,
      name: "Child Rehabilitation Allowance",
      category: "Financial Aid",
      state: "All India",
      description: "Monthly allowance for parents/guardians of children with severe disabilities requiring constant care",
      eligibility: ["Children with 80% or more disability", "Requiring constant care and supervision"],
      benefits: ["Monthly allowance of ₹1,500", "Additional medical benefits", "Respite care services"],
      deadline: "Open throughout the year",
      icon: "ri-parent-line",
      image: "https://images.unsplash.com/photo-1559839914-17aae19cec71?auto=format&fit=crop&w=900&q=80",
      applicationUrl: "https://disabilityaffairs.gov.in",
      incomeLimit: "Below ₹3 lakh per annum",
      status: "Active"
    }
  ];

  // Expanded list of categories
  const categories = [
    { id: 'all', name: 'All Categories', icon: 'ri-folder-line' },
    { id: 'healthcare', name: 'Healthcare', icon: 'ri-hospital-line' },
    { id: 'education', name: 'Education', icon: 'ri-book-open-line' },
    { id: 'disability', name: 'Disability Support', icon: 'ri-wheelchair-line' },
    { id: 'insurance', name: 'Insurance', icon: 'ri-shield-star-line' },
    { id: 'financial', name: 'Financial Aid', icon: 'ri-money-rupee-circle-line' },
    { id: 'housing', name: 'Housing', icon: 'ri-home-4-line' },
    { id: 'child welfare', name: 'Child Welfare', icon: 'ri-parent-line' }
  ];

  // States with icons
  const states = [
    { id: 'all', name: 'All India', icon: 'ri-map-pin-line' },
    { id: 'maharashtra', name: 'Maharashtra', icon: 'ri-map-pin-line' },
    { id: 'delhi', name: 'Delhi', icon: 'ri-map-pin-line' },
    { id: 'karnataka', name: 'Karnataka', icon: 'ri-map-pin-line' },
    { id: 'tamil nadu', name: 'Tamil Nadu', icon: 'ri-map-pin-line' },
    { id: 'uttar pradesh', name: 'Uttar Pradesh', icon: 'ri-map-pin-line' }
  ];

  // Stats for the dashboard
  const stats = [
    { title: "Total Schemes", value: schemes.length, icon: "ri-government-line", color: "bg-blue-50 text-blue-600" },
    { title: "Available for You", value: "2", icon: "ri-check-line", color: "bg-green-50 text-green-600" },
    { title: "Applied", value: "1", icon: "ri-file-list-3-line", color: "bg-amber-50 text-amber-600" },
    { title: "Notifications", value: "3", icon: "ri-notification-3-line", color: "bg-purple-50 text-purple-600" }
  ];

  const handleApply = (scheme) => {
    toast.success(`Redirecting to application for ${scheme.name}`);
    window.open(scheme.applicationUrl, '_blank');
  };

  const toggleFavorite = (schemeId) => {
    setFavorites(prev => {
      if (prev.includes(schemeId)) {
        toast.success('Removed from favorites');
        return prev.filter(id => id !== schemeId);
      } else {
        toast.success('Added to favorites');
        return [...prev, schemeId];
      }
    });
  };

  const filteredSchemes = schemes.filter(scheme => {
    if (activeTab === 'favorites' && !favorites.includes(scheme.id)) {
      return false;
    }
    
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState === 'all' || scheme.state.toLowerCase() === selectedState;
    const matchesCategory = selectedCategory === 'all' || scheme.category.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesState && matchesCategory;
  });

  // New state for eligibility checker
  const [isEligibilityModalOpen, setIsEligibilityModalOpen] = useState(false);
  const [eligibilityResults, setEligibilityResults] = useState(null);
  const [loadingResults, setLoadingResults] = useState(false);
  const [eligibilityForm, setEligibilityForm] = useState({
    income: '',
    disabilityPercentage: 'none',
    age: '',
    location: selectedState,
    category: ''
  });

  // Handle eligibility form changes
  const handleEligibilityChange = (e) => {
    const { name, value } = e.target;
    setEligibilityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle eligibility check submission
  const handleEligibilityCheck = (e) => {
    e.preventDefault();
    setLoadingResults(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Calculate eligibility based on form data
      const eligibleSchemes = schemes.filter(scheme => {
        // Check income limits
        if (scheme.incomeLimit && scheme.incomeLimit.includes('Below')) {
          const limitString = scheme.incomeLimit.match(/₹([0-9,.]+)\s*(lakh|per month)/i);
          if (limitString) {
            let limitAmount = parseFloat(limitString[1].replace(/,/g, ''));
            
            // Convert limit to annual amount if it's per month
            if (limitString[2].toLowerCase() === 'per month') {
              limitAmount *= 12;
            } else if (limitString[2].toLowerCase() === 'lakh') {
              limitAmount *= 100000;
            }
            
            // Compare with user's income
            const userIncome = parseFloat(eligibilityForm.income);
            if (userIncome > limitAmount) {
              return false;
            }
          }
        }
        
        // Check disability requirements
        if (scheme.category === 'Disability Support' && eligibilityForm.disabilityPercentage === 'none') {
          return false;
        }
        
        if (scheme.category === 'Disability Support' && 
            scheme.eligibility.some(e => e.includes('40%')) && 
            eligibilityForm.disabilityPercentage === 'below_40') {
          return false;
        }
        
        // Check location
        if (eligibilityForm.location !== 'all' && 
            scheme.state !== 'All India' && 
            !scheme.state.toLowerCase().includes(eligibilityForm.location)) {
          return false;
        }
        
        // If all checks passed, user may be eligible
        return true;
      });

      setEligibilityResults(eligibleSchemes);
      setLoadingResults(false);
    }, 1500);
  };
  
  // Reset eligibility check
  const resetEligibilityCheck = () => {
    setEligibilityResults(null);
    setEligibilityForm({
      income: '',
      disabilityPercentage: 'none',
      age: '',
      location: selectedState,
      category: ''
    });
  };

  // Handle changes to selected state
  useEffect(() => {
    setEligibilityForm(prev => ({
      ...prev,
      location: selectedState
    }));
  }, [selectedState]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-[#4CAF50]/10 p-4 rounded-full mr-4">
              <i className="ri-government-line text-3xl text-[#4CAF50]"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#333333]">Government Schemes</h1>
              <p className="text-[#6C757D] mt-1">Explore and apply for government assistance programs</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            {['explore', 'favorites', 'applications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center
                  ${activeTab === tab 
                    ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
                    : 'text-[#6C757D] hover:text-[#4CAF50]'
                  }`}
              >
                <i className={`${
                  tab === 'explore' ? 'ri-search-line' : 
                  tab === 'favorites' ? 'ri-bookmark-line' : 
                  'ri-file-list-3-line'
                } mr-2`}></i>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg mr-3`}>
                  <i className={`${stat.icon} text-xl`}></i>
                </div>
                <div>
                  <div className="text-sm text-gray-500">{stat.title}</div>
                  <div className="text-xl font-bold">{stat.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, description, benefits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4CAF50] transition-colors"
                />
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4CAF50] transition-colors"
              >
                {states.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
              
              <button
                onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
                className="px-4 py-3 bg-[#4CAF50]/10 text-[#4CAF50] border border-[#4CAF50]/20 rounded-xl hover:bg-[#4CAF50]/20 transition-colors flex items-center"
              >
                <i className="ri-filter-3-line mr-2"></i>
                Filters
              </button>
            </div>
          </div>
          
          {/* Advanced Filters Drawer */}
          {filterDrawerOpen && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Income Range</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50]"
                  >
                    <option value="all">Any Income Level</option>
                    <option value="below_1lakh">Below ₹1 lakh/year</option>
                    <option value="1_3lakh">₹1 lakh - ₹3 lakh/year</option>
                    <option value="above_3lakh">Above ₹3 lakh/year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disability Percentage</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50]"
                  >
                    <option value="all">Any</option>
                    <option value="below_40">Below 40%</option>
                    <option value="40_75">40% - 75%</option>
                    <option value="above_75">Above 75%</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4CAF50]"
                  >
                    <option value="all">Any Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mr-2"
                  onClick={() => setFilterDrawerOpen(false)}
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049]"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
          
          {/* Categories */}
          <div className="flex overflow-x-auto gap-3 py-2 no-scrollbar">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-[#4CAF50] text-white'
                    : 'bg-gray-100 text-[#333333] hover:bg-[#4CAF50]/10'
                }`}
              >
                <i className={`${category.icon} mr-2`}></i>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Eligibility Checker Banner */}
        <div className="bg-[#4CAF50]/10 rounded-2xl p-6 border border-[#4CAF50]/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-[#4CAF50]/20 p-3 rounded-full mr-4">
                <i className="ri-question-answer-line text-xl text-[#4CAF50]"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#333333]">Not sure what you're eligible for?</h3>
                <p className="text-sm text-[#6C757D]">Answer a few questions to find schemes that match your situation</p>
              </div>
            </div>
            <button
              onClick={() => setIsEligibilityModalOpen(true)}
              className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors whitespace-nowrap"
            >
              Check Eligibility
            </button>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#4CAF50]/30 transition-all duration-300"
            >
              <div className="relative h-48">
                <img
                  src={scheme.image}
                  alt={scheme.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <button 
                    onClick={() => toggleFavorite(scheme.id)}
                    className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <i className={`${
                      favorites.includes(scheme.id) 
                        ? 'ri-bookmark-fill text-amber-500' 
                        : 'ri-bookmark-line text-gray-600 hover:text-amber-500'
                    }`}></i>
                  </button>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-[#4CAF50]">
                  {scheme.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#333333] mb-2">{scheme.name}</h3>
                <p className="text-sm text-[#6C757D] mb-4 line-clamp-2">{scheme.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-start">
                    <i className="ri-user-follow-line text-[#4CAF50] mt-0.5 mr-2 flex-shrink-0"></i>
                    <div>
                      <div className="text-xs font-medium text-[#333333]">Eligibility:</div>
                      <p className="text-xs text-[#6C757D] line-clamp-1">{scheme.eligibility[0]}{scheme.eligibility.length > 1 ? ` & ${scheme.eligibility.length-1} more` : ''}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <i className="ri-money-rupee-circle-line text-[#4CAF50] mt-0.5 mr-2 flex-shrink-0"></i>
                    <div>
                      <div className="text-xs font-medium text-[#333333]">Income Limit:</div>
                      <p className="text-xs text-[#6C757D]">{scheme.incomeLimit || 'No income limit'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-[#6C757D]">
                    <i className="ri-timer-line mr-1"></i>
                    {scheme.deadline}
                  </div>
                  <button
                    onClick={() => handleApply(scheme)}
                    className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors flex items-center"
                  >
                    <i className="ri-file-paper-2-line mr-2"></i>
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
            <div className="mb-4 mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gray-100">
              <i className="ri-search-line text-4xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-[#333333] mb-2">No schemes found</h3>
            <p className="text-[#6C757D] mb-6 max-w-md mx-auto">
              {activeTab === 'favorites' 
                ? "You haven't saved any schemes yet. Browse schemes and bookmark them to find them here."
                : "We couldn't find any schemes matching your criteria. Try adjusting your filters or search terms."
              }
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedState('all');
                setSelectedCategory('all');
                if (activeTab === 'favorites') setActiveTab('explore');
              }}
              className="px-4 py-2 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/20 transition-colors"
            >
              {activeTab === 'favorites' ? 'Browse Schemes' : 'Clear All Filters'}
            </button>
          </div>
        )}

        {/* Eligibility Check Modal */}
        <AnimatePresence>
          {isEligibilityModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => !loadingResults && setIsEligibilityModalOpen(false)}
            >
              <motion.div 
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
              >
                {!eligibilityResults ? (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-[#333333]">Eligibility Check</h2>
                      <button 
                        onClick={() => !loadingResults && setIsEligibilityModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={loadingResults}
                      >
                        <i className="ri-close-line text-2xl"></i>
                      </button>
                    </div>
                    
                    <form onSubmit={handleEligibilityCheck} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Annual Household Income (₹)
                        </label>
                        <input
                          type="number"
                          name="income"
                          value={eligibilityForm.income}
                          onChange={handleEligibilityChange}
                          placeholder="e.g., 250000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter your total annual family income</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Disability Status
                        </label>
                        <select
                          name="disabilityPercentage"
                          value={eligibilityForm.disabilityPercentage}
                          onChange={handleEligibilityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
                        >
                          <option value="none">No disability</option>
                          <option value="below_40">Below 40% disability</option>
                          <option value="40_75">40% to 75% disability</option>
                          <option value="above_75">Above 75% disability</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age Group
                        </label>
                        <select
                          name="age"
                          value={eligibilityForm.age}
                          onChange={handleEligibilityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
                        >
                          <option value="">Select age group</option>
                          <option value="0_5">0-5 years</option>
                          <option value="6_18">6-18 years</option>
                          <option value="18_60">18-60 years</option>
                          <option value="above_60">Above 60 years</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <select
                          name="location"
                          value={eligibilityForm.location}
                          onChange={handleEligibilityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
                        >
                          {states.map(state => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Special Category (if any)
                        </label>
                        <select
                          name="category"
                          value={eligibilityForm.category}
                          onChange={handleEligibilityChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/30 focus:border-[#4CAF50]"
                        >
                          <option value="">None</option>
                          <option value="sc">SC</option>
                          <option value="st">ST</option>
                          <option value="obc">OBC</option>
                          <option value="minority">Minority</option>
                          <option value="bpl">BPL</option>
                          <option value="widow">Widow/Single Mother</option>
                        </select>
                      </div>
                      
                      <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => setIsEligibilityModalOpen(false)}
                          disabled={loadingResults}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 mr-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loadingResults}
                          className="px-6 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] flex items-center"
                        >
                          {loadingResults ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Checking...
                            </>
                          ) : (
                            'Check Eligibility'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-[#333333]">Eligibility Results</h2>
                      <button 
                        onClick={() => setIsEligibilityModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <i className="ri-close-line text-2xl"></i>
                      </button>
                    </div>
                    
                    {eligibilityResults.length > 0 ? (
                      <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
                          <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                            <i className="ri-check-line text-green-600"></i>
                          </div>
                          <div>
                            <p className="font-medium text-green-800">
                              Based on your information, you may be eligible for {eligibilityResults.length} scheme{eligibilityResults.length !== 1 ? 's' : ''}!
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                              Review the details below and click on 'Apply Now' to start the application process for each scheme.
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                          {eligibilityResults.map(scheme => (
                            <div key={scheme.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                              <div className="flex items-center bg-[#4CAF50]/5 px-4 py-3 border-b border-gray-200">
                                <i className={`${scheme.icon} text-xl text-[#4CAF50] mr-3`}></i>
                                <h3 className="font-semibold text-[#333333]">{scheme.name}</h3>
                              </div>
                              
                              <div className="p-4">
                                <p className="text-sm text-gray-600 mb-4">{scheme.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                    {scheme.category}
                                  </span>
                                  <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                                    {scheme.state}
                                  </span>
                                  {scheme.incomeLimit && (
                                    <span className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                                      Income: {scheme.incomeLimit}
                                    </span>
                                  )}
                                </div>
                                
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleApply(scheme)}
                                    className="px-4 py-1.5 bg-[#4CAF50] text-white text-sm rounded-lg hover:bg-[#45a049] transition-colors"
                                  >
                                    Apply Now
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between pt-4 border-t border-gray-200">
                          <button
                            onClick={resetEligibilityCheck}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Check Again
                          </button>
                          <button
                            onClick={() => setIsEligibilityModalOpen(false)}
                            className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049]"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start">
                          <div className="bg-amber-100 p-2 rounded-full mr-3 flex-shrink-0">
                            <i className="ri-information-line text-amber-600"></i>
                          </div>
                          <div>
                            <p className="font-medium text-amber-800">
                              Based on your information, we couldn't find specific schemes you're eligible for.
                            </p>
                            <p className="text-sm text-amber-700 mt-1">
                              You may want to adjust your criteria or contact a support representative for personalized assistance.
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="ri-search-line text-2xl text-gray-400"></i>
                          </div>
                          <h3 className="text-lg font-medium text-gray-700 mb-2">No eligible schemes found</h3>
                          <p className="text-gray-500 max-w-sm mx-auto">
                            Try changing your eligibility criteria or browse all available schemes to find ones that might be relevant to your needs.
                          </p>
                        </div>
                        
                        <div className="flex justify-between pt-4 border-t border-gray-200">
                          <button
                            onClick={resetEligibilityCheck}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                          >
                            Check Again
                          </button>
                          <button
                            onClick={() => setIsEligibilityModalOpen(false)}
                            className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049]"
                          >
                            Browse All Schemes
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GovernmentSchemes;
