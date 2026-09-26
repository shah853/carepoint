const chartWidth = 640;
const chartHeight = 250;
const chartPadding = { top: 18, right: 18, bottom: 34, left: 34 };

function buildSmoothPath(points) {
	if (!points.length) return '';
	if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

	return points.reduce((path, point, index) => {
		if (index === 0) return `M ${point.x} ${point.y}`;
		const previous = points[index - 1];
		const segment = point.x - previous.x;
		return `${path} C ${previous.x + segment / 3} ${previous.y}, ${point.x - segment / 3} ${point.y}, ${point.x} ${point.y}`;
	}, '');
}

function OrdersAnalyticsChart({ data = [] }) {
	const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
	const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;
	const maximum = Math.max(1, ...data.flatMap((item) => [Number(item.orders) || 0, Number(item.appointments) || 0]));
	const getPoints = (key) => data.map((item, index) => ({
		x: chartPadding.left + (data.length > 1 ? (index / (data.length - 1)) * plotWidth : plotWidth / 2),
		y: chartPadding.top + plotHeight - ((Number(item[key]) || 0) / maximum) * plotHeight,
	}));
	const orderPoints = getPoints('orders');
	const appointmentPoints = getPoints('appointments');
	const gridLevels = [0, 0.5, 1];

	return (
		<section aria-labelledby="orders-analytics-title" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<h2 className="text-base font-semibold text-slate-900" id="orders-analytics-title">Orders analytics</h2>
				<div className="flex items-center gap-4 text-xs text-slate-500" aria-label="Chart legend">
					<span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-teal-600" />Orders</span>
					<span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-blue-500" />Appointments</span>
				</div>
			</div>
			{data.length ? (
				<svg
					aria-label="Orders and appointments over the week"
					className="block h-auto w-full overflow-visible"
					role="img"
					viewBox={`0 0 ${chartWidth} ${chartHeight}`}
				>
					{gridLevels.map((level) => {
						const y = chartPadding.top + plotHeight * level;
						return <line key={level} x1={chartPadding.left} x2={chartWidth - chartPadding.right} y1={y} y2={y} stroke="#e8eef2" strokeDasharray="4 6" />;
					})}
					<path d={buildSmoothPath(orderPoints)} fill="none" stroke="#0f9d91" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
					<path d={buildSmoothPath(appointmentPoints)} fill="none" stroke="#4d8df5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
					{orderPoints.map((point, index) => <circle key={`order-${data[index].label}`} cx={point.x} cy={point.y} r="3.5" fill="white" stroke="#0f9d91" strokeWidth="2" />)}
					{appointmentPoints.map((point, index) => <circle key={`appointment-${data[index].label}`} cx={point.x} cy={point.y} r="3.5" fill="white" stroke="#4d8df5" strokeWidth="2" />)}
					{data.map((item, index) => (
						<text key={item.label} x={chartPadding.left + (data.length > 1 ? (index / (data.length - 1)) * plotWidth : plotWidth / 2)} y={chartHeight - 8} textAnchor="middle" fill="#8492a2" fontSize="11">
							{item.label}
						</text>
					))}
				</svg>
			) : <p className="py-12 text-center text-sm text-slate-500">No weekly activity to display.</p>}
		</section>
	);
}

export default OrdersAnalyticsChart;