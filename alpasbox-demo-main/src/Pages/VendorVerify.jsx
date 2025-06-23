import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../assets/Navbar/Logo.png";
import { RAZORPAY_CONFIG } from "../razorpay/RazorpayConfig";

function VendorSignup() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { mobile } = location.state || {};

  const handleOtpChange = (event) => {
    // Allow only numeric input
    const value = event.target.value.replace(/\D/g, '');
    setOtp(value);
  };

  const handleLogin = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("mobile", mobile);
      formData.append("otp", otp.trim()); // Trim whitespace
      formData.append("name", "");

      // Log FormData contents for verification
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const loginResponse = await axios.post(
        "https://admin.urbantyohar.com/api/vender-login",
        formData
      );

      console.log("Full API response:", loginResponse);

      if (loginResponse.data?.status && loginResponse.data?.statusCode === 200) {
        localStorage.setItem("vendor_token", loginResponse.data.token);

        // Fetch user details
        const userDetailsResponse = await axios.post(
          "https://admin.urbantyohar.com/api/vender-profile",
          {},
          {
            headers: {
              Authorization: `Bearer ${loginResponse.data.token}`,
            },
          }
        );

        if (userDetailsResponse.status === 200) {
          localStorage.removeItem("user_details");
          localStorage.removeItem("user_token");
          localStorage.setItem("vendor_details", JSON.stringify(userDetailsResponse.data));
          const selectedPlan = localStorage.getItem('selectedPlan');
          if (selectedPlan) {
              openRazorpayPayment();
          } else {
              navigate('/vendor-plan');
          }
        } else {
          setMessage("Failed to fetch user details. Status: " + userDetailsResponse.status);
        }
      } else {
        setMessage(loginResponse.data?.msg || "Unexpected response format");
      }
    } catch (error) {
      console.error("Full error details:", error);
      console.error("Error response:", error.response);
      
      const errorMessage = error.response?.data?.msg 
        || error.response?.data?.message
        || error.message
        || "Something went wrong. Please try again.";
      
      setMessage(`Error: ${errorMessage}`);
    }
  };

  const openRazorpayPayment = async () => {
    try {
        const selectedPlan = localStorage.getItem('selectedPlan');
        if (!selectedPlan) {
            navigate('/vendor-plan');
            return;
        }

        const plan = JSON.parse(selectedPlan);
        const amount = plan.price; 
        const finalamount = Math.round(plan.price * 100* 1.18); 

        const orderResponse = await axios.post('https://razorpay-util-main.vercel.app/api/create-order', {
            amount: amount,
        });

        const options = {
            key: RAZORPAY_CONFIG.key_id,
            // amount: orderResponse.data.amount,
            amount: finalamount,
            currency: orderResponse.data.currency,
            name: RAZORPAY_CONFIG.name,
            description: `${plan.title} - ₹${plan.price}`,
            image: RAZORPAY_CONFIG.image,
            order_id: orderResponse.data.id,
            handler: function (response) {
              localStorage.setItem("vendor_details", JSON.stringify(userDetailsResponse.data));
                localStorage.removeItem('selectedPlan'); // Clear selected plan
                alert('Payment successful!');
                navigate('/vendor-desh/profile');
            },
            prefill: {
                name: localStorage.getItem('vendor_name') || "Vendor Name",
                email: localStorage.getItem('vendor_email') || "vendor@example.com",
                contact: mobile,
            },
            theme: {
                color: RAZORPAY_CONFIG.theme.color,
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error("Error initiating Razorpay payment:", error);
        alert("Payment initiation failed. Please try again.");
    }
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="h-16 w-16 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Verify OTP
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter the OTP sent to your mobile: {mobile || "N/A"}
        </p>

        <div className="mb-4">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter OTP (6 digits):
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOtpChange}
            maxLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter 6-digit OTP"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Verify & Login
        </button>

        {message && (
          <div
            className={`mt-4 text-center ${
              message.toLowerCase().includes("error") || 
              message.toLowerCase().includes("fail") ||
              message.toLowerCase().includes("invalid")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorSignup;