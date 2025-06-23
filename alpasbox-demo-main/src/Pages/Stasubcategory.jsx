import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Heart, Loader, Filter, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../rtk/wishlistSlice';
import moreinfo from '../assets/MainCata/more-info.png';

const Stasubcategory = () => {
  const { subcategory_id, subcategoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory_id);
  const [currentSubcategoryName, setCurrentSubcategoryName] = useState(subcategoryName);
  const [currentSubBanner, setCurrentSubBanner] = useState('');
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [expandedSubcategory, setExpandedSubcategory] = useState(null); // Track expanded subcategory
  const [selectedChildSubcategory, setSelectedChildSubcategory] = useState(null); // Track selected child subcategory
  const [showMobileFilter, setShowMobileFilter] = useState(false); // State to control mobile filter sidebar
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist.items) || [];
  const baseUrl = 'https://admin.urbantyohar.com';

  const subDesc = location.state?.sub_desc || '';

  useEffect(() => {
    // Decode the banner URL if it exists
    if (currentSubBanner) {
      try {
        const decodedBanner = JSON.parse(currentSubBanner)[0];
        setCurrentSubBanner(decodedBanner);
      } catch (error) {
        console.error("Error decoding banner URL:", error);
      }
    }
  }, [currentSubBanner]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data with ID:", subcategory_id);

        // Fetch subcategories using the new API
        const response = await axios.post(`${baseUrl}/api/stationary?category_id=${subcategory_id}`);
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          const fetchedSubcategories = response.data.data;
          setSubcategories(fetchedSubcategories);

          // Auto-select the first subcategory if available
          if (fetchedSubcategories.length > 0) {
            const firstSubcategory = fetchedSubcategories[0];
            setSelectedSubcategory(firstSubcategory.id.toString());
            setCurrentSubcategoryName(firstSubcategory.subcategory_name);
            setCurrentSubBanner(firstSubcategory.banner || '');
            setExpandedSubcategory(firstSubcategory.id); // Automatically expand the first subcategory

            // Auto-select the first child subcategory if available
            const firstChildSubcategory = firstSubcategory.childsubcats[0];
            if (firstChildSubcategory && Array.isArray(firstChildSubcategory.products)) {
              setSelectedChildSubcategory(firstChildSubcategory.id); // Select the first child subcategory
              setProducts(firstChildSubcategory.products);
              setDisplayedProducts(firstChildSubcategory.products.slice(0, 6));
            } else {
              setProducts([]);
              setDisplayedProducts([]);
            }
          } else {
            setError('No subcategories found for this category');
          }
        } else {
          setError('Failed to load subcategories');
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Also fetch wishlist items
    dispatch(fetchWishlist());
  }, [subcategory_id, subcategoryName, dispatch]);

  const handleChildSubcategoryChange = (childSubcat) => {
    if (childSubcat.products && Array.isArray(childSubcat.products)) {
      setSelectedChildSubcategory(childSubcat.id); // Update selected child subcategory
      setProducts(childSubcat.products);
      setDisplayedProducts(childSubcat.products.slice(0, 6));
      
      // Close mobile filter after selection
      if (window.innerWidth < 768) {
        setShowMobileFilter(false);
      }
    } else {
      setProducts([]);
      setDisplayedProducts([]);
    }
  };

  const handleToggleWishlist = async (product) => {
    const userToken = localStorage.getItem('user_token');
    if (!userToken) {
      navigate('/login');
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [product.id]: true }));
    await dispatch(toggleWishlist(product));
    setLoadingStates((prev) => ({ ...prev, [product.id]: false }));
  };

  const handleLoadMore = () => {
    const currentLength = displayedProducts.length;
    const nextProducts = products.slice(currentLength, currentLength + 6);
    setDisplayedProducts((prev) => [...prev, ...nextProducts]);
  };

  const toggleSubcategory = (subcatId) => {
    // Toggle the expanded subcategory, collapsing others
    setExpandedSubcategory((prev) => (prev === subcatId ? null : subcatId));
  };

  // Toggle mobile filter sidebar
  const toggleMobileFilter = () => {
    setShowMobileFilter(!showMobileFilter);
  };

  // Get selected child subcategory name
  const getSelectedChildSubcatName = () => {
    for (const subcat of subcategories) {
      for (const childSubcat of subcat.childsubcats) {
        if (childSubcat.id === selectedChildSubcategory) {
          return childSubcat.childsubcat_name;
        }
      }
    }
    return null;
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white min-h-screen px-0 pt-16 md:pt-0">
      {/* Subcategory Banner */}
      {currentSubBanner && ( 
        <div className="w-full overflow-hidden mb-6">
          <img
            src={`${baseUrl}/${currentSubBanner}`}
            alt="Subcategory Banner"
            className="w-full h-auto object-contain md:object-cover"
          />
        </div>
      )}
      <div className="container mx-auto py-6">
        <h2 className=" font-poppins text-xl font-semibold text-gray-800 lg:text-3xl text-center mb-6">
          {currentSubcategoryName?.replace(/-/g, ' ')}
        </h2>
        
        {/* Mobile Filter Button - Only visible on mobile */}
        <div className="md:hidden flex justify-between items-center px-4 mb-4">
          <button 
            onClick={toggleMobileFilter}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
          >
            <Filter size={18} />
            <span className='font-poppins'>Filter</span>
          </button>
          
          {selectedChildSubcategory && (
            <span className=" font-poppinstext-sm font-medium text-gray-700">
              Showing: {getSelectedChildSubcatName()}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Sidebar Overlay */}
          {showMobileFilter && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
              onClick={toggleMobileFilter}
            ></div>
          )}
          
          {/* Sidebar with Subcategory and Child Subcategory filters */}
          <div 
            className={`
              ${showMobileFilter ? 'fixed left-0 top-0 h-full z-50 shadow-xl overflow-y-auto' : 'hidden'} 
              md:block w-full md:w-64 bg-white p-4 rounded-lg h-fit
            `}
            style={{ width: showMobileFilter ? '75%' : 'auto' }}
          >
            {/* Mobile header with close button */}
            {showMobileFilter && (
              <div className="flex justify-between items-center mb-4 md:hidden">
                <h3 className="font-poppins text-lg font-semibold">Filters</h3>
                <button 
                  onClick={toggleMobileFilter} 
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
            )}
            
            <h3 className="font-poppins text-lg font-semibold mb-4">Quick Search By Type</h3>

            {/* Subcategory Accordion */}
            <div className="space-y-4">
              <ul className="space-y-2 font-poppins">
                {subcategories.map((subcat) => (
                  <li key={subcat.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className={`cursor-pointer hover:text-blue-600 ${
                          selectedSubcategory === subcat.id.toString() ? 'text-blue-600 font-medium' : ''
                        }`}
                        onClick={() => {
                          setSelectedSubcategory(subcat.id.toString());
                          setCurrentSubcategoryName(subcat.subcategory_name);
                          toggleSubcategory(subcat.id);
                        }}
                      >
                        {subcat.subcategory_name}
                      </span>
                      <button
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => toggleSubcategory(subcat.id)}
                      >
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSubcategory === subcat.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    {expandedSubcategory === subcat.id && (
                      <ul className="ml-6 space-y-2 border-white pl-4">
                        {subcat.childsubcats.map((childSubcat) => (
                          <li key={childSubcat.id} className="flex items-center">
                            <input
                              type="radio"
                              id={`childsubcat-${childSubcat.id}`}
                              name="childsubcat"
                              className="mr-2 cursor-pointer accent-blue-600"
                              checked={selectedChildSubcategory === childSubcat.id}
                              onChange={() => handleChildSubcategoryChange(childSubcat)}
                            />
                            <label
                              htmlFor={`childsubcat-${childSubcat.id}`}
                              className="cursor-pointer text-gray-800 hover:text-blue-600"
                            >
                              {childSubcat.childsubcat_name}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Apply Filters Button - Mobile Only */}
            {showMobileFilter && (
              <div className="mt-6 md:hidden">
                <button 
                  onClick={toggleMobileFilter}
                  className="w-full bg-blue-600 text-white py-2 rounded-md font-medium"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {displayedProducts.length === 0 && (
              <div className="flex justify-center items-center py-12 text-gray-600">
                No products found for this subcategory
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
  {displayedProducts.map((product) => (
    <div
      key={product.id}
      className="rounded-lg p-3 px-4 bg-white mx-auto group border-2 border-yellow-200 hover:shadow-lg transition-shadow duration-300"
    >
      <Link
        to={`/stationary?id=${product.id}/${product.url_name ? product.url_name.replace(/\s+/g, '-') : ''}`}
        onClick={() => window.scrollTo(0, 0)}
      >
        <div className="relative overflow-hidden rounded-lg">
          <div className="transition-transform duration-500 ease-out transform hover:scale-110 h-[420px]">
            <img
              src={product.card_thumbnail
                ? `${baseUrl}/${product.card_thumbnail}`
                : 'https://via.placeholder.com/150?text=No+Thumbnail'}
              alt={product.title}
              className="w-full h-full rounded-lg object-cover"
            />
          </div>
          <div className="absolute top-1 left-1 bg-[#4A00FF] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {Math.round((1 - product.offer_dis / parseFloat(product.price)) * 100)}% OFF
          </div>
          <div className="absolute top-2 right-2 z-40 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
            {loadingStates[product.id] ? (
              <Loader className="w-5 h-5 text-red-500 animate-spin" />
            ) : (
              <Heart
                className={`w-5 h-5 cursor-pointer transition-colors duration-300 ${
                  favoriteItems.some((item) => item.id === product.id)
                    ? 'text-red-500 fill-current'
                    : 'text-red-600'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleToggleWishlist(product);
                }}
              />
            )}
          </div>
        </div>
      </Link>
      <div className="mt-2">
        <h3 className="font-poppins text-base text-gray-800 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-xs text-blue-500 truncate">Code: {product.code}</p>
        <div className="flex items-center justify-between mt-1">
          <div>
            <p className="text-lg font-bold">₹{product.offer_dis}</p>
            <p className="text-xs text-gray-500">
              Cost ₹<span className="line-through">{product.price}</span>
            </p>
          </div>
          <Link
            to={`/stationary?id=${product.id}/${product.url_name ? product.url_name.replace(/\s+/g, '-') : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              window.scrollTo(0, 0);
            }}
          >
            <img
              src={moreinfo}
              alt="More Info"
              className="cursor-pointer transition-opacity duration-300 hover:opacity-80"
              style={{ maxWidth: '100px', maxHeight: '80px' }}
            />
          </Link>
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          {product.product_type && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-poppins">
              {product.product_type}
            </span>
          )}
          {product.tag && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full font-poppins">
              {product.tag}
            </span>
          )}
        </div>
      </div>
    </div>
  ))}
</div>

            {/* Load More Button */}
            {displayedProducts.length < products.length && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleLoadMore}
                  className="bg-[#4A00FF] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#3700CC] transition-colors"
                >
                  Load More
                </button>
              </div>
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

export default Stasubcategory;