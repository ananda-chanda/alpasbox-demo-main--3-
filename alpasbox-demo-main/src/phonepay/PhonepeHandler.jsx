import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get payment status from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    
    if (status === 'success') {
      alert('Payment successful!');
      navigate('/orders');
    } else {
      alert('Payment failed!');
      navigate('/cart');
    }
  }, []);

  return <div>Processing payment...</div>;
};

export default PaymentCallback;