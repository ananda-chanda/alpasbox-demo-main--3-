import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { PlayCircle, Heart, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../rtk/wishlistSlice';
import moreinfo from '../assets/MainCata/more-info.png';

const SubcategoryPage = () => {
  const { subcategory_id, subcategoryName } = useParams();
  const location = useLocation();
  const [videos, setVideos] = useState([]);
  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [invitationType, setInvitationType] = useState('');
  const [language, setLanguage] = useState('');
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist.items) || [];
  const navigate = useNavigate();
  const baseUrl = 'https://admin.urbantyohar.com';

  // Safely extract subDesc and rawBanner with defaults
  const subDesc = location.state?.sub_desc || '';
  
  // Important: Initialize banners array directly to avoid any rendering issues
  const [banners, setBanners] = useState([]);
  
  useEffect(() => {
    // Safely parse banner data in a separate effect
    try {
      const rawBanner = location.state?.Banner || '[]';
      const parsedBanners = rawBanner ? JSON.parse(rawBanner) : [];
      setBanners(Array.isArray(parsedBanners) ? parsedBanners : []);
    } catch (err) {
      console.error('Error parsing banner data:', err);
      setBanners([]);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        // Fetch videos
        const response = await axios.post(`${baseUrl}/api/product-filter`, {
          subcategory_id,
          language: language || undefined,
          videoType: invitationType || undefined,
        });

        if (response.data && Array.isArray(response.data.data)) {
          const fetchedVideos = response.data.data;
          setVideos(fetchedVideos);
          setDisplayedVideos(fetchedVideos.slice(0, 8));
        } else {
          setError('Invalid data format received from server');
        }

        // Fetch language data
        const languageResponse = await axios.post(`${baseUrl}/api/all-products?subcategory_id=${subcategory_id}`);
        if (languageResponse.data && languageResponse.data.language) {
          const rawLanguage = languageResponse.data.language.language || '[]';

          // Decode the language options
          let decodedLanguages = [];
          try {
            decodedLanguages = JSON.parse(rawLanguage).map((lang) => 
              typeof lang === 'string' ? decodeURIComponent(lang) : ''
            ).filter(Boolean);
          } catch (error) {
            console.error('Error decoding language options:', error);
            decodedLanguages = [];
          }

          setLanguageOptions(decodedLanguages);
        }
      } catch (err) {
        setError(
          err.response
            ? `Server error: ${err.response.status}`
            : 'Network error - please check your connection'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
    dispatch(fetchWishlist());
  }, [dispatch, subcategory_id, subcategoryName, language, invitationType]);

  const handleToggleWishlist = async (e, video) => {
    e.preventDefault();
    e.stopPropagation();

    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/login');
      return;
    }

    try {
      console.log('Adding to wishlist:', video.id);
      setLoadingStates((prev) => ({ ...prev, [video.id]: true }));
      const result = await dispatch(toggleWishlist(video)).unwrap();
      console.log('Wishlist toggle result:', result);
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [video.id]: false }));
    }
  };

  const handleLoadMore = () => {
    const nextVideos = videos.slice(displayedVideos.length, displayedVideos.length + 8);
    setDisplayedVideos((prev) => [...prev, ...nextVideos]);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }

  // Make sure banners is always an array
  const safeBanners = Array.isArray(banners) ? banners : [];

  return (
    <div className="bg-white mt-14 md:mt-0 px-0">
      <div className={`w-full overflow-hidden ${safeBanners.length === 0 ? 'md:mt-16' : 'mt-0'}`}>
        {safeBanners.length > 0 && (
          <div className="flex animate-marquee space-x-4">
            {safeBanners.map((banner, index) => (
              <img
                key={index}
                src={banner ? `${baseUrl}/${banner}` : 'https://via.placeholder.com/800x200?text=Banner+Not+Available'}
                alt={`Banner ${index + 1}`}
                className="w-full h-full md:h-full object-contain md:object-cover"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = 'https://via.placeholder.com/800x200?text=Banner+Not+Available';
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-gray-800 lg:text-3xl">
            {subcategoryName ? subcategoryName.replace(/-/g, ' ') : 'Subcategory'}
          </h2>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            {/* Mobile Filters Row */}
            <div className="grid grid-cols-2 gap-2 w-full md:hidden">
              {/* Video Type Dropdown for Mobile */}
              <div className="border-2 border-yellow-200 rounded-lg p-2 bg-white">
                <select
                  value={invitationType}
                  onChange={(e) => setInvitationType(e.target.value)}
                  className="w-full px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                >
                  <option value="">Video Type</option>
                  <option value="caricature">With Caricature</option>
                  <option value="basic">Without Caricature</option>
                </select>
              </div>

              {/* Language Dropdown for Mobile */}
              <div className="border-2 border-yellow-200 rounded-lg p-2 bg-white">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-2 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins text-sm"
                >
                  <option value="">Language</option>
                  {languageOptions && languageOptions.length > 0 && languageOptions.map((lang, index) => (
                    <option key={index} value={lang}>
                      {lang && typeof lang === 'string' ? lang.charAt(0).toUpperCase() + lang.slice(1) : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Desktop Radio Buttons */}
            <div className="hidden md:block border-2 border-yellow-200 rounded-lg p-4 bg-white">
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="invitation"
                    value="caricature"
                    checked={invitationType === 'caricature'}
                    onChange={(e) => setInvitationType(e.target.value)}
                    className="mr-2 w-5 h-5"
                  />
                  <span className="text-sm font-poppins">With Caricature</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="invitation"
                    value="basic"
                    checked={invitationType === 'basic'}
                    onChange={(e) => setInvitationType(e.target.value)}
                    className="mr-2 w-5 h-5"
                  />
                  <span className="text-sm font-poppins">Without Caricature</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="invitation"
                    value=""
                    checked={invitationType === ''}
                    onChange={(e) => setInvitationType(e.target.value)}
                    className="mr-2 w-5 h-5"
                  />
                  <span className="text-sm font-poppins">All</span>
                </label>
              </div>
            </div>

            {/* Desktop Language Dropdown */}
            <div className="hidden md:block border-2 border-yellow-200 rounded-lg p-2 bg-white">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full min-w-[200px] px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-poppins"
              >
                <option value="">Select Language</option>
                {languageOptions && languageOptions.length > 0 && languageOptions.map((lang, index) => (
                  <option key={index} value={lang}>
                    {lang && typeof lang === 'string' ? lang.charAt(0).toUpperCase() + lang.slice(1) : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {displayedVideos && displayedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedVideos.map((video) => (
              <Link
                to={`/invitation-Videos?id=${video.id}/${video.url_name ? video.url_name.replace(/\s+/g, '-') : ''}`}
                key={video.id}
                className="rounded-lg p-3 px-4 bg-white mx-auto group border-2 border-yellow-200"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="relative">
                  <div className="relative">
                    <img
                      src={video.video_thumbnail
                        ? `${baseUrl}/${video.video_thumbnail || video.card_thumbnail}`
                        : 'https://via.placeholder.com/150?text=No+Thumbnail'}
                      alt={video.title || 'Product'}
                      className="w-full h-fit rounded-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/150?text=No+Thumbnail';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  {(video?.price && video?.offer_dis) ? (
                    <div className="absolute top-1 left-1 bg-[#4A00FF] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {Math.round((1 - video.offer_dis / video.price) * 100)}% OFF
                    </div>
                  ) : null}
                  <div
                    className="absolute top-2 right-2 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                    onClick={(e) => e.preventDefault()}
                  >
                    {loadingStates[video.id] ? (
                      <Loader className="w-5 h-5 text-red-500 animate-spin" />
                    ) : (
                      <Heart
                        className={`w-5 h-5 cursor-pointer transition-colors duration-300 ${
                          favoriteItems && favoriteItems.some && favoriteItems.some((item) => item.id === video.id)
                            ? 'text-red-500 fill-current'
                            : 'text-red-600'
                        }`}
                        onClick={(e) => handleToggleWishlist(e, video)}
                      />
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="font-poppins text-base text-gray-800 line-clamp-2">{video.title || 'Untitled'}</h3>
                  <p className="text-xs text-blue-500 truncate">Code: {video.code || 'N/A'}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-lg font-bold">₹{video.offer_dis || '0'}</p>
                    <Link
                      to={`/invitation-Videos?id=${video.id}/${video.url_name ? video.url_name.replace(/\s+/g, '-') : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.scrollTo(0, 0);
                      }}
                    >
                      <img
                        src={moreinfo}
                        alt="More Info"
                        className="cursor-pointer transition-opacity duration-300"
                        style={{ maxWidth: '100px', maxHeight: '80px' }}
                      />
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Cost ₹<span className="line-through">{video.price || '0'}</span> (
                    {(video?.price && video?.offer_dis) 
                      ? Math.round((1 - video.offer_dis / video.price) * 100) 
                      : 0}% off)
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-16">
            <p className="text-gray-500 text-lg">No products found. Please try different filters.</p>
          </div>
        )}

        {displayedVideos && videos && displayedVideos.length < videos.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="bg-[#4A00FF] text-white font-semibold py-2 px-4 rounded-md"
            >
              Load More
            </button>
          </div>
        )}

        <div className="mb-6 mt-6 px-4 sm:px-8 lg:px-16">
          <p
            className="text-sm sm:text-base lg:text-lg text-gray-600 font-poppins font-regular leading-relaxed tracking-wide"
            dangerouslySetInnerHTML={{ __html: subDesc || '' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubcategoryPage;