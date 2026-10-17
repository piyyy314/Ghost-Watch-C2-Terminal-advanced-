import { CommandLog, SystemState } from "../types";
import { Shield, Radio, Terminal, Cpu, AlertTriangle, Activity, Database, CheckCircle2, Download } from "lucide-react";

interface C2DashboardProps {
  systemState: SystemState;
  sendStateUpdate: (newState: Partial<SystemState>) => void;
  onNavigate: (tab: string) => void;
}

export default function C2Dashboard({ systemState, onNavigate }: C2DashboardProps) {
  const handleDownloadLogs = () => {
    const formattedLogs = systemState.logs.map(log => 
      `[${log.timestamp}] [${log.level}] [${log.source}] ${log.message}`
    ).join("\n");
    
    const content = `GHOST-WATCH TELEMETRY SERVICE INTELLIGENCE AUDIT
=========================================================
Generated: ${new Date().toISOString()}
Hardware Binding ID: ${systemState.hardwareBindingId}
Integrity index: ${systemState.systemIntegrity}%
Active Frequency: ${systemState.loraFrequency} MHz

--- RAW INCIDENT TRACK INCIDENT RESPONSE CODES ---
${formattedLogs || "No incidents logged."}

=========================================================
CERTIFIED DISPATCH SECURE UPLINK ACTIVE
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `GW_C2_TELEMETRY_LOGS_${systemState.hardwareBindingId}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="c2-dashboard-root">
      {/* LEFT COLUMN: System Status Metrics */}
      <div className="lg:col-span-2 space-y-6" id="dashboard-left-column">
        {/* Metric Grid Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="stats-grid font-sans">
          <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-lg relative overflow-hidden flex flex-col justify-between" id="stat-integrity">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] rounded-full blur-xl"></div>
            <div className="flex items-center justify-between text-[10px] text-white/50 font-mono uppercase tracking-wider">
              <span>SYSTEM INTEGRITY</span>
              <Cpu className="w-4 h-4 text-white/30" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-mono font-bold tracking-tight text-white">
                {systemState.systemIntegrity}%
              </span>
            </div>
            <div className="mt-2 text-[10px] text-green-500 font-mono flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              SECURE BOUND ACTIVE
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-brand-orange/30 p-4 rounded-lg relative overflow-hidden flex flex-col justify-between" id="stat-threats">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-orange/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between text-[10px] text-brand-orange/85 font-mono uppercase tracking-wider">
              <span>ACTIVE THREATS</span>
              <AlertTriangle className="w-4 h-4 text-brand-orange/50" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-mono font-bold tracking-tight text-white">
                {systemState.activeThreats}
              </span>
            </div>
            <div className="mt-2 text-[10px] text-brand-orange/80 font-mono flex items-center gap-1">
              {systemState.activeThreats > 0 ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
                  LATERAL MOTION DETECTED
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e0e0e0]"></span>
                  LOWER BOUND CLEAR
                </>
              )}
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-lg relative overflow-hidden flex flex-col justify-between" id="stat-cadl">
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between text-[10px] text-white/50 font-mono uppercase tracking-wider">
              <span>CADL ESCALATION</span>
              <Activity className="w-4 h-4 text-cyan-400/55" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-mono font-bold tracking-tight text-cyan-400">
                L{systemState.cadlLevel}
              </span>
            </div>
            <div className="mt-2 text-[9.5px] text-cyan-500/80 font-mono truncate">
              {systemState.cadlLevel === 1 ? "Active Monitoring Only" : systemState.cadlStatus.split(":")[0]}
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-lg relative overflow-hidden flex flex-col justify-between" id="stat-lora">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] rounded-full blur-xl"></div>
            <div className="flex items-center justify-between text-[10px] text-white/50 font-mono uppercase tracking-wider">
              <span>LORA TELEMETRY</span>
              <Radio className="w-4 h-4 text-white/30" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-mono font-bold tracking-tight text-white">
                {systemState.loraFrequency}
              </span>
              <span className="text-[10px] font-mono text-white/40 font-bold ml-1">MHz</span>
            </div>
            <div className="mt-2 text-[10px] font-mono flex items-center gap-1">
              {systemState.ewJamming ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                  <span className="text-red-400 font-bold">JAMMING DETECTED</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="text-white/40">OOB LINK ACTIVE (P-01)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Israeli Aegis Active Defense Air Domain Visualization */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg" id="aegis-defense-visualizer">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-orange" />
              <h2 className="text-sm font-mono font-bold text-white tracking-[0.15em] uppercase">
                AEGIS ACTIVE DEFENSE COGNITIVE SPHERE
              </h2>
            </div>
            <span className="text-[10px] font-mono text-brand-orange bg-brand-orange/5 px-2 py-0.5 rounded border border-brand-orange/20 uppercase tracking-widest">
              CITRON TREE BMC ACTIVE
            </span>
          </div>

          {/* Graphical layout representing kinetic interception tiers */}
          <div className="relative border border-white/5 rounded-lg p-5 bg-[#050505]/40 font-mono text-[11px]" id="aegis-layers-visual font-mono">
            {/* Upper Tier */}
            <div className="flex items-center justify-between p-3 rounded hover:bg-white/[0.01] transition duration-150 border-l-2 border-white/30 bg-[#080808] border-white/5 mb-3">
              <div className="flex flex-col">
                <span className="font-bold text-white/90">UPPER TIER // ARROW-3 INTERCEPTOR</span>
                <span className="text-white/40 text-[10px] mt-0.5">Exo-atmospheric protection of core assets. Hardened Master Crypt Vault storage protection.</span>
              </div>
              <div className="text-right text-white/50 font-bold uppercase text-[10px] tracking-wider">
                PQC VAULT: SECURED
              </div>
            </div>

            {/* Mid-Tier */}
            <div className="flex items-center justify-between p-3 rounded hover:bg-white/[0.01] transition duration-150 border-l-2 border-white/30 bg-[#080808] border-white/5 mb-3">
              <div className="flex flex-col">
                <span className="font-bold text-white/90">MID-TIER // DAVID'S SLING SYSTEMS</span>
                <span className="text-white/40 text-[10px] mt-0.5">Saturated threat processing & Palantir Ontological path pivot mapping.</span>
              </div>
              <div className="text-right text-white/60 font-bold flex flex-col text-[10px] tracking-wider">
                <span>GREEN PINE ACTIVE</span>
                <span className="text-[8px] font-normal text-white/40">TRACKING ANOMALIES</span>
              </div>
            </div>

            {/* Lower Tier */}
            <div className="flex items-center justify-between p-3 rounded hover:bg-brand-orange/5 transition duration-150 border-l-2 border-brand-orange bg-brand-orange/5 border-brand-orange/10 mb-3">
              <div className="flex flex-col">
                <span className="font-bold text-brand-orange">LOWER TIER // IRON DOME BATTERIES</span>
                <span className="text-white/50 text-[10px] mt-0.5">Automated script & rapid scan interception. CADL level routing active.</span>
              </div>
              <div className="text-right text-brand-orange font-bold uppercase text-[10px] tracking-wider">
                {systemState.cadlLevel >= 3 ? "HONEYPOT DIRECT ENGAGED" : "SHIELD STANDBY"}
              </div>
            </div>

            {/* Terminal Tier */}
            <div className="flex items-center justify-between p-3 rounded hover:bg-white/[0.01] transition duration-150 border-l-2 border-red-500 bg-red-500/5 border-red-500/10">
              <div className="flex flex-col">
                <span className="font-bold text-red-400">TERMINAL TIER // IRON BEAM DIRECT COHERENT PULSES</span>
                <span className="text-white/40 text-[10px] mt-0.5">Speed-of-light physical or network isolation. CTRL+SHIFT+ALT+WIPE bind active.</span>
              </div>
              <div className="text-right text-red-500 font-bold animate-pulse text-[10px] tracking-wider">
                CRYO-VAULT ARMED
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 text-[10px] text-white/40 font-mono">
            <span>Citron Tree BMC: HB-9982-AX-2026 Engine</span>
            <span>Target scan cycle rate: 915.0 MHz - Zero-loss buffer</span>
          </div>
        </div>

        {/* Operational Security Hardware Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="opsec-specs-grid">
          <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg" id="acts-mini-overview">
            <h3 className="text-xs font-mono font-bold text-brand-orange mb-3 tracking-[0.1em] uppercase flex items-center gap-2">
              <Database className="w-4 h-4 text-brand-orange" />
              CANARY TRAP SYSTEM (ACTS)
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-mono">
              Using the <span className="text-[#e2e8f0] font-semibold">WE-FORGE Algorithm</span>, ACTS dynamically creates plausible but subtly incorrect lure profiles. It injects semantic watermarks and maps DNS-resolution routes to pinpoint insider exfiltration paths.
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => onNavigate("acts")}
                className="text-[10px] font-mono font-semibold text-brand-orange border border-brand-orange/30 hover:border-brand-orange/80 px-3 py-2 rounded bg-brand-orange/5 hover:bg-brand-orange/15 transition w-full text-center uppercase tracking-widest cursor-pointer"
              >
                ACCESS CANARY FACTORY
              </button>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg" id="pqc-mini-overview">
            <h3 className="text-xs font-mono font-bold text-brand-orange mb-3 tracking-[0.1em] uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-orange" />
              POST-QUANTUM CRYPTOGRAPHY
            </h3>
            <p className="text-xs text-white/60 leading-relaxed font-mono">
              Ready for the modern Quantum threat posture using hybrid KEM protocols. Fully complies with NIST FIPS 203 (<span className="text-neutral-200">ML-KEM-768</span>), FIPS 204 (<span className="text-neutral-200">ML-DSA</span>) and FIPS 205 (<span className="text-neutral-205">SLH-DSA</span>) metrics.
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => onNavigate("pqc")}
                className="text-[10px] font-mono font-semibold text-brand-orange border border-brand-orange/30 hover:border-brand-orange/80 px-3 py-2 rounded bg-brand-orange/5 hover:bg-brand-orange/15 transition w-full text-center uppercase tracking-widest cursor-pointer"
              >
                OPEN PQC SANDBOX
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Terminal Log Feed and Communication Status */}
      <div className="space-y-6" id="dashboard-right-column">
        {/* Comms Panel */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg" id="comms-panel">
          <h3 className="text-xs font-mono font-bold text-brand-orange mb-3 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-brand-orange" />
              NIGHTSHADE SPECTRA CONTROL
            </span>
          </h3>

          <div className="space-y-4 font-mono text-xs text-slate-350" id="lora-status-block">
            <div className="flex justify-between items-center bg-[#050505] p-2.5 rounded border border-white/5">
              <span className="text-white/40 uppercase text-[10px]">LORA COMS</span>
              <span className="text-[#F27D26] font-bold">{systemState.loraFrequency} MHz</span>
            </div>

            <div className="flex justify-between items-center bg-[#050505] p-2.5 rounded border border-white/5">
              <span className="text-white/40 uppercase text-[10px]">EW SCAN MODE</span>
              <span className={systemState.ewJamming ? "text-red-400 animate-pulse font-bold" : "text-green-500 font-bold"}>
                {systemState.ewJamming ? "JAMMING ACTIVE" : "SPECTRUM CLEAN"}
              </span>
            </div>

            <div className="flex justify-between items-center bg-[#050505] p-2.5 rounded border border-white/5">
              <span className="text-white/40 uppercase text-[10px]">SECURE HUB BAND</span>
              <span className="text-white/60">RF-MESH LINK</span>
            </div>

            <div className="h-1 bg-white/5 rounded overflow-hidden relative border border-white/5 mb-2 mt-2">
              <div 
                className="h-full bg-brand-orange" 
                style={{ width: `${systemState.systemIntegrity}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[8px] text-white/30 uppercase tracking-wider font-mono">
              <span>902.0 MHz</span>
              <span>928.0 MHz</span>
            </div>
          </div>
        </div>

        {/* Real-Time Security Intelligence Feed */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "392px" }} id="logs-panel">
          <div className="mb-3">
            <h3 className="text-xs font-mono font-bold text-brand-orange tracking-[0.1em] uppercase flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-orange" />
              CITRON TREE BMC RAW TELEMETRY CODES
            </h3>
            <p className="text-[10px] text-white/40 font-mono mt-1">Real-time active tracking incident response codes</p>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[290px] border border-white/5 rounded p-2.5 bg-[#050505]/60 space-y-2.5 font-mono text-[10px]" id="logs-feed-container">
            {systemState.logs.length === 0 ? (
              <div className="text-white/30 text-center py-10">No active incidents captured.</div>
            ) : (
              systemState.logs.map((log, index) => {
                let badgeColor = "text-green-500 border-green-550/20 bg-green-550/5";
                if (log.level === "WARNING") badgeColor = "text-yellow-400 border-yellow-500/20 bg-yellow-500/5";
                if (log.level === "ALERT") badgeColor = "text-brand-orange border-brand-orange/20 bg-brand-orange/5";
                if (log.level === "CRITICAL") badgeColor = "text-red-400 border-red-500/20 bg-red-500/5 animate-pulse";
                
                return (
                   <div key={index} className="border-b border-white/5 pb-2 last:border-b-0" id={`log-${index}`}>
                    <div className="flex justify-between items-center text-[9px] text-white/30 mb-1">
                      <span>{log.source} // {new Date(log.timestamp).toLocaleTimeString()}</span>
                      <span className={`px-1.5 py-0.5 rounded border uppercase text-[7.5px] ${badgeColor} font-bold`}>
                        {log.level}
                      </span>
                    </div>
                    <p className="text-white/70 break-words leading-relaxed">{log.message}</p>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-3.5 pt-1">
            <button
              onClick={handleDownloadLogs}
              className="w-full bg-brand-orange/15 hover:bg-brand-orange/25 border border-brand-orange/30 text-brand-orange py-2 rounded font-bold cursor-pointer transition text-[9.5px] uppercase tracking-widest flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-brand-orange" />
              Download C2 Telemetry Logs
            </button>
          </div>

          <div className="mt-3 border-t border-white/10 pt-3 flex justify-between items-center text-[9px] text-white/30 font-mono">
            <span>TERMINAL UPLINK STATUS: SECURE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
