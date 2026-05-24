import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleOptions = [
  {
    value: 'customer',
    label: 'Customer',
    badge: 'CU',
    description: 'Create and track support tickets',
  },
  {
    value: 'agent',
    label: 'Support Agent',
    badge: 'AG',
    description: 'Handle assigned tickets and updates',
  },
  {
    value: 'supervisor',
    label: 'Supervisor',
    badge: 'SV',
    description: 'Manage queues and team workload',
  },
  {
    value: 'case_manager',
    label: 'Case Manager',
    badge: 'CM',
    description: 'Coordinate complex customer cases',
  },
  {
    value: 'qa',
    label: 'QA Team',
    badge: 'QA',
    description: 'Review resolution quality and trends',
  },
  {
    value: 'analytics',
    label: 'Analytics Manager',
    badge: 'AN',
    description: 'View reporting and support insights',
  },
];

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { signup, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const success = await signup(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (success) {
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[520px_1fr]">
        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-xl">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-700 text-sm font-black tracking-wide text-white shadow-lg lg:mx-0">
                ST
              </div>
              <h1 className="text-3xl font-bold text-slate-950">Create your account</h1>
              <p className="mt-2 text-sm text-slate-600">
                Choose your workspace role and start managing support work.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      placeholder="Repeat password"
                      required
                    />
                  </div>
                </div>

                <fieldset>
                  <legend className="mb-3 block text-sm font-semibold text-slate-700">
                    Select Your Role
                  </legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {roleOptions.map((option) => {
                      const isSelected = formData.role === option.value;

                      return (
                        <label
                          key={option.value}
                          className={`flex min-h-[92px] cursor-pointer gap-3 rounded-lg border p-3 transition ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100'
                              : 'border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={option.value}
                            checked={isSelected}
                            onChange={handleChange}
                            className="mt-1 h-4 w-4 text-emerald-700 focus:ring-emerald-500"
                          />
                          <span className="flex min-w-0 gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white text-xs font-bold text-emerald-700 shadow-sm">
                              {option.badge}
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-bold text-slate-900">
                                {option.label}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-slate-600">
                                {option.description}
                              </span>
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <p className="text-sm font-semibold">Signup failed</p>
                    <p className="mt-1 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-bold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm text-slate-500">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-emerald-700 transition hover:text-emerald-900"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-700 via-slate-900 to-blue-800 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0,rgba(255,255,255,0)_36%),radial-gradient(circle_at_25%_20%,rgba(59,130,246,0.36),transparent_34%)]" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-sm font-black tracking-wide text-emerald-700 shadow-lg">
              ST
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Support System
              </p>
              <p className="text-sm text-slate-200">Role-aware ticket operations</p>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-blue-200">
              Team Workspace
            </p>
            <h2 className="text-5xl font-bold leading-tight tracking-normal">
              Give every support role the tools they need.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              Customers, agents, supervisors, quality teams, and analytics users each land in a focused dashboard built for their work.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">6</p>
              <p className="mt-1 text-slate-200">Access roles</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">Fast</p>
              <p className="mt-1 text-slate-200">Ticket creation</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">Clear</p>
              <p className="mt-1 text-slate-200">Team oversight</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
