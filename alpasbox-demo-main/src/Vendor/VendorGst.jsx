import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GSTContent = () => {
  const [formData, setFormData] = useState({
    gstin: '',
    businessName: '',
    mailId: '',
    businessNo: '',
    billingAddress: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({}); // New state to track form validation errors

  useEffect(() => {
    const fetchGSTData = async () => {
      const token = localStorage.getItem('vendor_token');
      if (!token) {
        setError('Please login to view/update GST information');
        return;
      }

      try {
        const response = await axios.post('https://admin.urbantyohar.com/api/gst', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          setFormData({
            gstin: response.data.gstin || '',
            businessName: response.data.business_name || '',
            mailId: response.data.mail_id || '',
            businessNo: response.data.business_no || '',
            billingAddress: response.data.address || ''
          });
        }
      } catch (error) {
        // setError(`Error: ${error.message}`);
      }
    };

    fetchGSTData();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear the error when the user starts typing
    setErrors(prev => ({
      ...prev,
      [id]: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    const token = localStorage.getItem('vendor_token');
    if (!token) {
      setError('Please login to update profile');
      setLoading(false);
      return;
    }

    // Validation: Check for empty fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const formattedData = {
      gstin: formData.gstin,
      business_name: formData.businessName,
      mail_id: formData.mailId,
      business_no: formData.businessNo,
      address: formData.billingAddress
    };

    try {
      const response = await axios.post('https://admin.urbantyohar.com/api/gst', formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage(response.data.message || 'GST details updated successfully.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating GST information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-poppins">
      <div className="flex justify-center items-center bg-white w-full">
        <form onSubmit={handleSubmit} className="bg-white border border-blue-300 rounded-lg p-6 shadow-lg w-full">
          <h2 className="text-lg font-bold mb-4">GST Update (Optional)</h2>

          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          {message && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{message}</div>}

          <div className="mb-4">
            <label className="block text-sm mb-1" htmlFor="gstin">GSTIN</label>
            <input 
              type="text" 
              id="gstin" 
              value={formData.gstin}
              onChange={handleInputChange}
              placeholder="Type GST No." 
              className="w-full p-2 border border-gray-300 rounded" 
            />
            {errors.gstin && <p className="text-red-500 text-sm">{errors.gstin}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1" htmlFor="businessName">Business Name (GST)</label>
            <input 
              type="text" 
              id="businessName" 
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="Enter your Business Name" 
              className="w-full p-2 border border-gray-300 rounded" 
            />
            {errors.businessName && <p className="text-red-500 text-sm">{errors.businessName}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1" htmlFor="mailId">Mail ID</label>
            <input 
              type="email" 
              id="mailId" 
              value={formData.mailId}
              onChange={handleInputChange}
              placeholder="Enter your mail ID" 
              className="w-full p-2 border border-gray-300 rounded" 
            />
            {errors.mailId && <p className="text-red-500 text-sm">{errors.mailId}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1" htmlFor="businessNo">Business No.</label>
            <input 
              type="text" 
              id="businessNo" 
              value={formData.businessNo}
              onChange={handleInputChange}
              placeholder="Enter your number" 
              className="w-full p-2 border border-gray-300 rounded" 
            />
            {errors.businessNo && <p className="text-red-500 text-sm">{errors.businessNo}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1" htmlFor="billingAddress">Billing Address</label>
            <input 
              type="text" 
              id="billingAddress" 
              value={formData.billingAddress}
              onChange={handleInputChange}
              placeholder="Bill address" 
              className="w-full p-2 border border-gray-300 rounded" 
            />
            {errors.billingAddress && <p className="text-red-500 text-sm">{errors.billingAddress}</p>}
          </div>

          <div className='flex justify-center'>
            <button 
              type="submit"
              disabled={loading}
              className="w-60 flex justify-center bg-green-600 hover:bg-green-700 text-white p-2 rounded-full text-lg disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GSTContent;
