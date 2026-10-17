import React, { useState, useEffect } from "react";
import { 
  Crosshair, 
  Shield, 
  Activity, 
  Trash2, 
  Zap, 
  AlertTriangle, 
  Play, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";

interface ThreatVector {
  id: string;
  label: string;
  altitude: number; // km (exo-atmospheric, high altitude, etc.)
  target: "PQC Vault" | "C2 Core" | "Mesh Comms" | "Data Ontology";
  velocity: string; // e.g., Mach 8.2
  status: "DETECTED" | "TRACKED" | "INTERCEPTED";
  x: number; // 0-100 radar coordinate
  y: number; // 0-100 radar coordinate
  timeToImpact: number; // seconds
}

interface BMDBattleLabProps {
  addSystemLog: (level: string, source: string, message: string) => void;
}

export default function BMDBattleLab({ addSystemLog }: BMDBattleLabProps) {
  const [threats, setThreats] = useState<ThreatVector[]>([
    {
      id: "VECTOR-KEM-88",
      label: "Exo-Atmospheric Cryptographic Raid [SVP Salvo]",
      altitude: 350,
      target: "PQC Vault",
      velocity: "Mach 14.5",
      status: "TRACKED",
      x: 35,
      y: 25,
      timeToImpact: 14
    },
    {
      id: "VECTOR-LUR-11",
      label: "Lateral Leak Pivot Attack (Watermark exfil)",
      altitude: 120,
      target: "Data Ontology",
      velocity: "Mach 7.1",
      status: "TRACKED",
      x: 75,
      y: 50,
      timeToImpact: 22
    },
    {
      id: "VECTOR-COM-09",
      label: "Jamming Sweep Wave (Nightshade Spoof)",
      altitude: 45,
      target: "Mesh Comms",
      velocity: "Mach 5.4",
      status: "DETECTED",
      x: 18,
      y: 65,
      timeToImpact: 8
    }
  ]);

  const [activeWeapon, setActiveWeapon] = useState<"ARROW_3" | "DAVID_SLING" | "IRON_DOME" | "IRON_BEAM">("IRON_DOME");
  const [isLaunching, setIsLaunching] = useState<string | null>(null);
  const [interceptionCount, setInterceptionCount] = useState(12);
  const [simLogs, setSimLogs] = useState<string[]>([
    "[SYSTEM] CITRON TREE Fire-Control radar established tracking vectors.",
    "[SYSTEM] S-Band sweep coordinates calibrated."
  ]);

  // Animate ticking countdown of threats time to impact
  useEffect(() => {
    const countdown = setInterval(() => {
      const newImpacts: string[] = [];
      setThreats((prevThreats) => {
        return prevThreats.map((t) => {
          if (t.status === "INTERCEPTED") return t;
          if (t.timeToImpact <= 0) return t;
          const nextTime = t.timeToImpact - 1;
          if (nextTime === 0) {
            newImpacts.push(t.id);
          }
          return { ...t, timeToImpact: nextTime };
        });
      });

      if (newImpacts.length > 0) {
        newImpacts.forEach((id) => {
          addSystemLog("CRITICAL", "CITRON_TREE", `IMPACT DEPLOYED: ${id} bypassed defense indices!`);
        });
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [addSystemLog]);

  const handleLaunchInterceptor = (threatId: string) => {
    const targetThreat = threats.find((t) => t.id === threatId);
    if (!targetThreat || targetThreat.status === "INTERCEPTED") return;

    // Verify correct defense tier alignment according to Israeli BMD doctrines
    let isAligned = false;
    let weaponLabel = "";

    if (activeWeapon === "ARROW_3" && targetThreat.altitude >= 200) {
      isAligned = true;
      weaponLabel = "ARROW-3 Exo-Atmospheric Interceptor";
    } else if (activeWeapon === "DAVID_SLING" && targetThreat.altitude >= 80 && targetThreat.altitude < 200) {
      isAligned = true;
      weaponLabel = "DAVID'S SLING Dual-Staged Countermeasure";
    } else if (activeWeapon === "IRON_DOME" && targetThreat.altitude >= 15 && targetThreat.altitude < 80) {
      isAligned = true;
      weaponLabel = "IRON DOME Automated Kinetic Shielding";
    } else if (activeWeapon === "IRON_BEAM" && targetThreat.altitude < 15) {
      isAligned = true;
      weaponLabel = "IRON BEAM Solenoid Coherent Thermal pulse";
    }

    setIsLaunching(threatId);
    const logs = [...simLogs];
    logs.unshift(`[LAUNCH] Fired ${weaponLabel} targeting vector: ${threatId}`);
    setSimLogs(logs);

    setTimeout(() => {
      setThreats((prev) =>
        prev.map((t) => {
          if (t.id === threatId) {
            return { ...t, status: "INTERCEPTED", timeToImpact: 999 };
          }
          return t;
        })
      );
      
      setSimLogs((prev) => [
        `[SUCCESS] Interception validated! Node ${threatId} completely dissolved.`,
        ...prev
      ]);
      setInterceptionCount((prev) => prev + 1);
      setIsLaunching(null);
      addSystemLog("INFO", "CITRON_TREE", `Threat Interceptor confirmed target strike on ${threatId}.`);
    }, 1000);
  };

  const handleInjectNewVector = () => {
    const randomId = `VECTOR-${Math.floor(Math.random() * 90 + 10)}`;
    const targets: ("PQC Vault" | "C2 Core" | "Mesh Comms" | "Data Ontology")[] = [
      "PQC Vault", "C2 Core", "Mesh Comms", "Data Ontology"
    ];
    const chosenTarget = targets[Math.floor(Math.random() * targets.length)];
    const altitudes = [380, 150, 42, 8]; // Matching weapon splits
    const chosenAlt = altitudes[Math.floor(Math.random() * altitudes.length)];

    const newVector: ThreatVector = {
      id: randomId,
      label: `Simulated High-Energy Salvo (${chosenTarget})`,
      altitude: chosenAlt,
      target: chosenTarget,
      velocity: `Mach ${(5 + Math.random() * 10).toFixed(1)}`,
      status: "DETECTED",
      x: 10 + Math.floor(Math.random() * 80),
      y: 10 + Math.floor(Math.random() * 80),
      timeToImpact: 10 + Math.floor(Math.random() * 20)
    };

    setThreats((prev) => [...prev, newVector]);
    setSimLogs((prev) => [
      `[SENSORS] High-velocity vector matched signature coordinates: ${randomId}`,
      ...prev
    ]);
    addSystemLog("WARNING", "CITRON_TREE", `BMD radar matched fresh trajectory vector: ${randomId}`);
  };

  const activeThreatsList = threats.filter((t) => t.status !== "INTERCEPTED");

  // Forensics report downloader
  const handleDownloadReport = () => {
    const reportText = `========================================================================
ISRAELI CITRON TREE BMD BATTLE LAB - SECURITY SITUATION ASSESSMENT REPORT
========================================================================
Timestamp: ${new Date().toISOString()}
Compliance Authority: Aegis Active Defense Air Domain Division
Terminal Target Binding: HB-9982-AX-2026 Core Console

--- SUMMARY COUNTERMEASURES INDEX ---
Active Threat Tracks: ${activeThreatsList.length}
Interceptions Validated: ${interceptionCount}
Primary Active Battery Selection: ${activeWeapon}

--- ACTIVE SENSOR TARGET DISPATCH LIST ---
${threats.map((t) => 
  `ID: ${t.id}
  Status: ${t.status}
  Altitude: ${t.altitude}km (Target: ${t.target})
  Velocity Vector: ${t.velocity} (Time to impact: ${t.status === "INTERCEPTED" ? "N/A" : `${t.timeToImpact}s`})
  `
).join("\n")}

--- FIRE CONTROL SYSTEM AUDIT LOG ---
${simLogs.join("\n")}

========================================================================
END OF DOCUMENT // AEGIS STRATEGIC CRYPTO SHIELD ARMED
========================================================================`;
    
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CITRON_TREE_BMD_REPORT_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addSystemLog("INFO", "DOWNLOADER", "Downloaded BMD active defensive war-room assessment report.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fade-in" id="bmd-lab-panel">
      {/* 1. LEFT PANEL: Citron Tree Countermeasure Control Panel */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "580px" }} id="bmd-control-column">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-mono font-bold text-white tracking-widest flex items-center gap-2 uppercase">
              <Crosshair className="w-4.5 h-4.5 text-brand-orange animate-pulse" />
              Citron Tree Battery Control
            </h2>
            <span className="text-[9px] font-mono font-bold text-brand-orange bg-brand-orange/5 border border-brand-orange/20 px-2.5 py-0.5 rounded tracking-widest uppercase">
              AIR-DEFENSE
            </span>
          </div>

          <p className="text-xs text-white/50 leading-relaxed font-mono">
            Derived from the Israeli BMD Battle Lab doctrine. Operators align specific fire-control batteries to intercept high-velocity incoming cyber trajectory vectors before impact constraints elapse.
          </p>

          <div className="pt-2 space-y-2.5 font-mono text-xs" id="weapon-selectors">
            <span className="text-white/30 text-[9px] font-bold block uppercase tracking-wider">ACTIVE DEFENSIVE BATTERY ALIGNMENT</span>
            
            {/* ARROW 3 */}
            <button
              onClick={() => setActiveWeapon("ARROW_3")}
              className={`w-full p-2.5 border rounded text-left flex justify-between items-center transition cursor-pointer ${
                activeWeapon === "ARROW_3"
                  ? "border-brand-orange bg-brand-orange/10 text-brand-orange font-bold font-mono"
                  : "border-white/5 bg-[#050505] text-white/40 hover:border-white/10 hover:text-white"
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wide block">ARROW-3 INTERCEPT BLOCK</span>
                <span className="text-[9.5px] opacity-80 block truncate font-sans">Exo-Atmosphere (&ge; 200km) altitude protectors</span>
              </div>
            </button>

            {/* DAVID SLING */}
            <button
              onClick={() => setActiveWeapon("DAVID_SLING")}
              className={`w-full p-2.5 border rounded text-left flex justify-between items-center transition cursor-pointer ${
                activeWeapon === "DAVID_SLING"
                  ? "border-brand-orange bg-brand-orange/10 text-brand-orange font-bold font-mono"
                  : "border-white/5 bg-[#050505] text-white/40 hover:border-white/10 hover:text-white"
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wide block">DAVID'S SLING SYSTEMS</span>
                <span className="text-[9.5px] opacity-80 block truncate font-sans">Mid-Altitude (80km &le; y &lt; 200km) loops</span>
              </div>
            </button>

            {/* IRON DOME */}
            <button
              onClick={() => setActiveWeapon("IRON_DOME")}
              className={`w-full p-2.5 border rounded text-left flex justify-between items-center transition cursor-pointer ${
                activeWeapon === "IRON_DOME"
                  ? "border-brand-orange bg-brand-orange/10 text-brand-orange font-bold font-mono"
                  : "border-white/5 bg-[#050505] text-white/40 hover:border-white/10 hover:text-white"
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wide block">IRON DOME UNIT CARRIER</span>
                <span className="text-[9.5px] opacity-80 block truncate font-sans">Low-Altitude (15km &le; y &lt; 80km) sweeps</span>
              </div>
            </button>

            {/* IRON BEAM */}
            <button
              onClick={() => setActiveWeapon("IRON_BEAM")}
              className={`w-full p-2.5 border rounded text-left flex justify-between items-center transition cursor-pointer ${
                activeWeapon === "IRON_BEAM"
                  ? "border-brand-orange bg-brand-orange/10 text-brand-orange font-bold font-mono"
                  : "border-white/5 bg-[#050505] text-white/40 hover:border-white/10 hover:text-white"
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10.5px] font-extrabold uppercase tracking-wide block">IRON BEAM THERMAL LASER</span>
                <span className="text-[9.5px] opacity-80 block truncate font-sans">Terminal-tier altitude (&lt; 15km) coherent shock</span>
              </div>
            </button>
          </div>

          <button
            onClick={handleInjectNewVector}
            className="w-full bg-[#0d0d0d] hover:bg-white/[0.04] border border-white/10 text-white/70 hover:text-white py-2 rounded font-mono text-[10.5px] uppercase tracking-wide flex items-center justify-center gap-1 cursor-pointer transition"
          >
            <ArrowUpRight className="w-4 h-4 text-brand-orange animate-pulse" />
            Inject Trajectory Vector
          </button>
        </div>

        <div className="border-t border-white/5 pt-3.5">
          <button
            onClick={handleDownloadReport}
            className="w-full bg-[#050505] border border-white/10 hover:border-brand-orange/30 text-white/80 hover:text-white py-2 rounded font-mono font-bold text-[10.5px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-brand-orange shrink-0 animate-pulse" />
            Download Situational Assessment Report
          </button>
        </div>
      </div>

      {/* 2. RIGHT & CENTER: Interactive BMD Tactical Grid Visualizer */}
      <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-lg flex flex-col justify-between" style={{ minHeight: "580px" }} id="bmd-radar-column">
        {/* Radar Console Header */}
        <div className="bg-[#0a0a0a] border-b border-white/10 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-mono">
            <Activity className="w-4 h-4 text-brand-orange" />
            <h3 className="text-xs font-bold text-white tracking-widest uppercase">
              Citron Tree BMD Radar Screen (Green Pine Array)
            </h3>
          </div>
          <div className="text-[9.5px] font-mono text-cyan-400 font-bold border border-cyan-500/25 bg-cyan-950/20 px-2.5 py-0.5 uppercase tracking-wide rounded">
            Interceptions: {interceptionCount} Verified
          </div>
        </div>

        {/* radar grid window */}
        <div className="relative flex-1 bg-black/60 overflow-hidden flex items-center justify-center" style={{ minHeight: "280px" }} id="radar-screen">
          {/* SVG coordinate drawing block */}
          <svg className="w-full h-full max-h-[300px]" viewBox="0 0 400 300">
            {/* Radar Grid Concentric Circles */}
            <circle cx="200" cy="150" r="140" fill="none" stroke="#22c55e" strokeOpacity="0.04" strokeWidth="1.5" />
            <circle cx="200" cy="150" r="100" fill="none" stroke="#22c55e" strokeOpacity="0.07" strokeWidth="1.5" />
            <circle cx="200" cy="150" r="60" fill="none" stroke="#22c55e" strokeOpacity="0.1" strokeWidth="1" />
            <circle cx="200" cy="150" r="20" fill="none" stroke="#22c55e" strokeOpacity="0.15" strokeWidth="1" />

            {/* Crosshair auxiliary lines */}
            <line x1="200" y1="10" x2="200" y2="290" stroke="#22c55e" strokeOpacity="0.04" strokeWidth="1" />
            <line x1="50" y1="150" x2="350" y2="150" stroke="#22c55e" strokeOpacity="0.04" strokeWidth="1" />

            {/* Rotating radar sweep element using CSS rotation */}
            <g style={{ transformOrigin: "200px 150px" }} className="animate-[spin_4s_linear_infinite]">
              <line 
                x1="200" 
                y1="150" 
                x2="340" 
                y2="150" 
                stroke="#22c55e" 
                strokeOpacity="0.32" 
                strokeWidth="2" 
              />
            </g>

            {/* Coordinate markers loop */}
            {threats.map((threat) => {
              // Map 0-100 values nicely inside 400x300 canvas coordinates
              const cx = 50 + (threat.x / 100) * 300;
              const cy = 40 + (threat.y / 100) * 220;

              if (threat.status === "INTERCEPTED") {
                return (
                  <g key={threat.id} transform={`translate(${cx}, ${cy})`}>
                    <circle r="12" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.4" className="animate-ping" />
                    <text textAnchor="middle" y="4" fill="#22c55e" className="font-mono font-bold text-[8px] uppercase tracking-tighter">OK</text>
                  </g>
                );
              }

              const isThreatCritical = threat.timeToImpact < 8;
              const ringColor = isThreatCritical ? "#f87171" : "#facc15";

              return (
                <g 
                  key={threat.id} 
                  transform={`translate(${cx}, ${cy})`}
                  className="cursor-pointer"
                  onClick={() => handleLaunchInterceptor(threat.id)}
                >
                  {/* Outer danger radar ping */}
                  <circle r="18" fill="none" stroke={ringColor} strokeWidth="1.5" className="animate-pulse" opacity="0.4" />
                  {isLaunching === threat.id && (
                    <circle r="26" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3,3" className="animate-spin" />
                  )}

                  {/* Threat core marker */}
                  <circle r="6" fill={ringColor} />
                  
                  {/* Hover or fixed label coordinates */}
                  <text 
                    y="-10" 
                    textAnchor="middle" 
                    className="font-mono text-[8px] font-bold uppercase tracking-wider" 
                    fill={isThreatCritical ? "#ef4444" : "#f59e0b"}
                  >
                    {threat.id} ({threat.timeToImpact}s)
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive instruction HUD */}
          <div className="absolute bottom-3 left-3 bg-[#0a0a0a]/95 border border-white/10 p-2.5 rounded text-[9.5px] space-y-1 font-mono text-white/50 z-10">
            <div className="font-black uppercase text-[8px] text-white/30 tracking-widest border-b border-white/5 pb-1 mb-1">RADAR CALIBRATION HUD</div>
            <div>&bull; CLASSIFY RADAR DOTS AND RESOLVE COMPLIANCE</div>
            <div>&bull; CHOOSE ALIGNED COUNTERMEASURE SUITE</div>
            <div>&bull; MANDATE DIRECT INTERCEPT CLICK ON VECTORS</div>
          </div>
        </div>

        {/* Threat tracks roster and launch keys */}
        <div className="bg-[#0a0a0a] border-t border-white/10 p-4 space-y-3 font-mono text-xs">
          <span className="text-white/35 text-[9.5px] uppercase font-bold tracking-wider block">ATTENTION VECTOR DISPATCH TERMINAL</span>
          
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1" id="battle-threats-scroller">
            {activeThreatsList.length === 0 ? (
              <div className="text-center py-8 text-white/20 text-[10px] uppercase font-bold text-center">
                All airspace indices clear. Green Pine sweeping telemetry.
              </div>
            ) : (
              activeThreatsList.map((threat) => {
                // Determine alignment suitability class
                let isSuitable = false;
                if (activeWeapon === "ARROW_3" && threat.altitude >= 200) isSuitable = true;
                if (activeWeapon === "DAVID_SLING" && threat.altitude >= 80 && threat.altitude < 200) isSuitable = true;
                if (activeWeapon === "IRON_DOME" && threat.altitude >= 15 && threat.altitude < 80) isSuitable = true;
                if (activeWeapon === "IRON_BEAM" && threat.altitude < 15) isSuitable = true;

                return (
                  <div 
                    key={threat.id} 
                    className={`border p-2.5 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 transition ${
                      threat.timeToImpact < 8 
                        ? "bg-red-500/5 border-red-500/30" 
                        : "bg-[#050505] border-white/5 hover:border-brand-orange/20"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold flex items-center gap-1.5 uppercase text-[10.5px]">
                        <span className="text-brand-orange">{threat.id}</span>
                        <span className="text-white/40">|</span>
                        <span className="text-white">{threat.target} Tier</span>
                      </div>
                      <div className="text-[9.5px] text-white/40 font-sans">
                        Altitude: <strong className="text-white/70">{threat.altitude}km</strong> &bull; Velocity: <strong className="text-white/70">{threat.velocity}</strong> &bull; Velocity Flag: <strong className={isSuitable ? "text-green-400 uppercase" : "text-brand-orange/60 uppercase"}>{isSuitable ? "BATTERY READY" : "BATTERY MISALIGNED"}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className={`text-[10px] font-extrabold uppercase ${threat.timeToImpact < 8 ? "text-red-400 animate-pulse" : "text-white/50"}`}>
                        IMPACT: {threat.timeToImpact}S
                      </span>
                      <button
                        onClick={() => handleLaunchInterceptor(threat.id)}
                        disabled={isLaunching !== null || !isSuitable}
                        className={`text-[9.5px] font-bold px-3 py-1.5 rounded transition uppercase tracking-wider cursor-pointer border ${
                          isLaunching === threat.id
                            ? "bg-brand-orange/10 border-brand-orange/40 text-brand-orange font-mono"
                            : isSuitable
                            ? "bg-green-500/15 border-green-500/35 text-green-400 hover:bg-green-500/25 cursor-pointer"
                            : "bg-[#0c0c0c] border-white/5 text-white/20 cursor-not-allowed"
                        }`}
                      >
                        {isLaunching === threat.id ? "Intercepting..." : "Launch counter"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
