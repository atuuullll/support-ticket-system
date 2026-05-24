import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roleBasedNav } from '../utils/roleBasedNav';

const roleLabels = {
  customer: 'Customer',
  agent: 'Support Agent',
  supervisor: 'Supervisor',
  case_manager: 'Case Manager',
  qa: 'QA Team',
  analytics: 'Analytics Manager',
};

const roleBadges = {
  customer: 'CU',
  agent: 'AG',
  supervisor: 'SV',
  case_manager: 'CM',
  qa: 'QA',
  analytics: 'AN',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  const navItems = roleBasedNav(user?.role);
  const roleName = roleLabels[user?.role] || 'User';
  const roleBadge = roleBadges[user?.role] || 'US';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowMenu(false);
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    [
      'px-3 py-2 rounded-md text-sm font-medium transition',
      isActive
        ? 'bg-white text-blue-700 shadow-sm'
        : 'text-blue-100 hover:bg-white/10 hover:text-white',
    ].join(' ');

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-500/30 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-sm font-black tracking-wide text-blue-700 shadow-sm">
              ST
            </span>
            <span className="hidden truncate text-lg font-bold text-white sm:block">
              Support System
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {user && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowMenu((value) => !value)}
                className="flex max-w-[220px] items-center gap-3 rounded-lg bg-white/10 px-3 py-2 text-white ring-1 ring-white/15 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white"
                aria-haspopup="menu"
                aria-expanded={showMenu}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white text-xs font-bold text-blue-700">
                  {roleBadge}
                </span>
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block truncate text-sm font-semibold">
                    {user.name}
                  </span>
                  <span className="block truncate text-xs text-blue-100">
                    {roleName}
                  </span>
                </span>
              </button>

              {showMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/5"
                  role="menu"
                >
                  <div className="border-b border-gray-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                    <p className="mt-1 text-xs font-medium text-blue-700">
                      {roleName}
                    </p>
                  </div>

                  <div className="border-b border-gray-100 py-2 md:hidden">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowMenu(false)}
                        className={({ isActive }) =>
                          [
                            'block px-4 py-2 text-sm transition',
                            isActive
                              ? 'bg-blue-50 font-semibold text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50',
                          ].join(' ')
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
