import { useState, useMemo, useEffect } from "react";
import { SystemState } from "../types";
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Search, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  Layers,
  FileCode,
  SlidersHorizontal
} from "lucide-react";

interface SystemDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemState: SystemState;
  uptimeSeconds: number;
  lastSyncTime: string;
  onRefresh?: () => void;
}

export default function SystemDiagnosticsModal({
  isOpen,
  onClose,
  systemState,
  uptimeSeconds,
  lastSyncTime,
  onRefresh
}: SystemDiagnosticsModalProps) {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"pretty" | "raw" | "filtered">("pretty");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Enriched full diagnostic snapshot object
  const diagnosticSnapshot = useMemo(() => {
    return {
      _meta: {
        snapshotTitle: "GHOST-WATCH APEX TIER SYSTEM STATE DIAGNOSTICS",
        capturedAt: new Date().toISOString(),
        lastSyncTimestamp: lastSyncTime,
        systemUptimeSeconds: uptimeSeconds,
        firmwareRevision: "v4.18.2-GA-APEX",
        kernelHardwareBinding: systemState.hardwareBindingId,
        securityClassification: "LEVEL-4 APEX / RESTRICTED"
      },
      systemOverview: {
        hardwareBindingId: systemState.hardwareBindingId,
        systemIntegrityPercent: systemState.systemIntegrity,
        activeThreatsCount: systemState.activeThreats,
        cadlLevel: systemState.cadlLevel,
        cadlStatus: systemState.cadlStatus,
        loraUplinkFrequencyMhz: systemState.loraFrequency,
        electronicWarfareJamming: systemState.ewJamming,
        emergencySystemLocked: systemState.systemLocked
      },
      actsLureDeceptionEngine: {
        totalLuresDeployed: systemState.actsLedger.length,
        activeLures: systemState.actsLedger.filter(l => l.status === "ACTIVE").length,
        triggeredLures: systemState.actsLedger.filter(l => l.status === "TRIGGERED").length,
        ledger: systemState.actsLedger
      },
      ontologyKnowledgeGraph: {
        totalNodes: systemState.ontology.nodes.length,
        totalLinks: systemState.ontology.links.length,
        nodes: systemState.ontology.nodes,
        links: systemState.ontology.links
      },
      cerberusBsauInsiderProfiles: {
        totalProfilesTracked: systemState.insiders.length,
        suspectedNsitaCount: systemState.insiders.filter(i => i.status === "SUSPECTED_NSITA").length,
        profiles: systemState.insiders
      },
      commandAndTelemetryLogs: {
        totalLogsBuffered: systemState.logs.length,
        logs: systemState.logs
      }
    };
  }, [systemState, uptimeSeconds, lastSyncTime]);

  const jsonString = useMemo(() => {
    return JSON.stringify(diagnosticSnapshot, null, 2);
  }, [diagnosticSnapshot]);

  // Filtered JSON text if searching
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return jsonString;
    const lines = jsonString.split("\n");
    const query = searchQuery.toLowerCase();
    
    // Include matching lines with 2 lines of context
    const matchingIndices = new Set<number>();
    lines.forEach((line, idx) => {
      if (line.toLowerCase().includes(query)) {
        for (let i = Math.max(0, idx - 2); i <= Math.min(lines.length - 1, idx + 2); i++) {
          matchingIndices.add(i);
        }
      }
    });

    if (matchingIndices.size === 0) {
      return `// No JSON entries found matching query: "${searchQuery}"\n// Clear search query to view full snapshot.`;
    }

    const filteredLines = Array.from(matchingIndices)
      .sort((a, b) => a - b)
      .map(i => lines[i]);

    return filteredLines.join("\n");
  }, [jsonString, searchQuery]);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = jsonString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GHOST_WATCH_DIAGNOSTICS_${systemState.hardwareBindingId}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTriggerRefresh = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      id="system-diagnostics-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-diagnostics-title"
    >
      <div 
        className="w-full max-w-5xl max-h-[92vh] bg-[#09090b] border border-brand-orange/40 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-white font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="bg-[#0f0f13] border-b border-white/10 px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-orange/15 border border-brand-orange/40 rounded-lg flex items-center justify-center text-brand-orange shadow-sm shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-brand-orange tracking-widest uppercase font-bold">
                  DIAGNOSTICS AUDIT CONSOLE
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] rounded font-bold">
                  ACTIVE SYNC
                </span>
              </div>
              <h2 id="modal-diagnostics-title" className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                System State Breakdown Snapshot
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onRefresh && (
              <button
                onClick={handleTriggerRefresh}
                disabled={isRefreshing}
                className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded text-[11px] text-white/70 hover:text-white flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
                title="Refresh state from server"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand-orange" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}

            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 bg-brand-orange/15 hover:bg-brand-orange/25 border border-brand-orange/40 rounded text-[11px] text-brand-orange hover:text-white flex items-center gap-1.5 transition cursor-pointer font-bold"
              id="modal-copy-json-btn"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 rounded text-[11px] text-white/80 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              title="Download snapshot as JSON file"
              id="modal-download-json-btn"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-white/5 hover:bg-red-500/20 hover:border-red-500/40 border border-white/10 rounded text-white/60 hover:text-white transition cursor-pointer ml-1"
              id="modal-close-btn"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* METRICS SUMMARY STRIP */}
        <div className="bg-[#0b0b0f] border-b border-white/5 px-5 py-2.5 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-[10px]">
          <div className="flex flex-col">
            <span className="text-white/40 uppercase">Hardware ID</span>
            <span className="text-brand-orange font-bold truncate">{systemState.hardwareBindingId}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 uppercase">Integrity</span>
            <span className="text-emerald-400 font-bold">{systemState.systemIntegrity}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 uppercase">CADL Level</span>
            <span className="text-white font-bold">{systemState.cadlLevel} ({systemState.cadlStatus})</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 uppercase">LoRa Uplink</span>
            <span className="text-white font-bold">{systemState.loraFrequency} MHz</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 uppercase">Canary Traps</span>
            <span className="text-white font-bold">{systemState.actsLedger.length} Deployed</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/40 uppercase">Buffered Logs</span>
            <span className="text-white font-bold">{systemState.logs.length} Events</span>
          </div>
        </div>

        {/* CONTROLS & SEARCH BAR */}
        <div className="bg-[#0c0c10] border-b border-white/10 px-5 py-2 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-white/30 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search keys, values, tokens, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded py-1 pl-8 pr-7 text-[11px] text-white placeholder-white/30 focus:outline-none focus:border-brand-orange/60"
              id="diagnostics-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-[10px]">
            <span className="text-white/40 hidden md:inline">Mode:</span>
            <button
              onClick={() => setViewMode("pretty")}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                viewMode === "pretty" 
                  ? "bg-brand-orange/20 text-brand-orange border border-brand-orange/40 font-bold" 
                  : "text-white/50 hover:text-white"
              }`}
            >
              Formatted
            </button>
            <button
              onClick={() => setViewMode("raw")}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                viewMode === "raw" 
                  ? "bg-brand-orange/20 text-brand-orange border border-brand-orange/40 font-bold" 
                  : "text-white/50 hover:text-white"
              }`}
            >
              Raw
            </button>
            <div className="h-3 w-px bg-white/10"></div>
            <span className="text-white/30 text-[9.5px]">
              {diagnosticSnapshot.commandAndTelemetryLogs.totalLogsBuffered} records • {jsonString.length.toLocaleString()} bytes
            </span>
          </div>
        </div>

        {/* JSON CODE VIEWER */}
        <div className="flex-1 overflow-auto p-4 bg-[#050507] text-[11px] leading-relaxed selection:bg-brand-orange/30">
          <pre className="text-white/80 font-mono whitespace-pre overflow-x-auto tab-4">
            <code>{searchQuery ? filteredContent : jsonString}</code>
          </pre>
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-[#0c0c10] border-t border-white/10 px-5 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-white/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              CAN-FD / Mil-1553 Cryptographically Bound
            </span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline">Snapshots are live-buffered in volatile memory</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/30">Press ESC or click outside to dismiss</span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[10px] font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
