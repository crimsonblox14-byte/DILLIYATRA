export interface Monument {
  id: string;
  name: string;
  hindiName: string;
  category: 'UNESCO Heritage' | 'Fort & Palace' | 'Sacred & Spiritual' | 'Modern & Civic' | 'Gardens & Relics';
  lat: number;
  lng: number;
  builtBy: string;
  year: string;
  architecture: string;
  summary: string;
  history: string;
  whyVisit: string;
  entryFee: {
    indian: number;
    foreigner: number;
    saarcBimstec: number;
    childrenUnder15: string;
    cameraFee: string;
    bookingTip: string;
  };
  hours: string;
  closedOn: string;
  bestTimeToVisit: string;
  nearestMetro: {
    station: string;
    line: string;
    lineColor: string;
    gate: string;
    walkingDistance: string;
  };
  transitOptions: {
    dtcBusLines: string[];
    nearestBusStop: string;
    autoFairPriceFromMetro: string;
  };
  dressCodeAndRules: string[];
  faqs: {
    q: string;
    a: string;
  }[];
  nearbyFood: {
    name: string;
    dish: string;
    fairPrice: string;
    distance: string;
  }[];
}

export interface FoodDish {
  id: string;
  name: string;
  hindiName: string;
  category: 'Breakfast' | 'Curry & Bread' | 'Street Snack' | 'Dessert & Kulfi' | 'Non-Veg Heritage';
  type: 'Veg' | 'Non-Veg';
  spiceLevel: 'Mild' | 'Medium' | 'Spicy';
  fairPriceRange: string;
  ripOffAlert: string;
  description: string;
  authenticRecipeSummary: string;
  famousSpots: {
    name: string;
    area: string;
    expectedCost: string;
    tip: string;
  }[];
  orderingTipHindi: string;
  orderingTipEnglish: string;
}

export interface MarketGuide {
  id: string;
  name: string;
  specialty: string;
  nearestMetro: string;
  metroLine: string;
  closedOn: string;
  bargainingLevel: 'High (Expect 50-70% haggle)' | 'Moderate (20-30%)' | 'Fixed Price / Minimal';
  scamAlerts: string[];
  fairPriceBenchmarks: {
    item: string;
    quotedPrice: string;
    fairPrice: string;
  }[];
  bestStreetBitesNearby: string[];
  insiderTip: string;
}

export interface MetroLineInfo {
  name: string;
  colorHex: string;
  keyStations: string[];
  touristSignificance: string;
  firstTrain: string;
  lastTrain: string;
  frequency: string;
}

export interface HindiPhrase {
  id: string;
  category: 'Bargaining' | 'Transit & Auto' | 'Food & Water' | 'Directions' | 'Emergency';
  english: string;
  hindiDevanagari: string;
  hinglishPhonetic: string;
  literalMeaning: string;
  whenToUse: string;
}

export const MONUMENTS_DATA: Monument[] = [
  {
    id: 'red-fort',
    name: 'Red Fort (Lal Qila)',
    hindiName: 'लाल क़िला',
    category: 'UNESCO Heritage',
    lat: 28.6562,
    lng: 77.2410,
    builtBy: 'Mughal Emperor Shah Jahan',
    year: '1638 - 1648 CE',
    architecture: 'Indo-Islamic & Mughal Red Sandstone',
    summary: 'The colossal 17th-century fortified palace of Shahjahanabad, symbol of Indian sovereignty where the Prime Minister hoists the national flag on Independence Day.',
    history: 'Constructed when Emperor Shah Jahan transferred the Mughal capital from Agra to Delhi. It housed the Peacock Throne before it was looted by Nadir Shah in 1739. Within its octagonal walls lies Diwan-i-Aam (Hall of Public Audience), Diwan-i-Khas (where the famous Persian verse "Agar Firdaus bar roo-e zameen ast..." is inscribed), and Mumtaz Mahal.',
    whyVisit: 'Witness breathtaking red sandstone ramparts, the Lahori Gate, and evening sound & light shows that bring Mughal history to life.',
    entryFee: {
      indian: 50,
      foreigner: 600,
      saarcBimstec: 50,
      childrenUnder15: 'Free',
      cameraFee: 'Still camera free, Video ₹25',
      bookingTip: 'Book online via asi.payumoney.com or ASI portal to save ₹50 and bypass the long physical ticket line outside Lahori Gate!',
    },
    hours: '09:30 AM - 04:30 PM (Museums close earlier)',
    closedOn: 'Mondays',
    bestTimeToVisit: 'Early morning (09:00 AM) or 04:00 PM to avoid midday heat and heavy tour crowds.',
    nearestMetro: {
      station: 'Chandni Chowk or Lal Quila',
      line: 'Violet Line (Lal Quila) or Yellow Line (Chandni Chowk)',
      lineColor: '#8b5cf6',
      gate: 'Gate 4 (Lal Quila station drops you directly at the fort outer perimeter)',
      walkingDistance: '2-5 minutes walk',
    },
    transitOptions: {
      dtcBusLines: ['Bus 118', 'Bus 405', 'Bus 502', 'Bus 729', 'Delhi Sightseeing Hop-on'],
      nearestBusStop: 'Red Fort / Old Delhi Railway Station Bus Stop',
      autoFairPriceFromMetro: '₹20-₹30 battery rickshaw from Chandni Chowk Metro',
    },
    dressCodeAndRules: [
      'Comfortable walking shoes (fort covers 254 acres)',
      'Security frisking is strict; power banks & tripods may be questioned or held',
      'Modest casual wear recommended',
    ],
    faqs: [
      {
        q: 'How do I avoid ticket touts outside the gate?',
        a: 'Never buy paper tickets from men outside offering to "skip the line". Scan the official ASI QR code at the booth or book on your phone via official ASI website.',
      },
      {
        q: 'Is wheelchair access available?',
        a: 'Yes, basic ramp access is available at major plazas, and wheelchairs can be requested at the entrance counter with an ID deposit.',
      },
      {
        q: 'Can I visit Jama Masjid from here?',
        a: 'Yes, Jama Masjid is just a 10-15 minute walk or 5-minute electric e-rickshaw ride (₹20-₹30 per person) through Meena Bazaar.',
      },
    ],
    nearbyFood: [
      {
        name: 'Giani’s Di Hatti',
        dish: 'Rabri Falooda',
        fairPrice: '₹90 - ₹120',
        distance: '600m into Chandni Chowk',
      },
      {
        name: 'Old Famous Jalebi Wala',
        dish: 'Crispy Desi Ghee Jalebi with Rabri',
        fairPrice: '₹80 (100g) + ₹50 Rabri',
        distance: '500m at Dariba Kalan corner',
      },
      {
        name: 'Natraj Dahi Bhalle',
        dish: 'Dahi Bhalla & Aloo Tikki',
        fairPrice: '₹70 - ₹90 / plate',
        distance: '700m near metro',
      },
    ],
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar Complex',
    hindiName: 'क़ुतुब मीनार',
    category: 'UNESCO Heritage',
    lat: 28.5245,
    lng: 77.1855,
    builtBy: 'Qutb-ud-din Aibak & Iltutmish',
    year: '1192 - 1220 CE',
    architecture: 'Indo-Islamic Afghan Fluted Sandstone & Marble',
    summary: 'The tallest brick minaret in the world at 72.5 meters, surrounded by ancient ruins including the mysterious rust-resistant 4th-century Iron Pillar.',
    history: 'Commenced in 1199 by Qutb-ud-din Aibak to mark the founding of the Delhi Sultanate, later expanded by Shams-ud-din Iltutmish and repaired by Firoz Shah Tughlaq after lightning strikes. The complex contains the Quwwat-ul-Islam Mosque, the unfinished mammoth Alai Minar of Alauddin Khalji, and the Gupta Empire Iron Pillar that has withstood corrosion for over 1,600 years.',
    whyVisit: 'Marvel at intricate Arabic calligraphy carved into red sandstone balconies, the ancient Iron Pillar mystery, and evening illumination.',
    entryFee: {
      indian: 50,
      foreigner: 600,
      saarcBimstec: 50,
      childrenUnder15: 'Free',
      cameraFee: 'Free (Tripods require prior ASI clearance)',
      bookingTip: 'Book ASI ticket online to save ₹50 and get faster digital QR entry.',
    },
    hours: '07:00 AM - 09:00 PM (Lit up brightly after sunset)',
    closedOn: 'Open 7 days a week',
    bestTimeToVisit: 'Late afternoon (04:30 PM) so you can see it in golden hour sunlight and then lit up by night floodlights.',
    nearestMetro: {
      station: 'Qutab Minar',
      line: 'Yellow Line',
      lineColor: '#eab308',
      gate: 'Gate 2',
      walkingDistance: '1.2 km (take a 3-minute electric auto for ₹20-₹30 or walk 15 mins)',
    },
    transitOptions: {
      dtcBusLines: ['Bus 505', 'Bus 516', 'Bus 717', 'Bus 715'],
      nearestBusStop: 'Qutub Minar Crossing / Mehrauli Stop',
      autoFairPriceFromMetro: '₹40-₹60 for private auto; ₹20 on shared e-rickshaw',
    },
    dressCodeAndRules: [
      'Climbing inside the minaret has been restricted since 1981 for public safety',
      'Do not touch or lean on ancient stone carvings',
      'Tripods and drone cameras are strictly prohibited without written permit',
    ],
    faqs: [
      {
        q: 'Why can’t tourists climb the minaret staircase?',
        a: 'The internal spiral staircase of 379 steps was closed to visitors following a tragic stampede in 1981 to safeguard both human life and the monument structure.',
      },
      {
        q: 'What is the secret of the Iron Pillar?',
        a: 'Made in the 4th century CE under King Chandragupta II, it contains a high percentage of phosphorus and forms a protective passive iron-hydrogen-phosphate film, baffling ancient metallurgists.',
      },
    ],
    nearbyFood: [
      {
        name: 'Olive Bar & Kitchen (Fine Dine)',
        dish: 'Mediterranean Wood-fired Pizza & Mezze',
        fairPrice: '₹1200 - ₹2000 / person',
        distance: '400m near One Style Mile',
      },
      {
        name: 'Mehrauli Chaat & Parantha Carts',
        dish: 'Spicy Dal Kachori with Aloo Sabzi',
        fairPrice: '₹30 - ₹40 / plate',
        distance: '300m outside complex exit',
      },
    ],
  },
  {
    id: 'humayun-tomb',
    name: 'Humayun’s Tomb & Sunder Nursery',
    hindiName: 'हुमायूँ का मक़बरा',
    category: 'UNESCO Heritage',
    lat: 28.5933,
    lng: 77.2507,
    builtBy: 'Empress Bega Begum (Haji Begum)',
    year: '1565 - 1572 CE',
    architecture: 'Charbagh Mughal Garden-Tomb (Architect: Mirak Mirza Ghiyas)',
    summary: 'The sublime red sandstone precursor and architectural inspiration for the Taj Mahal, set within peaceful Persian geometric water gardens and adjacent to the restored 90-acre Sunder Nursery.',
    history: 'Built for the second Mughal Emperor Humayun, this tomb introduced Persian dome symmetry and the quadrilateral Charbagh (four gardens) design to India. Over 150 Mughal royals are buried here, earning it the moniker "Dormitory of the House of Timur". It was magnificently restored by the Aga Khan Trust for Culture.',
    whyVisit: 'Incredible tranquility, sublime symmetry, exquisite photography angles, and seamless access into the romantic Sunder Nursery park next door.',
    entryFee: {
      indian: 50,
      foreigner: 600,
      saarcBimstec: 50,
      childrenUnder15: 'Free',
      cameraFee: 'Free (Personal use)',
      bookingTip: 'Buy combination ticket online. Sunder Nursery next door has a separate ₹50 entry ticket and is worth visiting together!',
    },
    hours: '06:00 AM - 06:00 PM (Sunrise to Sunset)',
    closedOn: 'Open 7 days a week',
    bestTimeToVisit: 'Morning 07:30 - 10:00 AM for soft morning light, birdsong, and uncrowded walkways.',
    nearestMetro: {
      station: 'Jawaharlal Nehru (JLN) Stadium',
      line: 'Violet Line',
      lineColor: '#8b5cf6',
      gate: 'Gate 2 or 3',
      walkingDistance: '1.2 km (5 min auto ride ₹40-₹60)',
    },
    transitOptions: {
      dtcBusLines: ['Bus 411', 'Bus 425', 'Bus 429', 'Bus 894'],
      nearestBusStop: 'Nizamuddin West / Dargah Stop',
      autoFairPriceFromMetro: '₹40 - ₹50 from JLN Stadium or Khan Market Metro',
    },
    dressCodeAndRules: [
      'Respectful attire; removal of footwear required to step onto the upper marble plinth',
      'No flying drones allowed in the airspace',
      'Keep quiet around the cenotaph halls',
    ],
    faqs: [
      {
        q: 'Is it really the prototype of the Taj Mahal?',
        a: 'Yes! Emperor Shah Jahan and his architects drew major inspiration from Humayun’s Tomb’s double-dome structure, arched alcoves (iwans), and Persian water channels.',
      },
      {
        q: 'Can I visit Hazrat Nizamuddin Dargah nearby?',
        a: 'Yes, the sufi shrine of Hazrat Nizamuddin Auliya is right across Mathura Road. Thursdays evening Qawwali sessions (around 7:00 PM) are magical (free entry; dress conservatively).',
      },
    ],
    nearbyFood: [
      {
        name: 'Ghalib Kabab Corner (Nizamuddin Basti)',
        dish: 'Mutton Shami & Seekh Kebabs with Roomali Roti',
        fairPrice: '₹140 - ₹220 / plate',
        distance: '700m in Nizamuddin West',
      },
      {
        name: 'Fabcafe by the Lake (Sunder Nursery)',
        dish: 'Organic Kokum Cooler & Ladakhi Thukpa',
        fairPrice: '₹400 - ₹700',
        distance: 'Inside Sunder Nursery grounds',
      },
    ],
  },
  {
    id: 'india-gate',
    name: 'India Gate & Kartavya Path',
    hindiName: 'इण्डिया गेट',
    category: 'Modern & Civic',
    lat: 28.6129,
    lng: 77.2295,
    builtBy: 'Sir Edwin Lutyens',
    year: '1921 - 1931 CE',
    architecture: 'Triumphal Arch (Granite & Pale Red Sandstone)',
    summary: 'India’s 42-meter high national war memorial arch commemorating 84,000 soldiers, linked with the National War Memorial and the grand ceremonial Kartavya Path boulevard.',
    history: 'Originally named All India War Memorial, designed by Edwin Lutyens akin to Paris’s Arc de Triomphe. It commemorates soldiers of the British Indian Army who died in World War I and the Third Anglo-Afghan War. The Amar Jawan Jyoti flame burned beneath it since 1971 before being merged with the grand National War Memorial flame in 2022.',
    whyVisit: 'Bustling evening atmosphere, lush lawns, illuminated water fountains, street ice-cream vendors, and solemn patriotic tributes.',
    entryFee: {
      indian: 0,
      foreigner: 0,
      saarcBimstec: 0,
      childrenUnder15: 'Free',
      cameraFee: 'Free',
      bookingTip: '100% Free public monument. No ticket needed anywhere!',
    },
    hours: 'Open 24 hours (Lawn lights and fountains on from 06:30 PM to 10:00 PM)',
    closedOn: 'Open every day (occasional security restrictions around Republic Day Jan 20-26)',
    bestTimeToVisit: '06:30 PM to 09:30 PM for cool evening breezes, vibrant night lights, and street treats.',
    nearestMetro: {
      station: 'Central Secretariat or Udyog Bhawan',
      line: 'Yellow Line & Violet Line interchange',
      lineColor: '#eab308',
      gate: 'Gate 3 (Central Secretariat)',
      walkingDistance: '1 km along Kartavya Path or 3 min e-cart',
    },
    transitOptions: {
      dtcBusLines: ['Bus 505', 'Bus 522', 'Bus 620', 'Bus 725', 'Bus 890'],
      nearestBusStop: 'National Stadium / India Gate Circle',
      autoFairPriceFromMetro: '₹40-₹50 from Central Secretariat or Barakhamba Road',
    },
    dressCodeAndRules: [
      'Casual clothing permitted',
      'Do not litter or step into restricted memorial flame cordons',
      'Touts may sell light-up toys or balloons; negotiate firmly or say "Nahi chahiye" (don’t want)',
    ],
    faqs: [
      {
        q: 'Can we picnic on the lawns?',
        a: 'Yes, sitting on the sprawling lawns along Kartavya Path is one of Delhiites’ favorite evening pastimes. Just make sure to put all garbage in bins.',
      },
      {
        q: 'What should ice cream or chana jor garam cost here?',
        a: 'Ice cream cones: printed MRP (₹20 to ₹60). Never pay above printed MRP! Chana jor garam / bhelpuri cone: ₹30 to ₹50 maximum.',
      },
    ],
    nearbyFood: [
      {
        name: 'Pandara Road Food Market (Gulati / Havemore)',
        dish: 'Iconic Butter Chicken, Dal Makhani & Garlic Naan',
        fairPrice: '₹600 - ₹950 / person',
        distance: '900m southeast of India Gate',
      },
      {
        name: 'Andhra Bhavan Canteen (Ashoka Road)',
        dish: 'Unlimited South Indian Veg Thali & Mutton Fry',
        fairPrice: '₹180 - ₹300',
        distance: '1.2 km northwest',
      },
    ],
  },
  {
    id: 'lotus-temple',
    name: 'Lotus Temple (Baháʼí House of Worship)',
    hindiName: 'कमल मंदिर',
    category: 'Sacred & Spiritual',
    lat: 28.5535,
    lng: 77.2588,
    builtBy: 'Architect Fariborz Sahba',
    year: 'Completed 1986',
    architecture: 'Modern Expressionist Pure White Pentikon Marble',
    summary: 'A breathtaking 27-petal blooming lotus structure dedicated to the oneness of humanity and all religions, surrounded by 9 turquoise ponds.',
    history: 'Constructed using white marble from Mount Pentelikon in Greece (the same source as the Parthenon). The Baháʼí faith emphasizes unity of God, religion, and mankind. The central hall holds 2,500 people with no religious idols, pictures, or sermons—only pure meditative silence and sacred scriptures read aloud.',
    whyVisit: 'Serene pin-drop silence in the massive dome, pristine ponds, and brilliant architectural geometry.',
    entryFee: {
      indian: 0,
      foreigner: 0,
      saarcBimstec: 0,
      childrenUnder15: 'Free',
      cameraFee: 'Free outside (Strictly no photography inside prayer hall)',
      bookingTip: 'Completely free entry. Ignore anyone offering fast-track tickets outside.',
    },
    hours: '08:30 AM - 05:00 PM (Winter) / 05:30 PM (Summer)',
    closedOn: 'Mondays',
    bestTimeToVisit: 'Weekday mornings (09:00 - 10:30 AM) to experience the serene acoustic prayer hall without weekend tourist crowds.',
    nearestMetro: {
      station: 'Kalkaji Mandir',
      line: 'Violet Line & Magenta Line interchange',
      lineColor: '#8b5cf6',
      gate: 'Gate 2',
      walkingDistance: '500 meters (5-7 mins walk)',
    },
    transitOptions: {
      dtcBusLines: ['Bus 425', 'Bus 429', 'Bus 511', 'Bus 548'],
      nearestBusStop: 'Kalkaji Mandir Bus Depot',
      autoFairPriceFromMetro: 'Short 5 min walk, or ₹30 rickshaw',
    },
    dressCodeAndRules: [
      'Footwear must be deposited at free volunteer-run shoe counters (keep your token safe!)',
      'Absolute silence is mandatory inside the central hall',
      'Modest clothing covering shoulders and knees',
    ],
    faqs: [
      {
        q: 'Can people of any religion enter?',
        a: 'Yes! The Baháʼí Temple is open to people of all faiths, castes, and nationalities for quiet meditation and prayer.',
      },
      {
        q: 'How long does the visit take?',
        a: 'Approximately 45 to 60 minutes including shoe drop and quiet meditation inside.',
      },
    ],
    nearbyFood: [
      {
        name: 'CR Park Market No. 1 & 2 (Chittaranjan Park)',
        dish: 'Kolkata Kathi Rolls, Puchka & Bengali Fish Fry',
        fairPrice: '₹60 - ₹140',
        distance: '1.5 km west (Delhi’s mini Kolkata)',
      },
      {
        name: 'Govinda’s Restaurant (ISKCON Temple nearby)',
        dish: 'Pure Vegetarian Satvik Buffet',
        fairPrice: '₹450 - ₹650 / person',
        distance: '900m',
      },
    ],
  },
  {
    id: 'jama-masjid',
    name: 'Jama Masjid (Masjid-i-Jahan-Numa)',
    hindiName: 'जामा मस्जिद',
    category: 'Sacred & Spiritual',
    lat: 28.6507,
    lng: 77.2334,
    builtBy: 'Mughal Emperor Shah Jahan',
    year: '1650 - 1656 CE',
    architecture: 'Mughal Red Sandstone and Pure White Marble',
    summary: 'One of the largest mosques in India, capable of holding 25,000 worshippers in its sprawling courtyard, featuring 40-meter minarets overlooking Old Delhi.',
    history: 'Inaugurated by Syed Abdul Ghafoor Shah Bukhari of Bukhara in 1656. Built at a cost of 1 million rupees of that era by over 5,000 workers. The courtyard provides a commanding 360-degree vista of Old Delhi’s bustling bazaars, and climbing the southern minaret offers the most famous rooftop viewpoint of the capital.',
    whyVisit: 'Feel the heartbeat of medieval Shahjahanabad, gaze over Old Delhi from the southern minaret, and step immediately into Matia Mahal food street.',
    entryFee: {
      indian: 0,
      foreigner: 0,
      saarcBimstec: 0,
      childrenUnder15: 'Free',
      cameraFee: '₹300 for DSLR/camera phone (ASI managed)',
      bookingTip: 'Mosque entry is FREE for everyone! Beware of aggressive gatekeepers demanding ₹300-₹500 "entry fees" from foreigners. Only pay if carrying a professional camera.',
    },
    hours: '07:00 AM - 12:00 PM and 01:30 PM - 06:30 PM (Closed to tourists during Namaz prayer times)',
    closedOn: 'Open every day (Tourists restricted during Friday afternoon congregational prayers)',
    bestTimeToVisit: 'Early morning (07:30 - 09:30 AM) before noon prayers and afternoon sun.',
    nearestMetro: {
      station: 'Jama Masjid',
      line: 'Violet Line (Heritage Line)',
      lineColor: '#8b5cf6',
      gate: 'Gate 2 (brings you directly facing Gate 3 of the mosque)',
      walkingDistance: '200 meters',
    },
    transitOptions: {
      dtcBusLines: ['Bus 118', 'Bus 405', 'Bus 502', 'Bus 729'],
      nearestBusStop: 'Jama Masjid Bus Stop',
      autoFairPriceFromMetro: 'Walking distance (2 mins)',
    },
    dressCodeAndRules: [
      'Legs and arms must be covered; robes/lungis provided at gate for small rental (₹50-₹100)',
      'Shoes must be removed at the steps (carry a tote bag to hold your shoes free of charge)',
      'Respect worshippers and do not photograph people during active prayers',
    ],
    faqs: [
      {
        q: 'Can I climb the southern minaret?',
        a: 'Yes, for an additional fee of ~₹100, you can climb the narrow 130-step spiral staircase inside the southern minaret for the highest panoramic view of Old Delhi.',
      },
      {
        q: 'What is the best way to avoid shoe scams?',
        a: 'Carry your own lightweight cloth bag in your backpack, slip your shoes into it, and carry it with you into the courtyard. This avoids paying pushy "shoe-caretaker" charges.',
      },
    ],
    nearbyFood: [
      {
        name: 'Karim’s (Gali Kababian, Matia Mahal)',
        dish: 'Mutton Nihari, Chicken Jahangiri & Khamiri Roti',
        fairPrice: '₹300 - ₹500 / person',
        distance: '150m from Gate 1',
      },
      {
        name: 'Al Jawahar Restaurant',
        dish: 'Mutton Korma & Changezi Chicken',
        fairPrice: '₹280 - ₹450 / person',
        distance: '120m from Gate 1',
      },
      {
        name: 'Aslam Butter Chicken',
        dish: 'Tandoori Chicken drenched in melted Amul butter & curd',
        fairPrice: '₹260 (half) / ₹480 (full)',
        distance: '300m down Matia Mahal lane',
      },
    ],
  },
  {
    id: 'akshardham',
    name: 'Swaminarayan Akshardham Temple',
    hindiName: 'अक्षरधाम मंदिर',
    category: 'Sacred & Spiritual',
    lat: 28.6127,
    lng: 77.2773,
    builtBy: 'BAPS Swaminarayan Sanstha & Pramukh Swami Maharaj',
    year: 'Inaugurated 2005',
    architecture: 'Ancient Vastu Shastra & Pancharatra Shastra (Rajasthani Pink Sandstone & Carrara Marble)',
    summary: 'A monumental Hindu spiritual & cultural campus spanning 100 acres on the banks of Yamuna, built without any structural steel, featuring 234 carved pillars and 20,000 murtis.',
    history: 'Crafted over 5 years by 7,000 artisans and 4,000 volunteers. The central monument is 141 feet high and 316 feet wide, encasing intricate carvings of deities, dancers, musicians, and 148 life-sized elephant statues (Gajendra Pith) depicting peace and compassion.',
    whyVisit: 'The mesmerizing Sahaj Anand musical water fountain show at dusk, the boat ride depicting 10,000 years of Vedic Indian history, and sheer scale of hand-carved stone.',
    entryFee: {
      indian: 0,
      foreigner: 0,
      saarcBimstec: 0,
      childrenUnder15: 'Free',
      cameraFee: 'Cameras/Phones completely barred from campus',
      bookingTip: 'Complex entry is 100% free! Exhibition tickets (Boat ride + Hall of Values) are ₹250 adults / ₹150 kids. Musical water show ticket is ₹90.',
    },
    hours: '10:00 AM - 08:00 PM (Mandir darshan closes 06:30 PM)',
    closedOn: 'Mondays',
    bestTimeToVisit: '03:30 PM so you can view the exhibitions and stay for the 07:15 PM water fountain show.',
    nearestMetro: {
      station: 'Akshardham',
      line: 'Blue Line',
      lineColor: '#3b82f6',
      gate: 'Gate 1',
      walkingDistance: '350 meters (5 min walk)',
    },
    transitOptions: {
      dtcBusLines: ['Bus 347', 'Bus 378', 'Bus 469', 'Bus 534'],
      nearestBusStop: 'Akshardham Temple Flyover Stop',
      autoFairPriceFromMetro: 'Short walk directly from metro foot-over-bridge',
    },
    dressCodeAndRules: [
      'STRICT ELECTRONICS BAN: Mobile phones, smart watches, power banks, usb drives, and cameras are prohibited. Secure free cloakroom lockers available at entry.',
      'Dress code: Shoulders, chest, and knees must be covered. Sarongs provided at security deposit if needed.',
    ],
    faqs: [
      {
        q: 'Why are mobile phones not allowed?',
        a: 'For stringent anti-terror security protocols and to preserve an unhurried, serene spiritual ambiance without screen distractions.',
      },
      {
        q: 'Is there food inside?',
        a: 'Yes, Premvati Food Court inside serves clean, affordable, pure vegetarian Indian dishes, thalis, and fresh snacks.',
      },
    ],
    nearbyFood: [
      {
        name: 'Premvati Food Court (Inside Complex)',
        dish: 'Swaminarayan Thali, Dhokla & Fresh Masala Dosa',
        fairPrice: '₹120 - ₹220 / person',
        distance: 'Inside temple grounds',
      },
    ],
  },
  {
    id: 'agrasen-ki-baoli',
    name: 'Agrasen ki Baoli (Ancient Stepwell)',
    hindiName: 'अग्रसेन की बावली',
    category: 'Gardens & Relics',
    lat: 28.6258,
    lng: 77.2250,
    builtBy: 'Legendary King Agrasen / Rebuilt in Tughlaq/Lodi Era',
    year: '14th Century CE',
    architecture: 'Ancient Stepwell with 103 red sandstone steps on 3 levels',
    summary: 'A dramatic, moody 60-meter deep ancient stepwell hidden right behind modern high-rises in Connaught Place, famous for atmospheric gothic stone arches.',
    history: 'A protected monument under the Archaeological Survey of India. Stepwells (baolis) were vital civic reservoirs in arid North India to collect rainwater and provide cool community retreats during harsh summer months. Popularized globally in Bollywood films such as PK and Sultan.',
    whyVisit: 'Striking contrasting perspectives between 14th-century antiquity and towering CP corporate skyline, highly photogenic staircase descending into shadow.',
    entryFee: {
      indian: 0,
      foreigner: 0,
      saarcBimstec: 0,
      childrenUnder15: 'Free',
      cameraFee: 'Free',
      bookingTip: '100% Free entry. Takes around 25 minutes to explore.',
    },
    hours: '09:00 AM - 05:30 PM',
    closedOn: 'Open every day',
    bestTimeToVisit: 'Midday 11:00 AM - 02:00 PM when sunlight illuminates the deep steps and arches.',
    nearestMetro: {
      station: 'Barakhamba Road or Janpath',
      line: 'Blue Line (Barakhamba) or Violet Line (Janpath)',
      lineColor: '#3b82f6',
      gate: 'Gate 4 (Barakhamba Road)',
      walkingDistance: '700 meters (8 mins walk)',
    },
    transitOptions: {
      dtcBusLines: ['Bus 440', 'Bus 522', 'Bus 620', 'Bus 720'],
      nearestBusStop: 'Max Mueller Bhavan / Kasturba Gandhi Marg',
      autoFairPriceFromMetro: '₹40 auto from Connaught Place Inner Circle',
    },
    dressCodeAndRules: [
      'Watch your step on historic stone stairs',
      'Do not jump over safety railings at lower water well',
    ],
    faqs: [
      {
        q: 'Is it really haunted?',
        a: 'Urban folklore and internet ghost hunters dubbed it haunted due to roosting bats and deep shadows, but in reality, it is a peaceful historical architectural gem filled with selfie-takers and history buffs.',
      },
    ],
    nearbyFood: [
      {
        name: 'Wenger’s Bakery (Connaught Place A-Block)',
        dish: 'Shamia Patty, Chicken Patty & Chocolate Mousse',
        fairPrice: '₹60 - ₹150',
        distance: '900m at Inner Circle CP',
      },
      {
        name: 'Saravana Bhavan (Janpath)',
        dish: 'Ghee Roast Dosa & Filter Coffee',
        fairPrice: '₹180 - ₹280',
        distance: '800m',
      },
    ],
  },
];

export const DELICACIES_DATA: FoodDish[] = [
  {
    id: 'chole-bhature',
    name: 'Delhi Chole Bhature',
    hindiName: 'छोले भटूरे',
    category: 'Breakfast',
    type: 'Veg',
    spiceLevel: 'Spicy',
    fairPriceRange: '₹70 - ₹130 (Street / Iconic) | ₹250 - ₹400 (AC Restaurants)',
    ripOffAlert: 'Never pay more than ₹150 at any street food stall or roadside joint! If a tourist joint charges ₹350+ for street-style chole, it is a high-markup tourist spot.',
    description: 'Delhi’s undisputed morning king: fluffy, deep-fried leavened bread (bhatura) paired with dark, tangy, slow-cooked chickpeas steeped with tea-leaf color, anardana (pomegranate seed), ginger juliennes, and spicy amla pickle.',
    authenticRecipeSummary: 'Chickpeas soaked overnight, boiled with black tea leaves and whole garam masala, then simmered in a spiced tomato-onion bhuna gravy with kasuri methi and roasted cumin. Bhature dough uses fermented maida with curd or paneer stuffing.',
    famousSpots: [
      {
        name: 'Sita Ram Diwan Chand',
        area: 'Chuna Mandi, Paharganj',
        expectedCost: '₹100 per plate (comes with 2 paneer-stuffed bhature + spiced aloo)',
        tip: 'Legendary since 1950. Crowded on Sunday mornings, order quick token at counter.',
      },
      {
        name: 'Chache Di Hatti',
        area: 'Kamla Nagar, North Campus',
        expectedCost: '₹80 per plate',
        tip: 'Serves out by 1:30 PM every single day. Go early!',
      },
      {
        name: 'Kwality Restaurant',
        area: 'Regal Building, Connaught Place',
        expectedCost: '₹385 + taxes',
        tip: 'Heritage fine dining version with giant bhature served since the 1940s.',
      },
    ],
    orderingTipHindi: 'Bhaiya ek plate Chole Bhature lagana, pyaaz aur mirchi ka achaar thoda extra dena!',
    orderingTipEnglish: 'Brother, please give one plate Chole Bhature with extra onions and pickled chili.',
  },
  {
    id: 'butter-chicken',
    name: 'Old Delhi Original Butter Chicken (Murgh Makhani)',
    hindiName: 'बटर चिकन (मुर्ग़ मख़नी)',
    category: 'Curry & Bread',
    type: 'Non-Veg',
    spiceLevel: 'Medium',
    fairPriceRange: '₹380 - ₹550 (Half) | ₹650 - ₹950 (Full at top dhabas)',
    ripOffAlert: 'Authentic butter chicken is NOT overly sweet like dessert. It should have a rich velvety tomato base with a buttery tang and smoky tandoor aroma.',
    description: 'Invented in Delhi post-partition in 1947 by Kundan Lal Gujral at Moti Mahal Daryaganj to prevent leftover tandoori chicken from drying out, combining it with tomatoes, butter, and rich cream.',
    authenticRecipeSummary: 'Charcoal-tandoor roasted chicken pieces simmered gently in a silky tomato gravy infused with green cardamom, kasuri methi, butter, and fresh malai.',
    famousSpots: [
      {
        name: 'Gulati Restaurant',
        area: 'Pandara Road Market',
        expectedCost: '₹625 (Half) / ₹995 (Full)',
        tip: 'Open till late night (midnight). Expect a 20-30 min wait during peak dinner hours.',
      },
      {
        name: 'Moti Mahal Delux',
        area: 'Daryaganj (Original)',
        expectedCost: '₹550 (Half)',
        tip: 'The historic birthplace of the recipe.',
      },
      {
        name: 'Havemore',
        area: 'Pandara Road',
        expectedCost: '₹620 (Half)',
        tip: 'Slightly spicier, rich aromatic gravy beloved by Delhi locals.',
      },
    ],
    orderingTipHindi: 'Ek plate Butter Chicken aur do Butter Naan krispy dena!',
    orderingTipEnglish: 'One plate Butter Chicken and two crispy butter naans please!',
  },
  {
    id: 'paranthe-wali-gali',
    name: 'Paranthe Wali Gali Deep-Tawa Paranthas',
    hindiName: 'पराठे वाली गली के पराठे',
    category: 'Breakfast',
    type: 'Veg',
    spiceLevel: 'Mild',
    fairPriceRange: '₹80 - ₹130 per parantha (includes unlimited 3 seasonal sabzis + sweet chutney)',
    ripOffAlert: 'Do not pay extra for the sabzis (pumpkin kaddu, spicy aloo, banana chutney)—they are traditionally unlimited refills included in the parantha cost.',
    description: 'Century-old vegetarian eateries in Chandni Chowk serving deep-fried paranthas in pure desi ghee, stuffed with everything from potato, paneer, and cauliflower to rabri, cashew-raisin (mewa), and lemon.',
    authenticRecipeSummary: 'Rolled thin, generously filled with seasoned stuffing, then fried in a shallow iron kadhai filled with pure desi ghee until golden and blistered crisp.',
    famousSpots: [
      {
        name: 'Pt. Babu Ram Devidayal Paranthewale',
        area: 'Gali Paranthe Wali, Chandni Chowk',
        expectedCost: '₹90 - ₹120 per parantha',
        tip: 'Try the Rabri Parantha for dessert and Nimbu (lemon) or Matar (peas) for mains.',
      },
      {
        name: 'Pt. Kanhaiyalal Durgaprasad',
        area: 'Gali Paranthe Wali',
        expectedCost: '₹85 - ₹110',
        tip: 'Operating continuously since 1875.',
      },
    ],
    orderingTipHindi: 'Bhaiya ek Aloo-Pyaaz aur ek Rabri parantha kardo, sabzi thodi garama-garam lana.',
    orderingTipEnglish: 'Brother, make one potato-onion and one rabri parantha, and bring piping hot curry.',
  },
  {
    id: 'nihari-roti',
    name: 'Purani Dilli Mutton Nihari & Khamiri Roti',
    hindiName: 'निहारी और ख़मीरी रोटी',
    category: 'Non-Veg Heritage',
    type: 'Non-Veg',
    spiceLevel: 'Spicy',
    fairPriceRange: '₹180 - ₹320 per plate',
    ripOffAlert: 'Morning nihari gets over by 8:30 AM in Old Delhi alleys. Evening nihari starts around 6:00 PM. Price should never exceed ₹350 at street-side heritage outlets.',
    description: 'A slow-cooked, royal Mughal stew originating from the Arabic word "Nahar" (morning). Mutton shanks cooked overnight with 40+ aromatic spices and marrow bone broth, topped with sliced ginger, chilies, and lime.',
    authenticRecipeSummary: 'Simmered overnight on low charcoal embers in sealed degs (copper cauldrons) with flour liaison, saffron, mace, nutmeg, and roghan fat.',
    famousSpots: [
      {
        name: 'Karim’s Historic Outlet',
        area: 'Gali Kababian, Jama Masjid Gate 1',
        expectedCost: '₹340 per portion',
        tip: 'Established 1913 by Haji Karimuddin, royal chef descendant of Bahadur Shah Zafar.',
      },
      {
        name: 'Al Jawahar',
        area: 'Opposite Jama Masjid Gate 1',
        expectedCost: '₹310 per portion',
        tip: 'Favored by Indian Prime Minister Jawaharlal Nehru when visiting Old Delhi.',
      },
      {
        name: 'Haji Shabrati Nihari Wale',
        area: 'Chitli Qabar, Matiya Mahal',
        expectedCost: '₹180 - ₹240',
        tip: 'Pure melt-in-the-mouth shanks, legendary among hardcore Old Delhi foodies.',
      },
    ],
    orderingTipHindi: 'Bhaiya ek plate Nalli Nihari sath mein do garam Khamiri Roti dena.',
    orderingTipEnglish: 'Brother, one plate bone marrow Nihari with two hot leavened khamiri rotis please.',
  },
  {
    id: 'dahi-bhalla-chaat',
    name: 'Natraj Dahi Bhalla & Crispy Aloo Tikki',
    hindiName: 'दही भल्ला और आलू टिक्की',
    category: 'Street Snack',
    type: 'Veg',
    spiceLevel: 'Mild',
    fairPriceRange: '₹60 - ₹100 per plate',
    ripOffAlert: 'Watch out for vendors reusing oil or tap water in chaat. Only eat at crowded, certified stalls where curd is fresh and turnover is high.',
    description: 'Soft-as-cloud urad dal dumplings soaked in chilled sweet-whipped yogurt, drenched in homemade cumin-rich red tamarind saunth chutney and mint coriander sauce.',
    authenticRecipeSummary: 'Urad dal batter whipped by hand for lightness, deep fried, soaked in asafoetida water, submerged in chilled thick sweet curd and dusted with roasted jeera powder and black salt.',
    famousSpots: [
      {
        name: 'Natraj Dahi Bhalle Wala',
        area: 'Chandni Chowk Main Road (near Metro Exit)',
        expectedCost: '₹80 per plate',
        tip: 'Only makes two items: Dahi Bhalle and Aloo Tikki. In business since 1940.',
      },
      {
        name: 'Prabhu Chaat Bhandar (UPSC Chaat)',
        area: 'Shahjahan Road, near Khan Market',
        expectedCost: '₹90 per plate',
        tip: 'Delhi civil servants’ favorite evening haunt.',
      },
    ],
    orderingTipHindi: 'Bhaiya saunth thodi zyaada aur meethi dahi thandi wali daalna!',
    orderingTipEnglish: 'Brother, put extra sweet tamarind chutney and chilled sweetened curd!',
  },
  {
    id: 'daulat-ki-chaat',
    name: 'Daulat Ki Chaat (Winter Cloud Dessert)',
    hindiName: 'दौलत की चाट',
    category: 'Dessert & Kulfi',
    type: 'Veg',
    spiceLevel: 'Mild',
    fairPriceRange: '₹50 - ₹100 per kulhad (clay bowl)',
    ripOffAlert: 'Available ONLY in winter months (November to February) because it melts in Delhi heat! If sold in May/June, it is a synthetic substitute.',
    description: 'A miraculous, ethereal dessert made by churning sweetened milk and cream for hours in the frosty morning dew, resulting in an airy cloud garnished with saffron, pistachios, and edible silver vark.',
    authenticRecipeSummary: 'Raw milk and cream exposed to cold night dew for hours, hand-churned before dawn to collect the rising foam, gently lifted and layered with boora (unrefined sugar) and mawa crumble.',
    famousSpots: [
      {
        name: 'Khemchand Adesh Kumar Daulat ki Chaat',
        area: 'Nai Sarak / Kinari Bazaar, Chandni Chowk',
        expectedCost: '₹60 small / ₹100 large clay cup',
        tip: 'Carried on large brass trays covered with muslin cloth.',
      },
    ],
    orderingTipHindi: 'Bhaiya ek kulhad Daulat ki Chaat banaiye, kesar aur khoya acche se daalna.',
    orderingTipEnglish: 'Brother, please make one clay cup of Daulat ki Chaat with generous saffron and mawa.',
  },
];

export const MARKETS_DATA: MarketGuide[] = [
  {
    id: 'janpath-market',
    name: 'Janpath & Tibetan Market',
    specialty: 'Boho jewelry, brass handicrafts, pashmina shawls, vintage posters, Indian kurtas',
    nearestMetro: 'Janpath or Rajiv Chowk',
    metroLine: 'Violet Line (Janpath Gate 1) or Yellow/Blue Line (Rajiv Chowk Gate 6)',
    closedOn: 'Sundays (Some main shops open, street stalls closed)',
    bargainingLevel: 'High (Expect 50-70% haggle)',
    scamAlerts: [
      '"Pure Kashmiri Pashmina" sold for ₹500 is 100% synthetic viscose/polyester! Real pashmina costs ₹4,000+.',
      'Shopkeepers often start with quotes 3x the actual fair price for foreign tourists.',
      'Avoid touts near the pavement offering to take you to "Government Approved Emporiums". They receive 30-50% kickback commissions.',
    ],
    fairPriceBenchmarks: [
      { item: 'Silver-plated tribal earrings', quotedPrice: '₹400 - ₹600', fairPrice: '₹120 - ₹200' },
      { item: 'Embroidered cotton kurta', quotedPrice: '₹800 - ₹1,200', fairPrice: '₹350 - ₹500' },
      { item: 'Brass incense holder / small statue', quotedPrice: '₹900', fairPrice: '₹300 - ₹450' },
      { item: 'Cotton block-print scarf / dupatta', quotedPrice: '₹500', fairPrice: '₹150 - ₹250' },
    ],
    bestStreetBitesNearby: ['Depaul’s Cold Coffee & Cheese Patty (₹60)', 'Saravana Bhavan South Indian (₹220)'],
    insiderTip: 'Start your counter-offer at 40% of their quoted price. Be polite, smile, and use the walk-away technique ("Theek hai bhaiya, rehne do"). 8 out of 10 times they will call you back!',
  },
  {
    id: 'sarojini-nagar',
    name: 'Sarojini Nagar Market',
    specialty: 'Export surplus fashion, Zara/H&M factory overruns, jackets, denim, hand bags',
    nearestMetro: 'Sarojini Nagar',
    metroLine: 'Pink Line (Gate 1 is 50 meters from market entrance)',
    closedOn: 'Mondays (Street hawkers still sell on Mondays, but main shops closed)',
    bargainingLevel: 'High (Expect 50-70% haggle)',
    scamAlerts: [
      'Check for missing buttons, broken zippers, or torn underarms—export surplus often contains manufacturing defects.',
      'Pickpocketing is prevalent during peak evening rush. Keep backpacks zipped in front of your chest.',
    ],
    fairPriceBenchmarks: [
      { item: 'Branded surplus t-shirt / crop top', quotedPrice: '₹350 - ₹500', fairPrice: '₹150 - ₹250' },
      { item: 'Denim jeans / trousers', quotedPrice: '₹800 - ₹1,000', fairPrice: '₹350 - ₹500' },
      { item: 'Winter jacket / trench coat', quotedPrice: '₹1,800', fairPrice: '₹700 - ₹1,000' },
      { item: 'Fashion tote bag / sling bag', quotedPrice: '₹600', fairPrice: '₹250 - ₹350' },
    ],
    bestStreetBitesNearby: ['Khandani Pakode Wala nearby at Ring Road (₹20/pc)', 'Momos with fiery garlic dip (₹70)'],
    insiderTip: 'Carry cash in ₹100 and ₹50 notes! Vendors hate breaking ₹500 notes after fierce bargaining. Tuesday mornings have the freshest newly unpacked stock.',
  },
  {
    id: 'chandni-chowk',
    name: 'Chandni Chowk & Khari Baoli Spice Market',
    specialty: 'Spices, tea, dry fruits, wedding lehengas, bridal jewelry, attar (perfume oil)',
    nearestMetro: 'Chandni Chowk or Chawri Bazar',
    metroLine: 'Yellow Line',
    closedOn: 'Sundays',
    bargainingLevel: 'Moderate (20-30%)',
    scamAlerts: [
      'In Khari Baoli, buy whole spices by weight from established indoor wholesale shops rather than street vendors selling colored sawdust as saffron.',
      'Real Kashmiri saffron has dry trumpet-like dark red strands that turn water yellow slowly, not immediately red.',
    ],
    fairPriceBenchmarks: [
      { item: 'Whole Green Cardamom (100g premium)', quotedPrice: '₹400', fairPrice: '₹260 - ₹300' },
      { item: 'Kashmiri Mongra Saffron (1 gram)', quotedPrice: '₹450', fairPrice: '₹280 - ₹350' },
      { item: 'Traditional Glass Bangles (dozen)', quotedPrice: '₹150', fairPrice: '₹60 - ₹90' },
    ],
    bestStreetBitesNearby: ['Old Famous Jalebi Wala (₹80)', 'Giani Rabri Falooda (₹100)', 'Kuremal Fruit Kulfi (₹120)'],
    insiderTip: 'Hire a registered cycle rickshaw from Chandni Chowk Metro for ₹150 - ₹200 for 1 hour to navigate the labyrinthine alleys without exhaustion.',
  },
  {
    id: 'dilli-haat-ina',
    name: 'Dilli Haat (INA Crafts & Food Village)',
    specialty: 'Pan-India state handicrafts, pashmina, Madhubani paintings, leather mojris, silver jewelry',
    nearestMetro: 'Delhi Haat - INA',
    metroLine: 'Yellow Line & Pink Line interchange (Gate 5 directly opens at entrance)',
    closedOn: 'Open 365 days a year (10:30 AM - 10:00 PM)',
    bargainingLevel: 'Moderate (20-30%)',
    scamAlerts: [
      'Entry is ticketed: ₹30 for Indians, ₹100 for Foreigners. This keeps touts and persistent beggars out, making it the safest market for foreign travelers.',
      'Stalls rotate every 15 days by government lottery of authentic state master artisans.',
    ],
    fairPriceBenchmarks: [
      { item: 'Hand-painted Madhubani silk artwork', quotedPrice: '₹1,500', fairPrice: '₹900 - ₹1,200' },
      { item: 'Leather handcrafted Mojri juttis', quotedPrice: '₹800', fairPrice: '₹450 - ₹600' },
      { item: 'Assam / Sikkim steamed momo platter', quotedPrice: '₹150 (fixed)', fairPrice: '₹140 - ₹180' },
    ],
    bestStreetBitesNearby: ['Momo & Fruit Beer at Sikkim Stall', 'Litti Chokha at Bihar Stall', 'Kahwa Tea at Kashmir Stall'],
    insiderTip: 'Dilli Haat has stalls from every Indian state! It is the best place to taste cuisines from Nagaland, Kashmir, Kerala, and Bengal all in one dinner.',
  },
];

export const METRO_LINES_DATA: MetroLineInfo[] = [
  {
    name: 'Yellow Line (Line 2)',
    colorHex: '#eab308',
    keyStations: ['Samaypur Badli', 'Chandni Chowk', 'New Delhi (Railway)', 'Rajiv Chowk (CP)', 'Central Secretariat', 'Hauz Khas', 'Qutab Minar', 'Millennium City Centre Gurugram'],
    touristSignificance: 'The tourist backbone! Connects Old Delhi (Chandni Chowk/Red Fort), Connaught Place, India Gate (Central Sec), and Qutub Minar directly.',
    firstTrain: '05:30 AM (06:00 AM Sundays)',
    lastTrain: '11:15 PM - 11:30 PM',
    frequency: 'Every 2 to 3 minutes in peak hours',
  },
  {
    name: 'Blue Line (Line 3/4)',
    colorHex: '#3b82f6',
    keyStations: ['Dwarka Sector 21', 'Rajouri Garden', 'Rajiv Chowk', 'Mandi House', 'Akshardham', 'Noida Electronic City / Vaishali'],
    touristSignificance: 'Essential for reaching Akshardham Temple and connecting East to West Delhi through central Connaught Place.',
    firstTrain: '05:30 AM',
    lastTrain: '11:10 PM',
    frequency: 'Every 2 to 4 minutes',
  },
  {
    name: 'Violet Line / Heritage Line (Line 6)',
    colorHex: '#8b5cf6',
    keyStations: ['Kashmere Gate', 'Lal Quila', 'Jama Masjid', 'Delhi Gate', 'ITO', 'Janpath', 'Central Secretariat', 'Khan Market', 'JLN Stadium (Humayun Tomb)', 'Kalkaji Mandir (Lotus Temple)'],
    touristSignificance: 'Nicknamed the "Heritage Line" as it stops directly at Red Fort, Jama Masjid, Janpath, Khan Market, Humayun’s Tomb, and Lotus Temple!',
    firstTrain: '05:45 AM',
    lastTrain: '11:20 PM',
    frequency: 'Every 3 to 5 minutes',
  },
  {
    name: 'Airport Express (Orange Line)',
    colorHex: '#f97316',
    keyStations: ['New Delhi Railway Station', 'Shivaji Stadium (CP)', 'Dhaula Kuan', 'Delhi Aerocity', 'IGI Airport Terminal 3', 'Yashobhoomi Dwarka Sec 25'],
    touristSignificance: 'High-speed 120 km/h airport shuttle. Reaches New Delhi Railway Station from IGI Airport T3 in just 19 minutes for only ₹60!',
    firstTrain: '04:45 AM',
    lastTrain: '11:40 PM',
    frequency: 'Every 10 minutes',
  },
  {
    name: 'Magenta Line (Line 8)',
    colorHex: '#d946ef',
    keyStations: ['Janakpuri West', 'Terminal 1 IGI Domestic Airport', 'Hauz Khas', 'Botanical Garden Noida'],
    touristSignificance: 'Connects directly to IGI Airport Domestic Terminal 1 and links South Delhi monuments with Hauz Khas Village.',
    firstTrain: '05:40 AM',
    lastTrain: '11:25 PM',
    frequency: 'Every 3 to 5 minutes',
  },
  {
    name: 'Pink Line (Line 7 - Ring Metro)',
    colorHex: '#ec4899',
    keyStations: ['Majlis Park', 'Sarojini Nagar', 'Dilli Haat INA', 'Lajpat Nagar', 'Hazrat Nizamuddin Railway Station', 'Shiv Vihar'],
    touristSignificance: 'Circumnavigates the city; stops right outside Sarojini Nagar fashion market, Dilli Haat, and Nizamuddin railway terminal.',
    firstTrain: '05:45 AM',
    lastTrain: '11:15 PM',
    frequency: 'Every 3 to 6 minutes',
  },
];

export const HINDI_PHRASES_DATA: HindiPhrase[] = [
  {
    id: 'p1',
    category: 'Bargaining',
    english: 'How much does this cost?',
    hindiDevanagari: 'यह कितने का है?',
    hinglishPhonetic: 'Yeh kitne ka hai?',
    literalMeaning: 'This of how much is?',
    whenToUse: 'Ask any shopkeeper or street vendor before touching or selecting goods.',
  },
  {
    id: 'p2',
    category: 'Bargaining',
    english: 'Please give me a fair price, this is too expensive!',
    hindiDevanagari: 'भैया थोड़ा ठीक-ठीक लगाओ, बहुत ज़्यादा है!',
    hinglishPhonetic: 'Bhaiya thoda theek-theek lagao, bahut zyaada hai!',
    literalMeaning: 'Brother, set a fair/proper rate, it is too high!',
    whenToUse: 'Magic bargaining phrase in Janpath, Sarojini, and Chandni Chowk. Instant respect!',
  },
  {
    id: 'p3',
    category: 'Bargaining',
    english: 'I will pay 200 Rupees, take it or leave it.',
    hindiDevanagari: 'दो सौ रुपये दूंगा, देना है तो बोलो।',
    hinglishPhonetic: 'Do sau rupaye doonga, dena hai toh bolo.',
    literalMeaning: 'Will give two hundred rupees, say if giving.',
    whenToUse: 'Your firm final offer when haggling with street sellers.',
  },
  {
    id: 'p4',
    category: 'Transit & Auto',
    english: 'Brother, will you go by the meter?',
    hindiDevanagari: 'भैया मीटर से चलोगे क्या?',
    hinglishPhonetic: 'Bhaiya meter se chaloge kya?',
    literalMeaning: 'Brother, will you go by meter?',
    whenToUse: 'First question to ask any auto-rickshaw driver in Delhi. Legally required by transport rules.',
  },
  {
    id: 'p5',
    category: 'Transit & Auto',
    english: 'How much to go to Connaught Place?',
    hindiDevanagari: 'कनॉट प्लेस जाने का कितना लोगे?',
    hinglishPhonetic: 'Connaught Place jaane ka kitna loge?',
    literalMeaning: 'How much will you take to go to CP?',
    whenToUse: 'If auto driver refuses meter, negotiate upfront before stepping inside the vehicle.',
  },
  {
    id: 'p6',
    category: 'Food & Water',
    english: 'Please make it less spicy, with no extra chili.',
    hindiDevanagari: 'कृपया कम मिर्च वाला बनाइए, तीखा मत करना।',
    hinglishPhonetic: 'Kripya kam mirch wala banaiye, teekha mat karna.',
    literalMeaning: 'Please make low chili one, do not make hot/spicy.',
    whenToUse: 'Crucial for foreign travelers when ordering chaat, curries, or snacks.',
  },
  {
    id: 'p7',
    category: 'Food & Water',
    english: 'Do you have sealed bottled water?',
    hindiDevanagari: 'क्या आपके पास सील बंद मिनरल वॉटर है?',
    hinglishPhonetic: 'Kya aapke paas seal band mineral water hai?',
    literalMeaning: 'Do you have seal-closed mineral water?',
    whenToUse: 'Always inspect the neck seal on Kinley, Aquafina, or Bisleri before purchasing (Fair price: ₹20).',
  },
  {
    id: 'p8',
    category: 'Directions',
    english: 'Where is the nearest Metro station?',
    hindiDevanagari: 'पास का मेट्रो स्टेशन कहाँ है?',
    hinglishPhonetic: 'Paas ka metro station kahan hai?',
    literalMeaning: 'Near metro station where is?',
    whenToUse: 'Ask passers-by or shopkeepers when walking in markets.',
  },
  {
    id: 'p9',
    category: 'Emergency',
    english: 'Please help me, call the police.',
    hindiDevanagari: 'मेरी मदद कीजिए, पुलिस को बुलाइए।',
    hinglishPhonetic: 'Meri madad kijiye, Police ko bulaiye.',
    literalMeaning: 'Help me, call police.',
    whenToUse: 'Emergency situation. Police emergency number in Delhi is 112 (or 100).',
  },
];
