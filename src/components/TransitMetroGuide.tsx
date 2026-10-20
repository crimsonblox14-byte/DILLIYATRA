import React, { useState } from 'react';
import { METRO_LINES_DATA, MetroLineInfo } from '../data/delhiData';
import { Train, Bus, Clock, CreditCard, ShieldCheck, AlertCircle, Zap, Compass, Users } from 'lucide-react';

export const TransitMetroGuide: React.FC = () => {
  const [selectedLine, setSelectedLine] = useState<MetroLineInfo>(METRO_LINES_DATA[0]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-[#0a1226] to-[#050814] border border-blue-700/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800/60 flex items-center gap-1">
              <Train className="w-3.5 h-3.5" /> Delhi Rapid Transit &amp; Bus System Guide
            </span>
            <span className="text-xs text-slate-400">Hours, Smart Passes &amp; Key Tourist Routes</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading tracking-tight">
            Delhi Metro &amp; DTC Bus Navigation
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            The Delhi Metro is ranked among the cleanest, most punctual, and safest transit networks in the world. Save hours avoiding Delhi traffic by mastering lines, operating hours, and tourist smart cards.
          </p>
        </div>
      </div>

      {/* Key Metro Timings & Tourist Card Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#09101f] border border-blue-950 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" /> General Metro Timings
          </div>
          <div className="text-lg font-bold text-white">05:30 AM – 11:30 PM</div>
          <p className="text-xs text-slate-400 leading-normal">
            Trains run every 2 to 4 minutes during peak hours. Sunday service begins at 06:00 AM on most lines.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#09101f] border border-blue-950 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" /> Airport Express (Orange)
          </div>
          <div className="text-lg font-bold text-white">04:45 AM – 11:40 PM</div>
          <p className="text-xs text-slate-400 leading-normal">
            19 mins from IGI Airport Terminal 3 to New Delhi Railway Station! High speed 120 km/h, ₹60 ticket.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#09101f] border border-blue-950 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <CreditCard className="w-4 h-4" /> 1-Day Tourist Card
          </div>
          <div className="text-lg font-bold text-emerald-300">₹200 Pass</div>
          <p className="text-xs text-slate-400 leading-normal">
            Unlimited rides across all Delhi Metro lines for 1 calendar day (includes ₹50 refundable card deposit on return).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#09101f] border border-blue-950 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <CreditCard className="w-4 h-4" /> 3-Day Tourist Card
          </div>
          <div className="text-lg font-bold text-blue-300">₹500 Pass</div>
          <p className="text-xs text-slate-400 leading-normal">
            Unlimited travel for 3 consecutive days. Available at Customer Care desks of all 250+ Metro stations.
          </p>
        </div>
      </div>

      {/* Safety & Etiquette Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-[#0c1426] border border-blue-900/40 space-y-2">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" /> Women’s Reserved Coach
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The <strong>first carriage</strong> of every metro train in the moving direction is strictly reserved for women passengers. Men entering are subject to a ₹250 penalty by CISF security. Highly recommended for solo female travelers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0c1426] border border-amber-900/40 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" /> Peak Rush Hours to Avoid
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Peak commuter crowds hit between <strong>08:30 AM – 10:30 AM</strong> and <strong>05:30 PM – 08:00 PM</strong>, particularly at Rajiv Chowk, Kashmere Gate, and Central Secretariat interchanges. Plan monument commutes between 11:00 AM and 04:30 PM for smooth seating.
          </p>
        </div>
      </div>

      {/* Metro Lines Deep Explorer */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white font-heading">
          Explore Delhi Metro Tourist Lines
        </h3>

        {/* Line Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {METRO_LINES_DATA.map((line) => (
            <button
              key={line.name}
              onClick={() => setSelectedLine(line)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-2 cursor-pointer ${
                selectedLine.name === line.name
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-950'
                  : 'bg-[#0a1122] text-slate-300 border-blue-950 hover:text-white'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.colorHex }} />
              <span>{line.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Line Card */}
        <div className="p-5 md:p-6 rounded-2xl bg-[#09101f] border border-blue-900/60 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-950 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedLine.colorHex }} />
              <h4 className="text-lg font-bold text-white font-heading">{selectedLine.name}</h4>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-400">First:</span> <strong>{selectedLine.firstTrain}</strong>
              </div>
              <div>
                <span className="text-slate-400">Last:</span> <strong>{selectedLine.lastTrain}</strong>
              </div>
              <div>
                <span className="text-slate-400">Frequency:</span> <span className="text-cyan-300">{selectedLine.frequency}</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-950 text-xs md:text-sm text-slate-200">
            <strong className="text-blue-400">Tourist Significance: </strong>
            {selectedLine.touristSignificance}
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Key Monument &amp; Market Stops on This Line:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedLine.keyStations.map((stn, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-[#0c1426] border border-blue-900/50 text-xs text-slate-200 font-medium flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  {stn}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DTC Buses */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#09101f] border border-blue-900/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Bus className="w-4 h-4 text-emerald-400" /> DTC Electric Buses &amp; Major Tourist Routes
          </h3>
          <span className="text-xs text-emerald-400">Clean AC Fleet</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-[#0c1426] border border-blue-950 text-xs space-y-1.5">
            <strong className="text-white text-sm block">Route 505 (Mehrauli to CP)</strong>
            <p className="text-slate-400">
              Traverses from Qutub Minar / Mehrauli through AIIMS, Safdarjung Tomb, and finishes at Connaught Place Inner Circle.
            </p>
            <span className="text-emerald-400 font-bold block pt-1">Fare: ₹15 - ₹25</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c1426] border border-blue-950 text-xs space-y-1.5">
            <strong className="text-white text-sm block">Route 522 (South Delhi to India Gate)</strong>
            <p className="text-slate-400">
              Connects Ambedkar Nagar and Lajpat Nagar directly with National Stadium, India Gate circle, and Krishi Bhawan.
            </p>
            <span className="text-emerald-400 font-bold block pt-1">Fare: ₹15 - ₹25</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c1426] border border-blue-950 text-xs space-y-1.5">
            <strong className="text-white text-sm block">Route 604 (Vasant Kunj to NDLS)</strong>
            <p className="text-slate-400">
              Runs through Chanakyapuri Diplomatic Enclave, Rashtrapati Bhavan perimeter, CP, and New Delhi Railway Station.
            </p>
            <span className="text-emerald-400 font-bold block pt-1">Fare: ₹20 - ₹25</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#0c1426] border border-blue-900/40 text-xs text-slate-300">
          <strong>Ticketing Tip:</strong> You can pay conductors with cash, or scan the bus QR code via the official Delhi Government <strong>"One Delhi"</strong> App for an instant 10% discount on bus fares.
        </div>
      </div>
    </div>
  );
};
