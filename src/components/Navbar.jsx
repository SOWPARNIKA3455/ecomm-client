import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Navbar = () => {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const categories = [
    'All', 'Men', 'Women', 'Kids',
    'Electronics', 'Home & Kitchen', 'Accessories', 'Books'
  ];

  if (user?.role === 'admin' && location.pathname.startsWith('/admin')) return null;

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900">
      {/* Top Navbar */}
      <div className="flex items-center justify-between bg-gray-900 dark:bg-gray-800 text-white px-4 py-2">
        {/* Logo */}
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate('/')}
        >
          Zenvue
        </div>

        {/* Hamburger for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>

        {/* Search Bar - Desktop */}
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

        {/* Right Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <ThemeToggle />

          <div
            onClick={() => user ? navigate('/userdashboard') : navigate('/login')}
            className="cursor-pointer hover:text-yellow-400"
          >
            <p className="text-xs">Hello, {user ? user.name : 'Guest'}</p>
            <p className="font-semibold">Account & Lists</p>
          </div>

          <div
            onClick={() => requireLogin('/user/wishlist')}
            className="relative flex items-center cursor-pointer hover:text-yellow-400"
            title="Wishlist"
          >
            <FaHeart className="text-2xl text-red-500" />
          </div>

          <div
            onClick={() => requireLogin('/cart')}
            className="relative flex items-center cursor-pointer hover:text-yellow-400"
            title="Cart"
          >
            <FaShoppingCart className="text-2xl" />
            <span className="absolute -top-2 -right-3 bg-yellow-400 text-black font-bold text-[10px] min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full border border-white shadow-md">
              {cartCount > 99 ? '99+' : cartCount ?? 0}
            </span>
          </div>

          {user?.role === 'admin' && (
            <p
              onClick={() => navigate('/admindashboard')}
              className="cursor-pointer text-red-300 hover:underline"
            >
              Admin Dashboard
            </p>
          )}

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

      {/* Search Bar - Mobile */}
      {isMenuOpen && (
        <form
          onSubmit={onSearch}
          className="md:hidden flex mx-4 mt-2 bg-white dark:bg-gray-700 rounded overflow-hidden"
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
      )}

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          <ThemeToggle />

          <div
            onClick={() => user ? navigate('/userdashboard') : navigate('/login')}
            className="cursor-pointer hover:text-yellow-400"
          >
            <p className="text-xs">Hello, {user ? user.name : 'Guest'}</p>
            <p className="font-semibold">Account & Lists</p>
          </div>

          <div onClick={() => requireLogin('/user/wishlist')} className="flex items-center space-x-2">
            <FaHeart className="text-red-500" />
            <span>Wishlist</span>
          </div>

          <div onClick={() => requireLogin('/cart')} className="flex items-center space-x-2">
            <FaShoppingCart />
            <span>Cart ({cartCount ?? 0})</span>
          </div>

          {user?.role === 'admin' && (
            <div onClick={() => navigate('/admindashboard')} className="text-red-400 underline">
              Admin Dashboard
            </div>
          )}

          {user ? (
            <div onClick={handleLogout} className="text-red-400 hover:text-red-300 cursor-pointer">
              Logout
            </div>
          ) : (
            <div onClick={() => navigate('/login')} className="flex items-center space-x-2 cursor-pointer hover:text-yellow-400">
              <FaUser />
              <span>Login</span>
            </div>
          )}
        </div>
      )}

      {/* Categories */}
      <nav className="bg-yellow-800 dark:bg-blue-900 text-white px-4 py-2 overflow-x-auto whitespace-nowrap">
        <ul className="flex items-center space-x-6 text-sm">
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
