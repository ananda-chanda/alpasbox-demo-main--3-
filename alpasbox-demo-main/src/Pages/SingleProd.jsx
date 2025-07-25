import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../rtk/cartSlice';
import { fetchWishlist,toggleWishlist } from '../rtk/wishlistSlice';
// import CardLogo from '../assets/border_1.png'; 
import Process from '../assets/how_make/video_process.png';
import Utlogo from '../assets/Navbar/Logo.png';
// import Discount from '../Pages/PerCalculate.jsx';
import moreinfo from '../assets/MainCata/more-info.png';
import { Heart } from 'lucide-react';
import { Loader } from 'lucide-react';
import Youtube from '../assets/footer/YouTube.png';
import Facebook from '../assets/footer/Facebook.png';
import Instagram from '../assets/footer/Instagram.png';
import Printest from '../assets/footer/Printest.png';
// import PhonePePaymentButton from '../phonepay/Phonepe';
import RazorpayButton from '../razorpay/RazorpayButton';
// import phonepay from '../phonepay/Payment.jsx';
import { Helmet } from 'react-helmet-async';
import Available from './Available'

const SingleProd = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productId = params.get('id');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist.items) || [];


  const socialMediaLinks = [
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@urbantyohar',
      image: Youtube
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/urbantyohar',
      image: Facebook
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/urbantyohar/',
      image: Instagram
    },
    {
      name: 'Pinterest',
      url: 'https://in.pinterest.com/urbantyohar/',
      image: Printest
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productDetails, setProductDetails] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("Default");
  // const [selectedSide, setSelectedSide] = useState("no");
  // const [basePrice, setBasePrice] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedSide, setSelectedSide] = useState("no");
  const [selectedOtherLanguage, setSelectedOtherLanguage] = useState('');
  const [loadingStates, setLoadingStates] = useState({});

 



  const languages = [
    { value: 'hindi', label: 'Hindi' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'odia', label: 'Odia' },
    { value: 'marathi', label: 'Marathi' },
    { value: 'tamil', label: 'Tamil' },
   {value:'gujarathi',label:'Gujarathi'},
   {value:'malayalam',label:'Malayalam'},
   {value:'kannada',label:'kannada'},
  ];



  const offerPrice = selectedSide === "bride" || selectedSide === "groom" ? 999 : 0;

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // Scrolls to the top of the page
  };


  const mainVideoRef = useRef(null);

  const languagePrices = {
    Default: 0,
    other: 999,
  };

  
  const userToken = localStorage.getItem('user_token'); 

  
  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const response = await axios.post("https://admin.urbantyohar.com/api/whatsapp");
        setPhoneNumber(response.data.phoneNumber || "+919891715977"); // Fallback to default if not provided
      } catch (error) {
        console.error("Error fetching phone number:", error);
      }
    };

    fetchPhoneNumber();
  }, []);

  const generateWhatsAppLink = (phone, productDetails) => {
    // const { productTitle, productCode, price } = productDetails;

    const defaultMessage = `
Hello,

I am interested in purchasing the following product:

Product Title: ${productDetails.title}
Product Code: ${productDetails.code}
Product Price: ${productDetails.offer_dis}
GST (18%): ${Math.round(calculateTotalPrice() * 0.18)}
Total Price: ${Math.round(calculateTotalPrice() + (calculateTotalPrice() * 0.18))}
Language: ${selectedLanguage === 'other' ? selectedOtherLanguage : selectedLanguage}

Please provide the necessary details regarding payment, delivery options, and any other relevant information.

Looking forward to your response.

Thank you.
    `;
    const encodedMessage = encodeURIComponent(defaultMessage);
    return `https://api.whatsapp.com/send/?phone=${encodeURIComponent(phone)}&text=${encodedMessage}&type=phone_number&app_absent=0`;
  };

  // Button click handler
  const handleClick = () => {
    const whatsappLink = generateWhatsAppLink(phoneNumber, productDetails);
    window.open(whatsappLink, "_blank"); // Opens WhatsApp link in a new tab
  };

  const calculateDiscount = () => {
    const discountPercentage = ((productDetails.price - productDetails.offer_dis) / productDetails.price) * 100;
    return (
      discountPercentage.toFixed()
    );
  };
  // Calculate Total Price
  const calculateTotalPrice = () => {
    return productDetails.offer_dis + languagePrices[selectedLanguage] + offerPrice  ;
  };

// for description 
// Add this useEffect in your component
useEffect(() => {
  const handleResize = () => {
    // On mobile screens (less than 768px), collapse the description
    if (window.innerWidth < 768) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };
  
  // Set initial state based on screen size
  handleResize();
  
  // Add event listener for window resize
  window.addEventListener('resize', handleResize);
  
  // Clean up event listener on component unmount
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// for hide button

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId) {
        try {
          const response = await axios.post(
            `https://admin.urbantyohar.com/api/single-product?id=${productId}`
          );
          const data = response.data?.data;

          if (data) {
            setProductDetails(data);
            setSelectedVideo(data);
            fetchRelatedVideos(data.subcategory_id);
            // fetchlanguageforvideo(data.language);
          } else {
            throw new Error('Invalid product data');
          }
        } catch (err) {
          setError('Failed to load product details. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };
    const fetchRelatedVideos = async (subcategoryId) => {
      try {
        const response = await axios.post(
          `https://admin.urbantyohar.com/api/related-products?subcategory_id=${subcategoryId}&page=1`
        );
        const relatedProducts = response.data?.relatedproducts?.data || [];
        setRelatedVideos(relatedProducts);
      } catch (err) {
        console.error('Failed to fetch related videos:', err);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleRelatedVideoClick = (video) => {
    setSelectedVideo(video);
    mainVideoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleAddToCart = () => {
    dispatch(addToCart(productDetails));
    navigate('/cart-item'); // Replace with the actual path to your cart section
  };
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white  font-sans px-2  md:px-16 py-4 max-w-full mx-auto">

<Helmet>
  <title>{productDetails.short_title ? `${productDetails.short_title} - Urban Tyohar` : 'Wedding Invitation Video'}</title>
  <meta 
    name="description" 
    content={productDetails.short_desc
      ? productDetails.short_desc 
      : 'A beautiful wedding invitation video.'} 
  />
</Helmet>

      <div className="bg-white font-sans p-2 lg:p-4 min-w-full mx-auto mt-4 lg:mt-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[3.5fr_0.75fr_1.25fr]  gap-6 py-7">
          {/* Main Video or Card Section */}
          <div
            className="md:col-span-2 bg-white p-2 lg:p-4 md:p-8 rounded-lg border-2 border-yellow-500 w-full"
            ref={mainVideoRef}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0 md:gap-0 ">
              {/* Conditional Rendering for Video or Card */}
              <div className="w-full mt-0" style={{ minHeight: "420px" }}>
  {selectedVideo && selectedVideo.video ? (
    <div className="rounded-lg overflow-hidden" style={{ maxWidth: "960px", marginTop: "0" }}>
      <video
        src={`https://admin.urbantyohar.com/${selectedVideo.video}`}
        controls
        controlsList="nodownload"
        playsInline
        className="w-full h-full object-contain"
        style={{ minHeight: "420px" }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  ) : productDetails ? (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg relative">
      {productDetails?.preview_image ? (
        <>
          <img
            src={`https://admin.urbantyohar.com/${JSON.parse(
              productDetails.preview_image
            )[currentImageIndex].replace(/\\/g, "/")}`}
            alt="Product"
            className="w-full h-120 md:h-125 object-cover rounded-lg"
          />
          {/* Navigation Arrows */}
          <button
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === 0
                  ? JSON.parse(productDetails.preview_image).length - 1
                  : prev - 1
              )
            }
            className="absolute left-2 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 md:p-2 hover:bg-white"
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === JSON.parse(productDetails.preview_image).length - 1
                  ? 0
                  : prev + 1
              )
            }
            className="absolute right-2 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-1 md:p-2 hover:bg-white"
          >
            <svg
              className="w-4 h-4 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          {/* Thumbnail Slider */}
          <div className="flex space-x-2 md:space-x-4 mt-4 overflow-x-auto pb-4">
            {JSON.parse(productDetails.preview_image).map((image, index) => (
              <img
                key={index}
                src={`https://admin.urbantyohar.com/${image.replace(/\\/g, "/")}`}
                alt={`Thumbnail ${index}`}
                className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer ${
                  currentImageIndex === index ? "border-4 border-blue-500" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">No image available</p>
      )}
    </div>
  ) : (
    <p className="text-gray-500 text-center">No video or product details available</p>
  )}
</div>

              {/* Card Details Section */}
              <div className="bg-white p-4 md:p-6 md:pt-0 rounded-lg space-y-2 ">
                {productDetails && (
                  <>
                    <h2 className="text-xl md:text-2xl font-poppins text-gray-800 line-clamp-2">
                      {productDetails?.title}
                    </h2>
                    <div className="py-2 md:py-2">
                      <p className="text-black-600 font-poppins font-light line-clamp-2">{productDetails?.short_desc}</p>
                    </div>
                    <div className="border-b border-gray-200 pb-2 md:pb-4 flex items-center px-4 pl-2  space-x-2 md:space-x-4">
                      <p className="text-lg md:text-xl font-bold text-gray-600 line-through">
                      ₹ {productDetails?.price}
                      </p>
                      <p className="text-lg md:text-xl font-bold text-black-800">
                      ₹ {productDetails?.offer_dis}
                      </p>
                      <p className="text-center font-regular bg-[#4A00FF] text-white py-1 rounded-full px-3 w-fit mx-auto">
              {calculateDiscount()
                ? `${calculateDiscount()}% OFF`
                : 'No Discount Available'}
            </p>
                    </div>
                    {productDetails?.features && (
                      <div className="space-y-1 md:space-y-2">
                        <h3 className="font-semibold text-gray-800">Features:</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {productDetails.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
                {/* Add Form Data Section */}

                <div className="mt-4 space-y-2 px-4 md:px-8">
                  <h3 className="font-semibold">Additional Language</h3>

                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-16">
                    <div className="flex items-center">
                      <input
                        id="Default"
                        name="language"
                        type="radio"
                        value="Default"
                        className="mr-2"
                        checked={selectedLanguage === "Default"}
                        onChange={() => setSelectedLanguage("Default")}
                      />
                      <label htmlFor="Default">Default (₹ 0)</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="other"
                        name="language"
                        type="radio"
                        value="other"
                        className="mr-2"
                        checked={selectedLanguage === "other"}
                        onChange={() => setSelectedLanguage("other")}
                      />
                      <label htmlFor="other">Other (₹ 999.00)</label>
                    </div>
                    {selectedLanguage === 'other' && (
                    <select
                      value={selectedOtherLanguage}
                      onChange={(e) => setSelectedOtherLanguage(e.target.value)}
                      className="ml-4 p-2 border rounded-md font-poppins"
                    >
                      <option value="">Select Language</option>
                      {languages.map((language) => (
                        <option key={language.value} value={language.value}>
                          {language.label}
                        </option>
                      ))}
                    </select>
                  )}
                  </div>
                    
                
                   {(productDetails.category_name === 'Wedding' || productDetails.category_name === 'Wedding Rituals') && (
                    <div>
                      <h3 className="font-semibold">
                        *Offer: For 2nd Version video (₹ 999.00)
                      </h3>
                      <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-16">
                        <div className="flex items-center">
                          <input
                            id="bride"
                            name="side"
                            type="radio"
                            value="bride"
                            className="mr-2"
                            checked={selectedSide === "bride"}
                            onChange={() => setSelectedSide("bride")}
                          />
                          <label htmlFor="bride">Bride Side</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="groom"
                            name="side"
                            type="radio"
                            value="groom"
                            className="mr-2"
                            checked={selectedSide === "groom"}
                            onChange={() => setSelectedSide("groom")}
                          />
                          <label htmlFor="groom">Groom Side</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="no"
                            name="side"
                            type="radio"
                            value="no"
                            className="mr-2"
                            checked={selectedSide === "no"}
                            onChange={() => setSelectedSide("no")}
                          />
                          <label htmlFor="no">No</label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-100 shadow-md p-4 rounded-lg">
                  <div className="flex justify-between mb-2 border-b border-gray-400 pb-2">
    <span>Product Price:</span>
    <span>₹{productDetails.offer_dis}</span>
  </div>
  <div className="flex justify-between mb-2 border-b border-gray-400 pb-2">
    <span>Options Price:</span>
    <span>₹{languagePrices[selectedLanguage] + offerPrice}</span>
  </div>
 
  <div className="flex justify-between mb-2 border-b border-gray-400 pb-2">
    <span>SubTotal:</span>
    <span>₹{calculateTotalPrice()}</span>
  </div>

  <div className="flex justify-between mb-1 border-b border-gray-400 pb-2">
    <span>GST (18%):</span>
    <span>₹{Math.round(calculateTotalPrice() * 0.18)}</span>
  </div>
  <div className='flex justify-between font-bold mb-1 border-b border-gray-400 pb-2'>
    <span>Total:</span>
    <span>₹{Math.round(calculateTotalPrice() + (calculateTotalPrice() * 0.18))}</span>
  </div>
</div>

                  <div>
                    <p className='font-Light'>Product: {productDetails.product_type}</p>
                    <p className='font-Light'>Code: {productDetails.code}</p>
                  </div>
                     {/* <div className=' flex h-12 w-120'>
        <Available />
      </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Order Section */}
          <div className="bg-gray-50 p-4 md:px-2 rounded-lg shadow-md space-y-6 border-2 border-yellow-500 w-full pt-16">
            {/* <p className="text-center font-regular bg-blue-500 text-white p-2 rounded-full px-3 w-fit mx-auto">
              {calculateDiscount()
                ? `${calculateDiscount()}% OFF`
                : 'No Discount Available'}
            </p> */}
           
           <div className='flex justify-center items-center font-bold text-2xl'>
  <span>Total:</span>
  <span className='mx-2'>₹{Math.round(calculateTotalPrice() + (calculateTotalPrice() * 0.18))}</span>
  <span className='font-poppins font-light text-sm mt-2'>(GST INC)</span>
</div>
           

<button
  className="w-full py-3 border-2 border-red-500 text-red-500 rounded-full font-poppins font-regular hover:bg-red-50 transition-colors"
  onClick={() => {
    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/login');
      return;
    }
    handleAddToCart();
  }}
>
  Add to Cart
</button>
            {/* <button 
      className="w-full py-3 bg-red-500 text-white rounded-full font-poppins font-regular hover:bg-red-600 transition-colors"
        onClick={() => {
    navigate('/contact-deli')}}
    >
      Buy it now
    </button> */}
    {/* <PhonePePaymentButton amount={calculateTotalPrice()}/> */}
<div className='flex justify-center items-center '>
  {userToken ? (
    <button 
      className="w-full py-3 bg-[#4A00FF] text-white rounded-full font-poppins font-regular hover:bg-blue-600 transition-colors"
      onClick={() => {
        // Store product and price information in localStorage for the billing page
        localStorage.setItem('checkoutInfo', JSON.stringify({
          productId: productDetails.id,
          productTitle: productDetails.title,
          productCode: productDetails.code,
          basePrice: productDetails.offer_dis,
          languagePrice: languagePrices[selectedLanguage],
          offerPrice: offerPrice,
          selectedLanguage: selectedLanguage === 'other' ? selectedOtherLanguage : selectedLanguage,
          subtotal: calculateTotalPrice(),
          gst: Math.round(calculateTotalPrice() * 0.18),
          total: Math.round(calculateTotalPrice() * 1.18)
        }));
        
        // Navigate to billing page
        navigate('/bills');
      }}
    >
      Buy it now
    </button>
  ) : (
    <button
      className="w-full py-3 bg-[#4A00FF] text-white rounded-full font-poppins font-regular hover:bg-blue-600 transition-colors"
      onClick={() => navigate('/login')}
    >
      Buy it now
    </button>
  )}
</div>
 
            <p className=' font-poppins font-Light'>If you have any special Need then contact on whatsapp with our team</p>
            <button
              onClick={handleClick}
              className="w-full py-3 px-3 bg-green-500 text-white rounded-full font-poppins font-regular hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
              disabled={!phoneNumber} // Disable button until phone number is loaded
            >
              <i className="fab fa-whatsapp mr-2 font-regular"></i>
              {phoneNumber ? "Order on WhatsApp" : "Loading..."}
            </button>
            <div>
              <div className="flex space-x-4 mt-4">
                <span className="font-poppins font-Light">Share:</span>
                {socialMediaLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    aria-label={link.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black-300 hover:text-blue-400 transition duration-300"
                  >
                    <img
                      src={link.image} // Image linked to the social media platform
                      alt={link.name}
                      className="w-6 h-6 object-cover" // You can adjust the size as needed
                    />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <img src={Utlogo} alt="Urban Tyohar" className="mt-10 w-24 mx-auto" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <Available />
      </div>
      {/* Description Section */}
      <div className="mt-4 lg:mt-8">
  <div className="bg-white text-gray-800 p-6">
    <div className="mx-auto">
      <div className="flex items-center mb-4">
        <button
          onClick={toggleVisibility}
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          {isVisible ? (
            <Eye className="mr-2 h-5 w-5" />
          ) : (
            <EyeOff className="mr-2 h-5 w-5" />
          )}
          <h2 className="text-lg font-bold">Description</h2>
        </button>
      </div>
      <h1 className="text-xl md:text-2xl font-poppins text-gray-800">{productDetails.title}</h1>
      {isVisible && (
        <div
          className="transition-all duration-300 font-poppins prose prose-strong:text-2xl prose-strong:font-poppins prose-strong:text-red-900 custom-prose"
          dangerouslySetInnerHTML={{ __html: productDetails.desc }}
        ></div>
      )}
    </div>
  </div>
</div>

<style jsx>{`
  .custom-prose h1 {
    color: gray-800; /* Tailwind blue-800 */
    font-size: 2rem; /* Tailwind text-2xl */
    font-weight: medium;
  }

  .custom-prose h2 {
    color: gray-800; /* Tailwind blue-600 */
    font-size: 1.5rem; /* Tailwind text-xl */
    font-weight: medium;
  }

  .custom-prose h3 {
    color: gray-800; /* Tailwind blue-500 */
    font-size: 1.5rem; /* Tailwind text-lg */
    font-weight: medium;
  }
`}</style>


      <div className="bg-white flex flex-col items-center justify-center h-auto">
        {/* Header Section */}
        <header className="text-center">
          <h1 className="bg-blue-600 text-white text-lg md:text-2xl font-bold py-2 px-6 rounded">
            Process to Make an Invitation?
          </h1>
        </header>

        {/* Image Section */}
        <div className="flex items-center justify-center">
          <img
            src={Process}
            alt="How to Make Process"
            className="w-[1000px] h-[200px] object-contain"
          />
        </div>
      </div>
      {/* Related Videos Section */}
      <div className="mt-1 px-4 lg:px-4 sm:px-6">
  <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
    Recommended Products
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {relatedVideos.map((video) => (
      <Link
        key={video.id}
        to={`/invitation-Videos?id=${video.id}/${video.url_name ? video.url_name.replace(/\s+/g, '-') : ''}`}
        className="rounded-lg p-3 px-4 bg-white mx-auto group border-2 border-yellow-200"
        onClick={() => window.scrollTo(0, 0)}
      >
        <div className="relative">
          <div className="relative">
            <img
              src={
                video.video_thumbnail
                  ? `https://admin.urbantyohar.com/${video.video_thumbnail}`
                  : 'https://via.placeholder.com/150?text=No+Thumbnail'
              }
              alt={video.title}
              className="w-full h-fit rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <PlayCircle className="w-12 h-12 text-white" />
            </div>
            <div 
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const userToken = localStorage.getItem('user_token');
                if (!userToken) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  navigate('/login');
                  return;
                }
                setLoadingStates((prev) => ({ ...prev, [video.id]: true }));
                dispatch(toggleWishlist(video))
                  .unwrap()
                  .catch((error) => {
                    console.error('Error toggling wishlist:', error);
                  })
                  .finally(() => {
                    setLoadingStates((prev) => ({ ...prev, [video.id]: false }));
                  });
              }}
            >
              {loadingStates[video.id] ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Heart
                  className={`w-6 h-6 transition-colors duration-300 cursor-pointer ${
                    favoriteItems.some((item) => item.id === video.id)
                      ? 'text-red-500 fill-current'
                      : 'text-red-500'
                  }`}
                />
              )}
            </div>
          </div>
          <div className="absolute top-1 left-1 bg-[#4A00FF] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {Math.round((1 - video.offer_dis / video.price) * 100)}% OFF
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-base font-poppins text-gray-800 line-clamp-2">
            {video.title}
          </h3>
          <p className="text-xs text-blue-500 truncate">Code: {video.code}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-lg font-bold">₹{video.offer_dis}</p>
            <img
              src={moreinfo}
              alt="More Info"
              className="cursor-pointer transition-opacity duration-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.scrollTo(0, 0);
              }}
              style={{ maxWidth: '100px', maxHeight: '80px' }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cost ₹<span className="line-through">{video.price}</span> (
            {Math.round((1 - video.offer_dis / video.price) * 100)}% off)
          </p>
        </div>
      </Link>
    ))}
  </div>
</div>
    
    {/* Add this at the very end of your return statement, right before the final closing div */}
  {/* Mobile fixed buttons - shown only on mobile screens */}
{/* Mobile fixed buttons - shown only on mobile screens */}
<div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-200 shadow-lg border-t border-gray-200 p-2 z-40">
  <div className="flex items-center justify-between px-2">
    <div className="w-1/4 pl-3">
      <span className="font-bold text-lg">₹{Math.round(calculateTotalPrice() + (calculateTotalPrice() * 0.18))}</span>
      <div className="text-xs text-gray-600">
        <span className="line-through">₹{productDetails?.price}</span>
        {/* <span className="ml-1 text-red-500">{calculateDiscount()}% OFF</span> */}
      </div>
    </div>
    
  <div className="flex space-x-2 w-2/3">
      {userToken ? (
        <button 
          className="flex-1 py-2 bg-[#4A00FF] text-white rounded-lg font-poppins font-regular hover:bg-blue-600 transition-colors text-sm"
          onClick={() => {
            // Store product and price information in localStorage for the billing page
            localStorage.setItem('checkoutInfo', JSON.stringify({
              productId: productDetails.id,
              productTitle: productDetails.title,
              productCode: productDetails.code,
              basePrice: productDetails.offer_dis,
              languagePrice: languagePrices[selectedLanguage],
              offerPrice: offerPrice,
              selectedLanguage: selectedLanguage === 'other' ? selectedOtherLanguage : selectedLanguage,
              subtotal: calculateTotalPrice(),
              gst: Math.round(calculateTotalPrice() * 0.18),
              total: Math.round(calculateTotalPrice() * 1.18)
            }));
            
            // Navigate to billing page
            navigate('/bills');
          }}
        >
          Buy Now
        </button>
      ) : (
        <button
          className="flex-1 py-2 bg-[#4A00FF] text-white rounded-lg font-poppins font-regular hover:bg-blue-600 transition-colors text-sm"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate('/login');
          }}
        >
          Buy Now
        </button>
      )}
      <button
        onClick={handleClick}
        className="flex-1 py-1 bg-[#00d748] text-white rounded-lg font-poppins font-regular hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
        disabled={!phoneNumber}
      >
        <i className="fab fa-whatsapp mr-1 text-xs"></i>
        Order on WhatsApp
      </button>
    </div>
  </div>
</div>
    
    {/* Add padding at the bottom to prevent content from being hidden under the fixed bar */}
    <div className="md:hidden h-20 mb-8"></div></div>
  );
};
export default SingleProd;