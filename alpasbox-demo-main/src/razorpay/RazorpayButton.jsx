import React, { useState } from 'react';
import { createOrder, verifyPayment, initializeRazorpayPayment } from './RazorpayService';

const RazorpayButton = ({ 
    amount, 
    product_id, 
    onSuccess, 
    onError,
    className = "bg-[#4A00FF] hover:bg-blue-600 text-white py-3 px-6 rounded-full text-sm font-medium transition-colors duration-200",
    buttonText = "Buy Now",
    loadingText = "Processing..."
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        if (isProcessing) return;
        
        setIsProcessing(true);
        try {
            // Create order
            const orderData = await createOrder(amount, product_id);
            
            // Configure payment options
            const options = {
                amount: orderData.order.amount,
                order_id: orderData.order.id,
                prefill: {
                    name: localStorage.getItem('vendor_name') || "",
                    email: localStorage.getItem('vendor_email') || "",
                    contact: localStorage.getItem('vendor_mobile') || ""
                },
                notes: {
                    product_id: product_id,
                    vendor_id: localStorage.getItem('vendor_id'),
                    amount: amount
                }
            };

            // Initialize payment
            const paymentResponse = await initializeRazorpayPayment(options);
            
            // Verify payment and save purchase details
            const verificationResponse = await verifyPayment({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                product_id: product_id,
                amount: amount
            });

            if (verificationResponse.success) {
                // Pass complete payment details to success handler
                onSuccess?.({
                    ...verificationResponse,
                    transaction_id: paymentResponse.razorpay_payment_id,
                    product_id: product_id,
                    amount: amount
                });
            }
        } catch (error) {
            console.error('Payment failed:', error);
            onError?.(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            className={className}
            onClick={handlePayment}
            disabled={isProcessing}
        >
            {isProcessing ? (
                <div className="flex items-center justify-center">
                    <svg 
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                    >
                        <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                        />
                        <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    {loadingText}
                </div>
            ) : buttonText}
        </button>
    );
};

export default RazorpayButton;