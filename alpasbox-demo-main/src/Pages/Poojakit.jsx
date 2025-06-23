import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { Heart, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, toggleWishlist } from '../rtk/wishlistSlice';
import moreinfo from '../assets/MainCata/more-info.png';

const Stasubcategory = () => {
  const { subcategory_id, subcategoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory_id);
  const [currentSubcategoryName, setCurrentSubcategoryName] = useState(subcategoryName);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubcategoryDropdownOpen, setIsSubcategoryDropdownOpen] = useState(false);
  const [dataInitialized, setDataInitialized] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [expandedCategory, setExpandedCategory] = useState(null);
  const dispatch = useDispatch();
  const favoriteItems = useSelector((state) => state.wishlist.items) || [];
  const baseUrl = 'https://admin.urbantyohar.com';

  const subDesc = location.state?.sub_desc || '';

  // Fetch all necessary data and determine if we're dealing with a category or subcategory ID
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        console.log("Fetching data with ID:", subcategory_id);
        
        // Always fetch categories first
        const catResponse = await axios.post(`${baseUrl}/api/all-category?maincat_id=4`);
        if (!catResponse.data || !Array.isArray(catResponse.data.data)) {
          setError('Invalid categories data');
          setLoading(false);
          return;
        }

        const fetchedCategories = catResponse.data.data;
        setCategories(fetchedCategories);
        
        // Check if the ID from URL matches any category ID
        const matchingCategory = fetchedCategories.find(cat => cat.id.toString() === subcategory_id);
        
        if (matchingCategory) {
          // Case 1: URL ID is a category ID
          console.log("Found matching category:", matchingCategory.category_name);
          setSelectedCategory(matchingCategory.id);
          
          // Fetch subcategories for this category
          const subResponse = await axios.post(`${baseUrl}/api/subcategory?category_id=${matchingCategory.id}`);
          if (subResponse.data && Array.isArray(subResponse.data.data)) {
            const fetchedSubcategories = subResponse.data.data;
            setSubcategories(fetchedSubcategories);
            
            // Auto-select first subcategory if available
            if (fetchedSubcategories.length > 0) {
              const firstSubcat = fetchedSubcategories[0];
              setSelectedSubcategory(firstSubcat.id.toString());
              setCurrentSubcategoryName(firstSubcat.subcategory_name);
              
              // Fetch products for the first subcategory
              await fetchProductsForSubcategory(firstSubcat.id);
            } else {
              setError('No subcategories found for this category');
            }
          } else {
            setError('Failed to load subcategories');
          }
        } else {
          // Case 2: URL ID is likely a subcategory ID
          // Try to find which category this subcategory belongs to
          let found = false;
          
          for (const category of fetchedCategories) {
            const subResponse = await axios.post(`${baseUrl}/api/subcategory?category_id=${category.id}`);
            if (!subResponse.data || !Array.isArray(subResponse.data.data)) continue;
            
            const subcats = subResponse.data.data;
            const matchingSubcat = subcats.find(sub => sub.id.toString() === subcategory_id);
            
            if (matchingSubcat) {
              // Found the category this subcategory belongs to
              console.log("Found matching subcategory in category:", category.category_name);
              setSelectedCategory(category.id);
              setSubcategories(subcats);
              setSelectedSubcategory(subcategory_id);
              setCurrentSubcategoryName(subcategoryName || matchingSubcat.subcategory_name);
              
              // Fetch products for this subcategory
              await fetchProductsForSubcategory(subcategory_id);
              found = true;
              break;
            }
          }
          
          // If still not found, select first category as fallback
          if (!found) {
            console.log("No match found, defaulting to first category");
            const firstCategory = fetchedCategories[0];
            setSelectedCategory(firstCategory.id);
            
            const subResponse = await axios.post(`${baseUrl}/api/subcategory?category_id=${firstCategory.id}`);
            if (subResponse.data && Array.isArray(subResponse.data.data) && subResponse.data.data.length > 0) {
              const fetchedSubcategories = subResponse.data.data;
              setSubcategories(fetchedSubcategories);
              
              const firstSubcat = fetchedSubcategories[0];
              setSelectedSubcategory(firstSubcat.id.toString());
              setCurrentSubcategoryName(firstSubcat.subcategory_name);
              
              await fetchProductsForSubcategory(firstSubcat.id);
            } else {
              setError('No subcategories found');
            }
          }
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
        setDataInitialized(true);
      }
    };

    fetchInitialData();
    
    // Also fetch wishlist items
    dispatch(fetchWishlist());
  }, [subcategory_id, subcategoryName]);

  // Function to fetch products for a subcategory
  const fetchProductsForSubcategory = async (subcategoryId) => {
    try {
      setLoading(true);
      console.log("Fetching products for subcategory:", subcategoryId);
      const response = await axios.post(
        `${baseUrl}/api/all-products?subcategory_id=${subcategoryId}`
      );
      if (response.data && Array.isArray(response.data.data)) {
        const fetchedProducts = response.data.data;
        setProducts(fetchedProducts);
        setDisplayedProducts(fetchedProducts.slice(0, 6));
      } else {
        console.warn("Invalid product data format", response.data);
        setProducts([]);
        setDisplayedProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(
        err.response
          ? `Server error: ${err.response.status}`
          : 'Network error - please check your connection'
      );
      setProducts([]);
      setDisplayedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch subcategories for a category
  const fetchSubcategoriesForCategory = async (categoryId) => {
    try {
      console.log("Fetching subcategories for category:", categoryId);
      const response = await axios.post(`${baseUrl}/api/subcategory?category_id=${categoryId}`);
      if (response.data && Array.isArray(response.data.data)) {
        const fetchedSubcategories = response.data.data;
        setSubcategories(fetchedSubcategories);
        
        if (fetchedSubcategories.length > 0) {
          const firstSubcat = fetchedSubcategories[0];
          setSelectedSubcategory(firstSubcat.id.toString());
          setCurrentSubcategoryName(firstSubcat.subcategory_name);
          fetchProductsForSubcategory(firstSubcat.id);
        } else {
          setError('No subcategories found for this category');
          setProducts([]);
          setDisplayedProducts([]);
        }
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setError('Failed to load subcategories');
      setSubcategories([]);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.id);
    fetchSubcategoriesForCategory(category.id);
    setIsCategoryDropdownOpen(false);
  };

  const handleSubcategoryChange = (subcat) => {
    setSelectedSubcategory(subcat.id.toString());
    setCurrentSubcategoryName(subcat.subcategory_name);
    fetchProductsForSubcategory(subcat.id);
    setIsSubcategoryDropdownOpen(false);
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
    setDisplayedProducts(prev => [...prev, ...nextProducts]);
  };

  if (loading && !dataInitialized) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error && !dataInitialized) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>;
  }

  // Get current category name from ID
  const currentCategoryName = categories.find(cat => cat.id === selectedCategory)?.category_name || '';

  return (
    <div className="bg-white min-h-screen px-8 sm:px-2 pt-16 ">
      <div className="container mx-auto py-6">
        <h2 className="text-xl font-semibold text-gray-800 lg:text-3xl text-center mb-6">
          {currentSubcategoryName?.replace(/-/g, ' ')}
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar with Category and Subcategory filters */}
          <div className="w-full md:w-64 bg-white p-4 rounded-lg h-fit">
  <h3 className="font-poppins text-lg font-semibold mb-4">Quick Search By Type</h3>

  {/* Mobile Dropdown */}
  <div className="md:hidden space-y-4">
    <div>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full border-2 border-blue-700 bg-white text-gray-700 py-2 px-4 rounded-lg flex justify-between items-center"
      >
        {selectedSubcategory ? `${currentCategoryName} › ${currentSubcategoryName}` : currentCategoryName || 'Select Category'}
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isDropdownOpen && (
        <ul className="mt-2 space-y-2 font-poppins bg-white rounded-lg p-4">
          {categories.map((cat) => (
            <li key={cat.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span 
                  className={`cursor-pointer hover:text-blue-600 ${selectedCategory === cat.id ? 'text-blue-600 font-medium' : ''}`}
                  onClick={() => {
                    handleCategoryChange(cat);
                    setExpandedCategory(selectedCategory === cat.id ? null : cat.id);
                  }}
                >
                  {cat.category_name}
                </span>
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                >
                  <svg
                    className={`w-5 h-5 transform transition-transform ${expandedCategory === cat.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {(expandedCategory === cat.id || selectedCategory === cat.id) && (
                <ul className="ml-6 space-y-2  border-white pl-4">
                  {subcategories.filter(sc => sc.category_id === cat.id).map((subcat) => (
                    <li key={subcat.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`subcat-mobile-${subcat.id}`}
                        name="subcategory-mobile"
                        checked={selectedSubcategory === subcat.id.toString()}
                        onChange={() => handleSubcategoryChange(subcat)}
                        className="mr-2 cursor-pointer accent-blue-600"
                      />
                      <label
                        htmlFor={`subcat-mobile-${subcat.id}`}
                        className={`cursor-pointer text-gray-800 ${selectedSubcategory === subcat.id.toString() ? 'font-medium' : ''}`}
                      >
                        {subcat.subcategory_name}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>

  {/* Desktop Accordion */}
  <div className="hidden md:block space-y-4">
    <h4 className="font-poppins text-base font-medium">Categories</h4>
    <ul className="space-y-2 font-poppins">
      {categories.map((cat) => (
        <li key={cat.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <span 
              className={`cursor-pointer hover:text-blue-600 ${selectedCategory === cat.id ? 'text-blue-600 font-medium' : ''}`}
              onClick={() => {
                handleCategoryChange(cat);
                setExpandedCategory(selectedCategory === cat.id ? null : cat.id);
              }}
            >
              {cat.category_name}
            </span>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${expandedCategory === cat.id ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {(expandedCategory === cat.id || selectedCategory === cat.id) && (
            <ul className="ml-6 space-y-2  border-white pl-4">
              {subcategories.filter(sc => sc.category_id === cat.id).map((subcat) => (
                <li key={subcat.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`subcat-${subcat.id}`}
                    name="subcategory"
                    checked={selectedSubcategory === subcat.id.toString()}
                    onChange={() => handleSubcategoryChange(subcat)}
                    className="mr-2 cursor-pointer accent-blue-600"
                  />
                  <label
                    htmlFor={`subcat-${subcat.id}`}
                    className={`cursor-pointer text-gray-800 ${selectedSubcategory === subcat.id.toString() ? 'font-medium' : ''}`}
                  >
                    {subcat.subcategory_name}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </div>
</div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading && dataInitialized && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {!loading && displayedProducts.length === 0 && (
              <div className="flex justify-center items-center py-12 text-gray-600">
                No products found for this subcategory
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg p-3 px-4 bg-white mx-auto group border-2 border-yellow-200"
                >
                  <Link
                    to={`/stationary?id=${product.id}/${product.url_name ? product.url_name.replace(/\s+/g, '-') : ''}`}
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <div className="relative">
                      <div className="relative">
                        <img
                          src={product.card_thumbnail
                            ? `${baseUrl}/${product.card_thumbnail}`
                            : 'https://via.placeholder.com/150?text=No+Thumbnail'}
                          alt={product.title}
                          className="w-full h-[380px] rounded-lg object-cover"
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
                    <div className="flex items-center gap-2">
  <p className="text-lg font-bold">₹{product.offer_dis}</p>
  <span className="text-xs text-gray-500">
    Cost ₹<span className="line-through">{product.price}</span>
  </span>
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
                          className="cursor-pointer transition-opacity duration-300"
                          style={{ maxWidth: '120px', maxHeight: '120px' }}
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