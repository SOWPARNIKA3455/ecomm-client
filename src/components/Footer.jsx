// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      {/* Top Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">ZenVue</h2>
          <p className="text-sm leading-relaxed">
            Your one‑stop shop for everything you need—at prices you’ll love.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/products?category=electronics" className="hover:text-white">Electronics</Link></li>
            <li><Link to="/products?category=kids" className="hover:text-white">Kids Wear</Link></li>
            <li><Link to="/products?category=books" className="hover:text-white">Books</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-white mb-3">Stay Updated</h3>
          <p className="text-sm mb-4">Subscribe for the latest deals and updates.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing!");
            }}
            className="flex"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 p-2 rounded-l bg-gray-800 placeholder-gray-500 text-sm focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 px-4 text-white text-sm font-semibold rounded-r hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-white mb-3">Follow Us</h3>
          <p className="text-sm mb-4">Stay connected through our social platforms.</p>
          <div className="flex space-x-4 text-lg">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} ZenVue. All rights reserved.</span>
          <div className="space-x-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gray-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
