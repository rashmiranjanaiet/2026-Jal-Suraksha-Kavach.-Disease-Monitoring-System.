
import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, WifiOff, Activity, Droplets, Thermometer, Waves, Zap, 
  RefreshCw, Server, AlertTriangle, Terminal, Settings, Save
} from 'lucide-react';
import { 
  AreaChart, Area, ResponsiveContainer
} from 'recharts';

// --- INITIAL CONFIGURATION ---
// Default IP provided by user. Can be changed in UI.
const DEFAULT_API = "http://192.168.178.193/data";
const POLLING_RATE = 2000; // 2 seconds

interface SensorData {
  temperature: number;
  ph: number;
  tds: number;
  turbidity: number;
  timestamp?: number;
}

const LiveMonitoring = () => {
  // Config State
  const [apiUrl, setApiUrl] = useState(DEFAULT_API);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(DEFAULT_API);

  // Data State
  const [currentData, setCurrentData] = useState<SensorData | null>(null);
  const [history, setHistory] = useState<SensorData[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Debug State
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [rawDebugData, setRawDebugData] = useState<string>('Initializing connection...');
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  const timerRef = useRef<any>(null);

  const fetchData = async () => {
    if (isSimulationMode) {
      simulateData();
      return;
    }

    try {
      // 1. Setup Timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      // 2. Anti-Cache: Add unique timestamp
      // Check if URL already has query params
      const separator = apiUrl.includes('?') ? '&' : '?';
      const uniqueUrl = `${apiUrl}${separator}t=${Date.now()}`;

      const response = await fetch(uniqueUrl, { 
        signal: controller.signal,
        headers: { 
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        },
        // mode: 'cors' is default. 
        // If your ESP32 doesn't send CORS headers, this will fail in browser console.
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      // 3. Get Raw Text First (Critical for Debugging)
      const textData = await response.text();
      setRawDebugData(textData); // Show exactly what the device sent

      // 4. Parse JSON
      let json;
      try {
        json = JSON.parse(textData);
      } catch (e) {
        throw new Error("Invalid JSON format. Check 'Raw Stream' below.");
      }
      
      // 5. Validate Fields
      if (json.temperature === undefined || json.ph === undefined) {
        throw new Error("JSON missing 'temperature' or 'ph' fields.");
      }

      // 6. Success Update
      handleNewData({
        temperature: Number(json.temperature),
        ph: Number(json.ph),
        tds: Number(json.tds || 0), // Fallback to 0 if missing
        turbidity: Number(json.turbidity || 0),
      });
      setStatus('connected');
      setErrorMsg('');

    } catch (err: any) {
      setStatus('error');
      
      let msg = err.message;
      if (err.name === 'AbortError') msg = "Device Timeout (Unreachable)";
      if (err.message.includes('Failed to fetch')) msg = "Network Error (CORS or Offline)";
      
      setErrorMsg(msg);
      
      // Keep showing raw data if we have it, otherwise show error
      setRawDebugData(prev => prev.startsWith('{') ? prev : `Connection Failed:\n${msg}\n\nTroubleshooting:\n1. Is device powered on?\n2. Is laptop on SAME WiFi?\n3. Check browser console for CORS errors.`);
    }
  };

  const simulateData = () => {
    const last = currentData || { temperature: 25, ph: 7, tds: 200, turbidity: 2 };
    const newData = {
      temperature: Number((last.temperature + (Math.random() - 0.5)).toFixed(1)),
      ph: Number((Math.max(6, Math.min(9, last.ph + (Math.random() - 0.5) * 0.1))).toFixed(2)),
      tds: Math.floor(Math.max(100, Math.min(500, last.tds + (Math.random() - 0.5) * 10))),
      turbidity: Number((Math.max(0, last.turbidity + (Math.random() - 0.5))).toFixed(1)),
    };
    handleNewData(newData);
    setStatus('connected');
    setRawDebugData(`[SIMULATION MODE ACTIVE]\nGenerating random data...\n${JSON.stringify(newData, null, 2)}`);
  };

  const handleNewData = (data: SensorData) => {
    const timestamped = { ...data, timestamp: Date.now() };
    setCurrentData(timestamped);
    setLastUpdated(new Date());
    
    setHistory(prev => {
      const newHistory = [...prev, timestamped];
      if (newHistory.length > 20) newHistory.shift(); 
      return newHistory;
    });
  };

  useEffect(() => {
    fetchData(); // Immediate fetch
    timerRef.current = setInterval(fetchData, POLLING_RATE);
    return () => clearInterval(timerRef.current);
  }, [apiUrl, isSimulationMode]); // Refetch if URL changes

  const handleSaveUrl = () => {
    setApiUrl(tempUrl);
    setIsEditingUrl(false);
    setHistory([]); // Clear history on new source
    setStatus('connecting');
  };

  // --- UI HELPERS ---

  const getStatusColor = (val: number, type: 'ph' | 'temp' | 'tds' | 'turb') => {
    let isSafe = true;
    if (type === 'ph') isSafe = val >= 6.5 && val <= 8.5;
    if (type === 'temp') isSafe = val < 30;
    if (type === 'tds') isSafe = val < 500;
    if (type === 'turb') isSafe = val < 5;
    return isSafe ? 'text-emerald-400' : 'text-rose-500';
  };

  const getStatusText = (val: number, type: 'ph' | 'temp' | 'tds' | 'turb') => {
    if (type === 'ph') {
      if (val < 6.5) return 'ACIDIC';
      if (val > 8.5) return 'ALKALINE';
      return 'OPTIMAL';
    }
    if (type === 'temp') return val > 30 ? 'WARM' : 'COOL';
    if (type === 'tds') return val > 500 ? 'HIGH' : 'SAFE';
    if (type === 'turb') return val > 5 ? 'CLOUDY' : 'CLEAR';
    return 'NORMAL';
  };

  const SensorCard = ({ title, value, unit, type, icon: Icon, colorClass }: any) => {
    const statusColor = getStatusColor(value, type);
    const statusText = getStatusText(value, type);
    const historyKey = type === 'temp' ? 'temperature' : type;

    return (
      <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.3)] group hover:border-slate-600 transition-all">
        {/* Glow Effect */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-10 blur-[50px] rounded-full group-hover:opacity-20 transition-opacity`}></div>
        
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-slate-800 border border-slate-700 ${statusColor} shadow-inner`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</h3>
              <p className={`text-[10px] font-bold ${statusColor} bg-slate-950/50 px-2 py-0.5 rounded mt-1 inline-block border border-slate-800`}>
                {statusText}
              </p>
            </div>
          </div>
          <div className="text-right">
             <span className={`text-4xl font-black text-white tabular-nums tracking-tight drop-shadow-md`}>
                {value}
             </span>
             <span className="text-sm text-slate-500 font-medium ml-1">{unit}</span>
          </div>
        </div>

        {/* Live Chart */}
        <div className="h-16 w-full mt-2 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={statusText === 'SAFE' || statusText === 'OPTIMAL' || statusText === 'CLEAR' || statusText === 'COOL' ? '#10b981' : '#f43f5e'} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={statusText === 'SAFE' ? '#10b981' : '#f43f5e'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey={historyKey} 
                stroke={statusText === 'SAFE' || statusText === 'OPTIMAL' || statusText === 'CLEAR' || statusText === 'COOL' ? '#10b981' : '#f43f5e'} 
                fill={`url(#grad-${type})`} 
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B1120] p-4 sm:p-8 relative overflow-hidden font-sans">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
              <Activity className="w-10 h-10 text-cyan-400" />
              HYDRONET LIVE
            </h1>
            
            {/* Editable API URL */}
            <div className="mt-2 flex items-center gap-2">
                {isEditingUrl ? (
                    <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700 animate-fade-in">
                        <input 
                            type="text" 
                            value={tempUrl} 
                            onChange={(e) => setTempUrl(e.target.value)}
                            className="bg-slate-950 text-cyan-300 text-xs font-mono p-2 rounded outline-none border border-slate-800 w-64"
                        />
                        <button onClick={handleSaveUrl} className="p-2 bg-green-600 hover:bg-green-700 text-white rounded">
                            <Save className="w-3 h-3" />
                        </button>
                    </div>
                ) : (
                    <p className="text-slate-400 font-mono text-sm tracking-tight flex items-center gap-2">
                        Source: <span className="text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{apiUrl}</span>
                        <button onClick={() => { setTempUrl(apiUrl); setIsEditingUrl(true); }} className="text-slate-500 hover:text-white transition-colors">
                            <Settings className="w-3 h-3" />
                        </button>
                    </p>
                )}
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-xl p-2 rounded-xl border border-slate-700 shadow-xl">
             <div className={`flex items-center gap-3 px-5 py-2.5 rounded-lg border transition-all duration-300
                ${status === 'connected' 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : status === 'connecting'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
                }
             `}>
                {status === 'connected' ? <Wifi className="w-5 h-5" /> : status === 'connecting' ? <RefreshCw className="w-5 h-5 animate-spin" /> : <WifiOff className="w-5 h-5" />}
                <span className="font-bold text-sm uppercase tracking-wider">
                  {status === 'connected' ? 'ONLINE' : status === 'connecting' ? 'POLLING...' : 'OFFLINE'}
                </span>
             </div>
             
             <div className="text-right px-3 border-l border-slate-700">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Last Sync</p>
                <p className="text-xs font-mono text-cyan-300 font-bold">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                </p>
             </div>
          </div>
        </div>

        {/* Status / Error Message */}
        {status === 'error' && !isSimulationMode && (
           <div className="mb-8 bg-rose-950/30 border border-rose-900/50 p-4 rounded-xl flex items-center gap-4 text-rose-200 animate-fade-in">
              <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0" />
              <div>
                 <p className="font-bold">Connection Issue</p>
                 <p className="text-sm opacity-70">{errorMsg}</p>
                 <p className="text-xs mt-1 text-rose-400">
                    Verify the IP in the settings above matches your device.
                 </p>
              </div>
           </div>
        )}

        {/* Dashboard Grid */}
        {currentData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-in">
            <SensorCard 
              title="Temperature" 
              value={currentData.temperature} 
              unit="°C" 
              type="temp" 
              icon={Thermometer} 
              colorClass="from-orange-500 to-red-600"
            />
            <SensorCard 
              title="pH Level" 
              value={currentData.ph} 
              unit="" 
              type="ph" 
              icon={Droplets} 
              colorClass="from-cyan-400 to-blue-600"
            />
            <SensorCard 
              title="TDS Value" 
              value={currentData.tds} 
              unit="ppm" 
              type="tds" 
              icon={Waves} 
              colorClass="from-violet-500 to-purple-600"
            />
            <SensorCard 
              title="Turbidity" 
              value={currentData.turbidity} 
              unit="NTU" 
              type="turb" 
              icon={Zap} 
              colorClass="from-amber-400 to-yellow-600"
            />
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
             <Server className="w-16 h-16 text-slate-700 mb-4" />
             <h3 className="text-xl font-bold text-slate-400">Waiting for Stream...</h3>
             <p className="text-sm text-slate-600 mt-2 max-w-md text-center">
                Waiting for valid JSON from <span className="font-mono text-cyan-500">{apiUrl}</span>.
                <br/>Check the debug console below.
             </p>
          </div>
        )}

        {/* Footer Controls & Raw Data Debug */}
        <div className="mt-12 space-y-4">
           {/* Controls */}
           <div className="flex justify-end">
              <div className="flex items-center gap-3 bg-slate-900 p-2 pr-4 rounded-full border border-slate-800">
                 <button 
                   onClick={() => setIsSimulationMode(!isSimulationMode)}
                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isSimulationMode ? 'bg-cyan-600' : 'bg-slate-700'}`}
                 >
                   <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isSimulationMode ? 'translate-x-6' : 'translate-x-1'}`} />
                 </button>
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {isSimulationMode ? 'Simulation Active' : 'Strict Mode (IoT)'}
                 </span>
              </div>
           </div>

           {/* Raw Data Debugger */}
           <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden font-mono text-xs shadow-inner">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                 <span className="text-slate-400 font-bold flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Raw Data Stream
                 </span>
                 <span className="text-slate-600">{apiUrl}</span>
              </div>
              <div className="p-4 max-h-40 overflow-auto">
                 <pre className={status === 'error' && !currentData ? 'text-rose-400' : 'text-emerald-400 whitespace-pre-wrap'}>
                    {rawDebugData || "Waiting for data..."}
                 </pre>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default LiveMonitoring;
