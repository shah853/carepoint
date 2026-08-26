import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MobileMenu from './MobileMenu';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/products', label: 'Pharmacy' },
    { to: '/cart', label: 'Cart' },
    { to: '/orders', label: 'Orders' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-6 lg:px-8">
          <div className="flex min-h-[64px] items-center justify-between gap-3 sm:min-h-[70px]">

            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex shrink-0 items-center gap-2 sm:gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white sm:h-10 sm:w-10 sm:rounded-xl sm:text-xl">
                +
              </div>

              <div className="leading-none">
                <h1 className="text-base font-bold text-slate-900 sm:text-lg md:text-xl">
                  CarePoint
                </h1>

                <p className="mt-1 hidden text-[8px] font-semibold uppercase tracking-widest text-blue-600 xs:block sm:text-[9px]">
                  Healthcare
                </p>
              </div>

            </Link>

            <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`whitespace-nowrap rounded-lg px-2 py-2 text-xs font-medium transition sm:px-2.5 md:text-sm xl:px-3 ${
                    isActive(link.to)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <Link
                to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 xl:h-10 xl:w-10"
                title="Profile"
              >
                ◯
              </Link>

              <Link
                to="/login"
                className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 sm:px-4 sm:text-sm"
              >
                Sign In
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 lg:hidden sm:h-10 sm:w-10"
              aria-label="Open navigation menu"
            >
              ☰
            </button>

          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default Navbar;