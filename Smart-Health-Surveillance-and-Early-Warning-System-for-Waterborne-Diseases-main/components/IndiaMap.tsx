
import React, { useState } from 'react';
import { INDIA_MAP_PATHS } from '../constants';
import { StateData } from '../types';

interface IndiaMapProps {
  onStateClick: (stateId: string) => void;
  data: StateData[];
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ onStateClick, data }) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const getColor = (stateId: string) => {
    const state = data.find(s => s.id === stateId);
    if (!state) return '#e2e8f0'; // slate-200
    
    // Color scale based on affected count
    if (state.totalAffected > 1000) return '#ef4444'; // red-500
    if (state.totalAffected > 500) return '#f97316'; // orange-500
    if (state.totalAffected > 200) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-white p-4 rounded-xl shadow-lg border border-slate-100">
      
      {/* --- CUSTOM ANIMATION SLOT --- */}
      {/* Step 1: Design in Canva. Step 2: Export as GIF. Step 3: Replace the src below with your GIF URL */}
      <div className="w-full h-12 mb-2 flex items-center justify-center overflow-hidden rounded-lg bg-slate-50 border border-dashed border-slate-200">
        {/* Replace the src below with your Canva GIF URL */}
        <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGV6YWU5eXJ5b3J6b3J6b3J6b3J6b3J6b3J6b3J6b3J6/3o7TKSjRrfIPjeiVyM/giphy.gif" 
            alt="Custom Canva Animation" 
            className="h-full w-full object-cover opacity-50 hover:opacity-100 transition-opacity" 
        />
      </div>
      {/* ----------------------------- */}

      <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">Nationwide Disease Heatmap</h2>
      <div className="w-full aspect-[4/4.5] relative">
        {/* ViewBox adjusted for the new realistic India paths (approx 140-450 width, 40-400 height) */}
        <svg viewBox="120 30 350 380" className="w-full h-full drop-shadow-xl">
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {INDIA_MAP_PATHS.map((path) => (
            <g key={path.id}
               onClick={() => onStateClick(path.id)}
               onMouseEnter={() => setHoveredState(path.id)}
               onMouseLeave={() => setHoveredState(null)}
               className="cursor-pointer transition-all duration-300 hover:opacity-90">
              <title>{path.name}</title>
              <path
                d={path.d}
                fill={getColor(path.id)}
                stroke="white"
                strokeWidth="1"
                className="transition-colors duration-300 hover:stroke-slate-800 hover:stroke-1"
              />
              {/* Labels for major states (simplified positioning) */}
              {hoveredState === path.id && (
                  <text 
                    x={getPathCenter(path.d).x} 
                    y={getPathCenter(path.d).y} 
                    fontSize="8" 
                    fill="black" 
                    textAnchor="middle" 
                    pointerEvents="none"
                    className="font-bold drop-shadow-md bg-white"
                  >
                    {path.id}
                  </text>
              )}
            </g>
          ))}
        </svg>

        {/* Tooltip Overlay */}
        {hoveredState && (
          <div className="absolute top-4 right-4 bg-slate-800 text-white p-3 rounded-lg shadow-lg z-10 animate-fade-in pointer-events-none opacity-90">
             <p className="font-bold text-sm">{data.find(s => s.id === hoveredState)?.name || INDIA_MAP_PATHS.find(p => p.id === hoveredState)?.name}</p>
             <div className="mt-1 text-xs text-slate-300">
               <p>Active Cases: {data.find(s => s.id === hoveredState)?.totalAffected || 'No Data'}</p>
               <p className="mt-1 text-teal-400">Click for details</p>
             </div>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-4 mt-4 text-xs text-slate-600">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div>Low</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div>Moderate</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded-full"></div>High</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div>Critical</div>
      </div>
    </div>
  );
};

// Helper for approximate center of polygon
const getPathCenter = (d: string) => {
  const nums = d.match(/[-]?\d+(\.\d+)?/g)?.map(Number) || [];
  if (nums.length < 4) return { x: 0, y: 0 };
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for(let i = 0; i < nums.length; i+=2) {
     if (nums[i] < minX) minX = nums[i];
     if (nums[i] > maxX) maxX = nums[i];
     if (nums[i+1] < minY) minY = nums[i+1];
     if (nums[i+1] > maxY) maxY = nums[i+1];
  }
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
};
