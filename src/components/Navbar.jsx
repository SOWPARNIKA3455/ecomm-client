import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Navbar = () => {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    'All',
    'Men',
    'Women',
    'Kids',
    'Electronics',
    'Home & Kitchen',
    'Accessories',
    'Books',
  ];

  const categoryFromURL = location.pathname.startsWith('/products/category/')
    ? location.pathname.split('/products/category/')[1]
    : location.pathname === '/products'
    ? 'all'
    : '';

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    searchTerm.trim()
      ? params.set('search', searchTerm.trim())
      : params.delete('search');
    navigate({ pathname: '/products', search: params.toString() });
    setSearchTerm('');
    setIsMenuOpen(false);
  };

  const requireLogin = (path) => {
    user ? navigate(path) : navigate('/login');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    navigate('/login');
    setIsMenuOpen(false);
  };

  if (user?.role === 'admin' && location.pathname.startsWith('/admin')) return null;

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900">
      {/* Top bar */}
      <div className="flex justify-between items-center bg-gray-900 dark:bg-gray-800 text-white px-4 py-2">
        {/* Logo */}
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate('/')}
        >
          Zenvue
        </div>

        {/* Desktop search */}
        <form
          onSubmit={onSearch}
          className="hidden md:flex flex-1 mx-4 bg-white dark:bg-gray-700 rounded overflow-hidden"
        >
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

        {/* Right (Mobile & Desktop) */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {/* Mobile search */}
          <form
            onSubmit={onSearch}
            className="flex md:hidden bg-white dark:bg-gray-700 rounded overflow-hidden"
          >
            <input
              type="text"
              className="px-2 w-28 text-black dark:text-white bg-white dark:bg-gray-700"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="bg-yellow-400 px-2 hover:bg-yellow-500">
              <FaSearch className="text-black" />
            </button>
          </form>

          {/* Theme Toggle */}
          <div className="md:block">
            <ThemeToggle />
          </div>

          {/* Wishlist */}
          <div
            onClick={() => requireLogin('/user/wishlist')}
            className="cursor-pointer relative hover:text-yellow-400"
            title="Wishlist"
          >
            <FaHeart className="text-xl text-red-500" />
          </div>

          {/* Cart */}
          <div
            onClick={() => requireLogin('/cart')}
            className="cursor-pointer relative hover:text-yellow-400"
            title="Cart"
          >
            <FaShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-black font-bold text-xs min-w-[16px] h-[16px] px-[5px] flex items-center justify-center rounded-full border border-white shadow-sm">
              {cartCount > 99 ? '99+' : cartCount ?? 0}
            </span>
          </div>

          {/* Hamburger */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-xl md:hidden">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-white dark:bg-gray-800 text-black dark:text-white space-y-4">
          {/* Only auth/account links inside dropdown */}
          <div className="space-y-2">
            <div
              onClick={() => user ? navigate('/userdashboard') : navigate('/login')}
              className="cursor-pointer hover:text-yellow-400"
            >
              Account & Lists ({user?.name || 'Guest'})
            </div>
            {user?.role === 'admin' && (
              <div
                onClick={() => navigate('/admindashboard')}
                className="text-red-400 cursor-pointer"
              >
                Admin Dashboard
              </div>
            )}
            {user ? (
              <div
                onClick={handleLogout}
                className="text-red-500 cursor-pointer"
              >
                Logout
              </div>
            ) : (
              <div
                onClick={() => navigate('/login')}
                className="cursor-pointer hover:text-yellow-400"
              >
                Login
              </div>
            )}
          </div>
        </div>
      )}

      {/* Always visible category nav (for all screens) */}
      <nav className="bg-yellow-800 dark:bg-blue-900 text-white py-2 px-2 overflow-x-auto whitespace-nowrap">
        <ul className="flex items-center gap-4 text-sm">
          {categories.map((cat) => {
            const key = cat.toLowerCase();
            const isActive = categoryFromURL === key;
            return (
              <li
                key={cat}
                onClick={() =>
                  cat === 'All'
                    ? navigate('/products')
                    : navigate(`/products/category/${key}`)
                }
                className={`cursor-pointer transition hover:text-yellow-300 hover:underline ${
                  isActive ? 'text-yellow-300 font-semibold underline' : ''
                }`}
              >
                {cat}
              </li>
            );
          })}
          {user?.role === 'user' && (
            <li>
              <button
                onClick={() => navigate('/seller/register')}
                className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
              >
                Become a Seller
              </button>
            </li>
          )}
          {user?.role === 'seller' && (
            <li>
              <button
                onClick={() => navigate('/sellerdashboard')}
                className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
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
