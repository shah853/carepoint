import { Link, useLocation } from 'react-router-dom';

function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: '⌂' },
    { to: '/doctors', label: 'Doctors', icon: '⚕' },
    { to: '/appointments', label: 'My Appointments', icon: '□' },
    { to: '/products', label: 'Pharmacy', icon: '+' },
    { to: '/cart', label: 'Cart', icon: '◫' },
    { to: '/orders', label: 'Orders', icon: '◷' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close menu"
      />

      <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl sm:w-[320px]">

        <div className="flex min-h-[68px] items-center justify-between border-b border-slate-100 px-4">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              +
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                CarePoint
              </h2>

              <p className="text-[8px] font-semibold uppercase tracking-widest text-blue-600">
                Healthcare
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-xl text-slate-600"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="flex-1 px-3 py-4">
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Navigation
          </p>

          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  {link.icon}
                </span>

                <span className="text-sm font-semibold">
                  {link.label}
                </span>

                {isActive(link.to) && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                )}
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 rounded-xl bg-blue-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Need healthcare help?
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Find a doctor or book an appointment.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/profile"
              onClick={onClose}
              className="rounded-lg border border-slate-200 py-2.5 text-center text-xs font-semibold text-slate-600"
            >
              ◯ Profile
            </Link>

            <Link
              to="/login"
              onClick={onClose}
              className="rounded-lg bg-blue-600 py-2.5 text-center text-xs font-semibold text-white"
            >
              Sign In
            </Link>
          </div>
        </div>

      </aside>
    </div>
  );
}

export default MobileMenu;