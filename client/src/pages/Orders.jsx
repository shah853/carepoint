import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import Loader from '../components/common/Loader';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getMyOrders();

        console.log('MY ORDERS RESPONSE:', response);

        let ordersData = [];

        if (Array.isArray(response)) {
          ordersData = response;
        } else if (Array.isArray(response?.orders)) {
          ordersData = response.orders;
        } else if (Array.isArray(response?.data)) {
          ordersData = response.data;
        } else if (Array.isArray(response?.data?.orders)) {
          ordersData = response.data.orders;
        }

        if (!Array.isArray(ordersData)) {
          throw new Error('Invalid orders response from server.');
        }

        setOrders(ordersData);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setOrders([]);
        setError(
          err?.response?.data?.message ||
          err?.message ||
          'Failed to load your orders.'
        );
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

  const safeOrders = Array.isArray(orders) ? orders : [];

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-red-600">
            Unable to load orders
          </h2>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  if (safeOrders.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 text-center py-16 px-4">
        <p className="text-gray-600 mb-4">
          You haven't placed any orders yet
        </p>

        <Link
          to="/products"
          className="text-blue-600 hover:underline"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          Order history
        </p>

        <h1 className="mt-2 mb-7 text-2xl font-bold text-slate-900 sm:text-3xl">
          My Orders
        </h1>

        <div className="flex flex-col gap-4">
          {safeOrders.map((order) => {
            const orderId = order?._id || order?.id || '';
            const status = order?.status || 'pending';
            const items = Array.isArray(order?.items)
              ? order.items
              : [];

            const statusClass =
              statusColors[status] ||
              'bg-gray-100 text-gray-700';

            return (
              <div
                key={orderId}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
                  <p className="text-sm text-gray-500">
                    Order #{orderId ? orderId.slice(-8) : 'N/A'}
                  </p>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                <p className="text-sm text-slate-500">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </p>

                <p className="mt-2 font-bold text-blue-700">
                  Rs. {order?.totalPrice ?? 0}
                </p>

                <p className="mt-2 text-xs text-slate-400">
                  Placed on{' '}
                  {order?.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Orders;