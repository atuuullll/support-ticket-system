import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';
import { timeAgo } from '../utils/formatDate';

const filters = ['all', 'Open', 'In Progress', 'Pending', 'Resolved', 'Closed'];

const statusStyles = {
  Open: 'border-blue-200 bg-blue-50 text-blue-800',
  'In Progress': 'border-amber-200 bg-amber-50 text-amber-800',
  Pending: 'border-orange-200 bg-orange-50 text-orange-800',
  Resolved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  Closed: 'border-slate-200 bg-slate-100 text-slate-700',
};

const priorityStyles = {
  Low: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Medium: 'bg-blue-50 text-blue-700 ring-blue-100',
  High: 'bg-orange-50 text-orange-700 ring-orange-100',
  Critical: 'bg-red-50 text-red-700 ring-red-100',
};

const statStyles = {
  total: 'border-blue-100 bg-blue-50 text-blue-800',
  open: 'border-red-100 bg-red-50 text-red-800',
  progress: 'border-amber-100 bg-amber-50 text-amber-800',
  resolved: 'border-emerald-100 bg-emerald-50 text-emerald-800',
};

const truncate = (value = '', length = 120) => {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trim()}...`;
};

export default function CustomerDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getTickets();
      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const visibleTickets = useMemo(() => {
    if (filter === 'all') return tickets;
    return tickets.filter((ticket) => ticket.status === filter);
  }, [filter, tickets]);

  const stats = useMemo(
    () => [
      {
        key: 'total',
        label: 'Total Tickets',
        value: tickets.length,
        detail: 'All requests you created',
      },
      {
        key: 'open',
        label: 'Open',
        value: tickets.filter((ticket) => ticket.status === 'Open').length,
        detail: 'Waiting for support action',
      },
      {
        key: 'progress',
        label: 'In Progress',
        value: tickets.filter((ticket) => ticket.status === 'In Progress').length,
        detail: 'Currently being handled',
      },
      {
        key: 'resolved',
        label: 'Resolved',
        value: tickets.filter((ticket) => ticket.status === 'Resolved').length,
        detail: 'Completed support work',
      },
    ],
    [tickets]
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">
                Customer Workspace
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
                Welcome back, {user?.name || 'Customer'}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Track ticket progress, review status updates, and open new support requests from one focused dashboard.
              </p>
            </div>

            <Link
              to="/create-ticket"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-bold text-blue-800 shadow-lg shadow-slate-950/20 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/30"
            >
              Create Ticket
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className={`rounded-lg border p-5 shadow-sm ${statStyles[stat.key]}`}
            >
              <p className="text-sm font-semibold">{stat.label}</p>
              <p className="mt-3 text-4xl font-bold tracking-normal">{stat.value}</p>
              <p className="mt-2 text-sm opacity-80">{stat.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-950">My Tickets</h2>
            <p className="mt-1 text-sm text-slate-600">
              Showing {visibleTickets.length} of {tickets.length} tickets
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((status) => {
              const isActive = filter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {status === 'all' ? 'All Tickets' : status}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
            <p className="mt-4 text-sm font-semibold text-slate-600">Loading your tickets...</p>
          </div>
        ) : visibleTickets.length === 0 ? (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-sm font-black tracking-wide text-blue-700">
              ST
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-950">No tickets found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              {filter === 'all'
                ? 'Create your first support ticket and the team will pick it up.'
                : `No ${filter.toLowerCase()} tickets match this filter.`}
            </p>
            <Link
              to="/create-ticket"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Create Ticket
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {visibleTickets.map((ticket) => (
              <Link
                key={ticket._id}
                to={`/ticket/${ticket._id}`}
                className="block rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                        {ticket.ticketId || 'Ticket'}
                      </span>
                      <span className={`rounded-md border px-2.5 py-1 text-xs font-bold ${statusStyles[ticket.status] || statusStyles.Closed}`}>
                        {ticket.status || 'Unknown'}
                      </span>
                      <span className="rounded-md bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                        {ticket.category || 'Other'}
                      </span>
                    </div>

                    <h3 className="mt-4 text-lg font-bold text-slate-950">
                      {ticket.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {truncate(ticket.description)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-row items-center justify-between gap-4 lg:flex-col lg:items-end">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${priorityStyles[ticket.priority] || priorityStyles.Medium}`}>
                      {ticket.priority || 'Medium'} Priority
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                      {ticket.createdAt ? `Created ${timeAgo(ticket.createdAt)}` : 'Recently created'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
