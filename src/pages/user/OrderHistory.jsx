import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import ReviewModal from '../../pages/user/ReviewModal';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await API.get(`/orders/user/${user._id}`);
      const uniqueOrders = Array.from(
        new Map(res.data.orders.map((order) => [order._id, order])).values()
      );
      setOrders(uniqueOrders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchOrders();
  }, [user]);

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await API.delete(`/orders/${orderId}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to delete order');
    }
  };

  if (loading) return <p>Loading order history...</p>;
  if (!orders.length) return <p>No orders found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      {orders.map((order) => {
        const expectedDate = new Date(order.createdAt);
        expectedDate.setDate(expectedDate.getDate() + 5);

        return (
          <div key={order._id} className="border p-4 rounded mb-6 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Order #{order._id}</h3>
              <div className="flex gap-2 items-center">
                {order.isDelivered ? (
                  <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                    Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-2 py-1 rounded">
                    Expected by {expectedDate.toLocaleDateString()}
                  </span>
                )}
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>

            <p><strong>Payment:</strong> {order.paymentMethod} ({order.isPaid ? 'paid' : 'unpaid'})</p>
            <p><strong>Total:</strong> ₹{order.totalPrice}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

            <div className="mt-4 space-y-2">
              {order.orderItems.map(({ product, quantity }, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <img
                    src={product?.imageUrl || '/placeholder.png'}
                    alt={product?.title || 'Product'}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div>
                    <p className="font-medium">{product?.title || 'Unnamed Product'}</p>
                    <p>Qty: {quantity}</p>
                    <p>Price: ₹{product?.price} × {quantity} = ₹{product?.price * quantity}</p>
                    {order.isDelivered ? (
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowReviewModal(true);
                        }}
                        className="mt-1 px-2 py-1 text-sm bg-indigo-600 text-white rounded"
                      >
                        Add Review
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">Not yet delivered</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded"
                >
                  Track Your Order
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl relative">
            <button
              className="absolute top-2 right-3 text-gray-600 text-xl font-bold"
              onClick={() => setSelectedOrder(null)}
            >
              ×
            </button>

            <h3 className="text-lg font-semibold mb-4">
              🚚 Track Order #{selectedOrder._id}
            </h3>

            <div className="flex items-center space-x-4 overflow-x-auto">
              {[
                { label: 'Order Placed', always: true },
                { label: 'Processing', minDays: 1 },
                { label: 'Shipped', minDays: 2 },
                { label: 'Out for Delivery', minDays: 3 },
                { label: 'Delivered', requireDelivered: true },
              ].map((step, index) => {
                const orderDate = new Date(selectedOrder.createdAt);
                const now = new Date();
                const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

                const isComplete =
                  step.always ||
                  (step.requireDelivered && selectedOrder.isDelivered) ||
                  (!step.requireDelivered && diffDays >= step.minDays);

                return (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        isComplete ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    ></div>
                    <span
                      className={`text-sm ${
                        isComplete ? 'text-green-700 font-medium' : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    {index !== 4 && (
                      <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showReviewModal && selectedProduct && (
        <ReviewModal
          product={selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
};

export default OrderHistory;
