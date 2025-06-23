import axios from 'axios';
import { RAZORPAY_CONFIG, API_URLS } from '../razorpay/RazorpayConfig';
import { Link } from 'react-router-dom';

export const createOrder = async (amount, product_id) => {
    try {
        const token = localStorage.getItem('user_token');
        const response = await axios.post(API_URLS.createOrder, { amount, product_id }, {
            headers: {
                Authorization: `Bearer ${token}`
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
        const token = localStorage.getItem('user_token');
        
        // First verify payment with Razorpay
        const verifyResponse = await axios.post(API_URLS.verifyPayment, {
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_signature: paymentData.razorpay_signature,
            product_id: paymentData.product_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // If verification is successful, submit bill data
        if (verifyResponse.data.success) {
            try {
                // Get billing data from localStorage
                const storedCheckoutInfo = localStorage.getItem('checkoutInfo');
                const storedBillingInfo = localStorage.getItem('billingInfo');
                
                if (!storedCheckoutInfo || !storedBillingInfo) {
                    console.error('Missing checkout or billing information');
                    throw new Error('Missing checkout or billing information');
                }
                
                const checkoutInfo = JSON.parse(storedCheckoutInfo);
                const billingInfo = JSON.parse(storedBillingInfo);
                
                // Create product details with explicit string format
                // Using JSON.stringify() to ensure the keys are treated as strings
                const productDetailsString = JSON.stringify([
                    {
                        "price": checkoutInfo.offerPrice 
                            ? checkoutInfo.offerPrice.toString() 
                            : checkoutInfo.basePrice.toString(),
                        "name": checkoutInfo.productTitle || ""
                    }
                ]);
                
                // Use FormData to ensure correct format for the API
                const formData = new FormData();
                formData.append('product_details', productDetailsString);
                formData.append('price', checkoutInfo.total);
                formData.append('pincode', billingInfo.pincode);
                formData.append('city', billingInfo.city);
                formData.append('state', billingInfo.state);
                formData.append('name', billingInfo.name);
                formData.append('email', billingInfo.email);
                formData.append('number', billingInfo.number);
                formData.append('address', billingInfo.address);
                formData.append('address_type', billingInfo.addressType);
                formData.append('payment_id', paymentData.razorpay_payment_id);
                formData.append('order_id', paymentData.razorpay_order_id);
                
                console.log("Sending bill data:", {
                    product_details: JSON.parse(productDetailsString),
                    price: checkoutInfo.total,
                    // other fields...
                });
                
                // Call bill API with FormData
                const billResponse = await axios.post(
                    'https://admin.urbantyohar.com/api/bill-data',
                    formData,
                    {
                        headers: { 
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                console.log("Bill API response:", billResponse.data);
                
                // After successful submission, redirect to thank you page
                window.location.href = '/thank-you';
                
                // Track conversion if the function exists
                if (typeof gtag_report_conversion === 'function') {
                    gtag_report_conversion('/thank-you');
                }
                
            } catch (billError) {
                console.error('Bill submission failed:', billError);
                console.error('Error details:', {
                    message: billError.message,
                    response: billError.response?.data,
                    status: billError.response?.status
                });
                
                // Even if bill API fails, return the payment verification result
                verifyResponse.data.billSubmissionFailed = true;
                verifyResponse.data.billError = {
                    message: billError.message,
                    details: billError.response?.data
                };
                
                // Redirect to thank you page since payment was successful
                window.location.href = '/thank-you?bill_status=failed';
            }
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
                            product_id: options.notes.product_id
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