import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EditProfileModal = ({ user, setUser, onClose }) => {
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    password: '',
    profilePicFile: null,
  });

  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'your_upload_preset'); 
    const cloudName = 'your_cloud_name'; 
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, data);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let profilePic = user.profilePic;
      if (form.profilePicFile) {
        profilePic = await handleImageUpload(form.profilePicFile);
      }

      const updateData = {
        name: form.name,
        email: form.email,
        password: form.password.trim() ? form.password : undefined,
        profilePic,
      };

      const res = await axios.put(
        'http://localhost:3001/api/user/profile',
        updateData,
        { withCredentials: true }
      );

      setUser(res.data.data);
      localStorage.setItem('user', JSON.stringify(res.data.data));
      toast.success('Profile updated');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="New Password (optional)"
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, profilePicFile: e.target.files[0] })}
            className="w-full"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
