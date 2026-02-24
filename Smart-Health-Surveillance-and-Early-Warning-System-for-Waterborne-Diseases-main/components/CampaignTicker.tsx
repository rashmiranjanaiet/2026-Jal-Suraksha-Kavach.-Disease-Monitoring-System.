
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Megaphone, X, Info, ExternalLink } from 'lucide-react';
import { Campaign } from '../types';

export const CampaignTicker = () => {
  const { campaigns } = useApp();
  const activeCampaigns = campaigns.filter(c => c.isActive);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Helper to process YouTube URLs
  const getYoutubeDetails = (url: string) => {
    if (!url) return { embedUrl: '', watchUrl: '', isValid: false };
    
    // Regex to capture ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;

    return {
      embedUrl: id ? `https://www.youtube.com/embed/${id}` : url,
      watchUrl: id ? `https://www.youtube.com/watch?v=${id}` : url,
      isValid: !!id,
      id: id
    };
  };

  if (activeCampaigns.length === 0) return null;

  const videoDetails = selectedCampaign?.mediaType === 'Video' 
    ? getYoutubeDetails(selectedCampaign.mediaContent) 
    : null;

  // Render Function for Campaign Items
  const renderCampaignItem = (camp: Campaign, index: string | number) => {
    const details = camp.mediaType === 'Video' ? getYoutubeDetails(camp.mediaContent) : null;

    return (
      <div key={`${camp.id}-${index}`} className="flex items-center gap-3 mx-8">
        <button 
          onClick={() => setSelectedCampaign(camp)}
          className="flex items-center gap-2 text-sm font-medium hover:text-yellow-300 transition-colors focus:outline-none group"
        >
           <span className="bg-blue-700 px-2 py-0.5 rounded text-xs uppercase tracking-wider text-blue-200 border border-blue-600">
             {camp.category}
           </span>
           {camp.title}
           <span className="opacity-60 mx-2">•</span>
           <span className="font-light italic opacity-90">{camp.description.substring(0, 60)}...</span>
        </button>

        {/* Direct YouTube Link Button - Distinct Logo Style */}
        {camp.mediaType === 'Video' && details?.watchUrl && (
           <a 
             href={details.watchUrl} 
             target="_blank" 
             rel="noopener noreferrer"
             className="flex items-center justify-center w-10 h-7 bg-[#FF0000] rounded-lg hover:bg-red-700 transition-all shadow-md hover:scale-110 shrink-0"
             title="Watch on YouTube"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[8px] border-l-white border-b-[4px] border-b-transparent ml-0.5"></div>
           </a>
        )}
      </div>
    );
  };

  return (
    <div className="bg-blue-900 text-white overflow-hidden relative h-10 flex items-center shadow-md mb-4">
       <div className="bg-blue-800 h-full px-4 flex items-center z-10 font-bold text-sm whitespace-nowrap shadow-lg">
          <Megaphone className="w-4 h-4 mr-2 text-yellow-400 animate-pulse" />
          LATEST ALERTS
       </div>
       
       <div className="marquee-container flex-1 overflow-hidden relative h-full">
          <div className="marquee-content flex items-center h-full whitespace-nowrap animate-marquee">
             {activeCampaigns.map((camp, i) => renderCampaignItem(camp, i))}
             {/* Duplicate for seamless loop if few items */}
             {activeCampaigns.length < 3 && activeCampaigns.map((camp, i) => renderCampaignItem(camp, `dup-${i}`))}
          </div>
       </div>

       {/* Details Modal (Fixed Z-Index and Backdrop) */}
       {selectedCampaign && (
         <div 
            className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
            onClick={() => setSelectedCampaign(null)} // Close on backdrop click
         >
            <div 
                className="bg-white text-slate-900 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()} // Prevent close on modal click
            >
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Info className="w-5 h-5" /> Campaign Details
                    </h3>
                    <button onClick={() => setSelectedCampaign(null)} className="hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                   <div className="flex justify-between items-start">
                       <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide mb-3 inline-block">
                          {selectedCampaign.category}
                       </span>
                       <span className="text-xs text-slate-400">
                          {selectedCampaign.publishDate}
                       </span>
                   </div>
                   
                   <h2 className="text-2xl font-bold mb-2 text-slate-900">{selectedCampaign.title}</h2>
                   <p className="text-slate-500 text-sm mb-4 font-medium">Target Audience: {selectedCampaign.targetAudience}</p>
                   
                   <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
                      <p className="text-lg leading-relaxed text-slate-800">{selectedCampaign.description}</p>
                   </div>

                   {/* Media Content */}
                   {selectedCampaign.mediaType === 'Video' && videoDetails && (
                       <div className="space-y-3">
                           <div className="aspect-video w-full rounded-lg overflow-hidden bg-black relative shadow-md">
                               <iframe 
                                 src={videoDetails.embedUrl} 
                                 className="w-full h-full"
                                 title="Campaign Video"
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                 allowFullScreen
                               ></iframe>
                           </div>
                           
                           {/* Fallback / Redirect Button */}
                           <a 
                             href={videoDetails.watchUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center justify-center gap-2 w-full py-3 bg-[#FF0000] hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                           >
                             <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[10px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
                             {videoDetails.isValid ? "Watch on YouTube" : "Open Video Link"}
                           </a>
                           <p className="text-center text-xs text-slate-400">
                             If the video doesn't play, click the button above to open it directly.
                           </p>
                       </div>
                   )}
                   
                   {selectedCampaign.mediaType === 'Image' && selectedCampaign.mediaContent && (
                       <div className="w-full rounded-lg overflow-hidden border border-slate-200 shadow-md">
                          <img src={selectedCampaign.mediaContent} alt="Campaign" className="w-full h-auto object-cover" />
                       </div>
                   )}
                </div>
                
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                    <button 
                      onClick={() => setSelectedCampaign(null)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-5 py-2 rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
         </div>
       )}
    </div>
  );
};
