import React from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '../assets/loader/urban.json'; // Import the JSON file

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Lottie animationData={loaderAnimation} loop={true} className="w-80 h-80" />
    </div>
  );
};
export default Loader;