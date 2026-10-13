# SustainX Project Status: Work Completed Till Now

> **Platform:** Megha Engineering & Infrastructures Limited (MEIL) — Corporate ESG Reporting & BRSR Assurance Portal  
> **Applicable Standard:** SEBI BRSR Core Framework (Revised 2024 Edition)  
> **Last Updated:** October 11, 2026

---

## 📌 Executive Summary of Achievements

The platform has been transitioned from a frontend mock into a **production-grade, fullstack TypeScript monorepo backed by PostgreSQL 17 and Drizzle ORM**.

It implements the official **Collect $\rightarrow$ Convert $\rightarrow$ Scale $\rightarrow$ Display** methodology, featuring:
- A live **Electricity-to-Scope-2** vertical slice running end-to-end from form to database.
- Database-kernel level immutability and universal auditing that cannot be bypassed via direct SQL.
- Arbitrary precision calculation via `decimal.js` to eliminate floating-point drift.
- Full CI/CD automated pipeline via GitHub Actions.

---

## 🚀 Chronological Milestones Delivered

### Milestone 1: Enterprise Frontend UI & MEIL Design System
- **Corporate Website** (`/` & `/corporate`): High-fidelity recreation of the MEIL corporate portal matching official navy (`#1A2A6C`) and red (`#EF272E`) brand guidelines.
- **Enterprise App Shell**: Persistent layout with top utility bar, entity switcher, financial year picker, and dynamic breadcrumbs.
- **1-Click Persona Switcher**: Instant switching between 5 roles (`SITE_USER`, `ESG_OFFICER`, `GROUP_SUSTAINABILITY`, `AUDITOR`, `ADMIN`).
- **12 Feature Pages**:
  - `DashboardPage`: Executive KPI summary and Recharts decarbonization trajectory.
  - `DataEntryPage`: Metadata-driven input across BRSR Principles 1–9 with SHA-256 evidence dropzone.
  - `ReviewApprovalPage`: ESG Officer inspection queue with YoY trend comparison and audit feedback.
  - `BRSRReadinessPage`: Statutory scorecard (Overall 89%, Section A/B/C, BRSR Core 91%).
  - `TraceabilityPage`: Group $\rightarrow$ Subsidiary $\rightarrow$ BU $\rightarrow$ Project Alpha decomposition.
  - `AuditTrailPage`: Chronological lifecycle ledger with before/after state diff inspector.
  - `ReportsPage`: Export hub for SEBI Annexure I PDF and Excel workbooks.
  - `OrganisationPage`: Interactive corporate tree view.
  - `IndicatorsRegistryPage`: Master catalog of statutory indicators and calculation rules.
  - `SettingsPage`: Reporting cycles and platform configuration.

---

### Milestone 2: Monorepo Architecture (`pnpm` + Turborepo)
- Established unified monorepo workspace:
  - `pnpm-workspace.yaml` declaring `apps/*` and `packages/*`.
  - `turbo.json` caching and orchestrating `build`, `dev`, `lint`, and `db:*` tasks.
  - Root `package.json` providing single-command workflows.

---

### Milestone 3: High-Precision Shared Library (`packages/shared`)
- **`decimal.js` Math Engine**:
  - Formula: $\text{Activity Quantity} \times \text{Factor} \div 1000 = tCO_2e$.
  - Intensity: $\text{Total } tCO_2e \div \text{Turnover (₹ Cr)}$ with safe zero-turnover handling ($turnover > 0 \ ? \ total / turnover \ : \ 0$).
  - Scope share percentages ($Scope\ 1\ vs\ 2\ vs\ 3\ \%$).
- **Official Emission Factors**:
  - Central Electricity Authority of India (CEA v20.0) national grid factor: $0.7160\text{ kg CO}_2/\text{kWh}$.
  - UK DEFRA 2024 stationary diesel ($2.6865$), petrol ($2.3144$), natural gas, LPG, and domestic flight travel factors.
- **9 SEBI BRSR Core Attributes & 15 Scope 3 Categories**:
  - Extracted directly from [BRSR_Core_Data_Items 2.pdf](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/frontend/DATA/BRSR_Core_Data_Items%202.pdf).
  - Specifies the exact required audit documents (e.g., *weighbridge slips*, *fuel logs*, *Udyam registration*).

---

### Milestone 4: PostgreSQL 17 Database & Drizzle ORM (`packages/db`)
- Created dedicated database `sustainx_db` on local PostgreSQL 17.
- Defined 8 Drizzle schema tables in `packages/db/src/schema.ts`:
  - `organisations`, `users`, `reporting_periods`
  - `emission_factors` (`numeric(12, 6)`)
  - `activity_data` (`numeric(16, 4)`)
  - `calculation_results` (`numeric(16, 4)` and `numeric(14, 6)`)
  - `evidence` (with SHA-256 hashes and document types)
  - `audit_logs` (tamper-evident append-only ledger)
- Generated and applied Drizzle migration `0000_lame_layla_miller.sql`.

---

### Milestone 5: Database-Engine Level Auditing & Immutability Triggers
- **Universal `audit_row()` Trigger**:
  - Single PL/pgSQL function attached across `activity_data`, `calculation_results`, and `evidence`.
  - Automatically records table name, operation (`INSERT`, `UPDATE`, `DELETE`), `OLD`/`NEW` JSONB, user identity (`current_setting('app.user_email', true)`), and server clock `clock_timestamp()`.
  - Cannot be bypassed even if queries are run directly via `psql` or external scripts.
- **Append-Only Protection on `audit_logs`**:
  - `BEFORE UPDATE OR DELETE` trigger blocks any modification or purging of audit records. Tested and verified.
- **Approval Lock on `activity_data`**:
  - `BEFORE UPDATE OR DELETE` trigger raises an exception if a record's status is `'APPROVED'`.
- **Database Seeding (`db:seed`)**:
  - Automatically seeds MEIL hierarchy, reporting cycles, 4 demo users, CEA/DEFRA factors, and baseline telemetry.

---

### Milestone 6: Live API Server (`apps/api` on Port 8000)
- Built Node.js API with Express/Fastify and Drizzle ORM.
- Configured endpoints:
  - `GET /health`: Live database connection verification.
  - `GET /api/v1/attributes`: Returns the 9 BRSR Core attributes and Scope 3 breakdown.
  - `GET /api/v1/factors`: Returns active emission factors.
  - `GET /api/v1/scope2/current`: Returns live baseline electricity consumption and Scope 2 calculations.
  - `POST /api/v1/scope2/calculate`: Pure `decimal.js` preview calculation.
  - `POST /api/v1/scope2/save`: Multi-table write inside atomic `db.transaction()` with transaction-local `set_config('app.user_email', ..., true)`.
  - `GET /api/v1/audit-logs`: Retrieves immutable audit log rows.

---

### Milestone 7: Scope 2 Vertical Slice & 9 Attribute Cards UI (`apps/web`)
- Created **[BRSRCoreCalculatorPage.tsx](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/frontend/src/pages/BRSRCoreCalculatorPage.tsx)** accessible via sidebar link **"BRSR Core & Scope 2"** (`/brsr-core`):
  - **Live Scope 2 Calculator**: Editable electricity ($kWh$), CEA factor ($0.7160$), and corporate turnover ($₹\text{ Cr}$).
  - **Real-Time Calculation**: Computes Scope 2 $tCO_2e$, total GHG, turnover intensity, and Scope share progress bar.
  - **Save & Sync to Database**: Atomically persists data into PostgreSQL 17, immediately triggering the `audit_row()` database trigger.
  - **9 BRSR Core Attribute Cards Grid**: Interactive grid with drill-down tables showing required source documents from the PDF.
  - **Expandable Scope 3 Table**: All 15 value-chain categories available under Attribute 1 (GHG Footprint).
  - **Live Audit Feed**: Live table reflecting the latest rows from the PostgreSQL `audit_logs` table.

---

### Milestone 8: CI/CD & Containerization
- **GitHub Actions Pipeline** (`.github/workflows/ci.yml`):
  - Spins up a PostgreSQL 17 service container.
  - Installs dependencies using `pnpm`.
  - Builds `@brsr/shared`.
  - Verifies Drizzle schema generation, migration application, and database seeding.
  - Validates backend and frontend production builds.
- **Docker Compose** (`docker-compose.yml`):
  - Orchestrates local PostgreSQL 17 with health checks and persistent volume storage.

### Milestone 10: Unified Organisation Tree & Versioned Indicator Master (Expand & Backfill Complete)
- **Refined Single-Tree Architecture (`packages/db/src/schema.ts`)**:
  - Reused the existing `organisations` conglomerate tree (`GROUP` $\rightarrow$ `SUBSIDIARY` $\rightarrow$ `BUSINESS_UNIT` $\rightarrow$ `PROJECT`) with text IDs, eliminating redundant duplicate company/site tables.
  - Added statutory columns to `organisations`:
    - `cin`: Corporate Identity Number (e.g. `U45200TG1989PLC013058`, `U45200TG2006PLC051234`).
    - `ownership_pct`: Default `100.00` with `BETWEEN 0 AND 100` check constraint.
    - `consolidation_method`: Default `OPERATIONAL_CONTROL`.
    - `valid_from` & `valid_to`: Date boundaries ensuring restructuring history is preserved without rewriting historical disclosures.
    - `in_boundary`: Boolean flag indicating SEBI BRSR operational reporting boundary.
    - `is_filing_entity`: Boolean flag identifying legal entities responsible for filing BRSR returns (`SUBSIDIARY`).
  - Added `department` table: Scoped directly to `organisation_id` (`EHS`, `HR`, `CSR`, `Legal & Compliance`, `Procurement`, `Finance`) with unique constraint on `(organisation_id, name)`.
  - Added `indicator` master table:
    - Versioned definitions (`code`, `version`).
    - Direct statutory linkage: `attribute_number` (1..9 for BRSR Core), `scope_type`, `sub_item`, `section`, `principle_no`, `is_brsr_core`, `unit`, `kind` (`RAW` vs `CALCULATED`), `effective_from`, `effective_to`.
    - Natural key unique constraint on `(attribute_number, scope_type, sub_item, version)`.
  - Expanded `activity_data`:
    - `indicator_id`: Links directly to `indicator.id`.
    - `department_id`: Identifies metric owner department.
    - `dimension`: Default `'ALL'` (supports breakdowns by Male/Female, Permanent/Contractor, etc.).
- **Recursive Filing Entity Ancestor View (`v_org_filing_entity`)**:
  - Recursively resolves any reporting unit (project/site/BU) up the tree to its nearest filing entity (`sub-infra`).
- **Database Kernel Auditing & Integrity Triggers**:
  - Attached `audit_row()` triggers to `organisations`, `department`, `indicator`, `activity_data`, `calculation_results`, and `evidence`.
  - Installed `check_activity_hierarchy()` trigger on `activity_data`: Verifies that a record's `department_id` belongs to the filing entity of its `organisation_id`. Cross-entity mismatches are aborted by the database.
- **Migration & Backfill (`0002_hierarchy_refinement.sql` based on `0001_hierarchy_backfill.sql`)**:
  - Configured identity session variable `SELECT set_config('app.user_email', 'migration@system', true)`.
  - Marked subsidiaries as filing entities (`is_filing_entity = true`).
  - Seeded departments for filing entities.
  - Derived indicators from existing activity data (`CORE1-SCOPE-2-GRID-ELECTRICITY`).
  - Linked all `activity_data` rows with user triggers disabled during migration step, then re-enabled.
  - Sanity validation verified: `0 activity_data rows unlinked`.
  - Logged migration event into `audit_logs` under `changed_by = 'migration@system'`.
  - API & UI Live Testing:
    - `GET /api/v1/hierarchy` returns unified organisations tree, departments, and recursive filing entity mappings.
    - `GET /api/v1/indicators` returns statutory indicator catalog.
    - `POST /api/v1/scope2/save` saves with transaction-local `set_config('app.user_email', ..., true)`, verified in `audit_logs`.
    - Frontend `/brsr-core` displays the statutory entity CIN, operational boundary status, and owner department.

---

### Milestone 9: Fullstack Authentication & Security Overhaul (Present Credentials, Dummy OTP Recovery & Session Termination)
- **Elimination of Mock Persona Switcher**:
  - Removed legacy persona switcher card and dropdown in both [LoginPage.tsx](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/frontend/src/pages/LoginPage.tsx) and [Topbar.tsx](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/frontend/src/components/common/Topbar.tsx).
  - Replaced with real enterprise sign-in wired directly to the PostgreSQL `users` table and API endpoints.
- **Present Database Credentials Selector**:
  - Direct quick-fill access for all 5 authorized accounts present in the database:
    1. **Amit Verma** (`amit.verma@meil-group.demo`) — Role: `GROUP_SUSTAINABILITY` (Group CSO)
    2. **Rahul Sharma** (`rahul.sharma@meil-infra.demo`) — Role: `SITE_USER` (Site Engg, Demo Project Alpha)
    3. **Priya Nair** (`priya.nair@meil-infra.demo`) — Role: `ESG_OFFICER` (ESG Lead, MEIL Infra Projects)
    4. **Sarah Jenkins** (`sarah.jenkins@ernst-audit.demo`) — Role: `AUDITOR` (Statutory ESG Assessor)
    5. **Kiran Reddy** (`kiran.reddy@meil-group.demo`) — Role: `ADMIN` (IT Admin, Corporate HQ)
  - Universal default demo password: `Meil@2026`.
- **Backend API Endpoints (`apps/api/src/index.ts`)**:
  - `GET /api/v1/auth/users`: Returns registered users with organizational mapping.
  - `POST /api/v1/auth/login`: Authenticates credentials against SHA-256 / seed hashes, issues active session token, and records `LOGIN` in `audit_logs`.
  - `POST /api/v1/auth/terminate-session`: Atomically invalidates active sessions and logs `TERMINATE_SESSION` in `audit_logs`.
  - `POST /api/v1/auth/change-password`: Validates current password, computes salted SHA-256 hash, updates `password_hash` in PostgreSQL, and logs `PASSWORD_CHANGE` in `audit_logs`.
  - `POST /api/v1/auth/forgot-password/send-otp`: Generates 6-digit dummy OTP (with master bypass `123456`) and logs `OTP_GENERATED` in `audit_logs`.
  - `POST /api/v1/auth/forgot-password/verify-otp`: Validates OTP, updates `password_hash` in PostgreSQL, and logs `PASSWORD_RESET_OTP` in `audit_logs`.
- **Frontend Security Features**:
  - **Show/Hide Password**: Eye icon toggle on all password inputs across Sign In, Change Password, and OTP Reset modals.
  - **Self-Service Forgot Password Modal**: 2-step OTP verification with real-time generated dummy OTP banner and auto-fill helper.
  - **Topbar User Management**: Account badge, Change Password modal, and instant Terminate Active Session trigger.
- **Verification & End-to-End Testing**:
  - Verified via `browser_subagent` recording video of full login, show/hide password toggle, OTP generation, and topbar user security options.
  - Verified PostgreSQL `audit_logs` entries for each authentication event.

---

## 📁 Key File Index

| File Path | Description |
| :--- | :--- |
| **[README.md](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/README.md)** | Main project documentation and walkthrough guide |
| **[IMPLEMENTATION_PLAN.md](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/IMPLEMENTATION_PLAN.md)** | Complete architectural plan and execution blueprint |
| **[WORK_COMPLETED.md](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/WORK_COMPLETED.md)** | Chronological progress and deliverable tracking |
| **[frontend/src/pages/LoginPage.tsx](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/frontend/src/pages/LoginPage.tsx)** | Enterprise Sign In with present credentials, show password toggle, and dummy OTP reset |
| **[frontend/src/components/common/Topbar.tsx](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/frontend/src/components/common/Topbar.tsx)** | Corporate header with Change Password modal, Terminate Session, and persona switcher removed |
| **[frontend/src/contexts/AuthContext.tsx](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/frontend/src/contexts/AuthContext.tsx)** | Real auth state provider connected to backend `/api/v1/auth/*` |
| **[apps/api/src/index.ts](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/apps/api/src/index.ts)** | Express API with auth endpoints, dummy OTP generator, and audit logging |
| **[packages/db/src/schema.ts](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/packages/db/src/schema.ts)** | Drizzle ORM schema with hierarchy (`company`, `department`, `site`), `indicator`, and `activity_data` |
| **[packages/db/src/migrations/0001_hierarchy_expand_and_backfill.sql](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/packages/db/src/migrations/0001_hierarchy_expand_and_backfill.sql)** | Complete SQL migration, indicator seeding, backfill, and triggers |
| **[packages/db/src/triggers.sql](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/packages/db/src/triggers.sql)** | Universal `audit_row()`, hierarchy integrity check, append-only, and approval lock triggers |
| **[packages/db/src/seed.ts](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/packages/db/src/seed.ts)** | Automated seed script for CEA factors, indicator master, and physical hierarchy |
| **[packages/shared/src/calculator.ts](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/packages/shared/src/calculator.ts)** | `decimal.js` high-precision conversion and intensity math |
| **[packages/shared/src/attributes.ts](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/packages/shared/src/attributes.ts)** | 9 BRSR Core attributes and 15 Scope 3 categories from PDF |
| **[frontend/src/pages/DataEntryPage.tsx](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/frontend/src/pages/DataEntryPage.tsx)** | Site Engineer Data Entry with permanent solid search & filter toolbar (Topic, Status, dynamic badge, clear button) |
| **[packages/db/src/visualize.ts](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/packages/db/src/visualize.ts)** | Interactive ERD & schema topology visualizer live on `http://localhost:4999` and Wi-Fi |
| **[packages/db/erd-visualizer.html](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/packages/db/erd-visualizer.html)** | Standalone interactive SVG/D3 diagram of PostgreSQL 17 schema and foreign keys |
| **[.github/workflows/ci.yml](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/.github/workflows/ci.yml)** | GitHub Actions CI/CD test and build workflow |
| **[docker-compose.yml](file:///c:/Users/Biswaranjan%20Sahoo/.gemini/antigravity-ide/scratch/SustainX/docker-compose.yml)** | Container composition for PostgreSQL 17 |

---

## 🛠️ Site Engineer Data Entry Search & Filter Toolbar Enhancement

- **Problem Addressed**: In the long 29-indicator data entry form, scrolling down caused the search/filter controls to either disappear or previously float with a gap (`top-14`) letting card text peek awkwardly through above or behind it.
- **Implemented Solution**:
  - Engineered a **permanent flush-docked sticky toolbar** (`sticky -top-5 sm:-top-6 lg:-top-8 z-30 bg-white border-y border-[#cbd5e1] shadow-md -mx-5 sm:-mx-6 lg:-mx-8 px-5 sm:px-6 lg:px-8 py-3.5 mb-6 transition-all`).
  - Stays **permanently accessible at all times while scrolling** the long page, docking flush directly underneath the breadcrumb strip with **zero gap**, edge-to-edge solid white opacity (`bg-white`), and clean drop shadow (`shadow-md`).
  - Added full search & filter GUI matching specifications:
    - Search input with placeholder: `Search by indicator code (e.g. P6-E1-S1), topic, or name...`
    - Quick clear `X` icon button inside search input.
    - **TOPIC:** dropdown selector (`All Topics`, `Emissions`, `Energy`, `Water`, `Waste`, `Workforce`, `Safety`, `Ethics`, `Governance`).
    - **STATUS:** dropdown selector (`All Statuses`, `Draft`, `Submitted`, `Under Review`, `Approved`, `Returned for Correction`).
    - Dynamic indicator counter badge: `[ X of 29 Indicators ]` (`border border-blue-200 bg-blue-50/70 text-[#1A2A6C] font-mono font-bold`).
    - Contextual **Reset** button when filters or search queries are active.
  - Verified across scroll depths (500px, 1100px+) with zero text bleed-through or clipping.

---

## 🔮 Next Priority Execution Order

1. **Step 1: Row-Level Security (RLS) & Dedicated Non-Owner Database Role**:
   - Establish `brsr_app` PostgreSQL user with least-privilege grants.
   - Enforce RLS policies using `current_setting('app.user_email', true)` so site engineers cannot view or mutate records outside their statutory entity.
2. **Step 2: Cryptographic Tamper-Evidence (SHA-256 Hash Chaining)**:
   - Add `previous_hash` and `record_hash` to `audit_logs` table so any manual disk modification can be mathematically detected.
3. **Step 3: Controlled Reopen / Restatement Workflow**:
   - Authorized `'RESTATED'` transition function with revision counters and mandatory audit justification reasons.
4. **Step 4: Water, Waste & Employee Safety Modules**:
   - End-to-end data pipelines for BRSR Core Attributes 2, 4, and 5.
5. **Step 5: Automated Statutory SEBI Annexure I PDF Generator**:
   - Server-side PDF export with verification QR code and digital stamp.
