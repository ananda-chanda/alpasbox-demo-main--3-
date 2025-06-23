import React, { useState, useEffect } from "react";
import heroImage from "../assets/Hero/Mobile.jpg"; // Banner image for mobile
import HomeBanner from "../assets/Hero/Desktop.mp4"; // Video for laptop screens

const Hero = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleContentLoaded = () => {
    setIsLoading(false);
  };

  // Fallback timeout to hide loader after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000); // 5 seconds
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative min-h-[400px] max-sm:min-h-[200px] w-full overflow-hidden top-0 mt-8 md:mt-0">
      {/* Loader */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="loader border-4 border-t-4 border-gray-300 rounded-full w-8 h-8 animate-spin"></div>
        </div>
      )}

      {/* Video for larger screens */}
      <video
        className="hidden lg:block w-full h-auto object-cover"
        src={HomeBanner}
        autoPlay
        loop
        muted
        preload="auto" // Prefetch video data
        onLoadedData={handleContentLoaded} // Call when video loads
      />

      {/* Image for smaller screens */}
      <img
        src={heroImage}
        alt="Hero"
        className="block lg:hidden w-full h-[200px] object-contain"
        onLoad={handleContentLoaded} // Call when image loads
        loading="lazy" // Lazy load the image
      />
    </div>
  );
};

export default Hero;
