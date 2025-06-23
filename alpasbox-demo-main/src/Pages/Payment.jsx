import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import RazorpayButton from '../razorpay/RazorpayButton';
import Logo from '../assets/Navbar/Logo.png';
import { ChevronLeft } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [billingInfo, setBillingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get stored information
    const storedCheckoutInfo = localStorage.getItem('checkoutInfo');
    const storedBillingInfo = localStorage.getItem('billingInfo');

    console.log('local data is ', storedBillingInfo);
    
    if (!storedCheckoutInfo || !storedBillingInfo) {
      navigate('/');
      return;
    }
    
    setCheckoutInfo(JSON.parse(storedCheckoutInfo));
    setBillingInfo(JSON.parse(storedBillingInfo));
    setLoading(false);
  }, [navigate]);

  const handlePaymentSuccess = async (response) => {
    try {
      setLoading(true);
      
      // Get auth token from storage
      const token = localStorage.getItem('user_token');
      
      if (!token) {
        navigate("/login");
        return;
      }
      
      // Prepare product details as required
      const productDetails = [
        {
          'price': checkoutInfo.offerPrice 
            ? checkoutInfo.offerPrice.toString() 
            : checkoutInfo.basePrice.toString(),
          'name': checkoutInfo.productTitle || "",
        }
      ];
      
      // Create request body object directly (no FormData)
      const requestBody = {
        product_details: productDetails,
        price: checkoutInfo.total,
        pincode: billingInfo.pincode,
        city: billingInfo.city,
        state: billingInfo.state,
        name: billingInfo.name,
        email: billingInfo.email,
        number: billingInfo.number,
        address: billingInfo.address,
        address_type: billingInfo.addressType
      };

      console.log("Sending bill data:", requestBody);

      const config = {
        method: 'post',
        url: 'https://admin.urbantyohar.com/api/bill-data',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: requestBody
      };

      // Debugging for request
      console.log("API request config:", {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });

      try {
        const apiResponse = await axios.request(config);
        console.log("Bill API response:", apiResponse.data);
        
        // Track conversion if applicable
        if (typeof gtag_report_conversion === 'function') {
          gtag_report_conversion('/thank-you');
        }
        
        // Navigate to thank you page
        navigate('/thank-you');
      } catch (apiError) {
        console.error("API Error details:", {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status
        });
        
        // Show detailed error for debugging
        setError(`API Error: ${apiError.message}. Status: ${apiError.response?.status}. 
                  Details: ${JSON.stringify(apiError.response?.data || {})}`);
      }
    } catch (error) {
      console.error("Error processing order:", error);
      setError("Payment was successful but there was an issue processing your order. Please contact customer support.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    setError('Payment failed: ' + error.message);
  };

  if (loading && !checkoutInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 font-['Poppins']">
        <div className="bg-white p-6 rounded-lg shadow-xl"> {/* Reduced padding from p-8 to p-6 */}
          <div className="flex items-center justify-center mb-3"> {/* Reduced margin */}
            <div className="w-8 h-8 border-3 border-[#4A00FF] border-t-transparent rounded-full animate-spin"></div> {/* Smaller spinner */}
          </div>
          <p className="text-center font-medium text-gray-700">Loading payment information...</p>
        </div>
      </div>
    );
  }

  if (!checkoutInfo || !billingInfo) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 font-['Poppins']">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"> {/* Reduced padding from p-8 to p-6 */}
          <div className="flex items-center justify-center mb-3 text-red-500"> {/* Reduced margin */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* Smaller icon */}
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-center font-medium text-gray-700 mb-4">Missing order information. Please try again.</p> {/* Reduced margin */}
          <button 
            onClick={() => navigate('/')}
            className="w-full px-4 py-2.5 bg-[#4A00FF] text-white rounded-md font-medium hover:bg-[#3900CC] transition-colors duration-200 shadow-md" /* Reduced padding */
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 font-['Poppins']">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden relative">
        <Helmet>
          <title>Payment - Urban Tyohar</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </Helmet>

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors" /* Moved closer to edge */
          onClick={() => window.history.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* Smaller icon */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100"> {/* Reduced padding */}
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-6 mr-2" /> {/* Smaller logo */}
            <span className="text-[#4A00FF] font-semibold text-lg tracking-tight">Urban Tyohar</span>
          </div>
        </div>

        {/* Order Summary Bar */}
        <div className="flex justify-between items-center px-6 py-2 bg-gray-50"> {/* Reduced padding */}
          <span className="text-gray-800 font-medium text-sm">Payment</span> {/* Smaller text */}
          <span className="font-bold text-sm">₹{checkoutInfo.total}</span> {/* Smaller text */}
        </div>

        {/* Content */}
        <div className="p-5"> {/* Reduced padding */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-xs"> {/* Reduced padding and margin */}
              <div className="flex items-center mb-1"> {/* Reduced margin */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"> {/* Smaller icon */}
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Payment Error</span>
              </div>
              {error}
            </div>
          )}
          
          {/* Order Summary */}
          <div className="bg-white border border-gray-200 p-4 rounded-lg mb-4 shadow-sm"> {/* Reduced padding and margin */}
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Order Summary</h3> {/* Smaller text and margin */}
            <p className="text-sm font-medium text-gray-800 mb-1">{checkoutInfo.productTitle}</p>
            <p className="text-xs text-gray-500 mb-3">Code: {checkoutInfo.productCode}</p> {/* Reduced margin */}
            
            <div className="border-t border-gray-200 pt-3 mt-2 space-y-2"> {/* Reduced spacing */}
              <div className="flex justify-between text-xs"> {/* Smaller text */}
                <span className="text-gray-600">Product Price:</span>
                <span className="font-medium">₹{checkoutInfo.subtotal}</span>
              </div>
              
              {(checkoutInfo.languagePrice > 0 || checkoutInfo.offerPrice > 0) && (
                <div className="flex justify-between text-xs"> {/* Smaller text */}
                  <span className="text-gray-600">Options:</span>
                  <span className="font-medium">₹{checkoutInfo.languagePrice + checkoutInfo.offerPrice}</span>
                </div>
              )}
              
          
              
              <div className="flex justify-between text-xs"> {/* Smaller text */}
                <span className="text-gray-600">GST (18%):</span>
                <span className="font-medium">₹{checkoutInfo.gst}</span>
              </div>
              
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200 mt-1 text-gray-800"> {/* Smaller text and spacing */}
                <span>Total:</span>
                <span>₹{checkoutInfo.total}</span>
              </div>
            </div>
          </div>
          
          {/* Payment Options */}
          <div className="mb-4"> {/* Reduced margin */}
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">Payment Method</h3> {/* Smaller text and margin */}
            <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm"> {/* Reduced padding */}
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-[#4A00FF] rounded-full flex items-center justify-center mr-2"> {/* Smaller radio button */}
                  <div className="w-2 h-2 bg-[#4A00FF] rounded-full"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Razorpay</p> {/* Smaller text */}
                  <p className="text-xs text-gray-500">Secure payment gateway</p>
                </div>
                <img src="https://razorpay.com/favicon.png" alt="Razorpay" className="h-5 ml-auto" /> {/* Smaller image */}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-6"> {/* Reduced gap and margin */}
            <RazorpayButton 
              amount={checkoutInfo.total * 100}
              product_id={checkoutInfo.productId}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              className="w-full py-3 bg-[#4A00FF] text-white rounded-lg font-semibold hover:bg-[#3900CC] transition-colors duration-200 shadow-md" /* Reduced padding */
              buttonText={`Pay ₹${checkoutInfo.total}`}
              loadingText="Processing payment..."
            />
            
            <button
              onClick={() => navigate('/bills')}
              className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center" /* Reduced padding */
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> {/* Smaller icon */}
              Back to Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;