
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Save, Trash2, BarChart2, AlertTriangle, MapPin, FileText, X, Building2, Database, ArrowRight, ChevronRight, Megaphone } from 'lucide-react';
import { DiseaseReport, DistrictData, SubDivisionData, DiseaseData } from '../types';
import { WaterQualityForm } from '../components/WaterQualityForm';
import { CampaignManager } from '../components/CampaignManager';

const AdminPanel = () => {
  const { user, statesData, updateDiseaseData, addCustomDisease, deleteDisease, addDiseaseReport } = useApp();
  const currentState = statesData.find(s => s.id === user.stateId);
  
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedSubDivision, setSelectedSubDivision] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<string>('');

  const [newDiseaseName, setNewDiseaseName] = useState('');
  const [newDiseaseCount, setNewDiseaseCount] = useState(0);
  
  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedDiseaseForReport, setSelectedDiseaseForReport] = useState<{id: string, name: string} | null>(null);
  
  // Campaign Manager Modal
  const [showCampaignManager, setShowCampaignManager] = useState(false);

  // Form State
  const [reportForm, setReportForm] = useState({
      sourceType: 'ASHA' as 'ASHA'|'clinic'|'volunteer',
      timestamp: new Date().toISOString().slice(0, 16),
      fever: false,
      diarrhea: 0,
      vomiting: 0,
      onsetDays: 1,
      casesCount: 1,
      ageUnder5: 0,
      age5to15: 0,
      ageOver15: 0,
      notes: '',
      waterSource: '',
  });

  // Auto-select first district if available and none selected
  useEffect(() => {
    if (currentState?.districts && currentState.districts.length > 0 && !selectedDistrictId) {
      setSelectedDistrictId(currentState.districts[0].id);
    }
  }, [currentState]);

  // Reset hierarchy when district changes
  useEffect(() => {
    setSelectedSubDivision('');
    setSelectedBlock('');
  }, [selectedDistrictId]);

  // Reset block when subdivision changes
  useEffect(() => {
    setSelectedBlock('');
  }, [selectedSubDivision]);

  const REQUIRED_DISEASES = ['Diarrhea', 'Cholera', 'Typhoid', 'Hepatitis A'];

  // Determine which data set to work with (State level or District level)
  const activeData = selectedDistrictId && currentState?.districts 
    ? currentState.districts.find(d => d.id === selectedDistrictId) 
    : currentState;

  // Helpers for Hierarchy
  const activeDistrict = currentState?.districts?.find(d => d.id === selectedDistrictId);
  const hasSubDivisions = activeDistrict && 'subDivisions' in activeDistrict && activeDistrict.subDivisions && activeDistrict.subDivisions.length > 0;
  
  const activeSubDivisions = hasSubDivisions ? activeDistrict.subDivisions : [];
  const availableBlocks = activeSubDivisions?.find(s => s.name === selectedSubDivision)?.blocks || [];

  // Check if the user has drilled down to the required level for reporting
  const isSelectionComplete = () => {
    // FIX: If the state doesn't have districts configured (e.g. generic states), 
    // allow reporting at the state level immediately.
    if (!currentState?.districts || currentState.districts.length === 0) {
      return true;
    }

    // For Arunachal Pradesh (AR), strict hierarchy is enforced for reporting
    if (currentState?.id === 'AR') {
        if (!selectedDistrictId) return false;
        if (hasSubDivisions && !selectedSubDivision) return false;
        if (selectedSubDivision && availableBlocks.length > 0 && !selectedBlock) return false;
        return true;
    }
    
    // For other states with districts, district selection is required
    return !!selectedDistrictId;
  };

  const getDisplayData = (disease: DiseaseData) => {
      // Default to the raw numbers
      let count = disease.affected;
      let reportCount = disease.reports?.length || 0;

      // If we are viewing a specific subset (SubDiv or Block), we MUST calculate dynamically from reports
      if (selectedSubDivision || selectedBlock) {
          if (!disease.reports || disease.reports.length === 0) {
              return { count: 0, reportCount: 0 };
          }

          const filteredReports = disease.reports.filter(r => {
              if (selectedBlock) return r.block === selectedBlock;
              if (selectedSubDivision) return r.subDivision === selectedSubDivision;
              return true;
          });

          count = filteredReports.reduce((sum, r) => sum + r.casesCount, 0);
          reportCount = filteredReports.length;
      } 
      
      // For AR, since we initialized data to 0, `disease.affected` at District level 
      // is effectively the sum of all reports. So it inherently satisfies the reflection requirement.
      
      return { count, reportCount };
  };

  const handleUpdate = (diseaseId: string, field: 'affected' | 'trend', value: any) => {
    if (!currentState || !activeData) return;
    const disease = activeData.diseases.find(d => d.id === diseaseId);
    if (!disease) return;

    const updated = { ...disease, [field]: value, lastUpdated: new Date().toISOString().split('T')[0] };
    updateDiseaseData(currentState.id, updated, selectedDistrictId);
  };

  const handleAddDisease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentState || !newDiseaseName) return;
    addCustomDisease(currentState.id, newDiseaseName, Number(newDiseaseCount), selectedDistrictId);
    setNewDiseaseName('');
    setNewDiseaseCount(0);
  };

  const addMissingCoreDisease = (name: string) => {
      if (!currentState) return;
      addCustomDisease(currentState.id, name, 0, selectedDistrictId);
  };

  const handleDelete = (diseaseId: string, diseaseName: string) => {
    if (!currentState) return;
    if (window.confirm(`Are you sure you want to delete ${diseaseName} from the registry?`)) {
      deleteDisease(currentState.id, diseaseId, selectedDistrictId);
    }
  };

  const openReportModal = (diseaseId: string, diseaseName: string) => {
      setSelectedDiseaseForReport({ id: diseaseId, name: diseaseName });
      setReportForm({
        sourceType: 'ASHA',
        timestamp: new Date().toISOString().slice(0, 16),
        fever: false,
        diarrhea: 0,
        vomiting: 0,
        onsetDays: 1,
        casesCount: 1,
        ageUnder5: 1,
        age5to15: 0,
        ageOver15: 0,
        notes: '',
        waterSource: '',
      });
      setShowReportModal(true);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentState || !selectedDiseaseForReport) return;

      // Validate ages sum matches cases count
      const totalAges = Number(reportForm.ageUnder5) + Number(reportForm.age5to15) + Number(reportForm.ageOver15);
      if (totalAges !== Number(reportForm.casesCount)) {
          alert(`Age breakdown (${totalAges}) must equal Total Cases (${reportForm.casesCount})`);
          return;
      }

      const report: DiseaseReport = {
          id: Math.random().toString(36).substr(2, 9),
          sourceType: reportForm.sourceType,
          timestamp: reportForm.timestamp,
          symptoms: {
              fever: reportForm.fever,
              diarrhea: reportForm.diarrhea,
              vomiting: reportForm.vomiting,
              onsetDays: reportForm.onsetDays
          },
          casesCount: reportForm.casesCount,
          ageGroups: {
              under5: reportForm.ageUnder5,
              fiveToFifteen: reportForm.age5to15,
              over15: reportForm.ageOver15
          },
          notes: reportForm.notes,
          waterSource: reportForm.waterSource,
          // Crucial: Attach hierarchy data to report
          subDivision: selectedSubDivision || undefined,
          block: selectedBlock || undefined
      };

      addDiseaseReport(currentState.id, selectedDiseaseForReport.id, report, selectedDistrictId);
      setShowReportModal(false);
  };

  if (!currentState) return <div>Loading...</div>;
  if (!activeData) return <div>Loading Data...</div>;

  const missingDiseases = REQUIRED_DISEASES.filter(
      req => !activeData.diseases.some(d => d.name.toLowerCase() === req.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Campaigns Manager Overlay */}
      {showCampaignManager && <CampaignManager onClose={() => setShowCampaignManager(false)} />}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard: {currentState.name}</h1>
        <p className="text-slate-500">Manage public health data records</p>
      </div>

      {/* Hierarchical Selectors on Dashboard */}
      {currentState.districts && currentState.districts.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider flex items-center gap-2">
             <MapPin className="w-4 h-4" /> Location Drill-Down
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
             
             {/* District Selection */}
             <div className="flex flex-col w-full">
               <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs">1</div>
                   DISTRICT
               </label>
               <div className="relative">
                   <select 
                      value={selectedDistrictId} 
                      onChange={(e) => setSelectedDistrictId(e.target.value)}
                      className="w-full p-3 pl-4 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 outline-none appearance-none bg-white shadow-sm"
                   >
                     {currentState.districts.map(d => (
                       <option key={d.id} value={d.id}>{d.name}</option>
                     ))}
                   </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                       <ChevronRight className="w-4 h-4 rotate-90" />
                   </div>
               </div>
             </div>

             {/* SubDivision Selection */}
             {activeSubDivisions && activeSubDivisions.length > 0 ? (
               <div className="flex flex-col w-full animate-fade-in">
                 <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">2</div>
                     SUBDIVISION
                 </label>
                 <div className="relative">
                     <select
                        value={selectedSubDivision}
                        onChange={(e) => setSelectedSubDivision(e.target.value)}
                        className={`w-full p-3 pl-4 border rounded-lg font-semibold outline-none appearance-none bg-white transition-all shadow-sm
                            ${selectedSubDivision ? 'border-indigo-300 text-indigo-900 ring-1 ring-indigo-200' : 'border-slate-300 text-slate-500'}
                        `}
                     >
                        <option value="">Select Subdivision...</option>
                        {activeSubDivisions.map(s => (
                          <option key={s.name} value={s.name}>{s.name}</option>
                        ))}
                     </select>
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                         <ChevronRight className="w-4 h-4 rotate-90" />
                     </div>
                 </div>
               </div>
             ) : (
                 <div className="hidden md:flex h-full items-center justify-center opacity-20">
                     <ArrowRight className="w-6 h-6" />
                 </div>
             )}

             {/* Block Selection */}
             {selectedSubDivision && availableBlocks.length > 0 ? (
               <div className="flex flex-col w-full animate-fade-in">
                  <label className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs">3</div>
                       BLOCK / CIRCLE
                  </label>
                  <div className="relative">
                      <select
                         value={selectedBlock}
                         onChange={(e) => setSelectedBlock(e.target.value)}
                         className={`w-full p-3 pl-4 border rounded-lg font-semibold outline-none appearance-none bg-white transition-all shadow-sm
                             ${selectedBlock ? 'border-purple-300 text-purple-900 ring-1 ring-purple-200' : 'border-slate-300 text-slate-500'}
                         `}
                      >
                         <option value="">Select Block...</option>
                         {availableBlocks.map(b => (
                           <option key={b.name} value={b.name}>{b.name}</option>
                         ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                         <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                  </div>
               </div>
             ) : (
                 selectedSubDivision && (
                    <div className="hidden md:flex h-full items-center text-slate-400 text-sm italic p-4 bg-slate-50 rounded-lg">
                        No blocks listed for this subdivision.
                    </div>
                 )
             )}
           </div>
        </div>
      )}

      {missingDiseases.length > 0 && (
          <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                      <h3 className="text-lg font-bold text-orange-900">Missing Core Disease Reports</h3>
                      <p className="text-sm text-orange-700 mb-3">
                          {selectedDistrictId ? `The district of ${activeData.name}` : 'Your state'} is required to track the following diseases.
                      </p>
                      <div className="flex flex-wrap gap-2">
                          {missingDiseases.map(name => (
                              <button
                                key={name}
                                onClick={() => addMissingCoreDisease(name)}
                                className="bg-white border border-orange-300 text-orange-800 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-colors flex items-center gap-2"
                              >
                                  <Plus className="w-4 h-4" /> Add {name}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Edit Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                  <h3 className="font-bold text-slate-800">
                    {selectedDistrictId ? `${activeData.name} Registry` : 'State Disease Registry'}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      View Level: 
                      <span className="font-bold text-teal-700 px-2 py-0.5 bg-teal-50 rounded-md border border-teal-100">
                          {selectedBlock ? selectedBlock : selectedSubDivision ? selectedSubDivision : activeData.name}
                      </span>
                  </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div> Live Data
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {activeData.diseases.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No diseases recorded for this district yet. Add one using the panel on the right.
                </div>
              ) : (
                activeData.diseases.map((disease) => {
                  const displayData = getDisplayData(disease);
                  const canReport = isSelectionComplete();

                  return (
                    <div key={disease.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 text-lg">{disease.name}</h4>
                        <div className="flex gap-3 mt-1 items-center">
                           <span className="text-xs text-slate-400">Updated: {disease.lastUpdated}</span>
                           {displayData.reportCount > 0 && (
                               <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                                   {displayData.reportCount} Active Reports
                               </span>
                           )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        {/* Count Display */}
                        <div className="flex flex-col items-end min-w-[80px]">
                          <label className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Cases</label>
                          <span className="text-2xl font-bold text-slate-800">{displayData.count}</span>
                        </div>
                        
                        {/* Report Button */}
                        <div className="flex flex-col justify-end">
                            <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">Action</label>
                            <button
                                onClick={() => canReport && openReportModal(disease.id, disease.name)}
                                disabled={!canReport}
                                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-sm
                                    ${canReport 
                                        ? 'bg-teal-600 text-white hover:bg-teal-700 hover:shadow-md' 
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                                title={canReport ? "Add Incident Report" : "Please select a location to file a report"}
                            >
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">Report</span>
                            </button>
                        </div>

                        {/* Delete Button */}
                        <div className="flex flex-col justify-end">
                          <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">Del</label>
                          <button 
                            onClick={() => handleDelete(disease.id, disease.name)}
                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Add New Disease */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 mb-4">Register New Disease Type</h3>
             <form onSubmit={handleAddDisease} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Disease Name</label>
                 <input
                    type="text"
                    value={newDiseaseName}
                    onChange={(e) => setNewDiseaseName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 outline-none"
                    placeholder="e.g. Dengue"
                 />
               </div>
               <button 
                 type="submit" 
                 disabled={!newDiseaseName}
                 className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md font-medium transition-colors disabled:opacity-50"
               >
                 Add to Registry
               </button>
               <p className="text-xs text-slate-400 mt-2">
                   Adds the disease type to the district. You can then add specific case reports for each block.
               </p>
             </form>
          </div>

          {!isSelectionComplete() && currentState.id === 'AR' && (
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 animate-pulse">
                <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Action Required
                </h4>
                <p className="text-sm text-indigo-800">
                  To file a report for Arunachal Pradesh, you must select the specific <b>Subdivision</b> and <b>Block</b> from the dropdowns above.
                </p>
              </div>
          )}
        </div>
      </div>

      {/* --- NEW FEATURE: WATER QUALITY FORM --- */}
      <WaterQualityForm 
        stateId={currentState.id} 
        districtId={selectedDistrictId}
        subDivision={selectedSubDivision}
        block={selectedBlock}
      />

      {/* --- NEW FEATURE: CAMPAIGN BUTTON --- */}
      <div className="mt-12 pt-8 border-t border-slate-200 flex justify-center pb-12">
         <button 
            onClick={() => setShowCampaignManager(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-transform hover:scale-105"
         >
            <Megaphone className="w-5 h-5" />
            Manage Awareness Campaigns
         </button>
      </div>

      {/* Report Modal */}
      {showReportModal && selectedDiseaseForReport && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                      <div>
                          <h3 className="text-lg font-bold text-slate-800">Report Incident: {selectedDiseaseForReport.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                             <MapPin className="w-3 h-3" />
                             {activeData.name} 
                             {selectedSubDivision ? ` > ${selectedSubDivision}` : ''}
                             {selectedBlock ? ` > ${selectedBlock}` : ''}
                          </div>
                      </div>
                      <button onClick={() => setShowReportModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                          <X className="w-5 h-5 text-slate-500" />
                      </button>
                  </div>
                  
                  <form onSubmit={handleSubmitReport} className="p-6 space-y-6">
                      {/* 1. Basic Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Report Source</label>
                              <select
                                  value={reportForm.sourceType}
                                  onChange={e => setReportForm({...reportForm, sourceType: e.target.value as any})}
                                  className="w-full p-2 border border-slate-300 rounded-md"
                              >
                                  <option value="ASHA">ASHA Worker</option>
                                  <option value="clinic">Local Clinic</option>
                                  <option value="volunteer">Volunteer</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                              <input
                                  type="datetime-local"
                                  value={reportForm.timestamp}
                                  onChange={e => setReportForm({...reportForm, timestamp: e.target.value})}
                                  className="w-full p-2 border border-slate-300 rounded-md"
                              />
                          </div>
                      </div>

                      {/* 2. Location Confirmation (Read Only) */}
                      {(selectedSubDivision || selectedBlock) && (
                          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-sm flex items-center gap-3">
                              <Building2 className="w-5 h-5 text-indigo-600" />
                              <div>
                                  <span className="font-bold text-indigo-900 block">Confirmed Location</span>
                                  <span className="text-indigo-700">
                                      This report will be filed under <b>{selectedBlock}</b> ({selectedSubDivision}).
                                  </span>
                              </div>
                          </div>
                      )}

                      {/* 3. Symptoms */}
                      <div className="space-y-3">
                          <label className="block text-sm font-medium text-slate-700">Symptoms Observed</label>
                          <div className="flex gap-4">
                              <label className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={reportForm.fever} 
                                    onChange={e => setReportForm({...reportForm, fever: e.target.checked})}
                                    className="rounded text-teal-600 focus:ring-teal-500"
                                  />
                                  <span className="text-sm text-slate-700">Fever</span>
                              </label>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="text-xs text-slate-500">Diarrhea Episodes (per day)</label>
                                  <input 
                                    type="number" min="0"
                                    value={reportForm.diarrhea}
                                    onChange={e => setReportForm({...reportForm, diarrhea: Number(e.target.value)})}
                                    className="w-full p-2 border border-slate-300 rounded-md"
                                  />
                              </div>
                              <div>
                                  <label className="text-xs text-slate-500">Vomiting Episodes (per day)</label>
                                  <input 
                                    type="number" min="0"
                                    value={reportForm.vomiting}
                                    onChange={e => setReportForm({...reportForm, vomiting: Number(e.target.value)})}
                                    className="w-full p-2 border border-slate-300 rounded-md"
                                  />
                              </div>
                          </div>
                      </div>

                      {/* 4. Stats */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-1">Total Cases in this Report</label>
                              <input 
                                type="number" min="1"
                                value={reportForm.casesCount}
                                onChange={e => setReportForm({...reportForm, casesCount: Number(e.target.value)})}
                                className="w-full p-2 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 text-lg font-bold"
                              />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                              <div>
                                  <label className="text-xs text-slate-500">Age &lt; 5</label>
                                  <input 
                                    type="number" min="0"
                                    value={reportForm.ageUnder5}
                                    onChange={e => setReportForm({...reportForm, ageUnder5: Number(e.target.value)})}
                                    className="w-full p-2 border border-slate-300 rounded-md"
                                  />
                              </div>
                              <div>
                                  <label className="text-xs text-slate-500">Age 5-15</label>
                                  <input 
                                    type="number" min="0"
                                    value={reportForm.age5to15}
                                    onChange={e => setReportForm({...reportForm, age5to15: Number(e.target.value)})}
                                    className="w-full p-2 border border-slate-300 rounded-md"
                                  />
                              </div>
                              <div>
                                  <label className="text-xs text-slate-500">Age &gt; 15</label>
                                  <input 
                                    type="number" min="0"
                                    value={reportForm.ageOver15}
                                    onChange={e => setReportForm({...reportForm, ageOver15: Number(e.target.value)})}
                                    className="w-full p-2 border border-slate-300 rounded-md"
                                  />
                              </div>
                          </div>
                      </div>

                      {/* 5. Context */}
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Water Source (if known)</label>
                          <input 
                            type="text"
                            value={reportForm.waterSource}
                            onChange={e => setReportForm({...reportForm, waterSource: e.target.value})}
                            className="w-full p-2 border border-slate-300 rounded-md"
                            placeholder="e.g. Village Well, River, Tap"
                          />
                      </div>
                      
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
                          <textarea
                             value={reportForm.notes}
                             onChange={e => setReportForm({...reportForm, notes: e.target.value})}
                             className="w-full p-2 border border-slate-300 rounded-md h-20"
                             placeholder="Any specific observations..."
                          />
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                          <button 
                            type="button"
                            onClick={() => setShowReportModal(false)}
                            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
                          >
                              Cancel
                          </button>
                          <button 
                            type="submit"
                            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-sm"
                          >
                              Submit Report
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminPanel;
