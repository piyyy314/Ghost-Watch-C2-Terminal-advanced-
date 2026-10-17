import { useState, useEffect, useCallback, type MouseEvent } from "react";
import { SystemState } from "./types";
import { 
  Shield, 
  Terminal, 
  Cpu, 
  Settings, 
  Database, 
  Activity, 
  Radio, 
  Network, 
  UserCheck, 
  Lock, 
  AlertTriangle,
  Folder,
  ShieldAlert,
  Crosshair,
  Info,
  Copy,
  Check
} from "lucide-react";

import C2Dashboard from "./components/C2Dashboard";
import IdentifierInjection from "./components/IdentifierInjection";
import PQCSandbox from "./components/PQCSandbox";
import OntologyMap from "./components/OntologyMap";
import CerberusProfiler from "./components/CerberusProfiler";
import CADLSimulator from "./components/CADLSimulator";
import SpectrumControlPanel from "./components/SpectrumControlPanel";
import OmegaContingency from "./components/OmegaContingency";
import BlueprintExplorer from "./components/BlueprintExplorer";
import AetherHoneypot from "./components/AetherHoneypot";
import BMDBattleLab from "./components/BMDBattleLab";
import SystemDiagnosticsModal from "./components/SystemDiagnosticsModal";

export default function App() {
  const [tab, setTab] = useState<string>("board");
  const [systemState, setSystemState] = useState<SystemState | null>(null);

  // System diagnostics state
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(3600 * 24 * 14 + 3600 * 6 + 2520);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
  const [copiedHardwareId, setCopiedHardwareId] = useState<boolean>(false);
  const [showDiagnosticsModal, setShowDiagnosticsModal] = useState<boolean>(false);

  // Copy hardware ID with fallback
  const handleCopyHardwareId = async (e?: MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!systemState?.hardwareBindingId) return;
    try {
      await navigator.clipboard.writeText(systemState.hardwareBindingId);
      setCopiedHardwareId(true);
      addSystemLog("INFO", "CLIPBOARD", `Copied Hardware ID [${systemState.hardwareBindingId}] to clipboard`);
      setTimeout(() => setCopiedHardwareId(false), 2400);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = systemState.hardwareBindingId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedHardwareId(true);
      addSystemLog("INFO", "CLIPBOARD", `Copied Hardware ID [${systemState.hardwareBindingId}] to clipboard`);
      setTimeout(() => setCopiedHardwareId(false), 2400);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
      setLastSyncTime(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (secs: number) => {
    const d = Math.floor(secs / (3600 * 24));
    const h = Math.floor((secs % (3600 * 24)) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  // Sync state function from backend server
  const syncState = useCallback(() => {
    fetch("/api/state")
      .then((res) => {
        if (!res.ok) throw new Error("Server communication offline");
        return res.json();
      })
      .then((data: SystemState) => {
        setSystemState((prev) => {
          if (!prev) return data;
          const existingKeys = new Set(data.logs.map((l) => l.timestamp + l.message));
          const uniqueLocal = prev.logs.filter((l) => !existingKeys.has(l.timestamp + l.message));
          const mergedLogs = [...uniqueLocal, ...data.logs].slice(0, 100);
          return { ...data, logs: mergedLogs };
        });
      })
      .catch((err) => {
        console.error("State sync failed: ", err);
      });
  }, []);

  // Sync state initially on mount
  useEffect(() => {
    syncState();
    // Run live synchronization loop every 4.5 seconds for simulations
    const interval = setInterval(syncState, 4500);
    return () => clearInterval(interval);
  }, [syncState]);

  // Handle local state updates from children and immediately sync back
  const handleStateUpdate = (updatedFields: Partial<SystemState>) => {
    setSystemState((prev) => {
      if (!prev) return null;
      return { ...prev, ...updatedFields };
    });
  };

  // Log injector for local client visual notifications
  const addSystemLog = useCallback((level: string, source: string, message: string) => {
    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, source, message })
    }).catch(() => {});

    setSystemState((prev) => {
      if (!prev) return null;
      const newLogs = [
        {
          timestamp: new Date().toISOString(),
          level,
          source,
          message
        } as any,
        ...prev.logs
      ];
      return { ...prev, logs: newLogs.slice(0, 100) };
    });
  }, []);

  if (!systemState) {
    return (
      <div className="min-h-screen bg-[#050505] dot-bg flex flex-col items-center justify-center space-y-4 text-xs font-mono select-none" id="loader-wrapper">
        <Activity className="w-8 h-8 animate-spin text-brand-orange" />
        <span className="text-white/60 tracking-wider">ESTABLISHING SECURE CRYPTO BOUNDS...</span>
      </div>
    );
  }

  const isLocked = systemState.systemLocked;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col dot-bg" id="app-root">
      {/* 1. SECURE TOP NAVIGATION TERMINAL PANEL */}
      <header className="bg-[#0a0a0a] border-b border-white/10 py-3.5 px-6 flex flex-col md:flex-row justify-between items-center gap-4 z-40" id="terminal-header">
        <div className="flex items-center gap-4" id="branding-panel">
          <div className="w-8 h-8 bg-brand-orange rounded-sm flex items-center justify-center shadow-[0_0_12px_rgba(242,125,38,0.25)]" id="branding-badge">
            <div className="w-4 h-4 border-2 border-black rotate-45"></div>
          </div>
          <div>
            <h1 className="text-lg font-serif italic tracking-widest text-white uppercase">
              Ghost-Watch <span className="text-brand-orange font-sans font-bold not-italic">Apex Tier</span>
            </h1>
            <div className="relative group inline-block mt-0.5" id="hardware-id-container">
              {/* Visual Feedback: Copied Toast Indicator */}
              {copiedHardwareId && (
                <div 
                  id="hardware-id-copied-toast"
                  role="status"
                  aria-live="polite"
                  className="absolute -top-7 left-0 z-[60] bg-emerald-950/95 border border-emerald-500/70 text-emerald-300 text-[9.5px] font-mono px-2 py-0.5 rounded shadow-[0_2px_12px_rgba(16,185,129,0.35)] flex items-center gap-1.5 animate-bounce font-bold tracking-wider pointer-events-none whitespace-nowrap"
                >
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Hardware ID Copied!</span>
                </div>
              )}

              {/* Clickable Hardware ID Text */}
              <div 
                className="text-[10px] font-mono text-white/40 uppercase hover:text-brand-orange transition cursor-pointer flex items-center gap-1.5 py-0.5 px-1.5 -mx-1.5 rounded hover:bg-white/[0.04] select-none"
                id="hardware-id-text"
                onClick={handleCopyHardwareId}
                title="Click to copy Hardware ID to clipboard"
              >
                <span>Hardware ID: {systemState.hardwareBindingId}</span>
                {copiedHardwareId ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[9px] bg-emerald-950/80 border border-emerald-500/50 px-1.5 py-0.2 rounded ml-0.5 animate-fadeIn">
                    <Check className="w-2.5 h-2.5 text-emerald-400" />
                    Copied!
                  </span>
                ) : (
                  <Copy className="w-3 h-3 text-white/30 group-hover:text-brand-orange transition shrink-0 ml-0.5" />
                )}
                <Info className="w-3 h-3 text-white/30 group-hover:text-brand-orange transition shrink-0" />
              </div>

              {/* System Diagnostics Hover Tooltip with 200ms transition hide delay and positioning margin */}
              <div 
                className="absolute left-0 top-[calc(100%+6px)] z-50 w-76 sm:w-80 bg-[#0a0a0c]/98 border border-brand-orange/40 rounded-lg shadow-[0_12px_36px_rgba(0,0,0,0.85)] p-3 text-xs font-mono backdrop-blur-md opacity-0 invisible pointer-events-none transition-all duration-150 delay-200 group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:delay-0 group-hover:duration-150 hover:opacity-100 hover:visible hover:pointer-events-auto hover:delay-0 before:content-[''] before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:block"
                id="hardware-id-diagnostics-tooltip"
              >
                <div className="text-[10px] text-brand-orange font-bold uppercase tracking-wider mb-2 border-b border-white/10 pb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-brand-orange animate-pulse" />
                    System Diagnostics
                  </span>
                  <span className="flex items-center gap-1 text-[9px] text-green-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    ONLINE
                  </span>
                </div>

                <div className="space-y-1.5 text-[10px] text-white/80">
                  <div className="flex justify-between items-center group/hw">
                    <span className="text-white/40">Hardware ID:</span>
                    <button 
                      onClick={handleCopyHardwareId}
                      className="text-white font-bold tracking-wider hover:text-brand-orange flex items-center gap-1 transition cursor-pointer"
                      title="Click to copy"
                    >
                      <span>{systemState.hardwareBindingId}</span>
                      <Copy className="w-2.5 h-2.5 text-white/40 hover:text-brand-orange" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">System Uptime:</span>
                    <span className="text-green-400 font-bold">{formatUptime(uptimeSeconds)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Last Sync:</span>
                    <span className="text-white font-bold">{lastSyncTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Bus Protocol:</span>
                    <span className="text-brand-orange font-bold">CAN-FD / Mil-1553</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Crypto Bound:</span>
                    <span className="text-white/90">Kyber-1024 / AES-GCM-256</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40">Firmware Rev:</span>
                    <span className="text-white/80">v4.18.2-GA-APEX</span>
                  </div>
                </div>

                {/* Show Full Diagnostics Button triggering modal */}
                <div className="mt-3 pt-2.5 border-t border-white/10">
                  <button
                    id="show-full-diagnostics-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDiagnosticsModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-brand-orange/15 hover:bg-brand-orange/25 text-brand-orange hover:text-white border border-brand-orange/40 hover:border-brand-orange rounded text-[10px] font-mono font-bold tracking-wider transition cursor-pointer shadow-sm group/btn"
                  >
                    <Terminal className="w-3.5 h-3.5 text-brand-orange group-hover/btn:translate-x-0.5 transition-transform" />
                    <span>Show Full Diagnostics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Security Metrics */}
        <div className="flex items-center gap-6 text-[10.5px] font-mono text-white/50 uppercase tracking-tight" id="header-status-metrics">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[9px] text-white/40">Integrity Index</span>
            <span className={`font-bold ${systemState.systemIntegrity > 60 ? "text-white" : "text-red-400"}`}>
              {systemState.systemIntegrity}%
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-[9px] text-white/40">C2 Frequency</span>
            <span className="text-white font-bold">{systemState.loraFrequency} MHz</span>
          </div>

          <div className="h-6 w-px bg-white/10"></div>

          <div className="flex items-center gap-2 bg-brand-orange/5 border border-brand-orange/15 px-2.5 py-1 rounded">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-green-500 font-extrabold tracking-wider text-[9.5px]">ACTIVE PROTOCOL</span>
          </div>
        </div>
      </header>

      {/* 2. TAB CONTROL AND ACTIVE VIEW AREA */}
      {!isLocked ? (
        <div className="flex-1 flex flex-col md:flex-row p-6 gap-6" id="app-workspace">
          {/* VERTICAL ICON BOUNDED MENU */}
          <nav className="w-full md:w-56 shrink-0 flex flex-row md:flex-col gap-1 px-1 bg-[#080808]/40 border border-white/5 rounded-lg p-2 font-mono text-xs overflow-x-auto" id="navigation-bar">
            <span className="hidden md:block text-[10px] text-brand-orange font-bold tracking-[0.2em] uppercase mb-4 mt-2 px-3">
              AEGIS DEFENSE DOCTRINE
            </span>

            {[
              { id: "board", label: "C2 Dashboard", icon: Terminal },
              { id: "acts", label: "Canary Trap", icon: Database },
              { id: "pqc", label: "PQC Cryptography", icon: Cpu },
              { id: "ontology", label: "Ontology Map", icon: Network },
              { id: "cadl", label: "Deception Lab", icon: Activity },
              { id: "aether", label: "Aether Honeypot", icon: ShieldAlert },
              { id: "bmd", label: "Citron Tree BMD", icon: Crosshair },
              { id: "insiders", label: "Cerberus BSAU", icon: UserCheck },
              { id: "spectrum", label: "Nightshade EMS", icon: Radio },
              { id: "blueprints", label: "Blueprints Spec", icon: Folder },
              { id: "omega", label: "Omega Wipe", icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = tab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full text-left py-2.5 px-3 rounded flex items-center gap-2.5 cursor-pointer font-bold transition text-[11px] whitespace-nowrap ${
                    isActive 
                      ? "bg-brand-orange/10 border border-brand-orange/40 text-brand-orange" 
                      : "border border-transparent text-white/50 hover:text-white hover:bg-white/[0.04]"
                  }`}
                  id={`tab-${item.id}-btn`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-orange" : "text-white/40"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* MAIN CORE DOCK WINDOW */}
          <main className="flex-1 overflow-x-hidden min-h-[480px]" id="app-view-port">
            {tab === "board" && (
              <C2Dashboard 
                systemState={systemState} 
                sendStateUpdate={handleStateUpdate} 
                onNavigate={setTab} 
              />
            )}
            
            {tab === "acts" && (
              <IdentifierInjection 
                systemState={systemState}
                sendStateUpdate={handleStateUpdate}
                addSystemLog={addSystemLog}
              />
            )}

            {tab === "pqc" && (
              <PQCSandbox 
                addSystemLog={addSystemLog} 
              />
            )}

            {tab === "ontology" && (
              <OntologyMap 
                systemState={systemState}
                sendStateUpdate={handleStateUpdate}
                addSystemLog={addSystemLog}
              />
            )}

            {tab === "cadl" && (
              <CADLSimulator 
                systemState={systemState}
                sendStateUpdate={handleStateUpdate}
                addSystemLog={addSystemLog}
              />
            )}

            {tab === "aether" && (
              <AetherHoneypot 
                addSystemLog={addSystemLog} 
              />
            )}

            {tab === "bmd" && (
              <BMDBattleLab 
                addSystemLog={addSystemLog} 
              />
            )}

            {tab === "insiders" && (
              <CerberusProfiler 
                systemState={systemState}
                sendStateUpdate={handleStateUpdate}
                addSystemLog={addSystemLog}
              />
            )}

            {tab === "spectrum" && (
              <SpectrumControlPanel 
                systemState={systemState}
                sendStateUpdate={handleStateUpdate}
                addSystemLog={addSystemLog}
              />
            )}

            {tab === "blueprints" && (
              <BlueprintExplorer 
                addSystemLog={addSystemLog}
              />
            )}

            {tab === "omega" && (
              <OmegaContingency 
                systemState={systemState}
                sendStateUpdate={handleStateUpdate}
                addSystemLog={addSystemLog}
              />
            )}
          </main>
        </div>
      ) : (
        /* LOCK SCREEN: DISPLAY ONLY OMEGA RECOVERY ROUTINES */
        <div className="flex-1 p-6 flex flex-col justify-center max-w-4xl mx-auto w-full" id="lockout-workspace">
          <OmegaContingency 
            systemState={systemState}
            sendStateUpdate={handleStateUpdate}
            addSystemLog={addSystemLog}
          />
        </div>
      )}

      {/* 3. CONSOLE FOOTER */}
      <footer className="bg-[#0c0c0c] border-t border-white/10 py-3.5 px-6 text-center text-[10px] text-white/30 font-mono flex flex-col md:flex-row justify-between items-center gap-2 mt-auto" id="terminal-footer">
        <div className="flex gap-4">
          <span>CRQC THREAT: DETECTED</span>
          <span className="opacity-40">|</span>
          <span>CRYPTO-AGILITY: HYBRID MODE</span>
        </div>
        <div className="flex justify-center items-center gap-4">
          <span>NIGHTSHADE EMS STATUS: NOMINAL</span>
          <span className="text-green-500/50 uppercase">UPLINK {systemState.loraFrequency} MHZ</span>
        </div>
      </footer>

      {/* 4. SYSTEM DIAGNOSTICS FULL SNAPSHOT MODAL */}
      <SystemDiagnosticsModal
        isOpen={showDiagnosticsModal}
        onClose={() => setShowDiagnosticsModal(false)}
        systemState={systemState}
        uptimeSeconds={uptimeSeconds}
        lastSyncTime={lastSyncTime}
        onRefresh={syncState}
      />
    </div>
  );
}
