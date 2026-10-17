import { SystemState } from "../types";
import { ShieldAlert, UserCheck, ShieldClose, ShieldX, Key, Clipboard, Skull, AlertCircle, Download } from "lucide-react";

interface CerberusProfilerProps {
  systemState: SystemState;
  sendStateUpdate: (newState: Partial<SystemState>) => void;
  addSystemLog: (level: string, source: string, message: string) => void;
}

export default function CerberusProfiler({ systemState, sendStateUpdate, addSystemLog }: CerberusProfilerProps) {

  const handleDownloadDossiers = () => {
    const records = systemState.insiders.map(insider => 
      `Insider ID: ${insider.id}
      Name: ${insider.name}
      Role: ${insider.role}
      Audit Status: ${insider.status}
      Clearance Index: ${insider.clearance}
      Behavioral Risk Rating: ${insider.riskScore}%
      BSAU Log Analysis: ${insider.bSauMetrics}`
    ).join("\n--------------------------------------------------------\n");

    const textContent = `========================================================================
GHOST-WATCH SYSTEM // CERBERUS INSIDER BEHAVIORAL INTELLIGENCE RECORD
========================================================================
Audit Timestamp: ${new Date().toISOString()}
Security Level Compliance: Aegis Active Defense Matrix Authorized

--- BEHAVIORAL STUDIES & ANALYSIS UNIT (BSAU) RECORD LEDGER ---

${records}

========================================================================
SECURITY NOTICE // STRICT CLASSIFIED RESTRICTIONS DO NOT DISTRIBUTE
========================================================================`;

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `CERBERUS_INSIDER_RISK_AUDIT_${new Date().toISOString().slice(0,10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addSystemLog("INFO", "DOWNLOADER", "Downloaded integrated Cerberus Insider behavioral threat dossiers.");
  };

  const handleRevokeCredentials = (insiderId: string) => {
    fetch("/api/insiders/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: insiderId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Sync state from server
          fetch("/api/state")
            .then((res) => res.json())
            .then((serverState) => {
              sendStateUpdate(serverState);
              addSystemLog("CRITICAL", "CERBERUS", `Multipass and comm credentials revoked for ${data.insider.name}.`);
            });
        }
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fade-in" id="cerberus-profiler-root">
      {/* LEFT & CENTER: Insider List with BSAU metrics */}
      <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "530px" }} id="cerberus-profiles-panel">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h2 className="text-sm font-mono font-bold text-white tracking-widest flex items-center gap-2 uppercase">
              <Skull className="w-4.5 h-4.5 text-brand-orange" />
              CERBERUS CONTAINMENT CHAIN // BEHAVIORAL ANALYSIS
            </h2>
            <span className="text-[10px] font-mono text-red-500 bg-red-500/5 px-2.5 py-0.5 rounded border border-red-500/20 uppercase tracking-widest">
              MONITOR ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="insider-directory-cards">
            {systemState.insiders.map((insider) => {
              let scoreColor = "text-brand-orange";
              let cardBorder = "border-white/10";
              let riskBadge = "bg-brand-orange/5 text-brand-orange border-brand-orange/20";
              
              if (insider.riskScore > 35 && insider.riskScore <= 75) {
                scoreColor = "text-yellow-400 font-bold";
                cardBorder = "border-yellow-500/25 bg-yellow-500/[0.02]";
                riskBadge = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
              } else if (insider.riskScore > 75) {
                scoreColor = "text-red-400 font-extrabold animate-pulse";
                cardBorder = "border-red-500/30 bg-red-950/5";
                riskBadge = "bg-red-500/15 text-red-400 border-red-500/20";
              } else if (insider.status === "REVOKED") {
                scoreColor = "text-white/20";
                cardBorder = "border-white/5 bg-[#050505]/40 opacity-50";
                riskBadge = "bg-white/5 text-white/30 border-white/5";
              }

              return (
                <div
                  key={insider.id}
                  className={`border rounded-lg p-4 font-mono text-xs space-y-3 relative overflow-hidden transition ${cardBorder}`}
                  id={`insider-card-${insider.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <div className="text-white font-bold text-[13px] tracking-tight">{insider.name}</div>
                      <div className="text-[10px] text-white/40">{insider.role} ({insider.clearance})</div>
                    </div>
                    <span className={`text-[8.5px] px-2 py-0.5 rounded border uppercase tracking-wider ${riskBadge}`}>
                      {insider.status}
                    </span>
                  </div>

                  <div className="bg-[#050505] p-3 rounded border border-white/5 text-[10px] text-white/50 space-y-2">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1 uppercase text-[9px] tracking-wider text-white/30">
                      <span>BEHAVIORAL RISK THREAT LEVEL:</span>
                      <span className={scoreColor}>{insider.riskScore}% RISK</span>
                    </div>
                    <p className="leading-relaxed"><strong className="text-white/30 uppercase text-[9px] tracking-wider block mb-1">BSAU DATA CORRELATION:</strong> {insider.bSauMetrics}</p>
                  </div>

                  {insider.status !== "REVOKED" && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleRevokeCredentials(insider.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                      >
                        <ShieldX className="w-3.5 h-3.5 text-red-400" />
                        REVOKE MULTIPASS
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-[10px] text-white/30 font-mono uppercase tracking-wide">
          <span>Active catalog tracked: {systemState.insiders.length} profiles.</span>
          <span>In compliance with Cerberus NSITA matrix rules.</span>
        </div>
      </div>

      {// RIGHT PANEL: Cerberus Security Advisory and BSAU explanations
      }
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between text-xs font-mono" id="cerberus-info-panel">
        <div className="space-y-4">
          <h2 className="text-sm font-mono font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 mb-4 uppercase">
            <UserCheck className="w-4.5 h-4.5 text-brand-orange" />
            OPERATIONAL COMPENDIUM
          </h2>

          <div className="space-y-3 text-white/50 leading-relaxed text-[11px]" id="cerberus-briefing-notes">
            <div className="flex items-center gap-1.5 text-red-500 font-bold uppercase tracking-wider text-[9.5px]">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Nightshade Insider Threat Advisory
            </div>
            <p>
              Insider vulnerability represents the most dangerous vector inside cryptographic infrastructures. State sponsored syndicates frequently implement lateral compromises using legitimate user nodes.
            </p>

            <p>
              Under <strong>Israeli Aegis active defense paradigms</strong>, the <strong>Cerberus Containment Chain</strong> implements real-time Behavioral Study and Analysis (BSAU) tracking biometric offsets, login timelines and key telemetry shifts to construct pre-emptive threat levels.
            </p>

            <p className="border-l-2 border-brand-orange/30 pl-2 bg-brand-orange/5 p-2 rounded text-brand-orange font-semibold">
              Executing a "Revoke Multipass" command instantly isolates that node's security binding, wipes volatile authentication headers, and sends a complete audit log to the Citron Tree BMC.
            </p>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleDownloadDossiers}
              className="w-full bg-brand-orange/15 hover:bg-brand-orange/25 border border-brand-orange/30 text-brand-orange py-2 rounded font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition"
            >
              <Download className="w-4 h-4 text-brand-orange shrink-0 animate-pulse" />
              Download Consolidated Risk Assessment Report
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 pt-3.5 text-[10px] text-white/30 font-mono flex items-center gap-1 uppercase tracking-wider">
          <Key className="w-3.5 h-3.5 text-white/30" />
          <span>BSAU Engine: CERTIFIED</span>
        </div>
      </div>
    </div>
  );
}
