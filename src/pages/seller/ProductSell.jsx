import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

const AddProduct = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('category', formData.category);
      data.append('image', formData.image);

      const res = await API.post('/seller/product', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });

      setMsg('✅ Product added successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        image: null,
      });
    } catch (err) {
      setMsg(err.response?.data?.message || '❌ Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>
      {msg && <p className="mb-4 text-center">{msg}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
