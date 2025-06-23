import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PlayCircle, Heart, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, toggleWishlist } from "../rtk/wishlistSlice";
import moreinfo from '../assets/MainCata/more-info.png';
import InvideoBanner from "../components/InvideoBanner";
import { Link } from 'react-router-dom';

const WeddingInvitations = () => {
  const { category_id } = useParams();
  const navigate = useNavigate();
  const [headerData, setHeaderData] = useState({
    title: "Wedding Invitations",
    backgroundColor: "linear-gradient(to right, #020024, #1616c1, #271fba)",
  });
  const [weddingTypes, setWeddingTypes] = useState([]);
  const [selectedWeddingType, setSelectedWeddingType] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [activeSlides, setActiveSlides] = useState({});
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist.items) || [];

  useEffect(() => {
    console.log("category_id", category_id);
  
    const fetchWeddingTypes = async () => {
      setLoading(true);
      
      try {
        const response = await axios.post(
          "https://admin.urbantyohar.com/api/all-category?maincat_id=1"
        );
        if (response.data && Array.isArray(response.data.data)) {
          const weddingTypesData = response.data.data.map((item) => ({
            id: item.id,
            title: item.category_name,
            image: `https://admin.urbantyohar.com/${item.image}`,
          }));
          
          setWeddingTypes(weddingTypesData);
          if (weddingTypesData.length > 0) {
            if (category_id) {
              const selectedType = weddingTypesData.find(type => type.id === parseInt(category_id));
              if (selectedType) {
                fetchSubcategories(selectedType);
              }
            } else {
              fetchSubcategories(weddingTypesData[0]);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching wedding types:", err);
        setError("Failed to load data. Please try again later.");
      }
  
      setLoading(false);
    };
  
    fetchWeddingTypes();
    dispatch(fetchWishlist());
  }, [dispatch, category_id]);
  
  const fetchSubcategories = useCallback(async (weddingType) => {
    setSelectedWeddingType(weddingType);
    setHeaderData({
      title: weddingType.title,
      backgroundColor: "linear-gradient(to right, #0077b6, #000000, #ffffff)",
    });

    try {
      const response = await axios.post(
        `https://admin.urbantyohar.com/api/category?id=${weddingType.id}`
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

  const handleToggleWishlist = async (video) => {
    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      window.scrollTo(0, 0);
      navigate('/login');
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [video.id]: true }));
    await dispatch(toggleWishlist(video));
    setLoadingStates((prev) => ({ ...prev, [video.id]: false }));
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
      navigate(`/subcategory/${selectedSubcategory.id}/${selectedSubcategory.subcategory_name.replace(/\s+/g, '-')}`);
      window.scrollTo(0, 0);
    }
  };

  const VideoCard = ({ video }) => (
    <div
      className="relative group rounded-lg bg-white cursor-pointer w-64 flex-shrink-0 h-[600px] flex flex-col border-2 border-yellow-200"
    >
      <Link 
        to={`/invitation-Videos?id=${video.id}/${video.url_name ? video.url_name.replace(/\s+/g, '-') : ''}`}
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }}
      >
        <div className="relative h-96 flex-shrink-0">
          <div className="absolute top-2 right-2 z-20 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
            {loadingStates[video.id] ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Heart
                className={`w-4 h-4 ${
                  favoriteItems.some(item => item.id === video.id)
                    ? 'text-red-500 fill-current'
                    : 'text-red-500'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleWishlist(video);
                }}
              />
            )}
          </div>
          <img
            src={video.video_thumbnail}
            alt={video.title}
            className="w-full h-full object-cover p-3"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
            <PlayCircle className="w-20 h-20 text-white" />
          </div>
        </div>
      </Link>
  
      <div className="p-4 flex flex-col flex-grow">
        <div className="h-16 mb-2">
          <h3 className="font-poppins text-gray-800 text-lg line-clamp-2">
            {video.title}
          </h3>
        </div>
  
        <div className="flex justify-start items-center space-x-4 mb-2">
          <p className="text-lg text-gray-600 line-through">₹{video.price}</p>
          <p className="text-xl font-bold text-gray-800">₹{video.offer_dis}</p>
        </div>
  
        <div className="mt-0 flex justify-center items-center">
          <Link 
            to={`/invitation-Videos?id=${video.id}/${video.url_name ? video.url_name.replace(/\s+/g, '-') : ''}`}
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
              className="cursor-pointer"
              style={{ maxWidth: '140px' }}
            />
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading && weddingTypes.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white mt-0">
      <div>
        <InvideoBanner mainId={1} />
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 mt-0">
        <h2 className="text-xl sm:text-2xl font-poppins text-gray-800 mb-4 sm:mb-6 text-center">
          Browse by Category
        </h2>

        <div className="flex justify-start sm:justify-center space-x-6 sm:space-x-10 overflow-x-auto py-4 px-2 font-poppins">
          {weddingTypes.map((type) => (
            <div
              key={type.id}
              className="flex-shrink-0 text-center cursor-pointer"
              onClick={() => fetchSubcategories(type)}
            >
              <div className={`w-24 h-24 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 ${selectedWeddingType?.id === type.id ? 'border-yellow-200' : 'border-white'} mx-auto`}>
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className={`mt-3 text-sm sm:text-base font-medium ${selectedWeddingType?.id === type.id ? "text-[#4A00FF]" : "text-gray-700"}`}>
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
            {subcategory.products.length > 1 && (
              <Link
                to={`/subcategory/${subcategory.id}/${subcategory.subcategory_name.replace(/\s+/g, '-')}`}
                state={{ sub_desc: subcategory.sub_desc , Banner : subcategory.banner }}
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

            <div className="overflow-x-auto lg:overflow-hidden">
              <div
                className="flex space-x-4 transition-transform duration-300"
                style={{
                  transform: `translateX(-${activeSlides[subcategory.id] || 0}px)`
                }}
              >
                {subcategory.products.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={{
                      id: video.id,
                      title: video.title,
                      price: video.price,
                      offer_dis: video.offer_dis,
                      video_thumbnail: video.video_thumbnail
                        ? `https://admin.urbantyohar.com/${video.video_thumbnail}`
                        : "https://via.placeholder.com/300?text=No+Thumbnail",
                      short_desc: video.short_desc,
                      url_name: video.url_name,
                    }}
                  />
                ))}
              </div>
            </div>

            {(activeSlides[subcategory.id] || 0) < (subcategory.products.length - 4) * 280 && (
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

export default WeddingInvitations;