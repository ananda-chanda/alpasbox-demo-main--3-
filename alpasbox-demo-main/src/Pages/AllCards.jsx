import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PlayCircle, Heart, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, toggleWishlist } from "../rtk/wishlistSlice";
import moreinfo from '../assets/MainCata/more-info.png';
import InvideoBanner from "../components/InvideoBanner";
import { Link } from 'react-router-dom';

const AllCards = () => {
  const { category_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [headerData, setHeaderData] = useState({
    title: "Wedding Invitations",
    backgroundColor: "linear-gradient(to right, #020024, #1616c1, #271fba)",
  });
  const [cardTypes, setCardTypes] = useState([]);
  const [selectedCardType, setSelectedCardType] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [activeSlides, setActiveSlides] = useState({});
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist.items) || [];
  const baseUrl = "https://admin.urbantyohar.com";

  // Get category from URL if available
  const queryParams = new URLSearchParams(location.search);
  const selectedCategoryName = queryParams.get('category') || 
                              (location.state && location.state.category);

  useEffect(() => {
    console.log("category_id", category_id);
    console.log("selectedCategoryName", selectedCategoryName);
  
    const fetchCardTypes = async () => {
      setLoading(true);
      
      try {
        const response = await axios.post(
          "https://admin.urbantyohar.com/api/all-category?maincat_id=2"
        );
        if (response.data && Array.isArray(response.data.data)) {
          const cardTypesData = response.data.data.map((item) => ({
            id: item.id,
            title: item.category_name,
            image: `https://admin.urbantyohar.com/${item.image}`,
          }));
          
          setCardTypes(cardTypesData);
          if (cardTypesData.length > 0) {
            // First try to match by category name if provided
            if (selectedCategoryName) {
              const selectedType = cardTypesData.find(
                type => type.title.toLowerCase() === selectedCategoryName.toLowerCase()
              );
              if (selectedType) {
                fetchSubcategories(selectedType);
                return;
              }
            }

            // Then try to match by ID if provided
            if (category_id) {
              const selectedType = cardTypesData.find(type => type.id === parseInt(category_id));
              if (selectedType) {
                fetchSubcategories(selectedType);
                return;
              }
            }

            // Default to first category if no match
            fetchSubcategories(cardTypesData[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching card types:", err);
        setError("Failed to load data. Please try again later.");
      }
  
      setLoading(false);
    };
  
    fetchCardTypes();
    dispatch(fetchWishlist());
  }, [dispatch, category_id, selectedCategoryName]);
  
  const fetchSubcategories = useCallback(async (cardType) => {
    setSelectedCardType(cardType);
    setHeaderData({
      title: cardType.title,
      backgroundColor: "linear-gradient(to right, #0077b6, #000000, #ffffff)",
    });

    try {
      const response = await axios.post(
        `https://admin.urbantyohar.com/api/category?id=${cardType.id}`
      );
      if (response.data && response.data.data) {
        const subcategories = response.data.data.subcategories || [];
        setSubcategories(subcategories);
        
        const initialActiveSlides = {};
        subcategories.forEach(sub => {
          initialActiveSlides[sub.id] = 0;
        });
        setActiveSlides(initialActiveSlides);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setError("Failed to load subcategories.");
    }
  }, []);

  const handleToggleWishlist = async (card) => {
    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      window.scrollTo(0, 0);
      navigate('/login');
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [card.id]: true }));
    await dispatch(toggleWishlist(card));
    setLoadingStates((prev) => ({ ...prev, [card.id]: false }));
  };

  const handleSlide = (subcategoryId, direction) => {
    const cardWidth = 280; // Card width (264px) + margin (16px)
    setActiveSlides(prev => {
      const currentPosition = prev[subcategoryId] || 0;
      if (direction === 'next') {
        return { ...prev, [subcategoryId]: currentPosition + cardWidth };
      } else {
        return { ...prev, [subcategoryId]: Math.max(0, currentPosition - cardWidth) };
      }
    });
  };

  const handleSubcategorySelect = (e) => {
    const selectedSubcategoryId = e.target.value;
    const selectedSubcategory = subcategories.find(sub => sub.id === parseInt(selectedSubcategoryId));
    if (selectedSubcategory) {
      navigate(`/cardsub/${selectedSubcategory.id}/${selectedSubcategory.subcategory_name.replace(/\s+/g, '-')}`);
      window.scrollTo(0, 0);
    }
  };

  const getPreviewImage = (card) => {
    if (card.preview_image) {
      try {
        const previewImages = JSON.parse(card.preview_image);
        if (Array.isArray(previewImages) && previewImages.length > 0) {
          return `${baseUrl}/${previewImages[0].replace(/\\/g, "/")}`;
        }
      } catch (e) {
        console.error("Error parsing preview image:", e);
      }
    }
    return `${baseUrl}/${card.card_thumbnail}`;
  };

const CardItem = ({ card }) => (
  <div
    className="relative group rounded-lg bg-white cursor-pointer w-80 flex-shrink-0 h-[600px] flex flex-col border-2 border-yellow-200 hover:shadow-lg transition-all duration-300"
  >
    <Link 
      to={`/single-cart?id=${card.id}/${card.url_name ? card.url_name.replace(/\s+/g, '-') : ''}`}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }}
    >
      <div className="relative h-[420px] flex-shrink-0 overflow-hidden">
        <div 
          className="absolute top-2 right-2 z-20 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
          onClick={(e) => e.preventDefault()}
        >
          {loadingStates[card.id] ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Heart
              className={`w-4 h-4 ${
                favoriteItems.some(item => item.id === card.id)
                  ? 'text-red-500 fill-current'
                  : 'text-red-500'
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleWishlist(card);
              }}
            />
          )}
        </div>
        
        <div className="w-full h-full transition-transform duration-500 ease-out transform group-hover:scale-110">
          <img
            src={card.card_thumbnail 
              ? `${baseUrl}/${card.card_thumbnail}`
              : "https://via.placeholder.com/300?text=No+Thumbnail"
            }
            alt={card.product_type || "Card"}
            className="w-full h-full object-cover p-2"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300?text=Image+Error";
            }}
          />
        </div>
      </div>
    </Link>

    <div className="p-4 flex flex-col flex-grow justify-center items-center">
      <div className="h-8 mb-2">
        <h3 className="font-poppins text-gray-800 text-lg line-clamp-2 text-center">
          {card.title || "Untitled Card"}
        </h3>
      </div>
      <div className="flex flex-col items-center mb-0 mt-6">
        <div className="flex items-center">
          <span className="text-gray-500 line-through text-sm mr-2">₹{card.price}</span>
          <span className="text-xl font-bold text-gray-800">₹{card.offer_dis}</span>
          {card.price && card.offer_dis && (
            <span className="text-xs text-green-600 ml-2">
              ({Math.round((1 - card.offer_dis / card.price) * 100)}% off)
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center mt-4">
        <Link 
          to={`/single-cart?id=${card.id}/${card.url_name ? card.url_name.replace(/\s+/g, '-') : ''}`}
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
        >
          <img
            src={moreinfo}
            alt="More Info"
            className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
            style={{ maxWidth: '140px' }}
          />
        </Link>
      </div>
    </div>
  </div>
);

  if (loading && cardTypes.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white">
      <div>
        <InvideoBanner mainId={2} />
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-poppins text-gray-800 mb-4 sm:mb-6 text-center">
          Browse by Category
        </h2>

        <div className="flex justify-start sm:justify-center space-x-6 sm:space-x-10 overflow-x-auto scrollbar-hide py-4 px-2 font-poppins">
          {cardTypes.map((type) => (
            <div
              key={type.id}
              className="flex-shrink-0 text-center cursor-pointer"
              onClick={() => fetchSubcategories(type)}
            >
              <div className={`w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 ${selectedCardType?.id === type.id ? 'border-yellow-200' : 'border-white'} mx-auto`}>
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className={`mt-3 text-sm sm:text-base font-medium ${selectedCardType?.id === type.id ? "text-[#4A00FF]" : "text-gray-700"}`}>
                {type.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center bg-white px-4 sm:px-2">
        <div className="relative w-[32rem]">
          <select
            className="w-full p-2 text-lg border-2 border-yellow-300 rounded-lg focus:outline-none font-poppins shadow-lg"
            onChange={handleSubcategorySelect}
          >
            <option value="">Select for Quick Search...</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.subcategory_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      

      {subcategories.map((subcategory) => (
        <div key={subcategory.id} className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 lg:text-2xl">
              {subcategory.subcategory_name}
            </h2>
            {subcategory.products && subcategory.products.length > 1 && (
           <Link
           to={`/cardsub/${subcategory.id}/${subcategory.subcategory_name.replace(/\s+/g, '-')}`}
           state={{ sub_desc: subcategory.sub_desc, banner: subcategory.banner }}
           className="bg-[#4A00FF] text-white font-semibold py-2 px-4 rounded-md"
           onClick={() => window.scrollTo(0, 0)}
         >
           View All
         </Link>
            )}
          </div>
        

          <div className="relative">
            {(activeSlides[subcategory.id] || 0) > 0 && (
              <button
                onClick={() => handleSlide(subcategory.id, 'prev')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-gray-300 p-2 rounded-full shadow-lg z-10 lg:block hidden"
              >
                <ChevronLeft className="w-8 h-8 text-gray-600" />
              </button>
            )}

            <div className="overflow-x-auto lg:overflow-hidden scrollbar-hide">
              <div
                className="flex space-x-4 transition-transform duration-300"
                style={{
                  transform: `translateX(-${activeSlides[subcategory.id] || 0}px)`
                }}
              >
                {subcategory.products && subcategory.products.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                  />
                ))}
              </div>
            </div>

            {subcategory.products && (activeSlides[subcategory.id] || 0) < (subcategory.products.length - 4) * 280 && (
              <button
                onClick={() => handleSlide(subcategory.id, 'next')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-gray-300 p-2 rounded-full shadow-lg z-10 lg:block hidden"
              >
                <ChevronRight className="w-8 h-8 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllCards;