import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Navbar = () => {
  const { user, logout, cartCount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    searchTerm.trim()
      ? params.set('search', searchTerm.trim())
      : params.delete('search');
    navigate({ pathname: '/products', search: params.toString() });
    setSearchTerm('');
    setMenuOpen(false);
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
    'Electronics', 'Home & Kitchen', 'Accessories', 'Books'
  ];

  const currentCategory = location.pathname.includes('/products/category/')
    ? location.pathname.split('/products/category/')[1]
    : 'all';

  if (user?.role === 'admin' && location.pathname.startsWith('/admin')) return null;

  return (
    <header className="shadow-md sticky top-0 z-50 bg-white dark:bg-gray-900">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-gray-900 dark:bg-gray-800 text-white px-4 py-2">
        {/* Logo */}
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate('/')}
        >
          Zenvue
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Search */}
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <ThemeToggle />

          {/* Account Dropdown */}
          <div className="relative group">
            <div className="cursor-pointer hover:text-yellow-400">
              <p className="text-xs">Hello, {user ? user.name : 'Guest'}</p>
              <p className="font-semibold">Account & Lists</p>
            </div>
            {user && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded shadow-md hidden group-hover:block z-50">
                <p onClick={() => navigate('/userdashboard')} className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Your Dashboard</p>
                <p onClick={() => navigate('/user/wishlist')} className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">Wishlist</p>
                <p onClick={handleLogout} className="px-4 py-2 cursor-pointer text-red-500 hover:bg-red-100 dark:hover:bg-red-600">Logout</p>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div onClick={() => requireLogin('/user/wishlist')} className="relative flex items-center cursor-pointer hover:text-yellow-400" title="Wishlist">
            <FaHeart className="text-2xl text-red-500" />
          </div>

          {/* Cart */}
          <div onClick={() => requireLogin('/cart')} className="relative flex items-center cursor-pointer hover:text-yellow-400" title="Cart">
            <FaShoppingCart className="text-2xl" />
            <span className="absolute -top-2 -right-3 bg-yellow-400 text-black font-bold text-[10px] min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full border border-white shadow-md">
              {cartCount > 99 ? '99+' : cartCount ?? 0}
            </span>
          </div>

          {/* Admin */}
          {user?.role === 'admin' && (
            <p onClick={() => navigate('/admindashboard')} className="cursor-pointer text-red-300 hover:underline">Admin Dashboard</p>
          )}

          {/* Login */}
          {!user && (
            <div onClick={() => navigate('/login')} className="flex items-center cursor-pointer hover:text-yellow-400">
              <FaUser className="mr-1" />
              Login
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white dark:bg-gray-800 text-black dark:text-white overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-screen py-4 px-4' : 'max-h-0'}`}>
        {/* Search */}
        <form onSubmit={onSearch} className="flex bg-white dark:bg-gray-700 rounded overflow-hidden mb-4">
          <input
            type="text"
            className="flex-1 px-4 bg-white dark:bg-gray-700 text-black dark:text-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-yellow-400 px-4 hover:bg-yellow-500 transition">
            <FaSearch className="text-black" />
          </button>
        </form>

        {/* Mobile Actions */}
        <div className="space-y-4 text-sm">
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <span>Theme</span>
          </div>
          <div onClick={() => user ? navigate('/userdashboard') : navigate('/login')} className="cursor-pointer">
            👤 {user ? `Hello, ${user.name}` : 'Login / Register'}
          </div>
          <div onClick={() => requireLogin('/user/wishlist')} className="cursor-pointer">
            ❤️ Wishlist
          </div>
          <div onClick={() => requireLogin('/cart')} className="cursor-pointer">
            🛒 Cart ({cartCount ?? 0})
          </div>
          {user?.role === 'admin' && (
            <div onClick={() => navigate('/admindashboard')} className="text-red-500 cursor-pointer">
              🛠️ Admin Dashboard
            </div>
          )}
          {user?.role === 'user' && (
            <div onClick={() => navigate('/seller/register')} className="cursor-pointer">
              🛍️ Become a Seller
            </div>
          )}
          {user?.role === 'seller' && (
            <div onClick={() => navigate('/sellerdashboard')} className="cursor-pointer">
              🧑‍💼 Seller Dashboard
            </div>
          )}
          {user && (
            <div onClick={handleLogout} className="text-red-500 cursor-pointer">
              🚪 Logout
            </div>
          )}
        </div>
      </div>

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
              className={`cursor-pointer transition hover:underline ${
                currentCategory === cat.toLowerCase() ? 'text-yellow-300 font-bold underline' : 'hover:text-yellow-300'
              }`}
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
