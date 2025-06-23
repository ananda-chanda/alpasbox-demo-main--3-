import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerReviews from './CustomerReview';
import one from '../assets/About/about 1.png';
import two from '../assets/About/about 2.png';
import three from '../assets/About/about 3.png';
import four from '../assets/About/about 4.png';
import five from '../assets/About/about 5.png';
import Lottie from 'lottie-react';
import imagejson from '../assets/About/About us.json'

const About = () => {
  const [aboutContent, setAboutContent] = useState('');
  const [teamVideo, setTeamVideo] = useState('');

  useEffect(() => {
    axios
      .post('https://admin.urbantyohar.com/api/about')
      .then((response) => {
        if (response.data.status === 200 && response.data.about.length > 0) {
          setAboutContent(response.data.about[0].about);
          setTeamVideo(`https://admin.urbantyohar.com/${response.data.about[0].team_video}`);
        }
      })
      .catch((error) => {
        console.error('Error fetching about content:', error);
      });
  }, []);

  const features = [
    { image: one, text: '+12 Years Experience' },
    { image: two, text: 'Worldwide Clients' },
    { image: three, text: 'Customized Process' },
    { image: four, text: '5-Star Quality' },
    { image: five, text: 'Fixed Deadlines' },
  ];

  return (
    <div className="container mx-auto px-4 py-2 md:py-20 mt-8 md:mt-4">
      {/* Main Content Section */}
      <div className="flex flex-col items-center justify-center font-poppins text-center">
        <h1 className="text-2xl md:text-2xl font-semibold text-[#333] mt-5 mb-2.5">
          The tree's Branches stand strong with Urban Tyohar,
          <span className="block"></span> 
          showing they are together and strong.
        </h1>
        
        <p className="text-sm md:text-base text-[#666] mb-5">
          Meet the people behind Urban Tyohar
        </p>
        
        <div className="w-full max-w-[700px] shadow-lg">
          <div className="relative w-full aspect-video">
            {teamVideo ? (
              <video
                className="w-full h-full rounded-xl object-cover"
                controls
                controlsList="nodownload"
                playsInline
              >
                <source src={teamVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full rounded-xl bg-gray-200 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center bg-white font-sans px-4 py-8">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Lottie Animation Section */}
            <div className="w-full md:w-1/2">
              <Lottie 
                animationData={imagejson} 
                className="h-[300px] sm:h-[350px] md:h-[430px] w-full max-w-[520px] mx-auto"
              />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2">
              <div className="text-center md:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-poppins font-semibold text-gray-800 mb-4">
                  Urban Tyohar Where Invitations Meet Innovation
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed font-poppins">
                  At Urban Tyohar, we turn your celebrations into extraordinary digital experiences. 
                  Whether it's a wedding, birthday, engagement, or any special occasion, we create 
                  stunning, personalized invitation videos or cards that make your event unforgettable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="bg-white rounded-2xl md:p-2 px-4 md:px-32">
        <div
          className="font-poppins prose prose-sm md:prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: aboutContent }}
        />
        <style jsx>{`
          .prose h2 {
            color: #1e40af;
            font-size: 2rem;
            margin-top: 2rem;
            margin-bottom: 1.5rem;
            font-weight: 700;
            line-height: 1.2;
            letter-spacing: -0.02em;
          }
          
          @media (min-width: 768px) {
            .prose h2 {
              font-size: 2.75rem;
              margin-top: 2.5rem;
              margin-bottom: 2rem;
            }
          }
          
          .prose h3 {
            font-size: 1.5rem;
            color: #2563eb;
            margin-top: 1.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
            line-height: 1.3;
          }
          
          @media (min-width: 768px) {
            .prose h3 {
              font-size: 2rem;
              margin-top: 2rem;
              margin-bottom: 1.5rem;
            }
          }
          
          .prose p {
            font-size: 1rem;
            margin-bottom: 1.5rem;
            line-height: 1.6;
            color: #374151;
            letter-spacing: 0.01em;
          }
          
          @media (min-width: 768px) {
            .prose p {
              font-size: 1.2rem;
              margin-bottom: 1.8rem;
            }
          }
          
          .prose strong {
            color: #1e40af;
            font-weight: 600;
          }
          
          .prose ul {
            margin-left: 1.5rem;
            margin-top: 1rem;
            margin-bottom: 1rem;
            list-style-type: disc;
          }
          
          @media (min-width: 768px) {
            .prose ul {
              margin-left: 2rem;
              margin-top: 1.5rem;
              margin-bottom: 1.5rem;
            }
          }
          
          .prose li {
            margin-bottom: 0.6rem;
            font-size: 1rem;
            line-height: 1.4;
            color: #374151;
          }
          
          @media (min-width: 768px) {
            .prose li {
              margin-bottom: 0.8rem;
              font-size: 1.2rem;
              line-height: 1.5;
            }
          }
          
          .prose a {
            color: #2563eb;
            text-decoration: underline;
            text-decoration-thickness: 2px;
            text-underline-offset: 2px;
            transition: all 0.2s ease;
          }
          
          .prose a:hover {
            color: #1e40af;
            text-decoration-thickness: 3px;
          }
          
          .prose blockquote {
            border-left: 4px solid #2563eb;
            padding-left: 1rem;
            margin-left: 0;
            margin-right: 0;
            font-style: italic;
            color: #4b5563;
          }
          
          @media (min-width: 768px) {
            .prose blockquote {
              padding-left: 1.5rem;
            }
          }
          
          .prose blockquote p {
            font-size: 1.1rem;
            line-height: 1.5;
          }
          
          @media (min-width: 768px) {
            .prose blockquote p {
              font-size: 1.25rem;
              line-height: 1.6;
            }
          }
        `}</style>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl py-2 px-4 md:px-8">
        <div className='text-center font-poppins font-semibold text-3xl mb-4'>
          <h1>Urban Tyohar a Creative Design Hub</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 md:space-y-3">
              <img
                src={feature.image}
                alt={feature.text}
                className="object-contain w-24 h-16 md:w-30 md:h-20"
              />
              <p className="text-sm md:text-lg font-medium text-gray-800 text-center">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <CustomerReviews />
    </div>
  );
};

export default About;