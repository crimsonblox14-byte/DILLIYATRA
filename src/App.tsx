import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Train,
  Utensils,
  ShieldCheck,
  Languages,
  Sparkles,
  Search,
  ArrowRight,
  PhoneCall,
  Clock,
  ChevronRight,
  MessageSquare,
  Navigation,
} from 'lucide-react';

import { MONUMENTS_DATA, Monument } from './data/delhiData';
import { InteractiveMap } from './components/InteractiveMap';
import { MonumentDetailModal } from './components/MonumentDetailModal';
import { FairPriceShield } from './components/FairPriceShield';
import { DiningFoodGuide } from './components/DiningFoodGuide';
import { TransitMetroGuide } from './components/TransitMetroGuide';
import { TranslatorTool } from './components/TranslatorTool';
import { AIPersonalizer } from './components/AIPersonalizer';
import { AIChatModal } from './components/AIChatModal';
import { WeatherWidget } from './components/WeatherWidget';

type NavTab = 'home' | 'map' | 'monuments' | 'fair-price' | 'dining' | 'transit' | 'translator' | 'personalizer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [aiChatInitialPrompt, setAiChatInitialPrompt] = useState<string>('');
  const [homeSearchQuery, setHomeSearchQuery] = useState<string>('');

  // Handle Home Search or Ask AI Bar
  const handleHomeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeSearchQuery.trim()) return;

    // Check if query matches a monument
    const matched = MONUMENTS_DATA.find(
      (m) =>
        m.name.toLowerCase().includes(homeSearchQuery.toLowerCase()) ||
        m.summary.toLowerCase().includes(homeSearchQuery.toLowerCase())
    );

    if (matched) {
      setSelectedMonument(matched);
    } else {
      setAiChatInitialPrompt(homeSearchQuery);
      setIsAIChatOpen(true);
    }
  };

  const openAIChatWithPrompt = (prompt: string) => {
    setAiChatInitialPrompt(prompt);
    setIsAIChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-[1500] bg-[#070d1e]/95 backdrop-blur-md border-b border-blue-950/80 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* Logo */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-950 border border-blue-400/40 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-lg md:text-xl text-white tracking-wider">
                  DELHI<span className="text-blue-500">GUIDE</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 text-[10px] font-semibold">
                  Tourist Concierge
                </span>
              </div>
              <div className="text-[10px] text-slate-400 hidden sm:block">
                Dilli Darshan &bull; Fair Price &bull; Real-Time Transit
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0a1022] p-1 rounded-xl border border-blue-950/80">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>AI Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Map &amp; Locations</span>
            </button>

            <button
              onClick={() => setActiveTab('monuments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'monuments'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Monuments ({MONUMENTS_DATA.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('fair-price')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'fair-price'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fair Price Shield</span>
            </button>

            <button
              onClick={() => setActiveTab('dining')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'dining'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Food &amp; Dining</span>
            </button>

            <button
              onClick={() => setActiveTab('transit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'transit'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
              }`}
            >
              <Train className="w-3.5 h-3.5" />
              <span>Metro &amp; Buses</span>
            </button>

            <button
              onClick={() => setActiveTab('translator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'translator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Translator</span>
            </button>

            <button
              onClick={() => setActiveTab('personalizer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'personalizer'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-blue-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Trip Planner</span>
            </button>
          </nav>

          {/* Right Action: Ask Guide */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-950 border border-blue-400/40 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ask Travel Guide</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Scroller */}
        <div className="lg:hidden px-3 py-2 bg-[#060b18] border-t border-blue-950/70 overflow-x-auto flex gap-1.5 text-xs">
          {[
            { id: 'home', label: 'AI Hub', icon: Compass },
            { id: 'map', label: 'Map & Locations', icon: Navigation },
            { id: 'monuments', label: 'Monuments', icon: MapPin },
            { id: 'fair-price', label: 'Fair Prices', icon: ShieldCheck },
            { id: 'dining', label: 'Dining', icon: Utensils },
            { id: 'transit', label: 'Metro/Buses', icon: Train },
            { id: 'translator', label: 'Translator', icon: Languages },
            { id: 'personalizer', label: 'Trip Planner', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavTab)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1 transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#0a1122] text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-6 flex flex-col">
        {/* ================= TAB 1: AI HUB / DASHBOARD ================= */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Banner */}
            <div className="relative p-6 md:p-10 rounded-3xl bg-gradient-to-b from-[#0b1328] via-[#080e1e] to-[#050814] border border-blue-700/40 shadow-2xl overflow-hidden">
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-950 flex items-center gap-1.5 uppercase tracking-wider">
                    Delhi Travel Concierge
                  </span>
                  <span className="text-xs text-blue-400">
                    National Capital Region &bull; 28.6139° N, 77.2090° E
                  </span>
                  {isOfflineMode && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/50">
                      Offline Mode Active
                    </span>
                  )}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
                  Your Smart Travel Guide for <span className="text-blue-400">Delhi</span>
                </h1>

                <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                  Real-time interactive maps, authentic monument histories &amp; Q&amp;A, fair price shield for street foods &amp; markets, exact Metro/Bus hours, and offline survival tools.
                </p>

                {/* Search Bar */}
                <form
                  onSubmit={handleHomeSearchSubmit}
                  className="pt-2 flex flex-col sm:flex-row gap-2"
                >
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-blue-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={homeSearchQuery}
                      onChange={(e) => setHomeSearchQuery(e.target.value)}
                      placeholder="Ask anything: 'Red Fort entry ticket', 'Fair price of Chole Bhature', 'Translate bargaining phrase'..."
                      className="w-full bg-[#0a1122] border border-blue-700/50 rounded-2xl pl-11 pr-4 py-3.5 text-xs md:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-950 border border-blue-400/40 transition-all cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Guide</span>
                  </button>
                </form>

                {/* Rapid Action Prompts */}
                <div className="flex flex-wrap gap-2 pt-2 text-xs items-center">
                  <button
                    onClick={() => setActiveTab('map')}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-blue-950 border border-blue-400/40 transition-all hover:scale-105"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>🎯 Show My Location on Map</span>
                  </button>
                  <span className="text-slate-600 self-center hidden sm:inline">&bull;</span>
                  <button
                    onClick={() => openAIChatWithPrompt('Is 500 Rupees fair for an auto from CP to India Gate?')}
                    className="px-2.5 py-1 rounded-xl bg-[#0d162d] hover:bg-blue-950 text-slate-300 hover:text-white border border-blue-900/50"
                  >
                    🛺 Auto fare CP to India Gate
                  </button>
                  <button
                    onClick={() => openAIChatWithPrompt('What is the best route between Red Fort and Jama Masjid?')}
                    className="px-2.5 py-1 rounded-xl bg-[#0d162d] hover:bg-blue-950 text-slate-300 hover:text-white border border-blue-900/50"
                  >
                    🏰 Red Fort &rarr; Jama Masjid walk
                  </button>
                  <button
                    onClick={() => openAIChatWithPrompt('Teach me how to negotiate at Janpath market')}
                    className="px-2.5 py-1 rounded-xl bg-[#0d162d] hover:bg-blue-950 text-slate-300 hover:text-white border border-blue-900/50"
                  >
                    🛍️ Janpath bargaining
                  </button>
                  <button
                    onClick={() => openAIChatWithPrompt('What are the rules for women coaches in Delhi Metro?')}
                    className="px-2.5 py-1 rounded-xl bg-[#0d162d] hover:bg-blue-950 text-slate-300 hover:text-white border border-blue-900/50"
                  >
                    🚇 Metro women safety
                  </button>
                </div>
              </div>
            </div>

            {/* LIVE WEATHER WIDGET (Prominently integrated into the AI Hub Dashboard) */}
            <div className="space-y-2">
              <WeatherWidget />
            </div>

            {/* Feature Modules Quick-Launch Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Interactive Map */}
              <div
                onClick={() => setActiveTab('map')}
                className="p-5 rounded-2xl bg-[#09101f] border border-blue-900/60 hover:border-blue-500 transition-all shadow-xl cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center border border-blue-800 text-blue-400 group-hover:scale-110 transition-transform mb-3">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Real-Time &amp; Offline Maps
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Interactive GPS map with monument pins, metro stations, custom saved spots, and downloadable offline pack.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Live Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2: Fair Price Shield */}
              <div
                onClick={() => setActiveTab('fair-price')}
                className="p-5 rounded-2xl bg-[#09101f] border border-blue-900/60 hover:border-blue-500 transition-all shadow-xl cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center border border-blue-800 text-emerald-400 group-hover:scale-110 transition-transform mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Fair Price &amp; Scam Shield
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Prevent overcharging on street foods, auto meters, and market souvenirs with fair price verification and Hindi bargaining audio.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Verify Fair Prices</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3: Dining & Delicacies */}
              <div
                onClick={() => setActiveTab('dining')}
                className="p-5 rounded-2xl bg-[#09101f] border border-blue-900/60 hover:border-blue-500 transition-all shadow-xl cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center border border-blue-800 text-amber-400 group-hover:scale-110 transition-transform mb-3">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Delhi Delicacies &amp; Dining
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Chole Bhature, Karim's Nihari, Paranthe Wali Gali, and Butter Chicken with authentic fair price ranges and top heritage spots.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>Explore Food Trails</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 4: Metro & Transit Hours */}
              <div
                onClick={() => setActiveTab('transit')}
                className="p-5 rounded-2xl bg-[#09101f] border border-blue-900/60 hover:border-blue-500 transition-all shadow-xl cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-950 flex items-center justify-center border border-blue-800 text-cyan-400 group-hover:scale-110 transition-transform mb-3">
                    <Train className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Metro &amp; Bus Transit Hours
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    05:30 AM to 11:30 PM lines schedule, ₹200 1-Day Tourist Cards, Airport Express in 19 mins, and DTC bus connections.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                  <span>View Transit Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Featured Monuments Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-white font-heading">
                    Famous Delhi Monuments &amp; Heritage Sites
                  </h2>
                  <p className="text-xs text-slate-400">
                    Click any monument for historical facts, ticket prices, transit guides, and Q&amp;A.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('monuments')}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All ({MONUMENTS_DATA.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {MONUMENTS_DATA.slice(0, 6).map((monument) => (
                  <div
                    key={monument.id}
                    onClick={() => setSelectedMonument(monument)}
                    className="p-5 rounded-2xl bg-[#09101f] border border-blue-900/60 hover:border-blue-500/80 transition-all shadow-xl cursor-pointer group flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60 uppercase tracking-wider">
                          {monument.category}
                        </span>
                        <span className="text-xs font-semibold text-blue-400">
                          {monument.hindiName}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white font-heading group-hover:text-blue-400 transition-colors">
                        {monument.name}
                      </h3>

                      <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                        {monument.summary}
                      </p>

                      <div className="mt-4 pt-3 border-t border-blue-950 space-y-1.5 text-xs text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>🚇 Metro:</span>
                          <span className="font-semibold text-slate-200">
                            {monument.nearestMetro.station}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>💰 Ticket:</span>
                          <span className="font-bold text-emerald-400">
                            {monument.entryFee.indian === 0
                              ? 'FREE'
                              : `₹${monument.entryFee.indian} (Ind) / ₹${monument.entryFee.foreigner} (Foreigner)`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-slate-500">Built: {monument.year}</span>
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Explore Monument</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tourist Helpline & Safety Banner */}
            <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-r from-[#0a1329] to-[#070d1e] border border-blue-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-400 shrink-0">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-heading">
                    Official 24x7 Delhi Tourist Helpline (Multi-Lingual)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Toll-Free Ministry of Tourism Helpline: <strong>1363</strong> (or 1800-11-1363) &bull; Delhi Police Emergency: <strong>112</strong> &bull; Women Safety: <strong>1091</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => openAIChatWithPrompt('What are the key safety tips for foreign and female tourists in Delhi?')}
                className="px-4 py-2.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-800 text-xs font-bold whitespace-nowrap cursor-pointer"
              >
                Safety &amp; Scam Advisory
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 2: INTERACTIVE & OFFLINE MAP ================= */}
        {activeTab === 'map' && (
          <div className="flex-1 min-h-[650px] flex flex-col space-y-4">
            <InteractiveMap
              onSelectMonument={(m) => setSelectedMonument(m)}
              selectedMonumentId={selectedMonument?.id}
              isOfflineMode={isOfflineMode}
              onToggleOffline={() => setIsOfflineMode((prev) => !prev)}
            />
          </div>
        )}

        {/* ================= TAB 3: ALL MONUMENTS DIRECTORY ================= */}
        {activeTab === 'monuments' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-[#0a1226] to-[#050814] border border-blue-700/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800/60 uppercase tracking-wider">
                  Full Monument Catalog
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading mt-1">
                  Delhi Historical Monuments &amp; Heritage Sites
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mt-1">
                  Select any monument to read historical narratives, ticketing tips, exact metro stations, and launch interactive Q&amp;A.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('map')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-950 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>View on Live Map</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {MONUMENTS_DATA.map((monument) => (
                <div
                  key={monument.id}
                  onClick={() => setSelectedMonument(monument)}
                  className="p-5 rounded-2xl bg-[#09101f] border border-blue-900/60 hover:border-blue-500 transition-all shadow-xl cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60 uppercase tracking-wider">
                        {monument.category}
                      </span>
                      <span className="text-xs font-semibold text-blue-400">
                        {monument.hindiName}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading group-hover:text-blue-400 transition-colors">
                      {monument.name}
                    </h3>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {monument.summary}
                    </p>

                    <div className="mt-4 pt-3 border-t border-blue-950 space-y-1.5 text-xs text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>🚇 Metro:</span>
                        <span className="font-semibold text-slate-200">
                          {monument.nearestMetro.station}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>💰 Ticket:</span>
                        <span className="font-bold text-emerald-400">
                          {monument.entryFee.indian === 0
                            ? 'FREE'
                            : `₹${monument.entryFee.indian} (Ind) / ₹${monument.entryFee.foreigner} (Foreigner)`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>🕒 Timings:</span>
                        <span className="text-slate-300">{monument.hours}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500">Built: {monument.year}</span>
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Explore Monument</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: FAIR PRICE SHIELD ================= */}
        {activeTab === 'fair-price' && <FairPriceShield />}

        {/* ================= TAB 5: DINING & LOCAL DELICACIES ================= */}
        {activeTab === 'dining' && <DiningFoodGuide />}

        {/* ================= TAB 6: METRO & DTC BUS TRANSIT ================= */}
        {activeTab === 'transit' && <TransitMetroGuide />}

        {/* ================= TAB 7: TRANSLATOR & SLANG ================= */}
        {activeTab === 'translator' && <TranslatorTool />}

        {/* ================= TAB 8: TRIP PLANNER ================= */}
        {activeTab === 'personalizer' && (
          <AIPersonalizer onNavigateToMap={() => setActiveTab('map')} />
        )}
      </main>

      {/* Monument Detail & AI Q&A Modal */}
      {selectedMonument && (
        <MonumentDetailModal
          monument={selectedMonument}
          onClose={() => setSelectedMonument(null)}
          onLocateOnMap={() => {
            setActiveTab('map');
          }}
        />
      )}

      {/* Floating AIChat Modal */}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        initialPrompt={aiChatInitialPrompt}
      />

      {/* Floating Guide Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-[1200]">
        <button
          onClick={() => {
            setAiChatInitialPrompt('');
            setIsAIChatOpen(true);
          }}
          className="relative group p-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-900/60 border border-blue-400/60 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          title="Open Delhi Tour Guide Assistant"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#0a1022] text-white text-xs font-bold border border-blue-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask Delhi Guide
          </span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-blue-950/80 bg-[#040711] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-slate-300">DELHIGUIDE</span>
            <span>&bull; Powered by Delhi Transit Intelligence &amp; Live Weather Data</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>24x7 Tourist Support: 1363</span>
            <span>Emergency: 112</span>
            <span>Metro Helpline: 155370</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
