
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Image as ImageIcon, Video, FileText, Megaphone, Play, ExternalLink } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignManagerProps {
  onClose: () => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ onClose }) => {
  const { campaigns, addCampaign, toggleCampaignStatus } = useApp();
  // Default to true to allow direct access as requested (bypassing "verify box" login issues)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hygiene',
    targetAudience: 'All',
    mediaType: 'Video' as 'Image' | 'Video' | 'PDF' | 'Text', // Default to Video as requested
    mediaContent: '',
    description: '',
    publishDate: new Date().toISOString().slice(0, 10),
    // Auto Trigger
    triggerParam: 'Turbidity (NTU)',
    triggerOperator: '>',
    triggerValue: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'RASHMI' && password === 'Rashmi@123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid ID or Password');
    }
  };

  // Helper to extract YouTube ID for preview
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = formData.mediaType === 'Video' ? getYoutubeId(formData.mediaContent) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCampaign: Campaign = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      category: formData.category,
      targetAudience: formData.targetAudience,
      mediaType: formData.mediaType,
      mediaContent: formData.mediaContent,
      description: formData.description,
      publishDate: formData.publishDate,
      isActive: true,
      autoTrigger: formData.triggerValue ? {
        parameter: formData.triggerParam,
        operator: formData.triggerOperator as '>' | '<',
        value: Number(formData.triggerValue)
      } : undefined
    };

    addCampaign(newCampaign);
    alert('Campaign Created & Published Successfully!');
    setFormData({
      ...formData,
      title: '',
      description: '',
      mediaContent: '',
      triggerValue: ''
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
          
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Campaign Manager</h2>
              <p className="text-slate-500 text-sm">Authorized Access Only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">User ID</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter ID"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter Password"
                />
              </div>
              
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold shadow-md transition-colors"
              >
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated View
  return (
    <div className="fixed inset-0 bg-slate-100 z-[60] overflow-y-auto">
      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
             <h1 className="text-2xl font-bold text-slate-900">Awareness — Interface Demo</h1>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300">Public View</button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={onClose}>Admin Panel</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Create Awareness Campaign</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <input 
                type="text" 
                placeholder="Campaign Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-md focus:border-blue-400 outline-none text-slate-700"
                required
              />
            </div>

            {/* Category & Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <select 
                 value={formData.category}
                 onChange={(e) => setFormData({...formData, category: e.target.value})}
                 className="w-full p-3 border border-slate-200 rounded-md focus:border-blue-400 outline-none bg-white text-slate-700"
               >
                 <option value="Hygiene">Hygiene</option>
                 <option value="Boil Water">Boil Water</option>
                 <option value="Cholera">Cholera</option>
                 <option value="Typhoid">Typhoid</option>
               </select>
               
               <select 
                 value={formData.targetAudience}
                 onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                 className="w-full p-3 border border-slate-200 rounded-md focus:border-blue-400 outline-none bg-white text-slate-700"
               >
                 <option value="All">All</option>
                 <option value="Schools">Schools</option>
                 <option value="Villages">Villages</option>
                 <option value="Health Workers">Health Workers</option>
               </select>
            </div>

            {/* Media Type */}
            <select 
                value={formData.mediaType}
                onChange={(e) => setFormData({...formData, mediaType: e.target.value as any})}
                className="w-full p-3 border border-slate-200 rounded-md focus:border-blue-400 outline-none bg-white text-slate-700"
            >
                <option value="Video">Video (YouTube)</option>
                <option value="Image">Image</option>
                <option value="PDF">PDF</option>
                <option value="Text">Text</option>
            </select>

            {/* Media Input - WITH YOUTUBE LOGO ON LEFT & PREVIEW */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                   {/* Logo Display - Clickable for verification */}
                   {formData.mediaType === 'Video' && (
                      <a 
                        href={formData.mediaContent || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-12 h-8 bg-[#FF0000] rounded-lg flex items-center justify-center shadow-sm shrink-0 transition-transform hover:scale-105 ${!formData.mediaContent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`} 
                        title="Click to Verify Link on YouTube"
                      >
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5"></div>
                      </a>
                   )}
                   {formData.mediaType === 'Image' && <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-lg"><ImageIcon className="text-blue-600 w-6 h-6" /></div>}
                   {formData.mediaType === 'Text' && <div className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg"><FileText className="text-slate-600 w-6 h-6" /></div>}
                   {formData.mediaType === 'PDF' && <div className="w-10 h-10 flex items-center justify-center bg-red-50 rounded-lg"><FileText className="text-red-500 w-6 h-6" /></div>}
                   
                   <input 
                    type="text" 
                    placeholder={formData.mediaType === 'Video' ? "Paste YouTube link here..." : "Paste Image URL or leave blank"}
                    value={formData.mediaContent}
                    onChange={(e) => setFormData({...formData, mediaContent: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-md focus:border-blue-400 outline-none text-slate-700"
                  />
                </div>

                {/* VIDEO VERIFICATION PREVIEW BOX */}
                {formData.mediaType === 'Video' && youtubeId && (
                    <div className="ml-[60px] bg-slate-50 p-3 rounded-lg border border-slate-200 animate-fade-in">
                        <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                            <Play className="w-3 h-3" /> VERIFY VIDEO PREVIEW
                        </p>
                        <div className="aspect-video w-64 rounded-md overflow-hidden bg-black shadow-sm">
                             <iframe 
                               src={`https://www.youtube.com/embed/${youtubeId}`}
                               className="w-full h-full"
                               title="Preview"
                               allowFullScreen
                             ></iframe>
                        </div>
                    </div>
                )}
            </div>

            {/* Description */}
            <div>
               <textarea 
                placeholder="Message / Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-slate-200 rounded-md focus:border-blue-400 outline-none text-slate-700 min-h-[100px]"
                required
               />
            </div>

            {/* Date */}
            <div>
               <input 
                type="date"
                placeholder="Publish Date (ISO)"
                value={formData.publishDate}
                onChange={(e) => setFormData({...formData, publishDate: e.target.value})}
                className="w-full md:w-1/2 p-3 border border-slate-200 rounded-md focus:border-blue-400 outline-none text-slate-700"
               />
            </div>

            {/* Auto Trigger Rule */}
            <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
               <label className="block text-sm font-semibold text-slate-800 mb-3">Auto-trigger rule (optional)</label>
               <div className="flex gap-2 items-center">
                  <select 
                    value={formData.triggerParam}
                    onChange={(e) => setFormData({...formData, triggerParam: e.target.value})}
                    className="p-2 border border-slate-200 rounded-md text-sm min-w-[160px]"
                  >
                    <option value="Turbidity (NTU)">Turbidity (NTU)</option>
                    <option value="E. coli (CFU/100ml)">E. coli (CFU/100ml)</option>
                    <option value="Nitrate (mg/L)">Nitrate (mg/L)</option>
                  </select>
                  
                  <select 
                    value={formData.triggerOperator}
                    onChange={(e) => setFormData({...formData, triggerOperator: e.target.value})}
                    className="p-2 border border-slate-200 rounded-md text-sm"
                  >
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                  </select>

                  <input 
                    type="number" 
                    placeholder="Value" 
                    value={formData.triggerValue}
                    onChange={(e) => setFormData({...formData, triggerValue: e.target.value})}
                    className="p-2 border border-slate-200 rounded-md text-sm w-32"
                  />
               </div>
               <p className="text-xs text-slate-400 mt-2">If triggered, campaign surfaces automatically on public view.</p>
            </div>

            <div className="flex gap-4 pt-4">
               <button type="submit" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold">
                  Create & Publish
               </button>
               <button type="button" onClick={() => setFormData({...formData, title: ''})} className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md font-semibold">
                  Reset
               </button>
            </div>
          </form>
        </div>

        {/* Existing Campaigns List */}
        <div className="mb-4">
           <h3 className="font-bold text-slate-900 mb-4">Campaigns (Admin)</h3>
           <div className="space-y-4">
             {campaigns.map(camp => (
               <div key={camp.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-start">
                 <div>
                   <h4 className="font-bold text-slate-800 flex items-center gap-2">
                     {camp.title}
                     {camp.autoTrigger && <span className="text-xs font-normal text-slate-400">(auto: {camp.autoTrigger.parameter} {camp.autoTrigger.operator} {camp.autoTrigger.value})</span>}
                   </h4>
                   <p className="text-sm text-slate-500">{camp.category} • Target: {camp.targetAudience}</p>
                   <p className="text-sm text-slate-600 mt-1">{camp.description}</p>
                 </div>
                 <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => toggleCampaignStatus(camp.id)}
                      className={`px-3 py-1 text-xs rounded-md font-medium ${camp.isActive ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
                    >
                      {camp.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-md font-medium">Edit</button>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Mock Live Data Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-slate-400 text-xs">
          <p className="font-bold mb-1">Latest Reading (Mock)</p>
          <p>Turbidity: 12 NTU • E. coli: 0 CFU/100ml</p>
        </div>

      </div>
    </div>
  );
};
