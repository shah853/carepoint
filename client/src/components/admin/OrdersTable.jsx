import PaymentBadge from './PaymentBadge';
import StatusBadge from './StatusBadge';
import StatusDropdown from './StatusDropdown';

const paymentStatuses = ['pending', 'paid', 'failed'];

function OrdersTable({ orders = [], onStatusChange, onPaymentChange }) {
	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
			<div className="overflow-x-auto">
				<table className="min-w-[940px] w-full border-collapse text-left text-sm">
					<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
						<tr>
							<th className="px-4 py-3 font-semibold">Order ID</th>
							<th className="px-4 py-3 font-semibold">Customer</th>
							<th className="px-4 py-3 font-semibold">Items</th>
							<th className="px-4 py-3 font-semibold">Total</th>
							<th className="px-4 py-3 font-semibold">Status</th>
							<th className="px-4 py-3 font-semibold">Payment</th>
							<th className="px-4 py-3 font-semibold">Date</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{orders.length === 0 ? (
							<tr>
								<td className="px-4 py-12 text-center text-slate-500" colSpan="7">
									No orders found.
								</td>
							</tr>
						) : orders.map((order) => {
							const itemsCount = (order.items || []).reduce(
								(count, item) => count + (Number(item.quantity) || 0),
								0
							);
							const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';

							return (
								<tr className="align-middle text-slate-700" key={order._id}>
									<td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">#{order._id?.slice(-8) || 'N/A'}</td>
									<td className="px-4 py-3">
										<div className="font-medium text-slate-900">{order.fullName || order.user?.name || 'Customer'}</div>
										<div className="text-xs text-slate-500">{order.user?.email || ''}</div>
									</td>
									<td className="px-4 py-3">{itemsCount}</td>
									<td className="whitespace-nowrap px-4 py-3">Rs. {Number(order.totalPrice || 0).toLocaleString()}</td>
									<td className="px-4 py-3">
										<div className="flex min-w-40 flex-col items-start gap-2">
											<StatusBadge status={order.status} />
											<StatusDropdown
												currentStatus={order.status}
												onChange={(status) => onStatusChange?.(order._id, status)}
											/>
										</div>
									</td>
									<td className="px-4 py-3">
										<div className="flex min-w-32 flex-col items-start gap-2">
											<PaymentBadge paymentStatus={order.paymentStatus} />
											<select
												aria-label={`Change payment status for order ${order._id}`}
												className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
												onChange={(event) => onPaymentChange?.(order._id, event.target.value)}
												value={order.paymentStatus || 'pending'}
											>
												{paymentStatuses.map((status) => (
													<option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
												))}
											</select>
										</div>
									</td>
									<td className="whitespace-nowrap px-4 py-3 text-slate-500">{date}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default OrdersTable;
