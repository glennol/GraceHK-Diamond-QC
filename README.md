# Lab Diamond Checker 💎

A production-style, 100% client-side diamond quality control web application built with React + TypeScript + Vite.

## Features

- **Proportion Analysis** — Evaluate table %, depth %, L/W ratio against shape-specific grading rules for all 10 diamond shapes
- **Symmetry Workspace** — Interactive axis guides with react-konva; computes a 0–100 symmetry score
- **Clarity Annotation** — Mark inclusions (feather, crystal, cloud, etc.) on microscope images with severity ratings
- **Certificate OCR** — Extract and verify grading report fields using Tesseract.js
- **QC Reports** — Generate pass/review/fail recommendations with exportable PDF reports (jsPDF)
- **100% Local** — All data stored in IndexedDB (via idb); no server required

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v3 |
| State | Zustand |
| Persistence | IndexedDB (idb) |
| Canvas | react-konva + konva |
| OCR | Tesseract.js v5 |
| PDF Export | jsPDF |
| Animation | framer-motion |
| Routing | React Router v6 |

## Getting Started

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
npm run build      # outputs to dist/
npm run preview    # preview production build
```

Deployed via GitHub Actions to GitHub Pages at `/GraceHK-Diamond-QC/`.

## Project Structure

```
src/
  app/           # Router, App entry
  components/    # UI components (layout, common, inspection, symmetry, clarity, certificate, report)
  data/          # Grading rules JSON, demo data
  hooks/         # Custom React hooks
  lib/           # Core logic (analysis, OCR, DB, export, images)
  pages/         # Page components
  store/         # Zustand stores
  styles/        # Global CSS
  types/         # TypeScript type definitions
```

## Disclaimer

This tool is for reference and internal QC workflows only. Grade estimates do not replace certified gemological appraisal (GIA, IGI, AGS).