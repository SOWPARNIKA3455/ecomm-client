import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const UserPage = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav
        style={{
          width: '220px',
          padding: '20px',
          backgroundColor: '#f0f0f0',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        }}
      >
        <h2>User Menu</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <NavLink to="" end style={({ isActive }) => ({ color: isActive ? 'blue' : 'black', textDecoration: 'none' })}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="profile" style={({ isActive }) => ({ color: isActive ? 'blue' : 'black', textDecoration: 'none' })}>
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="products" style={({ isActive }) => ({ color: isActive ? 'blue' : 'black', textDecoration: 'none' })}>
              Products
            </NavLink>
          </li>
        </ul>
      </nav>

      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserPage;
