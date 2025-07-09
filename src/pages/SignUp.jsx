import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Signup = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState('user'); // default role
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showAdmin, setShowAdmin] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const developerEmail = 'varun@example.com'; // ⬅️ Replace this with your email

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Check email match to show Admin option
    if (name === 'email') {
      const trimmedEmail = value.trim().toLowerCase();
      setShowAdmin(trimmedEmail === developerEmail.toLowerCase());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const payload = { ...formData, role };

      await API.post('/user/signup', payload);

      setSuccessMsg('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Signup failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Account</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
         {showAdmin && (
    <select
      name="role"
      value={role}
      onChange={(e) => setRole(e.target.value)}
      style={styles.input}
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  )}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Signing up...' : 'Create Account'}
        </button>
      </form>

      {error && <p style={{ ...styles.message, color: 'red' }}>{error}</p>}
      {successMsg && <p style={{ ...styles.message, color: 'green' }}>{successMsg}</p>}

      <div style={styles.footer}>
        Already have an account?{' '}
        <span style={styles.link} onClick={() => navigate('/login')}>
          Sign in
        </span>
      </div>
    </div>
  );
};

// styles same as your current code...
const styles = {
  container: {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
    fontSize: '1.8rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '0.8rem',
    marginBottom: '1rem',
    fontSize: '1rem',
    color: 'blue',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.9rem',
    backgroundColor: '#FFD814',
    color: 'black',
    fontSize: '1rem',
    fontWeight: 'bold',
    border: '1px solid #fcd200',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  message: {
    marginTop: '1rem',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    color: '#666',
  },
  link: {
    color: '#007185',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default Signup;
