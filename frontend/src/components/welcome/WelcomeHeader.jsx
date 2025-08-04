import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { PanelLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', color: 'blue' },
  { to: '/about', label: 'About', color: 'teal' },
  { to: '/society', label: 'Society', color: 'indigo' },
  { to: '/contact', label: 'Contact', color: 'gray' },
];

const headerFont = 'Montserrat, Inter, Plus Jakarta Sans, sans-serif';
// Update font stacks for logo/title and nav links
const logoFont = 'Orbitron, Montserrat, Inter, Plus Jakarta Sans, sans-serif';
const navFont = 'Quicksand, Montserrat, Inter, Plus Jakarta Sans, sans-serif';

const WelcomeHeader = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header
      className="w-full px-3 md:px-4 py-2 border-b border-gray-100"
      style={{
        fontFamily: headerFont,
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* Nav link animation styles */}
      <style>{`
        .nav-creative-link {
          position: relative;
          overflow: hidden;
        }
        .nav-creative-link:before {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -0.2em;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%);
          border-radius: 2px;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), left 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .nav-creative-link:hover, .nav-creative-link:focus {
          color: #2563eb !important;
          transform: scale(1.08) translateY(-2px) rotate(-1deg);
        }
        .nav-creative-link:hover:before, .nav-creative-link:focus:before {
          width: 90%;
          left: 5%;
        }
        .nav-creative-link.active {
          color: #2563eb !important;
        }
        .nav-creative-link.active:before {
          width: 100%;
          left: 0;
          background: linear-gradient(90deg, #2563eb 0%, #06b6d4 100%);
        }
      `}</style>
      {/* Decorative accent line */}
      <div style={{position:'absolute',left:0,top:0,width:'100%',height:4,background:'linear-gradient(90deg,#2563eb 0%,#06b6d4 100%)',borderRadius:2,opacity:0.7,zIndex:21}} />
      <div className="w-full flex flex-row items-center justify-between gap-2 md:gap-4 relative z-30">
        {/* Logo and Title */}
        <div className="flex flex-row items-center gap-2 md:gap-4 min-w-fit justify-center md:justify-start">
          <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-cyan-100 rounded-full border border-blue-200 p-1" style={{width:44,height:44}}>
            <img
              src="/dreamsocietylogo.png"
              alt="UNITY Nest Logo"
              className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-full"
              style={{filter:'drop-shadow(0 2px 8px rgba(37,99,235,0.10))'}}
            />
          </div>
          <div className="flex flex-col leading-tight ml-1">
            <span className="font-extrabold text-xl md:text-2xl lg:text-3xl tracking-tight" style={{color:'#2563eb',fontFamily:logoFont,letterSpacing:'-0.5px',lineHeight:'1.1',textTransform:'uppercase'}}>UNITY</span>
            <span className="font-bold text-base md:text-lg lg:text-xl tracking-wide" style={{color:'#06b6d4',fontFamily:logoFont,marginTop:-2,letterSpacing:'0.5px',textTransform:'uppercase'}}>Nest</span>
          </div>
        </div>
        {/* Desktop Nav & Auth */}
        {!isMobile && (
          <>
            <nav className="flex-1 flex justify-center">
              <ul className="flex gap-6 md:gap-8 text-sm md:text-base font-medium items-center">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        `px-3 md:px-4 py-2 rounded-full nav-creative-link transition-all duration-200 ${
                          isActive ? 'active bg-blue-100 font-bold scale-105' : 'text-gray-700 hover:bg-cyan-50'
                        }`
                      }
                      style={{ fontFamily: navFont, fontWeight: 700, letterSpacing: '0.04em', background: 'transparent', fontSize: '1rem' }}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex gap-2 md:gap-3 min-w-fit justify-center md:justify-end">
              <Link to="/login">
                <Button
                  className="bg-white border border-blue-200 text-blue-700 font-semibold px-4 md:px-6 py-2 rounded-full shadow-sm hover:bg-blue-50 hover:text-blue-800 transition-all text-sm md:text-base"
                  style={{ fontFamily: headerFont, letterSpacing: '0.02em' }}
                >
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold px-4 md:px-6 py-2 rounded-full hover:from-blue-700 hover:to-cyan-600 hover:scale-105 transition-all text-sm md:text-base border-0"
                  style={{ fontFamily: headerFont, letterSpacing: '0.02em' }}
                >
                  Sign up
                </Button>
              </Link>
            </div>
          </>
        )}
        {/* Mobile Hamburger */}
        {isMobile && (
          <div className="md:hidden">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 md:h-10 md:w-10" aria-label="Toggle menu">
                  {menuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <PanelLeft className="w-5 h-5 md:w-6 md:h-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 transition-all duration-300 ease-in-out">
                <div className="flex flex-col gap-6 p-6">
                  <div className="flex flex-row items-center gap-2 mb-4">
                    <img src="/dreamsocietylogo.png" alt="UNITY Nest Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                    <div className="flex flex-col">
                      <span className="font-extrabold text-base md:text-lg text-black leading-tight">UNITY</span>
                      <span className="font-semibold text-sm md:text-base text-gray-800 leading-tight">Nest</span>
                    </div>
                  </div>
                  <nav className="flex flex-col gap-3 md:gap-4">
                    {navLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === '/'}
                        className={({ isActive }) =>
                          `px-3 py-2 rounded transition-colors duration-200 text-base md:text-lg ${
                            isActive
                              ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-blue-50 hover:text-blue-700'
                          }`
                        }
                        onClick={() => setMenuOpen(false)}
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-2 mt-6">
                    <Link to="/login"><button className="border border-gray-400 rounded px-4 py-2 text-gray-800 bg-white hover:bg-gray-100 transition text-sm md:text-base">Log in</button></Link>
                    <Link to="/register"><button className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition text-sm md:text-base">Join Us</button></Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
};

export default WelcomeHeader; 