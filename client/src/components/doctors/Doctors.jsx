import { useEffect, useState } from 'react';
import { getDoctors } from '../services/doctorService';
import Loader from '../components/common/Loader';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: '', specialization: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const data = await getDoctors(filters);
        setDoctors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Find a Doctor</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          name="keyword"
          placeholder="Search by doctor name..."
          value={filters.keyword}
          onChange={handleFilterChange}
          className="border rounded-md px-4 py-2 flex-1 text-base"
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization (e.g. Cardiologist)"
          value={filters.specialization}
          onChange={handleFilterChange}
          className="border rounded-md px-4 py-2 flex-1 text-base"
        />
      </div>

      {loading ? (
        <Loader />
      ) : doctors.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No doctors found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <div key={doctor._id} className="border rounded-xl p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="font-semibold">Dr. {doctor.name}</h3>
                  <p className="text-sm text-blue-600">{doctor.specialization}</p>
                </div>
              </div>

              {doctor.qualification && (
                <p className="text-sm text-gray-600 mb-1">{doctor.qualification}</p>
              )}
              <p className="text-sm text-gray-500 mb-1">
                {doctor.experience ? `${doctor.experience} years experience` : 'Experienced professional'}
              </p>
              {doctor.fee > 0 && (
                <p className="text-sm font-medium text-gray-800 mt-2">Fee: Rs. {doctor.fee}</p>
              )}
              {doctor.bio && (
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{doctor.bio}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Doctors;