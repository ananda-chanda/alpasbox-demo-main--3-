import React, { useEffect, useState } from 'react';
import axios from 'axios';
import himg from "../assets/MainCata/sinborder.png";

const AboutUT = () => {
  const [aboutContent, setAboutContent] = useState('Loading content, please wait...');

  useEffect(() => {
    // Check if the about content exists in localStorage
    const storedContent = localStorage.getItem('aboutContents');

    if (storedContent) {
      // If content is found in localStorage, use it
      setAboutContent(storedContent);
    } else {
      const fetchAboutData = async () => {
        try {
          const response = await axios.post('https://admin.urbantyohar.com/api/about-urbantyohar');
          if (response.data.status === 200) {
            const content = response.data.data[0].about;
            setAboutContent(content);

            // Store the fetched content in localStorage
            localStorage.setItem('aboutContent', content);
          } else {
            setAboutContent('Failed to load about information. Please try again later.');
          }
        } catch (error) {
          console.error('Error fetching about data:', error);
          setAboutContent('Error loading content. Please check your connection and try again.');
        }
      };
      fetchAboutData();
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto my-16 p-8 bg-white rounded-lg font-poppins mt-2">
      {/* Header with images on both sides */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {/* <img
          src={himg}
          alt="left border"
          className="h-12 w-32 sm:w-48 md:w-64 lg:w-80 max-sm:hidden"
        /> */}
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-center text-gray-800 ">
         Urban Tyohar – Best Caricature Wedding Invitations <br /> & Custom Wedding Stationery <br /> Maker in India
        </h1>
        {/* <img
          src={himg}
          alt="right border"
          className="h-12 w-32 sm:w-48 md:w-64 lg:w-80 max-sm:hidden"
        /> */}
      </div>

      {/* Loading state */}
      {aboutContent === 'Loading content, please wait...' && (
        <div className="text-center text-lg sm:text-xl text-black-600">
          {aboutContent}
        </div>
      )}

      {/* Error state */}
      {aboutContent.includes('Error') && (
        <div className="text-center text-base sm:text-lg text-red-600 italic">
          {aboutContent}
        </div>
      )}

      {/* Content state */}
      {!aboutContent.includes('Error') && aboutContent !== 'Loading content, please wait...' && (
        <div
          className="mt-6 text-sm sm:text-base text-gray-700 prose prose-sm sm:prose-lg max-w-none font-poppins font-regular leading-relaxed"
          dangerouslySetInnerHTML={{ __html: aboutContent }}
        />
      )}

      <style global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');

        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }

        .prose a {
          color: inherit;
          transition: color 0.3s ease;
        }

        .prose a:hover {
          color: #2563eb; /* Tailwind blue-600 */
        }

        .font-light {
          font-weight: 300; /* Apply light font */
        }
      `}</style>
    </div>
  );
};

export default AboutUT;
