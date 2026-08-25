import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getDoctors } from '../services/doctorService';
import ProductList from '../components/products/ProductList';
import Loader from '../components/common/Loader';

function Home() {
  const [products, setProducts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsData, doctorsData] = await Promise.all([
          getProducts(),
          getDoctors(),
        ]);

        setProducts(productsData.slice(0, 8));
        setDoctors(doctorsData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="-mb-6 bg-white sm:-mb-8">

      <section className="bg-blue-50 px-4 sm:px-6 pt-8 pb-16 sm:pt-12 sm:pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <div>
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-5">
              Your Health, Our Priority
            </span>

            <div className="mb-5 flex flex-col items-center text-center">
              <img
                src="/founder-muhammad-shah.jpg"
                alt="Muhammad Shah"
                className="h-28 w-28 rounded-full object-cover shadow-md sm:h-32 sm:w-32"
              />
              <span className="mt-3 text-sm font-semibold text-gray-700 sm:text-base">
                Muhammad Shah
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-5">
              Better Healthcare,
              <span className="text-blue-600"> Made Simple</span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg mb-8 max-w-xl">
              Find trusted doctors, book appointments, and shop quality
              healthcare products — all in one place with CarePoint.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/doctors"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-center hover:bg-blue-700 transition"
              >
                Find a Doctor
              </Link>

              <Link
                to="/products"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium text-center hover:bg-blue-100 transition"
              >
                Shop Products
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-7xl mb-5">
                🏥
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Complete Healthcare
              </h2>

              <p className="text-gray-500">
                Doctors, appointments and healthcare products in one
                convenient platform.
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Healthcare Made Easier
            </h2>

            <p className="text-gray-500 mt-2">
              Everything you need for your healthcare journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="border rounded-xl p-6 text-center hover:shadow-md transition">
              <div className="text-4xl mb-4">👨‍⚕️</div>

              <h3 className="font-semibold text-lg mb-2">
                Find Doctors
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Find qualified doctors based on their specialization.
              </p>

              <Link
                to="/doctors"
                className="text-blue-600 font-medium text-sm"
              >
                Find Doctor →
              </Link>
            </div>

            <div className="border rounded-xl p-6 text-center hover:shadow-md transition">
              <div className="text-4xl mb-4">📅</div>

              <h3 className="font-semibold text-lg mb-2">
                Book Appointment
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Schedule your appointment quickly and easily.
              </p>

              <Link
                to="/appointments"
                className="text-blue-600 font-medium text-sm"
              >
                My Appointments →
              </Link>
            </div>

            <div className="border rounded-xl p-6 text-center hover:shadow-md transition">
              <div className="text-4xl mb-4">💊</div>

              <h3 className="font-semibold text-lg mb-2">
                Medical Products
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Shop trusted healthcare and wellness products.
              </p>

              <Link
                to="/products"
                className="text-blue-600 font-medium text-sm"
              >
                Shop Products →
              </Link>
            </div>

            <div className="border rounded-xl p-6 text-center hover:shadow-md transition">
              <div className="text-4xl mb-4">🛒</div>

              <h3 className="font-semibold text-lg mb-2">
                Easy Shopping
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                Add products to your cart and checkout easily.
              </p>

              <Link
                to="/cart"
                className="text-blue-600 font-medium text-sm"
              >
                View Cart →
              </Link>
            </div>

          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Doctors
              </h2>

              <p className="text-gray-500 mt-1">
                Connect with trusted healthcare professionals.
              </p>
            </div>

            <Link
              to="/doctors"
              className="hidden sm:block text-blue-600 font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : doctors.length === 0 ? (
            <div className="bg-white border rounded-xl p-8 text-center">
              <p className="text-gray-500">
                Doctors will appear here soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white border rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                      👨‍⚕️
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">
                        Dr. {doctor.name}
                      </h3>

                      <p className="text-blue-600 text-sm">
                        {doctor.specialization || 'Medical Specialist'}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-5">
                    {doctor.experience
                      ? `${doctor.experience} years experience`
                      : 'Experienced healthcare professional'}
                  </p>

                  <Link
                    to="/doctors"
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Doctor
                  </Link>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-7xl mx-auto">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Products
              </h2>

              <p className="text-gray-500 mt-1">
                Quality healthcare products for your everyday needs.
              </p>
            </div>

            <Link
              to="/products"
              className="hidden sm:block text-blue-600 font-medium"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="border rounded-xl p-8 text-center">
              <p className="text-gray-500">
                Products will appear here soon.
              </p>
            </div>
          ) : (
            <ProductList products={products} />
          )}

        </div>
      </section>

      <section className="bg-blue-600 px-4 sm:px-6 py-14">
        <div className="max-w-4xl mx-auto text-center text-white">

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Take Care of Your Health Today
          </h2>

          <p className="text-blue-100 mb-8">
            Find a doctor, book an appointment, or explore our healthcare
            products.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">

            <Link
              to="/doctors"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Find a Doctor
            </Link>

            <Link
              to="/products"
              className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Explore Products
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;