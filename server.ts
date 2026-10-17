import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dns from "dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database for Ghost-Watch Operations
const state = {
  activeThreats: 0,
  cadlLevel: 1,
  cadlStatus: "Awaiting Input...",
  hardwareBindingId: "HB-9982-AX-2026",
  loraFrequency: 915.00,
  ewJamming: false,
  systemLocked: false,
  systemIntegrity: 100,
  logs: [
    { timestamp: new Date().toISOString(), level: "INFO", source: "CORE", message: "Ghost-Watch C2 Terminal initialized. Hard-bound to HB-9982-AX-2026." },
    { timestamp: new Date().toISOString(), level: "INFO", source: "COMMS", message: "Listening on 915.0 MHz (LoRa Mesh-Net) for Director (P-01)." },
  ],
  actsLedger: [
    {
      id: "GW-LURE_20260520_001_v02.pqc",
      target: "LAE-Node-09 (Database Administrator)",
      token: "audit-vault-77.ghost.watch.local",
      watermark: "synonym-shift: 'quantumcore' replaced with 'subspace-lattice'",
      padding: "Metadata padding initialized with SHA-256 entropy. Simulated ghost rows inserted in secure directories.",
      status: "ACTIVE",
      interacted: false,
      interactionTelemetry: null
    },
    {
      id: "GW-LURE_20260520_002_v02.pqc",
      target: "External Contracting Channel Alpha",
      token: "secure-dns-93.ghost.watch.local",
      watermark: "syntactic-shift: split infinitive in paragraph 4 to flag layout",
      padding: "Least Significant Bit (LSB) steganographic seed embedded in blueprints.png",
      status: "TRIGGERED",
      interacted: true,
      interactionTelemetry: {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        resolvedIp: "192.168.42.115",
        geolocation: "Middle East (Interception Subnetwork)",
        dnsQueryPath: "93.dns-beacon.ghost.watch.local"
      }
    }
  ],
  insiders: [
    { id: "NS-01", name: "Gen. Bar-Lev (Directorate)", clearance: "Level 5", role: "Tactical Command", riskScore: 12, status: "CLEAR", bSauMetrics: "Baseline biometric alignment 98%. Active session verified physical bound." },
    { id: "NS-02", name: "Dr. Lev-Ari (R&D)", clearance: "Level 4", role: "PQC Architect", riskScore: 34, status: "CLEAR", bSauMetrics: "Baseline biometric alignment 91%. Frequent accesses of ML-KEM source files." },
    { id: "NS-03", name: "A. Cohen (Logistics)", clearance: "Level 3", role: "Mesh Network Operator", riskScore: 82, status: "SUSPECTED_NSITA", bSauMetrics: "Nightshade alerts flag late-night logins via unscheduled external relays." },
    { id: "NS-04", name: "S. Mizrahi (System Admin)", clearance: "Level 5", role: "DB Sentinel", riskScore: 41, status: "MONITORED", bSauMetrics: "BSAU indicators show slight deviation in key stroke latency metrics." }
  ],
  ontology: {
    nodes: [
      { id: "Terminal-C2", label: "HB-9982-AX-2026 (Local Console)", type: "Terminal", status: "ONLINE", contacts: "Director (P-01)" },
      { id: "Lure-001", label: "GW-LURE_20260520_001_v02.pqc", type: "Lure", status: "ACTIVE", contacts: "Dr. Lev-Ari (Owner)" },
      { id: "Lure-002", label: "GW-LURE_20260520_002_v02.pqc", type: "Lure", status: "TRIGGERED", contacts: "S. Mizrahi (Security Guard)" },
      { id: "Node-Logistics", label: "A. Cohen Terminal", type: "Host", status: "WARNING", contacts: "A. Cohen" },
      { id: "Adversary-Relay", label: "192.168.42.115 (Attacking Subnet)", type: "Adversary", status: "REJECTED", contacts: "Intruder Alpha" },
    ],
    links: [
      { source: "Terminal-C2", target: "Lure-001", relation: "GENERATE" },
      { source: "Terminal-C2", target: "Lure-002", relation: "GENERATE" },
      { source: "Node-Logistics", target: "Lure-001", relation: "ACCESSED" },
      { source: "Lure-002", target: "Adversary-Relay", relation: "RESOLVED_BEACON" }
    ]
  }
};

// Helper for adding Logs
function addLog(level: string, source: string, message: string) {
  state.logs.unshift({
    timestamp: new Date().toISOString(),
    level,
    source,
    message
  });
  if (state.logs.length > 200) {
    state.logs.pop();
  }
}

// 1. System state API
app.get("/api/state", (req, res) => {
  res.json(state);
});

// Endpoint to append system logs from client
app.post("/api/log", (req, res) => {
  const { level, source, message } = req.body;
  if (level && source && message) {
    addLog(level, source, message);
  }
  res.json({ success: true, logs: state.logs });
});

// 2. Add an ACTS Lure (Identifier Injection Engine)
app.post("/api/acts/deploy", (req, res) => {
  const { target, watermarkType, customWatermark, useSteganography } = req.body;
  
  if (!target) {
    return res.status(400).json({ error: "Target persona or node required." });
  }

  const timestamp = new Date();
  const dateStr = timestamp.toISOString().slice(0, 10).replace(/-/g, "");
  const randHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0").toUpperCase();
  const lureId = `GW-LURE_${dateStr}_00${state.actsLedger.length + 1}_v02.pqc`;
  const dnsToken = `audit-vault-${Math.floor(Math.random() * 90) + 10}.ghost.watch.local`;
  
  const finalWatermark = customWatermark || (watermarkType === "linguistic" 
    ? "linguistic-shift: 'quantumcore' replaced with 'subspace-lattice'" 
    : watermarkType === "metadata" 
    ? "metadata-padding: hidden FIPS 203 keys injected in document blocks" 
    : "steganography-lsb: hidden UUID encoded in header image");

  const newLure = {
    id: lureId,
    target,
    token: dnsToken,
    watermark: finalWatermark,
    padding: useSteganography 
      ? "Steganographic Least Significant Bit (LSB) mask layer written successfully." 
      : "WE-FORGE metadata padding added securely.",
    status: "ACTIVE",
    interacted: false,
    interactionTelemetry: null
  };

  state.actsLedger.unshift(newLure);

  // Synchronize with Palantir Ontology
  const nodeId = `Lure-${dateStr}-${randHex}`;
  state.ontology.nodes.push({
    id: nodeId,
    label: lureId,
    type: "Lure",
    status: "ACTIVE",
    contacts: target
  });

  state.ontology.links.push({
    source: "Terminal-C2",
    target: nodeId,
    relation: "GENERATE"
  });

  addLog("INFO", "ACTS", `Deployed high-credibility Canary Trap lure document: ${lureId} targeted at ${target}.`);
  res.json({ success: true, lure: newLure });
});

// 3. Trigger Canary Beacon (Simulate attack telemetry on a lure)
app.post("/api/acts/trigger", (req, res) => {
  const { lureId, adversaryIp } = req.body;
  const lure = state.actsLedger.find(l => l.id === lureId);

  if (!lure) {
    return res.status(404).json({ error: "Lure not found" });
  }

  const resolvedIp = adversaryIp || "185.220.101." + Math.floor(Math.random() * 254 + 1);

  lure.status = "TRIGGERED";
  lure.interacted = true;
  lure.interactionTelemetry = {
    timestamp: new Date().toISOString(),
    resolvedIp,
    geolocation: "State-sponsored Transit (Interception Subnetwork B)",
    dnsQueryPath: `${Math.floor(Math.random() * 89 + 10)}.dns-beacon.${lure.token}`
  };

  // Escalate CADL
  state.activeThreats += 1;
  state.systemIntegrity = Math.max(state.systemIntegrity - 15, 20);
  
  // Connect to Palantir Ontology
  const advId = `Adv-${Math.floor(Math.random() * 9000 + 1000)}`;
  state.ontology.nodes.push({
    id: advId,
    label: `${resolvedIp} (Interception Core)`,
    type: "Adversary",
    status: "ACTIVE",
    contacts: "Unknown Intruder"
  });

  // Find Lure node ID in ontology
  const lureNode = state.ontology.nodes.find(n => n.label === lureId);
  if (lureNode) {
    lureNode.status = "TRIGGERED";
    state.ontology.links.push({
      source: lureNode.id,
      target: advId,
      relation: "RESOLVED_BEACON"
    });
  }

  addLog("WARNING", "AEGIS", `DNS Canary beacon triggered matching ${lureId}. Resolution attempted from IP: ${resolvedIp}.`);
  
  res.json({ success: true, lure });
});

// 4. Update CADL Escalation Levels
app.post("/api/cadl/escalate", (req, res) => {
  const { level } = req.body;
  if (level < 1 || level > 5) {
    return res.status(400).json({ error: "CADL values must run from Level 1 to 5." });
  }

  state.cadlLevel = level;
  const statusDescriptions = [
    "L1 [Monitor]: Passive gathering of 'Digital Dust'. Log telemetry and track DNS resolutions.",
    "L2 [Delay]: Injecting microsecond artificial latency layers inside packet transmissions.",
    "L3 [Reroute]: Iron Dome intercept. Intercepting core traffic, rerouting session to AETHER Honeypot.",
    "L4 [Degrade]: Cyber warfare payload payload delivery. Transmitting corrupted, encrypted quantum clutter.",
    "L5 [Neutralize]: Speed-of-light automated termination via session purge. Aegis Kill-Switch Armed."
  ];

  state.cadlStatus = statusDescriptions[level - 1];
  addLog("ALERT", "CADL", `Escalation Layer shifted to ${statusDescriptions[level - 1]}`);

  // Kinetic outcomes
  if (level === 5) {
    state.activeThreats = 0;
    state.systemIntegrity = 100;
    addLog("CRITICAL", "CITRON_TREE", "Aegis Kinetic Shielding complete. Terminal status neutralized.");
  }

  res.json({ success: true, level: state.cadlLevel, status: state.cadlStatus });
});

// 5. Update Cerberus Insider Profiling (revoking credentials)
app.post("/api/insiders/revoke", (req, res) => {
  const { id } = req.body;
  const insider = state.insiders.find(i => i.id === id);

  if (!insider) {
    return res.status(404).json({ error: "Insider node profile not found." });
  }

  insider.status = "REVOKED";
  insider.riskScore = 0;
  insider.bSauMetrics = "Multipass revoked completely on Citron Tree master node. Communication keys blacklisted.";

  addLog("CRITICAL", "CERBERUS", `Insider threats contained: Multipass and authentication tokens revoked for ${insider.name} (${insider.role}).`);
  res.json({ success: true, insider });
});

// 6. LoRa frequency selector and jam simulation
app.post("/api/lora/config", (req, res) => {
  const { frequency, ewJamming } = req.body;
  if (frequency) {
    state.loraFrequency = parseFloat(frequency);
    addLog("INFO", "COMMS", `RF Frequency shifted to: ${state.loraFrequency} MHz via LoRa Spread Spectrum.`);
  }
  if (ewJamming !== undefined) {
    state.ewJamming = ewJamming;
    if (ewJamming) {
      state.systemIntegrity = Math.max(state.systemIntegrity - 30, 40);
      addLog("WARNING", "NIGHTSHADE", "Electronic Warfare (EW) sweep detected. Jamming present in 915 MHz band.");
    } else {
      state.systemIntegrity = Math.min(state.systemIntegrity + 20, 100);
      addLog("INFO", "NIGHTSHADE", "Spectra clear. No active EW jamming identified.");
    }
  }
  res.json({ success: true, frequency: state.loraFrequency, jamming: state.ewJamming });
});

// 7. Post-Quantum Cryptography Simulator Engine
app.post("/api/pqc/handshake", (req, res) => {
  const { keyType } = req.body; // e.g. "hybrid"
  
  const standardSeed = "vortex neon carbon phantom nexus tactical sierra pulse zenith echo quartz cobalt cipher orbit binary flux omega hunter stealth grid shadow vertex ionic static".split(" ");
  const alicePrivate = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
  const bobPrivate = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));

  const ecdhPublic = "04" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const kemCiphertext = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  
  // Composite Shared Secrets and HKDF
  const combinedEntropy = ecdhPublic + kemCiphertext + standardSeed.slice(0, 4).join("");
  const sharedSecret = crypto.subtle 
    ? "CRYPTO_SUBTLE_AVAIL" // Placeholder for safe checking
    : hashlib(combinedEntropy);

  addLog("INFO", "PQC_ENGINE", `Assembled dual-mode hybrid shared secret with ML-KEM-768 & ECDH. Entropy length: 768-bit.`);
  
  res.json({
    success: true,
    protocol: "ML-KEM-768 + ECDH Complex",
    alicePubKey: "ML-KEM_PK_768_RAW_0x" + Array.from({ length: 24 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join(""),
    bobPubKey: "ML-KEM_PK_768_RAW_0x" + Array.from({ length: 24 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0")).join(""),
    sharedSec: sharedSecret
  });
});

// Helper hashing function for server
function hashlib(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return "HKDF_SHA256_HASH_0x" + Math.abs(hash).toString(16).toUpperCase() + "FFA18A9E6C3B992D87";
}

// 8. OMEGA Contingency Trigger (simulates complete backend wipe)
app.post("/api/system/wipe", (req, res) => {
  state.activeThreats = 0;
  state.cadlLevel = 1;
  state.systemLocked = true;
  state.systemIntegrity = 0;
  state.actsLedger = [];
  state.ontology.nodes = [
    { id: "Terminal-C2", label: "HB-9982-AX-2026 (Local Console)", type: "Terminal", status: "WIPED_LOCKED", contacts: "Restoration Pending" }
  ];
  state.ontology.links = [];
  
  addLog("CRITICAL", "OMEGA_CONTINGENCY", "EMERGENCY KINETIC PROTOCOL TRIGGERS: OMEGA. All keys and memory buffers scrubbed.");
  addLog("INFO", "HARDWARE_BIND", "Cryo-Vault recovery lock engaged. Awaiting 24-word physical key segments.");

  res.json({ success: true, message: "Omega contingency lock initiated successfully." });
});

// 9. OMEGA Cryo-Vault Restore Verification Puzzle
app.post("/api/system/restore", (req, res) => {
  const { split1, split2 } = req.body;
  const correctSeed = "vortex neon carbon phantom nexus tactical sierra pulse zenith echo quartz cobalt cipher orbit binary flux omega hunter stealth grid shadow vertex ionic static".split(" ");
  
  const inputWords = [...(split1 || []), ...(split2 || [])].map(w => w.trim().toLowerCase());
  
  let match = true;
  if (inputWords.length !== correctSeed.length) {
    match = false;
  } else {
    for (let i = 0; i < correctSeed.length; i++) {
      if (inputWords[i] !== correctSeed[i]) {
        match = false;
        break;
      }
    }
  }

  if (match) {
    state.systemLocked = false;
    state.systemIntegrity = 100;
    // Restore default DB nodes
    state.actsLedger = [
      {
        id: "GW-LURE_RESTORED_v02.pqc",
        target: "System Administrator (Pre-Authenticated)",
        token: "audit-vault-77.ghost.watch.local",
        watermark: "synonym-shift: post-omega state watermark",
        padding: "Post-restoration high entropy blocks initialized.",
        status: "ACTIVE",
        interacted: false,
        interactionTelemetry: null
      }
    ];
    state.ontology.nodes = [
      { id: "Terminal-C2", label: "HB-9982-AX-2026 (Local Console)", type: "Terminal", status: "ONLINE", contacts: "Director (P-01)" },
      { id: "Lure-Restored", label: "GW-LURE_RESTORED_v02.pqc", type: "Lure", status: "ACTIVE", contacts: "System Admin" }
    ];
    state.ontology.links = [
      { source: "Terminal-C2", target: "Lure-Restored", relation: "GENERATE" }
    ];
    
    addLog("INFO", "HARDWARE_BIND", "Cryo-Vault verification complete. Physical keys match exactly. Terminal online.");
    res.json({ success: true });
  } else {
    res.json({ success: false, error: "Sequence mismatch in Cryo-Vault words. Hardware lock remains intact." });
  }
});


// Express server hosting static Vite client or dev mode
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}`);
  });
}

startServer();
