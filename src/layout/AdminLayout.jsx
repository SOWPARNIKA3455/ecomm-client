import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      {/* Sidebar - Fixed */}
      <aside
        style={{
          width: '220px',
          background: '#222',
          color: 'white',
          padding: '1rem',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ marginBottom: '1.5rem' }}>Admin Panel</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '1rem 0' }}>
            <Link to="/admindashboard" style={linkStyle}>Dashboard</Link>
          </li>
          <li style={{ margin: '1rem 0' }}>
            <Link to="/admindashboard/products" style={linkStyle}>Products</Link>
          </li>
          <li style={{ margin: '1rem 0' }}>
            <Link to="/admindashboard/users" style={linkStyle}>Users</Link>
          </li>
          <li style={{ margin: '1rem 0' }}>
            <Link to="/admindashboard/orders" style={linkStyle}>Orders</Link>
          </li>
          <li style={{ marginTop: '2rem' }}>
            <button
              onClick={handleLogout}
              style={{
                background: '#e74c3c',
                color: '#fff',
                border: 'none',
                padding: '0.6rem 1rem',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content Area - Scrollable */}
      <main
        style={{
          marginLeft: '220px',
          padding: '2rem',
         
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '1rem',
};

export default AdminLayout;
