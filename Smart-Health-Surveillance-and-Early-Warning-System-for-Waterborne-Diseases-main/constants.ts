
import { StateData, DistrictData, DiseaseData, SubDivisionData } from './types';

const generateDiseases = (): DiseaseData[] => [
  { id: '1', name: 'Diarrhea', affected: Math.floor(Math.random() * 50), trend: 'stable', lastUpdated: '2023-10-25' },
  { id: '2', name: 'Typhoid', affected: Math.floor(Math.random() * 30), trend: 'up', lastUpdated: '2023-10-25' },
  { id: '3', name: 'Cholera', affected: Math.floor(Math.random() * 20), trend: 'down', lastUpdated: '2023-10-25' },
  { id: '4', name: 'Hepatitis A', affected: Math.floor(Math.random() * 25), trend: 'stable', lastUpdated: '2023-10-25' },
];

const createDistricts = (names: string[]): DistrictData[] => {
  return names.map((name, index) => {
    const diseases = generateDiseases();
    const total = diseases.reduce((sum, d) => sum + d.affected, 0);
    return {
      id: `dist-${index}-${name.substring(0, 3)}`,
      name: name,
      diseases: diseases,
      totalAffected: total
    };
  });
};

// Arunachal Pradesh Detailed Data Structure
const AR_STRUCTURE: { district: string; subdivisions: { name: string; blocks: string[] }[] }[] = [
  {
    district: "Tawang",
    subdivisions: [
      { name: "Tawang", blocks: ["Kitpi", "Tawang", "Thingbu", "Mukto", "Zemithang"] },
      { name: "Lumla", blocks: ["Lumla"] },
      { name: "Jang", blocks: ["Jang"] }
    ]
  },
  {
    district: "West Kameng",
    subdivisions: [
      { name: "Bomdila", blocks: ["Dirang", "Kalaktang", "Nafra-Buragaon", "Thrizino", "Singchung"] },
      { name: "Dirang", blocks: ["Dirang", "Kalaktang"] },
      { name: "Thrizino", blocks: ["Thrizino", "Singchung"] }
      // Nafra moved to Bichom
    ]
  },
  {
    district: "East Kameng",
    subdivisions: [
      { name: "Seppa (Sadar)", blocks: ["Bameng", "Seppa", "Bana", "Khenewa", "Sawa"] },
      { name: "Bameng", blocks: ["Bameng", "Pipu", "Lada"] },
      { name: "Chayangtajo", blocks: ["Chayangtajo", "Gyawe Purang", "Richukrong"] }
    ]
  },
  {
    district: "Papum Pare",
    subdivisions: [
      { name: "Balijan", blocks: ["Balijan"] },
      { name: "Doimukh", blocks: ["Doimukh"] },
      { name: "Kimin", blocks: ["Kimin"] },
      { name: "Sagalee", blocks: ["Sagalee"] },
      { name: "Capital Area", blocks: ["Borum", "Mengio"] }
    ]
  },
  {
    district: "Kurung Kumey",
    subdivisions: [
      { name: "Koloriang", blocks: ["Koloriang", "Parsiparlo", "Sangram"] },
      { name: "Nyapin", blocks: ["Nyapin", "Phassang"] },
      { name: "Damin", blocks: ["Damin", "Sarli"] }
    ]
  },
  {
    district: "Kra Daadi",
    subdivisions: [
      { name: "Palin", blocks: ["Palin"] },
      { name: "Tali", blocks: ["Tali"] },
      { name: "Chambang", blocks: ["Chambang"] },
      { name: "Pipsorang", blocks: ["Pipsorang"] },
      { name: "Yangte", blocks: ["Yangte"] },
      { name: "Gangte", blocks: ["Gangte"] },
      { name: "Tarak Langdi", blocks: ["Tarak Langdi"] }
    ]
  },
  {
    district: "Lower Subansiri",
    subdivisions: [
      { name: "Ziro-I", blocks: ["Ziro-I"] },
      { name: "Ziro-II", blocks: ["Ziro-II"] }
    ]
  },
  {
    district: "Upper Subansiri",
    subdivisions: [
      { name: "Daporijo", blocks: ["Daporijo", "Baririjo", "Giba", "Dumporijo"] },
      { name: "Nacho", blocks: ["Nacho"] },
      { name: "Limeking", blocks: ["Limeking"] },
      { name: "Other Circles", blocks: ["Siyum", "Chetam", "Taliha", "Payeng", "Taksing"] }
    ]
  },
  {
    district: "West Siang",
    subdivisions: [
      { name: "Aalo", blocks: ["Aalo East", "Aalo West", "Liromoba", "Bagra", "Darak", "Kamba", "Yomcha", "Gensi", "Jomlo Mobuk"] }
    ]
  },
  {
    district: "East Siang",
    subdivisions: [
      { name: "Pasighat", blocks: ["Pasighat"] },
      { name: "Ruksin", blocks: ["Ruksin"] },
      { name: "Mebo", blocks: ["Mebo"] }
    ]
  },
  {
    district: "Siang",
    subdivisions: [
      { name: "Boleng", blocks: ["Boleng"] },
      { name: "Pangin", blocks: ["Pangin"] },
      { name: "Rumgong", blocks: ["Rumgong"] },
      { name: "Kaying", blocks: ["Kaying"] }
    ]
  },
  {
    district: "Upper Siang",
    subdivisions: [
      { name: "Yingkiong", blocks: ["Yingkiong", "Jengging"] },
      { name: "Mariyang", blocks: ["Mariyang", "Geku", "Katan", "Mopom"] },
      { name: "Tuting", blocks: ["Tuting", "Gelling", "Singa", "Palling", "Migging"] }
    ]
  },
  {
    district: "Lower Siang",
    subdivisions: [
      { name: "Gensi", blocks: ["Gensi"] },
      { name: "Kangku", blocks: ["Kangku"] },
      { name: "Likabali", blocks: ["Likabali"] },
      { name: "Ramle Bango", blocks: ["Ramle Bango"] }
    ]
  },
  {
    district: "Lower Dibang Valley",
    subdivisions: [
      { name: "Roing", blocks: ["Roing", "Koronu"] },
      { name: "Parbuk", blocks: ["Parbuk"] },
      { name: "Hunli", blocks: ["Hunli", "Desali"] },
      { name: "Dambuk", blocks: ["Dambuk", "Paglam"] }
    ]
  },
  {
    district: "Dibang Valley",
    subdivisions: [
      { name: "Anini", blocks: ["Mipi-Anini-Alinye", "Etalin-Malinye", "Anelih-Arzoo"] }
    ]
  },
  {
    district: "Anjaw",
    subdivisions: [
      { name: "Hawai", blocks: ["Hawai-Walong"] },
      { name: "Hayuliang", blocks: ["Hayuliang-Goiliang"] },
      { name: "Chaglagam", blocks: ["Chaglagam"] },
      { name: "Manchal", blocks: ["Manchal"] }
    ]
  },
  {
    district: "Lohit",
    subdivisions: [
      { name: "Sunpura", blocks: ["Sunpura"] },
      { name: "Tezu", blocks: ["Tezu"] },
      { name: "Wakro", blocks: ["Wakro"] },
      { name: "Lathao", blocks: ["Lathao"] },
      { name: "Chongkham", blocks: ["Chongkham"] },
      { name: "Lekang", blocks: ["Lekang"] },
      { name: "Piyong", blocks: ["Piyong"] }
    ]
  },
  {
    district: "Namsai",
    subdivisions: [
      { name: "Namsai", blocks: ["Namsai"] },
      { name: "Lekang", blocks: ["Lekang"] },
      { name: "Chongkham", blocks: ["Chongkham"] }
    ]
  },
  {
    district: "Changlang",
    subdivisions: [
      { name: "Changlang", blocks: ["Changlang", "Yatdam", "Khimiyang"] },
      { name: "Miao", blocks: ["Khagam-Miao", "Vijoynagar"] },
      { name: "Jairampur", blocks: ["Nampong", "Manmao"] },
      { name: "Bordumsa", blocks: ["Bordumsa", "Diyun"] }
    ]
  },
  {
    district: "Tirap",
    subdivisions: [
      { name: "Khonsa", blocks: ["Khonsa"] },
      { name: "Deomali", blocks: ["Namsang", "Lazu", "Dadam", "Borduria", "Khonsa Block"] }
    ]
  },
  {
    district: "Longding",
    subdivisions: [
      { name: "Longding", blocks: ["Longding", "Kanubari", "Lawnu", "Wakka", "Pongchau", "Niausa"] }
    ]
  },
  {
    district: "Kamle",
    subdivisions: [
      { name: "Raga", blocks: ["Puchi Geko"] },
      { name: "Dollungmukh", blocks: ["Puchi Geko"] },
      { name: "Kamporijo", blocks: ["Tamen-Raga"] }
    ]
  },
  {
    district: "Pakke-Kessang",
    subdivisions: [
      { name: "Pakke-Kessang", blocks: ["Pakke-Kessang Block"] },
      { name: "Seijosa", blocks: ["Seijosa Block"] }
    ]
  },
  {
    district: "Shi Yomi",
    subdivisions: [
      { name: "Menchukha", blocks: ["Menchukha", "Tato"] },
      { name: "Monigong", blocks: ["Monigong", "Pidi"] }
    ]
  },
  {
    district: "Lepa Rada",
    subdivisions: [
      { name: "Basar", blocks: ["Basar"] },
      { name: "Daring", blocks: ["Daring"] },
      { name: "Sago", blocks: ["Sago"] },
      { name: "Tirbin", blocks: ["Tirbin"] }
    ]
  },
  {
    district: "Keyi Panyor",
    subdivisions: [
      { name: "Yachuli", blocks: ["Deed", "Pistana", "Yachuli", "Yazali"] }
    ]
  },
  {
    district: "Bichom",
    subdivisions: [
      { name: "Nafra", blocks: ["Nafra", "Khizing", "Prithivnagar"] },
      { name: "Lada", blocks: ["Lada", "Pichang"] }
    ]
  }
];

const createArunachalDistricts = (): DistrictData[] => {
  return AR_STRUCTURE.map((data, index) => {
     const diseases = generateDiseases().map(d => ({
       ...d,
       affected: 0,
       trend: 'stable' as const
     }));
     
     const total = 0;
     
     return {
       id: `ar-dist-${index}`,
       name: data.district,
       diseases: diseases,
       totalAffected: total,
       subDivisions: data.subdivisions.map(sub => ({
         name: sub.name,
         blocks: sub.blocks.map(b => ({ name: b }))
       }))
     };
  });
};

// NE States District Lists (Other States)
const AS_DISTRICTS = [
  "Tinsukia", "Dibrugarh", "Charaideo", "Sivasagar", "Jorhat", "Majuli", "Golaghat", "Karbi Anglong",
  "West Karbi Anglong", "Dima Hasao", "Cachar", "Hailakandi", "Karimganj", "Dhubri", "South Salmara-Mankachar",
  "Goalpara", "Barpeta", "Nalbari", "Baksa", "Chirang", "Bongaigaon", "Kokrajhar", "Kamrup Metro", "Kamrup",
  "Rangia", "Morigaon", "Nagaon", "Hojai", "Sonitpur", "Biswanath", "Udalguri", "Darrang", "Tamulpur",
  "Lakhimpur", "Dhemaji"
];

const MN_DISTRICTS = [
  "Imphal East", "Imphal West", "Thoubal", "Kakching", "Bishnupur", "Churachandpur", "Pherzawl", "Senapati",
  "Kangpokpi", "Ukhrul", "Kamjong", "Chandel", "Tengnoupal", "Tamenglong", "Noney", "Jiribam"
];

const ML_DISTRICTS = [
  "East Khasi Hills", "West Khasi Hills", "South West Khasi Hills", "Ri-Bhoi", "West Jaintia Hills",
  "East Jaintia Hills", "East Garo Hills", "West Garo Hills", "South West Garo Hills", "North Garo Hills",
  "South Garo Hills", "Eastern West Khasi Hills"
];

const MZ_DISTRICTS = [
  "Aizawl", "Lunglei", "Saiha (Siaha)", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit",
  "Hnahthial", "Khawzawl", "Saitual"
];

const NL_DISTRICTS = [
  "Dimapur", "Kohima", "Mokokchung", "Wokha", "Zunheboto", "Tuensang", "Mon", "Phek", "Kiphire",
  "Longleng", "Peren", "Noklak", "Tseminyu", "Chümoukedima", "Niuland", "Shamator"
];

const SK_DISTRICTS = [
  "Gangtok", "Pakyong", "Gyalshing", "Soreng", "Namchi", "Mangan"
];

const TR_DISTRICTS = [
  "West Tripura", "Sepahijala", "Khowai", "Gomati", "South Tripura", "Dhalai", "Unakoti", "North Tripura"
];

// Map of NE state IDs to their districts
const NE_STATE_DISTRICTS: Record<string, string[]> = {
  "AS": AS_DISTRICTS,
  "MN": MN_DISTRICTS,
  "ML": ML_DISTRICTS,
  "MZ": MZ_DISTRICTS,
  "NL": NL_DISTRICTS,
  "SK": SK_DISTRICTS,
  "TR": TR_DISTRICTS
};


// Initial Mock Data
export const INITIAL_STATE_DATA: StateData[] = [
  {
    id: 'MH',
    name: 'Maharashtra',
    totalAffected: 1250,
    diseases: [
      { id: '1', name: 'Diarrhea', affected: 450, trend: 'up', lastUpdated: '2023-10-25' },
      { id: '2', name: 'Typhoid', affected: 300, trend: 'stable', lastUpdated: '2023-10-24' },
      { id: '3', name: 'Cholera', affected: 150, trend: 'down', lastUpdated: '2023-10-20' },
      { id: '4', name: 'Hepatitis A', affected: 350, trend: 'up', lastUpdated: '2023-10-26' },
    ]
  },
  {
    id: 'DL',
    name: 'Delhi',
    totalAffected: 1200,
    diseases: [
      { id: '1', name: 'Diarrhea', affected: 300, trend: 'down', lastUpdated: '2023-10-25' },
      { id: '2', name: 'Typhoid', affected: 400, trend: 'up', lastUpdated: '2023-10-25' },
      { id: '3', name: 'Cholera', affected: 210, trend: 'stable', lastUpdated: '2023-10-25' },
      { id: '4', name: 'Hepatitis A', affected: 290, trend: 'up', lastUpdated: '2023-10-25' },
    ]
  }
];

export const getAllStates = (): StateData[] => {
  // Expanded list of states with IDs matching the SVG map
  const stateNames = [
    { name: "Andhra Pradesh", id: "AP" },
    { name: "Arunachal Pradesh", id: "AR" },
    { name: "Assam", id: "AS" },
    { name: "Bihar", id: "BR" },
    { name: "Chhattisgarh", id: "CT" },
    { name: "Goa", id: "GA" },
    { name: "Gujarat", id: "GJ" },
    { name: "Haryana", id: "HR" },
    { name: "Himachal Pradesh", id: "HP" },
    { name: "Jharkhand", id: "JH" },
    { name: "Kerala", id: "KL" },
    { name: "Madhya Pradesh", id: "MP" },
    { name: "Manipur", id: "MN" },
    { name: "Meghalaya", id: "ML" },
    { name: "Mizoram", id: "MZ" },
    { name: "Nagaland", id: "NL" },
    { name: "Punjab", id: "PB" },
    { name: "Rajasthan", id: "RJ" },
    { name: "Sikkim", id: "SK" },
    { name: "Telangana", id: "TG" },
    { name: "Tripura", id: "TR" },
    { name: "Uttar Pradesh", id: "UP" },
    { name: "Uttarakhand", id: "UT" },
    { name: "West Bengal", id: "WB" },
    { name: "Jammu & Kashmir", id: "JK" },
    { name: "Ladakh", id: "LA" },
    { name: "Odisha", id: "OD" },
    { name: "Karnataka", id: "KA" },
    { name: "Tamil Nadu", id: "TN" }
  ];

  const otherStates: StateData[] = stateNames.map((s) => {
    let districts: DistrictData[] | undefined;

    // Logic for fetching districts
    if (s.id === "AR") {
      districts = createArunachalDistricts();
    } else if (NE_STATE_DISTRICTS[s.id]) {
      districts = createDistricts(NE_STATE_DISTRICTS[s.id]);
    }
    
    let totalAffected = 0;
    let diseases = generateDiseases();

    if (districts) {
      totalAffected = districts.reduce((acc, d) => acc + d.totalAffected, 0);
      // Aggregate district diseases for state level view
      const aggDiseases: Record<string, number> = {};
      districts.forEach(d => {
        d.diseases.forEach(dis => {
          aggDiseases[dis.name] = (aggDiseases[dis.name] || 0) + dis.affected;
        });
      });
      diseases = Object.entries(aggDiseases).map(([name, val], idx) => ({
        id: idx.toString(),
        name,
        affected: val,
        trend: 'stable',
        lastUpdated: '2023-10-25'
      }));
    } else {
      totalAffected = Math.floor(Math.random() * 800) + 50;
      diseases = [
        { id: '1', name: 'Diarrhea', affected: Math.floor(Math.random() * 300), trend: 'stable', lastUpdated: '2023-10-01' },
        { id: '2', name: 'Typhoid', affected: Math.floor(Math.random() * 200), trend: 'up', lastUpdated: '2023-10-01' },
        { id: '3', name: 'Cholera', affected: Math.floor(Math.random() * 100), trend: 'down', lastUpdated: '2023-10-01' },
        { id: '4', name: 'Hepatitis A', affected: Math.floor(Math.random() * 150), trend: 'stable', lastUpdated: '2023-10-01' },
      ];
    }

    return {
      id: s.id,
      name: s.name,
      totalAffected: totalAffected,
      diseases: diseases,
      districts: districts
    };
  });

  // Merge initial specific data with generated data
  const combined = [...otherStates];
  INITIAL_STATE_DATA.forEach(init => {
    const idx = combined.findIndex(c => c.id === init.id);
    if (idx !== -1 && !combined[idx].districts) {
      combined[idx] = { ...combined[idx], ...init };
    }
  });

  return combined.sort((a, b) => a.name.localeCompare(b.name));
};

// Realistic SVG Paths for India Map
export const INDIA_MAP_PATHS = [
  { id: "JK", name: "Jammu & Kashmir", d: "M232 50L245 45L260 55L250 75L230 70L220 60Z" },
  { id: "LA", name: "Ladakh", d: "M260 55L290 40L320 50L310 90L270 85L250 75Z" },
  { id: "HP", name: "Himachal Pradesh", d: "M250 75L270 85L265 105L245 100L240 80Z" },
  { id: "PB", name: "Punjab", d: "M220 80L240 80L245 100L225 110L210 90Z" },
  { id: "UT", name: "Uttarakhand", d: "M265 105L290 100L285 120L260 120Z" },
  { id: "HR", name: "Haryana", d: "M225 110L245 100L255 120L235 130Z" },
  { id: "DL", name: "Delhi", d: "M248 122L252 122L252 126L248 126Z" },
  { id: "RJ", name: "Rajasthan", d: "M180 120L225 110L235 130L245 140L220 180L170 160Z" },
  { id: "UP", name: "Uttar Pradesh", d: "M260 120L310 130L320 160L260 165L245 140Z" },
  { id: "BR", name: "Bihar", d: "M320 160L360 160L350 180L320 180Z" },
  { id: "SK", name: "Sikkim", d: "M360 145L375 145L375 155L360 155Z" },
  { id: "AR", name: "Arunachal Pradesh", d: "M380 130L440 120L430 150L390 150Z" },
  { id: "AS", name: "Assam", d: "M380 150L420 150L410 170L370 165Z" },
  { id: "NL", name: "Nagaland", d: "M420 150L430 160L420 175L410 170Z" },
  { id: "MN", name: "Manipur", d: "M410 170L420 175L415 195L405 185Z" },
  { id: "MZ", name: "Mizoram", d: "M405 185L415 195L405 215L395 205Z" },
  { id: "TR", name: "Tripura", d: "M385 185L395 185L395 195L385 195Z" },
  { id: "ML", name: "Meghalaya", d: "M370 165L390 165L390 175L370 175Z" },
  { id: "WB", name: "West Bengal", d: "M360 160L370 165L365 200L345 190Z" },
  { id: "JH", name: "Jharkhand", d: "M320 180L350 180L345 210L310 205Z" },
  { id: "OD", name: "Odisha", d: "M310 205L350 210L330 250L290 240Z" },
  { id: "CT", name: "Chhattisgarh", d: "M270 200L310 205L300 250L260 230Z" },
  { id: "MP", name: "Madhya Pradesh", d: "M220 180L270 170L310 205L260 230L220 210Z" },
  { id: "GJ", name: "Gujarat", d: "M140 170L180 160L220 180L220 210L180 220L140 200Z" },
  { id: "MH", name: "Maharashtra", d: "M180 220L260 230L250 280L200 290L170 250Z" },
  { id: "TG", name: "Telangana", d: "M250 250L290 240L280 290L250 280Z" },
  { id: "AP", name: "Andhra Pradesh", d: "M280 290L330 250L300 320L260 320Z" },
  { id: "KA", name: "Karnataka", d: "M200 290L250 280L240 340L190 330Z" },
  { id: "GA", name: "Goa", d: "M190 310L200 310L200 315L190 315Z" },
  { id: "KL", name: "Kerala", d: "M210 340L230 340L235 390L215 380Z" },
  { id: "TN", name: "Tamil Nadu", d: "M230 340L260 320L260 380L240 390Z" }
];

export const INDIAN_CITIES_MAP: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Pasighat", "Ziro", "Bomdila", "Aalo", "Tezu", "Roing"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur", "Nagaon", "Tinsukia"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
  "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "Dwarka"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan", "Mandi"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane"],
  "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Kakching", "Ukhrul", "Bishnupur"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar", "Baghmara"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Siaha"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Mon"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Pakyong", "Soreng"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Ambassa", "Belonia"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida", "Ghaziabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"]
};

// List of NE States for Filtering
export const NE_STATES = [
  "Arunachal Pradesh", 
  "Assam", 
  "Manipur", 
  "Meghalaya", 
  "Mizoram", 
  "Nagaland", 
  "Sikkim", 
  "Tripura"
];
