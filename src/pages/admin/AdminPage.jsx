import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav
        style={{
          width: '220px',
          padding: '20px',
          backgroundColor: '#f7f7f7',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        }}
      >
        <h2>Admin Panel</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>
            <NavLink
              to=""
              end
              style={({ isActive }) => ({
                color: isActive ? '#007bff' : '#333',
                textDecoration: 'none',
                display: 'block',
                margin: '10px 0',
              })}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="products"
              style={({ isActive }) => ({
                color: isActive ? '#007bff' : '#333',
                textDecoration: 'none',
                display: 'block',
                margin: '10px 0',
              })}
            >
              Manage Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="users"
              style={({ isActive }) => ({
                color: isActive ? '#007bff' : '#333',
                textDecoration: 'none',
                display: 'block',
                margin: '10px 0',
              })}
            >
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="orders"
              style={({ isActive }) => ({
                color: isActive ? '#007bff' : '#333',
                textDecoration: 'none',
                display: 'block',
                margin: '10px 0',
              })}
            >
              Manage Orders
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

export default AdminPage;
