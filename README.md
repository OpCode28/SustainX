# MEIL ESG / BRSR Reporting Portal

> **Client Context:** Megha Engineering & Infrastructures Limited (MEIL)  
> **Problem Statement:** Development of an online portal for BRSR reporting of Corporate ESG Reports.  
> **Applicable Standards:** SEBI BRSR Framework (Revised 2024 Edition) & BRSR Core Reasonable Assurance Standards.

---

## 📌 Executive Summary

MEIL is one of India's foremost infrastructure conglomerates with operations spanning 18 Indian states and global footprints across Europe, the Middle East, and South America through subsidiaries including **DRILLMEC**, **Petreven**, and **Olectra Greentech**.

Managing sustainability across 250+ project sites requires transforming fragmented spreadsheets and site logs into a **centralized, metadata-driven, validated, and traceable ESG data-to-report workflow**.

```
MEIL GROUP (Corporate HQ)
    ↓
SUBSIDIARY (e.g. MEIL Infrastructure Projects Ltd)
    ↓
BUSINESS UNIT (e.g. Metro & Rail BU)
    ↓
PROJECT / SITE (e.g. Demo Project Alpha - 250MW Solar Park)
```

---

## 🎨 Official MEIL Design System

The application strictly implements MEIL's corporate visual DNA:

- **Primary Navy (`#1A2A6C`)**: Top utility bar, header branding, primary buttons, and footer.
- **Primary Red (`#EF272E`)**: Action accents, active indicators, alert badges, and highlight strips.
- **White (`#FFFFFF`)**: Clean main background panels.
- **Light Gray (`#E8E8E8`)**: Sidebar boxes, data tables, and subtle borders.
- **Charcoal (`#333333`)**: High-contrast, readable body typography.
- **Muted Blue-Gray (`#C6CBE6`)**: Secondary text and footer sub-links.
- **Typography & Form Language**: `Arial`, `Helvetica`, clean sans-serif typography, flat panels, 2–4px border radii, and zero gradient/glassmorphism distractions.

---

## ✅ Work Completed Till Now (Phase 1 Delivered)

### 1. MEIL Corporate Website Interface (`/` & `/corporate`)
- High-fidelity recreation of the official **MEIL Corporate Portal** matching the exact color palette, typography, top utility bar (social icons + subsidiaries dropdown), flat hero banner, editorial article layout, "More Verticals" link block, and 4-column structured footer.
- Seamless bridge linking the public corporate portal directly into the internal ESG Reporting System.

### 2. Enterprise Persistent App Shell & RBAC
- **Top Brand Bar**: Displays *MEGHA ENGINEERING & INFRASTRUCTURES LIMITED*, real-time Reporting Entity switcher, Financial Year selector (`FY 2026-27`), active alert counters, and user profile.
- **1-Click Judge & Demo Persona Switcher**: Built-in switcher allowing instant testing across all 5 user roles without re-logging:
  - `GROUP_SUSTAINABILITY`: **Amit Verma** (CSO — Corporate HQ)
  - `SITE_USER`: **Rahul Sharma** (Site Engineer — Project Alpha)
  - `ESG_OFFICER`: **Priya Nair** (ESG Lead — Reviewer & Approver)
  - `AUDITOR`: **Sarah Jenkins** (Statutory ESG Assessor)
  - `ADMIN`: **Kiran Reddy** (System Administrator)
- **Hierarchical Breadcrumbs**: Persistent `MEIL ESG / Subsidiary / Business Unit / Project` path.

### 3. Executive ESG Dashboard (`/dashboard`)
- **Top KPI Strip**: Flat rectangular blocks for *Total Projects (12)*, *Submitted (10)*, *Pending Review (2)*, *Overall Readiness (89%)*, and *BRSR Core (91%)*.
- **3 ESG Pillar Summary Cards**:
  - **Environmental (P6)**: Scope 1+2 GHG ($125,430\text{ tCO}_2\text{e}$ ↓ 5.8%), Energy ($1,845,200\text{ GJ}$), Water ($412,800\text{ KL}$), $74.2\%$ Waste Recycled, $38.4\%$ Renewable Energy.
  - **Social (P3 & P5)**: $14,280$ Total workforce, $0$ Fatalities, $96.5\%$ Medical insurance cover, $24.6\text{ hrs/emp}$ safety training.
  - **Governance (P1, P8, P9)**: $94\%$ Compliance, $98.2\%$ Anti-corruption ethics trained, $27.5\%$ MSME Procurement spend, $0$ Data breaches.
- **Decarbonization Trajectory Line Chart**: Multi-year interactive visualization comparing GHG and Water consumption across financial years.
- **Subsidiary Hierarchy Performance & Action Required Queue**: Real-time alerts for dewatering anomalies and missing documentation.

### 4. Dynamic ESG Data Collection & Validation Engine (`/data-entry`)
- **Metadata-Driven Indicator System**: Renders 22 pre-seeded BRSR indicators covering Section A (General Disclosures), Section B (Management & Process), and Section C (Principles 1–9).
- **Inline Validation & Quality Summary**: Real-time checks for range bounds, logical consistency, and mandatory evidence requirements with status pills (`✓ Valid`, `! Review required`, `× Blocking error`).
- **Evidence Dropzone Modal**: Attach PDF fuel receipts, meter photos, and weighbridge slips with SHA-256 integrity hashes.
- **Workflow State Transitions**: `DRAFT` $\rightarrow$ `SUBMITTED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `APPROVED` $\rightarrow$ `REJECTED`.

### 5. Review & Approval Center (`/review`)
- ESG Officer verification table with YoY trend comparison, inspection drawer, proof preview, and `[APPROVE]` / `[REQUEST CORRECTION]` actions with mandatory audit comments.

### 6. BRSR Readiness Center (`/brsr-readiness`)
- Large statutory score ($89\%$), section breakdowns (Section A: $96\%$, Section B: $88\%$, Section C: $82\%$, BRSR Core: $91\%$), and an actionable *Areas Requiring Attention* checklist.

### 7. Flagship Traceability Explorer (`/traceability`)
- End-to-end source-to-report decomposition path:
  $$\text{Group Scope 1 (125,430 tCO}_2\text{e)} \longrightarrow \text{Subsidiary (72,400)} \longrightarrow \text{BU (41,200)} \longrightarrow \text{Project Alpha (18,500)}$$
- Deep inspection of site engineer digital signatures, telematics logs, calibrated meter photos, and immutable audit timestamps.

### 8. Immutable Audit Trail (`/audit-trail`) & Reports Center (`/reports`)
- Chronological timeline ledger recording all lifecycle events (`CREATE`, `UPDATE`, `TRANSITION`) with before/after state diff inspector.
- Export and preview hub for **BRSR Annexure I**, **BRSR Core Assessment Pack**, and **Excel Workbooks**.

---

## 🚀 Work Needed / Next Implementation Steps

For teammates continuing development, here is the clear roadmap:

### Phase 2: FastAPI Backend & PostgreSQL Persistence (`backend/`)
- [ ] Initialize FastAPI application in `backend/app/main.py`.
- [ ] Implement SQLAlchemy 2.0 async models matching the SQL schema:
  - `organisations` (self-referencing tree)
  - `users` & `roles` (JWT auth & RBAC middleware)
  - `reporting_periods`
  - `indicators` & `indicator_versions`
  - `data_entries`, `evidence`, `approval_actions`, `audit_logs`
- [ ] Set up Alembic migrations (`backend/alembic/`).
- [ ] Connect Frontend Axios API client to FastAPI REST endpoints (`/api/v1/*`).

### Phase 3: OCR & AI-Assisted Evidence Extractor
- [ ] Implement bill parsing endpoint (`/api/v1/evidence/ai-extract`) to read utility electricity bills and diesel receipts.
- [ ] Automatically extract consumption values, units, and confidence scores ($96\%+$).
- [ ] Implement human-in-the-loop confirmation modal (never auto-finalize unverified AI data).

### Phase 4: Dynamic PDF Generator for Statutory Filing
- [ ] Build Python ReportLab / WeasyPrint service in `backend/app/services/report_generator.py`.
- [ ] Generate SEBI-compliant BRSR Annexure I PDF reports with official MEIL cover layout, Section A/B/C tables, and digital signature stamps.

### Phase 5: Containerization & Deployment
- [ ] Finalize root `docker-compose.yml` defining:
  - `postgres` (PostgreSQL 16 with pre-seeded demo data)
  - `backend` (FastAPI + Uvicorn)
  - `frontend` (Nginx serving Vite production build)

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v7, Recharts, Lucide Icons.
- **Backend (Target)**: Python 3.13+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic.
- **Database (Target)**: PostgreSQL 16 with JSONB support for flexible indicator schemas.

---

## ⚡ Quickstart Guide

### Prerequisites
- **Node.js**: v18+ (Tested on v22.17.0)
- **npm**: v9+ (Tested on 10.9.2)

### Running the Frontend
```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:5173
```

### Verifying Production Build
```bash
cd frontend
npm run build
```

---

## 🧪 Judge Demo Walkthrough Story

1. Open `http://localhost:5173` and click **"ESG / BRSR Portal"** or navigate directly to `/login`.
2. Use the 1-click login preset for **Site Engineer (Rahul Sharma)**.
3. Open **Data Entry** (`/data-entry`), input or adjust Scope 1 GHG value (`18,500 tCO2e`), attach proof (`diesel_generator_consumption_log_q3.pdf`), and click **Submit**.
4. Use the topbar role switcher to switch to **ESG Officer (Priya Nair)**.
5. Open **Review & Approval** (`/review`), review the submitted metric against prior year trends, and click **Approve & Rollup**.
6. Switch to **Group Sustainability (Amit Verma)** and open **Executive Dashboard** (`/dashboard`) to verify the rolled-up group totals.
7. Open **Traceability Explorer** (`/traceability`) and click **Project Alpha** to show the complete trace back to the site fuel receipt and audit log.
8. Open **Reports** (`/reports`) and click **Preview / Download** for the official BRSR filing pack.

---

*Megha Engineering & Infrastructures Limited (MEIL) — Corporate ESG Reporting & BRSR Assurance Portal*
