import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import hborder from '../assets/MainCata/sinborder.png';

function InvitationCollections() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const baseUrl = 'https://admin.urbantyohar.com';

  useEffect(() => {
    const fetchVideos = async () => {
      // First, check if data is already in localStorage
      const storedData = localStorage.getItem('invitationCo');
      
      if (storedData) {
        // If data is found in localStorage, use it
        setData(JSON.parse(storedData));
        console.log('Data loaded from localStorage');
      } else {
        // If no data in localStorage, fetch from API
        try {
          const api = axios.create({
            baseURL: baseUrl,
            withCredentials: false,
          });
          const response = await api.post('/api/main-category', {
            timeout: 10000,
          });
          console.log(response.data.data);
          
          // Store the fetched data in localStorage
          localStorage.setItem('invitationCollections', JSON.stringify(response.data.data));
          
          // Set the state with the fetched data
          setData(response.data.data);
        } catch (err) {
          let errorMessage = 'An error occurred while fetching videos';
          if (err.response) {
            errorMessage = `Server error: ${err.response.status}`;
          } else if (err.request) {
            errorMessage = 'Network error - please check your internet connection';
          }
          setError(errorMessage);
        }
      }
    };

    fetchVideos();
  }, []);

  // Function to determine the link path based on collection id
  const getCategoryLink = (collection) => {
    switch(collection.id) {
      case 1:
        return '/invitation-Video';
      case 2:
        return '/all-cards';
      case 3:
        return 'Stasubcategory/14/Wedding-Stationary';
      case 4:
        return '/pooja-kits/97/Holi-kits';
      case 6:  // New Gift category
        return '/gift';
      default:
        return '#';
    }
  };

  return (
    <div className="container bg-white  py-0 sm:py-0 min-w-full">
      <div className="flex justify-center items-center mb-8 px-4">
        <img
          src={hborder}
          alt="left border"
          className="h-8 md:h-12 w-24 md:w-64 lg:w-80 max-sm:hidden 1182px:hidden"
        />
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center whitespace-nowrap">
          Our Creative Collections  
        </h2>
        <img
          src={hborder}
          alt="right border"
          className="h-8 md:h-12 w-24 md:w-64 lg:w-80 max-sm:hidden 1182px:hidden"
        />
      </div>

      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="overflow-x-auto scrollbar-hide pb-0 sm:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4 md:gap-1 px-4 py-3 justify-items-center md:max-w-4xl md:mx-auto min-w-min">
            {data.map((collection, index) => (
              <Link
                key={index}
                to={getCategoryLink(collection)}
                className="flex flex-col items-center flex-shrink-0 h-32 md:h-40 w-24 sm:w-full max-w-[150px] cursor-pointer transition-transform duration-300 hover:scale-110"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="rounded-full overflow-hidden w-16 h-16 md:w-32 md:h-32 border-2 border-yellow-500">
                  <img
                    src={`${baseUrl}/${collection.image}`}
                    alt={collection.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 font-poppins text-center text-xs sm:text-sm md:text-base w-full
                  line-clamp-2 sm:line-clamp-1 md:line-clamp-1">
                  {collection?.maincat_name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Add CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default InvitationCollections;