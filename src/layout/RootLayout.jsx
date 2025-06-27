import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const RootLayout = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col w-full">
      {!isAdmin && <Navbar />}
      <main className=" w-full mx-auto p-4 flex-grow">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

export default RootLayout;
