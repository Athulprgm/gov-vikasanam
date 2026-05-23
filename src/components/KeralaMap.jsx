import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../context/DataContext';
import { Landmark, TrendingUp, Compass, Award } from 'lucide-react';

export default function KeralaMap() {
  const { districts } = useData();
  const [selectedDistrictId, setSelectedDistrictId] = useState("trivandrum");
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const activeDistrict = districts.find(d => d.id === selectedDistrictId) || districts[districts.length - 1];
  const displayDistrict = hoveredDistrict || activeDistrict;

  // Render high-tech neon nodes for districts
  return (
    <section id="kerala-map" className="relative bg-[#151515] py-24 overflow-hidden border-y border-white/5">
      {/* Background ambient lighting */}
      <div className="glow-blob glow-green w-[600px] h-[600px] -bottom-20 -left-20 opacity-5 pointer-events-none" />
      <div className="glow-blob glow-blue w-[500px] h-[500px] top-10 right-10 opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-widest text-[#4CFF9B] font-mono font-bold block mb-3">
            Regional Development
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#F5F5F5] font-malayalam leading-tight">
            കേരളത്തിന്റെ വികസന പാത
          </h2>
          <p className="text-[#B0B0B0] text-sm md:text-base font-malayalam mt-4 max-w-xl mx-auto font-light">
            ജില്ലകളിൽ ക്ലിക്ക് ചെയ്ത് അതാത് സ്ഥലങ്ങളിൽ പൂർത്തിയായ പദ്ധതികളുടെയും നിക്ഷേപത്തിന്റെയും കണക്കുകൾ കാണുക.
          </p>
        </div>

        {/* Map and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Stylized High-Tech Kerala Map */}
          <div className="lg:col-span-6 flex justify-center items-center relative py-6">
            
            {/* Compass / Hud Graphic */}
            <div className="absolute top-2 left-2 text-[#4CFF9B]/40 font-mono text-[9px] flex items-center space-x-2 pointer-events-none">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>MAP VIEWPORT: KERALA STATE</span>
            </div>

            {/* Main Interactive Map Canvas */}
            <div className="relative w-[340px] h-[680px] bg-black/35 rounded-3xl border border-white/5 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
              
              {/* Subtle grid background */}
              <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
              
              {/* Custom SVG stylized path representing Kerala */}
              <svg
                width="280"
                height="600"
                viewBox="0 0 300 640"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="z-0"
              >
                {/* stylized coast line */}
                <path
                  d="M60 40 L80 100 L110 140 L120 180 L140 220 L160 250 L180 300 L180 340 L180 390 L180 430 L160 480 L190 520 L210 560 L240 600"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="10 5"
                />

                {/* Main connecting track */}
                <path
                  d="M80 80 L100 140 L160 160 L120 200 L160 240 L210 260 L170 310 L170 370 L240 390 L200 430 L170 460 L220 490 L200 530 L230 590"
                  stroke="url(#map-line-grad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                <defs>
                  <linearGradient id="map-line-grad" x1="80" y1="80" x2="230" y2="590" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2ECC71" stopOpacity="0.4" />
                    <stop offset="0.5" stopColor="#4CFF9B" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#3498db" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Interactive nodes placed over coordinates */}
              {districts.map((district) => {
                const isSelected = district.id === selectedDistrictId;
                const isHovered = district.id === hoveredDistrict?.id;

                return (
                  <button
                    key={district.id}
                    onClick={() => setSelectedDistrictId(district.id)}
                    onMouseEnter={() => setHoveredDistrict(district)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                    className="absolute group focus:outline-none transition-transform duration-300 active:scale-95"
                    style={{
                      left: `${district.x}px`,
                      top: `${district.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Ring Pulse */}
                    {(isSelected || isHovered) && (
                      <span className="absolute inline-flex h-8 w-8 rounded-full bg-[#4CFF9B]/20 -left-1 -top-1 animate-ping" />
                    )}

                    {/* Outer Core */}
                    <span className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                      isSelected
                        ? 'h-6 w-6 bg-gradient-to-r from-[#2ECC71] to-[#4CFF9B] border-2 border-black shadow-[0_0_15px_#4CFF9B]'
                        : isHovered
                        ? 'h-6 w-6 bg-[#4CFF9B] border-2 border-black shadow-[0_0_10px_rgba(76,255,155,0.7)]'
                        : 'h-4 w-4 bg-[#151515] border border-white/20 hover:border-[#4CFF9B] hover:scale-110'
                    }`}
                    >
                      {/* Inside Core */}
                      <span className={`rounded-full ${
                        isSelected
                          ? 'h-2 w-2 bg-black'
                          : 'h-1.5 w-1.5 bg-[#4CFF9B]'
                      }`}
                      />
                    </span>

                    {/* Small Label on Hover */}
                    <span className="absolute top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 border border-white/10 px-2 py-0.5 rounded text-[9px] text-[#4CFF9B] font-malayalam whitespace-nowrap z-30 pointer-events-none">
                      {district.nameMl}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>

          {/* Right Column: Holographic Details Board */}
          <div className="lg:col-span-6 text-left flex flex-col justify-center">
            <div className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden shadow-2xl min-h-[420px] flex flex-col justify-between">
              
              {/* Top ambient status grid */}
              <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-white/25">
                STATUS: ONLINE
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-[#2ECC71]/10 rounded-xl">
                    <Landmark className="w-6 h-6 text-[#2ECC71]" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-[#F5F5F5] font-malayalam leading-none">
                      {displayDistrict.nameMl}
                    </h3>
                    <div className="text-xs text-[#B0B0B0] font-mono tracking-widest uppercase mt-1">
                      {displayDistrict.nameEn} District
                    </div>
                  </div>
                </div>

                {/* Investment Metric grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="text-[#B0B0B0] font-malayalam text-xs flex items-center mb-1.5">
                      <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-[#2ECC71]" />
                      ആകെ നിക്ഷേപം
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#4CFF9B] text-glow-subtle">
                      {displayDistrict.investment}
                    </div>
                  </div>

                  <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                    <div className="text-[#B0B0B0] font-malayalam text-xs flex items-center mb-1.5">
                      <Award className="w-3.5 h-3.5 mr-1.5 text-[#2ECC71]" />
                      പൂർത്തിയായവ
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-[#F5F5F5]">
                      {displayDistrict.projectsCount} പദ്ധതികൾ
                    </div>
                  </div>
                </div>

                {/* Highlight banner */}
                <div className="p-5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] font-mono tracking-wider text-[#4CFF9B] mb-2 uppercase">KEY REGIONAL HIGHLIGHT</div>
                  <h4 className="text-base font-bold text-[#F5F5F5] font-malayalam leading-relaxed">
                    {displayDistrict.highlightMl}
                  </h4>
                  <p className="text-xs text-[#B0B0B0] font-mono mt-1">
                    {displayDistrict.highlightEn}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-[#B0B0B0] font-malayalam">
                <span>* പബ്ലിക് ഡാറ്റാബേസ് വഴി പരിശോധിച്ചത്.</span>
                <span className="font-mono text-[10px] text-[#2ECC71] animate-pulse">● ACTIVE REGION</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
