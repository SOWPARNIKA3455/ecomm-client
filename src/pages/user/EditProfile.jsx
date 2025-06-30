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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicFile') {
      setForm({ ...form, profilePicFile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const uploadImageToBackend = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('https://mern-backend-98xl.onrender.com/api/user/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data.url; // The backend returns secure_url
    } catch (err) {
      toast.error('Image upload failed');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profilePicUrl = user.profilePic;

      if (form.profilePicFile) {
        profilePicUrl = await uploadImageToBackend(form.profilePicFile);
        if (!profilePicUrl) {
          setLoading(false);
          return;
        }
      }

      const updateData = {
        name: form.name,
        email: form.email,
        password: form.password,
        profilePic: profilePicUrl,
      };

      const res = await axios.patch(
        'https://mern-backend-98xl.onrender.com/api/user/update',
        updateData,
        { withCredentials: true }
      );

      setUser(res.data.data);
      toast.success('Profile updated successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-yellow-700 bg-opacity-30 z-50">
      <div className="border  dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-black text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image preview */}
          {form.profilePicFile ? (
            <img
              src={URL.createObjectURL(form.profilePicFile)}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-2 border"
            />
          ) : user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Current"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-2 border"
            />
          ) : null}

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-4 py-2 border rounded focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
            className="w-full px-4 py-2 border rounded focus:outline-none"
          />
          <input
            type="file"
            name="profilePicFile"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
