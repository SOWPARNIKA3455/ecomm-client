import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [search, category, products]);

 const fetchProducts = async () => {
  try {
    const res = await API.get('/admin/products');
    console.log("Products from backend:", res.data); 
    setProducts(res.data.data);
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error("Failed to load products");
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await API.delete(`/admin/products/${id}`);
      toast.success("Product deleted");
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleVerify = async (id) => {
    try {
      await API.patch(`/admin/verify-product/${id}`);
      toast.success("Product verified");
      setProducts(prev => prev.map(p => (p._id === id ? { ...p, isVerified: true } : p)));
    } catch (error) {
      toast.error("Failed to verify product");
    }
  };

  const handleFilter = () => {
    let filteredList = products;

    if (search) {
      filteredList = filteredList.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredList = filteredList.filter(p => p.category === category);
    }

    setFiltered(filteredList);
  };

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border  border-gray-300">
          <thead className="bg-gray-100 text-black">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Verified</th>
              <th className="p-2 border">Seller</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product._id}>
                <td className="p-2 border">
                  <img src={product.imageUrl} alt={product.title} className="h-16 w-16 object-cover" />
                </td>
                <td className="p-2 border">{product.title}</td>
                <td className="p-2 border">₹{product.price}</td>
                <td className="p-2 border">{product.stock}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">{product.isVerified ? '✅' : '❌'}</td>
                <td className="p-2 border">{product.seller?.name}</td>
                <td className="p-2 border flex gap-2">
                  {!product.isVerified && (
                    <button
                      onClick={() => handleVerify(product._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="p-4 text-center">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManage;
