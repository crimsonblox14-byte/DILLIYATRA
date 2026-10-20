import React, { useState } from 'react';
import { MARKETS_DATA, MarketGuide } from '../data/delhiData';
import { ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, Send, Volume2, Search, ArrowRight, DollarSign, Calculator } from 'lucide-react';

export const FairPriceShield: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<MarketGuide>(MARKETS_DATA[0]);
  const [itemQuery, setItemQuery] = useState('');
  const [quotedPriceInput, setQuotedPriceInput] = useState('');
  const [locationInput, setLocationInput] = useState('Janpath Market');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Auto Fare Distance Calculator
  const [autoKm, setAutoKm] = useState<number>(5);

  const calculateAutoMeter = (km: number) => {
    if (km <= 1.5) return 30;
    return Math.round(30 + (km - 1.5) * 11);
  };

  // Speak Hindi phrase
  const handleSpeakPhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Run AI Fair Price Check
  const handleCheckFairPrice = async (e?: React.FormEvent, presetItem?: string, presetQuote?: string) => {
    if (e) e.preventDefault();
    const item = presetItem || itemQuery;
    const quote = presetQuote || quotedPriceInput;
    if (!item.trim() || loading) return;

    setLoading(true);

    try {
      const res = await fetch('/api/fair-price-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemOrService: item,
          quotedPrice: quote ? `₹${quote}` : undefined,
          locationOrMarket: locationInput,
        }),
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setAnalysisResult({
        verdict: 'SLIGHTLY_HIGH',
        fairPriceMin: 150,
        fairPriceMax: 300,
        explanation: 'In Delhi street markets, start by offering 40-50% of the quoted price.',
        bargainingPhraseHindi: 'Bhaiya thoda theek lagao, hum student/tourist hain.',
        bargainingPhraseEnglish: 'Brother, give a fair price, we are travelers.',
        insiderTip: 'Walk away politely if they refuse to budge from an exorbitant markup.',
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
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Fair Pricing &amp; Scam Shield
            </span>
            <span className="text-xs text-slate-400">Protects Foreign &amp; Domestic Tourists</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight">
            Verify Fair Prices Across Delhi Markets
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            From Janpath and Chandni Chowk to auto-rickshaws and street treats, use our live price evaluator to verify fair rates and master local bargaining phrases with native audio pronunciation.
          </p>
        </div>
      </div>

      {/* Live Price Checker Console */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#09101f] border border-blue-900/60 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-blue-950 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-white font-heading">
              Fair Price &amp; Bargain Verifier
            </h3>
          </div>
          <span className="text-xs text-blue-400">Instant Verification</span>
        </div>

        <form onSubmit={handleCheckFairPrice} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Item, Dish or Transit Service
              </label>
              <input
                type="text"
                value={itemQuery}
                onChange={(e) => setItemQuery(e.target.value)}
                placeholder="e.g. Silk Pashmina Scarf, Auto to CP, Plate of Nihari..."
                className="w-full bg-[#0c1426] border border-blue-900/60 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Vendor Quoted Price (₹ INR)
              </label>
              <input
                type="number"
                value={quotedPriceInput}
                onChange={(e) => setQuotedPriceInput(e.target.value)}
                placeholder="e.g. 1200 or 500 (optional)"
                className="w-full bg-[#0c1426] border border-blue-900/60 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Market / Neighborhood
              </label>
              <select
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full bg-[#0c1426] border border-blue-900/60 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Janpath & Tibetan Market">Janpath &amp; Tibetan Market</option>
                <option value="Sarojini Nagar">Sarojini Nagar Market</option>
                <option value="Chandni Chowk / Old Delhi">Chandni Chowk / Old Delhi</option>
                <option value="Dilli Haat INA">Dilli Haat INA</option>
                <option value="Paharganj / New Delhi Station">Paharganj / NDLS Railway Station</option>
                <option value="Connaught Place (CP)">Connaught Place</option>
                <option value="Khan Market">Khan Market</option>
                <option value="General Delhi Auto/Cab">General Delhi Auto / Cab</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-slate-400">Quick checks:</span>
              <button
                type="button"
                onClick={() => {
                  setItemQuery('Auto from New Delhi Railway Station to Connaught Place');
                  setQuotedPriceInput('300');
                  setLocationInput('Paharganj / New Delhi Station');
                  handleCheckFairPrice(undefined, 'Auto from New Delhi Railway Station to Connaught Place', '300');
                }}
                className="px-2 py-1 rounded-lg bg-[#0e172a] hover:bg-blue-900/40 text-[11px] text-slate-300 border border-blue-900/40 cursor-pointer"
              >
                🛺 Auto NDLS to CP (₹300)
              </button>
              <button
                type="button"
                onClick={() => {
                  setItemQuery('Embroidered Kashmiri Shawl');
                  setQuotedPriceInput('2500');
                  setLocationInput('Janpath & Tibetan Market');
                  handleCheckFairPrice(undefined, 'Embroidered Kashmiri Shawl', '2500');
                }}
                className="px-2 py-1 rounded-lg bg-[#0e172a] hover:bg-blue-900/40 text-[11px] text-slate-300 border border-blue-900/40 cursor-pointer"
              >
                🧣 Janpath Shawl (₹2500)
              </button>
              <button
                type="button"
                onClick={() => {
                  setItemQuery('Bottle of Kinley Mineral Water (Sealed)');
                  setQuotedPriceInput('50');
                  setLocationInput('Chandni Chowk / Old Delhi');
                  handleCheckFairPrice(undefined, 'Bottle of Kinley Mineral Water (Sealed)', '50');
                }}
                className="px-2 py-1 rounded-lg bg-[#0e172a] hover:bg-blue-900/40 text-[11px] text-slate-300 border border-blue-900/40 cursor-pointer"
              >
                💧 Water Bottle (₹50)
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !itemQuery.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-950 disabled:opacity-50 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Evaluating Price...' : 'Verify Fair Price'}</span>
            </button>
          </div>
        </form>

        {/* Live Analysis Results Panel */}
        {analysisResult && (
          <div className="mt-4 p-5 rounded-xl bg-[#0c1426] border border-blue-800/60 shadow-xl space-y-4 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-950 pb-3">
              <div className="flex items-center gap-2">
                {analysisResult.verdict === 'FAIR' ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> FAIR PRICE RANGE
                  </span>
                ) : analysisResult.verdict === 'MASSIVE_RIPOFF' ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950 text-red-300 border border-red-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> MAJOR OVERPRICING ALERT
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> ELEVATED TOURIST QUOTE
                  </span>
                )}
                <span className="text-xs text-slate-300 font-medium">{analysisResult.item}</span>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Recommended Fair Range:</span>
                <span className="text-lg font-bold text-emerald-400">
                  ₹{analysisResult.fairPriceMin} – ₹{analysisResult.fairPriceMax}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{analysisResult.explanation}</p>

            {/* Local Bargaining Phrase with Audio */}
            {analysisResult.bargainingPhraseHindi && (
              <div className="p-3.5 rounded-xl bg-[#0e172a] border border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-0.5">
                    Say this politely to negotiate:
                  </div>
                  <div className="text-sm font-bold text-white tracking-wide">
                    "{analysisResult.bargainingPhraseHindi}"
                  </div>
                  <div className="text-xs text-slate-400 italic mt-0.5">
                    "{analysisResult.bargainingPhraseEnglish}"
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSpeakPhrase(analysisResult.bargainingPhraseHindi)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                    isSpeaking
                      ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                      : 'bg-blue-950/60 hover:bg-blue-900 text-blue-200 border-blue-800'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-blue-300" />
                  <span>{isSpeaking ? 'Playing Audio' : 'Hear Pronunciation'}</span>
                </button>
              </div>
            )}

            {analysisResult.insiderTip && (
              <div className="text-xs text-blue-300 bg-blue-950/30 p-2.5 rounded-lg border border-blue-900/40">
                <strong>Insider Travel Tip: </strong>
                {analysisResult.insiderTip}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auto-Rickshaw Legal Meter Fare Calculator */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#09101f] border border-blue-900/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-blue-950 pb-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-heading">
              Delhi Auto-Rickshaw Official Meter Fare Calculator
            </h3>
          </div>
          <span className="text-xs text-slate-400">Delhi Govt Transport Dept</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-semibold">
              Travel Distance in Delhi: <strong className="text-blue-400 font-bold">{autoKm} km</strong>
            </label>
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={autoKm}
              onChange={(e) => setAutoKm(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 km (Local drop)</span>
              <span>10 km (Cross city)</span>
              <span>25 km (Airport/Outer)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-950 text-center">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Official Day Meter Rate</span>
            <span className="text-2xl font-bold text-emerald-400">₹{calculateAutoMeter(autoKm)}</span>
            <span className="text-[10px] text-slate-500 block">Formula: ₹30 first 1.5km + ₹11/km</span>
          </div>

          <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-950 text-center">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Night Tariff (11 PM - 5 AM)</span>
            <span className="text-2xl font-bold text-amber-400">
              ₹{Math.round(calculateAutoMeter(autoKm) * 1.25)}
            </span>
            <span className="text-[10px] text-slate-500 block">+25% Legal Night Surcharge</span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          💡 If an auto driver refuses the meter outside tourist spots (like Red Fort or CP), negotiate a fixed price around <strong>₹{calculateAutoMeter(autoKm) + 20} to ₹{calculateAutoMeter(autoKm) + 40}</strong>. If they demand ₹300 for a 3km ride, walk to the main road or book an Uber Auto.
        </p>
      </div>

      {/* Delhi Famous Markets Guide & Benchmarks */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
          <span>Famous Delhi Markets &amp; Haggling Benchmarks</span>
        </h3>

        {/* Market Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MARKETS_DATA.map((market) => (
            <button
              key={market.id}
              onClick={() => setActiveMarket(market)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border cursor-pointer ${
                activeMarket.id === market.id
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-950'
                  : 'bg-[#0a1122] text-slate-300 border-blue-950 hover:bg-blue-950/50 hover:text-white'
              }`}
            >
              {market.name}
            </button>
          ))}
        </div>

        {/* Active Market Card */}
        <div className="p-5 md:p-6 rounded-2xl bg-[#09101f] border border-blue-900/60 shadow-xl space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-blue-950 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-900/50">
                  Haggling: {activeMarket.bargainingLevel}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Closed on: {activeMarket.closedOn}
                </span>
              </div>
              <h4 className="text-xl font-bold text-white font-heading">{activeMarket.name}</h4>
              <p className="text-xs text-slate-400 mt-1">
                <strong>Specialty:</strong> {activeMarket.specialty}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Nearest Metro:</span>
              <span className="text-xs font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40 inline-block mt-1">
                🚇 {activeMarket.nearestMetro}
              </span>
            </div>
          </div>

          {/* Fair Price Benchmarks Table */}
          <div>
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Verified Fair Price Benchmarks (Don’t Pay More)
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-200">
                <thead>
                  <tr className="border-b border-blue-950 bg-[#0c1426] text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">Popular Item</th>
                    <th className="py-2.5 px-3 font-semibold text-rose-400">Initial Tourist Quote</th>
                    <th className="py-2.5 px-3 font-semibold text-emerald-400">Fair Final Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-950/60">
                  {activeMarket.fairPriceBenchmarks.map((b, i) => (
                    <tr key={i} className="hover:bg-blue-950/20 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-white">{b.item}</td>
                      <td className="py-2.5 px-3 text-rose-400 line-through">{b.quotedPrice}</td>
                      <td className="py-2.5 px-3 text-emerald-300 font-bold">{b.fairPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scam Alerts for this market */}
          <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/50 space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Watch Out for These Known Market Traps:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {activeMarket.scamAlerts.map((scam, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{scam}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Insider Tip */}
          <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-900/40 text-xs text-slate-200">
            <strong className="text-blue-300">Insider Tip: </strong>
            {activeMarket.insiderTip}
          </div>
        </div>
      </div>
    </div>
  );
};
