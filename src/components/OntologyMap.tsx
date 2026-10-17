import { useState } from "react";
import { SystemState, OntologyNode } from "../types";
import { Network, Tag, Shield, Terminal, ShieldAlert, Cpu, AlertTriangle, ExternalLink, Download } from "lucide-react";

interface OntologyMapProps {
  systemState: SystemState;
  sendStateUpdate: (newState: Partial<SystemState>) => void;
  addSystemLog: (level: string, source: string, message: string) => void;
}

export default function OntologyMap({ systemState, sendStateUpdate, addSystemLog }: OntologyMapProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("Terminal-C2");

  const handleDownloadSchema = () => {
    const content = JSON.stringify(systemState.ontology, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "GW_PALANTIR_ONTOLOGY_MODEL_SCHEMA.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addSystemLog("INFO", "DOWNLOADER", "Downloaded integrated Palantir Ontology relationship schema coordinates.");
  };

  // Simple layout positions deterministic by node type to avoid layout library bloat
  const calculatedNodes = systemState.ontology.nodes.map((node, index) => {
    let x = 350;
    let y = 200;

    if (node.id === "Terminal-C2") {
      x = 350;
      y = 200;
    } else if (node.type === "Lure") {
      const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
      x = 350 + 160 * Math.cos(angle);
      y = 200 + 120 * Math.sin(angle);
    } else if (node.type === "Host") {
      x = 100 + (index * 40);
      y = 100 + (index * 80);
    } else if (node.type === "Adversary") {
      x = 600;
      y = 150 + (index * 90);
    } else {
      x = 180 + (index * 70);
      y = 320;
    }

    return { ...node, x, y };
  });

  const getSelectedNode = (): (OntologyNode & { x: number; y: number }) | undefined => {
    return calculatedNodes.find((n) => n.id === selectedNodeId);
  };

  const handleIsolateServer = (nodeId: string) => {
    addSystemLog("CRITICAL", "CITRON_TREE", `Ontological Action executed: Isolate Compromised Server for node ID: ${nodeId}`);
    
    // Update node status
    const newNodes = systemState.ontology.nodes.map((n) => {
      if (n.id === nodeId) {
        return { ...n, status: "ISOLATED" };
      }
      return n;
    });

    sendStateUpdate({
      systemIntegrity: Math.min(systemState.systemIntegrity + 15, 100),
      ontology: {
        ...systemState.ontology,
        nodes: newNodes
      }
    });
  };

  const selectedNode = getSelectedNode();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans animate-fade-in" id="ontology-grid">
      {/* LEFT & CENTER: Interactive SVG Ontological Relationship Graph */}
      <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" style={{ minHeight: "530px" }} id="ontology-graph-panel">
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h2 className="text-sm font-mono font-bold text-white tracking-widest flex items-center gap-2 uppercase">
              <Network className="w-4.5 h-4.5 text-brand-orange" />
              ONTOLOGY DATA FUSION MODEL
            </h2>
            <span className="text-[10px] font-mono text-brand-orange bg-brand-orange/5 px-2.5 py-0.5 rounded border border-brand-orange/20 uppercase tracking-widest">
              OBJECT-CENTRIC MODEL
            </span>
          </div>

          <div className="relative border border-white/5 rounded-lg bg-[#050505]/80 overflow-hidden select-none" style={{ minHeight: "390px" }} id="graph-container">
            {/* Legend indicators */}
            <div className="absolute top-3 left-3 bg-[#0a0a0a]/95 border border-white/10 p-2.5 rounded text-[9.5px] space-y-1.5 font-mono text-white/50 z-10" id="graph-legend">
              <div className="flex items-center gap-1.5 uppercase font-bold text-[8.5px]">
                <span className="w-2 h-2 rounded bg-cyan-400"></span> Terminal Console
              </div>
              <div className="flex items-center gap-1.5 uppercase font-bold text-[8.5px]">
                <span className="w-2 h-2 rounded bg-brand-orange"></span> WE-FORGE Lure
              </div>
              <div className="flex items-center gap-1.5 uppercase font-bold text-[8.5px]">
                <span className="w-2 h-2 rounded bg-yellow-400"></span> Monitored Host
              </div>
              <div className="flex items-center gap-1.5 uppercase font-bold text-[8.5px]">
                <span className="w-2 h-2 rounded bg-red-500"></span> Adversary Relay
              </div>
            </div>

            <svg viewBox="0 0 700 400" className="w-full h-[390px]">
              {/* Define Arrowheads for directional relationships */}
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="18" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#F27D26" fillOpacity="0.4" />
                </marker>
              </defs>

              {/* DRAW RELATIONSHIP LINKS */}
              {systemState.ontology.links.map((link, idx) => {
                const sourceNode = calculatedNodes.find((n) => n.id === link.source);
                const targetNode = calculatedNodes.find((n) => n.id === link.target);

                if (!sourceNode || !targetNode) return null;

                const isWarningRelation = link.relation === "RESOLVED_BEACON";
                const strokeColor = isWarningRelation ? "#f87171" : "#F27D26";
                const strokeOpacity = isWarningRelation ? 0.7 : 0.35;
                const dashArray = isWarningRelation ? "4,4" : "0";

                return (
                  <g key={`link-${idx}`} className="font-mono text-[9px]">
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={strokeColor}
                      strokeOpacity={strokeOpacity}
                      strokeWidth={1.5}
                      strokeDasharray={dashArray}
                      markerEnd="url(#arrow)"
                    />
                    {/* Link label positioned in direct midpoint of link line */}
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 5}
                      textAnchor="middle"
                      fill={isWarningRelation ? "#f87171" : "#F27D26"}
                      fillOpacity={0.7}
                      className="font-bold text-[8px] bg-[#050505] px-1"
                    >
                      {link.relation}
                    </text>
                  </g>
                );
              })}

              {/* DRAW ONTOLOGY OBJECTS (NODES) */}
              {calculatedNodes.map((node) => {
                let color = "#22d3ee"; // Default terminal cyan
                let size = 10;
                let activePulse = false;

                if (node.type === "Lure") {
                  color = node.status === "TRIGGERED" ? "#f87171" : "#F27D26";
                  size = 8;
                  activePulse = node.status === "TRIGGERED";
                } else if (node.type === "Host") {
                  color = node.status === "WARNING" ? "#facc15" : "#e0e0e0";
                  size = 9;
                } else if (node.type === "Adversary") {
                  color = "#ef4444";
                  size = 11;
                  activePulse = true;
                }

                const isSelected = selectedNodeId === node.id;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer font-mono"
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Ring highlight if currently selected */}
                    {isSelected && (
                      <circle r={size + 8} fill="none" stroke="#F27D26" strokeWidth={1.5} strokeDasharray="3,3" />
                    )}

                    {/* Animated aura ring if danger or sensor alert is pulsing */}
                    {activePulse && (
                      <circle r={size + 14} fill="none" stroke={color} strokeWidth={1.5} opacity={0.4} className="animate-ping" />
                    )}

                    {/* Main Node body circle */}
                    <circle r={size} fill="#050505" stroke={color} strokeWidth={2} />
                    <circle r={size - 4} fill={color} opacity={0.8} />

                    {/* Node text tags aligned above node circle */}
                    <text
                      y={-size - 6}
                      textAnchor="middle"
                      fill={isSelected ? "#F27D26" : "#e0e0e0"}
                      className="font-bold text-[9px] select-none uppercase tracking-tight"
                    >
                      {node.label.length > 25 ? `${node.label.slice(0, 22)}...` : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3.5">
            <button
              type="button"
              onClick={handleDownloadSchema}
              className="w-full bg-[#050505] hover:bg-white/[0.04] border border-white/10 text-white/70 hover:text-white py-2 rounded font-mono font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-brand-orange" />
              Download Ontological Schema
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-3.5 flex justify-between items-center text-[10px] text-white/30 font-mono">
          <span>Relational associations: {systemState.ontology.links.length} objects synced.</span>
          <span>Click elements online to launch visual sidecars.</span>
        </div>
      </div>

      {/* RIGHT PANEL: Palantir Ontological Sidecar detailed inspector */}
      <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-lg flex flex-col justify-between" id="ontology-sidecar-panel">
        <div>
          <h2 className="text-sm font-mono font-bold text-brand-orange tracking-widest flex items-center gap-2 border-b border-white/10 pb-3 mb-4 uppercase">
            <Tag className="w-4.5 h-4.5 text-brand-orange" />
            ONTOTELEMETRY SIDECAR
          </h2>

          {selectedNode ? (
            <div className="space-y-4 font-mono text-xs text-white/70" id="sidecar-inspection-view">
              <div className="space-y-1">
                <span className="text-white/30 block text-[9.5px] font-bold uppercase tracking-wider">SEMANTIC OBJECT TYPE</span>
                <span className="text-brand-orange bg-brand-orange/5 border border-brand-orange/15 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]">
                  {selectedNode.type}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-white/30 block text-[9.5px] font-bold uppercase tracking-wider">SEMANTIC ELEMENT ID</span>
                <span className="text-white font-bold">{selectedNode.id}</span>
              </div>

              <div className="space-y-1">
                <span className="text-white/30 block text-[9.5px] font-bold uppercase tracking-wider">METADATA LABEL</span>
                <span className="text-white/80 font-semibold">{selectedNode.label}</span>
              </div>

              <div className="space-y-1">
                <span className="text-white/30 block text-[9.5px] font-bold uppercase tracking-wider">PRIMARY COMPONENT OWNER</span>
                <span className="text-brand-orange font-bold">{selectedNode.contacts}</span>
              </div>

              <div className="space-y-1">
                <span className="text-white/30 block text-[9.5px] font-bold uppercase tracking-wider">RELATIONAL RISK POSTURE</span>
                <span className={`font-bold uppercase ${
                  selectedNode.status === "TRIGGERED" || selectedNode.status === "WARNING" ? "text-red-400" : "text-brand-orange"
                }`}>
                  {selectedNode.status}
                </span>
              </div>

              {/* Kinetic Actions */}
              <div className="pt-4 border-t border-white/10 space-y-2.5" id="sidecar-action-panel">
                <span className="text-white/30 block font-bold text-[9.5px] tracking-wider uppercase">LOCAL OPERATIONAL CONTROL</span>

                {selectedNode.id !== "Terminal-C2" && selectedNode.status !== "ISOLATED" ? (
                  <button
                    onClick={() => handleIsolateServer(selectedNode.id)}
                    className="w-full bg-red-950/20 border border-red-500/30 text-red-500 py-2 rounded text-center text-[10.5px] font-bold hover:bg-red-500/35 transition cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider font-mono"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    ISOLATE COMPROMISED NODE
                  </button>
                ) : selectedNode.status === "ISOLATED" ? (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-2.5 text-center rounded text-[10px] font-bold uppercase tracking-wide">
                    NODE OFF-SPACE-LATTICE ISOLATION ENFORCED
                  </div>
                ) : (
                  <p className="text-[10px] text-white/30 leading-snug">No primary external kinetic adjustments available for core console node.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-white/30 font-mono text-center py-20 text-xs">
              Select an ontology node to see metrics.
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-3.5 text-[9.5px] text-white/30 font-mono flex items-center gap-1 uppercase tracking-wide">
          <Cpu className="w-3.5 h-3.5 text-white/30" />
          <span>FUSION RELATION ENGINE SYNCED</span>
        </div>
      </div>
    </div>
  );
}
