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

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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

            {/* Direct Portal Sub-Routes (Also wrapped in Protected AppShell) */}
            <Route
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/organisation" element={<OrganisationPage />} />
              <Route path="/data-entry" element={<DataEntryPage />} />
              <Route path="/review" element={<ReviewApprovalPage />} />
              <Route path="/brsr-readiness" element={<BRSRReadinessPage />} />
              <Route path="/traceability" element={<TraceabilityPage />} />
              <Route path="/audit-trail" element={<AuditTrailPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/indicators" element={<IndicatorsRegistryPage />} />
              <Route path="/presentation" element={<PresentationPage />} />
              <Route path="/settings" element={<SettingsPage />} />
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
