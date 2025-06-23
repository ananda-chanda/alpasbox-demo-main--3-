import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import json from '../assets/Thank You.json';
import wp from '../assets/all_icon/Chat-on-Whatsapp.png';
import axios from 'axios';

const ThanksPage = () => {
  const [whatsappNumber, setWhatsappNumber] = useState(null);

  useEffect(() => {
    fetchWhatsappNumber();
  }, []);

  const fetchWhatsappNumber = async () => {
    try {
      const response = await axios.post('https://admin.urbantyohar.com/api/whatsapp');
      if (response.data?.whatsapp?.whatsapp_number) {
        setWhatsappNumber(response.data.whatsapp.whatsapp_number);
      }
    } catch (error) {
      console.error('Error fetching WhatsApp number:', error);
    }
  };

  const handleWhatsappClick = () => {
    if (whatsappNumber) {
      const whatsappUrl = `https://wa.me/${whatsappNumber}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-2">
      <div className="max-w-xl w-full text-center">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-2">
          {/* Lottie Animation - Keeping original dimensions */}
          <div className="w-[16] h-[16] mx-auto">
            <Lottie
              animationData={json}
              loop={true}
              autoplay={true}
            />
            <div className='font-poppins font-semibold text-xl text-gray-600'>
           <h1>Thank You For Choosing us <br/> <span className='font-poppins font-bold text-blue-600 '> Urban Tyohar</span></h1>
           </div>
          </div>
          
          {/* Reduced space-y-0 to make text closer to animation */}
          <div className="space-y-8">
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-poppins font-semibold">
              Please provide all your details on WhatsApp
            </p>
          </div>
          
          {/* Improved WhatsApp button styling */}
          <div className="flex justify-center">
            <img
              src={wp}
              alt="whatsapp"
              className="h-16 w-auto object-contain hover:scale-105 transition-transform cursor-pointer"
              onClick={handleWhatsappClick}
              title={whatsappNumber ? `Chat on WhatsApp: +${whatsappNumber}` : 'Loading...'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanksPage;