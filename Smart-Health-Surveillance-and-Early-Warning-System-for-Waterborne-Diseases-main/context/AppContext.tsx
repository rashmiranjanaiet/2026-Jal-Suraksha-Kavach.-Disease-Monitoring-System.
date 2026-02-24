import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StateData, User, DiseaseData, DistrictData, DiseaseReport, WaterQualityReport, Campaign } from '../types';
import { getAllStates } from '../constants';

interface AppContextType {
  statesData: StateData[];
  waterQualityReports: WaterQualityReport[];
  campaigns: Campaign[];
  user: User;
  login: (stateName: string, password: string) => boolean;
  logout: () => void;
  updateDiseaseData: (stateId: string, disease: DiseaseData, districtId?: string) => void;
  addCustomDisease: (stateId: string, diseaseName: string, count: number, districtId?: string) => void;
  deleteDisease: (stateId: string, diseaseId: string, districtId?: string) => void;
  addDiseaseReport: (stateId: string, diseaseId: string, report: DiseaseReport, districtId?: string) => void;
  addWaterQualityReport: (report: WaterQualityReport) => void;
  addCampaign: (campaign: Campaign) => void;
  toggleCampaignStatus: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [statesData, setStatesData] = useState<StateData[]>([]);
  const [waterQualityReports, setWaterQualityReports] = useState<WaterQualityReport[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [user, setUser] = useState<User>({ isAuthenticated: false, stateId: null, role: 'guest' });
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. Load Data from LocalStorage on Mount
  useEffect(() => {
    const loadData = () => {
      const savedStates = localStorage.getItem('statesData');
      const savedReports = localStorage.getItem('waterQualityReports');
      const savedCampaigns = localStorage.getItem('campaigns');

      if (savedStates) {
        setStatesData(JSON.parse(savedStates));
      } else {
        setStatesData(getAllStates()); // Fallback to mock data if empty
      }

      if (savedReports) {
        setWaterQualityReports(JSON.parse(savedReports));
      } else {
        // Mock reports if empty
        setWaterQualityReports([
          {
            id: 'w-1', sampleId: 'S-101', timestamp: '2023-10-26T09:00', siteName: 'Village North Well', siteType: 'Well',
            latitude: '27.5', longitude: '93.5', collectorId: 'C-01', labId: 'L-A1',
            ph: 7.2, temperature: 24, turbidity: 5, dissolvedOxygen: 6.5, nitrate: 1.2, eColi: 12,
            notes: 'Slightly turbid', stateId: 'AR', districtId: 'ar-dist-0'
          },
          {
            id: 'w-2', sampleId: 'S-102', timestamp: '2023-10-26T10:30', siteName: 'River Bend', siteType: 'River',
            latitude: '27.6', longitude: '93.6', collectorId: 'C-01', labId: 'L-A1',
            ph: 6.8, temperature: 22, turbidity: 15, dissolvedOxygen: 7.0, nitrate: 3.5, eColi: 45,
            notes: 'High runoff observed', stateId: 'AR', districtId: 'ar-dist-0'
          }
        ]);
      }

      if (savedCampaigns) {
        setCampaigns(JSON.parse(savedCampaigns));
      } else {
        // Mock campaigns if empty
        setCampaigns([
          {
            id: 'c-1',
            title: 'Boil Water Advisory — After Heavy Rain',
            category: 'Boil Water',
            targetAudience: 'All',
            mediaType: 'Text',
            mediaContent: '',
            description: 'Recent heavy rains increased turbidity. Boil water 10 minutes before drinking.',
            publishDate: '2023-10-27',
            isActive: true,
            autoTrigger: { parameter: 'turbidity_NTU', operator: '>', value: 10 }
          },
          {
            id: 'c-2',
            title: 'Handwashing Saves Lives',
            category: 'Hygiene',
            targetAudience: 'Schools',
            mediaType: 'Video',
            mediaContent: 'https://www.youtube.com/embed/dT2Yg5V2AhY', 
            description: 'Wash hands with soap for 20 secs before eating and after using toilet.',
            publishDate: '2023-10-25',
            isActive: true
          }
        ]);
      }
      setIsInitialized(true);
    };

    loadData();

    // Listener for cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'statesData' && e.newValue) setStatesData(JSON.parse(e.newValue));
      if (e.key === 'waterQualityReports' && e.newValue) setWaterQualityReports(JSON.parse(e.newValue));
      if (e.key === 'campaigns' && e.newValue) setCampaigns(JSON.parse(e.newValue));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 2. Save Data to LocalStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('statesData', JSON.stringify(statesData));
    }
  }, [statesData, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('waterQualityReports', JSON.stringify(waterQualityReports));
    }
  }, [waterQualityReports, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('campaigns', JSON.stringify(campaigns));
    }
  }, [campaigns, isInitialized]);


  const login = (stateName: string, password: string) => {
    // Mock Login Logic
    // User: State Name (Case insensitive)
    // Pass: "admin"
    const targetState = statesData.find(s => s.name.toLowerCase() === stateName.toLowerCase());
    
    if (targetState && password === 'admin') {
      setUser({
        isAuthenticated: true,
        role: 'admin',
        stateId: targetState.id
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser({ isAuthenticated: false, stateId: null, role: 'guest' });
  };

  // Helper to re-aggregate state data from districts
  const recalculateStateFromDistricts = (state: StateData, updatedDistricts: DistrictData[]): StateData => {
    const aggDiseases: Record<string, { count: number; reports: DiseaseReport[] }> = {};
    
    updatedDistricts.forEach(d => {
      d.diseases.forEach(dis => {
        if (!aggDiseases[dis.name]) {
            aggDiseases[dis.name] = { count: 0, reports: [] };
        }
        aggDiseases[dis.name].count += dis.affected;
        if (dis.reports) {
            aggDiseases[dis.name].reports.push(...dis.reports);
        }
      });
    });

    // Preserve IDs/metadata from existing state diseases if possible, or create new view
    const newStateDiseases = Object.entries(aggDiseases).map(([name, data], idx) => {
      const existing = state.diseases.find(sd => sd.name === name);
      return {
        id: existing?.id || `agg-${idx}`,
        name,
        affected: data.count,
        trend: existing?.trend || 'stable',
        lastUpdated: new Date().toISOString().split('T')[0],
        reports: data.reports
      };
    });

    const newTotal = updatedDistricts.reduce((acc, d) => acc + d.totalAffected, 0);

    return {
      ...state,
      districts: updatedDistricts,
      diseases: newStateDiseases,
      totalAffected: newTotal
    };
  };

  const updateDiseaseData = (stateId: string, updatedDisease: DiseaseData, districtId?: string) => {
    setStatesData(prev => prev.map(state => {
      if (state.id !== stateId) return state;
      
      if (districtId && state.districts) {
        const updatedDistricts = state.districts.map(dist => {
          if (dist.id !== districtId) return dist;
          
          const newDiseases = dist.diseases.map(d => 
            d.id === updatedDisease.id ? updatedDisease : d
          );
          const newTotal = newDiseases.reduce((sum, d) => sum + d.affected, 0);
          
          return { ...dist, diseases: newDiseases, totalAffected: newTotal };
        });

        return recalculateStateFromDistricts(state, updatedDistricts);
      } else {
        const updatedDiseases = state.diseases.map(d => 
          d.id === updatedDisease.id ? updatedDisease : d
        );
        const total = updatedDiseases.reduce((sum, d) => sum + d.affected, 0);
        return { ...state, diseases: updatedDiseases, totalAffected: total };
      }
    }));
  };

  const addCustomDisease = (stateId: string, diseaseName: string, count: number, districtId?: string) => {
    setStatesData(prev => prev.map(state => {
      if (state.id !== stateId) return state;

      const newId = Math.random().toString(36).substr(2, 9);
      const newDisease: DiseaseData = {
        id: newId,
        name: diseaseName,
        affected: count,
        trend: 'stable',
        lastUpdated: new Date().toISOString().split('T')[0],
        reports: []
      };

      if (districtId && state.districts) {
        const updatedDistricts = state.districts.map(dist => {
          if (dist.id !== districtId) return dist;
          
          const newDiseases = [...dist.diseases, newDisease];
          const newTotal = newDiseases.reduce((sum, d) => sum + d.affected, 0);
          
          return { ...dist, diseases: newDiseases, totalAffected: newTotal };
        });

        return recalculateStateFromDistricts(state, updatedDistricts);
      } else {
        const newDiseases = [...state.diseases, newDisease];
        const total = newDiseases.reduce((sum, d) => sum + d.affected, 0);
        return { ...state, diseases: newDiseases, totalAffected: total };
      }
    }));
  };

  const deleteDisease = (stateId: string, diseaseId: string, districtId?: string) => {
    setStatesData(prev => prev.map(state => {
      if (state.id !== stateId) return state;

      if (districtId && state.districts) {
        const updatedDistricts = state.districts.map(dist => {
          if (dist.id !== districtId) return dist;
          
          const updatedDiseases = dist.diseases.filter(d => d.id !== diseaseId);
          const newTotal = updatedDiseases.reduce((sum, d) => sum + d.affected, 0);
          
          return { ...dist, diseases: updatedDiseases, totalAffected: newTotal };
        });

        return recalculateStateFromDistricts(state, updatedDistricts);
      } else {
        const updatedDiseases = state.diseases.filter(d => d.id !== diseaseId);
        const total = updatedDiseases.reduce((sum, d) => sum + d.affected, 0);
        return { ...state, diseases: updatedDiseases, totalAffected: total };
      }
    }));
  };

  const addDiseaseReport = (stateId: string, diseaseId: string, report: DiseaseReport, districtId?: string) => {
    setStatesData(prev => prev.map(state => {
      if (state.id !== stateId) return state;

      if (districtId && state.districts) {
        const updatedDistricts = state.districts.map(dist => {
          if (dist.id !== districtId) return dist;
          
          const updatedDiseases = dist.diseases.map(d => {
            if (d.id !== diseaseId) return d;
            return {
              ...d,
              affected: d.affected + report.casesCount,
              reports: [...(d.reports || []), report],
              lastUpdated: new Date().toISOString().split('T')[0]
            };
          });
          const newTotal = updatedDiseases.reduce((sum, d) => sum + d.affected, 0);
          
          return { ...dist, diseases: updatedDiseases, totalAffected: newTotal };
        });

        return recalculateStateFromDistricts(state, updatedDistricts);
      } else {
        const updatedDiseases = state.diseases.map(d => {
            if (d.id !== diseaseId) return d;
            return {
              ...d,
              affected: d.affected + report.casesCount,
              reports: [...(d.reports || []), report],
              lastUpdated: new Date().toISOString().split('T')[0]
            };
        });
        const total = updatedDiseases.reduce((sum, d) => sum + d.affected, 0);
        return { ...state, diseases: updatedDiseases, totalAffected: total };
      }
    }));
  };

  const addWaterQualityReport = (report: WaterQualityReport) => {
    setWaterQualityReports(prev => [...prev, report]);
  };

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
  };

  return (
    <AppContext.Provider value={{ 
      statesData, 
      user, 
      waterQualityReports,
      campaigns,
      login, 
      logout, 
      updateDiseaseData, 
      addCustomDisease, 
      deleteDisease, 
      addDiseaseReport,
      addWaterQualityReport,
      addCampaign, 
      toggleCampaignStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};