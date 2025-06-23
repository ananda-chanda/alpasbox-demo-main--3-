import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Gift() {
  const [giftData, setGiftData] = useState([]);
  const [pageDesc, setPageDesc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentSlides, setCurrentSlides] = useState({});
  
  const slideIntervals = useRef({});

  // Fetch gift data from API
  useEffect(() => {
    const fetchGiftData = async () => {
      try {
        setLoading(true);
        const response = await axios.post('https://admin.urbantyohar.com/api/gift-website');
        setGiftData(response.data.data);
        
        // Set page description if it exists in the response
        if (response.data.desc) {
          setPageDesc(response.data.desc);
        }
        
        // Initialize current slide for each gift item
        const initialSlides = {};
        response.data.data.forEach(item => {
          initialSlides[item.id] = 0;
        });
        setCurrentSlides(initialSlides);
      } catch (err) {
        setError('Failed to fetch gift data. Please try again later.');
        console.error('Error fetching gift data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftData();
  }, []);

  // Set up and clean up image auto-sliding intervals
  useEffect(() => {
    // Create an interval for each gift item
    giftData.forEach(item => {
      const images = item.image ? JSON.parse(item.image) : [];
      
      if (images.length > 1) {
        slideIntervals.current[item.id] = setInterval(() => {
          setCurrentSlides(prev => ({
            ...prev,
            [item.id]: (prev[item.id] + 1) % images.length
          }));
        }, 3000); // Change image every 3 seconds
      }
    });

    // Cleanup function to clear all intervals when component unmounts
    return () => {
      Object.values(slideIntervals.current).forEach(interval => {
        clearInterval(interval);
      });
    };
  }, [giftData]);

  const handleImageClick = (id) => {
    setSelectedImage(id === selectedImage ? null : id);
  };

  const handleVisitWebsite = (link) => {
    window.open(link, '_blank');
  };

  // Parse image URLs from the JSON string with improved handling of escaped characters
  const getImageUrls = (imageJson) => {
    try {
      if (!imageJson) return [];
      const parsed = JSON.parse(imageJson);
      
      return parsed.map(url => {
        // Replace escaped backslashes with regular forward slashes
        const cleanPath = url.replace(/\\/g, '').replace(/\/\//g, '/');
        return `https://admin.urbantyohar.com/${cleanPath}`;
      });
    } catch (err) {
      console.error('Error parsing image JSON:', err, imageJson);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto mt-16 mb-12 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto mt-16 mb-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto mt-16 mb-12">
      <h1 className="text-3xl font-bold text-center mb-8">Our Gift Brands</h1>
      
      {/* Display page description at the top if it exists */}
      {pageDesc && (
        <div className="mb-8 text-gray-700">
          <div dangerouslySetInnerHTML={{ __html: pageDesc }} />
        </div>
      )}
      
      {giftData.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Wait Few Seconds please</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {giftData.map((item) => {
              const imageUrls = getImageUrls(item.image);
              return (
                <div key={item.id}>
                  <div 
                    className="flex flex-col border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleVisitWebsite(item.link)}
                  >
                    <div className="relative h-64">
                      {imageUrls.length > 0 ? (
                        <img 
                          src={imageUrls[currentSlides[item.id] || 0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-opacity duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-500">No image available</p>
                        </div>
                      )}
                      
                      {/* Image navigation dots for multiple images */}
                      {imageUrls.length > 1 && (
                        <div 
                          className="absolute bottom-2 left-0 right-0 flex justify-center gap-1"
                          onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking dots
                        >
                          {imageUrls.map((_, index) => (
                            <button 
                              key={index} 
                              className={`h-2 w-2 rounded-full ${index === currentSlides[item.id] ? 'bg-white' : 'bg-gray-400'}`}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the parent click
                                setCurrentSlides(prev => ({...prev, [item.id]: index}));
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 bg-white flex flex-col flex-grow">
                      <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
                      
                      <div className="mt-auto">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the parent click event
                            handleVisitWebsite(item.link);
                          }}
                          className="w-full py-2 bg-[#4A00FF] text-white rounded hover:bg-blue-700 transition-colors duration-300"
                        >
                          Visit Our Website
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Display product description if it exists */}
                  {item.desc && (
                    <div className="mt-4 mb-8 p-4 bg-white  rounded-lg shadow-sm">
                      {/* <h3 className="text-lg font-semibold mb-2">About {item.title}</h3> */}
                      <div className="text-black font-poppins font-regular">
                        <div dangerouslySetInnerHTML={{ __html: item.desc }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Display page description at the bottom if it wasn't shown at the top */}
          {!pageDesc && giftData.length > 0 && !giftData.some(item => item.desc) && giftData[0].desc && (
            <div className="mt-12 text-black font-poppins font-regular overflow-hidden">
              <div dangerouslySetInnerHTML={{ __html: giftData[0].desc }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}