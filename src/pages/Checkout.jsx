import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, clearCart } from '../services/cartService';
import { createOrder } from '../services/orderService';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);

    try {
      const items = cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

      await createOrder({
        items,
        totalPrice,
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        shippingAddress: address.trim(),
        paymentMethod,
      });
      await clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Loader />;

  if (!cart || !cart.items || cart.items.length === 0) {
    return <p className="text-center py-16 text-gray-600">Your cart is empty</p>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Secure checkout</p>
      <h1 className="mt-2 mb-7 text-2xl font-bold text-slate-900 sm:text-3xl">Checkout</h1>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <form onSubmit={handlePlaceOrder} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            minLength={2}
            autoComplete="name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Mobile Number</label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            pattern="03[0-9]{9}"
            title="Enter a valid Pakistani mobile number, for example 03001234567"
            placeholder="03XXXXXXXXX"
            autoComplete="tel"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Shipping Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Card</option>
          </select>
        </div>

        <div className="border-t pt-4 mt-2">
          <p className="text-lg font-bold text-slate-900">Total: Rs. {total}</p>
        </div>

        <Button type="submit" disabled={placing}>
          {placing ? 'Placing Order...' : 'Place Order'}
        </Button>
      </form>
      </div>
    </div>
  );
}

export default Checkout;