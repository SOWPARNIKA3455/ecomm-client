// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">ZenVue</h2>
          <p className="text-sm leading-relaxed">
            Your one‑stop shop for everything you need—at prices you’ll love.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-white mb-3">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white">All Products</Link></li>
            <li><Link to="/products?category=electronics" className="hover:text-white">Electronics</Link></li>
            <li><Link to="/products?category=fashion" className="hover:text-white">Fashion</Link></li>
            <li><Link to="/products?deal=mega" className="hover:text-white">Deals</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-white mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-white mb-3">Subscribe</h3>
          <p className="text-sm mb-4">Get news & exclusive offers in your inbox.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing!");
            }}
            className="flex"
          >
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 p-2 rounded-l bg-gray-800 placeholder-gray-500 text-sm focus:outline-none"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 px-4 text-white text-sm font-semibold rounded-r hover:bg-blue-700"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} MyStore. All rights reserved.</span>
          <div className="space-x-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-gray-300">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

