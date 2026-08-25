import { useEffect, useState } from 'react';
import api from '../services/api';
import { getAllOrders, updateOrderStatus } from '../services/orderService';
import Loader from '../components/common/Loader';

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDoctorForm, setShowDoctorForm] = useState(false);

  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    department: '',
    available: true,
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [doctorsRes, appointmentsRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/appointments/all'),
      ]);

      const ordersData = await getAllOrders();

      setDoctors(doctorsRes.data);
      setAppointments(appointmentsRes.data);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadDashboard();
    };

    load();
  }, []);

  const handleDoctorChange = (e) => {
    const { name, value, type, checked } = e.target;

    setDoctorForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();

    try {
      await api.post('/doctors', {
        ...doctorForm,
        experience: Number(doctorForm.experience),
      });

      setDoctorForm({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        qualification: '',
        experience: '',
        department: '',
        available: true,
      });

      setShowDoctorForm(false);

      await loadDashboard();
    } catch (error) {
      console.error('Failed to create doctor:', error);
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await api.delete(`/doctors/${id}`);
      await loadDashboard();
    } catch (error) {
      console.error('Failed to delete doctor:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, {
        status,
      });

      await loadDashboard();
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const handleOrderStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      await loadDashboard();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === 'pending'
  );

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === 'completed'
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage doctors and patient appointments.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-3xl font-bold text-blue-600">
              {doctors.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Doctors
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-3xl font-bold text-blue-600">
              {appointments.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Appointments
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-3xl font-bold text-yellow-600">
              {pendingAppointments.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Pending
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-3xl font-bold text-green-600">
              {completedAppointments.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Completed
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Doctors
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Manage CarePoint doctors.
              </p>
            </div>

            <button
              onClick={() => setShowDoctorForm(!showDoctorForm)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              {showDoctorForm ? 'Cancel' : 'Add Doctor'}
            </button>
          </div>

          {showDoctorForm && (
            <form
              onSubmit={handleCreateDoctor}
              className="border rounded-xl p-5 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Doctor name"
                value={doctorForm.name}
                onChange={handleDoctorChange}
                required
                className="border rounded-lg px-4 py-2.5"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={doctorForm.email}
                onChange={handleDoctorChange}
                required
                className="border rounded-lg px-4 py-2.5"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={doctorForm.phone}
                onChange={handleDoctorChange}
                required
                className="border rounded-lg px-4 py-2.5"
              />

              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={doctorForm.specialization}
                onChange={handleDoctorChange}
                required
                className="border rounded-lg px-4 py-2.5"
              />

              <input
                type="text"
                name="qualification"
                placeholder="Qualification"
                value={doctorForm.qualification}
                onChange={handleDoctorChange}
                required
                className="border rounded-lg px-4 py-2.5"
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience in years"
                value={doctorForm.experience}
                onChange={handleDoctorChange}
                required
                min="0"
                className="border rounded-lg px-4 py-2.5"
              />

              <input
                type="text"
                name="department"
                placeholder="Department"
                value={doctorForm.department}
                onChange={handleDoctorChange}
                required
                className="border rounded-lg px-4 py-2.5"
              />

              <label className="flex items-center gap-3 border rounded-lg px-4 py-2.5">
                <input
                  type="checkbox"
                  name="available"
                  checked={doctorForm.available}
                  onChange={handleDoctorChange}
                />

                <span className="text-sm text-gray-700">
                  Doctor is available
                </span>
              </label>

              <button
                type="submit"
                className="md:col-span-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
              >
                Create Doctor
              </button>
            </form>
          )}

          <div className="space-y-3">
            {doctors.length === 0 ? (
              <div className="border rounded-lg p-6 text-center text-gray-500">
                No doctors found.
              </div>
            ) : (
              doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {doctor.name}
                    </h3>

                    <p className="text-sm text-blue-600">
                      {doctor.specialization}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {doctor.department} · {doctor.experience} years
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteDoctor(doctor._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Appointments
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage patient appointments.
            </p>
          </div>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="border rounded-lg p-6 text-center text-gray-500">
                No appointments found.
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-xl p-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {appointment.patient?.name || 'Patient'}
                      </h3>

                      <p className="text-sm text-blue-600">
                        Dr. {appointment.doctor?.name || 'Doctor'}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.doctor?.specialization}
                      </p>

                      <p className="text-sm text-gray-500 mt-2">
                        Date:{' '}
                        {new Date(
                          appointment.date
                        ).toLocaleDateString()}
                      </p>

                      <p className="text-sm text-gray-500">
                        Time: {appointment.time}
                      </p>

                      <p className="text-sm text-gray-500">
                        Reason: {appointment.reason}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                      <select
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(
                            appointment._id,
                            e.target.value
                          )
                        }
                        className="border rounded-lg px-3 py-2"
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="confirmed">
                          Confirmed
                        </option>

                        <option value="completed">
                          Completed
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>
                      </select>

                      <span
                        className={`text-center px-3 py-2 rounded-lg text-sm font-medium ${
                          appointment.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : appointment.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-700'
                            : appointment.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Manage customer pharmacy orders.</p>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="border rounded-lg p-6 text-center text-gray-500">No orders found.</div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="border rounded-xl p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-1 text-sm text-gray-600">
                      <h3 className="font-semibold text-gray-900">{order.fullName || order.user?.name || 'Customer'}</h3>
                      <p>Mobile: {order.mobileNumber || 'N/A'}</p>
                      <p>Order ID: #{order._id.slice(-8)}</p>
                      <p>Address: {order.shippingAddress}</p>
                      <p>Order date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <div className="pt-2">
                        <p className="font-medium text-gray-700">Products:</p>
                        {order.items.map((item) => (
                          <p key={`${order._id}-${item.product?._id || item._id}`}>
                            {item.product?.name || 'Product'} x {item.quantity}
                          </p>
                        ))}
                      </div>
                      <p className="pt-1 font-semibold text-blue-600">Total: Rs. {order.totalPrice}</p>
                    </div>

                    <select
                      value={order.status}
                      onChange={(event) => handleOrderStatusChange(order._id, event.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm"
                      aria-label={`Status for order ${order._id}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;