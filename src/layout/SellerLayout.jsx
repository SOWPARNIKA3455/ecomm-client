import React from 'react';
import { Link } from 'react-router-dom';

const SellerLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Seller Panel</h2>
        <nav className="space-y-3">
          <Link to="/sellerdashboard" className="block hover:text-yellow-300">Dashboard</Link>
          <Link to="/sellerdashboard/sell" className="block hover:text-yellow-300">Add Product</Link>
          <Link to="/sellerdashboard/orders" className="block hover:text-yellow-300">Orders</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  );
};

export default SellerLayout;
