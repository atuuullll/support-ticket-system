export const roleBasedNav = (role) => {
  const navMap = {
    customer: [
      { label: 'My Tickets', path: '/dashboard', icon: 'Tickets' },
      { label: 'Create Ticket', path: '/create-ticket', icon: 'New' },
    ],
    agent: [
      { label: 'My Queue', path: '/agent-dashboard', icon: 'Queue' },
      { label: 'All Tickets', path: '/tickets', icon: 'Tickets' },
    ],
    supervisor: [
      { label: 'Dashboard', path: '/supervisor-dashboard', icon: 'Stats' },
      { label: 'All Tickets', path: '/tickets', icon: 'Tickets' },
      { label: 'Team', path: '/team', icon: 'Team' },
    ],
    case_manager: [
      { label: 'Dashboard', path: '/case-manager-dashboard', icon: 'Stats' },
      { label: 'Tickets', path: '/tickets', icon: 'Tickets' },
      { label: 'Cases', path: '/cases', icon: 'Cases' },
    ],
    qa: [
      { label: 'Dashboard', path: '/qa-dashboard', icon: 'Stats' },
      { label: 'Reviews', path: '/tickets', icon: 'Reviews' },
      { label: 'Analytics', path: '/analytics', icon: 'Analytics' },
    ],
    analytics: [
      { label: 'Dashboard', path: '/analytics-dashboard', icon: 'Stats' },
      { label: 'Reports', path: '/reports', icon: 'Reports' },
    ],
  };

  return navMap[role] || navMap.customer;
};
