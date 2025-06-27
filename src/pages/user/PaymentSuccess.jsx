import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId) {
        setMessage("Missing session ID.");
        setLoading(false);
        return;
      }

      try {
      
        const res = await API.get(`/payment/update/${sessionId}`);
        setMessage(res.data.message || 'Payment successful');

        localStorage.removeItem('cart');
        localStorage.removeItem('orderInfo');
        window.dispatchEvent(new Event('cartUpdated'));

        setTimeout(() => navigate('/orders'), 2000);
      } catch (err) {
        setMessage(err?.response?.data?.error || 'Payment verification failed');
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? (
        <h3>⏳ Verifying payment...</h3>
      ) : (
        <h2>
          {message.toLowerCase().includes('success') ? '✅' : '❌'} {message}
        </h2>
      )}
    </div>
  );
};

export default PaymentSuccess;
