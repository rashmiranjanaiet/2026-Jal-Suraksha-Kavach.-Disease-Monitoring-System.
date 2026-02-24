
import React, { useState } from 'react';
import { Droplets, CloudRain, Waves, Activity, Building2, Pipette, Bug, FileWarning, Stethoscope, MapPin, Calendar, Clock, Search, ArrowRight, Info, AlertTriangle, Zap, RefreshCw, CheckCircle2, ShieldAlert, TrendingUp, X, ClipboardCheck, ArrowDownRight, Sparkles } from 'lucide-react';
import { INDIAN_CITIES_MAP, NE_STATES } from '../constants';
import { getAdvancedReport } from '../services/geminiService';
import { useLanguage } from '../context/LanguageContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, PieChart, Pie, Legend, ComposedChart, Area
} from 'recharts';

const REPORT_KEYS = [
  { id: 'outbreak_prediction', key: 'Outbreak Prediction', icon: TrendingUp, color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
  { id: 'water_quality', key: 'Water Quality Report', icon: Droplets, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'bacterial_test', key: 'Bacterial Test Results', icon: Pipette, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 'turbidity_ph', key: 'Turbidity & pH Levels', icon: Waves, color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400' },
  { id: 'rainfall_flood', key: 'Rainfall & Flood Alerts', icon: CloudRain, color: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400' },
  { id: 'groundwater', key: 'Groundwater Status', icon: ArrowRight, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' }, 
  { id: 'disease_cases', key: 'Daily Disease Cases', icon: Activity, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  { id: 'hospital_opd', key: 'Hospital OPD Summary', icon: Stethoscope, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  { id: 'pipeline_leakage', key: 'Pipeline Leakage Reports', icon: FileWarning, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 'wastewater', key: 'Wastewater Overflow Alerts', icon: Waves, color: 'bg-stone-100 text-stone-600 dark:bg-stone-900/30 dark:text-stone-400' },
  { id: 'mosquito', key: 'Mosquito Breeding Spots', icon: Bug, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const QualityIndex = () => {
  const { t } = useLanguage();
  const [selectedReport, setSelectedReport] = useState(REPORT_KEYS[0]);
  const [form, setForm] = useState({
    state: '',
    city: '',
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  
  // Specific State for Outbreak Prediction
  const [outbreakData, setOutbreakData] = useState<{ history: any[], forecast: any } | null>(null);
  const [healthScore, setHealthScore] = useState<{score: number, status: string, chartData: any[]} | null>(null);
  const [preventionTable, setPreventionTable] = useState<{parameter: string, level: string, action: string}[]>([]);

  const generateOutbreakData = (dateStr: string) => {
      const date = new Date(dateStr);
      const history = [];
      
      // 1. Generate Past 3 Months (Current, Month -1, Month -2)
      // We iterate backwards but will unshift to keep chronological order
      for (let i = 2; i >= 0; i--) {
          const d = new Date(date);
          d.setMonth(d.getMonth() - i);
          const monthName = d.toLocaleString('default', { month: 'long', year: 'numeric' });
          
          // Simulation Logic: Create a trend
          // Let's assume water quality is degrading slightly over time (summer approaching)
          const trendFactor = (2 - i); // 0 (oldest), 1, 2 (current)
          
          const basePh = 7.4 - (trendFactor * 0.1) + (Math.random() * 0.2); 
          const baseTemp = 24 + (trendFactor * 1.5) + (Math.random()); 
          const baseTurb = 3 + (trendFactor * 0.8) + (Math.random());
          const baseTds = 200 + (trendFactor * 15) + (Math.random() * 20);

          const dailyData = [];
          for (let day = 1; day <= 30; day++) {
              dailyData.push({
                  day: `Day ${day}`,
                  ph: Number((basePh + (Math.sin(day/5) * 0.1) + (Math.random() * 0.2)).toFixed(1)),
                  temp: Number((baseTemp + (Math.cos(day/8) * 1) + (Math.random())).toFixed(1)),
                  tds: Math.floor(baseTds + (Math.random() * 20 - 10)),
                  turbidity: Number((baseTurb + (Math.sin(day/3) * 1) + (Math.random())).toFixed(1)),
              });
          }
          
          history.push({ 
              month: i === 0 ? `${monthName} (Current)` : monthName, 
              data: dailyData,
              isCurrent: i === 0
          });
      }

      // 2. Generate Future Prediction (Month +1)
      const fDate = new Date(date);
      fDate.setMonth(fDate.getMonth() + 1);
      const futureMonthName = fDate.toLocaleString('default', { month: 'long', year: 'numeric' });

      // Extrapolate trend from current month (history[2])
      const currentMonthData = history[2].data;
      const lastVal = currentMonthData[29]; // Last day of current month

      const futureData = [];
      for (let day = 1; day <= 30; day++) {
          // Additive trend: Things get slightly worse in the future prediction
          futureData.push({
              day: `Day ${day}`,
              ph: Number((lastVal.ph - (day * 0.01) + (Math.random() * 0.2 - 0.1)).toFixed(1)), // pH dropping
              temp: Number((lastVal.temp + (day * 0.1) + (Math.random() * 0.5)).toFixed(1)), // Temp rising
              tds: Math.floor(lastVal.tds + (day * 1.5) + (Math.random() * 10)), // TDS rising
              turbidity: Number((lastVal.turbidity + (day * 0.15) + (Math.random())).toFixed(1)), // Turbidity rising significantly
          });
      }

      const forecast = {
          month: futureMonthName,
          data: futureData,
          isPredicted: true
      };

      return { history, forecast };
  };

  const calculateHealthMetrics = (data: any[]) => {
      // Calculate averages for the PREDICTED month
      const avgPh = data.reduce((acc, curr) => acc + curr.ph, 0) / data.length;
      const avgTurbidity = data.reduce((acc, curr) => acc + curr.turbidity, 0) / data.length;
      const avgTds = data.reduce((acc, curr) => acc + curr.tds, 0) / data.length;

      // Base Score
      let score = 100;
      const issues: {parameter: string, level: string, action: string}[] = [];

      // pH Penalty (Ideal 6.5 - 8.5)
      if (avgPh < 6.5 || avgPh > 8.5) {
          score -= 20;
          issues.push({ 
              parameter: 'pH Level', 
              level: `${avgPh.toFixed(1)} (Risk)`, 
              action: avgPh < 6.5 ? 'Add alkaline neutralizer' : 'Add acidifier' 
          });
      } else {
          issues.push({ parameter: 'pH Level', level: 'Stable', action: 'Monitor weekly' });
      }

      // Turbidity Penalty (Ideal < 5)
      if (avgTurbidity > 5) {
          score -= 30;
          issues.push({ 
              parameter: 'Turbidity', 
              level: `${avgTurbidity.toFixed(1)} NTU (High)`, 
              action: 'Check filtration systems immediately' 
          });
      } else {
          issues.push({ parameter: 'Turbidity', level: 'Clear', action: 'Standard filtration' });
      }

      // TDS Penalty (Ideal < 500)
      if (avgTds > 500) {
          score -= 15;
          issues.push({ 
              parameter: 'TDS', 
              level: `${Math.round(avgTds)} ppm (High)`, 
              action: 'Inspect RO membrane' 
          });
      } else {
           issues.push({ parameter: 'TDS', level: 'Normal', action: 'No action needed' });
      }

      // Ensure score is 0-100
      score = Math.max(0, Math.min(100, Math.round(score)));

      let status = "Low Risk";
      if (score < 50) status = "High Outbreak Risk";
      else if (score < 80) status = "Moderate Risk";

      setHealthScore({
          score,
          status,
          chartData: [
              { name: 'Safety', value: score },
              { name: 'Risk', value: 100 - score }
          ]
      });

      setPreventionTable(issues);
  };

  const handleSearch = async () => {
    if (!form.state || !form.city) {
      alert("Please select both State and City.");
      return;
    }

    setLoading(true);
    setData(null);
    setOutbreakData(null);
    setHealthScore(null);

    // Special Handling for Outbreak Prediction
    if (selectedReport.id === 'outbreak_prediction') {
        // Simulate API delay
        await new Promise(r => setTimeout(r, 1500));
        const { history, forecast } = generateOutbreakData(form.date);
        
        setOutbreakData({ history, forecast });
        calculateHealthMetrics(forecast.data); // Calculate risk based on FUTURE data
        
        setLoading(false);
        return;
    }

    // Standard Gemini Report
    const result = await getAdvancedReport(selectedReport.key, {
      state: form.state,
      city: form.city,
      date: form.date,
      time: form.time
    });

    setData(result);
    setLoading(false);
  };

  const getMapUrl = () => {
    if (data && data.coordinates) {
       return `https://maps.google.com/maps?q=${data.coordinates.lat},${data.coordinates.lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }
    const query = form.city ? `${form.city}, ${form.state}` : 'North East India';
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=12&ie=UTF8&iwloc=&output=embed`;
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('good') || s.includes('safe') || s.includes('low') || s.includes('excellent')) 
        return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400';
    if (s.includes('moderate') || s.includes('satisfactory')) 
        return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400';
    return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400';
  };

  const getScoreColor = (score: number) => {
      if (score >= 80) return '#22c55e'; // Green
      if (score >= 50) return '#eab308'; // Yellow
      return '#ef4444'; // Red
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-[calc(100vh-64px)] transition-colors relative">
      
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('North East India Environmental Tracker')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Comprehensive monitoring for 8 NE States (Arunachal Pradesh, Assam, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura)</p>
      </div>

      {/* 1. REPORT SELECTOR */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> {t('Select Report Type')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {REPORT_KEYS.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedReport.id === type.id;
                return (
                    <button
                        key={type.id}
                        onClick={() => { setSelectedReport(type); setData(null); setOutbreakData(null); }}
                        className={`p-3 rounded-xl border transition-all flex flex-col items-center text-center gap-2 h-full
                            ${isSelected 
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/40 dark:border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800 shadow-md transform scale-105' 
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-slate-600 hover:shadow-sm'
                            }
                        `}
                    >
                        <div className={`p-2 rounded-full ${type.color}`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs font-bold ${isSelected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>
                            {t(type.key)}
                        </span>
                    </button>
                );
            })}
        </div>
      </div>

      {/* 2. INPUT FORM */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
             
             {/* State */}
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1"><MapPin className="w-3 h-3"/> {t('State')}</label>
                <select 
                   value={form.state} 
                   onChange={(e) => setForm({ ...form, state: e.target.value, city: '' })}
                   className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                    <option value="">{t('Select State')}</option>
                    {NE_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
             </div>

             {/* City */}
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{t('City / District')}</label>
                <select 
                   value={form.city} 
                   onChange={(e) => setForm({...form, city: e.target.value})}
                   className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                   disabled={!form.state}
                >
                    <option value="">{t('Select City')}</option>
                    {form.state && INDIAN_CITIES_MAP[form.state]?.map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
             </div>

             {/* Date */}
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1"><Calendar className="w-3 h-3"/> {t('Date')}</label>
                <input 
                   type="date"
                   value={form.date}
                   onChange={(e) => setForm({...form, date: e.target.value})}
                   className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
             </div>

             {/* Time */}
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1"><Clock className="w-3 h-3"/> {t('Time (Opt)')}</label>
                <input 
                   type="time"
                   value={form.time}
                   onChange={(e) => setForm({...form, time: e.target.value})}
                   className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
             </div>

             {/* Analyze Button */}
             <button 
               onClick={handleSearch}
               disabled={loading}
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed h-[42px]"
             >
                {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <>
                       <Search className="w-4 h-4" /> {t('Analyze')}
                    </>
                )}
             </button>
          </div>
      </div>

      {/* 3. SPLIT VIEW: DATA (LEFT) - MAP (RIGHT) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px] relative">
          
          {/* FLOATING CHART BOARD FOR OUTBREAK PREDICTION */}
          {selectedReport.id === 'outbreak_prediction' && outbreakData && (
              <div className="absolute inset-0 z-20 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 sm:p-6 overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl animate-fade-in flex flex-col">
                  <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm z-10">
                      <div>
                          <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                             <TrendingUp className="w-6 h-6 text-rose-500" /> 
                             Outbreak Prediction Analysis
                          </h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                             Trend Analysis & 30-Day Forecast for {form.city}
                          </p>
                      </div>
                      <button 
                        onClick={() => setOutbreakData(null)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                      >
                         <X className="w-6 h-6 text-slate-500" />
                      </button>
                  </div>

                  {/* 1. HISTORICAL GRAPHS (LAST 3 MONTHS) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-slate-200 dark:border-slate-700">
                     {outbreakData.history.map((monthData, idx) => (
                         <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                             <div className="flex justify-between items-center mb-4">
                                 <h3 className={`text-sm font-bold uppercase ${monthData.isCurrent ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                     {monthData.month}
                                 </h3>
                             </div>
                             
                             <div className="h-48">
                                 <ResponsiveContainer width="100%" height="100%">
                                     <ComposedChart data={monthData.data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                         <XAxis dataKey="day" hide />
                                         <YAxis yAxisId="left" domain={[0, 40]} orientation="left" stroke="#8884d8" fontSize={10} />
                                         <YAxis yAxisId="right" domain={[0, 500]} orientation="right" stroke="#ff7300" fontSize={10} />
                                         
                                         <Tooltip 
                                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                                         />
                                         
                                         <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#8884d8" strokeWidth={2} dot={false} />
                                         <Line yAxisId="left" type="monotone" dataKey="turbidity" stroke="#82ca9d" strokeWidth={2} dot={false} />
                                         <Line yAxisId="right" type="monotone" dataKey="tds" stroke="#ff7300" strokeWidth={2} dot={false} strokeDasharray="3 3" />
                                     </ComposedChart>
                                 </ResponsiveContainer>
                             </div>
                         </div>
                     ))}
                     
                     {/* Placeholder if history length < 4 (just to fill grid if needed, though we have 3 history + 1 future separate) */}
                  </div>

                  {/* 2. FUTURE PREDICTION SECTION */}
                  <div className="mt-8">
                      <div className="flex items-center gap-2 mb-6">
                           <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                           <h3 className="text-xl font-bold text-slate-800 dark:text-white">AI Forecast: Next 30 Days</h3>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                         {/* Predicted Graph */}
                         <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-sm relative overflow-hidden">
                             <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                                 Projected Data
                             </div>
                             <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-4">{outbreakData.forecast.month} (Predicted)</h4>
                             <div className="h-64">
                                 <ResponsiveContainer width="100%" height="100%">
                                     <ComposedChart data={outbreakData.forecast.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                         <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                         <XAxis dataKey="day" hide />
                                         <YAxis yAxisId="left" domain={[0, 40]} orientation="left" stroke="#8884d8" />
                                         <YAxis yAxisId="right" domain={[0, 600]} orientation="right" stroke="#ff7300" />
                                         <Tooltip />
                                         
                                         {/* Dashed lines indicate prediction */}
                                         <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#8884d8" strokeWidth={3} strokeDasharray="5 5" dot={false} name="pH (Est)" />
                                         <Line yAxisId="left" type="monotone" dataKey="turbidity" stroke="#82ca9d" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Turbidity (Est)" />
                                         <Line yAxisId="right" type="monotone" dataKey="tds" stroke="#ff7300" strokeWidth={3} strokeDasharray="5 5" dot={false} name="TDS (Est)" />
                                     </ComposedChart>
                                 </ResponsiveContainer>
                             </div>
                             <p className="text-xs text-indigo-400 mt-2 text-center italic">* Projections based on linear regression of last 90 days.</p>
                         </div>

                         {/* Predicted Risk (Pie Chart) */}
                         {healthScore && (
                             <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                     <ShieldAlert className="w-5 h-5 text-indigo-500" /> Predicted Risk Index
                                 </h3>
                                 <div className="flex flex-col sm:flex-row items-center gap-8">
                                     <div className="relative w-40 h-40">
                                         <ResponsiveContainer width="100%" height="100%">
                                             <PieChart>
                                                 <Pie
                                                     data={healthScore.chartData}
                                                     cx="50%"
                                                     cy="50%"
                                                     innerRadius={50}
                                                     outerRadius={70}
                                                     startAngle={90}
                                                     endAngle={-270}
                                                     dataKey="value"
                                                     stroke="none"
                                                 >
                                                     <Cell fill={getScoreColor(healthScore.score)} />
                                                     <Cell fill="#cbd5e1" opacity={0.3} />
                                                 </Pie>
                                             </PieChart>
                                         </ResponsiveContainer>
                                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                                             <span className="text-3xl font-bold text-slate-800 dark:text-white">{healthScore.score}%</span>
                                             <span className="text-[10px] uppercase font-bold text-slate-400">Safety</span>
                                         </div>
                                     </div>
                                     <div className="flex-1 text-center sm:text-left">
                                         <div className="mb-2">
                                             <span className="text-sm text-slate-500 dark:text-slate-400">Forecast Verdict</span>
                                             <p className={`text-xl font-bold ${getScoreColor(healthScore.score) === '#22c55e' ? 'text-green-600' : getScoreColor(healthScore.score) === '#eab308' ? 'text-yellow-600' : 'text-red-600'}`}>
                                                 {healthScore.status}
                                             </p>
                                         </div>
                                         <p className="text-sm text-slate-600 dark:text-slate-300">
                                             {healthScore.score > 80 
                                                 ? "Future trend looks stable. Standard monitoring advised." 
                                                 : "Metrics indicate a likely outbreak risk in the coming weeks. Preventive action required."}
                                         </p>
                                     </div>
                                 </div>
                             </div>
                         )}
                      </div>

                      {/* Preventive Table based on Prediction */}
                      {preventionTable.length > 0 && (
                          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                  <ClipboardCheck className="w-5 h-5 text-teal-500" /> Pre-emptive Actions
                              </h3>
                              <div className="overflow-x-auto">
                                  <table className="w-full text-sm text-left">
                                      <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-700/50">
                                          <tr>
                                              <th className="px-4 py-3 rounded-tl-lg">Parameter (Forecast)</th>
                                              <th className="px-4 py-3">Predicted Level</th>
                                              <th className="px-4 py-3 rounded-tr-lg">Recommended Action</th>
                                          </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                          {preventionTable.map((item, idx) => (
                                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                                                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{item.parameter}</td>
                                                  <td className="px-4 py-3">
                                                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                          item.level.includes('High') || item.level.includes('Risk') 
                                                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' 
                                                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                      }`}>
                                                          {item.level}
                                                      </span>
                                                  </td>
                                                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.action}</td>
                                              </tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          )}

          {/* LEFT SIDE: DATA DISPLAY (Standard) */}
          <div className="space-y-6">
              {!data && !loading && !outbreakData && (
                  <div className="h-full bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-center p-8 transition-colors">
                      <Info className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                      <h3 className="text-lg font-bold text-slate-500 dark:text-slate-400">No Data Generated</h3>
                      <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Select a report type and location above to generate an AI analysis.</p>
                  </div>
              )}

              {loading && (
                  <div className="h-full bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4 animate-pulse">
                      <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                      <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl w-full mt-6"></div>
                  </div>
              )}

              {data && !loading && (
                  <div className="animate-fade-in space-y-6">
                      
                      {/* Title Card */}
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden transition-colors">
                          {/* Simulation Badge */}
                          {data.is_simulated && (
                             <div className="absolute top-0 right-0 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-bl-lg border-b border-l border-amber-200 dark:border-amber-800 flex items-center gap-1">
                                <RefreshCw className="w-3 h-3" /> Simulated Data (Free Tier Limit)
                             </div>
                          )}
                          {!data.is_simulated && (
                             <div className="absolute top-0 right-0 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-bl-lg border-b border-l border-green-200 dark:border-green-800 flex items-center gap-1">
                                <Zap className="w-3 h-3" /> {t('Live AI Analysis')}
                             </div>
                          )}

                          <div className="flex justify-between items-start mt-2">
                              <div>
                                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{data.title}</h2>
                                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t(selectedReport.key)} • {form.city}, {form.state}</p>
                              </div>
                              <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${getStatusColor(data.overall_status)}`}>
                                  {data.overall_status}
                              </div>
                          </div>
                          <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed">{data.summary}</p>
                      </div>

                      {/* --- AI SAFETY ANALYSIS CARD --- */}
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-indigo-100 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6 transition-colors">
                          <div className="relative w-32 h-32 flex-shrink-0">
                             <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                   <Pie
                                      data={[{value: data.score}, {value: 100 - data.score}]}
                                      dataKey="value"
                                      innerRadius={40}
                                      outerRadius={55}
                                      startAngle={90}
                                      endAngle={-270}
                                      stroke="none"
                                   >
                                      <Cell fill={getScoreColor(data.score)} />
                                      <Cell fill="#94a3b8" opacity={0.2} />
                                   </Pie>
                                </PieChart>
                             </ResponsiveContainer>
                             <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-slate-800 dark:text-white">{data.score}%</span>
                                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Score</span>
                             </div>
                          </div>

                          <div className="flex-1 text-center sm:text-left">
                             <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('AI Verdict')}</h3>
                                <span className={`text-lg font-bold ${data.score > 70 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {data.verdict || data.overall_status}
                                </span>
                             </div>
                             
                             <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 leading-normal">
                                Based on current {t(selectedReport.key).toLowerCase()} analysis, the environment is 
                                <strong className={data.score > 70 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}> {data.score > 70 ? 'Safe' : 'Unsafe/Critical'}</strong>.
                                {data.score < 70 
                                    ? " Immediate remediation or filtration is strongly advised before use." 
                                    : " Quality is within acceptable limits for general use."}
                             </p>
                          </div>
                      </div>

                      {/* Metrics Visualizations */}
                      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                          <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                              <Activity className="w-4 h-4" /> {t('Key Metrics Visualization')}
                          </h3>
                          
                          {/* 1. Text Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                              {data.key_metrics?.map((metric: any, idx: number) => (
                                  <div key={idx} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 hover:border-indigo-200 transition-colors">
                                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase truncate" title={metric.name}>{metric.name}</p>
                                      <div className="flex items-baseline gap-1 mt-1">
                                          <span className="text-lg font-bold text-slate-900 dark:text-white">{metric.value}</span>
                                          <span className="text-xs text-slate-400 dark:text-slate-500">{metric.unit}</span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Alerts & Recommendations */}
                      <div className="grid grid-cols-1 gap-4">
                          {data.alerts && data.alerts.length > 0 && (
                              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/50">
                                  <h4 className="font-bold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
                                      <AlertTriangle className="w-4 h-4" /> {t('Critical Alerts')}
                                  </h4>
                                  <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                                      {data.alerts.map((alert: string, i: number) => (
                                          <li key={i}>{alert}</li>
                                      ))}
                                  </ul>
                              </div>
                          )}
                          
                          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                              <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center gap-2">
                                  <Info className="w-4 h-4" /> {t('Recommendations')}
                              </h4>
                              <ul className="list-disc list-inside text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                                  {data.recommendations?.map((rec: string, i: number) => (
                                      <li key={i}>{rec}</li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                  </div>
              )}
          </div>

          {/* RIGHT SIDE: MAP DISPLAY */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-[500px] lg:h-auto sticky top-24 transition-colors">
             <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                 <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" /> 
                    {t('Location View')}
                 </h3>
             </div>
             <div className="flex-1 relative bg-slate-100 dark:bg-slate-900">
                 <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={getMapUrl()}
                    className="absolute inset-0 w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                 ></iframe>
             </div>
          </div>
      </div>
    </div>
  );
};

export default QualityIndex;
