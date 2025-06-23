import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import Logo from "../assets/Navbar/Logo.png";

function Signup() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(""); // New state to hold the message to be displayed
  const location = useLocation();
  const navigate = useNavigate();
  const { mobile } = location.state || {}; // Get mobile number from location state

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleLogin = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      console.log("Please enter the OTP.");
      return;
    }

    try {
      // Send login request using axios
      const loginResponse = await axios.post("https://admin.urbantyohar.com/api/user-login", {
        mobile,
        otp
      });

      const loginData = loginResponse.data; // Get response data from axios

      console.log("Login API Response:", loginData);

      if (loginResponse.status === 200 && loginData.status === true && loginData.statusCode === 200) {
        setMessage("Login successful!");
        console.log("Login successful!");

        // Save token in localStorage
        localStorage.setItem("user_token", loginData.token);

        // Fetch user details after successful login
        const userDetailsResponse = await axios.post("https://admin.urbantyohar.com/api/user-data", {}, {
          headers: {
            Authorization: `Bearer ${loginData.token}`, // Include the token in the Authorization header
          },
        });

        const userDetailsData = userDetailsResponse.data; // Get response data from axios

        if (userDetailsResponse.status === 200) {
          // Store the user details in localStorage
          localStorage.setItem("user_details", JSON.stringify(userDetailsData));

          // Pass the token to the profile page via navigate
          navigate("/profile", { state: { token: loginData.token } });
        } else {
          setMessage("Failed to fetch user details.");
          console.log("Failed to fetch user details.");
        }
      } else {
        setMessage(loginData.msg || "Invalid OTP. Please try again.");
        console.log(loginData.msg || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="h-16 w-16 object-contain" />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Verify OTP</h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter the OTP sent to your mobile: {mobile}
        </p>

        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOtpChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter OTP"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Verify & Login
        </button>

        {/* Display message */}
        {message && (
          <div className={`mt-4 text-center ${message.includes("failed") || message.includes("wrong") ? "text-red-500" : "text-green-500"}`}>
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signup;
