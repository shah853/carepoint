function AppointmentTarget({ percentage = 0, label = 'Appointment target' }) {
	const value = Math.min(100, Math.max(0, Number(percentage) || 0));

	return (
		<section aria-label={label} className="flex min-h-full flex-col rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
			<h2 className="text-base font-semibold text-slate-900">{label}</h2>
			<div className="flex flex-1 items-center justify-center py-5">
				<div
					aria-label={`${value}% complete`}
					className="grid size-44 place-items-center rounded-full sm:size-48"
					role="img"
					style={{ background: `conic-gradient(#0f9d91 ${value}%, #e8eef2 ${value}% 100%)` }}
				>
					<div className="grid size-[calc(100%-18px)] place-items-center rounded-full bg-white">
						<div className="text-center">
							<p className="text-4xl font-semibold tracking-normal text-slate-900">{value}%</p>
							<p className="mt-1 text-xs text-slate-500">of weekly goal</p>
						</div>
					</div>
				</div>
			</div>
			<p className="text-center text-sm text-slate-500">Appointments completed this week</p>
		</section>
	);
}

export default AppointmentTarget;