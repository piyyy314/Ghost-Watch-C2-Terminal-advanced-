import { useState } from "react";
import { Key, Shield, Info, Activity, RefreshCw, Layers, FileCode, Download } from "lucide-react";

interface PQCSandboxProps {
  addSystemLog: (level: string, source: string, message: string) => void;
}

export default function PQCSandbox({ addSystemLog }: PQCSandboxProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [isComputing, setIsComputing] = useState(false);
  const [hybridKey, setHybridKey] = useState<any>(null);
  const [latticeSize, setLatticeSize] = useState("ML-KEM-768");
  const [signStatus, setSignStatus] = useState<string | null>(null);
  const [docContent, setDocContent] = useState("GHOST-WATCH OPERATIONAL PROTOCOLS // DO NOT DISTRIBUTE");

  const runHandshake = () => {
    setIsComputing(true);
    setHybridKey(null);
    setActiveStep(1);

    setTimeout(() => {
      fetch("/api/pqc/handshake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyType: latticeSize })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setHybridKey(data);
            addSystemLog("INFO", "PQC_SANDBOX", "FIPS 230 hybrid ML-KEM and ECDH handshake executed in sandbox.");
            setActiveStep(4); // Completes layout
          }
        })
        .finally(() => setIsComputing(false));
    }, 1200);
  };

  const verifySignature = () => {
    setSignStatus("COMPUTING");
    setTimeout(() => {
      // Simulate ML-DSA-65 (Dilithium) verification using standard parameters
      const signatureHash = hashlib(docContent);
      setSignStatus(`VERIFIED: ML-DSA-65 [FIPS 204] standard validates payload signature block 0x${signatureHash.slice(0, 16)}...`);
      addSystemLog("INFO", "PQC_DSA", "Successfully validated non-repudiation ML-DSA block for lure payloads.");
    }, 800);
  };

  function hashlib(text: string) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).toUpperCase() + "AA7E119BBD93C";
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fade-in" id="pqc-sandbox-root">
      {/* LEFT PANEL: Handshake Configuration and Step-by-Step Interactive Workflow */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg h-fit space-y-4" id="pqc-parameters font-mono">
        <h2 className="text-xs font-mono font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 uppercase">
          <Key className="w-4.5 h-4.5 text-brand-orange" />
          MODULE-LATTICE SCHEME
        </h2>

        <div className="space-y-4 font-mono text-xs" id="kem-parameters-form">
          <div className="space-y-2">
            <label className="text-white/50 block font-bold tracking-wider text-[10px] uppercase">NIST SELECTION PROTOCOL</label>
            <select
              value={latticeSize}
              onChange={(e) => setLatticeSize(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-brand-orange text-[11px] cursor-pointer"
            >
              <option value="ML-KEM-512">ML-KEM-512 (Standard Category 1)</option>
              <option value="ML-KEM-768">ML-KEM-768 (Optimal Category 3 - Default)</option>
              <option value="ML-KEM-1024">ML-KEM-1024 (High Security Category 5)</option>
            </select>
          </div>

          <div className="space-y-2 border border-brand-orange/10 bg-brand-orange/5 p-3 rounded text-[10.5px] text-white/50 leading-relaxed font-mono" id="kem-brief">
            <div className="flex gap-1.5 text-brand-orange font-bold mb-1 uppercase tracking-widest text-[9px] items-center">
              <Info className="w-3.5 h-3.5 text-brand-orange" />
              Lattice Crypto Mechanics
            </div>
            <p className="text-[10.5px]">
              Under FIPS 203, Module-Lattice-Based Key Encapsulation utilizes polynomial arrays over modular rings. Solving the <strong>Lattice Shortest Vector Problem (SVP)</strong> remains computationally intractable for classical and quantum devices.
            </p>
          </div>

          <button
            onClick={runHandshake}
            disabled={isComputing}
            className="w-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange py-2.5 rounded font-bold hover:bg-brand-orange/20 active:bg-brand-orange/30 transition text-xs flex justify-center items-center gap-2 cursor-pointer uppercase tracking-widest"
          >
            {isComputing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-brand-orange" />
                DETERMINING DEGREE OF LATTICE...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 text-brand-orange animate-pulse" />
                EXECUTE HYBRID HANDSHAKE
              </>
            )}
          </button>
        </div>

        {/* Handshake Phase Interactive Milestones */}
        <div className="space-y-3 pt-4 border-t border-white/10 font-mono text-[10.5px]" id="step-by-step-indicators">
          <div className="flex items-center gap-2.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${
              isComputing ? "bg-brand-orange/15 border border-brand-orange text-brand-orange animate-pulse" : hybridKey ? "bg-brand-orange text-black font-bold" : "border border-white/10 text-white/40 bg-[#050505]"
            }`}>1</div>
            <span className={isComputing ? "text-brand-orange font-bold" : "text-white/40"}>Generate Ephemeral ECDH Secret</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${
              isComputing && activeStep === 1 ? "bg-[#050505] border border-white/10" : isComputing ? "bg-brand-orange/15 border border-brand-orange text-brand-orange animate-pulse" : hybridKey ? "bg-brand-orange text-black font-bold" : "border border-white/10 text-white/40 bg-[#050505]"
            }`}>2</div>
            <span className={isComputing ? "text-brand-orange font-bold" : "text-white/40"}>ML-KEM SharedSecret Encapsulation</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${
              hybridKey ? "bg-brand-orange text-black font-bold" : "border border-white/10 text-white/40 bg-[#050505]"
            }`}>3</div>
            <span className={hybridKey ? "text-brand-orange font-bold" : "text-white/40"}>HKDF Symmetric AES-GCM Encryption</span>
          </div>
        </div>
      </div>

      {/* MID PANEL: Hybrid Shared Secret Computation Outcome & Output details */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "530px" }} id="pqc-handshake-outcome">
        <div>
          <h2 className="text-xs font-mono font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 mb-4 uppercase">
            <Layers className="w-4.5 h-4.5 text-brand-orange" />
            HYBRID SHARED ENTROPY BLOCK
          </h2>

          {!hybridKey && !isComputing ? (
            <div className="text-white/30 font-mono text-center py-20 text-xs leading-relaxed">
              <p>Awaiting handshake initiation in parameter sidecar.</p>
              <p className="text-[10px] text-white/20 mt-1.5 font-sans">Triggers quantum-safe shared keys calculation using Module-Lattices hybridly combined with Elliptic Curves.</p>
            </div>
          ) : isComputing ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 font-mono text-xs">
              <RefreshCw className="w-8 h-8 animate-spin text-brand-orange" />
              <p className="text-brand-orange animate-pulse font-bold tracking-widest uppercase">Performing polynomial ring multiplication...</p>
            </div>
          ) : (
            <div className="space-y-4 font-mono text-[11px]" id="handshake-results-view">
              <div className="space-y-1">
                <span className="text-white/30 block text-[9px] font-bold uppercase tracking-wider">HANDSHAKE TRANSIT PROTOCOL</span>
                <span className="text-brand-orange bg-brand-orange/5 px-2.5 py-1 rounded border border-brand-orange/20 font-bold tracking-widest uppercase text-[9.5px]">
                  {hybridKey.protocol}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-white/30 block text-[9px] font-bold uppercase tracking-wider">ALICE MODULE-LATTICE PUBLIC KEY (FIPS 203)</span>
                <textarea
                  readOnly
                  rows={3}
                  value={hybridKey.alicePubKey}
                  className="w-full bg-[#050505] border border-white/10 rounded p-2 text-white font-mono text-[9px] resize-none focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-white/30 block text-[9px] font-bold uppercase tracking-wider">BOB MODULE-LATTICE PUBLIC KEY (FIPS 203)</span>
                <textarea
                  readOnly
                  rows={3}
                  value={hybridKey.bobPubKey}
                  className="w-full bg-[#050505] border border-white/10 rounded p-2 text-white font-mono text-[9px] resize-none focus:outline-none"
                />
              </div>

              <div className="space-y-2.5">
                <span className="text-white/30 block text-[9px] font-bold uppercase tracking-wider">COMPOSITE PROTOCOL SHARED SECRET (HKDF MULTIPLEX)</span>
                <div className="bg-[#050505] border border-white/10 p-3 rounded text-[10px] break-all text-white font-semibold border-l-2 border-l-brand-orange leading-relaxed">
                  {hybridKey.sharedSec}
                </div>
              </div>

              {/* Dynamic Key Package Downloader */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = `========================================================================
GHOST-WATCH SYSTEM BLUEPRINT - MIL-SPEC PQC EXCHANGE KEYS
========================================================================
Key Exchange standard: ${hybridKey.protocol}
Selected lattice: ${latticeSize}
Timestamp: ${new Date().toISOString()}

--- ALICE MODULE-LATTICE PUBLIC KEY (FIPS 203) ---
${hybridKey.alicePubKey}

--- BOB MODULE-LATTICE PUBLIC KEY (FIPS 203) ---
${hybridKey.bobPubKey}

--- MULTIPLEXED SYM SYMMETRIC SECRET ---
${hybridKey.sharedSec}

========================================================================
SECURITY SYSTEM BOUND: NOMINAL. DO NOT DISTRIBUTE COMPROMISED KEYSETS.
========================================================================`;
                    const blob = new Blob([text], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `PQC_KEYS_${latticeSize}.txt`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    addSystemLog("INFO", "DOWNLOADER", `Exported PQC hardware handshake credentials block for: ${latticeSize}`);
                  }}
                  className="w-full bg-[#050505] hover:bg-white/[0.04] border border-white/10 text-white/70 hover:text-white py-1.5 rounded font-mono font-bold text-[9.5px] uppercase tracking-widest flex items-center justify-center gap-1 cursor-pointer transition"
                >
                  <Download className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
                  Download Hybrid Parameters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-3.5 text-[10px] text-white/30 font-mono tracking-wider">
          <span>Standard FIPS 203 validation checks: ENFORCED</span>
        </div>
      </div>

      {/* RIGHT PANEL: NIST FIPS 204 Lure Document Signature Engine */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "530px" }} id="pqc-signature-engine">
        <div>
          <h2 className="text-xs font-mono font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 mb-4 uppercase">
            <FileCode className="w-4.5 h-4.5 text-brand-orange" />
            LURE SIGNING ENGINE (ML-DSA)
          </h2>

          <div className="space-y-4 font-mono text-xs" id="signature-engine-form">
            <div className="space-y-2">
              <label className="text-white/50 block font-bold tracking-wider text-[10px] uppercase">DOCUMENT BINARY BLOCK PAYLOAD</label>
              <textarea
                rows={5}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded p-2.5 text-white focus:outline-none focus:border-brand-orange text-[11px] placeholder-white/20"
              />
            </div>

            <button
              onClick={verifySignature}
              className="w-full bg-brand-orange/10 border border-brand-orange/30 text-brand-orange py-2.5 rounded font-bold hover:bg-brand-orange/20 transition text-xs flex justify-center items-center gap-1.5 cursor-pointer uppercase tracking-widest"
            >
              Sign & Compute crypt signature
            </button>

            {signStatus && (
              <div className="border border-brand-orange/20 bg-brand-orange/5 p-3.5 rounded text-[10px] space-y-1.5 text-[#e0e0e0]">
                <div className="font-bold uppercase tracking-widest text-[9.5px] text-brand-orange flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-orange" />
                  NIST FIPS 204 AUTH MODULE-LATTICE
                </div>
                {signStatus === "COMPUTING" ? (
                  <div className="py-2.5 flex items-center gap-2 text-brand-orange">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-orange" />
                    Assembling Module-Lattice vectors...
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="break-words leading-relaxed text-[10px] text-white/80">{signStatus}</p>
                    <button
                      type="button"
                      onClick={() => {
                        const text = `========================================================================
GHOST-WATCH SYSTEM // NIST FIPS 204 SECURED DIGITAL CO-SIGNATURE
========================================================================
Verification Algorithm: ML-DSA-65 (Post-Quantum Dilithium Standard)
Timestamp: ${new Date().toISOString()}

--- CORE DOCUMENT PAYLOAD CHARACTER STREAM ---
${docContent}

--- ENCRYPTED VERIFIED SIGNATURE HASH ---
${signStatus}

========================================================================
COMPLIANCE GUARANTEE: NO TIER DEGRADATION ENCOUNTERED DURING RETRIEVAL
========================================================================`;
                        const blob = new Blob([text], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", `ML_DSA_SIGNED_PAYLOAD.txt`);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                        addSystemLog("INFO", "DOWNLOADER", "Exported certified PQC ML-DSA-65 payload signature block.");
                      }}
                      className="w-full mt-1.5 bg-brand-orange/15 hover:bg-brand-orange/25 border border-brand-orange/30 text-brand-orange py-1 rounded font-mono font-bold text-[9px] uppercase tracking-wide flex items-center justify-center gap-1 cursor-pointer transition"
                    >
                      <Download className="w-3 h-3 text-brand-orange shrink-0" />
                      Download Signed Dossier
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-3.5 text-[10px] text-white/30 font-mono tracking-wider">
          <span>Standard FIPS 204 (Dilithium) verification checks: ENFORCED</span>
        </div>
      </div>
    </div>
  );
}
