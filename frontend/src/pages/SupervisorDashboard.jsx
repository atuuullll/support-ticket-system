import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function SupervisorDashboard({
  title = 'Supervisor Dashboard',
  subtitle = 'Team Performance Metrics',
}) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTickets = useCallback(async () => {
    try {
      const response = await api.getTickets();
      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    critical: tickets.filter(t => t.priority === 'Critical').length,
  };

  const avgResolutionTime = (tickets.filter(t => t.resolvedAt).length > 0) 
    ? Math.floor(tickets.filter(t => t.resolvedAt)
        .reduce((sum, t) => sum + (new Date(t.resolvedAt) - new Date(t.createdAt)), 0) / 
        tickets.filter(t => t.resolvedAt).length / (1000 * 60 * 60)) + ' hours'
    : 'N/A';

  const categoryBreakdown = {};
  tickets.forEach(t => {
    categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + 1;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">Welcome, {user?.name} | {subtitle}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">TOTAL TICKETS</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">OPEN TICKETS</p>
            <p className="text-4xl font-bold text-red-600 mt-2">{stats.open}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">IN PROGRESS</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">RESOLVED</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.resolved}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm font-semibold">CRITICAL ISSUES</p>
            <p className="text-4xl font-bold text-red-700 mt-2">{stats.critical}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Avg Resolution Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Avg Resolution Time</h2>
            <p className="text-5xl font-bold text-green-600">{avgResolutionTime}</p>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Tickets by Category</h2>
            <div className="space-y-2">
              {Object.entries(categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-700">{category}</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SLA Monitoring */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">SLA Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border-2 border-green-500 rounded-lg">
              <p className="text-sm text-gray-600">Critical - 4 Hours</p>
              <p className="text-2xl font-bold text-green-600 mt-2">✅ On Track</p>
            </div>
            <div className="p-4 border-2 border-yellow-500 rounded-lg">
              <p className="text-sm text-gray-600">High - 8 Hours</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">⚠️ Monitor</p>
            </div>
            <div className="p-4 border-2 border-blue-500 rounded-lg">
              <p className="text-sm text-gray-600">Medium - 24 Hours</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">ℹ️ Normal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
