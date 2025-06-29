import React, { useEffect, useState } from 'react';
import SellerLayout from '../../layout/SellerLayout';
import API from '../../api/axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revenueChartData, setRevenueChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, statsRes] = await Promise.all([
          API.get('/seller/products'),
          API.get('/seller/dashboard-stats'),
        ]);

        setProducts(productRes.data.products || []);
        setStats(statsRes.data || {});

        const daily = statsRes.data.dailyRevenueData || [];
        const monthly = statsRes.data.monthlyRevenueData || [];

        setRevenueChartData({
          labels: [...daily.map(d => d.date), ...monthly.map(m => m.month)],
          datasets: [
            {
              label: 'Daily Revenue',
              data: daily.map(d => d.amount),
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: false,
              tension: 0.4,
            },
            {
              label: 'Monthly Revenue',
              data: monthly.map(m => m.amount),
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
              tension: 0.4,
            },
          ],
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load seller dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: value => `₹${value}`,
        },
      },
    },
  };

  return (
    <SellerLayout>
      <div className="min-h-screen  p-6">

        <h1 className="text-2xl  font-bold mb-4">Seller Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500 dark:text-red-400">{error}</p>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 text-black sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Total Products" value={products.length} />
              <StatCard title="Pending Orders" value={stats.pendingOrders || 0} />
              <StatCard title="Completed Orders" value={stats.completedOrders || 0} />
              <StatCard
                title="Total Revenue"
                value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
              />
            </div>

            {/* Revenue Chart */}
            <div className=" dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h2 className="text-lg  font-semibold mb-4 dark:text-white">Revenue Overview</h2>
              {revenueChartData?.labels?.length ? (
                <Bar data={revenueChartData} options={revenueChartOptions} />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No revenue data available.</p>
              )}
            </div>

            {/* Product List */}
            <div className=" dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 mb-6">
              <h2 className="text-lg font-semibold mb-4 ">My Products</h2>
              {products.length === 0 ? (
                <p className="dark:text-gray-300">You haven't added any products yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {products.map(product => (
                    <div
                      key={product._id}
                      className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 hover:shadow-md transition"
                    >
                      <img
                        src={product.imageUrl || '/placeholder.png'}
                        alt={product.title}
                        className="w-full h-60 object-contain rounded mb-3"
                      />
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">{product.title}</h3>
                      <p className="text-green-600 font-semibold">₹{product.price}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-300">Stock: {product.stock}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">{product.category}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </SellerLayout>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center border dark:border-gray-600">
    <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>

    <p className="text-xl font-semibold dark:text-white">{value}</p>
  </div>
);

export default SellerDashboard;
