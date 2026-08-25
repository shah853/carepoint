import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import ProductList from '../components/products/ProductList';
import Loader from '../components/common/Loader';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ keyword: '', category: '', minPrice: '', maxPrice: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts(filters);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
      <div className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">CarePoint Pharmacy</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">All Products</h1>
        <p className="mt-2 text-sm text-slate-500">Trusted healthcare essentials, delivered with care.</p>
      </div>

      <div className="mb-7 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_140px_140px]">
        <input
          type="text"
          name="keyword"
          placeholder="Search products..."
          value={filters.keyword}
          onChange={handleFilterChange}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>

      {loading ? <Loader /> : <ProductList products={products} />}
      </div>
    </div>
  );
}

export default Products;