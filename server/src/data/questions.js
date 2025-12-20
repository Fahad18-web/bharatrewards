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

// Pakistani Provinces, Regions and Administrative Units
const provinceCapitals = [
  { province: 'Punjab', capital: 'Lahore', formation: 1970, speciality: 'Cultural heartland' },
  { province: 'Sindh', capital: 'Karachi', formation: 1970, speciality: 'Economic hub' },
  { province: 'Khyber Pakhtunkhwa', capital: 'Peshawar', formation: 1970, speciality: 'Gateway to Central Asia' },
  { province: 'Balochistan', capital: 'Quetta', formation: 1970, speciality: 'Largest province by area' },
  { province: 'Gilgit-Baltistan', capital: 'Gilgit', formation: 2009, speciality: 'Mountain paradise' },
  { province: 'Azad Kashmir', capital: 'Muzaffarabad', formation: 1947, speciality: 'Scenic valleys' },
  { province: 'Islamabad Capital Territory', capital: 'Islamabad', formation: 1960, speciality: 'Planned capital city' },
  { province: 'Faisalabad Division', capital: 'Faisalabad', formation: 1977, speciality: 'Textile capital' },
  { province: 'Multan Division', capital: 'Multan', formation: 1970, speciality: 'City of Saints' },
  { province: 'Rawalpindi Division', capital: 'Rawalpindi', formation: 1970, speciality: 'Twin city of Islamabad' },
  { province: 'Gujranwala Division', capital: 'Gujranwala', formation: 1970, speciality: 'Industrial center' },
  { province: 'Bahawalpur Division', capital: 'Bahawalpur', formation: 1970, speciality: 'Former princely state' },
  { province: 'Sukkur Division', capital: 'Sukkur', formation: 1970, speciality: 'Indus River gateway' },
  { province: 'Hyderabad Division', capital: 'Hyderabad', formation: 1970, speciality: 'Second largest in Sindh' },
  { province: 'Sargodha Division', capital: 'Sargodha', formation: 1970, speciality: 'Citrus capital' },
  { province: 'Dera Ghazi Khan Division', capital: 'Dera Ghazi Khan', formation: 1970, speciality: 'Gateway to Balochistan' },
  { province: 'Larkana Division', capital: 'Larkana', formation: 1970, speciality: 'Mohenjo-daro heritage' },
  { province: 'Mirpur Division', capital: 'Mirpur', formation: 1947, speciality: 'British Pakistani hub' },
  { province: 'Chitral District', capital: 'Chitral', formation: 1969, speciality: 'Kalash Valley' },
  { province: 'Swat District', capital: 'Mingora', formation: 1969, speciality: 'Switzerland of Pakistan' }
];

// Pakistani Folk and Cultural Dances
const danceForms = [
  { dance: 'Bhangra', region: 'Punjab' },
  { dance: 'Luddi', region: 'Punjab' },
  { dance: 'Jhumar', region: 'Punjab' },
  { dance: 'Sammi', region: 'Punjab' },
  { dance: 'Khattak Dance', region: 'Khyber Pakhtunkhwa' },
  { dance: 'Attan', region: 'Khyber Pakhtunkhwa' },
  { dance: 'Chitrali Dance', region: 'Chitral' },
  { dance: 'Lewa', region: 'Balochistan' },
  { dance: 'Chap', region: 'Balochistan' },
  { dance: 'Ho Jamalo', region: 'Sindh' },
  { dance: 'Dhamal', region: 'Punjab' },
  { dance: 'Malakhro', region: 'Sindh' },
  { dance: 'Rass', region: 'Gilgit-Baltistan' },
  { dance: 'Dumhal', region: 'Gilgit-Baltistan' },
  { dance: 'Kathak', region: 'Punjab' },
  { dance: 'Gatka', region: 'Punjab' },
  { dance: 'Kikli', region: 'Punjab' },
  { dance: 'Giddha', region: 'Punjab' },
  { dance: 'Rouff', region: 'Azad Kashmir' },
  { dance: 'Sheedi Dance', region: 'Sindh' }
];

// Pakistani Festivals and Celebrations
const festivals = [
  { name: 'Eid ul-Fitr', month: 'Varies', focus: 'End of Ramadan' },
  { name: 'Eid ul-Adha', month: 'Varies', focus: 'Sacrifice and devotion' },
  { name: 'Pakistan Day', month: 'March', focus: 'Lahore Resolution' },
  { name: 'Independence Day', month: 'August', focus: 'Freedom celebration' },
  { name: 'Quaid-e-Azam Day', month: 'December', focus: 'Founder birth anniversary' },
  { name: 'Iqbal Day', month: 'November', focus: 'National poet tribute' },
  { name: 'Kashmir Day', month: 'February', focus: 'Solidarity' },
  { name: 'Shab-e-Barat', month: 'Varies', focus: 'Night of forgiveness' },
  { name: 'Shab-e-Meraj', month: 'Varies', focus: 'Prophets journey' },
  { name: 'Milad un-Nabi', month: 'Varies', focus: 'Prophet birthday' },
  { name: 'Basant', month: 'February', focus: 'Kite flying festival' },
  { name: 'Urs of Data Ganj Bakhsh', month: 'Varies', focus: 'Sufi shrine' },
  { name: 'Chilam Joshi', month: 'May', focus: 'Kalash spring festival' },
  { name: 'Shandur Polo Festival', month: 'July', focus: 'Highest polo ground' },
  { name: 'Lok Mela', month: 'October', focus: 'Folk heritage fair' },
  { name: 'Jashn-e-Baharan', month: 'March', focus: 'Spring celebration' },
  { name: 'Sibi Mela', month: 'February', focus: 'Cultural fair' },
  { name: 'Urs of Shah Abdul Latif Bhittai', month: 'Varies', focus: 'Sufi poetry' },
  { name: 'Holi', month: 'March', focus: 'Hindu festival of colors' },
  { name: 'Diwali', month: 'November', focus: 'Hindu festival of lights' }
];

// Pakistani Historical Monuments
const monuments = [
  { name: 'Badshahi Mosque', location: 'Lahore', era: '17th century' },
  { name: 'Minar-e-Pakistan', location: 'Lahore', era: '20th century' },
  { name: 'Faisal Mosque', location: 'Islamabad', era: '20th century' },
  { name: 'Lahore Fort', location: 'Lahore', era: '16th century' },
  { name: 'Shalimar Gardens', location: 'Lahore', era: '17th century' },
  { name: 'Mohenjo-daro', location: 'Larkana', era: '2500 BCE' },
  { name: 'Taxila', location: 'Rawalpindi', era: '6th century BCE' },
  { name: 'Rohtas Fort', location: 'Jhelum', era: '16th century' },
  { name: 'Makli Necropolis', location: 'Thatta', era: '14th century' },
  { name: 'Shah Jahan Mosque', location: 'Thatta', era: '17th century' },
  { name: 'Hiran Minar', location: 'Sheikhupura', era: '17th century' },
  { name: 'Tomb of Jahangir', location: 'Lahore', era: '17th century' },
  { name: 'Wazir Khan Mosque', location: 'Lahore', era: '17th century' },
  { name: 'Derawar Fort', location: 'Bahawalpur', era: '9th century' },
  { name: 'Pakistan Monument', location: 'Islamabad', era: '21st century' },
  { name: 'Quaid-e-Azam Mausoleum', location: 'Karachi', era: '20th century' },
  { name: 'Baltit Fort', location: 'Hunza', era: '8th century' },
  { name: 'Altit Fort', location: 'Hunza', era: '11th century' },
  { name: 'Ranikot Fort', location: 'Jamshoro', era: '17th century' },
  { name: 'Tomb of Shah Rukn-e-Alam', location: 'Multan', era: '14th century' }
];

// Pakistani Rivers
const rivers = [
  { name: 'Indus', origin: 'Tibetan Plateau', meets: 'Arabian Sea' },
  { name: 'Jhelum', origin: 'Kashmir Valley', meets: 'Chenab River' },
  { name: 'Chenab', origin: 'Himachal Pradesh', meets: 'Sutlej River' },
  { name: 'Ravi', origin: 'Himachal Pradesh', meets: 'Chenab River' },
  { name: 'Sutlej', origin: 'Tibet', meets: 'Chenab River' },
  { name: 'Beas', origin: 'Himalayas', meets: 'Sutlej River' },
  { name: 'Kabul River', origin: 'Afghanistan', meets: 'Indus River' },
  { name: 'Swat River', origin: 'Swat Valley', meets: 'Kabul River' },
  { name: 'Chitral River', origin: 'Chitral', meets: 'Kabul River' },
  { name: 'Kunar River', origin: 'Afghanistan', meets: 'Kabul River' },
  { name: 'Zhob River', origin: 'Balochistan', meets: 'Gomal River' },
  { name: 'Gomal River', origin: 'Afghanistan', meets: 'Indus River' },
  { name: 'Kurram River', origin: 'Afghanistan', meets: 'Indus River' },
  { name: 'Hunza River', origin: 'Hunza Valley', meets: 'Gilgit River' },
  { name: 'Gilgit River', origin: 'Gilgit-Baltistan', meets: 'Indus River' }
];

// Pakistan Movement and Historical Events
const historicalEvents = [
  { event: 'Lahore Resolution', year: 1940, leader: 'Muhammad Ali Jinnah' },
  { event: 'Two-Nation Theory Formalization', year: 1940, leader: 'Allama Iqbal' },
  { event: 'Pakistan Independence', year: 1947, leader: 'Muhammad Ali Jinnah' },
  { event: 'Objective Resolution', year: 1949, leader: 'Liaquat Ali Khan' },
  { event: 'First Constitution', year: 1956, leader: 'Iskander Mirza' },
  { event: 'Ayub Khan Era Begins', year: 1958, leader: 'Ayub Khan' },
  { event: '1965 War', year: 1965, leader: 'Ayub Khan' },
  { event: 'Tashkent Declaration', year: 1966, leader: 'Ayub Khan' },
  { event: 'East Pakistan Crisis', year: 1971, leader: 'Yahya Khan' },
  { event: 'Constitution of 1973', year: 1973, leader: 'Zulfikar Ali Bhutto' },
  { event: 'Nuclear Capability Declaration', year: 1998, leader: 'Nawaz Sharif' },
  { event: 'Khilafat Movement Support', year: 1919, leader: 'Maulana Muhammad Ali Johar' },
  { event: 'Simon Commission Boycott', year: 1928, leader: 'Muslim League' },
  { event: 'All India Muslim League Founded', year: 1906, leader: 'Nawab Salimullah' },
  { event: 'Allahabad Address', year: 1930, leader: 'Allama Iqbal' },
  { event: 'Direct Action Day', year: 1946, leader: 'Muhammad Ali Jinnah' },
  { event: 'Radcliffe Line Announcement', year: 1947, leader: 'Lord Mountbatten' },
  { event: 'First Governor General Oath', year: 1947, leader: 'Muhammad Ali Jinnah' },
  { event: 'Jinnah Death', year: 1948, leader: 'Nation mourning' },
  { event: 'Liaquat Ali Khan Assassination', year: 1951, leader: 'Nation mourning' }
];

// Pakistani Space and Science Achievements
const scienceAchievements = [
  { achievement: 'SUPARCO Established', year: 1961, focus: 'Space agency formation' },
  { achievement: 'First Rocket Launch', year: 1962, focus: 'Rehbar-I rocket' },
  { achievement: 'Badr-1 Satellite', year: 1990, focus: 'First Pakistani satellite' },
  { achievement: 'Badr-B Satellite', year: 2001, focus: 'Earth observation' },
  { achievement: 'PakSat-1 Launch', year: 2011, focus: 'Communication satellite' },
  { achievement: 'PakSat-1R Launch', year: 2011, focus: 'Geostationary satellite' },
  { achievement: 'PRSS-1 Launch', year: 2018, focus: 'Remote sensing satellite' },
  { achievement: 'PakTES-1A Launch', year: 2018, focus: 'Technology evaluation' },
  { achievement: 'iCube Qamar Launch', year: 2024, focus: 'Lunar mission' },
  { achievement: 'Nuclear Capability', year: 1998, focus: 'Chagai tests' },
  { achievement: 'Kahuta Research Labs', year: 1976, focus: 'Nuclear program' },
  { achievement: 'PAEC Established', year: 1956, focus: 'Atomic energy commission' },
  { achievement: 'Karachi Nuclear Plant', year: 1971, focus: 'KANUPP reactor' },
  { achievement: 'Chashma Nuclear Plant', year: 2000, focus: 'Power generation' },
  { achievement: 'Dr. Abdul Qadeer Khan Award', year: 1998, focus: 'National hero recognition' }
];

// Pakistani Sports Legends
const sportsLegends = [
  { athlete: 'Imran Khan', sport: 'Cricket', highlight: '1992 World Cup victory' },
  { athlete: 'Wasim Akram', sport: 'Cricket', highlight: 'Sultan of Swing' },
  { athlete: 'Jahangir Khan', sport: 'Squash', highlight: '555 consecutive wins' },
  { athlete: 'Jansher Khan', sport: 'Squash', highlight: 'Eight World Open titles' },
  { athlete: 'Shahid Afridi', sport: 'Cricket', highlight: 'Boom Boom all-rounder' },
  { athlete: 'Shoaib Akhtar', sport: 'Cricket', highlight: 'Fastest bowler in history' },
  { athlete: 'Hasan Sardar', sport: 'Hockey', highlight: '1984 Olympic gold' },
  { athlete: 'Islahuddin Siddiqui', sport: 'Hockey', highlight: 'Three-time Olympic gold' },
  { athlete: 'Aisamul Haq Qureshi', sport: 'Tennis', highlight: 'Grand Slam doubles finalist' },
  { athlete: 'Maria Toorpakai', sport: 'Squash', highlight: 'Womens squash pioneer' },
  { athlete: 'Samiullah Khan', sport: 'Hockey', highlight: 'Flying Horse' },
  { athlete: 'Inzamam-ul-Haq', sport: 'Cricket', highlight: 'Match-winning batsman' },
  { athlete: 'Waqar Younis', sport: 'Cricket', highlight: 'Toe-crushing yorkers' },
  { athlete: 'Babar Azam', sport: 'Cricket', highlight: 'Modern era captain' },
  { athlete: 'Mohammad Rizwan', sport: 'Cricket', highlight: 'T20 run machine' },
  { athlete: 'Naseem Shah', sport: 'Cricket', highlight: 'Young pace sensation' },
  { athlete: 'Sohail Abbas', sport: 'Hockey', highlight: 'Highest international goals' },
  { athlete: 'Arfa Karim', sport: 'Technology', highlight: 'Youngest Microsoft certified' },
  { athlete: 'Talha Talib', sport: 'Weightlifting', highlight: 'Olympic hopeful' },
  { athlete: 'Haider Ali', sport: 'Paralympics', highlight: 'Paralympic gold medalist' }
];

// Pakistani UNESCO and Heritage Sites
const heritageSites = [
  { site: 'Mohenjo-daro', region: 'Sindh', feature: 'Indus Valley Civilization' },
  { site: 'Taxila', region: 'Punjab', feature: 'Buddhist learning center' },
  { site: 'Lahore Fort and Shalimar Gardens', region: 'Punjab', feature: 'Mughal architecture' },
  { site: 'Makli Necropolis', region: 'Sindh', feature: 'Largest funerary site' },
  { site: 'Rohtas Fort', region: 'Punjab', feature: 'Suri dynasty fortification' },
  { site: 'Badshahi Mosque', region: 'Punjab', feature: 'Mughal mosque masterpiece' },
  { site: 'Faisal Mosque', region: 'Islamabad', feature: 'Modern Islamic architecture' },
  { site: 'Deosai National Park', region: 'Gilgit-Baltistan', feature: 'Himalayan brown bears' },
  { site: 'Hingol National Park', region: 'Balochistan', feature: 'Mud volcanoes' },
  { site: 'K2 Base Camp', region: 'Gilgit-Baltistan', feature: 'Second highest peak' },
  { site: 'Fairy Meadows', region: 'Gilgit-Baltistan', feature: 'Nanga Parbat views' },
  { site: 'Hunza Valley', region: 'Gilgit-Baltistan', feature: 'Mountain paradise' },
  { site: 'Kalash Valley', region: 'Khyber Pakhtunkhwa', feature: 'Unique culture' },
  { site: 'Swat Valley', region: 'Khyber Pakhtunkhwa', feature: 'Buddhist heritage' },
  { site: 'Chitral', region: 'Khyber Pakhtunkhwa', feature: 'Ancient traditions' },
  { site: 'Skardu', region: 'Gilgit-Baltistan', feature: 'Gateway to K2' },
  { site: 'Neelum Valley', region: 'Azad Kashmir', feature: 'Blue river valley' },
  { site: 'Shangrila Resort', region: 'Gilgit-Baltistan', feature: 'Heaven on Earth' },
  { site: 'Attabad Lake', region: 'Gilgit-Baltistan', feature: 'Turquoise waters' },
  { site: 'Khunjerab Pass', region: 'Gilgit-Baltistan', feature: 'Highest border crossing' }
];

// Pakistani Mountain Peaks
const mountainPeaks = [
  { peak: 'K2', region: 'Gilgit-Baltistan', height: '8611 m' },
  { peak: 'Nanga Parbat', region: 'Gilgit-Baltistan', height: '8126 m' },
  { peak: 'Gasherbrum I', region: 'Gilgit-Baltistan', height: '8080 m' },
  { peak: 'Broad Peak', region: 'Gilgit-Baltistan', height: '8051 m' },
  { peak: 'Gasherbrum II', region: 'Gilgit-Baltistan', height: '8035 m' },
  { peak: 'Gasherbrum III', region: 'Gilgit-Baltistan', height: '7946 m' },
  { peak: 'Gasherbrum IV', region: 'Gilgit-Baltistan', height: '7932 m' },
  { peak: 'Distaghil Sar', region: 'Gilgit-Baltistan', height: '7885 m' },
  { peak: 'Kunyang Chhish', region: 'Gilgit-Baltistan', height: '7852 m' },
  { peak: 'Masherbrum', region: 'Gilgit-Baltistan', height: '7821 m' },
  { peak: 'Rakaposhi', region: 'Gilgit-Baltistan', height: '7788 m' },
  { peak: 'Batura Sar', region: 'Gilgit-Baltistan', height: '7795 m' },
  { peak: 'Saltoro Kangri', region: 'Gilgit-Baltistan', height: '7742 m' },
  { peak: 'Tirich Mir', region: 'Khyber Pakhtunkhwa', height: '7708 m' },
  { peak: 'Spantik', region: 'Gilgit-Baltistan', height: '7027 m' }
];

// Pakistani Literature and Authors
const literatureAwards = [
  { author: 'Allama Iqbal', work: 'Bang-e-Dra', year: 1924 },
  { author: 'Faiz Ahmed Faiz', work: 'Nuskha Haye Wafa', year: 1985 },
  { author: 'Saadat Hasan Manto', work: 'Toba Tek Singh', year: 1955 },
  { author: 'Intizar Hussain', work: 'Basti', year: 1979 },
  { author: 'Qurratulain Hyder', work: 'Aag Ka Darya', year: 1959 },
  { author: 'Ahmad Faraz', work: 'Mere Khwab Reza Reza', year: 1995 },
  { author: 'Ishfaq Ahmed', work: 'Zavia', year: 1990 },
  { author: 'Bano Qudsia', work: 'Raja Gidh', year: 1981 },
  { author: 'Ashfaq Ahmed', work: 'Talqeen Shah', year: 1983 },
  { author: 'Mustansar Hussain Tarar', work: 'Raakh', year: 1981 },
  { author: 'Mohsin Hamid', work: 'The Reluctant Fundamentalist', year: 2007 },
  { author: 'Kamila Shamsie', work: 'Home Fire', year: 2017 },
  { author: 'Bapsi Sidhwa', work: 'Ice-Candy-Man', year: 1988 },
  { author: 'Hanif Kureishi', work: 'The Buddha of Suburbia', year: 1990 },
  { author: 'Mohammed Hanif', work: 'A Case of Exploding Mangoes', year: 2008 }
];

// Pakistani Economic Hubs
const economicFacts = [
  { sector: 'Textiles', hub: 'Faisalabad', share: 'Textile capital of Pakistan' },
  { sector: 'Finance', hub: 'Karachi', share: 'Stock exchange hub' },
  { sector: 'IT Services', hub: 'Lahore', share: 'Tech startup ecosystem' },
  { sector: 'Pharmaceuticals', hub: 'Karachi', share: 'Pharma manufacturing' },
  { sector: 'Surgical Instruments', hub: 'Sialkot', share: '20% global supply' },
  { sector: 'Sports Goods', hub: 'Sialkot', share: 'FIFA football supplier' },
  { sector: 'Leather Goods', hub: 'Sialkot', share: 'Gloves and apparel' },
  { sector: 'Ceramics', hub: 'Gujranwala', share: 'Tile manufacturing' },
  { sector: 'Agriculture', hub: 'Multan', share: 'Cotton and mangoes' },
  { sector: 'Citrus Farming', hub: 'Sargodha', share: 'Kinnow oranges' },
  { sector: 'Rice Export', hub: 'Gujranwala', share: 'Basmati rice hub' },
  { sector: 'Mining', hub: 'Quetta', share: 'Mineral resources' },
  { sector: 'Fishing', hub: 'Gwadar', share: 'Deep sea port' },
  { sector: 'Energy', hub: 'Thar', share: 'Coal reserves' },
  { sector: 'Automobile', hub: 'Karachi', share: 'Vehicle assembly' },
  { sector: 'Cement', hub: 'Daudkhel', share: 'Construction materials' },
  { sector: 'Sugar', hub: 'Rahim Yar Khan', share: 'Sugar mills cluster' },
  { sector: 'Handicrafts', hub: 'Peshawar', share: 'Traditional crafts' },
  { sector: 'Carpets', hub: 'Lahore', share: 'Hand-woven exports' },
  { sector: 'Jewelry', hub: 'Hyderabad', share: 'Bangles and ornaments' }
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

const buildProvinceQuestion = (seed) => {
  const entry = provinceCapitals[seed % provinceCapitals.length];
  const variant = Math.floor(seed / provinceCapitals.length) % 3;
  if (variant === 0) {
    return {
      questionText: `What is the capital of ${entry.province}?`,
      correctAnswer: entry.capital,
      options: createOptionsFromDataset(provinceCapitals, 'capital', entry.capital, seed + 3)
    };
  }
  if (variant === 1) {
    return {
      questionText: `${entry.capital} serves as the capital of which region?`,
      correctAnswer: entry.province,
      options: createOptionsFromDataset(provinceCapitals, 'province', entry.province, seed + 11)
    };
  }
  return {
    questionText: `What is ${entry.province} known for?`,
    correctAnswer: entry.speciality,
    options: createOptionsFromDataset(provinceCapitals, 'speciality', entry.speciality, seed + 5)
  };
};

const buildDanceQuestion = (seed) => {
  const entry = danceForms[seed % danceForms.length];
  const variant = Math.floor(seed / danceForms.length) % 2;
  if (variant === 0) {
    return {
      questionText: `${entry.dance} belongs to which Pakistani region?`,
      correctAnswer: entry.region,
      options: createOptionsFromDataset(danceForms, 'region', entry.region, seed + 7)
    };
  }
  return {
    questionText: `Which traditional dance is associated with ${entry.region}?`,
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
      questionText: `Where is ${entry.name} located?`,
      correctAnswer: entry.location,
      options: createOptionsFromDataset(monuments, 'location', entry.location, seed + 17)
    };
  }
  return {
    questionText: `${entry.name} was built in which era?`,
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

const buildHistoryQuestion = (seed) => {
  const entry = historicalEvents[seed % historicalEvents.length];
  const variant = Math.floor(seed / historicalEvents.length) % 2;
  if (variant === 0) {
    return {
      questionText: `Who was associated with the ${entry.event}?`,
      correctAnswer: entry.leader,
      options: createOptionsFromDataset(historicalEvents.map((e) => ({ leader: e.leader })), 'leader', entry.leader, seed + 29)
    };
  }
  return {
    questionText: `In which year did the ${entry.event} occur?`,
    correctAnswer: String(entry.year),
    options: createYearOptions(entry.year, seed + 31)
  };
};

const buildScienceQuestion = (seed) => {
  const entry = scienceAchievements[seed % scienceAchievements.length];
  const variant = Math.floor(seed / scienceAchievements.length) % 2;
  if (variant === 0) {
    return {
      questionText: `${entry.achievement} occurred in which year?`,
      correctAnswer: String(entry.year),
      options: createYearOptions(entry.year, seed + 37)
    };
  }
  return {
    questionText: `What was the focus of ${entry.achievement}?`,
    correctAnswer: entry.focus,
    options: createOptionsFromDataset(scienceAchievements.map((m) => ({ focus: m.focus })), 'focus', entry.focus, seed + 41)
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
  const entry = heritageSites[seed % heritageSites.length];
  const variant = Math.floor(seed / heritageSites.length) % 2;
  if (variant === 0) {
    return {
      questionText: `${entry.site} is located in which region?`,
      correctAnswer: entry.region,
      options: createOptionsFromDataset(heritageSites, 'region', entry.region, seed + 53)
    };
  }
  return {
    questionText: `What makes ${entry.site} special?`,
    correctAnswer: entry.feature,
    options: createOptionsFromDataset(heritageSites.map((s) => ({ feature: s.feature })), 'feature', entry.feature, seed + 59)
  };
};

const buildMountainQuestion = (seed) => {
  const entry = mountainPeaks[seed % mountainPeaks.length];
  const variant = Math.floor(seed / mountainPeaks.length) % 2;
  if (variant === 0) {
    return {
      questionText: `${entry.peak} lies in which region?`,
      correctAnswer: entry.region,
      options: createOptionsFromDataset(mountainPeaks, 'region', entry.region, seed + 61)
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
    questionText: `What is ${entry.sector} known for in Pakistan?`,
    correctAnswer: entry.share,
    options: createOptionsFromDataset(economicFacts.map((e) => ({ share: e.share })), 'share', entry.share, seed + 83)
  };
};

const quizBuilders = [
  buildProvinceQuestion,
  buildDanceQuestion,
  buildFestivalQuestion,
  buildMonumentQuestion,
  buildRiverQuestion,
  buildHistoryQuestion,
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

  // Pakistani cities for code puzzles
  const codeWords = ['LAHORE', 'KARACHI', 'ISLAMABAD', 'PESHAWAR', 'QUETTA', 'MULTAN', 'FAISALABAD', 'RAWALPINDI', 'SIALKOT', 'GWADAR'];
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

const typingProvinces = provinceCapitals.map((entry) => entry.province);
const typingFestivals = festivals.map((entry) => entry.name);
const typingAdjectives = ['vibrant', 'radiant', 'historic', 'serene', 'majestic', 'spirited', 'lively', 'ancient', 'youthful', 'artistic'];
const typingVerbs = ['celebrates', 'honors', 'embraces', 'remembers', 'narrates', 'safeguards', 'uplifts', 'nurtures', 'inspires', 'showcases'];
const typingExtras = ['every season', 'with timeless grace', 'through community love', 'with luminous lanterns', 'through melodic drums', 'across bustling streets', 'amid fragrant bazaars', 'beside quiet rivers', 'upon rolling hills', 'under monsoon skies'];

const generateTypingQuestions = () => {
  const questions = [];
  for (let i = 0; i < 500; i += 1) {
    const province = typingProvinces[i % typingProvinces.length];
    const festival = typingFestivals[(i * 3) % typingFestivals.length];
    const adjective = typingAdjectives[(i * 5) % typingAdjectives.length];
    const verb = typingVerbs[(i * 7) % typingVerbs.length];
    const extra = typingExtras[(i * 11) % typingExtras.length];
    const sentence = `The ${adjective} land of ${province} ${verb} ${festival} ${extra}.`;
    questions.push({
      id: `typing-${i + 1}`,
      type: 'TYPING',
      questionText: `Type this sentence exactly: "${sentence}"`,
      correctAnswer: sentence
    });
  }
  return questions;
};

// CAPTCHA words - mix of Pakistani words and alphanumeric codes
const captchaWords = [
  'PAKISTAN', 'LAHORE', 'KARACHI', 'ISLAMABAD', 'PESHAWAR', 'QUETTA', 'MULTAN', 'PUNJAB',
  'SINDH', 'INDUS', 'JINNAH', 'IQBAL', 'CRICKET', 'JASMINE', 'MARKHOR', 'MOSQUE',
  'KASHMIRI', 'HUNZA', 'SHALWAR', 'KAMEEZ', 'BIRYANI', 'CHAI', 'ROTI', 'LASSI',
  'RUPEE', 'CRESCENT', 'MINARET', 'BAZAAR', 'KEBAB', 'NAAN', 'HALWA', 'MANGO'
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
