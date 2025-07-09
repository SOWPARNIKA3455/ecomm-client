import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../../pages/user/EditProfile';

import axios from 'axios';
import {
  FaUser, FaEnvelope, FaLock, FaSignOutAlt,
  FaBoxOpen, FaHeart, FaMapMarkedAlt, FaCreditCard,
} from 'react-icons/fa';

const UserDashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/user/profile', {
          withCredentials: true,
        });
        const userData = res.data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        console.error('Profile fetch error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, setUser]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/user/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        Loading your dashboard...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-500 text-lg">
        Failed to load profile. Please{' '}
        <button onClick={() => navigate('/login')} className="text-blue-600 underline">
          log in
        </button>.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 border dark:bg-gray-900 shadow-lg rounded-lg ">
      <h2 className="text-2xl font-bold mb-6">Welcome, {user.name || 'User'} 👋</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info */}
        <div className="p-4 border rounded shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                user.profilePic
                  ? user.profilePic
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}`
              }
              alt="User Avatar"
              className="w-12 h-12 rounded-full border object-cover"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {user.role && (
                <p className="text-gray-400 text-xs capitalize">Role: {user.role}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card icon={<FaBoxOpen />} label="Orders" onClick={() => navigate('/orders')} />
          <Card icon={<FaHeart />} label="Wishlist" onClick={() => navigate('/user/wishlist')} />
        
          <Card icon={<FaUser />} label="Edit Profile" onClick={() => setIsEditModalOpen(true)} />
          <Card icon={<FaSignOutAlt />} label="Logout" onClick={handleLogout} />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          setUser={setUser}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

const Card = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 border rounded shadow-sm transition hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    <div className="text-xl text-blue-600 dark:text-blue-400 mb-2">{icon}</div>
    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</span>
  </button>
);


export default UserDashboard;
