import { Link, useLocation } from 'react-router-dom';

function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();
  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Pharmacy' },
    { to: '/cart', label: 'Cart' },
    { to: '/orders', label: 'Orders' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-slate-900/40" aria-label="Close menu" />
      <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-white shadow-2xl sm:w-[320px]">
        <div className="flex min-h-[68px] items-center justify-between border-b border-slate-100 px-4"><Link to="/" onClick={onClose} className="text-lg font-bold text-slate-900">CarePoint</Link><button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600" aria-label="Close menu">Close</button></div>
        <nav className="flex-1 px-3 py-4">{links.map((link) => <Link key={link.to} to={link.to} onClick={onClose} className={`mb-1 block rounded-xl px-3 py-3 text-sm font-semibold ${location.pathname === link.to ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>{link.label}</Link>)}</nav>
        <div className="border-t border-slate-100 p-4"><p className="mb-3 text-xs text-slate-500">Explore healthcare products and manage your orders.</p><Link to="/profile" onClick={onClose} className="mr-2 text-sm font-semibold text-slate-600">Profile</Link><Link to="/login" onClick={onClose} className="text-sm font-semibold text-blue-600">Sign In</Link></div>
      </aside>
    </div>
  );
}

export default MobileMenu;
