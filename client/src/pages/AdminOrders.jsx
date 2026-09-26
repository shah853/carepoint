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
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;

		getAllOrders()
			.then((data) => {
				if (active) setOrders(data);
			})
			.catch((requestError) => {
				if (active) setError(requestError.response?.data?.message || 'Could not load orders.');
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => { active = false; };
	}, []);

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
					{error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p> : null}
					{loading ? <Loader /> : (
						<OrdersTable
							onPaymentChange={(id, status) => handleChange(id, status, updatePaymentStatus)}
							onStatusChange={(id, status) => handleChange(id, status, updateOrderStatus)}
							orders={orders}
						/>
					)}
			</div>
		</AdminLayout>
	);
}

export default AdminOrders;
