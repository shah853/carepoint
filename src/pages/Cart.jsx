import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCart, removeFromCart } from '../services/cartService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCart = async () => {
      await fetchCart();
    };

    loadCart();
  }, []);

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    fetchCart();
  };

  if (loading) return <Loader />;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <p className="text-gray-600 mb-4">Your cart is empty</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          Browse Products
        </Link>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Pharmacy basket</p>
      <h1 className="mt-2 mb-7 text-2xl font-bold text-slate-900 sm:text-3xl">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
          >
            <img
              src={item.product.images?.[0] || '/placeholder.png'}
              alt={item.product.name}
              className="h-32 w-full rounded-xl bg-slate-50 object-cover sm:h-20 sm:w-20"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800">{item.product.name}</h3>
              <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
              <p className="mt-1 font-bold text-blue-700">Rs. {item.product.price}</p>
            </div>
            <Button variant="danger" onClick={() => handleRemove(item.product._id)}>
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-bold text-slate-900">Total: Rs. {total}</p>
        <Link
          to="/checkout"
          className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Proceed to Checkout
        </Link>
      </div>
      </div>
    </div>
  );
}

export default Cart;