import { useState } from "react";
import { SystemState } from "../types";
import { Shield, Play, RefreshCw, Cpu, Activity, AlertTriangle, Hammer, Crosshair, Download } from "lucide-react";

interface CADLSimulatorProps {
  systemState: SystemState;
  sendStateUpdate: (newState: Partial<SystemState>) => void;
  addSystemLog: (level: string, source: string, message: string) => void;
}

export default function CADLSimulator({ systemState, sendStateUpdate, addSystemLog }: CADLSimulatorProps) {
  const [activeInject, setActiveInject] = useState<string | null>(null);
  const [interceptRate, setInterceptRate] = useState(98.4);
  const [greenPineFreq, setGreenPineFreq] = useState(915.00);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "Battle Lab initialized.",
    "Green Pine tracking arrays running baseline sweep."
  ]);

  const handleDownloadCADLState = () => {
    const textContent = `========================================================================
GHOST-WATCH SYSTEM BLUEPRINT - CADL PROFILE ACTIVE CONFIG TEMPLATE
========================================================================
Timestamp: ${new Date().toISOString()}
Target Hardware Binding: HB-9982-AX-2026 Core Console
Active CADL Shift Protocol Level: L${systemState.cadlLevel}
Deceptive Status Metric: ${systemState.cadlStatus}

--- DECISION METRIC VARIABLES ---
Intercept Target Reliability Index: ${interceptRate}%
Green Pine Radar Carrier Wave: ${greenPineFreq} MHz
System Active Trajectory Threat Saturated Counter: ${systemState.activeThreats}

--- SIMULATOR INCIDENT ACTION TIMELINE ---
${simulationLogs.join("\n")}

========================================================================
END OF DOCUMENT // ACTIVE WAR-ROOM TEMPLATE EXPORT COMPLIANT
========================================================================`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CADL_L${systemState.cadlLevel}_PROFILE_STATE_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addSystemLog("INFO", "DOWNLOADER", `Exported active CADL Level L${systemState.cadlLevel} profile template.`);
  };

  const handleEscalateManual = (level: number) => {
    fetch("/api/cadl/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetch("/api/state")
            .then((res) => res.json())
            .then((serverState) => {
              sendStateUpdate(serverState);
              addSystemLog("ALERT", "CADL_SIM", `Operator manually shifted CADL level to ${level}.`);
            });
        }
      });
  };

  const handleInjectThreat = (threatType: string) => {
    setActiveInject(threatType);
    
    if (threatType === "PROBE") {
      setSimulationLogs(prev => ["[INJECT] Automated network port sweep identified. Threat velocity: Low.", ...prev].slice(0, 50));

      // Deploy CADL Level 2 Delay
      setTimeout(() => {
        handleEscalateManual(2);
        setInterceptRate(98.9);
      }, 800);
    } 
    else if (threatType === "PIVOT") {
      setSimulationLogs(prev => ["[INJECT] Lateral access alert on logistics node NS-03. Threat velocity: High.", ...prev].slice(0, 50));

      // Deploy CADL Level 3 Reroute to Aether honeypot
      setTimeout(() => {
        handleEscalateManual(3);
        setInterceptRate(99.2);

        // Simulate a Canary lure triggering from state
        if (systemState.actsLedger.length > 0) {
          const firstLure = systemState.actsLedger[0];
          fetch("/api/acts/trigger", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lureId: firstLure.id })
          }).then(() => {
            fetch("/api/state")
              .then((res) => res.json())
              .then((serverState) => {
                sendStateUpdate(serverState);
              });
          });
        }
      }, 800);
    } 
    else if (threatType === "EXFIL") {
      setSimulationLogs(prev => ["[INJECT] Massive encrypted data tunnel stream opened toward external subnet. Threat velocity: Saturated.", ...prev].slice(0, 50));

      // Deploy CADL Level 4 Degrade
      setTimeout(() => {
        handleEscalateManual(4);
        setInterceptRate(99.6);
      }, 800);
    } 
    else if (threatType === "QUANTUM") {
      setSimulationLogs(prev => ["[INJECT] Ballistic decryption salvage attempt on NIST vault nodes. Threat velocity: Extreme CRQC.", ...prev].slice(0, 50));

      // Deploy CADL Level 5 Neutralize
      setTimeout(() => {
        handleEscalateManual(5);
        setInterceptRate(100.0);
      }, 1000);
    }

    setTimeout(() => {
      setActiveInject(null);
    }, 2500);
  };

  const clearSimLogs = () => {
    setSimulationLogs(["Simulation timeline resetted."]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fade-in" id="cadl-simulator-root">
      {/* LEFT COLUMN: Active Level Selector panel */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg h-fit space-y-4" id="cadl-level-sidecar">
        <h2 className="text-sm font-mono font-bold text-white tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 uppercase">
          <Shield className="w-4.5 h-4.5 text-brand-orange" />
          CADL SHIFT PROTOCOLS
        </h2>

        <div className="space-y-2.5 font-mono text-xs" id="level-list-wrapper">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const isLvlActive = systemState.cadlLevel === lvl;
            let themeClass = "border-white/5 bg-[#050505] text-white/40 hover:border-white/10";
            if (isLvlActive) {
              if (lvl === 1) themeClass = "border-brand-orange bg-brand-orange/5 text-brand-orange font-bold";
              if (lvl === 2) themeClass = "border-cyan-500 bg-cyan-950 text-cyan-400 font-bold";
              if (lvl === 3) themeClass = "border-yellow-500 bg-yellow-950 text-yellow-400 font-bold";
              if (lvl === 4) themeClass = "border-orange-500 bg-orange-950 text-orange-400 font-bold";
              if (lvl >= 5) themeClass = "border-red-500 bg-red-950 text-red-500 font-bold animate-pulse";
            }

            return (
              <button
                key={lvl}
                onClick={() => handleEscalateManual(lvl)}
                className={`w-full p-3 border rounded text-left flex justify-between items-center cursor-pointer transition ${themeClass}`}
                id={`cadl-level-${lvl}-btn`}
              >
                <div className="space-y-1">
                  <div className="font-bold flex items-center gap-1.5 uppercase text-[10.5px]">
                    L{lvl} - {lvl === 1 ? "Monitor" : lvl === 2 ? "Delay" : lvl === 3 ? "Reroute" : lvl === 4 ? "Degrade" : "Neutralize"}
                  </div>
                  <span className="text-[9.5px] opacity-80 block truncate max-w-[170px] font-sans">
                    {lvl === 1 && "Gather Digital Dust"}
                    {lvl === 2 && "Synthetic Path Latency"}
                    {lvl === 3 && "Deploy AETHER Honeypot"}
                    {lvl === 4 && "Poison Payload Delivery"}
                    {lvl === 5 && "Trigger Aegis Kill-Switch"}
                  </span>
                </div>
                {isLvlActive && (
                  <span className="text-[8px] bg-black/60 border border-white/10 px-1.5 py-0.5 rounded font-extrabold tracking-widest">
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/10 pt-3.5 space-y-2 text-[10.5px] font-mono text-white/30" id="cadl-status-card">
          <span className="text-[10px] text-white/50 block font-bold uppercase tracking-wider">CURRENT DISPATCH ALIGNMENT</span>
          <p className="bg-[#050505] p-2.5 rounded border border-white/5 leading-relaxed text-white/60 text-[10px] font-sans">
            {systemState.cadlStatus}
          </p>
        </div>
      </div>

      {/* RIGHT & CENTER: Israeli BMD Battle Lab Emulator */}
      <div className="lg:col-span-2 space-y-6" id="bmd-battle-lab-panel">
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "530px" }}>
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h2 className="text-sm font-mono font-bold text-white tracking-widest flex items-center gap-2 uppercase">
                <Crosshair className="w-4.5 h-4.5 text-brand-orange animate-pulse" />
                THREAT INJECT TEST LAB
              </h2>
              <span className="text-[10px] font-mono text-white/30 bg-[#050505] border border-white/10 px-2.5 py-0.5 rounded uppercase tracking-widest">
                SIMULATION SUITE
              </span>
            </div>

            {/* Battle dials stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 text-xs font-mono font-bold" id="battle-dials">
              <div className="border border-white/5 p-3.5 h-20 rounded bg-[#050505] flex flex-col justify-between">
                <span className="text-white/30 text-[9.5px] uppercase tracking-wider block">Intercept Reliability</span>
                <span className="text-brand-orange text-xl font-bold tracking-tight">{interceptRate}%</span>
              </div>
              <div className="border border-white/5 p-3.5 h-20 rounded bg-[#050505] flex flex-col justify-between">
                <span className="text-white/30 text-[9.5px] uppercase tracking-wider block">Radar Array Status</span>
                <span className="text-white text-xl font-bold tracking-tight">ACTIVE - {greenPineFreq} MHz</span>
              </div>
              <div className="border border-white/5 p-3.5 h-20 rounded bg-[#050505] flex flex-col justify-between">
                <span className="text-white/30 text-[9.5px] uppercase tracking-wider block">Threat Influx Level</span>
                <span className={`text-[15px] font-bold uppercase tracking-wide ${systemState.activeThreats > 0 ? "text-yellow-400 animate-pulse" : "text-white"}`}>
                  {systemState.activeThreats > 0 ? "SATURATED LEVEL" : "NOMINAL LAB SCANS"}
                </span>
              </div>
            </div>

            {/* Quick Threat Inject Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-mono font-bold uppercase tracking-wider" id="inject-buttons">
              <button
                onClick={() => handleInjectThreat("PROBE")}
                disabled={activeInject !== null}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 p-3 rounded text-center transition cursor-pointer leading-tight"
              >
                port scanning probe
              </button>

              <button
                onClick={() => handleInjectThreat("PIVOT")}
                disabled={activeInject !== null}
                className="bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 p-3 rounded text-center transition cursor-pointer leading-tight"
              >
                Insider pivot lure
              </button>

              <button
                onClick={() => handleInjectThreat("EXFIL")}
                disabled={activeInject !== null}
                className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 p-3 rounded text-center transition cursor-pointer leading-tight"
              >
                exfiltration flow
              </button>

              <button
                onClick={() => handleInjectThreat("QUANTUM")}
                disabled={activeInject !== null}
                className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/35 text-red-400 p-3 rounded text-center transition cursor-pointer leading-tight"
              >
                CRQC post-quantum
              </button>
            </div>

            {/* Output log console */}
            <div className="mt-6 space-y-1.5 font-mono text-[10px]" id="simulation-history-console">
              <div className="flex justify-between items-center text-white/30 px-1 border-b border-white/10 pb-2">
                <span className="uppercase tracking-widest text-[9.5px]">TELEMETRY HISTORY LAB INDEX</span>
                <div className="flex items-center gap-3">
                  <button onClick={handleDownloadCADLState} className="text-[9px] hover:text-brand-orange text-brand-orange hover:underline cursor-pointer uppercase font-bold flex items-center gap-1">
                    <Download className="w-3 h-3 text-brand-orange shrink-0 animate-pulse" />
                    Download CADL Profile & Logs
                  </button>
                  <span className="text-white/20">|</span>
                  <button onClick={clearSimLogs} className="text-[9px] hover:text-brand-orange text-white/40 hover:underline cursor-pointer uppercase font-bold">
                    RESET LOG CONSOLE
                  </button>
                </div>
              </div>

              <div className="max-h-[140px] overflow-y-auto border border-white/5 rounded bg-[#050505] p-3 space-y-2 h-[140px]" id="sim-scroll-timeline">
                {simulationLogs.map((log, index) => (
                  <div key={index} className="text-white/70">
                    <span className="text-brand-orange font-bold mr-1.5">[TIMELINE]</span>
                    <span className="break-words font-mono text-[10px]">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-3 flex justify-between items-center text-[10.5px] text-white/30 font-mono tracking-wider uppercase">
            <span>Doctrinal Alignment: SPECTRA ENFORCED</span>
            <span className="flex items-center gap-1.5 text-[10px] text-brand-orange cursor-pointer hover:text-brand-orange/80 active:translate-y-px transition" onClick={() => setGreenPineFreq(parseFloat((910 + Math.random() * 10).toFixed(2)))}>
              <RefreshCw className="w-3.5 h-3.5 text-brand-orange" />
              Adjust frequency sweep
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
