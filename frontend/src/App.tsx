import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { AppShell } from './components/common/AppShell';

import { CorporateHomePage } from './pages/CorporateHomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrganisationPage } from './pages/OrganisationPage';
import { DataEntryPage } from './pages/DataEntryPage';
import { ReviewApprovalPage } from './pages/ReviewApprovalPage';
import { BRSRReadinessPage } from './pages/BRSRReadinessPage';
import { TraceabilityPage } from './pages/TraceabilityPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { ReportsPage } from './pages/ReportsPage';
import { IndicatorsRegistryPage } from './pages/IndicatorsRegistryPage';
import { SettingsPage } from './pages/SettingsPage';
import { PresentationPage } from './pages/PresentationPage';
import { BRSRCoreCalculatorPage } from './pages/BRSRCoreCalculatorPage';

import { RoleType } from './types';

// Protected Route Guard (Authentication)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Role-Based Authorization Guard (Enforces RBAC route security)
const RoleGuard: React.FC<{ 
  allowedRoles: RoleType[]; 
  children: React.ReactNode; 
  fallbackPath?: string;
}> = ({ allowedRoles, children, fallbackPath = '/dashboard' }) => {
  const { currentRole } = useAuth();
  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to={fallbackPath} replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Official MEIL Corporate Website */}
            <Route path="/" element={<CorporateHomePage />} />
            <Route path="/corporate" element={<CorporateHomePage />} />

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated ESG / BRSR Reporting Portal */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Direct Portal Sub-Routes with Strict Role-Based Guards */}
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              {/* Universal landing dashboard (Role-tailored view inside) */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Data Entry: Unit reporters and admins */}
              <Route 
                path="/data-entry" 
                element={
                  <RoleGuard allowedRoles={[
                    'SYS_ADMIN', 'ADMIN', 'SITE_ENGINEER', 'SITE_EHS', 'GROUP_FUNCTION',
                    'PROJECT_MANAGER', 'BU_COORDINATOR', 'SUB_ESG_MANAGER', 'GROUP_ESG_HEAD',
                    'SITE_USER', 'ESG_OFFICER'
                  ]}>
                    <DataEntryPage />
                  </RoleGuard>
                } 
              />

              {/* Review & Approvals: Multi-Tier Approvers (PM -> BU -> Sub -> Group -> Board) */}
              <Route 
                path="/review" 
                element={
                  <RoleGuard allowedRoles={[
                    'SYS_ADMIN', 'ADMIN', 'PROJECT_MANAGER', 'BU_COORDINATOR', 
                    'SUB_ESG_MANAGER', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 'AUDITOR',
                    'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
                  ]}>
                    <ReviewApprovalPage />
                  </RoleGuard>
                } 
              />

              {/* BRSR Core Scientific Engine */}
              <Route 
                path="/brsr-core" 
                element={
                  <RoleGuard allowedRoles={[
                    'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
                    'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'AUDITOR',
                    'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
                  ]}>
                    <BRSRCoreCalculatorPage />
                  </RoleGuard>
                } 
              />

              {/* BRSR Readiness Filing Matrix */}
              <Route 
                path="/brsr-readiness" 
                element={
                  <RoleGuard allowedRoles={[
                    'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
                    'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'GROUP_FUNCTION', 'AUDITOR',
                    'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
                  ]}>
                    <BRSRReadinessPage />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/traceability" 
                element={
                  <RoleGuard allowedRoles={[
                    'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
                    'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'AUDITOR',
                    'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
                  ]}>
                    <TraceabilityPage />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/audit-trail" 
                element={
                  <RoleGuard allowedRoles={[
                    'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
                    'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'AUDITOR',
                    'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
                  ]}>
                    <AuditTrailPage />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <RoleGuard allowedRoles={[
                    'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
                    'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'GROUP_FUNCTION', 'AUDITOR',
                    'ESG_OFFICER', 'GROUP_SUSTAINABILITY'
                  ]}>
                    <ReportsPage />
                  </RoleGuard>
                } 
              />
              <Route 
                path="/indicators" 
                element={
                  <RoleGuard allowedRoles={[
                    'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
                    'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'SITE_EHS', 'AUDITOR',
                    'ESG_OFFICER', 'GROUP_SUSTAINABILITY', 'SITE_USER'
                  ]}>
                    <IndicatorsRegistryPage />
                  </RoleGuard>
                } 
              />

              {/* Organisation Structure & Administration */}
              <Route 
                path="/organisation" 
                element={
                  <RoleGuard allowedRoles={[
                    'SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'BOARD_APPROVER', 
                    'SUB_ESG_MANAGER', 'BU_COORDINATOR', 'AUDITOR', 'GROUP_SUSTAINABILITY'
                  ]}>
                    <OrganisationPage />
                  </RoleGuard>
                } 
              />
              <Route path="/presentation" element={<PresentationPage />} />
              <Route 
                path="/settings" 
                element={
                  <RoleGuard allowedRoles={['SYS_ADMIN', 'ADMIN', 'GROUP_ESG_HEAD', 'GROUP_SUSTAINABILITY']}>
                    <SettingsPage />
                  </RoleGuard>
                } 
              />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
};

export default App;
