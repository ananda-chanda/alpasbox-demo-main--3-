import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/contactus/ContactUs.json';
import Mail from '../assets/all_icon/Mail.png';
import wp from '../assets/all_icon/Chat.png';
import call from '../assets/contactus/Call.png';

export const ContactUs = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center pt-20 px-0 md:px-0">
      {/* Main Contact Card */}
      <div className="bg-white rounded-xl p-4 md:p-10 w-full max-w-full flex flex-col md:flex-row items-center">
        {/* Lottie Animation Section */}
        <div className="w-full md:w-1/2 flex justify-center mb-6 md:mb-0">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-100 rounded-xl blur-lg opacity-30"></div>
            <div className="relative w-64 h-64 md:w-80 md:h-96 rounded-xl">
              <Lottie options={defaultOptions} />
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 md:mr-8 text-center md:text-left flex flex-col">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-black font-poppins tracking-wide mb-4">
            Have Questions?
          </h1>
          <p className="text-sm md:text-base text-justify md:text-left tracking-wide leading-loose mb-6">
            We have all the time in the world to answer.<br />
            Just connect with us. We will connect with you in a second.<br />
            That's our word. Use WhatsApp, Call us, or Mail us.<br />
            The options are unlimited.
          </p>
          <div className="flex gap-3 md:gap-5 justify-center md:justify-start">
            <a href="mailto:support@urbantyohar.com" className="w-12 h-12 md:w-14 md:h-14">
              <img src={Mail} alt="Mail Icon" className="w-full h-full" />
            </a>
            <a href="https://wa.me/9891715977" className="w-12 h-12 md:w-14 md:h-14" target="_blank" rel="noopener noreferrer">
              <img src={wp} alt="WhatsApp Icon" className="w-full h-full" />
            </a>
            <a href="tel:9891715977" className="w-12 h-12 md:w-14 md:h-14">
              <img src={call} alt="Contact Icon" className="w-full h-full" />
            </a>
          </div>
        </div>
      </div>

      {/* Our Offices Section */}
      <div className="relative w-full mt-10">
        <div
          className="absolute w-full"
          style={{
            clipPath: 'polygon(0 40px, 100% 2px, 100% 4px, 0 42px)',
            backgroundColor: '#FBBF24',
            height: '100%',
            top: 0,
            zIndex: 10,
          }}
        />
        <div
          className="bg-[#4A00FF] text-white w-full mt-1"
          style={{ clipPath: 'polygon(0 38px, 100% 0, 100% 100%, 0 100%)' }}
        >
          <div className="mx-auto p-4 md:p-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-6xl mx-auto">
              
              {/* Office location */}
              <div className="lg:col-span-1 flex flex-col justify-center lg:justify-start px-4 sm:px-0">
                <div className="text-center md:text-start mb-6 md:mb-8 lg:mb-12 mt-6 md:mt-8 lg:mt-12">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-yellow-400 mb-2">WHERE ARE WE?</h2>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                    Our Office
                  </h1>
                </div>
                
                <div className="mb-6 md:mb-8 lg:mb-12 p-3 sm:p-4 md:p-6 rounded-lg backdrop-blur-sm w-full max-w-sm sm:max-w-md lg:max-w-none mx-auto lg:mx-0">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400 text-center lg:text-left">Odisha</h3>
                  <p className="text-sm sm:text-base md:text-lg leading-relaxed mt-2 text-center lg:text-left">
                  1570, Aravindo Nagar,
                  Near Poonama Gate Flyover,
                  <br />
                  Old Town, Bhubaneswar,
                  <br />
                  Odisha 751002
                  </p>
                </div>
              </div>
         
              {/* Map */}
              <div className="lg:col-span-2 flex justify-center lg:justify-end px-4 sm:px-0">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-none h-full">
                  <iframe
                    src="https://storage.googleapis.com/maps-solutions-nkkxbaw392/locator-plus/t01x/locator-plus.html"
                    className="w-full h-96 sm:h-96 md:h-96 lg:h-96 xl:h-96 rounded-xl"
                    style={{border: 0}}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;