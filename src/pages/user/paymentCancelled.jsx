
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="mb-6 text-gray-700">Your payment was not completed. You can try again or return to your cart.</p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/cart')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Return to Cart
        </button>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Retry Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelled;
