
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { IndiaMap } from '../components/IndiaMap';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, AlertTriangle, Users, Video, Gamepad2, ArrowRight } from 'lucide-react';
import { DiseasePieChart, DiseaseBarChart } from '../components/Charts';

const Home = () => {
  const { statesData } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleStateClick = (stateId: string) => {
    navigate(`/state/${stateId}`);
  };

  const filteredStates = useMemo(() => {
    return statesData.filter(state => 
      state.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [statesData, searchTerm]);

  const nationalStats = useMemo(() => {
    const totalCases = statesData.reduce((acc, s) => acc + s.totalAffected, 0);
    const highRiskStates = statesData.filter(s => s.totalAffected > 500).length;
    
    // Aggregate disease totals
    const diseaseTotals: Record<string, number> = {};
    statesData.forEach(s => {
      s.diseases.forEach(d => {
        diseaseTotals[d.name] = (diseaseTotals[d.name] || 0) + d.affected;
      });
    });

    const topDisease = Object.entries(diseaseTotals).sort((a, b) => b[1] - a[1])[0];

    return { totalCases, highRiskStates, topDisease };
  }, [statesData]);

  // Data for aggregate charts
  const aggregateDiseaseData = useMemo(() => {
      const map = new Map<string, number>();
      statesData.forEach(s => {
          s.diseases.forEach(d => {
              map.set(d.name, (map.get(d.name) || 0) + d.affected);
          });
      });
      return Array.from(map.entries()).map(([name, affected]) => ({
          id: name, name, affected, trend: 'stable' as const, lastUpdated: ''
      }));
  }, [statesData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* HEADER SECTION WITH GAME BUTTON */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
         {/* Animated GAME Title Button */}
         <div className="w-full md:w-auto flex-1 flex justify-center md:justify-end order-1 md:order-2">
            <button 
              onClick={() => navigate('/game-selection')}
              className="group relative px-8 py-4 bg-black dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl transform transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-slate-800 dark:border-slate-700"
            >
               {/* Animated Background */}
               <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 animate-gradient-xy opacity-80 group-hover:opacity-100 transition-opacity"></div>
               
               {/* Glitch Effect Overlay */}
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
               
               <div className="relative flex items-center gap-4">
                  <Gamepad2 className="w-10 h-10 text-white animate-bounce" />
                  <div className="flex flex-col items-start">
                     <span className="text-4xl font-black text-white tracking-tighter italic drop-shadow-lg group-hover:translate-x-1 transition-transform">
                        GAME
                     </span>
                     <span className="text-[10px] font-bold text-violet-200 uppercase tracking-[0.2em]">Play & Learn</span>
                  </div>
                  <ArrowRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
               </div>
            </button>
         </div>

         {/* Stats Row */}
         <div className="w-full md:w-2/3 order-2 md:order-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('Total Active Cases')}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{nationalStats.totalCases.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('High Risk States')}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{nationalStats.highRiskStates}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4 transition-colors">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('Dominant Disease')}</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {nationalStats.topDisease ? nationalStats.topDisease[0] : 'None'}
                </p>
              </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Map */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative">
             <h2 className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-800/80 backdrop-blur px-4 py-1 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 shadow-sm z-10 border border-slate-200 dark:border-slate-600 pointer-events-none transition-colors">
                {t('Nationwide Disease Heatmap')}
             </h2>
             <IndiaMap data={statesData} onStateClick={handleStateClick} />
          </div>
          
          {/* National Aggregates */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t('National Distribution')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 text-center">{t('By Disease Type')}</h4>
                    <DiseasePieChart data={aggregateDiseaseData} />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 text-center">{t('Caseload Comparison')}</h4>
                    <DiseaseBarChart data={aggregateDiseaseData} />
                </div>
            </div>
          </div>

          {/* VIDEO SECTION */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 relative mt-12 transition-colors">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('Public Awareness Campaign')}</h3>
            </div>
            
            {/* Video Container */}
            <div className="w-full aspect-[16/9] bg-black rounded-lg overflow-hidden relative shadow-md group border border-slate-200 dark:border-slate-700">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dT2Yg5V2AhY?controls=1&playsinline=1&rel=0&disablekb=1&modestbranding=1" 
                title="Health Awareness Video" 
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 text-center italic">
              Featured content: Disease prevention and hygiene awareness.
            </p>
          </div>

        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-full transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('State Data')}</h3>
              <div className="relative w-48">
                <input
                  type="text"
                  placeholder={t('Search state...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
              {filteredStates.map(state => (
                <div 
                  key={state.id}
                  onClick={() => handleStateClick(state.id)}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-teal-200 dark:hover:border-teal-800 cursor-pointer transition-all group"
                >
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400">{state.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{state.diseases.length} {t('monitored diseases')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 dark:text-white">{state.totalAffected}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('cases')}</p>
                  </div>
                </div>
              ))}
              {filteredStates.length === 0 && (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">No states found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
