import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: 'customer@example.com',
    password: 'password123',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const success = await login(formData.email, formData.password);

    if (success) {
      navigate('/dashboard');
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1fr_480px]">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-slate-900 to-emerald-800 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14)_0,rgba(255,255,255,0)_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.35),transparent_32%)]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-sm font-black tracking-wide text-blue-700 shadow-lg">
              ST
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">
                Support System
              </p>
              <p className="text-sm text-slate-200">Enterprise ticket management</p>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-200">
              Helpdesk Command Center
            </p>
            <h1 className="text-5xl font-bold leading-tight tracking-normal">
              Resolve customer issues with clarity and speed.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">
              Track tickets, coordinate teams, review quality, and keep support operations moving from one focused workspace.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">24/7</p>
              <p className="mt-1 text-slate-200">Ticket visibility</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">6</p>
              <p className="mt-1 text-slate-200">Role dashboards</p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">Live</p>
              <p className="mt-1 text-slate-200">MongoDB status</p>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-700 text-sm font-black tracking-wide text-white shadow-lg lg:mx-0">
                ST
              </div>
              <h2 className="text-3xl font-bold text-slate-950">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-600">
                Sign in to continue managing support tickets.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
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
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <p className="text-sm font-semibold">Login failed</p>
                    <p className="mt-1 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-blue-700 px-4 py-3 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-sm text-slate-500">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <p className="text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-bold text-blue-700 transition hover:text-blue-900"
                >
                  Sign up here
                </Link>
              </p>

              <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-blue-900">
                  Demo Credentials
                </p>
                <p className="text-xs text-blue-900">
                  Email: <span className="font-mono">customer@example.com</span>
                </p>
                <p className="mt-1 text-xs text-blue-900">
                  Password: <span className="font-mono">password123</span>
                </p>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              Support System. Secure access for customers and support teams.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
