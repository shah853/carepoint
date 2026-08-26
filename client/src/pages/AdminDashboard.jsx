import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import Loader from '../components/common/Loader';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try { setLoading(true); setOrders(await getAllOrders()); }
    catch (error) { console.error('Failed to load admin dashboard:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const loadTimer = setTimeout(() => { loadDashboard(); }, 0);
    return () => clearTimeout(loadTimer);
  }, []);

  const handleOrderStatusChange = async (id, status) => {
    try { await updateOrderStatus(id, status); await loadDashboard(); }
    catch (error) { console.error('Failed to update order:', error); }
  };

  if (loading) return <Loader />;

  return <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10"><div className="mx-auto max-w-7xl"><div className="mb-8"><h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h1><p className="mt-2 text-slate-500">Manage customer pharmacy orders.</p></div><div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"><Stat label="Total Orders" value={orders.length} color="blue" /><Stat label="Pending Orders" value={orders.filter((order) => order.status === 'pending').length} color="yellow" /><Stat label="Delivered Orders" value={orders.filter((order) => order.status === 'delivered').length} color="green" /></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-5 text-xl font-semibold text-gray-900">Orders</h2><div className="space-y-4">{orders.length === 0 ? <div className="rounded-lg border p-6 text-center text-gray-500">No orders found.</div> : orders.map((order) => <div key={order._id} className="rounded-xl border p-4"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="space-y-1 text-sm text-gray-600"><h3 className="font-semibold text-gray-900">{order.fullName || order.user?.name || 'Customer'}</h3><p>Mobile: {order.mobileNumber || 'N/A'}</p><p>Order ID: #{order._id.slice(-8)}</p><p>Address: {order.shippingAddress}</p><p>Order date: {new Date(order.createdAt).toLocaleDateString()}</p><div className="pt-2"><p className="font-medium text-gray-700">Products:</p>{order.items.map((item) => <p key={`${order._id}-${item.product?._id || item._id}`}>{item.product?.name || 'Product'} x {item.quantity}</p>)}</div><p className="pt-1 font-semibold text-blue-600">Total: Rs. {order.totalPrice}</p></div><select value={order.status} onChange={(event) => handleOrderStatusChange(order._id, event.target.value)} className="rounded-lg border px-3 py-2 text-sm" aria-label={`Status for order ${order._id}`}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></div></div>)}</div></div></div></div>;
}

function Stat({ label, value, color }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className={`text-3xl font-bold text-${color}-600`}>{value}</p><p className="mt-1 text-sm text-gray-500">{label}</p></div>; }

export default AdminDashboard;
