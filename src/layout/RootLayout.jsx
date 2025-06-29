import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const RootLayout = () => {
  const storedUser = localStorage.getItem('user');
  let user = null;

  try {
    if (storedUser && storedUser !== 'undefined') {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col w-full">
      {!isAdmin && <Navbar />}
      <main className="w-full mx-auto p-4 flex-grow">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

export default RootLayout;
