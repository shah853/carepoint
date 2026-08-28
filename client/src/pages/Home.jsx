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
      setLoading(true);

      const [productsResult, doctorsResult] = await Promise.allSettled([
        getProducts(),
        getDoctors(),
      ]);

      setProducts(
        productsResult.status === 'fulfilled' && Array.isArray(productsResult.value)
          ? productsResult.value.slice(0, 8)
          : []
      );

      setDoctors(
        doctorsResult.status === 'fulfilled' && Array.isArray(doctorsResult.value)
          ? doctorsResult.value.slice(0, 3)
          : []
      );

      setLoading(false);
    };
    fetchHomeData();
  }, []);

  return (
    <div className="-mb-6 bg-white sm:-mb-8">
      <section className="bg-blue-50 px-4 pt-8 pb-16 sm:px-6 sm:pt-12 sm:pb-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
          <div>
            <span className="mb-5 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
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

            <h1 className="mb-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              Better Healthcare, <span className="text-blue-600">Made Simple</span>
            </h1>

            <p className="mb-8 max-w-xl text-base text-gray-600 sm:text-lg">
              Find trusted doctors and shop quality health products — all in one place with CarePoint.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/doctors"
                className="rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition hover:bg-blue-700"
              >
                Find a Doctor
              </Link>
              <Link
                to="/products"
                className="rounded-lg border border-blue-600 px-6 py-3 text-center font-medium text-blue-600 transition hover:bg-blue-100"
              >
                Shop Products
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="mb-5 text-7xl">🏥</div>
              <h2 className="mb-3 text-2xl font-bold text-gray-800">Complete Healthcare</h2>
              <p className="text-gray-500">
                Doctors and healthcare products in one convenient platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Doctors</h2>
              <p className="mt-1 text-gray-500">Connect with trusted healthcare professionals.</p>
            </div>
            <Link to="/doctors" className="hidden font-medium text-blue-600 sm:block">
              View All →
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : doctors.length === 0 ? (
            <div className="rounded-xl border bg-white p-8 text-center">
              <p className="text-gray-500">Doctors will appear here soon.</p>
              <Link
                to="/doctors"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                View Doctors
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doctor) => (
                <div key={doctor._id} className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
                      👨‍⚕️
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Dr. {doctor.name}</h3>
                      <p className="text-sm text-blue-600">{doctor.specialization}</p>
                    </div>
                  </div>
                  <p className="mb-5 text-sm text-gray-500">
                    {doctor.experience ? `${doctor.experience} years experience` : 'Experienced professional'}
                  </p>
                  <Link
                    to="/doctors"
                    className="block rounded-lg bg-blue-600 py-2 text-center text-white transition hover:bg-blue-700"
                  >
                    View Doctor
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
              <p className="mt-1 text-gray-500">Quality healthcare products for your everyday needs.</p>
            </div>
            <Link to="/products" className="hidden font-medium text-blue-600 sm:block">
              View All →
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="rounded-xl border p-8 text-center">
              <p className="text-gray-500">Products will appear here soon.</p>
              <Link
                to="/products"
                className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                View Products
              </Link>
            </div>
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </section>

      <section className="bg-blue-600 px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Take Care of Your Health Today</h2>
          <p className="mb-8 text-blue-100">Find a doctor or explore our healthcare products.</p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/doctors"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-gray-100"
            >
              Find a Doctor
            </Link>
            <Link
              to="/products"
              className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
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