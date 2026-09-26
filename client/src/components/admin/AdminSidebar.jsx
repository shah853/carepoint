import {
	IconCalendarEvent,
	IconHeartbeat,
	IconLayoutDashboard,
	IconPill,
	IconSettings,
	IconShoppingCart,
	IconStethoscope,
	IconX,
} from '@tabler/icons-react';
import { NavLink } from 'react-router-dom';

const links = [
	{ label: 'Dashboard', to: '/admin', end: true, Icon: IconLayoutDashboard },
	{ label: 'Orders', to: '/admin/orders', Icon: IconShoppingCart },
	{ label: 'Doctors', to: '/admin/doctors', Icon: IconStethoscope },
	{ label: 'Appointments', to: '/admin/appointments', Icon: IconCalendarEvent },
	{ label: 'Pharmacy', to: '/admin/products', Icon: IconPill },
];

function AdminSidebar({ onNavigate, isMobile = false }) {
	const renderLink = ({ label, to, end, Icon }) => (
		<NavLink
			className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${isActive ? 'bg-teal-100 text-teal-900' : 'text-slate-600 hover:bg-white hover:text-slate-900'}`}
			end={end}
			key={to}
			onClick={onNavigate}
			to={to}
		>
			<Icon aria-hidden="true" size={18} stroke={1.7} />
			<span>{label}</span>
		</NavLink>
	);

	return (
		<aside className="flex h-full w-45 flex-col border-r border-slate-200 bg-[#edf4f4] px-3 py-5">
			<div className="mb-9 flex items-center justify-between gap-1 px-2">
				<NavLink className="flex min-w-0 items-center gap-2" onClick={onNavigate} to="/admin">
					<span className="grid size-8 shrink-0 place-items-center rounded-lg bg-teal-700 text-white">
						<IconHeartbeat aria-hidden="true" size={21} stroke={1.8} />
					</span>
					<span className="text-[15px] font-bold tracking-normal text-slate-900">CarePoint</span>
				</NavLink>
				{isMobile ? (
					<button aria-label="Close navigation menu" className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-white" onClick={onNavigate} type="button">
						<IconX aria-hidden="true" size={19} stroke={1.8} />
					</button>
				) : null}
			</div>
			<nav aria-label="Admin navigation" className="flex flex-1 flex-col gap-1">
				{links.map(renderLink)}
			</nav>
			<div className="mt-auto border-t border-slate-200 pt-3">
				{renderLink({ label: 'Settings', to: '/profile', Icon: IconSettings })}
			</div>
		</aside>
	);
}

export default AdminSidebar;
