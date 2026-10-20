import React, { useState } from 'react';
import { DELICACIES_DATA, FoodDish } from '../data/delhiData';
import { Utensils, Flame, Sparkles, Volume2, ShieldAlert, Award, Star, Search, MapPin, Check } from 'lucide-react';

const TOP_RESTAURANTS = [
  {
    name: 'Karim’s Historic (Est. 1913)',
    area: 'Gali Kababian, Jama Masjid Gate 1, Old Delhi',
    cuisine: 'Royal Mughlai & Kebabs',
    mustTry: 'Mutton Nihari, Chicken Jahangiri, Seekh Kebabs, Badam Pasanda',
    costForTwo: '₹800 - ₹1,200',
    metro: 'Jama Masjid (Violet Line)',
    rating: 4.8,
    badge: 'Heritage Legend',
    tip: 'Founded by the royal chef of the last Mughal Emperor. Best experienced for dinner.',
  },
  {
    name: 'Bukhara (ITC Maurya)',
    area: 'Diplomatic Enclave, Chanakyapuri',
    cuisine: 'North-West Frontier Tandoor',
    mustTry: 'Dal Bukhara (slow-cooked 18 hours), Sikandari Raan, Jumbo Naan',
    costForTwo: '₹8,000 - ₹12,000',
    metro: 'Durgabai Deshmukh South Campus',
    rating: 4.9,
    badge: 'World-Renowned Fine Dine',
    tip: 'Famous for having served US Presidents and world leaders. Eat with your hands as per tradition.',
  },
  {
    name: 'Gulati Restaurant',
    area: 'Pandara Road Market, near India Gate',
    cuisine: 'Iconic North Indian & Punjabi',
    mustTry: 'Butter Chicken, Dal Makhani, Kakori Kabab, Butter Naan',
    costForTwo: '₹1,600 - ₹2,200',
    metro: 'Khan Market / Central Secretariat',
    rating: 4.7,
    badge: 'Midnight Butter Chicken Capital',
    tip: 'Open until midnight! Pair your visit with a nighttime stroll at illuminated India Gate.',
  },
  {
    name: 'Sita Ram Diwan Chand',
    area: 'Chuna Mandi, Paharganj',
    cuisine: 'Delhi Street Legend',
    mustTry: 'Paneer-stuffed Bhature with Spiced Chole & Pickled Amla',
    costForTwo: '₹200 - ₹250',
    metro: 'New Delhi / RK Ashram Marg',
    rating: 4.7,
    badge: 'Ultimate Breakfast',
    tip: 'Operating since 1950. Thousands of plates sell out daily by early afternoon.',
  },
  {
    name: 'Indian Accent (The Lodhi)',
    area: 'Lodhi Road, South Delhi',
    cuisine: 'Modern Innovative Indian Gastronomy',
    mustTry: 'Duck Khurchan Cornetto, Meetha Achaar Pork Ribs, Daulat ki Chaat reimagined',
    costForTwo: '₹6,000 - ₹10,000',
    metro: 'JLN Stadium',
    rating: 4.9,
    badge: 'Ranked in World’s 50 Best',
    tip: 'Advance table reservation required 1-2 weeks prior.',
  },
  {
    name: 'Kuremal Mohan Lal Kulfi Wale (Est. 1906)',
    area: 'Sitaram Bazar, Chawri Bazar, Old Delhi',
    cuisine: 'Stuffed Fruit Kulfi Masters',
    mustTry: 'Real Mango Stuffed Kulfi, Paan Kulfi, Jamun Kulfi',
    costForTwo: '₹200 - ₹350',
    metro: 'Chawri Bazar (Yellow Line)',
    rating: 4.8,
    badge: 'Old Delhi Sweet Legacy',
    tip: 'They core real whole mangoes and pomegranates, stuff them with reduced rabri, and freeze in earthen pots.',
  },
];

export const DiningFoodGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dishes' | 'restaurants'>('dishes');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const handleSpeakPhrase = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredDishes = DELICACIES_DATA.filter((d) => {
    const matchesCat = activeCategory === 'All' || d.category === activeCategory;
    const matchesSearch =
      !searchFilter.trim() ||
      d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      d.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-[#0a1226] to-[#050814] border border-blue-700/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800/60 flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5" /> Iconic Delhi Gastronomy
            </span>
            <span className="text-xs text-slate-400">Authentic Recipes, Fair Prices &amp; Top Spots</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight">
            The Capital’s Culinary Secrets &amp; Dining Guide
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Discover the culinary soul of Delhi—from 70-year-old Old Delhi tawa paranthas and smoky butter chicken to winter cloud desserts, paired with authentic fair price ranges and Hindi ordering phrases.
          </p>
        </div>
      </div>

      {/* Main Mode Toggle: Iconic Dishes vs Top Restaurants */}
      <div className="flex items-center justify-between border-b border-blue-950 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-[#09101f] p-1.5 rounded-xl border border-blue-900/40">
          <button
            onClick={() => setActiveTab('dishes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dishes'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🍛 Famous Delhi Dishes ({DELICACIES_DATA.length})
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'restaurants'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⭐ Top-Rated Restaurants ({TOP_RESTAURANTS.length})
          </button>
        </div>

        {activeTab === 'dishes' && (
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter dishes by name..."
              className="w-full bg-[#0c1426] border border-blue-900/60 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {/* VIEW 1: DELICACIES & RECIPES */}
      {activeTab === 'dishes' && (
        <div className="space-y-6">
          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['All', 'Breakfast', 'Curry & Bread', 'Street Snack', 'Dessert & Kulfi', 'Non-Veg Heritage'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-950'
                      : 'bg-[#0a1122] text-slate-300 border-blue-950 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Dish Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="p-5 md:p-6 rounded-2xl bg-[#09101f] border border-blue-900/60 hover:border-blue-500/80 transition-all shadow-xl flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          dish.type === 'Veg'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-900/50'
                            : 'bg-rose-950 text-rose-300 border border-rose-900/50'
                        }`}
                      >
                        {dish.type}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {dish.spiceLevel} Spice
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-blue-400">
                      {dish.hindiName}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white font-heading">
                    {dish.name}
                  </h3>

                  <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
                    {dish.description}
                  </p>

                  {/* Fair Price & Scam Alert */}
                  <div className="mt-4 p-3 rounded-xl bg-[#0c1426] border border-blue-950 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Fair Price Benchmark:
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        {dish.fairPriceRange}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-300/90 flex items-start gap-1.5 pt-1 border-t border-blue-950/60">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{dish.ripOffAlert}</span>
                    </div>
                  </div>

                  {/* Recipe Secret */}
                  <div className="mt-3 text-xs text-slate-400">
                    <strong className="text-slate-300">Authentic Recipe Touch:</strong> {dish.authenticRecipeSummary}
                  </div>

                  {/* Famous Spots */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Top Verified Spots to Eat This:
                    </span>
                    <div className="space-y-1.5">
                      {dish.famousSpots.map((spot, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-[#0c1426] border border-blue-950/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                        >
                          <div>
                            <strong className="text-white">{spot.name}</strong>{' '}
                            <span className="text-slate-400">({spot.area})</span>
                            <div className="text-[11px] text-slate-500">{spot.tip}</div>
                          </div>
                          <span className="text-xs font-bold text-emerald-400 sm:text-right shrink-0">
                            {spot.expectedCost}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ordering Phrase in Hindi with Audio */}
                <div className="p-3 rounded-xl bg-[#0e1830] border border-blue-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      How to Order Like a Local:
                    </span>
                    <div className="text-xs md:text-sm font-bold text-white mt-0.5">
                      "{dish.orderingTipHindi}"
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      ({dish.orderingTipEnglish})
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeakPhrase(dish.id, dish.orderingTipHindi)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      speakingId === dish.id
                        ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                        : 'bg-blue-950/60 text-blue-200 border-blue-800 hover:bg-blue-900'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-300" />
                    <span>{speakingId === dish.id ? 'Playing...' : 'Pronounce'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: TOP-RATED RESTAURANTS */}
      {activeTab === 'restaurants' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOP_RESTAURANTS.map((rest, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#09101f] border border-blue-900/60 hover:border-blue-500 transition-all shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60 uppercase tracking-wider">
                    {rest.badge}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {rest.rating}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white font-heading">{rest.name}</h3>

                <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{rest.area}</span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500">Cuisine:</span>{' '}
                    <span className="text-slate-200 font-medium">{rest.cuisine}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Must Try:</span>{' '}
                    <span className="text-blue-300 font-semibold">{rest.mustTry}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Expected Cost:</span>{' '}
                    <span className="text-emerald-400 font-bold">{rest.costForTwo} (for two)</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Nearest Metro:</span>{' '}
                    <span className="text-cyan-300 font-medium">🚇 {rest.metro}</span>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0c1426] border border-blue-950 text-xs text-slate-300">
                <strong className="text-blue-400">Visitor Tip:</strong> {rest.tip}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
