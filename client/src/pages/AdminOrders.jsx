import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import OrdersTable from '../components/admin/OrdersTable';
import Loader from '../components/common/Loader';
import {
	getAllOrders,
	updateOrderStatus,
	updatePaymentStatus,
} from '../services/adminService';

function AdminOrders() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [searching, setSearching] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;
		const timeoutId = window.setTimeout(() => {
			getAllOrders(search.trim())
				.then((data) => {
					if (active) setOrders(data);
				})
				.catch((requestError) => {
					if (active) setError(requestError.response?.data?.message || 'Could not load orders.');
				})
				.finally(() => {
					if (active) {
						setLoading(false);
						setSearching(false);
					}
				});
		}, search.trim() ? 400 : 0);

		return () => {
			active = false;
			window.clearTimeout(timeoutId);
		};
	}, [search]);

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
		setSearching(true);
		setError('');
	};

	const handleChange = async (id, status, update) => {
		setError('');
		try {
			const updatedOrder = await update(id, status);
			setOrders((currentOrders) => currentOrders.map((order) => (
				order._id === id ? { ...order, ...updatedOrder } : order
			)));
		} catch (requestError) {
			setError(requestError.response?.data?.message || 'Could not update the order.');
		}
	};

	return (
		<AdminLayout>
			<div className="mx-auto max-w-7xl">
					<header className="mb-6">
						<p className="text-sm font-medium text-teal-700">Operations</p>
						<h1 className="mt-1 text-2xl font-semibold text-slate-950">Orders</h1>
					</header>
					<div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
						<input
							aria-label="Search orders by patient name or product"
							className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:max-w-md"
							onChange={handleSearchChange}
							placeholder="Search by patient name or product..."
							value={search}
						/>
						{searching ? (
							<span className="inline-flex items-center gap-2 text-sm text-slate-500" role="status">
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
								Searching...
							</span>
						) : null}
					</div>
					{error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p> : null}
					{loading ? <Loader /> : (
						orders.length === 0 && search.trim() ? (
							<p className="rounded-lg border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
								No orders found for '{search.trim()}'
							</p>
						) : (
							<OrdersTable
								onPaymentChange={(id, status) => handleChange(id, status, updatePaymentStatus)}
								onStatusChange={(id, status) => handleChange(id, status, updateOrderStatus)}
								orders={orders}
							/>
						)
					)}
			</div>
		</AdminLayout>
	);
}

export default AdminOrders;
