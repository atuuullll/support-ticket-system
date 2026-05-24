import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { timeAgo } from '../utils/formatDate';

export default function AgentDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Open');
  const { user } = useAuth();

  const fetchTickets = useCallback(async () => {
    try {
      const params = { status: filter };
      const response = await api.getTickets(params);
      // Sort by priority (Critical > High > Medium > Low)
      const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
      const sorted = response.data.tickets.sort((a, b) => 
        priorityOrder[a.priority] - priorityOrder[b.priority]
      );
      setTickets(sorted);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const getPriorityColor = (priority) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-800 border-l-4 border-red-500',
      'High': 'bg-orange-100 text-orange-800 border-l-4 border-orange-500',
      'Medium': 'bg-blue-100 text-blue-800 border-l-4 border-blue-500',
      'Low': 'bg-green-100 text-green-800 border-l-4 border-green-500',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-blue-500',
      'In Progress': 'bg-yellow-500',
      'Pending': 'bg-orange-500',
      'Resolved': 'bg-green-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Queue</h1>
          <p className="text-gray-600">Welcome, {user?.name} | Role: Support Agent</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-600 text-sm">Total Assigned</p>
            <p className="text-3xl font-bold text-blue-600">{tickets.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-600 text-sm">Open</p>
            <p className="text-3xl font-bold text-red-600">
              {tickets.filter(t => t.status === 'Open').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === 'In Progress').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <p className="text-gray-600 text-sm">Resolved</p>
            <p className="text-3xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'Resolved').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['Open', 'In Progress', 'Pending', 'Resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Tickets Queue */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No tickets in this queue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map(ticket => (
              <Link
                key={ticket._id}
                to={`/ticket/${ticket._id}`}
                className={`rounded-lg shadow hover:shadow-md transition p-4 cursor-pointer ${getPriorityColor(ticket.priority)}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                      <span className="font-bold">{ticket.ticketId}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded bg-white`}>
                        🔴 {ticket.priority}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{ticket.title}</h3>
                    <p className="text-sm mt-1">{ticket.description.substring(0, 80)}...</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold">{ticket.customerId?.name}</p>
                    <p>{timeAgo(ticket.createdAt)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
