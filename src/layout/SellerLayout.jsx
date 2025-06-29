import React from 'react';
import { Link } from 'react-router-dom';

const SellerLayout = ({ children }) => {
  return (
    <div className=" flex min-h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white  p-5 space-y-4 h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Seller Panel</h2>
</div>
        <nav className="space-y-3">
          <Link to="/sellerdashboard" className="block hover:text-yellow-300">Dashboard</Link>
          <Link to="/sellerdashboard/sell" className="block hover:text-yellow-300">Add Product</Link>
          <Link to="/sellerdashboard/orders" className="block hover:text-yellow-300">Orders</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className=" flex-1 overflow-y-auto  dark:bg-gray-900   h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default SellerLayout;
