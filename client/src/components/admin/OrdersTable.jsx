import PaymentBadge from './PaymentBadge';
import StatusBadge from './StatusBadge';
import StatusDropdown from './StatusDropdown';

const paymentStatuses = ['pending', 'paid', 'failed'];

function OrdersTable({ orders = [], onStatusChange, onPaymentChange }) {
	return (
		<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
			<div className="overflow-x-auto">
				<table className="min-w-305 w-full border-collapse text-left text-sm">
					<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
						<tr>
							<th className="px-4 py-3 font-semibold">Order ID</th>
							<th className="px-4 py-3 font-semibold">Customer</th>
							<th className="px-4 py-3 font-semibold">Items</th>
							<th className="px-4 py-3 font-semibold">Total Amount</th>
							<th className="px-4 py-3 font-semibold">Order Status</th>
							<th className="px-4 py-3 font-semibold">Payment</th>
							<th className="px-4 py-3 font-semibold">Order Date</th>
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
							const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';

							return (
								<tr className="align-middle text-slate-700" key={order._id}>
									<td className="max-w-48 break-all px-4 py-3 font-mono text-xs font-medium text-slate-900">{order._id || 'N/A'}</td>
									<td className="px-4 py-3">
										<div className="font-medium text-slate-900">{order.fullName || order.user?.name || 'Customer'}</div>
										{order.user?.email ? <div className="text-xs text-slate-500">{order.user.email}</div> : null}
										<div className="mt-1 text-xs text-slate-600">{order.mobileNumber || 'No contact number'}</div>
										<div className="mt-1 max-w-64 whitespace-normal wrap-break-word text-xs text-slate-500">{order.shippingAddress || 'No address provided'}</div>
									</td>
									<td className="px-4 py-3">
										<ul className="min-w-40 space-y-1">
											{(order.items || []).map((item, index) => (
												<li className="flex items-start justify-between gap-3" key={item._id || `${order._id}-${index}`}>
													<span className="max-w-48 whitespace-normal text-slate-700">{item.product?.name || 'Product'}</span>
													<span className="whitespace-nowrap text-xs text-slate-500">Qty {Number(item.quantity) || 0}</span>
												</li>
											))}
										</ul>
									</td>
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
