const paymentStyles = {
	pending: 'bg-amber-100 text-amber-800 ring-amber-200',
	paid: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
	failed: 'bg-red-100 text-red-800 ring-red-200',
};

function PaymentBadge({ paymentStatus }) {
	const label = paymentStatus || 'pending';

	return (
		<span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${paymentStyles[label] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
			{label}
		</span>
	);
}

export default PaymentBadge;
