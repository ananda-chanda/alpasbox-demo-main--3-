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
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [displayedCards, setDisplayedCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [invitationType, setInvitationType] = useState('');
  const [language, setLanguage] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [applyingFilter, setApplyingFilter] = useState(false);
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist.items) || [];
  const navigate = useNavigate();
  const baseUrl = 'https://admin.urbantyohar.com';
  const cardsPerPage = 8; // Number of cards to display per page

  const subDesc = location.state?.sub_desc || '';
  const Banner = location.state?.banner || '[]';

  console.log('Banner is ', Banner);
  console.log('sub_des is ',subDesc)

let banners = [];


try {
  banners = JSON.parse(Banner);
} catch (error) {
  console.error('Error parsing banner JSON:', error);
  banners = []; // Fallback to an empty array if parsing fails
}


  // Fetch all cards initially without filters
  useEffect(() => {
    const fetchAllCards = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${baseUrl}/api/product-filter`, {
          subcategory_id
        });
        if (response.data && Array.isArray(response.data.data)) {
          const fetchedCards = response.data.data;
          setCards(fetchedCards);
          setFilteredCards(fetchedCards);
          setDisplayedCards(fetchedCards.slice(0, cardsPerPage));
        } else {
          setError('Invalid data format received from server');
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

    fetchAllCards();
    dispatch(fetchWishlist());
  }, [dispatch, subcategory_id]);

  // Apply filters client-side
  useEffect(() => {
    const applyFilters = () => {
      setApplyingFilter(true);
      let filtered = [...cards];

      // Apply invitationType filter
      if (invitationType) {
        filtered = filtered.filter(card => card.videoType === invitationType);
      }

      // Apply language filter
      if (language) {
        filtered = filtered.filter(card => card.language === language);
      }

      // Apply price range filter
      if (priceRange) {
        filtered = filtered.filter(card => {
          const price = parseFloat(card.offer_dis);
          
          if (priceRange === '0-500') {
            return price <= 500;
          } else if (priceRange === '500-1000') {
            return price > 500 && price <= 1000;
          } else if (priceRange === '1000-1500') {
            return price > 1000 && price <= 1500;
          } else if (priceRange === '1500-2000') {
            return price > 1500 && price <= 2000;
          } else if (priceRange === '2000+') {
            return price > 2000;
          }
          return true;
        });
      }

      setFilteredCards(filtered);
      setDisplayedCards(filtered.slice(0, cardsPerPage));
      setApplyingFilter(false);
    };

    if (cards.length > 0) {
      applyFilters();
    }
  }, [cards, invitationType, language, priceRange]);

  const handleToggleWishlist = async (e, card) => {
    e.preventDefault();
    e.stopPropagation();

    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/login');
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, [card.id]: true }));
      await dispatch(toggleWishlist(card));
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [card.id]: false }));
    }
  };

  const handleLoadMore = () => {
    const currentlyDisplayed = displayedCards.length;
    const nextBatch = filteredCards.slice(currentlyDisplayed, currentlyDisplayed + cardsPerPage);
    setDisplayedCards(prev => [...prev, ...nextBatch]);
  };

  const clearFilters = () => {
    setInvitationType('');
    setLanguage('');
    setPriceRange('');
  };

  if (loading && !displayedCards.length) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white mt-14 md:mt-0 px-0">

      <div className={`w-full overflow-hidden ${banners.length === 0 ? 'md:mt-16' : 'mt-0'}`}>
  {banners.length > 0 && (
    <div className="flex animate-marquee space-x-4">
      {banners.map((banner, index) => (
        <img
          key={index}
          src={`${baseUrl}/${banner}`}
          alt={`Banner ${index + 1}`}
          className="w-full h-full md:h-full object-contain md:object-cover"
        />
      ))}
    </div>
  )}
</div>
      <div className="mx-auto py-6">
        <h2 className="text-xl font-semibold text-gray-800 lg:text-3xl text-center mb-6">
          {subcategoryName.replace(/-/g, ' ')}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with Filters */}
          <div className="w-full md:w-64 bg-white p-4 rounded-lg h-fit">
            <h3 className="font-poppins text-lg font-semibold mb-4 text-blue-700">Filter Options</h3>
            
            {/* Mobile Filter Dropdown */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                className="w-full border-2 border-blue-700 bg-white text-gray-700 py-2 px-4 rounded-lg flex justify-between items-center"
              >
                Filter Options
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${isFilterDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isFilterDropdownOpen && (
                <div className="mt-2 space-y-4 bg-white shadow-lg rounded-lg p-4">
                  {/* Card Style Filter */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-gray-700">Card Style</h4>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="mobileStyle"
                          value="caricature"
                          checked={invitationType === 'caricature'}
                          onChange={(e) => setInvitationType(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">With Caricature</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="mobileStyle"
                          value="basic"
                          checked={invitationType === 'basic'}
                          onChange={(e) => setInvitationType(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Without Caricature</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="mobileStyle"
                          value=""
                          checked={invitationType === ''}
                          onChange={(e) => setInvitationType(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">All Styles</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Language Filter */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-gray-700">Language</h4>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Languages</option>
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="bengali">Bengali</option>
                      <option value="kannada">Kannada</option>
                      <option value="marathi">Marathi</option>
                      <option value="gujarathi">Gujarati</option>
                      <option value="odia">Odia</option>
                      <option value="malayalam">Malayalam</option>
                      <option value="teleugu">Telugu</option>
                      <option value="tamil">Tamil</option>
                    </select>
                  </div>
                  
                  {/* Price Filter */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 text-gray-700">Price Range</h4>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">All Prices</option>
                      <option value="0-500">Under ₹500</option>
                      <option value="500-1000">₹500 - ₹1000</option>
                      <option value="1000-1500">₹1000 - ₹1500</option>
                      <option value="1500-2000">₹1500 - ₹2000</option>
                      <option value="2000+">Above ₹2000</option>
                    </select>
                  </div>
                  
                  {/* Clear Filters Button */}
                  <button
                    onClick={clearFilters}
                    className="w-full py-2 bg-red-100 text-red-600 font-medium rounded-md hover:bg-red-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
            
            {/* Desktop Filters */}
            <div className="hidden md:block space-y-6">
              {/* Card Style Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-blue-700 border-b pb-2">Card Style</h4>
                <div className="space-y-3 font-poppins">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="style"
                      value="caricature"
                      checked={invitationType === 'caricature'}
                      onChange={(e) => setInvitationType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">With Caricature</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="style"
                      value="basic"
                      checked={invitationType === 'basic'}
                      onChange={(e) => setInvitationType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Without Caricature</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="style"
                      value=""
                      checked={invitationType === ''}
                      onChange={(e) => setInvitationType(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">All Styles</span>
                  </label>
                </div>
              </div>
              
              {/* Language Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-blue-700 border-b pb-2">Language</h4>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Languages</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="bengali">Bengali</option>
                  <option value="kannada">Kannada</option>
                  <option value="marathi">Marathi</option>
                  <option value="gujarathi">Gujarati</option>
                  <option value="odia">Odia</option>
                  <option value="malayalam">Malayalam</option>
                  <option value="teleugu">Telugu</option>
                  <option value="tamil">Tamil</option>
                </select>
              </div>
              
              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-blue-700 border-b pb-2">Price Range</h4>
                <div className="space-y-3 font-poppins">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value=""
                      checked={priceRange === ''}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">All Prices</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="0-500"
                      checked={priceRange === '0-500'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Under ₹500</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="500-1000"
                      checked={priceRange === '500-1000'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">₹500 - ₹1000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="1000-1500"
                      checked={priceRange === '1000-1500'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">₹1000 - ₹1500</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="1500-2000"
                      checked={priceRange === '1500-2000'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">₹1500 - ₹2000</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="2000+"
                      checked={priceRange === '2000+'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Above ₹2000</span>
                  </label>
                </div>
              </div>

              {/* Filter Stats */}
              <div className="mb-3 text-sm">
                <p className="text-blue-700">
                  Showing {displayedCards.length} of {filteredCards.length} products
                </p>
              </div>
              
              {/* Clear Filters Button */}
              <button
                onClick={clearFilters}
                className="w-full py-2 bg-red-100 text-red-600 font-medium rounded-md hover:bg-red-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Content Area with Cards */}
          <div className="flex-1">
            {applyingFilter ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-2">Applying filters...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
                  {displayedCards.map((card) => (
                    <Link
                      to={`/single-cart?id=${card.id}/${card.url_name ? card.url_name.replace(/\s+/g, '-') : ''}`}
                      key={card.id}
                      className="rounded-lg p-3 px-4 bg-white mx-auto group border-2 border-yellow-200"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="relative">
                        <div className="relative">
                          <img
                            src={card.card_thumbnail
                              ? `${baseUrl}/${card.card_thumbnail}`
                              : 'https://via.placeholder.com/150?text=No+Thumbnail'}
                            alt={card.title || 'Card'}
                            className="w-[380px] h-[420px] md:h-[500px] rounded-lg object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* <PlayCircle className="w-12 h-12 text-white" /> */}
                          </div>
                        </div>
                        <div className="absolute top-1 left-1 bg-[#4A00FF] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {card.price && card.offer_dis ? Math.round((1 - card.offer_dis / card.price) * 100) : 0}% OFF
                        </div>
                        <div
                          className="absolute top-2 right-2 z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                          onClick={(e) => e.preventDefault()}
                        >
                          {loadingStates[card.id] ? (
                            <Loader className="w-5 h-5 text-red-500 animate-spin" />
                          ) : (
                            <Heart
                              className={`w-5 h-5 cursor-pointer transition-colors duration-300 ${
                                favoriteItems.some((item) => item.id === card.id)
                                  ? 'text-red-500 fill-current'
                                  : 'text-red-600'
                              }`}
                              onClick={(e) => handleToggleWishlist(e, card)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h3 className="font-poppins text-base text-gray-800 line-clamp-2">{card.title}</h3>
                        <p className="text-xs text-blue-500 truncate">Code: {card.code}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex flex-col items-center mb-0 mt-2">
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

                          <Link
                            to={`/single-cart?id=${card.id}/${card.url_name ? card.url_name.replace(/\s+/g, '-') : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.scrollTo(0, 0);
                            }}
                          >
                            <img
                              src={moreinfo}
                              alt="More Info"
                              className="cursor-pointer transition-opacity duration-300"
                              style={{ maxWidth: '100px', maxHeight: '120px' }}
                            />
                          </Link>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Empty State */}
                {filteredCards.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <p className="text-xl text-gray-600 mb-4">No cards found matching your filters</p>
                    <button
                      onClick={clearFilters}
                      className="bg-blue-500 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {/* Load More Button */}
                {displayedCards.length < filteredCards.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleLoadMore}
                      className="bg-[#4A00FF] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#3700CC] transition-colors"
                    >
                      Load More ({filteredCards.length - displayedCards.length} more)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mb-6 mt-6 px-4 sm:px-8 lg:px-16">
          <p
            className="text-sm sm:text-base lg:text-lg text-gray-600 font-poppins font-regular leading-relaxed tracking-wide"
            dangerouslySetInnerHTML={{ __html: subDesc }}
          />
        </div>
      </div>
    </div>
  );
};

export default SubcategoryPage;