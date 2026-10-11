import React, { useState } from 'react';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Copy, 
  Check, 
  Eye, 
  Layers, 
  Compass, 
  FileCheck2,
  ShieldCheck,
  TrendingDown,
  Building2,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface Slide {
  id: number;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  highlightPill: string;
  layoutType: 'hero' | 'split-card' | 'grid-3' | 'grid-4' | 'workflow' | 'kpi-metric' | 'ledger' | 'conclusion';
  keyPoints: { label: string; desc: string; stat?: string }[];
  accentColor?: string;
  quote?: string;
}

const SLIDES_DATA: Slide[] = [
  {
    id: 1,
    number: '01',
    category: 'EXECUTIVE COVER',
    title: 'MEIL ESG / BRSR REPORTING PORTAL',
    subtitle: 'Standardized Data Collection, Multi-Tier Rollup & SEBI BRSR Core Reasonable Assurance for MEIL Group & 250+ Infrastructure Projects',
    highlightPill: 'FY 2024–25 / FY 2025–26 COMPLIANCE',
    layoutType: 'hero',
    keyPoints: [
      { label: 'Client Scope', desc: 'Megha Engineering & Infrastructures Ltd (MEIL Group)' },
      { label: 'Network Scale', desc: '6 Key Subsidiaries, 14 Verticals, 250+ Construction & Plant Sites' },
      { label: 'Mandate', desc: 'SEBI Circular CIR/2023/122 BRSR Core Mandatory Assurance' }
    ],
    quote: '"Engineering Sustainable Infrastructure with Verifiable Corporate Excellence"'
  },
  {
    id: 2,
    number: '02',
    category: 'AGENDA & ROADMAP',
    title: 'Executive Presentation Structure',
    subtitle: 'Comprehensive walkthrough of architecture, methodology, validation engine, and reporting artifacts',
    highlightPill: 'TABLE OF CONTENTS',
    layoutType: 'grid-4',
    keyPoints: [
      { label: '01. Architectural Foundation', desc: 'MEIL multi-tier hierarchy (Group → Subsidiary → BU → Project) and decentralized data silo challenges.' },
      { label: '02. Field Collection & Verification', desc: 'Standardized digital entry, automated unit conversions, evidence locker, and 2-tier approval workflows.' },
      { label: '03. BRSR Core & SEBI Principles', desc: 'Coverage across Principles P1 to P9, reasonable assurance tracking, and GHG Scope 1/2/3 accounting.' },
      { label: '04. Auditability & Disclosures', desc: 'Immutable SHA-256 audit ledger, 1-click drill-down traceability, and regulatory export engines.' }
    ]
  },
  {
    id: 3,
    number: '03',
    category: 'THE CHALLENGE',
    title: 'Solving ESG Fragmentation Across 250+ Sites',
    subtitle: 'Why traditional manual spreadsheets and ERP silos fail SEBI BRSR Core requirements',
    highlightPill: 'PROBLEM STATEMENT',
    layoutType: 'split-card',
    keyPoints: [
      { label: 'Disparate Excel Silos', desc: 'Site engineers log diesel, water, and labor safety on disjointed local spreadsheets without validation.' },
      { label: 'Lack of Forensic Proof Chain', desc: 'External assurance partners (Big 4) struggle to reconcile Group GHG figures back to remote weighbridge slips.' },
      { label: 'Stringent SEBI Deadlines', desc: 'SEBI mandate requires reasonable assurance for top listed companies and key value-chain subsidiaries.' }
    ],
    quote: 'MEIL executes mega-infrastructure spanning dams, solar farms, highways, and CGD networks across 18 states.'
  },
  {
    id: 4,
    number: '04',
    category: 'THE PLATFORM',
    title: 'SustainX — The MEIL Enterprise ESG Engine',
    subtitle: 'A purpose-built, engineering-grade portal combining MEIL corporate DNA with enterprise ESG intelligence',
    highlightPill: 'SOLUTION OVERVIEW',
    layoutType: 'grid-3',
    keyPoints: [
      { label: 'Digital Field Collection', desc: 'Unit-validated input forms with mandatory geotagged evidence attachment for every resource stream.' },
      { label: 'Hierarchical Rollup Engine', desc: 'Automated bottom-up mathematical aggregation converting litres, kWh, and hours into Group BRSR KPIs.' },
      { label: 'Immutable Audit Ledger', desc: 'Cryptographically hashed change logs verifying every edit, maker approval, and auditor sign-off.' }
    ]
  },
  {
    id: 5,
    number: '05',
    category: 'ORGANISATIONAL STRUCTURE',
    title: '4-Tier Operational Rollup Hierarchy',
    subtitle: 'Reflecting the actual reporting hierarchy of Megha Engineering & Infrastructures Limited',
    highlightPill: 'GOVERNANCE MATRIX',
    layoutType: 'grid-4',
    keyPoints: [
      { label: 'Tier 1: MEIL Group Holding', desc: 'Consolidated Board ESG metrics, investor disclosures, and SEBI annual filing repository.' },
      { label: 'Tier 2: Key Subsidiaries', desc: 'MEIL Hydro, Megha Gas, Olectra Greentech, ICOMM Tele, Drillmec International.' },
      { label: 'Tier 3: Business Verticals', desc: 'Hydroelectric & Lift Irrigation, City Gas Distribution, Electric Mobility, Power Transmission.' },
      { label: 'Tier 4: Active Projects / Sites', desc: 'Polavaram Hydro, Zojila Tunnel, Hyderabad CGD, Mumbai EV Bus Depot (250+ Sites).' }
    ]
  },
  {
    id: 6,
    number: '06',
    category: 'ESG SCORECARD',
    title: 'Consolidated ESG Operational Performance',
    subtitle: 'Live Group-level baseline snapshot across Environment, Social, and Governance pillars',
    highlightPill: 'KEY ESG METRICS',
    layoutType: 'kpi-metric',
    keyPoints: [
      { label: 'Scope 1 & 2 GHG Emissions', desc: 'Grid electricity and heavy machinery diesel', stat: '142,500 tCO2e (-6.2%)' },
      { label: 'Water Recycled & Reused', desc: 'Hydro tunnel recycling & fabrication yards', stat: '4.82M kL (38.4%)' },
      { label: 'Workforce Health & Safety', desc: '48,250 workers covered; LTIFR benchmark', stat: '0.12 per M hrs' },
      { label: 'CSR Community Impact', desc: 'Education, rural healthcare, safe drinking water', stat: '₹84.6 Cr Invested' }
    ]
  },
  {
    id: 7,
    number: '07',
    category: 'REGULATORY COMPLIANCE',
    title: 'SEBI BRSR Core: 9-Principle Matrix',
    subtitle: 'Comprehensive readiness scorecard tracking National Guidelines for Responsible Business Conduct (NGRBC)',
    highlightPill: 'SEBI ANNEXURE I & CORE',
    layoutType: 'grid-3',
    keyPoints: [
      { label: 'P1: Integrity & Ethics', desc: 'Anti-corruption policy, code of conduct compliance, zero vigilance tolerance.', stat: '96% Complete' },
      { label: 'P2: Sustainable Products', desc: 'Solar, EV transit, and recycled aggregate utilization in roads.', stat: '91% Complete' },
      { label: 'P3: Employee Well-being', desc: 'Mandatory PPE, health camps, POSH compliance, living wage parity.', stat: '98% Complete' },
      { label: 'P4: Stakeholder Engagement', desc: 'Public hearings, landowner rehabilitation, grievance mechanisms.', stat: '94% Complete' },
      { label: 'P5: Human Rights', desc: 'Child labor prohibition, fair contractor audit, safety induction.', stat: '92% Complete' },
      { label: 'P6: Environmental Stewardship', desc: 'Scope 1/2/3 decarbonization, biodiversity preservation, ZLD yards.', stat: '97% Complete' },
      { label: 'P7: Responsible Advocacy', desc: 'Industry body representation, green hydrogen policy participation.', stat: '100% Complete' },
      { label: 'P8: Inclusive Growth', desc: 'Local community hiring (68% local labor), MSME vendor priority.', stat: '95% Complete' },
      { label: 'P9: Consumer Responsibility', desc: 'Client handover quality, project commissioning compliance.', stat: '99% Complete' }
    ]
  },
  {
    id: 8,
    number: '08',
    category: 'DATA PIPELINE',
    title: 'The 6-Step Enterprise Workflow',
    subtitle: 'Guiding ESG data smoothly from isolated construction sites to the Boardroom report',
    highlightPill: 'WORKFLOW ENGINE',
    layoutType: 'workflow',
    keyPoints: [
      { label: '01. Standardized Entry', desc: 'Field officer enters verified consumption into structured inputs with engineering units.' },
      { label: '02. Auto-Validation', desc: 'Engine verifies data within historical ±15% variance and checks mandatory unit consistency.' },
      { label: '03. Proof Attachment', desc: 'Uploads required weighbridge slips, utility bills, or calibration lab reports.' },
      { label: '04. Maker-Checker Review', desc: 'Project Director inspects submissions and signs off or marks re-examination.' },
      { label: '05. Hierarchical Rollup', desc: 'Automated conversion factors (DEFRA/CEA) roll site metrics up into Group totals.' },
      { label: '06. BRSR Export', desc: 'Generates ready-to-file SEBI Annexure I PDFs and statutory audit packs.' }
    ]
  },
  {
    id: 9,
    number: '09',
    category: 'SITE-LEVEL EXPERIENCE',
    title: 'Intuitive Field-Level Data Collection',
    subtitle: 'Minimizing site engineer overhead while ensuring 100% data integrity',
    highlightPill: 'COLLECTION INTERFACE',
    layoutType: 'split-card',
    keyPoints: [
      { label: 'Role-Specific Access', desc: 'Field users see only indicators relevant to their specific infrastructure package.' },
      { label: 'Real-Time Anomaly Guards', desc: 'Immediate visual warning when fuel or water inputs deviate significantly from project norms.' },
      { label: 'Mandatory File Repository', desc: 'Submissions are blocked without attached PDF or image evidence.' }
    ],
    quote: 'Example: Polavaram Package 4 entered 84,200 Litres HSD fuel with weighbridge bill #WB-8821 attached.'
  },
  {
    id: 10,
    number: '10',
    category: 'MAKER-CHECKER GOVERNANCE',
    title: 'Two-Tier Verification & Approval Queue',
    subtitle: 'Zero data reaches Group consolidated metrics without authenticated sign-off',
    highlightPill: 'APPROVAL WORKFLOW',
    layoutType: 'grid-3',
    keyPoints: [
      { label: 'Stage 1: Site Project Manager', desc: 'Validates site operational context against billing records and site logbooks.' },
      { label: 'Stage 2: BU ESG Officer', desc: 'Reviews cross-project metrics, checks indicator completeness, and performs reasonableness tests.' },
      { label: 'Audit Rejection Tracking', desc: 'Rejected entries trigger mandatory comments and rework notifications directly to the field officer.' }
    ]
  },
  {
    id: 11,
    number: '11',
    category: 'FORENSIC TRACEABILITY',
    title: '1-Click Source Traceability Explorer',
    subtitle: 'Trace any Group-level metric back to the specific invoice and weighbridge ticket',
    highlightPill: 'DRILL-DOWN ENGINE',
    layoutType: 'workflow',
    keyPoints: [
      { label: 'MEIL Group Total', desc: 'Total Scope 1 GHG: 112,400 tCO2e across all operations' },
      { label: 'Subsidiary Level', desc: 'MEIL Hydro Division: 34,200 tCO2e' },
      { label: 'Business Unit Level', desc: 'Polavaram Hydro Project Package: 18,100 tCO2e' },
      { label: 'Original Evidence File', desc: 'Invoice #IOCL-2024-89912.pdf with digital weighbridge slip' }
    ]
  },
  {
    id: 12,
    number: '12',
    category: 'SECURITY & GOVERNANCE',
    title: 'Immutable Audit Trail & Regulatory Assurance',
    subtitle: 'Full forensic logging aligned with SEBI circular requirements for Reasonable Assurance',
    highlightPill: 'AUDIT LEDGER',
    layoutType: 'ledger',
    keyPoints: [
      { label: 'Cryptographic Hashing', desc: 'Each record state is sealed with SHA-256 signatures to prevent tampering.' },
      { label: 'Granular History', desc: 'Captures who changed what, the exact timestamp, previous value, new value, and justification.' },
      { label: 'Auditor Read-Only Access', desc: 'Designated auditor profile for Big 4 assurance teams with direct sampling tools.' }
    ]
  },
  {
    id: 13,
    number: '13',
    category: 'DECARBONIZATION ROADMAP',
    title: 'Scope 1, Scope 2 & Renewable Energy Strategy',
    subtitle: 'Aggressive transition from auxiliary diesel generators to renewable solar and grid power',
    highlightPill: 'ENVIRONMENTAL METRICS',
    layoutType: 'split-card',
    keyPoints: [
      { label: 'Electrification of Plant', desc: 'Replacing diesel pumps with high-efficiency electric motors across canal projects.' },
      { label: 'Captive Solar Installations', desc: 'Over 42.8% of auxiliary base camp power sourced from rooftop and containerized solar.' },
      { label: 'Fleet Modernization', desc: 'Procurement of Olectra electric service vans and hybrid concrete mixer trucks.' }
    ]
  },
  {
    id: 14,
    number: '14',
    category: 'WATER & CIRCULAR ECONOMY',
    title: 'Water Stewardship & Recycled Materials',
    subtitle: 'Zero liquid discharge at manufacturing yards and secondary aggregate reuse',
    highlightPill: 'CIRCULAR INFRASTRUCTURE',
    layoutType: 'grid-3',
    keyPoints: [
      { label: '38.4% Water Recycled', desc: 'Advanced sedimentation tanks recycle dewatering flows back into dust suppression and curing.' },
      { label: 'Fly-Ash Concrete Blends', desc: '22% cement replacement using thermal power fly-ash and GGBS blast furnace slag.' },
      { label: 'Hazardous Waste Safe Disposal', desc: '100% used engine oils and filters directed to authorized CPCB re-refiners.' }
    ]
  },
  {
    id: 15,
    number: '15',
    category: 'SOCIAL RESPONSIBILITY',
    title: 'Workforce Safety & Inclusive Communities',
    subtitle: 'Protecting 48,000+ workers and fostering sustainable local community development',
    highlightPill: 'SOCIAL PILLAR',
    layoutType: 'grid-3',
    keyPoints: [
      { label: 'Zero Harm Objective', desc: 'LTIFR of 0.12 with over 18 million continuous safe man-hours logged.' },
      { label: 'Contractor Parity', desc: 'Equal access to on-site medical clinics, clean RO drinking water, and air-cooled shelters.' },
      { label: '₹84.6 Cr CSR Impact', desc: 'Drinking water initiatives, skill academies, and mobile health clinics across rural corridors.' }
    ]
  },
  {
    id: 16,
    number: '16',
    category: 'OUTPUT ARTIFACTS',
    title: 'Official BRSR Disclosures & Reporting Engine',
    subtitle: 'Automated generation of SEBI-compliant reports in minutes rather than months',
    highlightPill: 'REGULATORY DELIVERABLES',
    layoutType: 'grid-3',
    keyPoints: [
      { label: 'SEBI Annexure I Document', desc: 'Complete Section A, B, and C standard format compliant with SEBI BRSR guidelines.' },
      { label: 'BRSR Core Verification Pack', desc: 'Comprehensive package containing indexed evidence attachments for statutory auditors.' },
      { label: 'Board ESG Presentation', desc: 'Executive visual summary highlighting annual targets, variances, and peer comparisons.' }
    ]
  },
  {
    id: 17,
    number: '17',
    category: 'TECHNICAL ARCHITECTURE',
    title: 'Enterprise Full-Stack Architecture',
    subtitle: 'High-performance, secure, and scalable cloud-native infrastructure stack',
    highlightPill: 'SYSTEM DESIGN',
    layoutType: 'grid-3',
    keyPoints: [
      { label: 'Frontend Layer', desc: 'React 18, Vite, Tailwind CSS with MEIL design system (#313490 navy & #E91029 red).' },
      { label: 'API & Business Logic', desc: 'FastAPI microservices, SQLAlchemy ORM, and Pandas ESG rollup mathematical engine.' },
      { label: 'Storage & Security', desc: 'PostgreSQL relational database, AWS S3 encrypted evidence vault, JWT role authentication.' }
    ]
  },
  {
    id: 18,
    number: '18',
    category: 'DEPLOYMENT ROADMAP',
    title: 'Phased Implementation & Rollout Plan',
    subtitle: 'Structured schedule scaling from initial pilot projects to full group deployment',
    highlightPill: 'IMPLEMENTATION SCHEDULE',
    layoutType: 'grid-4',
    keyPoints: [
      { label: 'Phase 1: Foundation (M1-M2)', desc: 'Deploy core portal, configure MEIL hierarchy, pilot with top 25 high-impact projects.' },
      { label: 'Phase 2: Scale-Up (M3-M4)', desc: 'Onboard all 6 subsidiaries and 250+ project sites with comprehensive regional training.' },
      { label: 'Phase 3: ERP Integration (M5)', desc: 'Automate SAP ECC/S4HANA data ingestion for fuel, material, and vendor procurement.' },
      { label: 'Phase 4: AI & Assurance (M6)', desc: 'Deploy predictive anomaly forecasting and grant auditor portal access for FY25 reporting.' }
    ]
  },
  {
    id: 19,
    number: '19',
    category: 'BUSINESS VALUE',
    title: 'Value Proposition & Impact for MEIL',
    subtitle: 'Quantifiable strategic, operational, and regulatory dividends for the Group',
    highlightPill: 'STRATEGIC DIVIDENDS',
    layoutType: 'grid-3',
    keyPoints: [
      { label: '80% Reduction in Effort', desc: 'Eliminates hundreds of manual email exchanges and spreadsheet reconciliations each quarter.' },
      { label: 'Zero Compliance Penalties', desc: 'Guarantees on-time, fully substantiated SEBI filings with seamless third-party assurance.' },
      { label: 'Elevated Credit & Tender Rating', desc: 'Strengthens MEIL credentials in global and domestic mega-infrastructure tenders.' }
    ]
  },
  {
    id: 20,
    number: '20',
    category: 'CONCLUSION & Q&A',
    title: 'Engineering Sustainable Infrastructure',
    subtitle: 'MEIL ESG / BRSR Reporting Portal — Ready for SEBI Mandate & Beyond',
    highlightPill: 'THANK YOU',
    layoutType: 'conclusion',
    keyPoints: [
      { label: 'Platform Status', desc: 'Active & running on local environment ready for hackathon demonstration' },
      { label: 'Live Portal URL', desc: 'http://localhost:5173/portal (or /corporate for website view)' },
      { label: 'Primary Brand Colors', desc: 'MEIL Navy #313490 • MEIL Red #E91029 • Crisp White #FFFFFF' }
    ],
    quote: '"Building a resilient India with transparent, responsible, and verifiable governance."'
  }
];

export const PresentationPage: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'slide' | 'grid'>('slide');

  const slide = SLIDES_DATA[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < SLIDES_DATA.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleCopyMarkdown = () => {
    const text = `# ${slide.title}\n## ${slide.subtitle}\n\nCategory: ${slide.category}\n\nKey Points:\n` +
      slide.keyPoints.map(kp => `- **${kp.label}**: ${kp.desc} ${kp.stat ? `(${kp.stat})` : ''}`).join('\n') +
      (slide.quote ? `\n\n> ${slide.quote}` : '');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white border border-[#E8E8E8] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#313490] text-white flex items-center justify-center font-bold text-sm">
            PPT
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#313490] uppercase tracking-wide">
              MEIL ESG / BRSR Presentation Master Deck
            </h1>
            <p className="text-xs text-[#666666]">
              20-Slide Executive Deck adapted to MEIL Brand Colors (<span className="text-[#313490] font-bold">#313490 Navy</span> & <span className="text-[#E91029] font-bold">#E91029 Red</span>)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* View switcher */}
          <div className="flex border border-[#E8E8E8] overflow-hidden text-xs font-bold">
            <button
              onClick={() => setViewMode('slide')}
              className={`px-3 py-1.5 flex items-center space-x-1.5 transition-colors ${
                viewMode === 'slide' ? 'bg-[#313490] text-white' : 'bg-white text-[#333333] hover:bg-[#fafafa]'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Slide View</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 flex items-center space-x-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-[#313490] text-white' : 'bg-white text-[#333333] hover:bg-[#fafafa]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>20-Slide Grid</span>
            </button>
          </div>

          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 border border-[#E8E8E8] text-xs font-bold text-[#333333] hover:bg-[#f5f5f5] flex items-center space-x-1"
            title="Copy current slide text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-[#313490]" />}
            <span>{copied ? 'Copied' : 'Copy Slide'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'slide' ? (
        /* Single Slide Interactive Presentation Stage */
        <div className="space-y-4">
          {/* The Slide Canvas: 16:9 Aspect Ratio styled with exact MEIL brand guide */}
          <div className="relative w-full aspect-[16/9] max-h-[640px] bg-white border-2 border-[#313490] shadow-md overflow-hidden flex flex-col justify-between">
            {/* Left Brand Stripe (From FASTPPT reference) */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#313490] z-20" />
            <div className="absolute left-2.5 top-0 bottom-0 w-1 bg-[#E91029] z-20" />

            {/* Slide Header */}
            <div className="pl-8 pr-6 pt-5 pb-3 border-b border-[#E8E8E8] flex items-center justify-between bg-white z-10">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-black text-[#E91029] tracking-tighter">
                  {slide.number}.
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#313490] tracking-widest uppercase block">
                    MEIL ESG / BRSR PORTAL &bull; {slide.category}
                  </span>
                  <h2 className="text-xl font-bold text-[#333333] tracking-tight">
                    {slide.title}
                  </h2>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center space-x-2">
                <span className="bg-[#FFF7F9] border border-[#E91029] text-[#E91029] px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase">
                  {slide.highlightPill}
                </span>
                <span className="text-xs font-bold text-[#666666]">
                  {currentSlideIndex + 1} / {SLIDES_DATA.length}
                </span>
              </div>
            </div>

            {/* Slide Body Viewport */}
            <div className="flex-1 pl-8 pr-6 py-6 overflow-y-auto bg-white flex flex-col justify-center">
              {/* Layout Variation: HERO COVER */}
              {slide.layoutType === 'hero' && (
                <div className="bg-[#313490] text-white p-8 border-l-8 border-[#E91029] relative overflow-hidden my-auto">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#2F3192] rounded-full opacity-40 pointer-events-none" />
                  <span className="inline-block bg-[#E91029] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-4">
                    MEIL ESG SOLUTION ARCHITECTURE
                  </span>
                  <h1 className="text-3xl font-black tracking-tight mb-3">
                    {slide.title}
                  </h1>
                  <p className="text-sm text-[#C6CBE6] max-w-2xl leading-relaxed mb-6">
                    {slide.subtitle}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#3b3fb0]">
                    {slide.keyPoints.map((kp, idx) => (
                      <div key={idx} className="bg-white/10 p-3 backdrop-blur-sm">
                        <div className="text-[11px] text-[#A2DDFF] font-bold uppercase">{kp.label}</div>
                        <div className="text-xs text-white font-medium mt-1">{kp.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Variation: CONCLUSION */}
              {slide.layoutType === 'conclusion' && (
                <div className="bg-[#313490] text-white p-8 border-l-8 border-[#E91029] my-auto text-center relative overflow-hidden">
                  <span className="inline-block bg-[#E91029] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 mb-4">
                    THANK YOU &bull; Q&A
                  </span>
                  <h1 className="text-3xl font-black tracking-tight mb-2">
                    {slide.title}
                  </h1>
                  <p className="text-sm text-[#C6CBE6] max-w-xl mx-auto leading-relaxed mb-6">
                    {slide.subtitle}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
                    {slide.keyPoints.map((kp, idx) => (
                      <div key={idx} className="bg-white/10 p-3">
                        <div className="text-[11px] text-[#A2DDFF] font-bold uppercase">{kp.label}</div>
                        <div className="text-xs text-white font-medium mt-1">{kp.desc}</div>
                      </div>
                    ))}
                  </div>
                  {slide.quote && (
                    <div className="mt-6 text-xs text-[#C6CBE6] italic">
                      {slide.quote}
                    </div>
                  )}
                </div>
              )}

              {/* Layout Variation: SPLIT CARD */}
              {slide.layoutType === 'split-card' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto items-stretch">
                  <div className="md:col-span-5 bg-[#313490] text-white p-6 flex flex-col justify-between border-l-4 border-[#E91029]">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#A2DDFF]">
                        Strategic Overview
                      </span>
                      <h3 className="text-xl font-bold mt-2 leading-snug">
                        {slide.title}
                      </h3>
                      <p className="text-xs text-[#C6CBE6] mt-3 leading-relaxed">
                        {slide.subtitle}
                      </p>
                    </div>
                    {slide.quote && (
                      <div className="mt-6 pt-4 border-t border-[#3b3fb0] text-[11px] text-[#A2DDFF] italic">
                        {slide.quote}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-7 flex flex-col justify-between space-y-3">
                    {slide.keyPoints.map((kp, idx) => (
                      <div key={idx} className="p-4 bg-white border border-[#E8E8E8] border-l-4 border-l-[#313490] shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#313490]">{kp.label}</span>
                          {kp.stat && (
                            <span className="text-xs font-bold text-[#E91029] bg-[#FFF7F9] px-2 py-0.5 border border-[#E91029]">
                              {kp.stat}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#555555] mt-1.5 leading-relaxed">{kp.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Variation: 3-GRID */}
              {slide.layoutType === 'grid-3' && (
                <div className="my-auto space-y-4">
                  <p className="text-xs text-[#666666] leading-relaxed max-w-3xl">
                    {slide.subtitle}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {slide.keyPoints.map((kp, idx) => (
                      <div key={idx} className="bg-white border border-[#E8E8E8] p-4 flex flex-col justify-between hover:border-[#313490] transition-colors shadow-sm">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-[#E91029]">
                              0{idx + 1}.
                            </span>
                            {kp.stat && (
                              <span className="text-[10px] font-bold text-[#313490] bg-[#f1f4fc] px-2 py-0.5">
                                {kp.stat}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-[#313490] mb-2">{kp.label}</h4>
                          <p className="text-xs text-[#555555] leading-relaxed">{kp.desc}</p>
                        </div>
                        <div className="w-full h-1 bg-[#E8E8E8] mt-4">
                          <div className="h-full bg-[#313490]" style={{ width: `${(idx + 1) * 33}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Variation: 4-GRID */}
              {slide.layoutType === 'grid-4' && (
                <div className="my-auto space-y-4">
                  <p className="text-xs text-[#666666] leading-relaxed max-w-3xl">
                    {slide.subtitle}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {slide.keyPoints.map((kp, idx) => (
                      <div key={idx} className="bg-white border border-[#E8E8E8] p-3.5 flex flex-col justify-between border-t-2 border-t-[#313490]">
                        <div>
                          <div className="text-xs font-black text-[#E91029] mb-1">
                            0{idx + 1}.
                          </div>
                          <h4 className="text-xs font-bold text-[#313490] mb-1.5">{kp.label}</h4>
                          <p className="text-[11px] text-[#555555] leading-relaxed">{kp.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Variation: WORKFLOW (6 STAGES / DRILL DOWN) */}
              {slide.layoutType === 'workflow' && (
                <div className="my-auto space-y-4">
                  <p className="text-xs text-[#666666] leading-relaxed max-w-3xl">
                    {slide.subtitle}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                    {slide.keyPoints.map((kp, idx) => (
                      <div key={idx} className="bg-[#fafafa] border border-[#E8E8E8] p-3 flex flex-col justify-between relative">
                        <div>
                          <div className="w-5 h-5 bg-[#313490] text-white text-[10px] font-bold flex items-center justify-center mb-2">
                            {idx + 1}
                          </div>
                          <h4 className="text-[11px] font-bold text-[#313490] leading-tight mb-1">{kp.label}</h4>
                          <p className="text-[10px] text-[#666666] leading-relaxed">{kp.desc}</p>
                        </div>
                        <div className="text-right mt-2 text-[#E91029] text-[10px] font-bold">
                          &rarr;
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Variation: KPI METRICS SCORECARD */}
              {slide.layoutType === 'kpi-metric' && (
                <div className="my-auto space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {slide.keyPoints.map((kp, idx) => (
                      <div key={idx} className="bg-white border-2 border-[#313490] p-4 text-center">
                        <div className="text-[10px] font-bold text-[#313490] uppercase tracking-wider mb-2">
                          {kp.label}
                        </div>
                        <div className="text-lg font-black text-[#E91029] tracking-tight">
                          {kp.stat}
                        </div>
                        <p className="text-[11px] text-[#666666] mt-2 leading-snug">
                          {kp.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Variation: AUDIT LEDGER */}
              {slide.layoutType === 'ledger' && (
                <div className="my-auto space-y-4">
                  <div className="bg-[#fcfcfc] border border-[#E8E8E8] p-4 font-mono text-xs">
                    <div className="text-[10px] font-bold text-[#313490] uppercase mb-2">
                      IMMUTABLE SHA-256 AUDIT LOG VERIFICATION
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {slide.keyPoints.map((kp, idx) => (
                        <div key={idx} className="bg-white border border-[#E8E8E8] p-3 font-sans">
                          <div className="font-bold text-xs text-[#313490] mb-1">{kp.label}</div>
                          <div className="text-[11px] text-[#555555]">{kp.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Slide Footer */}
            <div className="pl-8 pr-6 py-2.5 border-t border-[#E8E8E8] flex items-center justify-between bg-[#fafafa] z-10 text-[11px] text-[#777777]">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#313490]">MEIL</span>
                <span>|</span>
                <span>Megha Engineering & Infrastructures Limited</span>
                <span>|</span>
                <span className="text-[#E91029] font-bold">Confidential Internal / SEBI Filing</span>
              </div>
              <div className="font-mono text-[10px] text-[#999999]">
                Slide {slide.number} / 20
              </div>
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center justify-between p-3 bg-white border border-[#E8E8E8]">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className={`px-4 py-2 border border-[#E8E8E8] font-bold text-xs flex items-center space-x-1.5 transition-colors ${
                currentSlideIndex === 0 ? 'opacity-40 cursor-not-allowed text-gray-400' : 'hover:bg-[#313490] hover:text-white text-[#313490]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Slide</span>
            </button>

            {/* Slide Index Pills */}
            <div className="hidden md:flex items-center space-x-1 overflow-x-auto max-w-xl py-1">
              {SLIDES_DATA.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-7 h-7 text-[11px] font-bold flex items-center justify-center transition-colors ${
                    currentSlideIndex === idx
                      ? 'bg-[#313490] text-white border-2 border-[#E91029]'
                      : 'bg-white border border-[#E8E8E8] text-[#555555] hover:bg-[#f1f4fc]'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentSlideIndex === SLIDES_DATA.length - 1}
              className={`px-4 py-2 border border-[#E8E8E8] font-bold text-xs flex items-center space-x-1.5 transition-colors ${
                currentSlideIndex === SLIDES_DATA.length - 1 ? 'opacity-40 cursor-not-allowed text-gray-400' : 'bg-[#313490] text-white hover:bg-[#25276e]'
              }`}
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* 20-Slide Grid View (All slides at a glance) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SLIDES_DATA.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setViewMode('slide');
              }}
              className={`bg-white border cursor-pointer hover:border-[#313490] transition-all p-3 flex flex-col justify-between ${
                currentSlideIndex === idx ? 'border-2 border-[#E91029] shadow-md' : 'border-[#E8E8E8]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-[#E91029]">{s.number}.</span>
                  <span className="text-[9px] font-bold text-[#313490] bg-[#f1f4fc] px-1.5 py-0.5 uppercase">
                    {s.highlightPill}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-[#313490] leading-snug line-clamp-2">
                  {s.title}
                </h3>
                <p className="text-[11px] text-[#666666] mt-1 line-clamp-2">
                  {s.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#f0f0f0] flex items-center justify-between text-[10px] text-[#888888]">
                <span>{s.category}</span>
                <span className="text-[#313490] font-bold flex items-center space-x-0.5">
                  <Eye className="w-3 h-3" />
                  <span>View</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Presentation Metadata Box */}
      <div className="bg-[#fafafa] border border-[#E8E8E8] p-5">
        <h3 className="text-xs font-bold text-[#313490] uppercase tracking-wider mb-2">
          How to Present or Export for PowerPoint
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#555555]">
          <div>
            <span className="font-bold text-[#333333] block mb-1">1. Exact Brand Hex Codes</span>
            Navy Title / Backgrounds: <code className="text-[#313490] font-bold">#313490</code><br />
            Red Accent / Numbers: <code className="text-[#E91029] font-bold">#E91029</code><br />
            Subheadings & Lines: <code className="text-[#666666]">#C6CBE6 / #E8E8E8</code>
          </div>
          <div>
            <span className="font-bold text-[#333333] block mb-1">2. Slide Ratio & Typography</span>
            16:9 Widescreen aspect ratio.<br />
            Font: Arial / Helvetica / Inter sans-serif.<br />
            Title: 24-28pt Bold Navy, Numbers: 32pt Bold Red.
          </div>
          <div>
            <span className="font-bold text-[#333333] block mb-1">3. Complete Markdown File</span>
            Full 20-slide transcript saved at:<br />
            <code className="text-[#313490] font-semibold">MEIL_ESG_BRSR_Presentation_Deck.md</code> in project root.
          </div>
        </div>
      </div>
    </div>
  );
};
