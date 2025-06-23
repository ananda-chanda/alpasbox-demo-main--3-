import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvideoBanner = ({ mainId }) => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  // Fetch banners only once and store them in localStorage
  useEffect(() => {
    const fetchBanners = async () => {
      // Check if data is already in localStorage
      const storedBanners = localStorage.getItem('bann');
      if (storedBanners) {
        // Use stored data if available
        setBanners(JSON.parse(storedBanners));
      } else {
        // Fetch data if not available in localStorage
        try {
          const response = await axios.post('https://admin.urbantyohar.com/api/main-banner', {
            mainId,
          });
          if (response.data.status === 200) {
            const validBanners = response.data.data.filter((banner) => banner.status === 0);
            setBanners(validBanners);
            // Store fetched data in localStorage
            localStorage.setItem('banners', JSON.stringify(validBanners));
          }
        } catch (error) {
          console.error('Error fetching banners:', error);
        }
      }
    };

    fetchBanners();
  }, [mainId]);

  const handleImageError = (bannerId, error) => {
    console.error(`Image loading error for banner ${bannerId}:`, error);
    setImageErrors((prev) => ({
      ...prev,
      [bannerId]: true,
    }));
  };

  const getImageUrl = (path) => {
    if (path.startsWith('http')) {
      return path;
    }
    return `https://admin.urbantyohar.com/${path}`;
  };

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === banners.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (banners.length === 0) {
    return (
      <div className="h-[300px] md:h-[600px] flex items-center justify-center bg-gray-100">
        Loading banners...
      </div>
    );
  }

  return (
    <div className="relative w-full ">
      <div className="relative h-[250px] md:h-[700px] overflow-hidden">
        <div className="relative w-full h-full">
          {banners.map((banner, index) => {
            const imageUrl = getImageUrl(banner.banner);
            return (
              <div
                key={banner.id}
                className={`absolute w-full h-full transition-opacity duration-500 ease-in-out max-sm:pt-16 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={imageUrl}
                  alt={`Banner ${index + 1}`}
                  className="absolute w-full h-fit object-contain"
                  onError={(e) => handleImageError(banner.id, e)}
                />
                {imageErrors[banner.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <p className="text-red-500">Error loading image</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvideoBanner;
