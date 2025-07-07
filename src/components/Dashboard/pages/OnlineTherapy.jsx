import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OnlineTherapy = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reschedulingSession, setReschedulingSession] = useState(null);
  const [activeResourceCategory, setActiveResourceCategory] = useState('all');
  const [resourceSearchQuery, setResourceSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const therapyTypes = [
    {
      title: 'Speech & Language',
      icon: 'ri-chat-voice-line',
      image: 'https://images.unsplash.com/photo-1618355776464-8666794d2520?ixlib=rb-4.0.3',
      description: 'Develop communication, articulation, and language skills',
      duration: '45 minutes',
      price: '₹800',
      benefits: [
        'Speech clarity improvement',
        'Language development',
        'Communication skills',
        'Interactive exercises'
      ]
    },
    {
      title: 'Occupational Therapy',
      icon: 'ri-mind-map',
      image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?ixlib=rb-4.0.3',
      description: 'Enhance daily living skills and motor development',
      duration: '45 minutes',
      price: '₹900',
      benefits: [
        'Motor skills development',
        'Sensory integration',
        'Daily living skills',
        'Hand-eye coordination'
      ]
    },
    {
      title: 'Behavioral Therapy',
      icon: 'ri-emotion-happy-line',
      image: 'https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3',
      description: 'Address behavioral challenges and social skills',
      duration: '45 minutes',
      price: '₹850',
      benefits: [
        'Behavior management',
        'Social skills training',
        'Emotional regulation',
        'Parent coaching'
      ]
    }
  ];

  const upcomingSession = {
    type: 'Speech Therapy',
    date: 'Today',
    time: '3:00 PM',
    therapist: 'Dr. Sarah Johnson',
    meetingId: 'meet-123-456'
  };

  // Mock data for sessions
  const upcomingSessions = [
    {
      id: 'session-001',
      type: 'Speech Therapy',
      date: '2023-09-15',
      time: '15:00',
      duration: '45 minutes',
      therapist: {
        name: 'Dr. Sarah Johnson',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3',
        specialization: 'Speech Pathologist'
      },
      meetingId: 'meet-123-456'
    },
    {
      id: 'session-002',
      type: 'Occupational Therapy',
      date: '2023-09-18',
      time: '10:00',
      duration: '60 minutes',
      therapist: {
        name: 'Dr. Raj Patel',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3',
        specialization: 'Pediatric Occupational Therapist'
      },
      meetingId: 'meet-789-012'
    }
  ];

  const pastSessions = [
    {
      id: 'past-001',
      type: 'Speech Therapy',
      date: '2023-09-08',
      time: '15:00',
      duration: '45 minutes',
      therapist: 'Dr. Sarah Johnson',
      status: 'Completed',
      notes: 'Great progress with consonant sounds. Homework assigned for practicing "r" sounds.',
      recording: true
    },
    {
      id: 'past-002',
      type: 'Behavioral Therapy',
      date: '2023-09-05',
      time: '14:00',
      duration: '45 minutes',
      therapist: 'Dr. Ananya Sharma',
      status: 'Completed',
      notes: 'Focused on emotional regulation. New techniques introduced for managing frustration.',
      recording: true
    },
    {
      id: 'past-003',
      type: 'Speech Therapy',
      date: '2023-09-01',
      time: '15:00',
      duration: '45 minutes',
      therapist: 'Dr. Sarah Johnson',
      status: 'Cancelled',
      notes: '',
      recording: false
    }
  ];

  // Session calendar days (mock data)
  const calendarDays = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date,
      hasSession: [1, 4, 8, 11].includes(i),
      isPast: i < 0,
      isToday: i === 0
    };
  });

  // Available time slots for scheduling/rescheduling
  const availableTimeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const handleRescheduleSession = (session) => {
    setReschedulingSession(session);
  };

  const confirmReschedule = () => {
    toast.success('Session rescheduled successfully');
    setReschedulingSession(null);
  };

  const cancelSession = (sessionId) => {
    toast.success('Session cancelled successfully');
    // Here you would typically make an API call to cancel the session
  };

  const handleJoinSession = (meetingId) => {
    navigate(`/meeting/${meetingId}`);
  };

  const handleBookSession = (therapyType) => {
    navigate('/dashboard/consultations/schedule', { 
      state: { therapyType } 
    });
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Resource categories
  const resourceCategories = [
    { id: 'all', name: 'All Resources', icon: 'ri-folder-line' },
    { id: 'activities', name: 'Activities', icon: 'ri-game-line' },
    { id: 'guides', name: 'Guides', icon: 'ri-book-read-line' },
    { id: 'videos', name: 'Videos', icon: 'ri-video-line' },
    { id: 'worksheets', name: 'Worksheets', icon: 'ri-file-paper-2-line' },
    { id: 'apps', name: 'Apps', icon: 'ri-smartphone-line' }
  ];

  // Resource data
  const resources = [
    {
      id: 1,
      title: "Speech Sound Development Activities",
      description: "Fun activities to practice articulation at home",
      category: "activities",
      type: "PDF",
      therapyType: "Speech",
      ageRange: "3-6 years",
      thumbnail: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3",
      rating: 4.8,
      downloads: 1240
    },
    {
      id: 2,
      title: "Fine Motor Skills Development Guide",
      description: "Step-by-step activities to improve hand control and coordination",
      category: "guides",
      type: "PDF",
      therapyType: "Occupational",
      ageRange: "2-7 years",
      thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3",
      rating: 4.9,
      downloads: 980
    },
    {
      id: 3,
      title: "Emotional Regulation Techniques",
      description: "Video demonstration of emotional regulation strategies for children",
      category: "videos",
      type: "Video",
      therapyType: "Behavioral",
      ageRange: "4-10 years",
      thumbnail: "https://images.unsplash.com/photo-1596463059283-da257325bab8?ixlib=rb-4.0.3",
      duration: "18 min",
      rating: 4.7,
      views: 3450
    },
    {
      id: 4,
      title: "Weekly Communication Tracker",
      description: "Printable worksheet to track speech and language progress",
      category: "worksheets",
      type: "PDF",
      therapyType: "Speech",
      ageRange: "All ages",
      thumbnail: "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      rating: 4.5,
      downloads: 2100
    },
    {
      id: 5,
      title: "Sensory Play Ideas for Home",
      description: "Guide to creating sensory-rich activities with household items",
      category: "guides",
      type: "PDF",
      therapyType: "Occupational",
      ageRange: "1-8 years",
      thumbnail: "https://images.unsplash.com/photo-1560252829-804f1aedf1be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      rating: 4.6,
      downloads: 1650
    },
    {
      id: 6,
      title: "Speech Bliss App Guide",
      description: "Tutorial on using the Speech Bliss app for speech therapy practice",
      category: "apps",
      type: "Guide",
      therapyType: "Speech",
      ageRange: "3-12 years",
      thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      rating: 4.4,
      downloads: 890
    },
    {
      id: 7,
      title: "Social Skills Scenarios",
      description: "Video role-plays of common social situations for children",
      category: "videos",
      type: "Video Series",
      therapyType: "Behavioral",
      ageRange: "5-12 years",
      thumbnail: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      duration: "45 min",
      rating: 4.8,
      views: 2780
    },
    {
      id: 8,
      title: "Motor Skills Development Activities",
      description: "Interactive activities to improve coordination and strength",
      category: "activities",
      type: "PDF",
      therapyType: "Occupational",
      ageRange: "3-10 years",
      thumbnail: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
      rating: 4.7,
      downloads: 1320
    }
  ];
  
  // Filter resources based on active category and search query
  const filteredResources = resources.filter(resource => {
    // Filter by category
    if (activeResourceCategory !== 'all' && resource.category !== activeResourceCategory) {
      return false;
    }
    
    // Filter by search query
    if (resourceSearchQuery) {
      const query = resourceSearchQuery.toLowerCase();
      return (
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.therapyType.toLowerCase().includes(query) ||
        resource.ageRange.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Function to handle resource download/view
  const handleResourceAction = (resource) => {
    toast.success(`${resource.type === 'Video' ? 'Opening' : 'Downloading'}: ${resource.title}`);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div 
            className="relative h-64 rounded-xl overflow-hidden mb-6"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#4CAF50]/90 to-transparent"></div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-[#4CAF50]/10 p-4 rounded-full mr-4">
                <i className="ri-video-chat-line text-3xl text-[#4CAF50]"></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#333333]">Online Therapy</h1>
                <p className="text-[#6C757D] mt-1">Professional therapy sessions from the comfort of home</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 border-b border-gray-200">
            {['overview', 'sessions', 'resources'].map((tab) => (
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

        {/* Upcoming Session Alert */}
        {activeTab !== 'sessions' && upcomingSession && (
          <div className="bg-[#4CAF50]/10 rounded-2xl p-6 border border-[#4CAF50]/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <div className="bg-[#4CAF50]/20 p-3 rounded-full mr-4">
                  <i className="ri-video-chat-line text-xl text-[#4CAF50]"></i>
                </div>
                <div>
                  <p className="text-sm text-[#4CAF50] font-medium">Upcoming Session</p>
                  <h3 className="text-lg font-semibold text-[#333333]">
                    {upcomingSession.type} with {upcomingSession.therapist}
                  </h3>
                  <p className="text-sm text-[#6C757D]">
                    {upcomingSession.date} at {upcomingSession.time}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleJoinSession(upcomingSession.meetingId)}
                className="bg-[#4CAF50] text-white px-6 py-2 rounded-lg hover:bg-[#45a049] transition-colors flex items-center"
              >
                <i className="ri-video-add-line mr-2"></i>
                Join Session
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {therapyTypes.map((therapy, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:border-[#4CAF50]/20 transition-all duration-300"
                  >
                    <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                      <img 
                        src={therapy.image}
                        alt={therapy.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-[#4CAF50]/10 w-10 h-10 rounded-lg backdrop-blur-md flex items-center justify-center">
                          <i className={`${therapy.icon} text-xl text-white`}></i>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-[#333333] mb-2">{therapy.title}</h3>
                    <p className="text-sm text-[#6C757D] mb-4">{therapy.description}</p>
                    
                    <div className="flex items-center justify-between mb-4 text-sm">
                      <span className="text-[#6C757D]">
                        <i className="ri-time-line mr-1"></i> {therapy.duration}
                      </span>
                      <span className="font-medium text-[#4CAF50]">{therapy.price}/session</span>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {therapy.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <i className="ri-checkbox-circle-line text-[#4CAF50] mr-2 mt-0.5"></i>
                          <span className="text-[#6C757D]">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handleBookSession(therapy.title)}
                      className="w-full bg-[#4CAF50]/10 text-[#4CAF50] py-2 rounded-lg hover:bg-[#4CAF50]/20 transition-colors"
                    >
                      Book Session
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Other tabs remain unchanged */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineTherapy;