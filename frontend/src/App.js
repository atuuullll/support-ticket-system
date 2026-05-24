import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import AgentDashboard from './pages/AgentDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import RoleDashboard from './pages/RoleDashboard';

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function ProtectedPage({ children, requiredRole }) {
  return (
    <ProtectedRoute requiredRole={requiredRole}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedPage>
            <RoleDashboard />
          </ProtectedPage>
        }
      />
      
      <Route
        path="/create-ticket"
        element={
          <ProtectedPage>
            <CreateTicket />
          </ProtectedPage>
        }
      />

      <Route
        path="/ticket/:id"
        element={
          <ProtectedPage>
            <TicketDetails />
          </ProtectedPage>
        }
      />

      <Route
        path="/tickets"
        element={
          <ProtectedPage>
            <RoleDashboard />
          </ProtectedPage>
        }
      />

      <Route
        path="/agent-dashboard"
        element={
          <ProtectedPage requiredRole="agent">
            <AgentDashboard />
          </ProtectedPage>
        }
      />

      <Route
        path="/team"
        element={
          <ProtectedPage requiredRole={['supervisor', 'case_manager']}>
            <SupervisorDashboard
              title="Team Dashboard"
              subtitle="Team workload and ticket ownership"
            />
          </ProtectedPage>
        }
      />

      <Route
        path="/cases"
        element={
          <ProtectedPage requiredRole="case_manager">
            <SupervisorDashboard
              title="Case Manager Dashboard"
              subtitle="Case oversight and ticket coordination"
            />
          </ProtectedPage>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedPage requiredRole={['qa', 'analytics']}>
            <SupervisorDashboard
              title="Analytics Dashboard"
              subtitle="Operational reporting and support insights"
            />
          </ProtectedPage>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedPage requiredRole="analytics">
            <SupervisorDashboard
              title="Reports Dashboard"
              subtitle="Support performance reports"
            />
          </ProtectedPage>
        }
      />

      <Route
        path="/supervisor-dashboard"
        element={
          <ProtectedPage requiredRole="supervisor">
            <SupervisorDashboard />
          </ProtectedPage>
        }
      />

      <Route
        path="/case-manager-dashboard"
        element={
          <ProtectedPage requiredRole="case_manager">
            <SupervisorDashboard
              title="Case Manager Dashboard"
              subtitle="Case oversight and ticket coordination"
            />
          </ProtectedPage>
        }
      />

      <Route
        path="/qa-dashboard"
        element={
          <ProtectedPage requiredRole="qa">
            <SupervisorDashboard
              title="QA Dashboard"
              subtitle="Quality review and resolution monitoring"
            />
          </ProtectedPage>
        }
      />

      <Route
        path="/analytics-dashboard"
        element={
          <ProtectedPage requiredRole="analytics">
            <SupervisorDashboard
              title="Analytics Dashboard"
              subtitle="Operational reporting and support insights"
            />
          </ProtectedPage>
        }
      />
      
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
