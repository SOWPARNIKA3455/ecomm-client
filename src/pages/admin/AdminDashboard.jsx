import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { CSVLink } from 'react-csv';
import ThemeToggle from '../../components/ThemeToggle'; 

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [overview, setOverview] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('monthly');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchAdminData();

    window.history.pushState(null, '', window.location.href);
    const preventGoBack = () => window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', preventGoBack);
    return () => window.removeEventListener('popstate', preventGoBack);
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      const [userRes, productRes, orderRes, reportRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/products'),
        API.get('/admin/orders'),
        API.get('/admin/reports'),
      ]);

      const usersData = Array.isArray(userRes?.data)
        ? userRes.data
        : Array.isArray(userRes?.data?.data)
        ? userRes.data.data
        : [];

      const productsData = Array.isArray(productRes?.data?.data)
        ? productRes.data.data
        : Array.isArray(productRes?.data)
        ? productRes.data
        : [];

      const ordersData = Array.isArray(orderRes?.data?.data)
        ? orderRes.data.data
        : Array.isArray(orderRes?.data)
        ? orderRes.data
        : [];

      const reportsData = reportRes?.data || {};

      setUsers(usersData);
      setProducts(productsData);
      setOrders(ordersData);
      setReports(reportsData);

      setOverview({
        totalUsers: usersData.length,
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        revenue: reportsData.revenue || 0,
      });
    } catch (error) {
      console.error('Admin data fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const productHeaders = [
    { label: 'Title', key: 'title' },
    { label: 'Price', key: 'price' },
    { label: 'Category', key: 'category' },
    { label: 'Stock', key: 'stock' },
    { label: 'Verified', key: 'isVerified' },
    { label: 'Seller', key: 'seller.name' },
  ];

  const userHeaders = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
    { label: 'Created At', key: 'createdAt' },
  ];

  const orderHeaders = [
    { label: 'Order ID', key: '_id' },
    { label: 'User', key: 'user.name' },
    { label: 'Amount', key: 'totalAmount' },
    { label: 'Status', key: 'isDelivered' },
    { label: 'Created At', key: 'createdAt' },
  ];

  const combinedRevenueHeaders = [
    { label: 'Type', key: 'type' },
    { label: 'Label', key: 'label' },
    { label: 'Revenue (₹)', key: 'revenue' },
  ];

  const combinedRevenueData = [
    ...(reports?.dailyLabels?.map((label, i) => ({
      type: 'Daily',
      label,
      revenue: reports.dailyRevenue?.[i] || 0,
    })) || []),
    ...(reports?.monthlyLabels?.map((label, i) => ({
      type: 'Monthly',
      label,
      revenue: reports.monthlyRevenue?.[i] || 0,
    })) || []),
  ];

  const chartLabels = chartType === 'daily' ? reports.dailyLabels : reports.monthlyLabels;
  const chartRevenue = chartType === 'daily' ? reports.dailyRevenue : reports.monthlyRevenue;

  if (loading) {
    return <div className="p-6 text-center text-lg">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

  {/* Theme Toggle in Top-Right Corner */}
  <div className="absolute top-4 right-50  mt-2">
    <ThemeToggle />
  </div>
      <h2 className="text-3xl font-bold text-center mb-2  ">
    Welcome, Admin {user?.name || ''}
  </h2>

  <p className="text-center mb-10">
    Here's your dashboard overview.
  </p>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-600">Total Users</p>
          <h3 className="text-2xl text-black font-bold">{overview.totalUsers}</h3>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-600">Total Products</p>
          <h3 className="text-2xl text-black font-bold">{overview.totalProducts}</h3>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-600">Total Orders</p>
          <h3 className="text-2xl text-black font-bold">{overview.totalOrders}</h3>
        </div>
        <div className="bg-red-100 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <h3 className="text-2xl text-black font-bold">₹{overview.revenue}</h3>
        </div>
      </div>

      {/* Revenue Chart Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Revenue Overview</h3>
        <div className="space-x-2">
          <button
            onClick={() => setChartType('daily')}
            className={`px-4 py-1 rounded ${chartType === 'daily' ? 'bg-blue-600 text-black' : 'bg-gray-200'}`}
          >
            Daily
          </button>
          <button
            onClick={() => setChartType('monthly')}
            className={`px-4 py-1 rounded ${chartType === 'monthly' ? 'bg-blue-600 text-black' : 'bg-gray-200'}`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-xl shadow mb-10">
        <Bar
          data={{
            labels: chartLabels || [],
            datasets: [
              {
                label: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Revenue`,
                data: chartRevenue || [],
                backgroundColor: 'rgba(75,192,192,0.6)',
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: { legend: { position: 'top' } },
          }}
        />
      </div>

      {/* CSV Exports */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <CSVLink data={products} headers={productHeaders} filename="products.csv" className="bg-blue-600 text-white px-4 py-2 rounded">Export Products</CSVLink>
        <CSVLink data={users} headers={userHeaders} filename="users.csv" className="bg-green-600 text-white px-4 py-2 rounded">Export Users</CSVLink>
        <CSVLink
          data={orders.map(o => ({ ...o, isDelivered: o.isDelivered ? 'Delivered' : 'Pending', 'user.name': o.user?.name || 'N/A' }))}
          headers={orderHeaders}
          filename="orders.csv"
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Export Orders
        </CSVLink>
        <CSVLink
          data={combinedRevenueData}
          headers={combinedRevenueHeaders}
          filename="combined_revenue.csv"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Export Revenue
        </CSVLink>
      </div>
    </div>
  );
};

export default AdminDashboard;
