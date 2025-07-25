import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Lottie from 'react-lottie';
import vendortik from '../assets/blog/vendor-tik.png';
import MainLoader from '../components/Loader';
import ail from '../assets/all_icon/Mail.png';
import wp from '../assets/all_icon/Chat.png';
import call from '../assets/contactus/Call.png';
import animationData from '../assets/contactus/ContactUs.json';
import RazorpayButton from '../razorpay/RazorpayButton';

function Package() {
  const [currentPackage, setCurrentPackage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState('');
  const [packages, setPackages] = useState([]);
  const [selectedStationery, setSelectedStationery] = useState([]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.post('https://admin.urbantyohar.com/api/package');
        const data = response.data;

        if (data.status === 200) {
          setBanner(data.package_contain.banner);
          setPackages(data.package);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset selected stationery when changing packages
  useEffect(() => {
    setSelectedStationery([]);
  }, [currentPackage]);

  if (loading) {
    return <MainLoader />;
  }

  const currentPackageData = packages[currentPackage];

  // Function to add vendor tik to each <p> tag
  const renderFeaturesWithVendorTik = (featureHtml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(featureHtml, 'text/html');
    const paragraphs = doc.querySelectorAll('p');

    return Array.from(paragraphs).map((p, index) => (
      <div key={index} className="flex items-start gap-2 md:gap-3">
        <img src={vendortik} alt="Checkmark" className="w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0" />
        <span className="text-gray-700 text-sm md:text-base">{p.textContent}</span>
      </div>
    ));
  };

  const handlePrevious = () => {
    setCurrentPackage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPackage((prev) => Math.min(packages.length - 1, prev + 1));
  };
  
  // Handle stationery selection
  const handleStationerySelection = (option, isChecked) => {
    if (isChecked) {
      setSelectedStationery(prev => [...prev, option]);
    } else {
      setSelectedStationery(prev => prev.filter(item => item !== option));
    }
  };

  // Generate WhatsApp message with package details and selected stationery
  const generateWhatsAppLink = () => {
    const defaultMessage = `
Hello,

I am interested in purchasing the following package:

Package Name: ${currentPackageData.package_name}
Price: ₹${currentPackageData.price?.toLocaleString()}
GST (18%): ₹${Math.round(currentPackageData.price * 0.18)}
Total Price: ₹${Math.round(currentPackageData.price * 1.18)}

${selectedStationery.length > 0 ? `Selected Stationery Options:\n${selectedStationery.join('\n')}` : 'No stationery options selected.'}

Thank you for selecting the package, Our team will get in touch with you shortly to provide more details and assist you further.
    `;
    
    const encodedMessage = encodeURIComponent(defaultMessage);
    return `https://api.whatsapp.com/send/?phone=919891715977&text=${encodedMessage}&type=phone_number&app_absent=0`;
  };

  return (
    <div className="bg-white pt-16 md:pt-0">
      {/* Banner */}
      {banner && (
        <div className="mb-4 md:mb-8">
          <img
            src={`https://admin.urbantyohar.com/${banner}`}
            alt="Package Banner"
            className="w-full h-auto"
          />
        </div>
      )}

      {/* Header */}
      <div className="text-black py-4 md:py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-xl md:text-2xl font-semibold text-center mb-2 md:mb-3">Wedding Invitation Packages</h1>
          <div className="font-poppins text-sm md:text-lg text-start leading-relaxed opacity-90 space-y-2">
            <p>At Urban Tyohar, we offer wedding invitation packages that are carefully crafted wedding packages that ensure making one common step dream-come-worth.</p>
            <p>Our invitation card designs are based on various patterns ranging from simple invitation styles to high-end professional designs.</p>
            <p>The current ongoing wedding invitation packages are well-decorated invitations with mind-catching templates plus high-quality design and templates.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        {/* Package Title Section */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="font-poppins text-lg md:text-2xl font-semibold mb-2">Urban Tyohar Custom Invitation Benefits</h2>
          <p className="font-poppins text-gray-600 text-xs md:text-sm mb-6 md:mb-8 px-2">Choose from our stationery this is what we can do you card here</p>
          <div className="text-center mt-4 md:mt-8 border-t border-green-600 pt-4 md:pt-6"></div>
          <h2 className="font-poppins text-lg md:text-2xl font-semibold mb-2 text-red-500 px-2">{currentPackageData.package_name}</h2>
          <p className="font-poppins text-gray-600 text-sm md:text-md mb-6 md:mb-8">Part of our Package</p>
        </div>
        

        {/* Package Content */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-8 mb-4 md:mb-6 flex items-center">
          {/* Left Button */}
          <button
            onClick={handlePrevious}
            className="w-8 h-8 md:w-12 md:h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>

          {/* Main Content */}
          <div className="flex-1 mx-2 md:mx-4">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 md:gap-8">
              {/* Features with Vendor Tik */}
              <div className="space-y-3 md:space-y-4 font-poppins">
                {renderFeaturesWithVendorTik(currentPackageData.feature)}
              </div>

              {/* Stationery Options */}
              {currentPackageData.stationary && (
                <div className="mt-4 md:mt-6">
                  <p className="mb-3 md:mb-4 font-medium text-gray-700 text-sm md:text-base">Select your stationery options:</p>
                  <div className="flex flex-wrap gap-x-3 md:gap-x-6 gap-y-3 md:gap-y-4">
                    {currentPackageData.stationary
                      .split('</p>')
                      .filter((item) => item.trim() !== '') // Remove empty items
                      .map((item, index) => {
                        const text = item.replace('<p>', '').trim(); // Extract text from <p> tags
                        return (
                          <label
                            key={index}
                            className="flex items-center gap-1 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              name="stationery"
                              className="form-checkbox appearance-none rounded-full border border-gray-300 checked:bg-blue-600 checked:border-blue-600 h-4 w-4 md:h-5 md:w-5"
                              style={{
                                boxShadow: 'inset 0 0 0 1px #e5e7eb', // Adds a 1px gap effect
                              }}
                              onChange={(e) => handleStationerySelection(text, e.target.checked)}
                              checked={selectedStationery.includes(text)}
                            />
                            <span className="text-gray-700 text-sm md:text-base">{text}</span>
                          </label>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Price and Actions */}
            <div className="text-center mt-6 md:mt-8 border-t border-green-600 pt-4 md:pt-6">
              {/* Mobile layout (flex-col) and desktop layout (flex-row) */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
                {/* Price section - centered on first row in mobile */}
                <div className="text-3xl md:text-3xl font-bold text-black flex flex-col text-center md:text-left w-full md:w-auto">
                  <span className="truncate">₹{currentPackageData.price?.toLocaleString()}</span>
                  <span className="font-poppins text-xs md:text-sm text-gray-500 font-normal mt-1">(GST ExC)</span>
                </div>
                
                {/* Buttons section - on second row in mobile, side by side */}
                <div className="flex flex-row justify-center w-full md:w-auto mt-4 md:mt-0 gap-2 md:gap-4">
                  <button
                    className="bg-[#4A00FF] hover:bg-blue-700 text-white px-4 sm:px-6 md:px-8 py-4 md:py-4 rounded-full font-medium text-xs sm:text-sm md:text-base whitespace-nowrap"
                    onClick={() => {
                      const userToken = localStorage.getItem('user_token'); // Check if the user is logged in

                      if (!userToken) {
                        // Redirect to the login page if the user is not logged in
                        window.location.href = '/login';
                        return;
                      }

                      // Store package details in localStorage for the billing page and 
                      localStorage.setItem('checkoutInfo', JSON.stringify({
                        packageId: currentPackageData.id,
                        packageName: currentPackageData.package_name,
                        price: currentPackageData.price,
                        gst: Math.round(currentPackageData.price * 0.18),
                        total: Math.round(currentPackageData.price * 1.18),
                        
                        
                      }));
                      // Navigate to the billing page
                      window.location.href = '/bills';
                    }}
                  >
                    Buy Now
                  </button>
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-full font-medium flex items-center justify-center text-xs sm:text-sm md:text-base whitespace-nowrap"
                  >
                    Order on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Button */}
          <button
            onClick={handleNext}
            className="w-8 h-8 md:w-12 md:h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Terms & Conditions */}
        <h3 className="text-base md:text-lg font-poppins font-semibold mb-4 md:mb-6 text-center">TERMS & CONDITION DETAILS</h3>
        <div className="bg-red-50 rounded-xl shadow-sm border p-4 md:p-6 mb-4 md:mb-6 font-poppins">
          <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-600">
            {currentPackageData.terms_condition && (
              <div>
                {currentPackageData.terms_condition
                  .split('</p>') 
                  .filter((item) => item.trim() !== '') 
                  .map((item, index) => {
                    const text = item.replace('<p>', '').trim(); // Remove opening <p> tags
                    return (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-base md:text-xl font-bold text-black">*</span> {/* Add bullet point */}
                        <span className="text-gray-700">{text}</span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-3 md:gap-4 mt-6 md:mt-8">
          <button
            className="border border-red-500 text-red-500 hover:bg-red-50 px-7 md:px-9 py-4 md:py-4 rounded-full font-poppins font-medium text-sm md:text-base"
            onClick={handlePrevious}
          >
            Back
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-7 md:px-9 py-4 md:py-4 rounded-full font-poppins font-medium text-sm md:text-base"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <section className="py-8 md:py-12 font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-6 md:p-10 w-full max-w-full flex flex-col md:flex-row items-center">
            {/* Lottie Animation Section */}
            <div className="md:w-1/2 flex justify-center order-2 md:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-xl blur-lg opacity-30"></div>
                <div className="relative w-48 h-48 md:w-80 md:h-96 rounded-xl">
                  <Lottie options={defaultOptions} isClickToPauseDisabled={true} />
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="md:w-1/2 mb-6 md:mb-0 md:mr-8 text-center md:text-left flex flex-col order-1 md:order-2">
              <h1 className="text-3xl md:text-5xl text-black font-poppins text-center tracking-wide mb-3 md:mb-4 w-fit mx-auto md:mx-0">
                Have Questions?
              </h1>
              <p className="w-fit text-sm md:text-base text-justify tracking-wide leading-loose mx-auto md:mx-0">
                We have all the time in the world to answer.<br />
                Just connect with us. We will connect with you in a second.<br />
                That's our word. Use WhatsApp, Call us, or Mail us.<br />
                The options are unlimited.
              </p>
              <div className="flex gap-3 md:gap-5 mt-4 md:mt-5 justify-center md:justify-start">
                <a href="mailto:support@urbantyohar.com" className="w-10 h-10 md:w-14 md:h-13">
                  <img src={ail} alt="Mail Icon" className="w-13 h-12 md:w-14 md:h-14" />
                </a>
                <a href="https://wa.me/919891715977" className="w-10 h-10 md:w-14 md:h-13" target="_blank" rel="noopener noreferrer">
                  <img src={wp} alt="WhatsApp Icon" className="w-13 h-12 md:w-14 md:h-14" />
                </a>
                <a href="tel:+919891715977" className="w-10 h-10 md:w-14 md:h-13">
                  <img src={call} alt="Contact Icon" className="w-13 h-12 md:w-14 md:h-14" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Package;