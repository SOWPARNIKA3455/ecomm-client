import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SellerOrderManage = () => {
  const { user } = useAuth(); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      try {
        const { data } = await API.get('/seller/orders');
        setOrders(data);
      } catch (err) {
        toast.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'seller') {
      fetchSellerOrders();
    }
  }, [user]);

  const handleMarkDelivered = async (orderId) => {
    try {
      await API.put(`/api/orders/deliver/${orderId}`);
      toast.success('Marked as delivered');
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, isDelivered: true } : order
        )
      );
    } catch (err) {
      toast.error('Failed to update delivery status');
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders for your products.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 rounded-lg p-5 mb-5 bg-white shadow-sm"
          >
            <div className="mb-2">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Customer:</strong> {order.user?.name}</p>
              <p><strong>Status:</strong> 
                <span className={order.isDelivered ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                  {order.isDelivered ? ' Delivered' : ' Pending'}
                </span>
              </p>
            </div>
            <div className="mt-3">
              <h3 className="font-semibold mb-2">Ordered Items:</h3>
              
{order.orderItems
  .filter(item => item.product?.seller?.toString() === user._id.toString())
  .map((item, idx) => (
    <div key={idx} className="flex items-center gap-4 ml-4 mt-2">
      <img
        src={item.product?.imageUrl || '/placeholder.png'}
        alt={item.product?.title || 'Product'}
        className="w-16 h-16 object-cover border rounded"
      />
      <div>
        <p className="font-medium">{item.product?.title || 'Unnamed Product'}</p>
        <p>
          ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
        </p>
      </div>
    </div>
))}




            </div>

            {!order.isDelivered && (
              <button
                onClick={() => handleMarkDelivered(order._id)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Mark as Delivered
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SellerOrderManage;
