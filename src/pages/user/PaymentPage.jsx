import { loadStripe } from '@stripe/stripe-js';
import API from '../../api/axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const handleStripe = async () => {
  try {
    const response = await API.post('/payment/create-checkout-session', {
      userId,
      cartItems,
      shippingAddress,
    });

    console.log("Stripe session ID:", response.data.id);

    const stripe = await stripePromise;

    if (!stripe) {
      alert('Stripe not loaded');
      return;
    }

    const result = await stripe.redirectToCheckout({
      sessionId: response.data.id,
    });

    if (result.error) {
      console.error('Stripe redirect error:', result.error.message);
      alert(result.error.message);
    }

    
    localStorage.setItem('orderInfo', JSON.stringify({
      user: userId,
      orderItems: cartItems,
      shippingAddress,
      totalPrice: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }));

  } catch (error) {
    console.error('Stripe Checkout failed:', error.response?.data || error.message);
    alert('Stripe Checkout failed');
  }
};
export default handleStripe;