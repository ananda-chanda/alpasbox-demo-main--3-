import axios from 'axios';
import { RAZORPAY_CONFIG, API_URLS } from '../Vendorpurchase/RazorpayConfig';
import { Link } from 'react-router-dom';

export const createOrder = async (amount, plan_id) => {
    try {
        const token = localStorage.getItem('vendor_token'); // Retrieve the token from localStorage
        const response = await axios.post(API_URLS.createOrder, { amount, plan_id }, {
            headers: {
                Authorization: `Bearer ${token}` // Include the token in the headers
            }
        });
        return response.data;
    } catch (error) {
        console.error('Order creation failed:', error);
        throw new Error('Failed to create order: ' + (error.response?.data?.message || error.message));
    }
};

export const verifyPayment = async (paymentData) => {
    try {
        const token = localStorage.getItem('vendor_token'); // Retrieve the token from localStorage
        const verifyResponse = await axios.post(API_URLS.verifyPayment, {
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_signature: paymentData.razorpay_signature,
            plan_id: paymentData.plan_id // Include product_id in the verification request
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Include the token in the headers
            }
        });

        if (verifyResponse.data.success) {
            window.location.href = '/thank-you';
            gtag_report_conversion('/thank-you'); // Redirect to thank you page
        }

        return verifyResponse.data;
    } catch (error) {
        console.error('Payment verification failed:', error);
        throw error;
    }
};

export const initializeRazorpayPayment = (options) => {
    return new Promise((resolve, reject) => {
        try {
            const rzp = new window.Razorpay({
                ...RAZORPAY_CONFIG,
                ...options,
                handler: async (response) => {
                    try {
                        const result = await verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            plan_id: options.notes.plan_id // Pass product_id to verifyPayment
                        });
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                },
                modal: {
                    ondismiss: () => reject(new Error('Payment cancelled by user'))
                }
            });

            rzp.on('payment.failed', (response) => {
                reject(new Error(response.error.description || 'Payment failed'));
            });

            rzp.open();
        } catch (error) {
            reject(new Error('Failed to initialize payment: ' + error.message));
        }
    });
};