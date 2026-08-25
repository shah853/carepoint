import { Link } from 'react-router-dom';
import Rating from './Rating';

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product._id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-lg"
    >
      <img
        src={product.images?.[0] || '/placeholder.png'}
        alt={product.name}
        className="mb-4 h-44 w-full rounded-xl bg-slate-50 object-cover transition duration-300 group-hover:scale-[1.02]"
      />
      <h3 className="truncate font-semibold text-slate-800">{product.name}</h3>
      <p className="mt-2 font-bold text-blue-700">Rs. {product.price}</p>
      <Rating value={product.ratings} />
    </Link>
  );
}

export default ProductCard;