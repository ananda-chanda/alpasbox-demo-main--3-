import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Mail from '../assets/all_icon/Mail.png';
import wp from '../assets/all_icon/Chat.png';
import vendortik from '../assets/blog/vendor-tik.png';
import { useNavigate } from 'react-router-dom';
// import RazorpayButton from '../razorpay/RazorpayButton';
import RazorpayButton from '../Vendorpurchase/RazorpayButton';
import Rate from '../assets/Vendor/Rade-cross.png';

const Vendorplan = () => {
  const [plandata, setData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  console.log("vendor data", plandata); 

  // Check login status
  useEffect(() => {
    const vendorToken = localStorage.getItem("vendor_token");
   
    setIsLoggedIn(!!vendorToken);
  }, []);

  // Fetch plan data
  useEffect(() => {
    const storedData = localStorage.getItem('plandatas');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      axios.post('https://admin.urbantyohar.com/api/vender-plan')
        .then((response) => {
          console.log("vendor data", response.data.data);
          setData(response.data.data);
          localStorage.setItem('plandata', JSON.stringify(response.data.data));
        });
    }
  }, []);

  const handlePurchase = (plan) => {
    if (!isLoggedIn) {
      localStorage.setItem('selectedPlan', JSON.stringify({
        id: plan.id,
        title: plan.title,
        price: plan.price
      }));
      navigate('/vendor-login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  };

  const parseFeatures = (features) => {
    const modifiedFeatures = features.replace(/<strong>/g, '<span class="highlight">').replace(/<\/strong>/g, '</span>');
    const parser = new DOMParser();
    const doc = parser.parseFromString(modifiedFeatures, 'text/html');
    return Array.from(doc.querySelectorAll('li')).map(li => ({
      text: li.innerHTML,
      included: !li.querySelector('.highlight')
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-4">
            Urban Tyohar Pro Customer
          </h1>
          <p className="text-lg font-poppins text-gray-600 mb-12">
            To enjoy all the features of Urban Tyohar with create video faster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plandata.map((plan, index) => (
            <div key={index}>
              <div
                className={`relative p-6 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                  plan.title === 'Pro Studio Plan' ? 'border-green-500' : ''
                }`}
              >
                <div
                  className={`absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#FF3D57] text-white py-2 px-6 rounded-lg text-lg md:text-xl font-bold`}
                >
                  {plan.title}
                </div>
                <div className="mt-6">
                  <ul className="space-y-4 mb-6">
                    {parseFeatures(plan.features).map((feature, idx) => (
                      <li key={idx} className="font-poppins flex items-start space-x-2">
                        <img
                          src={feature.included ? vendortik : Rate}
                          alt="Feature Included"
                          className={`w-5 h-5 mt-1 flex-shrink-0 ${
                            feature.included 
                              ? '' 
                              : 'opacity-40 [filter:brightness(0)_saturate(100%)_invert(29%)_sepia(93%)_saturate(6615%)_hue-rotate(356deg)_brightness(103%)_contrast(126%)]'
                          }`}
                        />
                        <span
                          className={feature.included ? 'text-gray-700' : 'text-gray-400 line-through decoration-red-400 decoration-1'}
                          dangerouslySetInnerHTML={{ __html: feature.text }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-center mt-6 space-x-6">
                <div className="text-3xl font-bold flex flex-col space-x-2">
                  <span>Rs {plan.price?.toLocaleString()}</span>
                  <div className="font-poppins text-sm text-gray-500 font-normal">(GST EXC)</div>
                </div>

                {isLoggedIn ? (
                  <RazorpayButton 
                    amount={Math.round(plan.price * 1.18)*100}
                    plan_id={plan.id} // Send plan_id
                    // productDetails={{
                    //   id: plan.id,
                    //   title: plan.title,
                    //   price: plan.price
                    // }}
                    onSuccess={(response) => {
                      alert('Payment successful!');
                      navigate('/vendor-desh/profile');
                    }}
                    onError={(error) => {
                      console.error('Payment failed:', error);
                      alert('Payment failed: ' + error.message);
                    }}
                    className="bg-[#4A00FF] hover:bg-blue-600 text-white py-3 px-6 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    buttonText="Buy Now"
                    loadingText="Processing..."
                  />
                ) : (
                  <button
                    className="bg-[#4A00FF] hover:bg-blue-600 text-white py-3 px-6 rounded-full text-sm font-medium transition-colors duration-200"
                    onClick={() => handlePurchase(plan)}
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-red-50 p-6 rounded-full text-center mb-12">
          <h1 className='font-poppins font-semibold text-xl'> Best Suited for</h1>
          <p className="font-poppins text-lg text-gray-800">
            Studio and Event Company Makes the video and resale it according to their client Need.
          </p>
        </div>

        <div className="text-center mb-12">
          <h2 className="font-poppins text-2xl font-bold text-gray-900 mb-4">
            Benefits to Buy Pro Plan
          </h2>
          <p className="text-gray-600 mb-6 font-poppins">
            To enjoy all the features of Urban Tyohar with create video faster
          </p>
          <div className="p-4 rounded-lg overflow-hidden">
            <div className="relative" style={{ paddingBottom: '56.25%', height: '150px', overflow: 'hidden' }}>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/H6PnMsPgqS8?si=saHUfLRSk96uAPWx"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video"
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            We're here to help!
          </h2>
          <p className="text-gray-600 mb-6 font-poppins">
            Choosing the right plan can be a big decision, and we want <br /> to make sure you find the one that fits your needs best.
          </p>
          <div className="flex justify-center space-x-10">
            <div className="flex flex-col items-center cursor-pointer" 
              onClick={() => window.location.href = 'mailto:support@urbantyohar.com'}
            >
              <img src={Mail} alt="Mail" className="w-14 h-13 mb-3" />
              <span className="text-gray-600 text-lg hover:text-blue-600 transition-colors">Mail</span>
            </div>

            <div 
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200" 
              onClick={() => window.location.href = 'https://wa.me/9891715977'}
            >
              <img src={wp} alt="Chat" className="w-14 h-13 mb-3" />
              <span className="text-gray-600 text-lg hover:text-green-600 transition-colors">Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendorplan;