// pages/PaymentCancelled.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/cart');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-red-600">Payment Cancelled</h1>
      <p className="mt-2">You’ve cancelled the payment. Redirecting to cart...</p>
    </div>
  );
};

export default PaymentCancelled;
