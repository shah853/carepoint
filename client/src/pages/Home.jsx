import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductList from '../components/products/ProductList';
import Loader from '../components/common/Loader';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData.slice(0, 8));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="-mb-6 bg-white sm:-mb-8">
      <section className="bg-blue-50 px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12"><div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2"><div><span className="mb-5 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">Your Health, Our Priority</span><h1 className="mb-5 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">Better Healthcare,<span className="text-blue-600"> Made Simple</span></h1><p className="mb-8 max-w-xl text-base text-gray-600 sm:text-lg">Shop quality healthcare and wellness products from CarePoint.</p><Link to="/products" className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">Shop Products</Link></div><div className="rounded-2xl bg-white p-8 text-center shadow-lg"><div className="mb-5 text-7xl">🏥</div><h2 className="mb-3 text-2xl font-bold text-gray-800">Complete Healthcare</h2><p className="text-gray-500">Healthcare products for your everyday needs.</p></div></div></section>
      <section className="px-4 py-12 sm:px-6"><div className="mx-auto max-w-7xl"><div className="mb-10 text-center"><h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Healthcare Made Easier</h2><p className="mt-2 text-gray-500">Everything you need for your healthcare journey.</p></div><div className="grid grid-cols-1 gap-6 sm:grid-cols-2"><div className="rounded-xl border p-6 text-center transition hover:shadow-md"><h3 className="mb-2 text-lg font-semibold">Medical Products</h3><p className="mb-4 text-sm text-gray-500">Shop trusted healthcare and wellness products.</p><Link to="/products" className="text-sm font-medium text-blue-600">Shop Products →</Link></div><div className="rounded-xl border p-6 text-center transition hover:shadow-md"><h3 className="mb-2 text-lg font-semibold">Easy Shopping</h3><p className="mb-4 text-sm text-gray-500">Add products to your cart and checkout easily.</p><Link to="/cart" className="text-sm font-medium text-blue-600">View Cart →</Link></div></div></div></section>
      <section className="px-4 py-12 sm:px-6"><div className="mx-auto max-w-7xl"><div className="mb-8 flex items-center justify-between"><div><h2 className="text-2xl font-bold text-gray-900">Featured Products</h2><p className="mt-1 text-gray-500">Quality healthcare products for your everyday needs.</p></div><Link to="/products" className="hidden font-medium text-blue-600 sm:block">View All →</Link></div>{loading ? <Loader /> : products.length === 0 ? <div className="rounded-xl border p-8 text-center"><p className="text-gray-500">Products will appear here soon.</p></div> : <ProductList products={products} />}</div></section>
    </div>
  );
}

export default Home;
