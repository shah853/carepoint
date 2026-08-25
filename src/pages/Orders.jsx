import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import Loader from '../components/common/Loader';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-orange-100 text-orange-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Order history</p>
      <h1 className="mt-2 mb-7 text-2xl font-bold text-slate-900 sm:text-3xl">My Orders</h1>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <p className="text-sm text-gray-500">
                Order #{order._id.slice(-8)}
              </p>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status]}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            <p className="text-sm text-slate-500">
              {order.items.length} item{order.items.length > 1 ? 's' : ''}
            </p>
            <p className="mt-2 font-bold text-blue-700">Rs. {order.totalPrice}</p>
            <p className="mt-2 text-xs text-slate-400">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default Orders;