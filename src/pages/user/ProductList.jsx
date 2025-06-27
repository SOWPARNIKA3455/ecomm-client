import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductList = () => {
  const { user, setCartCount } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { category: categoryParam } = useParams();

  const search = new URLSearchParams(location.search).get('search');
  const categoryQuery = new URLSearchParams(location.search).get('category');
  const category = categoryParam || categoryQuery;

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [btnLoading, setBtnLoading] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get('/products');
        let data = res.data;

        if (category && category !== 'all') {
          data = data.filter(
            (p) => p.category?.toLowerCase() === category.toLowerCase()
          );
        }

        if (search) {
          const term = search.toLowerCase();
          data = data.filter(
            (p) =>
              p.title?.toLowerCase().includes(term) ||
              p.name?.toLowerCase().includes(term) ||
              p.description?.toLowerCase().includes(term) ||
              p.category?.toLowerCase().includes(term)
          );
        }

        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (!user) return;
      try {
        const res = await API.get('/wishlist', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setWishlist(res.data.map((item) => item._id));
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [category, search, user]);

  const handleAdd = async (product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBtnLoading((prev) => ({ ...prev, [product._id]: true }));

    try {
      const res = await API.post(
        '/cart/add',
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const updatedCart = res.data.cart || [];
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      const totalQty = updatedCart.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      setCartCount(totalQty);

      alert('Product added to cart!');
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Failed to add product to cart.');
    } finally {
      setBtnLoading((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) return navigate('/login');

    const isWished = wishlist.includes(productId);
    try {
      if (isWished) {
        await API.delete(`/wishlist/remove/${productId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await API.post(
          '/wishlist/add',
          { productId },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      alert('Failed to update wishlist.');
    }
  };

  if (loading)
    return <p className="p-5 text-gray-800 dark:text-gray-100">Loading products…</p>;
  if (error)
    return <p className="p-5 text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-5 text-gray-900 dark:text-white">
        Products
        {category ? ` — ${category.charAt(0).toUpperCase() + category.slice(1)}` : ''}
        {search && !category ? ` — Search: “${search}”` : ''}
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-800 dark:text-gray-300">
          No products found
          {category ? ` in “${category}”` : search ? ` for “${search}”` : ''}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((product) => (
            <div
              key={product._id}
              className="relative group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow hover:scale-105 transition cursor-pointer flex flex-col"
              onClick={() => navigate(`/products/${product._id}`)}
            >
              {/* Wishlist Icon */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlistToggle(product._id);
                }}
                className="absolute top-2 right-2 text-red-500 text-xl z-10 cursor-pointer"
                title={
                  wishlist.includes(product._id)
                    ? 'Remove from Wishlist'
                    : 'Add to Wishlist'
                }
              >
                {wishlist.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
              </div>

              <img
                src={product.imageUrl}
                alt={product.title || product.name}
                className="w-full h-56 object-contain border-b border-gray-200 dark:border-gray-700"
              />
              <div className="p-4 flex-grow">
                <h3
                  className="text-base font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-white"
                  title={product.title || product.name}
                >
                  {product.title || product.name}
                </h3>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
                  ₹{product.price}
                </p>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAdd(product);
                  }}
                  disabled={!user || btnLoading[product._id]}
                  className={`w-full py-2 rounded-lg transition ${
                    !user
                      ? 'bg-gray-400 cursor-not-allowed text-gray-700 dark:text-gray-300'
                      : btnLoading[product._id]
                      ? 'bg-blue-300 cursor-wait text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {!user
                    ? 'Login to Add'
                    : btnLoading[product._id]
                    ? 'Adding...'
                    : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
