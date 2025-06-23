import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import animation from '../assets/footer/Term & Condition.json';

const TermsAndCondition = () => {
  const [termsData, setTermsData] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.post('https://admin.urbantyohar.com/api/terms-condition');
        if (response.data.status === 200 && response.data.data.length > 0) {
          setTermsData(response.data.data[0].terms_condition);
        } else {
          setTermsData('<p class="text-center text-gray-600">No terms and conditions available at the moment.</p>');
        }
      } catch (error) {
        console.error('Error fetching terms and conditions:', error);
        setTermsData('<p class="text-center text-red-500">Unable to fetch terms and conditions. Please try again later.</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const highlightStrongText = (html) => {
    return html.replace(/<strong>(.*?)<\/strong>/g, (match, p1) => {
      return `<strong class="text-indigo-600">${p1}</strong>`;
    });
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 py-8 md:py-12 mt-6">
      <div className="mb-4 md:mb-6">
        <Lottie 
          options={defaultOptions} 
          height={window.innerWidth < 640 ? 200 : 350} 
          width={window.innerWidth < 640 ? 200 : 350} 
        />
      </div>
      <div className="container mx-auto bg-white shadow-none rounded-lg px-4 sm:px-8 md:px-12 py-6 md:py-8">
        {loading ? (
          <div className="flex justify-center items-center py-8 md:py-12">
            <div className="animate-pulse text-center w-full">
              <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-full w-1/2 mx-auto"></div>
            </div>
          </div>
        ) : (
          <div
            className="text-gray-800 text-base md:text-lg leading-relaxed md:leading-loose space-y-3 md:space-y-4 "
            dangerouslySetInnerHTML={{
              __html: highlightStrongText(termsData),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TermsAndCondition;