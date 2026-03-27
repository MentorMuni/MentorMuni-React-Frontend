import React, { useState } from 'react';
import { FileText, Users, Linkedin, ArrowRight, Check, Eye } from 'lucide-react';

/**
 * Professional Upsell Services Section
 * Displays Resume Rewrite, Review Sessions, and LinkedIn Optimization services
 * Shows personalized messaging based on ATS score
 */
const ProfessionalUpsellSection = ({ atsScore = 70, targetRole = 'Backend Developer' }) => {
  const [activeService, setActiveService] = useState(null);

  // Personalized heading based on score
  const getUpsellHeading = () => {
    if (atsScore < 60) {
      return {
        title: 'Your resume needs improvement. Let\'s fix it professionally.',
        subtitle: 'Get expert help to transform your resume into a recruiter magnet',
        color: 'text-red-600'
      };
    } else if (atsScore < 75) {
      return {
        title: 'You\'re close. Let\'s optimize it for higher impact.',
        subtitle: 'Polish your resume to stand out from other competitive candidates',
        color: 'text-amber-600'
      };
    } else {
      return {
        title: 'Great foundation. Let\'s make it exceptional.',
        subtitle: 'Elevate your resume to industry-leading standards',
        color: 'text-green-600'
      };
    }
  };

  const heading = getUpsellHeading();

  const services = [
    {
      id: 'rewrite',
      icon: FileText,
      title: 'Resume Rewrite by Industry Experts',
      subtitle: 'ATS-optimized. Impact-driven. Results-focused.',
      price: '₹1,999',
      duration: '2-3 business days',
      includes: [
        'Complete resume restructuring',
        'Achievement-focused rewriting',
        'Keyword optimization for target role',
        'ATS compliance formatting',
        '2 revision rounds'
      ],
      recommended: atsScore < 65,
      cta: 'Get Started',
      ctaSecondary: 'View Sample'
    },
    {
      id: 'review',
      icon: Users,
      title: '1:1 Resume Strategy Call',
      subtitle: '30-minute expert review session',
      price: '₹999',
      duration: 'Live session',
      includes: [
        'Personalized resume feedback',
        'Role alignment guidance',
        'Interview positioning advice',
        'Improvement roadmap',
        'Direct expert consultation'
      ],
      recommended: atsScore >= 65 && atsScore < 80,
      cta: 'Book Session',
      ctaSecondary: 'Check Availability'
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      title: 'LinkedIn Profile Optimization',
      subtitle: 'Increase recruiter visibility in India',
      price: '₹1,499',
      duration: '1-2 business days',
      includes: [
        'Headline rewrite',
        'About section optimization',
        'Keyword insertion',
        'Experience bullet rewriting',
        'Profile SEO optimization'
      ],
      recommended: atsScore >= 70,
      cta: 'Optimize Now',
      ctaSecondary: 'View Guidelines'
    }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 rounded-3xl p-8 md:p-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2 className={`text-3xl md:text-4xl font-black mb-3 ${heading.color}`}>
          {heading.title}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {heading.subtitle}
        </p>

        {/* ATS Score Badge */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <span className="text-sm text-gray-600">Your ATS Score:</span>
            <span className="text-xl font-bold text-[#FF9500]">{atsScore}/100</span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {services.map((service) => {
          const Icon = service.icon;
          const isActive = activeService === service.id;

          return (
            <div
              key={service.id}
              className={`relative rounded-2xl transition-all duration-300 overflow-hidden ${
                service.recommended
                  ? 'ring-2 ring-[#FF9500] shadow-xl scale-105 md:scale-100'
                  : 'border border-gray-200 hover:border-gray-300'
              } ${
                isActive ? 'bg-[#FFF4E0]' : 'bg-white'
              }`}
            >
              {/* Recommended Badge */}
              {service.recommended && (
                <div className="absolute top-4 right-4 bg-[#FF9500] text-white text-xs font-bold px-3 py-1 rounded-full">
                  Recommended for you
                </div>
              )}

              <div className="p-6 flex flex-col h-full">
                {/* Icon and Title */}
                <div className="mb-4">
                  <div className="w-12 h-12 bg-[#FFF4E0] rounded-lg flex items-center justify-center mb-3">
                    <Icon size={28} className="text-[#FF9500]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {service.subtitle}
                  </p>
                </div>

                {/* Pricing and Duration */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {service.duration}
                  </p>
                </div>

                {/* Includes List */}
                <div className="mb-6 flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Service Includes:
                  </p>
                  <ul className="space-y-2">
                    {service.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check
                          size={16}
                          className="text-green-600 flex-shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveService(service.id)}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      service.recommended
                        ? 'bg-[#FF9500] text-white hover:bg-[#CC7000]'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {service.cta}
                    <ArrowRight size={16} />
                  </button>
                  <button className="w-full py-2 px-4 rounded-lg font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all text-sm">
                    {service.ctaSecondary}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guarantee Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
        <p className="text-sm text-blue-900">
          <span className="font-bold">100% Satisfaction Guarantee:</span> Not satisfied? Get a full refund within 7 days of service completion.
        </p>
      </div>

      {/* Why Choose Section */}
      <div className="mt-8 grid md:grid-cols-3 gap-4 text-center text-sm">
        <div>
          <p className="font-semibold text-gray-900 mb-1">Expert Reviewers</p>
          <p className="text-gray-600">Industry professionals with 5+ years experience</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 mb-1">Quick Turnaround</p>
          <p className="text-gray-600">Most services completed within 2-3 business days</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 mb-1">India-Focused</p>
          <p className="text-gray-600">Optimized for Indian job market and companies</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalUpsellSection;
