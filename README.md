# 🛡️ Ghost-Watch C2 Terminal

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.1-38bdf8.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)
[![Security Classification](https://img.shields.io/badge/Classification-APEX--TIER%20RESTRICTED-red.svg?style=flat-square)]()
[![PQC Standard](https://img.shields.io/badge/PQC-NIST%20FIPS%20203%2F204-purple.svg?style=flat-square)]()

> **Integrated Systems Architecture and Command & Control (C2) Terminal** for Ghost-Watch Apex-Tier Operations, Advanced Canary Trap Ecosystem (ACTS), Israeli Aegis / Ballistic Missile Defense (BMD) Battle Lab simulations, and Quantum-Resistant Cryptography.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Operational Subsystems](#-key-operational-subsystems)
  - [1. Tactical C2 Operations Dashboard](#1-tactical-c2-operations-dashboard)
  - [2. Advanced Canary Trap Ecosystem (ACTS)](#2-advanced-canary-trap-ecosystem-acts)
  - [3. Post-Quantum Cryptography (PQC) Sandbox](#3-post-quantum-cryptography-pqc-sandbox)
  - [4. Palantir-Style Intelligence Ontology Map](#4-palantir-style-intelligence-ontology-map)
  - [5. Cerberus BSAU Insider Threat Profiler](#5-cerberus-bsau-insider-threat-profiler)
  - [6. CADL Deception Engine](#6-cadl-deception-engine)
  - [7. RF Spectrum & Electronic Warfare Control](#7-rf-spectrum--electronic-warfare-control)
  - [8. BMD Multi-Tier Battle Lab (Israeli Aegis / Iron Dome / Arrow-3)](#8-bmd-multi-tier-battle-lab-israeli-aegis--iron-dome--arrow-3)
  - [9. Aether-Mesh Decoy Honeypot](#9-aether-mesh-decoy-honeypot)
  - [10. Blueprint System Explorer & Schematics](#10-blueprint-system-explorer--schematics)
  - [11. Omega Contingency Protocol](#11-omega-contingency-protocol)
  - [12. Real-Time Diagnostics & Audit Snapshot Modal](#12-real-time-diagnostics--audit-snapshot-modal)
- [Tech Stack](#-tech-stack)
- [Hardware Binding & Cryptographic Guarantees](#-hardware-binding--cryptographic-guarantees)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Development Mode](#development-mode)
  - [Production Build & Run](#production-build--run)
  - [Docker Setup](#docker-setup)
- [API Specification](#-api-specification)
- [Project Directory Structure](#-project-directory-structure)
- [Security Considerations & Safe Usage](#-security-considerations--safe-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Ghost-Watch C2 Terminal** is a high-fidelity, real-time command, control, intelligence, and active cyber-defense tactical console. Built with tactical defense UI principles (anti-glare dark cyber palette, tactical monospace telemetry, amber/emerald/cyan status indicators), it models full-spectrum electronic warfare, insider threat analytics, autonomous canary trap tracking, multi-tier missile interception calculations, and post-quantum cryptographic key exchanges.

The terminal is hard-bound to hardware security identifier `HB-9982-AX-2026` and features a full bidirectional REST/telemetry pipeline synchronized with an Express server runtime.

---

## 🏗️ System Architecture

```
               ┌────────────────────────────────────────────────────────┐
               │             GHOST-WATCH APEX C2 CONSOLE                │
               │           (React 19 + Tailwind CSS v4)                 │
               └──────────────────────────┬─────────────────────────────┘
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
     ┌────────────────────────┐                      ┌────────────────────────┐
     │   TACTICAL UI TABS     │                      │  DIAGNOSTICS & TELEMETRY│
     │ ────────────────────── │                      │ ────────────────────── │
     │ • C2 Master Dashboard  │                      │ • Hardware ID Binding  │
     │ • ACTS Token Injector  │                      │ • Real-time Audit Modal│
     │ • PQC Sandbox          │                      │ • Toast Clipboard Feed │
     │ • Ontology Intel Graph │                      │ • Subsystem Status Bus │
     │ • Cerberus Profiler    │                      └────────────────────────┘
     │ • CADL Simulator       │                                   │
     │ • Spectrum / EW Suite  │                                   │
     │ • BMD Aegis Battle Lab │                                   │
     │ • Aether Honeypots     │                                   │
     │ • Blueprint Explorer   │                                   │
     │ • Omega Contingency    │                                   │
     └────────────┬───────────┘                                   │
                  │                                               │
                  │ REST / Telemetry Ingestion (4.5s Polling + Events)
                  ▼                                               ▼
  ┌───────────────────────────────────────────────────────────────────────────────┐
  │                           EXPRESS SERVER BACKEND                              │
  │                             (Node.js / tsx)                                   │
  │                                                                               │
  │  • In-Memory Ops State Engine      • ACTS Canary Lure Ledger & Beacon Telemetry│
  │  • Cerberus BSAU Risk Scorer       • LoRa Mesh 915.00 MHz EW Jamming Simulator │
  │  • PQC Key Generation & Verification• CADL Deception State Transition Automata │
  │  • System Log Telemetry Bus        • Omega Protocol Countdown & Scrub Trigger │
  └──────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
            ┌────────────────────────┐      ┌────────────────────────┐
            │   Vite Dev Middleware  │      │ Gemini AI API Proxy    │
            │   (Integrated HMR/SSR) │      │ (Server-Side @google)  │
            └────────────────────────┘      └────────────────────────┘
```

---

## ⚡ Key Operational Subsystems

### 1. Tactical C2 Operations Dashboard
- **Central Telemetry Wall**: High-visibility mission clock, active threat counters, real-time command logging buffer, hardware binding status, and instant threat level escalation.
- **Subsystem Readiness Monitor**: Real-time health tracking across Comms, Radar, Encryption, and Decoy matrices with visual health meters.

### 2. Advanced Canary Trap Ecosystem (ACTS)
- **Tokenized Honeypot Documents**: Generate targeted `.pqc` canary lure files embedded with mathematical watermarks (e.g., synonym shift, syntactic variance, steganographic LSB padding in blueprints).
- **Automated Beacon Triggering**: Real-time simulation of insider document exfiltration, reporting adversary IP, reverse DNS query paths, and geographic telemetry upon unauthorized access.

### 3. Post-Quantum Cryptography (PQC) Sandbox
- **NIST FIPS 203 / 204 Algorithms**: Simulates **ML-KEM (Kyber-768/1024)** Key Encapsulation Mechanisms and **ML-DSA (Dilithium-3)** Digital Signature Algorithms.
- **Quantum Resistance Verification**: Tests ciphertext entropy, decapsulation integrity, public/private key pairs, and post-quantum resilience against Shor's algorithm simulations.

### 4. Palantir-Style Intelligence Ontology Map
- **Interactive Graph Intelligence**: Dynamic node-link visualization mapping relationship vectors between Terminal nodes, Canary Lures, Internal Hosts, and Adversary C2 Beacons.
- **Link Types**: `GENERATE`, `ACCESSED`, `RESOLVED_BEACON` tracking exfiltration routes and compromised pivot channels.

### 5. Cerberus BSAU Insider Threat Profiler
- **Behavioral Biometrics**: Tracks keystroke latency variance, biometric alignment percentage, nightshade unauthorized relay accesses, and credential anomalies.
- **Threat Isolation Matrix**: Instant one-click quarantine, surveillance escalation, or clearance revocation for high-risk operators.

### 6. CADL Deception Engine
- **Cyber Adaptive Deception Layer**: Five progressive escalation postures ranging from `Passive Monitoring` to `Full Autonomous Counter-Offensive`.
- **Decoy Topology Inversion**: Dynamically modifies network response signatures and returns synthetic entropy to intercept hostile reconnaissance.

### 7. RF Spectrum & Electronic Warfare Control
- **Tactical Mesh-Net**: LoRa 915.00 MHz ISM band monitoring for Director P-01 communications.
- **Active Jamming Suite**: Wideband noise barrage and frequency-hopping spread-spectrum (FHSS) counters against hostile interceptors.

### 8. BMD Multi-Tier Battle Lab (Israeli Aegis / Iron Dome / Arrow-3)
- **Multi-Layer Ballistic Interception**: Real-time physics calculation simulating atmospheric re-entry threats, Iron Dome (C-RAM), David's Sling (Mid-Tier MRBM), and Arrow-3 (Exo-Atmospheric ICBM/IRBM) kinetic kill-vehicle intercepts.
- **Radar PPI Display**: High-performance SVG Plan Position Indicator with smooth CSS hardware-accelerated sweep, azimuth tracking, and threat distance vectors.

### 9. Aether-Mesh Decoy Honeypot
- **Virtual Mesh Traps**: High-interaction decoy nodes mimicking critical SCADA, telemetry, and encrypted military comms channels to deceive hostile automated exploitation scripts.

### 10. Blueprint System Explorer & Schematics
- **Architectural Schematics**: Interactive blueprint viewer detailing terminal hardware schematics, cryptographic boundary enclaves, and physical tamper-response circuits.

### 11. Omega Contingency Protocol
- **Zero-Trust Failsafe**: Multi-stage cryptographic zeroization mechanism.
- **Defensive Scrubbing**: Emergency countdown protocol to overwrite memory registers, purge local telemetry, revoke cryptographic keys, and isolate hardware interfaces.

### 12. Real-Time Diagnostics & Audit Snapshot Modal
- **Click-to-Copy Hardware ID**: Clickable header tag copying `HB-9982-AX-2026` with visual green badge feedback and floating confirmation toast.
- **Flicker-Free Tooltip**: Smooth CSS transition delay and hover bridge preventing inadvertent closure.
- **Full Audit Modal**: Complete JSON state inspector with real-time text search, pretty/raw views, one-click JSON clipboard copy, and formatted `.json` file download.

---

## 💻 Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 19 (`react`, `react-dom`) | Modern functional components with hooks architecture |
| **Styling & Design** | Tailwind CSS v4 (`@tailwindcss/vite`) | Ultra-responsive tactical theme, custom color tokens |
| **Icons & Visuals** | Lucide React (`lucide-react`) | Cyber-tactical SVG iconography |
| **Animations** | Motion (`motion`) & CSS3 Hardware Acceleration | Smooth radar sweeping, modal transitions, and alerts |
| **Backend API** | Node.js + Express 4 (`express`) | In-memory operational database and REST endpoints |
| **Runtime & Dev** | TSX (`tsx`), Vite 6 (`vite`), esbuild | High-speed TypeScript execution and production bundling |
| **Language** | TypeScript 5.8 | End-to-end type safety across client and server |

---

## 🔒 Hardware Binding & Cryptographic Guarantees

Ghost-Watch C2 Terminal incorporates simulated hardware cryptographic binding:

```
[ PHYSICAL HOST CHIPSET ] ──► [ TPM 2.0 / ENCLAVE ] ──► [ HW BINDING ID: HB-9982-AX-2026 ]
                                                                   │
                                                                   ▼
                                                       [ MUTUAL TLS / PQC AUTH ]
                                                                   │
                                                                   ▼
                                                       [ GHOST-WATCH TERMINAL CORE ]
```

- **Hardware Binding Identifier**: `HB-9982-AX-2026`
- **Integrity Validation**: Periodic checksum synchronization verifying terminal integrity against unauthorized tampering.
- **Cryptographic Algorithms**:
  - Lattice-based Key Encapsulation (ML-KEM / Kyber)
  - Lattice-based Digital Signatures (ML-DSA / Dilithium)
  - Quantum-Resistant Hash Trees (SHA3-512 / SHAKE-256)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS recommended)
- **Package Manager**: `npm` (v10+) or `pnpm` / `yarn`
- **Operating System**: Linux, macOS, or Windows (WSL2 recommended)

### Installation

Clone the repository and install project dependencies:

```bash
# Clone the repository
git clone https://github.com/your-org/ghost-watch-c2.git

# Navigate to project directory
cd ghost-watch-c2

# Install dependencies
npm install
```

### Environment Configuration

Copy the example environment template:

```bash
cp .env.example .env
```

Configure your environment variables if utilizing external LLM analysis:

```env
# Optional: Required for Gemini AI strategic advisor features
GEMINI_API_KEY="your_api_key_here"

# Application URL (defaults to http://localhost:3000 in dev)
APP_URL="http://localhost:3000"
```

### Development Mode

Start the integrated development server with hot reload:

```bash
npm run dev
```

The terminal interface will be accessible at:
👉 **`http://localhost:3000`**

### Production Build & Run

To create a production-optimized build and execute the packaged server:

```bash
# Compile client assets and bundle Express server
npm run build

# Start production server
npm start
```

### Verification & Linting

```bash
# Verify TypeScript compilation and type definitions
npm run lint
```

### Docker Setup

Run Ghost-Watch C2 within an isolated container:

```bash
# Build the Docker image
docker build -t ghost-watch-c2:latest .

# Run container on port 3000
docker run -d -p 3000:3000 --name ghost-watch-terminal ghost-watch-c2:latest
```

---

## 📡 API Specification

The Express backend serves RESTful endpoints consumed by the tactical UI:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/state` | Returns the complete system operational state snapshot |
| `POST` | `/api/threat/escalate` | Increments active threat level and logs alerts |
| `POST` | `/api/threat/reset` | Resets threat level to baseline |
| `POST` | `/api/cadl/escalate` | Cycles the CADL deception posture (Levels 1–5) |
| `POST` | `/api/ew/toggle` | Toggles LoRa 915.00 MHz Electronic Warfare jamming |
| `POST` | `/api/acts/trigger` | Triggers canary lure beacon interaction telemetry |
| `POST` | `/api/acts/inject` | Generates a new tokenized ACTS canary lure file |
| `POST` | `/api/insider/quarantine` | Quarantines a suspected insider threat |
| `POST` | `/api/omega/trigger` | Initiates the Omega Contingency zeroization countdown |
| `POST` | `/api/log` | Ingests a structured client command log entry |

---

## 📂 Project Directory Structure

```
ghost-watch-c2/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md             # Standardized bug reporting template
│   │   └── feature_request.md        # Tactical feature proposal template
│   └── workflows/
│       ├── ci.yml                    # Automated build, lint & test workflow
│       └── codeql.yml                # Automated security & code scanning
├── src/
│   ├── components/
│   │   ├── AetherHoneypot.tsx        # Virtual mesh trap simulator
│   │   ├── BMDBattleLab.tsx          # Multi-tier BMD / Iron Dome physics lab
│   │   ├── BlueprintExplorer.tsx     # Technical hardware & schematics viewer
│   │   ├── C2Dashboard.tsx           # Primary C2 operations console
│   │   ├── CADLSimulator.tsx         # Cyber Adaptive Deception Layer matrix
│   │   ├── CerberusProfiler.tsx      # Insider threat & behavioral profiler
│   │   ├── IdentifierInjection.tsx   # ACTS canary lure generation interface
│   │   ├── OmegaContingency.tsx      # Emergency zeroization failsafe panel
│   │   ├── OntologyMap.tsx           # Threat node-link intelligence graph
│   │   ├── PQCSandbox.tsx            # Quantum-safe cryptographic sandbox
│   │   ├── SpectrumControlPanel.tsx  # RF spectrum & EW jamming control
│   │   └── SystemDiagnosticsModal.tsx# Full audit modal with JSON search/download
│   ├── App.tsx                       # Main application shell & tab routing
│   ├── index.css                     # Global styles & Tailwind CSS v4 setup
│   ├── main.tsx                      # React root rendering entry point
│   └── types.ts                      # Core TypeScript definitions & models
├── .env.example                      # Template for environment configuration
├── .gitignore                        # Git exclusion rules
├── Dockerfile                        # Multi-stage production container build
├── docker-compose.yml                # Docker Compose orchestration specification
├── LICENSE                           # Open source MIT license
├── metadata.json                     # AI Studio metadata & capabilities
├── package.json                      # Project dependencies and script declarations
├── README.md                         # Comprehensive project documentation
├── server.ts                         # Express backend & in-memory state engine
├── tsconfig.json                     # TypeScript compiler configuration
└── vite.config.ts                    # Vite client build configuration
```

---

## 🛡️ Security Considerations & Safe Usage

- **Simulation Context**: Ghost-Watch C2 Terminal is designed for tactical cybersecurity training, military-grade UI/UX simulation, and educational research into Post-Quantum Cryptography and Canary Trap architectures.
- **Hardware Binding**: The identifier `HB-9982-AX-2026` is a simulated hardware enclave anchor. Do not attempt to bind to physical production HSMs without verifying driver compatibility.
- **Secrets Management**: Never commit actual API keys or credentials. Use `.env` or your hosting provider's secret management mechanism.

---

## 🤝 Contributing

Contributions to Ghost-Watch C2 Terminal are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**: `git checkout -b feature/tactical-enhancement`
3. **Commit Your Changes**: Follow Conventional Commits format (`feat: add new BMD trajectory model`)
4. **Run Verification**: Ensure `npm run lint` and `npm run build` pass without warnings
5. **Open a Pull Request**: Submit your PR with a detailed explanation of changes

Please see [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for full details.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>GHOST-WATCH APEX DEFENSE OPERATIONS</b> • RESTRICTED SYSTEM • SECURE TELEMETRY LINK
</p>
