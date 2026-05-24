import React from 'react';
import AgentDashboard from './AgentDashboard';
import CustomerDashboard from './CustomerDashboard';
import SupervisorDashboard from './SupervisorDashboard';
import { useAuth } from '../context/AuthContext';

const dashboardConfig = {
  supervisor: {
    title: 'Supervisor Dashboard',
    subtitle: 'Team Performance Metrics',
  },
  case_manager: {
    title: 'Case Manager Dashboard',
    subtitle: 'Case oversight and ticket coordination',
  },
  qa: {
    title: 'QA Dashboard',
    subtitle: 'Quality review and resolution monitoring',
  },
  analytics: {
    title: 'Analytics Dashboard',
    subtitle: 'Operational reporting and support insights',
  },
};

export default function RoleDashboard() {
  const { user } = useAuth();

  if (user?.role === 'agent') {
    return <AgentDashboard />;
  }

  if (user?.role === 'customer') {
    return <CustomerDashboard />;
  }

  const config = dashboardConfig[user?.role] || dashboardConfig.supervisor;

  return (
    <SupervisorDashboard
      title={config.title}
      subtitle={config.subtitle}
    />
  );
}
