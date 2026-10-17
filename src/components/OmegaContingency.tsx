import React, { useState, useEffect } from "react";
import { SystemState } from "../types";
import { ShieldAlert, Trash2, Key, HelpCircle, FileText, CheckCircle2 } from "lucide-react";

interface OmegaContingencyProps {
  systemState: SystemState;
  sendStateUpdate: (newState: Partial<SystemState>) => void;
  addSystemLog: (level: string, source: string, message: string) => void;
}

export default function OmegaContingency({ systemState, sendStateUpdate, addSystemLog }: OmegaContingencyProps) {
  const [wipeConfirm, setWipeConfirm] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [scrubLogs, setScrubLogs] = useState<string[]>([]);
  const [isWiping, setIsWiping] = useState(false);

  // Restore states
  const [split1, setSplit1] = useState<string[]>(Array(12).fill(""));
  const [split2, setSplit2] = useState<string[]>(Array(12).fill(""));
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  const correctSeed = "vortex neon carbon phantom nexus tactical sierra pulse zenith echo quartz cobalt cipher orbit binary flux omega hunter stealth grid shadow vertex ionic static".split(" ");

  const handleWipeTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (wipeConfirm.trim().toUpperCase() !== "WIPE") {
      alert("Verification mismatch. Enter WIPE to commit execution.");
      return;
    }

    setIsWiping(true);
    setCountdown(10);
    setScrubLogs(["Initiating OMEGA CONTINGENCY protocols..."]);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        let msg = "";
        
        switch (countdown) {
          case 10:
            msg = "[WIPE] Halting out-of-band LoRa mesh networks...";
            break;
          case 9:
            msg = "[WIPE] Dismounting Palantir ontology relationship links...";
            break;
          case 8:
            msg = "[WIPE] Scrubbing Active Directory indices and BSAU behavioral metrics...";
            break;
          case 7:
            msg = "[WIPE] Erasing WE-FORGE Canary lures binaries secure directory blocks...";
            break;
          case 6:
            msg = "[WIPE] Neutralizing ML-KEM-768 and ML-DSA cryptographic session storage...";
            break;
          case 5:
            msg = "[WIPE] Scrubbing hardware bindings registers HB-9982-AX-2026...";
            break;
          case 4:
            msg = "[WIPE] Purging volatile memory RAM caches completely...";
            break;
          case 3:
            msg = "[WIPE] Rendering CITRON TREE node registers offline...";
            break;
          case 2:
            msg = "[WIPE] Issuing mechanical physical wipe alerts...";
            break;
          case 1:
            msg = "[WIPE] Severing space-lattice connections. Ready.";
            break;
        }
        if (msg) {
          setScrubLogs((prev) => [msg, ...prev]);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // Countdown complete, dispatch wipe to API
      fetch("/api/system/wipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => res.json())
        .then((data) => {
          // Fetch new state to update UI layout
          fetch("/api/state")
            .then((res) => res.json())
            .then((serverState) => {
              sendStateUpdate(serverState);
              setIsWiping(false);
              setCountdown(null);
              setWipeConfirm("");
            });
        });
    }
  }, [countdown]);

  const handleRestore = (e: React.FormEvent) => {
    e.preventDefault();
    setRestoreError(null);

    fetch("/api/system/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ split1, split2 })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRestoreSuccess(true);
          setRestoreError(null);
          setTimeout(() => {
            fetch("/api/state")
              .then((res) => res.json())
              .then((serverState) => {
                sendStateUpdate(serverState);
                setSplit1(Array(12).fill(""));
                setSplit2(Array(12).fill(""));
                setRestoreSuccess(false);
              });
          }, 1500);
        } else {
          setRestoreError(data.error);
        }
      });
  };

  const handleAutocompleteRestoreKeys = () => {
    setSplit1(correctSeed.slice(0, 12));
    setSplit2(correctSeed.slice(12, 24));
    setRestoreError(null);
  };

  // Keyboard shortcut listener for simulated CTR+SHIFT+ALT+WIPE
  useEffect(() => {
    const handleKeys = (ev: KeyboardEvent) => {
      if (ev.ctrlKey && ev.shiftKey && ev.altKey && (ev.key === "W" || ev.key === "w" || ev.key === "E" || ev.key === "e")) {
        ev.preventDefault();
        if (!systemState.systemLocked && !isWiping) {
          setIsWiping(true);
          setCountdown(10);
          setScrubLogs(["CTRL+SHIFT+ALT+WIPE Bind detected. Directing Omega emergency wipe immediately."]);
        }
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [systemState, isWiping]);

  if (systemState.systemLocked) {
    return (
      <div className="bg-[#0a0a0a] border border-red-500/30 p-6 rounded-lg text-xs font-mono space-y-6 animate-fade-in" id="unlocked-recovery-screen">
        <div className="flex items-center gap-3 border-b border-red-500/20 pb-4 mb-2 animate-pulse">
          <ShieldAlert className="w-8 h-8 text-red-500 shrink-0" />
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-red-500 uppercase tracking-widest">
              Cryo-Vault Physical Recovery Active
            </h2>
            <p className="text-[10px] text-white/30 font-sans">Hardware locked: Space-Lattice security buffers neutralized</p>
          </div>
        </div>

        <div className="border border-brand-orange/20 bg-brand-orange/5 p-4 rounded-lg leading-relaxed text-white/60 text-[11px] space-y-2">
          <p className="font-bold text-brand-orange uppercase flex items-center gap-1.5 tracking-widest text-[10px]">
            <HelpCircle className="w-4 h-4 text-brand-orange" />
            Active Physical Recovery Instructions
          </p>
          <p className="font-sans leading-relaxed text-[11px]">
            The master recovery seed phrase was bifurcated into two 12-word segments stored in disparate fireproof storage plates (Split-1 and Split-2). Manual verification is strictly required to reconstruct the NIST crypto bounds.
          </p>
          <div className="flex border border-brand-orange/15 p-2.5 rounded bg-black/40 justify-between items-center text-[10px] text-brand-orange font-bold uppercase tracking-wider">
            <span>REFERENCE MASTER KEY BACKUP SEED:</span>
            <button
              onClick={handleAutocompleteRestoreKeys}
              className="bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 text-brand-orange px-2.5 py-1 rounded transition text-[9px] cursor-pointer"
            >
              Mount Physical Seed Keys
            </button>
          </div>
          <p className="text-[10px] leading-relaxed text-white/40 bg-[#050505] p-2.5 rounded border border-white/5 font-mono italic">
            "vortex neon carbon phantom nexus tactical sierra pulse zenith echo quartz cobalt cipher orbit binary flux omega hunter stealth grid shadow vertex ionic static"
          </p>
        </div>

        <form onSubmit={handleRestore} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Split 1 */}
            <div className="space-y-3" id="split-key-1">
              <h3 className="text-[10px] font-bold text-brand-orange flex items-center gap-2 border-b border-white/10 pb-2 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-brand-orange" />
                SPLIT-KEY SECTOR 1 (WORDS 1-12)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {split1.map((val, idx) => (
                  <div key={`split1-${idx}`} className="flex items-center gap-1.5 bg-[#050505] border border-white/5 rounded px-2 py-1">
                    <span className="text-white/30 text-[10px] min-w-[12px]">{idx + 1}.</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => {
                        const next = [...split1];
                        next[idx] = e.target.value;
                        setSplit1(next);
                      }}
                      className="w-full bg-transparent focus:outline-none text-[11px] text-brand-orange p-0 font-bold"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Split 2 */}
            <div className="space-y-3" id="split-key-2">
              <h3 className="text-[10px] font-bold text-brand-orange flex items-center gap-2 border-b border-white/10 pb-2 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-brand-orange" />
                SPLIT-KEY SECTOR 2 (WORDS 13-24)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {split2.map((val, idx) => (
                  <div key={`split2-${idx}`} className={`flex items-center gap-1.5 bg-[#050505] border border-white/5 rounded px-2 py-1`}>
                    <span className="text-white/30 text-[10px] min-w-[12px]">{idx + 13}.</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => {
                        const next = [...split2];
                        next[idx] = e.target.value;
                        setSplit2(next);
                      }}
                      className="w-full bg-transparent focus:outline-none text-[11px] text-brand-orange p-0 font-bold"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {restoreError && <p className="text-red-500 text-[11px] font-bold uppercase tracking-wide">{restoreError}</p>}
          {restoreSuccess && (
            <div className="text-brand-orange text-xs font-bold bg-brand-orange/5 border border-brand-orange/25 p-2.5 rounded text-center animate-pulse flex items-center justify-center gap-2 uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4 text-brand-orange" />
              SEED ALIGNED. RE-BOOTING CONSOLE SECURITY SHIELD...
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={restoreSuccess}
              className="bg-brand-orange text-black font-extrabold hover:bg-brand-orange/90 text-xs px-6 py-2.5 rounded font-mono uppercase tracking-widest cursor-pointer transition shadow-sm"
            >
              Verify Seed & Restore Bound
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fade-in" id="omega-contingency-suite">
      {/* LEFT PANEL: Immediate Trigger controls */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg h-fit space-y-4" id="omega-trigger">
        <h2 className="text-sm font-mono font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 uppercase animate-pulse">
          <Trash2 className="w-4.5 h-4.5 text-brand-orange" />
          OMEGA IMMEDIATE PURGE
        </h2>

        {!isWiping ? (
          <form onSubmit={handleWipeTrigger} className="space-y-4 text-xs font-mono">
            <div className="border border-red-500/20 bg-red-400/5 p-3.5 rounded text-[10.5px] text-red-400 leading-relaxed font-sans">
              <strong>SAFETY DESTRUCT GAP:</strong> Executing Omega Contingency immediately locks this terminal, purges temporary credentials, wipes standard directories, and flags core assets. Archive restoral is only permitted using geographic physical paper recovery plates.
            </div>

            <div className="space-y-2" id="form-wipe-verify text-[10.5px]">
              <label className="text-white/40 block font-bold text-[9px] uppercase tracking-wider">VERIFY TERMINATION INTENT (TYPE "WIPE")</label>
              <input
                type="text"
                value={wipeConfirm}
                onChange={(e) => setWipeConfirm(e.target.value)}
                placeholder="TYPE WIPE HERE"
                className="w-full bg-[#050505] border border-red-900/40 rounded p-2.5 text-red-500 focus:outline-none focus:border-red-500 text-[11px] uppercase placeholder-red-950 font-bold"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-950/20 border border-red-500 text-red-500 py-2.5 rounded font-bold hover:bg-red-500/20 hover:border-red-400 active:bg-red-500/30 transition text-xs flex justify-center items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <ShieldAlert className="w-4 h-4 text-red-500" />
              EXECUTE OMEGA PROTOCOL
            </button>
          </form>
        ) : (
          <div className="space-y-4 font-mono text-xs" id="wipeactive-view">
            <div className="text-center text-red-500 animate-pulse font-bold text-[14px] tracking-widest">
              !!! DESTRUCT SEQUENCE: {countdown}s !!!
            </div>
            <div className="h-2 bg-black rounded overflow-hidden relative border border-white/10">
              <div 
                className="h-full bg-red-600 transition-all duration-350"
                style={{ width: `${(countdown || 0) * 10}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="border-t border-white/10 pt-3.5 space-y-2 text-[10px] font-mono text-white/30" id="omega-binds-brief">
          <p className="uppercase tracking-wider">
            Key combination bypass: 
            <span className="text-red-500 ml-1 font-bold">CTRL + SHIFT + ALT + WIPE</span>
          </p>
        </div>
      </div>

      {/* RIGHT & CENTER: Countdown Logs Feed & Output details */}
      <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "530px" }} id="omega-scrub-panel">
        <div>
          <h2 className="text-sm font-mono font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 mb-4 uppercase">
            <Trash2 className="w-4.5 h-4.5 text-brand-orange" />
            OMEGA ERASE SHIELD LOGS
          </h2>

          <div className="max-h-[380px] overflow-y-auto border border-white/5 rounded bg-[#050505] p-4 space-y-2.5 h-[360px] font-mono text-[10.5px] pr-1" id="scrub-logs-visual">
            {scrubLogs.length === 0 ? (
              <div className="text-white/20 text-center py-24 leading-relaxed font-sans">
                <p className="uppercase tracking-widest text-[10px] font-bold">Contingency registers quiet.</p>
                <p className="text-[10px] mt-1.5 text-white/30 font-serif italic">"Awaiting operational execute vector."</p>
              </div>
            ) : (
              scrubLogs.map((log, index) => (
                <div key={index} className="text-red-500 flex gap-2 last:animate-pulse">
                  <span className="text-red-600 font-extrabold shrink-0">WIPE // </span>
                  <span className="break-all text-white/80">{log}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t border-white/10 pt-3.5 flex justify-between items-center text-[10px] text-white/30 font-mono uppercase tracking-widest">
          <span>OMEGA-4 DESTRUCT PROTOCOL SYSTEM INBOUND</span>
        </div>
      </div>
    </div>
  );
}
