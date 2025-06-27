import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser,FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const getCartQuantity = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    } catch (err) {
      return 0;
    }
  };

  useEffect(() => {
    const updateCart = () => {
      const qty = getCartQuantity();
      setCartCount(qty);
    };

    updateCart();
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, [user]);

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    searchTerm.trim()
      ? params.set('search', searchTerm.trim())
      : params.delete('search');
    navigate({ pathname: '/products', search: params.toString() });
    setSearchTerm('');
  };

  const requireLogin = (path) => {
    user ? navigate(path) : navigate('/login');
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    navigate('/login');
  };

  const categories = [
    'All', 'Men', 'Women', 'Kids',
    'Electronics', 'Home & Kitchen', 'Accessories',
    'Deals', 'BestSellers', 'Books'
  ];

  if (user?.role === 'admin' && location.pathname.startsWith('/admin')) return null;

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900">
      <div className="flex items-center bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 px-4 py-2 space-x-4">
        {/* Logo */}
        <div
          className="text-2xl font-bold cursor-pointer text-white-400"
          onClick={() => navigate('/')}
        >
          Zenvue
        </div>

        {/* Search */}
        <form onSubmit={onSearch} className="flex flex-1 mx-4 bg-white dark:bg-gray-700 rounded overflow-hidden">
          <input
            type="text"
            className="flex-1 px-4 text-black dark:text-white bg-white dark:bg-gray-700"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-yellow-400 px-4 hover:bg-yellow-500 transition">
            <FaSearch className="text-black" />
          </button>
        </form>

        {/* Right Actions */}
        <div className="flex items-center space-x-6 text-sm font-medium">
          <ThemeToggle />
          
          
          {/* Account */}
          <div
            onClick={() => user ? navigate('/userdashboard') : navigate('/login')}
            className="cursor-pointer hover:text-yellow-400"
          >
            <p className="text-xs">Hello, {user ? user.name : 'Guest'}</p>
            <p className="font-semibold">Account & Lists</p>
          </div>
          {/* Wishlist */}
<div
  onClick={() => requireLogin('/user/wishlist')}
  className="relative flex items-center cursor-pointer hover:text-yellow-400"
  title="Wishlist"
>
  <FaHeart className="text-2xl text-red-500" />
</div>





          {/* Cart */}
          <div
            onClick={() => requireLogin('/cart')}
            className="relative flex items-center cursor-pointer hover:text-yellow-400"
            title="Cart"
          >
            <FaShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-yellow-400 text-black font-bold text-[10px] min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full border border-white shadow-md transition-all duration-300">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>

          {/* Admin Dashboard */}
          {user?.role === 'admin' && (
            <p
              onClick={() => navigate('/admindashboard')}
              className="cursor-pointer text-red-300 hover:underline"
            >
              Admin Dashboard
            </p>
          )}

          {/* Login/Logout */}
          {user ? (
            <p
              onClick={handleLogout}
              className="cursor-pointer text-red-400 hover:text-red-300"
            >
              Logout
            </p>
          ) : (
            <div
              onClick={() => navigate('/login')}
              className="flex items-center cursor-pointer hover:text-yellow-400"
            >
              <FaUser className="mr-1" />
              Login
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <nav className="bg-yellow-800 dark:bg-blue-900 text-white dark:text-gray-200 px-4 py-2 overflow-x-auto whitespace-nowrap">
        <ul className="flex items-center space-x-6">
          {categories.map((cat) => (
            <li
              key={cat}
              onClick={() =>
                cat === 'All'
                  ? navigate('/products')
                  : navigate(`/products/category/${cat.toLowerCase()}`)
              }
              className="cursor-pointer hover:underline hover:text-yellow-300 transition"
            >
              {cat}
            </li>
          ))}

          {/* Conditional Become Seller / Seller Dashboard */}
          {user?.role === 'user' && (
            <li>
              <button
                onClick={() => navigate('/seller/register')}
                className="ml-4 bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Become a Seller
              </button>
            </li>
          )}

          {user?.role === 'seller' && (
            <li>
              <button
                onClick={() => navigate('/sellerdashboard')}
                className="ml-4 bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Seller Dashboard
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
