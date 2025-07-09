import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelled = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Cancelled</h1>
      <p className="mb-6">Your payment was not completed. If this was a mistake, you can try again.</p>
      <Link to="/cart" className="text-blue-600 underline">
        Back to Cart
      </Link>
    </div>
  );
};

export default PaymentCancelled;
