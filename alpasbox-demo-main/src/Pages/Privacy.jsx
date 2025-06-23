import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import animationData from '../assets/footer/Privacy Policy.json';

const Privacy = () => {
  const [policyData, setPolicyData] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.post('https://admin.urbantyohar.com/api/privacy-policy');
        if (response.data.status === 200 && response.data.data.length > 0) {
          setPolicyData(response.data.data[0].privacy_policy);
        } else {
          setPolicyData('<p>No privacy policy available at the moment.</p>');
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
        setPolicyData('<p>Unable to fetch the privacy policy. Please try again later.</p>');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-8 md:py-12 mt-6">
      <div className="mb-4 md:mb-6">
        <Lottie 
          options={defaultOptions} 
          height={window.innerWidth < 640 ? 200 : 350} 
          width={window.innerWidth < 640 ? 200 : 350} 
        />
      </div>
      <div className="container mx-auto bg-white shadow-none rounded-lg px-4 sm:px-6 md:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse text-center w-full">
              <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : (
          <div
            className="text-gray-800 text-base md:text-lg leading-relaxed md:leading-loose px-4 md:px-8 space-y-3 md:space-y-4 styled-content"
            dangerouslySetInnerHTML={{ __html: policyData }}
          ></div>
        )}
      </div>
      <style jsx>{`
        .styled-content strong {
          color: #1d4ed8;
          font-weight: bold;
        }
        .styled-content a {
          color: #000000;
          text-decoration: none;
        }
        .styled-content a:hover {
          color: #1d4ed8;
          transition: color 0.2s ease-in-out;
        }
        @media (max-width: 640px) {
          .styled-content {
            font-size: 16px;
            line-height: 1.6;
          }
        }
      `}</style>
    </div>
  );
};

export default Privacy;