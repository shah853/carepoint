import { useEffect, useState } from 'react';
import {
  getMyAppointments,
  cancelAppointment,
  deleteAppointment,
} from '../services/appointmentService';
import Loader from '../components/common/Loader';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getMyAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          'Failed to load appointments.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await loadAppointments();
    };

    load();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelAppointment(id);
      await loadAppointments();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          'Failed to cancel appointment.'
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id);
      await loadAppointments();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          'Failed to delete appointment.'
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Appointments
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            View and manage your doctor appointments.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {appointments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              📅
            </div>

            <h2 className="mt-4 text-xl font-semibold text-slate-800">
              No appointments yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your doctor appointments will appear here.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {appointments.map((appointment) => {

              const status =
                appointment.status || 'pending';

              return (
                <div
                  key={appointment._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                  <div className="p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">

                        {appointment.doctor?.image ? (
                          <img
                            src={appointment.doctor.image}
                            alt={appointment.doctor?.name || 'Doctor'}
                            className="h-12 w-12 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://randomuser.me/api/portraits/men/32.jpg';
                            }}
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
                            ⚕️
                          </div>
                        )}

                        <div>
                          <h2 className="font-semibold text-slate-900">
                            Dr. {appointment.doctor?.name || 'Doctor'}
                          </h2>

                          <p className="mt-1 text-sm text-blue-600">
                            {appointment.doctor?.specialization ||
                              'Specialist'}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : status === 'confirmed'
                            ? 'bg-blue-100 text-blue-700'
                            : status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">

                      <div className="flex justify-between gap-4 text-sm">
                        <span className="text-slate-500">
                          Date
                        </span>

                        <span className="font-medium text-slate-700">
                          {appointment.date
                            ? new Date(
                                appointment.date
                              ).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 text-sm">
                        <span className="text-slate-500">
                          Time
                        </span>

                        <span className="font-medium text-slate-700">
                          {appointment.time || 'N/A'}
                        </span>
                      </div>

                      <div className="text-sm">
                        <span className="text-slate-500">
                          Reason
                        </span>

                        <p className="mt-1 rounded-lg bg-slate-50 p-3 text-slate-700">
                          {appointment.reason || 'N/A'}
                        </p>
                      </div>

                    </div>

                    {status === 'pending' ||
                    status === 'confirmed' ? (
                      <button
                        onClick={() =>
                          handleCancel(appointment._id)
                        }
                        className="mt-5 w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        Cancel Appointment
                      </button>
                    ) : null}

                    {status === 'cancelled' && (
                      <button
                        onClick={() =>
                          handleDelete(appointment._id)
                        }
                        className="mt-3 w-full rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete Appointment
                      </button>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Appointments;