import React, { useState } from 'react';
import { ArrowRight, Clock, ChevronRight } from 'lucide-react';

const PlacementTracks = () => {
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const placementTracks = [
    {
      id: 'python-dev',
      title: 'Python Developer',
      icon: null,
      description: 'Master Python for backend development and automation',
      duration: '12 weeks',
      modules: [
        'Python Fundamentals & OOP',
        'Web Frameworks (Django & Flask)',
        'REST APIs & Microservices',
        'Database Design (SQL & NoSQL)',
        'Cloud Deployment (AWS/Docker)',
        'Real-world Projects',
        'Interview Preparation'
      ]
    },
    {
      id: 'full-stack',
      title: 'Full Stack Developer',
      icon: null,
      description: 'Build complete web applications from frontend to backend',
      duration: '16 weeks',
      modules: [
        'React.js & Frontend Fundamentals',
        'State Management (Redux)',
        'Node.js & Express.js',
        'Databases (MongoDB & PostgreSQL)',
        'Authentication & Authorization',
        'Testing & Deployment',
        'MERN/MEAN Projects',
        'System Design Basics'
      ]
    },
    {
      id: 'data-engineer',
      title: 'Data Engineer',
      icon: null,
      description: 'Build scalable data pipelines and infrastructure',
      duration: '14 weeks',
      modules: [
        'SQL & Advanced Queries',
        'Python for Data Engineering',
        'ETL Pipelines',
        'Big Data Technologies (Spark)',
        'Data Warehousing',
        'Cloud Platforms (AWS Redshift)',
        'Real-time Data Streaming',
        'Performance Optimization'
      ]
    },
    {
      id: 'qa-engineer',
      title: 'QA Engineer',
      icon: null,
      description: 'Master quality assurance and automated testing',
      duration: '10 weeks',
      modules: [
        'QA Fundamentals & Types of Testing',
        'Manual Testing Techniques',
        'Selenium Automation',
        'Test Automation Frameworks',
        'Performance & Load Testing',
        'CI/CD Pipeline Integration',
        'Bug Tracking & Reporting',
        'Real Projects & Case Studies'
      ]
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist & AI Engineer',
      icon: null,
      description: 'Build AI models and solve complex data problems',
      duration: '16 weeks',
      modules: [
        'Python for Data Science',
        'Statistics & Probability',
        'Data Visualization',
        'Machine Learning Fundamentals',
        'Deep Learning & Neural Networks',
        'Natural Language Processing',
        'Deployment of ML Models',
        'Real-world Datasets & Projects'
      ]
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      icon: '⚙️',
      description: 'Master infrastructure automation and deployment',
      duration: '14 weeks',
      modules: [
        'Linux System Administration',
        'Scripting (Bash & Python)',
        'Docker & Containerization',
        'Kubernetes Orchestration',
        'CI/CD with Jenkins & GitLab',
        'Infrastructure as Code (Terraform)',
        'Monitoring & Logging',
        'Cloud Platforms (AWS/Azure)'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {!showCurriculum ? (
          <>
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-black mb-4">Placement Tracks</h1>
              <p className="text-xl text-slate-300">
                Choose your career path and master the skills industry demands
              </p>
            </div>

            {/* 6 Tiles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {placementTracks.map((track) => (
                <div 
                  key={track.id} 
                  className="bg-white/5 p-8 rounded-3xl border border-[#E0DCCF] hover:border-[#FF9500]/50 transition-all hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.25)] cursor-pointer group"
                >
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">{track.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{track.title}</h3>
                  <p className="text-slate-300 text-sm mb-4">{track.description}</p>
                  <div className="flex items-center gap-2 text-cyan-400 text-sm mb-6">
                    <Clock size={16} />
                    {track.duration}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedTrack(track);
                      setShowCurriculum(true);
                    }}
                    className="w-full bg-gradient-to-r from-[#FF9500] to-cyan-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-[0_4px_14px_rgba(255,149,0,0.2)] transition-all group-hover:translate-y-[-2px]"
                  >
                    Explore Curriculum
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Curriculum View */}
            <button 
              onClick={() => {
                setShowCurriculum(false);
                setSelectedTrack(null);
              }}
              className="mb-8 flex items-center gap-2 text-[#FF9500] hover:text-[#CC7000] font-bold transition-colors"
            >
              ← Back to Tracks
            </button>

            <div className="bg-gradient-to-br from-[#FF9500] to-cyan-600 p-1 rounded-3xl mb-12">
              <div className="bg-slate-900 rounded-[calc(1.5rem-1px)] p-12">
                <div className="flex items-center gap-8 mb-8">
                  <div className="text-7xl">{selectedTrack?.icon}</div>
                  <div>
                    <h2 className="text-5xl font-black mb-4">{selectedTrack?.title}</h2>
                    <p className="text-slate-300 text-lg mb-4">{selectedTrack?.description}</p>
                    <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                      <Clock size={20} />
                      Duration: {selectedTrack?.duration}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Modules */}
            <div className="mb-12">
              <h3 className="text-3xl font-black mb-8">Curriculum Modules</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {selectedTrack?.modules.map((module, index) => (
                  <div key={index} className="bg-white/5 p-6 rounded-2xl border border-[#E0DCCF] hover:border-[#FF9500]/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#FF9500] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="text-lg font-semibold">{module}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[#FF9500] to-cyan-600 rounded-3xl p-12 text-center">
              <h3 className="text-3xl font-black mb-4">Ready to Start Your Journey?</h3>
              <p className="text-lg text-white/90 mb-8">
                Enroll now and get access to the complete {selectedTrack?.title} curriculum with 1:1 mentorship
              </p>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#/contact';
                }}
                className="bg-white text-[#FF9500] px-12 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-white/20 transition-all"
              >
                Contact us to enroll
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlacementTracks;
