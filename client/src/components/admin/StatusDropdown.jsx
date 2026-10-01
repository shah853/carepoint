const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function StatusDropdown({ currentStatus, onChange, statuses = orderStatuses, ariaLabel = 'Change order status' }) {
	return (
		<select
			aria-label={ariaLabel}
			className="w-full min-w-32 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
			onChange={(event) => onChange(event.target.value)}
			value={currentStatus || 'pending'}
		>
			{statuses.map((status) => (
				<option key={status} value={status}>
					{status.charAt(0).toUpperCase() + status.slice(1)}
				</option>
			))}
		</select>
	);
}

export default StatusDropdown;
