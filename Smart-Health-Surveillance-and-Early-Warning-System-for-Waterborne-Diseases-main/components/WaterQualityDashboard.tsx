
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';
import { WaterQualityReport } from '../types';
import { Droplets, AlertTriangle } from 'lucide-react';

interface WaterQualityDashboardProps {
  reports: WaterQualityReport[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const WaterQualityDashboard: React.FC<WaterQualityDashboardProps> = ({ reports }) => {
  
  const siteTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.siteType] = (counts[r.siteType] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [reports]);

  const contaminationData = useMemo(() => {
    return reports.map(r => ({
      name: r.siteName || r.sampleId,
      eColi: r.eColi,
      turbidity: r.turbidity,
      safe: r.eColi < 1 && r.turbidity < 5
    }));
  }, [reports]);

  if (reports.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-100 text-center">
        <Droplets className="w-12 h-12 text-slate-200 mx-auto mb-3" />
        <h3 className="text-slate-400 font-medium">No Water Quality Data Available</h3>
        <p className="text-slate-300 text-sm">Reports will appear here once filed by administrators.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Droplets className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Water Safety Analysis</h3>
          <p className="text-sm text-slate-500">{reports.length} samples analyzed in this region</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: Site Type Distribution */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase">Sample Sources</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={siteTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {siteTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Contamination Levels (Bar Chart) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase flex justify-between">
             <span>Contamination Levels (E. Coli)</span>
             <span className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> &gt; 0 is Unsafe</span>
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contaminationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                            <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-lg text-xs">
                            <p className="font-bold mb-1">{data.name}</p>
                            <p className="text-red-600">E. coli: {data.eColi} CFU</p>
                            <p className="text-slate-500">Turbidity: {data.turbidity} NTU</p>
                            </div>
                        );
                        }
                        return null;
                    }}
                />
                <Bar dataKey="eColi" name="E. coli Count" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Card 3: pH Variance */}
         <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
          <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase">pH Level Variance (Safe Range: 6.5 - 8.5)</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ph" type="number" domain={[4, 10]} name="pH" unit="" />
                <YAxis type="number" dataKey="turbidity" name="Turbidity" unit=" NTU" />
                <ZAxis type="number" range={[60, 400]} name="Score" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Samples" data={reports} fill="#8884d8">
                    {reports.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.ph < 6.5 || entry.ph > 8.5 ? '#ef4444' : '#10b981'} />
                    ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
