const statusStyles = {
	pending: 'bg-amber-100 text-amber-800 ring-amber-200',
	processing: 'bg-blue-100 text-blue-800 ring-blue-200',
	shipped: 'bg-blue-100 text-blue-800 ring-blue-200',
	delivered: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
	cancelled: 'bg-red-100 text-red-800 ring-red-200',
};

function StatusBadge({ status }) {
	const label = status || 'unknown';

	return (
		<span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[label] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
			{label}
		</span>
	);
}

export default StatusBadge;
