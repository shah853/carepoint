import { useState } from 'react';
import { IconMenu2, IconX } from '@tabler/icons-react';
import AdminSidebar from './AdminSidebar';

function AdminLayout({ children }) {
	const [mobileOpen, setMobileOpen] = useState(false);
	const closeMobileSidebar = () => setMobileOpen(false);

	return (
		<div className="min-h-screen bg-[#f5f8fa] text-slate-900">
			{mobileOpen ? (
				<button
					aria-label="Close navigation menu"
					className="fixed inset-0 z-40 bg-slate-950/35 md:hidden"
					onClick={closeMobileSidebar}
					type="button"
				/>
			) : null}

			<div className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-45 transition-transform duration-200 md:hidden`}>
				<AdminSidebar isMobile onNavigate={closeMobileSidebar} />
			</div>
			<div className="fixed inset-y-0 left-0 z-30 hidden w-45 md:block">
				<AdminSidebar />
			</div>

			<div className="min-h-screen md:pl-45">
				<header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden">
					<button
						aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
						className="inline-flex size-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
						onClick={() => setMobileOpen((open) => !open)}
						type="button"
					>
						{mobileOpen ? <IconX size={21} stroke={1.8} /> : <IconMenu2 size={21} stroke={1.8} />}
					</button>
					<span className="text-sm font-semibold text-slate-900">CarePoint Admin</span>
				</header>
				<main className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
					{children}
				</main>
			</div>
		</div>
	);
}

export default AdminLayout;