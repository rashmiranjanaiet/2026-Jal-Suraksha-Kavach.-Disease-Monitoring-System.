
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LANGUAGES } from './utils/translations';
import Home from './pages/Home';
import StateDetails from './pages/StateDetails';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import QualityIndex from './pages/QualityIndex';
import WaterGuardGame from './pages/WaterGuardGame';
import GameSelection from './pages/GameSelection';
import LiveMonitoring from './pages/LiveMonitoring';
import { JalAI } from './components/JalAI';
import { Activity, Shield, Wind, Gamepad2, Globe, ChevronDown, Sun, Moon, Radio, Menu, X } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useApp();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide standard nav inside the game for immersion
  if (location.pathname === '/game' || location.pathname === '/game-selection') {
    return null;
  }

  const currentLangName = LANGUAGES.find(l => l.code === currentLanguage)?.name || 'English';

  const NavLink = ({ to, icon: Icon, label, onClick }: any) => (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === to ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {t(label)}
    </Link>
  );

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md dark:bg-slate-950/90 text-white sticky top-0 z-50 shadow-md border-b border-slate-800 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-teal-400 animate-pulse-slow" />
            <Link to="/" className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-200 to-blue-200">
              Jal Suraksha Kavach
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
             <NavLink to="/" label="Dashboard" />
             <NavLink to="/quality-index" icon={Wind} label="Quality Index" />
             <NavLink to="/live-monitoring" icon={Radio} label="Live Sensors" />
             
             <Link 
               to="/game-selection" 
               className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg transform hover:scale-105"
             >
               <Gamepad2 className="w-4 h-4" />
               {t('WaterGuard Hero')}
             </Link>
             
             {/* Theme Toggle */}
             <button
               onClick={toggleTheme}
               className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-yellow-300 transition-colors"
               title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
             >
               {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>

             {/* Language Switcher */}
             <div className="relative">
                <button 
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currentLangName}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isLangOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-20 border border-slate-200 dark:border-slate-700 animate-fade-in max-h-80 overflow-y-auto">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            currentLanguage === lang.code 
                              ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-bold' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span className="flex justify-between items-center">
                            <span>{lang.name}</span>
                            <span className="text-xs text-slate-400 opacity-75">{lang.nativeName}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
             </div>

             {/* Auth Links */}
             {user.isAuthenticated ? (
               <>
                <Link 
                  to="/admin/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname.includes('dashboard') ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                >
                  {t('Admin Panel')} ({user.stateId})
                </Link>
                <button 
                  onClick={logout} 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t('Logout')}
                </button>
               </>
             ) : (
               <Link 
                 to="/admin/login" 
                 className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
               >
                 <Shield className="h-4 w-4" />
                 {t('State Admin Login')}
               </Link>
             )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <button
               onClick={toggleTheme}
               className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-yellow-300 transition-colors"
             >
               {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 animate-slide-up">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <NavLink to="/" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
             <NavLink to="/quality-index" icon={Wind} label="Quality Index" onClick={() => setIsMobileMenuOpen(false)} />
             <NavLink to="/live-monitoring" icon={Radio} label="Live Sensors" onClick={() => setIsMobileMenuOpen(false)} />
             <Link 
               to="/game-selection"
               onClick={() => setIsMobileMenuOpen(false)}
               className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
             >
               <Gamepad2 className="w-4 h-4" />
               {t('WaterGuard Hero')}
             </Link>

             {/* Mobile Language Selector */}
             <div className="px-3 py-2">
                <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Language</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {LANGUAGES.slice(0, 6).map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setIsMobileMenuOpen(false); }}
                      className={`text-xs p-2 rounded border ${currentLanguage === lang.code ? 'bg-teal-900 text-teal-300 border-teal-700' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                  <button onClick={() => { /* Could expand full list */ }} className="text-xs p-2 rounded border bg-slate-800 text-slate-400 border-slate-700 italic">
                     + More
                  </button>
                </div>
             </div>

             <div className="pt-4 border-t border-slate-800 mt-2">
               {user.isAuthenticated ? (
                 <div className="space-y-2">
                    <Link 
                      to="/admin/dashboard" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white bg-teal-600"
                    >
                      Admin Panel
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600"
                    >
                      Logout
                    </button>
                 </div>
               ) : (
                 <Link 
                   to="/admin/login" 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-700"
                 >
                   <Shield className="h-4 w-4" />
                   {t('State Admin Login')}
                 </Link>
               )}
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user.isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors duration-300">
              <Navigation />
              <main className="flex-grow relative">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/quality-index" element={<QualityIndex />} />
                  <Route path="/live-monitoring" element={<LiveMonitoring />} />
                  <Route path="/game" element={<WaterGuardGame />} />
                  <Route path="/game-selection" element={<GameSelection />} />
                  <Route path="/state/:stateId" element={<StateDetails />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  } />
                </Routes>
                
                {/* Floating Jal AI Assistant */}
                <JalAI />
              </main>
              <NavigationFooterWrapper />
            </div>
          </Router>
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

// Helper to hide footer in game
const NavigationFooterWrapper = () => {
  const location = useLocation();
  if (location.pathname === '/game' || location.pathname === '/game-selection') return null;
  
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 py-6 text-center text-sm transition-colors">
        <p>© {new Date().getFullYear()} Jal Suraksha Kavach. Disease Monitoring System.</p>
    </footer>
  );
}

export default App;
