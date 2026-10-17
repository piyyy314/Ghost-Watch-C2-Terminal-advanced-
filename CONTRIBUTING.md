# Contributing to Ghost-Watch C2 Terminal

Thank you for your interest in contributing to Ghost-Watch C2 Terminal! This repository provides an advanced tactical command, control, active cyber-defense, and ballistic missile defense simulation console.

Please take a moment to review this document to ensure smooth, secure, and professional collaboration.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to maintain respectful, constructive, and mission-oriented communication.

---

## Development Workflow

### 1. Prerequisites

- **Node.js**: `v20.x` or `v22.x` (LTS)
- **npm**: `v10+`
- **Git**

### 2. Fork and Clone

```bash
# Fork the repo via GitHub UI, then clone your fork
git clone https://github.com/<your-username>/ghost-watch-c2.git
cd ghost-watch-c2
```

### 3. Branching Strategy

Create a descriptive feature or bugfix branch off `main`:

```bash
git checkout -b feat/add-pqc-kem-benchmark
# or
git checkout -b fix/radar-sweep-azimuth
```

Branch naming conventions:
- `feat/` for new operational subsystems or visual widgets
- `fix/` for bug fixes and UI alignment issues
- `docs/` for documentation updates
- `perf/` for animation and rendering optimizations
- `refactor/` for internal architectural improvements

### 4. Local Installation & Running

```bash
npm install
npm run dev
```

The tactical terminal will run at `http://localhost:3000`.

### 5. Coding Standards

- **TypeScript**: Strict type definitions only. Avoid using `any`. Ensure all types are properly exported or imported from `src/types.ts`.
- **Styling**: Tailwind CSS v4 utility classes. Maintain the dark tactical cyber aesthetic (deep blacks, slate zincs, amber accents, cyber emeralds, and tactical cyan).
- **Clean Architecture**: Functional React components with hooks. Subsystems should remain isolated inside `src/components/`.
- **No External Secrets**: Never commit private keys, tokens, or credentials.

### 6. Verification Checklist

Before opening a pull request, run the following verification steps:

```bash
# 1. Type check and lint
npm run lint

# 2. Production build verification
npm run build
```

Both commands must pass with zero errors.

---

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature or subsystem component
- `fix:` A bug fix or visual glitch correction
- `docs:` Documentation improvements
- `style:` Formatting changes that do not alter code logic
- `refactor:` Code improvements that neither fix a bug nor add a feature
- `perf:` Performance optimizations (e.g. SVG animation refactors)
- `test:` Adding or updating tests
- `chore:` Build scripts or dependency updates

*Example:* `feat(bmd): add multi-azimuth intercept telemetry indicators`

---

## Submitting Pull Requests

1. Push your branch to your remote fork:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Fill out the PR template with:
   - Summary of changes
   - Operational subsystem(s) affected
   - Screenshots or screencasts if visual UI was altered
   - Confirmation that `npm run lint` and `npm run build` completed successfully.

Our team will review your submission promptly. Thank you for making Ghost-Watch C2 Terminal even better!
