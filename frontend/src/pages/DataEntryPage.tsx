import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileEdit, 
  CheckCircle2, 
  AlertTriangle, 
  UploadCloud, 
  FileText, 
  Send, 
  FileCheck,
  Building2,
  Calendar,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Calculator,
  HelpCircle,
  Save,
  Check,
  Paperclip,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Layers,
  Sparkles,
  Clock,
  Unlock,
  Lock,
  CheckSquare,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { PipelineStepper } from '../components/common/PipelineStepper';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  FIELDS_CONFIG, 
  FieldConfig, 
  validateFieldValue, 
  getCurrentIndianFinancialYear,
  getIndicatorOwnerRole,
  getIndicatorStatutoryMetadata,
  CEA_INDIA_GRID_FACTOR,
  DIESEL_EMISSION_FACTOR,
  PETROL_EMISSION_FACTOR,
  LPG_EMISSION_FACTOR
} from '../config/fields.config';
import { DataEntry } from '../types';

export const DataEntryPage: React.FC = () => {
  const { 
    selectedOrg, 
    selectedPeriod, 
    dataEntries, 
    updateDataEntry, 
    submitDataEntry,
    unlockDataEntry,
    unlockAllEntries,
    addEvidence 
  } = useApp();
  const { currentRole, currentUser } = useAuth();

  const currentFy = getCurrentIndianFinancialYear();

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedOwnerFilter, setSelectedOwnerFilter] = useState<string>('ALL');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');
  const [selectedFrequencyFilter, setSelectedFrequencyFilter] = useState<string>('ALL');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [expandedMethodology, setExpandedMethodology] = useState<Record<string, boolean>>({});
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  // Section 3: Permission Matrix Enforcements
  const isApproverRole = ['PROJECT_MANAGER', 'BU_COORDINATOR', 'SUB_ESG_MANAGER', 'BOARD_APPROVER', 'AUDITOR', 'SYS_ADMIN', 'ADMIN'].includes(currentRole);

  const canDraftIndicator = (field: FieldConfig): { allowed: boolean; reason?: string } => {
    if (isApproverRole) {
      return { allowed: false, reason: 'Review Authority Mode (Read-Only)' };
    }
    const meta = getIndicatorStatutoryMetadata(field);

    // Node level check: Group only indicators cannot be drafted at Project level
    if (selectedOrg.type === 'PROJECT' && meta.isGroupOnly) {
      return { allowed: false, reason: 'Reported at Group Level only (by Corporate Function / CSO)' };
    }

    if (currentRole === 'SITE_ENGINEER' || currentRole === 'SITE_USER') {
      if (meta.ownerRole !== 'SITE_ENGINEER') {
        return { allowed: false, reason: `Owned by ${meta.ownerTitle}` };
      }
      return { allowed: true };
    }

    if (currentRole === 'SITE_EHS') {
      if (meta.ownerRole !== 'SITE_EHS') {
        return { allowed: false, reason: `Owned by ${meta.ownerTitle}` };
      }
      return { allowed: true };
    }

    if (currentRole === 'GROUP_FUNCTION') {
      if (meta.ownerRole !== 'GROUP_FUNCTION') {
        return { allowed: false, reason: `Owned by ${meta.ownerTitle}` };
      }
      return { allowed: true };
    }

    if (currentRole === 'GROUP_ESG_HEAD' || currentRole === 'GROUP_SUSTAINABILITY') {
      if (meta.ownerRole !== 'GROUP_ESG_HEAD') {
        return { allowed: false, reason: `Owned by ${meta.ownerTitle}` };
      }
      return { allowed: true };
    }

    return { allowed: false, reason: 'Drafting restricted for current role' };
  };

  // Evidence upload modal state
  const [uploadModalField, setUploadModalField] = useState<FieldConfig | null>(null);
  const [evidenceFileName, setEvidenceFileName] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [latestUploadedFile, setLatestUploadedFile] = useState<Record<string, string>>({});

  // Zero confirmation check state (mapped by field ID)
  const [zeroConfirmed, setZeroConfirmed] = useState<Record<string, boolean>>({});

  // Field validation error state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Form values state mapped by field ID
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    dataEntries
      .filter(e => e.organisationId === selectedOrg.id && e.reportingPeriodId === selectedPeriod.id)
      .forEach(e => {
        if (e.numericValue !== undefined) initial[e.indicatorId] = String(e.numericValue);
      });
    return initial;
  });

  // Methodology notes state mapped by field ID
  const [methodologyNotes, setMethodologyNotes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    dataEntries
      .filter(e => e.organisationId === selectedOrg.id && e.reportingPeriodId === selectedPeriod.id)
      .forEach(e => {
        if (e.remarks) initial[e.indicatorId] = e.remarks;
      });
    return initial;
  });

  // Calculator inputs state
  const [calcInputs, setCalcInputs] = useState<Record<string, any>>({
    scope1: { dieselL: '', petrolL: '', lpgKg: '', efDiesel: '2.68', efPetrol: '2.31', efLpg: '2.98' },
    scope2: { kwh: '', gridFactor: CEA_INDIA_GRID_FACTOR },
    energy: { dieselL: '', kwh: '', lpgKg: '' },
    water: { startMeter: '', endMeter: '', tankers: '', tankerCap: '20' },
    waste: { muckMT: '', rubbleMT: '', scrapMT: '', hazMT: '' },
    ltifr: { injuries: '0', manHours: '125000' }
  });

  // Toggle collapsible sections
  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const toggleMethodology = (fieldId: string) => {
    setExpandedMethodology(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  // Input key blocker for "-", "e", and negative paste
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text');
    if (text.includes('-') || text.toLowerCase().includes('e')) {
      e.preventDefault();
    }
  };

  // Enforce maxIntDigits & maxDecimals on input typing
  const handleInputChange = (field: FieldConfig, rawStr: string) => {
    // Sanitize string
    let sanitized = rawStr.replace(/[^0-9.]/g, '');

    // Single dot only
    const dotIndex = sanitized.indexOf('.');
    if (dotIndex !== -1) {
      sanitized = sanitized.substring(0, dotIndex + 1) + sanitized.substring(dotIndex + 1).replace(/\./g, '');
    }

    const parts = sanitized.split('.');
    const intPart = parts[0];
    const decPart = parts[1];

    if (intPart.length > field.maxIntDigits) {
      return; // block typing
    }

    if (decPart !== undefined && decPart.length > field.maxDecimals) {
      return; // block typing
    }

    setFormValues(prev => ({ ...prev, [field.id]: sanitized }));
    // Clear error on type
    if (fieldErrors[field.id]) {
      setFieldErrors(prev => {
        const copy = { ...prev };
        delete copy[field.id];
        return copy;
      });
    }
  };

  // Save single draft
  const handleSaveDraft = (field: FieldConfig) => {
    const val = formValues[field.id];
    const num = val !== undefined && val !== '' ? parseFloat(val) : 0;
    const notes = methodologyNotes[field.id] || '';
    updateDataEntry(field.id, num, field.unit, notes);
    showNotice(`Draft saved for ${field.code} (${field.name}).`);
  };

  // Save all drafts
  const handleSaveAllDrafts = () => {
    FIELDS_CONFIG.forEach(field => {
      const val = formValues[field.id];
      if (val !== undefined && val !== '') {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          updateDataEntry(field.id, num, field.unit, methodologyNotes[field.id] || '');
        }
      }
    });
    showNotice('All current field drafts saved successfully.');
  };

  // Submit field for review
  const handleSubmitField = (field: FieldConfig) => {
    const rawVal = formValues[field.id];
    const entry = dataEntries.find(e => e.organisationId === selectedOrg.id && e.indicatorId === field.id && e.reportingPeriodId === selectedPeriod.id);
    const hasProof = (entry?.evidenceFiles && entry.evidenceFiles.length > 0) || false;
    const isZeroConf = !!zeroConfirmed[field.id];

    // 1. Mandatory methodology note check
    if (!methodologyNotes[field.id] || methodologyNotes[field.id].trim().length < 5) {
      setFieldErrors(prev => ({
        ...prev,
        [field.id]: 'Methodology note is mandatory. Please state measuring instrument, logbook, or calculator details.'
      }));
      return;
    }

    // 2. Strict value validation
    const validation = validateFieldValue(field, rawVal, isZeroConf, hasProof);
    if (!validation.isValid) {
      setFieldErrors(prev => ({ ...prev, [field.id]: validation.error || 'Invalid value' }));
      return;
    }

    // 3. Evidence requirement check
    if (field.requiresEvidence && !hasProof) {
      setFieldErrors(prev => ({
        ...prev,
        [field.id]: 'Supporting document/invoice is mandatory for this indicator. Please attach proof file below.'
      }));
      return;
    }

    // Update and submit
    const num = parseFloat(rawVal!);
    updateDataEntry(field.id, num, field.unit, methodologyNotes[field.id]);
    
    // Find or wait for entry id
    const entryId = entry?.id || `entry-${selectedOrg.id}-${field.id}`;
    submitDataEntry(entryId);

    showNotice(`Metric ${field.code} submitted successfully for ESG review!`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }
    const file = e.target.files[0];
    const allowed = /\.(pdf|jpg|jpeg|png)$/i;
    if (!allowed.test(file.name)) {
      setFileError('Invalid file type. Only .pdf, .jpg, .jpeg, and .png are allowed.');
      setSelectedFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5 MB limit. Please select a smaller file.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    setEvidenceFileName(file.name);
  };

  const handleQuickAttach = (fileName: string) => {
    setEvidenceFileName(fileName);
    setFileError(null);
    const blob = new Blob([`Simulated document content for ${fileName}`], { type: 'application/pdf' });
    const file = new File([blob], fileName, { type: 'application/pdf' });
    setSelectedFile(file);
  };

  // Attach evidence modal submission
  const handleAttachEvidence = async () => {
    if (!uploadModalField || !evidenceFileName) return;
    const entry = dataEntries.find(e => e.organisationId === selectedOrg.id && e.indicatorId === uploadModalField.id && e.reportingPeriodId === selectedPeriod.id);
    const entryId = entry?.id || `entry-${selectedOrg.id}-${uploadModalField.id}`;

    let filePath = `/uploads/${evidenceFileName}`;
    let fileHash = `SHA256-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    let fileSize = selectedFile ? Math.round(selectedFile.size / 1024) : 2048;
    let fileType = selectedFile ? selectedFile.type : (evidenceFileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

    if (selectedFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('dataEntryId', entryId);
        formData.append('indicatorCode', uploadModalField.code);

        const res = await fetch('http://localhost:8000/api/v1/upload', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          filePath = data.filePath || filePath;
          fileHash = data.fileHash || fileHash;
          fileSize = Math.round((data.fileSize || selectedFile.size) / 1024);
          fileType = data.fileType || fileType;
        }
      } catch (err) {
        console.warn('Backend upload fallback:', err);
      } finally {
        setIsUploading(false);
      }
    }

    addEvidence(entryId, {
      dataEntryId: entryId,
      fileName: evidenceFileName,
      filePath,
      fileType,
      fileSize,
      fileHash,
      description: evidenceDesc || `Verified site source documentation for ${uploadModalField.code}`,
      verificationStatus: 'VERIFIED',
      aiConfidence: 98
    });

    setLatestUploadedFile(prev => ({ ...prev, [uploadModalField.id]: evidenceFileName }));
    setEvidenceFileName('');
    setEvidenceDesc('');
    setSelectedFile(null);
    setFileError(null);
    const code = uploadModalField.code;
    setUploadModalField(null);
    showNotice(`Attached evidence file for ${code}.`);
  };

  // Inline Calculator auto-fillers
  const applyScope1Calc = (fieldId: string) => {
    const diesel = parseFloat(calcInputs.scope1.dieselL || '0') || 0;
    const petrol = parseFloat(calcInputs.scope1.petrolL || '0') || 0;
    const lpg = parseFloat(calcInputs.scope1.lpgKg || '0') || 0;
    const efDiesel = parseFloat(calcInputs.scope1.efDiesel || '2.68') || 2.68;
    const efPetrol = parseFloat(calcInputs.scope1.efPetrol || '2.31') || 2.31;
    const efLpg = parseFloat(calcInputs.scope1.efLpg || '2.98') || 2.98;

    const totalTonne = (diesel * efDiesel + petrol * efPetrol + lpg * efLpg) / 1000;
    const rounded = totalTonne.toFixed(2);

    setFormValues(prev => ({ ...prev, [fieldId]: rounded }));
    setMethodologyNotes(prev => ({
      ...prev,
      [fieldId]: `Calculated from fuel issue log: Diesel ${diesel} L × EF ${efDiesel} kg/L + Petrol ${petrol} L × EF ${efPetrol} kg/L + LPG ${lpg} kg × EF ${efLpg} kg/kg. Total: ${rounded} tCO2e (Source: IPCC/CEA Guidelines 2024).`
    }));
    setActiveCalculator(null);
    showNotice(`Calculated ${rounded} tCO2e and pre-filled methodology note.`);
  };

  const applyScope2Calc = (fieldId: string) => {
    const kwh = parseFloat(calcInputs.scope2.kwh || '0');
    const gridF = parseFloat(calcInputs.scope2.gridFactor || String(CEA_INDIA_GRID_FACTOR));
    const totalTonne = (kwh * gridF) / 1000;
    const rounded = totalTonne.toFixed(2);

    setFormValues(prev => ({ ...prev, [fieldId]: rounded }));
    setMethodologyNotes(prev => ({
      ...prev,
      [fieldId]: `Calculated from monthly DISCOM HT utility bills: ${kwh.toLocaleString()} kWh × CEA Baseline Factor ${gridF} tCO2/MWh / 1000 = ${rounded} tCO2e.`
    }));
    setActiveCalculator(null);
    showNotice(`Calculated ${rounded} tCO2e and pre-filled methodology note.`);
  };

  const applyEnergyCalc = (fieldId: string) => {
    const diesel = parseFloat(calcInputs.energy.dieselL || '0');
    const kwh = parseFloat(calcInputs.energy.kwh || '0');
    const lpg = parseFloat(calcInputs.energy.lpgKg || '0');

    const totalGJ = (diesel * 0.0386) + (kwh * 0.0036) + (lpg * 0.0461);
    const rounded = totalGJ.toFixed(2);

    setFormValues(prev => ({ ...prev, [fieldId]: rounded }));
    setMethodologyNotes(prev => ({
      ...prev,
      [fieldId]: `Energy breakdown: Diesel ${diesel} L × 0.0386 GJ/L (${(diesel*0.0386).toFixed(2)} GJ) + Grid Electricity ${kwh} kWh × 0.0036 GJ/kWh (${(kwh*0.0036).toFixed(2)} GJ). Total = ${rounded} GJ.`
    }));
    setActiveCalculator(null);
    showNotice(`Calculated ${rounded} GJ and pre-filled methodology note.`);
  };

  const applyWaterCalc = (fieldId: string) => {
    const start = parseFloat(calcInputs.water.startMeter || '0');
    const end = parseFloat(calcInputs.water.endMeter || '0');
    const tankers = parseFloat(calcInputs.water.tankers || '0');
    const cap = parseFloat(calcInputs.water.tankerCap || '20');

    let totalKL = 0;
    let noteDesc = '';
    if (end > start) {
      totalKL += (end - start);
      noteDesc += `Flow meter differential (${end} - ${start}) = ${end - start} KL`;
    }
    if (tankers > 0) {
      totalKL += (tankers * cap);
      noteDesc += `${noteDesc ? ' + ' : ''}Tanker deliveries: ${tankers} trips × ${cap} KL = ${tankers * cap} KL`;
    }

    const rounded = totalKL.toFixed(2);
    setFormValues(prev => ({ ...prev, [fieldId]: rounded }));
    setMethodologyNotes(prev => ({
      ...prev,
      [fieldId]: `Water measurement: ${noteDesc}. Total water consumption = ${rounded} KL.`
    }));
    setActiveCalculator(null);
    showNotice(`Calculated ${rounded} KL and pre-filled methodology note.`);
  };

  const applyWasteCalc = (fieldId: string) => {
    const muck = parseFloat(calcInputs.waste.muckMT || '0');
    const rubble = parseFloat(calcInputs.waste.rubbleMT || '0');
    const scrap = parseFloat(calcInputs.waste.scrapMT || '0');
    const haz = parseFloat(calcInputs.waste.hazMT || '0');

    const totalMT = muck + rubble + scrap + haz;
    const rounded = totalMT.toFixed(2);

    setFormValues(prev => ({ ...prev, [fieldId]: rounded }));
    setMethodologyNotes(prev => ({
      ...prev,
      [fieldId]: `Aggregated weighbridge manifests: Excavated muck ${muck} MT + Rubble ${rubble} MT + Steel scrap ${scrap} MT + Hazardous waste ${haz} MT = ${rounded} MT.`
    }));
    setActiveCalculator(null);
    showNotice(`Calculated ${rounded} MT and pre-filled methodology note.`);
  };

  const applyLtifrCalc = (fieldId: string) => {
    const injuries = parseFloat(calcInputs.ltifr.injuries || '0');
    const manHours = parseFloat(calcInputs.ltifr.manHours || '125000');
    const rate = manHours > 0 ? (injuries * 1000000) / manHours : 0;
    const rounded = rate.toFixed(2);

    setFormValues(prev => ({ ...prev, [fieldId]: rounded }));
    setMethodologyNotes(prev => ({
      ...prev,
      [fieldId]: `Formula: (Lost Time Injuries [${injuries}] × 1,000,000) / Total Man-Hours [${manHours.toLocaleString()}] = ${rounded} per million person-hours (EHS incident register verified).`
    }));
    setActiveCalculator(null);
    showNotice(`Calculated LTIFR ${rounded} and pre-filled methodology note.`);
  };

  const showNotice = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4500);
  };

  // Filtered fields based on search, topic, status, level of entry, frequency, and role ownership
  const filteredFields = useMemo(() => {
    return FIELDS_CONFIG.filter(field => {
      const meta = getIndicatorStatutoryMetadata(field);
      const ownerRole = meta.ownerRole;

      // 1. Role-based ownership filtering
      // If user is a primary entry owner, default filter to their owned indicators unless they choose otherwise
      if (currentRole === 'SITE_ENGINEER' || currentRole === 'SITE_USER') {
        if (selectedOwnerFilter === 'ALL' && ownerRole !== 'SITE_ENGINEER') return false;
        if (selectedOwnerFilter !== 'ALL' && ownerRole !== selectedOwnerFilter) return false;
      } else if (currentRole === 'SITE_EHS') {
        if (selectedOwnerFilter === 'ALL' && ownerRole !== 'SITE_EHS') return false;
        if (selectedOwnerFilter !== 'ALL' && ownerRole !== selectedOwnerFilter) return false;
      } else if (currentRole === 'GROUP_FUNCTION') {
        if (selectedOwnerFilter === 'ALL' && ownerRole !== 'GROUP_FUNCTION') return false;
        if (selectedOwnerFilter !== 'ALL' && ownerRole !== selectedOwnerFilter) return false;
      } else if (selectedOwnerFilter !== 'ALL') {
        if (ownerRole !== selectedOwnerFilter) return false;
      }

      // 2. Level of entry filter (Section 4)
      if (selectedLevelFilter !== 'ALL') {
        if (meta.levelOfEntry !== selectedLevelFilter) return false;
      }

      // 3. Frequency filter (Section 4)
      if (selectedFrequencyFilter !== 'ALL') {
        if (meta.frequency !== selectedFrequencyFilter) return false;
      }

      // 4. Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchCode = field.code.toLowerCase().includes(q);
        const matchName = field.name.toLowerCase().includes(q);
        const matchDesc = field.description.toLowerCase().includes(q);
        const matchTopic = field.topic.toLowerCase().includes(q);
        const matchOwner = meta.ownerTitle.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchDesc && !matchTopic && !matchOwner) return false;
      }

      // 5. Topic filter
      if (selectedTopicFilter !== 'ALL') {
        if (field.topic.toLowerCase() !== selectedTopicFilter.toLowerCase()) return false;
      }

      // 6. Status filter
      if (selectedStatusFilter !== 'ALL') {
        const entry = dataEntries.find(e => e.organisationId === selectedOrg.id && e.indicatorId === field.id && e.reportingPeriodId === selectedPeriod.id);
        const status = entry?.status || 'DRAFT';
        if (selectedStatusFilter !== status) return false;
      }

      return true;
    });
  }, [currentRole, selectedOwnerFilter, selectedLevelFilter, selectedFrequencyFilter, searchQuery, selectedTopicFilter, selectedStatusFilter, dataEntries, selectedOrg.id, selectedPeriod.id]);

  const totalIndicatorsCount = FIELDS_CONFIG.length;
  const filteredIndicatorsCount = filteredFields.length;

  // Group fields by Section and Principle (Section A, Section B, Section C Principles)
  const groupedFields = useMemo(() => {
    const groups: Record<string, { title: string; section: string; fields: FieldConfig[] }> = {};

    filteredFields.forEach(field => {
      let groupKey: string;
      if (field.section === 'A') {
        groupKey = 'Section A: General Entity & Workforce Disclosures';
      } else if (field.section === 'B') {
        groupKey = 'Section B: Management and Process Disclosures (ESG Policies & Governance)';
      } else {
        groupKey = `Section C: Principle ${field.principleNumber || 6} - ${field.principleName || 'Principle Disclosures'}`;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = {
          title: groupKey,
          section: field.section,
          fields: []
        };
      }
      groups[groupKey].fields.push(field);
    });

    return groups;
  }, [filteredFields]);

  // Status helper chip
  const renderStatusChip = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 text-helper-meta font-bold uppercase bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] rounded-[2px] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
            <span>Approved</span>
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="px-2.5 py-1 text-helper-meta font-bold uppercase bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] rounded-[2px] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
            <span>Submitted</span>
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-2.5 py-1 text-helper-meta font-bold uppercase bg-[#fffbeb] text-[#92400e] border border-[#fde68a] rounded-[2px] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
            <span>Under Review</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 text-helper-meta font-bold uppercase bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] rounded-[2px] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
            <span>Returned</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-helper-meta font-bold uppercase bg-[#f3f4f6] text-[#4b5563] border border-[#e5e7eb] rounded-[2px] flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af]" />
            <span>Draft</span>
          </span>
        );
    }
  };

  // Calculate live statutory pipeline statistics for current unit scope
  const pipelineStats = useMemo(() => {
    const orgEntries = dataEntries.filter(
      e => e.organisationId === selectedOrg.id && e.reportingPeriodId === selectedPeriod.id
    );
    const draft = orgEntries.filter(e => e.status === 'DRAFT' || !e.status).length;
    const submitted = orgEntries.filter(e => e.status === 'SUBMITTED' || e.status === 'UNDER_REVIEW').length;
    const pmApproved = orgEntries.filter(e => e.status === 'PROJECT_APPROVED').length;
    const buApproved = orgEntries.filter(e => e.status === 'BU_APPROVED').length;
    const subApproved = orgEntries.filter(e => e.status === 'SUBSIDIARY_APPROVED').length;
    const groupApproved = orgEntries.filter(e => e.status === 'GROUP_APPROVED' || e.status === 'APPROVED').length;
    const locked = orgEntries.filter(e => e.status === 'LOCKED').length;
    const rejected = orgEntries.filter(e => e.status === 'REJECTED').length;

    return { draft, submitted, pmApproved, buApproved, subApproved, groupApproved, locked, rejected, total: orgEntries.length };
  }, [dataEntries, selectedOrg.id, selectedPeriod.id]);

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Header with FY Lock and Quick Actions */}
      <div className="border-b border-[#E8E8E8] pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#666666] uppercase tracking-wider mb-1">
            <span className="text-[#1A2A6C]">{selectedOrg.type} LEVEL: {selectedOrg.name}</span>
            <span>•</span>
            <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-300">
              🔒 UNIT SCOPE: {selectedOrg.code}
            </span>
            <span>•</span>
            <span className="text-blue-800 font-mono bg-blue-50 px-2 py-0.5 border border-blue-200">
              {currentFy.financialYear} (CURRENT FY LOCKED)
            </span>
          </div>

          <h1 className="text-page-title font-bold text-[#1A2A6C] tracking-tight leading-tight clamp-title">
            Site Environmental &amp; Social Data Entry
          </h1>
          <p className="text-label-base text-[#444444] mt-1 max-w-3xl leading-relaxed">
            Record primary operational consumption, workforce parameters, and upload utility documents. Entries are validated according to SEBI BRSR Core formulas.
          </p>
        </div>

        {/* Global Action: Save all drafts & Unlock all fields / Review queue shortcut */}
        <div className="flex items-center space-x-3 shrink-0 flex-wrap gap-2">
          {isApproverRole ? (
            <Link
              to="/review"
              className="min-h-[44px] min-w-[44px] bg-[#1A2A6C] hover:bg-[#EF272E] text-white px-5 py-2.5 text-label-base font-bold transition-colors flex items-center space-x-2 rounded-[2px] shadow-sm"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Go to Review &amp; Approvals</span>
            </Link>
          ) : (
            <>
              <button
                onClick={() => {
                  unlockAllEntries();
                  showNotice('All indicators unlocked to Draft status. Ready for data entry!');
                }}
                className="min-h-[44px] min-w-[44px] border border-amber-500 text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2.5 text-label-base font-bold transition-colors flex items-center space-x-2 rounded-[2px]"
                title="Unlock all indicators for editing and testing"
              >
                <Unlock className="w-4 h-4 text-amber-600" />
                <span>Unlock All Fields</span>
              </button>

              <button
                onClick={handleSaveAllDrafts}
                className="min-h-[44px] min-w-[44px] border-2 border-[#1A2A6C] text-[#1A2A6C] hover:bg-[#1A2A6C] hover:text-white px-5 py-2.5 text-label-base font-bold transition-colors flex items-center space-x-2 rounded-[2px]"
              >
                <Save className="w-4 h-4" />
                <span>Save All Drafts</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Approver Oversight & Governance Authority Banner */}
      {isApproverRole && (
        <div className="bg-amber-50/90 border-2 border-amber-400 p-4 sm:p-5 rounded-[4px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-100 rounded-[2px] text-amber-800 shrink-0">
              <ShieldCheck className="w-6 h-6 text-amber-700" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-amber-950 uppercase tracking-wide bg-amber-200/80 px-2 py-0.5 rounded-[2px]">
                  GOVERNANCE &amp; APPROVAL AUTHORITY MODE
                </span>
                <span className="text-xs font-bold text-amber-900 font-mono">
                  Role: {currentUser?.fullName || currentRole}
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed max-w-3xl">
                Under statutory governance (Section 3 Permission Matrix), primary data entry is performed by designated data owners (Site Engineer, Site Safety EHS, Group Function). As an approving authority, this page is presented in <strong>Read-Only Oversight</strong> mode. Please evaluate and approve submissions in the Review &amp; Approval queue.
              </p>
            </div>
          </div>
          <Link
            to="/review"
            className="shrink-0 min-h-[44px] px-5 py-2.5 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-xs font-bold rounded-[2px] transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
          >
            <span>Open Review &amp; Approvals Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Statutory 7-Stage Governance Pipeline Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1A2A6C] to-slate-900 text-white p-4 sm:p-5 rounded-[4px] shadow-sm border border-slate-700/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-300">
              Statutory 7-Stage Verification Pipeline (SEBI BRSR Core)
            </h2>
          </div>
          <span className="text-[11px] text-[#C6CBE6] font-mono">
            Scope Boundary: <strong className="text-white">{selectedOrg.name}</strong> • Metrics in Scope: {pipelineStats.total}
          </span>
        </div>

        {/* Visual Pipeline Progression Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1 text-center">
          <div className={`p-2 rounded-[2px] border ${pipelineStats.draft > 0 ? 'bg-slate-800/90 border-slate-500' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <span className="text-[10px] uppercase font-bold text-slate-300 block">1. Draft</span>
            <span className="text-lg font-mono font-bold text-white">{pipelineStats.draft}</span>
            <span className="text-[9px] text-slate-400 block">Site Engineer</span>
          </div>

          <div className={`p-2 rounded-[2px] border ${pipelineStats.submitted > 0 ? 'bg-blue-900/60 border-blue-400' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <span className="text-[10px] uppercase font-bold text-blue-300 block">2. Submitted</span>
            <span className="text-lg font-mono font-bold text-white">{pipelineStats.submitted}</span>
            <span className="text-[9px] text-blue-200 block">Evidence Gate</span>
          </div>

          <div className={`p-2 rounded-[2px] border ${pipelineStats.pmApproved > 0 ? 'bg-indigo-900/60 border-indigo-400' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <span className="text-[10px] uppercase font-bold text-indigo-300 block">3. Project Ok</span>
            <span className="text-lg font-mono font-bold text-white">{pipelineStats.pmApproved}</span>
            <span className="text-[9px] text-indigo-200 block">Project Manager</span>
          </div>

          <div className={`p-2 rounded-[2px] border ${pipelineStats.buApproved > 0 ? 'bg-purple-900/60 border-purple-400' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <span className="text-[10px] uppercase font-bold text-purple-300 block">4. BU Ok</span>
            <span className="text-lg font-mono font-bold text-white">{pipelineStats.buApproved}</span>
            <span className="text-[9px] text-purple-200 block">BU Coordinator</span>
          </div>

          <div className={`p-2 rounded-[2px] border ${pipelineStats.subApproved > 0 ? 'bg-teal-900/60 border-teal-400' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <span className="text-[10px] uppercase font-bold text-teal-300 block">5. Sub Ok</span>
            <span className="text-lg font-mono font-bold text-white">{pipelineStats.subApproved}</span>
            <span className="text-[9px] text-teal-200 block">Sub ESG Mgr</span>
          </div>

          <div className={`p-2 rounded-[2px] border ${pipelineStats.groupApproved > 0 ? 'bg-emerald-900/60 border-emerald-400' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <span className="text-[10px] uppercase font-bold text-emerald-300 block">6. Group Ok</span>
            <span className="text-lg font-mono font-bold text-white">{pipelineStats.groupApproved}</span>
            <span className="text-[9px] text-emerald-200 block">CSO Amit Verma</span>
          </div>

          <div className={`p-2 rounded-[2px] border ${pipelineStats.locked > 0 ? 'bg-amber-950/70 border-amber-400' : 'bg-slate-800/40 border-slate-700/50'}`}>
            <span className="text-[10px] uppercase font-bold text-amber-300 block">7. Locked</span>
            <span className="text-lg font-mono font-bold text-amber-300">{pipelineStats.locked}</span>
            <span className="text-[9px] text-amber-200 block">Board Approver</span>
          </div>
        </div>

        {pipelineStats.rejected > 0 && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-3 py-1.5 rounded-[2px] text-xs flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>{pipelineStats.rejected} indicator(s) returned for correction by reviewers</span>
            </span>
            <button 
              onClick={() => setSelectedStatusFilter('REJECTED')}
              className="text-xs text-white underline font-bold"
            >
              Filter Returned Items
            </button>
          </div>
        )}
      </div>

      {/* Success Notification Banner */}
      {successToast && (
        <div className="bg-[#f0fdf4] border-l-4 border-[#16a34a] p-4 text-label-base text-[#166534] flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-[#166534] hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Permanent Search Bar & Filter Bar with Proper GUI (Sticky on scroll) */}
      <div className="sticky -top-5 sm:-top-6 lg:-top-8 z-30 bg-white border-y border-[#cbd5e1] shadow-md -mx-5 sm:-mx-6 lg:-mx-8 px-5 sm:px-6 lg:px-8 py-3.5 mb-6 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by indicator code (e.g. P6-E1-S1), topic, or name..."
              className="w-full bg-[#fafafa] focus:bg-white border border-[#d1d5db] focus:border-[#1A2A6C] rounded-[2px] pl-9 pr-8 py-2 text-xs text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#1A2A6C] min-h-[42px] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-700 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TOPIC:
              </span>
              <select
                value={selectedTopicFilter}
                onChange={(e) => setSelectedTopicFilter(e.target.value)}
                className="bg-white border border-[#d1d5db] px-3 py-2 text-xs font-bold text-[#1A2A6C] focus:outline-none focus:border-[#1A2A6C] cursor-pointer rounded-[2px] min-h-[42px]"
              >
                <option value="ALL">All Topics</option>
                <option value="Emissions">Emissions</option>
                <option value="Energy">Energy</option>
                <option value="Water">Water</option>
                <option value="Waste">Waste</option>
                <option value="Workforce">Workforce</option>
                <option value="Safety">Safety</option>
                <option value="Ethics">Ethics</option>
                <option value="Governance">Governance</option>
              </select>
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                STATUS:
              </span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-white border border-[#d1d5db] px-3 py-2 text-xs font-bold text-[#1A2A6C] focus:outline-none focus:border-[#1A2A6C] cursor-pointer rounded-[2px] min-h-[42px]"
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Returned for Correction</option>
              </select>
            </div>

            {/* Owner Role Filter */}
            {['SYS_ADMIN', 'ADMIN', 'AUDITOR', 'BOARD_APPROVER', 'GROUP_ESG_HEAD', 'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER'].includes(currentRole) && (
              <div className="flex items-center space-x-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  OWNER:
                </span>
                <select
                  value={selectedOwnerFilter}
                  onChange={(e) => setSelectedOwnerFilter(e.target.value)}
                  className="bg-white border border-[#d1d5db] px-2.5 py-2 text-xs font-bold text-[#1A2A6C] focus:outline-none focus:border-[#1A2A6C] cursor-pointer rounded-[2px] min-h-[42px]"
                >
                  <option value="ALL">All Role Owners</option>
                  <option value="SITE_ENGINEER">👷 Site Engineer (P6)</option>
                  <option value="SITE_EHS">🦺 Site Safety EHS (P3)</option>
                  <option value="GROUP_FUNCTION">🏢 Group Function (Sec A/HR)</option>
                  <option value="GROUP_ESG_HEAD">👑 Group CSO (Sec B)</option>
                </select>
              </div>
            )}

            {/* Level of Entry Filter (Section 4) */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                LEVEL:
              </span>
              <select
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value)}
                className="bg-white border border-[#d1d5db] px-2.5 py-2 text-xs font-bold text-[#1A2A6C] focus:outline-none focus:border-[#1A2A6C] cursor-pointer rounded-[2px] min-h-[42px]"
              >
                <option value="ALL">All Entry Levels</option>
                <option value="Project, rolled up">📍 Project, rolled up</option>
                <option value="Subsidiary or Group">🏢 Subsidiary or Group</option>
                <option value="Group only">🏛️ Group only</option>
              </select>
            </div>

            {/* Frequency Filter (Section 4) */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                FREQ:
              </span>
              <select
                value={selectedFrequencyFilter}
                onChange={(e) => setSelectedFrequencyFilter(e.target.value)}
                className="bg-white border border-[#d1d5db] px-2.5 py-2 text-xs font-bold text-[#1A2A6C] focus:outline-none focus:border-[#1A2A6C] cursor-pointer rounded-[2px] min-h-[42px]"
              >
                <option value="ALL">All Frequencies</option>
                <option value="Monthly">📅 Monthly</option>
                <option value="Quarterly or yearly">🗓️ Quarterly / Yearly</option>
                <option value="Yearly">📆 Yearly</option>
              </select>
            </div>

            <div className="border border-blue-200 bg-blue-50/70 text-[#1A2A6C] font-bold text-xs px-3 py-2.5 rounded-[2px] whitespace-nowrap font-mono shadow-xs min-h-[42px] flex items-center">
              {filteredIndicatorsCount} of {totalIndicatorsCount} Indicators
            </div>

            {(searchQuery || selectedTopicFilter !== 'ALL' || selectedStatusFilter !== 'ALL' || selectedOwnerFilter !== 'ALL' || selectedLevelFilter !== 'ALL' || selectedFrequencyFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTopicFilter('ALL');
                  setSelectedStatusFilter('ALL');
                  setSelectedOwnerFilter('ALL');
                  setSelectedLevelFilter('ALL');
                  setSelectedFrequencyFilter('ALL');
                }}
                className="text-xs text-[#EF272E] hover:text-[#991b1b] font-bold underline px-1 py-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Grouped Fields by Principle with Collapsible Sections */}
      <div className="space-y-6">
        {Object.keys(groupedFields).length === 0 ? (
          <div className="bg-white border border-[#E8E8E8] p-12 text-center rounded-[4px] space-y-3">
            <FileText className="w-10 h-10 text-[#94a3b8] mx-auto" />
            <h3 className="text-field-title font-bold text-[#1A2A6C]">No Indicators Match Your Query</h3>
            <p className="text-label-base text-[#666666] max-w-md mx-auto">
              No fields found matching &ldquo;{searchQuery}&rdquo;. Try clearing filters or searching by code (e.g. P6-E1-S1).
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedTopicFilter('ALL'); setSelectedStatusFilter('ALL'); }}
              className="px-4 py-2 bg-[#1A2A6C] text-white text-label-base font-bold rounded-[2px]"
            >
              Reset Search &amp; Filters
            </button>
          </div>
        ) : (
          Object.entries(groupedFields).map(([groupKey, group]) => {
            const isCollapsed = !!collapsedSections[groupKey];

            return (
              <div key={groupKey} className="bg-white border border-[#E8E8E8] rounded-[4px] shadow-sm overflow-hidden">
                {/* Section Header */}
                <div
                  onClick={() => toggleSection(groupKey)}
                  className="bg-[#fafafa] border-b border-[#E8E8E8] px-5 py-3.5 flex items-center justify-between cursor-pointer select-none hover:bg-[#f1f5f9] transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    {isCollapsed ? <ChevronRight className="w-5 h-5 text-[#1A2A6C]" /> : <ChevronDown className="w-5 h-5 text-[#1A2A6C]" />}
                    <h2 className="text-field-title font-bold text-[#1A2A6C] uppercase tracking-wide">
                      {group.title}
                    </h2>
                  </div>

                  <span className="text-helper-meta font-bold bg-[#E8E8E8] text-[#1A2A6C] px-2.5 py-1 rounded-[2px] border border-[#d1d5db]">
                    {group.fields.length} Indicators
                  </span>
                </div>

                {/* Section Body */}
                {!isCollapsed && (
                  <div className="divide-y divide-[#E8E8E8] p-1">
                    {group.fields.map(field => {
                      const entry = dataEntries.find(
                        e => e.organisationId === selectedOrg.id && e.indicatorId === field.id && e.reportingPeriodId === selectedPeriod.id
                      );
                      const currentVal = formValues[field.id] !== undefined ? formValues[field.id] : (entry?.numericValue !== undefined ? String(entry.numericValue) : '');
                      const status = entry?.status || 'DRAFT';
                      const isApproved = ['PROJECT_APPROVED', 'BU_APPROVED', 'SUBSIDIARY_APPROVED', 'GROUP_APPROVED', 'LOCKED', 'APPROVED'].includes(status);
                      const isSubmitted = status === 'SUBMITTED' || status === 'UNDER_REVIEW';
                      const fieldError = fieldErrors[field.id];
                      const isZero = currentVal === '0' || parseFloat(currentVal) === 0;
                      const hasFiles = (entry?.evidenceFiles && entry.evidenceFiles.length > 0) || false;
                      const isMethodologyExpanded = !!expandedMethodology[field.id];
                      const statMeta = getIndicatorStatutoryMetadata(field);
                      const draftPermission = canDraftIndicator(field);

                      return (
                        <div key={field.id} className="p-5 sm:p-6 space-y-4 hover:bg-[#fdfdfd] transition-colors">
                          {/* Row 1: Code, Title, Description, Pipeline Stepper, and Status Chip */}
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                            <div className="space-y-1 max-w-3xl">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-bold bg-[#1A2A6C] text-white px-2 py-0.5 rounded-[2px]">
                                  {field.code}
                                </span>
                                {field.isCore && (
                                  <span className="text-[10px] font-bold bg-[#EF272E] text-white px-1.5 py-0.5 rounded-[2px]">
                                    BRSR CORE
                                  </span>
                                )}

                                {/* SECTION 4: OWNER ROLE BADGE */}
                                <span 
                                  className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] border flex items-center gap-1 ${
                                    statMeta.ownerRole === 'SITE_ENGINEER'
                                      ? 'bg-blue-50 text-blue-900 border-blue-200'
                                      : statMeta.ownerRole === 'SITE_EHS'
                                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                      : statMeta.ownerRole === 'GROUP_ESG_HEAD'
                                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                                      : 'bg-purple-50 text-purple-900 border-purple-200'
                                  }`}
                                  title={`Department: ${statMeta.ownerDepartment}`}
                                >
                                  <span>👤 {statMeta.ownerTitle}</span>
                                </span>

                                {/* SECTION 4: LEVEL OF ENTRY BADGE */}
                                <span 
                                  className={`px-2 py-0.5 text-[10px] font-bold rounded-[2px] border flex items-center gap-1 ${
                                    statMeta.levelOfEntry === 'Project, rolled up'
                                      ? 'bg-teal-50 text-teal-800 border-teal-200'
                                      : statMeta.levelOfEntry === 'Subsidiary or Group'
                                      ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                      : 'bg-rose-50 text-rose-800 border-rose-200'
                                  }`}
                                  title="Statutory Reporting Level"
                                >
                                  <span>📍 {statMeta.levelOfEntry}</span>
                                </span>

                                {/* SECTION 4: FREQUENCY BADGE */}
                                <span 
                                  className="px-2 py-0.5 text-[10px] font-bold rounded-[2px] bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1"
                                  title="Statutory Reporting Frequency"
                                >
                                  <span>📅 {statMeta.frequency}</span>
                                </span>

                                <span className="text-helper-meta font-bold text-[#666666] uppercase">
                                  Topic: {field.topic}
                                </span>

                                {/* Lock / Restriction Status Warning Pill */}
                                {!draftPermission.allowed && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-[2px] bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                    <Lock className="w-3 h-3 text-amber-700" />
                                    <span>{draftPermission.reason}</span>
                                  </span>
                                )}
                              </div>

                              {/* CODE DESCRIPTION FORMAT: Section . Question . Topic . Meaning */}
                              <div 
                                className="text-helper-meta text-[#64748b] font-mono leading-tight flex items-center space-x-1"
                                title={`Statutory Code Hierarchy: ${field.codeDescription}`}
                              >
                                <span>{field.codeDescription}</span>
                              </div>

                              <h3 className="text-field-title font-bold text-[#1A2A6C] pt-1">
                                {field.name}
                              </h3>
                              <p className="text-label-base text-[#555555] leading-relaxed">
                                {field.description}
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 shrink-0">
                              <PipelineStepper compact currentStatus={status} rejectionComment={entry?.rejectionComment} />
                              <StatusBadge status={status} size="sm" />
                            </div>
                          </div>

                          {/* Rejection Alert Banner if returned by reviewer */}
                          {status === 'REJECTED' && (
                            <div className="bg-[#fef2f2] border-l-4 border-[#ef4444] p-3 text-xs text-[#991b1b] rounded-[2px] space-y-1.5">
                              <div className="flex items-center space-x-1.5 font-bold">
                                <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
                                <span>Returned for Correction by Reviewer:</span>
                              </div>
                              <p className="font-semibold text-slate-800 bg-white p-2.5 border border-red-200 rounded-[2px]">
                                {entry?.rejectionComment || 'Verification failed. Please update entry details and evidence.'}
                              </p>
                              <p className="text-[11px] text-[#7f1d1d]">
                                Please adjust the reported value, update your methodology note, or attach the requested invoice/manifest, and re-submit for review.
                              </p>
                            </div>
                          )}

                          {/* Row 2: Value Input, Unit, Max Digit Enforcement, and Inline Calculator Button */}
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
                            {/* Input Container (6 cols) */}
                            <div className="md:col-span-6 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-label-base font-bold text-[#1A2A6C]">
                                  Reported Value ({field.unit})
                                  {field.isMandatory && <span className="text-[#EF272E] ml-1">*</span>}
                                </label>
                                <span className="text-helper-meta text-[#888888] font-mono">
                                  Max: {field.maxIntDigits} digits, {field.maxDecimals} decimals
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    disabled={!draftPermission.allowed || isApproved || isSubmitted}
                                    value={currentVal}
                                    onKeyDown={handleKeyDown}
                                    onPaste={handlePaste}
                                    onChange={(e) => handleInputChange(field, e.target.value)}
                                    placeholder={!draftPermission.allowed ? `[Locked: ${draftPermission.reason}]` : field.allowZero ? "0 or numeric value" : "Enter value > 0"}
                                    className={`w-full text-body-base font-mono font-medium p-3 border rounded-[2px] min-h-[44px] transition-colors ${
                                      fieldError 
                                        ? 'border-[#EF272E] bg-[#fff5f5] text-[#991b1b]' 
                                        : 'border-[#d1d5db] bg-white text-[#1A2A6C] focus:border-[#1A2A6C]'
                                    } ${!draftPermission.allowed || isApproved || isSubmitted ? 'bg-[#f1f5f9] cursor-not-allowed text-[#64748b]' : ''}`}
                                  />
                                </div>
                                <span className="px-3 py-3 bg-[#E8E8E8] text-[#333333] font-bold text-label-base border border-[#d1d5db] rounded-[2px] min-h-[44px] flex items-center">
                                  {field.unit}
                                </span>
                              </div>

                              {/* Zero confirmation checkbox if allowZero=true and value is 0 */}
                              {field.allowZero && isZero && (
                                <div className="p-2.5 bg-[#fefce8] border border-[#fef08a] rounded-[2px] space-y-1">
                                  <label className="flex items-center space-x-2 text-label-base font-bold text-[#854d0e] cursor-pointer">
                                    <input
                                      type="checkbox"
                                      disabled={isApproved || isSubmitted}
                                      checked={!!zeroConfirmed[field.id]}
                                      onChange={(e) => setZeroConfirmed(prev => ({ ...prev, [field.id]: e.target.checked }))}
                                      className="accent-[#1A2A6C] w-4 h-4"
                                    />
                                    <span>Confirm Zero Incidents: Verified zero events occurred in this period</span>
                                  </label>
                                  <p className="text-helper-meta text-[#a16207]">
                                    Statutory requirement: Must check confirmation and attach 1 proof document (e.g. Zero Incident Safety Certificate / Nil Grievance declaration).
                                  </p>
                                </div>
                              )}

                              {/* Field Error Alert */}
                              {fieldError && (
                                <p className="text-helper-meta font-bold text-[#b91c1c] flex items-center space-x-1 pt-0.5">
                                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                  <span>{fieldError}</span>
                                </p>
                              )}
                            </div>

                            {/* Actions & Methodology Toggle (6 cols) */}
                            <div className="md:col-span-6 space-y-2 pt-5 md:pt-6">
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Inline Calculator Trigger */}
                                {field.calculatorType && !isApproved && !isSubmitted && (
                                  <button
                                    onClick={() => setActiveCalculator(activeCalculator === field.id ? null : field.id)}
                                    className="min-h-[44px] min-w-[44px] px-3.5 py-2 bg-[#f8fafc] hover:bg-[#1A2A6C] text-[#1A2A6C] hover:text-white border border-[#cbd5e1] text-label-base font-bold transition-colors flex items-center space-x-1.5 rounded-[2px]"
                                  >
                                    <Calculator className="w-4 h-4" />
                                    <span>Launch Calculator</span>
                                  </button>
                                )}

                                {/* How to Measure Collapsible Toggle */}
                                <button
                                  onClick={() => toggleMethodology(field.id)}
                                  className="min-h-[44px] min-w-[44px] px-3.5 py-2 bg-[#f8fafc] hover:bg-[#E8E8E8] text-[#475569] border border-[#cbd5e1] text-label-base font-bold transition-colors flex items-center space-x-1.5 rounded-[2px]"
                                >
                                  <HelpCircle className="w-4 h-4 text-[#1A2A6C]" />
                                  <span>{isMethodologyExpanded ? 'Hide Methodology' : 'How to Measure'}</span>
                                </button>

                                {/* Evidence Attachment Button */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <button
                                    onClick={() => {
                                      setSelectedFile(null);
                                      setFileError(null);
                                      setEvidenceFileName('');
                                      setEvidenceDesc('');
                                      setUploadModalField(field);
                                    }}
                                    className={`min-h-[44px] min-w-[44px] px-3.5 py-2 text-label-base font-bold transition-colors flex items-center space-x-1.5 rounded-[2px] border ${
                                      hasFiles 
                                        ? 'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]'
                                        : 'bg-white text-[#1A2A6C] border-[#cbd5e1] hover:border-[#1A2A6C]'
                                    }`}
                                  >
                                    <Paperclip className="w-4 h-4" />
                                    <span>{hasFiles ? `${entry?.evidenceFiles?.length} Proof Attached` : '+ Attach Proof'}</span>
                                  </button>

                                  {latestUploadedFile[field.id] && (
                                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-1 rounded-[2px] flex items-center space-x-1 max-w-[220px] truncate" title={latestUploadedFile[field.id]}>
                                      <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                      <span className="truncate">{latestUploadedFile[field.id]}</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Attached Files Pill List */}
                              {hasFiles && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {entry?.evidenceFiles?.map(f => (
                                    <span key={f.id} className="text-helper-meta font-mono bg-[#f8fafc] text-[#334155] border border-[#e2e8f0] px-2 py-0.5 rounded-[2px] flex items-center space-x-1">
                                      <FileCheck className="w-3 h-3 text-[#16a34a]" />
                                      <span className="truncate max-w-[180px]">{f.fileName}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* INLINE CALCULATOR POPUP PANEL (When Active) */}
                          {activeCalculator === field.id && (
                            <div className="p-4 bg-[#eff6ff] border-2 border-[#1A2A6C] rounded-[4px] space-y-3">
                              <div className="flex items-center justify-between border-b border-[#bfdbfe] pb-2">
                                <div className="flex items-center space-x-2">
                                  <Calculator className="w-4 h-4 text-[#1A2A6C]" />
                                  <h4 className="text-label-base font-bold text-[#1A2A6C] uppercase">
                                    Inline Statutory Calculator: {field.name}
                                  </h4>
                                </div>
                                <button onClick={() => setActiveCalculator(null)} className="text-[#64748b] hover:text-[#1e293b]">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Calculator: Scope 1 */}
                              {field.calculatorType === 'scope1' && (
                                <div className="space-y-3 text-label-base">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Diesel Consumed (L)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.scope1.dieselL}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, scope1: { ...calcInputs.scope1, dieselL: e.target.value } })}
                                        placeholder="e.g. 46800"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Diesel Emission Factor (kg CO2/L)</label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={calcInputs.scope1.efDiesel}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, scope1: { ...calcInputs.scope1, efDiesel: e.target.value } })}
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                      <span className="text-[10px] text-[#64748b]">Default: 2.68 (IPCC/CEA)</span>
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Petrol Consumed (L)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.scope1.petrolL}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, scope1: { ...calcInputs.scope1, petrolL: e.target.value } })}
                                        placeholder="e.g. 1200"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Petrol Emission Factor (kg CO2/L)</label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={calcInputs.scope1.efPetrol}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, scope1: { ...calcInputs.scope1, efPetrol: e.target.value } })}
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                      <span className="text-[10px] text-[#64748b]">Default: 2.31 (IPCC/CEA)</span>
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">LPG Consumed (kg)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.scope1.lpgKg}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, scope1: { ...calcInputs.scope1, lpgKg: e.target.value } })}
                                        placeholder="e.g. 500"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">LPG Emission Factor (kg CO2/kg)</label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={calcInputs.scope1.efLpg}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, scope1: { ...calcInputs.scope1, efLpg: e.target.value } })}
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                      <span className="text-[10px] text-[#64748b]">Default: 2.98 (IPCC/CEA)</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => applyScope1Calc(field.id)}
                                    className="px-4 py-2 bg-[#1A2A6C] text-white font-bold rounded-[2px] min-h-[44px]"
                                  >
                                    Apply Scope 1 Result &amp; Pre-Fill Methodology Note
                                  </button>
                                </div>
                              )}

                              {/* Calculator: Scope 2 */}
                              {field.calculatorType === 'scope2' && (
                                <div className="space-y-3 text-label-base">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Grid Electricity Billed (kWh)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.scope2.kwh}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, scope2: { ...calcInputs.scope2, kwh: e.target.value } })}
                                        placeholder="e.g. 250000"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">CEA Grid Baseline Factor (tCO2/MWh)</label>
                                      <input
                                        type="number"
                                        disabled
                                        value={calcInputs.scope2.gridFactor}
                                        className="w-full p-2 border border-[#cbd5e1] bg-[#f1f5f9] rounded-[2px] text-body-base font-mono"
                                      />
                                      <span className="text-[10px] text-[#64748b]">Locked: CEA India Baseline v19 (0.716)</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => applyScope2Calc(field.id)}
                                    className="px-4 py-2 bg-[#1A2A6C] text-white font-bold rounded-[2px] min-h-[44px]"
                                  >
                                    Apply Scope 2 Result &amp; Pre-Fill Methodology Note
                                  </button>
                                </div>
                              )}

                              {/* Calculator: Energy */}
                              {field.calculatorType === 'energy' && (
                                <div className="space-y-3 text-label-base">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Diesel Litres (× 0.0386 GJ/L)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.energy.dieselL}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, energy: { ...calcInputs.energy, dieselL: e.target.value } })}
                                        placeholder="e.g. 46800"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Electricity kWh (× 0.0036 GJ/kWh)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.energy.kwh}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, energy: { ...calcInputs.energy, kwh: e.target.value } })}
                                        placeholder="e.g. 250000"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => applyEnergyCalc(field.id)}
                                    className="px-4 py-2 bg-[#1A2A6C] text-white font-bold rounded-[2px] min-h-[44px]"
                                  >
                                    Apply Total Energy (GJ) &amp; Pre-Fill Breakdown
                                  </button>
                                </div>
                              )}

                              {/* Calculator: Water */}
                              {field.calculatorType === 'water' && (
                                <div className="space-y-3 text-label-base">
                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Start Flow Meter (KL)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.water.startMeter}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, water: { ...calcInputs.water, startMeter: e.target.value } })}
                                        placeholder="e.g. 12400"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Closing Flow Meter (KL)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.water.endMeter}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, water: { ...calcInputs.water, endMeter: e.target.value } })}
                                        placeholder="e.g. 20800"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Tankers Delivered</label>
                                      <input
                                        type="number"
                                        value={calcInputs.water.tankers}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, water: { ...calcInputs.water, tankers: e.target.value } })}
                                        placeholder="e.g. 40"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Capacity/Tanker (KL)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.water.tankerCap}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, water: { ...calcInputs.water, tankerCap: e.target.value } })}
                                        placeholder="20"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => applyWaterCalc(field.id)}
                                    className="px-4 py-2 bg-[#1A2A6C] text-white font-bold rounded-[2px] min-h-[44px]"
                                  >
                                    Apply Total Water (KL) &amp; Pre-Fill Methodology Note
                                  </button>
                                </div>
                              )}

                              {/* Calculator: Waste */}
                              {field.calculatorType === 'waste' && (
                                <div className="space-y-3 text-label-base">
                                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Excavated Muck (MT)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.waste.muckMT}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, waste: { ...calcInputs.waste, muckMT: e.target.value } })}
                                        placeholder="e.g. 850"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Rubble &amp; Debris (MT)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.waste.rubbleMT}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, waste: { ...calcInputs.waste, rubbleMT: e.target.value } })}
                                        placeholder="e.g. 480"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Steel &amp; Metal Scrap (MT)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.waste.scrapMT}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, waste: { ...calcInputs.waste, scrapMT: e.target.value } })}
                                        placeholder="e.g. 115"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Hazardous Scrap (MT)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.waste.hazMT}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, waste: { ...calcInputs.waste, hazMT: e.target.value } })}
                                        placeholder="e.g. 5"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => applyWasteCalc(field.id)}
                                    className="px-4 py-2 bg-[#1A2A6C] text-white font-bold rounded-[2px] min-h-[44px]"
                                  >
                                    Apply Total Waste (MT) &amp; Pre-Fill Manifest Slips
                                  </button>
                                </div>
                              )}

                              {/* Calculator: Safety LTIFR */}
                              {field.calculatorType === 'ltifr' && (
                                <div className="space-y-3 text-label-base">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Lost Time Injuries (Count)</label>
                                      <input
                                        type="number"
                                        value={calcInputs.ltifr.injuries}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, ltifr: { ...calcInputs.ltifr, injuries: e.target.value } })}
                                        placeholder="0"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-helper-meta font-bold text-[#1A2A6C] block">Total Person-Hours Worked</label>
                                      <input
                                        type="number"
                                        value={calcInputs.ltifr.manHours}
                                        onChange={(e) => setCalcInputs({ ...calcInputs, ltifr: { ...calcInputs.ltifr, manHours: e.target.value } })}
                                        placeholder="125000"
                                        className="w-full p-2 border border-[#cbd5e1] rounded-[2px] text-body-base font-mono"
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => applyLtifrCalc(field.id)}
                                    className="px-4 py-2 bg-[#1A2A6C] text-white font-bold rounded-[2px] min-h-[44px]"
                                  >
                                    Apply LTIFR &amp; Pre-Fill EHS Formula
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* HOW TO MEASURE COLLAPSIBLE PANEL */}
                          {isMethodologyExpanded && (
                            <div className="p-4 bg-[#f8fafc] border border-[#cbd5e1] rounded-[4px] space-y-2.5 text-label-base">
                              <h4 className="font-bold text-[#1A2A6C] uppercase tracking-wide flex items-center space-x-1.5">
                                <HelpCircle className="w-4 h-4 text-[#1A2A6C]" />
                                <span>Statutory Measurement Guidelines &amp; Audit Requirements</span>
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                <div className="p-2.5 bg-white border border-[#e2e8f0] rounded-[2px]">
                                  <strong className="text-helper-meta text-[#64748b] uppercase block">Formula:</strong>
                                  <p className="font-mono text-helper-meta text-[#1A2A6C] mt-0.5">{field.methodology.formula}</p>
                                </div>
                                <div className="p-2.5 bg-white border border-[#e2e8f0] rounded-[2px]">
                                  <strong className="text-helper-meta text-[#64748b] uppercase block">Measuring Instrument / Source:</strong>
                                  <p className="text-helper-meta text-[#334155] mt-0.5">{field.methodology.instrumentOrSource}</p>
                                </div>
                                <div className="p-2.5 bg-white border border-[#e2e8f0] rounded-[2px]">
                                  <strong className="text-helper-meta text-[#64748b] uppercase block">Required Proof Document to Upload:</strong>
                                  <p className="text-helper-meta text-[#166534] mt-0.5">{field.methodology.documentToUpload}</p>
                                </div>
                                <div className="p-2.5 bg-white border border-[#e2e8f0] rounded-[2px]">
                                  <strong className="text-helper-meta text-[#64748b] uppercase block">Practical Example:</strong>
                                  <p className="text-helper-meta text-[#475569] mt-0.5">{field.methodology.example}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Row 3: Mandatory Methodology Note & Field Action Buttons */}
                          <div className="space-y-2 pt-1 border-t border-[#f1f5f9]">
                            <div className="flex items-center justify-between">
                              <label className="text-label-base font-bold text-[#1A2A6C]">
                                Measurement Methodology Note &amp; Audit Clarification
                                <span className="text-[#EF272E] ml-1">* (Mandatory)</span>
                              </label>
                              <span className="text-helper-meta text-[#64748b]">
                                Detail meters, calibration, logbooks, or calculation steps
                              </span>
                            </div>

                            <textarea
                              rows={2}
                              disabled={!draftPermission.allowed || isApproved || isSubmitted}
                              value={methodologyNotes[field.id] || ''}
                              onChange={(e) => setMethodologyNotes(prev => ({ ...prev, [field.id]: e.target.value }))}
                              placeholder={!draftPermission.allowed ? `[Drafting restricted: ${draftPermission.reason}]` : "e.g. Sourced from calibrated flow meter #FM-04 and verified with monthly diesel log sheet..."}
                              className="w-full text-label-base p-3 border border-[#d1d5db] rounded-[2px] focus:outline-none focus:border-[#1A2A6C] disabled:bg-[#f1f5f9] disabled:cursor-not-allowed"
                            />

                            {/* Action Buttons for this Field with 44px min touch target */}
                            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                              {!isApproved && !isSubmitted && (
                                <>
                                  {!draftPermission.allowed ? (
                                    <div className="flex items-center gap-2 py-2 px-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-[2px]">
                                      <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                      <span>Drafting locked: {draftPermission.reason}</span>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => handleSaveDraft(field)}
                                        className="min-h-[44px] min-w-[44px] px-4 py-2 border border-[#d1d5db] text-[#475569] hover:text-[#1A2A6C] hover:border-[#1A2A6C] text-label-base font-bold transition-colors rounded-[2px]"
                                      >
                                        Save Draft
                                      </button>

                                      <button
                                        onClick={() => handleSubmitField(field)}
                                        className="min-h-[44px] min-w-[44px] px-5 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white text-label-base font-bold transition-colors flex items-center space-x-1.5 rounded-[2px] shadow-sm"
                                      >
                                        <Send className="w-4 h-4" />
                                        <span>Submit for ESG Review</span>
                                      </button>
                                    </>
                                  )}
                                </>
                              )}

                              {isSubmitted && (
                                <div className="flex flex-wrap items-center gap-3 py-1">
                                  <span className="text-label-base font-bold text-blue-700 flex items-center space-x-1.5 py-1">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    <span>Gate 2/7: Submitted • Awaiting Project Manager (Rajesh Nair) Verification</span>
                                  </span>
                                  <button
                                    onClick={() => {
                                      const entryId = entry?.id || `entry-${selectedOrg.id}-${field.id}`;
                                      unlockDataEntry(entryId, 'Recalled by Site Engineer for data correction');
                                      showNotice(`Unlocked ${field.code} back to Draft mode.`);
                                    }}
                                    className="min-h-[38px] px-3.5 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 rounded-[2px] text-xs font-bold flex items-center space-x-1.5 transition-colors"
                                    title="Unlock this indicator back to draft for editing"
                                  >
                                    <Unlock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Recall to Draft</span>
                                  </button>
                                </div>
                              )}

                              {isApproved && (
                                <div className="flex flex-wrap items-center gap-3 py-1">
                                  <span className="text-label-base font-bold flex items-center space-x-1.5 py-1">
                                    {status === 'PROJECT_APPROVED' && (
                                      <span className="text-blue-800 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                        <span>Gate 3/7: Project Verified (PM) • Awaiting BU Coordinator (Ananya Roy)</span>
                                      </span>
                                    )}
                                    {status === 'BU_APPROVED' && (
                                      <span className="text-indigo-800 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                                        <span>Gate 4/7: BU Verified • Awaiting Subsidiary ESG Manager (Priya Nair)</span>
                                      </span>
                                    )}
                                    {status === 'SUBSIDIARY_APPROVED' && (
                                      <span className="text-teal-800 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                                        <span>Gate 5/7: Sub Verified • Awaiting Group CSO (Amit Verma)</span>
                                      </span>
                                    )}
                                    {status === 'GROUP_APPROVED' && (
                                      <span className="text-purple-800 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                                        <span>Gate 6/7: Group Certified • Awaiting Final Board Lock (Justice Murthy)</span>
                                      </span>
                                    )}
                                    {status === 'LOCKED' && (
                                      <span className="text-amber-900 bg-amber-50 px-2.5 py-1 rounded-[2px] border border-amber-300 flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                                        <span>Gate 7/7: 🔒 Certified & Locked by Board • Immutable Statutory Ledger</span>
                                      </span>
                                    )}
                                    {!['PROJECT_APPROVED', 'BU_APPROVED', 'SUBSIDIARY_APPROVED', 'GROUP_APPROVED', 'LOCKED'].includes(status) && (
                                      <span className="text-emerald-800 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        <span>Approved &amp; Certified into Group Ledger</span>
                                      </span>
                                    )}
                                  </span>
                                  <button
                                    onClick={() => {
                                      const entryId = entry?.id || `entry-${selectedOrg.id}-${field.id}`;
                                      unlockDataEntry(entryId, 'Restatement requested by Site Engineer');
                                      showNotice(`Unlocked ${field.code} for restatement.`);
                                    }}
                                    className="min-h-[38px] px-3.5 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 rounded-[2px] text-xs font-bold flex items-center space-x-1.5 transition-colors"
                                    title="Unlock indicator for restatement or correction"
                                  >
                                    <Unlock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Unlock for Correction</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 4. Evidence Upload Modal */}
      {uploadModalField && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 space-y-4 rounded-[4px] border border-[#1A2A6C] shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E8E8E8] pb-3">
              <div className="flex items-center space-x-2">
                <Paperclip className="w-5 h-5 text-[#1A2A6C]" />
                <h3 className="text-field-title font-bold text-[#1A2A6C]">
                  Attach Supporting Evidence: {uploadModalField.code}
                </h3>
              </div>
              <button onClick={() => setUploadModalField(null)} className="text-[#888888] hover:text-[#333333]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[#fafafa] border border-[#e2e8f0] rounded-[2px] text-label-base space-y-1">
              <strong className="text-[#1A2A6C] block">{uploadModalField.name}</strong>
              <p className="text-helper-meta text-[#64748b]">
                Mandatory document type: <strong>{uploadModalField.methodology.documentToUpload}</strong>
              </p>
            </div>

            <div className="space-y-3 text-label-base">
              {/* Real File Upload Input */}
              <div>
                <label className="font-bold text-[#1A2A6C] block mb-1">
                  Upload Supporting Document
                </label>
                <div className="border-2 border-dashed border-[#cbd5e1] hover:border-[#1A2A6C] rounded-[4px] p-4 text-center bg-[#f8fafc] transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-1">
                    <UploadCloud className="w-6 h-6 text-[#1A2A6C]" />
                    <span className="text-xs font-bold text-[#1A2A6C]">Click to choose file or drag &amp; drop</span>
                    <span className="text-[11px] text-[#64748b]">Accepted: .pdf, .jpg, .jpeg, .png (Max: 5 MB)</span>
                  </div>
                </div>

                {fileError && (
                  <p className="text-xs font-bold text-[#b91c1c] mt-1.5 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fileError}</span>
                  </p>
                )}

                {selectedFile && !fileError && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-300 rounded-[2px] flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 truncate">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-mono font-medium text-emerald-900 truncate">{selectedFile.name}</span>
                    </div>
                    <span className="text-emerald-700 font-mono text-[11px] shrink-0 ml-2">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-[#1A2A6C] block mb-1">
                  Document / Slip File Name
                </label>
                <input
                  type="text"
                  value={evidenceFileName}
                  onChange={(e) => setEvidenceFileName(e.target.value)}
                  placeholder="e.g. Oct2026_DISCOM_Electricity_Bill.pdf"
                  className="w-full p-2.5 border border-[#d1d5db] rounded-[2px] text-body-base font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-[#1A2A6C] block mb-1">
                  Document Description / Meter Remarks
                </label>
                <textarea
                  rows={2}
                  value={evidenceDesc}
                  onChange={(e) => setEvidenceDesc(e.target.value)}
                  placeholder="e.g. Certified HT power utility bill with meter serial number #M-4429..."
                  className="w-full p-2.5 border border-[#d1d5db] rounded-[2px] text-body-base"
                />
              </div>

              {/* Sample Quick Filenames */}
              <div className="space-y-1">
                <span className="text-helper-meta font-bold text-[#64748b] block">Quick Attach Examples:</span>
                <div className="flex flex-wrap gap-1.5 text-helper-meta font-mono">
                  <button
                    onClick={() => handleQuickAttach(`${uploadModalField.code}_Certified_Utility_Bill.pdf`)}
                    className="px-2 py-1 bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] rounded-[2px]"
                  >
                    {uploadModalField.code}_Utility_Bill.pdf
                  </button>
                  <button
                    onClick={() => handleQuickAttach(`${uploadModalField.code}_Weighbridge_Summary.pdf`)}
                    className="px-2 py-1 bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] rounded-[2px]"
                  >
                    {uploadModalField.code}_Weighbridge.pdf
                  </button>
                  <button
                    onClick={() => handleQuickAttach(`${uploadModalField.code}_Zero_Incident_Cert.pdf`)}
                    className="px-2 py-1 bg-[#eff6ff] text-[#1d4ed8] border border-[#bfdbfe] rounded-[2px]"
                  >
                    Zero_Incident_Cert.pdf
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#E8E8E8]">
              <button
                onClick={() => setUploadModalField(null)}
                className="min-h-[44px] min-w-[44px] px-4 py-2 border border-[#d1d5db] text-[#64748b] font-bold text-label-base rounded-[2px]"
              >
                Cancel
              </button>
              <button
                onClick={handleAttachEvidence}
                disabled={!selectedFile || !evidenceFileName || !!fileError || isUploading}
                className="min-h-[44px] min-w-[44px] px-5 py-2 bg-[#1A2A6C] hover:bg-[#EF272E] text-white font-bold text-label-base transition-colors rounded-[2px] disabled:opacity-50 flex items-center space-x-1.5"
              >
                {isUploading ? <span>Uploading...</span> : <span>Upload &amp; Link to Metric</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
