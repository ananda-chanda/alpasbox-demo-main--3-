import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
// import { PlayCircle } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../rtk/cartSlice';
// import CardLogo from '../assets/border_1.png'; 
import Process from '../assets/how_make/card_process.png';
import Utlogo from '../assets/Navbar/Logo.png';
// import Discount from '../Pages/PerCalculate.jsx';
import moreinfo from '../assets/MainCata/more-info.png';
import { Heart } from 'lucide-react';
import Youtube from '../assets/footer/YouTube.png';
import Facebook from '../assets/footer/Facebook.png';
import Instagram from '../assets/footer/Instagram.png';
import Printest from '../assets/footer/Printest.png';
import RazorpayButton from '../razorpay/RazorpayButton';
// import B from '@/dist/assets/SubcategoryPage-HdgZHLwh';
import { Helmet } from 'react-helmet-async';
import Available from './Available'
import { motion } from 'framer-motion'; 

const SingleProd = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productId = params.get('id');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
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
  // const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [selectedSide, setSelectedSide] = useState("no");
  // const [basePrice, setBasePrice] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState('soft-copy');
  const [otherLanguage, setOtherLanguage] = useState("");
  const [direction, setDirection] = useState('right');


  const [isModalOpen, setIsModalOpen] = useState(false);

// Helper function to detect desktop
const isDesktop = () => window.innerWidth >= 1024;

  // useEffect(() => {
  //   if (productDetails?.per_card) {
  //     const parsedData = parsePerCardData(productDetails.per_card);
  //     if (parsedData.length > 0) {
  //       handleQuantityClick(parsedData[0].quantity, parsedData[0].per_price);
  //     } else {
  //       setSelectedQuantity(null);
  //       setSelectedPrice(0);
  //     }
  //   } else {
  //     setSelectedQuantity(null);
  //     setSelectedPrice(0);
  //   }
  // }, [productDetails]);
  
  
  
  // const handleQuantityClick = (quantity, per_price) => {
  //   setSelectedQuantity(quantity);
  //   setSelectedPrice(per_price);
  // };

  // Add this useEffect in your component

useEffect(() => {
  if (productDetails?.per_card) {
    const parsedData = parsePerCardData(productDetails.per_card);
    if (parsedData.length > 0) {
      handleQuantityClick(parsedData[0].quantity, parsedData[0].per_price);
    }
  }
}, [productDetails]);
  

  const handleQuantityClick = (quantity, per_price) => {
    setSelectedQuantity(quantity);
    setSelectedPrice(quantity === 'soft-copy' ? 0 : per_price);
  };
  const parsePerCardData = (perCardData) => {
    if (typeof perCardData === 'string') {
      try {
        return JSON.parse(perCardData);
      } catch (error) {
        console.error('Failed to parse per_card data:', error);
        return [];
      }
    }
    return perCardData;
  };

  // const values = [25, 50, 75, 100]; // Default minimum cart quantity


  <style>{`
  @keyframes slideLeft {
    0% { transform: translateX(0); }
    50% { transform: translateX(-8px); }
    100% { transform: translateX(0); }
  }
  @keyframes slideRight {
    0% { transform: translateX(0); }
    50% { transform: translateX(8px); }
    100% { transform: translateX(0); }
  }
`}</style>


  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // Scrolls to the top of the page
  };


  const mainVideoRef = useRef(null);

  const languagePrices = {
    english: 0,
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



    const languageDisplay = selectedLanguage === "english" 
    ? "English" 
    : `${otherLanguage.charAt(0).toUpperCase() + otherLanguage.slice(1)} (Additional Language)`;


    const defaultMessage = `
Hello,

I am interested in purchasing the following product:

Product Title: ${productDetails.title}
Product Code: ${productDetails.code}
Product Price: ${productDetails.offer_dis}

No. of card print: ${selectedQuantity}
Selected Language: ${languageDisplay}
Total Price: ₹${Math.round (calculateTotalPrice() + calculateTotalPrice()*0.18)}

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

 
  const handleCardChange = (newIndex) => {
    setCurrentImageIndex(newIndex);
  };
  
  // Calculate Total Price
  const calculateTotalPrice = () => {
    if (selectedQuantity === 'soft-copy') {
      return  languagePrices[selectedLanguage];
    }
    const basePrice = Number(selectedQuantity) * productDetails.offer_dis;
    return  languagePrices[selectedLanguage] + basePrice + productDetails.degine_price + productDetails.print_price;
  };
  // console.log("base price is",basePrice)

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
    <div className="bg-white font-sans px-2  md:px-16 py-4 max-w-full mx-auto">

      <Helmet>
        <title>{productDetails.short_title ? `${productDetails.short_title} - Urban Tyohar` : 'Wedding Invitation card'}</title>
        <meta 
          name="description" 
          content={productDetails.short_desc
            ? productDetails.short_desc 
            : 'A beautiful wedding invitation Card.'} 
        />
      </Helmet>

      <div className="bg-white font-sans p-0 lg:p-4 min-w-full mx-auto mt-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-[3.5fr_0.75fr_1.25fr]  gap-6 py-7">
          {/* Main Video or Card Section */}
          <div
            className="md:col-span-2 bg-white px-1 py-4 md:p-8 rounded-lg border-2 border-yellow-500 w-full"
            ref={mainVideoRef}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_2fr] gap-4 md:gap-4">
              {/* Conditional Rendering for Video or Card */}
<div className="w-full" style={{ minHeight: "300px" }}>
  {selectedVideo && selectedVideo.video ? (
    <video
      src={`https://admin.urbantyohar.com/${selectedVideo.video}`}
      controls
      className="rounded-lg shadow-lg w-full h-full object-contain cursor-pointer"
      style={{ minHeight: "300px" }}
      onClick={() => isDesktop() && setIsModalOpen(true)}
    >
      Your browser does not support the video tag.
    </video>
  ) : productDetails ? (
    <div className="bg-white p-0 md:p-2 rounded-lg shadow-lg relative">
      {productDetails?.preview_image ? (
        <>
          <motion.div 
            className="image-container relative" 
            style={{ height: "450px", width: "100%" }}
          >
            {JSON.parse(productDetails.preview_image)[currentImageIndex].endsWith('.mp4') ? (
              <motion.video
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={`https://admin.urbantyohar.com/${JSON.parse(productDetails.preview_image)[currentImageIndex].replace(/\\/g, "/")}`}
                controls
                className="rounded-lg shadow-lg w-full h-full object-contain cursor-pointer"
                style={{ height: "100%" }}
                onClick={() => isDesktop() && setIsModalOpen(true)}
              >
                Your browser does not support the video tag.
              </motion.video>
            ) : (
              <motion.img
                key={`image-${currentImageIndex}`}
                custom={direction}
                initial={(direction) => ({ 
                  opacity: 0, 
                  x: direction === 'left' ? -20 : 20 
                })}
                animate={{ opacity: 1, x: 0 }}
                exit={(direction) => ({ 
                  opacity: 0, 
                  x: direction === 'left' ? 20 : -20 
                })}
                transition={{ duration: 0.3 }}
                src={`https://admin.urbantyohar.com/${JSON.parse(productDetails.preview_image)[currentImageIndex].replace(/\\/g, "/")}`}
                alt="Product"
                className="w-full h-full object-cover md:object-cover rounded-lg cursor-pointer"
                onClick={() => isDesktop() && setIsModalOpen(true)}
              />
            )}

            {/* Navigation Arrows - Moved inside the container with absolute positioning */}
            <div className="absolute left-2 md:left-1 top-1/2 transform -translate-y-1/2 z-10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
                onClick={() => {
                  setDirection('left');
                  setCurrentImageIndex((prev) =>
                    prev === 0
                      ? JSON.parse(productDetails.preview_image).length - 1
                      : prev - 1
                  );
                }}
                className="bg-white/80 rounded-full p-1 md:p-2 hover:bg-white flex items-center justify-center"
                style={{ width: "32px", height: "32px" }}
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
              </motion.button>
            </div>
            
            <div className="absolute right-2 md:right-1 top-1/2 transform -translate-y-1/2 z-10">
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
                onClick={() => {
                  setDirection('right');
                  setCurrentImageIndex((prev) =>
                    prev === JSON.parse(productDetails.preview_image).length - 1
                      ? 0
                      : prev + 1
                  );
                }}
                className="bg-white/80 rounded-full p-1 md:p-2 hover:bg-white flex items-center justify-center"
                style={{ width: "32px", height: "32px" }}
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
              </motion.button>
            </div>
          </motion.div>
          
          {/* Thumbnail Slider */}
          <div className="flex space-x-2 md:space-x-4 mt-4 overflow-x-auto pb-4">
            {JSON.parse(productDetails.preview_image).map((file, index) => (
              <motion.div 
                key={index} 
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {file.endsWith('.mp4') ? (
                  <video
                    src={`https://admin.urbantyohar.com/${file.replace(/\\/g, "/")}`}
                    className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer ${
                      currentImageIndex === index ? "border-4 border-blue-500" : ""
                    }`}
                    onClick={() => {
                      setDirection(index > currentImageIndex ? 'right' : 'left');
                      setCurrentImageIndex(index);
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={`https://admin.urbantyohar.com/${file.replace(/\\/g, "/")}`}
                    alt={`Thumbnail ${index}`}
                    className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer ${
                      currentImageIndex === index ? "border-4 border-blue-500" : ""
                    }`}
                    onClick={() => {
                      setDirection(index > currentImageIndex ? 'right' : 'left');
                      setCurrentImageIndex(index);
                    }}
                  />
                )}
                {file.endsWith('.mp4') && (
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <svg 
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path 
                        d="M8 5v10l7-5-7-5z"
                        fillRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
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

  {/* Fullscreen Modal (only shown on desktop) */}
  {isModalOpen && isDesktop() && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={() => setIsModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="max-w-5xl w-full mx-auto p-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          {/* Modal content */}
          {selectedVideo && selectedVideo.video ? (
            <video
              src={`https://admin.urbantyohar.com/${selectedVideo.video}`}
              controls
              className="w-full h-auto max-h-[80vh] rounded-lg object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : productDetails?.preview_image ? (
            <>
              {JSON.parse(productDetails.preview_image)[currentImageIndex].endsWith('.mp4') ? (
                <video
                  src={`https://admin.urbantyohar.com/${JSON.parse(productDetails.preview_image)[currentImageIndex].replace(/\\/g, "/")}`}
                  controls
                  className="w-full h-auto max-h-[80vh] rounded-lg object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={`https://admin.urbantyohar.com/${JSON.parse(productDetails.preview_image)[currentImageIndex].replace(/\\/g, "/")}`}
                  alt="Product"
                  className="w-full h-auto max-h-[80vh] rounded-lg object-contain mx-auto"
                />
              )}
              
              {/* Modal Navigation Controls */}
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full flex items-center justify-center"
                  style={{ width: "40px", height: "40px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection('left');
                    setCurrentImageIndex((prev) =>
                      prev === 0
                        ? JSON.parse(productDetails.preview_image).length - 1
                        : prev - 1
                    );
                  }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
              </div>
              
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full flex items-center justify-center"
                  style={{ width: "40px", height: "40px" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection('right');
                    setCurrentImageIndex((prev) =>
                      prev === JSON.parse(productDetails.preview_image).length - 1
                        ? 0
                        : prev + 1
                    );
                  }}
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </>
          ) : null}
          
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2"
            onClick={() => setIsModalOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )}
</div>

              {/* Card Details Section */}
              <div className="bg-white p-4 md:p-6 rounded-lg space-y-4">
                {productDetails && (
                  <>
                    <h2 className=" font-poppins text-xl md:text-2xl font-regular text-gray-800">
                      {productDetails?.title}
                    </h2>
                    <div className="py-2 md:py-4">
                      <p className="text-black-600 font-light font-poppins">{productDetails?.short_desc}</p>
                    </div>
                    <div className="border-b border-gray-200 pb-2 md:pb-4 flex items-center space-x-2 md:space-x-4">
                      {/* <p className="text-lg md:text-xl font-bold text-gray-600 line-through">
                        RS {productDetails?.price}
                      </p> */}
{/* <div className="flex justify-center items-center mb-0 mt-6 ">
  {productDetails.per_card && productDetails.per_card !== '[]' ? (
    <p className="text-xl font-bold text-gray-800">
      ₹{(() => {
        try {
          // const pricing = JSON.parse(productDetails.per_card);
          return pricing.length > 0 ? productDetails.per_card[0].per_price : "";
        } catch (e) {
          return productDetails.per_card[0].per_price;
        }
      })()}
      <span className="text-sm font-Regular">(Each Card)</span>
    </p>
  ) : (
    <p className="text-xl font-bold text-gray-800">Starting from ₹{productDetails.offer_dis}</p>
  )}
</div> */}
<div className="flex items-center mb-0 mt-0 text-2xl font-poppins">
  <div className="font-semibold text-gray-800">Per Card Cost: </div>
  <div className="ml-2 flex items-center">
    <span className="text-gray-500 line-through text-lg mr-2">₹{productDetails.price}</span>
    <span className="text-black font-semibold">₹{productDetails.offer_dis}</span>
  </div>
</div>

                     
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
                <div className="mt-4 space-y-4 px-0">
                  {/* <h3 className="font-semibold">Additional Language</h3>
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-16">
                    <div className="flex items-center">
                      <input
                        id="english"
                        name="language"
                        type="radio"
                        value="english"
                        className="mr-2"
                        checked={selectedLanguage === "english"}
                        onChange={() => setSelectedLanguage("english")}
                      />
                      <label htmlFor="english">Default (₹ 0)</label>
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
                  </div> */}
                  {/* <h3>NO. OF PIECES</h3>
                  <div>
                  <div className="flex justify-between w-52 mx-auto mt-5">
      {productDetails.per_card.map((value, index) => (
        <div
          key={index}
          className="w-10 h-10 flex items-center justify-center border border-black"
        >
          {value.quantity}
        </div>
      ))}
    </div>
                  </div> */}
{/* 
<div>
      <h3>NO. OF PIECES:  {selectedQuantity}</h3>
      <div>
        {productDetails && productDetails.per_card ? (
          <div className="flex justify-between w-52 mx-auto mt-5">
            {parsePerCardData(productDetails.per_card).map((value, index) => (
              <div
                key={index}
                onClick={() => handleQuantityClick(value.quantity)}
                className={`w-10 h-10 flex items-center justify-center border cursor-pointer ${
                  selectedQuantity === value.quantity ? 'border-blue-500' : 'border-black'
                }`}
              >
                {value.quantity}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {selectedQuantity && (
        <div className="mt-2 text-center">
          Selected Quantity: {selectedQuantity}
        </div>
      )}
    </div> */}

    <div>
      {/* <p >{  `No.Of Quantity: ${selectedPrice}`}</p> */}
    </div>
<div>
  <h3 className=" font-poppins font-regular ">
     Quantity You Required: {selectedQuantity}
    {/* {selectedPrice > 0 && (
      <span className=" font-poppins text-sm font-normal text-gray-600 ml-2">
        (₹{selectedPrice} per piece)
      </span>
    )} */}
  </h3>
  <div className="relative w-full max-w-xs mt-3">
    <select
      value={selectedQuantity}
      onChange={(e) => {
        const selected = parsePerCardData(productDetails.per_card).find(
          item => item.quantity === e.target.value
        );
        if (selected) {
          handleQuantityClick(selected.quantity, selected.per_price);
        }
      }}
      className=" font-poppins block w-full px-4 py-2 pr-8 leading-tight bg-white border border-blue-500 rounded-lg appearance-none focus:outline-none focus:border-blue-500"
    >
      {productDetails && productDetails.per_card && 
        parsePerCardData(productDetails.per_card).map((value, index) => (
          <option key={index} value={value.quantity}>
            {value.quantity} Cards 
          </option>
        ))
      }
    </select>
       
    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
      </svg>
    </div>
  </div>
  {/* {selectedQuantity && ( 
    // <div className="mt-2 text-sm text-gray-600">
    //   Selected: {`${selectedQuantity} Cards`}
    // </div>
  )} */}
</div>


<h3 className=" font-poppins font-semibold">Additional Language</h3>
<div className="flex items-center space-x-6 font-poppins">
  <div className="flex items-center">
    <input
      id="english"
      name="language"
      type="radio"
      value="english"
      className="mr-2"
      checked={selectedLanguage === "english"}
      onChange={() => setSelectedLanguage("english")}
    />
    <label htmlFor="english">Default (₹ 0)</label>
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
  
  {selectedLanguage === "other" && (
    <div className="relative inline-block">
      <select 
        className="border border-yellow-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        value={otherLanguage}
        onChange={(e) => setOtherLanguage(e.target.value)}
      >
        <option value="">Select Language</option>
        <option value="hindi">Hindi</option>
        <option value="marathi">Marathi</option>
        <option value="gujarati">Gujarati</option>
        <option value="tamil">Tamil</option>
        <option value="telugu">Telugu</option>
        <option value="kannada">Kannada</option>
        <option value="bengali">Bengali</option>
        <option value="punjabi">Punjabi</option>
      </select>
    </div>
  )}
</div>



                  <div className="bg-gray-100 shadow-md p-4 rounded-lg">
                  <div className="flex justify-between mb-2 border-b border-gray-400 pb-2 font-poppins">
  <span>Card price:</span>
  <span>₹{selectedQuantity === 'soft-copy' ? 0 : Number(selectedQuantity) * productDetails.offer_dis}</span>
</div>
                  <div className="flex justify-between mb-2 border-b border-gray-400 pb-2 font-poppins">
                      <span>Design Price:</span>
                      <span>₹{productDetails.degine_price}</span>
                    </div>
                    <div className="flex justify-between mb-2 border-b border-gray-400 pb-2 font-poppins">
                      <span>Card Print Price:</span>
                      <span>₹{productDetails.print_price}</span>
                    </div>
  
                    <div className="flex justify-between mb-2 border-b border-gray-400 pb-2 font-poppins">
                      <span>Options Price:</span>
                      <span>₹{languagePrices[selectedLanguage]}</span>
                    </div>
                  
                    <div className="flex justify-between mb-2 border-b border-gray-400 pb-2 font-poppins">
                      <span>GST 18%:</span>
                      <span>₹{Math.round(calculateTotalPrice()*0.18)}</span>
                    </div>

                    <div className="flex justify-between font-bold font-poppins">
                      <span>Total:</span>
                      <span>₹{Math.round (calculateTotalPrice() + calculateTotalPrice()*0.18)}</span>
                      
                    </div>
                  </div>

                  <div>
                    <p className='font-Light'>Product: {productDetails.product_type}</p>
                    <p className='font-Light'>Code: {productDetails.code}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Section */}
          <div className="bg-gray-50 p-4 md:px-2 rounded-lg shadow-md space-y-6 border-2 border-yellow-500 w-full">
            <p className="text-center font-regular bg-blue-500 text-white p-2 rounded-full px-3 w-fit mx-auto">
              {calculateDiscount()
                ? `${calculateDiscount()}% OFF`
                : 'No Discount Available'}
            </p>
            <div className='flex justify-center items-center font-bold text-2xl'>
              <span>Total:</span>
              <span>₹{Math.round (calculateTotalPrice() + calculateTotalPrice()*0.18)}</span>
              <span className='text-sm mt-2 font-thin'> (GST INC)</span>
            </div>

            <button
  className="w-full py-3 border-2 border-red-500 text-red-500 rounded-full font-regular hover:bg-red-50 transition-colors"
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
            {/* <button className="w-full py-3 bg-red-500 text-white rounded-full font-regular hover:bg-red-600 transition-colors">
              Buy it now
            </button> */}
  <div className='flex justify-center items-center '>
  {userToken ? (
    <button 
      className="w-full py-3 bg-blue-500 text-white rounded-full font-poppins font-regular hover:bg-blue-600 transition-colors"
      onClick={() => {
        // Store product and price information in localStorage for the billing page
        localStorage.setItem('checkoutInfo', JSON.stringify({
          productId: productDetails.id,
          productTitle: productDetails.title,
          productCode: productDetails.code,
          basePrice: selectedQuantity === 'soft-copy' ? 0 : productDetails.offer_dis,
          languagePrice: languagePrices[selectedLanguage],
          offerPrice: productDetails.degine_price + productDetails.print_price,
          selectedLanguage: selectedLanguage === 'other' ? otherLanguage : selectedLanguage,
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
      className="w-full py-3 bg-blue-500 text-white rounded-full font-poppins font-regular hover:bg-blue-600 transition-colors"
      onClick={() => navigate('/login')}
    >
     Buy it now
    </button>
  )}
</div>
            <p className=' font-poppins font-Light'>If you have any special Need then contact on whatsapp with our team</p>
            <button
              onClick={handleClick}
              className="w-full py-3 px-3 bg-green-500 text-white rounded-full font-regular hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
              disabled={!phoneNumber} // Disable button until phone number is loaded
            >
              <i className="fab fa-whatsapp mr-2 font-regular"></i>
              {phoneNumber ? "Order on WhatsApp" : "Loading..."}
            </button>
            <div>
              <div className="flex space-x-4 mt-4">
                <span className="font-Light">Share:</span>
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
      <div className='mt-0'>
        <Available/>
      </div>
      {/* Description Section */}
      <div className="mt-8">
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
            <h1 className="text-3xl font-bold mb-4">{productDetails.title}</h1>
            {isVisible && (
              <div
                className="transition-all duration-300"
                dangerouslySetInnerHTML={{ __html: productDetails.desc }}
              ></div>

            )}
          </div>
        </div>
      </div>
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
      {/* Related card Section */}
      <div className="mt-1 px-4 lg:px-4 sm:px-6">
  <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
    Recommended Products
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {relatedVideos.map((cart) => (
      <div
        key={cart.id}
        className="rounded-lg p-3 px-4 bg-white mx-auto group border-2 border-yellow-200"
        onClick={() => handleNavigation(`/single-cart?id=${cart.id}/${cart.url_name ? cart.url_name.replace(/\s+/g, '-') : ''}`)}
        style={{ width: '100%', height: 'auto', maxHeight: '900px' }}  // Adjusted max height for each cart
      >
        <div className="relative" style={{ height: '500px' }}>  {/* Increased height for image */}
          <div className="relative" style={{ height: '100%' }}>
            <img
              src={
                cart.card_thumbnail
                  ? `https://admin.urbantyohar.com/${cart.card_thumbnail}`
                  : 'https://via.placeholder.com/150?text=No+Thumbnail'
              }
              alt={cart.title}
              className="w-full h-full rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* You can add play icon or any content here */}
            </div>
            <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
              <Heart
                className="w-6 h-6 text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to wishlist logic here
                }}
              />
            </div>
          </div>
          <div className="absolute top-1 left-1 bg-[#4A00FF] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {Math.round((1 - cart.offer_dis / cart.price) * 100)}% OFF
          </div>
        </div>
        <div className="mt-2 flex flex-col justify-between" style={{ height: 'auto' }}>
          <h3 className="text-base font-semibold text-gray-800 truncate">
            {cart.title}
          </h3>
          <p className="text-xs text-blue-500 truncate">Code: {cart.code}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-lg font-bold">₹{cart.offer_dis}</p>
            <img
              src={moreinfo}
              alt="More Info"
              className="cursor-pointer transition-opacity duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation(`/single-cart?id=${cart.id}/${cart.url_name ? cart.url_name.replace(/\s+/g, '-') : ''}`);
              }}
              style={{ maxWidth: '100px', maxHeight: '80px' }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cost ₹<span className="line-through">{cart.price}</span> (
            {Math.round((1 - cart.offer_dis / cart.price) * 100)}% off)
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
<div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-200 shadow-lg border-t border-gray-200 p-1 z-50">
  <div className="flex items-center justify-between px-2">
    <div className="w-1/4 pl-4">
      <span className="font-bold text-lg">₹{Math.round(calculateTotalPrice() + calculateTotalPrice()*0.18)}</span>
      <div className="text-xs text-gray-600">
        <span className="line-through">₹{productDetails?.price}</span>
        {/* <span className="ml-1 text-red-500">{calculateDiscount()}% OFF</span> */}
      </div>
    </div>
    
  <div className="flex space-x-2 w-2/3">
      {userToken ? (
        <button 
          className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-poppins font-regular hover:bg-blue-600 transition-colors text-sm"
          onClick={() => {
            // Store product and price information in localStorage for the billing page
            localStorage.setItem('checkoutInfo', JSON.stringify({
              productId: productDetails.id,
              productTitle: productDetails.title,
              productCode: productDetails.code,
              basePrice: selectedQuantity === 'soft-copy' ? 0 : productDetails.offer_dis,
              languagePrice: languagePrices[selectedLanguage],
              offerPrice: productDetails.degine_price + productDetails.print_price,
              selectedLanguage: selectedLanguage === 'other' ? otherLanguage : selectedLanguage,
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
          className="flex-1 py-1 bg-[#4A00FF] text-white rounded-lg font-poppins font-regular hover:bg-blue-600 transition-colors text-sm"
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
<div className="md:hidden h-16 mb-4"></div>  </div>
  );
};
export default SingleProd;