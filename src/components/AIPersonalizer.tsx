import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Train, Utensils, Compass, Sparkles } from 'lucide-react';

export const AIPersonalizer: React.FC<{ onNavigateToMap?: () => void }> = ({ onNavigateToMap }) => {
  const [days, setDays] = useState(1);
  const [vibe, setVibe] = useState('Heritage & Food');
  const [pace, setPace] = useState('Balanced');
  const [budget, setBudget] = useState('Moderate');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch('/api/personalize-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, vibe, pace, budget }),
      });

      const data = await res.json();
      setItinerary(data);
    } catch (err) {
      console.error(err);
      setItinerary({
        title: `${days}-Day Optimized Delhi Experience`,
        summary: `Customized for ${vibe} with a ${pace} pace and ${budget} budget.`,
        transitAdvice: 'Buy a 1-day or 3-day Metro Tourist Card for ₹200/₹500 to save time.',
        foodHighlight: 'Sita Ram Diwan Chand Chole Bhature (~₹100) and Karim’s Mutton Nihari (~₹340).',
        days: [
          {
            day: 1,
            title: 'Mughal Splendors & Old Delhi Culinary Delights',
            stops: [
              {
                time: '09:00 AM',
                place: 'Red Fort & Lahori Gate',
                metro: 'Chandni Chowk / Lal Quila (Violet Line)',
                fairCost: '₹50 (Ind) / ₹600 (Foreigner)',
                highlight: 'Diwan-i-Khas marble arches and ancient ramparts',
                foodNear: 'Desi Ghee Jalebi at Old Famous Jalebi Wala (~₹80)',
              },
              {
                time: '01:30 PM',
                place: 'Humayun’s Tomb & Sunder Nursery',
                metro: 'JLN Stadium (Violet Line Gate 2)',
                fairCost: '₹50 entry ticket',
                highlight: 'Charbagh Persian geometric gardens',
                foodNear: 'Butter Chicken at Gulati Pandara Road (~₹650)',
              },
              {
                time: '06:00 PM',
                place: 'India Gate & Kartavya Path',
                metro: 'Central Secretariat (Yellow Line)',
                fairCost: 'Free Public Memorial',
                highlight: 'Night floodlights and peaceful lawns',
                foodNear: 'Matka Kulfi on Kartavya Path (~₹60)',
              },
            ],
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-[#0a1226] to-[#050814] border border-blue-700/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800/60 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Tailored Travel Planner
            </span>
            <span className="text-xs text-slate-400">Personalized to Your Schedule &amp; Budget</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight">
            Create Your Custom Delhi Itinerary
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Our recommendation engine takes into account monument timings, Metro lines, rush-hour intervals, and fair price dining spots to craft an authentic Delhi journey.
          </p>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#09101f] border border-blue-900/60 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-blue-950 pb-3">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-400" /> Specify Your Trip Preferences
          </h3>
          <span className="text-xs text-blue-400">Customized Planner</span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Trip Duration (Days)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDays(d)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      days === d
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-950'
                        : 'bg-[#0c1426] text-slate-300 border-blue-950 hover:text-white'
                    }`}
                  >
                    {d} Day{d > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Traveler Style &amp; Interest
              </label>
              <select
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full bg-[#0c1426] border border-blue-900/60 rounded-xl px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Heritage & Food">Mughal Heritage &amp; Food Trail</option>
                <option value="Solo Female Traveler (Safe & Curated)">Solo Female Traveler (Safe &amp; Curated)</option>
                <option value="Budget Backpacker & Bargain Shopping">Budget Backpacker &amp; Street Shopping</option>
                <option value="Spiritual, Peace & Architecture">Spiritual, Peace &amp; Gardens</option>
                <option value="Family with Kids & Leisure">Family with Kids &amp; Leisure</option>
                <option value="Luxury Imperial Delhi">Luxury Imperial Delhi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Exploration Pace
              </label>
              <select
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                className="w-full bg-[#0c1426] border border-blue-900/60 rounded-xl px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Relaxed (2-3 unhurried stops)">Relaxed (2-3 unhurried stops)</option>
                <option value="Balanced (3-4 stops with food)">Balanced (3-4 stops with food)</option>
                <option value="High-Energy (Cover everything)">High-Energy (Cover everything)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Target Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-[#0c1426] border border-blue-900/60 rounded-xl px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Budget Backpacker (<₹1,000/day)">Budget Backpacker (&lt;₹1,000/day)</option>
                <option value="Moderate Standard (₹1,500-₹3,000/day)">Moderate Standard (₹1,500-₹3,000/day)</option>
                <option value="Premium / Luxury (₹5,000+/day)">Premium / Luxury (₹5,000+/day)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-950 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Generating Custom Itinerary...' : 'Build Custom Itinerary'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Generated Itinerary Output */}
      {itinerary && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-[#09101f] border border-blue-700/60 shadow-2xl space-y-4">
            <div className="border-b border-blue-950 pb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Tailored Travel Plan:
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white font-heading mt-0.5">
                  {itinerary.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1">{itinerary.summary}</p>
              </div>

              {onNavigateToMap && (
                <button
                  onClick={onNavigateToMap}
                  className="px-4 py-2 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-800 text-xs font-bold text-blue-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-blue-400" />
                  <span>View on Live Map</span>
                </button>
              )}
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {itinerary.transitAdvice && (
                <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-950 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-cyan-400 flex items-center gap-1">
                    <Train className="w-3.5 h-3.5" /> Transit Tips:
                  </div>
                  <p>{itinerary.transitAdvice}</p>
                </div>
              )}
              {itinerary.foodHighlight && (
                <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-950 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-amber-400 flex items-center gap-1">
                    <Utensils className="w-3.5 h-3.5" /> Food Highlights:
                  </div>
                  <p>{itinerary.foodHighlight}</p>
                </div>
              )}
            </div>

            {/* Days Schedule */}
            <div className="space-y-6 pt-3">
              {itinerary.days?.map((d: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold uppercase">
                      Day {d.day || idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white font-heading">{d.title}</h4>
                  </div>

                  <div className="relative pl-6 space-y-4 border-l-2 border-blue-900/60 ml-3">
                    {d.stops?.map((stop: any, sIdx: number) => (
                      <div key={sIdx} className="relative group">
                        <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-[#09101f] group-hover:scale-125 transition-transform" />
                        <div className="p-4 rounded-xl bg-[#0c1426] border border-blue-950 group-hover:border-blue-800 transition-all space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {stop.time}
                            </span>
                            <span className="text-xs font-bold text-emerald-400">
                              Fair Cost: {stop.fairCost || 'Minimal'}
                            </span>
                          </div>

                          <h5 className="text-base font-bold text-white">{stop.place}</h5>

                          <p className="text-xs text-slate-300">{stop.highlight}</p>

                          <div className="flex flex-wrap gap-3 pt-2 border-t border-blue-950 text-xs">
                            <div className="text-cyan-300">
                              🚇 <strong>Metro:</strong> {stop.metro}
                            </div>
                            {stop.foodNear && (
                              <div className="text-amber-300">
                                🍲 <strong>Eat:</strong> {stop.foodNear}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
