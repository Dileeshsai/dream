import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Linkedin, Twitter, Facebook } from 'lucide-react';
import Contact from './Contact';
import WelcomeHeader from './WelcomeHeader';

const About = () => {
  return (
    <>
      <WelcomeHeader />
      {/* Purpose and Aspirations Section */}

      {/* Main Content - About Section */}
      <div className="flex flex-col min-h-screen ">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8" style={{background: 'linear-gradient(135deg, #e0f2fe 0%, #f3fdf7 100%)', minHeight: '70vh', position: 'relative'}}>
          <main className="w-full max-w-5xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-sky-800 mb-2 drop-shadow-lg animate-title-pop" style={{letterSpacing: '1.5px'}}>About UNITY Nest</h1>
            <div className="flex items-center gap-3 mb-6 animate-divider-fadein w-full max-w-4xl">
              <span className="h-1 w-32 md:w-56 rounded-full bg-gradient-to-r from-sky-400 via-green-300 to-blue-400 animate-divider-glow"></span>
              <span className="text-base md:text-lg font-medium text-sky-700 tracking-wide flex-1 text-center">Empowering Through Connection, Opportunity & Growth</span>
              <span className="h-1 w-32 md:w-56 rounded-full bg-gradient-to-l from-sky-400 via-green-300 to-blue-400 animate-divider-glow"></span>
            </div>
            <p className="text-lg md:text-xl text-gray-700 mb-10 animate-fade-in w-full" style={{maxWidth: '1000px', fontWeight: 500, letterSpacing: '0.2px', textAlign: 'center'}}>UNITY Nest (Dalit Resources for Education and Economics Advanced and Mobilization Society) is dedicated to empowering individuals and families through <span className="font-bold text-blue-600">connection</span>, <span className="font-bold text-green-600">opportunity</span>, and <span className="font-bold text-sky-600">growth</span>.</p>
            <div className="relative w-full flex justify-center">
              <div className="glass-card-timeline animate-card-fadein expanded-width">
                {/* Timeline/Stepper */}
                <div className="timeline-vertical">
                  {/* Step 1: Connection */}
                  <div className="timeline-step">
                    <div className="timeline-icon timeline-icon-connection">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <radialGradient id="conn-grad" cx="50%" cy="50%" r="70%">
                            <stop offset="0%" stopColor="#38bdf8"/>
                            <stop offset="100%" stopColor="#0ea5e9"/>
                          </radialGradient>
                        </defs>
                        <circle cx="24" cy="24" r="20" fill="url(#conn-grad)" opacity="0.18"/>
                        <circle cx="24" cy="24" r="14" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2.5"/>
                        <path d="M16 24a8 8 0 0 1 16 0" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="24" cy="24" r="3.5" fill="#0ea5e9"/>
                      </svg>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">Build a vibrant, supportive community where everyone belongs.</div>
                    </div>
                  </div>
                  {/* Stepper Line */}
                  <div className="timeline-line"></div>
                  {/* Step 2: Opportunity */}
                  <div className="timeline-step">
                    <div className="timeline-icon timeline-icon-opportunity">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="opp-grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#4ade80"/>
                            <stop offset="100%" stopColor="#22c55e"/>
                          </linearGradient>
                        </defs>
                        <rect x="8" y="8" width="32" height="32" rx="12" fill="#bbf7d0" stroke="url(#opp-grad)" strokeWidth="2.5"/>
                        <path d="M24 16v12l8 5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="24" cy="24" r="3.5" fill="#22c55e"/>
                      </svg>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">Foster lifelong learning, career advancement, and personal growth.</div>
                    </div>
                  </div>
                  <div className="timeline-line"></div>
                  {/* Step 3: Growth */}
                  <div className="timeline-step">
                    <div className="timeline-icon timeline-icon-growth">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <radialGradient id="grow-grad" cx="50%" cy="50%" r="70%">
                            <stop offset="0%" stopColor="#bae6fd"/>
                            <stop offset="100%" stopColor="#0ea5e9"/>
                          </radialGradient>
                        </defs>
                        <ellipse cx="24" cy="36" rx="16" ry="6" fill="url(#grow-grad)"/>
                        <path d="M24 36V14" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round"/>
                        <circle cx="24" cy="10" r="6" fill="#0ea5e9" stroke="#0369a1" strokeWidth="2"/>
                      </svg>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title">Inspire members to dream big and achieve more—together.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        {/* Our History Section */}

        {/* Vision Section */}
        <section className="w-full flex justify-center py-8 vision-section" style={{ background: '#fff', minHeight: '55vh', height: '55vh', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="flex flex-row items-center justify-center animate-fade-slideup" style={{ width: '80vw', maxWidth: '1200px', minHeight: '30vh', borderRadius: '8px', height: '100%' }}>
            {/* Left: Illustration (50%) */}
            <div className="flex items-center justify-center relative" style={{ width: '50%', minWidth: '520px', minHeight: '460px', padding: '24px', height: '100%' }}>
              {/* Decorative Gradient Ring */}
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '420px', height: '420px', zIndex: 0, borderRadius: '50%', background: 'radial-gradient(circle, #a7f3d0 0%, #bae6fd 60%, transparent 100%)', filter: 'blur(8px)', opacity: 0.5 }}></div>
              <img src="/vision.png" alt="Vision Illustration" className="animate-float" style={{ width: '100%', maxWidth: '520px', height: '420px', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
            </div>
            {/* Right: Vision Card (50%) */}
            <div className="flex items-center" style={{ width: '50%', minWidth: '320px', minHeight: '160px', position: 'relative', height: '100%' }}>
              <div style={{ background: '#eaf8ee', borderRadius: '12px', padding: '32px 32px 24px 72px', minHeight: '140px', width: '100%', display: 'flex', alignItems: 'center', position: 'relative', boxShadow: '0 4px 24px 0 rgba(56,96,106,0.08)', border: '1.5px solid #d2e9db', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', height: 'auto' }}>
                {/* Hexagon Icon - overlaps left edge (Vision) */}
                <div style={{ position: 'absolute', left: '-70px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
                  <div style={{ width: '96px', height: '96px', background: '#fff', clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px 0 rgba(56,96,106,0.10)', border: '2px solid #eaf8ee' }}>
                    <img src="/opportunity.png" alt="Vision Icon" style={{ width: '72px', height: '72px', objectFit: 'contain', display: 'block' }} />
                  </div>
                </div>
                {/* Vision Text */}
                <div className="text-left" style={{ paddingLeft: '32px', width: '100%' }}>
                  <div className="text-2xl md:text-2xl font-extrabold" style={{ color: '#38606a', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: 'inherit' }}>OUR VISION</div>
                  <div className="text-base md:text-base font-medium" style={{ color: '#222', lineHeight: '1.6', maxWidth: '420px', fontFamily: 'inherit' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Mission Section */}
        <section className="w-full flex justify-center py-8 mission-section" style={{ background: '#fff', minHeight: '55vh', height: '55vh', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="flex flex-row items-center justify-center animate-fade-slideup" style={{ width: '80vw', maxWidth: '1200px', minHeight: '30vh', borderRadius: '8px', height: '100%' }}>
            {/* Left: Mission Card (50%) */}
            <div className="flex items-center" style={{ width: '50%', minWidth: '320px', minHeight: '160px', position: 'relative', height: '100%' }}>
              <div style={{ background: '#eaf8ee', borderRadius: '12px', padding: '32px 72px 24px 32px', minHeight: '140px', width: '100%', display: 'flex', alignItems: 'center', position: 'relative', boxShadow: '0 4px 24px 0 rgba(56,96,106,0.08)', border: '1.5px solid #d2e9db', fontFamily: 'Inter, Segoe UI, Arial, sans-serif', height: 'auto' }}>
                {/* Hexagon Icon - overlaps right edge (Mission) */}
                <div style={{ position: 'absolute', right: '-70px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
                  <div style={{ width: '96px', height: '96px', background: '#fff', clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 24px 0 rgba(56,96,106,0.10)', border: '2px solid #eaf8ee' }}>
                    <img src="/target.png" alt="Mission Icon" style={{ width: '72px', height: '72px', objectFit: 'contain', display: 'block' }} />
                  </div>
                </div>
                {/* Mission Text */}
                <div className="text-left" style={{ paddingRight: '32px', width: '100%' }}>
                  <div className="text-2xl md:text-2xl font-extrabold" style={{ color: '#38606a', letterSpacing: '0.5px', marginBottom: '8px', fontFamily: 'inherit' }}>OUR MISSION</div>
                  <div className="text-base md:text-base font-medium" style={{ color: '#222', lineHeight: '1.6', maxWidth: '420px', fontFamily: 'inherit' }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Illustration (50%) */}
            <div className="flex items-center justify-center relative" style={{ width: '50%', minWidth: '520px', minHeight: '460px', padding: '24px', height: '100%' }}>
              {/* Decorative Gradient Ring */}
              <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '420px', height: '420px', zIndex: 0, borderRadius: '50%', background: 'radial-gradient(circle, #a7f3d0 0%, #bae6fd 60%, transparent 100%)', filter: 'blur(8px)', opacity: 0.5 }}></div>
              <img src="/mission.png" alt="Mission Illustration" className="animate-float" style={{ width: '100%', maxWidth: '520px', height: '420px', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
            </div>
          </div>
        </section>

        <section className="w-full flex justify-center py-12" style={{ background: 'linear-gradient(90deg, #eaf8ee 0%, #e0f2f1 100%)', minHeight: '340px', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="flex flex-row items-center justify-center animate-fade-slideup" style={{ width: '80vw', maxWidth: '1200px', minHeight: '260px', borderRadius: '12px', height: '100%', background: 'rgba(255,255,255,0.7)', boxShadow: '0 4px 24px 0 rgba(56,96,106,0.08)', padding: '32px 0' }}>
            {/* Left: Image */}
            {/* Right: Text */}
            <div className="flex flex-col items-center justify-center text-center px-6" style={{ width: '68%', minWidth: '320px', minHeight: '220px' }}>
              <div className="text-4xl md:text-4xl font-extrabold mb-4" style={{ color: '#222', letterSpacing: '1px', fontFamily: 'inherit' }}>OUR HISTORY</div>
              <div className="text-base md:text-lg font-medium" style={{ color: '#222', lineHeight: '1.7', maxWidth: '700px', fontFamily: 'inherit' }}>
                UNITY Nest was established with a vision to create a platform for marginalized communities to connect, learn, and grow together. Over the years, our society has empowered countless individuals by providing access to education, economic opportunities, and a supportive network. <br /><br />
                Our journey began with a small group of passionate individuals who believed in the power of unity and collective progress. Today, we continue to build on this legacy, fostering an environment where every member can realize their full potential and contribute to a brighter, more equitable future.
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
      <style>{`
@keyframes fade-slideup {
  0% { opacity: 0; transform: translateY(60px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-slideup {
  animation: fade-slideup 1.2s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-18px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
@keyframes title-pop {
  0% { opacity: 0; transform: scale(0.8) translateY(40px); }
  60% { opacity: 1; transform: scale(1.05) translateY(-8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-title-pop {
  animation: title-pop 1.1s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 1.2s 0.5s both;
}
@keyframes divider-fadein {
  0% { opacity: 0; transform: scaleX(0.7); }
  100% { opacity: 1; transform: scaleX(1); }
}
.animate-divider-fadein {
  animation: divider-fadein 1.1s 0.3s cubic-bezier(0.4,0,0.2,1) both;
}
@keyframes divider-glow {
  0%, 100% { box-shadow: 0 0 0 0 #38bdf8; }
  50% { box-shadow: 0 0 16px 2px #38bdf8; }
}
.animate-divider-glow {
  animation: divider-glow 2.5s infinite;
}
@keyframes card-fadein {
  0% { opacity: 0; transform: translateY(40px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-card-fadein {
  animation: card-fadein 1.2s 0.7s cubic-bezier(0.4,0,0.2,1) both;
}
.glass-card-timeline {
  background: rgba(255,255,255,0.55);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.10);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 36px 24px;
  min-width: 320px;
  max-width: 1000px;
  width: 100%;
  border: 1.5px solid rgba(180,220,250,0.18);
  margin: 0 auto;
}
.expanded-width {
  max-width: 1100px;
}
.timeline-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0px;
  position: relative;
}
.timeline-step {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 0px;
  position: relative;
  z-index: 2;
}
.timeline-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.7);
  border-radius: 50%;
  box-shadow: 0 2px 12px 0 rgba(56,96,106,0.10);
  border: 2px solid #e0f2fe;
  transition: box-shadow 0.3s;
}
.timeline-icon-connection:hover {
  box-shadow: 0 0 16px 2px #0ea5e9;
}
.timeline-icon-opportunity:hover {
  box-shadow: 0 0 16px 2px #22c55e;
}
.timeline-icon-growth:hover {
  box-shadow: 0 0 16px 2px #0ea5e9;
}
.timeline-content {
  text-align: left;
  max-width: 700px;
}
.timeline-title {
  font-size: 1.13rem;
  font-weight: 600;
  color: #222;
  letter-spacing: 0.1px;
  line-height: 1.5;
  background: linear-gradient(90deg, #38bdf8 0%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.timeline-line {
  width: 4px;
  height: 36px;
  background: linear-gradient(180deg, #38bdf8 0%, #22c55e 100%);
  margin: 0 0 0 26px;
  border-radius: 2px;
  opacity: 0.7;
  z-index: 1;
}
@media (max-width: 900px) {
  .glass-card-timeline { max-width: 98vw; }
  .expanded-width { max-width: 98vw; }
  .timeline-content { max-width: 90vw; }
}
@media (max-width: 600px) {
  .glass-card-timeline { padding: 18px 4px; }
  .timeline-content { max-width: 180px; }
  .timeline-title { font-size: 1rem; }
  .expanded-width { max-width: 98vw; }
}
`}</style>
    </>
  );
};

export default About; 