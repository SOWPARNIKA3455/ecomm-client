import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const BecomeSeller = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: '',
    gstNumber: '',
    address: '',
  });

  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const response = await API.post('/seller/signup', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const updatedUser = response.data.user;

      // Update context and localStorage
      login(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      navigate('/sellerdashboard'); 
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to create seller profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Become a Seller</h2>
      {msg && <p className="mb-4 text-red-600">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="businessName"
          placeholder="Business Name"
          value={formData.businessName}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="gstNumber"
          placeholder="GST Number"
          value={formData.gstNumber}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Creating...' : 'Create Seller Profile'}
        </button>
      </form>
    </div>
  );
};

export default BecomeSeller;
