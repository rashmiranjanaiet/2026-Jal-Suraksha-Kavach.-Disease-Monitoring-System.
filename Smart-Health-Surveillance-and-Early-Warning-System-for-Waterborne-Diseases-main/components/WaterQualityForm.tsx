
import React, { useState } from 'react';
import { Droplets } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WaterQualityReport } from '../types';

interface WaterQualityFormProps {
  stateId: string;
  districtId?: string;
  subDivision?: string;
  block?: string;
}

export const WaterQualityForm: React.FC<WaterQualityFormProps> = ({ stateId, districtId, subDivision, block }) => {
  const { addWaterQualityReport } = useApp();
  
  const initialFormState = {
    sampleId: '',
    timestamp: new Date().toISOString().slice(0, 16),
    siteName: '',
    siteType: 'Well',
    latitude: '',
    longitude: '',
    collectorId: '',
    labId: '',
    ph: '7.0',
    temperature: '25',
    turbidity: '0',
    dissolvedOxygen: '0',
    nitrate: '0',
    eColi: '0',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReport: WaterQualityReport = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      siteType: formData.siteType as any,
      ph: Number(formData.ph),
      temperature: Number(formData.temperature),
      turbidity: Number(formData.turbidity),
      dissolvedOxygen: Number(formData.dissolvedOxygen),
      nitrate: Number(formData.nitrate),
      eColi: Number(formData.eColi),
      stateId,
      districtId,
      subDivision,
      block
    };

    addWaterQualityReport(newReport);
    alert('Water Quality Report Saved Successfully!');
    setFormData({ ...initialFormState, sampleId: '' });
  };

  // Common input class with explicit text color to fix visibility issues
  const inputClass = "w-full p-2.5 border border-slate-300 rounded-lg bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 mt-8">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50 rounded-t-xl">
        <Droplets className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-slate-800">Quick Add — Water Sample</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6" autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {/* Row 1 */}
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Sample ID</label>
            <input
              name="sampleId"
              placeholder="e.g. S-101"
              value={formData.sampleId}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Date & Time</label>
            <input
              type="datetime-local"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          {/* Row 2 */}
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Site Name</label>
            <input
              name="siteName"
              placeholder="e.g. North Village Well"
              value={formData.siteName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Source Type</label>
            <select
              name="siteType"
              value={formData.siteType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Well">Well</option>
              <option value="River">River</option>
              <option value="Tap">Tap</option>
              <option value="Reservoir">Reservoir</option>
            </select>
          </div>

          {/* Row 3 */}
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Latitude</label>
            <input
              name="latitude"
              placeholder="e.g. 27.5"
              value={formData.latitude}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Longitude</label>
            <input
              name="longitude"
              placeholder="e.g. 93.5"
              value={formData.longitude}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Row 4 */}
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Collector ID</label>
            <input
              name="collectorId"
              placeholder="Optional"
              value={formData.collectorId}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Lab ID</label>
            <input
              name="labId"
              placeholder="Optional"
              value={formData.labId}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Row 5 - Metrics */}
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">pH Level</label>
            <input
              type="number" step="any"
              name="ph"
              placeholder="pH"
              value={formData.ph}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Temperature (°C)</label>
            <input
              type="number" step="any"
              name="temperature"
              placeholder="Temp"
              value={formData.temperature}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Row 6 - Metrics */}
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Turbidity (NTU)</label>
            <input
              type="number" step="any"
              name="turbidity"
              placeholder="NTU"
              value={formData.turbidity}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Dissolved Oxygen (mg/L)</label>
            <input
              type="number" step="any"
              name="dissolvedOxygen"
              placeholder="mg/L"
              value={formData.dissolvedOxygen}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Row 7 - Metrics */}
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">Nitrate (mg/L)</label>
            <input
              type="number" step="any"
              name="nitrate"
              placeholder="mg/L"
              value={formData.nitrate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1 font-medium">E. coli (CFU/100ml)</label>
            <input
              type="number" step="any"
              name="eColi"
              placeholder="CFU"
              value={formData.eColi}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Row 8 - Full Width Notes */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-xs text-slate-500 mb-1 font-medium">Field Notes</label>
            <textarea
              name="notes"
              placeholder="Any additional observations..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg shadow-sm font-medium transition-colors"
          >
            Save Record
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...initialFormState, sampleId: '' })}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg shadow-sm font-medium transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
    