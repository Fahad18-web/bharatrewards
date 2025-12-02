const sampleWithoutReplacement = (items, count) => {
  const result = [];
  const used = new Set();
  while (result.length < count && used.size < items.length) {
    const index = Math.floor(Math.random() * items.length);
    if (used.has(index)) continue;
    used.add(index);
    result.push(items[index]);
  }
  return result;
};

const shuffle = (arr, seed = 1) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = seed % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const stateCapitals = [
  { state: 'Andhra Pradesh', capital: 'Amaravati', formation: 1953, speciality: 'Kuchipudi dance' },
  { state: 'Arunachal Pradesh', capital: 'Itanagar', formation: 1987, speciality: 'Dawn-lit mountains' },
  { state: 'Assam', capital: 'Dispur', formation: 1912, speciality: 'Bihu celebrations' },
  { state: 'Bihar', capital: 'Patna', formation: 1912, speciality: 'Nalanda ruins' },
  { state: 'Chhattisgarh', capital: 'Raipur', formation: 2000, speciality: 'Steel production' },
  { state: 'Goa', capital: 'Panaji', formation: 1961, speciality: 'Coastal heritage' },
  { state: 'Gujarat', capital: 'Gandhinagar', formation: 1960, speciality: 'Garba festival' },
  { state: 'Haryana', capital: 'Chandigarh', formation: 1966, speciality: 'Dairy excellence' },
  { state: 'Himachal Pradesh', capital: 'Shimla', formation: 1971, speciality: 'Apple orchards' },
  { state: 'Jharkhand', capital: 'Ranchi', formation: 2000, speciality: 'Mineral wealth' },
  { state: 'Karnataka', capital: 'Bengaluru', formation: 1956, speciality: 'Tech innovation' },
  { state: 'Kerala', capital: 'Thiruvananthapuram', formation: 1956, speciality: 'Backwater tourism' },
  { state: 'Madhya Pradesh', capital: 'Bhopal', formation: 1956, speciality: 'Khajuraho temples' },
  { state: 'Maharashtra', capital: 'Mumbai', formation: 1960, speciality: 'Financial hub' },
  { state: 'Manipur', capital: 'Imphal', formation: 1972, speciality: 'Pung cholom drums' },
  { state: 'Meghalaya', capital: 'Shillong', formation: 1972, speciality: 'Living root bridges' },
  { state: 'Mizoram', capital: 'Aizawl', formation: 1987, speciality: 'Bamboo dance' },
  { state: 'Nagaland', capital: 'Kohima', formation: 1963, speciality: 'Hornbill festival' },
  { state: 'Odisha', capital: 'Bhubaneswar', formation: 1936, speciality: 'Sand art' },
  { state: 'Punjab', capital: 'Chandigarh', formation: 1966, speciality: 'Gurbani music' },
  { state: 'Rajasthan', capital: 'Jaipur', formation: 1956, speciality: 'Desert forts' },
  { state: 'Sikkim', capital: 'Gangtok', formation: 1975, speciality: 'Organic farming' },
  { state: 'Tamil Nadu', capital: 'Chennai', formation: 1956, speciality: 'Classical music' },
  { state: 'Telangana', capital: 'Hyderabad', formation: 2014, speciality: 'Pearl trade' },
  { state: 'Tripura', capital: 'Agartala', formation: 1972, speciality: 'Handloom craft' },
  { state: 'Uttar Pradesh', capital: 'Lucknow', formation: 1937, speciality: 'Awadhi cuisine' },
  { state: 'Uttarakhand', capital: 'Dehradun', formation: 2000, speciality: 'Char Dham routes' },
  { state: 'West Bengal', capital: 'Kolkata', formation: 1947, speciality: 'Literary heritage' },
  { state: 'Delhi', capital: 'New Delhi', formation: 1911, speciality: 'Seat of governance' },
  { state: 'Puducherry', capital: 'Puducherry', formation: 1963, speciality: 'French avenues' },
  { state: 'Jammu and Kashmir', capital: 'Srinagar', formation: 2019, speciality: 'Saffron fields' },
  { state: 'Ladakh', capital: 'Leh', formation: 2019, speciality: 'High-altitude culture' },
  { state: 'Andaman and Nicobar Islands', capital: 'Port Blair', formation: 1956, speciality: 'Coral diversity' },
  { state: 'Chandigarh', capital: 'Chandigarh', formation: 1966, speciality: 'Modernist architecture' },
  { state: 'Lakshadweep', capital: 'Kavaratti', formation: 1956, speciality: 'Atoll ecology' },
  { state: 'Dadra and Nagar Haveli and Daman and Diu', capital: 'Daman', formation: 2020, speciality: 'Coastal forts' }
];

const danceForms = [
  { dance: 'Bharatanatyam', state: 'Tamil Nadu' },
  { dance: 'Kathak', state: 'Uttar Pradesh' },
  { dance: 'Kathakali', state: 'Kerala' },
  { dance: 'Kuchipudi', state: 'Andhra Pradesh' },
  { dance: 'Odissi', state: 'Odisha' },
  { dance: 'Manipuri', state: 'Manipur' },
  { dance: 'Mohiniyattam', state: 'Kerala' },
  { dance: 'Sattriya', state: 'Assam' },
  { dance: 'Bhangra', state: 'Punjab' },
  { dance: 'Ghoomar', state: 'Rajasthan' },
  { dance: 'Garba', state: 'Gujarat' },
  { dance: 'Lavani', state: 'Maharashtra' },
  { dance: 'Yakshagana', state: 'Karnataka' },
  { dance: 'Thang-Ta', state: 'Manipur' },
  { dance: 'Rouff', state: 'Jammu and Kashmir' },
  { dance: 'Chhau', state: 'West Bengal' },
  { dance: 'Kalbelia', state: 'Rajasthan' },
  { dance: 'Bihu', state: 'Assam' },
  { dance: 'Karakattam', state: 'Tamil Nadu' },
  { dance: 'Dollu Kunitha', state: 'Karnataka' }
];

const festivals = [
  { name: 'Pongal', month: 'January', focus: 'Harvest' },
  { name: 'Baisakhi', month: 'April', focus: 'Harvest' },
  { name: 'Onam', month: 'September', focus: 'Harvest' },
  { name: 'Durga Puja', month: 'October', focus: 'Goddess worship' },
  { name: 'Diwali', month: 'November', focus: 'Light over darkness' },
  { name: 'Holi', month: 'March', focus: 'Spring colors' },
  { name: 'Makar Sankranti', month: 'January', focus: 'Sun transition' },
  { name: 'Lohri', month: 'January', focus: 'Winter bonfire' },
  { name: 'Eid al-Fitr', month: 'Varies', focus: 'Ramadan completion' },
  { name: 'Eid al-Adha', month: 'Varies', focus: 'Sacrifice' },
  { name: 'Guru Nanak Jayanti', month: 'November', focus: 'Sikh teachings' },
  { name: 'Christmas', month: 'December', focus: 'Nativity' },
  { name: 'Ganesh Chaturthi', month: 'September', focus: 'Ganesha' },
  { name: 'Janmashtami', month: 'August', focus: 'Krishna birth' },
  { name: 'Bihu', month: 'April', focus: 'Assamese new year' },
  { name: 'Navroz', month: 'March', focus: 'Parsi new year' },
  { name: 'Hornbill Festival', month: 'December', focus: 'Naga heritage' },
  { name: 'Losar', month: 'February', focus: 'Tibetan new year' },
  { name: 'Thrissur Pooram', month: 'May', focus: 'Temple procession' },
  { name: 'Desert Festival', month: 'February', focus: 'Marwar culture' }
];

const monuments = [
  { name: 'Taj Mahal', location: 'Agra', era: '17th century' },
  { name: 'Red Fort', location: 'Delhi', era: '17th century' },
  { name: 'Qutub Minar', location: 'Delhi', era: '12th century' },
  { name: 'Hawa Mahal', location: 'Jaipur', era: '18th century' },
  { name: 'Charminar', location: 'Hyderabad', era: '16th century' },
  { name: 'Konark Sun Temple', location: 'Puri', era: '13th century' },
  { name: 'Gateway of India', location: 'Mumbai', era: '20th century' },
  { name: 'Sanchi Stupa', location: 'Sanchi', era: '3rd century BCE' },
  { name: 'Victoria Memorial', location: 'Kolkata', era: '20th century' },
  { name: 'Golconda Fort', location: 'Hyderabad', era: '16th century' },
  { name: 'India Gate', location: 'Delhi', era: '20th century' },
  { name: 'Amber Fort', location: 'Jaipur', era: '16th century' },
  { name: 'Sanchi Toranas', location: 'Sanchi', era: '1st century BCE' },
  { name: 'Fatehpur Sikri', location: 'Agra', era: '16th century' },
  { name: 'Meenakshi Temple', location: 'Madurai', era: '17th century' },
  { name: 'Brihadeeswarar Temple', location: 'Thanjavur', era: '11th century' },
  { name: 'Humayun Tomb', location: 'Delhi', era: '16th century' },
  { name: 'Lotus Temple', location: 'Delhi', era: '20th century' },
  { name: 'Jantar Mantar', location: 'Jaipur', era: '18th century' },
  { name: 'Gol Gumbaz', location: 'Bijapur', era: '17th century' }
];

const rivers = [
  { name: 'Ganga', origin: 'Gangotri Glacier', meets: 'Bay of Bengal' },
  { name: 'Yamuna', origin: 'Yamunotri Glacier', meets: 'Ganga at Prayagraj' },
  { name: 'Brahmaputra', origin: 'Angsi Glacier', meets: 'Bay of Bengal' },
  { name: 'Godavari', origin: 'Trimbakeshwar', meets: 'Bay of Bengal' },
  { name: 'Krishna', origin: 'Mahabaleshwar', meets: 'Bay of Bengal' },
  { name: 'Cauvery', origin: 'Talakaveri', meets: 'Bay of Bengal' },
  { name: 'Narmada', origin: 'Amarkantak', meets: 'Arabian Sea' },
  { name: 'Tapti', origin: 'Satpura ranges', meets: 'Arabian Sea' },
  { name: 'Mahanadi', origin: 'Sihawa hills', meets: 'Bay of Bengal' },
  { name: 'Sutlej', origin: 'Lake Rakshastal', meets: 'Indus River' },
  { name: 'Beas', origin: 'Rohtang Pass', meets: 'Sutlej River' },
  { name: 'Chenab', origin: 'Baralacha Pass', meets: 'Indus River' },
  { name: 'Jhelum', origin: 'Verinag', meets: 'Indus River' },
  { name: 'Sabarmati', origin: 'Aravalli hills', meets: 'Arabian Sea' },
  { name: 'Periyar', origin: 'Western Ghats', meets: 'Arabian Sea' }
];

const freedomEvents = [
  { event: 'Non-Cooperation Movement', year: 1920, leader: 'Mahatma Gandhi' },
  { event: 'Civil Disobedience', year: 1930, leader: 'Mahatma Gandhi' },
  { event: 'Quit India Movement', year: 1942, leader: 'Mahatma Gandhi' },
  { event: 'Swadeshi Movement', year: 1905, leader: 'Bal Gangadhar Tilak' },
  { event: 'Khilafat Movement', year: 1919, leader: 'Maulana Azad' },
  { event: 'Ghadar Movement', year: 1913, leader: 'Lala Hardayal' },
  { event: 'Dandi March', year: 1930, leader: 'Mahatma Gandhi' },
  { event: 'Azad Hind Fauj', year: 1943, leader: 'Subhas Chandra Bose' },
  { event: 'Jallianwala Bagh Protest', year: 1919, leader: 'Local leaders' },
  { event: 'Chauri Chaura Incident', year: 1922, leader: 'Local protesters' },
  { event: 'Kakori Train Action', year: 1925, leader: 'Ram Prasad Bismil' },
  { event: 'Simon Commission Protest', year: 1928, leader: 'Lala Lajpat Rai' },
  { event: 'Poona Pact', year: 1932, leader: 'B. R. Ambedkar' },
  { event: 'Lucknow Pact', year: 1916, leader: 'All India Congress' },
  { event: 'Champaran Satyagraha', year: 1917, leader: 'Mahatma Gandhi' },
  { event: 'Kheda Satyagraha', year: 1918, leader: 'Mahatma Gandhi' },
  { event: 'Bardoli Satyagraha', year: 1928, leader: 'Vallabhbhai Patel' },
  { event: 'HSRA formation', year: 1928, leader: 'Chandrasekhar Azad' },
  { event: 'Royal Indian Navy Mutiny', year: 1946, leader: 'Naval ratings' },
  { event: 'Telangana Rebellion', year: 1946, leader: 'Communist cadres' }
];

const scienceMissions = [
  { mission: 'Chandrayaan-1', year: 2008, focus: 'Lunar water discovery' },
  { mission: 'Chandrayaan-2', year: 2019, focus: 'Lunar orbiter' },
  { mission: 'Chandrayaan-3', year: 2023, focus: 'Lunar south pole landing' },
  { mission: 'Mangalyaan', year: 2013, focus: 'Mars orbiter' },
  { mission: 'PSLV-C37', year: 2017, focus: '104 satellites launch' },
  { mission: 'RISAT-2B', year: 2019, focus: 'Radar imaging' },
  { mission: 'GSAT-11', year: 2018, focus: 'High throughput communication' },
  { mission: 'INSAT-3DR', year: 2016, focus: 'Meteorology' },
  { mission: 'NavIC', year: 2018, focus: 'Regional navigation' },
  { mission: 'Aditya-L1', year: 2023, focus: 'Solar observatory' },
  { mission: 'Gaganyaan', year: 2025, focus: 'Crewed test prep' },
  { mission: 'Cartosat-3', year: 2019, focus: 'High resolution imaging' },
  { mission: 'Oceansat-3', year: 2022, focus: 'Ocean monitoring' },
  { mission: 'SSLV-D2', year: 2023, focus: 'Small satellite launch' },
  { mission: 'Pragyan Rover', year: 2023, focus: 'Lunar rover science' }
];

const sportsLegends = [
  { athlete: 'Sachin Tendulkar', sport: 'Cricket', highlight: '100 international centuries' },
  { athlete: 'Mary Kom', sport: 'Boxing', highlight: 'Six world titles' },
  { athlete: 'PV Sindhu', sport: 'Badminton', highlight: 'Olympic silver' },
  { athlete: 'Neeraj Chopra', sport: 'Javelin Throw', highlight: 'Tokyo 2020 gold' },
  { athlete: 'Abhinav Bindra', sport: 'Shooting', highlight: 'Olympic gold 2008' },
  { athlete: 'Viswanathan Anand', sport: 'Chess', highlight: 'Five-time world champion' },
  { athlete: 'Saina Nehwal', sport: 'Badminton', highlight: 'Olympic bronze 2012' },
  { athlete: 'Mithali Raj', sport: 'Cricket', highlight: 'Highest ODI runs' },
  { athlete: 'Sunil Chhetri', sport: 'Football', highlight: 'Indian top scorer' },
  { athlete: 'Leander Paes', sport: 'Tennis', highlight: 'Olympic bronze 1996' },
  { athlete: 'Bajrang Punia', sport: 'Wrestling', highlight: 'Olympic bronze 2020' },
  { athlete: 'Hima Das', sport: 'Athletics', highlight: 'World U20 gold' },
  { athlete: 'Anju Bobby George', sport: 'Athletics', highlight: 'World bronze 2003' },
  { athlete: 'Balbir Singh Sr.', sport: 'Hockey', highlight: 'Triple Olympic gold' },
  { athlete: 'Pankaj Advani', sport: 'Billiards', highlight: 'Multiple IBSF titles' },
  { athlete: 'Dipa Karmakar', sport: 'Gymnastics', highlight: 'Produnova vault' },
  { athlete: 'Lovlina Borgohain', sport: 'Boxing', highlight: 'Olympic bronze 2020' },
  { athlete: 'Sardar Singh', sport: 'Hockey', highlight: 'Captaincy excellence' },
  { athlete: 'Kidambi Srikanth', sport: 'Badminton', highlight: 'World No.1 ranking' },
  { athlete: 'Vinesh Phogat', sport: 'Wrestling', highlight: 'Commonwealth gold' }
];

const unescoSites = [
  { site: 'Kaziranga National Park', state: 'Assam', feature: 'One-horned rhinos' },
  { site: 'Keoladeo National Park', state: 'Rajasthan', feature: 'Avian diversity' },
  { site: 'Manas Wildlife Sanctuary', state: 'Assam', feature: 'Tiger reserve' },
  { site: 'Western Ghats', state: 'Multiple States', feature: 'Biodiversity hotspot' },
  { site: 'Sundarbans', state: 'West Bengal', feature: 'Mangrove forest' },
  { site: 'Great Himalayan National Park', state: 'Himachal Pradesh', feature: 'Alpine ecosystems' },
  { site: 'Nanda Devi & Valley of Flowers', state: 'Uttarakhand', feature: 'Highland flora' },
  { site: 'Rani Ki Vav', state: 'Gujarat', feature: 'Stepwell art' },
  { site: 'Hill Forts of Rajasthan', state: 'Rajasthan', feature: 'Rajput military hill forts' },
  { site: 'Qutub Minar Complex', state: 'Delhi', feature: 'Early Indo-Islamic architecture' },
  { site: 'Elephanta Caves', state: 'Maharashtra', feature: 'Rock-cut sculptures' },
  { site: 'Ajanta Caves', state: 'Maharashtra', feature: 'Buddhist murals' },
  { site: 'Ellora Caves', state: 'Maharashtra', feature: 'Rock-cut temples' },
  { site: 'Mahabodhi Temple', state: 'Bihar', feature: 'Buddha enlightenment site' },
  { site: 'Chola Temples', state: 'Tamil Nadu', feature: 'Dravidian architecture' },
  { site: 'Khajuraho Group of Monuments', state: 'Madhya Pradesh', feature: 'Sculptural art' },
  { site: 'Capitol Complex Chandigarh', state: 'Chandigarh', feature: 'Modernist civic design' },
  { site: 'Victorian Gothic & Art Deco Ensemble', state: 'Maharashtra', feature: 'Colonial-era skyline' },
  { site: 'Kumbhalgarh Fort', state: 'Rajasthan', feature: 'Second longest wall' },
  { site: 'Shanti Stupa Leh', state: 'Ladakh', feature: 'Peace pagoda' }
];

const mountainPeaks = [
  { peak: 'Kangchenjunga', state: 'Sikkim', height: '8586 m' },
  { peak: 'Nanda Devi', state: 'Uttarakhand', height: '7816 m' },
  { peak: 'Kamet', state: 'Uttarakhand', height: '7756 m' },
  { peak: 'Saltoro Kangri', state: 'Ladakh', height: '7742 m' },
  { peak: 'Saser Kangri', state: 'Ladakh', height: '7672 m' },
  { peak: 'Trisul', state: 'Uttarakhand', height: '7120 m' },
  { peak: 'Anamudi', state: 'Kerala', height: '2695 m' },
  { peak: 'Dodabetta', state: 'Tamil Nadu', height: '2637 m' },
  { peak: 'Guru Shikhar', state: 'Rajasthan', height: '1722 m' },
  { peak: 'Kalsubai', state: 'Maharashtra', height: '1646 m' },
  { peak: 'Arma Konda', state: 'Andhra Pradesh', height: '1680 m' },
  { peak: 'Mahendragiri', state: 'Odisha', height: '1501 m' },
  { peak: 'Doddabetta', state: 'Tamil Nadu', height: '2637 m' },
  { peak: 'Mount Abu', state: 'Rajasthan', height: '1722 m' },
  { peak: 'Phawngpui', state: 'Mizoram', height: '2157 m' }
];

const literatureAwards = [
  { author: 'Rabindranath Tagore', work: 'Gitanjali', year: 1913 },
  { author: 'R. K. Narayan', work: 'Malgudi Days', year: 1958 },
  { author: 'Amrita Pritam', work: 'Pinjar', year: 1964 },
  { author: 'Shivani', work: 'Krishnakali', year: 1964 },
  { author: 'Mahadevi Varma', work: 'Yama', year: 1934 },
  { author: 'U. R. Ananthamurthy', work: 'Samskara', year: 1960 },
  { author: 'Salman Rushdie', work: 'Midnight Children', year: 1980 },
  { author: 'Arundhati Roy', work: 'The God of Small Things', year: 1997 },
  { author: 'Jhumpa Lahiri', work: 'Interpreter of Maladies', year: 1999 },
  { author: 'Kiran Desai', work: 'The Inheritance of Loss', year: 2006 },
  { author: 'Vikram Seth', work: 'A Suitable Boy', year: 1993 },
  { author: 'Ruskin Bond', work: 'The Blue Umbrella', year: 1974 },
  { author: 'Anita Desai', work: 'Clear Light of Day', year: 1980 },
  { author: 'Devdutt Pattanaik', work: 'Jaya', year: 2010 },
  { author: 'Chitra Banerjee Divakaruni', work: 'Palace of Illusions', year: 2008 }
];

const economicFacts = [
  { sector: 'Information Technology', hub: 'Bengaluru', share: '8% GDP impact' },
  { sector: 'Automobile Manufacturing', hub: 'Chennai', share: '35% commercial vehicles' },
  { sector: 'Diamond Cutting', hub: 'Surat', share: '90% global supply' },
  { sector: 'Pharmaceuticals', hub: 'Hyderabad', share: 'India Pharma capital' },
  { sector: 'Textiles', hub: 'Tiruppur', share: 'Cotton knitwear hub' },
  { sector: 'Tea Production', hub: 'Assam', share: 'Largest tea gardens' },
  { sector: 'Spice Trade', hub: 'Kochi', share: 'Major spice export' },
  { sector: 'Leather Goods', hub: 'Kanpur', share: 'Traditional tanneries' },
  { sector: 'Handicrafts', hub: 'Jaipur', share: 'Gemstone polishing' },
  { sector: 'Cinema', hub: 'Mumbai', share: 'Bollywood base' },
  { sector: 'Start-up Ecosystem', hub: 'Gurugram', share: 'Enterprise tech' },
  { sector: 'Renewable Energy', hub: 'Jaisalmer', share: 'Wind farms' },
  { sector: 'Ship Building', hub: 'Kochi', share: 'Cochin Shipyard' },
  { sector: 'Petrochemicals', hub: 'Jamnagar', share: 'Largest refinery' },
  { sector: 'Financial Services', hub: 'Mumbai', share: 'NSE & BSE' },
  { sector: 'Jewellery', hub: 'Jaipur', share: 'Kundan craft' },
  { sector: 'Coffee Plantations', hub: 'Coorg', share: 'Arabica beans' },
  { sector: 'Tourism', hub: 'Goa', share: 'Coastal tourism' },
  { sector: 'Aerospace', hub: 'Bengaluru', share: 'HAL facilities' },
  { sector: 'Agritech', hub: 'Indore', share: 'Soybean processing' }
];

const createOptionsFromDataset = (dataset, key, correctValue, seed = 1) => {
  const options = new Set([correctValue]);
  let pointer = seed;
  while (options.size < 4) {
    const candidate = dataset[pointer % dataset.length][key];
    if (candidate && candidate !== correctValue) {
      options.add(candidate);
    }
    pointer += 1;
  }
  return shuffle([...options], seed);
};

const createYearOptions = (correctYear, seed = 1) => {
  const options = new Set([correctYear]);
  let offset = 1;
  while (options.size < 4) {
    const modifier = ((seed + offset) % 12) + 1;
    const candidate = correctYear + (offset % 2 === 0 ? modifier : -modifier);
    options.add(candidate);
    offset += 1;
  }
  return shuffle([...options].map(String), seed);
};

const generateMathQuestions = () => {
  const questions = [];
  let id = 1;

  // Helper to generate wrong options close to correct answer
  const generateMathOptions = (correctAnswer, seed = 1) => {
    const correct = Number(correctAnswer);
    const options = new Set([String(correct)]);
    
    // Generate plausible wrong answers
    const offsets = [1, 2, 3, 5, 10, -1, -2, -3, -5, -10, 11, -11, 4, -4];
    let pointer = seed;
    
    while (options.size < 4) {
      const offset = offsets[pointer % offsets.length];
      let wrongAnswer = correct + offset * (1 + (pointer % 3));
      
      // Ensure positive and different from correct
      if (wrongAnswer > 0 && wrongAnswer !== correct) {
        options.add(String(Math.round(wrongAnswer)));
      }
      pointer++;
      
      // Safety: prevent infinite loop
      if (pointer > 50) break;
    }
    
    // Fill remaining with random if needed
    while (options.size < 4) {
      const random = correct + Math.floor(Math.random() * 20) - 10;
      if (random > 0 && random !== correct) {
        options.add(String(random));
      }
    }
    
    return shuffle([...options], seed);
  };

  const push = (text, answer, seed) => {
    questions.push({
      id: `math-${id}`,
      type: 'MATH',
      questionText: text,
      correctAnswer: String(answer),
      options: generateMathOptions(answer, seed || id)
    });
    id += 1;
  };

  for (let a = 12; a <= 180 && questions.length < 180; a += 3) {
    for (let b = 5; b <= 45 && questions.length < 180; b += 4) {
      push(`What is ${a} + ${b}?`, a + b, a * b);
    }
  }

  for (let a = 250; a >= 90 && questions.length < 320; a -= 4) {
    for (let b = 25; b <= 80 && questions.length < 320; b += 5) {
      if (a - b > 0) {
        push(`Calculate ${a} - ${b}.`, a - b, a + b);
      }
    }
  }

  for (let a = 12; a <= 40 && questions.length < 420; a += 2) {
    for (let b = 3; b <= 12 && questions.length < 420; b += 3) {
      push(`Multiply ${a} × ${b}.`, a * b, a + b);
    }
  }

  for (let divisor = 3; divisor <= 12 && questions.length < 470; divisor += 1) {
    for (let base = 6; base <= 120 && questions.length < 470; base += 6) {
      const dividend = divisor * base;
      push(`What is ${dividend} ÷ ${divisor}?`, base, dividend);
    }
  }

  for (let percent = 10; percent <= 90 && questions.length < 520; percent += 10) {
    for (let value = 50; value <= 250 && questions.length < 520; value += 25) {
      const result = (percent * value) / 100;
      push(`Find ${percent}% of ${value}.`, result, percent + value);
    }
  }

  for (let base = 20; base <= 60 && questions.length < 560; base += 4) {
    const sum = base + (base + 2) + (base + 4);
    push(`The average of ${base}, ${base + 2} and ${base + 4} is?`, sum / 3, sum);
  }

  for (let speed = 20; speed <= 80 && questions.length < 600; speed += 5) {
    const time = 3 + (speed % 4);
    const distance = speed * time;
    push(`A cyclist rides at ${speed} km/h for ${time} hours. Distance covered?`, distance, speed + time);
  }

  return questions.slice(0, 500);
};

const buildStateQuestion = (seed) => {
  const entry = stateCapitals[seed % stateCapitals.length];
  const variant = Math.floor(seed / stateCapitals.length) % 3;
  if (variant === 0) {
    return {
      questionText: `What is the capital of ${entry.state}?`,
      correctAnswer: entry.capital,
      options: createOptionsFromDataset(stateCapitals, 'capital', entry.capital, seed + 3)
    };
  }
  if (variant === 1) {
    return {
      questionText: `${entry.capital} serves as the capital of which region?`,
      correctAnswer: entry.state,
      options: createOptionsFromDataset(stateCapitals, 'state', entry.state, seed + 11)
    };
  }
  return {
    questionText: `In which year was ${entry.state} reorganized as a state/UT?`,
    correctAnswer: String(entry.formation),
    options: createYearOptions(entry.formation, seed + 5)
  };
};

const buildDanceQuestion = (seed) => {
  const entry = danceForms[seed % danceForms.length];
  const variant = Math.floor(seed / danceForms.length) % 2;
  if (variant === 0) {
    return {
      questionText: `${entry.dance} belongs to which Indian state?`,
      correctAnswer: entry.state,
      options: createOptionsFromDataset(stateCapitals, 'state', entry.state, seed + 7)
    };
  }
  return {
    questionText: `Which classical or folk dance is associated with ${entry.state}?`,
    correctAnswer: entry.dance,
    options: createOptionsFromDataset(danceForms, 'dance', entry.dance, seed + 13)
  };
};

const buildFestivalQuestion = (seed) => {
  const entry = festivals[seed % festivals.length];
  const variant = Math.floor(seed / festivals.length) % 2;
  const questionText = variant === 0
    ? `${entry.name} is prominently celebrated in which month?`
    : `${entry.name} mainly focuses on which theme?`;
  const correctKey = variant === 0 ? entry.month : entry.focus;
  const dataset = variant === 0 ? festivals.map((f) => ({ value: f.month })) : festivals.map((f) => ({ value: f.focus }));
  const options = (() => {
    const opts = new Set([correctKey]);
    let pointer = seed;
    while (opts.size < 4) {
      const candidate = dataset[pointer % dataset.length].value;
      if (candidate && candidate !== correctKey) {
        opts.add(candidate);
      }
      pointer += 1;
    }
    return shuffle([...opts], seed + 9);
  })();
  return { questionText, correctAnswer: correctKey, options };
};

const buildMonumentQuestion = (seed) => {
  const entry = monuments[seed % monuments.length];
  const variant = Math.floor(seed / monuments.length) % 2;
  if (variant === 0) {
    return {
      questionText: `Where is the ${entry.name} located?`,
      correctAnswer: entry.location,
      options: createOptionsFromDataset(monuments, 'location', entry.location, seed + 17)
    };
  }
  return {
    questionText: `The ${entry.name} was built in which era?`,
    correctAnswer: entry.era,
    options: createOptionsFromDataset(monuments, 'era', entry.era, seed + 19)
  };
};

const buildRiverQuestion = (seed) => {
  const entry = rivers[seed % rivers.length];
  const variant = Math.floor(seed / rivers.length) % 2;
  const questionText = variant === 0
    ? `Where does the river ${entry.name} originate?`
    : `The river ${entry.name} drains into which water body?`;
  const correctKey = variant === 0 ? entry.origin : entry.meets;
  const dataset = variant === 0 ? rivers.map((r) => ({ value: r.origin })) : rivers.map((r) => ({ value: r.meets }));
  const options = (() => {
    const opts = new Set([correctKey]);
    let pointer = seed;
    while (opts.size < 4) {
      const candidate = dataset[pointer % dataset.length].value;
      if (candidate && candidate !== correctKey) {
        opts.add(candidate);
      }
      pointer += 1;
    }
    return shuffle([...opts], seed + 23);
  })();
  return { questionText, correctAnswer: correctKey, options };
};

const buildFreedomQuestion = (seed) => {
  const entry = freedomEvents[seed % freedomEvents.length];
  const variant = Math.floor(seed / freedomEvents.length) % 2;
  if (variant === 0) {
    return {
      questionText: `Who led the ${entry.event}?`,
      correctAnswer: entry.leader,
      options: createOptionsFromDataset(freedomEvents.map((e) => ({ leader: e.leader })), 'leader', entry.leader, seed + 29)
    };
  }
  return {
    questionText: `In which year did the ${entry.event} begin?`,
    correctAnswer: String(entry.year),
    options: createYearOptions(entry.year, seed + 31)
  };
};

const buildScienceQuestion = (seed) => {
  const entry = scienceMissions[seed % scienceMissions.length];
  const variant = Math.floor(seed / scienceMissions.length) % 2;
  if (variant === 0) {
    return {
      questionText: `${entry.mission} launched in which year?`,
      correctAnswer: String(entry.year),
      options: createYearOptions(entry.year, seed + 37)
    };
  }
  return {
    questionText: `What was the primary focus of ${entry.mission}?`,
    correctAnswer: entry.focus,
    options: createOptionsFromDataset(scienceMissions.map((m) => ({ focus: m.focus })), 'focus', entry.focus, seed + 41)
  };
};

const buildSportsQuestion = (seed) => {
  const entry = sportsLegends[seed % sportsLegends.length];
  const variant = Math.floor(seed / sportsLegends.length) % 2;
  if (variant === 0) {
    return {
      questionText: `${entry.athlete} is associated with which sport?`,
      correctAnswer: entry.sport,
      options: createOptionsFromDataset(sportsLegends.map((s) => ({ sport: s.sport })), 'sport', entry.sport, seed + 43)
    };
  }
  return {
    questionText: `Which highlight is linked to ${entry.athlete}?`,
    correctAnswer: entry.highlight,
    options: createOptionsFromDataset(sportsLegends.map((s) => ({ highlight: s.highlight })), 'highlight', entry.highlight, seed + 47)
  };
};

const buildHeritageQuestion = (seed) => {
  const entry = unescoSites[seed % unescoSites.length];
  const variant = Math.floor(seed / unescoSites.length) % 2;
  if (variant === 0) {
    return {
      questionText: `${entry.site} is located in which state/region?`,
      correctAnswer: entry.state,
      options: createOptionsFromDataset(stateCapitals, 'state', entry.state, seed + 53)
    };
  }
  return {
    questionText: `What makes ${entry.site} special?`,
    correctAnswer: entry.feature,
    options: createOptionsFromDataset(unescoSites.map((s) => ({ feature: s.feature })), 'feature', entry.feature, seed + 59)
  };
};

const buildMountainQuestion = (seed) => {
  const entry = mountainPeaks[seed % mountainPeaks.length];
  const variant = Math.floor(seed / mountainPeaks.length) % 2;
  if (variant === 0) {
    return {
      questionText: `${entry.peak} lies in which state/region?`,
      correctAnswer: entry.state,
      options: createOptionsFromDataset(stateCapitals, 'state', entry.state, seed + 61)
    };
  }
  return {
    questionText: `What is the elevation of ${entry.peak}?`,
    correctAnswer: entry.height,
    options: createOptionsFromDataset(mountainPeaks.map((p) => ({ height: p.height })), 'height', entry.height, seed + 67)
  };
};

const buildLiteratureQuestion = (seed) => {
  const entry = literatureAwards[seed % literatureAwards.length];
  const variant = Math.floor(seed / literatureAwards.length) % 2;
  if (variant === 0) {
    return {
      questionText: `Who authored "${entry.work}"?`,
      correctAnswer: entry.author,
      options: createOptionsFromDataset(literatureAwards.map((l) => ({ author: l.author })), 'author', entry.author, seed + 71)
    };
  }
  return {
    questionText: `"${entry.work}" gained prominence in which year?`,
    correctAnswer: String(entry.year),
    options: createYearOptions(entry.year, seed + 73)
  };
};

const buildEconomyQuestion = (seed) => {
  const entry = economicFacts[seed % economicFacts.length];
  const variant = Math.floor(seed / economicFacts.length) % 2;
  if (variant === 0) {
    return {
      questionText: `${entry.hub} is famous for which economic sector?`,
      correctAnswer: entry.sector,
      options: createOptionsFromDataset(economicFacts.map((e) => ({ sector: e.sector })), 'sector', entry.sector, seed + 79)
    };
  }
  return {
    questionText: `What share or highlight is linked to ${entry.sector}?`,
    correctAnswer: entry.share,
    options: createOptionsFromDataset(economicFacts.map((e) => ({ share: e.share })), 'share', entry.share, seed + 83)
  };
};

const quizBuilders = [
  buildStateQuestion,
  buildDanceQuestion,
  buildFestivalQuestion,
  buildMonumentQuestion,
  buildRiverQuestion,
  buildFreedomQuestion,
  buildScienceQuestion,
  buildSportsQuestion,
  buildHeritageQuestion,
  buildMountainQuestion,
  buildLiteratureQuestion,
  buildEconomyQuestion
];

const generateQuizQuestions = () => {
  const questions = [];
  let seed = 0;
  while (questions.length < 500) {
    const builder = quizBuilders[seed % quizBuilders.length];
    const result = builder(seed);
    questions.push({
      id: `quiz-${questions.length + 1}`,
      type: 'QUIZ',
      questionText: result.questionText,
      correctAnswer: result.correctAnswer,
      options: result.options
    });
    seed += 1;
  }
  return questions;
};

const generatePuzzleQuestions = () => {
  const questions = [];
  let id = 1;

  const addSequenceQuestion = (start, diff, length, missingIndex) => {
    const seq = [];
    for (let i = 0; i < length; i += 1) {
      seq.push(start + diff * i);
    }
    const answer = seq[missingIndex];
    const display = seq
      .map((value, index) => (index === missingIndex ? '?' : value))
      .join(', ');
    questions.push({
      id: `puzzle-${id}`,
      type: 'PUZZLE',
      questionText: `Fill the missing number: ${display}`,
      correctAnswer: String(answer)
    });
    id += 1;
  };

  for (let base = 4; base < 60 && questions.length < 200; base += 2) {
    const diff = (base % 5) + 2;
    const missingIndex = base % 5;
    addSequenceQuestion(base, diff, 6, missingIndex);
  }

  for (let base = 3; base < 40 && questions.length < 350; base += 1) {
    const ratio = (base % 3) + 2;
    const seq = [];
    let value = base + 1;
    for (let i = 0; i < 5; i += 1) {
      seq.push(value);
      value *= ratio;
    }
    const missingIndex = base % seq.length;
    const answer = seq[missingIndex];
    const display = seq
      .map((val, idx) => (idx === missingIndex ? '?' : val))
      .join(', ');
    questions.push({
      id: `puzzle-${id}`,
      type: 'PUZZLE',
      questionText: `Complete the geometric sequence: ${display}`,
      correctAnswer: String(answer)
    });
    id += 1;
  }

  const codeWords = ['DELHI', 'MUMBAI', 'CHENNAI', 'KOLKATA', 'JAIPUR', 'PATNA', 'RANCHI', 'KOCHI', 'SURAT', 'LUCKNOW'];
  const letterValue = (word) => word.split('').reduce((sum, char) => sum + (char.charCodeAt(0) - 64), 0);
  for (let idx = 0; idx < 150 && questions.length < 500; idx += 1) {
    const word = codeWords[idx % codeWords.length];
    const multiplier = (idx % 5) + 1;
    const questionWord = `${word}${multiplier}`;
    const answer = letterValue(word) + multiplier * 5;
    questions.push({
      id: `puzzle-${id}`,
      type: 'PUZZLE',
      questionText: `If letters carry numeric values (A=1...Z=26), what is the code value of ${questionWord}?`,
      correctAnswer: String(answer)
    });
    id += 1;
  }

  return questions.slice(0, 500);
};

const typingStates = stateCapitals.map((entry) => entry.state);
const typingFestivals = festivals.map((entry) => entry.name);
const typingAdjectives = ['vibrant', 'radiant', 'historic', 'serene', 'majestic', 'spirited', 'lively', 'ancient', 'youthful', 'artistic'];
const typingVerbs = ['celebrates', 'honors', 'embraces', 'remembers', 'narrates', 'safeguards', 'uplifts', 'nurtures', 'inspires', 'showcases'];
const typingExtras = ['every season', 'with timeless grace', 'through community love', 'with luminous lanterns', 'through melodic drums', 'across bustling streets', 'amid fragrant bazaars', 'beside quiet rivers', 'upon rolling hills', 'under monsoon skies'];

const generateTypingQuestions = () => {
  const questions = [];
  for (let i = 0; i < 500; i += 1) {
    const state = typingStates[i % typingStates.length];
    const festival = typingFestivals[(i * 3) % typingFestivals.length];
    const adjective = typingAdjectives[(i * 5) % typingAdjectives.length];
    const verb = typingVerbs[(i * 7) % typingVerbs.length];
    const extra = typingExtras[(i * 11) % typingExtras.length];
    const sentence = `The ${adjective} land of ${state} ${verb} ${festival} ${extra}.`;
    questions.push({
      id: `typing-${i + 1}`,
      type: 'TYPING',
      questionText: `Type this sentence exactly: "${sentence}"`,
      correctAnswer: sentence
    });
  }
  return questions;
};

// CAPTCHA words - mix of common words and alphanumeric codes
const captchaWords = [
  'BHARAT', 'INDIA', 'DELHI', 'MUMBAI', 'KOLKATA', 'CHENNAI', 'JAIPUR', 'KERALA',
  'GANGA', 'YAMUNA', 'LOTUS', 'TIGER', 'PEACOCK', 'MANGO', 'CRICKET', 'DIWALI',
  'HOLI', 'NAMASTE', 'YOGA', 'KARMA', 'DHARMA', 'GURU', 'MANTRA', 'CHAI',
  'RUPEE', 'SAFFRON', 'SPICE', 'CURRY', 'BIRYANI', 'SAMOSA', 'LASSI', 'NAAN'
];

const captchaStyles = ['distorted', 'noisy', 'strikethrough', 'rotated', 'mixed'];

const generateRandomCode = (length = 6) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars like 0/O, 1/I
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateCaptchaQuestions = () => {
  const questions = [];
  let id = 1;
  
  // Word-based CAPTCHAs
  for (let i = 0; i < 200; i++) {
    const word = captchaWords[i % captchaWords.length];
    const style = captchaStyles[i % captchaStyles.length];
    questions.push({
      id: `captcha-${id}`,
      type: 'CAPTCHA',
      questionText: word,
      correctAnswer: word,
      captchaStyle: style
    });
    id++;
  }
  
  // Random alphanumeric CAPTCHAs
  for (let i = 0; i < 300; i++) {
    const code = generateRandomCode(5 + (i % 3)); // 5-7 chars
    const style = captchaStyles[i % captchaStyles.length];
    questions.push({
      id: `captcha-${id}`,
      type: 'CAPTCHA',
      questionText: code,
      correctAnswer: code,
      captchaStyle: style
    });
    id++;
  }
  
  return questions;
};

export const staticQuestionBank = {
  MATH: generateMathQuestions(),
  QUIZ: generateQuizQuestions(),
  PUZZLE: generatePuzzleQuestions(),
  TYPING: generateTypingQuestions(),
  CAPTCHA: generateCaptchaQuestions()
};

export const getStaticQuestions = (category, count = 5) => {
  const upperCategory = category?.toUpperCase();
  const bucket = staticQuestionBank[upperCategory];
  if (!bucket || bucket.length === 0) {
    return [];
  }
  return sampleWithoutReplacement(bucket, Math.min(count, bucket.length));
};