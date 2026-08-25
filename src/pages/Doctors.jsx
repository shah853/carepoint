import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDoctors } from '../services/doctorService';
import Loader from '../components/common/Loader';

function Doctors() {
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setDoctors(await getDoctors());
      } catch (loadError) {
        console.error('Failed to load doctors:', loadError);
        setError(loadError.response?.data?.message || 'Failed to load doctors.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const searchText = search.toLowerCase().trim();

    return (
      doctor.name?.toLowerCase().includes(searchText) ||
      doctor.specialization?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600">
              CarePoint Healthcare
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Find the Right Doctor
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Connect with qualified healthcare professionals and
              book an appointment at your convenience.
            </p>

            {/* Search */}
            <div className="relative mx-auto mt-7 max-w-xl">

              <input
                type="text"
                placeholder="Search doctor or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 pl-12 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                🔍
              </span>

            </div>

          </div>

        </div>
      </section>

      {/* Doctors */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Our Doctors
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredDoctors.length} doctor
              {filteredDoctors.length !== 1 ? 's' : ''} available
            </p>
          </div>

          <div className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm">
            ✓ Trusted Healthcare Professionals
          </div>

        </div>

        {/* No Doctors */}
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center text-sm text-red-600">
            {error}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
              ⚕️
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-800">
              No doctors found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try searching with another name or specialization.
            </p>

            <button
              onClick={() => setSearch('')}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear Search
            </button>

          </div>
        ) : (

          /* Doctor Grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {filteredDoctors.map((doctor) => (

              <div
                key={doctor._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* Doctor Image */}
                <div className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-5 pt-6">

                  <span className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-600">

                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                    Available

                  </span>

                  <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-md">

                    <img
                      src={doctor.image || 'https://randomuser.me/api/portraits/men/32.jpg'}
                      alt={`Dr. ${doctor.name}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://randomuser.me/api/portraits/men/32.jpg';
                      }}
                    />

                  </div>

                  <div className="h-5" />

                </div>

                {/* Doctor Info */}
                <div className="p-5">

                  <div className="text-center">

                    <h3 className="text-base font-bold text-slate-900">
                      Dr. {doctor.name}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {doctor.specialization}
                    </p>

                  </div>

                  {/* Stats */}
                  <div className="mt-5 grid grid-cols-2 gap-2">

                    <div className="rounded-xl bg-slate-50 px-2 py-3 text-center">

                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Experience
                      </p>

                      <p className="mt-1 text-sm font-bold text-slate-700">
                        {doctor.experience} Years
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 px-2 py-3 text-center">

                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Status
                      </p>

                      <p className="mt-1 text-sm font-bold text-green-600">
                        Available
                      </p>

                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="mt-5 flex flex-col gap-2">

                    {/* IMPORTANT: Booking Page */}
                    <Link
                      to={`/appointment-booking?doctor=${doctor._id}`}
                      className="w-full rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Book Appointment
                    </Link>

                    <Link
                      to={`/appointment-booking?doctor=${doctor._id}`}
                      className="w-full rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      View Details
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

      {/* Features */}
      <section className="border-t border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            <div className="rounded-2xl bg-blue-50 p-5">

              <div className="text-2xl text-blue-600">
                ⚕️
              </div>

              <h3 className="mt-3 font-semibold text-slate-800">
                Qualified Doctors
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Connect with experienced healthcare professionals.
              </p>

            </div>

            <div className="rounded-2xl bg-green-50 p-5">

              <div className="text-2xl text-green-600">
                ✓
              </div>

              <h3 className="mt-3 font-semibold text-slate-800">
                Easy Booking
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Book your appointment quickly and easily.
              </p>

            </div>

            <div className="rounded-2xl bg-cyan-50 p-5">

              <div className="text-2xl text-cyan-600">
                🕐
              </div>

              <h3 className="mt-3 font-semibold text-slate-800">
                Flexible Appointments
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Choose a convenient time for your consultation.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Doctors;