const iconStyles = {
	teal: 'bg-teal-50 text-teal-700',
	blue: 'bg-blue-50 text-blue-700',
	amber: 'bg-amber-50 text-amber-700',
	green: 'bg-emerald-50 text-emerald-700',
	violet: 'bg-violet-50 text-violet-700',
	rose: 'bg-rose-50 text-rose-700',
	slate: 'bg-slate-100 text-slate-700',
};

function StatsCard({ title, value, icon, color = 'teal', subtitle }) {
	return (
		<article className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
			<div className="flex min-h-8 items-center justify-between gap-3">
				<h2 className="text-sm font-medium text-slate-500">{title}</h2>
				{icon ? <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${iconStyles[color] || iconStyles.teal}`} aria-hidden="true">{icon}</span> : null}
			</div>
			<p className="mt-2 wrap-break-word text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl">{value}</p>
			{subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
		</article>
	);
}

export default StatsCard;
