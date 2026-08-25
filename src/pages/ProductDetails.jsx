import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService';
import Rating from '../components/products/Rating';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      setMessage('Added to cart!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return <Loader />;
  if (!product) return <p className="text-center py-8">Product not found</p>;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="h-72 w-full rounded-2xl bg-slate-50 object-cover sm:h-96 md:w-1/2"
        />

        <div className="flex-1">
          <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl">{product.name}</h1>
          <Rating value={product.ratings} />
          <p className="my-4 text-2xl font-bold text-blue-700">Rs. {product.price}</p>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">{product.description}</p>

          <div className="flex items-center gap-3 mb-4">
            <label htmlFor="quantity" className="text-sm text-gray-700">Quantity:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded-md px-3 py-2 w-20 text-base"
            />
          </div>

          <Button onClick={handleAddToCart}>Add to Cart</Button>

          {message && <p className="text-sm text-green-600 mt-3">{message}</p>}
        </div>
      </div>
      </div>
    </div>
  );
}

export default ProductDetails;