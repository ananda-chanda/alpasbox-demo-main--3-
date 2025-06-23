import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Navbar/Logo.png";

function VendorLogin() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for API requests
  const [message, setMessage] = useState(""); // State to hold messages for feedback
  const navigate = useNavigate(); // React Router's navigation hook

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      navigate("");
    }
  }, [navigate]);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleMobileChange = (event) => {
    setMobile(event.target.value);
  };

  const handleSubmit = async () => {
    if (!name || !mobile) {
      setMessage("Please enter both name and mobile number.");
      console.log("Please enter both name and mobile number."); // Log to the console
      return;
    }

    setLoading(true);
    setMessage(""); // Reset message state before making request

    try {
      const otpResponse = await fetch("https://admin.urbantyohar.com/api/otp-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, mobile }),
      });

      const otpData = await otpResponse.json();
      console.log("OTP API Response:", otpData); // Log the API response

      if (otpResponse.ok && otpData.status === true && otpData.statusCode === 200) {
        // OTP was successfully sent, update message
        const successMessage = otpData.msg || "OTP sent successfully.";
        setMessage(successMessage);
        console.log(successMessage); // Log success message

        // Redirect to /signup with mobile as state
        navigate("/vendor-verify", { state: { mobile } });
      } else {
        // API response indicates failure
        const failureMessage = otpData.msg || "Failed to send OTP. Please try again.";
        setMessage(failureMessage);
        console.log(failureMessage); // Log failure message
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setMessage("Something went wrong. Please try again.");
      console.log("Something went wrong. Please try again."); // Log error
    }

    setLoading(false);
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="h-16 w-16 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4"> Vendor Login/Signup</h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Type your Name & Mobile Number to log in or become a member.
        </p>

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>
        {/* Mobile Input */}
        <div className="mb-4">
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile No:
          </label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={handleMobileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your mobile number"
          />
        </div>

        {/* Send OTP Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        {/* Message Display */}
        {message && (
          <div
            className={`mt-4 text-center ${
              message.includes("Failed") || message.includes("wrong") ? "text-red-500" : "text-green-500"
            }`}
          >
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorLogin;
