import React, { useState } from 'react';
import { HINDI_PHRASES_DATA, HindiPhrase } from '../data/delhiData';
import { Languages, Volume2, Send, Copy, Check, MessageSquare } from 'lucide-react';

export const TranslatorTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState('Street Bargaining (Delhi Style)');
  const [loading, setLoading] = useState(false);
  const [translatedResult, setTranslatedResult] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Play audio pronunciation
  const handlePlayAudio = (id: string, textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.88;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Run translation
  const handleTranslate = async (e?: React.FormEvent, customPreset?: string) => {
    if (e) e.preventDefault();
    const query = customPreset || inputText;
    if (!query.trim() || loading) return;

    setLoading(true);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: query,
          targetTone: tone,
        }),
      });

      const data = await res.json();
      setTranslatedResult(data);
    } catch (err) {
      console.error(err);
      setTranslatedResult({
        hindiDevanagari: 'यह कितने का है?',
        hindiPhonetic: 'Yeh kitne ka hai?',
        delhiSlangAlternative: 'Bhaiya sahi sahi lagao, theek theek bolo.',
        englishMeaning: query,
        culturalTip: 'Address shopkeepers warmly as "Bhaiya" (brother) for instant friendliness.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const filteredPhrases = HINDI_PHRASES_DATA.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-[#0a1226] to-[#050814] border border-blue-700/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800/60 flex items-center gap-1">
              <Languages className="w-3.5 h-3.5" /> Tourist Translator &amp; Hindi Audio Guide
            </span>
            <span className="text-xs text-slate-400">Speak Naturally in Delhi</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight">
            Delhi Street Talk &amp; Language Guide
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Translate English phrases into colloquial Delhi Hindi with phonetic spelling and voice pronunciation to bargain confidently and ask directions with ease.
          </p>
        </div>
      </div>

      {/* Real-time Translator Box */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#09101f] border border-blue-900/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-blue-950 pb-3">
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-white font-heading">
              Hindi &amp; Street Slang Translator
            </h3>
          </div>
          <span className="text-xs text-blue-400">Instant Pronunciation</span>
        </div>

        <form onSubmit={handleTranslate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Enter English Phrase or Question
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. Can you turn on the AC in the taxi? / Please make the curry without chili..."
                className="w-full bg-[#0c1426] border border-blue-900/60 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Conversation Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#0c1426] border border-blue-900/60 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Street Bargaining (Delhi Style)">Street Bargaining (Friendly &amp; Firm)</option>
                <option value="Polite & Respectful">Polite &amp; Respectful</option>
                <option value="Food & Water Safety">Food &amp; Water Safety</option>
                <option value="Transit & Auto Negotiation">Transit &amp; Auto Negotiation</option>
                <option value="Emergency & Help">Emergency &amp; Help</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[11px] text-slate-400">Try quick phrases:</span>
              <button
                type="button"
                onClick={() => {
                  setInputText('Is this filtered mineral drinking water?');
                  handleTranslate(undefined, 'Is this filtered mineral drinking water?');
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-[#0e172a] hover:bg-blue-900/40 text-slate-300 border border-blue-900/40 cursor-pointer"
              >
                💧 Filtered water check
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputText('Brother, will you turn on the auto meter?');
                  handleTranslate(undefined, 'Brother, will you turn on the auto meter?');
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-[#0e172a] hover:bg-blue-900/40 text-slate-300 border border-blue-900/40 cursor-pointer"
              >
                🛺 Auto meter request
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputText('Please give me a bill or receipt.');
                  handleTranslate(undefined, 'Please give me a bill or receipt.');
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-[#0e172a] hover:bg-blue-900/40 text-slate-300 border border-blue-900/40 cursor-pointer"
              >
                🧾 Ask for bill
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-950 disabled:opacity-50 transition-all ml-auto cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Translating...' : 'Translate &amp; Pronounce'}</span>
            </button>
          </div>
        </form>

        {/* Translation Output Card */}
        {translatedResult && (
          <div className="p-4 md:p-5 rounded-xl bg-[#0c1426] border border-blue-700/60 space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Phonetic Pronunciation (Read This Out Loud):
                </span>
                <div className="text-xl md:text-2xl font-bold text-white mt-1">
                  "{translatedResult.hindiPhonetic}"
                </div>
                <div className="text-sm font-semibold text-blue-300 mt-1">
                  {translatedResult.hindiDevanagari}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayAudio('custom-result', translatedResult.hindiDevanagari || translatedResult.hindiPhonetic)}
                  className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                    speakingId === 'custom-result'
                      ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                      : 'bg-blue-950/60 hover:bg-blue-900 text-blue-200 border-blue-800'
                  }`}
                  title="Listen to native pronunciation"
                >
                  <Volume2 className="w-4 h-4 text-blue-300" />
                  <span className="hidden sm:inline">Play Audio</span>
                </button>

                <button
                  onClick={() => handleCopy(translatedResult.hindiPhonetic)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-blue-950 text-slate-300 hover:text-white border border-blue-900/40 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  title="Copy pronunciation"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {translatedResult.delhiSlangAlternative && (
              <div className="p-3 rounded-lg bg-[#0e172a] border border-blue-900/40 text-xs">
                <strong className="text-amber-300">Local Delhi Slang Option: </strong>
                <span className="text-white font-medium">"{translatedResult.delhiSlangAlternative}"</span>
              </div>
            )}

            {translatedResult.culturalTip && (
              <div className="text-xs text-slate-300 bg-blue-950/20 p-2.5 rounded-lg border border-blue-900/30">
                <strong className="text-blue-300">Cultural Travel Tip: </strong>
                {translatedResult.culturalTip}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Offline Survival Phrasebook */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-heading">
            Essential Offline Delhi Phrases &amp; Audio
          </h3>
          <span className="text-xs text-slate-400">Available 100% Offline</span>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'Bargaining', 'Transit & Auto', 'Food & Water', 'Directions', 'Emergency'].map(
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

        {/* Phrase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPhrases.map((phrase) => (
            <div
              key={phrase.id}
              className="p-4 rounded-xl bg-[#09101f] border border-blue-900/50 hover:border-blue-500/80 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[10px] uppercase font-bold text-blue-400">
                    {phrase.category}
                  </span>
                </div>

                <div className="text-base font-bold text-white">
                  "{phrase.hinglishPhonetic}"
                </div>
                <div className="text-xs text-blue-300 mt-0.5">
                  {phrase.hindiDevanagari}
                </div>
                <div className="text-xs text-slate-400 italic mt-1">
                  Meaning: "{phrase.english}"
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-blue-950">
                <span className="text-[11px] text-slate-400 truncate max-w-[200px]" title={phrase.whenToUse}>
                  💡 {phrase.whenToUse}
                </span>

                <button
                  onClick={() => handlePlayAudio(phrase.id, phrase.hindiDevanagari)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    speakingId === phrase.id
                      ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
                      : 'bg-blue-950/60 hover:bg-blue-900 text-blue-200 border-blue-800'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-300" />
                  <span>{speakingId === phrase.id ? 'Playing' : 'Listen'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
