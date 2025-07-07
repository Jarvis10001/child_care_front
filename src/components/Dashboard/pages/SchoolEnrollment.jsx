import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const SchoolEnrollment = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [activeSchool, setActiveSchool] = useState(null);
  const [compareSchools, setCompareSchools] = useState([]);
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState([]);
  
  const [filters, setFilters] = useState({
    type: 'all',
    curriculum: 'all',
    distance: 'all',
    specialNeeds: [],
    fees: 'all',
    availability: true
  });

  // Updated mock data with correct structure for special needs (array of strings, not boolean)
  const schools = [
    {
      id: 1,
      name: "Sunshine Special School",
      type: "Special Education",
      curriculum: "Modified Curriculum",
      specialNeeds: ["autism", "adhd", "intellectual"],
      location: "Mumbai Central",
      distance: 3.5,
      address: "123 Education Lane, Mumbai Central, Mumbai 400008",
      coordinates: [19.0760, 72.8777],
      rating: 4.8,
      reviews: 42,
      fees: "₹80,000 - ₹1,20,000 per year",
      feesCategory: "medium",
      facilities: [
        "Speech Therapy",
        "Occupational Therapy",
        "Special Educators",
        "Sensory Room"
      ],
      admissionOpen: true,
      availableSeats: 12,
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      establishedYear: 2005,
      studentTeacherRatio: "6:1"
    },
    {
      id: 2,
      name: "Mind Bloom Academy",
      type: "Inclusive Education",
      curriculum: "CBSE with Modifications",
      specialNeeds: ["dyslexia", "adhd", "speech"],
      location: "Andheri East",
      distance: 6.8,
      address: "45 Learning Road, Andheri East, Mumbai 400069",
      coordinates: [19.1136, 72.8697],
      rating: 4.6,
      reviews: 38,
      fees: "₹1,50,000 - ₹2,00,000 per year",
      feesCategory: "high",
      facilities: [
        "Resource Room",
        "Speech Therapy",
        "Counseling Services",
        "Learning Lab"
      ],
      admissionOpen: true,
      availableSeats: 8,
      image: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHNjaG9vbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
      establishedYear: 2010,
      studentTeacherRatio: "10:1"
    },
    {
      id: 3,
      name: "Horizon School for Exceptional Learners",
      type: "Special Education",
      curriculum: "Multiple Programs",
      specialNeeds: ["visual", "physical", "hearing"],
      location: "Powai",
      distance: 9.2,
      address: "78 Inclusive Avenue, Powai, Mumbai 400076",
      coordinates: [19.1176, 72.9060],
      rating: 4.7,
      reviews: 31,
      fees: "₹70,000 - ₹90,000 per year",
      feesCategory: "medium",
      facilities: [
        "Accessible Infrastructure",
        "Braille Resources",
        "Sign Language Specialists",
        "Mobility Training"
      ],
      admissionOpen: true,
      availableSeats: 15,
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2Nob29sfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      establishedYear: 2008,
      studentTeacherRatio: "4:1"
    },
    {
      id: 4,
      name: "New Beginnings Integrated School",
      type: "Inclusive Education",
      curriculum: "ICSE with Accommodations",
      specialNeeds: ["autism", "emotional", "speech"],
      location: "Bandra West",
      distance: 4.1,
      address: "25 Development Road, Bandra West, Mumbai 400050",
      coordinates: [19.0596, 72.8295],
      rating: 4.5,
      reviews: 25,
      fees: "₹2,00,000 - ₹2,50,000 per year",
      feesCategory: "high",
      facilities: [
        "Sensory Integration Room",
        "Art Therapy Studio",
        "Calm Down Spaces",
        "Play Therapy Room"
      ],
      admissionOpen: false,
      availableSeats: 0,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2Nob29sfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      establishedYear: 2015,
      studentTeacherRatio: "8:1"
    },
    {
      id: 5,
      name: "Ability Enhancement Academy",
      type: "Special Education",
      curriculum: "Personalized Learning Plans",
      specialNeeds: ["intellectual", "autism", "physical"],
      location: "Dadar",
      distance: 2.3,
      address: "112 Progress Street, Dadar, Mumbai 400014",
      coordinates: [19.0178, 72.8478],
      rating: 4.9,
      reviews: 28,
      fees: "₹60,000 - ₹80,000 per year",
      feesCategory: "low",
      facilities: [
        "Life Skills Lab",
        "Modified Physical Education",
        "Occupational Therapy",
        "Adaptive Equipment"
      ],
      admissionOpen: false,
      availableSeats: 0,
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2Nob29sfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      establishedYear: 2007,
      studentTeacherRatio: "5:1",
      waitlist: true
    }
  ];

  // Special needs types for filtering
  const specialNeedsTypes = [
    { id: 'autism', name: 'Autism Spectrum Disorder' },
    { id: 'adhd', name: 'ADHD' },
    { id: 'dyslexia', name: 'Dyslexia' },
    { id: 'hearing', name: 'Hearing Impairment' },
    { id: 'visual', name: 'Visual Impairment' },
    { id: 'physical', name: 'Physical Disabilities' },
    { id: 'intellectual', name: 'Intellectual Disability' },
    { id: 'speech', name: 'Speech/Language Disorders' },
    { id: 'emotional', name: 'Emotional/Behavioral Disorders' }
  ];

  // Initialize filtered schools
  useEffect(() => {
    setFilteredSchools(schools);
  }, []);

  // Fixed search function with proper handling of specialNeeds
  const handleSearch = () => {
    const results = schools.filter(school => {
      // Search query match
      if (searchQuery && !school.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !school.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Type filter
      if (filters.type !== 'all' && school.type !== filters.type) {
        return false;
      }
      
      // Curriculum filter
      if (filters.curriculum !== 'all' && school.curriculum !== filters.curriculum) {
        return false;
      }
      
      // Distance filter
      if (filters.distance !== 'all') {
        if (filters.distance === 'under5' && school.distance >= 5) return false;
        if (filters.distance === '5to10' && (school.distance < 5 || school.distance > 10)) return false;
        if (filters.distance === 'over10' && school.distance <= 10) return false;
      }
      
      // Special needs filter - fixed to check if any selected special needs are provided by the school
      if (filters.specialNeeds.length > 0) {
        // Check if the school supports at least one of the selected special needs
        const hasMatchingNeed = filters.specialNeeds.some(need => 
          school.specialNeeds && school.specialNeeds.includes(need)
        );
        if (!hasMatchingNeed) return false;
      }
      
      // Fees filter
      if (filters.fees !== 'all') {
        if (filters.fees === 'low' && school.feesCategory !== 'low') return false;
        if (filters.fees === 'medium' && school.feesCategory !== 'medium') return false;
        if (filters.fees === 'high' && school.feesCategory !== 'high') return false;
      }
      
      // Availability filter
      if (filters.availability && (!school.admissionOpen || school.availableSeats === 0)) {
        return false;
      }
      
      return true;
    });
    
    setFilteredSchools(results);
  };
  
  // Fixed filter change handler with proper array handling for specialNeeds
  const handleFilterChange = (filterType, value) => {
    if (filterType === 'specialNeed') {
      setFilters(prev => {
        // Check if the value is already in the array
        const isAlreadySelected = prev.specialNeeds.includes(value);
        
        // If already selected, remove it; otherwise, add it
        const updatedNeeds = isAlreadySelected
          ? prev.specialNeeds.filter(need => need !== value)
          : [...prev.specialNeeds, value];
          
        return {
          ...prev,
          specialNeeds: updatedNeeds
        };
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };
  
  // Run search when filters or search query changes
  useEffect(() => {
    handleSearch();
  }, [searchQuery, filters]);

  // Toggle school for comparison
  const handleToggleCompare = (schoolId) => {
    setCompareSchools(prev => {
      if (prev.includes(schoolId)) {
        return prev.filter(id => id !== schoolId);
      } else {
        if (prev.length >= 3) {
          toast.error('You can compare up to 3 schools at a time');
          return prev;
        }
        return [...prev, schoolId];
      }
    });
  };

  // Handle view school details
  const handleViewDetails = (school) => {
    setActiveSchool(school);
  };

  // Handle apply to school
  const handleApply = (school) => {
    setActiveSchool(school);
    setShowForm(true);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      type: 'all',
      curriculum: 'all',
      distance: 'all',
      specialNeeds: [],
      fees: 'all',
      availability: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add API integration here
      toast.success('Your enrollment request has been submitted successfully!');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to submit enrollment request');
    }
  };

  // Add new state for applications tab
  const [activeApplication, setActiveApplication] = useState(null);
  const [showApplicationDetails, setShowApplicationDetails] = useState(false);
  const [documentToUpload, setDocumentToUpload] = useState(null);
  
  // Mock data for applications
  const applications = [
    {
      id: "APP001",
      schoolId: 1,
      status: "Under Review",
      submittedDate: "2023-09-15",
      lastUpdate: "2023-09-18",
      schoolName: "Sunshine Special School",
      schoolImage: "https://images.unsplash.com/photo-1580582932707-520aed937b52?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2Nob29sfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      childName: "Arjun Kumar",
      targetGrade: "Kindergarten",
      startYear: "2024",
      documents: [
        { name: "Birth Certificate", status: "approved", date: "2023-09-15" },
        { name: "Disability Certificate", status: "pending", date: "2023-09-15" },
        { name: "Address Proof", status: "requested", dueDate: "2023-09-30" },
        { name: "Previous School Records", status: "approved", date: "2023-09-15" }
      ],
      timeline: [
        { date: "2023-09-15", event: "Application submitted", status: "completed" },
        { date: "2023-09-18", event: "Document verification", status: "completed" },
        { date: "2023-09-30", event: "Interview & assessment", status: "upcoming" },
        { date: "2023-10-10", event: "Final decision", status: "upcoming" }
      ],
      notes: "Please upload the requested address proof document before the assessment date."
    },
    {
      id: "APP002",
      schoolId: 3,
      status: "Assessment Scheduled",
      submittedDate: "2023-09-10",
      lastUpdate: "2023-09-16",
      schoolName: "Horizon School for Exceptional Learners",
      schoolImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2Nob29sfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      childName: "Arjun Kumar",
      targetGrade: "Grade 1",
      startYear: "2024",
      documents: [
        { name: "Birth Certificate", status: "approved", date: "2023-09-10" },
        { name: "Disability Certificate", status: "approved", date: "2023-09-10" },
        { name: "Address Proof", status: "approved", date: "2023-09-10" },
        { name: "Previous School Records", status: "approved", date: "2023-09-10" }
      ],
      timeline: [
        { date: "2023-09-10", event: "Application submitted", status: "completed" },
        { date: "2023-09-13", event: "Document verification", status: "completed" },
        { date: "2023-09-20", event: "Interview & assessment", status: "upcoming" },
        { date: "2023-10-05", event: "Final decision", status: "upcoming" }
      ],
      notes: "Child assessment scheduled for September 20, 2023 at 10:00 AM. Please bring your child's favorite toy."
    },
    {
      id: "APP003",
      schoolId: 4,
      status: "Waitlisted",
      submittedDate: "2023-08-25",
      lastUpdate: "2023-09-12",
      schoolName: "New Beginnings Integrated School",
      schoolImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c2Nob29sfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      childName: "Arjun Kumar",
      targetGrade: "Grade 2",
      startYear: "2024",
      documents: [
        { name: "Birth Certificate", status: "approved", date: "2023-08-25" },
        { name: "Disability Certificate", status: "approved", date: "2023-08-25" },
        { name: "Address Proof", status: "approved", date: "2023-08-25" },
        { name: "Previous School Records", status: "approved", date: "2023-08-25" }
      ],
      timeline: [
        { date: "2023-08-25", event: "Application submitted", status: "completed" },
        { date: "2023-08-30", event: "Document verification", status: "completed" },
        { date: "2023-09-05", event: "Interview & assessment", status: "completed" },
        { date: "2023-09-12", event: "Waitlisted", status: "completed" }
      ],
      notes: "Your application is placed on the waitlist at position #3. We'll notify you if a spot becomes available.",
      position: 3
    }
  ];

  // Get status color based on status text
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'requested':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under review':
        return 'bg-blue-100 text-blue-800';
      case 'assessment scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'waitlisted':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // View application details
  const handleViewApplication = (application) => {
    setActiveApplication(application);
    setShowApplicationDetails(true);
  };

  // Upload document
  const handleUploadDocument = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentToUpload(file);
      setTimeout(() => {
        toast.success(`Document "${file.name}" uploaded successfully!`);
        setDocumentToUpload(null);
        // In a real app we would update the application state here
      }, 1500);
    }
  };

  // Cancel application
  const handleCancelApplication = (applicationId) => {
    if (window.confirm('Are you sure you want to cancel this application?')) {
      toast.success('Application has been canceled');
      // In a real app we would make an API call here
      setShowApplicationDetails(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-[#4CAF50]/10 p-4 rounded-full mr-4">
              <i className="ri-school-line text-3xl text-[#4CAF50]"></i>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#333333]">School Enrollment</h1>
              <p className="text-[#6C757D] mt-1">Find and enroll in schools that support special needs education</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            {['overview', 'search', 'applications'].map((tab) => (
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

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Statistics */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-[#4CAF50]">150+</div>
                      <div className="text-xs text-[#6C757D]">Partner Schools</div>
                    </div>
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-[#4CAF50]">95%</div>
                      <div className="text-xs text-[#6C757D]">Successful Placements</div>
                    </div>
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-[#4CAF50]">24/7</div>
                      <div className="text-xs text-[#6C757D]">Support Available</div>
                    </div>
                    <div className="bg-[#4CAF50]/5 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-[#4CAF50]">₹0</div>
                      <div className="text-xs text-[#6C757D]">Enrollment Fee</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-2xl p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">Find Schools</h3>
                    <p className="text-white/90 mb-4">Search and compare schools based on your requirements</p>
                    <button 
                      onClick={() => setActiveTab('search')}
                      className="bg-white text-[#4CAF50] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Search Schools
                    </button>
                  </div>

                  <div className="bg-[#4CAF50]/10 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-[#333333] mb-2">Need Help?</h3>
                    <p className="text-[#6C757D] mb-4">Connect with our education counselors for guidance</p>
                    <button className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#45a049] transition-colors">
                      Schedule Consultation
                    </button>
                  </div>
                </div>

                {/* Features Section */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h2 className="text-xl font-semibold text-[#333333] mb-6">How We Help</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "School Assessment",
                        description: "We evaluate schools based on their special education programs and facilities",
                        icon: "ri-mental-health-line"
                      },
                      {
                        title: "Admission Support",
                        description: "Complete assistance with admission procedures and documentation",
                        icon: "ri-file-list-3-line"
                      },
                      {
                        title: "Education Counseling",
                        description: "Expert guidance on choosing the right educational path",
                        icon: "ri-user-heart-line"
                      },
                      {
                        title: "Progress Tracking",
                        description: "Regular updates and monitoring of your child's educational journey",
                        icon: "ri-line-chart-line"
                      }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start p-4 rounded-xl border border-gray-100 hover:border-[#4CAF50]/20 transition-all">
                        <div className="bg-[#4CAF50]/10 p-3 rounded-full mr-4">
                          <i className={`${feature.icon} text-xl text-[#4CAF50]`}></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-[#333333] mb-1">{feature.title}</h3>
                          <p className="text-sm text-[#6C757D]">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="space-y-6">
                {/* Search and Filters */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search schools by name, location, or features..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4CAF50] transition-colors"
                        />
                        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setMapView(false)}
                        className={`px-3 py-2 rounded-lg flex items-center ${
                          !mapView 
                            ? 'bg-[#4CAF50] text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <i className="ri-list-check-2 mr-2"></i>
                        List View
                      </button>
                      <button
                        onClick={() => setMapView(true)}
                        className={`px-3 py-2 rounded-lg flex items-center ${
                          mapView 
                            ? 'bg-[#4CAF50] text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <i className="ri-map-2-line mr-2"></i>
                        Map View
                      </button>
                    </div>
                  </div>

                  {/* Filters Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
                      <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                      >
                        <option value="all">All Types</option>
                        <option value="Special Education">Special Education</option>
                        <option value="Inclusive Education">Inclusive Education</option>
                        <option value="Mainstream with Support">Mainstream with Support</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                      <select
                        value={filters.distance}
                        onChange={(e) => handleFilterChange('distance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                      >
                        <option value="all">Any Distance</option>
                        <option value="under5">Under 5 km</option>
                        <option value="5to10">5 - 10 km</option>
                        <option value="over10">Over 10 km</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fee Range</label>
                      <select
                        value={filters.fees}
                        onChange={(e) => handleFilterChange('fees', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#4CAF50]"
                      >
                        <option value="all">Any Fee Range</option>
                        <option value="low">Economy (Under ₹75,000/year)</option>
                        <option value="medium">Standard (₹75,000 - ₹1,50,000/year)</option>
                        <option value="high">Premium (Above ₹1,50,000/year)</option>
                      </select>
                    </div>
                  </div>

                  {/* Special Needs Filter */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Needs Support</label>
                    <div className="flex flex-wrap gap-2">
                      {specialNeedsTypes.map(need => (
                        <button
                          key={need.id}
                          onClick={() => handleFilterChange('specialNeed', need.id)}
                          className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                            filters.specialNeeds.includes(need.id)
                              ? 'bg-[#4CAF50] text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {need.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability Filter */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center">
                      <input
                        id="availability"
                        type="checkbox"
                        checked={filters.availability}
                        onChange={(e) => handleFilterChange('availability', e.target.checked)}
                        className="w-4 h-4 text-[#4CAF50] rounded focus:ring-[#4CAF50]"
                      />
                      <label htmlFor="availability" className="ml-2 text-sm text-gray-700">
                        Currently accepting admissions
                      </label>
                    </div>
                  </div>

                  {/* Results Summary and Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600 mb-2 sm:mb-0">
                      <span className="font-medium">{filteredSchools.length}</span> schools match your criteria
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={resetFilters}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        Reset Filters
                      </button>
                      
                      {compareSchools.length > 0 && (
                        <button
                          onClick={() => setShowCompareDrawer(true)}
                          className="px-3 py-1.5 text-sm bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/20 flex items-center"
                        >
                          <i className="ri-scales-3-line mr-1"></i>
                          Compare ({compareSchools.length})
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Map View */}
                {mapView ? (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[500px] relative">
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <i className="ri-map-2-line text-6xl text-gray-300 mb-4"></i>
                        <p className="text-gray-500">Map view will be displayed here</p>
                        <p className="text-sm text-gray-400 mt-2">Showing locations of {filteredSchools.length} schools</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* List View */
                  <div className="space-y-6">
                    {filteredSchools.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
                        <div className="mb-4 mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gray-100">
                          <i className="ri-search-line text-4xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-medium text-[#333333] mb-2">No schools found</h3>
                        <p className="text-[#6C757D] mb-6 max-w-md mx-auto">
                          We couldn't find any schools matching your criteria. Try adjusting your filters or search terms.
                        </p>
                        <button 
                          onClick={resetFilters}
                          className="px-4 py-2 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/20 transition-colors"
                        >
                          Reset All Filters
                        </button>
                      </div>
                    ) : (
                      /* School Cards */
                      filteredSchools.map(school => (
                        <div
                          key={school.id}
                          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#4CAF50]/30 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* School Image */}
                            <div className="md:w-1/3 h-48 md:h-auto relative">
                              <img
                                src={school.image}
                                alt={school.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 right-4">
                                <button 
                                  onClick={() => handleToggleCompare(school.id)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                    compareSchools.includes(school.id)
                                      ? 'bg-[#4CAF50] text-white'
                                      : 'bg-white/80 text-gray-600 hover:bg-white'
                                  }`}
                                >
                                  <i className="ri-scales-3-line"></i>
                                </button>
                              </div>
                              {!school.admissionOpen && (
                                <div className="absolute bottom-0 inset-x-0 bg-red-500 text-white text-center py-1 text-sm">
                                  Admissions Closed
                                </div>
                              )}
                            </div>
                            
                            {/* School Details */}
                            <div className="md:w-2/3 p-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-[#333333]">{school.name}</h3>
                                  <div className="flex items-center mt-1 text-gray-500 text-sm">
                                    <i className="ri-map-pin-line mr-1"></i>
                                    <span>{school.location}</span>
                                    <span className="mx-2">•</span>
                                    <span>{school.distance} km away</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <div className="bg-amber-50 px-2 py-1 rounded-lg flex items-center">
                                    <i className="ri-star-fill text-amber-500 mr-1"></i>
                                    <span className="font-medium text-amber-700">{school.rating}</span>
                                  </div>
                                  <span className="text-xs text-gray-500 ml-2">({school.reviews} reviews)</span>
                                </div>
                              </div>
                              
                              {/* Special Needs Badges */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                {school.specialNeeds.map(needId => {
                                  const need = specialNeedsTypes.find(type => type.id === needId);
                                  return need && (
                                    <span key={needId} className="text-xs px-2 py-1 bg-[#4CAF50]/10 text-[#4CAF50] rounded-full">
                                      {need.name}
                                    </span>
                                  );
                                })}
                              </div>
                              
                              {/* Facilities/Features */}
                              <div className="mb-4">
                                <p className="text-sm text-[#6C757D] mb-2">Key Facilities:</p>
                                <div className="flex flex-wrap gap-2">
                                  {school.facilities.slice(0, 3).map((facility, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                      {facility}
                                    </span>
                                  ))}
                                  {school.facilities.length > 3 && (
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                      +{school.facilities.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Fee and Student-Teacher Ratio */}
                              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6C757D] mb-4">
                                <div>
                                  <i className="ri-money-rupee-circle-line mr-1"></i>
                                  <span>{school.fees}</span>
                                </div>
                                {school.studentTeacherRatio && (
                                  <div>
                                    <i className="ri-team-line mr-1"></i>
                                    <span>Student-Teacher: {school.studentTeacherRatio}</span>
                                  </div>
                                )}
                                {school.establishedYear && (
                                  <div>
                                    <i className="ri-calendar-check-line mr-1"></i>
                                    <span>Est. {school.establishedYear}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Actions */}
                              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <div className="text-sm">
                                  <span className="font-medium">{school.availableSeats}</span> spots available
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleViewDetails(school)}
                                    className="px-3 py-2 border border-[#4CAF50] text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/5"
                                  >
                                    School Details
                                  </button>
                                  <button
                                    onClick={() => handleApply(school)}
                                    disabled={!school.admissionOpen}
                                    className={`px-4 py-2 rounded-lg flex items-center ${
                                      school.admissionOpen
                                        ? 'bg-[#4CAF50] text-white hover:bg-[#45a049]'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                                  >
                                    <i className="ri-file-list-3-line mr-2"></i>
                                    Apply Now
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="space-y-6">
                {/* Applications Header */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#333333]">Your Applications</h2>
                      <p className="text-[#6C757D] mt-1">Track and manage your school enrollment applications</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab('search')}
                        className="px-4 py-2 bg-[#4CAF50]/10 text-[#4CAF50] rounded-lg hover:bg-[#4CAF50]/20 transition-colors flex items-center"
                      >
                        <i className="ri-add-line mr-2"></i>
                        Apply to School
                      </button>
                    </div>
                  </div>
                </div>

                {/* Applications List */}
                {applications.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
                    <div className="mb-4 mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gray-100">
                      <i className="ri-file-list-3-line text-4xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-medium text-[#333333] mb-2">No applications found</h3>
                    <p className="text-[#6C757D] mb-6 max-w-md mx-auto">
                      You haven't submitted any school applications yet. Start by searching for schools and applying.
                    </p>
                    <button 
                      onClick={() => setActiveTab('search')}
                      className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors"
                    >
                      Search Schools
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => {
                      const pendingDocuments = application.documents.filter(doc => doc.status === 'requested' || doc.status === 'pending').length;
                      const upcomingEvents = application.timeline.filter(event => event.status === 'upcoming').length;
                      
                      return (
                        <div 
                          key={application.id}
                          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl hover:border-[#4CAF50]/30 transition-all duration-300"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* School Image */}
                            <div className="md:w-1/4 h-40 md:h-auto relative">
                              <img
                                src={application.schoolImage}
                                alt={application.schoolName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Application Details */}
                            <div className="md:w-3/4 p-6">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="text-xl font-semibold text-[#333333]">{application.schoolName}</h3>
                                    <span className={`ml-3 px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(application.status)}`}>
                                      {application.status}
                                    </span>
                                  </div>
                                  <p className="text-[#6C757D] mt-1">
                                    Target: {application.targetGrade} | Start Year: {application.startYear} | Applied: {new Date(application.submittedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Action Items and Alerts */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center border border-gray-100 rounded-lg p-3 bg-gray-50">
                                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                                    <i className="ri-calendar-check-line text-blue-700"></i>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Last Updated</p>
                                    <p className="text-sm font-medium">{new Date(application.lastUpdate).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center border border-gray-100 rounded-lg p-3 bg-gray-50">
                                  <div className={`${pendingDocuments > 0 ? 'bg-yellow-100' : 'bg-green-100'} p-2 rounded-full mr-3`}>
                                    <i className={`${pendingDocuments > 0 ? 'ri-file-warning-line text-yellow-700' : 'ri-file-check-line text-green-700'}`}></i>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Documents</p>
                                    <p className="text-sm font-medium">
                                      {pendingDocuments > 0 ? `${pendingDocuments} pending/requested` : 'All submitted'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center border border-gray-100 rounded-lg p-3 bg-gray-50">
                                  <div className={`${upcomingEvents > 0 ? 'bg-purple-100' : 'bg-gray-200'} p-2 rounded-full mr-3`}>
                                    <i className={`${upcomingEvents > 0 ? 'ri-notification-3-line text-purple-700' : 'ri-check-double-line text-gray-500'}`}></i>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Upcoming</p>
                                    <p className="text-sm font-medium">
                                      {upcomingEvents > 0 ? `${upcomingEvents} upcoming ${upcomingEvents === 1 ? 'event' : 'events'}` : 'No upcoming events'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                                <div 
                                  className="bg-[#4CAF50] h-2.5 rounded-full"
                                  style={{ width: 
                                    application.status === 'Approved' ? '100%' :
                                    application.status === 'Waitlisted' ? '75%' :
                                    application.status === 'Assessment Scheduled' ? '50%' :
                                    application.status === 'Under Review' ? '25%' : '10%'
                                  }}
                                ></div>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleViewApplication(application)}
                                  className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors flex items-center"
                                >
                                  <i className="ri-eye-line mr-2"></i>
                                  View Application
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* Application Details Modal */}
                {showApplicationDetails && activeApplication && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div 
                      className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-[#333333]">Application Details</h2>
                        <button 
                          onClick={() => setShowApplicationDetails(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <i className="ri-close-line text-2xl"></i>
                        </button>
                      </div>
                      
                      <div className="p-6">
                        {/* School Info */}
                        <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                          <div className="w-full md:w-1/4">
                            <img 
                              src={activeApplication.schoolImage}
                              alt={activeApplication.schoolName}
                              className="w-full h-40 object-cover rounded-lg"
                            />
                          </div>
                          
                          <div className="w-full md:w-3/4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <h3 className="text-2xl font-bold text-[#333333]">
                                {activeApplication.schoolName}
                              </h3>
                              <span className={`mt-2 md:mt-0 px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(activeApplication.status)}`}>
                                {activeApplication.status}
                              </span>
                            </div>
                            
                            <div className="text-[#6C757D] mb-4">
                              <p>Application ID: {activeApplication.id}</p>
                              <p className="text-sm mt-1">
                                Submitted: {new Date(activeApplication.submittedDate).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Child Name</p>
                                <p className="font-medium">{activeApplication.childName}</p>
                              </div>
                              
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Target Grade</p>
                                <p className="font-medium">{activeApplication.targetGrade}</p>
                              </div>
                              
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Start Year</p>
                                <p className="font-medium">{activeApplication.startYear}</p>
                              </div>
                              
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Last Update</p>
                                <p className="font-medium">{new Date(activeApplication.lastUpdate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            {activeApplication.status === 'Waitlisted' && activeApplication.position && (
                              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 mb-4">
                                <div className="flex items-start">
                                  <div className="mr-3">
                                    <i className="ri-time-line text-orange-600"></i>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-orange-800">Waitlist Position: #{activeApplication.position}</h4>
                                    <p className="text-sm text-orange-700 mt-1">
                                      You're on the waitlist for this school. We'll notify you if a spot becomes available.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {activeApplication.notes && (
                              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                                <div className="flex items-start">
                                  <div className="mr-3">
                                    <i className="ri-information-line text-blue-600"></i>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-blue-800">Important Note</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                      {activeApplication.notes}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Application Timeline */}
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-[#333333] mb-4">Application Timeline</h3>
                          
                          <div className="space-y-4">
                            {activeApplication.timeline.map((event, index) => (
                              <div key={index} className="flex">
                                <div className="flex flex-col items-center mr-4">
                                  <div className={`w-8 h-8 rounded-full ${
                                    event.status === 'upcoming'
                                      ? 'bg-gray-200 text-gray-500' 
                                      : 'bg-[#4CAF50] text-white'
                                  } flex items-center justify-center`}>
                                    <i className={
                                      index === 0 ? 'ri-file-list-3-line' :
                                      index === activeApplication.timeline.length - 1 ? 'ri-check-line' :
                                      'ri-calendar-check-line'
                                    }></i>
                                  </div>
                                  {index < activeApplication.timeline.length - 1 && (
                                    <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                                  )}
                                </div>
                                <div className={`${event.status === 'upcoming' ? 'opacity-60' : ''}`}>
                                  <p className="font-medium text-[#333333]">{event.event}</p>
                                  <p className="text-sm text-[#6C757D]">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Documents Section */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-[#333333]">Required Documents</h3>
                            
                            <label className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049] transition-colors cursor-pointer">
                              <i className="ri-upload-2-line mr-2"></i>
                              Upload Document
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={handleUploadDocument} 
                              />
                            </label>
                          </div>
                          
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {activeApplication.documents.map((document, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <i className="ri-file-line text-gray-400 mr-2"></i>
                                        <span className="text-sm font-medium text-gray-900">{document.name}</span>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(document.status)}`}>
                                        {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {document.date 
                                        ? new Date(document.date).toLocaleDateString()
                                        : document.dueDate 
                                          ? `Due: ${new Date(document.dueDate).toLocaleDateString()}`
                                          : ''}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                      {document.status === 'approved' ? (
                                        <button className="text-blue-600 hover:text-blue-900">View</button>
                                      ) : document.status === 'requested' ? (
                                        <label className="text-[#4CAF50] hover:text-[#45a049] cursor-pointer">
                                          <i className="ri-upload-2-line mr-1"></i> Upload
                                          <input type="file" className="hidden" onChange={handleUploadDocument} />
                                        </label>
                                      ) : (
                                        <div className="flex space-x-2">
                                          <button className="text-blue-600 hover:text-blue-900">View</button>
                                          <button className="text-[#4CAF50] hover:text-[#45a049]">Replace</button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        
                        {/* Footer Actions */}
                        <div className="flex justify-between border-t border-gray-200 pt-4">
                          <button
                            onClick={() => handleCancelApplication(activeApplication.id)}
                            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                          >
                            Cancel Application
                          </button>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowApplicationDetails(false)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                              Close
                            </button>
                            
                            <button
                              onClick={() => {
                                toast.success("Message sent to admissions office");
                              }}
                              className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#45a049]"
                            >
                              <i className="ri-message-3-line mr-2"></i>
                              Contact School
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                {/* Applications list implementation */}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-[#333333] mb-4">Quick Links</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50]/20 transition-colors">
                  <span className="flex items-center">
                    <i className="ri-calendar-line mr-2"></i>
                    Schedule Visit
                  </span>
                  <i className="ri-arrow-right-line"></i>
                </button>
                {/* Add more quick links */}
              </div>
            </div>

            {/* Resources Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-[#333333] mb-4">Resources</h2>
              {/* Add resource links */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolEnrollment;
