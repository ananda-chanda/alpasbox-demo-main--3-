import { ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import Logo from '../assets/Navbar/Logo.png';
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

export default function CheckoutForm() {
  const [addressType, setAddressType] = useState("home");
  const [formData, setFormData] = useState({
    pincode: "",
    city: "",
    state: "",
    name: "",
    email: "",
    number: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkoutInfo, setCheckoutInfo] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get checkout info from localStorage
    const storedInfo = localStorage.getItem('checkoutInfo');
    if (!storedInfo) {
      navigate('/');
      return;
    }
    
    const checkoutData = JSON.parse(storedInfo);
    setCheckoutInfo(checkoutData);

    // Pre-fill with user data if available
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    if (userData) {
      setFormData(prevState => ({
        ...prevState,
        name: userData.name || '',
        email: userData.email || '',
        number: userData.phone || ''
      }));
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    setError("");

    // Validate form data
    const requiredFields = ["pincode", "city", "state", "name", "email", "number", "address"];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      setError(`Please fill all required fields: ${emptyFields.join(", ")}`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('user_token');
      
      if (!token) {
        setError("Please login to continue");
        navigate("/login");
        return;
      }

      // Store billing info for payment page
      localStorage.setItem('billingInfo', JSON.stringify({
        ...formData,
        addressType: addressType === "home" ? "Home" : "Work"
      }));
      
      // Navigate to payment page without sending data yet
      navigate("/payment");
      
    } catch (error) {
      console.error("Error processing billing information:", error);
      setError("Failed to process billing information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  if (!checkoutInfo) return (
    <div className="flex justify-center items-center h-64 font-['Poppins']">
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#4A00FF] border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 font-['Poppins']">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden relative flex flex-col" style={{ maxHeight: '90vh' }}>
        <Helmet>
          <title>Billing Information - Urban Tyohar</title>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        </Helmet>

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => window.history.back()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-6 mr-2" />
            <span className="text-[#4A00FF] font-semibold text-lg tracking-tight">Urban Tyohar(For Billing)</span>
          </div>
        </div>

        {/* Order Summary Bar (Collapsible) */}
        <div 
          className="flex justify-between items-center px-6 py-2 bg-gray-50 cursor-pointer"
          onClick={toggleSummary}
        >
          <div className="flex items-center">
            <span className="text-gray-800 font-medium text-sm mr-2">Order Summary</span>
            {showSummary ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
          <span className="font-bold text-sm">₹{checkoutInfo.total}</span>
        </div>

        {/* Product Details (Collapsible) */}
    {/* Product Details (Collapsible) */}
{showSummary && (
  <div className="px-6 py-2 border-b border-gray-200 bg-gray-50">
    <p className="text-sm font-medium text-gray-800 mb-1">{checkoutInfo.productTitle}</p>
    <p className="text-xs text-gray-500 mb-2">Code: {checkoutInfo.productCode}</p>
    <div className="space-y-2 text-xs">
      {/* <div className="flex justify-between text-gray-600">
        <span>Product Price:</span>
        <span className="font-medium">₹{checkoutInfo.basePrice}</span>
      </div> */}
      {/* {(checkoutInfo.languagePrice > 0 || checkoutInfo.offerPrice > 0) && (
        <div className="flex justify-between text-gray-600">
          <span>Options:</span>
          <span className="font-medium">₹{checkoutInfo.languagePrice + checkoutInfo.offerPrice}</span>
        </div>
      )} */}
      <div className="flex justify-between text-gray-600">
        <span>Subtotal:</span>
        <span className="font-medium">₹{checkoutInfo.subtotal}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>GST (18%):</span>
        <span className="font-medium">₹{checkoutInfo.gst}</span>
      </div>
      <div className="flex justify-between pt-2 border-t border-gray-200 font-medium text-gray-800">
        <span>Total:</span>
        <span>₹{checkoutInfo.total}</span>
      </div>
    </div>
  </div>
)}

        {/* Content Area with Scroll */}
        <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {/* Form Area */}
          <div className="p-5">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-xs">
                <div className="flex items-center mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Error</span>
                </div>
                {error}
              </div>
            )}

            {/* Address Form */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Add New Address</h3>

              {/* Pincode Input */}
              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">
                  Pincode<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="751004"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A00FF] focus:border-[#4A00FF] outline-none"
                  required
                />
              </div>

              {/* City and State */}
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    City<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="KHORDHA"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A00FF] focus:border-[#4A00FF] outline-none"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    State<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="ODISHA"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A00FF] focus:border-[#4A00FF] outline-none"
                    required
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Your Name"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A00FF] focus:border-[#4A00FF] outline-none"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Your Email address"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A00FF] focus:border-[#4A00FF] outline-none"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">
                  Phone Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="91000000"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A00FF] focus:border-[#4A00FF] outline-none"
                  required
                />
              </div>

              {/* Address */}
              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">
                  Address<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-[#4A00FF] focus:border-[#4A00FF] outline-none resize-none"
                  rows={2}
                  required
                />
              </div>

              {/* Address Type */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Address Type</p>
                <div className="flex gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="addressType"
                      checked={addressType === "home"}
                      onChange={() => setAddressType("home")}
                      className="hidden"
                    />
                    <div
                      className={`flex items-center border ${
                        addressType === "home"
                          ? "border-[#4A00FF]"
                          : "border-gray-300"
                      } rounded-full px-3 py-1`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full mr-2 flex items-center justify-center ${
                          addressType === "home"
                            ? "border-2 border-[#4A00FF]"
                            : "border border-gray-400"
                        }`}
                      >
                        {addressType === "home" && (
                          <div className="w-1.5 h-1.5 bg-[#4A00FF] rounded-full"></div>
                        )}
                      </div>
                      <span className="text-xs">Home</span>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="addressType"
                      checked={addressType === "work"}
                      onChange={() => setAddressType("work")}
                      className="hidden"
                    />
                    <div
                      className={`flex items-center border ${
                        addressType === "work"
                          ? "border-[#4A00FF]"
                          : "border-gray-300"
                      } rounded-full px-3 py-1`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full mr-2 flex items-center justify-center ${
                          addressType === "work"
                            ? "border-2 border-[#4A00FF]"
                            : "border border-gray-400"
                        }`}
                      >
                        {addressType === "work" && (
                          <div className="w-1.5 h-1.5 bg-[#4A00FF] rounded-full"></div>
                        )}
                      </div>
                      <span className="text-xs">Work</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Continue Button at Bottom */}
        <div className="px-5 py-3 border-t border-gray-200 bg-white">
          <button 
            className="w-full py-3 bg-[#4A00FF] text-white rounded-lg font-semibold hover:bg-[#3900CC] transition-colors duration-200 shadow-md flex items-center justify-center text-sm"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Continue"} 
            {!loading && <ChevronRight className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}