import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createAppointment } from '../services/appointmentService';

function AppointmentBooking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId) {
      setError('Doctor information is missing.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await createAppointment({
        doctor: doctorId,
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
      });

      navigate('/appointments');
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          'Failed to book appointment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">

        <Link
          to="/doctors"
          className="mb-6 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Doctors
        </Link>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="bg-blue-600 px-5 py-6 text-white sm:px-8">
            <p className="text-sm font-medium text-blue-100">
              CarePoint Healthcare
            </p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Book Appointment
            </h1>

            <p className="mt-2 text-sm text-blue-100">
              Choose your preferred date and consultation time.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-5 sm:p-8"
          >

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Appointment Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Appointment Time
              </label>

              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Select a time</option>
                <optgroup label="Morning">
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                </optgroup>
                <optgroup label="Afternoon">
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                </optgroup>
                <optgroup label="Evening">
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Reason for Visit
              </label>

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe your reason for visiting..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default AppointmentBooking;