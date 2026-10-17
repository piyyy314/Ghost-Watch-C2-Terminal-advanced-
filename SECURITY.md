# Security Policy

## Supported Versions

Ghost-Watch C2 Terminal follows a continuous release cadence. We actively provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

The Ghost-Watch security and intelligence team takes software security vulnerabilities seriously.

If you believe you have discovered a security vulnerability in Ghost-Watch C2 Terminal:

1. **Do not disclose the issue publicly** (e.g., in GitHub Issues, social media, or public forums).
2. Report the vulnerability privately via **GitHub Private Vulnerability Reporting** on the repository's Security tab, or email the security contact at:
   - `security@ghostwatch.local` (or project maintainer email)
3. Include the following details in your report:
   - Description of the potential vulnerability
   - Steps to reproduce or proof-of-concept (PoC) code
   - Potential impact of the vulnerability
   - Subsystem affected (e.g. Server API, PQC Sandbox, State Ingestion, Hardware ID Binding)

### Response Timeline

- **Initial Response**: Within 48 hours acknowledging receipt of your report.
- **Triage & Status Update**: Within 5 business days detailing vulnerability confirmation and severity assessment.
- **Remediation & Patch**: We strive to release security patches within 14 days of confirmation.

---

## Cryptographic Security Notice

- **Post-Quantum Implementations**: The PQC algorithms simulated in this terminal (ML-KEM, ML-DSA) are educational simulations designed to model NIST FIPS 203/204 standard behaviors in browser environments. For production cryptographic enclaves, use verified hardware cryptographic modules.
- **Hardware Binding**: The hardware binding ID `HB-9982-AX-2026` is an in-memory enclave emulation. In true air-gapped environments, bind directly to verified TPM 2.0 PCR registers.
