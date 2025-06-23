import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import Love from '../assets/all_icon/Love-icon.png';
import animationData from '../assets/footer/Call With Manager Character.json';

const CallDesigner = () => {
  const navigate = useNavigate(); // Hook to navigate between pages

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const handleContactUsClick = () => {
    window.scrollTo(0, 0);
    navigate('/contact'); // Navigate to the /contact page
  };

  return (
    <div className="max-w-7xl mx-auto p-2 flex flex-col sm:flex-row sm:space-x-4 font-poppins">
      {/* Content Section */}
      <div className="flex-1 min-h-[500px] sm:min-h-[400px] order-2 sm:order-1 px-4 sm:px-2">
        <h1 className="text-xl md:text-2xl lg:text-2xl font-bold mb-6">
          Looking for a Designer for a custom wedding invitation 
        </h1>
        <ul className="list-none space-y-4 mb-6">
          <li className="flex items-center">
            <img src={Love} alt="Love Icon" className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
            <span className="text-lg sm:text-xl lg:text-base">We have got you Covered!</span>
          </li>
          <li className="flex items-center">
            <img src={Love} alt="Love Icon" className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
            <span className="text-lg sm:text-xl lg:text-base">
              You are Special & your Wedding card needs to be Special too.
            </span>
          </li>
        </ul>
        <h2 className="text-xl sm:text-2xl lg:text-lg font-bold mb-4">How it works?</h2>
        <ul className="list-none space-y-4">
          <li className="flex items-center">
            <img src={Love} alt="Love Icon" className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
            <span className="text-lg sm:text-xl lg:text-base">
              Get a Dedicated Designer for your Wedding/Engagement E-card.
            </span>
          </li>
          <li className="flex items-center">
            <img src={Love} alt="Love Icon" className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
            <span className="text-lg sm:text-xl lg:text-base">Delivery within 3 working days.</span>
          </li>
          <li className="flex items-center">
            <img src={Love} alt="Love Icon" className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
            <span className="text-lg sm:text-xl lg:text-base">
              Flexible editing & customer support.
            </span>
          </li>
        </ul>
        {/* Contact Us Button */}
        <div className="mt-6 lg:mt-4"> {/* Reduced margin-bottom on lg screens */}
          <button
            className="px-5 py-3 text-base sm:text-lg lg:text-base bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300 ease-in-out"
            onClick={handleContactUsClick}
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Lottie Animation Section */}
      <div className="flex-1 min-h-[400px] sm:min-h-[500px] mb-6 sm:mb-0 order-1 sm:order-2 flex justify-center items-center">
        <Lottie options={lottieOptions} height={500} width={500} />
      </div>
    </div>
  );
};

export default CallDesigner;
