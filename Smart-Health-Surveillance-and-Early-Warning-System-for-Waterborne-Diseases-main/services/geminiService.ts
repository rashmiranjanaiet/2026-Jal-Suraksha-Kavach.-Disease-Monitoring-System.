import { StateData, WaterQualityReport } from "../types";

export type JalAssistantResponse = {
  text: string;
  audioBase64?: string;
  audioMimeType?: string;
};

const getTopStateSummary = (states: StateData[]) => {
  if (!states.length) return "No state disease data is available yet.";
  const top = [...states].sort((a, b) => b.totalAffected - a.totalAffected)[0];
  return `${top.name} currently has the highest reported disease burden with ${top.totalAffected} affected cases.`;
};

const getRecentWaterSummary = (reports: WaterQualityReport[]) => {
  if (!reports.length) return "No recent water quality reports are available.";
  const latest = reports[reports.length - 1];
  const safePh = latest.ph >= 6.5 && latest.ph <= 8.5;
  const safeTurbidity = latest.turbidity < 5;
  const verdict = safePh && safeTurbidity ? "within safe range" : "needs attention";
  return `Latest site ${latest.siteName} (${latest.siteType}) shows pH ${latest.ph} and turbidity ${latest.turbidity} NTU, which ${verdict}.`;
};

const getOfflineAssistantReply = (
  userQuery: string,
  contextData: { states: StateData[]; reports: WaterQualityReport[] }
) => {
  const q = userQuery.toLowerCase();

  if (q.includes("ph") || q.includes("safe range")) {
    return "The safe pH range for drinking water is 6.5 to 8.5.";
  }

  if (q.includes("state") || q.includes("disease") || q.includes("cases")) {
    return `${getTopStateSummary(contextData.states)} ${getRecentWaterSummary(contextData.reports)}`;
  }

  if (q.includes("water") || q.includes("quality") || q.includes("turbidity")) {
    return getRecentWaterSummary(contextData.reports);
  }

  return `I am running in offline mode without external AI APIs. ${getTopStateSummary(contextData.states)} ${getRecentWaterSummary(contextData.reports)}`;
};

export const generateHealthReport = async (stateData: StateData): Promise<string> => {
  const topDisease = stateData.diseases[0];
  return `Offline analysis for ${stateData.name}: total affected ${stateData.totalAffected}. Top concern is ${topDisease?.name || "water-borne disease"} with ${topDisease?.affected || 0} reported cases.\n\nRECOMMENDATION: Prioritize chlorination checks and ORS stock in high-burden districts this week.`;
};

export const suggestPreventiveMeasures = async (diseaseName: string): Promise<string[]> => {
  const defaults = ["Drink boiled or filtered water", "Wash hands with soap before meals", "Avoid uncovered street food"];
  const disease = diseaseName.toLowerCase();
  if (disease.includes("cholera")) return ["Use chlorinated drinking water", "Wash fruits and utensils with clean water", "Use ORS and seek care immediately for severe diarrhea"];
  if (disease.includes("typhoid")) return ["Drink safe water only", "Avoid raw cut fruits from unknown vendors", "Complete prescribed antibiotics from a doctor"];
  return defaults;
}

// --- JAL AI CHATBOT SERVICE ---
export const askJalAssistant = async (
  userQuery: string, 
  contextData: { states: StateData[], reports: WaterQualityReport[] },
  languageCode: string
): Promise<string> => {
  const result = await askJalAssistantWithVoice(userQuery, contextData, languageCode);
  return result.text;
};

export const askJalAssistantWithVoice = async (
  userQuery: string,
  contextData: { states: StateData[]; reports: WaterQualityReport[] },
  _languageCode: string
): Promise<JalAssistantResponse> => {
  return {
    text: getOfflineAssistantReply(userQuery, contextData),
  };
};


// --- MOCK GENERATOR FOR FREE TIER FALLBACK ---
const getMockAdvancedReport = (reportType: string, location: {city: string}) => {
  const isWater = reportType.toLowerCase().includes('water') || reportType.toLowerCase().includes('groundwater');
  const isDisease = reportType.toLowerCase().includes('disease') || reportType.toLowerCase().includes('hospital');
  
  // Random score logic
  const score = Math.floor(Math.random() * 40) + 50; // 50-90 range
  const isSafe = score > 75;

  let verdict = "Analysis Inconclusive";
  if (isWater) verdict = isSafe ? "Safe for Consumption" : "Requires Filtration";
  else if (isDisease) verdict = isSafe ? "Low Health Risk" : "Elevated Viral Risk";
  else verdict = isSafe ? "Stable Conditions" : "Caution Advised";

  return {
    title: `${reportType} - Simulated Analysis`,
    overall_status: isSafe ? "Safe" : "Caution",
    score: score,
    verdict: verdict,
    summary: `This is a simulated report for ${location.city} because the AI service is currently unreachable (likely Free Tier rate limit). Data suggests ${isWater ? (isSafe ? 'water parameters are within acceptable limits.' : 'turbidity levels are slightly high, boiling advised.') : isDisease ? 'seasonal variations in local health data.' : 'nominal environmental parameters.'}`,
    key_metrics: [
      { name: isWater ? "pH Level" : isDisease ? "Daily OPD" : "Larval Density", value: isWater ? "7.4" : isDisease ? "145" : "12", unit: isWater ? "" : isDisease ? "patients" : "per dip", status: "Neutral" },
      { name: isWater ? "Turbidity" : isDisease ? "Viral Fever" : "Fogging Coverage", value: isWater ? "12" : isDisease ? "45" : "85", unit: isWater ? "NTU" : isDisease ? "cases" : "%", status: isWater ? "Bad" : "Neutral" },
      { name: isWater ? "Dissolved Oxygen" : isDisease ? "Bed Occupancy" : "Stagnant Water", value: isWater ? "6.2" : isDisease ? "68" : "Low", unit: isWater ? "mg/L" : isDisease ? "%" : "risk", status: "Good" },
      { name: isWater ? "E. Coli" : isDisease ? "Critical Cases" : "Vector Index", value: isWater ? "4" : isDisease ? "2" : "0.4", unit: isWater ? "CFU" : isDisease ? "cases" : "", status: "Good" }
    ],
    alerts: ["Simulated Alert: Data based on historical averages due to connection issue."],
    recommendations: ["Check internet connection or API quota.", "Verify field data manually before taking action.", "Proceed with standard operating procedures."],
    coordinates: {
      lat: 26.1445, // Default fallback (Guwahati approx)
      lng: 91.7362
    },
    is_simulated: true
  };
};

export const getAdvancedReport = async (
  reportType: string,
  location: { state: string; city: string; date: string; time?: string }
) => {
  console.info(`Offline mode active. Returning simulated ${reportType} report for ${location.city}, ${location.state}.`);
  return getMockAdvancedReport(reportType, location);
};
