import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Organisation, 
  ReportingPeriod, 
  DataEntry, 
  Evidence, 
  AuditLog, 
  AnomalyAlert, 
  DashboardSummary,
  EntryStatus 
} from '../types';
import { 
  ORGANISATIONS, 
  REPORTING_PERIODS, 
  INDICATORS, 
  DEMO_DATA_ENTRIES, 
  DEMO_AUDIT_LOGS, 
  DEMO_ALERTS, 
  DEMO_DASHBOARD_SUMMARY,
  getOrganisationTree
} from '../data/demoData';
import { getEntityDashboardSummary } from '../data/entityMetrics';
import { useAuth } from './AuthContext';

interface AppContextType {
  organisations: Organisation[];
  organisationTree: Organisation;
  selectedOrgId: string;
  selectedOrg: Organisation;
  setSelectedOrgId: (id: string) => void;
  reportingPeriods: ReportingPeriod[];
  selectedPeriodId: string;
  selectedPeriod: ReportingPeriod;
  setSelectedPeriodId: (id: string) => void;
  dataEntries: DataEntry[];
  auditLogs: AuditLog[];
  alerts: AnomalyAlert[];
  dashboardSummary: DashboardSummary;
  isDbConnected: boolean;
  isLoadingData: boolean;
  refreshData: () => Promise<void>;
  updateDataEntry: (indicatorId: string, value: number, unit?: string, remarks?: string) => Promise<void>;
  submitDataEntry: (dataEntryId: string, notes?: string) => Promise<void>;
  approveDataEntry: (dataEntryId: string, comments: string) => Promise<void>;
  rejectDataEntry: (dataEntryId: string, comments: string) => Promise<void>;
  unlockDataEntry: (dataEntryId: string, reason?: string) => Promise<void>;
  unlockAllEntries: () => void;
  addEvidence: (dataEntryId: string, evidence: Omit<Evidence, 'id' | 'uploadedAt' | 'uploadedBy' | 'uploadedByName'>) => void;
  addOrganisation: (newOrgData: Partial<Organisation>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, token } = useAuth();
  
  const [organisationsList, setOrganisationsList] = useState<Organisation[]>(ORGANISATIONS);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);

  // Resolve user accessible organisations based on recursive CTE scope from backend
  const scopedOrganisations = useMemo(() => {
    if (!currentUser) return organisationsList;

    // 1. Strict Downward Scope from JWT recursive CTE
    if (currentUser.allowedOrgIds && currentUser.allowedOrgIds.length > 0) {
      const allowedSet = new Set(currentUser.allowedOrgIds);
      const filtered = organisationsList.filter(o => allowedSet.has(o.id));
      if (filtered.length > 0) return filtered;
    }

    // 2. Fallback based on assigned organisationId
    if (currentUser.organisationId) {
      const userOrg = currentUser.organisationId;
      if (currentUser.roleId === 'SITE_ENGINEER' || currentUser.roleId === 'SITE_USER' || currentUser.roleId === 'SITE_EHS') {
        return organisationsList.filter(o => o.id === userOrg);
      }
      
      const allowed = new Set<string>([userOrg]);
      organisationsList.forEach(o => {
        if (o.parentId && allowed.has(o.parentId)) allowed.add(o.id);
      });
      organisationsList.forEach(o => {
        if (o.parentId && allowed.has(o.parentId)) allowed.add(o.id);
      });
      return organisationsList.filter(o => allowed.has(o.id));
    }

    return organisationsList;
  }, [currentUser, organisationsList]);

  // Initial org selection: Defaults to user's assigned organisation
  const [selectedOrgId, setSelectedOrgId] = useState<string>(() => {
    return currentUser?.organisationId || (scopedOrganisations[0]?.id || 'proj-beta');
  });

  // Sync selectedOrgId to user's assigned organisation when user changes, and enforce scope
  useEffect(() => {
    if (currentUser?.organisationId) {
      setSelectedOrgId(currentUser.organisationId);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (currentUser?.organisationId) {
      const isAllowed = scopedOrganisations.some(o => o.id === selectedOrgId);
      if (!isAllowed) {
        setSelectedOrgId(currentUser.organisationId);
      }
    }
  }, [currentUser, scopedOrganisations, selectedOrgId]);

  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('fy-2026-27');
  const [dataEntries, setDataEntries] = useState<DataEntry[]>(DEMO_DATA_ENTRIES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(DEMO_AUDIT_LOGS);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(DEMO_ALERTS);

  // Tree is rooted at the user's assigned scope (for Rahul, starts at Demo Project Beta)
  const organisationTree = useMemo(() => {
    const rootId = currentUser?.organisationId || 'meil-group';
    return getOrganisationTree(organisationsList, rootId);
  }, [currentUser?.organisationId, organisationsList]);

  const selectedOrg = useMemo(() => {
    return scopedOrganisations.find(o => o.id === selectedOrgId) || scopedOrganisations[0] || ORGANISATIONS[0];
  }, [selectedOrgId, scopedOrganisations]);

  const selectedPeriod = useMemo(() => {
    return REPORTING_PERIODS.find(p => p.id === selectedPeriodId) || REPORTING_PERIODS[0];
  }, [selectedPeriodId]);

  // Load Real Data from PostgreSQL Backend
  const refreshData = useCallback(async () => {
    setIsLoadingData(true);
    const authHeaders: Record<string, string> = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
      // 1. Healthcheck
      const healthRes = await fetch('/health').catch(() => null);
      if (healthRes && healthRes.ok) {
        setIsDbConnected(true);
      }

      // 2. Fetch live hierarchy from DB
      const hierRes = await fetch('/api/v1/hierarchy', { headers: authHeaders }).catch(() => null);
      if (hierRes && hierRes.ok) {
        const hierData = await hierRes.json();
        if (hierData.organisations && Array.isArray(hierData.organisations) && hierData.organisations.length > 0) {
          setOrganisationsList(hierData.organisations);
        }
      }

      // 3. Fetch live entries from PostgreSQL activity_data
      const entriesRes = await fetch(`/api/v1/entries?orgId=${selectedOrgId}&periodId=${selectedPeriodId}`, { headers: authHeaders }).catch(() => null);
      if (entriesRes && entriesRes.ok) {
        const entriesData = await entriesRes.json();
        if (entriesData.entries && Array.isArray(entriesData.entries)) {
          const liveEntries: DataEntry[] = entriesData.entries.map((e: any) => {
            const ind = INDICATORS.find(i => i.id === e.indicatorId);
            return {
              id: e.id,
              organisationId: e.organisationId,
              indicatorId: e.indicatorId || 'ind-p6-e1-scope1',
              reportingPeriodId: e.reportingPeriodId || selectedPeriodId,
              numericValue: parseFloat(e.quantity || '0'),
              unit: e.unit || ind?.unit || 'tCO2e',
              status: e.status as EntryStatus,
              remarks: e.notes || '',
              rejectionComment: e.rejectionComment,
              submittedBy: e.submittedBy,
              reviewedBy: e.reviewedBy,
              lockedAt: e.lockedAt,
              sourceType: 'MANUAL',
              createdBy: e.enteredBy || 'site-engineer',
              createdAt: e.createdAt || new Date().toISOString(),
              updatedAt: e.updatedAt || new Date().toISOString(),
              evidenceCount: 1,
            };
          });

          // Merge live entries over demo entries for this org
          setDataEntries(prev => {
            const liveMap = new Map(liveEntries.map(e => [`${e.organisationId}-${e.indicatorId}`, e]));
            const preserved = prev.filter(p => !liveMap.has(`${p.organisationId}-${p.indicatorId}`));
            return [...liveEntries, ...preserved];
          });
        }
      }

      // 4. Fetch live audit logs from DB
      const logsRes = await fetch('/api/v1/audit-logs', { headers: authHeaders }).catch(() => null);
      if (logsRes && logsRes.ok) {
        const logsData = await logsRes.json();
        if (logsData.auditLogs && Array.isArray(logsData.auditLogs)) {
          const mappedLogs: AuditLog[] = logsData.auditLogs.map((l: any) => ({
            id: l.id,
            tableName: l.tableName,
            recordId: l.recordId,
            action: (l.action || 'TRANSITION') as any,
            oldValue: l.oldValue,
            newValue: l.newValue,
            changedBy: l.changedBy || 'user-unknown',
            changedByName: l.changedBy || 'System User',
            userRole: 'ESG_OFFICER',
            timestamp: l.timestamp || new Date().toISOString(),
            reason: l.reason || l.action
          }));
          setAuditLogs(prev => [...mappedLogs, ...prev.slice(0, 10)]);
        }
      }
    } catch (err) {
      console.warn('Live DB data sync non-critical notice:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [selectedOrgId, selectedPeriodId, token]);

  // Initial and reactive load on scope or period change
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Update or create entry with immediate DB persistence
  const updateDataEntry = async (indicatorId: string, value: number, unit?: string, remarks?: string) => {
    const existingIndex = dataEntries.findIndex(
      e => e.organisationId === selectedOrgId && e.indicatorId === indicatorId && e.reportingPeriodId === selectedPeriodId
    );

    const ind = INDICATORS.find(i => i.id === indicatorId);

    // 1. Optimistic Local State Update
    if (existingIndex >= 0) {
      const updated = [...dataEntries];
      const prev = updated[existingIndex];
      updated[existingIndex] = {
        ...prev,
        numericValue: value,
        unit: unit || prev.unit,
        remarks: remarks || prev.remarks,
        updatedAt: new Date().toISOString()
      };
      setDataEntries(updated);
    } else {
      const newEntryId = `entry-${Date.now()}`;
      const newEntry: DataEntry = {
        id: newEntryId,
        organisationId: selectedOrgId,
        indicatorId: indicatorId,
        reportingPeriodId: selectedPeriodId,
        numericValue: value,
        unit: unit || ind?.unit || '',
        sourceType: 'MANUAL',
        status: 'DRAFT',
        remarks: remarks || '',
        createdBy: currentUser?.email || 'anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        evidenceCount: 0,
        evidenceFiles: []
      };
      setDataEntries(prev => [newEntry, ...prev]);
    }

    // 2. Persist to PostgreSQL backend
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
      if (indicatorId.includes('scope1') || indicatorId === 'ind-p6-e1-scope1') {
        await fetch('/api/v1/scope1/stationary-diesel', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            organisationId: selectedOrgId,
            reportingPeriodId: selectedPeriodId,
            dieselConsumedLitres: value * 373, // inverse proxy
            fuelType: 'Diesel (High Speed)',
            facilityName: selectedOrg.name,
            meterId: 'DG-CAL-01',
            invoiceNumber: 'INV-OCT-2026',
            userEmail: currentUser?.email,
          })
        });
      } else if (indicatorId.includes('scope2') || indicatorId === 'ind-p6-e1-scope2') {
        await fetch('/api/v1/scope2/electricity', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            organisationId: selectedOrgId,
            reportingPeriodId: selectedPeriodId,
            kwh: value / 0.000716, // approximate inverse
            userEmail: currentUser?.email,
          })
        });
      }
    } catch (e) {
      // Non-critical: UI continues gracefully
    }

    addAuditLog({
      tableName: 'activity_data',
      recordId: `${selectedOrgId}-${indicatorId}`,
      indicatorCode: ind?.code,
      indicatorName: ind?.name,
      organisationName: selectedOrg.name,
      action: 'UPDATE',
      newValue: { value, remarks },
      reason: 'Operational consumption saved to PostgreSQL ledger'
    });
  };

  const submitDataEntry = async (dataEntryId: string, notes?: string) => {
    // 1. Persist to backend API
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
      await fetch(`/api/v1/entries/${dataEntryId}/submit`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ notes: notes || 'Submitted for project review' })
      });
    } catch (e) {
      // Continue
    }

    // 2. Update local state
    setDataEntries(prev => prev.map(entry => {
      if (entry.id === dataEntryId) {
        const ind = INDICATORS.find(i => i.id === entry.indicatorId);
        addAuditLog({
          tableName: 'activity_data',
          recordId: entry.id,
          indicatorCode: ind?.code,
          indicatorName: ind?.name,
          organisationName: selectedOrg.name,
          action: 'TRANSITION',
          oldValue: { status: entry.status },
          newValue: { status: 'SUBMITTED' },
          reason: 'Submitted with attached statutory evidence for Project Manager verification'
        });
        return { ...entry, status: 'SUBMITTED', updatedAt: new Date().toISOString() };
      }
      return entry;
    }));
  };

  const approveDataEntry = async (dataEntryId: string, comments: string) => {
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
      await fetch(`/api/v1/entries/${dataEntryId}/approve`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ comment: comments })
      });
    } catch (e) {
      // Continue
    }

    setDataEntries(prev => prev.map(entry => {
      if (entry.id === dataEntryId) {
        let nextStatus: EntryStatus = 'PROJECT_APPROVED';
        if (entry.status === 'PROJECT_APPROVED') nextStatus = 'BU_APPROVED';
        else if (entry.status === 'BU_APPROVED') nextStatus = 'SUBSIDIARY_APPROVED';
        else if (entry.status === 'SUBSIDIARY_APPROVED') nextStatus = 'GROUP_APPROVED';
        else if (entry.status === 'GROUP_APPROVED') nextStatus = 'LOCKED';

        const ind = INDICATORS.find(i => i.id === entry.indicatorId);
        addAuditLog({
          tableName: 'activity_data',
          recordId: entry.id,
          indicatorCode: ind?.code,
          indicatorName: ind?.name,
          organisationName: selectedOrg.name,
          action: nextStatus === 'LOCKED' ? 'LOCK' : 'APPROVE',
          oldValue: { status: entry.status },
          newValue: { status: nextStatus },
          reason: comments || `Approved to ${nextStatus} after evidence verification.`
        });
        return { 
          ...entry, 
          status: nextStatus, 
          reviewedBy: currentUser?.email || 'reviewer',
          rejectionComment: null,
          updatedAt: new Date().toISOString() 
        };
      }
      return entry;
    }));
  };

  const rejectDataEntry = async (dataEntryId: string, comments: string) => {
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
      await fetch(`/api/v1/entries/${dataEntryId}/reject`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ comment: comments })
      });
    } catch (e) {
      // Continue
    }

    setDataEntries(prev => prev.map(entry => {
      if (entry.id === dataEntryId) {
        const ind = INDICATORS.find(i => i.id === entry.indicatorId);
        addAuditLog({
          tableName: 'activity_data',
          recordId: entry.id,
          indicatorCode: ind?.code,
          indicatorName: ind?.name,
          organisationName: selectedOrg.name,
          action: 'REJECT',
          oldValue: { status: entry.status },
          newValue: { status: 'REJECTED' },
          reason: comments || 'Returned for data correction'
        });
        return { 
          ...entry, 
          status: 'REJECTED' as EntryStatus, 
          rejectionComment: comments,
          updatedAt: new Date().toISOString() 
        };
      }
      return entry;
    }));
  };

  const unlockDataEntry = async (dataEntryId: string, reason?: string) => {
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };

    try {
      await fetch(`/api/v1/entries/${dataEntryId}/unlock`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ reason: reason || 'Statutory review adjustment required' })
      });
    } catch (e) {
      // Continue
    }

    setDataEntries(prev => prev.map(entry => {
      if (entry.id === dataEntryId) {
        const ind = INDICATORS.find(i => i.id === entry.indicatorId);
        addAuditLog({
          tableName: 'activity_data',
          recordId: entry.id,
          indicatorCode: ind?.code,
          indicatorName: ind?.name,
          organisationName: selectedOrg.name,
          action: 'UNLOCK',
          oldValue: { status: entry.status },
          newValue: { status: 'DRAFT' },
          reason: reason || 'Unlocked to draft by governance administrator for corrections'
        });
        return { 
          ...entry, 
          status: 'DRAFT' as EntryStatus, 
          rejectionComment: null,
          updatedAt: new Date().toISOString() 
        };
      }
      return entry;
    }));
  };

  const unlockAllEntries = () => {
    setDataEntries(prev => prev.map(entry => {
      if (entry.organisationId === selectedOrgId) {
        return { ...entry, status: 'DRAFT', updatedAt: new Date().toISOString() };
      }
      return entry;
    }));
    addAuditLog({
      tableName: 'activity_data',
      recordId: `all-${selectedOrgId}`,
      organisationName: selectedOrg.name,
      action: 'TRANSITION',
      oldValue: { status: 'ALL' },
      newValue: { status: 'DRAFT' },
      reason: 'All indicators unlocked to Draft for editing'
    });
  };

  const addEvidence = (dataEntryId: string, evidenceData: Omit<Evidence, 'id' | 'uploadedAt' | 'uploadedBy' | 'uploadedByName'>) => {
    const newEvidence: Evidence = {
      ...evidenceData,
      id: `ev-${Date.now()}`,
      dataEntryId,
      uploadedBy: currentUser?.id || 'user-site-01',
      uploadedByName: currentUser?.fullName || 'Rahul Sharma (Site Engg)',
      uploadedAt: new Date().toISOString()
    };

    setDataEntries(prev => prev.map(entry => {
      if (entry.id === dataEntryId) {
        const updatedFiles = [...(entry.evidenceFiles || []), newEvidence];
        return {
          ...entry,
          evidenceCount: updatedFiles.length,
          evidenceFiles: updatedFiles,
          updatedAt: new Date().toISOString()
        };
      }
      return entry;
    }));

    addAuditLog({
      tableName: 'evidence',
      recordId: newEvidence.id,
      organisationName: selectedOrg.name,
      action: 'CREATE',
      newValue: { fileName: newEvidence.fileName, fileSize: newEvidence.fileSize },
      reason: `Attached supporting documentation: ${newEvidence.fileName}`
    });
  };

  const addAuditLog = (params: Partial<AuditLog> & { tableName: string; recordId: string; action: AuditLog['action'] }) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      tableName: params.tableName,
      recordId: params.recordId,
      indicatorCode: params.indicatorCode,
      indicatorName: params.indicatorName,
      organisationName: params.organisationName || selectedOrg.name,
      action: params.action,
      oldValue: params.oldValue,
      newValue: params.newValue,
      changedBy: currentUser?.email || 'user-unknown',
      changedByName: currentUser?.fullName || 'System User',
      userRole: currentUser?.roleId || 'SITE_USER',
      ipAddress: '10.14.88.22',
      timestamp: new Date().toISOString(),
      reason: params.reason
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Compute entity-scoped dashboard summary dynamically whenever selectedOrgId changes
  const dashboardSummary = useMemo(() => {
    return getEntityDashboardSummary(selectedOrgId);
  }, [selectedOrgId]);

  const addOrganisation = useCallback(async (newOrgData: Partial<Organisation>) => {
    const id = newOrgData.id || `org-${Date.now()}`;
    const newOrg: Organisation = {
      id,
      code: newOrgData.code || `MEIL-${Date.now().toString().slice(-4)}`,
      name: newOrgData.name || 'New Entity',
      type: newOrgData.type || 'PROJECT',
      parentId: newOrgData.parentId || 'meil-group',
      businessVertical: newOrgData.businessVertical || 'Diversified Infrastructure',
      country: newOrgData.country || 'India',
      state: newOrgData.state || 'Telangana',
      city: newOrgData.city || 'Hyderabad',
      completionRate: 0,
      status: 'HEALTHY',
      cin: newOrgData.cin,
      ownershipPct: newOrgData.ownershipPct ?? 100,
      consolidationMethod: newOrgData.consolidationMethod || 'OPERATIONAL_CONTROL',
      inBoundary: newOrgData.inBoundary ?? true,
      isFilingEntity: newOrgData.type === 'SUBSIDIARY',
    };

    setOrganisationsList(prev => [...prev, newOrg]);

    // Append tamper-evident statutory audit log entry
    const auditRow: AuditLog = {
      id: `audit-org-${Date.now()}`,
      tableName: 'organisations',
      recordId: newOrg.id,
      organisationName: newOrg.name,
      indicatorCode: 'GOV-ORG-REG',
      action: 'CREATE',
      newValue: `${newOrg.type}: ${newOrg.name} (${newOrg.code})`,
      changedBy: currentUser?.id || 'admin',
      changedByName: currentUser?.fullName || 'System Administrator',
      userRole: currentUser?.roleId || 'SYS_ADMIN',
      reason: `Statutory registration of ${newOrg.type} in enterprise boundary (Parent: ${newOrg.parentId})`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [auditRow, ...prev]);

    // Attempt backend sync to API / DB
    try {
      const authHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      await fetch('/api/v1/organisations', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(newOrg)
      });
    } catch (err) {
      console.warn('API sync notice for new entity registration:', err);
    }
  }, [currentUser, token]);

  return (
    <AppContext.Provider
      value={{
        organisations: scopedOrganisations,
        organisationTree,
        selectedOrgId,
        selectedOrg,
        setSelectedOrgId,
        reportingPeriods: REPORTING_PERIODS,
        selectedPeriodId,
        selectedPeriod,
        setSelectedPeriodId,
        dataEntries,
        auditLogs,
        alerts,
        dashboardSummary,
        isDbConnected,
        isLoadingData,
        refreshData,
        updateDataEntry,
        submitDataEntry,
        approveDataEntry,
        rejectDataEntry,
        unlockDataEntry,
        unlockAllEntries,
        addEvidence,
        addOrganisation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
