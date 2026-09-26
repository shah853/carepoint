import { useEffect, useState } from 'react';
import { IconCoin, IconShoppingBag, IconUsers } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AppointmentTarget from '../components/admin/AppointmentTarget';
import OrdersAnalyticsChart from '../components/admin/OrdersAnalyticsChart';
import PaymentBadge from '../components/admin/PaymentBadge';
import StatsCard from '../components/admin/StatsCard';
import StatusBadge from '../components/admin/StatusBadge';
import Loader from '../components/common/Loader';
import { getAllOrders, getDashboardStats } from '../services/adminService';

const weeklyActivity = [
  { label: 'Mon', orders: 18, appointments: 12 },
  { label: 'Tue', orders: 24, appointments: 16 },
  { label: 'Wed', orders: 20, appointments: 19 },
  { label: 'Thu', orders: 31, appointments: 22 },
  { label: 'Fri', orders: 27, appointments: 18 },
  { label: 'Sat', orders: 36, appointments: 25 },
  { label: 'Sun', orders: 30, appointments: 21 },
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.allSettled([getDashboardStats(), getAllOrders()])
      .then(([statsResult, ordersResult]) => {
        if (!active) return;
        if (statsResult.status === 'fulfilled') setStats(statsResult.value);
        else setError(statsResult.reason.response?.data?.message || 'Could not load dashboard statistics.');
        if (ordersResult.status === 'fulfilled') setOrders(ordersResult.value);
        else setError((current) => current || ordersResult.reason.response?.data?.message || 'Could not load recent orders.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">CarePoint administration</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950">Overview</h1>
        </header>
        {error ? <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p> : null}
        {loading ? <Loader /> : (
          <div className="space-y-5 sm:space-y-6">
            <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatsCard color="teal" icon={<IconCoin size={20} stroke={1.8} />} title="Total Revenue" value={`Rs. ${Number(stats?.totalRevenue || 0).toLocaleString()}`} />
              <StatsCard color="blue" icon={<IconShoppingBag size={20} stroke={1.8} />} title="Total Orders" value={Number(stats?.totalOrders || 0).toLocaleString()} />
              <StatsCard color="violet" icon={<IconUsers size={20} stroke={1.8} />} title="Total Patients" value={Number(stats?.totalUsers || 0).toLocaleString()} />
            </section>

            <section aria-label="Weekly activity" className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
              <OrdersAnalyticsChart data={weeklyActivity} />
              <AppointmentTarget label="Appointment target" percentage={72} />
            </section>

            <section aria-labelledby="recent-orders-title" className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900" id="recent-orders-title">Recent orders</h2>
                <Link className="text-sm font-medium text-teal-700 hover:text-teal-900" to="/admin/orders">View all</Link>
              </div>
              {recentOrders.length ? (
                <div className="divide-y divide-slate-100">
                  {recentOrders.map((order) => {
                    const categories = (order.items || []).map((item) => item.product?.category?.name || item.category).filter(Boolean);
                    const subtitle = [...new Set(categories)].join(', ') || 'Pharmacy order';

                    return (
                      <div className="flex flex-col gap-3 py-4 first:pt-1 last:pb-0 sm:flex-row sm:items-center sm:gap-4" key={order._id}>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-900">{order.fullName || order.user?.name || 'Patient'}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">#{order._id?.slice(-8)} <span aria-hidden="true">·</span> {subtitle}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:w-44">
                          <StatusBadge status={order.status} />
                          <PaymentBadge paymentStatus={order.paymentStatus} />
                        </div>
                        <p className="text-sm font-semibold text-slate-900 sm:w-28 sm:text-right">Rs. {Number(order.totalPrice || 0).toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
              ) : <p className="py-8 text-center text-sm text-slate-500">No recent orders found.</p>}
            </section>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
