import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/api';

const categories = [
  {
    value: 'Technical',
    label: 'Technical Issue',
    code: 'TEC',
    description: 'Bugs, errors, connectivity, or system behavior',
  },
  {
    value: 'Billing',
    label: 'Billing Question',
    code: 'BIL',
    description: 'Invoices, payments, charges, and plan questions',
  },
  {
    value: 'Account',
    label: 'Account Issue',
    code: 'ACC',
    description: 'Login, profile, permissions, or access problems',
  },
  {
    value: 'Refund',
    label: 'Refund Request',
    code: 'REF',
    description: 'Refunds, cancellations, and payment reversals',
  },
  {
    value: 'Security',
    label: 'Security Concern',
    code: 'SEC',
    description: 'Suspicious activity, privacy, or account safety',
  },
  {
    value: 'Other',
    label: 'Other Request',
    code: 'OTH',
    description: 'Anything that does not fit the listed categories',
  },
];

const priorities = [
  {
    value: 'Low',
    label: 'Low',
    description: 'General question or non-urgent request',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
  {
    value: 'Medium',
    label: 'Medium',
    description: 'Important issue with a manageable workaround',
    className: 'border-blue-200 bg-blue-50 text-blue-800',
  },
  {
    value: 'High',
    label: 'High',
    description: 'Major disruption affecting key work',
    className: 'border-orange-200 bg-orange-50 text-orange-800',
  },
  {
    value: 'Critical',
    label: 'Critical',
    description: 'Service-blocking issue that needs urgent attention',
    className: 'border-red-200 bg-red-50 text-red-800',
  },
];

export default function CreateTicket() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    priority: 'Medium',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChoice = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.createTicket(formData);
      alert(`Ticket created: ${response.data.ticket.ticketId}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPriority = priorities.find(
    (priority) => priority.value === formData.priority
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mb-5 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
          >
            Back to dashboard
          </button>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                New Support Request
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                Create a new ticket
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Tell us what happened, choose the right category, and set the urgency so the support team can respond effectively.
              </p>
            </div>

            <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${selectedPriority?.className}`}>
              Priority: {formData.priority}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="space-y-7">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Ticket Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="7"
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Include what you were trying to do, what went wrong, and any error messages you saw."
                  required
                />
                <p className="mt-2 text-sm text-slate-500">
                  Detailed context helps the team resolve your ticket faster.
                </p>
              </div>

              <fieldset>
                <legend className="mb-3 block text-sm font-bold text-slate-800">
                  Category
                </legend>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {categories.map((category) => {
                    const isSelected = formData.category === category.value;

                    return (
                      <label
                        key={category.value}
                        className={`flex min-h-[116px] cursor-pointer gap-3 rounded-lg border p-4 transition ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100'
                            : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={isSelected}
                          onChange={(event) => handleChoice('category', event.target.value)}
                          className="mt-1 h-4 w-4 text-blue-700 focus:ring-blue-500"
                        />
                        <span className="min-w-0">
                          <span className="inline-flex rounded-md bg-white px-2 py-1 text-xs font-black tracking-wide text-blue-700 shadow-sm">
                            {category.code}
                          </span>
                          <span className="mt-2 block text-sm font-bold text-slate-900">
                            {category.label}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-slate-600">
                            {category.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 block text-sm font-bold text-slate-800">
                  Priority Level
                </legend>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {priorities.map((priority) => {
                    const isSelected = formData.priority === priority.value;

                    return (
                      <label
                        key={priority.value}
                        className={`min-h-[112px] cursor-pointer rounded-lg border p-4 transition ${
                          isSelected
                            ? `${priority.className} ring-4 ring-blue-100`
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={priority.value}
                          checked={isSelected}
                          onChange={(event) => handleChoice('priority', event.target.value)}
                          className="h-4 w-4 text-blue-700 focus:ring-blue-500"
                        />
                        <span className="mt-3 block text-sm font-bold">
                          {priority.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 opacity-80">
                          {priority.description}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                  <p className="text-sm font-semibold">Could not create ticket</p>
                  <p className="mt-1 text-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Creating ticket...' : 'Create Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Submission Tips
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                <li>Include exact error messages or screenshots if available.</li>
                <li>Mention when the issue started and whether it repeats.</li>
                <li>Choose Critical only for service-blocking problems.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900">
              <h2 className="font-bold">What happens next?</h2>
              <p className="mt-2 leading-6">
                Your ticket appears in your dashboard immediately. The support team can review, prioritize, and update its status from their queue.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
