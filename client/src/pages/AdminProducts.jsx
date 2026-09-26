import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import Loader from '../components/common/Loader';
import { getProducts } from '../services/productService';

function AdminProducts() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let active = true;

		getProducts()
			.then((data) => {
				if (active) setProducts(Array.isArray(data) ? data : []);
			})
			.catch((requestError) => {
				if (active) setError(requestError.response?.data?.message || 'Could not load products.');
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => { active = false; };
	}, []);

	return (
		<AdminLayout>
			<div className="mx-auto max-w-7xl">
				<header className="mb-6">
					<p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Inventory</p>
					<h1 className="mt-1 text-2xl font-semibold text-slate-950">Pharmacy</h1>
				</header>
				{error ? <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p> : null}
				{loading ? <Loader /> : (
					<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
						<div className="overflow-x-auto">
							<table className="min-w-160 w-full text-left text-sm">
								<thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
									<tr><th className="px-4 py-3 font-semibold">Product</th><th className="px-4 py-3 font-semibold">Category</th><th className="px-4 py-3 font-semibold">Price</th><th className="px-4 py-3 font-semibold">Stock</th></tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{products.length ? products.map((product) => (
										<tr className="text-slate-700" key={product._id}>
											<td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
											<td className="px-4 py-3">{product.category?.name || 'Pharmacy'}</td>
											<td className="whitespace-nowrap px-4 py-3">Rs. {Number(product.price || 0).toLocaleString()}</td>
											<td className="px-4 py-3">{Number(product.stock || 0).toLocaleString()}</td>
										</tr>
									)) : <tr><td className="px-4 py-12 text-center text-slate-500" colSpan="4">No products found.</td></tr>}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</AdminLayout>
	);
}

export default AdminProducts;
