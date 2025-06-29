import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const { user, fetchCartCountFromServer } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState({});

  const fetchWishlist = async () => {
    try {
      const res = await API.get('/wishlist', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to load wishlist', err);
      toast.error('Error fetching wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await API.delete(`/wishlist/remove/${productId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setWishlist(prev => prev.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (product) => {
    if (!user) {
      toast.error("Please login to add to cart");
      return;
    }

    setBtnLoading((prev) => ({ ...prev, [product._id]: true }));

    try {
      await API.post(
        '/cart/add',
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      await fetchCartCountFromServer();
      window.dispatchEvent(new Event('cartUpdated'));
      await handleRemove(product._id);
      toast.success('Moved to cart');
    } catch (err) {
      console.error('Failed to move to cart', err);
      toast.error('Failed to move to cart');
    } finally {
      setBtnLoading((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <p className="p-6 text-lg">Loading Wishlist...</p>;

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="p-8 rounded shadow text-center">
          <p className="text-lg">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map(item => (
            <div key={item._id} className="bg-white border rounded-lg shadow p-4 flex flex-col">
              <img
                src={item.imageUrl || "/placeholder.jpg"}
                alt={item.title}
                className="h-60 object-contain mb-4"
              />
              <h2 className="text-lg text-black font-medium">{item.title}</h2>
              <p className="text-xl font-bold text-orange-600 mt-1">₹{item.price}</p>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => handleMoveToCart(item)}
                  disabled={btnLoading[item._id]}
                  className={`${
                    btnLoading[item._id]
                      ? 'bg-yellow-300 cursor-wait'
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  } py-2 px-4 rounded text-sm flex items-center justify-center gap-2 text-white`}
                >
                  <FaShoppingCart />
                  {btnLoading[item._id] ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="bg-red-100 hover:bg-red-200 text-red-600 py-2 px-4 rounded text-sm flex items-center justify-center gap-2"
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
