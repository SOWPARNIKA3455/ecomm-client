import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const singleProduct = location.state?.product || null;

  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // new flag
  const [error, setError] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    if (singleProduct) {
      setCartItems([{ product: singleProduct, quantity: 1 }]);
    } else {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      if (!storedCart.length) navigate('/cart');
      else setCartItems(storedCart);
    }
  }, [singleProduct, navigate]);

  const itemsPrice = cartItems.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 50;
  const taxPrice = Number((0.1 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  const handlePlaceOrder = async () => {
    if (!address || !city || !zip) {
      setError('Please fill in all address fields');
      return;
    }

    setPlacing(true);
    setError('');

    const shippingAddress = { address, city, zip };

    const orderItems = cartItems.map(({ product, quantity }) => ({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
    }));

    const payload = {
      userId: user?._id,
      cartItems: orderItems,
      shippingAddress,
    };

    try {
      if (paymentMethod === 'Stripe') {
        localStorage.setItem('orderInfo', JSON.stringify(payload));
        const res = await API.post('/payment/create-checkout-session', payload);
        const stripe = await stripePromise;

        // ✅ Prevent further interaction
        setIsRedirecting(true);

        await stripe.redirectToCheckout({ sessionId: res.data.id });
      } else {
        await API.post(
          '/orders',
          {
            user: user._id,
            orderItems,
            shippingAddress,
            paymentMethod: 'COD',
            isPaid: false,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        toast.success('Order placed successfully!');
        if (!singleProduct) localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/orders');
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Order failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="border shadow p-6 rounded-md space-y-4">
        <div>
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Street, Area"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="City"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">ZIP Code</label>
          <input
            type="text"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Postal Code"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Stripe">Stripe (Test Payment)</option>
          </select>
        </div>

        {/* Order Summary */}
        <div className="border-t pt-4 space-y-2">
          <p className="flex justify-between">
            <span>Items:</span>
            <span>{formatCurrency(itemsPrice)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping:</span>
            <span>{formatCurrency(shippingPrice)}</span>
          </p>
          <p className="flex justify-between">
            <span>Tax (10%):</span>
            <span>{formatCurrency(taxPrice)}</span>
          </p>
          <p className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(totalPrice)}</span>
          </p>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={placing || isRedirecting}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
        >
          {placing || isRedirecting ? 'Processing…' : 'Place Order'}
        </button>

        {/* Cancel Payment Button */}
        {paymentMethod === 'Stripe' && !isRedirecting && (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to cancel payment and go back to cart?')) {
                navigate('/cart');
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-2"
          >
            Cancel Payment
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
