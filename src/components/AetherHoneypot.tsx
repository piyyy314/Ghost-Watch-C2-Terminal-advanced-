import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, 
  Settings, 
  ShieldAlert, 
  Play, 
  RefreshCw, 
  Download, 
  CheckCircle2, 
  Database, 
  HelpCircle,
  Eye,
  Trash2,
  Lock,
  Cpu,
  Fingerprint
} from "lucide-react";

interface AetherHoneypotProps {
  addSystemLog: (level: string, source: string, message: string) => void;
}

export default function AetherHoneypot({ addSystemLog }: AetherHoneypotProps) {
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "AETHER Sandbox v3.5-L3 Secure Container initialized.",
    "Hardware node bound to virtualized core enclave: V-88219-AX.",
    "Status: WAITING_FOR_INTRUDER_FORWARDING (CADL L3 Redirect criteria)",
    "Type 'help' to see local system diagnostic instructions."
  ]);

  const [simulatedIntruders, setSimulatedIntruders] = useState<string[]>([
    "[09:41:02] CONNECTION FORWARDED: Remote intruder IP 192.168.42.115 rerouted safely from C2 core.",
    "[09:41:15] INTRUDER_EXEC: 'whoami' -> resolved to 'operator-node-09 (fake_admin)'",
    "[09:41:28] INTRUDER_EXEC: 'ls -la' -> displaying 4 deceptive WE-FORGE lures",
    "[09:41:50] INTRUDER_EXEC: 'cat secrets_kem.pqc' -> payload extracted by intruder"
  ]);

  const [latency, setLatency] = useState(250);
  const [synonymClutter, setSynonymClutter] = useState(true);
  const [decoyOS, setDecoyOS] = useState("Sovereign-Linux-C2");
  const [isInjectingBait, setIsInjectingBait] = useState(false);
  const [isCopiedLogs, setIsCopiedLogs] = useState(false);

  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const input = terminalInput.trim().toLowerCase();
    const newHistory = [...terminalHistory, `operator@aether-sandbox:~# ${terminalInput}`];

    if (input === "help") {
      newHistory.push(
        "AETHER Diagnostic Controls:",
        "  help                - Display active control operations manifest",
        "  ls -la              - List virtualized deceptive directory contents",
        "  cat secrets.txt     - Read deceptive vault bait files",
        "  status              - Visualizes active container core integrity variables",
        "  clean               - Clear Aether log screen",
        "  whoami              - Retrieve current user contexts"
      );
    } else if (input === "ls -la") {
      newHistory.push(
        "total 32",
        "drwxr-xr-x   2 root     root          4096 May 20 09:41 .",
        "drwxr-xr-x   5 root     root          4096 May 20 09:41 ..",
        "-rw-r--r--   1 root     root          1208 May 20 09:41 blueprints_v2.png",
        "-rw-r--r--   1 root     root         14912 May 20 09:41 secrets.txt",
        "-rwxr-xr-x   1 root     root          1024 May 20 09:41 telemetry_collector.py"
      );
    } else if (input === "cat secrets.txt") {
      newHistory.push(
        "GHOST-WATCH CORE DECEPTIVE CONTAINER SECRET DATASET",
        "==================================================",
        "CRITICAL ACCESS CREDENTIALS (WE-FORGE Synonym Matrix Cluttered):",
        "Master LoRa coordinate multiplier: 1.4819A9B2",
        "Decoy SSH Root Pass: 'C0smicSovereign7781!!@'",
        "Simulated Private Lattice Vector Seed (Invalid): 0xAEFFD92A0B7C19E",
        "Telemetry status: Resolved OOB DNS Beacon activated upon download."
      );
    } else if (input === "status") {
      newHistory.push(
        `Decoy Node Name: ${decoyOS}`,
        `Artificial Transit Delay: ${latency}ms`,
        `WE-FORGE Steg Filter: ${synonymClutter ? "ENABLED" : "DISABLED"}`,
        "Sandbox Integrity Shield: NOMINAL (99.8%)",
        "Captured sessions count: 1 active socket connection."
      );
    } else if (input === "whoami") {
      newHistory.push("operator-core-aether (Admin Console Bridge)");
    } else if (input === "clean") {
      setTerminalHistory(["AETHER Sandbox screen scrubbed. Ready."]);
      setTerminalInput("");
      return;
    } else {
      newHistory.push(`Command not found: '${terminalInput}'. Decoy Linux kernel parsed command with artificial delay.`);
    }

    setTerminalHistory(newHistory);
    setTerminalInput("");
  };

  const handleSimulateDeceptiveAttack = () => {
    setIsInjectingBait(true);
    addSystemLog("INFO", "AETHER", `Triggered deceptive intruder scan injection in honeypot container.`);
    
    setTimeout(() => {
      const time = new Date().toLocaleTimeString();
      setSimulatedIntruders(prev => [
        `[${time}] INTRUDER_SH_EXEC: 'grep -rI "API_KEY" /var/log/' -> returned 0 matches (Deceptive isolation block)`,
        ...prev
      ].slice(0, 50));
    }, 600);

    setTimeout(() => {
      const time = new Date().toLocaleTimeString();
      setSimulatedIntruders(prev => [
        `[${time}] INTRUDER_DOWNLOAD: Initiated file transfer 'secrets.txt' -> decoy logs packet downloaded (marked PQC-LURE flag)`,
        ...prev
      ].slice(0, 50));
      setIsInjectingBait(false);
      addSystemLog("WARNING", "OOB_BEACON", `Intruder triggered DNS resolution beacon inside Aether Honeypot. Location logged.`);
    }, 1500);
  };

  const clearCapturedSessions = () => {
    setSimulatedIntruders(["[INFO] Honeypot session collection empty. Waiting for intruder logging..."]);
    addSystemLog("INFO", "AETHER", "Sandbox capture logs scrubbed.");
  };

  // Helper for downloading content
  const handleDownloadLogs = () => {
    const textContent = `GHOST-WATCH APEX INTERPRETER // AETHER HONEYPOT CONTAINMENT CAPTURE LOGS
========================================================================
Generated: ${new Date().toISOString()}
Decoy Profile OS: ${decoyOS}
Decoy Loop Latency: ${latency}ms
Watermark Steg Filter: ${synonymClutter ? "ON" : "OFF"}

--- SIMULATED TERMINAL COMMAND OUTLINE (Captured shell sessions) ---
${terminalHistory.join("\n")}

--- DETECTED INTRUDER ACCESS CHRONOLOGY ---
${simulatedIntruders.join("\n")}

========================================================================
AETHER CYBER ATTRIBUTION FORENSICS SUMMARY - COMPLIANT WITH IND INTERCEPT LAWS
`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `AETHER_INTELLIGENCE_CAPTURE_${decoyOS.toUpperCase()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    addSystemLog("INFO", "DOWNLOADER", `Downloaded capture forensics for sandbox profile: ${decoyOS}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fade-in" id="aether-root-view">
      
      {/* 1. LEFT COLUMN: Honeypot Environment Controls */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "580px" }} id="aether-config-panel">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-mono font-bold text-white tracking-widest flex items-center gap-2 uppercase">
              <Settings className="w-4.5 h-4.5 text-brand-orange" />
              AETHER Sandbox Controls
            </h2>
            <span className="text-[9px] font-mono font-bold text-brand-orange bg-brand-orange/5 border border-brand-orange/20 px-2.5 py-0.5 rounded tracking-widest uppercase">
              DECOY ENGINE
            </span>
          </div>

          <p className="text-xs text-white/50 leading-relaxed font-mono">
            AETHER virtualizes secure directory structures, fake environment credentials, and mock configuration records. When an attacker is rerouted here via CADL L3, they execute inputs inside a monitored sandbox environment.
          </p>

          <div className="space-y-4 pt-2 font-mono text-xs">
            {/* Decoy Profile selector */}
            <div className="space-y-1.5">
              <label className="text-white/50 block font-bold text-[9.5px] uppercase tracking-wider">Deceptive OS Environment</label>
              <select
                value={decoyOS}
                onChange={(e) => {
                  setDecoyOS(e.target.value);
                  addSystemLog("INFO", "AETHER", `Dismounted sandbox OS; deployed ${e.target.value} profile.`);
                }}
                className="w-full bg-[#050505] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-brand-orange font-bold text-[11px] cursor-pointer"
              >
                <option value="Sovereign-Linux-C2">Linux Ubuntu 22.04 LTS (Tactical C2 Decoy)</option>
                <option value="Windows-Srv-ActiveDir">Windows Server 2022 (Active Directory Bait)</option>
                <option value="SubGHz-Mesh-Firmware">Bare-Metal LPWAN Comms Sensor Enclave (v0.3)</option>
              </select>
            </div>

            {/* Artificial Latency Drag */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9.5px] uppercase font-bold tracking-wider text-white/50">
                <span>Packet Transit Delayer</span>
                <span className="text-brand-orange font-extrabold">{latency} ms</span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="50"
                value={latency}
                onChange={(e) => setLatency(parseInt(e.target.value))}
                className="w-full accent-brand-orange cursor-pointer bg-[#050505] rounded-lg"
              />
              <span className="text-[9.5px] text-white/30 leading-snug block font-sans">Artificially lags attacker commands to simulate massive data processing workloads or signal degradation.</span>
            </div>

            {/* Synonym Cluttering toggle */}
            <div className="flex items-start gap-2 border border-brand-orange/15 bg-brand-orange/5 p-2.5 rounded">
              <input
                type="checkbox"
                id="syn_clutter_check"
                checked={synonymClutter}
                onChange={(e) => setSynonymClutter(e.target.checked)}
                className="rounded border-white/10 bg-[#050505] flex-shrink-0 mt-0.5"
              />
              <label htmlFor="syn_clutter_check" className="text-[9.5px] text-brand-orange leading-snug cursor-pointer font-bold">
                Inject WE-FORGE Clutter & Steganography Synonym Shift filter inside container file text responses.
              </label>
            </div>

            {/* Trigger attack simulator */}
            <button
              onClick={handleSimulateDeceptiveAttack}
              disabled={isInjectingBait}
              className="w-full bg-brand-orange/15 hover:bg-brand-orange/20 border border-brand-orange/30 text-brand-orange py-2 rounded font-bold transition text-[10.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isInjectingBait ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-orange" />
                  FORWARDING ATTACKER SESSION...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
                  Simulate Decoy Incident
                </>
              )}
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-3.5">
          <button
            onClick={handleDownloadLogs}
            className="w-full bg-[#050505] border border-white/10 hover:border-brand-orange/30 text-white/70 hover:text-white py-2 rounded font-mono font-bold text-[10.5px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-brand-orange shrink-0 animate-pulse" />
            Download Captured Intruder Logs
          </button>
        </div>
      </div>

      {/* 2. MIDDLE COLUMN: Decoy Terminal Shell Bridge */}
      <div className="lg:col-span-2 bg-[#050505] border border-white/10 rounded-lg flex flex-col justify-between" style={{ minHeight: "580px" }} id="aether-terminal-column">
        
        {/* Terminal Header */}
        <div className="bg-[#0a0a0a] border-b border-white/10 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-brand-orange" />
            <h3 className="text-xs font-mono font-bold text-white tracking-widest uppercase">
              AETHER INTERACTIVE SHELL BRIDGE (DECOY CONSOLE)
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-brand-orange border border-brand-orange/25 bg-brand-orange/5 px-2 py-0.5 uppercase tracking-wider rounded">
            <Eye className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
            Live surveillance active
          </div>
        </div>

        {/* Scrollable history console */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-[10.5px] text-[#e0e0e0]/90 space-y-2 max-h-[360px]" id="aether-shell-scroll">
          {terminalHistory.map((line, idx) => (
            <div key={idx} className="leading-relaxed flex items-start gap-1">
              {line.startsWith("operator@aether") ? (
                <>
                  <span className="text-cyan-400 font-bold">operator@aether-sandbox:~#</span>
                  <span className="text-[#a5f3fc] font-semibold break-all">{line.split("operator@aether-sandbox:~#")[1]}</span>
                </>
              ) : line.startsWith("total") || line.startsWith("drwxr-xr-x") || line.startsWith("-rw-r-") || line.startsWith("-rwxr-") ? (
                <span className="text-white/40 font-bold whitespace-pre block break-all">{line}</span>
              ) : line.startsWith("AETHER") || line.startsWith("  ") ? (
                <span className="text-cyan-400/90 whitespace-pre block font-semibold">{line}</span>
              ) : (
                <span className="text-white/80 leading-normal block">{line}</span>
              )}
            </div>
          ))}
          <div ref={historyEndRef} />
        </div>

        {/* Console Input area */}
        <form onSubmit={handleCommandSubmit} className="bg-[#080808] border-t border-white/10 p-2.5 flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-[10.5px] font-bold shrink-0">operator@aether-sandbox:~#</span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Type 'help' for menu commands..."
            className="flex-1 bg-transparent border-none text-[11px] text-[#a5f3fc] font-mono focus:outline-none placeholder-white/20 uppercase font-semibold"
          />
        </form>

        {/* Attacker Chronology Log feed */}
        <div className="bg-[#0a0a0a] border-t border-white/10 p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-whites/10 pb-2">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4.5 h-4.5 text-brand-orange" />
              <span className="text-[10px] font-mono font-bold text-white tracking-wider uppercase">ATTACKER SENSE CHRONOLOGY (PCAP STREAM)</span>
            </div>
            
            <button
              onClick={clearCapturedSessions}
              className="text-[9px] font-mono font-bold text-white/40 hover:text-brand-orange hover:underline uppercase cursor-pointer"
            >
              Flush capture stream
            </button>
          </div>

          <div className="max-h-[90px] overflow-y-auto space-y-1.5 font-mono text-[9px] text-white/40 leading-snug" id="attacker-sense-stream">
            {simulatedIntruders.map((log, idx) => (
              <div key={idx} className="flex gap-1">
                {log.includes("INTRUDER_EXEC") ? (
                  <>
                    <span className="text-yellow-500 font-bold">[EXEC]</span>
                    <span className="text-[#fad02c]/90 break-all">{log}</span>
                  </>
                ) : log.includes("CONNECTION FORWARDED") ? (
                  <>
                    <span className="text-red-400 font-extrabold animate-pulse">[REROUTE]</span>
                    <span className="text-red-300 font-bold break-all">{log}</span>
                  </>
                ) : (
                  <>
                    <span className="text-white/30 font-bold">[BEACON]</span>
                    <span className="text-white/50 break-all">{log}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
