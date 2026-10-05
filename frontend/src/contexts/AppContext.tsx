import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  Organisation, 
  ReportingPeriod, 
  DataEntry, 
  Evidence, 
  AuditLog, 
  AnomalyAlert, 
  DashboardSummary 
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
  updateDataEntry: (indicatorId: string, value: number, unit?: string, remarks?: string) => void;
  submitDataEntry: (dataEntryId: string) => void;
  approveDataEntry: (dataEntryId: string, comments: string) => void;
  rejectDataEntry: (dataEntryId: string, comments: string) => void;
  addEvidence: (dataEntryId: string, evidence: Omit<Evidence, 'id' | 'uploadedAt' | 'uploadedBy' | 'uploadedByName'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [selectedOrgId, setSelectedOrgId] = useState<string>('meil-group');
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('fy-2026-27');
  const [dataEntries, setDataEntries] = useState<DataEntry[]>(DEMO_DATA_ENTRIES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(DEMO_AUDIT_LOGS);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(DEMO_ALERTS);

  const organisationTree = useMemo(() => getOrganisationTree(), []);

  const selectedOrg = useMemo(() => {
    return ORGANISATIONS.find(o => o.id === selectedOrgId) || ORGANISATIONS[0];
  }, [selectedOrgId]);

  const selectedPeriod = useMemo(() => {
    return REPORTING_PERIODS.find(p => p.id === selectedPeriodId) || REPORTING_PERIODS[0];
  }, [selectedPeriodId]);

  // Update or create draft entry
  const updateDataEntry = (indicatorId: string, value: number, unit?: string, remarks?: string) => {
    const existingIndex = dataEntries.findIndex(
      e => e.organisationId === selectedOrgId && e.indicatorId === indicatorId && e.reportingPeriodId === selectedPeriodId
    );

    const ind = INDICATORS.find(i => i.id === indicatorId);

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

      // Log update
      addAuditLog({
        tableName: 'data_entries',
        recordId: prev.id,
        indicatorCode: ind?.code,
        indicatorName: ind?.name,
        organisationName: selectedOrg.name,
        action: 'UPDATE',
        oldValue: { value: prev.numericValue },
        newValue: { value },
        reason: 'Value updated by site user'
      });
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
        createdBy: currentUser?.id || 'anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        evidenceCount: 0,
        evidenceFiles: []
      };
      setDataEntries(prev => [newEntry, ...prev]);

      addAuditLog({
        tableName: 'data_entries',
        recordId: newEntryId,
        indicatorCode: ind?.code,
        indicatorName: ind?.name,
        organisationName: selectedOrg.name,
        action: 'CREATE',
        newValue: { value, status: 'DRAFT' },
        reason: 'New draft ESG entry initialized'
      });
    }
  };

  const submitDataEntry = (dataEntryId: string) => {
    setDataEntries(prev => prev.map(entry => {
      if (entry.id === dataEntryId) {
        const ind = INDICATORS.find(i => i.id === entry.indicatorId);
        addAuditLog({
          tableName: 'data_entries',
          recordId: entry.id,
          indicatorCode: ind?.code,
          indicatorName: ind?.name,
          organisationName: selectedOrg.name,
          action: 'TRANSITION',
          oldValue: { status: entry.status },
          newValue: { status: 'SUBMITTED' },
          reason: 'Submitted for ESG Officer verification'
        });
        return { ...entry, status: 'SUBMITTED', updatedAt: new Date().toISOString() };
      }
      return entry;
    }));
  };

  const approveDataEntry = (dataEntryId: string, comments: string) => {
    setDataEntries(prev => prev.map(entry => {
      if (entry.id === dataEntryId) {
        const ind = INDICATORS.find(i => i.id === entry.indicatorId);
        addAuditLog({
          tableName: 'data_entries',
          recordId: entry.id,
          indicatorCode: ind?.code,
          indicatorName: ind?.name,
          organisationName: selectedOrg.name,
          action: 'TRANSITION',
          oldValue: { status: entry.status },
          newValue: { status: 'APPROVED' },
          reason: comments || 'Verified by ESG Lead and approved for group rollup.'
        });
        return { ...entry, status: 'APPROVED', updatedAt: new Date().toISOString() };
      }
      return entry;
    }));
  };

  const rejectDataEntry = (dataEntryId: string, comments: string) => {
    setDataEntries(prev => prev.map(entry => {
      if (entry.id === dataEntryId) {
        const ind = INDICATORS.find(i => i.id === entry.indicatorId);
        addAuditLog({
          tableName: 'data_entries',
          recordId: entry.id,
          indicatorCode: ind?.code,
          indicatorName: ind?.name,
          organisationName: selectedOrg.name,
          action: 'TRANSITION',
          oldValue: { status: entry.status },
          newValue: { status: 'REJECTED' },
          reason: comments || 'Returned for data correction'
        });
        return { ...entry, status: 'REJECTED', updatedAt: new Date().toISOString() };
      }
      return entry;
    }));
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

  const addAuditLog = (params: Partial<AuditLog> & { tableName: string; recordId: string; action: 'CREATE' | 'UPDATE' | 'DELETE' | 'TRANSITION' }) => {
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
      changedBy: currentUser?.id || 'user-unknown',
      changedByName: currentUser?.fullName || 'System User',
      userRole: currentUser?.roleId || 'SITE_USER',
      ipAddress: '10.14.88.22',
      timestamp: new Date().toISOString(),
      reason: params.reason
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        organisations: ORGANISATIONS,
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
        dashboardSummary: DEMO_DASHBOARD_SUMMARY,
        updateDataEntry,
        submitDataEntry,
        approveDataEntry,
        rejectDataEntry,
        addEvidence,
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
