import React, { useRef, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Linkedin, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Contact from './Contact';
import WelcomeHeader from './WelcomeHeader';
import { motion } from 'framer-motion';

const Society = () => {
  return (
    <>
      <WelcomeHeader />

      {/* Main Content - Society Section */}
      <div className="flex flex-col min-h-screen ">
        <section className="w-full flex justify-center py-12 bg-white">
          <div className="w-full max-w-5xl flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#22505a] mb-12 text-center">Discover Your Role in Dream Society</h2>
            <ScrollTimelineSteps />
          </div>
        </section>

        <section className="w-full flex justify-center items-center py-12 bg-gradient-to-r from-sky-200 via-blue-100 to-white">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-start md:items-stretch justify-between gap-8 px-4">
          {/* Left: Purpose and Aspirations */}
          <div className="flex-1 flex items-center justify-center md:justify-start mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-left leading-tight">Purpose and<br/>Aspirations</h2>
          </div>
          {/* Center: Aim */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Aim</h3>
            <p className="text-base md:text-lg text-gray-800 max-w-md text-left">
              To create a unified digital platform that empowers individuals and families within the community by facilitating networking, professional growth, and access to opportunities, while preserving and celebrating cultural heritage.
            </p>
          </div>
          {/* Right: Objectives */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Objectives</h3>
            <ul className="list-disc pl-5 text-base md:text-lg text-gray-800 max-w-md text-left">
              <li className="mb-2">Foster meaningful connections among members to build a supportive and collaborative community. Lize volunteers to actively participate in community service</li>
              <li>Ensure a safe, inclusive, and user-friendly platform where all members are respected and their data is protected.</li>
            </ul>
          </div>
        </div>
      </section>

        {/* Events & Feed Section - Clean Modern Style */}
            <section className="w-full px-0 bg-white animate-fade-in-up py-12" style={{ animationDelay: '0.3s' }}>
              <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-sky-800 drop-shadow">Upcoming Events</h2>
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 flex flex-col gap-2 transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-sky-200 text-sky-800 px-3 py-1 rounded-full text-xs font-semibold">July 30, 2025</span>
                        <span className="font-semibold text-sky-700">Virtual Networking Night</span>
                      </div>
                      <div className="text-sky-700">Connect with professionals and mentors in a fun, interactive online event.</div>
                      <Button size="sm" className="mt-2 bg-gradient-to-r from-sky-400 to-blue-400 text-white animate-gradient-x">Join</Button>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 flex flex-col gap-2 transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">Aug 10, 2025</span>
                        <span className="font-semibold text-blue-700">Career Growth Workshop</span>
                      </div>
                      <div className="text-sky-700">Join our expert panel for tips on advancing your career and building your personal brand.</div>
                      <Button size="sm" className="mt-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white animate-gradient-x">Learn More</Button>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-sky-800 drop-shadow">Latest from the Community</h2>
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 flex flex-col gap-4 transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      <div className="flex items-center gap-3">
                        <img src="/dreamsocietylogo.png" alt="User" className="w-10 h-10 " />
                        <div>
                          <div className="font-semibold text-sky-800">Lakshmi</div>
                          <div className="text-xs text-sky-500">2 mins ago</div>
                        </div>
                      </div>
                      <div className="text-sky-700">Excited to join UNITY Nest! Looking forward to connecting with like-minded professionals. 🚀</div>
                      <a href="#" className="text-sky-500 hover:underline text-sm mt-2">See more</a>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 flex flex-col gap-4 transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <div className="flex items-center gap-3">
                        <img src="/dreamsocietylogo.png" alt="User" className="w-10 h-10 rounded-full border-2 border-blue-300 animate-float" />
                        <div>
                          <div className="font-semibold text-sky-800">Uday </div>
                          <div className="text-xs text-sky-500">10 mins ago</div>
                        </div>
                      </div>
                      <div className="text-sky-700">Just landed a new job through UNITY Nest! The community support here is amazing. 🙌</div>
                      <a href="#" className="text-sky-500 hover:underline text-sm mt-2">See more</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        {/* Footer */}
        <footer className="w-full bg-gradient-to-r from-sky-200 via-blue-100 to-white px-4">
          <div className="flex flex-col md:flex-row justify-between items-center py-8">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="text-lg font-bold text-sky-800">UNITY Nest</div>
              <p className="text-sm text-sky-600">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sky-500 hover:text-sky-700 transition-colors"><Linkedin /></a>
              <a href="#" className="text-sky-500 hover:text-sky-700 transition-colors"><Twitter /></a>
              <a href="#" className="text-sky-500 hover:text-sky-700 transition-colors"><Facebook /></a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

const steps = [
  {
    title: 'Entrepreneur',
    description: 'To network with potential partners, investors, and clients, as well as to find skilled talent for their ventures. The platform provides a space for entrepreneurs to share their journey, promote their businesses, and contribute to the economic growth of the community.',
    side: 'right',
  },
  {
    title: 'Employee',
    description: 'To explore new job opportunities, connect with other professionals, and enhance their career growth. They can showcase their work experience, skills, and achievements, making it easier for employers and recruiters within the community to discover their potential.',
    side: 'left',
  },
  {
    title: 'Qualified',
    description: 'To connect with employers, mentors, and peers, supporting their transition into the workforce and ongoing professional development. Qualified member is someone who has completed formal education or training and holds recognized certifications or degrees.',
    side: 'right',
  },
  {
    title: 'Skilled',
    description: 'To enable skilled individuals to highlight their expertise, find job opportunities, and connect with those seeking their services. This role helps bridge the gap between skilled workers and those in need of their talents within the community.',
    side: 'left',
  },
  {
    title: 'Professional',
    description: 'To build their reputation, share insights, and collaborate with peers. The platform supports professionals in expanding their network, finding new career opportunities, and contributing to the community’s knowledge base.',
    side: 'right',
  },
];

function ScrollTimelineSteps() {
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [ballY, setBallY] = useState(0);

  // Calculate step positions after render
  const stepRefs = useRef([]);

  useEffect(() => {
    function onScroll() {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      // Get the vertical center of the viewport
      const viewportCenter = window.innerHeight / 2;
      // Find the closest step to the center
      let minDist = Infinity;
      let closestIdx = 0;
      let ballPos = 0;
      stepRefs.current.forEach((ref, idx) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const stepCenter = rect.top + rect.height / 2;
          const dist = Math.abs(stepCenter - viewportCenter);
          if (dist < minDist) {
            minDist = dist;
            closestIdx = idx;
            // Ball position relative to container
            ballPos = stepCenter - containerRect.top;
          }
        }
      });
      setActiveStep(closestIdx);
      setBallY(ballPos);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center min-h-[700px] md:items-center" style={{ minHeight: 700 }}>
      {/* Animated vertical line */}
      {/* Mobile: line at left, Desktop: line centered */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 1.2, delay: 0.2, ease: 'easeInOut' }}
        className="absolute md:left-1/2 left-4 top-0 bottom-0 w-1 bg-gray-300 z-0 md:translate-x-[-50%]"
        style={{ transform: undefined }}
      />
      {/* Animated pointer ball */}
      <motion.div
        className="absolute z-10 md:left-1/2 left-4"
        style={{
          transform: 'translate(-50%, -50%)',
          top: ballY || 0,
        }}
        animate={{ top: ballY || 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className={`w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full shadow-lg border-4 border-white flex items-center justify-center`}
          style={{ boxShadow: '0 4px 24px 0 rgba(56,189,248,0.25)' }}
        >
          <span className="text-white text-xl font-bold">•</span>
        </div>
      </motion.div>
      {/* Steps */}
      <div className="w-full flex flex-col items-start md:items-center relative z-10">
        {steps.map((step, idx) => {
          const isRight = step.side === 'right';
          return (
            <div
              key={step.title}
              ref={el => stepRefs.current[idx] = el}
              className={`w-full mb-16 min-h-[120px] flex flex-row md:flex-row justify-start md:justify-center relative`}
              style={{ opacity: activeStep === idx ? 1 : 0.3, transition: 'opacity 0.4s' }}
            >
              {/* Mobile: line at left, content at right. Desktop: alternate left/right. */}
              {/* On mobile, always content at right of line. On desktop, alternate. */}
              {isRight ? (
                <>
                  {/* Left empty on desktop, hidden on mobile */}
                  <div className="hidden md:block w-1/2"></div>
                  <div className="flex-1 flex flex-col items-start md:items-start pl-4 md:pl-12 relative z-10 px-2 md:px-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: activeStep === idx ? 1 : 0.8 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="flex items-center justify-center mb-2"
                    >
                      <span className="bg-white border border-gray-300 rounded-full p-2 shadow text-xl mr-2">👤</span>
                      <div className="font-bold text-[#22505a] underline text-lg md:text-lg text-center md:text-left">{step.title}</div>
                    </motion.div>
                    {activeStep === idx && (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-gray-700 text-base md:text-base text-center md:text-left max-w-md w-full"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 flex flex-col items-end md:items-end pr-4 md:pr-12 relative z-10 px-2 md:px-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: activeStep === idx ? 1 : 0.8 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="flex items-center justify-center mb-2"
                    >
                      <span className="bg-white border border-gray-300 rounded-full p-2 shadow text-xl mr-2">👤</span>
                      <div className="font-bold text-[#22505a] underline text-lg md:text-lg text-center md:text-right">{step.title}</div>
                    </motion.div>
                    {activeStep === idx && (
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-gray-700 text-base md:text-base text-center md:text-right max-w-md w-full"
                      >
                        {step.description}
                      </motion.p>
                    )}
                  </div>
                  {/* Right empty on desktop, hidden on mobile */}
                  <div className="hidden md:block w-1/2"></div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Society; 