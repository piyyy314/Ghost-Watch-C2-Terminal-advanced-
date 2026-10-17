import { useState } from "react";
import { SystemState } from "../types";
import { Radio, ShieldAlert, Cpu, Heart, CheckCircle2, Activity, Play, Zap, Download } from "lucide-react";

interface SpectrumControlPanelProps {
  systemState: SystemState;
  sendStateUpdate: (newState: Partial<SystemState>) => void;
  addSystemLog: (level: string, source: string, message: string) => void;
}

export default function SpectrumControlPanel({ systemState, sendStateUpdate, addSystemLog }: SpectrumControlPanelProps) {
  const [selectedFreq, setSelectedFreq] = useState(systemState.loraFrequency);
  const [isHopping, setIsHopping] = useState(false);

  const handleDownloadRFProfile = () => {
    const textContent = `========================================================================
GHOST-WATCH SYSTEM // MIL-LPWAN RF FREQUENCY SPECTRUM SCHEME
========================================================================
Carrier Hopping Sequence Index
Timestamp: ${new Date().toISOString()}

--- LPWAN RF CALIBRATION SPECIFICATIONS ---
Active Channel Waveform: Sub-GHz LoRa FHSS
Assigned Hop Bandwidth: 902.0 MHz - 928.0 MHz
Active Registered Carrier: ${systemState.loraFrequency} MHz
EW Jamming Countermeasures: ${systemState.ewJamming ? "ENABLED (ACTIVE SIGNAL NOISE)" : "DISABLED (NOMINAL ENVELOPE)"}
RF Interference Ratio: ${systemState.ewJamming ? "0.912 S/N (SATURATED)" : "0.012 S/N (SHIELDED)"}

--- ESTIMATED CARRIER ATTRIBUTES ---
Primary Modulations: GFSK/FST Spread Mode
Hardware PLL Phase Noise: -115 dBc/Hz @ 100KHz Offset
Secure Cryptographic Pre-shared Key Salt: 0x88AE7F11BCD93EEA2

========================================================================
RESTRICTED FOR INTERNAL TRANSMISSION AND TIER DEFENSE OVERWATCH ONLY
========================================================================`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `GW_RF_SPECTROGRAM_PROFILE_${systemState.loraFrequency}MHZ.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addSystemLog("INFO", "DOWNLOADER", `Exported active RF spectrum LPWAN signal calibration profile of ${systemState.loraFrequency} MHz.`);
  };

  const handleHopFrequency = () => {
    setIsHopping(true);
    // Generate a random frequency in the 915 MHz band typical for LoRa
    const randomized = parseFloat((902 + Math.random() * 26).toFixed(2));
    
    setTimeout(() => {
      fetch("/api/lora/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency: randomized })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSelectedFreq(randomized);
            fetch("/api/state")
              .then((res) => res.json())
              .then((serverState) => {
                sendStateUpdate(serverState);
                addSystemLog("INFO", "NIGHTSHADE", `Spectrum hopping completed successfully. Active carrier: ${randomized} MHz`);
              });
          }
        })
        .finally(() => setIsHopping(false));
    }, 1000);
  };

  const handleToggleJamming = () => {
    const nextJamming = !systemState.ewJamming;
    
    fetch("/api/lora/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ewJamming: nextJamming })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetch("/api/state")
            .then((res) => res.json())
            .then((serverState) => {
              sendStateUpdate(serverState);
              addSystemLog("INFO", "NIGHTSHADE", `RF jamming override set to ${nextJamming ? "ENABLED" : "DISABLED"}`);
            });
        }
      });
  };

  // Generate SVG wave curves depending on state parameters
  const getWavePath = () => {
    let heightMultiplier = systemState.ewJamming ? 35 : 12;
    let periodDivisor = systemState.ewJamming ? 4 : 12;
    
    let path = `M 0 50`;
    for (let x = 0; x <= 700; x += 10) {
      const angle = (x * Math.PI) / (periodDivisor * 10);
      const noise = systemState.ewJamming ? (Math.random() - 0.5) * 15 : 0;
      const y = 50 + Math.sin(angle) * heightMultiplier + noise;
      path += ` L ${x} ${y}`;
    }
    return path;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fade-in" id="spectrum-root">
      {/* LEFT PANEL: Telemetry Frequency Control Card */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg h-fit space-y-4 font-mono text-xs" id="spectrum-controls-card">
        <h2 className="text-sm font-mono font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 uppercase">
          <Radio className="w-4.5 h-4.5 text-brand-orange animate-pulse" />
          NIGHTSHADE MESH COMMS
        </h2>

        <div className="space-y-4" id="comms-form-fields">
          <div className="space-y-2">
            <span className="text-white/30 text-[9px] uppercase font-bold tracking-wider">ACTIVE FREQUENCY SPREAD</span>
            <div className="bg-[#050505] border border-white/10 p-3 rounded font-bold text-center text-sm text-brand-orange tracking-widest">
              {systemState.loraFrequency} MHz
            </div>
            <span className="text-[10px] text-white/30 leading-snug font-sans mt-1.5 block">Operating scope: 902.0 MHz to 928.0 MHz (Sub-GHz LPWAN spectrum)</span>
          </div>

          <div className="pt-2">
            <button
              onClick={handleHopFrequency}
              disabled={isHopping}
              className="w-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange py-2.5 rounded font-bold hover:bg-brand-orange/20 active:bg-brand-orange/30 transition text-xs flex justify-center items-center gap-1.5 cursor-pointer uppercase tracking-widest"
            >
              {isHopping ? (
                <>
                  <Activity className="w-4 h-4 text-brand-orange animate-spin" />
                  CALCULATING SPREAD FACTOR...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-brand-orange animate-pulse" />
                  HOP SPREAD FREQUENCY
                </>
              )}
            </button>
          </div>

          <div className="border border-brand-orange/10 bg-brand-orange/5 p-3 rounded text-[10.5px] text-white/50 leading-relaxed font-sans" id="spectrum-brief">
            <strong>Spread Spectrum Technology:</strong> By hopping the LoRa carrier in pseudo-random sequences (FHSS), our telemetry channel establishes anti-intercept protocols resilient against state-sponsored signal detection and RF tracing.
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-white/10 text-[10.5px]" id="spectrum-ew-control bg-[#0a0a0a]">
          <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider block">EW ELECTRONIC DEFENSE OVERRIDE</span>
          <div className="flex items-center justify-between p-2.5 rounded bg-[#050505] border border-red-500/20">
            <span className="text-red-500 font-bold text-[9px] uppercase tracking-wide">SIMULATE ACTIVE SATELLITE RF JAMMING</span>
            <button
              onClick={handleToggleJamming}
              className={`text-[9.5px] font-bold px-3 py-1 rounded transition cursor-pointer border ${
                systemState.ewJamming 
                  ? "bg-red-500 border-red-400 text-black" 
                  : "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20"
              }`}
            >
              {systemState.ewJamming ? "JAMMING ACTIVE" : "JAM SIGNAL"}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT & CENTER: Animated RF Spectrogram Panel */}
      <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "410px" }} id="spectrum-visualizer-panel">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h2 className="text-sm font-mono font-bold text-white tracking-widest flex items-center gap-2 uppercase">
              <Zap className="w-4.5 h-4.5 text-brand-orange" />
              RF SPECTROGRAM REAL-TIME VISUALIZER
            </h2>
            <span className="text-[10px] font-mono text-brand-orange bg-brand-orange/5 px-2.5 py-0.5 rounded border border-brand-orange/20 uppercase tracking-widest">
              {systemState.ewJamming ? "RF CARRIER JAMMED" : "NOMINAL CARRIER"}
            </span>
          </div>

          <div className="relative border border-white/5 rounded-lg bg-[#050505]/70 overflow-hidden" style={{ minHeight: "220px" }} id="wave-canvas">
            {/* Draw Simulated Spectrogram wave graph */}
            <svg viewBox="0 0 700 120" className="w-full h-[180px]">
              {/* grid vectors */}
              <line x1="0" y1="20" x2="700" y2="20" stroke="#ffffff" strokeOpacity="0.03" />
              <line x1="0" y1="40" x2="700" y2="40" stroke="#ffffff" strokeOpacity="0.03" />
              <line x1="0" y1="60" x2="700" y2="60" stroke="#ffffff" strokeOpacity="0.03" />
              <line x1="0" y1="80" x2="700" y2="80" stroke="#ffffff" strokeOpacity="0.03" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#ffffff" strokeOpacity="0.03" />
              
              <line x1="100" y1="0" x2="100" y2="120" stroke="#ffffff" strokeOpacity="0.03" />
              <line x1="200" y1="0" x2="200" y2="120" stroke="#ffffff" strokeOpacity="0.03" />
              <line x1="300" y1="0" x2="300" y2="120" stroke="#ffffff" strokeOpacity="0.03" />
              <line x1="400" y1="0" x2="400" y2="120" stroke="#ffffff" strokeOpacity="0.03" />
              <line x1="500" y1="0" x2="500" y2="120" stroke="#ffffff" strokeOpacity="0.03" />
              <line x1="600" y1="0" x2="600" y2="120" stroke="#ffffff" strokeOpacity="0.03" />

              {/* Fluctuating RF spectrum wave */}
              <path
                d={getWavePath()}
                fill="none"
                stroke={systemState.ewJamming ? "#f87171" : "#F27D26"}
                strokeWidth={1.5}
                className="transition-all duration-150"
              />

              {/* Carrier Frequency marker line */}
              <line 
                x1={Math.min(650, Math.max(50, (systemState.loraFrequency - 902) * (600 / 26) + 50))} 
                y1="0" 
                x2={Math.min(650, Math.max(50, (systemState.loraFrequency - 902) * (600 / 26) + 50))} 
                y2="120" 
                stroke={systemState.ewJamming ? "#ef4444" : "#F27D26"} 
                strokeWidth={2}
                opacity={0.8}
              />
            </svg>

            {/* Carrier marker badge */}
            <div 
              className="absolute top-2 bg-[#050505] border px-2 py-0.5 rounded text-[8.5px] font-mono z-10 transition-all font-bold uppercase tracking-widest"
              style={{ 
                left: `${Math.min(85, Math.max(5, ((systemState.loraFrequency - 902) / 26) * 100 - 5))}%`,
                borderColor: systemState.ewJamming ? "#ef4444" : "#F27D26",
                color: systemState.ewJamming ? "#f87171" : "#F27D26"
              }}
            >
              CARRIER {systemState.loraFrequency} MHz
            </div>
          </div>

          <div className="mt-3.5">
            <button
              type="button"
              onClick={handleDownloadRFProfile}
              className="w-full bg-[#050505] hover:bg-white/[0.04] border border-white/10 text-white/70 hover:text-white py-2 rounded font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
              Download RF Calibration Profile
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-[10px] text-white/30 font-mono uppercase tracking-wide">
          <span>Spectrogram range: 902 - 928 MHz</span>
          <span>LPWAN Out-of-band: ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
}
