import React, { useState } from 'react';
import { Monument } from '../data/delhiData';
import { X, Train, Bus, DollarSign, Clock, HelpCircle, Send, Volume2, ShieldCheck, MapPin, Info, Compass } from 'lucide-react';

interface MonumentDetailModalProps {
  monument: Monument;
  onClose: () => void;
  onLocateOnMap?: () => void;
}

export const MonumentDetailModal: React.FC<MonumentDetailModalProps> = ({
  monument,
  onClose,
  onLocateOnMap,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transit' | 'food' | 'ai-qa'>('overview');
  const [customQuestion, setCustomQuestion] = useState('');
  const [qaLoading, setQaLoading] = useState(false);
  const [conversation, setConversation] = useState<Array<{ q: string; a: string }>>([
    {
      q: monument.faqs[0]?.q || 'What is the most important historical fact about this monument?',
      a: monument.faqs[0]?.a || monument.summary,
    },
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Read aloud summary using speech synthesis
  const handleSpeak = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Submit custom question to server
  const handleAskAI = async (e?: React.FormEvent, presetQ?: string) => {
    if (e) e.preventDefault();
    const query = presetQ || customQuestion;
    if (!query.trim() || qaLoading) return;

    if (!presetQ) setCustomQuestion('');

    // Instant 0ms reply if it matches a curated FAQ
    const matchingFaq = monument.faqs.find((f) => f.q.toLowerCase() === query.toLowerCase());
    if (matchingFaq) {
      setConversation((prev) => [...prev, { q: matchingFaq.q, a: matchingFaq.a }]);
      return;
    }

    setQaLoading(true);
    setConversation((prev) => [...prev, { q: query, a: 'Consulting monument archives...' }]);

    try {
      const res = await fetch('/api/monument-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monumentName: monument.name,
          question: query,
        }),
      });

      const data = await res.json();
      setConversation((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          q: query,
          a: data.answer || 'Information is currently unavailable.',
        };
        return copy;
      });
    } catch (err) {
      console.error(err);
      setConversation((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          q: query,
          a: `According to Delhi heritage records for ${monument.name}, it was established in ${monument.year} by ${monument.builtBy}. Recommended visit time is ${monument.bestTimeToVisit}. Entry is ₹${monument.entryFee.indian} (Indians) / ₹${monument.entryFee.foreigner} (Foreigners).`,
        };
        return copy;
      });
    } finally {
      setQaLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#070c1a] border border-blue-500/30 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-[#0c152a] via-[#080e1d] to-[#060a14] border-b border-blue-950 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800/60 uppercase tracking-wider">
                {monument.category}
              </span>
              <span className="text-sm font-semibold text-blue-400">
                {monument.hindiName}
              </span>
              <span className="text-xs text-slate-400">
                Built: {monument.year} by {monument.builtBy}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight flex items-center gap-2">
              {monument.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSpeak(`${monument.name}. ${monument.summary}. ${monument.history}`)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                  : 'bg-blue-950/40 text-blue-300 border-blue-900/60 hover:bg-blue-900/60'
              }`}
              title={isSpeaking ? 'Stop Audio Tour' : 'Listen to Audio Guide'}
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-blue-950 text-slate-300 hover:text-white border border-blue-900/40 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-blue-950 bg-[#091021] px-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400 bg-blue-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🏛️ History &amp; Facts
          </button>
          <button
            onClick={() => setActiveTab('transit')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'transit'
                ? 'border-blue-500 text-blue-400 bg-blue-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🚇 Metro &amp; Transit Guide
          </button>
          <button
            onClick={() => setActiveTab('food')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
              activeTab === 'food'
                ? 'border-blue-500 text-blue-400 bg-blue-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🍲 Nearby Fair Food
          </button>
          <button
            onClick={() => setActiveTab('ai-qa')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai-qa'
                ? 'border-blue-500 text-blue-400 bg-blue-950/30'
                : 'border-transparent text-slate-400 hover:text-blue-300'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Tour Q&amp;A ({conversation.length})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {/* TAB 1: OVERVIEW & HISTORY */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Summary Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-[#0a1226] to-blue-950/20 border border-blue-900/50">
                <p className="text-slate-200 leading-relaxed text-sm md:text-base font-normal">
                  {monument.summary}
                </p>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-950">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" /> Timings
                  </span>
                  <div className="mt-1 text-xs font-bold text-white">{monument.hours}</div>
                  <div className="text-[10px] text-blue-400 mt-0.5">Closed: {monument.closedOn}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-950">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Ticket (Indian)
                  </span>
                  <div className="mt-1 text-sm font-bold text-emerald-300">
                    {monument.entryFee.indian === 0 ? 'FREE ENTRY' : `₹${monument.entryFee.indian}`}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Kids &lt;15: {monument.entryFee.childrenUnder15}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-950">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Foreign Tourist
                  </span>
                  <div className="mt-1 text-sm font-bold text-amber-300">
                    {monument.entryFee.foreigner === 0 ? 'FREE ENTRY' : `₹${monument.entryFee.foreigner}`}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">SAARC: ₹{monument.entryFee.saarcBimstec}</div>
                </div>

                <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-950">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" /> Best Time
                  </span>
                  <div className="mt-1 text-xs font-medium text-cyan-200">{monument.bestTimeToVisit}</div>
                </div>
              </div>

              {/* Anti-Scam Ticket Warning */}
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-200 leading-relaxed">
                  <strong className="text-blue-300 font-bold">Ticket Guidance: </strong>
                  {monument.entryFee.bookingTip}
                </div>
              </div>

              {/* In-depth History */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-blue-400 flex items-center gap-2 font-heading">
                  <Info className="w-4 h-4" /> Historical Background &amp; Architecture
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed bg-[#0c1426] p-4 rounded-xl border border-blue-950/60">
                  {monument.history}
                </p>
                <div className="text-xs text-slate-400 pt-1">
                  <strong>Architectural Style:</strong> {monument.architecture}
                </div>
              </div>

              {/* Rules & Dress code */}
              {monument.dressCodeAndRules && monument.dressCodeAndRules.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Visitor Guidelines &amp; Etiquette
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {monument.dressCodeAndRules.map((rule, idx) => (
                      <li key={idx} className="p-2.5 rounded-lg bg-[#0c1426] border border-blue-950 flex items-start gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Why Visit */}
              {monument.whyVisit && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Why Visit This Site
                  </h4>
                  <p className="text-xs text-slate-300 bg-[#0c1426] p-3 rounded-lg border border-blue-950/60 leading-relaxed">
                    {monument.whyVisit}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: METRO & TRANSIT GUIDE */}
          {activeTab === 'transit' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Train className="w-5 h-5 text-cyan-400" />
                  <span>Nearest Delhi Metro Station</span>
                </div>
                <div className="text-xl font-bold text-white">{monument.nearestMetro.station}</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300 pt-1">
                  <div>
                    <span className="text-slate-400 block">Metro Line:</span>
                    <strong className="text-white">{monument.nearestMetro.line}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Exit Gate:</span>
                    <strong className="text-cyan-300">{monument.nearestMetro.gate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Walk to Gate:</span>
                    <strong className="text-emerald-400">{monument.nearestMetro.walkingDistance}</strong>
                  </div>
                </div>
              </div>

              {monument.transitOptions && (
                <>
                  <div className="p-4 rounded-xl bg-[#0c1426] border border-blue-950 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <Compass className="w-4 h-4" /> Auto Rickshaw Fair Price from Metro
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {monument.transitOptions.autoFairPriceFromMetro}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0c1426] border border-blue-950 space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                      <Bus className="w-4 h-4" /> DTC Bus Connections
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Bus Lines:</strong> {monument.transitOptions.dtcBusLines.join(', ')}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Nearest bus stop: <strong>{monument.transitOptions.nearestBusStop}</strong>. AC electric DTC buses cost ₹10 to ₹25 max.
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: NEARBY FAIR FOOD RECOMMENDATIONS */}
          {activeTab === 'food' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Authentic Food Around {monument.name}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {monument.nearbyFood?.map((food, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#0c1426] border border-blue-950 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">{food.distance} away</span>
                        <span className="text-emerald-400 font-bold">{food.fairPrice}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{food.name}</h4>
                      <p className="text-xs text-blue-300 font-medium">{food.dish}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-blue-950 text-[10px] text-slate-400">
                      Fair street/dhaba benchmark
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE TOUR GUIDE Q&A */}
          {activeTab === 'ai-qa' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 flex items-center justify-between">
                <span className="text-xs text-blue-300 flex items-center gap-1.5 font-semibold">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  Ask anything about {monument.name}
                </span>
                <span className="text-[10px] text-slate-400">Delhi Guide Knowledge Base</span>
              </div>

              {/* Quick Preset Question Chips */}
              <div className="flex flex-wrap gap-1.5">
                {monument.faqs.map((faq, i) => (
                  <button
                    key={i}
                    onClick={() => handleAskAI(undefined, faq.q)}
                    disabled={qaLoading}
                    className="px-2.5 py-1 rounded-lg bg-[#0e172a] hover:bg-blue-900/50 border border-blue-900/40 text-xs text-slate-300 hover:text-white transition-all text-left cursor-pointer"
                  >
                    💬 {faq.q}
                  </button>
                ))}
              </div>

              {/* Q&A Thread */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {conversation.map((msg, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-start gap-2 justify-end">
                      <div className="p-3 rounded-xl bg-blue-600 text-xs text-white max-w-[85%]">
                        <strong>Q:</strong> {msg.q}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center shrink-0 mt-1 shadow-md text-[10px] font-bold">
                        DG
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#0c1426] border border-blue-900/50 text-xs md:text-sm text-slate-200 leading-relaxed max-w-[90%] whitespace-pre-wrap">
                        {msg.a}
                      </div>
                    </div>
                  </div>
                ))}

                {qaLoading && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0c1426] border border-blue-950 text-xs text-blue-400 animate-pulse">
                    <span>Consulting monument archives and transit schedules...</span>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAskAI} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder={`Ask a question about ${monument.name} (e.g., ticket discounts, bag lockers, best photospots)...`}
                  className="flex-1 bg-[#0b1324] border border-blue-900/50 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={qaLoading || !customQuestion.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-950 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 md:p-4 bg-[#050814] border-t border-blue-950 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>GPS: {monument.lat}, {monument.lng}</span>
          </div>

          <div className="flex items-center gap-2">
            {onLocateOnMap && (
              <button
                onClick={() => {
                  onLocateOnMap();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800 text-xs font-semibold text-blue-300 cursor-pointer"
              >
                Pin on Map
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
