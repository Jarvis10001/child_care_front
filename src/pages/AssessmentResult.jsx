import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/axiosConfig';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AssessmentResult = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/assessments/results/${assessmentId}`);
        
        if (response.data.success) {
          setResult(response.data.assessment);
        } else {
          setError('Failed to load assessment results');
        }
      } catch (error) {
        console.error('Error fetching assessment results:', error);
        setError('An error occurred while loading the results.');
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchResults();
    }
  }, [assessmentId]);

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'text-red-700';
      case 'moderate': return 'text-orange-700';
      case 'low': return 'text-amber-700';
      default: return 'text-emerald-700';
    }
  };

  const getRiskBackground = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'moderate': return 'bg-orange-50 border-orange-200';
      case 'low': return 'bg-amber-50 border-amber-200';
      default: return 'bg-emerald-50 border-emerald-200';
    }
  };

  const getRiskBadge = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-amber-100 text-amber-800';
      default: return 'bg-emerald-100 text-emerald-800';
    }
  };

  const getCategoryColor = (score) => {
    if (score >= 85) return 'bg-[#4CAF50]';
    if (score >= 70) return 'bg-amber-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreEmoji = (score) => {
    if (score >= 85) return '😃';
    if (score >= 70) return '🙂';
    if (score >= 50) return '😐';
    return '😟';
  };

  const handleBookAppointment = () => {
    toast.success('Redirecting to appointment booking');
    navigate('/dashboard/appointment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#4CAF50] mx-auto mb-4"></div>
          <p className="text-[#6C757D] font-medium">Loading assessment results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center shadow-sm">
          <div className="text-red-500 mb-4 text-xl">
            <i className="ri-error-warning-line text-3xl block mb-2"></i>
            {error}
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#4CAF50] text-white rounded-xl hover:bg-[#45a049] transition-colors shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md text-center shadow-lg border border-gray-100">
          <i className="ri-file-search-line text-5xl text-[#6C757D] mb-4"></i>
          <p className="text-[#6C757D] mb-6 text-lg">Assessment result not available</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#4CAF50] text-white rounded-xl hover:bg-[#45a049] transition-colors shadow-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#4CAF50]">
                Assessment Results
              </h1>
              <p className="text-[#6C757D] mt-1">
                Assessment {result.assessmentNumber} • {result.ageRange} • 
                <span className="ml-1 text-xs">
                  {new Date(result.completedAt).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </p>
            </div>
            
            <div className={`px-4 py-2 rounded-full ${getRiskBadge(result.riskAssessment?.riskLevel)} flex items-center self-start sm:self-center`}>
              <span className="mr-2 text-xl">
                {result.riskAssessment?.riskLevel === 'none' ? '✓' : '⚠️'}
              </span>
              <span className="font-medium">
                {result.riskAssessment?.riskLevel === 'none' ? 'On Track' : 
                 `${result.riskAssessment?.riskLevel.charAt(0).toUpperCase() + result.riskAssessment?.riskLevel.slice(1)} Risk`}
              </span>
            </div>
          </div>
        </div>

        {/* Content Section - Changed from grid to sequential layout */}
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#333333]">Overall Development Score</h2>
              <div className="flex items-center">
                <span className="text-4xl mr-2">{getScoreEmoji(result.overallScore)}</span>
                <span className={`text-2xl sm:text-3xl font-bold ${getRiskLevelColor(result.riskAssessment?.riskLevel)}`}>
                  {Math.round(result.overallScore)}%
                </span>
              </div>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden">
              <div 
                className={`h-5 rounded-full ${getCategoryColor(result.overallScore)}`}
                style={{ width: `${result.overallScore}%` }}
              >
                <div className="h-full w-full opacity-30 bg-white/20"></div>
              </div>
            </div>
            
            <div className="flex justify-between mt-2 text-xs text-[#6C757D]">
              <div>0%</div>
              <div>50%</div>
              <div>100%</div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-[#333333] mb-6">Development by Category</h2>
            <div className="space-y-6">
              {Object.entries(result.categoryScores || {}).map(([category, score], index) => {
                const formattedCategory = category
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                  
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center bg-[#4CAF50]/10 text-[#4CAF50] mr-3">
                          {category === 'grossMotor' && <i className="ri-run-line"></i>}
                          {category === 'fineMotor' && <i className="ri-hand-coin-line"></i>}
                          {category === 'language' && <i className="ri-message-3-line"></i>}
                          {category === 'cognitive' && <i className="ri-brain-line"></i>}
                          {category === 'socialEmotional' && <i className="ri-heart-line"></i>}
                        </span>
                        <span className="font-medium text-[#333333]">
                          {formattedCategory}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-lg font-semibold ${
                          score < 50 ? 'text-red-600' : 
                          score < 70 ? 'text-orange-600' :
                          score < 85 ? 'text-amber-600' : 
                          'text-[#4CAF50]'
                        }`}>
                          {Math.round(score)}%
                        </span>
                        <span className="ml-2">{getScoreEmoji(score)}</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        style={{ width: `${score}%`, transition: 'width 1s ease-out' }}
                        className={`h-3 rounded-full ${getCategoryColor(score)}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk Assessment - Moved below Development by Category */}
          {result.riskAssessment && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden">
              <h2 className="text-xl font-semibold text-[#333333] mb-4">Risk Assessment</h2>
              
              <div className={`p-4 rounded-xl mb-5 border ${getRiskBackground(result.riskAssessment.riskLevel)}`}>
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                    result.riskAssessment.isAtRisk 
                      ? result.riskAssessment.riskLevel === 'high'
                        ? 'bg-red-100 text-red-600'
                        : result.riskAssessment.riskLevel === 'moderate'
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-amber-100 text-amber-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {result.riskAssessment.isAtRisk ? (
                      <i className="ri-alert-line text-xl"></i>
                    ) : (
                      <i className="ri-check-line text-xl"></i>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-base md:text-lg break-words ${getRiskLevelColor(result.riskAssessment.riskLevel)}`}>
                      {result.riskAssessment.isAtRisk ? (
                        `${result.riskAssessment.riskLevel.charAt(0).toUpperCase() + result.riskAssessment.riskLevel.slice(1)} Risk Detected`
                      ) : (
                        'Development On Track'
                      )}
                    </h3>
                    
                    <p className="text-gray-700 mt-2 leading-relaxed text-sm break-words">
                      {result.riskAssessment.recommendation}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.riskAssessment.riskAreas && result.riskAssessment.riskAreas.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-[#333333] mb-2">Areas That Need Attention:</h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                      {result.riskAssessment.riskAreas.map((area, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-gray-50 p-2 rounded-lg"
                        >
                          <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-2 flex-shrink-0">
                            <i className="ri-focus-3-line text-xs"></i>
                          </span>
                          <span className="text-[#333333] text-sm break-words">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Appointment Recommendation */}
                {result.riskAssessment.needsAppointment && (
                  <div className="md:col-span-1">
                    <div className="bg-[#4CAF50] text-white p-4 rounded-xl shadow-md h-full">
                      <div className="flex items-start">
                        <div className="bg-white/20 p-2 rounded-full mr-3 flex-shrink-0">
                          <i className="ri-calendar-check-line text-xl"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-base">Professional Consultation</h3>
                          <p className="text-white/80 text-xs mt-1 break-words">
                            We recommend scheduling an appointment with a specialist
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <button
                          onClick={handleBookAppointment}
                          className="w-full bg-white text-[#4CAF50] hover:bg-gray-100 font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm"
                        >
                          <i className="ri-calendar-line mr-1"></i>
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* What's Next Section */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-[#333333] mb-4">What's Next?</h2>
            
            <ul className="space-y-4">
              <li className="flex">
                <div className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50]">
                  <i className="ri-file-list-3-line"></i>
                </div>
                <div className="text-[#6C757D]">
                  Continue with regular assessments to track your child's progress
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50]">
                  <i className="ri-book-read-line"></i>
                </div>
                <div className="text-[#6C757D]">
                  Review the suggested activities in your dashboard to support development
                </div>
              </li>
              <li className="flex">
                <div className="mr-3 flex-shrink-0 w-6 h-6 rounded-full bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50]">
                  <i className="ri-discuss-line"></i>
                </div>
                <div className="text-[#6C757D]">
                  Share these results with your healthcare provider at your next visit
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[#333333] rounded-xl transition-colors duration-200 flex items-center justify-center"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Dashboard
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-[#4CAF50]/10 hover:bg-[#4CAF50]/20 text-[#4CAF50] rounded-xl transition-colors duration-200 flex items-center justify-center"
          >
            <i className="ri-printer-line mr-2"></i>
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;
