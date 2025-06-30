import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const { email, password } = formData;

    const tryLogin = async (endpoint) => {
      try {
        const res = await API.post(endpoint, { email, password });
        return res.data;
      } catch (err) {
        return null;
      }
    };

    try {
      const endpoints = ['/admin/login', '/seller/login', '/user/login'];
      let userData = null;

      for (const endpoint of endpoints) {
        userData = await tryLogin(endpoint);
        if (userData) break;
      }

      if (!userData) {
        setError('Login failed: Invalid credentials or role');
        return;
      }

      const  token  = userData.token;
      const user = userData.user || userData.seller || userData.admin;
      const userWithToken = { ...user, token };

      login(userWithToken); // Save to context
      localStorage.setItem('user', JSON.stringify(userWithToken));
      localStorage.setItem('role', user.role);

      setSuccessMsg('Login successful!');
      setFormData({ email: '', password: '' });

      setTimeout(() => {
        if (user.role === 'admin') navigate('/admindashboard');
        else if (user.role === 'seller') navigate('/sellerdashboard');
        else navigate('/');
      }, 1000);
    } catch (err) {
      setError('Unexpected login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign in</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Logging in...' : 'Continue'}
        </button>
      </form>

      {error && <p style={{ ...styles.message, color: 'red' }}>{error}</p>}
      {successMsg && <p style={{ ...styles.message, color: 'green' }}>{successMsg}</p>}

      <div style={styles.divider}>
        <hr style={styles.line} />
        <span style={styles.orText}>New to ShopKart?</span>
        <hr style={styles.line} />
      </div>

      <button style={styles.signupBtn} onClick={() => navigate('/signup')}>
        Create your ShopKart account
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '1.5rem 0',
  },
  line: {
    flex: 1,
    height: '1px',
    backgroundColor: '#ccc',
  },
  orText: {
    margin: '0 1rem',
    color: '#666',
    fontSize: '0.9rem',
  },
  signupBtn: {
    width: '100%',
    padding: '0.9rem',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default LoginPage;
