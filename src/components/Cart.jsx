import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnState, setBtnState] = useState({});
  const [globalError, setGlobalError] = useState('');

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  const updateCartState = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated')); // ✅ Sync Navbar
  };

  useEffect(() => {
    if (!user) return navigate('/login');

    const fetchCart = async () => {
      try {
        const res = await API.get('/cart', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const updatedCart = res.data.cartProducts || [];
        updateCartState(updatedCart);
      } catch (error) {
        console.error(error);
        setGlobalError('Failed to load cart.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const apiCall = async (method, url, data, btnKey, actionLabel = '') => {
    setBtnState((prev) => ({ ...prev, [btnKey]: actionLabel }));
    setGlobalError('');

    try {
      const res = await API({
        method,
        url,
        data,
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const updatedCart = res.data.cartProducts || [];
      updateCartState(updatedCart);
    } catch (err) {
      console.error(err);
      setGlobalError('Something went wrong. Please retry.');
    } finally {
      setBtnState((prev) => ({ ...prev, [btnKey]: '' }));
    }
  };

  const updateQty = (productId, currentQty, newQty) => {
    if (newQty < 1) return;
    const label = newQty > currentQty ? 'Adding…' : 'Updating…';
    apiCall('put', '/cart/update', { productId, quantity: newQty }, productId, label);
  };

  const removeItem = (productId) => {
    apiCall('delete', `/cart/remove/${productId}`, null, productId, 'Removing…');
  };

  const clearCart = () => {
    if (!window.confirm('Are you sure you want to clear the cart?')) return;
    apiCall('delete', '/cart/clear', null, 'clear', 'Clearing…');
  };

  if (loading) return <p className="text-center mt-10">Loading your cart…</p>;

  if (!cartItems.length)
    return (
      <div className="text-center mt-10 text-gray-500">
        <p>Your cart is empty.</p>
      </div>
    );

  const totalAmount = cartItems.reduce(
    (sum, { product, quantity }) => sum + product.price * quantity,
    0
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Shopping Cart</h1>
      {globalError && <p className="text-red-600 mb-4 text-center">{globalError}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {cartItems.map(({ product, quantity }) => (
            <div
              key={product._id}
              className="flex flex-col sm:flex-row items-center border shadow rounded-lg p-4"
            >
              <img
                src={product.imageUrl || '/placeholder.jpg'}
                alt={product.title}
                className="w-24 h-24 object-cover rounded mb-4 sm:mb-0 sm:mr-6"
              />
              <div className="flex-1 w-full">
                <h2 className="text-lg font-semibold">{product.title}</h2>
                <p className="text-sm mt-1">{formatCurrency(product.price)}</p>

                <div className="flex items-center text-black mt-3 space-x-2">
                  <button
                    onClick={() => updateQty(product._id, quantity, quantity - 1)}
                    disabled={!!btnState[product._id]}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="px-3 text-green-700 font-medium">{quantity}</span>
                  <button
                    onClick={() => updateQty(product._id, quantity, quantity + 1)}
                    disabled={!!btnState[product._id]}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right sm:ml-4 mt-4 sm:mt-0">
                <p className="text-md font-semibold text-green-700">
                  {formatCurrency(product.price * quantity)}
                </p>
                <button
                  onClick={() => removeItem(product._id)}
                  disabled={!!btnState[product._id]}
                  className="text-red-500 hover:underline text-sm mt-2"
                >
                  {btnState[product._id] === 'Removing…' ? 'Removing…' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border p-6 rounded-lg shadow-lg sticky top-20 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Items:</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-3">
            <span>Total:</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={clearCart}
              disabled={!!btnState.clear}
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition disabled:opacity-50"
            >
              {btnState.clear || 'Clear Cart'}
            </button>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
