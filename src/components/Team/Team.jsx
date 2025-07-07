import React from 'react';

const Team = () => {
  const teamMembers = [
    {
      name: "Yashika",
      role: "Frontend Developer",
      bio: "Specializing in Python, C++, React, and Data Handling with expertise in Frontend Development and Database Management.",
      skills: ["Python", "C++", "React", "Pandas", "SQL", "MongoDB"],
      socials: {
        github: "#",
        linkedin: "#",
        email: "mailto:yashika@childcare.com"
      }
    },
    {
      name: "Jashandeep Singh",
      role: "Full Stack Developer",
      bio: "Full stack developer with expertise in React.js and modern web technologies. Skilled in creating intuitive user interfaces and robust backend systems.",
      skills: [
        "React.js (Advanced)",
        "Node.js",
        "MongoDB",
        "Tailwind CSS",
        "AI Integration"
      ],
      highlights: [
        "React Development Expert",
        "UI/UX Specialist",
        "Clean Code Architect"
      ],
      socials: {
        github: "#",
        linkedin: "#",
        email: "mailto:jashandeep@childcare.com",
        portfolio: "#"
      }
    },
    {
      name: "Ayush Parihar",
      role: "ML Developer",
      bio: "Specialized in Machine Learning, Python development, and Full Stack Web Development.",
      skills: ["Python", "Machine Learning", "JavaScript", "SQL", "MongoDB"],
      socials: {
        github: "#",
        linkedin: "#",
        email: "mailto:ayush@childcare.com"
      }
    }
  ];

  return (
    <section className="bg-gradient-to-br from-slate-50 to-[#f0f7f0] py-20 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#4CAF50]/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#5C9DFF]/5 rounded-full translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-[#4CAF50] uppercase bg-[#4CAF50]/10 rounded-full">Our Team</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-3 sm:text-4xl lg:text-5xl">
            Meet Our <span className="text-[#4CAF50] relative">Developers
              <svg className="absolute bottom-1 left-0 w-full h-3 -z-10 text-[#4CAF50]/10" viewBox="0 0 172 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 15.5C1 15.5 64 1 86 1C108 1 171.5 15.5 171.5 15.5" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Passionate developers committed to creating innovative solutions
          </p>
        </div>

        {/* Team Grid - Modified to emphasize Jashandeep's card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                index === 1 
                  ? 'md:-translate-y-4 md:scale-105 border-[#4CAF50]/30 shadow-xl hover:shadow-2xl' 
                  : 'hover:border-[#4CAF50]/30'
              }`}
            >
              <div className={`relative ${index === 1 ? 'h-48' : 'h-40'} overflow-hidden bg-gradient-to-r ${
                index === 1
                  ? 'from-[#4CAF50] to-[#45a049]'
                  : 'from-gray-700 to-gray-800'
              }`}>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-semibold">{member.name}</h3>
                  <p className="text-white/90 text-sm">{member.role}</p>
                  {index === 1 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {member.highlights.slice(0, 3).map((highlight, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full text-white">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`p-6 ${index === 1 ? 'bg-gradient-to-br from-white to-[#4CAF50]/5' : ''}`}>
                <p className="text-gray-600 mb-4">{member.bio}</p>
                
                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        index === 1
                          ? 'text-[#4CAF50] bg-[#4CAF50]/10 border border-[#4CAF50]/20'
                          : 'text-[#4CAF50] bg-[#4CAF50]/10'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  {Object.entries(member.socials).map(([platform, link]) => (
                    <a
                      key={platform}
                      href={link}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index === 1
                          ? 'bg-[#4CAF50] text-white hover:bg-[#45a049] shadow-lg hover:shadow-xl'
                          : 'bg-[#4CAF50]/10 text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white'
                      }`}
                    >
                      <i className={`ri-${platform}-fill text-lg`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
