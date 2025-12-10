import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAnnouncements } from '../services/apiService';
import { getCurrentUser, logoutUser, getLastSeenAnnouncementAt } from '../services/storageService';
import { User, UserRole } from '../types';
import { useTheme } from './ThemeContext';

// Memoized background component to prevent re-renders
const BackgroundElements = memo(({ showEffects }: { showEffects: boolean }) => {
  if (!showEffects) return null;
  
  return (
    <>
      {/* Noise Texture Overlay */}
      <div className="bg-noise opacity-50 dark:opacity-20"></div>

      {/* Ambient Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-india-bg dark:bg-slate-900 transition-colors duration-500">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-gradient-to-br from-india-saffron/20 to-orange-100/30 dark:from-india-saffron/10 dark:to-orange-900/20 rounded-full blur-[80px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60rem] h-[60rem] bg-gradient-to-tl from-india-green/20 to-emerald-100/30 dark:from-india-green/10 dark:to-emerald-900/20 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-100/20 dark:bg-blue-900/10 rounded-full blur-[80px]"></div>
      </div>
    </>
  );
});
BackgroundElements.displayName = 'BackgroundElements';

// Memoized Logo component
const Logo = memo(() => (
  <Link to="/" className="flex items-center space-x-3 group relative z-10">
    <div className="relative w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-india-saffron via-white to-india-green opacity-80 blur-[4px] group-hover:blur-[8px] transition-all"></div>
      <div className="relative w-full h-full rounded-full bg-white/90 dark:bg-slate-800/90 border-2 border-white dark:border-slate-700 flex items-center justify-center shadow-lg backdrop-blur-sm">
        <div className="w-3 h-3 rounded-full bg-india-blue dark:bg-blue-400 shadow-[0_0_10px_rgba(0,0,128,0.5)]"></div>
      </div>
    </div>
    <div className="flex flex-col">
      <span className="font-extrabold text-2xl tracking-tight leading-none text-gray-900 dark:text-white drop-shadow-sm">
        Solve2<span className="text-india-saffron">Win</span>
      </span>
      <span className="text-[0.6rem] tracking-[0.2em] uppercase font-bold text-india-green dark:text-green-400 leading-none ml-0.5 mt-0.5">Play • Earn • Grow</span>
    </div>
  </Link>
));
Logo.displayName = 'Logo';

// Memoized Footer component
const Footer = memo(() => (
  <footer className="relative z-10 glass dark:glass-dark mt-16 py-10 border-t border-white/40 dark:border-white/10">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 gap-6 text-center md:text-left">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <span className="font-black text-gray-800 dark:text-gray-200 text-lg mr-2">Solve2Win</span> 
        <span className="text-gray-400">|</span> 
        <span className="ml-2">&copy; {new Date().getFullYear()} Made with 🧡🤍💚 for India.</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4 font-medium">
        <Link to="/contact" className="hover:text-india-blue transition-colors hover:underline">Contact</Link>
        <Link to="/faq" className="hover:text-india-blue transition-colors hover:underline">FAQ</Link>
        <Link to="/terms" className="hover:text-india-blue transition-colors hover:underline">Terms</Link>
        <Link to="/privacy" className="hover:text-india-blue transition-colors hover:underline">Privacy</Link>
      </div>
    </div>
  </footer>
));
Footer.displayName = 'Footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasNewAnnouncements, setHasNewAnnouncements] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setUser(getCurrentUser());
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = useCallback(() => {
    logoutUser();
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  }, [navigate]);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const isAdmin = useMemo(() => user?.role === UserRole.ADMIN, [user?.role]);
  const userPoints = useMemo(() => user?.points?.toLocaleString() || '0', [user?.points]);

  // Determine if we should show glass effects (only on Landing and Auth pages)
  const showGlassEffects = location.pathname === '/' || location.pathname === '/auth';

  useEffect(() => {
    if (location.pathname.startsWith('/community')) {
      setHasNewAnnouncements(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    let isActive = true;

    const checkAnnouncements = async () => {
      if (!user) {
        setHasNewAnnouncements(false);
        return;
      }
      try {
        const announcements = await getAnnouncements();
        if (!isActive) return;

        const latest = announcements.reduce((max, ann) => {
          const created = new Date(ann.createdAt).getTime();
          return Number.isFinite(created) && created > max ? created : max;
        }, 0);

        if (!latest) {
          setHasNewAnnouncements(false);
          return;
        }

        const lastSeen = getLastSeenAnnouncementAt();
        setHasNewAnnouncements(latest > lastSeen);
      } catch (error) {
        console.error('Failed to check announcements', error);
      }
    };

    checkAnnouncements();
    return () => {
      isActive = false;
    };
  }, [user]);

  const renderNavLinks = () => {
    const themeToggle = (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors border border-white/60 dark:border-slate-600"
        aria-label="Toggle Dark Mode"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    );

    if (!user) {
      return (
        <div className="flex items-center gap-4">
          {themeToggle}
          <Link
            to="/auth"
            className="text-sm bg-gradient-to-r from-india-blue to-blue-800 hover:to-blue-900 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 border border-blue-400/50"
            onClick={closeMenu}
          >
            Login / Signup
          </Link>
        </div>
      );
    }

    return (
      <>
        {themeToggle}
        {!isAdmin && (
          <div className="hidden md:flex items-center px-5 py-2 bg-white/40 dark:bg-slate-800/40 rounded-full border border-white/60 dark:border-slate-600 shadow-inner backdrop-blur-md">
            <span className="text-india-green dark:text-green-400 font-black mr-2 text-xl drop-shadow-sm">{userPoints}</span>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase">PTS</span>
          </div>
        )}
        <Link
          to={isAdmin ? '/admin' : '/dashboard'}
          className="text-gray-700 dark:text-gray-200 hover:text-india-saffron dark:hover:text-india-saffron font-bold text-sm md:text-base transition-colors duration-200"
          onClick={closeMenu}
        >
          Dashboard
        </Link>
        <Link
          to="/leaderboard"
          className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-sm md:text-base transition-colors duration-200"
          onClick={closeMenu}
        >
          Leaderboard
        </Link>
        <Link
          to="/community"
          className="text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 font-bold text-sm md:text-base transition-colors duration-200 flex items-center gap-2"
          onClick={closeMenu}
        >
          Community
          {hasNewAnnouncements && (
            <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-red-500 text-white rounded-full">New</span>
          )}
        </Link>
        <Link
          to="/profile"
          className="text-gray-700 dark:text-gray-200 hover:text-india-blue dark:hover:text-blue-400 font-bold text-sm md:text-base transition-colors duration-200"
          onClick={closeMenu}
        >
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transform hover:-translate-y-0.5 border border-red-400"
        >
          Logout
        </button>
      </>
    );
  };

  return (
    <div className={`min-h-screen bg-india-bg dark:bg-slate-900 font-sans text-gray-800 dark:text-gray-100 relative selection:bg-india-saffron selection:text-white overflow-hidden transition-colors duration-500 ${!showGlassEffects ? 'no-glass' : ''}`}>
      <BackgroundElements showEffects={showGlassEffects} />

      {/* Glass Navbar */}
      <nav className="sticky top-0 z-50 glass dark:glass-dark border-b border-white/30 dark:border-white/10 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between h-20 items-center">
            <Logo />

            <div className="hidden md:flex items-center space-x-3 md:space-x-6 relative z-10">
              {renderNavLinks()}
            </div>

            <button
              className="md:hidden relative z-10 inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/70 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 text-gray-800 dark:text-white shadow-md"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open menu</span>
              <div className="space-y-1.5">
                <span className={`block h-0.5 w-6 rounded-full bg-gray-800 dark:bg-white transition-transform ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
                <span className={`block h-0.5 w-6 rounded-full bg-gray-800 dark:bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 w-6 rounded-full bg-gray-800 dark:bg-white transition-transform ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Drawer */}
          <div
            className={`md:hidden absolute top-full left-0 w-full origin-top transform transition-all duration-300 ${
              isMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="glass-card dark:glass-dark rounded-3xl px-6 py-6 mt-2 border border-white/60 dark:border-slate-600 shadow-xl space-y-5">
              {user && !isAdmin && (
                <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl px-4 py-3 border border-white/80 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-widest">Points</p>
                    <p className="text-2xl font-black text-india-green dark:text-green-400">{userPoints}</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{user.email}</span>
                </div>
              )}
              <div className="flex flex-col space-y-3 text-base font-bold text-gray-700 dark:text-gray-200">
                {user ? (
                  <>
                    <Link
                      to={isAdmin ? '/admin' : '/dashboard'}
                      className="w-full rounded-2xl px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700 text-center hover:bg-white dark:hover:bg-slate-700"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/leaderboard"
                      className="w-full rounded-2xl px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700 text-center hover:bg-white dark:hover:bg-slate-700"
                      onClick={closeMenu}
                    >
                      🏆 Leaderboard
                    </Link>
                    <Link
                      to="/community"
                      className="w-full rounded-2xl px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700 text-center hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center gap-2"
                      onClick={closeMenu}
                    >
                      🌟 Community
                      {hasNewAnnouncements && (
                        <span className="px-2 py-1 text-xs font-black uppercase bg-red-500 text-white rounded-full">New</span>
                      )}
                    </Link>
                    <Link
                      to="/profile"
                      className="w-full rounded-2xl px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700 text-center hover:bg-white dark:hover:bg-slate-700"
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-2xl px-4 py-3 bg-red-500 text-white border border-red-400"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    className="w-full rounded-2xl px-4 py-3 bg-gradient-to-r from-india-blue to-blue-800 text-white border border-blue-500 text-center"
                    onClick={closeMenu}
                  >
                    Login / Signup
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {isMenuOpen && <div className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={closeMenu}></div>}

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-8 md:py-12 min-h-[calc(100vh-14rem)]">
        {children}
      </main>

      <Footer />
    </div>
  );
};