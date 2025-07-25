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
import Available from './Available'
import { motion, AnimatePresence } from 'framer-motion';





const Singlesta = () => {
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
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
//   const [selectedSide, setSelectedSide] = useState("no");
  // const [basePrice, setBasePrice] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  
  const [isZoomed, setIsZoomed] = useState(false);
const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
const [quantity, setQuantity] = useState(1);
const [min, setMin] = useState(1);
const [max, setMax] = useState(1);
const [isModalOpen, setIsModalOpen] = useState(false);
const [direction, setDirection] = useState('right');



// Helper to check if desktop
const isDesktop = () => window.innerWidth >= 1024;

// Close modal on ESC key
useEffect(() => {
  const handleEscapeKey = (e) => {
    if (e.key === "Escape" && isModalOpen) {
      setIsModalOpen(false);
    }
  };
  
  document.addEventListener("keydown", handleEscapeKey);
  return () => document.removeEventListener("keydown", handleEscapeKey);
}, [isModalOpen]);



useEffect(() => {
  const fetchProduct = async () => {
    try {
      const response = await axios.post(`https://admin.urbantyohar.com/api/single-product?id=${productId}`);
      const product = response.data.data;
      setProductDetails(product);
      
      if (product.category_id === 14 || product.category_id === 19||product.maincat_id ===4) {
        // For categories 14 and 19, set min to minimum_qnty or 1 if not available
        const minQty = product.minimum_qnty || 1;
        setMin(minQty);
        setMax(10000); // High number as max
        setQuantity(minQty); // Initialize with min quantity
      } else {
        // For other categories, use per_card data
        if (product.per_card && product.per_card.length > 0) {
          const firstQty = parseInt(product.per_card[0].quantity);
          setQuantity(firstQty);
          setMin(firstQty);
          setMax(parseInt(product.per_card[product.per_card.length - 1].quantity));
        } else {
          // Fallback if no per_card data
          setMin(1);
          setQuantity(1);
          setMax(1);
        }
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  fetchProduct();
}, [productId]);

  const increment = () => {
    if (quantity < max) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > min) setQuantity(quantity - 1);
  };
  
const handleImageZoom = (e) => {
    if (!isZoomed) return;
    const image = e.currentTarget;
    const { left, top, width, height } = image.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    setZoomPosition({ x, y });
  };


  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0); // Scrolls to the top of the page
  };


  const mainVideoRef = useRef(null);

  const languagePrices = {
    english: 0,
    other: 499,
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
    return productDetails.offer_dis + languagePrices[selectedLanguage];
  };
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

      <div className="bg-white font-sans p-4 min-w-full mx-auto mt-8">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-[3.5fr_0.75fr_1.25fr]  gap-6 py-7">
          {/* Main Video or Card Section */}
          <div
            className="md:col-span-2 bg-white p-4 md:p-8 rounded-lg border-2 border-yellow-500 w-full"
            ref={mainVideoRef}
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_2fr] gap-4 md:gap-8">
 {/* update for second video */}
              {/* Conditional Rendering for Video or Card */}
<div className="w-full"  style={{ minHeight: "300px" }}>
  {selectedVideo && selectedVideo.video ? (
    <div 
      className="relative cursor-pointer "
      onClick={() => setIsModalOpen(true)}
    >
      {/* Video preview with play button overlay */}
      <video
        src={`https://admin.urbantyohar.com/${selectedVideo.video}`}
        className="rounded-lg shadow-lg object-contain w-full py-2"
        style={{ minHeight: "300px" }}
        preload="metadata"
        muted
        playsInline
        onLoadedMetadata={(e) => {
          e.target.currentTime = 0.1;
        }}
        onError={(e) => {
          const container = e.target.parentElement;
          if (container) {
            const img = document.createElement('img');
            img.src = `https://via.placeholder.com/400x300?text=Video+Preview`;
            img.alt = "Video preview";
            img.className = "rounded-lg shadow-lg h-auto object-contain w-full";
            container.replaceChild(img, e.target);
          }
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          className="w-16 h-16 text-white/80 bg-black/30 rounded-full p-3"
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M8 5v10l7-5-7-5z" fillRule="evenodd" />
        </svg>
      </div>
    </div>
  ) : productDetails ? (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg relative w-full">
      {productDetails?.preview_image ? (
        <>
          <div className="relative overflow-hidden rounded-lg w-full">
            <AnimatePresence initial={false} custom={direction}>
              {JSON.parse(productDetails.preview_image)[currentImageIndex]?.toLowerCase().endsWith('.mp4') ? (
                <div 
                  className="relative cursor-pointer w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  <motion.video
                    key={`video-${currentImageIndex}`}
                    custom={direction}
                    initial={(direction) => ({ 
                      opacity: 0, 
                      x: direction === 'left' ? '-100%' : '100%' 
                    })}
                    animate={{ opacity: 1, x: 0 }}
                    exit={(direction) => ({ 
                      opacity: 0, 
                      x: direction === 'left' ? '100%' : '-100%' 
                    })}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    src={`https://admin.urbantyohar.com/${JSON.parse(
                      productDetails.preview_image
                    )[currentImageIndex].replace(/\\/g, "/")}`}
                    className="w-full h-auto rounded-lg"
                    style={{ maxHeight: "300px" }}
                    preload="metadata"
                    muted
                    playsInline
                    onLoadedMetadata={(e) => {
                      e.target.currentTime = 0.1;
                    }}
                    onError={(e) => {
                      const container = e.target.parentElement;
                      if (container) {
                        const img = document.createElement('img');
                        img.src = `https://via.placeholder.com/400x300?text=Video+Preview`;
                        img.alt = "Video preview";
                        img.className = "w-full h-auto rounded-lg";
                        container.replaceChild(img, e.target);
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <svg 
                      className="w-16 h-16 text-white/80 bg-black/30 rounded-full p-3"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 5v10l7-5-7-5z" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
              ) : (
                <motion.img
                  key={`image-${currentImageIndex}`}
                  custom={direction}
                  initial={(direction) => ({ 
                    opacity: 0, 
                    x: direction === 'left' ? '-100%' : '100%' 
                  })}
                  animate={{ opacity: 1, x: 0 }}
                  exit={(direction) => ({ 
                    opacity: 0, 
                    x: direction === 'left' ? '100%' : '-100%' 
                  })}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  src={`https://admin.urbantyohar.com/${JSON.parse(
                    productDetails.preview_image
                  )[currentImageIndex].replace(/\\/g, "/")}`}
                  alt="Product"
                  className={`w-full h-auto rounded-lg cursor-zoom-in ${
                    isZoomed ? 'scale-150' : ''
                  }`}
                  style={isZoomed ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  } : {}}
                  onClick={() => {
                    if (!isZoomed) {
                      setIsModalOpen(true);
                    } else {
                      setIsZoomed(false);
                    }
                  }}
                  onMouseMove={handleImageZoom}
                  onMouseLeave={() => setIsZoomed(false)}
                />
              )}
            </AnimatePresence>
          </div>

          {!isZoomed && (
            <>
              <div className="absolute inset-0 flex items-center justify-between z-10 px-2 md:px-4 pointer-events-none">
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.95)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setDirection('left');
                    setCurrentImageIndex((prev) =>
                      prev === 0
                        ? JSON.parse(productDetails.preview_image).length - 1
                        : prev - 1
                    );
                  }}
                  className="pointer-events-auto bg-white/80 rounded-full p-1 md:p-2 hover:bg-white shadow-md"
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
                
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.95)" }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setDirection('right');
                    setCurrentImageIndex((prev) =>
                      prev === JSON.parse(productDetails.preview_image).length - 1
                        ? 0
                        : prev + 1
                    );
                  }}
                  className="pointer-events-auto bg-white/80 rounded-full p-1 md:p-2 hover:bg-white shadow-md"
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

              <div className="flex space-x-2 md:space-x-4 mt-4 overflow-x-auto pb-4">
                {JSON.parse(productDetails.preview_image).map((item, index) => (
                  item.toLowerCase().endsWith('.mp4') ? (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-16 h-16 md:w-20 md:h-20 relative rounded-lg cursor-pointer flex-shrink-0 ${
                        currentImageIndex === index ? "border-2 border-blue-500" : ""
                      }`}
                      onClick={() => {
                        setDirection(index > currentImageIndex ? 'right' : 'left');
                        setCurrentImageIndex(index);
                      }}
                    >
                      <div className="relative w-full h-full">
                        <video
                          src={`https://admin.urbantyohar.com/${item.replace(/\\/g, "/")}`}
                          className="w-full h-full object-cover rounded-lg opacity-70"
                          preload="metadata"
                          muted
                          playsInline
                          onLoadedMetadata={(e) => {
                            e.target.currentTime = 0.1;
                          }}
                          onError={(e) => {
                            const container = e.target.parentElement;
                            if (container) {
                              const img = document.createElement('img');
                              img.src = `https://via.placeholder.com/80?text=Video`;
                              img.alt = `Video thumbnail ${index}`;
                              img.className = "w-full h-full object-cover rounded-lg opacity-70";
                              container.appendChild(img);
                              e.target.style.display = 'none';
                            }
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                          <svg
                            className="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.img
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      src={`https://admin.urbantyohar.com/${item.replace(/\\/g, "/")}`}
                      alt={`Thumbnail ${index}`}
                      className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 ${
                        currentImageIndex === index ? "border-2 border-blue-500" : ""
                      }`}
                      onClick={() => {
                        setDirection(index > currentImageIndex ? 'right' : 'left');
                        setCurrentImageIndex(index);
                      }}
                    />
                  )
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-center">No image available</p>
      )}
    </div>
  ) : (
    <p className="text-gray-500 text-center">No video or product details available</p>
  )}

  {isModalOpen && (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
      onClick={() => setIsModalOpen(false)}
    >
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-xl w-full max-h-[95vh] mx-auto p-4"
        onClick={e => e.stopPropagation()}
      >
        {selectedVideo && selectedVideo.video ? (
          <video
            key={`modal-video-${selectedVideo.video}`}
            src={`https://admin.urbantyohar.com/${selectedVideo.video}`}
            controls
            autoPlay
            className="w-full h-auto max-h-[85vh] rounded-lg mx-auto"
          >
            Your browser does not support the video tag.
          </video>
        ) : productDetails?.preview_image ? (
          <>
            <div className="relative flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction}>
                {JSON.parse(productDetails.preview_image)[currentImageIndex]?.toLowerCase().endsWith('.mp4') ? (
                  <motion.video
                    key={`modal-video-${currentImageIndex}`}
                    custom={direction}
                    initial={(direction) => ({ 
                      opacity: 0, 
                      x: direction === 'left' ? '-100%' : '100%' 
                    })}
                    animate={{ opacity: 1, x: 0 }}
                    exit={(direction) => ({ 
                      opacity: 0, 
                      x: direction === 'left' ? '100%' : '-100%' 
                    })}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    src={`https://admin.urbantyohar.com/${JSON.parse(productDetails.preview_image)[currentImageIndex].replace(/\\/g, "/")}`}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[85vh] rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </motion.video>
                ) : (
                  <motion.img
                    key={`modal-img-${currentImageIndex}`}
                    custom={direction}
                    initial={(direction) => ({ 
                      opacity: 0, 
                      x: direction === 'left' ? '-100%' : '100%' 
                    })}
                    animate={{ opacity: 1, x: 0 }}
                    exit={(direction) => ({ 
                      opacity: 0, 
                      x: direction === 'left' ? '100%' : '-100%' 
                    })}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    src={`https://admin.urbantyohar.com/${JSON.parse(productDetails.preview_image)[currentImageIndex].replace(/\\/g, "/")}`}
                    alt="Product"
                    className="w-full h-auto max-h-[85vh] rounded-lg"
                  />
                )}
              </AnimatePresence>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-4">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection('left');
                  setCurrentImageIndex((prev) =>
                    prev === 0
                      ? JSON.parse(productDetails.preview_image).length - 1
                      : prev - 1
                  );
                }}
                className="pointer-events-auto bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors z-10"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection('right');
                  setCurrentImageIndex((prev) =>
                    prev === JSON.parse(productDetails.preview_image).length - 1
                      ? 0
                      : prev + 1
                  );
                }}
                className="pointer-events-auto bg-white/20 hover:bg-white/40 p-2 rounded-full transition-colors z-10"
              >
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
            
            <div className="flex justify-center space-x-2 md:space-x-3 mt-4 overflow-x-auto pb-2">
              {JSON.parse(productDetails.preview_image).map((item, index) => (
                <motion.div 
                  key={index} 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 md:w-16 md:h-16 relative cursor-pointer flex-shrink-0 ${
                    currentImageIndex === index ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDirection(index > currentImageIndex ? 'right' : 'left');
                    setCurrentImageIndex(index);
                  }}
                >
                  {item.toLowerCase().endsWith('.mp4') ? (
                    <div className="relative w-full h-full">
                      <video
                        src={`https://admin.urbantyohar.com/${item.replace(/\\/g, "/")}`}
                        className="w-full h-full object-cover rounded opacity-80"
                        preload="metadata"
                        muted
                        playsInline
                        onLoadedMetadata={(e) => {
                          e.target.currentTime = 0.1;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={`https://admin.urbantyohar.com/${item.replace(/\\/g, "/")}`}
                      alt={`Thumbnail ${index}`}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </>
        ) : null}
        
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.3)" }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-2 right-2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
          onClick={() => setIsModalOpen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
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
                      <p className=" font-poppins text-black-600 font-light">{productDetails?.short_desc}</p>
                    </div>
                    <div className="border-b border-gray-200 pb-2 md:pb-4 flex items-center space-x-2 md:space-x-4">
  <div className="flex items-center">
    <p className="text-lg md:text-xl font-bold text-gray-600 line-through">
      RS {productDetails?.price}
    </p>
    <span className="text-lg md:text-xl font-bold text-black-800 ml-2">
      RS {productDetails?.offer_dis}
    </span>
  </div>
  <span className="text-sm md:text-base font-medium text-white bg-blue-600 px-2 py-1 rounded-full">
    {calculateDiscount()}% OFF
  </span>
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
                <div className="mt-4 space-y-4 px-2 md:px-2">
             
{/* <div className=' font-poppins font-Regular'>
<h1>NO OF PIECES : {quantity}</h1>
</div> */}
{(productDetails.category_id === 14 || productDetails.category_id === 19 ||productDetails.maincat_id===4) ? (
  // Original design for category_id 14 and 19
  <div className="flex items-center justify-start space-x-6">
    <button 
      onClick={decrement} 
      disabled={quantity <= min} 
      className="w-10 h-10 flex items-center justify-center border-2 border-blue-500 rounded-full text-xl font-semibold text-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-300 transition-colors duration-200"
    >
      -
    </button>
    <div className="relative">
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (value < min) {
            alert(`Minimum quantity should be ${min}`);
            setQuantity(min);
          } else if (value > max) {
            setQuantity(max);
          } else {
            setQuantity(value);
          }
        }}
        className="w-24 h-10 text-center text-xl font-semibold border-2 border-blue-500 rounded-lg focus:outline-none focus:border-blue-600"
        min={min}
        max={max}
      />
      {min > 1 && (
        <p className="font-poppins absolute -bottom-6 left-0 right-0 text-xs text-blue-500 text-center whitespace-nowrap">
          Min quantity: {min} pieces
        </p>
      )}
    </div>
    <button 
      onClick={increment} 
      disabled={quantity >= max} 
      className="w-10 h-10 flex items-center justify-center border-2 border-blue-500 rounded-full text-xl font-semibold text-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-300 transition-colors duration-200"
    >
      +
    </button>
  </div>
) : (
  // Dropdown design for other categories using per_card quantities
  <div className="w-full">
    <label htmlFor="quantity-select" className="block font-poppins text-sm font-medium text-gray-700 mb-2">
      SELECT QUANTITY: {quantity}
    </label>
    <div className="relative">
      <select
        id="quantity-select"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        className="w-full h-10 pl-4 pr-10 text-lg font-semibold border-2 border-blue-400 rounded-lg appearance-none focus:outline-none focus:border-blue-600 bg-white cursor-pointer"
      >
        {productDetails?.per_card?.map((option) => (
          <option key={option.quantity} value={option.quantity}>
            {option.quantity} pieces 
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
)}
 
                  <div className="bg-gray-100 shadow-md p-4 rounded-lg">
                  <div className=" font-poppins flex justify-between mb-2 border-b border-gray-400 pb-2">
                      <span>Product Price:</span>
                      <span>₹{ (quantity * productDetails?.offer_dis || 0)}</span>
                    </div>
                    <div className="font-poppins flex justify-between mb-2 border-b border-gray-400 pb-2">
                      <span>Design Price:</span>
                      <span>₹{productDetails?.degine_price}</span>
                    </div>
                    <div className="font-poppins flex justify-between mb-2 border-b border-gray-400 pb-2">
                      <span>Print Price:</span>
                      <span>₹{productDetails?.print_price}</span>
                    </div>
                    {/* <div className="flex justify-between mb-2 border-b border-gray-400 pb-2">
                        
                      <span>Options Price:</span>
                      <span>₹{languagePrices[selectedLanguage]}</span>
                    </div> */}
                    <div className="flex justify-between mb-2 border-b border-gray-400 pb-2">
  <span>Gst 18%:</span>
  <span>₹{Math.round((productDetails?.degine_price +productDetails?.print_price+ (quantity * productDetails?.offer_dis || 0)) * 0.18)}</span>
</div>
                 
                    <div className=" font-poppins flex justify-between font-bold">
                      <span>Total:</span>
                      <span>₹{Math.round(( ((quantity * productDetails?.offer_dis || 0))+productDetails?.degine_price +productDetails?.print_price) * 1.18)  }</span>
                    </div>
                  </div>

                  <div>
                    <p className=' font-poppins font-Light'>Product: {productDetails.product_type}</p>
                    <p className=' font-poppins font-Light'>Code: {productDetails.code}</p>
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
              <span>₹{Math.round((productDetails?.degine_price +productDetails?.print_price+(quantity * productDetails?.offer_dis || 0)) * 1.18) }</span>
              <span className='font-poppins font-light text-sm mt-2'>(GST INC)</span>
            </div>

            <button
              className="w-full py-3 border-2 border-red-500 text-red-500 rounded-full font-regular hover:bg-red-50 transition-colors"
              onClick={handleAddToCart}
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
          basePrice: productDetails.offer_dis,
          quantity: quantity,
          designPrice: productDetails.degine_price,
          printPrice: productDetails.print_price,
          subtotal: productDetails.degine_price + productDetails.print_price + (quantity * productDetails.offer_dis || 0),
          gst: Math.round((productDetails.degine_price + productDetails.print_price + (quantity * productDetails.offer_dis || 0)) * 0.18),
          total: Math.round((productDetails.degine_price + productDetails.print_price + (quantity * productDetails.offer_dis || 0)) * 1.18)
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
                <span className=" font-poppins font-Light">Share:</span>
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
        onClick={() => handleNavigation(`/stationary?id=${cart.id}/${cart.url_name ? cart.url_name.replace(/\s+/g, '-') : ''}`)}
        style={{ width: '100%', height: 'auto', maxHeight: '900px' }}
      >
        <div className="relative" style={{ height: '500px' }}>
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
          <p className=" font-poppins text-xs text-blue-500 truncate">Code: {cart.code}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-lg font-bold">₹{cart.offer_dis}</p>
            <img
              src={moreinfo}
              alt="More Info"
              className="cursor-pointer transition-opacity duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation(`/stationary?id=${cart.id}/${cart.url_name ? cart.url_name.replace(/\s+/g, '-') : ''}`);
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

{/* Mobile Bottom Bar */}
<div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-200 shadow-lg border-t border-gray-200 p-1 z-40 px-2">
  <div className="flex items-center justify-between">
    <div className="w-1/4 pl-3">
      <span className="font-bold text-lg">₹{Math.round((productDetails?.offer_dis + (quantity * productDetails?.single_price || 0)) * 1.18)}</span>
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
              basePrice: productDetails.offer_dis,
              quantity: quantity,
              designPrice: productDetails.degine_price,
              printPrice: productDetails.print_price,
              subtotal: productDetails.degine_price + productDetails.print_price + (quantity * productDetails.offer_dis || 0),
              gst: Math.round((productDetails.degine_price + productDetails.print_price + (quantity * productDetails.offer_dis || 0)) * 0.18),
              total: Math.round((productDetails.degine_price + productDetails.print_price + (quantity * productDetails.offer_dis || 0)) * 1.18)
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
        className="flex-1 py-2 bg-[#00d748] text-white rounded-lg font-poppins font-regular hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
        disabled={!phoneNumber}
      >
        <i className="fab fa-whatsapp mr-1 text-xs"></i>
         Order On WhatsApp
      </button>
    </div>
  </div>
</div>

{/* Add padding at the bottom to prevent content from being hidden under the fixed bar */}
<div className="md:hidden h-16 mb-4"></div>
    
    </div>
  );
};
export default Singlesta;