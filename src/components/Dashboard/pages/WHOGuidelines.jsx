import React, { useState } from 'react';
import { BookOpenCheck, AlertCircle, CheckCircle2, Link, FileText } from 'lucide-react';
import { 
    glossaryTerms, 
    backgroundInfo, 
    recommendationsData, 
    flowchartRecommendations,
    researchAndImplementation,
    additionalContent,
    whoGuidelines 
} from '../../../data/whoGuidelinesData';

const WHOGuidelines = () => {
  const [activeTab, setActiveTab] = useState('background');

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#333333] mb-4">WHO Guidelines: Improving Early Childhood Development</h1>
        <p className="text-[#6C757D]">Evidence-based recommendations for supporting early childhood development from pregnancy to age 3</p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4 border-b overflow-x-auto">
          {['Background', 'Glossary', 'Recommendations', 'Resources'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium whitespace-nowrap transition-colors duration-300 ${
                activeTab === tab.toLowerCase().replace(/ & /g, '-') 
                  ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
                  : 'text-[#6C757D] hover:text-[#4CAF50]/80'
              }`}
              onClick={() => setActiveTab(tab.toLowerCase().replace(/ & /g, '-'))}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'background' && (
        <div className="space-y-6">
          {backgroundInfo.mainContent.map((section, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
              <h3 className="text-xl font-semibold text-[#333333] mb-4">{section.title}</h3>
              <div className="space-y-4">
                <p className="text-[#6C757D]">{section.content}</p>
                {section.characteristics && (
                  <p className="text-[#6C757D] border-l-4 border-[#4CAF50] pl-4">{section.characteristics}</p>
                )}
                {section.importance && (
                  <p className="text-[#6C757D] italic">{section.importance}</p>
                )}
                {section.significance && (
                  <p className="text-[#6C757D] font-medium">{section.significance}</p>
                )}
                {section.purpose && (
                  <p className="text-[#6C757D] bg-[#4CAF50]/5 p-4 rounded-xl">{section.purpose}</p>
                )}
              </div>
            </div>
          ))}

          {/* Stakeholder Engagement */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-[#333333] mb-4">{additionalContent.stakeholderEngagement.title}</h3>
            <p className="text-[#6C757D]">{additionalContent.stakeholderEngagement.content}</p>
          </div>

          {/* Implementation Details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-[#333333] mb-4">{additionalContent.implementation.title}</h3>
            <div className="space-y-4">
              {additionalContent.implementation.items.map((item, index) => (
                <div key={index} className="border-l-4 border-[#4CAF50] pl-4">
                  <h4 className="font-medium text-[#333333] mb-2">{item.title}</h4>
                  <p className="text-[#6C757D]">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Concepts */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-[#333333] mb-4">{additionalContent.keyConcepts.title}</h3>
            <div className="space-y-4">
              {additionalContent.keyConcepts.concepts.map((concept, index) => (
                <div key={index} className="mb-4">
                  <h4 className="text-lg font-medium text-[#333333] mb-2">{concept.term}</h4>
                  <p className="text-[#6C757D]">{concept.definition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* References */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
            <h3 className="text-xl font-semibold text-[#333333] mb-4">{additionalContent.references.title}</h3>
            <div className="space-y-2">
              {additionalContent.references.links.map((ref, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Link className="w-4 h-4 mt-1 text-[#4CAF50] flex-shrink-0" />
                  <a 
                    href={`https://${ref.url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#4CAF50] hover:underline"
                  >
                    {ref.text}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'glossary' && (
        <div className="grid gap-6 md:grid-cols-2">
          {glossaryTerms.map((item, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
              <div className="flex items-start mb-2">
                <div className="h-8 w-8 rounded-lg bg-[#4CAF50]/10 flex items-center justify-center mr-3">
                  <BookOpenCheck className="w-5 h-5 text-[#4CAF50] mt-1 flex-shrink-0" />
                </div>
                <h3 className="text-lg font-semibold text-[#333333]">{item.term}</h3>
              </div>
              <p className="text-[#6C757D] text-sm">{item.definition}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center text-[#333333] mb-8">
            WHO Recommendations to Improve Early Childhood Development
          </h2>
          
          <div className="flex flex-col space-y-4">
            {flowchartRecommendations.map((rec, index) => (
              <div key={rec.id} className="relative">
                {/* Connecting Line */}
                {index < flowchartRecommendations.length - 1 && (
                  <div className="absolute left-1/2 bottom-0 w-0.5 h-4 bg-[#4CAF50]/20 -mb-4 transform -translate-x-1/2"></div>
                )}
                
                {/* Recommendation Box */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-[#4CAF50]/20 p-6 max-w-3xl mx-auto">
                  <div className="flex items-start">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#4CAF50]/10 flex items-center justify-center text-[#4CAF50] font-bold text-xl">
                      {rec.id}
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-xl font-bold text-[#333333] mb-2">{rec.title}</h3>
                      <p className="text-[#6C757D] mb-4">{rec.description}</p>
                      <div className="flex flex-wrap gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Strength: {rec.strength}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          Evidence: {rec.evidence}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
            <p className="text-[#6C757D] text-lg">{recommendationsData.introduction.content}</p>
          </div>

          {recommendationsData.sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
              <h3 className="text-xl font-semibold text-[#333333] mb-4">{section.title}</h3>
              <p className="text-[#6C757D] mb-4">{section.content}</p>

              {section.subsections && (
                <div className="space-y-4 mt-4">
                  {section.subsections.map((sub, idx) => (
                    <div key={idx} className="pl-4 border-l-4 border-[#4CAF50]">
                      <h4 className="font-medium text-[#333333] mb-2">{sub.subtitle}</h4>
                      <p className="text-[#6C757D]">{sub.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.steps && (
                <div className="mt-4">
                  <h4 className="font-medium text-[#333333] mb-2">Development Steps:</h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    {section.steps.map((step, idx) => (
                      <li key={idx} className="text-[#6C757D]">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {section.framework && (
                <div className="mt-4 bg-[#4CAF50]/5 p-4 rounded-xl">
                  <h4 className="font-medium text-[#333333] mb-2">{section.framework.title}</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {section.framework.points.map((point, idx) => (
                      <li key={idx} className="text-[#6C757D]">{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'research' && (
        <div className="space-y-8">
          {/* Research Gaps Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
            <div className="flex items-start mb-4">
              <AlertCircle className="w-6 h-6 text-amber-500 mt-1 mr-3" />
              <h3 className="text-2xl font-bold text-[#333333]">{researchAndImplementation.researchGaps.title}</h3>
            </div>
            <p className="text-[#6C757D] mb-6">{researchAndImplementation.researchGaps.introduction}</p>
            <ol className="list-decimal space-y-4 pl-5">
              {researchAndImplementation.researchGaps.gaps.map((gap, index) => (
                <li key={index} className="text-[#6C757D] pl-2">{gap}</li>
              ))}
            </ol>
          </div>

          {/* Implementation Considerations Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
            <div className="flex items-start mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-500 mt-1 mr-3" />
              <h3 className="text-2xl font-bold text-[#333333]">{researchAndImplementation.implementation.title}</h3>
            </div>
            <div className="space-y-6">
              {researchAndImplementation.implementation.sections.map((section, index) => (
                <div key={index} className="border-l-4 border-green-200 pl-4">
                  <h4 className="text-lg font-semibold text-[#333333] mb-2">{section.heading}</h4>
                  <p className="text-[#6C757D]">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-[#333333] mb-6">{whoGuidelines.title}</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {whoGuidelines.categories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 hover:border-[#4CAF50]/20 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-[#333333] mb-4">{category.title}</h3>
                <div className="space-y-3">
                  {category.resources.map((resource, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <FileText className="w-5 h-5 text-[#4CAF50] mt-1 flex-shrink-0" />
                      <a 
                        href={`https://${resource.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4CAF50] hover:underline text-sm"
                      >
                        {resource.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WHOGuidelines;