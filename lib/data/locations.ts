export interface StateLocationData {
  [state: string]: {
    [district: string]: {
      [subDistrict: string]: string[];
    };
  };
}

export const INDIAN_LOCATIONS: StateLocationData = {
  "Uttar Pradesh": {
    "Lucknow": {
      "Malihabad": ["Kasmandi Kalan", "Saspan", "Nabipanah", "Datli", "Jindaur", "Dilawarnagar"],
      "Mohanlalganj": ["Mau", "Khujauli", "Sisendi", "Nagram", "Karora", "Jabreli"],
      "Bakshi Ka Talab": ["Itaunja", "Kathwara", "Asti", "Bargadi", "Bhaisamau", "Usarna"],
      "Sarojini Nagar": ["Amausi", "Banthra", "Gauri", "Natkur", "Piparsand"],
      "Lucknow Sadar": ["Chinhat", "Kakori", "Gosainganj", "Juggaur"]
    },
    "Barabanki": {
      "Fatehpur": ["Badosarai", "Belhara", "Mohammadpur", "Kinnur", "Rampur"],
      "Ram Sanehi Ghat": ["Bani Kodar", "Dariyabad", "Kotwa", "Subeha"],
      "Haidergarh": ["Trivediganj", "Pokhra", "Thakurpur", "Alapur"],
      "Nawabganj": ["Satrikh", "Rasauli", "Banki", "Masauli", "Zaidpur"],
      "Ramnagar": ["Mahadeva", "Suratganj", "Lalpur", "Dhanokhar"]
    },
    "Sitapur": {
      "Biswan": ["Manpur", "Bannaganj", "Shankarpur", "Kanduni"],
      "Laharpur": ["Keshawpur", "Parsada", "Rampur Mathura"],
      "Mahmudabad": ["Sakra", "Pehra", "Bari", "Sardaha"],
      "Sidhauli": ["Kalyanpur", "Ataria", "Manwa", "Bhandia"],
      "Misrikh": ["Machhrehta", "Pisawan", "Kullupur"]
    },
    "Varanasi": {
      "Pindra": ["Phulpur", "Mangari", "Sindhora", "Karkhiyaon"],
      "Rajatalab": ["Mirzamurad", "Kachhwa Road", "Rohanla", "Khabra"],
      "Varanasi Sadar": ["Shivpur", "Chiraigaon", "Kandwa", "Lohta"]
    },
    "Meerut": {
      "Mawana": ["Hastinapur", "Parikshitgarh", "Kithore", "Bahsuma"],
      "Sardhana": ["Daurala", "Lawar", "Karnawal", "Dabathwa"],
      "Meerut Sadar": ["Mohiuddinpur", "Jani", "Rohta", "Kharkhoda"]
    },
    "Agra": {
      "Fatehabad": ["Dauki", "Iradatnagar", "Barauli", "Kheragarh"],
      "Etmadpur": ["Khandauli", "Barhan", "Semra", "Dhanoli"],
      "Kheragarh": ["Saiyan", "Jagner", "Sikandra", "Bichpuri"]
    }
  },
  "Punjab": {
    "Ludhiana": {
      "Khanna": ["Alour", "Bulepur", "Daudpur", "Ikolaha", "Libra", "Ratanheri"],
      "Jagraon": ["Agwar Gujran", "Chimna", "Dalla", "Kaonke Kalan", "Swaddi Kalan"],
      "Samrala": ["Bondli", "Ghagwal", "Herian", "Manupur", "Otalan"],
      "Ludhiana East": ["Sahnewal", "Kohara", "Mundian Kalan", "Mattewara"],
      "Ludhiana West": ["Baddowal", "Mullanpur Dakha", "Ayali Kalan", "Barewal"]
    },
    "Amritsar": {
      "Ajnala": ["Chogawan", "Ramdas", "Gaggomahal", "Saurian"],
      "Baba Bakala": ["Rayya", "Beas", "Sathiala", "Khalchian"],
      "Majitha": ["Kathunangal", "Nag Kalan", "Sohian", "Tarsikka"]
    },
    "Bathinda": {
      "Talwandi Sabo": ["Raman", "Singean", "Maur Kalan", "Kot Shamir"],
      "Rampura Phul": ["Bhai Rupa", "Bhagta Bhaika", "Dialpura Bhai Ka", "Dhadde"],
      "Bathinda Rural": ["Goniana", "Bhucho Mandi", "Nathana", "Deon"]
    },
    "Patiala": {
      "Nabha": ["Bhadson", "Alhoran", "Rohti Chhanna", "Kakrala"],
      "Rajpura": ["Ghanaur", "Shambhu Kalan", "Jansua", "Neelpur"],
      "Samana": ["Patran", "Shutrana", "Ghulal", "Gajewas"]
    }
  },
  "Madhya Pradesh": {
    "Indore": {
      "Sanwer": ["Ajnod", "Chandrawatiganj", "Kshipra", "Panod", "Dhamnay"],
      "Depalpur": ["Betma", "Gautampura", "Jalod", "Runji", "Mhow"],
      "Mhow": ["Harsola", "Hasalpur", "Jamli", "Kodariya", "Manpur"]
    },
    "Ujjain": {
      "Badnagar": ["Ingoria", "Barnagar", "Mullapura", "Kharsod Kalan"],
      "Mahidpur": ["Jharda", "Nagalwadi", "Gogapur", "Khedakhajuria"],
      "Tarana": ["Kayatha", "Naranji", "Rupakhedi", "Kanardi"]
    },
    "Bhopal": {
      "Berasia": ["Nazirabad", "Dungariya", "Gungasi", "Lalariya"],
      "Huzur": ["Bairagarh Kalan", "Ratibad", "Bilas", "Phanda Kalan"]
    },
    "Sehore": {
      "Ashta": ["Jawar", "Kothri", "Pagaragaon", "Metwada"],
      "Budni": ["Rehti", "Baktara", "Jait", "Shahganj"],
      "Ichhawar": ["Divadiya", "Brijisnagar", "Lohari", "Girdhari"]
    }
  },
  "Maharashtra": {
    "Nashik": {
      "Niphad": ["Pimpalgaon Baswant", "Lasalgaon", "Ozar", "Kundewadi", "Saikheda"],
      "Dindori": ["Vani", "Janori", "Khedgaon", "Umrale", "Nanashi"],
      "Yeola": ["Andarsul", "Patoda", "Nagarsul", "Mukhed", "Rajaapur"],
      "Sinnar": ["Wavi", "Pandhurli", "Musgaon", "Naygaon", "Dapur"]
    },
    "Pune": {
      "Baramati": ["Malegaon Budruk", "Supe", "Gunawadi", "Pandare", "Morgaon"],
      "Shirur": ["Shikrapur", "Ranjangaon", "Mandavgan Pharata", "Pabal"],
      "Junnar": ["Otur", "Alephata", "Narayangaon", "Belhe", "Rajur"]
    },
    "Ahmednagar": {
      "Rahuri": ["Vambori", "Deolali Pravara", "Taharababad", "Baragaon Nandur"],
      "Shrirampur": ["Belapur", "Padhegaon", "Taklibhan", "Matapur"],
      "Sangamner": ["Ashwi", "Sakur", "Talegaon", "Ghulewadi"]
    }
  },
  "Rajasthan": {
    "Sri Ganganagar": {
      "Suratgarh": ["Rajiyasar", "Rangmahal", "Birdhwal", "Padampur Road"],
      "Padampur": ["Ghamurwali", "Ramsinghpur", "Gajsinghpur", "Dalpatpura"],
      "Raisinghnagar": ["Muklawa", "Somersar", "Dhamora", "Sameja Kothi"]
    },
    "Kota": {
      "Ladpura": ["Mandana", "Kasganj", "Dhaneshwar", "Ranpur"],
      "Digod": ["Sultanpur", "Relawan", "Tathed", "Gordhanpura"],
      "Sangod": ["Kanwas", "Bapawar Kalan", "Mawai", "Hingoniya"]
    },
    "Jaipur": {
      "Chomu": ["Morija", "Hastera", "Govindgarh", "Kaladera"],
      "Kotputli": ["Paota", "Bansur Road", "Kalyanpura", "Sukhlawasi"],
      "Bassi": ["Kanota", "Banskho", "Toonga", "Madhogarh"]
    }
  },
  "Haryana": {
    "Karnal": {
      "Gharaunda": ["Bastara", "Kohand", "Kaimla", "Chaura", "Arainpura"],
      "Nilokheri": ["Taraori", "Nigdhu", "Pujam", "Sawant"],
      "Indri": ["Kunjpura", "Bhadson", "Rambha", "Garhi Birbal"],
      "Assandh": ["Jalmana", "Salwan", "Pabnawa", "Jaisinghpura"]
    },
    "Kurukshetra": {
      "Thanesar": ["Pipli", "Amin", "Mirzapur", "Duda"],
      "Shahbad": ["Kharindwa", "Babain", "Tangore", "Jhansla"],
      "Pehowa": ["Ismailabad", "Saraswati Nagar", "Gumthala Garhu"]
    },
    "Hisar": {
      "Hansi": ["Bassi", "Sisai", "Dhana Kalan", "Khanda Kheri"],
      "Barwala": ["Panghal", "Khedar", "Daulatpur", "Sarsod"],
      "Narnaund": ["Baas", "Kheri Chopta", "Rajthal", "Moth"]
    }
  },
  "Gujarat": {
    "Anand": {
      "Anand": ["Mogri", "Karamsad", "Gamdi", "Bakrol", "Valasan"],
      "Borsad": ["Bhadran", "Anklav", "Vasad", "Bochasan", "Dharmaj"],
      "Petlad": ["Dharmaj", "Sunav", "Nar", "Bandhani", "Rangaipura"]
    },
    "Rajkot": {
      "Gondal": ["Bhadva", "Dharvala", "Kotda Sangani", "Moviya", "Gomta"],
      "Jetpur": ["Navagadh", "Pedhla", "Pithadiya", "Kagvad"],
      "Dhoraji": ["Chhatrasa", "Jamnavad", "Zanzmer", "Patanvav"]
    }
  },
  "Karnataka": {
    "Belagavi": {
      "Gokak": ["Konnur", "Koujalgi", "Mamdapur", "Shindikurbet"],
      "Chikodi": ["Nipani", "Sadalga", "Kerur", "Yadur"],
      "Athani": ["Kagwad", "Ainapur", "Shedbal", "Telsang"]
    },
    "Mysuru": {
      "Nanjangud": ["Hullahalli", "Hadinaru", "Kowlande", "Tagadur"],
      "Hunsur": ["Bilikere", "Gavadagere", "Kallahalli", "Dharmapura"]
    }
  }
};

export const getSupportedStates = (): string[] => {
  return Object.keys(INDIAN_LOCATIONS);
};

export const getDistrictsForState = (state: string): string[] => {
  if (!INDIAN_LOCATIONS[state]) return [];
  return Object.keys(INDIAN_LOCATIONS[state]);
};

export const getSubDistrictsForDistrict = (state: string, district: string): string[] => {
  if (!INDIAN_LOCATIONS[state] || !INDIAN_LOCATIONS[state][district]) return [];
  return Object.keys(INDIAN_LOCATIONS[state][district]);
};

export const getVillagesForSubDistrict = (
  state: string,
  district: string,
  subDistrict: string
): string[] => {
  if (
    !INDIAN_LOCATIONS[state] ||
    !INDIAN_LOCATIONS[state][district] ||
    !INDIAN_LOCATIONS[state][district][subDistrict]
  ) {
    return [];
  }
  return INDIAN_LOCATIONS[state][district][subDistrict];
};
