import React, { useState } from "react";
import { SystemState, ActsLure } from "../types";
import { Database, PlusCircle, Globe, Shield, RefreshCw, Key, HelpCircle, FileText, Download, DownloadCloud } from "lucide-react";

interface IdentifierInjectionProps {
  systemState: SystemState;
  sendStateUpdate: (newState: Partial<SystemState>) => void;
  addSystemLog: (level: string, source: string, message: string) => void;
}

export default function IdentifierInjection({ systemState, sendStateUpdate, addSystemLog }: IdentifierInjectionProps) {
  const handleDownloadLedger = () => {
    const content = JSON.stringify(systemState.actsLedger, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "GW_CANARY_TRAPS_ATTRIBUTION_LEDGER.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addSystemLog("INFO", "DOWNLOADER", "Downloaded Canary Trap Attribution Database (ADB) Ledger.");
  };

  const handleDownloadLureFile = (lure: ActsLure) => {
    const textContent = `========================================================================
GHOST-WATCH SYSTEM BLUEPRINT - DECEPTIVE CANARY VAULT PROPERTY BAIT
========================================================================
Document ID: ${lure.id}
Attributed Host Binding Context (Target): ${lure.target}
Active Security Status: ${lure.status}

--- INTEL METADATA WATERMARK STUFF ---
Synonym Substitution Shift: ${lure.watermark}
Padding Metadata: ${lure.padding}

--- OUT-OF-BAND RESOLVED DNS BEACON ---
DNS Target Address: ${lure.token}

========================================================================
SECURITY NOTICE: DO NOT CLASSIFY AS PUBLIC DOCUMENT. ACTIVE SENSOR TRACK.
========================================================================`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${lure.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addSystemLog("INFO", "DOWNLOADER", `Downloaded deceptive Canary Trap Lure file: ${lure.id}`);
  };

  const [target, setTarget] = useState("");
  const [watermarkType, setWatermarkType] = useState<"linguistic" | "metadata" | "steganography">("linguistic");
  const [customWatermark, setCustomWatermark] = useState("");
  const [useSteganography, setUseSteganography] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [simulationIp, setSimulationIp] = useState("");

  const handleDeployLure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;

    setIsDeploying(true);

    const postData = {
      target,
      watermarkType,
      customWatermark,
      useSteganography
    };

    fetch("/api/acts/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Refresh state from server
          fetch("/api/state")
            .then((res) => res.json())
            .then((serverState) => {
              sendStateUpdate(serverState);
              addSystemLog("INFO", "ACTS", `FIPS 204 Lure Document deployed correctly for target: ${target}`);
              setTarget("");
              setCustomWatermark("");
              setUseSteganography(false);
            });
        }
      })
      .finally(() => setIsDeploying(false));
  };

  const handleSimulateTrigger = (lureId: string) => {
    const adversaryIp = simulationIp || `198.51.100.${Math.floor(Math.random() * 254) + 1}`;
    
    addSystemLog("WARNING", "DNS_CANARY", `Out-of-band resolution beacon triggered on lure ID: ${lureId}`);

    fetch("/api/acts/trigger", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lureId, adversaryIp })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Immediately escalate the CADL state
          const newLevel = Math.min(systemState.cadlLevel + 1, 5);
          fetch("/api/cadl/escalate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level: newLevel })
          })
            .then((res) => res.json())
            .then(() => {
              fetch("/api/state")
                .then((res) => res.json())
                .then((serverState) => {
                  sendStateUpdate(serverState);
                });
            });
        }
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="acts-container">
      {/* LEFT PANEL: Identifier Injection Controller Form */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg h-fit space-y-4" id="acts-injection-generator">
        <h2 className="text-sm font-mono font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 uppercase">
          <PlusCircle className="w-4.5 h-4.5 text-brand-orange" />
          IDENTIFIER INJECTION ENGINE
        </h2>

        <form onSubmit={handleDeployLure} className="space-y-4 text-xs font-mono">
          <div className="space-y-2" id="form-target-field">
            <label className="text-white/50 block font-bold tracking-wider text-[10px] uppercase">TARGET RECIPIENT NODE</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="e.g. Dr. Arthur Lev-Ari (Quantum Vault Group)"
              className="w-full bg-[#050505] border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-brand-orange text-[11px] placeholder-white/20"
              required
            />
            <span className="text-[9.5px] text-white/30 block leading-tight">Every binary document represents a unique defensive attribution mapping.</span>
          </div>

          <div className="space-y-2" id="form-watermark-method">
            <label className="text-white/50 block font-bold tracking-wider text-[10px] uppercase">WE-FORGE DEFECT MAPPING</label>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => setWatermarkType("linguistic")}
                className={`py-2 px-1 border rounded text-center truncate cursor-pointer transition uppercase font-mono ${
                  watermarkType === "linguistic"
                    ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                    : "border-white/5 bg-[#050505] text-white/40 hover:border-white/10 hover:text-white"
                }`}
              >
                Linguistic
              </button>
              <button
                type="button"
                onClick={() => setWatermarkType("metadata")}
                className={`py-2 px-1 border rounded text-center truncate cursor-pointer transition uppercase font-mono ${
                  watermarkType === "metadata"
                    ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                    : "border-white/5 bg-[#050505] text-white/40 hover:border-white/10 hover:text-white"
                }`}
              >
                Metadata
              </button>
              <button
                type="button"
                onClick={() => setWatermarkType("steganography")}
                className={`py-2 px-1 border rounded text-center truncate cursor-pointer transition uppercase font-mono ${
                  watermarkType === "steganography"
                    ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                    : "border-white/5 bg-[#050505] text-white/40 hover:border-white/10 hover:text-white"
                }`}
              >
                Steg LSB
              </button>
            </div>
          </div>

          <div className="space-y-2" id="form-watermark-value">
            <label className="text-white/50 block font-bold tracking-wider text-[10px] uppercase">CUSTOM WATERMARK INJECTION</label>
            <textarea
              rows={2}
              value={customWatermark}
              onChange={(e) => setCustomWatermark(e.target.value)}
              placeholder="Leave empty to let WE-FORGE auto-calculate a linguistic synonym delta"
              className="w-full bg-[#050505] border border-white/10 rounded p-2 text-white focus:outline-none focus:border-brand-orange text-[11px] placeholder-white/20"
            />
          </div>

          {watermarkType === "steganography" && (
            <div className="flex items-center gap-2 border border-brand-orange/10 bg-brand-orange/5 p-2.5 rounded" id="steg-toggle-wrapper">
              <input
                type="checkbox"
                id="use-steg-bool"
                checked={useSteganography}
                onChange={(e) => setUseSteganography(e.target.checked)}
                className="rounded border-white/10 bg-[#050505] focus:ring-brand-orange text-brand-orange"
              />
              <label htmlFor="use-steg-bool" className="text-[10px] text-brand-orange leading-normal cursor-pointer">
                Inject active tracking beacon inside image matrix using Least Significant Bit (LSB) steganography mask.
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={isDeploying}
            className="w-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange py-2.5 rounded font-bold hover:bg-brand-orange/20 active:bg-brand-orange/30 transition text-xs flex justify-center items-center gap-2 cursor-pointer uppercase tracking-widest"
          >
            {isDeploying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-brand-orange" />
                CALCULATING COGNITIVE ENTROPY...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 text-brand-orange" />
                CONVERT & DEPLOY LURE
              </>
            )}
          </button>
        </form>

        <div className="border-t border-white/10 pt-3.5 space-y-2 text-[10px] font-mono text-white/40 font-bold" id="acts-warning-footer">
          <div className="flex items-start gap-1.5">
            <Shield className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
            <p><strong>WE-FORGE Mode:</strong> Spreads 98.4% structural metrics. Zero signal changes output during standard static network code analytics check loops.</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Attribution Database (ADB) Ledger Row Grid */}
      <div className="lg:col-span-2 space-y-6" id="acts-attribution-database-panel">
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "560px" }}>
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h2 className="text-sm font-mono font-bold text-white tracking-widest flex items-center gap-2 uppercase">
                <Database className="w-4.5 h-4.5 text-brand-orange" />
                ATTRIBUTION DATABASE (ADB) SECURED LEDGER
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadLedger}
                  className="text-[9px] font-mono text-brand-orange bg-brand-orange/5 border border-brand-orange/25 px-2.5 py-1 rounded tracking-wide hover:bg-brand-orange/20 transition cursor-pointer uppercase font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5 text-brand-orange shrink-0 animate-pulse" />
                  Download ADB Ledger
                </button>
                <span className="text-[9.5px] font-mono text-white/40 bg-[#050505] border border-white/10 px-2.5 py-1 rounded tracking-wide">
                  ENTRIES: {systemState.actsLedger.length}
                </span>
              </div>
            </div>

            {/* Test Simulation Panel */}
            <div className="bg-brand-orange/5 border border-brand-orange/10 p-3.5 rounded-lg mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-brand-orange uppercase tracking-wider text-[10px]">
                  <Key className="w-3.5 h-3.5 text-brand-orange" />
                  CANARY BEACON THREAT SIMULATOR
                </div>
                <p className="text-[10px] text-white/50 leading-snug">Simulates remote adversary retrieval of the watermark metadata, triggering intercept indicators.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. 195.42.201.88 (Target IP)"
                  value={simulationIp}
                  onChange={(e) => setSimulationIp(e.target.value)}
                  className="bg-[#050505] border border-white/10 rounded px-2.5 py-1.5 text-brand-orange focus:outline-none focus:border-brand-orange text-[10.5px] w-full sm:w-52 font-mono"
                />
              </div>
            </div>

            {/* Ledger Cards Grid */}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1" id="lures-scroll-view">
              {systemState.actsLedger.length === 0 ? (
                <div className="text-white/30 text-center py-20 font-mono text-xs">
                  <p>No canary trap lures established.</p>
                  <p className="text-[10px] mt-2 text-white/20">Formulate and deploy a lure targeting vulnerable system vectors above.</p>
                </div>
              ) : (
                systemState.actsLedger.map((lure) => (
                  <div
                    key={lure.id}
                    className={`border rounded-lg p-3.5 font-mono text-xs transition relative overflow-hidden ${
                      lure.status === "TRIGGERED"
                        ? "bg-red-500/5 border-red-500/30"
                        : "bg-[#050505] border-white/10 hover:border-brand-orange/40"
                    }`}
                    id={`lure-card-${lure.id}`}
                  >
                    {/* Status corner tag */}
                    <div className="absolute top-0 right-0">
                      <span className={`text-[8.5px] font-bold tracking-widest px-2.5 py-1 block rounded-bl uppercase ${
                        lure.status === "TRIGGERED" ? "bg-red-500/20 text-red-400 border-l border-b border-red-500/30 animate-pulse" : "bg-brand-orange/10 text-brand-orange border-l border-b border-brand-orange/20"
                      }`}>
                        {lure.status}
                      </span>
                    </div>
 

                    <div className="flex items-start gap-3">
                      <FileText className={`w-5 h-5 shrink-0 mt-0.5 ${lure.status === "TRIGGERED" ? "text-red-400" : "text-brand-orange"}`} />
                      <div className="space-y-1.5 w-full pr-16 bg">
                        <div className={`font-bold tracking-wider text-sm ${lure.status === "TRIGGERED" ? "text-red-300" : "text-brand-orange"}`}>
                          {lure.id}
                        </div>
                        <div className="text-white/40 text-[11px]">
                          <strong>Target User:</strong> <span className="text-white/80">{lure.target}</span>
                        </div>
                        <div className="text-[10px] text-white/50 break-all space-y-1 bg-[#0a0a0a] p-2 rounded border border-white/5 mt-1.5 leading-relaxed">
                          <div><strong>SYNONYM SHIFT / MASK:</strong> <span className="text-white/80">{lure.watermark}</span></div>
                          <div><strong>PADDING METADATA:</strong> <span className="text-white/80">{lure.padding}</span></div>
                          <div className="text-brand-orange font-bold"><strong>DNS CANARY BEACON:</strong> {lure.token}</div>
                        </div>

                        {lure.interacted && lure.interactionTelemetry && (
                          <div className="border border-red-500/20 bg-red-950/15 p-2 rounded text-[10.5px] space-y-1 text-red-200 mt-2 font-mono">
                            <div className="font-bold flex items-center gap-1.5 text-red-400 uppercase tracking-widest text-[9px]">
                              <Globe className="w-3 h-3 text-red-400" />
                              Adversarial Retrieval Intercepted
                            </div>
                            <div><strong>RESOLVED IP:</strong> {lure.interactionTelemetry.resolvedIp}</div>
                            <div><strong>TELEMETRY POINT:</strong> {lure.interactionTelemetry.geolocation}</div>
                            <div><strong>DNS ROUTE:</strong> {lure.interactionTelemetry.dnsQueryPath}</div>
                            <div><strong>TIMESTAMP:</strong> {new Date(lure.interactionTelemetry.timestamp).toLocaleString()}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDownloadLureFile(lure)}
                        className="text-[9.5px] bg-brand-orange/10 border border-brand-orange/20 hover:bg-brand-orange/20 text-brand-orange font-bold px-3 py-1 rounded transition cursor-pointer uppercase tracking-wider font-mono flex items-center gap-1"
                        title="Download Deceptive Document Bait parameters"
                      >
                        <Download className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                        Download Lure
                      </button>

                      {lure.status !== "TRIGGERED" && (
                        <button
                          type="button"
                          onClick={() => handleSimulateTrigger(lure.id)}
                          className="text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 font-bold px-3 py-1 rounded hover:bg-red-500/20 transition cursor-pointer uppercase tracking-wider font-mono shrink-0"
                        >
                          Simulate DNS Intercept
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-white/10 pt-3.5 flex justify-between items-center text-[10px] text-white/30 font-mono">
            <span>ADB COMPLIANT WITH NATIONAL SECURITY CRYPTO MASKING FIPS-204</span>
            <span className="flex items-center gap-1.5 text-xs text-brand-orange font-bold uppercase">
              <RefreshCw className="w-3.5 h-3.5 text-brand-orange" />
              Synchronized offline bounds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
