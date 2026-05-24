import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../context/DataContext";
import { Landmark, TrendingUp, Compass, Award } from "lucide-react";

export default function KeralaMap() {
  const { districts } = useData();
  const [selectedDistrictId, setSelectedDistrictId] = useState("trivandrum");
  const [hoveredDistrict, setHoveredDistrict] = useState(null);

  const activeDistrict =
    districts.find((d) => d.id === selectedDistrictId) ||
    districts[districts.length - 1];
  const displayDistrict = hoveredDistrict || activeDistrict;

  // Render high-tech neon nodes for districts
  return (
    <section
      id="kerala-map"
      className="relative bg-bg-sec section-padding overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="glow-blob glow-green w-[600px] h-[600px] -bottom-20 -left-20 opacity-5 pointer-events-none" />
      <div className="glow-blob glow-blue w-[500px] h-[500px] top-10 right-10 opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-widest text-accent font-mono font-bold block mb-3">
            Regional Development
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-txt-primary font-malayalam leading-tight">
            കേരളത്തിന്റെ വികസന പാത
          </h2>
          <p className="text-txt-secondary text-sm md:text-base font-malayalam mt-4 max-w-xl mx-auto font-light">
            ജില്ലകളിൽ ക്ലിക്ക് ചെയ്ത് അതാത് സ്ഥലങ്ങളിൽ പൂർത്തിയായ പദ്ധതികളുടെയും
            നിക്ഷേപത്തിന്റെയും കണക്കുകൾ കാണുക.
          </p>
        </div>

        {/* Map and Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Stylized High-Tech Kerala Map */}
          <div className="lg:col-span-6 flex justify-center items-center relative py-6">
            {/* Compass / Hud Graphic */}
            <div className="absolute top-2 left-2 text-accent/60 font-mono text-[9px] flex items-center space-x-2 pointer-events-none">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <span>MAP VIEWPORT: KERALA STATE</span>
            </div>

            {/* Main Interactive Map Canvas */}
            <div className="relative w-[340px] h-[680px] bg-bg-main/60 rounded-3xl border border-border-main p-8 flex items-center justify-center overflow-hidden shadow-md">
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
                  stroke="rgba(166, 124, 82, 0.15)"
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
                  <linearGradient
                    id="map-line-grad"
                    x1="80"
                    y1="80"
                    x2="230"
                    y2="590"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="var(--border-color)" stopOpacity="0.4" />
                    <stop offset="0.5" stopColor="var(--accent-color)" stopOpacity="0.8" />
                    <stop offset="1" stopColor="var(--secondary-accent)" stopOpacity="0.4" />
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
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {/* Ring Pulse */}
                    {(isSelected || isHovered) && (
                      <span className="absolute inline-flex h-8 w-8 rounded-full bg-accent/20 -left-1 -top-1 animate-ping" />
                    )}

                    {/* Outer Core */}
                    <span
                      className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                        isSelected
                          ? "h-6 w-6 bg-accent border-2 border-bg-alt shadow-sm"
                          : isHovered
                            ? "h-6 w-6 bg-accent-sec border-2 border-bg-alt shadow-sm"
                            : "h-4 w-4 bg-bg-sec border border-border-main hover:border-accent hover:scale-110"
                      }`}
                    >
                      {/* Inside Core */}
                      <span
                        className={`rounded-full ${
                          isSelected
                            ? "h-2 w-2 bg-bg-alt"
                            : "h-1.5 w-1.5 bg-accent"
                        }`}
                      />
                    </span>

                    {/* Small Label on Hover */}
                    <span className="absolute top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-alt/95 border border-border-main px-2 py-0.5 rounded text-[9px] text-accent font-malayalam whitespace-nowrap z-30 pointer-events-none">
                      {district.nameMl}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Holographic Details Board */}
          <div className="lg:col-span-6 text-left flex flex-col justify-center">
            <div className="premium-card p-8 relative overflow-hidden shadow-md min-h-[420px] flex flex-col justify-between">
              {/* Top ambient status grid */}
              <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-txt-secondary/30">
                STATUS: ONLINE
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Landmark className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-txt-primary font-malayalam leading-none">
                      {displayDistrict.nameMl}
                    </h3>
                    <div className="text-xs text-txt-secondary font-mono tracking-widest uppercase mt-1">
                      {displayDistrict.nameEn} District
                    </div>
                  </div>
                </div>

                {/* Investment Metric grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-bg-main p-4 rounded-xl border border-border-main">
                    <div className="text-txt-secondary font-malayalam text-xs flex items-center mb-1.5">
                      <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-accent" />
                      ആകെ നിക്ഷേപം
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-accent text-glow-subtle">
                      {displayDistrict.investment}
                    </div>
                  </div>

                  <div className="bg-bg-main p-4 rounded-xl border border-border-main">
                    <div className="text-txt-secondary font-malayalam text-xs flex items-center mb-1.5">
                      <Award className="w-3.5 h-3.5 mr-1.5 text-accent" />
                      പൂർത്തിയായവ
                    </div>
                    <div className="text-2xl font-extrabold font-mono text-txt-primary">
                      {displayDistrict.projectsCount} പദ്ധതികൾ
                    </div>
                  </div>
                </div>

                {/* Highlight banner */}
                <div className="p-5 rounded-xl bg-bg-main/40 border border-border-main">
                  <div className="text-[10px] font-mono tracking-wider text-accent mb-2 uppercase">
                    KEY REGIONAL HIGHLIGHT
                  </div>
                  <h4 className="text-base font-bold text-txt-primary font-malayalam leading-relaxed">
                    {displayDistrict.highlightMl}
                  </h4>
                  <p className="text-xs text-txt-secondary font-mono mt-1">
                    {displayDistrict.highlightEn}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border-main flex items-center justify-between text-xs text-txt-secondary font-malayalam">
                <span>* പബ്ലിക് ഡാറ്റാബേസ് വഴി പരിശോധക്കിയത്.</span>
                <span className="font-mono text-[10px] text-accent animate-pulse">
                  ● ACTIVE REGION
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
