import React, { useEffect, useState } from 'react';
import API from '../../api/axios';

const OrderManage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await API.get('/admin/orders');
      setOrders(res.data.data); 
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, {
        isDelivered: true,
      });
      fetchOrders(); 
    } catch (err) {
      console.error('Failed to mark as delivered:', err);
      alert('Failed to update order status');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🧾 Manage Orders</h2>

      {loading ? (
        <p className="text-lg text-gray-600">Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Items</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t">
                  <td className="p-3 text-blue-600">{order._id.slice(-6)}</td>
                  <td className="p-3">
                    {order.user?.name} <br />
                    <span className="text-xs text-gray-500">{order.user?.email}</span>
                  </td>
                  <td className="p-3">
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx}>
                        • {item.name} x{item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="p-3">₹{order.totalPrice}</td>
                  <td className="p-3">{order.paymentMethod}</td>
                  <td className="p-3">
                    {order.isDelivered ? (
                      <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">Delivered</span>
                    ) : (
                      <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
                    )}
                  </td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    {!order.isDelivered && (
                      <button
                        onClick={() => markAsDelivered(order._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderManage;
