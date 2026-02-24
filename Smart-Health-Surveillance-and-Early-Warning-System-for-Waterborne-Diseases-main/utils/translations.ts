
export type Language = 
  | 'en' | 'hi' | 'as' | 'bn' | 'brx' | 'mni' 
  | 'lus' | 'kha' | 'grt' | 'nag' | 'njo' 
  | 'nsm' | 'njh' | 'nmf' | 'trp' | 'mjw' 
  | 'mrg' | 'dis' | 'twm' | 'adi';

export const LANGUAGES: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'brx', name: 'Bodo', nativeName: 'बर\'' },
  { code: 'mni', name: 'Meitei (Manipuri)', nativeName: 'ꯃꯩꯇꯩꯂꯣꯟ' },
  { code: 'lus', name: 'Mizo', nativeName: 'Mizo ṭawng' },
  { code: 'kha', name: 'Khasi', nativeName: 'Ka Ktien Khasi' },
  { code: 'grt', name: 'Garo', nativeName: 'A·chik' },
  { code: 'nag', name: 'Nagamese', nativeName: 'Nagamese' },
  { code: 'njo', name: 'Ao Naga', nativeName: 'Ao' },
  { code: 'nsm', name: 'Sumi (Sema)', nativeName: 'Sümi' },
  { code: 'njh', name: 'Lotha', nativeName: 'Lotha' },
  { code: 'nmf', name: 'Tangkhul', nativeName: 'Tangkhul' },
  { code: 'trp', name: 'Kokborok', nativeName: 'Kokborok' },
  { code: 'mjw', name: 'Karbi', nativeName: 'Karbi' },
  { code: 'mrg', name: 'Mishing', nativeName: 'Mising' },
  { code: 'dis', name: 'Dimasa', nativeName: 'Dimasa' },
  { code: 'twm', name: 'Monpa', nativeName: 'Monpa' },
  { code: 'adi', name: 'Adi', nativeName: 'Adi' },
];

// Helper to safely get translation or fallback
const getTrans = (set: any, lang: Language) => {
  return set[lang] || set['en'];
};

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  // Navigation
  "Dashboard": {
    en: "Dashboard",
    hi: "डैशबोर्ड",
    as: "ডেচবোর্ড",
    bn: "ড্যাশবোর্ড",
    mni: "ꯗꯦꯁꯕꯣꯔꯗ"
  },
  "Quality Index": {
    en: "Quality Index",
    hi: "गुणवत्ता सूचकांक",
    as: "গুণমান সূচক",
    bn: "গুণমান সূচক",
    mni: "ꯀ꯭ꯋꯥꯂꯤꯇꯤ ꯏꯟꯗꯦꯛꯁ"
  },
  "Live Sensors": {
    en: "Live Sensors",
    hi: "लाइव सेंसर",
    as: "লাইভ চেন্সৰ",
    bn: "লাইভ সেন্সর",
    mni: "ꯂꯥꯏꯚ ꯁꯦꯟꯁꯔ"
  },
  "WaterGuard Hero": {
    en: "WaterGuard Hero",
    hi: "वाटरगार्ड हीरो",
    as: "ৱাটাৰগাৰ্ড হিৰো",
    bn: "ওয়াটারগার্ড হিরো",
    mni: "ꯋꯥꯇꯔꯒꯥꯔꯗ ꯍꯤꯔꯣ"
  },
  "State Admin Login": {
    en: "State Admin Login",
    hi: "राज्य प्रशासन लॉगिन",
    as: "ৰাজ্যিক প্ৰশাসন লগইন",
    bn: "রাজ্য প্রশাসন লগইন",
    mni: "ꯁ꯭ꯇꯦꯠ ꯑꯦꯗꯃꯤꯟ ꯂꯣꯒꯏꯟ"
  },
  "Admin Panel": {
    en: "Admin Panel",
    hi: "प्रशासन पैनल",
    as: "প্ৰশাসন পেনেল",
    bn: "প্রশাসন প্যানেল",
    mni: "ꯑꯦꯗꯃꯤꯟ ꯄꯦꯅꯦꯜ"
  },
  "Logout": {
    en: "Logout",
    hi: "लॉग आउट",
    as: "লগ আউট",
    bn: "লগ আউট",
    mni: "ꯂꯣꯒ ꯑꯥꯎꯠ"
  },

  // Home Dashboard
  "Total Active Cases": {
    en: "Total Active Cases",
    hi: "कुल सक्रिय मामले",
    as: "মুঠ সক্ৰিয় ৰোগী",
    bn: "মোট সক্রিয় কেস",
    mni: "ꯑꯄꯨꯟꯕ ꯑꯦꯛꯇꯤꯚ ꯀꯦꯁꯁꯤꯡ"
  },
  "High Risk States": {
    en: "High Risk States",
    hi: "उच्च जोखिम वाले राज्य",
    as: "উচ্চ বিপদজনক ৰাজ্য",
    bn: "উচ্চ ঝুঁকিপূর্ণ রাজ্য",
    mni: "ꯑꯋꯥꯡꯕ ꯔꯤꯁ꯭ꯛ ꯂꯩꯕ ꯁ꯭ꯇꯦꯠꯁꯤꯡ"
  },
  "Dominant Disease": {
    en: "Dominant Disease",
    hi: "प्रमुख बीमारी",
    as: "প্ৰধান ৰোগ",
    bn: "প্রধান রোগ",
    mni: "ꯃꯔꯨꯑꯣꯏꯕ ꯂꯥꯏꯅꯥ"
  },
  "Nationwide Disease Heatmap": {
    en: "Nationwide Disease Heatmap",
    hi: "राष्ट्रव्यापी रोग हीटमैप",
    as: "ৰাষ্ট্ৰজোৰা ৰোগৰ হিটমেপ",
    bn: "দেশব্যাপী রোগের হিটম্যাপ",
    mni: "ꯂꯩꯄꯥꯛ ꯁꯤꯟꯕ ꯊꯨꯡꯅ ꯂꯥꯏꯅꯥꯒꯤ ꯍꯤꯠꯃꯦꯞ"
  },
  "National Distribution": {
    en: "National Distribution",
    hi: "राष्ट्रीय वितरण",
    as: "ৰাষ্ট্ৰীয় বিতৰণ",
    bn: "জাতীয় বিতরণ",
    mni: "ꯅꯦꯁꯅꯦꯜ ꯗꯤꯁꯇ꯭ꯔꯤꯕ꯭ꯌꯨꯁꯟ"
  },
  "By Disease Type": {
    en: "By Disease Type",
    hi: "रोग के प्रकार अनुसार",
    as: "ৰোগৰ প্ৰকাৰ অনুসৰি",
    bn: "রোগের ধরন অনুযায়ী",
    mni: "ꯂꯥꯏꯅꯥꯒꯤ ꯃꯈꯜ ꯃꯇꯨꯡ ꯏꯟꯅ"
  },
  "Caseload Comparison": {
    en: "Caseload Comparison",
    hi: "मामलों की तुलना",
    as: "ৰোগীৰ সংখ্যাৰ তুলনা",
    bn: "কেসলোড তুলনা",
    mni: "ꯀꯦꯁꯂꯣꯗ ꯆꯥꯡꯗꯝꯅꯕ"
  },
  "Public Awareness Campaign": {
    en: "Public Awareness Campaign",
    hi: "जन जागरूकता अभियान",
    as: "জন সজাগতা অভিযান",
    bn: "জনসচেতনতা অভিযান",
    mni: "ꯃꯤꯌꯥꯝꯗ ꯄꯥꯎꯖꯦꯜ ꯄꯤꯕ"
  },
  "State Data": {
    en: "State Data",
    hi: "राज्य डेटा",
    as: "ৰাজ্যিক তথ্য",
    bn: "রাজ্য ডেটা",
    mni: "ꯁ꯭ꯇꯦꯠ ꯗꯇꯥ"
  },
  "Search state...": {
    en: "Search state...",
    hi: "राज्य खोजें...",
    as: "ৰাজ্য অনুসন্ধান কৰক...",
    bn: "রাজ্য অনুসন্ধান করুন...",
    mni: "ꯁ꯭ꯇꯦꯠ ꯊꯤꯕ..."
  },
  "monitored diseases": {
    en: "monitored diseases",
    hi: "निगरानी की गई बीमारियां",
    as: "নিৰীক্ষণ কৰা ৰোগ",
    bn: "পর্যবেক্ষণ করা রোগ",
    mni: "ꯌꯦꯡꯁꯤꯟꯈꯤꯕ ꯂꯥꯏꯅꯥꯁꯤꯡ"
  },
  "cases": {
    en: "cases",
    hi: "मामले",
    as: "টা কেছ",
    bn: "টি কেস",
    mni: "ꯀꯦꯁꯁꯤꯡ"
  },

  // Quality Index
  "North East India Environmental Tracker": {
    en: "North East India Environmental Tracker",
    hi: "उत्तर पूर्व भारत पर्यावरण ट्रैकर",
    as: "উত্তৰ-পূব ভাৰত পৰিৱেশ ট্ৰেকাৰ",
    bn: "উত্তর পূর্ব ভারত পরিবেশ ট্র্যাকার",
    mni: "ꯅꯣꯔꯊ ꯏꯁ꯭ꯠ ꯏꯟꯗꯤꯌꯥ ꯏꯅꯚꯥꯏꯔꯅꯃꯦꯟꯇ ꯇ꯭ꯔꯦꯀꯔ"
  },
  "Select Report Type": {
    en: "Select Report Type",
    hi: "रिपोर्ट का प्रकार चुनें",
    as: "প্ৰতিবেদনৰ প্ৰকাৰ বাছনি কৰক",
    bn: "রিপোর্টের ধরন নির্বাচন করুন",
    mni: "ꯔꯤꯄꯣꯔꯠ ꯃꯈꯜ ꯈꯟꯕ"
  },
  "Water Quality Report": {
    en: "Water Quality Report",
    hi: "जल गुणवत्ता रिपोर्ट",
    as: "পানীৰ গুণমানৰ প্ৰতিবেদন",
    bn: "জলের গুণমান রিপোর্ট",
    mni: "ꯏꯁꯤꯡꯒꯤ ꯒꯨꯟ ꯔꯤꯄꯣꯔꯠ"
  },
  "Bacterial Test Results": {
    en: "Bacterial Test Results",
    hi: "बैक्टीरियल टेस्ट परिणाम",
    as: "বেক্টেৰিয়া পৰীক্ষাৰ ফলাফল",
    bn: "ব্যাকটেরিয়াল টেস্ট ফলাফল",
    mni: "ꯕꯦꯛꯇꯦꯔꯤꯌꯥ ꯇꯦꯁ꯭ꯠ ꯔꯤꯖꯜꯇ"
  },
  "Turbidity & pH Levels": {
    en: "Turbidity & pH Levels",
    hi: "गंदलापन और pH स्तर",
    as: "পানীৰ ঘোলা হোৱা আৰু pH স্তৰ",
    bn: "ঘোলাভাব এবং pH স্তর",
    mni: "ꯇꯔꯕꯤꯗꯤꯇꯤ & pH ꯂꯦꯚꯦꯜ"
  },
  "Rainfall & Flood Alerts": {
    en: "Rainfall & Flood Alerts",
    hi: "वर्षा और बाढ़ अलर्ट",
    as: "বৰষুণ আৰু বানপানীৰ সতৰ্কবাৰ্তা",
    bn: "বৃষ্টিপাত এবং বন্যার সতর্কতা",
    mni: "ꯅꯣꯡ ꯆꯨꯕ & ꯏꯁꯤꯡ ꯏꯆꯥꯎ ꯄꯥꯎꯖꯦꯜ"
  },
  "Groundwater Status": {
    en: "Groundwater Status",
    hi: "भूजल स्थिति",
    as: "ভূগৰ্ভস্থ পানীৰ স্থিতি",
    bn: "ভূগর্ভস্থ জলের অবস্থা",
    mni: "ꯒ꯭ꯔꯥꯎꯟꯗꯋꯥꯇꯔ ꯁ꯭ꯇꯦꯇꯁ"
  },
  "Daily Disease Cases": {
    en: "Daily Disease Cases",
    hi: "दैनिक बीमारी के मामले",
    as: "দৈনিক ৰোগৰ ঘটনা",
    bn: "দৈনিক রোগের কেস",
    mni: "ꯅꯨꯃꯤꯠ ꯈꯨꯗꯤꯡꯒꯤ ꯂꯥꯏꯅꯥ ꯀꯦꯁꯁꯤꯡ"
  },
  "Hospital OPD Summary": {
    en: "Hospital OPD Summary",
    hi: "अस्पताल OPD सारांश",
    as: "চিকিৎসালয় OPD সাৰাংশ",
    bn: "হাসপাতাল OPD সারাংশ",
    mni: "ꯍꯣꯁꯄꯤꯇꯥꯜ OPD ꯁꯝꯃꯔꯤ"
  },
  "Pipeline Leakage Reports": {
    en: "Pipeline Leakage Reports",
    hi: "पाइपलाइन रिसाव रिपोर्ट",
    as: "পাইপলাইন লিকেজ ৰিপৰ্ট",
    bn: "পাইপলাইন লিকেজ রিপোর্ট",
    mni: "ꯄꯥꯏꯞꯂꯥꯏꯟ ꯂꯤꯀꯦꯖ ꯔꯤꯄꯣꯔꯠ"
  },
  "Wastewater Overflow Alerts": {
    en: "Wastewater Overflow Alerts",
    hi: "अपशिष्ट जल अतिप्रवाह अलर्ट",
    as: "আৱৰ্জনা পানী ওলাই যোৱা সতৰ্কবাৰ্তা",
    bn: "বর্জ্য জল উপচে পড়ার সতর্কতা",
    mni: "ꯋꯦꯁ꯭ꯠꯋꯥꯇꯔ ꯑꯣꯚꯔꯐ꯭ꯂꯣ ꯑꯦꯂꯔ꯭ꯇ"
  },
  "Mosquito Breeding Spots": {
    en: "Mosquito Breeding Spots",
    hi: "मच्छर प्रजनन स्थल",
    as: "মহৰ বংশবৃদ্ধি স্থান",
    bn: "মশা প্রজনন স্থল",
    mni: "ꯀꯥꯡ ꯄꯣꯛꯐꯝ ꯃꯐꯝꯁꯤꯡ"
  },
  "Analyze": {
    en: "Analyze",
    hi: "विश्लेषण करें",
    as: "বিশ্লেষণ",
    bn: "বিশ্লেষণ",
    mni: "ꯑꯦꯅꯥꯂꯥꯏꯖ"
  },
  "Select State": {
    en: "Select State",
    hi: "राज्य चुनें",
    as: "ৰাজ্য বাছনি কৰক",
    bn: "রাজ্য নির্বাচন করুন",
    mni: "ꯁ꯭ꯇꯦꯠ ꯈꯟꯕ"
  },
  "Select City": {
    en: "Select City",
    hi: "शहर चुनें",
    as: "চহৰ বাছনি কৰক",
    bn: "শহর নির্বাচন করুন",
    mni: "ꯁꯤꯇꯤ ꯈꯟꯕ"
  },
  "City / District": {
    en: "City / District",
    hi: "शहर / जिला",
    as: "চহৰ / জিলা",
    bn: "শহর / জেলা",
    mni: "ꯁꯤꯇꯤ / ꯗꯤꯁꯇ꯭ꯔꯤꯛ"
  },
  "Date": {
    en: "Date",
    hi: "तारीख",
    as: "তাৰিখ",
    bn: "তারিখ",
    mni: "ꯇꯥꯡ"
  },
  "Time (Opt)": {
    en: "Time (Opt)",
    hi: "समय (वैकल्पिक)",
    as: "সময় (ঐচ্ছিক)",
    bn: "সময় (ঐচ্ছিক)",
    mni: "ꯃꯇꯝ (ꯑꯣꯞꯁꯅꯦꯜ)"
  },
  "State": {
    en: "State",
    hi: "राज्य",
    as: "ৰাজ্য",
    bn: "রাজ্য",
    mni: "ꯁ꯭ꯇꯦꯠ"
  },
  "AI Safety Analysis": {
    en: "AI Safety Analysis",
    hi: "AI सुरक्षा विश्लेषण",
    as: "AI সুৰক্ষা বিশ্লেষণ",
    bn: "AI নিরাপত্তা বিশ্লেষণ",
    mni: "AI ꯁꯦꯐꯇꯤ ꯑꯦꯅꯥꯂꯥꯏꯁꯤꯁ"
  },
  "AI Verdict": {
    en: "AI Verdict:",
    hi: "AI निर्णय:",
    as: "AI ৰ সিদ্ধান্ত:",
    bn: "AI রায়:",
    mni: "AI ꯋꯥꯔꯦꯞ:"
  },
  "Key Metrics Visualization": {
    en: "Key Metrics Visualization",
    hi: "मुख्य मेट्रिक्स विज़ुअलाइज़ेशन",
    as: "মুখ্য মেট্ৰিক্স প্ৰদৰ্শন",
    bn: "মূল মেট্রিক্স ভিজ্যুয়ালাইজেশন",
    mni: "ꯀꯤ ꯃꯦꯇ꯭ꯔꯤꯛꯁ ꯚꯤꯖꯨꯑꯦꯂꯥꯏꯖꯦꯁꯟ"
  },
  "Recommendations": {
    en: "Recommendations",
    hi: "सुझाव",
    as: "পৰামৰ্শ",
    bn: "সুপারিশ",
    mni: "ꯔꯦꯀꯃꯦꯟꯗꯦꯁꯟꯁꯤꯡ"
  },
  "Critical Alerts": {
    en: "Critical Alerts",
    hi: "गंभीर चेतावनी",
    as: "গুৰুতৰ সতৰ্কবাৰ্তা",
    bn: "জরুরী সতর্কতা",
    mni: "ꯀ꯭ꯔꯤꯇꯤꯀꯦꯜ ꯑꯦꯂꯔ꯭ꯇꯁꯤꯡ"
  },
  "Live AI Analysis": {
    en: "Live AI Analysis",
    hi: "लाइव AI विश्लेषण",
    as: "লাইভ AI বিশ্লেষণ",
    bn: "লাইভ AI বিশ্লেষণ",
    mni: "ꯂꯥꯏꯚ AI ꯑꯦꯅꯥꯂꯥꯏꯁꯤꯁ"
  },
  "Location View": {
    en: "Location View",
    hi: "स्थान दृश्य",
    as: "স্থান দৰ্শন",
    bn: "অবস্থান দৃশ্য",
    mni: "ꯃꯐꯝ ꯑꯗꯨꯒꯤ ꯃꯑꯣꯡ"
  }
};
