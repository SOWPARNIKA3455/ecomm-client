import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserManage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  if (!user) return; 
  if (user.role !== 'admin') {
    navigate('/');
  } else {
    fetchUsers(); 
  }
}, [user]);


  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (id, newRole) => {
    if (!['user', 'seller', 'admin'].includes(newRole)) return;
    try {
      await API.put(`/admin/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error('Failed to change role:', err);
    }
  };

  const handleBlockUser = async (user) => {
    const confirm = window.confirm(
      user.isBlocked ? 'Unblock this user?' : 'Block this user?'
    );
    if (!confirm) return;

    try {
      await API.put(`/admin/users/${user._id}/block`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to block/unblock user:', err);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6 text-center">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or email"
        className="border p-2 mb-4 w-full max-w-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* User Table */}
      <table className="w-full border text-sm">
        <thead className='text-xl text-black'>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u._id} className="text-center">
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                <select
                  value={u.role}
                  onChange={(e) => handleChangeRole(u._id, e.target.value)}
                  className="border rounded px-1 py-0.5"
                >
                  <option value="user">User</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2 border">{u.isBlocked ? 'Blocked' : 'Active'}</td>
              <td className="p-2 border space-x-2">
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleBlockUser(u)}
                >
                  {u.isBlocked ? 'Unblock' : 'Block'}
                </button>
                <button
                  className="text-red-700 hover:underline"
                  onClick={() => handleDeleteUser(u._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManage;
