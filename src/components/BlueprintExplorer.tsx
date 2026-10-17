import React, { useState } from "react";
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Cpu, 
  Terminal, 
  Settings, 
  Database, 
  Plus, 
  RefreshCw, 
  ShieldCheck, 
  FileCode, 
  Network, 
  Copy, 
  CheckCircle2, 
  Info,
  Layers,
  ArrowRight,
  Download
} from "lucide-react";

interface BlueprintExplorerProps {
  addSystemLog: (level: string, source: string, message: string) => void;
}

interface TreeItem {
  name: string;
  type: "folder" | "file";
  desc: string;
  purpose: string;
  children?: TreeItem[];
}

export default function BlueprintExplorer({ addSystemLog }: BlueprintExplorerProps) {
  const [selectedBlueprint, setSelectedBlueprint] = useState<"terminal" | "foundry">("terminal");
  const [selectedNode, setSelectedNode] = useState<{ name: string; type: string; desc: string; purpose: string } | null>({
    name: "ghost-watch-terminal/",
    type: "folder",
    desc: "Primary root layout for air-gapped terminal and telemetry collectors.",
    purpose: "Establishes a localized command-and-control sandbox boundary."
  });

  // ISO Filename composition states
  const [projectCode, setProjectCode] = useState("GW-TERMINAL");
  const [customDate, setCustomDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10).replace(/-/g, "");
  });
  const [sequenceCode, setSequenceCode] = useState("001");
  const [fileVersion, setFileVersion] = useState("v02");
  const [composedName, setComposedName] = useState("");
  const [isCopiedName, setIsCopiedName] = useState(false);

  // Mnemonic hostname encoder states
  const [functionalName, setFunctionalName] = useState("DB Server");
  const [mnemonicHostname, setMnemonicHostname] = useState("vortex.ghost.watch.local");
  const [associatedWord, setAssociatedWord] = useState("vortex");
  const [isCopiedHost, setIsCopiedHost] = useState(false);

  // Mnemonic words available in BIP39 Cryo-Vault seed
  const mnemonicVault = [
    "vortex", "neon", "carbon", "phantom", "nexus", "tactical", "sierra", "pulse", 
    "zenith", "echo", "quartz", "cobalt", "cipher", "orbit", "binary", "flux", 
    "omega", "hunter", "stealth", "grid", "shadow", "vertex", "ionic", "static"
  ];

  // Directory Blueprints from design specifications
  const terminalBlueprint: TreeItem[] = [
    {
      name: "ghost-watch-terminal/",
      type: "folder",
      desc: "Primary root layout for air-gapped terminal and telemetry collectors.",
      purpose: "Establishes a localized sovereign sandbox boundary.",
      children: [
        {
          name: "bin/",
          type: "folder",
          desc: "Distribution-ready executables for production.",
          purpose: "Deploys read-only compiled packages onto air-gapped sensors.",
          children: [
            {
              name: "gwt_core_exec",
              type: "file",
              desc: "Compiled terminal binary.",
              purpose: "Launches the low-level hardware binding protocol."
            }
          ]
        },
        {
          name: "src/",
          type: "folder",
          desc: "Source code written in compliance with single-responsibility principles.",
          purpose: "Contains modular engines for PQC, ACTS, and active defense routing.",
          children: [
            {
              name: "core/",
              type: "folder",
              desc: "Core C2 operations and configuration files.",
              purpose: "Handles basic startup arrays and network bindings.",
              children: [
                {
                  name: "__init__.py",
                  type: "file",
                  desc: "Core module initializer.",
                  purpose: "Defines runtime environments."
                },
                {
                  name: "engine.py",
                  type: "file",
                  desc: "Main processing logic and command dispatcher.",
                  purpose: "Executes Battle Lab control configurations."
                },
                {
                  name: "pqc_lib.py",
                  type: "file",
                  desc: "NIST FIPS 203/204 bindings.",
                  purpose: "Bridges Python with low-level ML-KEM and ML-DSA vectors."
                },
                {
                  name: "hardware_bind.py",
                  type: "file",
                  desc: "Hardware binding checks (HB-9982-AX-2026).",
                  purpose: "Denies logical console execution on unverified processors."
                }
              ]
            },
            {
              name: "agent/",
              type: "folder",
              desc: "Remotely deployed agent parameters.",
              purpose: "Runs continuous loops inside monitored internal directories.",
              children: [
                {
                  name: "agent_main.py",
                  type: "file",
                  desc: "Agent execution entry point.",
                  purpose: "Performs background sanitization and starts loops."
                },
                {
                  name: "beacon.py",
                  type: "file",
                  desc: "Interactive heartbeat sender.",
                  purpose: "Polls active C2 gateways on randomized jitter coordinates."
                },
                {
                  name: "executor.py",
                  type: "file",
                  desc: "Dynamic task execution parser.",
                  purpose: "Deploys secure, read-only payload instructions."
                }
              ]
            },
            {
              name: "deception/",
              type: "folder",
              desc: "Interactive Cognitive-Adaptive Deception Layer (CADL).",
              purpose: "Injects synthetic delay and feeds poisoned logs.",
              children: [
                {
                  name: "canary_factory.py",
                  type: "file",
                  desc: "Canary document writer (IIE).",
                  purpose: "Applies WE-FORGE linguistic and steg shifts."
                },
                {
                  name: "route_manager.py",
                  type: "file",
                  desc: "CADL session director.",
                  purpose: "Reroutes hostile telemetry into the AETHER Honeypot."
                }
              ]
            }
          ]
        },
        {
          name: "data/",
          type: "folder",
          desc: "Local persistence vault.",
          purpose: "Saves encrypted threat ledgers.",
          children: [
            {
              name: "signatures/",
              type: "folder",
              desc: "FIPS 204 public keys repository.",
              purpose: "Validates long-term signatures offline."
            },
            {
              name: "lures/",
              type: "folder",
              desc: "WE-FORGE crafted bait documents.",
              purpose: "Stores ready-for-download assets containing DNS beacons."
            }
          ]
        },
        {
          name: "scripts/",
          type: "folder",
          desc: "Installation and configuration scripts.",
          purpose: "Deploys environment parameters on fresh hardware modules."
        },
        {
          name: "tests/",
          type: "folder",
          desc: "Regression testing suites.",
          purpose: "Checks crypto-agility response boundaries before compilation."
        }
      ]
    }
  ];

  const foundryBlueprint: TreeItem[] = [
    {
      name: "Ghost-Watch-Ontology/",
      type: "folder",
      desc: "Palantir Foundry Project Organization Structure.",
      purpose: "Enforces strict permissions over ontology data-fusion scopes.",
      children: [
        {
          name: "01-Data-Ingest/",
          type: "folder",
          desc: "Raw copies of environmental telemetry.",
          purpose: "Handles pipeline ingest without mutating data structures.",
          children: [
            {
              name: "SIEM-Sync/",
              type: "folder",
              desc: "Security event raw logs stream.",
              purpose: "Aggregates logs from enterprise endpoints."
            },
            {
              name: "Agent-Telemetry/",
              type: "folder",
              desc: "Direct metrics stream from Ghost-Watch active agents.",
              purpose: "Maintains real-time link statistics."
            }
          ]
        },
        {
          name: "02-Data-Transforms/",
          type: "folder",
          desc: "Clean-up and semantic processing layers.",
          purpose: "Normalizes raw formats to align with foundry types.",
          children: [
            {
              name: "Clean-Logic/",
              type: "folder",
              desc: "Data-cleaning routines.",
              purpose: "Filters redundant events to optimize compute."
            },
            {
              name: "Ontology-Out/",
              type: "folder",
              desc: "Validated outputs backing ontology nodes.",
              purpose: "Prepares datasets for semantic loading."
            }
          ]
        },
        {
          name: "03-Ontology-Management/",
          type: "folder",
          desc: "Foundry metadata definition namespace.",
          purpose: "Structures relations between files, targets and threats.",
          children: [
            {
              name: "Object-Types/",
              type: "folder",
              desc: "Ontology semantic classes repository.",
              purpose: "Declares object structures (e.g. LureDocument, Device, Suspect)."
            },
            {
              name: "Link-Types/",
              type: "folder",
              desc: "Relational link definitions.",
              purpose: "Declares relationships (e.g. ACCESSED_LURE, RESOLVED_BEACON)."
            },
            {
              name: "Action-Types/",
              type: "folder",
              desc: "Semantic verbs mapped to scripts.",
              purpose: "Drives actions (e.g. NeutralizeSession, QuarantineHost)."
            }
          ]
        },
        {
          name: "04-Workshop-Apps/",
          type: "folder",
          desc: "Interactive Foundry operational portals.",
          purpose: "Visualizes graphs for analytical teams."
        },
        {
          name: "05-Documentation/",
          type: "folder",
          desc: "Ontology READMEs and dictionaries.",
          purpose: "Maintains high data health indexes and schema references."
        }
      ]
    }
  ];

  // Render Directory Tree Node recursively
  const renderTreeNode = (node: TreeItem, depth = 0) => {
    const isFolder = node.type === "folder";
    const isSelected = selectedNode?.name === node.name;

    return (
      <div key={node.name} className="font-mono text-xs select-none">
        <div
          onClick={() => setSelectedNode({ name: node.name, type: node.type, desc: node.desc, purpose: node.purpose })}
          className={`flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition ${
            isSelected 
              ? "bg-brand-orange/10 border border-brand-orange/30 text-brand-orange" 
              : "hover:bg-white/[0.02] text-white/70"
          }`}
          style={{ paddingLeft: `${Math.max(8, depth * 16)}px` }}
        >
          {isFolder ? (
            isSelected ? (
              <FolderOpen className="w-4 h-4 text-brand-orange shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-brand-orange shrink-0" />
            )
          ) : (
            <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
          )}
          <span className={`font-semibold ${isSelected ? "text-brand-orange" : isFolder ? "text-[#e0e0e0]" : "text-cyan-300"}`}>
            {node.name}
          </span>
        </div>
        {isFolder && node.children && (
          <div className="border-l border-white/5 ml-4 mt-0.5">
            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Compose dynamic compliant file name
  const updateComposedName = () => {
    const output = `${projectCode.toUpperCase()}_${customDate}_${sequenceCode}_${fileVersion.toLowerCase()}.pqc`;
    setComposedName(output);
    return output;
  };

  useState(() => {
    updateComposedName();
  });

  const handleComposeFileName = (e: React.FormEvent) => {
    e.preventDefault();
    const final = updateComposedName();
    addSystemLog(
      "INFO", 
      "BLUEPRINTS", 
      `Composed compliant sovereign filename block: ${final}`
    );
  };

  // Hostname Obscurity Encoding
  const handleEncodeHostname = () => {
    const randomIndex = Math.floor(Math.random() * mnemonicVault.length);
    const chosenWord = mnemonicVault[randomIndex];
    const host = `${chosenWord}.ghost.watch.local`;
    setAssociatedWord(chosenWord);
    setMnemonicHostname(host);
    addSystemLog(
      "INFO", 
      "NIGHTSHADE", 
      `Obscure hostname mapping assigned: functional role '${functionalName}' -> '${host}'`
    );
  };

  const copyToClipboard = (text: string, type: "name" | "host") => {
    navigator.clipboard.writeText(text);
    if (type === "name") {
      setIsCopiedName(true);
      setTimeout(() => setIsCopiedName(false), 2000);
    } else {
      setIsCopiedHost(true);
      setTimeout(() => setIsCopiedHost(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fade-in" id="blueprints-root">
      {/* 1. LEFT PANEL: Structural Selector & Directory Tree */}
      <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "620px" }} id="blueprint-tree-viewer">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-mono font-bold text-white tracking-widest flex items-center gap-2 uppercase">
              <Network className="w-4.5 h-4.5 text-brand-orange" />
              Sovereign Directory Blueprints
            </h2>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setSelectedBlueprint("terminal");
                  setSelectedNode({
                    name: "ghost-watch-terminal/",
                    type: "folder",
                    desc: "Primary root layout for air-gapped terminal and telemetry collectors.",
                    purpose: "Establishes a localized command-and-control sandbox boundary."
                  });
                }}
                className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-l border transition uppercase cursor-pointer ${
                  selectedBlueprint === "terminal"
                    ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                    : "border-white/5 bg-[#050505] text-white/40 hover:text-white"
                }`}
              >
                C2 Terminal
              </button>
              <button
                onClick={() => {
                  setSelectedBlueprint("foundry");
                  setSelectedNode({
                    name: "Ghost-Watch-Ontology/",
                    type: "folder",
                    desc: "Palantir Foundry Project Organization Structure.",
                    purpose: "Enforces strict permissions over ontology data-fusion scopes."
                  });
                }}
                className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-r border transition uppercase cursor-pointer ${
                  selectedBlueprint === "foundry"
                    ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                    : "border-white/5 bg-[#050505] text-white/40 hover:text-white"
                }`}
              >
                Data Ontology
              </button>
            </div>
          </div>

          <p className="text-xs text-white/50 leading-relaxed font-mono">
            Deploy folders as standardized blueprints. Every asset respects secure permissions, modular separation, and chronological ledger rules. Click directories below to inspect individual metadata targets.
          </p>

          {/* Graphical Tree Rendering */}
          <div className="border border-white/5 bg-[#050505]/60 p-4 rounded-lg overflow-y-auto max-h-[400px]" id="blueprint-scroll-tree">
            {selectedBlueprint === "terminal" ? (
              <div className="space-y-1">
                {terminalBlueprint.map((tree) => renderTreeNode(tree))}
              </div>
            ) : (
              <div className="space-y-1">
                {foundryBlueprint.map((tree) => renderTreeNode(tree))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-[10px] text-white/30 font-mono">
          <span>Active compliance: Sovereign Cryptographic standards</span>
          <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-orange" />
            PEP Compliance Enforced
          </span>
        </div>
      </div>

      {/* 2. RIGHT PANEL: Selected Spec Metadata and Filename Generator Sidecar */}
      <div className="space-y-6" id="blueprint-sidecar">
        {/* Sub-Panel 2.1: Node Inspector Details Card */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg font-mono text-xs space-y-4" id="blueprint-node-inspector">
          <h3 className="text-xs font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 uppercase">
            <Info className="w-4.5 h-4.5 text-brand-orange" />
            Directory Node Specs
          </h3>

          {selectedNode ? (
            <div className="space-y-3.5 text-white/70">
              <div className="space-y-1">
                <span className="text-white/30 text-[9px] font-bold block uppercase tracking-wider">ELEMENT LABEL</span>
                <span className="text-white font-bold break-all">{selectedNode.name}</span>
              </div>

              <div className="space-y-1">
                <span className="text-white/30 text-[9px] font-bold block uppercase tracking-wider">SOVEREIGN PURPOSE</span>
                <p className="text-white/70 leading-relaxed font-sans">{selectedNode.purpose}</p>
              </div>

              <div className="space-y-1">
                <span className="text-white/30 text-[9px] font-bold block uppercase tracking-wider">TECHNICAL SPECIFICATION</span>
                <p className="text-white/60 leading-relaxed font-sans">{selectedNode.desc}</p>
              </div>

              {selectedNode.type === "folder" ? (
                <div className="bg-brand-orange/5 border border-brand-orange/15 px-3 py-2 rounded text-[10px] text-brand-orange font-bold flex items-center gap-1.5 uppercase">
                  <Folder className="w-3.5 h-3.5 text-brand-orange" />
                  Directory Node Checked Good
                </div>
              ) : (
                <div className="bg-cyan-950 border border-cyan-500/25 px-3 py-2 rounded text-[10px] text-cyan-400 font-bold flex items-center gap-1.5 uppercase">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  Source Element Compliant
                </div>
              )}

              {/* Advanced blueprint specification document downloader */}
              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    const textContent = `GHOST-WATCH SPECS // BRAND COMPLIANT NODE BLUEPRINT DOCUMENT
========================================================================
Element Name: ${selectedNode.name}
Element Type: ${selectedNode.type.toUpperCase()}
Sovereign Target: ${selectedNode.purpose}

--- TECHNICAL OVERVIEW & SYSTEM CRITERIA ---
${selectedNode.desc}

========================================================================
CERTIFIED DISPATCH COMPLIANT // AEGIS COMMAND SECURITY BUFFER APPROVED
========================================================================
`;
                    const blob = new Blob([textContent], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `BLUEPRINT_SPEC_${selectedNode.name.replace(/[\/\.]/g, "_").toUpperCase()}.txt`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    addSystemLog("INFO", "DOWNLOADER", `Downloaded directory specification doc for: ${selectedNode.name}`);
                  }}
                  className="w-full bg-brand-orange/15 hover:bg-brand-orange/25 border border-brand-orange/30 text-brand-orange py-2 rounded font-bold cursor-pointer transition text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-brand-orange shrink-0 animate-pulse" />
                  Download Node Specification Details
                </button>
              </div>
            </div>
          ) : (
            <div className="text-white/30 text-center py-12">
              Select an ontology node to see metrics.
            </div>
          )}
        </div>

        {/* Sub-Panel 2.2: Advanced ISO Filename & Obscurity Hostname Utilities */}
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg space-y-5" id="secure-naming-engine">
          <h3 className="text-xs font-mono font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 uppercase mb-1">
            <Settings className="w-4.5 h-4.5 text-brand-orange" />
            Tactical Naming Engine
          </h3>

          {/* Form 1: ISO 8601 File Compiler */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1 text-white/50 font-bold uppercase tracking-wider text-[9px]">
              <Layers className="w-3.5 h-3.5 text-brand-orange" />
              ISO 8601 Filename Compiler
            </div>

            <form onSubmit={handleComposeFileName} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-white/30 text-[8px] uppercase font-bold">Project Pref</span>
                  <input
                    type="text"
                    value={projectCode}
                    onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#050505] border border-white/10 p-1.5 rounded text-[10.5px] text-white focus:outline-none focus:border-brand-orange font-bold uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-white/30 text-[8px] uppercase font-bold">ISO Date Block</span>
                  <input
                    type="text"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 p-1.5 rounded text-[10.5px] text-white focus:outline-none focus:border-brand-orange font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <span className="text-white/30 text-[8px] uppercase font-bold">Sequence Id</span>
                  <input
                    type="text"
                    value={sequenceCode}
                    onChange={(e) => setSequenceCode(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 p-1.5 rounded text-[10.5px] text-white focus:outline-none focus:border-brand-orange font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-white/30 text-[8px] uppercase font-bold">Ver Flag</span>
                  <input
                    type="text"
                    value={fileVersion}
                    onChange={(e) => setFileVersion(e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 p-1.5 rounded text-[10.5px] text-white focus:outline-none focus:border-brand-orange font-bold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#080808] hover:bg-brand-orange/10 border border-brand-orange/20 text-brand-orange py-1.5 rounded font-bold transition text-[10px] uppercase tracking-wider cursor-pointer"
              >
                Compile Filename
              </button>
            </form>

            <div className="bg-[#050505] border border-white/5 p-2 rounded flex justify-between items-center text-[10px] text-white break-all gap-2 relative">
              <span className="text-brand-orange font-semibold">{projectCode.toUpperCase()}_{customDate}_{sequenceCode}_{fileVersion.toLowerCase()}.pqc</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const filename = `${projectCode.toUpperCase()}_${customDate}_${sequenceCode}_${fileVersion.toLowerCase()}.pqc`;
                    const textContent = `GHOST-WATCH ISO BLUEPRINT DOCUMENT
========================================================================
Compiled Filename: ${filename}
Project Code Prefix: ${projectCode.toUpperCase()}
Custom Date Block: ${customDate}
Sequence Identifier: ${sequenceCode}
Revision Code Version: ${fileVersion.toLowerCase()}
Compilation Timestamp: ${new Date().toISOString()}

--- TECHNICAL SPECIFICATION DETAILS ---
Designed OS System Target: SOVEREIGN RECOVERY ENCLAVE
NIST Security Approval Status: FIPS COMPLIANT L3 ENVELOPE

This document is the compiled cryptographically isolated blueprint manifest.
========================================================================
CERTIFIED SECURE CONTAINER ASSEMBLY APPROVED // AEGIS OVERWATCH ACTIVE
========================================================================`;
                    const blob = new Blob([textContent], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", filename);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                    addSystemLog("INFO", "DOWNLOADER", `Downloaded compiled ISO blueprint template: ${filename}`);
                  }}
                  className="hover:text-brand-orange text-white/50 transition cursor-pointer"
                  title="Download ISO config file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`${projectCode.toUpperCase()}_${customDate}_${sequenceCode}_${fileVersion.toLowerCase()}.pqc`, "name")}
                  className="shrink-0 hover:text-brand-orange text-white/50 transition cursor-pointer"
                  title="Copy name"
                >
                  {isCopiedName ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 animate-pulse" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Form 2: Mnemonic Hostname Obscurity Engine */}
          <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-1 text-white/50 font-bold uppercase tracking-wider text-[9px]">
              <Terminal className="w-3.5 h-3.5 text-brand-orange" />
              Mnemonic Obscurity Encoder (BIP39 Seed)
            </div>

            <div className="space-y-2.5">
              <div className="space-y-1">
                <span className="text-white/30 text-[8px] uppercase font-bold">Logical Server Function</span>
                <input
                  type="text"
                  value={functionalName}
                  onChange={(e) => setFunctionalName(e.target.value)}
                  placeholder="e.g. Primary DB Vault"
                  className="w-full bg-[#050505] border border-white/10 p-1.5 rounded text-[10.5px] text-white focus:outline-none focus:border-brand-orange font-bold"
                />
              </div>

              <button
                type="button"
                onClick={handleEncodeHostname}
                className="w-full bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 text-brand-orange py-1.5 rounded font-bold transition text-[10px] uppercase tracking-wider cursor-pointer"
              >
                Assign Random Obscurity Hostname
              </button>
            </div>

            <div className="bg-[#050505] border border-white/5 p-2.5 rounded text-[10px] space-y-1">
              <div className="flex justify-between items-center break-all gap-2">
                <span className="text-cyan-300 font-semibold">{mnemonicHostname}</span>
                <button
                  onClick={() => copyToClipboard(mnemonicHostname, "host")}
                  className="shrink-0 hover:text-brand-orange text-white/50 transition cursor-pointer"
                  title="Copy hostname"
                >
                  {isCopiedHost ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 animate-pulse" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="text-[9px] text-white/30 leading-snug pt-1 border-t border-white/5 flex justify-between items-center">
                <span>Associated Seed Word: <span className="text-brand-orange font-bold">{associatedWord}</span></span>
                <span className="text-green-500 bg-green-500/5 px-1 py-0.2 rounded border border-green-500/10 font-bold uppercase text-[7.5px]">OBSTRUCTED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
